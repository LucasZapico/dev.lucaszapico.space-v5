import { generateMeta } from "~/lib/meta";
import { H1, H2, H3, SectionLabel, Lead, Body } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";
import { Section } from "~/components/common/section";

export function meta() {
  return generateMeta({
    title: "About — Lucas Zapico",
    description:
      "Full-stack engineer with 8+ years across the stack — from frontend interfaces to backend APIs, database architecture to deployment infrastructure.",
    path: "/about",
  });
}

const sideProjects = [
  {
    title: "Mailautumn",
    description:
      "Open source email client — complete frontend rewrite of Mailspring. Slack-style threaded conversations, smart email classification, multi-provider AI integration (OpenAI, Anthropic, Ollama), built-in CRM plugin, and full theming system. Electron, React 18, TypeScript, Tailwind v4, Jotai.",
    link: "https://github.com/LucasZapico/mailautumn",
  },
  {
    title: "Quantitative investment platform",
    description:
      "Python, FastAPI, PostgreSQL. Multi-API data pipelines pulling from Alpaca, Polygon, and Binance. Backtesting engine, market indicators, and automated trading strategies. A large project that took significant time — the models didn't beat the market, but the systems engineering was real.",
  },
  {
    title: "Infrastructure & tooling",
    description:
      "Docker recipe collections, Ansible playbooks, machine configuration scripts. I maintain my own infrastructure because I like understanding what's under the hood.",
  },
];

const deepExperience = [
  "TypeScript",
  "React",
  "React Router / Remix",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "Tailwind CSS",
  "Docker",
  "Stripe",
  "Electron",
];

const workingKnowledge = [
  "Go",
  "Python",
  "FastAPI",
  "MongoDB",
  "Redis",
  "PyTorch",
  "Directus",
  "Medusa",
  "Jotai",
  "Ansible",
];

export default function AboutPage() {
  return (
    <main className="mx-auto px-4 py-16" style={{ maxWidth: "650px" }}>
      <FadeIn>
      <section className="mb-16">
        <H1>About</H1>
        <Lead className="mt-6">
          I'm a full-stack engineer based in the Pacific Northwest with 8+
          years of experience building software across industries — from
          healthcare and real estate to e-commerce and creative studios.
        </Lead>
      </section>

      <section className="prose prose-neutral dark:prose-invert mb-16 max-w-none">
        <h2>Background</h2>
        <p>
          I've worked across the entire stack — frontend interfaces, backend
          APIs, database architecture, deployment infrastructure. I've built
          internal tools for brokerages, booking platforms for service
          businesses, commerce systems for creative studios, and search
          platforms for healthcare.
        </p>
        <p>
          What connects the work isn't a specific technology — it's a pattern
          of taking ownership of complex problems and shipping systems that
          actually work in production. I care about clean architecture, honest
          trade-offs, and leaving codebases better than I found them.
        </p>
        <p>
          I'm looking for a team where I can bring that same energy — a place
          that values craft, ships real products, and doesn't confuse process
          with progress.
        </p>
      </section>
      </FadeIn>

      <FadeIn>
      <Section padding="lg">
        <SectionLabel>
          Side Projects
        </SectionLabel>
        <Body className="mt-2">
          Where the real curiosity lives — the stuff I build when nobody's
          asking me to.
        </Body>
        <div className="mt-8 space-y-8">
          {sideProjects.map((project) => (
            <div key={project.title}>
              <H3>
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    {project.title} →
                  </a>
                ) : (
                  project.title
                )}
              </H3>
              <Body className="mt-2">
                {project.description}
              </Body>
            </div>
          ))}
        </div>
      </Section>
      </FadeIn>

      <FadeIn>
      <Section padding="lg">
        <SectionLabel>
          Stack
        </SectionLabel>
        <Body className="mt-2 mb-6">
          I don't have loyalty to frameworks. I pick the right tool for the
          constraint and learn whatever the team needs.
        </Body>
        <div className="space-y-6">
          <div>
            <H3 className="mb-3 text-sm font-medium">Deep experience</H3>
            <div className="flex flex-wrap gap-3">
              {deepExperience.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <H3 className="mb-3 text-sm font-medium">Working knowledge</H3>
            <div className="flex flex-wrap gap-3">
              {workingKnowledge.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-secondary px-4 py-2 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>
      </FadeIn>
    </main>
  );
}
