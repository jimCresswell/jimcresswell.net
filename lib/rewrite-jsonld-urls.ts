import { EntityGraphSchema, type EntityGraph } from "./entities";

const CANONICAL_BASE = "https://www.jimcresswell.net";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function rewriteUrls(value: unknown, siteUrl: string): unknown {
  if (typeof value === "string") {
    return value.startsWith(CANONICAL_BASE) ? siteUrl + value.slice(CANONICAL_BASE.length) : value;
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
