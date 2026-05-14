#!/usr/bin/env bash
# Run this ON MILOTRON: bash /tmp/generate-work-audio.sh
# Then scp /tmp/work-audio/*.mp3 back to public/audio/work/

set -euo pipefail

KOKORO="http://localhost:8880/tts"
VOICE="af_sky"
OUT="/tmp/work-audio"
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

tts "glassblowing-studio" "Glassblowing Studio Digital Platform. Unified five services behind one platform two artists can actually operate.

A Detroit glassblowing studio was preparing to open its doors with no digital presence and no technical staff. The owners are artists. They needed a system that could handle class enrollment, e-commerce, a gallery, event listings, email outreach, and a CRM without requiring them to learn software or manage multiple accounts. The project also had to support three distinct business phases: a pre-construction awareness site, a soft launch, and full operations with classes and a student portal.

I built a monorepo with four workspaces: a React Router 7 frontend with SSR, a NestJS backend for frontend that proxies all services, a Medusa v2 commerce engine, and Directus for content management. The frontend never talks to any backend service directly. Everything goes through NestJS, which handles auth, validation, credential management, and cross-service orchestration.

The most important architectural decision was the studio open and closed gating system. A single boolean in Directus controls the entire transactional surface. When closed, the site builds audience with a founding list. When open, every booking and checkout feature activates. Rather than maintaining two separate sites, one toggle controls the experience. The awareness-phase site is live. Class enrollment, tiered refund cancellations, waitlist auto-promotion, and the student portal are all production-ready."

tts "real-estate-mls" "Internal Listing Intelligence Platform for a Real Estate Brokerage. Gave brokers early visibility into off-market listings before they hit public MLS.

A 10-agent real estate brokerage was losing deals because listing intel traveled by group text, spreadsheets, and hallway conversations. By the time a broker heard about an off-market or coming-soon property, the window had closed. They needed an internal system where brokers and agents could see listings before they hit the public MLS, with search, enrichment, and role-based visibility. They had no engineering resources and no budget for enterprise MLS software.

I built a Go backend with clean architecture, four strict layers with no framework magic. PostgreSQL with PostGIS handles the data layer, with a 618-line initial migration covering 20 tables. Listings use a state machine with transitions validated in the service layer and logged to a status history table for audit compliance. The React 19 frontend includes 7 analytics views, advanced multi-faceted search, Zillow auto-enrichment on address entry, and a Google Sheets sync for agents who still want spreadsheets.

The most consequential decision was choosing Go over Node for the backend. The system handles real-time listing data, geospatial queries, and IDX feed syncing on 15-minute intervals. Go gave me type safety at compile time, a 20-megabyte Alpine container for deployment, and native concurrency for the sync workers. The platform replaced the group texts and spreadsheets that were losing deals. This is an ongoing 24-month retainer engagement."

tts "memory-care-platform" "Memory Care and Assisted Living Search Platform. Built a 26,000-listing care discovery platform from scratch, from data pipeline to production deployment.

My family went through the memory care search process and the information landscape was terrible. State registries publish facility data in incompatible formats. Google results are dominated by referral agencies that get paid to steer families. Actual facility details — care types, Medicaid acceptance, staff ratios — are scattered, outdated, or missing. Families making the hardest decision of their lives are doing it with bad data. I built this because I saw how broken it was firsthand.

The platform pulls from six state registries across Washington, Oregon, California, Nevada, Montana, and Idaho, plus CMS federal nursing home data. Each state publishes in a different format: CSV, HTML tables, PDFs, APIs. Enrichment workers run on Bull job queues filling in what the registries do not provide: web scraping for amenities, Google Places for coordinates and ratings, and LLM-powered field extraction mapping free-form facility descriptions to structured attributes. A deduplication service reconciles overlapping data from multiple sources into single canonical listings.

The result is a platform with 26,000 facility listings, 79 filterable dimensions across 10 categories, and three view modes with viewport-driven data loading. Beyond search, the platform includes a facility comparison tool, loved one profiles exportable as PDF, a provider dashboard with claim verification, an advertiser platform with auction-based bidding, and an inquiry messaging system. This is an ongoing personal project and the core system works."

tts "therapist-portal" "Therapist Practice Portal. Replaced Calendly, Mailchimp, and Google Docs with one unified system a therapist actually controls.

A hypnotherapist in private practice was managing her entire client lifecycle across disconnected tools. None of it talked to each other, and none of it understood the therapeutic relationship. She needed one system where booking, messaging, content delivery, and client history all lived together, with the boundaries of her practice reflected in how the software actually worked.

I built a React Router 7 frontend with NestJS API and PostgreSQL. The system has three distinct surfaces: public booking pages, a client dashboard, and a therapist admin portal. NestJS provides structured separation across auth, bookings, messaging, content, notifications, availability, Stripe payments, and Google Calendar integration.

The defining architectural decision was the discovery gate. Anonymous visitors can only book a free 20-minute discovery call. Paid session types are locked until a discovery completed timestamp is set on the user record. This is not a paywall. It is how this therapist actually works. She does not take clients she has not spoken with. I encoded that boundary in the data model, enforced it in the API guards, and reflected it in the UI state. The system understands that the therapeutic relationship has stages.

The backend has 17 NestJS modules, explicit TypeORM migrations, and 225 test files. What makes this project different from a generic scheduling app is that the domain rules are in the code, not bolted on."

tts "fly-fishing-guide" "Fly Fishing Guide Booking Platform. Replaced text-message scheduling with a cross-filtering booking wizard.

A Sacramento-area fly fishing guide had been managing his entire booking pipeline over text messages, losing track of dates, double-booking trips, and spending evenings juggling schedule threads instead of tying flies. He had no website, no calendar system, and no way for clients to understand what was available without calling him. The constraint was that fly fishing availability is genuinely complex: it depends on season, target species, water body, and trip type, all of which interact.

I built a monorepo with four workspaces: a React Router 7 site with SSR, a NestJS backend for frontend proxying all services, a Medusa v2 commerce engine for a gear shop, and Directus managing trip types and a 16-block-type page builder the guide operates himself.

The core challenge was the booking wizard. Availability depends on four interdependent dimensions: season, species, water body, and trip type. I used Jotai atomic state for the cross-filtering logic, where derived atoms compute valid options reactively as the user selects each dimension. The guide covers 9 species across 14 water bodies in the Sacramento region, not every fish lives in every river, and some trips require drift-boat-compatible water. I also added a Guide's Pick option that breaks the filter chain entirely, because the most experienced clients trust his judgment over their own constraints.

The guide stopped losing bookings to forgotten text threads. The cross-filtering wizard handles the domain complexity that would otherwise require a phone conversation. The platform is live and in active use."

echo ""
echo "Done. Files in $OUT:"
ls -lh "$OUT"/*.mp3
