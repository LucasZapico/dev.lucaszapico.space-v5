import { Link, data } from "react-router";
import type { Route } from "./+types/lab.$slug";
import { builds, buildOrder, statusLabel } from "~/lib/builds";
import { generateMeta } from "~/lib/meta";
import { buildSchema } from "~/lib/schema";
import { JsonLd } from "~/components/common/json-ld";
import { H1, H2, H3, Body, Small } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";
import { AudioPlayer } from "~/components/common/audio-player";
import { Section } from "~/components/common/section";
import { FloatingNav } from "~/components/common/floating-nav";

export function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug || !builds[slug]) {
    throw data(null, { status: 404 });
  }
  return { slug };
}

export function meta({ params }: Route.MetaArgs) {
  const slug = params.slug;
  const build = slug ? builds[slug] : undefined;
  if (!build) return [];
  return generateMeta({
    title: `${build.title} — Lab — Lucas Zapico`,
    description: build.tagline,
    path: `/lab/${slug}`,
    image: build.image,
    imageAlt: build.title,
    ogType: "article",
  });
}

const statusColors: Record<string, string> = {
  shipped: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  running: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "in-progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  prototype: "bg-secondary text-muted-foreground",
};

export default function LabBuildPage({ loaderData }: Route.ComponentProps) {
  const { slug } = loaderData;
  const build = builds[slug];

  const currentIndex = buildOrder.indexOf(slug);
  const prevSlug = currentIndex > 0 ? buildOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < buildOrder.length - 1 ? buildOrder[currentIndex + 1] : null;
  const prev = prevSlug ? builds[prevSlug] : null;
  const next = nextSlug ? builds[nextSlug] : null;

  return (
    <main className="overflow-x-hidden">
      <JsonLd data={buildSchema(build)} />
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-3xl px-4 pt-6">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/lab" className="transition-colors hover:text-foreground">Lab</Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{build.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <FadeIn>
        <header className="mx-auto max-w-3xl px-4 pt-12 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[build.status]}`}>
              {statusLabel[build.status]}
            </span>
            <span className="text-sm text-muted-foreground">{build.category}</span>
          </div>
          <H1 className="mt-4">{build.title}</H1>
          <p className="mt-3 text-lg text-muted-foreground">{build.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {build.stack.map((tech) => (
              <span key={tech} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                {tech}
              </span>
            ))}
          </div>

          {build.links.length > 0 && (
            <div className="mt-6 flex gap-4">
              {build.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label} →
                </a>
              ))}
            </div>
          )}

          {build.audio && (
            <div className="mt-6">
              <p className="mb-2 text-xs text-muted-foreground/60 uppercase tracking-widest">Listen</p>
              <AudioPlayer src={build.audio} />
            </div>
          )}
        </header>
      </FadeIn>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        {/* Problem */}
        {build.problem && (
          <FadeIn>
            <Section padding="md" as="div">
              <H2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
                The Problem
              </H2>
              <Body className="text-base leading-relaxed">{build.problem}</Body>
            </Section>
          </FadeIn>
        )}

        {/* Overview */}
        <FadeIn>
          <Section padding="md" divider={!build.problem} as="div">
            <Body className="text-base leading-relaxed">{build.overview}</Body>
          </Section>
        </FadeIn>

        {/* Highlights */}
        <Section padding="md" as="div">
          <FadeIn>
            <H2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              What's interesting
            </H2>
          </FadeIn>
          <div className="mt-8 space-y-10">
            {build.highlights.map((h) => (
              <FadeIn key={h.title}>
                <div>
                  <H3 className="text-base">{h.title}</H3>
                  <Body className="mt-2">{h.body}</Body>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>

        {/* Why this matters */}
        {build.closing && (
          <FadeIn>
            <Section padding="md" as="div">
              <H2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Why this matters
              </H2>
              <Body className="text-base leading-relaxed">{build.closing}</Body>
            </Section>
          </FadeIn>
        )}
      </article>

      <FloatingNav prev={prev} next={next} basePath="/lab" />
    </main>
  );
}
