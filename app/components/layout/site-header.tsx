import { useState } from "react";
import { Link } from "react-router";
import { IoMenu, IoClose } from "react-icons/io5";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { SITE_CONFIG } from "~/lib/site-config";

export const navigation = [
  { name: "Work", href: "/work" },
  { name: "Approach", href: "/how-i-work" },
  { name: "About", href: "/about" },
  { name: "Connect", href: "/contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-heading text-lg">
          {SITE_CONFIG.name}
        </Link>
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <IoClose className="h-5 w-5" />
            ) : (
              <IoMenu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          <ul className="space-y-1 pt-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
