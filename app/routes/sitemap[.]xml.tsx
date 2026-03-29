import { SITE_CONFIG } from "~/lib/site-config";

const pages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/work", priority: "0.9", changefreq: "weekly" },
  { path: "/work/glassblowing-studio", priority: "0.8", changefreq: "monthly" },
  { path: "/work/real-estate-mls", priority: "0.8", changefreq: "monthly" },
  { path: "/work/memory-care-platform", priority: "0.8", changefreq: "monthly" },
  { path: "/work/therapist-portal", priority: "0.8", changefreq: "monthly" },
  { path: "/work/fly-fishing-guide", priority: "0.7", changefreq: "monthly" },
  { path: "/how-i-work", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
];

export function loader() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_CONFIG.website}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
