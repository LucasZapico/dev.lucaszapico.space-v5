import { isRouteErrorResponse, Link, Outlet, useLocation } from "react-router";
import { SiteHeader } from "~/components/layout/site-header";
import { SiteFooter } from "~/components/layout/site-footer";
import { PageTransition } from "~/components/common/page-transition";
import { SiteEffects } from "~/components/common/site-effects";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/layout";

export default function SiteLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <SiteEffects />
      <div className="pt-16">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </div>
      <SiteFooter />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let status = 500;
  let heading = "Something went wrong";
  let message = "An unexpected error occurred. Please try again later.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) {
      heading = "Page not found";
      message =
        "The page you're looking for doesn't exist — it may have been moved or you might have mistyped the URL.";
    } else {
      heading = "Something broke";
      message = error.statusText || message;
    }
  }

  return (
    <main className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
      <style>{`
        @keyframes glitch-shift {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
        }
        @keyframes glitch-clip-1 {
          0% { clip-path: inset(20% 0 60% 0); }
          20% { clip-path: inset(50% 0 10% 0); }
          40% { clip-path: inset(10% 0 70% 0); }
          60% { clip-path: inset(80% 0 0% 0); }
          80% { clip-path: inset(30% 0 40% 0); }
          100% { clip-path: inset(60% 0 20% 0); }
        }
        @keyframes glitch-clip-2 {
          0% { clip-path: inset(60% 0 10% 0); }
          20% { clip-path: inset(10% 0 60% 0); }
          40% { clip-path: inset(70% 0 10% 0); }
          60% { clip-path: inset(0% 0 80% 0); }
          80% { clip-path: inset(40% 0 30% 0); }
          100% { clip-path: inset(20% 0 50% 0); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .error-code {
          position: relative;
          font-size: clamp(8rem, 20vw, 14rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .error-code::before,
        .error-code::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          opacity: 0.8;
        }
        .error-code::before {
          color: hsl(10, 79%, 56%);
          animation: glitch-clip-1 3s infinite linear alternate, glitch-shift 0.3s infinite linear alternate;
          animation-delay: -0.1s;
        }
        .error-code::after {
          color: hsl(184, 96%, 40%);
          animation: glitch-clip-2 3s infinite linear alternate, glitch-shift 0.3s infinite linear alternate reverse;
          animation-delay: -0.2s;
        }
      `}</style>

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
        <div
          className="h-[2px] w-full bg-foreground"
          style={{ animation: "scanline 4s linear infinite" }}
        />
      </div>

      <div
        className="error-code text-foreground/10"
        data-text={String(status)}
        aria-hidden="true"
      >
        {status}
      </div>

      <h1 className="-mt-4 text-2xl font-bold tracking-tight md:text-3xl">
        {heading}
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">{message}</p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link to="/">Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Report an issue</Link>
        </Button>
      </div>
    </main>
  );
}
