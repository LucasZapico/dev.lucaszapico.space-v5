import { SITE_CONFIG } from "~/lib/site-config";

interface MetaOptions {
  title: string;
  description: string;
  path?: string;
}

export function generateMeta({ title, description, path = "" }: MetaOptions) {
  const url = `${SITE_CONFIG.website}${path}`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_CONFIG.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}
