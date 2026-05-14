#!/usr/bin/env node
// Run on milotron: node /tmp/generate-work-audio.mjs
// Then scp /tmp/work-audio/*.mp3 back to public/audio/work/

import { execSync } from "child_process";
import { mkdirSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";

const KOKORO = "http://localhost:8880/tts";
const VOICE = "af_sky";
const OUT = "/tmp/work-audio";
mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------------------
// Strip HTML tags and decode common entities for clean TTS output
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
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Build narration text from case study sections
// ---------------------------------------------------------------------------
function narrate(study) {
  const lines = [];

  lines.push(`${study.title}.`);
  lines.push(`${study.impact}.`);
  lines.push("");
  lines.push(strip(study.overview));
  lines.push("");

  for (const section of study.sections) {
    lines.push(`${section.heading}.`);
    lines.push("");
    for (const block of section.blocks) {
      if (block.type === "text") {
        lines.push(strip(block.html));
        lines.push("");
      } else if (block.type === "list") {
        for (const item of block.items) {
          lines.push(strip(item));
          lines.push("");
        }
      }
    }
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// ---------------------------------------------------------------------------
// Case study data — full content matching case-studies.ts
// ---------------------------------------------------------------------------
const caseStudies = [
  {
    title: "Glassblowing Studio Digital Platform",
    slug: "glassblowing-studio",
    impact: "Unified five services behind one platform two artists can actually operate",
    overview: "A Detroit glassblowing studio was preparing to open its doors with no digital presence and no technical staff. The owners are artists. They needed a system that could handle class enrollment, e-commerce, a gallery, event listings, email outreach, and a CRM without requiring them to learn software or manage multiple SaaS accounts. The project also had to support three distinct business phases: a pre-construction awareness site to build an audience before the studio existed, a soft launch with shop and gallery, and full operations with classes, events, and a student portal.",
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership. From initial discovery conversations with the client through architecture, implementation, deployment, and ongoing operations. I ran the discovery process, chose the stack, designed the data model, built the frontend and backend, set up infrastructure, and manage the deployment pipeline. This is an ongoing engagement." },
          { type: "text", html: "The studio did not exist yet. It was under construction. The owners are artists with no technical background and no bandwidth for software management. I had to build around where they actually were: a system that could go live for audience-building before any content or products existed, then progressively activate features as the business reached each phase. Every architectural decision was shaped by the constraint that the people operating this system would never open a terminal." },
        ],
      },
      {
        heading: "Approach",
        blocks: [
          { type: "text", html: "I built a monorepo with four workspaces: a React Router 7 frontend with SSR, a NestJS 11 backend for frontend that proxies all backend services, a Medusa v2 commerce engine, and Directus 11 for content management. The frontend never talks to any backend service directly. Every request goes through NestJS, which handles auth, validation, credential management, and cross-service orchestration. I chose this pattern because the frontend needed to coordinate five different services, and I wanted all credentials and business logic server-side." },
          { type: "text", html: "The discovery process shaped the architecture significantly. During planning I mapped out the client's actual operations and realized they could not manage manual outreach to different audience segments. That led to the channel-based email system. Subscribers choose what they care about: classes, gallery, shop, events, articles, or a monthly digest. Content published in Directus automatically triggers emails to the right audience via Resend. The client never thinks about email. They just manage their content." },
          {
            type: "list",
            items: [
              "CMS via Directus owns all content: classes, events, gallery, pages, site settings. A block-based page builder lets the owner compose pages without code.",
              "CRM via Twenty owns all customer data: contacts, channel subscriptions, enrollment records, activity logs. No customer data lives in the CMS.",
              "Payments via Stripe handle checkout sessions, webhooks, and refunds. Business-rule refund logic lives in the API, not in Stripe config.",
              "Commerce via Medusa v2 manages product catalog, cart, and orders. The API proxy is built and the frontend cart is pending on the client's point-of-sale decision.",
              "Email via Resend handles transactional emails and automated channel digests, with 8 React Email templates.",
            ],
          },
        ],
      },
      {
        heading: "Key Decisions",
        blocks: [
          { type: "text", html: "Studio open and closed gating system. A single boolean in Directus controls the entire transactional surface. When the studio is closed, content sections still render if CMS data exists, but CTAs say Get Notified instead of Book Now, the shop and portal are hidden, and the hero promotes the founding list. When flipped to open, everything activates. I built this because the project has three planned phases and the client needed the site live for awareness long before they could take bookings. Rather than maintaining two separate sites, one toggle controls the experience." },
          { type: "text", html: "Strict data ownership boundaries. Each system owns its domain and nothing else. Directus never stores customer data. Twenty CRM never stores content. Medusa never stores class bookings. The API is the only thing that talks to all of them. I rejected the simpler approach of putting everything in Directus because it would have created a tangled data model that breaks as soon as you need real CRM features or proper e-commerce. Keeping boundaries clean now means I can swap any service without rewriting the others." },
          { type: "text", html: "Magic-link authentication over passwords for the student portal. The target users are people who took a glassblowing class. They are not logging in daily. HMAC-SHA256 signed tokens with single-use nonces, 15-minute expiry, and timing-safe comparison. No password resets, no credential storage. Rate-limited to 3 requests per email per 15 minutes. I considered OAuth but it added complexity the use case did not need." },
          { type: "text", html: "Channel-based email segmentation in the API layer, not the email provider. Resend has a single audience. All segmentation logic lives in NestJS cron jobs that query Twenty CRM by channel subscription. I chose this over Resend's native audience segmentation because the client's channels map directly to Directus content types, and I wanted the CRM to be the single source of truth for subscriber preferences. Content creation is the marketing. No campaign builder needed." },
        ],
      },
      {
        heading: "What Was Hard",
        blocks: [
          { type: "text", html: "Orchestrating enrollment across four systems. A single class booking touches Directus to decrement spots, Stripe to create a checkout session with 30-minute expiry, Twenty CRM to create or update the contact and log the enrollment, and Resend to send a confirmation email. If any step fails, the others need to stay consistent. I handle this with optimistic spot decrement. Spots are reserved immediately and restored if the Stripe session expires or the student cancels. Webhook confirmation plus server-side polling as a fallback ensures no orphaned reservations." },
          { type: "text", html: "Building for a client who cannot validate until the studio physically exists. The studio is under construction. I cannot test with real classes, real students, or real inventory because none of it exists yet. I built a mock data system with five application states so I could develop and demo every UI state independently. The client reviews the mock-open state. I test edge cases against mock-empty. When real content goes in, the mock layer drops away." },
          { type: "text", html: "E-commerce blocked on point-of-sale integration. The Medusa v2 API proxy is built and tested, but the frontend cart and checkout are on hold. The client needs to choose their in-studio point-of-sale system first to ensure online and in-person inventory stay in sync. I structured the commerce module to be POS-agnostic, but it is a reminder that technical readiness does not always mean you can ship." },
        ],
      },
      {
        heading: "The Result",
        blocks: [
          { type: "text", html: "The awareness-phase site is live. Class enrollment with Stripe checkout, tiered refund cancellations, and waitlist auto-promotion are production-ready. The student portal with magic-link auth, enrollment management, and waitlist tracking is built. The CRM syncs contacts with channel preferences and logs every interaction. Six email types are wired: enrollment confirmation with check-in codes, cancellation with refund details, magic links, waitlist notifications, admin alerts, and channel digests with unsubscribe management." },
          { type: "text", html: "The studio owners manage everything through Directus without touching code. The channel email system means publishing a new class automatically notifies the right subscribers. The platform is self-hosted on Coolify with Plausible analytics, GlitchTip error tracking, structured logging, and health endpoints. When the studio opens, a single boolean flip activates all transactional features." },
        ],
      },
    ],
  },

  {
    title: "Internal Listing Intelligence Platform for a Real Estate Brokerage",
    slug: "real-estate-mls",
    impact: "Gave brokers early visibility into off-market listings before they hit public MLS",
    overview: "A 10-agent real estate brokerage was losing deals because listing intel traveled by group text, spreadsheets, and hallway conversations. By the time a broker heard about an off-market or coming-soon property, the window had closed. They needed an internal system where brokers and agents could see listings before they hit the public MLS, with search, enrichment, and role-based visibility. They had no engineering resources and no budget for enterprise MLS software.",
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership. Architecture, backend, frontend, database design, infrastructure, and ongoing operations. I ran discovery with the brokerage owner, translated business requirements into a technical plan, and built the entire system from scratch. Ongoing 24-month retainer engagement covering this platform plus a public marketing site." },
          { type: "text", html: "The brokerage had no engineering resources and no budget for enterprise MLS software. Their competitive advantage — information timing — was leaking through group texts and hallway conversations. I built around that reality: a tool that plugged directly into the workflows they already had, including a Google Sheets sync for agents who refused to leave spreadsheets, while adding the search, enrichment, and access control they could not get from off-the-shelf tools." },
        ],
      },
      {
        heading: "Approach",
        blocks: [
          { type: "text", html: "Go backend with clean architecture. Strict layering with dependency injection and no framework magic. Four layers: HTTP handlers using Chi v5 router with middleware for JWT auth, structured logging, CORS, and rate limiting. A usecase layer for business logic covering auth, listings, search, IDX sync, notifications, and reporting. A domain layer with entity definitions and repository interfaces. And an adapter layer with PostgreSQL repositories via pgx v5 with connection pooling, Redis cache, and OAuth providers." },
          { type: "text", html: "PostgreSQL 16 with PostGIS for the data layer. A 618-line initial migration covering 20 tables. Listings use a state machine — coming soon, active, pending, sold, withdrawn, or expired — with transitions validated in the service layer and logged to a status history table for audit compliance. Properties carry PostGIS geometry columns with automatic point calculation via database triggers, plus full-text search vectors weighted across street address, subdivision, and county." },
          { type: "text", html: "React 19 frontend with Vite, TypeScript, Zustand for auth state, TanStack React Query for server state, React Hook Form with Zod for validation, and Tailwind v4. The UI includes 7 analytics views, advanced multi-faceted search and filtering, Zillow auto-enrichment on address entry, and Google Sheets sync for agents who still want spreadsheets." },
        ],
      },
      {
        heading: "Key Decisions",
        blocks: [
          { type: "text", html: "Go over Node.js for the backend. The system handles real-time listing data, geospatial queries, and IDX feed syncing on 15-minute intervals. Go gave me type safety at compile time, a 20-megabyte Alpine container for deployment, native concurrency for the sync workers, and minimal runtime overhead. I considered Node with TypeScript, but for a backend with this much data processing and no need for SSR or a shared frontend language, Go was the cleaner choice." },
          { type: "text", html: "PostGIS over application-level geo filtering. Radius-based search, bounding-box queries for map viewports, and exact coordinate lookups are all pushed down to GIST-indexed geometry columns. Database triggers compute geometry from latitude and longitude on insert and update, keeping the application layer free of spatial math. I evaluated Elasticsearch for search but the listing volume did not justify the operational overhead. PostgreSQL full-text search with English stemming handles it well at this scale." },
          { type: "text", html: "Four-role RBAC baked into JWT claims. Admin, broker, agent, and consumer roles, each with different visibility into listings, search results, and analytics. The brokerage owner needed to control who saw pre-market listings. JWT claims carry role, agent ID, broker ID, and office ID so every handler enforces permissions without additional database lookups. Refresh tokens are stored as bcrypt hashes, invalidated after use via rotation, and cleaned up on password change." },
          { type: "text", html: "Combined repository pattern over a dependency injection framework. Instead of injecting separate listing and property repositories into each usecase, I composed them into a CombinedListingRepository that satisfies multiple domain interfaces. This keeps dependency injection explicit and testable without pulling in a container framework. Go's interfaces made this natural." },
        ],
      },
      {
        heading: "What Was Hard",
        blocks: [
          { type: "text", html: "Listing state machine with audit compliance. Real estate listings have legally significant status transitions. You cannot move a listing from sold back to active, and every transition needs an audit trail. I built a state machine in the service layer that validates transitions against an allowed-transitions map and logs every change with the old value, new value, user, timestamp, IP, and user agent. Getting the edge cases right for expired listings being relisted and withdrawn listings being reactivated took more iteration than expected." },
          { type: "text", html: "IDX feed sync reliability. The system syncs with external MLS sources on 15-minute intervals via RETS and RESO APIs. These feeds are inconsistent. Fields change names between MLS providers, timestamps vary in format, and connections drop. I built per-provider adapters with detailed sync logs that track records created, updated, deleted, and errored per run, so the brokerage owner can see exactly what happened on every sync cycle. Retries with exponential backoff handle transient failures." },
          { type: "text", html: "Balancing enrichment sources. The system auto-enriches listings with Zillow estimates, tax records, and property details on address entry. But third-party data is unreliable. Zillow estimates lag, tax records have different update schedules per county, and rate limits vary. I built a cache-first enrichment layer where each data source has its own TTL and staleness threshold, so the UI always shows the best available data without blocking on slow or unavailable APIs." },
        ],
      },
      {
        heading: "The Result",
        blocks: [
          { type: "text", html: "The platform is deployed via Coolify with staging and production environments. The brokerage has a central listing system with role-based access, geospatial search, auto-enrichment, 7 analytics dashboards, and a full audit trail, replacing the group texts and spreadsheets that were losing them deals. The Go backend deploys as a 20-megabyte Alpine container with 47 configurable environment variables following 12-factor app conventions." },
          { type: "text", html: "The engagement is ongoing. The next phase is wiring the platform into the brokerage's CRM and client engagement tools to close the loop between listings, leads, and agent activity, building toward a single dashboard where the brokerage owner sees pipeline, production, and commissions in one screen instead of five disconnected tools." },
        ],
      },
    ],
  },

  {
    title: "Memory Care and Assisted Living Search Platform",
    slug: "memory-care-platform",
    impact: "Built a 26,000-listing care discovery platform from scratch, from data pipeline to production deployment",
    overview: "My family went through the memory care search process and the information landscape was terrible. State registries publish facility data in incompatible formats. Google results are dominated by referral agencies that get paid to steer families. Actual facility details like what care types they handle, whether they accept Medicaid, and staff-to-resident ratios are scattered, outdated, or missing entirely. Families making the hardest decision of their lives are doing it with bad data.",
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership. Product direction, architecture, data pipeline, frontend, backend, infrastructure, and deployment. This is a personal project, not client work. I defined the problem, designed the system, and built every piece of it. It has been in active development for over a year." },
          { type: "text", html: "I built this because my family went through the search process and I saw how broken it was firsthand. The people using this platform are families in crisis, often an adult child who just learned their parent cannot live alone anymore. They are not power users. Every design decision started from that: the information has to be trustworthy, the filters have to surface what actually matters for care, and the UI cannot get in the way of someone who is overwhelmed." },
        ],
      },
      {
        heading: "Approach",
        blocks: [
          { type: "text", html: "Monorepo with two workspaces using pnpm and Turbo." },
          {
            type: "list",
            items: [
              "Backend: Express 5 with Zod-validated routes, MongoDB with Mongoose, Redis and Bull job queues, S3 storage, and Socket.io for real-time admin features. 24 database models, 25 route handlers.",
              "Frontend: React Router 7 with SSR, Tailwind v4, shadcn/ui, Jotai for search state, TanStack React Query, Google Maps integration, TipTap rich text editor, and Recharts for analytics dashboards.",
            ],
          },
          { type: "text", html: "Four user roles: admin, provider for facility operators who claim and manage listings, advertiser for auction-based ad campaigns with geo-targeting, and seeker for families. Each role has its own dashboard, permissions, and workflow. Providers go through a verification flow to claim facilities via domain-based auto-approval, verification codes sent to facility email, or document upload for admin review." },
          { type: "text", html: "Deployed via Docker on Coolify with Cloudflare for ingress and Traefik as reverse proxy. Staging and production environments with environment-aware configuration." },
        ],
      },
      {
        heading: "Data Pipeline",
        blocks: [
          { type: "text", html: "The platform lives or dies on data quality. I built a multi-source ingestion pipeline that pulls from six state registries: Washington DSHS, Oregon DHS, California CDSS, Nevada DPBH, Montana DPHHS, and Idaho IDHW, plus CMS federal nursing home data. Each state publishes in a different format: CSV, HTML tables, PDFs, or APIs. Each adapter handles parsing, normalization, and deduplication independently." },
          { type: "text", html: "Enrichment workers run on Bull job queues and fill in what the registries do not provide." },
          {
            type: "list",
            items: [
              "Web scraping via Cheerio pulls facility websites for amenities, photos, and descriptions.",
              "Google Places API fills in coordinates, ratings, and photos.",
              "LLM-powered field extraction maps free-form facility descriptions to structured attributes like care types, security features, and room configurations.",
              "Three caching layers for scrape cache, Google cache, and LLM cache control API costs and respect rate limits.",
            ],
          },
          { type: "text", html: "A deduplication service reconciles overlapping data. The same facility can appear in a state registry, CMS federal data, and a Google Places result. The system merges these into a single canonical listing with source tracking. The pipeline currently maintains approximately 26,000 listings." },
        ],
      },
      {
        heading: "Key Decisions",
        blocks: [
          { type: "text", html: "MongoDB over PostgreSQL. Facility data is deeply nested and varies wildly by source. Rooms have features, staff have specializations, medical capabilities are arrays of enums, security features differ by facility type. A relational schema would mean dozens of join tables for what is naturally a document. MongoDB's document model maps directly to this shape. Geospatial indexing on coordinates handles location queries without PostGIS." },
          { type: "text", html: "Map viewport drives the query. All three view modes — list, split, and map — query the same geographic area using viewport bounds. Panning and zooming the map loads new data for the visible area. This sounds simple but the implementation was not. I had to handle search lifecycle across view-mode switches, progressive expansion that widens query bounds by 10 miles per click, accumulated result deduplication, and debounced map-idle events to prevent query cascades. Search state lives in Jotai atoms so it survives navigation." },
          { type: "text", html: "Bull job queues for enrichment. Enrichment is slow and failure-prone. Web scraping breaks, APIs rate-limit, and LLM inference takes seconds per record. Bull and Redis give me retry logic with backoff, rate limiting, progress tracking, and the ability to pause and resume enrichment runs without losing state. I can enrich 26,000 listings without babysitting the process." },
          { type: "text", html: "Zod for runtime validation and OpenAPI generation. Every route validates input with Zod schemas. The same schemas generate OpenAPI documentation automatically. This eliminated an entire class of bugs where the frontend sent data the backend did not expect." },
        ],
      },
      {
        heading: "What Was Hard",
        blocks: [
          { type: "text", html: "State registry parsing. Every state publishes facility data differently. Washington gives you a decent CSV. California publishes HTML tables that change format without notice. Some states embed data in PDFs. Each adapter is its own mini-project with its own failure modes. When a state changes their page layout, the scraper breaks silently. I built health checks that flag stale data so I know when an adapter needs attention." },
          { type: "text", html: "LLM enrichment at scale. Facility websites describe their services in free-form text. A phrase like we welcome residents with memory challenges in a secure homelike setting needs to map to structured attributes: care types includes memory care, security features includes secured environment. I use LLM-powered extraction for this, but the output needs validation. The model sometimes hallucinates attributes. Every LLM result passes through a Zod schema before it touches the database. Results are cached so I am not paying per-record on re-runs." },
          { type: "text", html: "Search UX across three view modes. List, split-panel, and full-map views all need to show the same data, respond to the same filters, and stay in sync when switching between them. The edge cases were brutal. What happens to expanded results when you switch from list to split? What if the map viewport captures a different area than the expansion bounds? I ended up with a detailed state architecture spec just for search, and rewrote the system twice before it felt right." },
        ],
      },
      {
        heading: "The Result",
        blocks: [
          { type: "text", html: "The platform is deployed to staging with approximately 26,000 facility listings across six states. 79 filterable dimensions across 10 categories: care type, medical capabilities, security features, staffing ratios, room preferences, end-of-life care, location, price, availability, and lifestyle amenities. Three view modes with viewport-driven data loading and progressive radius expansion." },
          { type: "text", html: "Beyond search, the platform includes a facility comparison tool for side-by-side comparison of up to 3 facilities, loved one profiles with care recipient assessments that can be exported as PDF for facility tours, a provider dashboard with claim verification and profile completion tracking, an advertiser platform with auction-based bidding and geo-targeted campaigns, an inquiry messaging system with email notifications, a cost estimator, and an article system with MDX content." },
          { type: "text", html: "This was a large project that touched data engineering with multi-source pipelines, LLM enrichment, and deduplication, full-stack product development with four user roles and payment systems, and infrastructure with Docker and Coolify CI/CD. It is not finished, the backlog has real items from QA walkthroughs and provider onboarding sessions, but the core system works and the data pipeline runs." },
        ],
      },
    ],
  },

  {
    title: "Therapist Practice Portal",
    slug: "therapist-portal",
    impact: "Replaced Calendly, Mailchimp, and Google Docs with one unified system a therapist actually controls",
    overview: "A hypnotherapist in private practice was managing her entire client lifecycle across disconnected tools: Calendly for scheduling, Mailchimp for outreach, Google Docs for session notes, and manual email threads for everything in between. None of it talked to each other, and none of it understood the therapeutic relationship. She needed one system where booking, messaging, content delivery, and client history all lived together, and where the boundaries of her practice were reflected in how the software actually worked.",
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership. From discovery conversations with the therapist through architecture, implementation, deployment, and ongoing iteration. I made every technical decision: stack selection, data modeling, integration strategy, auth approach, payment flow design. The therapist's input shaped the domain rules. The engineering was entirely mine." },
          { type: "text", html: "The therapist is a solo practitioner with no office manager, no tech support, and no admin staff. She was duct-taping Calendly, Mailchimp, and Google Docs into a workflow that constantly leaked context between tools. I did not just replace those tools. I built around how her practice actually works. Therapeutic relationships have stages: discovery, intake, ongoing care. The software needed to understand and enforce those stages rather than treating every client the same way a generic scheduling app would." },
        ],
      },
      {
        heading: "Approach",
        blocks: [
          { type: "text", html: "React Router 7 frontend with NestJS API and PostgreSQL. The frontend handles three distinct surfaces: public booking pages, a client dashboard, and a therapist admin portal, all server-rendered through nested routes. NestJS provides the structured backend with modular separation across auth, bookings, messaging, content, notifications, availability, Stripe payments, and Google Calendar integration. TypeORM manages the schema with explicit migrations." },
          { type: "text", html: "I chose this stack because the system needed SSR for public pages, real-time data for the dashboards, and enough backend structure to support a dozen modules without the code becoming a maze. NestJS's module system gave me clean boundaries between booking logic, payment processing, calendar sync, and messaging, each with its own service, controller, and test suite." },
          { type: "text", html: "Directus as a headless CMS for articles, podcasts, and static site content. Twenty CRM, open-source and self-hosted, for client relationship tracking. Both integrate through the NestJS API layer so the frontend never touches them directly." },
        ],
      },
      {
        heading: "Key Decisions",
        blocks: [
          { type: "text", html: "The discovery gate as a domain boundary, not a product limitation. Anonymous visitors can only book a free 20-minute discovery call. Paid session types are locked until a discovery completed timestamp is set on the user record. This is not a paywall. It is how this therapist actually works. She does not take clients she has not spoken with. I encoded that boundary in the data model, enforced it in the API guards, and reflected it in the UI state. The system understands that the therapeutic relationship has stages." },
          { type: "text", html: "Guest booking with optional account creation. A prospective client can book a discovery call without creating an account, just name, email, and phone. After booking, they get a magic link to optionally create an account for their dashboard. I rejected requiring registration upfront because it adds friction at exactly the moment someone is making a vulnerable decision. The booking itself creates the user record. The account is just access to it." },
          { type: "text", html: "Magic-link authentication over passwords. Passwordless login via Resend with SMTP fallback. 32-byte tokens, SHA-256 hashed in the database, single-use, 15-minute expiry. Silent success on unknown emails to prevent enumeration. For a therapy practice where clients log in infrequently, magic links remove the forgotten password problem entirely." },
          { type: "text", html: "Stripe Checkout over embedded payment forms. Paid bookings redirect to Stripe-hosted checkout rather than processing cards in my UI. The booking is created with pending payment status, Stripe handles PCI compliance, and a webhook confirms the booking and fires all side-effects: emails, in-app notifications, Google Calendar event creation, and a welcome message thread. I return 200 on webhook errors with idempotency guards to prevent Stripe retries from creating duplicate bookings." },
        ],
      },
      {
        heading: "What Was Hard",
        blocks: [
          { type: "text", html: "Google Calendar bidirectional sync. The therapist manages her life in Google Calendar, and her availability in the booking system needed to reflect that. Bookings push events to Google Calendar with automatic Google Meet links for virtual sessions. Google Calendar events pull back as blocked dates so personal appointments reduce available booking slots. The sync runs every 15 minutes via cron, paginates through up to 120 days of events, handles all-day versus timed events differently, and does a full delete-and-recreate on each cycle to avoid stale timezone data. OAuth token refresh, revocation on disconnect, and graceful degradation when the Google API is unreachable all needed to work correctly. This was the most integration-heavy feature in the project." },
          { type: "text", html: "Double-booking prevention under concurrent requests. Two clients selecting the same slot at the same time. I used a unique database constraint on date plus start time for non-cancelled bookings, wrapped the insert in a serializable transaction with row-level locking, and return a 409 with a friendly message if the slot was taken between page load and submission. Simple in concept, but getting the transaction isolation right with TypeORM required careful testing." },
          { type: "text", html: "Side-effect orchestration on booking confirmation. When a booking is confirmed, five things fire asynchronously: confirmation email to client, notification email to therapist, in-app notification records for both, Google Calendar event creation, and a welcome message thread for first-time clients. All are fire-and-forget so the user gets instant feedback, but each failure path needed to be logged and non-blocking. Getting the error handling right, especially when Google Calendar or Resend is temporarily down, took more iteration than the happy path." },
        ],
      },
      {
        heading: "The Result",
        blocks: [
          { type: "text", html: "The therapist manages her entire practice from one system. Clients book sessions, see their appointment history, receive personalized content including audio recordings, worksheets, guided meditations, and links, and message their therapist through a single portal that reflects the actual structure of a therapeutic relationship." },
          { type: "text", html: "The backend has 17 NestJS modules, explicit TypeORM migrations, structured logging, rate limiting, and 225 test files across the project. Booking confirmation orchestrates five async side-effects. The content feed supports four media types with per-client visibility and optional session linking. Six branded HTML email templates handle the full notification lifecycle." },
          { type: "text", html: "What makes this project different from a generic scheduling app is that the domain rules are in the code, not bolted on. The discovery gate, the messaging access progression, the therapist-only content uploads, the client isolation: these are not configuration toggles. They are the data model. The system does not just schedule appointments. It understands that a therapeutic practice has structure, and it enforces that structure at every layer." },
        ],
      },
    ],
  },

  {
    title: "Fly Fishing Guide Booking Platform",
    slug: "fly-fishing-guide",
    impact: "Replaced text-message scheduling with a cross-filtering booking wizard",
    overview: "A Sacramento-area fly fishing guide had been managing his entire booking pipeline over text messages, losing track of dates, double-booking trips, and spending evenings juggling schedule threads instead of tying flies. He had no website, no calendar system, and no way for clients to understand what was even available without calling him. The constraint was that fly fishing availability is genuinely complex: it depends on season, target species, water body, and trip type, all of which interact. A standard date-picker booking flow would either oversimplify it or require the guide to manually maintain a matrix he did not have time for.",
    sections: [
      {
        heading: "My Role",
        blocks: [
          { type: "text", html: "Solo developer, full ownership. From initial discovery conversations through architecture, implementation, deployment, and ongoing content and infrastructure support. I made all technical decisions: stack selection, data modeling, booking flow design, payment architecture, and deployment topology. The guide's input was domain expertise, what fish are where, when, and how trips actually work. Everything else was mine." },
          { type: "text", html: "The guide is non-technical. He runs a one-person operation from his truck and his phone. He had no website, no booking system, and no interest in learning software. I built around that: a CMS he can update from his phone between trips, a booking wizard that absorbs the domain complexity his clients would otherwise need a phone call to navigate, and automated emails so he never has to manually confirm a booking again. The system had to run his business without him running the system." },
        ],
      },
      {
        heading: "Approach",
        blocks: [
          { type: "text", html: "Monorepo with four workspaces using pnpm." },
          {
            type: "list",
            items: [
              "Site: React Router 7 with SSR, Tailwind v4, shadcn/ui, Jotai for atomic state management, Stripe Elements for payment, React Email for transactional templates, and Plausible Analytics for cookieless self-hosted analytics.",
              "API: NestJS 11 backend for frontend proxying Directus, Medusa, Twenty CRM, and Stripe. The frontend never talks to any backing service directly. Credentials stay server-side, CORS is simplified, and business logic lives in one place.",
              "Ecom: Medusa v2 headless commerce engine for a gear shop with rods, flies, and accessories.",
              "CMS: Directus 11 managing trip types, guide profiles, pages, articles, and a 16-block-type page builder the guide operates himself.",
            ],
          },
          { type: "text", html: "I chose the BFF pattern because the site needs to coordinate data from five services and I wanted a single API surface with consistent error handling, validation, and auth. Docker Compose orchestrates PostgreSQL 16 and Redis 7 locally. Production runs on Coolify across two servers: the site on Hetzner for edge performance, backend services on a separate box." },
        ],
      },
      {
        heading: "The Booking Problem",
        blocks: [
          { type: "text", html: "Fly fishing trips are not like restaurant reservations or therapist appointments. You cannot just pick a date and a time slot. Availability depends on four interdependent dimensions." },
          {
            type: "list",
            items: [
              "Season: rainbow trout peaks March through May and October through November. Steelhead runs December through February. American shad appears only in May through June. Each species has a different window.",
              "Species: the guide covers 9 species across 14 water bodies in the Sacramento region. Not every fish lives in every river.",
              "Water body: some rivers are wade-only, others support drift boats. Some have seasonal access restrictions. The Lower Sacramento is a year-round tailwater. Hat Creek is technical dry-fly water with a narrow window.",
              "Trip type: wade versus float fishing, half-day versus full-day. Float trips require drift-boat-compatible water. Wade trips open up smaller creeks.",
            ],
          },
          { type: "text", html: "A standard calendar picker would either hide this complexity, forcing the guide to manually triage every booking request anyway, or present an overwhelming matrix. I needed a UI that let the user start from any dimension and have the other three narrow automatically." },
        ],
      },
      {
        heading: "Key Decisions",
        blocks: [
          { type: "text", html: "Jotai atomic state for the booking wizard over React context or a reducer. The cross-filtering logic requires derived state. When a user selects a month, available species must update. When they select a species, compatible waters must update. When they select wade or float, waters filter again. Jotai's derived atoms compute these intersections reactively without manual dependency tracking. I considered useReducer but the cascading derivations would have meant a lot of imperative logic. Context would have caused unnecessary re-renders across unrelated wizard steps." },
          { type: "text", html: "Server-side price calculation, not client-submitted. The frontend displays prices for transparency, but the create-payment-intent endpoint independently calculates the correct price from trip type and duration. The client never sends a price to the server. This means a modified client cannot manipulate the payment amount. The deposit percentage is a server-side constant, not a Stripe configuration." },
          { type: "text", html: "Normalized relational data in Directus over flat JSON. The original trip data was a flat JSON blob with string arrays for species and waters. I normalized it into three Directus collections with many-to-many relations to trips. This let the guide add a new water body or species without touching code, and it gave the booking wizard a proper data model to query against. The alternative was hardcoding the availability matrix in the frontend, which would have been faster to build but impossible for the guide to maintain." },
          { type: "text", html: "20% deposit at booking, remainder day-of. This was the guide's existing business model and I kept it. Stripe creates a payment intent for the deposit only. The remaining balance is collected in person. I considered full prepayment as the simpler option, but the guide's clients expect to pay day-of and the guide did not want to handle refund logistics for weather cancellations through Stripe." },
          { type: "text", html: "Guide's Pick as a filter escape hatch. Both the fish and water selection steps include a Guide's Pick option that breaks the filter chain. When selected, it tells the guide to choose based on real-time conditions: water levels, hatch reports, weather. This was essential because the most experienced clients do not want to constrain the guide. They trust his judgment. Without it, every booking would force a specificity the domain does not require." },
        ],
      },
      {
        heading: "What Was Hard",
        blocks: [
          { type: "text", html: "Modeling the availability matrix accurately. The fish-water-season relationships are not simple lookups. Rainbow trout on the Lower Sacramento is a year-round tailwater fishery, but rainbow trout on the Upper Sacramento is a seasonal freestone fishery with a completely different window. The same species on different water has different availability. I had to model availability at the junction level — fish plus water plus month — not at the species level. This tripled the data entry for the guide, so I pre-seeded the matrix from his existing knowledge and built the Directus UI to make updates manageable." },
          { type: "text", html: "Making the wizard feel simple despite the complexity. Eight steps sounds like a lot. Early versions felt like a form interrogation. I iterated on the step ordering — month first, then party size, then trip type, then species and water — so the heaviest filtering happens after the user has already committed to the easy choices. The Guide's Pick escape on species and water means most casual bookers only make 4 real decisions. Power users who know exactly what they want can be specific." },
          { type: "text", html: "Deploying across two servers. The site runs on Hetzner while the API, CMS, ecom, and database run on a separate box. Coolify manages both, but coordinating Docker Compose deployments across two hosts with different production compose files required careful environment separation. I would consolidate to one server if I were starting over. The performance gain was not worth the operational complexity for a site this size." },
        ],
      },
      {
        heading: "The Result",
        blocks: [
          { type: "text", html: "The platform is live. The guide manages all content through Directus without touching code. Bookings flow through the wizard with Stripe deposit collection and automated email confirmations to both the client, with trip details, deposit receipt, and a what-to-bring checklist, and the guide, with client contact info and preferences." },
          { type: "text", html: "The guide stopped losing bookings to forgotten text threads. Clients can see what is actually available for their dates without calling first. The cross-filtering wizard handles the domain complexity that would otherwise require a phone conversation: season, species, water, and trip type all narrow in real time. SEO infrastructure is in place with SSR, structured data, a sitemap, and meta tags, with a content strategy built around fishing reports and location-specific articles to drive organic traffic over time." },
          { type: "text", html: "Current status: production, ongoing maintenance and content support. The ecom shop via Medusa and Google Calendar sync are in the backlog but not yet live." },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Generate audio
// ---------------------------------------------------------------------------
async function tts(slug, text) {
  console.log(`Generating: ${slug}`);
  const wavPath = join(OUT, `${slug}.wav`);
  const mp3Path = join(OUT, `${slug}.mp3`);

  const payload = JSON.stringify({ text, voice: VOICE });
  writeFileSync("/tmp/tts-payload.json", payload);

  execSync(
    `curl -sf "${KOKORO}" -X POST -H "Content-Type: application/json" -d @/tmp/tts-payload.json -o "${wavPath}"`,
    { stdio: "inherit" }
  );
  execSync(
    `ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 4 "${mp3Path}" 2>/dev/null`,
    { stdio: "inherit" }
  );
  unlinkSync(wavPath);

  const size = execSync(`du -h "${mp3Path}" | cut -f1`).toString().trim();
  console.log(`  done: ${size}`);
}

for (const study of caseStudies) {
  await tts(study.slug, narrate(study));
}

console.log("\nDone. Files in", OUT);
execSync(`ls -lh ${OUT}/*.mp3`, { stdio: "inherit" });
