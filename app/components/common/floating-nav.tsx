import { Link } from "react-router";

interface NavItem {
  slug: string;
  title: string;
  image?: string;
}

interface FloatingNavProps {
  prev: NavItem | null;
  next: NavItem | null;
  basePath: string;
}

export function FloatingNav({ prev, next, basePath }: FloatingNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-1/2 z-40 flex -translate-y-1/2 items-center justify-between px-4">
      {prev ? (
        <div className="group relative pointer-events-auto">
          {prev.image && (
            <div className="absolute bottom-full left-0 mb-3 w-64 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
              <img
                src={prev.image}
                alt={prev.title}
                className="w-full rounded-lg border shadow-xl"
              />
            </div>
          )}
          <Link
            to={`${basePath}/${prev.slug}`}
            aria-label={`Previous: ${prev.title}`}
            className="flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm shadow-lg backdrop-blur-sm transition-colors hover:bg-background"
          >
            <span aria-hidden>←</span>
            <span className="max-w-[160px] truncate">{prev.title}</span>
          </Link>
        </div>
      ) : <div />}
      {next ? (
        <div className="group relative pointer-events-auto">
          {next.image && (
            <div className="absolute bottom-full right-0 mb-3 w-64 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
              <img
                src={next.image}
                alt={next.title}
                className="w-full rounded-lg border shadow-xl"
              />
            </div>
          )}
          <Link
            to={`${basePath}/${next.slug}`}
            aria-label={`Next: ${next.title}`}
            className="flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm shadow-lg backdrop-blur-sm transition-colors hover:bg-background"
          >
            <span className="max-w-[160px] truncate">{next.title}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      ) : <div />}
    </div>
  );
}
