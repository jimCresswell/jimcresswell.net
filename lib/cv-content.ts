/**
 * Central content accessor for CV data.
 *
 * Editorial prose lives in `content/cv.content.json`. Shared entity data
 * (Person name, description, links) comes from the entity model. Derived
 * metadata (Open Graph) is constructed here so that changes flow through
 * a single source of truth. JSON-LD is constructed in {@link ./jsonld.ts}.
 */
import cvContentJson from "@/content/cv.content.json";
import { person } from "./entities";
import { SITE_URL } from "./site-config";

/** CV content — editorial prose from the page composition file. */
export const cvContent = cvContentJson;

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
  linkedin: cvContent.links.linkedin,
  github: cvContent.links.github,
  google_scholar: cvContent.links.google_scholar,
  shiv: cvContent.links.shiv,
};

/**
 * Active tilt keys — only these generate routes.
 * Should match `cvContent.tilts._meta.web_routes`.
 */
export const activeTiltKeys: readonly string[] =
  cvContent.tilts._meta.web_routes ?? cvContent.tilts._meta.order.slice(0, 1);
type ActiveTiltKey = (typeof activeTiltKeys)[number];

/** Look up a tilt by key. Returns `null` if the key is not recognised. */
export function getTilt(key: string) {
  if (key === "public_sector") return cvContent.tilts.public_sector;
  if (key === "private_ai") return cvContent.tilts.private_ai;
  if (key === "founder") return cvContent.tilts.founder;
  return null;
}

/** Type guard: is `key` one of the active tilt keys? */
export function isActiveTiltKey(key: string): key is ActiveTiltKey {
  return activeTiltKeys.includes(key);
}
