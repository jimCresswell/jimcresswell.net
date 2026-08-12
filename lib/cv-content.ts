/**
 * Central content accessor for CV data.
 *
 * Editorial prose lives in `content/cv.content.json`. Shared entity data
 * (Person name, description, links) comes from the entity model. Derived
 * metadata (Open Graph) is constructed here so editorial and entity-backed
 * fields stay aligned. JSON-LD is constructed in {@link ./jsonld.ts}.
 */
import cvContentJson from "@/content/cv.content.json";
import { person } from "./entities";
import { resolveSameAsUrlByHostname } from "./same-as";
import { SITE_URL } from "./site-config";

/** CV content — editorial prose from the page composition file. */
export const cvContent = cvContentJson;

/**
 * CV composition data with graph-owned identity atoms injected at the
 * application boundary.
 */
export const cvLayoutContent = {
  ...cvContent,
  meta: { ...cvContent.meta, name: person.name },
  links: { ...cvContent.links, email: person.email },
};

/** OG image metadata — static, matches the generated OG image asset. */
const OG_IMAGE = {
  url: `${SITE_URL}/icons/og-image.png`,
  alt: `${person.name} — CV`,
  width: 1200,
  height: 630,
};

/**
 * Open Graph metadata for the CV page.
 *
 * Person name and description derive from the entity model. Locale and
 * page-specific metadata derive from `cv.content.json`.
 *
 * Note: `type` is omitted because page metadata exports hardcode it as
 * `"website"` — it is not an editorial choice that should live here.
 */
export const cvOpenGraph = {
  url: `${SITE_URL}/cv/`,
  title: `${person.name} — CV`,
  description: person.description,
  locale: cvContent.meta.locale.replace("-", "_"),
  siteName: person.name,
  image: OG_IMAGE,
};

/** Shared footer links (consistent across all pages). */
export const footerLinks = {
  linkedin: resolveSameAsUrlByHostname(person.sameAs, "www.linkedin.com"),
  github: resolveSameAsUrlByHostname(person.sameAs, "github.com"),
  google_scholar: resolveSameAsUrlByHostname(person.sameAs, "scholar.google.co.uk"),
  shiv: cvContent.links.shiv,
};
