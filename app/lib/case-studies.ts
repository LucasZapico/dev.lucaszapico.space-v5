// ---------------------------------------------------------------------------
// Case study data — all content from MDX files, structured as JS objects
// ---------------------------------------------------------------------------

export type ContentBlock =
  | { type: "text"; html: string }
  | { type: "list"; items: string[] };

export interface ImagePlacement {
  src: string;
  alt: string;
}

export type SectionVariant = "prose" | "side-by-side" | "cards" | "callout";

export interface CaseSection {
  heading: string;
  image?: ImagePlacement;
  blocks: ContentBlock[];
  variant?: SectionVariant;
}

export interface CaseStudy {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  impact: string;
  overview: string;
  heroImages: string[];
  sections: CaseSection[];
}

const caseStudyList: CaseStudy[] = [
  {
    title: "Glassblowing Studio Digital Platform",
    slug: "glassblowing-studio",
    category: "Commerce & Operations",
    tags: ["React Router 7", "NestJS", "Medusa v2", "Directus", "Stripe", "PostgreSQL", "Docker"],
    impact: "Unified five services behind one platform two artists can actually operate",
    overview: "A Detroit glassblowing studio was preparing to open its doors with no digital presence and no technical staff. The owners are artists — they needed a system that could handle class enrollment, e-commerce, a gallery, event listings, email outreach, and a CRM without requiring them to learn software or manage multiple SaaS accounts. The project also had to support three distinct business phases: a pre-construction awareness site to build an audience before the studio existed, a soft launch with shop and gallery, and full operations with classes, events, and a student portal.",
    heroImages: ["/images/cases/glassblowing-studio.webp", "/images/cases/glassblowing-studio-2.webp", "/images/cases/glassblowing-studio-3.webp"],
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership — from initial discovery conversations with the client through architecture, implementation, deployment, and ongoing operations. I ran the discovery process, chose the stack, designed the data model, built the frontend and backend, set up infrastructure, and manage the deployment pipeline. This is an ongoing engagement." },
          { type: "text", html: "The studio didn't exist yet — it was under construction. The owners are artists with no technical background and no bandwidth for software management. I had to build around where they actually were: a system that could go live for audience-building before any content or products existed, then progressively activate features as the business reached each phase. Every architectural decision was shaped by the constraint that the people operating this system would never open a terminal." }
        ]
      },
      {
        heading: "Approach",
        variant: "side-by-side",
        image: { src: "/images/cases/glassblowing-studio-2.webp", alt: "Eastside Art Glass — service architecture showing React Router frontend, NestJS BFF, and backend services" },
        blocks: [
          { type: "text", html: "I built a monorepo with four workspaces: a <strong>React Router 7 frontend</strong> with SSR, a <strong>NestJS 11 BFF</strong> that proxies all backend services, a <strong>Medusa v2</strong> commerce engine, and <strong>Directus 11</strong> for content management. The frontend never talks to any backend service directly — every request goes through NestJS, which handles auth, validation, credential management, and cross-service orchestration. I chose this BFF pattern because the frontend needed to coordinate five different services (CMS, CRM, payments, commerce, email), and I wanted all credentials and business logic server-side." },
          { type: "text", html: "The discovery process shaped the architecture significantly. During planning I mapped out the client's actual operations and realized they couldn't manage manual outreach to different audience segments. That led to the <strong>channel-based email system</strong> — subscribers choose what they care about (classes, gallery, shop, events, articles, or a monthly digest), and content published in Directus automatically triggers emails to the right audience via Resend. The client never thinks about email; they just manage their content." },
          { type: "list", items: [
            "<strong>CMS (Directus)</strong> — owns all content: classes, events, gallery, pages, site settings. Block-based page builder lets the owner compose pages without code.",
            "<strong>CRM (Twenty)</strong> — owns all customer data: contacts, channel subscriptions, enrollment records, activity logs. No customer data lives in the CMS.",
            "<strong>Payments (Stripe)</strong> — checkout sessions, webhooks, refunds. Business-rule refund logic lives in the API, not in Stripe config.",
            "<strong>Commerce (Medusa v2)</strong> — product catalog, cart, orders. API proxy built, frontend cart pending on client's POS decision.",
            "<strong>Email (Resend)</strong> — transactional emails plus automated channel digests. 8 React Email templates."
          ]}
        ]
      },
      {
        heading: "Key Decisions",
        variant: "cards",
        blocks: [
          { type: "text", html: "<strong>Studio open/closed gating system.</strong> A single boolean in Directus controls the entire transactional surface. When the studio is \"closed\" (pre-launch), content sections still render if CMS data exists, but CTAs say \"Get Notified\" instead of \"Book Now,\" the shop and portal are hidden, and the hero promotes the founding list. When flipped to \"open,\" everything activates. I built this because the project has three planned phases and the client needed the site live for awareness long before they could take bookings. Rather than maintaining two separate sites, one toggle controls the experience." },
          { type: "text", html: "<strong>Strict data ownership boundaries.</strong> Each system owns its domain and nothing else. Directus never stores customer data. Twenty CRM never stores content. Medusa never stores class bookings. The API is the only thing that talks to all of them. I rejected the simpler approach of putting everything in Directus because it would have created a tangled data model that breaks as soon as you need real CRM features or proper e-commerce. Keeping boundaries clean now means I can swap any service without rewriting the others." },
          { type: "text", html: "<strong>Magic-link auth over passwords for the student portal.</strong> The target users are people who took a glassblowing class — they're not logging in daily. HMAC-SHA256 signed tokens with single-use nonces, 15-minute expiry, and timing-safe comparison. No password resets, no credential storage. Rate-limited to 3 requests per email per 15 minutes. I considered OAuth but it added complexity the use case didn't need." },
          { type: "text", html: "<strong>Channel-based email segmentation in the API layer, not the email provider.</strong> Resend has a single audience. All segmentation logic — who gets what, when, and why — lives in the NestJS cron jobs that query Twenty CRM by channel subscription. I chose this over Resend's native audience segmentation because the client's channels map directly to Directus content types, and I wanted the CRM to be the single source of truth for subscriber preferences. Content creation <em>is</em> the marketing — no campaign builder needed." }
        ]
      },
      {
        heading: "What Was Hard",
        blocks: [
          { type: "text", html: "<strong>Orchestrating enrollment across four systems.</strong> A single class booking touches Directus (decrement spots, create enrollment record), Stripe (checkout session with 30-minute expiry), Twenty CRM (create/update contact, log enrollment with check-in code and payment status), and Resend (confirmation email). If any step fails, the others need to stay consistent. I handle this with optimistic spot decrement — spots are reserved immediately and restored if the Stripe session expires or the student cancels. Webhook confirmation plus server-side polling as a fallback ensures no orphaned reservations." },
          { type: "text", html: "<strong>Building for a client who can't validate until the studio physically exists.</strong> The studio is under construction. I can't test with real classes, real students, or real inventory because none of it exists yet. I built a mock data system with five application states (production open/closed, mock with data, mock closed, mock empty) so I could develop and demo every UI state independently. The client reviews the mock-open state; I test edge cases against mock-empty. When real content goes in, the mock layer drops away." },
          { type: "text", html: "<strong>E-commerce blocked on POS integration.</strong> The Medusa v2 API proxy is built and tested in the NestJS layer, but the frontend cart and checkout are on hold. The client needs to choose their in-studio POS system first to ensure online and in-person inventory stay in sync. I structured the commerce module to be POS-agnostic — the integration point is well-defined — but it's a reminder that technical readiness doesn't always mean you can ship." }
        ]
      },
      {
        heading: "The Result",
        variant: "callout",
        image: { src: "/images/cases/glassblowing-studio-3.webp", alt: "Eastside Art Glass — class detail page with enrollment flow" },
        blocks: [
          { type: "text", html: "The awareness-phase site is live. Class enrollment with Stripe checkout, tiered refund cancellations, and waitlist auto-promotion are production-ready. The student portal (magic-link auth, enrollment management, waitlist tracking) is built. The CRM syncs contacts with channel preferences and logs every interaction. Six email types are wired — enrollment confirmation with check-in codes, cancellation with refund details, magic links, waitlist notifications, admin alerts, and channel digests with unsubscribe management." },
          { type: "text", html: "The studio owners manage everything through Directus — classes, events, gallery, pages — without touching code. The channel email system means publishing a new class automatically notifies the right subscribers. The platform is self-hosted on Coolify (CI/CD and deployment) with Plausible analytics, GlitchTip error tracking, structured logging, and health endpoints. When the studio opens, a single boolean flip activates all transactional features." }
        ]
      }
    ]
  },
  {
    title: "Internal Listing Intelligence Platform for a Real Estate Brokerage",
    slug: "real-estate-mls",
    category: "Internal Tools",
    tags: ["Go", "PostgreSQL", "PostGIS", "React 19", "JWT", "OAuth 2.0", "Docker"],
    impact: "Gave brokers early visibility into off-market listings before they hit public MLS",
    overview: "A 10-agent real estate brokerage was losing deals because listing intel traveled by group text, spreadsheets, and hallway conversations. By the time a broker heard about an off-market or coming-soon property, the window had closed. They needed an internal system where brokers and agents could see listings before they hit the public MLS — with search, enrichment, and role-based visibility — but they had no engineering resources and no budget for enterprise MLS software.",
    heroImages: ["/images/cases/bhreco-app-02.webp", "/images/cases/bhreco-app-03.webp", "/images/cases/bhreco-app-04.webp", "/images/cases/bhreco-app-05.webp", "/images/cases/bhreco-app-06.webp"],
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership — architecture, backend, frontend, database design, infrastructure, and ongoing operations. I ran discovery with the brokerage owner, translated business requirements into a technical plan, and built the entire system from scratch. Ongoing 24-month retainer engagement covering this platform plus a public marketing site." },
          { type: "text", html: "The brokerage had no engineering resources and no budget for enterprise MLS software. Their competitive advantage — information timing — was leaking through group texts and hallway conversations. I built around that reality: a tool that plugged directly into the workflows they already had (including a Google Sheets sync for agents who refused to leave spreadsheets) while adding the search, enrichment, and access control they couldn't get from off-the-shelf tools." }
        ]
      },
      {
        heading: "Approach",
        blocks: [
          { type: "text", html: "<strong>Go backend with clean architecture</strong> — strict layering with dependency injection and no framework magic. Four layers: HTTP handlers (Chi v5 router with middleware for JWT auth, structured logging, CORS, rate limiting), usecase layer (business logic for auth, listings, search, IDX sync, notifications, reporting), domain layer (entity definitions and repository interfaces for users, listings, properties, agents, brokers, offices, media), and adapter layer (PostgreSQL repositories via pgx v5 with connection pooling, Redis cache, OAuth providers)." },
          { type: "text", html: "<strong>PostgreSQL 16 with PostGIS</strong> for the data layer. 618-line initial migration covering 20+ tables. Listings use a state machine (<code>coming_soon → active → pending → sold/withdrawn/expired</code>) with transitions validated in the service layer and logged to <code>listing_status_history</code> for audit compliance. Properties carry PostGIS geometry columns with automatic <code>ST_Point</code> calculation via database triggers, plus full-text search vectors (tsvector) weighted across street address, subdivision, and county." },
          { type: "text", html: "<strong>React 19 frontend</strong> with Vite, TypeScript, Zustand for auth state, TanStack React Query for server state, React Hook Form + Zod for validation, and Tailwind v4. The UI includes 7 analytics views, advanced multi-faceted search and filtering, Zillow auto-enrichment on address entry, and Google Sheets sync for agents who still want spreadsheets." }
        ]
      },
      {
        heading: "Key Decisions",
        variant: "cards",
        image: { src: "/images/cases/bhreco-app-07.webp", alt: "BHRECO MLS — database schema and listing management views" },
        blocks: [
          { type: "text", html: "<strong>Go over Node.js for the backend.</strong> The system handles real-time listing data, geospatial queries, and IDX feed syncing on 15-minute intervals. Go gave me type safety at compile time, a ~20MB Alpine container for deployment, native concurrency for the sync workers, and minimal runtime overhead. I considered Node with TypeScript, but for a backend with this much data processing and no need for SSR or a shared frontend language, Go was the cleaner choice." },
          { type: "text", html: "<strong>PostGIS over application-level geo filtering.</strong> Radius-based search, bounding-box queries for map viewports, and exact coordinate lookups — all pushed down to GIST-indexed geometry columns. Database triggers compute geometry from lat/lng on insert and update, keeping the application layer free of spatial math. I evaluated Elasticsearch for search but the listing volume didn't justify the operational overhead — PostgreSQL's tsvector with English stemming handles full-text search well at this scale." },
          { type: "text", html: "<strong>Four-role RBAC baked into JWT claims.</strong> Admin, broker, agent, and consumer roles — each with different visibility into listings, search results, and analytics. The brokerage owner needed to control who saw pre-market listings. JWT claims carry role, agent ID, broker ID, and office ID so every handler enforces permissions without additional database lookups. Refresh tokens are stored as bcrypt hashes, invalidated after use via rotation, and cleaned up on password change." },
          { type: "text", html: "<strong>Combined repository pattern over a DI framework.</strong> Instead of injecting separate listing and property repositories into each usecase, I composed them into a <code>CombinedListingRepository</code> that satisfies multiple domain interfaces. This keeps dependency injection explicit and testable without pulling in a container framework — Go's interfaces made this natural." }
        ]
      },
      {
        heading: "What Was Hard",
        variant: "side-by-side",
        image: { src: "/images/cases/bhreco-app-08.webp", alt: "BHRECO MLS — search filtering and geospatial query interface" },
        blocks: [
          { type: "text", html: "<strong>Listing state machine with audit compliance.</strong> Real estate listings have legally significant status transitions — you cannot move a listing from <code>sold</code> back to <code>active</code>, and every transition needs an audit trail. I built a state machine in the service layer that validates transitions against an allowed-transitions map and logs every change with the old value, new value, user, timestamp, IP, and user agent. Getting the edge cases right (expired listings being relisted, withdrawn-then-reactivated) took more iteration than expected." },
          { type: "text", html: "<strong>IDX feed sync reliability.</strong> The system syncs with external MLS sources on 15-minute intervals via RETS/RESO APIs. These feeds are inconsistent — fields change names between MLS providers, timestamps vary in format, and connections drop. I built per-provider adapters with detailed sync logs that track records created, updated, deleted, and errored per run, so the brokerage owner can see exactly what happened on every sync cycle. Retries with exponential backoff handle transient failures." },
          { type: "text", html: "<strong>Balancing enrichment sources.</strong> The system auto-enriches listings with Zillow Zestimates, tax records, and property details on address entry. But third-party data is unreliable — Zillow estimates lag, tax records have different update schedules per county, and rate limits vary. I ended up building a cache-first enrichment layer where each data source has its own TTL and staleness threshold, so the UI always shows the best available data without blocking on slow or unavailable APIs." }
        ]
      },
      {
        heading: "The Result",
        variant: "callout",
        image: { src: "/images/cases/bhreco-app-09.webp", alt: "BHRECO MLS — brokerage dashboard with analytics overview" },
        blocks: [
          { type: "text", html: "The platform is deployed via Coolify (self-hosted CI/CD) with staging and production environments. The brokerage has a central listing system with role-based access, geospatial search, auto-enrichment, 7 analytics dashboards, and a full audit trail — replacing the group texts and spreadsheets that were losing them deals. The Go backend deploys as a ~20MB Alpine container with 47 configurable environment variables following 12-factor app conventions via Viper." },
          { type: "text", html: "The engagement is ongoing. The next phase is wiring the platform into the brokerage's CRM (Brivity) and client engagement tool (Homebot) to close the loop between listings, leads, and agent activity — building toward a single dashboard where the brokerage owner sees pipeline, production, and commissions in one screen instead of five disconnected tools." }
        ]
      }
    ]
  },
  {
    title: "Memory Care & Assisted Living Search Platform",
    slug: "memory-care-platform",
    category: "Marketplace",
    tags: ["React Router 7", "Express", "MongoDB", "Redis", "Zod", "Docker", "Data Pipeline"],
    impact: "Built a 26,000-listing care discovery platform from scratch — data pipeline to production deployment",
    overview: "My family went through the memory care search process and the information landscape was terrible. State registries publish facility data in incompatible formats. Google results are dominated by referral agencies that get paid to steer families. Actual facility details — what care types they handle, whether they accept Medicaid, staff-to-resident ratios — are scattered, outdated, or missing entirely. Families making the hardest decision of their lives are doing it with bad data.",
    heroImages: ["/images/cases/memory-care-platform-2.webp", "/images/cases/memory-care-platform.webp", "/images/cases/memory-care-platform-5.webp", "/images/cases/memory-care-platform-3.webp", "/images/cases/memory-care-platform-4.webp"],
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership — product direction, architecture, data pipeline, frontend, backend, infrastructure, and deployment. This is a personal project, not client work. I defined the problem, designed the system, and built every piece of it. It's been in active development for over a year." },
          { type: "text", html: "I built this because my family went through the search process and I saw how broken it was firsthand. The people using this platform are families in crisis — often an adult child who just learned their parent can't live alone anymore. They're not power users. Every design decision started from that: the information has to be trustworthy, the filters have to surface what actually matters for care, and the UI can't get in the way of someone who's overwhelmed." }
        ]
      },
      {
        heading: "Approach",
        variant: "side-by-side",
        image: { src: "/images/cases/memory-care-platform.webp", alt: "SilverLife — map-based search with facility listings and filter panel" },
        blocks: [
          { type: "text", html: "<strong>Monorepo with two workspaces</strong> (pnpm + Turbo):" },
          { type: "list", items: [
            "<strong>Backend</strong> — Express 5 with Zod-validated routes, MongoDB (Mongoose), Redis + Bull job queues, S3 storage, and Socket.io for real-time admin features. 24 database models, 25 route handlers.",
            "<strong>Frontend</strong> — React Router 7 with SSR, Tailwind v4, shadcn/ui, Jotai for search state, TanStack React Query, Google Maps integration, TipTap rich text editor, and Recharts for analytics dashboards."
          ]},
          { type: "text", html: "Four user roles — <strong>admin</strong>, <strong>provider</strong> (facility operators who claim and manage listings), <strong>advertiser</strong> (auction-based ad campaigns with geo-targeting), and <strong>seeker</strong> (families). Each role has its own dashboard, permissions, and workflow. Providers go through a verification flow to claim facilities — domain-based auto-approval, verification codes sent to facility email, or document upload for admin review." },
          { type: "text", html: "Deployed via Docker on Coolify (self-hosted CI/CD) with Cloudflare for ingress and Traefik reverse proxy. Staging and production environments with environment-aware configuration." }
        ]
      },
      {
        heading: "Data Pipeline",
        blocks: [
          { type: "text", html: "The platform lives or dies on data quality. I built a multi-source ingestion pipeline that pulls from <strong>six state registries</strong> — WA (DSHS), OR (DHS), CA (CDSS), NV (DPBH), MT (DPHHS), ID (IDHW) — plus CMS federal nursing home data. Each state publishes in a different format: CSV, HTML tables, PDFs, APIs. Each adapter handles parsing, normalization, and deduplication independently." },
          { type: "text", html: "<strong>Enrichment workers</strong> run on Bull job queues and fill in what the registries don't provide:" },
          { type: "list", items: [
            "Web scraping (Cheerio) facility websites for amenities, photos, and descriptions",
            "Google Places API for coordinates, ratings, and photos",
            "LLM-powered field extraction — mapping free-form facility descriptions to structured attributes (care types, security features, room configurations)",
            "Three caching layers (scrape cache, Google cache, LLM cache) to control API costs and respect rate limits"
          ]},
          { type: "text", html: "A <strong>deduplication service</strong> reconciles overlapping data — the same facility can appear in a state registry, CMS federal data, and a Google Places result. The system merges these into a single canonical listing with source tracking. The pipeline currently maintains ~26,000 listings." }
        ]
      },
      {
        heading: "Key Decisions",
        variant: "cards",
        image: { src: "/images/cases/memory-care-platform-5.webp", alt: "SilverLife — facility detail page with photos, ratings, and care information" },
        blocks: [
          { type: "text", html: "<strong>MongoDB over PostgreSQL.</strong> Facility data is deeply nested and varies wildly by source — rooms have features, staff have specializations, medical capabilities are arrays of enums, security features differ by facility type. A relational schema would mean dozens of join tables for what's naturally a document. MongoDB's document model maps directly to this shape. Geospatial indexing on coordinates handles location queries without PostGIS." },
          { type: "text", html: "<strong>Map viewport drives the query.</strong> All three view modes (list, split, map) query the same geographic area using viewport bounds. Panning and zooming the map loads new data for the visible area. This sounds simple but the implementation was not — I had to handle search lifecycle across view-mode switches, progressive expansion (\"Show more\" widens the query bounds by 10 miles per click), accumulated result deduplication, and debounced map-idle events to prevent query cascades. Search state lives in Jotai atoms so it survives navigation." },
          { type: "text", html: "<strong>Bull job queues for enrichment.</strong> Enrichment is slow and failure-prone — web scraping breaks, APIs rate-limit, LLM inference takes seconds per record. Bull + Redis gives me retry logic with backoff, rate limiting, progress tracking, and the ability to pause and resume enrichment runs without losing state. I can enrich 26,000 listings without babysitting the process." },
          { type: "text", html: "<strong>Zod for runtime validation + OpenAPI generation.</strong> Every route validates input with Zod schemas. The same schemas generate OpenAPI documentation automatically via zod-to-openapi. This eliminated an entire class of bugs where the frontend sent data the backend didn't expect." }
        ]
      },
      {
        heading: "What Was Hard",
        variant: "side-by-side",
        image: { src: "/images/cases/memory-care-platform-3.webp", alt: "SilverLife — top rated communities grid showing facility cards" },
        blocks: [
          { type: "text", html: "<strong>State registry parsing.</strong> Every state publishes facility data differently. Washington gives you a decent CSV. California publishes HTML tables that change format without notice. Some states embed data in PDFs. Each adapter is its own mini-project with its own failure modes. When a state changes their page layout, the scraper breaks silently — I built health checks that flag stale data so I know when an adapter needs attention." },
          { type: "text", html: "<strong>LLM enrichment at scale.</strong> Facility websites describe their services in free-form text. \"We welcome residents with memory challenges in a secure, homelike setting\" needs to map to structured attributes: care_types includes memory_care, security_features includes secured_environment. I use LLM-powered extraction for this, but the output needs validation — the model sometimes hallucinates attributes. Every LLM result passes through a Zod schema before it touches the database. Results are cached so I'm not paying per-record on re-runs." },
          { type: "text", html: "<strong>Search UX across three view modes.</strong> List, split-panel, and full-map views all need to show the same data, respond to the same filters, and stay in sync when switching between them. The edge cases were brutal — what happens to expanded results when you switch from list to split? What if the map viewport captures a different area than the expansion bounds? I ended up with a detailed state architecture spec just for search, and rewrote the system twice before it felt right." }
        ]
      },
      {
        heading: "The Result",
        variant: "callout",
        image: { src: "/images/cases/memory-care-platform-4.webp", alt: "SilverLife — full map and list discovery interface with search results" },
        blocks: [
          { type: "text", html: "The platform is deployed to staging with ~26,000 facility listings across six states. 79 filterable dimensions across 10 categories — care type, medical capabilities, security features, staffing ratios, room preferences, end-of-life care, location, price, availability, and lifestyle amenities. Three view modes (list, split, full map) with viewport-driven data loading and progressive radius expansion." },
          { type: "text", html: "Beyond search, the platform includes a <strong>facility comparison tool</strong> (side-by-side, up to 3 facilities), <strong>loved one profiles</strong> (care recipient assessments that can be exported as PDF for facility tours), a <strong>provider dashboard</strong> with claim verification and profile completion tracking, an <strong>advertiser platform</strong> with auction-based bidding and geo-targeted campaigns, an <strong>inquiry messaging system</strong> (threaded, with email notifications), a <strong>cost estimator</strong>, and an <strong>article system</strong> with MDX content." },
          { type: "text", html: "This was a large project that touched data engineering (multi-source pipelines, LLM enrichment, deduplication), full-stack product development (four user roles, real-time features, payment systems), and infrastructure (Docker, Coolify CI/CD, Cloudflare). It's not finished — the backlog has real items from QA walkthroughs and provider onboarding sessions — but the core system works and the data pipeline runs." }
        ]
      }
    ]
  },
  {
    title: "Therapist Practice Portal",
    slug: "therapist-portal",
    category: "Healthcare",
    tags: ["React Router 7", "NestJS", "PostgreSQL", "TypeORM", "Stripe", "Google Calendar", "Docker"],
    impact: "Replaced Calendly + Mailchimp + Google Docs with one unified system a therapist actually controls",
    overview: "A hypnotherapist in private practice was managing her entire client lifecycle across disconnected tools — Calendly for scheduling, Mailchimp for outreach, Google Docs for session notes, and manual email threads for everything in between. None of it talked to each other, and none of it understood the therapeutic relationship. She needed one system where booking, messaging, content delivery, and client history all lived together — and where the boundaries of her practice were reflected in how the software actually worked.",
    heroImages: ["/images/cases/therapist-portal-2.webp", "/images/cases/therapist-portal.webp", "/images/cases/therapist-portal-3.webp", "/images/cases/therapist-portal-4.webp", "/images/cases/therapist-portal-5.webp"],
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership — from discovery conversations with the therapist through architecture, implementation, deployment, and ongoing iteration. I made every technical decision: stack selection, data modeling, integration strategy, auth approach, payment flow design. The therapist's input shaped the domain rules; the engineering was entirely mine." },
          { type: "text", html: "The therapist is a solo practitioner — no office manager, no tech support, no admin staff. She was duct-taping Calendly, Mailchimp, and Google Docs into a workflow that constantly leaked context between tools. I didn't just replace those tools; I built around how her practice actually works. Therapeutic relationships have stages — discovery, intake, ongoing care — and the software needed to understand and enforce those stages rather than treating every client the same way a generic scheduling app would." }
        ]
      },
      {
        heading: "Approach",
        blocks: [
          { type: "text", html: "<strong>React Router 7 frontend with NestJS API and PostgreSQL.</strong> The frontend handles three distinct surfaces — public booking pages, a client dashboard, and a therapist admin portal — all server-rendered through nested Remix routes. NestJS provides the structured backend with modular separation: auth, bookings, messaging, content/feed, notifications, availability, Stripe payments, and Google Calendar integration. TypeORM manages the schema with explicit migrations." },
          { type: "text", html: "I chose this stack because the system needed SSR for public pages (SEO matters for a therapist's web presence), real-time data for the dashboards, and enough backend structure to support a dozen modules without the code becoming a maze. NestJS's module system gave me clean boundaries between booking logic, payment processing, calendar sync, and messaging — each with its own service, controller, and test suite." },
          { type: "text", html: "<strong>Directus as a headless CMS</strong> for articles, podcasts, and static site content. <strong>Twenty CRM</strong> (open-source, self-hosted) for client relationship tracking. Both integrate through the NestJS API layer so the frontend never touches them directly." }
        ]
      },
      {
        heading: "Key Decisions",
        variant: "cards",
        image: { src: "/images/cases/therapist-portal.webp", alt: "Gateways of the Mind — therapist dashboard with booking calendar and client overview" },
        blocks: [
          { type: "text", html: "<strong>The discovery gate as a domain boundary, not a product limitation.</strong> Anonymous visitors can only book a free 20-minute discovery call. Paid session types are locked until <code>discoveryCompletedAt</code> is set on the user record. This isn't a paywall — it's how this therapist actually works. She doesn't take clients she hasn't spoken with. I encoded that boundary in the data model, enforced it in the API guards, and reflected it in the UI state. The system understands that the therapeutic relationship has stages." },
          { type: "text", html: "<strong>Guest booking with optional account creation.</strong> A prospective client can book a discovery call without creating an account — just name, email, phone. After booking, they get a magic link to optionally create an account for their dashboard. I rejected requiring registration upfront because it adds friction at exactly the moment someone is making a vulnerable decision. The booking itself creates the user record; the account is just access to it." },
          { type: "text", html: "<strong>Magic-link auth over passwords.</strong> Passwordless login via Resend (with SMTP fallback). 32-byte tokens, SHA-256 hashed in the database, single-use, 15-minute expiry. Silent success on unknown emails to prevent enumeration. I kept password login available in dev mode only. For a therapy practice where clients log in infrequently, magic links remove the \"forgot password\" problem entirely." },
          { type: "text", html: "<strong>Stripe Checkout over embedded payment forms.</strong> Paid bookings redirect to Stripe-hosted checkout rather than processing cards in my UI. The booking is created with <code>PENDING_PAYMENT</code> status, Stripe handles PCI compliance, and a webhook (<code>checkout.session.completed</code>) confirms the booking and fires all side-effects — emails, in-app notifications, Google Calendar event creation, and a welcome message thread. I return 200 on webhook errors with idempotency guards to prevent Stripe retries from creating duplicate bookings." }
        ]
      },
      {
        heading: "What Was Hard",
        variant: "side-by-side",
        image: { src: "/images/cases/therapist-portal-3.webp", alt: "Gateways of the Mind — booking flow with calendar and time slot selection" },
        blocks: [
          { type: "text", html: "<strong>Google Calendar bidirectional sync.</strong> The therapist manages her life in Google Calendar, and her availability in the booking system needed to reflect that. Bookings push events to Google Calendar (with automatic Google Meet links for virtual sessions). Google Calendar events pull back as blocked dates so personal appointments reduce available booking slots. The sync runs every 15 minutes via cron, paginates through up to 120 days of events, handles all-day vs. timed events differently, and does a full delete-and-recreate on each cycle to avoid stale timezone data. OAuth token refresh, revocation on disconnect, and graceful degradation when the Google API is unreachable all needed to work correctly. This was the most integration-heavy feature in the project." },
          { type: "text", html: "<strong>Double-booking prevention under concurrent requests.</strong> Two clients selecting the same slot at the same time. I used a unique database constraint on date + start time for non-cancelled bookings, wrapped the insert in a serializable transaction with row-level locking, and return a 409 with a friendly message if the slot was taken between page load and submission. Simple in concept, but getting the transaction isolation right with TypeORM required careful testing." },
          { type: "text", html: "<strong>Side-effect orchestration on booking confirmation.</strong> When a booking is confirmed (directly for free sessions, via webhook for paid), five things fire asynchronously: confirmation email to client, notification email to therapist, in-app notification records for both, Google Calendar event creation, and a welcome message thread for first-time clients. All are fire-and-forget so the user gets instant feedback, but each failure path needed to be logged and non-blocking. Getting the error handling right — especially when Google Calendar or Resend is temporarily down — took more iteration than the happy path." }
        ]
      },
      {
        heading: "The Result",
        variant: "callout",
        image: { src: "/images/cases/therapist-portal-4.webp", alt: "Gateways of the Mind — client dashboard with content feed and messaging" },
        blocks: [
          { type: "text", html: "The therapist manages her entire practice from one system. Clients book sessions (free discovery or paid), see their appointment history, receive personalized content (audio recordings, worksheets, guided meditations, links), and message their therapist — all through a single portal that reflects the actual structure of a therapeutic relationship." },
          { type: "text", html: "The backend has 17 NestJS modules, explicit TypeORM migrations, structured logging, rate limiting, and 225 test files across the project. Booking confirmation orchestrates five async side-effects. The content feed supports four media types with per-client visibility and optional session linking. Six branded HTML email templates handle the full notification lifecycle." },
          { type: "text", html: "What makes this project different from a generic scheduling app is that the domain rules are in the code, not bolted on. The discovery gate, the messaging access progression, the therapist-only content uploads, the client isolation — these aren't configuration toggles. They're the data model. The system doesn't just schedule appointments; it understands that a therapeutic practice has structure, and it enforces that structure at every layer." }
        ]
      }
    ]
  },
  {
    title: "Fly Fishing Guide Booking Platform",
    slug: "fly-fishing-guide",
    category: "Booking Platform",
    tags: ["React Router 7", "NestJS", "Directus", "Stripe", "Jotai", "React Email", "Docker"],
    impact: "Replaced text-message scheduling with a cross-filtering booking wizard",
    overview: "A Sacramento-area fly fishing guide had been managing his entire booking pipeline over text messages — losing track of dates, double-booking trips, and spending evenings juggling schedule threads instead of tying flies. He had no website, no calendar system, and no way for clients to understand what was even available without calling him. The constraint was that fly fishing availability is genuinely complex: it depends on season, target species, water body, and trip type, all of which interact. A standard date-picker booking flow would either oversimplify it or require the guide to manually maintain a matrix he didn't have time for.",
    heroImages: [],
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership — from initial discovery conversations through architecture, implementation, deployment, and ongoing content and infrastructure support. I made all technical decisions: stack selection, data modeling, booking flow design, payment architecture, and deployment topology. The guide's input was domain expertise (what fish are where, when, and how trips actually work); everything else was mine." },
          { type: "text", html: "The guide is non-technical — he runs a one-person operation from his truck and his phone. He had no website, no booking system, and no interest in learning software. I built around that: a CMS he can update from his phone between trips, a booking wizard that absorbs the domain complexity his clients would otherwise need a phone call to navigate, and automated emails so he never has to manually confirm a booking again. The system had to run his business without him running the system." }
        ]
      },
      {
        heading: "Approach",
        blocks: [
          { type: "text", html: "<strong>Monorepo with four workspaces</strong> (pnpm):" },
          { type: "list", items: [
            "<strong>Site</strong> — React Router 7 with SSR, Tailwind v4, shadcn/ui, Jotai for atomic state management, Stripe Elements for payment, React Email for transactional templates, and Plausible Analytics (self-hosted, cookieless).",
            "<strong>API</strong> — NestJS 11 BFF (Backend for Frontend) proxying Directus, Medusa, Twenty CRM, and Stripe. The frontend never talks to any backing service directly — credentials stay server-side, CORS is simplified, and business logic lives in one place.",
            "<strong>Ecom</strong> — Medusa v2 headless commerce engine for a gear shop (rods, flies, accessories).",
            "<strong>CMS</strong> — Directus 11 managing trip types, guide profiles, pages, articles, and a 16-block-type page builder the guide operates himself."
          ]},
          { type: "text", html: "I chose the BFF pattern because the site needs to coordinate data from five services (Directus, Medusa, Stripe, Twenty CRM, Resend) and I wanted a single API surface with consistent error handling, validation, and auth. Docker Compose orchestrates PostgreSQL 16 and Redis 7 locally; production runs on Coolify (self-hosted CI/CD) across two servers (site on Hetzner for edge performance, backend services on a Nextron box)." }
        ]
      },
      {
        heading: "The Booking Problem",
        blocks: [
          { type: "text", html: "Fly fishing trips aren't like restaurant reservations or therapist appointments. You can't just pick a date and a time slot. Availability depends on four interdependent dimensions:" },
          { type: "list", items: [
            "<strong>Season</strong> — rainbow trout peaks March-May and October-November; steelhead runs December-February; American shad appears only in May-June. Each species has a different window.",
            "<strong>Species</strong> — the guide covers 9 species across 14 water bodies in the Sacramento region. Not every fish lives in every river.",
            "<strong>Water body</strong> — some rivers are wade-only, others support drift boats. Some have seasonal access restrictions. The Lower Sacramento is a year-round tailwater; Hat Creek is technical dry-fly water with a narrow window.",
            "<strong>Trip type</strong> — wade vs. float fishing, half-day vs. full-day. Float trips require drift-boat-compatible water. Wade trips open up smaller creeks."
          ]},
          { type: "text", html: "A standard calendar picker would either hide this complexity (forcing the guide to manually triage every booking request anyway) or present an overwhelming matrix. I needed a UI that let the user start from any dimension and have the other three narrow automatically." }
        ]
      },
      {
        heading: "Key Decisions",
        variant: "cards",
        blocks: [
          { type: "text", html: "<strong>Jotai atomic state for the booking wizard over React context or a reducer.</strong> The cross-filtering logic requires derived state — when a user selects a month, available species must update; when they select a species, compatible waters must update; when they select wade or float, waters filter again. Jotai's derived atoms (<code>filtersAtom</code>) compute these intersections reactively without manual dependency tracking. I considered useReducer but the cascading derivations would have meant a lot of imperative logic. Context would have caused unnecessary re-renders across unrelated wizard steps. Jotai gave me fine-grained reactivity with no persistence overhead — each booking session starts fresh." },
          { type: "text", html: "<strong>Server-side price calculation, not client-submitted.</strong> The frontend displays prices for transparency, but the <code>create-payment-intent</code> endpoint independently calculates the correct price from trip type and duration. The client never sends a price to the server. This is a simple decision but an important one — it means a modified client can't manipulate the payment amount. The deposit percentage (<code>DEPOSIT_PERCENTAGE = 0.2</code>) is a server-side constant, not a Stripe configuration." },
          { type: "text", html: "<strong>Normalized relational data in Directus over flat JSON.</strong> The original trip data was a flat JSON blob with string arrays for species and waters. I normalized it into three Directus collections (<code>fish_species</code>, <code>waters</code>, <code>fish_water_availability</code> junction) with M2M relations to trips. This let the guide add a new water body or species without touching code, and it gave the booking wizard a proper data model to query against. The alternative was hardcoding the availability matrix in the frontend, which would have been faster to build but impossible for the guide to maintain." },
          { type: "text", html: "<strong>20% deposit at booking, remainder day-of.</strong> This was the guide's existing business model and I kept it. Stripe creates a PaymentIntent for the deposit only. The remaining balance is collected in person. I considered full prepayment (simpler) but the guide's clients expect to pay day-of and the guide didn't want to handle refund logistics for weather cancellations through Stripe." },
          { type: "text", html: "<strong>\"Guide's Pick\" as a filter escape hatch.</strong> Both the fish and water selection steps include a \"Guide's Pick\" option that breaks the filter chain. When selected, it tells the guide to choose based on real-time conditions (water levels, hatch reports, weather). This was essential because the most experienced clients don't want to constrain the guide — they trust his judgment. Without it, every booking would force a specificity the domain doesn't require." }
        ]
      },
      {
        heading: "What Was Hard",
        blocks: [
          { type: "text", html: "<strong>Modeling the availability matrix accurately.</strong> The fish-water-season relationships aren't simple lookups. Rainbow trout on the Lower Sacramento is a year-round tailwater fishery, but rainbow trout on the Upper Sacramento is a seasonal freestone fishery with a completely different window. The same species on different water has different availability. I had to model availability at the junction level (fish + water + month), not at the species level. This tripled the data entry for the guide, so I pre-seeded the matrix from his existing knowledge and built the Directus UI to make updates manageable." },
          { type: "text", html: "<strong>Making the wizard feel simple despite the complexity.</strong> Eight steps sounds like a lot. Early versions felt like a form interrogation. I iterated on the step ordering (month first, then party size, then trip type, then species/water) so that the heaviest filtering happens after the user has already committed to the easy choices. The \"Guide's Pick\" escape on species and water means most casual bookers only make 4 real decisions. Power users who know exactly what they want can be specific." },
          { type: "text", html: "<strong>Deploying across two servers.</strong> The site runs on Hetzner (better edge performance for a consumer-facing app) while the API, CMS, ecom, and database run on a separate Nextron box. Coolify (self-hosted CI/CD) manages both, but coordinating Docker Compose deployments across two hosts with different production compose files required careful environment separation. Each service has its own <code>docker-compose.production.yml</code> and its own Coolify resource. I'd consolidate to one server if I were starting over — the performance gain wasn't worth the operational complexity for a site this size." }
        ]
      },
      {
        heading: "The Result",
        variant: "callout",
        blocks: [
          { type: "text", html: "The platform is live at fatherandsonflyfishing.com. The guide manages all content — trip descriptions, seasonal articles, guide profiles, photo galleries, FAQs — through Directus without touching code. Bookings flow through the wizard with Stripe deposit collection and automated email confirmations to both the client (with trip details, deposit receipt, what-to-bring checklist) and the guide (with client contact info and preferences)." },
          { type: "text", html: "The guide stopped losing bookings to forgotten text threads. Clients can see what's actually available for their dates without calling first. The cross-filtering wizard handles the domain complexity that would otherwise require a phone conversation — season, species, water, trip type all narrow in real time. SEO infrastructure is in place (SSR, structured data, sitemap, meta tags) with a content strategy built around fishing reports and location-specific articles to drive organic traffic over time." },
          { type: "text", html: "Current status: production, ongoing maintenance and content support. The ecom shop (Medusa) and Google Calendar sync are in the backlog but not yet live." }
        ]
      }
    ]
  }
];

export const caseStudies: Record<string, CaseStudy> = Object.fromEntries(
  caseStudyList.map((c) => [c.slug, c])
);

export const caseStudyOrder = caseStudyList.map((c) => c.slug);
