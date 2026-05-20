import { Link, data } from "react-router";
import type { Route } from "./+types/articles.$slug";
import { articles, articleSeries, getPublishedArticles } from "~/lib/articles";
import { generateMeta } from "~/lib/meta";
import { articleSchema } from "~/lib/schema";
import { cn } from "~/lib/utils";
import { JsonLd } from "~/components/common/json-ld";
import { H1, H2, H3, Body, Small } from "~/components/common/typography";
import { Section } from "~/components/common/section";
import { Prose } from "~/components/common/prose";
import { CodeBlock } from "~/components/common/code-block";
import { ArticleLayout } from "~/components/article/article-layout";

export function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug || !articles[slug] || (articles[slug].draft && !import.meta.env.DEV)) {
    throw data(null, { status: 404 });
  }
  return { slug };
}

export function meta({ params }: Route.MetaArgs) {
  const slug = params.slug;
  const article = slug ? articles[slug] : undefined;
  if (!article) return [];
  return generateMeta({
    title: `${article.title} — Lucas Zapico`,
    description: article.summary,
    path: `/articles/${slug}`,
    ogType: "article",
  });
}

function renderPara(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return <Link key={i} to={m[2]} className="underline underline-offset-2 hover:text-primary transition-colors">{m[1]}</Link>;
    return part;
  });
}

export default function ArticlePage({ loaderData }: Route.ComponentProps) {
  const { slug } = loaderData;
  const article = articles[slug];

  const published = getPublishedArticles(import.meta.env.DEV);
  const currentIndex = published.findIndex((a) => a.slug === slug);
  const prev = currentIndex > 0 ? published[currentIndex - 1] : null;
  const next = currentIndex < published.length - 1 ? published[currentIndex + 1] : null;

  const seriesSlug = articleSeries[slug];
  const seriesArticles = seriesSlug
    ? published.filter((a) => articleSeries[a.slug] === seriesSlug && a.slug !== slug)
    : [];

  return (
    <main>
      <JsonLd data={articleSchema(article)} />

      <nav className="mx-auto max-w-6xl px-8 pt-6 md:px-12">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/articles" className="transition-colors hover:text-foreground">Articles</Link>
          </li>
          <li>/</li>
          <li className="truncate max-w-[200px] text-foreground">{article.title}</li>
        </ol>
      </nav>

      <ArticleLayout seriesArticles={seriesArticles}>
        <div className="pt-12 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              {article.category}
            </span>
            <Small className="text-muted-foreground">{article.readingTime} read</Small>
            <Small className="text-muted-foreground">
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Small>
          </div>
          <H1 className="mt-4">{article.title}</H1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{article.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <article className="pb-16">
          {article.sections.map((section, i) => (
            <Section key={i} padding="md" as="div" divider={i > 0}>
              {section.heading && (
                <H2 className="mb-4">{section.heading}</H2>
              )}
              {section.body.split("\n\n").map((para, j) => (
                <Body key={j} className="mt-4 leading-relaxed first:mt-0">
                  {renderPara(para)}
                </Body>
              ))}
              {section.code && (
                <CodeBlock
                  code={section.code.content}
                  language={section.code.language}
                  filename={section.code.filename}
                />
              )}
              {section.note && (
                <div className="mt-6 rounded-lg border-l-2 border-primary/40 bg-secondary/50 px-5 py-4">
                  <Body className="text-sm text-muted-foreground">{renderPara(section.note)}</Body>
                </div>
              )}
            </Section>
          ))}
        </article>
      </ArticleLayout>

      <Section padding="lg" as="div" className="mx-auto max-w-6xl px-8 md:px-12">
        <Prose size="md">
          <div className="mb-6">
            <Link
              to="/articles"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← All Articles
            </Link>
          </div>
          {(prev || next) && (
            <div className="grid grid-cols-12 gap-6">
              {prev && (
                <Link
                  to={`/articles/${prev.slug}`}
                  className="col-span-12 md:col-span-6 rounded-lg border p-6 transition-colors hover:bg-secondary/50"
                >
                  <Small className="text-muted-foreground">Previous</Small>
                  <H3 className="mt-1 text-base">{prev.title}</H3>
                </Link>
              )}
              {next && (
                <Link
                  to={`/articles/${next.slug}`}
                  className={cn(
                    "col-span-12 md:col-span-6 rounded-lg border p-6 text-right transition-colors hover:bg-secondary/50",
                    !prev && "md:col-start-7"
                  )}
                >
                  <Small className="text-muted-foreground">Next</Small>
                  <H3 className="mt-1 text-base">{next.title}</H3>
                </Link>
              )}
            </div>
          )}
        </Prose>
      </Section>
    </main>
  );
}
