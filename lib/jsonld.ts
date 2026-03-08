/**
 * JSON-LD structured data derived from the personal knowledge graph.
 *
 * All entity data lives in `content/entities.json`, validated through Zod
 * schemas in `lib/entities.ts`. This module rewrites canonical URLs to the
 * deployment-specific base (production, preview, or local) and exports the
 * graph for consumption by page components and the `/api/graph` endpoint.
 */
import { entityGraph, type EntityGraph } from "./entities";
import { rewriteEntityGraphUrls } from "./rewrite-jsonld-urls";
import { SITE_URL } from "./site-config";

/**
 * Build the full JSON-LD graph for a given deployment URL.
 *
 * @param siteUrl - Deployment-specific site URL
 * @returns Full entity graph with deployment-specific URLs
 */
export function buildJsonLd(siteUrl: string): EntityGraph {
  return rewriteEntityGraphUrls(entityGraph, siteUrl);
}

/**
 * Complete JSON-LD structured data for the site.
 *
 * Contains the full entity graph with deployment-specific URLs.
 * Page components inject this into `<script type="application/ld+json">`.
 * The `/api/graph` endpoint serves it as standalone JSON.
 */
export const jsonLd = buildJsonLd(SITE_URL);
