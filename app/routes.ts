import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sitemap.xml", "routes/sitemap[.]xml.tsx"),
  layout("routes/layout.tsx", [
    route("work", "routes/work.tsx"),
    route("work/:slug", "routes/work.$slug.tsx"),
    route("how-i-work", "routes/how-i-work.tsx"),
    route("articles", "routes/articles.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
    route("docs", "routes/docs.tsx"),
    route("style-guide", "routes/style-guide.tsx"),
    route("*", "routes/splat.tsx"),
  ]),
] satisfies RouteConfig;
