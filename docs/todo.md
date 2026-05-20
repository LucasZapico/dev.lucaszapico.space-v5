# TODO — dev.lucaszapico.space v5

## GitHub Profile
- [ ] Update bio (needs `gh auth refresh -h github.com -s user`)
    - "Senior full-stack engineer — TypeScript, Go, Python, React Router, NestJS. Building at bluemonkeymakes.com"
- [ ] Update profile README — currently references bluemonkeymakes client repos that are private; adjust wording
- [ ] Pin repos (interim): mailautumn, docker-recipes, ansible-recipes, gradient-galore, colorpicker-on-a-curve, lowpm

## Showcase Starter Repos
Create from client work — gut client data, keep architecture. Pin once ready.
- [ ] Go clean-architecture starter (from bhreco MLS)
- [ ] React Router 7 + NestJS + Stripe starter (from eastsideartglass/gatewaysofthemind)
- [ ] React Router 7 + MDX content site starter
- [ ] Data pipeline starter with Redis/Bull (from silverlfe)

## Site
- [ ] Contact form backend (server action or external service)
- [ ] Articles content (phase 2)
- [ ] Remove or hide /docs route before production
- [x] OG image — static `/og-image.png` (1200×630), wired into `generateMeta()` with width/height/alt + twitter:image
- [x] Analytics — Plausible wired via `@plausible-analytics/tracker` + loader env vars
- [ ] Coolify: add `PLAUSIBLE_DOMAIN=dev.lucaszapico.space` and `PLAUSIBLE_API_HOST=https://plausible.io`
- [ ] Article summary audio snippets — title + summary only (~15s each), skip full narration since code blocks are the substance; new generate-articles-audio.mjs following work audio pattern

## Responsive + Accessibility Pass
From the 2026-05-14 audit. Blockers first, then should-fix, then nice-to-have.

### Blockers
- [ ] `app/components/case-study/case-hero.tsx:35` — typo `setActiiveIndex` breaks slideshow at runtime; rename to `setActiveIndex`
- [ ] `app/components/case-study/case-hero.tsx:106-115` — slideshow dot buttons are h-1.5 with no padding (touch target ~6×24px) and no `aria-label` ("Go to slide N")
- [ ] `app/components/layout/site-header.tsx:22` — `mix-blend-difference` over `bg-black/90` can render nav invisible on light-themed hero areas; verify or use solid bg
- [ ] `app/components/common/site-effects.tsx:38-62` — custom corner-bracket cursor renders on touch devices; guard with `@media (hover: hover) and (pointer: fine)`
- [ ] `app/components/common/floating-nav.tsx:19` — fixed nav at `top-1/2` overlays body content on phones; hide on small screens or move inline
- [ ] `app/components/case-study/screenshot.tsx:9,31` — negative margins cause horizontal overflow on small viewports (masked by `body { overflow-x-hidden }`)
- [ ] `app/components/case-study/case-section.tsx:11,20` — `dangerouslySetInnerHTML` content without `break-words`; long URLs overflow horizontally
- [ ] `app/root.tsx` + `app/routes/layout.tsx` — no skip-to-content link, no `<main id="main-content">` landmark
- [ ] Reduced motion pass — no component respects `prefers-reduced-motion` (typewriter, slideshow auto-advance, lab demos, scanline animations)

### Should-fix
- [ ] Icon buttons under 44×44px WCAG touch target — theme toggle, header menu button, audio player play/pause + speed
- [ ] `app/components/common/audio-player.tsx:87-94` — seek bar is a `<div>` with onClick, not keyboard accessible (no `role="slider"`, no tabIndex, no key handler). Convert to `<input type="range">` or proper aria-slider
- [ ] `app/components/common/project-slideshow.tsx` — hover-only trigger means touch + keyboard users see nothing; add focus trigger and button-style indicators
- [ ] `app/components/common/floating-nav.tsx` — prev/next anchors lack `aria-label`; SR announces only arrow glyph
- [ ] `app/routes/articles.$slug.tsx:65` — breadcrumb title silently truncated at `max-w-[200px]`; allow wrap on mobile + add `title` attr
- [ ] `app/root.tsx:41` — `<body className="overflow-x-hidden">` masks underlying overflow bugs; remove after fixing screenshot.tsx margins
- [ ] Heading order — `SectionLabel` always renders `<h2>` regardless of context; add `as` prop or distinguish levels
- [ ] Breadcrumb `<nav>` elements missing `aria-label="Breadcrumb"` (articles + work slug routes)
- [ ] `app/components/common/code-block.tsx` — long code regions need `aria-label` for screen readers
- [ ] Page-level containers use `px-4` only; consider `px-4 sm:px-6 md:px-8` for breathing room on small phones

### Nice-to-have / for review
- [ ] Color contrast: `text-foreground/40-/60` and `text-muted-foreground/60` on body text likely fail WCAG AA; measure and adjust tokens or stop scaling opacity on small text
- [ ] Active nav link distinguished only by opacity; add `aria-current="page"` + non-color indicator (underline)
- [ ] Audio player has no transcript/caption — fails WCAG 1.2.1 if audio carries information
- [ ] `app/components/common/typography.tsx:11-12` — H1 caps at `lg:text-6xl`; long words ("Glassblowing") can overflow narrow grid columns. Add `break-words`

## Articles — Project-Specific Technical Deep Dives
Pull from actual work. Each one should be the kind of thing only someone who built the thing could write.
- [ ] bhreco MLS — designing a four-role RBAC + listing state machine in Go clean architecture
- [ ] bhreco MLS — PostGIS geospatial search at scale (indexes, query shape, why ST_DWithin over ST_Distance)
- [ ] eastsideartglass — NestJS BFF proxying five services behind one API surface
- [ ] eastsideartglass — magic-link auth without losing your soul
- [ ] memory-care platform — 79-filter discovery UI without a search service (Mongo aggregation pipeline)
- [ ] memory-care platform — six-state-registry ingestion pipeline with LLM enrichment
- [ ] therapist portal — threaded messaging that doesn't accidentally become a chat app
- [ ] therapist portal — Stripe + Google Calendar dual-write without distributed transactions
- [ ] fly-fishing booking — preference-based booking wizard with cross-filtering (season/species/water/trip)
- [ ] silverlfe — Redis/Bull job pipeline patterns that survive restart

## For Review — Site Games (do these add value?)
Open question. Could read as playful + demonstrates frontend chops, or could read as filler.
- [ ] Space Invaders
- [ ] Snake
- [ ] Minesweeper
- [ ] Decision: ship one polished or all three rough, or skip entirely? Consider hiding behind `/lab` (it's already an experimental surface) so it doesn't compete with case studies for hiring-manager attention

## Lab — Parallax Flowers (shelved 2026-05-15)
Component built and working but motion still feels stuttery. Hidden from `/lab` for now; circle back to make it feel buttery before re-enabling.
- Files kept: `app/components/lab/scroll-parallax.tsx`, `public/lab/flower.svg`
- Current state: 6 layers, lerp-based easing (per-layer ease 0.105–0.175), `contain: layout paint`, no blur
- [ ] Investigate why scroll input still feels chunky despite rAF lerp loop — possibly modal's `overflow-y: auto` snap, possibly trackpad vs wheel input differences. Try smooth-scroll polyfill (Lenis-style) on the modal scroll container instead of per-layer easing
- [ ] Try `transform: translateZ(0)` on the layer wrapper, not just children, to force a single composite layer for the whole parallax group
- [ ] Consider `<img src="/lab/flower.svg">` over inline SVG — browsers cache rasterized images better than re-rasterizing SVG paths each layer
- [ ] Profile with Chrome perf panel during the stutter — look for long paint/composite frames

## For Review — Sticky Bottom Bar (idea)
Persistent thin bar at bottom of viewport with a couple of playful affordances. Low commitment, dismissible.
- [ ] "Tell me a developer joke" button — pulls from a local joke database (JSON), rotates on click, maybe with a copy-to-clipboard. No external API needed.
- [ ] "Play a game" entry point — single button that links to `/lab` games (Space Invaders / Snake / Minesweeper) if those ship
- [ ] Dismissible with localStorage so it doesn't nag returning visitors
- [ ] Decision: does this clash with the serious-portfolio tone, or reinforce the "playful + competent" angle? Could live only on `/lab` rather than site-wide to keep case-study pages clean
