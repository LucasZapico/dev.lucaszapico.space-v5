#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Hash-based audio generator for builds + case studies.
//
//   pnpm audio          — regenerate audio for any entry whose narration text
//                         has changed since the manifest was last written.
//   pnpm audio --all    — regenerate everything regardless of manifest state.
//   pnpm audio --check  — dry-run; exits 1 if any entry is stale. Used by the
//                         pre-push hook to block pushes with drifted audio.
//
// Single source of truth: app/lib/builds.ts and app/lib/case-studies.ts.
// No narration text duplicated in this script — text is computed from the
// same data the site renders.
// ---------------------------------------------------------------------------

import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

try { process.loadEnvFile(join(ROOT, ".env")); } catch {}

const KOKORO = process.env.KOKORO_URL ?? "http://localhost:8880";
const VOICE = process.env.KOKORO_VOICE ?? "af_sky";
const MANIFEST_PATH = join(ROOT, "public/audio/manifest.json");

const args = new Set(process.argv.slice(2));
const FORCE = args.has("--all");
const CHECK_ONLY = args.has("--check");

// ---------------------------------------------------------------------------
// Import data from app/lib via tsx loader (registered when this runs through
// `tsx scripts/gen-audio.mjs`).
// ---------------------------------------------------------------------------
const buildsModule = await import(pathToFileURL(join(ROOT, "app/lib/builds.ts")).href);
const caseStudiesModule = await import(pathToFileURL(join(ROOT, "app/lib/case-studies.ts")).href);
const { builds, buildOrder } = buildsModule;
const { caseStudies, caseStudyOrder } = caseStudiesModule;

// ---------------------------------------------------------------------------
// Narration helpers
// ---------------------------------------------------------------------------
function strip(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "and")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&mdash;/g, ",")
    .replace(/&ndash;/g, "to")
    .replace(/&nbsp;/g, " ")
    .replace(/→/g, "to")
    .replace(/—/g, ",")
    .replace(/\s+/g, " ")
    .trim();
}

function narrateBuild(b) {
  const lines = [`${b.title}. ${b.tagline}.`, "", strip(b.problem), "", strip(b.overview)];
  if (b.highlights?.length) {
    lines.push("", "What's interesting.");
    for (const h of b.highlights) {
      lines.push("", `${h.title}. ${strip(h.body)}`);
    }
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function narrateCaseStudy(c) {
  const lines = [`${c.title}.`, `${c.impact}.`, "", strip(c.overview)];
  for (const s of c.sections) {
    lines.push("", `${s.heading}.`);
    for (const block of s.blocks) {
      if (block.type === "text") {
        lines.push("", strip(block.html));
      } else if (block.type === "list") {
        for (const item of block.items) lines.push("", strip(item));
      }
    }
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
}

// ---------------------------------------------------------------------------
// Build the list of entries to consider
// ---------------------------------------------------------------------------
const entries = [
  ...buildOrder.map((slug) => ({
    key: `build:${slug}`,
    out: join(ROOT, `public/audio/builds/${slug}.mp3`),
    text: narrateBuild(builds[slug]),
  })),
  ...caseStudyOrder.map((slug) => ({
    key: `case:${slug}`,
    out: join(ROOT, `public/audio/work/${slug}.mp3`),
    text: narrateCaseStudy(caseStudies[slug]),
  })),
];

// ---------------------------------------------------------------------------
// Compare against manifest, regenerate stale entries
// ---------------------------------------------------------------------------
let manifest = {};
if (existsSync(MANIFEST_PATH)) {
  manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
}

const stale = [];
for (const e of entries) {
  const h = hash(e.text);
  const fileExists = existsSync(e.out);
  if (FORCE || manifest[e.key] !== h || !fileExists) {
    stale.push({ ...e, hash: h, reason: !fileExists ? "missing" : manifest[e.key] !== h ? "drift" : "force" });
  }
}

if (CHECK_ONLY) {
  if (stale.length === 0) {
    console.log("Audio is up to date.");
    process.exit(0);
  }
  console.error(`Audio is stale for ${stale.length} ${stale.length === 1 ? "entry" : "entries"}:`);
  for (const s of stale) console.error(`  - ${s.key} (${s.reason})`);
  console.error("\nRun `pnpm audio` to regenerate, then commit public/audio/.");
  process.exit(1);
}

if (stale.length === 0) {
  console.log("Nothing to regenerate.");
  process.exit(0);
}

console.log(`Kokoro: ${KOKORO}`);
console.log(`Voice: ${VOICE}`);
console.log(`Regenerating ${stale.length} ${stale.length === 1 ? "entry" : "entries"}…\n`);

// Supports two Kokoro API shapes:
//   /v1/audio/speech  — OpenAI-compatible, returns MP3 directly
//   /tts              — zacksock/kokoro container, returns WAV
// Detects which is available and uses it.
async function fetchTTS(text) {
  const res = await fetch(`${KOKORO}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, en_voice: VOICE }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Kokoro TTS failed (${res.status}): ${body.slice(0, 200)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

// Converts WAV from /tts to MP3 and adds Xing header so browsers report
// correct duration (without it, audio.duration is Infinity until fully scanned).
// ffmpeg needs a seekable output target for the Xing header so we write to a
// temp file rather than piping stdout.
async function addXingHeader(wavBuffer) {
  const tmpOut = join(tmpdir(), `gen-audio-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.mp3`);
  try {
    await new Promise((resolve, reject) => {
      const ff = spawn("ffmpeg", [
        "-hide_banner", "-loglevel", "error", "-y",
        "-i", "pipe:0",
        "-codec:a", "libmp3lame",
        "-qscale:a", "4",
        "-write_xing", "1",
        tmpOut,
      ]);
      let stderr = "";
      ff.stderr.on("data", (c) => { stderr += c.toString(); });
      ff.on("error", reject);
      ff.on("close", (code) => {
        if (code !== 0) reject(new Error(`ffmpeg exit ${code}: ${stderr.slice(0, 200)}`));
        else resolve();
      });
      ff.stdin.end(wavBuffer);
    });
    return await readFile(tmpOut);
  } finally {
    await unlink(tmpOut).catch(() => {});
  }
}

for (const s of stale) {
  const words = s.text.split(/\s+/).length;
  process.stdout.write(`  ${s.key.padEnd(40)} ${words} words … `);
  try {
    const raw = await fetchTTS(s.text);
    const mp3 = await addXingHeader(raw);
    await mkdir(dirname(s.out), { recursive: true });
    await writeFile(s.out, mp3);
    manifest[s.key] = s.hash;
    console.log(`${(mp3.length / 1024).toFixed(0)}KB ✓`);
  } catch (err) {
    console.log("FAILED");
    console.error(`    ${err.message}`);
    process.exit(2);
  }
}

await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nManifest written: ${MANIFEST_PATH}`);
