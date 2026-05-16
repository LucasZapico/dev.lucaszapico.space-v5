import { SITE_CONFIG } from "~/lib/site-config";
import type { Article } from "~/lib/articles";
import type { CaseStudy } from "~/lib/case-studies";
import type { Build } from "~/lib/builds";

const SITE = SITE_CONFIG.website;

function abs(path: string) {
  return path.startsWith("http") ? path : `${SITE}${path}`;
}

const PERSON_REF = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: SITE_CONFIG.name,
  url: SITE,
};

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: SITE_CONFIG.name,
    jobTitle: "Full-Stack Engineer",
    url: SITE,
    email: `mailto:${SITE_CONFIG.email}`,
    image: abs("/og-image.png"),
    description: SITE_CONFIG.description,
    sameAs: [SITE_CONFIG.social.github, SITE_CONFIG.social.linkedin],
    knowsAbout: [
      "TypeScript",
      "Go",
      "Python",
      "React",
      "React Router",
      "NestJS",
      "PostgreSQL",
      "Docker",
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: SITE_CONFIG.title,
    url: SITE,
    description: SITE_CONFIG.description,
    author: PERSON_REF,
    inLanguage: "en",
  };
}

export function articleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    dateModified: article.date,
    author: PERSON_REF,
    publisher: PERSON_REF,
    url: `${SITE}/articles/${article.slug}`,
    image: abs("/og-image.png"),
    keywords: article.tags.join(", "),
    articleSection: article.category,
  };
}

export function caseStudySchema(study: CaseStudy) {
  const hero = study.heroImages?.[0];
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: study.overview,
    abstract: study.impact,
    author: PERSON_REF,
    creator: PERSON_REF,
    url: `${SITE}/work/${study.slug}`,
    image: abs(hero ?? "/og-image.png"),
    keywords: study.tags.join(", "),
    genre: study.category,
  };
}

export function buildSchema(build: Build) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: build.title,
    description: build.tagline,
    applicationCategory: build.category,
    author: PERSON_REF,
    creator: PERSON_REF,
    url: `${SITE}/lab/${build.slug}`,
    image: abs(build.image ?? "/og-image.png"),
    operatingSystem: "Web",
    softwareVersion: build.status,
  };
}
