import { useState } from "react";
import { Link, useLocation } from "react-router";
import { IoMenu, IoClose } from "react-icons/io5";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { SITE_CONFIG } from "~/lib/site-config";

export const navigation = [
  { name: "Work", href: "/work" },
  { name: "Lab", href: "/lab" },
  { name: "Approach", href: "/how-i-work" },
  { name: "About", href: "/about" },
  { name: "Connect", href: "/contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-sm border-b border-white/10 mix-blend-difference">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="font-heading text-lg"
          style={{ mixBlendMode: "difference", color: "white" }}
        >
          {SITE_CONFIG.name}
        </Link>
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`link-draw text-sm transition-opacity hover:opacity-100 ${
                    pathname === item.href ? "opacity-100 font-medium" : "opacity-50"
                  }`}
                  style={{ mixBlendMode: "difference", color: "white" }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IoClose className="h-5 w-5" /> : <IoMenu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/95 px-4 pb-4 md:hidden">
          <ul className="space-y-1 pt-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10 ${
                    pathname === item.href
                      ? "text-white font-medium bg-white/10"
                      : "text-white/60"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
