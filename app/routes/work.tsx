import { Link } from "react-router";
import { generateMeta } from "~/lib/meta";
import { H1, H2, H3, Lead, Body, Small } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";
import { ProjectSlideshow } from "~/components/common/project-slideshow";

export function meta() {
  return generateMeta({
    title: "Work — Lucas Zapico",
    description:
      "Projects I've built: internal tools, commerce platforms, booking systems, and search infrastructure.",
    path: "/work",
  });
}

const caseStudies = [
  {
    category: "Commerce & Operations",
    title: "Glassblowing Studio Digital Platform",
    impact: "Replaced 4 SaaS tools with one unified platform",
    description:
      "Monorepo platform unifying class enrollment, e-commerce, CRM, and a student portal with magic-link auth. NestJS BFF proxying five services behind a single API.",
    tech: ["React Router 7", "NestJS", "Medusa v2", "Directus", "Stripe", "PostgreSQL"],
    featured: true,
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
    title: "Internal Pseudo-MLS for a Real Estate Brokerage",
    impact: "Gave brokers early visibility into off-market listings",
    description:
      "Go backend with clean architecture, PostGIS geospatial search, four-role RBAC, listing state machine, and IDX feed integration for a real estate brokerage.",
    tech: ["Go", "PostgreSQL", "PostGIS", "React 19", "JWT", "Docker"],
    featured: true,
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
    title: "Memory Care & Assisted Living Search Platform",
    impact: "79-filter discovery platform serving families in crisis",
    description:
      "Multi-source data pipeline ingesting six state registries, LLM-powered enrichment, and an ad auction system.",
    tech: ["React Router 7", "Express", "MongoDB", "Redis", "Zod", "Docker"],
    featured: true,
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
    title: "Therapist Website & Client Portal",
    impact: "Secure client portal with full data ownership",
    description:
      "Dual-interface platform with multi-step booking, Stripe payments, Google Calendar sync, threaded messaging, and a personalized wellness content feed. 225 tests.",
    tech: ["React Router 7", "NestJS", "PostgreSQL", "TypeORM", "Stripe", "Docker"],
    featured: true,
    slug: "therapist-portal",
    images: [
      "/images/cases/therapist-portal.webp",
      "/images/cases/therapist-portal-2.webp",
      "/images/cases/therapist-portal-3.webp",
      "/images/cases/therapist-portal-4.webp",
    ],
    gradient: "linear-gradient(135deg, #004D4D 0%, #0A6B6B 40%, #0B0A3F 100%)",
  },
  {
    category: "Booking Platform",
    title: "Fly Fishing Guide Booking Platform",
    impact: "Non-technical owner manages bookings without learning software",
    description:
      "Preference-based booking wizard with cross-filtering across season, species, water, and trip type. Deposit-based Stripe payments with server-side price validation.",
    tech: ["React Router 7", "NestJS", "Directus", "Stripe", "Jotai"],
    featured: false,
    slug: "fly-fishing-guide",
    images: [],
    gradient: "linear-gradient(135deg, #1a8a8a 0%, #D4B44F 50%, #004D4D 100%)",
  },
];

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <FadeIn>
        <section className="mb-16">
          <H1>Work</H1>
          <Lead className="mt-4 max-w-2xl">
            Real projects with real constraints. Every system here was
            built around where the client actually was — their technical
            ability, their operational reality, their timeline. End-to-end
            ownership from discovery through deployment.
          </Lead>
        </section>
      </FadeIn>

      <div className="grid gap-12 md:grid-cols-2">
        {caseStudies.map((study, i) => (
          <FadeIn key={study.slug} delay={i % 2 === 1 ? 0.1 : 0} className={i % 2 === 1 ? "md:mt-24" : ""}>
            <Link to={`/work/${study.slug}`} className="group block">
              <ProjectSlideshow
                images={study.images}
                alt={study.title}
                gradient={study.gradient}
                category={study.category}
              />
              <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-8">
                <div className="md:w-1/2">
                  <H3 className="group-hover:text-foreground/80 transition-colors">
                    {study.title}
                  </H3>
                  <Body className="mt-3">{study.description}</Body>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {study.tech.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:w-1/2">
                  <Small className="font-medium text-foreground/60">
                    {study.impact}
                  </Small>
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <section className="mt-24 rounded-lg bg-secondary p-8 text-center">
          <H2>Interested in working together?</H2>
          <Body className="mt-2">
            I'm looking for a full-stack role at a company that builds real
            products. Let's talk.
          </Body>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get in touch
          </Link>
        </section>
      </FadeIn>
    </main>
  );
}
