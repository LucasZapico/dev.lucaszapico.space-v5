import { Link, data } from "react-router";
import type { Route } from "./+types/work.$slug";
import { caseStudies, caseStudyOrder } from "~/lib/case-studies";
import { generateMeta } from "~/lib/meta";
import { caseStudySchema } from "~/lib/schema";
import { JsonLd } from "~/components/common/json-ld";
import { CaseHero } from "~/components/case-study/case-hero";
import { CaseSectionRenderer } from "~/components/case-study/case-section";
import { H2, H3, Body, Small } from "~/components/common/typography";
import { FadeIn } from "~/components/common/animate";
import { AudioPlayer } from "~/components/common/audio-player";
import { Section } from "~/components/common/section";
import { Prose } from "~/components/common/prose";
import { FloatingNav } from "~/components/common/floating-nav";

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
  return generateMeta({
    title: `${study.title} — Lucas Zapico`,
    description: study.impact,
    path: `/work/${slug}`,
    image: study.heroImages?.[0],
    imageAlt: study.title,
    ogType: "article",
  });
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
    <main>
      <JsonLd data={caseStudySchema(study)} />
      {/* Breadcrumbs */}
      <nav className="px-8 pt-6 md:px-12">
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

      {study.audio && (
        <Prose className="px-8 pt-8 md:px-12">
          <p className="mb-2 text-xs text-muted-foreground/60 uppercase tracking-widest">Listen</p>
          <AudioPlayer src={study.audio} />
        </Prose>
      )}

      <Prose size="lg" as="article" className="px-8 py-8 md:px-12">
        {study.sections.map((section, i) => (
          <CaseSectionRenderer
            key={section.heading}
            section={section}
            index={i}
          />
        ))}
      </Prose>

      {/* CTA */}
      <FadeIn>
        <Section padding="xl" as="div" className="px-8 md:px-12">
          <Prose>
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
          </Prose>
        </Section>
      </FadeIn>

      <FloatingNav
        prev={prev ? { slug: prev.slug, title: prev.title, image: prev.heroImages?.[0] } : null}
        next={next ? { slug: next.slug, title: next.title, image: next.heroImages?.[0] } : null}
        basePath="/work"
      />
    </main>
  );
}
