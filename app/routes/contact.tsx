import { Link } from "react-router";
import { SITE_CONFIG } from "~/lib/site-config";
import { generateMeta } from "~/lib/meta";
import { H1, H2, H3, SectionLabel, Lead, Body } from "~/components/common/typography";

export function meta() {
  return generateMeta({
    title: "Connect — Lucas Zapico",
    description:
      "Get in touch — I'm looking for my next full-stack engineering role.",
    path: "/contact",
  });
}

export default function ConnectPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <section className="mb-16">
        <H1>Let's Connect</H1>
        <Lead className="mt-4 max-w-2xl">
          I'm looking for a full-stack engineering role at a startup or
          mid-size company that builds real products. If that sounds like
          your team, I'd love to talk.
        </Lead>
      </section>

      <section className="grid gap-12 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <SectionLabel>
              What I'm Looking For
            </SectionLabel>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              <li className="border-l-2 border-muted-foreground/20 pl-4">
                Senior full-stack or staff-level engineering roles
              </li>
              <li className="border-l-2 border-muted-foreground/20 pl-4">
                Startups and mid-size companies — no giant corps
              </li>
              <li className="border-l-2 border-muted-foreground/20 pl-4">
                Teams that value ownership, autonomy, and shipping
              </li>
              <li className="border-l-2 border-muted-foreground/20 pl-4">
                Remote or Pacific Northwest
              </li>
            </ul>
          </div>

          <div>
            <SectionLabel>
              Reach Out
            </SectionLabel>
            <div className="mt-4 space-y-4">
              {SITE_CONFIG.email && (
                <div>
                  <H3 className="font-medium">Email</H3>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-muted-foreground underline hover:text-foreground"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              )}
              {SITE_CONFIG.social.linkedin && (
                <div>
                  <H3 className="font-medium">LinkedIn</H3>
                  <a
                    href={SITE_CONFIG.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline hover:text-foreground"
                  >
                    linkedin.com/in/lucaszapico
                  </a>
                </div>
              )}
              {SITE_CONFIG.social.github && (
                <div>
                  <H3 className="font-medium">GitHub</H3>
                  <a
                    href={SITE_CONFIG.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline hover:text-foreground"
                  >
                    github.com/lucaszapico
                  </a>
                </div>
              )}
              <div>
                <H3 className="font-medium">Based in</H3>
                <Body>{SITE_CONFIG.location}</Body>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-8">
          <H2 className="text-xl">Quick Overview</H2>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Experience</span>
              <p>8+ years full-stack development</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Focus</span>
              <p>
                Internal tools, commerce platforms, data-driven applications
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Stack</span>
              <p>
                TypeScript, React, Node.js/NestJS, PostgreSQL, Docker, Python
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Approach</span>
              <p>
                Architecture-first, end-to-end ownership, AI-augmented workflow
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/work"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              See my work
            </Link>
            <Link
              to="/how-i-work"
              className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm transition-colors hover:bg-accent"
            >
              Read my approach
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
