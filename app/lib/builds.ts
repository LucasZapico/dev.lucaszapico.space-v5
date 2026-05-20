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
  closing?: string;
  audio?: string;
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
    audio: "/audio/builds/spotter.mp3",
    problem: "Different models have different strengths and different blind spots. Claude is strong on architecture and reasoning but would sometimes roll over function-level bugs and missed optimisations, particularly in file-by-file review. I built Spotter to bring open code models into the loop as a dedicated audit layer, reviewing file by file and catching what Claude missed.",
    overview:
      "Spotter watches file changes and routes diffs to multiple LLMs in parallel — Ollama, OpenWebUI, Claude Code, or any OpenAI-compatible endpoint. It cross-validates findings before surfacing them, running as a zero-interruption loop while you work, not after you push. The result is that human review shifts to a true final pass: instead of starting from scratch, you're resolving flagged issues that have already been surfaced and cross-validated. The 'you should have caught this' category of bugs mostly disappears before review even starts.",
    closing:
      "AI-assisted development is already standard; the tooling around it isn't. Most teams are still treating LLM code generation as a black box and discovering its failure modes in production. Spotter is one piece of what that answer looks like: layered, multi-model, automated, and tuned to the specific gaps the high-level reasoning passes leave behind.",
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

  monkeycode: {
    slug: "monkeycode",
    title: "MonkeyCode",
    status: "shipped",
    category: "Developer Tool",
    tagline: "Browser-native coding platform with a Socratic AI tutor",
    audio: "/audio/builds/monkeycode.mp3",
    problem: "Interview prep platforms have two recurring failures. The first is the feedback loop — you write code in one tab, run it mentally or in a scratchpad, then submit and wait for a test runner. The inner loop between writing code and seeing what it does is slow enough to break flow. The second is the AI integration: most platforms bolt on a 'generate solution' button that hands you the answer, which is exactly the wrong thing for learning. A solution you didn't build doesn't build the pattern recognition you need for an interview.",
    overview:
      "A browser-based coding platform where JavaScript executes natively and Python runs client-side via Pyodide — no round-trips, no waiting. The AI tutor is built as a Socratic coach: it asks questions and points toward the right direction without handing over the answer. 56 problems across the patterns that actually show up in technical interviews: arrays, hash maps, two pointers, sliding window, trees, and graphs.",
    closing:
      "Building learning tools is harder than building productivity tools. The obvious feature — show me the answer — is usually the wrong feature. Most of the design work was in deciding what not to show, and when.",
    stack: ["React Router 7", "Monaco Editor", "Pyodide", "Web Workers", "Ollama", "PostgreSQL", "Prisma"],
    highlights: [
      {
        title: "Client-side execution without a server",
        body: "JavaScript runs natively in the browser. Python runs via Pyodide — a full CPython interpreter compiled to WebAssembly. Both execute inside Web Workers so a runaway loop can't freeze the UI. No backend execution service, no cold starts, no latency between writing and seeing the result.",
      },
      {
        title: "AST instrumentation for complexity analysis",
        body: "After tests pass, the solution is parsed with acorn and the AST is walked to detect loop nesting depth and recursive call patterns. A passing solution that runs in O(n²) when O(n) is achievable is still a learning moment. The analysis surfaces that before the user moves on.",
      },
      {
        title: "Socratic tutor, not answer machine",
        body: "The AI tutor runs against a local Ollama instance and is prompted to ask guiding questions rather than produce solutions. If a user is stuck, it asks what they know about the input constraints, or what the brute-force approach would look like. The system prompt is the constraint — it treats giving the answer as a failure mode.",
      },
      {
        title: "Pattern-based problem sets",
        body: "56 problems organised around the patterns that recur in technical interviews, not a sprawl of 2,000. Each pattern builds on the last. The goal was enough problems to make the pattern feel automatic, not so many that the catalogue becomes the product.",
      },
    ],
    links: [],
  },

  "ai-cms": {
    slug: "ai-cms",
    title: "AI CMS",
    status: "in-progress",
    category: "Platform",
    tagline: "Git-backed headless CMS with pluggable AI provider support",
    audio: "/audio/builds/ai-cms.mp3",
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
    closing:
      "The insight that unlocked the design was treating git as the source of truth and letting the database hold only what needs to be fast and queryable. Content managers get a real interface; developers keep their existing guardrails without duplication. That boundary — AI can change content, not shape — is the constraint that makes the whole thing trustworthy enough to actually use.",
    links: [
      { label: "GitHub", href: "https://github.com/LucasZapico/ai-cms" },
    ],
  },

  "investment-platform": {
    slug: "investment-platform",
    title: "Algorithmic Trading Platform",
    status: "running",
    category: "ML Platform",
    tagline: "Infrastructure for running systematic ML trading experiments at scale",
    audio: "/audio/builds/investment-platform.mp3",
    problem: "Most algorithmic trading projects fail the same way: a hypothesis gets hardcoded into a training script, results look promising, and then changing any variable — the symbol, the timeframe, the feature set — requires editing code and hoping nothing else breaks. The experiment and the infrastructure are tangled. I wanted to build the infrastructure layer first: each hypothesis is a YAML config, the training runner is generic, results are tracked in PostgreSQL. Running a new experiment is a single command. The codebase stays stable while the hypothesis space expands. Algorithmic trading is the right problem to build this on — the feedback loop is honest, the data challenges are real (four sources with different schemas, gaps, and reliability characteristics), and the penalty for getting the infrastructure wrong shows up immediately in unreliable results.",
    overview:
      "A platform built to run trading hypothesis experiments systematically at scale. Each hypothesis lives in a YAML experiment config, not in code — results tracked in PostgreSQL across binary and multi-class architectures, multiple timeframes, and dozens of feature group configurations. A three-tier model gate enforces scientific rigour before any model touches live trading. Data pipelines pull from four sources, normalise across different schemas, and fill gaps continuously. The system runs on dedicated hardware with GPU-accelerated training on an RTX 4090 and paper trading sessions running around the clock.",
    stack: ["Python", "FastAPI", "XGBoost", "SQLAlchemy", "PostgreSQL", "Alembic", "Polygon.io", "Alpaca API", "Binance API", "Docker"],
    highlights: [
      {
        title: "Hypotheses live in config, not code",
        body: "Each experiment is a YAML file defining the model type, symbol, timeframe, feature groups, holding period, and profit target. Running a new hypothesis is a single command against a config file. This kept the codebase stable while allowing rapid iteration across dozens of configurations. All results are tracked in PostgreSQL, never in JSON registries or flat files.",
      },
      {
        title: "Scientific method enforced at the architecture level",
        body: "A three-tier model gate runs after every training run: sanity checks (files exist, metrics populated, minimum data coverage), performance checks (return positive, Sharpe above 0.5, win rate in range, beats buy-and-hold), and statistical validation. Data splits are always chronological, never shuffled. Forward returns are calculated after the split to prevent leakage. Only gate-passing models get committed to the models directory.",
      },
      {
        title: "Feature pipeline as the single source of truth",
        body: "Early in the project, training and backtesting were calculating rolling features over different historical windows, producing different feature distributions and making results unreliable. A centralised FeaturePipeline class enforces identical feature calculation across training, backtesting, and live inference. Every model saves its feature metadata at training time and loads it at inference. This was the unlock that made experiment results trustworthy.",
      },
      {
        title: "Multi-source data pipeline with quality validation",
        body: "Market data comes from Polygon (equities live and historical), CoinGecko (crypto 5-minute live), GeckoTerminal (crypto 1-minute live and historical backfill), and Binance (crypto gap fill and execution), each with different schemas, update frequencies, and reliability. A structural volume coverage issue with Binance.US USD pairs (7.6% of expected coverage, because trading is USDT-dominated) led to separate feature sets: 12 features for crypto, 14 for equities. Collectors run continuously and gap fillers backfill missing windows. Data quality checks run before training.",
      },
    ],
    closing:
      "Capital protection models trained reliably and the results held across different symbols and timeframes — bear and sideways markets have strong feature signatures that XGBoost identifies well. Generating consistent alpha is a harder problem. A pattern that works attracts capital and the pattern disappears; the right response is a faster iteration loop, not a more sophisticated model. The config system and three-tier gate were built for exactly that. This is a project worth circling back to.",
    links: [],
  },

  mailautumn: {
    slug: "mailautumn",
    title: "Mailautumn",
    status: "shipped",
    category: "Desktop App",
    tagline: "Complete frontend rewrite of Mailspring — threaded conversations, AI integration, and a built-in CRM",
    audio: "/audio/builds/mailautumn.mp3",
    problem: "A standard email inbox treats every kind of email the same way. Conversations with colleagues sit next to newsletters, receipts, automated updates, and formal threads where every reply repeats the same signature block. It's a single list for fundamentally different things. Moving from Mac to Linux — and losing Spark in the process — was the moment I decided to build the client that fixed both: a solid Linux-native experience and a UI that understands what kind of email it's looking at. Conversations are formatted like Slack messages with signatures stripped. You see the actual new content, not the same block of text repeated six times. Newsletters get their own feed tab, laid out like an editorial feed rather than a list of unread items. Receipts surface the key detail at a glance without opening. Different types of communication, different interfaces.",
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
    closing:
      "Building a daily driver is a different constraint than building a demo. Every decision gets load-tested at real email volume, and the things that matter most are invisible — the message that doesn't reappear after archiving, the conversation that correctly strips the quoted block you'd already read six times. The right abstraction boundary was the key call: building on Mailspring's sync engine meant months of reliable email instead of reimplementing IMAP edge cases. That tradeoff shaped everything else.",
    links: [
      { label: "GitHub", href: "https://github.com/LucasZapico/mailautumn" },
    ],
  },

  monkeycode: {
    slug: "monkeycode",
    title: "MonkeyCode",
    status: "shipped",
    category: "Developer Tool",
    tagline: "LeetCode-style coding practice with client-side execution, live variable inspection, and a Socratic AI tutor",
    audio: "/audio/builds/monkeycode.mp3",
    problem: "Interview prep platforms have two recurring failures. The first is execution latency: every keystroke that wants feedback round-trips to a sandboxed server, so the inner loop between writing code and seeing what it does is slow enough to break flow. The second is the help model. Most platforms either give you the full answer up front or hide it behind a paywall, and neither teaches you anything. I wanted a practice environment where running code felt instant, where you could see what every variable evaluated to as you typed, and where the help you asked for was real teaching, not just answer-reveal with a delay. The other open question was study material itself. Coding problems are well-covered ground, but the conceptual knowledge that surrounds them — language quirks, framework specifics, system design vocabulary — usually lives in a different tool. MonkeyCode folds both into one surface so the practice loop and the conceptual loop reinforce each other instead of fighting for attention.",
    overview:
      "A LeetCode-style platform with 20 problems across arrays, hash maps, two pointers, and graph patterns, plus a study mode for language/framework/topic Q&A. Code runs entirely in the browser via Web Workers — JavaScript through the Function constructor, Python through Pyodide — so there's no server-side execution boundary to wait on. Live eval mode parses your code with acorn at every change, instruments it with auto-logging calls, and surfaces inline variable values per line. The AI tutor is Socratic by design, runs on any Ollama-compatible endpoint, and won't hand you the solution.",
    stack: ["React Router 7", "TypeScript", "Tailwind v4", "PostgreSQL", "Prisma", "Monaco", "Pyodide", "Acorn", "Ollama"],
    highlights: [
      {
        title: "Client-side execution as the architectural cut",
        body: "There is no server-side code runner. JavaScript runs in a Web Worker through the Function constructor; Python runs in a Pyodide worker. The trade-off is upfront cost — Pyodide is a multi-megabyte WASM payload — but the payoff is that every run, every test, every live-eval keystroke is microseconds away. No sandbox provisioning, no rate limits, no infrastructure to scale. The whole platform could run as a static site if the AI tutor were optional.",
      },
      {
        title: "Live eval via AST instrumentation",
        body: "When live eval is enabled, every code change goes through an acorn-based instrumenter that walks the AST and injects __auto__(line, name, value) calls after every variable binding — including destructured ones, assignment patterns, and rest elements. The instrumented code runs in a separate worker on a debounce, and the captured values are rendered next to their source lines in Monaco. You see what every variable holds as you type without ever clicking run.",
      },
      {
        title: "Socratic AI tutor with hard guardrails",
        body: "The tutor prompt is explicit: never give the answer, always ask a question that pushes the user one step toward it. Backed by any OpenAI-compatible endpoint (Ollama, Open WebUI, vLLM), so it can run fully local. Study mode uses the same model with a different prompt to evaluate free-response answers against a rubric, with Learn/Practice/Test modes and spaced repetition for follow-ups.",
      },
      {
        title: "Per-problem optimal complexity targets",
        body: "Each problem ships with an authoritative time and space complexity in the seed data. After a successful submission, users enter their own Big-O analysis and the system compares it against the optimum. Right answer with O(n²) when O(n) is possible is still a learning moment, and surfacing it explicitly turns passing tests into a starting point rather than the end of the exercise.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/LucasZapico/monkeycode" },
    ],
  },

  cortana: {
    slug: "cortana",
    title: "Cortana",
    status: "prototype",
    category: "Desktop App",
    tagline: "3D avatar conversation agent with emotion-aware animation",
    audio: "/audio/builds/cortana.mp3",
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
    closing:
      "The multi-modal pipeline works — voice in, avatar out, model-swappable at every stage. The 3D avatar work exposed how much craft goes into character animation that feels present rather than mechanical; that part is parked until it can be done properly. The personality modes are the part worth returning to: a single conversational interface that shifts between interviewer, coach, mentor, and colleague depending on what you need is a genuinely useful tool.",
    links: [
      { label: "GitHub", href: "https://github.com/LucasZapico/cortana" },
    ],
  },
};

export const buildOrder = ["spotter", "monkeycode", "mailautumn", "ai-cms", "investment-platform", "cortana"];

export const statusLabel: Record<BuildStatus, string> = {
  shipped: "Shipped",
  running: "Running",
  "in-progress": "In Progress",
  prototype: "Prototype",
};
