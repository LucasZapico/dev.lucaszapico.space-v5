#!/usr/bin/env bash
# Run this ON MILOTRON: bash /tmp/generate-build-audio.sh
# Then scp /tmp/builds-audio/*.mp3 back to public/audio/builds/

set -euo pipefail

# Load KOKORO_URL from .env in repo root (falls back to localhost when run directly on Milotron)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"
if [[ -f "$ENV_FILE" ]]; then
  set -a; source "$ENV_FILE"; set +a
fi

KOKORO="${KOKORO_URL:-http://localhost:8880/tts}"
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

Different models have different strengths and different blind spots. Claude is strong on architecture and reasoning but would sometimes roll over function-level bugs and missed optimisations, particularly in file-by-file review. I built Spotter to bring open code models into the loop as a dedicated audit layer, reviewing file by file and catching what Claude missed.

Spotter watches file changes and routes diffs to multiple LLMs in parallel — Ollama, OpenWebUI, Claude Code, or any OpenAI-compatible endpoint. It cross-validates findings before surfacing them, running as a zero-interruption loop while you work, not after you push. The result is that human review shifts to a true final pass: instead of starting from scratch, you are resolving flagged issues that have already been surfaced and cross-validated. The category of bugs you should have caught mostly disappears before review even starts."

tts "monkeycode" "MonkeyCode. A browser-native coding platform with a Socratic AI tutor.

Interview prep platforms have two recurring failures. The first is the feedback loop — you write code in one tab, run it mentally or in a scratchpad, then submit and wait for a test runner. The inner loop between writing code and seeing what it does is slow enough to break flow. The second is the AI integration: most platforms bolt on a generate solution button that hands you the answer, which is exactly the wrong thing for learning. A solution you did not build does not build the pattern recognition you need for an interview.

A browser-based coding platform where JavaScript executes natively and Python runs client-side via Pyodide — no round-trips, no waiting. The AI tutor is built as a Socratic coach: it asks questions and points toward the right direction without handing over the answer. 56 problems across the patterns that actually show up in technical interviews: arrays, hash maps, two pointers, sliding window, trees, and graphs."

tts "mailautumn" "Mailautumn. A complete frontend rewrite of Mailspring with threaded conversations, AI integration, and a built-in CRM.

A standard email inbox treats every kind of email the same way. Conversations with colleagues sit next to newsletters, receipts, automated updates, and formal threads where every reply repeats the same signature block. It is a single list for fundamentally different things. Moving from Mac to Linux — and losing Spark in the process — was the moment I decided to build the client that fixed both: a solid Linux-native experience and a UI that understands what kind of email it is looking at.

Conversations are formatted like Slack messages with signatures stripped. You see the actual new content, not the same block of text repeated six times. Newsletters get their own feed tab, laid out like an editorial feed rather than a list of unread items. Receipts surface the key detail at a glance without opening. Different types of communication, different interfaces."

tts "ai-cms" "AI CMS. A git-backed headless CMS with pluggable AI provider support.

Every traditional CMS adds a non-trivial technical cost: wiring up components, validation, and guardrails in the CMS to mirror what already exists in the codebase. Hosted solutions charge ongoing fees. Self-hosted adds maintenance overhead. As a site grows with dynamic sections, highly styled custom components, and per-page layouts, the CMS integration grows in complexity right alongside it. Two systems, two validation layers, two sources of truth.

The deeper problem is that content managers and developers are forced into completely different workflows for what is fundamentally the same task: changing a site. An AI CMS with git as the source of truth collapses that gap. The content manager gets an interface they can understand. The developer's existing guardrails bubble up and are enforced automatically, with no duplication to manage. This is what CMS tooling should look like."

tts "investment-platform" "Algorithmic Trading Platform. Infrastructure for running systematic machine learning trading experiments at scale.

Most algorithmic trading projects fail the same way: a hypothesis gets hardcoded into a training script, results look promising, and then changing any variable — the symbol, the timeframe, the feature set — requires editing code and hoping nothing else breaks. The experiment and the infrastructure are tangled. I wanted to build the infrastructure layer first: each hypothesis is a YAML config, the training runner is generic, results are tracked in PostgreSQL. Running a new experiment is a single command. The codebase stays stable while the hypothesis space expands.

Algorithmic trading is the right problem to build this on — the feedback loop is honest, the data challenges are real, and the penalty for getting the infrastructure wrong shows up immediately in unreliable results."

tts "cortana" "Cortana. A 3D avatar conversation agent with emotion-aware animation.

Most live AI listening agents are built around meeting transcripts. The ones that do have a conversational interface either have an awkward avatar or a UX that feels like a side thought. I wanted to build the experience I was actually looking for: a local, voice-first AI companion with a real sense of presence.

The specific use cases were interview prep that pushes on clarity and structure of answers, a speech coach that surfaces filler words and ums in real time, a mentor personality that cuts against the sycophantic tendency of most LLMs, a colleague for brainstorming ideas out loud, and a therapist mode for reflective conversation. Five distinct tools, one interface. Works with Anthropic, OpenAI, or any local model via Ollama."

echo ""
echo "Done. Files in $OUT:"
ls -lh "$OUT"/*.mp3
