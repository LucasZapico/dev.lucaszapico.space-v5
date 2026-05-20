import { Link } from "react-router";
import { generateMeta } from "~/lib/meta";
import { getPublishedArticles } from "~/lib/articles";
import { H1, H2, Body, Lead, Small } from "~/components/common/typography";
import { Section } from "~/components/common/section";

export function meta() {
  return generateMeta({
    title: "Articles — Lucas Zapico",
    description: "Writing on ML engineering, system architecture, and engineering craft.",
    path: "/articles",
  });
}

export default function ArticlesPage() {
  const list = getPublishedArticles(import.meta.env.DEV);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <Section padding="sm" as="div">
        <H1>Articles</H1>
        <Lead className="mt-4 max-w-2xl">
          Writing on ML engineering, system design, and the decisions that don't make it into the code.
        </Lead>
      </Section>

      <Section padding="md" as="div" divider>
        <div className="grid grid-cols-12 gap-6">
          {list.map((article) => (
            <div key={article.slug} className="col-span-12 md:col-span-6">
              <Link
                to={`/articles/${article.slug}`}
                className="group block h-full rounded-lg border p-6 transition-colors hover:bg-secondary/50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                    {article.category}
                  </span>
                  <Small className="text-muted-foreground">{article.readingTime} read</Small>
                </div>
                <H2 className="mt-3 text-xl transition-colors group-hover:text-primary">
                  {article.title}
                </H2>
                <Body className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {article.summary}
                </Body>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary/60 px-2 py-0.5 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <Small className="mt-4 block text-muted-foreground/60">
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Small>
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
