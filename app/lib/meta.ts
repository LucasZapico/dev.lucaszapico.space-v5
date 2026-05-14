import { SITE_CONFIG } from "~/lib/site-config";

const DEFAULT_OG_IMAGE = "/og-image.png";
const OG_IMAGE_WIDTH = "1200";
const OG_IMAGE_HEIGHT = "630";

interface MetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
}

export function generateMeta({
  title,
  description,
  path = "",
  image = DEFAULT_OG_IMAGE,
  imageAlt,
}: MetaOptions) {
  const url = `${SITE_CONFIG.website}${path}`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_CONFIG.website}${image}`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_CONFIG.name },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: OG_IMAGE_WIDTH },
    { property: "og:image:height", content: OG_IMAGE_HEIGHT },
    { property: "og:image:alt", content: imageAlt ?? title },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];
}
