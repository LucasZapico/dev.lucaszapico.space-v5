# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server with HMR
pnpm build        # production build
pnpm start        # serve the built output (after build)
pnpm typecheck    # react-router typegen + tsc
```

No test suite. No lint script. Type checking is the primary correctness check.

## Architecture

**Stack:** React Router v7 (SSR), Vite 7, Tailwind v4, shadcn/ui (new-york), Motion (Framer), pnpm.

**Route layout:** `app/routes.ts` defines the route tree. `routes/home.tsx` is standalone (no shared layout — full-bleed hero). All other routes are children of `routes/layout.tsx`, which provides the fixed header, footer, and `pt-16` body offset.

**Content model:** All content lives as typed TypeScript objects in `app/lib/` — not MDX at runtime. Three content domains:

- `app/lib/case-studies.ts` — client work portfolio (`CaseStudy[]`). Rendered by `routes/work.$slug.tsx` via `CaseSectionRenderer`.
- `app/lib/builds.ts` — personal/open source builds (`Build` record). Rendered by `routes/lab.$slug.tsx`. `buildOrder` array controls display order. The `closing` field (optional) renders a "Why this matters" section after highlights.
- `app/lib/articles.ts` — long-form articles (`Article` record). Rendered by `routes/articles.$slug.tsx`.

MDX files exist in `app/content/cases/` but are **not used for rendering** — they are reference drafts only.

**Theme:** Dark mode by default. Toggled by adding/removing `.dark` on `<html>`. Preference stored in `localStorage("theme")`. An inline `<script>` in `root.tsx` applies the class before first paint to prevent flash.

**Meta:** Use `generateMeta()` from `~/lib/meta.ts` for all route `meta()` exports. Never hardcode site metadata — use `SITE_CONFIG` from `~/lib/site-config.ts`.

**Styling conventions** (from `docs/style-guide.md`):
- Always use semantic color tokens (`bg-background`, `text-foreground`, `text-muted-foreground`) — never raw color values.
- Typography components live in `app/components/common/typography.tsx`: `H1`, `H2`, `H3`, `Lead`, `Body`, `Small`, `SectionLabel`. Use these instead of bare heading tags.
- `Section` component (`app/components/common/section.tsx`) handles vertical padding and `border-t` dividers. Padding scale: `sm | md | lg | xl`.
- Icons: Ionicons via `react-icons/io5`. Class merging: `cn()` from `~/lib/utils`.
- Animations: `FadeIn` from `app/components/common/animate.tsx` for scroll-triggered reveals. Raw CSS keyframes only for performance-critical background effects.
- Container: `max-w-6xl mx-auto px-4` on all page content.

## Deployment

Coolify handles CI/CD via GitHub App webhook — pushes to `master` deploy automatically. Never use GitHub Actions for this project. The multi-stage `Dockerfile` builds with pnpm on `node:22-alpine` and exposes port 3000.

## Adding content

**New case study:** Add a `CaseStudy` object to the array in `app/lib/case-studies.ts`. The slug must match the route param. Hero images go in `public/images/cases/`.

**New build (Lab):** Add a `Build` entry to the `builds` record in `app/lib/builds.ts` and add the slug to `buildOrder`. The `closing` field is optional — add it when the build warrants a "Why this matters" thesis paragraph.

**New article:** Add an `Article` entry to the `articles` record in `app/lib/articles.ts` and add the slug to `articleOrder`.
