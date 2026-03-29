import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/webp", href: "/favicon.webp" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}})()`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let status = 500;
  let heading = "Something broke";
  let details = "An unexpected error occurred. We're on it.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    heading = status === 404 ? "Page not found" : "Something broke";
    details =
      status === 404
        ? "The page you're looking for doesn't exist — it may have been moved or you might have mistyped the URL."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
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
        .root-error-code {
          position: relative;
          font-size: clamp(8rem, 20vw, 14rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          opacity: 0.08;
        }
        .root-error-code::before,
        .root-error-code::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          opacity: 0.8;
        }
        .root-error-code::before {
          color: hsl(10, 79%, 56%);
          animation: glitch-clip-1 3s infinite linear alternate, glitch-shift 0.3s infinite linear alternate;
          animation-delay: -0.1s;
        }
        .root-error-code::after {
          color: hsl(184, 96%, 40%);
          animation: glitch-clip-2 3s infinite linear alternate, glitch-shift 0.3s infinite linear alternate reverse;
          animation-delay: -0.2s;
        }
      `}</style>

      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          opacity: 0.03,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            height: "2px",
            width: "100%",
            backgroundColor: "currentColor",
            animation: "scanline 4s linear infinite",
          }}
        />
      </div>

      <div
        className="root-error-code"
        data-text={String(status)}
        aria-hidden="true"
      >
        {status}
      </div>

      <h1
        style={{
          marginTop: "-0.5rem",
          fontSize: "1.5rem",
          fontWeight: 700,
          letterSpacing: "-0.025em",
        }}
      >
        {heading}
      </h1>
      <p
        style={{
          marginTop: "1rem",
          maxWidth: "28rem",
          opacity: 0.6,
        }}
      >
        {details}
      </p>

      <a
        href="/"
        style={{
          marginTop: "2rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.625rem 1.25rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          borderRadius: "0.375rem",
          backgroundColor: "var(--primary, #1a1a1a)",
          color: "var(--primary-foreground, #fafafa)",
          textDecoration: "none",
        }}
      >
        Back home
      </a>

      {stack && (
        <pre
          style={{
            marginTop: "2rem",
            width: "100%",
            maxWidth: "48rem",
            padding: "1rem",
            overflow: "auto",
            textAlign: "left",
            fontSize: "0.75rem",
            opacity: 0.5,
            borderRadius: "0.5rem",
            border: "1px solid var(--border, #e5e5e5)",
          }}
        >
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
