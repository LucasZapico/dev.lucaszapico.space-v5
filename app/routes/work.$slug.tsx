import { Link, data } from "react-router";
import type { Route } from "./+types/work.$slug";
import { SITE_CONFIG } from "~/lib/site-config";
import { caseStudies, caseStudyOrder } from "~/lib/case-studies";
import { CaseHero } from "~/components/case-study/case-hero";
import { CaseSectionRenderer } from "~/components/case-study/case-section";
import { H2, H3, Body, Small } from "~/components/common/typography";

// ---------------------------------------------------------------------------
// Route loader / meta
// ---------------------------------------------------------------------------

export function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug || !caseStudies[slug]) {
    throw data(null, { status: 404 });
  }
  return { slug };
}

export function meta({ params }: Route.MetaArgs) {
  const slug = params.slug;
  const study = slug ? caseStudies[slug] : undefined;
  if (!study) return [];
  const title = `${study.title} — Lucas Zapico`;
  const description = `Case study: ${study.title}`;
  const url = `${SITE_CONFIG.website}/work/${slug}`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: SITE_CONFIG.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function CaseStudyPage({ loaderData }: Route.ComponentProps) {
  const { slug } = loaderData;
  const study = caseStudies[slug];

  const currentIndex = caseStudyOrder.indexOf(slug);
  const prevSlug = currentIndex > 0 ? caseStudyOrder[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < caseStudyOrder.length - 1
      ? caseStudyOrder[currentIndex + 1]
      : null;
  const prev = prevSlug ? caseStudies[prevSlug] : null;
  const next = nextSlug ? caseStudies[nextSlug] : null;

  return (
    <main className="overflow-x-hidden">
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 pt-6">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to="/work"
              className="transition-colors hover:text-foreground"
            >
              Work
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{study.title}</li>
        </ol>
      </nav>

      <CaseHero
        heroImages={study.heroImages}
        title={study.title}
        category={study.category}
        tags={study.tags}
        impact={study.impact}
        overview={study.overview}
      />

      <article className="mx-auto px-4 py-8" style={{ maxWidth: "650px" }}>
        {study.sections.map((section, i) => (
          <CaseSectionRenderer
            key={section.heading}
            section={section}
            index={i}
          />
        ))}
      </article>

      {/* CTA */}
      <div className="mx-auto mt-16 px-4" style={{ maxWidth: "650px" }}>
        <div className="rounded-lg bg-secondary p-8 text-center">
          <H2>Want to work together?</H2>
          <Body className="mt-2">
            I'm looking for a full-stack engineering role. Let's talk.
          </Body>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get in touch
          </Link>
        </div>
      </div>

      {/* Prev / Next */}
      <nav className="mx-auto mt-16 mb-16 grid grid-cols-2 gap-4 px-4" style={{ maxWidth: "650px" }}>
        {prev ? (
          <Link
            to={`/work/${prev.slug}`}
            className="group rounded-lg border border-border/50 p-5 transition-colors hover:border-border"
          >
            <Small className="text-muted-foreground/60">&larr; Previous</Small>
            <H3 className="mt-1 text-base group-hover:text-foreground/80 transition-colors">
              {prev.title}
            </H3>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to={`/work/${next.slug}`}
            className="group rounded-lg border border-border/50 p-5 text-right transition-colors hover:border-border"
          >
            <Small className="text-muted-foreground/60">Next &rarr;</Small>
            <H3 className="mt-1 text-base group-hover:text-foreground/80 transition-colors">
              {next.title}
            </H3>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </main>
  );
}
