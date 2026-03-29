# Style Guide — dev.lucaszapico.space v5

Design language for the portfolio site. Typography-forward, neutral palette, dark-mode default.

---

## Color System

All colors use oklch via CSS custom properties. Defined in `app/app.css` and toggled by `.dark` class on `<html>`.

### Semantic Tokens

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `background` | Page background | oklch(1 0 0) — white | oklch(0.145 0 0) — near-black |
| `foreground` | Body text | oklch(0.145 0 0) | oklch(0.985 0 0) |
| `card` | Card surfaces | oklch(1 0 0) | oklch(0.205 0 0) |
| `card-foreground` | Card text | oklch(0.145 0 0) | oklch(0.985 0 0) |
| `primary` | Buttons, links | oklch(0.205 0 0) | oklch(0.922 0 0) |
| `primary-foreground` | Text on primary | oklch(0.985 0 0) | oklch(0.205 0 0) |
| `secondary` | Secondary surfaces | oklch(0.97 0 0) | oklch(0.269 0 0) |
| `muted` | Subtle backgrounds | oklch(0.97 0 0) | oklch(0.269 0 0) |
| `muted-foreground` | Secondary text | oklch(0.556 0 0) | oklch(0.708 0 0) |
| `accent` | Hover states | oklch(0.97 0 0) | oklch(0.269 0 0) |
| `border` | Borders | oklch(0.922 0 0) | oklch(1 0 0 / 10%) |
| `destructive` | Error states | oklch(0.577 0.245 27.325) | oklch(0.704 0.191 22.216) |

### Usage Rules

- **Never use raw color values** in components. Always use semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc.)
- **Neutral palette only** for structural UI. The monochrome scheme matches the "quiet confidence" voice.
- **Hero gradient** is the only place where saturated color appears — this is intentional contrast.
- **Opacity modifiers** for layering: `bg-background/80` for glass effects, `text-white/70` for de-emphasized hero text.

### Dark Mode (Default)

- Dark mode is the default. Set via inline `<script>` in `<head>` before paint.
- Preference stored in `localStorage("theme")`. Falls back to dark.
- Toggle via `ThemeToggle` component in site header.

---

## Typography

**Font:** Inter (variable, 100–900 weight, loaded from Google Fonts)

### Scale

| Element | Class | Usage |
|---------|-------|-------|
| **Hero H1** | `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight` | Home page hero only |
| **Page H1** | `text-3xl md:text-4xl font-bold tracking-tight` | Top-level page headings |
| **Section Label** | `text-sm font-medium uppercase tracking-wider text-muted-foreground` | Section headings (e.g., "Selected Work", "What I Build") |
| **Card Title** | `text-xl font-semibold` | Card headings, project titles |
| **Card Subtitle** | `text-sm text-muted-foreground` | Category badges, metadata |
| **Body** | `text-base` (default) | Standard paragraph text |
| **Body Large** | `text-lg text-muted-foreground` | Hero descriptions, callouts |
| **Small** | `text-sm text-muted-foreground` | Footer links, nav items, captions |

### Hierarchy Rules

1. **One H1 per page.** Hero pages use the larger hero scale; inner pages use the page scale.
2. **Section labels over section headings.** Use `text-sm uppercase tracking-wider` labels instead of large H2s for section dividers — this keeps the page visually flat and scannable.
3. **Muted for secondary.** Any text that isn't the primary message uses `text-muted-foreground`.
4. **Max width for readability.** Prose blocks should use `max-w-2xl` or `max-w-3xl`. Never let body text span the full 6xl container.
5. **No decorative type.** No italic, no all-caps body text, no colored headings. Let weight and size do the work.

---

## Spacing & Layout

| Pattern | Value | Usage |
|---------|-------|-------|
| **Container** | `max-w-6xl mx-auto px-4` | All page content |
| **Section padding** | `py-24` | Vertical space between major sections |
| **Section divider** | `border-t` | Horizontal rule between sections |
| **Card padding** | `p-6` | Internal card spacing |
| **Grid gap** | `gap-8` (2-col), `gap-6` (3-col) | Card grids |
| **Button gap** | `gap-4` | Between inline buttons |
| **Stack gap** | `mt-2` (tight), `mt-4` (normal), `mt-6` (loose), `mt-8` (section-to-content) | Vertical rhythm within sections |

### Layout Patterns

- **Fixed header:** `fixed top-0 z-50 w-full` with `bg-background/80 backdrop-blur-sm`
- **Hero:** Full-bleed section (`relative min-h-[80vh]`) with absolute background, content in z-10 container
- **Inner pages:** Wrapped in layout route with `pt-16` offset for fixed header
- **Footer:** `border-t` with centered flex layout, responsive row/column

---

## Cards

### Standard Project Card

```tsx
<Link
  to={href}
  className="group rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
>
  <span className="text-sm text-muted-foreground">{category}</span>
  <h3 className="mt-2 text-xl font-semibold">{title}</h3>
  <p className="mt-2 text-muted-foreground">{description}</p>
</Link>
```

### Card Rules

- **Always interactive.** Cards are links — the entire surface is clickable.
- **Hover state:** `hover:bg-accent` — subtle background shift, no shadows or transforms.
- **Border:** `border` using the semantic `border` token. No colored borders.
- **Background:** `bg-card` — slightly elevated from page background in dark mode.
- **Radius:** `rounded-lg` (uses `--radius` from theme).
- **No images yet.** Per content strategy: "Empty image placeholders are better than fake ones." Add images only when real assets exist.

### Capability Card (Non-Interactive)

```tsx
<div className="rounded-lg border p-6">
  <h3 className="font-semibold">{title}</h3>
  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
</div>
```

- Same structure but no hover, no Link wrapper, no `bg-card` (transparent).

---

## Buttons

Uses shadcn/ui `Button` component. Available variants:

| Variant | Usage |
|---------|-------|
| `default` | Primary CTAs ("See the work") |
| `outline` | Secondary CTAs ("Start a conversation", "How I work") |
| `ghost` | Icon buttons (theme toggle, mobile menu) |
| `destructive` | Danger actions (not currently used) |

### Button Rules

- **Two-button max** per CTA group. Primary + secondary.
- **Primary left, secondary right** in horizontal layouts.
- **Hero buttons** override outline styles for white-on-gradient: `className="border-white/30 text-white hover:bg-white/10"`.
- **Icon buttons** use `size="icon"` (9x9) with `variant="ghost"`.

---

## Component Organization

```
app/components/
├── layout/          ← Header, Footer, ThemeToggle, Nav
├── common/          ← Shared components (Typography, etc.)
├── ui/              ← shadcn/ui primitives (Button, etc.)
└── [feature]/       ← Feature-specific components
```

### Conventions

- **Icons:** Ionicons via `react-icons/io5`. Import individually (e.g., `IoMenu`, `IoClose`, `IoSunny`, `IoMoon`).
- **Animations:** `motion` (framer-motion) for component animations. Raw CSS keyframes only for performance-critical background effects (hero gradient).
- **Utility:** `cn()` from `~/lib/utils` for conditional class merging.
- **Site config:** `SITE_CONFIG` from `~/lib/site-config` for site name, contact data, social links. Never hardcode site metadata in components.

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Default | < 768px | Mobile: stacked layouts, hamburger nav, single-column grids |
| `md:` | ≥ 768px | Desktop nav visible, 2-col grids, horizontal footer |
| `lg:` | ≥ 1024px | Larger hero type scale |

### Mobile-Specific

- Navigation collapses to hamburger at `md:` breakpoint
- Card grids go single-column
- Footer stacks vertically
- Hero text scales down (`text-4xl` → `md:text-5xl` → `lg:text-6xl`)
