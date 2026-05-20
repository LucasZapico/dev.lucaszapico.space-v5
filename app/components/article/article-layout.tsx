import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { Article } from "~/lib/articles";
import { Small } from "~/components/common/typography";

interface ArticleLayoutProps {
  children: React.ReactNode;
  seriesArticles: Article[];
}

export function ArticleLayout({ children, seriesArticles }: ArticleLayoutProps) {
  const hasSidebar = seriesArticles.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-8 md:px-12">
      <div className={cn(hasSidebar && "xl:grid xl:grid-cols-[1fr_220px] xl:gap-12")}>
        <div className={cn(!hasSidebar ? "max-w-2xl mx-auto" : "xl:max-w-[42rem]")}>
          {children}
        </div>

        {hasSidebar && (
          <aside className="hidden xl:block">
            <div className="sticky top-24 pt-12">
              <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                In This Series
              </p>
              <div className="flex flex-col gap-2">
                {seriesArticles.map((a) => (
                  <Link
                    key={a.slug}
                    to={`/articles/${a.slug}`}
                    className="group rounded-lg border p-4 transition-colors hover:bg-secondary/50"
                  >
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {a.category}
                    </span>
                    <p className="mt-2 text-sm font-medium leading-snug transition-colors group-hover:text-primary">
                      {a.title}
                    </p>
                    <Small className="mt-1 block text-muted-foreground/60">
                      {a.readingTime} read
                    </Small>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
