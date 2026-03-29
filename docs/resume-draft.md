# Lucas Zapico

career.lucaszapico@gmail.com | dev.lucaszapico.space | linkedin.com/in/lucasmmzapico

---

Full-stack engineer with 8+ years building web platforms end-to-end — from database schema to deployment pipeline. I do my best work at startups and small teams where I own problems across the stack. Recent work: React Router 7, Go, NestJS, PostgreSQL, MongoDB, Redis, Stripe integrations, and data pipelines.

---

## Technical Skills

**Languages:** TypeScript, JavaScript, Go, Python, SQL
**Frontend:** React 19, React Router 7, Tailwind CSS, Radix UI, shadcn/ui, Jotai, Zustand, TanStack Query
**Backend:** NestJS, Express, Go (Chi), Node.js, REST API design, Stripe, OAuth 2.0, JWT
**Databases:** PostgreSQL (PostGIS, tsvector), MongoDB (GeoJSON), Redis, Bull job queues
**Commerce & CMS:** Medusa v2, Directus, Sanity, Strapi
**Infrastructure:** Docker, Coolify, Traefik, Cloudflare, CI/CD, pnpm monorepos, Turborepo

---

## Experience

### Full-Stack Engineer (Independent) — 2020 - Present

Architect, build, and deploy full-stack platforms for small businesses and startups. Own the entire lifecycle: requirements, system design, database modeling, API development, frontend, auth, payments, and production infrastructure.

#### SilverLife — Memory Care Search Platform (Founder/Engineer, 2024-Present)

A Zillow-style discovery platform for memory care and assisted living across the Pacific Northwest. Built from firsthand experience navigating a fragmented, outdated system while finding care for a family member.

- Built multi-source data pipeline ingesting from 6 state registries (WA, OR, CA, NV, MT, ID), enriching via web scraping, Google Places API, and LLM-powered field extraction
- Designed 79-dimension faceted search with MongoDB GeoJSON indexing for radius and bounding-box queries
- Architected Express 5 backend with Zod-validated routes, Bull job queues for async enrichment, and 3-layer Redis caching (scrape, Google, LLM)
- React Router 7 SSR frontend with shadcn/ui, Google Maps integration, TipTap editor, and analytics dashboards
- 24 database models, 25 route handlers, deployed via Docker on Coolify with Cloudflare Tunnel

#### Eastside Art Glass — Commerce & Operations Platform (2024)

Replaced 5 disconnected SaaS tools with a unified platform for class enrollment, e-commerce, CRM, and student portal.

- Designed BFF architecture: NestJS 11 proxying Directus CMS, Medusa v2 commerce, Stripe, and Twenty CRM behind a single API surface
- Implemented magic-link auth (HMAC-SHA256 signed tokens, single-use nonces, timing-safe comparison, rate-limited) and two-phase Stripe checkout with business-rule refund logic
- Built event-driven waitlist promotion with optimistic spot decrement to prevent overselling
- 4-workspace monorepo, PostgreSQL 16, Redis 7, 7 React Email templates, deployed via Coolify

#### BHRECo — Real Estate Listing Intelligence (2024)

Internal pseudo-MLS giving brokers early visibility into off-market and pre-market listings.

- Built Go backend with clean architecture — Chi v5 router, pgx v5 with connection pooling, strict layering, compiled to ~20MB Alpine container
- Designed PostgreSQL schema (20+ tables, 618-line migration) with PostGIS geospatial queries, full-text search (tsvector with weighted fields), and full audit logging
- Implemented four-role RBAC, bcrypt-hashed refresh token rotation, and OAuth 2.0 (Google, Facebook)
- React 19 frontend with Zustand, TanStack Query, Zod validation, and map-based listing search

#### Gateways of the Mind — Therapist Practice Platform (2023)

Secure client portal with booking, messaging, and personalized wellness content for a hypnotherapy practice.

- NestJS 10 backend with TypeORM, PostgreSQL, Stripe payments, and bidirectional Google Calendar sync via OAuth 2.0
- Multi-step booking flow with timezone-aware availability, guest checkout, and discovery-call gating as a therapeutic boundary
- Feature flags via NestJS decorator pattern, tiered rate limiting, 40+ endpoints across 14 modules
- ~210 React components, 31K lines of TypeScript

---

### Back End Developer — Kuno Creative | Jan 2022 - Sep 2022

- Built custom integrations syncing CRM data between HubSpot and third-party services via Node.js, Express, and PostgreSQL
- Implemented CI/CD pipelines and internal workflow automation

### UI Engineer (Contract) — Premera Blue Cross | Oct 2019 - Mar 2020

- Developed atomic Angular component library distributed via private npm package, achieving 20% faster frontend module delivery across all products
- Owned versioned UI kit enforcing accessibility standards and design-system compliance

### Corporate Account Specialist (Contract) — Microsoft | Feb 2019 - Oct 2019

- Built Python/Pandas analytics pipelines for 70% more efficient ad-spend data processing
- Created self-service PowerBI dashboards with Power Query for non-technical stakeholders

### Earlier: Product Manager & Designer — Catapult Interactive (2016-2017) | Web Developer — Northern Wind & Southern Sun (2017-2019)

---

## Education

**University of California, Los Angeles (UCLA)** — Mathematics (completed coursework, did not finish degree)
