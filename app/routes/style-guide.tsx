import { data } from "react-router";
import { H1, H2, H3, SectionLabel, Lead, Body, Small } from "~/components/common/typography";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { FadeIn, Stagger, StaggerItem } from "~/components/common/animate";
import { ProjectSlideshow } from "~/components/common/project-slideshow";
import { Section, paddingClasses, type SectionPadding } from "~/components/common/section";

// Dev-only route — 404 in production
export function loader() {
  if (process.env.NODE_ENV === "production") {
    throw data(null, { status: 404 });
  }
  return null;
}

// ---------------------------------------------------------------------------
// Color swatch helper
// ---------------------------------------------------------------------------
function Swatch({ name, value, className }: { name: string; value: string; className?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`h-16 w-full border border-border ${className ?? ""}`}
        style={{ backgroundColor: value }}
      />
      <span className="font-label text-xs text-muted-foreground">{name}</span>
      <span className="font-label text-[10px] text-muted-foreground/60">{value}</span>
    </div>
  );
}

function CSSVarSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-16 w-full border border-border"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <span className="font-label text-xs text-muted-foreground">{name}</span>
      <span className="font-label text-[10px] text-muted-foreground/60">{cssVar}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t py-16">
      <SectionLabel className="mb-8">{title}</SectionLabel>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Style Guide
// ---------------------------------------------------------------------------
export default function StyleGuidePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-16">
        <H1>Style Guide</H1>
        <Lead className="mt-4 max-w-2xl">
          Design tokens, typography, components, and interaction patterns.
          Dev-only — this route returns 404 in production.
        </Lead>
      </div>

      {/* ================================================================
          1. BRAND PALETTE — Hero gradient colors
          ================================================================ */}
      <GuideSection title="Brand Palette">
        <Body className="mb-6">
          Colors derived from the hero mesh gradient. These are the project's
          visual identity — use them for accent, illustration, and differentiation.
        </Body>
        <div className="grid grid-cols-5 gap-4">
          <Swatch name="Gold" value="#D4B44F" />
          <Swatch name="Terracotta" value="#D4593A" />
          <Swatch name="Terracotta Dark" value="#B35C2E" />
          <Swatch name="Deep Teal" value="#0A6B6B" />
          <Swatch name="Dark Navy" value="#0B0A3F" />
        </div>
        <Body className="mt-6 text-sm italic text-muted-foreground/60">
          Note: These brand colors are not yet wired into the Tailwind theme as
          accent tokens. Currently the site uses the default shadcn neutral
          palette. Consider promoting Deep Teal or Terracotta to --accent.
        </Body>
      </GuideSection>

      {/* ================================================================
          2. DESIGN TOKENS — CSS custom properties
          ================================================================ */}
      <GuideSection title="Design Tokens">
        <Body className="mb-6">
          OKLCH-based CSS custom properties from shadcn/ui. All semantic colors
          respond to dark mode via the <code className="font-label text-sm">.dark</code> class.
        </Body>

        <H3 className="mb-4">Base</H3>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          <CSSVarSwatch name="Background" cssVar="--background" />
          <CSSVarSwatch name="Foreground" cssVar="--foreground" />
          <CSSVarSwatch name="Primary" cssVar="--primary" />
          <CSSVarSwatch name="Primary FG" cssVar="--primary-foreground" />
          <CSSVarSwatch name="Secondary" cssVar="--secondary" />
          <CSSVarSwatch name="Muted" cssVar="--muted" />
          <CSSVarSwatch name="Accent" cssVar="--accent" />
          <CSSVarSwatch name="Destructive" cssVar="--destructive" />
        </div>

        <H3 className="mt-8 mb-4">Surface & Border</H3>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-6">
          <CSSVarSwatch name="Card" cssVar="--card" />
          <CSSVarSwatch name="Card FG" cssVar="--card-foreground" />
          <CSSVarSwatch name="Border" cssVar="--border" />
          <CSSVarSwatch name="Input" cssVar="--input" />
          <CSSVarSwatch name="Ring" cssVar="--ring" />
          <CSSVarSwatch name="Muted FG" cssVar="--muted-foreground" />
        </div>

        <H3 className="mt-8 mb-4">Radius</H3>
        <div className="flex gap-6">
          {["sm", "md", "lg", "xl"].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <div className={`h-16 w-16 bg-foreground/10 border border-border rounded-${size}`} />
              <span className="font-label text-xs text-muted-foreground">{size}</span>
            </div>
          ))}
        </div>
      </GuideSection>

      {/* ================================================================
          3. TYPOGRAPHY
          ================================================================ */}
      <GuideSection title="Typography">
        <div className="mb-8 flex gap-12">
          <div>
            <Small className="font-label mb-2 text-foreground">Headings</Small>
            <p className="font-heading text-lg">Sora Variable</p>
          </div>
          <div>
            <Small className="font-label mb-2 text-foreground">Body</Small>
            <p className="text-lg">Inter Variable</p>
          </div>
          <div>
            <Small className="font-label mb-2 text-foreground">Labels</Small>
            <p className="font-label text-lg">Oxygen Mono</p>
          </div>
        </div>

        <div className="space-y-8 border-t pt-8">
          <div>
            <Small className="font-label mb-1 text-foreground/40">{"<H1>"}</Small>
            <H1>The quick brown fox jumps</H1>
          </div>
          <div>
            <Small className="font-label mb-1 text-foreground/40">{"<H2>"}</Small>
            <H2>The quick brown fox jumps over the lazy dog</H2>
          </div>
          <div>
            <Small className="font-label mb-1 text-foreground/40">{"<H3>"}</Small>
            <H3>The quick brown fox jumps over the lazy dog</H3>
          </div>
          <div>
            <Small className="font-label mb-1 text-foreground/40">{"<SectionLabel>"}</Small>
            <SectionLabel>Section Label</SectionLabel>
          </div>
          <div>
            <Small className="font-label mb-1 text-foreground/40">{"<Lead>"}</Small>
            <Lead>Lead text for introductions and hero descriptions. Slightly larger, muted color.</Lead>
          </div>
          <div>
            <Small className="font-label mb-1 text-foreground/40">{"<Body>"}</Small>
            <Body>Body text for paragraphs and descriptions. Standard size, muted color. Used for most content throughout the site.</Body>
          </div>
          <div>
            <Small className="font-label mb-1 text-foreground/40">{"<Small>"}</Small>
            <Small>Small text for captions, metadata, and secondary information.</Small>
          </div>
        </div>

        <H3 className="mt-12 mb-4">Text Wrap Rules</H3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Small className="font-label mb-2 text-foreground">Headings: text-wrap: balance</Small>
            <H3>This heading text will automatically balance across lines for even visual weight</H3>
          </div>
          <div>
            <Small className="font-label mb-2 text-foreground">Body: text-wrap: pretty</Small>
            <Body>This paragraph text uses pretty wrapping to prevent orphans and widows. The last line should never have a single word hanging alone, which makes the text feel more polished and intentional in longer passages.</Body>
          </div>
        </div>
      </GuideSection>

      {/* ================================================================
          4. BUTTONS
          ================================================================ */}
      <GuideSection title="Buttons">
        <H3 className="mb-4">Variants</H3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>

        <H3 className="mt-8 mb-4">Sizes</H3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>

        <H3 className="mt-8 mb-4">States</H3>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
        </div>
        <Small className="mt-2">Hover, active (scale-0.98), and focus-visible (ring) states are CSS-driven. Interact to test.</Small>
      </GuideSection>

      {/* ================================================================
          5. FORM ELEMENTS
          ================================================================ */}
      <GuideSection title="Form Elements">
        <div className="grid gap-8 md:grid-cols-2 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="demo-name">Name</Label>
            <Input id="demo-name" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-email">Email</Label>
            <Input id="demo-email" type="email" placeholder="jane@example.com" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="demo-message">Message</Label>
            <Textarea id="demo-message" placeholder="Tell me about your project..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-disabled">Disabled</Label>
            <Input id="demo-disabled" disabled placeholder="Can't touch this" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-invalid">Invalid</Label>
            <Input id="demo-invalid" aria-invalid="true" defaultValue="bad input" />
          </div>
        </div>
        <Small className="mt-4">Focus-visible shows ring in accent color. Invalid state shows destructive border + ring.</Small>
      </GuideSection>

      {/* ================================================================
          6. PROJECT CARDS
          ================================================================ */}
      <GuideSection title="Card Variants">
        <Body className="mb-8">
          Three card layouts used across the site. All share the same content
          pattern: title + description left, impact right (50/50 split on desktop,
          stacked on mobile). ProjectSlideshow handles gradient fallback, image
          loading skeleton, and multi-image hover slideshow.
        </Body>

        {/* Variant 1: Staggered Grid */}
        <H3 className="mb-2">1. Staggered Grid</H3>
        <Small className="mb-6">
          Used on: Home (Selected Work), Work page. Two-column grid with right column
          offset by md:mt-24. Image full-width above content. Hover scales image 1.02x.
        </Small>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <ProjectSlideshow
              images={[]}
              alt="Example project"
              gradient="linear-gradient(135deg, #0A6B6B 0%, #1a8a8a 40%, #004D4D 100%)"
              category="Internal Tools"
            />
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="md:w-1/2">
                <H3>Project Title</H3>
                <Small className="mt-3">
                  Description text with enough length to show wrapping in the constrained width.
                </Small>
              </div>
              <div className="md:w-1/2">
                <Small className="font-medium text-foreground/60">
                  Impact one-liner goes here
                </Small>
              </div>
            </div>
          </div>

          <div className="md:mt-24">
            <ProjectSlideshow
              images={["/images/cases/memory-care-platform.webp"]}
              alt="Example with image"
              gradient="linear-gradient(135deg, #0B0A3F 0%, #2d2a7a 50%, #4a3f9f 100%)"
              category="Marketplace"
            />
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="md:w-1/2">
                <H3>Project Title</H3>
                <Small className="mt-3">
                  Description of the project with enough text to show wrapping.
                </Small>
              </div>
              <div className="md:w-1/2">
                <Small className="font-medium text-foreground/60">
                  Impact one-liner
                </Small>
              </div>
            </div>
          </div>
        </div>

        {/* Variant 2: Side-by-Side */}
        <H3 className="mt-16 mb-2">2. Side-by-Side</H3>
        <Small className="mb-6">
          Used on: Home (Open Source / Mailautumn). Slideshow and content sit
          side-by-side at 50/50. Use md:flex-row-reverse to put content left,
          image right. Stacks on mobile.
        </Small>
        <div className="flex flex-col gap-8 md:flex-row-reverse md:items-start">
          <div className="md:w-1/2">
            <ProjectSlideshow
              images={["/images/cases/glassblowing-studio.webp"]}
              alt="Side-by-side example"
              gradient="#1a1a2e"
              aspect="1272/927"
            />
          </div>
          <div className="md:w-1/2">
            <span className="text-sm text-muted-foreground">Category Label</span>
            <H2 className="mt-2">Project Title</H2>
            <Small className="mt-1 font-medium text-foreground/70">
              Short subtitle or tagline
            </Small>
            <Body className="mt-3">
              Longer description text. Used when the project needs more context
              than a one-liner — features, tech choices, what makes it interesting.
            </Body>
            <div className="mt-4 flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Variant 3: Gradient Fallback */}
        <H3 className="mt-16 mb-2">3. Gradient Fallback</H3>
        <Small className="mb-6">
          When no screenshots exist. Gradient fills the image area with a category
          badge overlay. Used as placeholder until real images are added.
        </Small>
        <div className="max-w-lg">
          <ProjectSlideshow
            images={[]}
            alt="Fallback example"
            gradient="linear-gradient(135deg, #D4593A 0%, #D4B44F 50%, #B35C2E 100%)"
            category="Commerce"
          />
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-8">
            <div className="md:w-1/2">
              <H3>Project Title</H3>
              <Small className="mt-3">Description text.</Small>
            </div>
            <div className="md:w-1/2">
              <Small className="font-medium text-foreground/60">Impact line</Small>
            </div>
          </div>
        </div>

        {/* Props Reference */}
        <H3 className="mt-16 mb-4">ProjectSlideshow Props</H3>
        <div className="space-y-2 font-label text-sm">
          {[
            { prop: "images: string[]", desc: "Array of image paths. Empty = gradient fallback." },
            { prop: "alt: string", desc: "Alt text base. Each image gets ' — screenshot N'." },
            { prop: "gradient: string", desc: "CSS background value. Visible as fallback or behind loading images." },
            { prop: "category?: string", desc: "Badge text shown on gradient fallback only." },
            { prop: "interval?: number", desc: "Slideshow speed in ms. Default: 1200." },
            { prop: "aspect?: string", desc: "Aspect ratio. Default: '16/9'. Mailautumn uses '1272/927'." },
          ].map((p) => (
            <div key={p.prop} className="flex gap-4">
              <code className="w-52 shrink-0 text-foreground">{p.prop}</code>
              <span className="text-muted-foreground">{p.desc}</span>
            </div>
          ))}
        </div>
      </GuideSection>

      {/* ================================================================
          6. HERO GRADIENT
          ================================================================ */}
      <GuideSection title="Mesh Gradients">
        <Body className="mb-6">
          Two keyframe states of the hero mesh gradient. 4 radial blobs + SVG fractal noise overlay.
        </Body>

        <H3 className="mb-4">State 1 — Dark left, warm right (current hero)</H3>
        <div className="mb-2 grid grid-cols-4 gap-2 font-label text-xs text-muted-foreground">
          <span>Gold: 88%, 9%</span>
          <span>Terracotta: 80%, 54%</span>
          <span>Teal: 5%, 22%</span>
          <span>Navy: 7%, 3%</span>
        </div>
        <div
          className="aspect-[21/9] w-full"
          style={{
            backgroundColor: "hsla(10,78%,55%,1)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),radial-gradient(circle at 88% 9%, hsla(47,75%,65%,1) 3%,transparent 68%),radial-gradient(circle at 80% 54%, hsla(8,75%,45%,1) 3%,transparent 68%),radial-gradient(circle at 5% 22%, hsla(185,100%,15%,1) 3%,transparent 68%),radial-gradient(circle at 7% 3%, hsla(246,81%,14%,1) 3%,transparent 68%)`,
            backgroundBlendMode: "overlay,normal,normal,normal,normal",
          }}
        />

        <H3 className="mt-12 mb-4">State 2 — Warm left, dark right</H3>
        <div className="mb-2 grid grid-cols-4 gap-2 font-label text-xs text-muted-foreground">
          <span>Gold: 0%, 99%</span>
          <span>Terracotta: 46%, 94%</span>
          <span>Teal: 93%, 95%</span>
          <span>Navy: 89%, 8%</span>
        </div>
        <div
          className="aspect-[21/9] w-full"
          style={{
            backgroundColor: "hsla(10,78%,55%,1)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),radial-gradient(circle at 0% 99%, hsla(47,75%,65%,1) 0%,transparent 67%),radial-gradient(circle at 46% 94%, hsla(10,79%,56%,1) 0%,transparent 81%),radial-gradient(circle at 93% 95%, hsla(184,96%,21%,1) 0%,transparent 66%),radial-gradient(circle at 89% 8%, hsla(246,81%,14%,1) 0%,transparent 150%)`,
            backgroundBlendMode: "overlay,normal,normal,normal,normal",
          }}
        />
      </GuideSection>

      {/* ================================================================
          7. ANIMATION / MOTION
          ================================================================ */}
      <GuideSection title="Animation">
        <Body className="mb-6">
          All entrance animations are one-time (viewport: once). Scroll down to trigger.
        </Body>

        <H3 className="mb-4">FadeIn</H3>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 0.15, 0.3].map((delay) => (
            <FadeIn key={delay} delay={delay}>
              <div className="bg-muted p-6">
                <Small className="font-label text-foreground">delay: {delay}s</Small>
                <Body className="mt-2">Fades up 20px</Body>
              </div>
            </FadeIn>
          ))}
        </div>

        <H3 className="mt-8 mb-4">Stagger</H3>
        <Stagger className="grid gap-4 md:grid-cols-4" stagger={0.1}>
          {[1, 2, 3, 4].map((n) => (
            <StaggerItem key={n}>
              <div className="bg-muted p-6">
                <Small className="font-label text-foreground">Item {n}</Small>
                <Body className="mt-2">0.1s stagger</Body>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </GuideSection>

      {/* ================================================================
          8. PROJECT GRADIENTS
          ================================================================ */}
      <GuideSection title="Project Gradients">
        <Body className="mb-6">
          Per-project gradient backgrounds used as fallbacks when no screenshot is available.
        </Body>
        <div className="grid gap-6 md:grid-cols-5">
          {[
            { name: "Glassblowing", gradient: "linear-gradient(135deg, #D4593A 0%, #D4B44F 50%, #B35C2E 100%)" },
            { name: "Real Estate", gradient: "linear-gradient(135deg, #0A6B6B 0%, #1a8a8a 40%, #004D4D 100%)" },
            { name: "Memory Care", gradient: "linear-gradient(135deg, #0B0A3F 0%, #2d2a7a 50%, #4a3f9f 100%)" },
            { name: "Therapist", gradient: "linear-gradient(135deg, #004D4D 0%, #0A6B6B 40%, #0B0A3F 100%)" },
            { name: "Fly Fishing", gradient: "linear-gradient(135deg, #1a8a8a 0%, #D4B44F 50%, #004D4D 100%)" },
          ].map((p) => (
            <div key={p.name}>
              <div className="aspect-[16/9]" style={{ background: p.gradient }} />
              <Small className="font-label mt-2">{p.name}</Small>
            </div>
          ))}
        </div>
      </GuideSection>

      {/* ================================================================
          9. SECTION RHYTHM
          ================================================================ */}
      <GuideSection title="Section Rhythm">
        <Body className="mb-2">
          Every page-level <code className="font-label text-sm">{`<Section>`}</code> uses one of four padding values.
          Default is <code className="font-label text-sm">lg</code>. Deviate only with a named reason.
        </Body>
        <Body className="mb-8">
          <code className="font-label text-sm">xl</code> is reserved for the section the reader's eye should rest on: a page hero, a page lead, or a closing CTA.{" "}
          <strong>At most one <code className="font-label text-sm">xl</code> per page.</strong>
        </Body>

        {/* Scale table */}
        <div className="mb-10 overflow-hidden rounded-lg border">
          <table className="w-full font-label text-sm">
            <thead>
              <tr className="border-b bg-secondary/40">
                <th className="px-4 py-3 text-left text-muted-foreground">size</th>
                <th className="px-4 py-3 text-left text-muted-foreground">classes</th>
                <th className="px-4 py-3 text-left text-muted-foreground">use for</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  { size: "sm", desc: "The visual IS the section — a big image, video, or showcase. Padding shouldn't compete with the asset." },
                  { size: "md", desc: "Dense or sub-sections inside a long detail page (case studies, article body). Tighter rhythm signals \"I'm inside a chapter.\"" },
                  { size: "lg", desc: "Default — most content blocks. If you don't have a reason, use this." },
                  { size: "xl", desc: "Climactic — page hero, page lead, closing CTA. Max one per page." },
                ] as { size: SectionPadding; desc: string }[]
              ).map(({ size, desc }) => (
                <tr key={size} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{size}</td>
                  <td className="px-4 py-3 text-muted-foreground">{paddingClasses[size]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live previews */}
        <H3 className="text-base mb-6">Live previews</H3>
        <div className="space-y-6">
          {(["sm", "md", "lg", "xl"] as SectionPadding[]).map((size) => (
            <div key={size} className="overflow-hidden rounded-lg border">
              <div className="flex items-center justify-between bg-secondary/40 px-6 py-3">
                <span className="font-label text-sm font-medium text-foreground">{size}</span>
                <code className="font-label text-xs text-muted-foreground">{paddingClasses[size]}</code>
              </div>
              <div className="px-8 bg-background">
                <div className={`border-t ${paddingClasses[size]}`}>
                  <div className="h-2 w-20 rounded bg-foreground/10" />
                  <div className="mt-3 h-2 w-44 rounded bg-foreground/10" />
                  <div className="mt-2 h-2 w-36 rounded bg-foreground/10" />
                </div>
                <div className={`border-t ${paddingClasses[size]}`}>
                  <div className="h-2 w-28 rounded bg-foreground/10" />
                  <div className="mt-3 h-2 w-40 rounded bg-foreground/10" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage */}
        <H3 className="text-base mt-10 mb-4">Usage</H3>
        <div className="space-y-2 font-label text-xs text-muted-foreground/80">
          <div><code className="text-foreground">{`<Section>`}</code> — default lg, border-t divider on</div>
          <div><code className="text-foreground">{`<Section padding="md">`}</code> — tighter, still bordered</div>
          <div><code className="text-foreground">{`<Section padding="xl">`}</code> — climactic, max one per page</div>
          <div><code className="text-foreground">{`<Section divider={false}>`}</code> — no border-t (page intro, first section)</div>
          <div><code className="text-foreground">{`<Section as="article">`}</code> — renders as article element</div>
        </div>

        {/* Component gap scale */}
        <H3 className="text-base mt-10 mb-4">Component gap scale</H3>
        <Small className="mb-4 block">Within a section — spacing between elements, not between sections.</Small>
        <div className="space-y-3">
          {[
            { cls: "gap-4",    rem: "1rem",   desc: "Tight — inline groups, tag chips, icon + label" },
            { cls: "gap-6",    rem: "1.5rem", desc: "Default — form fields, stacked text blocks" },
            { cls: "gap-8",    rem: "2rem",   desc: "Card content — image-to-copy, two-col splits" },
            { cls: "gap-10",   rem: "2.5rem", desc: "Grid gap — project card grids" },
            { cls: "gap-12",   rem: "3rem",   desc: "Large grid — work page cards" },
            { cls: "mt-6",     rem: "1.5rem", desc: "Image-to-content spacing inside a card" },
            { cls: "md:mt-24", rem: "6rem",   desc: "Stagger offset — right-column card in a 2-col grid" },
          ].map((s) => (
            <div key={s.cls} className="flex items-start gap-4">
              <code className="font-label text-sm text-foreground w-28 shrink-0">{s.cls}</code>
              <Small className="w-16 shrink-0 text-muted-foreground/50">{s.rem}</Small>
              <Small>{s.desc}</Small>
            </div>
          ))}
        </div>
      </GuideSection>

      {/* ================================================================
          10. RECOMMENDATIONS
          ================================================================ */}
      <GuideSection title="Resolved">
        <Body className="mb-4">
          Previously identified gaps that have been addressed:
        </Body>
        <div className="space-y-3">
          {[
            "Accent color — Deep Teal wired into --accent and --ring (OKLCH hue 185)",
            "Warm neutrals — all tokens shifted from 0 chroma to warm hue (80 light, 260 dark)",
            "Form components — Input, Textarea, Label added",
            "Mobile breakpoints — card 50/50 split stacks on mobile",
            "Skeleton loading — ProjectSlideshow shows pulse shimmer until image loads",
          ].map((item) => (
            <Small key={item} className="border-l-2 border-accent pl-4 text-foreground/60">{item}</Small>
          ))}
        </div>
      </GuideSection>

      <GuideSection title="Remaining Gaps">
        <div className="space-y-4">
          {[
            {
              issue: "No brand color scale",
              detail: "Accent is a single value. No 50-900 scale for teal or terracotta yet.",
              fix: "Add a 10-step scale for the accent color when more components need tonal variation.",
            },
            {
              issue: "No contact form",
              detail: "Contact page uses external links. Form components exist but aren't wired to a backend.",
              fix: "Build contact form with server action or external service (Resend, Formspree).",
            },
          ].map((item) => (
            <div key={item.issue} className="border-l-2 border-muted-foreground/20 pl-4">
              <H3 className="text-base">{item.issue}</H3>
              <Small className="mt-1">{item.detail}</Small>
              <Small className="mt-1 font-medium text-foreground/60">Fix: {item.fix}</Small>
            </div>
          ))}
        </div>
      </GuideSection>
    </main>
  );
}
