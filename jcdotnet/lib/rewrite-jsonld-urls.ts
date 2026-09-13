import { EntityGraphSchema, type EntityGraph } from "./entities";

const CANONICAL_BASE = "https://www.jimcresswell.net";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Rewrite one canonical URL to the site URL, or return the value unchanged.
 *
 * The check is on the parsed origin, never a string prefix: a prefix test
 * would also rewrite `https://www.jimcresswell.net.example/…`, whose host
 * merely begins with the canonical host. Path, query and fragment travel
 * verbatim; anything that is not an absolute URL on the canonical origin is
 * returned as it came.
 *
 * @param value - A string from the entity graph; may or may not be a URL.
 * @param siteUrl - Deployment-specific site origin to substitute.
 * @returns The rewritten URL, or `value` unchanged.
 */
export function rewriteCanonicalUrl(value: string, siteUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return value;
  }
  if (parsed.origin !== CANONICAL_BASE) {
    return value;
  }
  return `${siteUrl}${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function rewriteUrls(value: unknown, siteUrl: string): unknown {
  if (typeof value === "string") {
    return rewriteCanonicalUrl(value, siteUrl);
  }
  if (Array.isArray(value)) {
    return value.map((item) => rewriteUrls(item, siteUrl));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, rewriteUrls(entry, siteUrl)])
    );
  }
  return value;
}

/**
 * Rewrite canonical URLs in a JSON-LD entity graph to a specific site URL.
 *
 * The output is re-validated through the entity graph schema so type safety
 * comes from parsing rather than assertion.
 *
 * @param graph - Validated entity graph using the canonical domain
 * @param siteUrl - Deployment-specific site URL to substitute
 * @returns Entity graph with deployment-specific URLs
 */
export function rewriteEntityGraphUrls(graph: EntityGraph, siteUrl: string): EntityGraph {
  return EntityGraphSchema.parse(rewriteUrls(graph, siteUrl));
}
