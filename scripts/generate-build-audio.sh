#!/usr/bin/env bash
# Run this ON MILOTRON: bash /tmp/generate-build-audio.sh
# Then scp /tmp/builds-audio/*.mp3 back to public/audio/builds/

set -euo pipefail

KOKORO="http://localhost:8880/tts"
VOICE="af_sky"
OUT="/tmp/builds-audio"
mkdir -p "$OUT"

tts() {
  local slug="$1"
  local text="$2"
  echo "Generating: $slug"
  curl -s "$KOKORO" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg t "$text" --arg v "$VOICE" '{text: $t, voice: $v}')" \
    -o "$OUT/$slug.wav"
  ffmpeg -y -i "$OUT/$slug.wav" -codec:a libmp3lame -qscale:a 4 "$OUT/$slug.mp3" 2>/dev/null
  rm "$OUT/$slug.wav"
  echo "  done: $(du -h "$OUT/$slug.mp3" | cut -f1)"
}

tts "spotter" "Spotter. A background code review daemon with multi-model consensus.

Different models have different strengths and different blind spots. Claude is strong on architecture and reasoning but would sometimes roll over function-level bugs and missed optimisations, particularly in file-by-file review. We built Spotter to bring open code models into the loop as a dedicated audit layer, reviewing file by file and catching what Claude missed. The goal was to shift the human reviewer to a true final pass. Instead of doing full review from scratch, you are resolving flagged issues that have already been surfaced and cross-validated. The you should have caught this category of bugs mostly disappears before the review even starts.

Spotter watches file changes and routes diffs to multiple LLMs in parallel. Ollama, OpenWebUI, Claude Code, or any OpenAI-compatible endpoint. It cross-validates findings before surfacing them. The goal was a zero-interruption review loop that runs while you work, not after you push."

tts "mailautumn" "Mailautumn. A complete frontend rewrite of Mailspring with threaded conversations, AI integration, and a built-in CRM.

Moving from Mac to Linux meant losing Spark. There was no email client on Linux with the same level of polish or feature set. That was the starting point. But the deeper problem is that a standard email inbox treats every type of email the same way. Conversations with colleagues sit next to newsletters, receipts, automated updates, and formal threads where every reply repeats the same signature block. It is a single list for fundamentally different things.

The goal was to build the client that fixed both: a solid Linux-native experience and a UI that understands what kind of email it is looking at. Conversations are formatted like Slack messages with signatures stripped. Newsletters get their own feed tab. Receipts surface the key detail at a glance. Different types of communication, different interfaces."

tts "ai-cms" "AI CMS. A git-backed headless CMS with pluggable AI provider support.

Every traditional CMS adds a non-trivial technical cost: wiring up components, validation, and guardrails in the CMS to mirror what already exists in the codebase. Hosted solutions charge ongoing fees. Self-hosted adds maintenance overhead. As a site grows with dynamic sections, highly styled custom components, and per-page layouts, the CMS integration grows in complexity right alongside it. Two systems, two validation layers, two sources of truth.

The deeper problem is that content managers and developers are forced into completely different workflows for what is fundamentally the same task: changing a site. An AI CMS with git as the source of truth collapses that gap. The content manager gets an interface they can understand. The developer's existing guardrails bubble up and are enforced automatically, with no duplication to manage. This is what CMS tooling should look like."

tts "investment-platform" "Algorithmic Trading Platform. Infrastructure for running systematic machine learning trading experiments at scale.

This started as an exploratory project with two goals: stress-test AI-assisted development on a genuinely hard problem, and learn the strengths and weaknesses of different ML training approaches across different data spaces. Algorithmic trading is a perfect whetstone. The problem space is well-defined, the feedback loop is honest, and the data challenges are real.

2,668 trained models tracked in PostgreSQL. Each hypothesis lives in a YAML experiment config, not in code. A three-tier model gate enforces scientific rigour before any model touches live trading. Data pipelines pull from four sources, normalise across different schemas, and fill gaps continuously. The honest result: capital protection models trained extremely well. Generating consistent alpha is a harder problem. This is a project worth circling back to."

tts "cortana" "Cortana. A 3D avatar conversation agent with emotion-aware animation.

Most live AI listening agents are built around meeting transcripts. The ones that do have a conversational interface either have an awkward avatar or a UX that feels like a side thought. I wanted to build the experience I was actually looking for: a local, voice-first AI companion with a real sense of presence.

The specific use cases were interview prep that pushes on clarity and structure of answers, a speech coach that surfaces filler words and ums in real time, a mentor personality that cuts against the sycophantic tendency of most LLMs, a colleague for brainstorming ideas out loud, and a therapist mode for reflective conversation. Five distinct tools, one interface. Works with Anthropic, OpenAI, or any local model via Ollama."

echo ""
echo "Done. Files in $OUT:"
ls -lh "$OUT"/*.mp3
