export type BuildStatus = "shipped" | "running" | "in-progress" | "prototype";

export interface BuildHighlight {
  title: string;
  body: string;
}

export interface Build {
  slug: string;
  title: string;
  status: BuildStatus;
  category: string;
  tagline: string;
  problem: string;
  overview: string;
  stack: string[];
  highlights: BuildHighlight[];
  links: { label: string; href: string }[];
  image?: string;
}

export const builds: Record<string, Build> = {
  spotter: {
    slug: "spotter",
    title: "Spotter",
    status: "shipped",
    category: "Developer Tool",
    tagline: "Background code review daemon with multi-model consensus",
    problem: "Different models have different strengths and different blind spots. Claude is strong on architecture and reasoning but would sometimes roll over function-level bugs and missed optimisations, particularly in file-by-file review. We built Spotter to bring open code models into the loop as a dedicated audit layer, reviewing file by file and catching what Claude missed. The goal was to shift the human reviewer to a true final pass. Instead of doing full review from scratch, you're resolving flagged issues that have already been surfaced and cross-validated. The 'you should have caught this' category of bugs mostly disappears before the review even starts.",
    overview:
      "Spotter watches file changes and routes diffs to multiple LLMs in parallel. Ollama, OpenWebUI, Claude Code, or any OpenAI-compatible endpoint. It cross-validates findings before surfacing them. The goal was a zero-interruption review loop that runs while you work, not after you push.",
    stack: ["Node.js", "TypeScript", "Chokidar", "Ollama", "Claude Code", "OpenAI API"],
    highlights: [
      {
        title: "Multi-model consensus engine",
        body: "Findings from each model are clustered using Jaccard token similarity and union-find grouping. Only findings that survive a configurable quorum make it through, reducing noise without losing signal. A judge strategy lets one model act as a second pass over the surviving candidates.",
      },
      {
        title: "Four review modes",
        body: "Watch mode debounces file changes and reviews diffs incrementally. One-shot works as a pre-commit hook. Deep audit batches the full codebase with resumable checkpoints so long runs can be interrupted and continued. Git range mode reviews a commit range retroactively.",
      },
      {
        title: "Layered config with per-project overrides",
        body: "Config loads from hardcoded defaults → global XDG config → project .spotter.yml → CLI flags. Environment variables interpolate inline. Per-model system prompts let you give different instructions to each backend. One watches for runtime bugs, another for structural patterns.",
      },
      {
        title: "Context isolation for Claude Code",
        body: "The Claude Code backend runs from a temp directory to prevent the project's CLAUDE.md from bleeding into the review prompt. Without this, the reviewer inherits project-specific instructions that bias findings.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/LucasZapico/spotter" },
    ],
  },

  "ai-cms": {
    slug: "ai-cms",
    title: "AI CMS",
    status: "in-progress",
    category: "Platform",
    tagline: "Git-backed headless CMS with pluggable AI provider support",
    problem: "Every traditional CMS adds a non-trivial technical cost: wiring up components, validation, and guardrails in the CMS to mirror what already exists in the codebase. Hosted solutions charge ongoing fees. Self-hosted adds maintenance overhead. As a site grows with dynamic sections, highly styled custom components, and per-page layouts, the CMS integration grows in complexity right alongside it. Two systems, two validation layers, two sources of truth. The deeper problem is that content managers and developers are forced into completely different workflows for what is fundamentally the same task: changing a site. An AI CMS with git as the source of truth collapses that gap. The content manager gets an interface they can understand. The developer's existing guardrails bubble up and are enforced automatically, no duplication to manage. Page structure becomes configurable by the project owner, so a content manager can add or remove sections without a developer in the loop. This is what CMS tooling should look like.",
    overview:
      "A CMS where AI generates and edits content through a guardrails layer before anything touches disk or git. Works with any OpenAI-compatible endpoint: Anthropic, OpenAI, or a self-hosted Ollama instance. The core insight is that git should stay the source of truth, so AI edits go through the same review path as human edits: diff preview, branch, merge. The database only caches operational state (sessions, locks, review status).",
    stack: ["SvelteKit", "TypeScript", "Drizzle ORM", "PostgreSQL", "Anthropic SDK", "OpenAI SDK", "Arctic"],
    highlights: [
      {
        title: "Provider-agnostic AI layer",
        body: "A factory pattern routes requests to Anthropic, OpenAI, or any OpenAI-compatible endpoint (Ollama, vLLM, OpenWebUI). Provider and model are configured per-project in the database, swappable from the UI without touching code. The rest of the system doesn't care which model is running.",
      },
      {
        title: "Git as source of truth",
        body: "Content, schemas, and media references live in git. The database holds users, sessions, soft locks, and audit state. Things that need to be fast and queryable, not things that define what the site says. A developer can make a direct IDE edit and the CMS reconciles on the next push.",
      },
      {
        title: "Guardrails as a trust boundary",
        body: "All AI-proposed edits pass through a type-aware validator before touching disk. JSON guardrails freeze structure and only allow string value changes. Markdown guardrails block script/style injection and frontmatter key additions. The boundary is explicit: the AI can change content, not shape.",
      },
      {
        title: "Schema-driven prompting",
        body: "Projects define field schemas in .ai-cms/schemas/*.yml. The system prompt injects the full schema so the model knows required fields, types, and constraints and asks specifically for what's missing rather than guessing. Adding a team member becomes a structured conversation, not a free-form edit.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/LucasZapico/ai-cms" },
    ],
  },

  "investment-platform": {
    slug: "investment-platform",
    title: "Algorithmic Trading Platform",
    status: "running",
    category: "ML Platform",
    tagline: "ML trading platform built to explore model training, data pipelines, and trading integrations",
    problem: "This started as an exploratory project with two goals: stress-test AI-assisted development on a genuinely hard problem, and learn the strengths and weaknesses of different ML training approaches across different data spaces. Algorithmic trading is a perfect whetstone. The problem space is well-defined, the feedback loop is honest, and the data challenges are real. Multi-source ingestion from Alpaca, Binance, CoinGecko, and GeckoTerminal, each with different schemas, gaps, and reliability characteristics. Model training across multiple timeframes to understand where ensemble approaches break down. Paper and live trading integrations with Alpaca and Binance, with strict validation and local ledger parity to catch any discrepancy between what the system thinks it did and what actually happened. A full frontend dashboard was built alongside the backend but was intentionally deprioritised. Keeping the UI in sync with rapidly changing model configurations added friction without adding signal. The honest result: capital protection models trained extremely well, showing strong resistance in bear and sideways markets. Generating consistent alpha is a harder problem. This is a project worth circling back to.",
    overview:
      "A quantitative trading platform built to test hypotheses across model architecture, feature engineering, and position sizing. Multi-source data pipelines from Alpaca, Binance, CoinGecko, and GeckoTerminal. XGBoost ensembles trained across different timeframes and configurations. Paper and live trading integrations with Alpaca and Binance. The system runs continuously on dedicated hardware with 2,668 trained models in PostgreSQL and GPU-accelerated training on an RTX 4090. Most configurations didn't generate consistent alpha. The infrastructure, data pipelines, and capital protection models are solid.",
    stack: ["Python", "FastAPI", "XGBoost", "SQLAlchemy", "PostgreSQL", "Alembic", "Alpaca API", "CoinGecko", "Docker"],
    highlights: [
      {
        title: "Multi-timeframe ensemble (not one size-fits-all)",
        body: "Four specialist models: scalping (1h, 0.3% target), intraday (4h, 0.8%), swing (1d, 2%), position (5d, 4%). Each uses a different feature group optimised for its timescale. At inference time, the highest-confidence model's signal drives the trade, not a naive average that would muddle the specialisations.",
      },
      {
        title: "Centralised feature pipeline: the fix that unblocked everything",
        body: "After 40+ failed training iterations, the root cause was a distribution mismatch. Training used 5+ years of context to calculate rolling features, backtesting used 1.5 years. A centralised FeaturePipeline class enforces identical feature calculation across training, backtesting, and live inference. Same input, same output, always. This was the unlock.",
      },
      {
        title: "Layered position sizing",
        body: "Position size is computed as Kelly criterion × volatility adjustment × drawdown scaling × confidence weighting, each layer applying a multiplicative constraint. High volatility shrinks position. Model-specific drawdown limits the risk per trade. Non-linear confidence weighting (below 40% gets 40% of base, above 90% gets 120%) rewards conviction without overexposure.",
      },
      {
        title: "Honest results",
        body: "ETHUSD baseline: +7.46% return, 55.63% win rate over the test period. 16 feature and holding configurations tested. None beat the baseline. The models didn't outperform buy-and-hold on the test window. The infrastructure is real, the data pipeline is real, the engineering is real. The alpha isn't there yet.",
      },
    ],
    links: [],
  },

  mailautumn: {
    slug: "mailautumn",
    title: "Mailautumn",
    status: "shipped",
    category: "Desktop App",
    tagline: "Complete frontend rewrite of Mailspring — threaded conversations, AI integration, and a built-in CRM",
    problem: "Moving from Mac to Linux meant losing Spark. There wasn't an email client on Linux with the same level of polish or feature set. That was the starting point. But the deeper problem is that a standard email inbox treats every type of email the same way: conversations with colleagues sit next to newsletters, receipts, automated updates, and formal threads where every reply repeats the same signature block. It's a single list for fundamentally different things. The goal was to build the client that fixed both: a solid Linux-native experience and a UI that understands what kind of email it's looking at. Conversations are formatted like Slack messages with signatures stripped. You see the actual new content, not the same block of text repeated six times. Newsletters get their own feed tab, laid out like an editorial feed rather than a list of unread items. Receipts surface the key detail at a glance without opening. Updates the same. Different types of communication, different interfaces.",
    overview:
      "A full rewrite of the Mailspring email client UI while keeping its battle-tested C++ sync engine. The goal was a modern, keyboard-first email experience with Slack-style threading, multi-provider AI assistance, and a lightweight CRM. Built as a daily driver, not a demo. 15,000+ lines of TypeScript across Electron main and React renderer.",
    stack: ["Electron", "React 18", "TypeScript", "Tailwind v4", "Jotai", "Vite", "better-sqlite3"],
    highlights: [
      {
        title: "Reuse what works, replace what doesn't",
        body: "Mailspring's C++ mailsync binary handles IMAP/SMTP, threading, and full-text search. Years of battle-tested reliability. The app spawns it as a child process over stdio, reading from a shared SQLite database. This let the entire frontend be rebuilt in React without touching sync logic. Identifying the right abstraction boundary meant months of reliable email instead of reimplementing IMAP edge cases.",
      },
      {
        title: "Content extraction as domain knowledge",
        body: "Threaded conversations only work if each message shows only new content. The content extractor (457 LOC) uses domain-specific selectors to identify and strip Gmail, Outlook, Yahoo, and Apple Mail quote blocks, signature delimiters, and attribution patterns. Each client formats them differently so each gets its own handling. This is invisible to users but the difference between a conversation view and a noise wall.",
      },
      {
        title: "Multi-provider AI with a single interface",
        body: "A unified callAI() function routes to OpenAI, Anthropic, or Ollama, handling model name translation, endpoint path normalisation, and Anthropic's unique header format transparently. Temperature 0 for thread summaries and classification (reproducible), 0.7 for compose drafts (natural variation). Three different use cases, deliberately tuned differently.",
      },
      {
        title: "Optimistic updates without flickering",
        body: "After archive or trash, the UI marks threads as removed and suppresses delta-triggered reloads for 5 seconds, then clears after 30. Without this, the mailsync delta arrives before the database is consistent and the archived thread reappears momentarily. The guard is simple but the absence of it is the kind of thing that makes a daily driver feel broken.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/LucasZapico/mailautumn" },
    ],
  },

  cortana: {
    slug: "cortana",
    title: "Cortana",
    status: "prototype",
    category: "Desktop App",
    tagline: "3D avatar conversation agent with emotion-aware animation",
    problem: "Most live AI listening agents are built around meeting transcripts. The ones that do have a conversational interface either have an awkward avatar or a UX that feels like a side thought. I wanted to build the experience I was actually looking for: a local, voice-first AI companion with a real sense of presence. The specific use cases I had in mind were interview prep with a mode that pushes on clarity and structure of answers, a speech coach that surfaces filler words and ums in real time, a mentor personality that cuts against the sycophantic tendency of most LLMs and gives direct feedback on goals and thinking, a colleague for brainstorming and working through ideas out loud, and a therapist mode for reflective conversation. Five distinct tools, one interface. I also had a vision for a unique illustrated avatar style but Three.js character work is harder than it looks and that part is parked for now. You can already upload your own avatar if you have one.",
    overview:
      "A Tauri desktop app that pairs any LLM with a 3D avatar that reacts to the conversation: mouth sync, eye blink, emotion-driven expressions, head movement. Voice goes in via Whisper, text goes to the model, the response drives both TTS and avatar state. Ships with five built-in personalities: Interviewer (structures and challenges your responses), Speech Coach (flags filler words and pacing), Mentor (direct feedback, no flattery), Colleague (open brainstorming partner), and Therapist (reflective, patient listening). Works with Anthropic, OpenAI, or any local model via Ollama.",
    stack: ["Tauri", "React", "Three.js", "React Three Fiber", "Rive", "VRM", "@pixiv/three-vrm", "Anthropic SDK", "Web Audio API"],
    highlights: [
      {
        title: "Full multi-modal pipeline",
        body: "Voice → Whisper (local or OpenAI) → LLM → emotion detection → avatar state update → TTS playback. Each stage is swappable: local Kokoro for TTS instead of OpenAI, Ollama instead of Claude, any OpenAI-compatible endpoint. The pipeline doesn't assume a specific provider at any stage.",
      },
      {
        title: "Four avatar renderer backends",
        body: "Built-in procedural 3D (Three.js morph targets), Rive vector animation (state machine with talking and emotion inputs), VRM skeleton control (@pixiv/three-vrm), and a started Ready Player Me integration. Users can upload their own .riv or .vrm files, stored in IndexedDB and resolved via blob URL. The renderer is swapped at runtime without restarting.",
      },
      {
        title: "Streaming parser for extended thinking",
        body: "Extended thinking arrives as think tags interleaved with the response stream, sometimes split across chunk boundaries. The parser maintains state across chunks to extract reasoning content correctly and display it separately, without buffering the full response first.",
      },
      {
        title: "Conversation state machine",
        body: "idle → listening → processing → speaking, with Escape to interrupt at any phase. Silence detection auto-stops the STT after a configurable quiet period. Mic permission errors surface a retry prompt. The state machine means the avatar always reflects what's actually happening, not just what was last said.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/LucasZapico/cortana" },
    ],
  },
};

export const buildOrder = ["spotter", "mailautumn", "ai-cms", "investment-platform", "cortana"];

export const statusLabel: Record<BuildStatus, string> = {
  shipped: "Shipped",
  running: "Running",
  "in-progress": "In Progress",
  prototype: "Prototype",
};
