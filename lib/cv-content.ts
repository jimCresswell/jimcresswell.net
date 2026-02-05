// Import content from JSON files - single source of truth
import cvContentJson from "@/content/cv.content.json";
import jsonLdJson from "@/content/jsonld.json";
import cvOgJson from "@/content/cv.og.json";

// CV content
export const cvContent = cvContentJson;

// JSON-LD structured data
export const jsonLd = jsonLdJson;

// Open Graph metadata
export const cvOpenGraph = cvOgJson;

// Shared footer links (consistent across all pages)
export const footerLinks = {
  email: cvContent.links.email,
  linkedin: cvContent.links.linkedin,
  github: cvContent.links.github,
  google_scholar: cvContent.links.google_scholar,
  shiv: cvContent.links.shiv,
};

// Active tilt keys (only these generate routes)
// This should match cvContent.tilts._meta.web_routes
export const activeTiltKeys = (cvContent.tilts._meta.web_routes ??
  cvContent.tilts._meta.order.slice(0, 1)) as readonly string[];
export type ActiveTiltKey = (typeof activeTiltKeys)[number];

export function getTilt(key: string) {
  if (key === "public_sector") return cvContent.tilts.public_sector;
  if (key === "private_ai") return cvContent.tilts.private_ai;
  if (key === "founder") return cvContent.tilts.founder;
  return null;
}

export function isActiveTiltKey(key: string): key is ActiveTiltKey {
  return activeTiltKeys.includes(key);
}
