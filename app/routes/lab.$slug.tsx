import { Link, data } from "react-router";
import type { Route } from "./+types/lab.$slug";
import { builds, buildOrder, statusLabel } from "~/lib/builds";
import { SITE_CONFIG } from "~/lib/site-config";
import { H1, H2, H3, Body, Small } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";

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
  const title = `${build.title} — Lab — Lucas Zapico`;
  const description = build.tagline;
  const url = `${SITE_CONFIG.website}/lab/${slug}`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
  ];
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
        </header>
      </FadeIn>

      <article className="mx-auto max-w-3xl px-4 pb-16">
        {/* Problem */}
        {build.problem && (
          <FadeIn>
            <section className="border-t pt-10 pb-12">
              <H2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
                The Problem
              </H2>
              <Body className="text-base leading-relaxed">{build.problem}</Body>
            </section>
          </FadeIn>
        )}

        {/* Overview */}
        <FadeIn>
          <section className={`pb-12 ${build.problem ? "" : "border-t pt-10"}`}>
            <Body className="text-base leading-relaxed">{build.overview}</Body>
          </section>
        </FadeIn>

        {/* Highlights */}
        <section className="border-t pt-10">
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
        </section>
      </article>

      {/* Prev / Next */}
      <FadeIn>
        <nav className="mx-auto mt-8 mb-16 grid grid-cols-2 gap-4 px-4 max-w-3xl">
          {prev ? (
            <Link
              to={`/lab/${prev.slug}`}
              className="group rounded-lg border border-border/50 p-5 transition-colors hover:border-border"
            >
              <Small className="text-muted-foreground/60">&larr; Previous</Small>
              <H3 className="mt-1 text-base transition-colors group-hover:text-foreground/80">
                {prev.title}
              </H3>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to={`/lab/${next.slug}`}
              className="group rounded-lg border border-border/50 p-5 text-right transition-colors hover:border-border"
            >
              <Small className="text-muted-foreground/60">Next &rarr;</Small>
              <H3 className="mt-1 text-base transition-colors group-hover:text-foreground/80">
                {next.title}
              </H3>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </FadeIn>
    </main>
  );
}
