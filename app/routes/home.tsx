import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "~/components/ui/button";
import { SiteHeader } from "~/components/layout/site-header";
import { SiteFooter } from "~/components/layout/site-footer";
import { generateMeta } from "~/lib/meta";
import { personSchema, webSiteSchema } from "~/lib/schema";
import { JsonLd } from "~/components/common/json-ld";
import { H1, H2, H3, SectionLabel, Lead, Body, Small } from "~/components/common/typography";
import { CountUp, WordStagger, FadeIn, TypeCycle } from "~/components/common/animate";
import { ProjectSlideshow } from "~/components/common/project-slideshow";
import { SiteEffects } from "~/components/common/site-effects";
import { Section } from "~/components/common/section";

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
      "I build with AI tooling and I build the guardrails around it. Specs, SOPs, automated multi-model code review on every push. The speed comes from the AI; the reliability comes from the system around it.",
  },
];

// Same pattern as the footer — ref on outer static div, motion.div inside gets the y transform
function CaseCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "start 0.1"],
  });
  const opacity = useTransform(scrollYProgress, [delay, Math.min(delay + 0.5, 1)], [0, 1]);
  const y = useTransform(scrollYProgress, [delay, 1], [30, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ opacity, y }}>
        {children}
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <JsonLd data={[personSchema(), webSiteSchema()]} />
      <SiteHeader />
      <SiteEffects />

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
        <div className="relative flex h-full min-h-[80vh] w-full flex-col justify-between pt-24 pb-8 px-8 md:pt-28 md:pb-12 md:px-12">
          <div className="flex items-start justify-between">
            <H1 className="text-white">
              <WordStagger>Full-stack engineer</WordStagger>
              <br />
              <span className="text-white/70">
                <TypeCycle
                  phrases={[
                    "who ships real systems",
                    "who owns the full stack",
                    "who thinks in data flows",
                    "who builds for the long run",
                    "who turns complexity into clarity",
                  ]}
                />
              </span>
            </H1>
            <div className="hidden flex-col items-end gap-4 md:flex">
              <Button asChild>
                <Link to="/work">See my work</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-white/70 bg-transparent hover:bg-white/10 dark:bg-transparent dark:border-white/70"
              >
                <Link to="/contact">
                  <span className="mix-blend-difference text-white">Let's connect</span>
                </Link>
              </Button>
            </div>
          </div>

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

          <div className="mt-8 flex gap-4 md:hidden">
            <Button asChild>
              <Link to="/work">See my work</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-white/70 bg-transparent hover:bg-white/10 dark:bg-transparent dark:border-white/70"
            >
              <Link to="/contact">
                <span className="mix-blend-difference text-white">Let's connect</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4">
        {/* Credibility bar */}
        <Section padding="sm" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-label text-sm text-muted-foreground">
          <span><CountUp to={8} suffix="+" /> years full-stack</span>
          <span className="hidden text-border sm:inline">|</span>
          <span><CountUp to={5} /> industries</span>
          <span className="hidden text-border sm:inline">|</span>
          <span>TypeScript, Go, Python</span>
        </Section>

        {/* Selected Work */}
        <Section padding="lg">
          <SectionLabel>Selected Work</SectionLabel>
          <div className="mt-8 grid grid-cols-12 gap-10">
            {featuredWork.map((project, i) => (
              <CaseCard
                key={project.slug}
                delay={i % 2 === 1 ? 0.15 : 0}
                className={`col-span-12 md:col-span-6${i % 2 === 1 ? " md:mt-24" : ""}`}
              >
                <Link to={`/work/${project.slug}`} className="group block">
                  <ProjectSlideshow
                    images={project.images}
                    alt={project.title}
                    gradient={project.gradient}
                    category={project.category}
                  />
                  <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-8">
                    <div className="md:w-1/2">
                      <H3 className="transition-colors group-hover:text-foreground/80">
                        {project.title}
                      </H3>
                      <Small className="mt-3">{project.description}</Small>
                    </div>
                    <div className="md:w-1/2">
                      <Small className="font-medium text-foreground/60">
                        {project.impact}
                      </Small>
                    </div>
                  </div>
                </Link>
              </CaseCard>
            ))}
          </div>
        </Section>

        {/* Open Source */}
        <FadeIn>
        <Section padding="lg">
          <SectionLabel>Other Projects</SectionLabel>
          <Link
            to="/lab/mailautumn"
            className="group mt-8 grid grid-cols-12 items-start gap-8 transition-colors hover:text-foreground/80"
          >
            <div className="col-span-12 md:col-span-6 md:order-2">
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
            <div className="col-span-12 md:col-span-6 md:order-1">
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
                {["Electron", "React 18", "TypeScript", "Tailwind v4", "Jotai", "Vite", "AI / LLM"].map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-block text-sm text-muted-foreground underline group-hover:text-foreground">
                View project →
              </span>
            </div>
          </Link>

          <div className="mt-12 border-t pt-12">
            <Link
              to="/lab/spotter"
              className="group block max-w-xl transition-colors hover:text-foreground/80"
            >
              <span className="text-sm text-muted-foreground">
                Node.js + TypeScript + Ollama
              </span>
              <H2 className="mt-2">Spotter</H2>
              <Small className="mt-1 font-medium text-foreground/70">
                Background code review daemon with multi-model consensus
              </Small>
              <Body className="mt-3">
                Watches file changes and routes diffs to multiple LLMs in
                parallel — Ollama, Claude Code, or any OpenAI-compatible
                endpoint. Cross-validates findings before surfacing them.
                Zero-interruption review that runs while you work, not after
                you push.
              </Body>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Node.js", "TypeScript", "Chokidar", "Ollama", "Claude Code", "OpenAI API"].map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-block text-sm text-muted-foreground underline group-hover:text-foreground">
                View project →
              </span>
            </Link>
          </div>
        </Section>
        </FadeIn>

        {/* What I Bring */}
        <FadeIn>
        <Section padding="lg">
          <SectionLabel>What I Bring</SectionLabel>
          <div className="mt-8 grid grid-cols-12 gap-6">
            {strengths.map((item) => (
              <div key={item.title} className="col-span-12 p-6 md:col-span-4">
                <H3 className="text-base">{item.title}</H3>
                <Small className="mt-2">{item.description}</Small>
              </div>
            ))}
          </div>
        </Section>
        </FadeIn>

        {/* Philosophy callout — xl: closing CTA, one per page */}
        <FadeIn>
        <Section padding="xl">
          <blockquote className="mx-auto max-w-3xl text-center">
            <Lead>
              I care about building software that lasts — clean architecture,
              honest trade-offs, and systems that the next engineer can actually
              understand. I'd rather ship something solid than something flashy.
            </Lead>
          </blockquote>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/how-i-work">My approach</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/about">About me</Link>
            </Button>
          </div>
        </Section>
        </FadeIn>
      </main>

      <SiteFooter />
    </div>
  );
}
