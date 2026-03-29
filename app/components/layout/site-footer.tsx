import { Link } from "react-router";
import { navigation } from "~/components/layout/site-header";
import { SITE_CONFIG } from "~/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
          </p>
          <ul className="flex flex-wrap justify-center gap-6">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
