import { Link } from "react-router";
import { generateMeta } from "~/lib/meta";
import { H1, H2, H3, SectionLabel, Lead, Body } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";
import { Section } from "~/components/common/section";

export function meta() {
  return generateMeta({
    title: "Approach — Lucas Zapico",
    description:
      "How I think about building software — architecture-first, honest trade-offs, and systems built to last.",
    path: "/how-i-work",
  });
}

const principles = [
  {
    step: "01",
    title: "Understand the problem before writing code",
    description:
      "I start with constraints, not solutions. What does the system actually need to do? What are the failure modes? What decisions need to happen at the architecture level before anyone opens an editor?",
  },
  {
    step: "02",
    title: "Architecture before interface",
    description:
      "Data models, API boundaries, auth patterns, deployment strategy — I think about these first. A well-architected system makes everything downstream easier: features ship faster, bugs are shallower, onboarding is smoother.",
  },
  {
    step: "03",
    title: "Ship in working increments",
    description:
      "I build in vertical slices — real, working software at every step, not wireframes followed by months of silence. This keeps the feedback loop tight and surfaces problems early.",
  },
  {
    step: "04",
    title: "Leave the codebase better than I found it",
    description:
      "Clean code, clear naming, meaningful tests, documentation where it matters. The goal is a system the next engineer can understand and extend without a guided tour.",
  },
];

const tooling = [
  {
    title: "Current stack",
    description:
      "React / React Router, NestJS, PostgreSQL, MongoDB, Directus CMS, Medusa (headless commerce), Stripe, Docker, Tailwind CSS, TypeScript across the board. Python, FastAPI, and PyTorch on the side.",
  },
  {
    title: "On AI-assisted development",
    description:
      "I use AI tools throughout my workflow — research, code generation, testing, documentation. It's a multiplier, not a replacement. The architecture, system design, and engineering judgment are mine. The tools I use to execute are whatever gets the best result.",
  },
  {
    title: "What this means for a team",
    description:
      "Higher throughput without sacrificing quality. I move fast because I've invested in tooling and patterns that let me — not because I cut corners.",
  },
];

const thrive = [
  "Small teams where engineers own features end-to-end",
  "Codebases that value clarity over cleverness",
  "Product-minded engineering — understanding why, not just what",
  "Environments where shipping matters more than process theater",
];

export default function ApproachPage() {
  return (
    <main className="px-8 py-16 md:px-12">
      <FadeIn>
        <section className="mb-16">
          <H1>Approach</H1>
          <Lead className="mt-4 max-w-2xl">
            How I think about building software — and what it's like to work
            with me on a team.
          </Lead>
        </section>
      </FadeIn>

      {/* Principles */}
      <Section padding="lg">
        <FadeIn>
          <SectionLabel>Engineering Principles</SectionLabel>
        </FadeIn>
        <div className="mt-8 grid grid-cols-12 gap-x-8 gap-y-10">
          {principles.map((item) => (
            <FadeIn key={item.step} className="col-span-12 md:col-span-6">
              <div className="grid grid-cols-[56px_1fr] gap-4">
                <span className="text-3xl font-bold text-muted-foreground/30">
                  {item.step}
                </span>
                <div>
                  <H3>{item.title}</H3>
                  <Body className="mt-2">{item.description}</Body>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Tools & Workflow */}
      <Section padding="lg">
        <FadeIn>
          <SectionLabel>Tools & Workflow</SectionLabel>
        </FadeIn>
        <div className="mt-8 grid grid-cols-12 gap-x-8 gap-y-8">
          {tooling.map((item) => (
            <FadeIn key={item.title} className="col-span-12 md:col-span-4">
              <H3>{item.title}</H3>
              <Body className="mt-2">{item.description}</Body>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Where I Thrive */}
      <Section padding="lg">
        <FadeIn>
          <SectionLabel>Where I Thrive</SectionLabel>
        </FadeIn>
        <ul className="mt-8 grid grid-cols-12 gap-x-8 gap-y-4">
          {thrive.map((item) => (
            <FadeIn key={item} className="col-span-12 md:col-span-6">
              <li className="border-l-2 border-muted-foreground/20 pl-4 text-muted-foreground">
                {item}
              </li>
            </FadeIn>
          ))}
        </ul>
      </Section>

      {/* CTA — xl: closing CTA, one per page */}
      <FadeIn>
        <Section padding="xl">
          <div className="rounded-lg bg-secondary p-8 text-center">
            <H2>Sound like a fit?</H2>
            <Body className="mt-2">
              I'm looking for my next role. Let's talk.
            </Body>
            <Link
              to="/contact"
              className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get in touch
            </Link>
          </div>
        </Section>
      </FadeIn>
    </main>
  );
}
