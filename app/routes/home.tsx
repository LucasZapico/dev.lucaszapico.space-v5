import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { SiteHeader } from "~/components/layout/site-header";
import { SiteFooter } from "~/components/layout/site-footer";
import { generateMeta } from "~/lib/meta";
import { H1, H2, H3, SectionLabel, Lead, Body, Small } from "~/components/common/typography";
import { Stagger, StaggerItem, FadeIn } from "~/components/common/animate";
import { ProjectSlideshow } from "~/components/common/project-slideshow";

export function meta() {
  return generateMeta({
    title: "Lucas Zapico — Full-Stack Engineer",
    description:
      "Full-stack engineer with 8+ years building internal tools, commerce platforms, and data-driven systems. Looking for a team that values ownership and shipping real software.",
    path: "/",
  });
}

const featuredWork = [
  {
    category: "Commerce & Operations",
    title: "Glassblowing Studio Digital Platform",
    impact: "Replaced 4 SaaS tools with one unified platform",
    description:
      "Monorepo with NestJS BFF, Medusa v2 commerce, Directus CMS, magic-link auth, and Stripe payment flows with business-rule refunds.",
    slug: "glassblowing-studio",
    images: [
      "/images/cases/glassblowing-studio.webp",
      "/images/cases/glassblowing-studio-2.webp",
      "/images/cases/glassblowing-studio-3.webp",
    ],
    gradient: "linear-gradient(135deg, #D4593A 0%, #D4B44F 50%, #B35C2E 100%)",
  },
  {
    category: "Internal Tools",
    title: "Real Estate Brokerage MLS",
    impact: "Gave brokers early visibility into off-market listings",
    description:
      "Go backend with PostGIS geospatial search, four-role RBAC, listing state machine, and IDX data feed integration.",
    slug: "real-estate-mls",
    images: [
      "/images/cases/bhreco-app-02.webp",
      "/images/cases/bhreco-app-03.webp",
      "/images/cases/bhreco-app-04.webp",
    ],
    gradient: "linear-gradient(135deg, #0A6B6B 0%, #1a8a8a 40%, #004D4D 100%)",
  },
  {
    category: "Marketplace",
    title: "Memory Care Search Platform",
    impact: "79-filter discovery platform serving families in crisis",
    description:
      "Multi-source data pipeline ingesting six state registries, LLM-powered enrichment, and ad auction system.",
    slug: "memory-care-platform",
    images: [
      "/images/cases/memory-care-platform.webp",
      "/images/cases/memory-care-platform-2.webp",
      "/images/cases/memory-care-platform-3.webp",
      "/images/cases/memory-care-platform-4.webp",
    ],
    gradient: "linear-gradient(135deg, #0B0A3F 0%, #2d2a7a 50%, #4a3f9f 100%)",
  },
  {
    category: "Healthcare",
    title: "Therapist Portal",
    impact: "Secure client portal with full data ownership",
    description:
      "Dual-interface platform with multi-step booking, Stripe payments, Google Calendar sync, and threaded messaging.",
    slug: "therapist-portal",
    images: [
      "/images/cases/therapist-portal.webp",
      "/images/cases/therapist-portal-2.webp",
      "/images/cases/therapist-portal-3.webp",
      "/images/cases/therapist-portal-4.webp",
    ],
    gradient: "linear-gradient(135deg, #004D4D 0%, #0A6B6B 40%, #0B0A3F 100%)",
  },
];

const strengths = [
  {
    title: "End-to-End Ownership",
    description:
      "From database schema to deploy pipeline. I'm comfortable owning features from architecture through production — not just the UI layer.",
  },
  {
    title: "Systems Thinking",
    description:
      "I think in data flows, not just components. How does the system behave under load? What happens when requirements change? I build for the second year, not just the first sprint.",
  },
  {
    title: "AI-Augmented Workflow",
    description:
      "I use AI tools throughout my workflow — research, code generation, testing, documentation. It's not a crutch, it's a multiplier. The architecture and judgment are mine.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero with animated mesh gradient */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "hsla(10,78%,55%,1)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),radial-gradient(circle at 88% 9%, hsla(47,75%,65%,1) 3%,transparent 68%),radial-gradient(circle at 80% 54%, hsla(8,75%,45%,1) 3%,transparent 68%),radial-gradient(circle at 5% 22%, hsla(185,100%,15%,1) 3%,transparent 68%),radial-gradient(circle at 7% 3%, hsla(246,81%,14%,1) 3%,transparent 68%)`,
            backgroundBlendMode: "overlay,normal,normal,normal,normal",
          }}
        />
        <div className="relative z-10 flex h-full min-h-[80vh] w-full flex-col justify-between pt-24 pb-8 px-8 md:pt-28 md:pb-12 md:px-12">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <H1 className="text-white">
              Full-stack engineer
              <br />
              <span className="text-white/70">
                who ships real systems
              </span>
            </H1>
            <div className="hidden flex-col items-end gap-4 md:flex">
              <Button asChild>
                <Link to="/work">See my work</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  to="/contact"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Let's connect
                </Link>
              </Button>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <Small className="font-label text-white/60">
              8+ years full-stack
              <br />
              TypeScript, Go, Python
              <br />
              5 industries
            </Small>
            <Lead className="max-w-md text-right text-white/80">
              I own features end-to-end — from architecture through
              production. Looking for a team that values craft, autonomy,
              and getting things done.
            </Lead>
          </div>

          {/* Mobile CTAs */}
          <div className="mt-8 flex gap-4 md:hidden">
            <Button asChild>
              <Link to="/work">See my work</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                to="/contact"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Let's connect
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4">
        {/* Credibility bar */}
        <section className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t py-8 font-label text-sm text-muted-foreground">
          <span>8+ years full-stack</span>
          <span className="hidden text-border sm:inline">|</span>
          <span>5 industries</span>
          <span className="hidden text-border sm:inline">|</span>
          <span>TypeScript, Go, Python</span>
        </section>

        {/* Selected Work */}
        <section className="border-t py-24">
          <SectionLabel>Selected Work</SectionLabel>
          <Stagger className="mt-8 grid gap-10 md:grid-cols-2" stagger={0.15}>
            {featuredWork.map((project, i) => (
              <div
                key={project.slug}
                className={i % 2 === 1 ? "md:mt-24" : ""}
              >
                <Link
                  to={`/work/${project.slug}`}
                  className="group block"
                >
                  <StaggerItem>
                    <ProjectSlideshow
                      images={project.images}
                      alt={project.title}
                      gradient={project.gradient}
                      category={project.category}
                    />
                  </StaggerItem>
                  <StaggerItem>
                    <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-8">
                      <div className="md:w-1/2">
                        <H3 className="group-hover:text-foreground/80 transition-colors">
                          {project.title}
                        </H3>
                        <Small className="mt-3">
                          {project.description}
                        </Small>
                      </div>
                      <div className="md:w-1/2">
                        <Small className="font-medium text-foreground/60">
                          {project.impact}
                        </Small>
                      </div>
                    </div>
                  </StaggerItem>
                </Link>
              </div>
            ))}
          </Stagger>
        </section>

        {/* Open Source */}
        <section className="border-t py-24">
          <SectionLabel>Open Source</SectionLabel>
          <a
            href="https://github.com/LucasZapico/mailautumn"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex flex-col gap-8 transition-colors hover:text-foreground/80 md:flex-row-reverse md:items-start"
          >
            <div className="md:w-1/2">
              <ProjectSlideshow
                images={[
                  "/images/mailautumn/mailautumn-01.webp",
                  "/images/mailautumn/mailautumn-02.webp",
                  "/images/mailautumn/mailautumn-03.webp",
                  "/images/mailautumn/mailautumn-04.webp",
                  "/images/mailautumn/mailautumn-05.webp",
                  "/images/mailautumn/mailautumn-06.webp",
                  "/images/mailautumn/mailautumn-07.webp",
                  "/images/mailautumn/mailautumn-08.webp",
                  "/images/mailautumn/mailautumn-09.webp",
                  "/images/mailautumn/mailautumn-10.webp",
                ]}
                alt="Mailautumn email client"
                gradient="#1a1a2e"
                aspect="1272/927"
              />
            </div>
            <div className="md:w-1/2">
              <span className="text-sm text-muted-foreground">
                Electron + React + TypeScript
              </span>
              <H2 className="mt-2">Mailautumn</H2>
              <Small className="mt-1 font-medium text-foreground/70">
                Modern email client built on Mailspring's sync engine
              </Small>
              <Body className="mt-3">
                Complete frontend rewrite of an open source email client.
                Slack-style threaded conversations, smart email classification,
                multi-provider AI integration (OpenAI, Anthropic, Ollama),
                a built-in CRM plugin, and a full theming system. Daily driver.
              </Body>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Electron",
                  "React 18",
                  "TypeScript",
                  "Tailwind v4",
                  "Jotai",
                  "Vite",
                  "AI / LLM",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-block text-sm text-muted-foreground underline group-hover:text-foreground">
                View on GitHub →
              </span>
            </div>
          </a>
        </section>

        {/* What I Bring */}
        <section className="border-t py-24">
          <SectionLabel>What I Bring</SectionLabel>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {strengths.map((item) => (
              <div key={item.title} className="p-6">
                <H3 className="text-base">{item.title}</H3>
                <Small className="mt-2">
                  {item.description}
                </Small>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy callout */}
        <section className="border-t py-24">
          <blockquote className="mx-auto max-w-3xl text-center"><Lead>
            I care about building software that lasts — clean architecture,
            honest trade-offs, and systems that the next engineer can actually
            understand. I'd rather ship something solid than something flashy.
          </Lead></blockquote>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/how-i-work">My approach</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/about">About me</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
