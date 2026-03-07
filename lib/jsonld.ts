/**
 * JSON-LD structured data derived from the personal knowledge graph.
 *
 * All entity data lives in `content/entities.json`, validated through Zod
 * schemas in `lib/entities.ts`. This module rewrites canonical URLs to the
 * deployment-specific base (production, preview, or local) and exports the
 * graph for consumption by page components and the `/api/graph` endpoint.
 */
import { entityGraph } from "./entities";
import { SITE_URL } from "./site-config";

const CANONICAL_BASE = "https://www.jimcresswell.net";

/**
 * Recursively rewrite canonical URLs to deployment-specific URLs.
 *
 * Only strings starting with the canonical base are rewritten. External URLs
 * (Wikidata, GitHub, DOIs, arXiv) pass through unchanged.
 */
function rewriteUrls(value: unknown): unknown {
  if (typeof value === "string") {
    return value.startsWith(CANONICAL_BASE) ? SITE_URL + value.slice(CANONICAL_BASE.length) : value;
  }
  if (Array.isArray(value)) {
    return value.map(rewriteUrls);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteUrls(v)]));
  }
  return value;
}

/**
 * Complete JSON-LD structured data for the site.
 *
 * Contains the full entity graph with deployment-specific URLs.
 * Page components inject this into `<script type="application/ld+json">`.
 * The `/api/graph` endpoint serves it as standalone JSON.
 */
export const jsonLd = rewriteUrls(entityGraph) as typeof entityGraph;
