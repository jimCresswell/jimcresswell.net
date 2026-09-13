/**
 * Page-specific JSON-LD subgraphs derived from the entity model.
 *
 * Each page gets a closed subgraph: starting from seed entities, the
 * subgraph closure algorithm follows all `@id` references outward until
 * no new entities are found. The result is self-contained — every
 * reference resolves to an entity within the subgraph.
 *
 * URL rewriting replaces canonical base URLs with the deployment-specific
 * SITE_URL (production, preview, or local).
 */
import { entities, type EntityGraph } from "./entities";
import { getPageDocumentContractByRouteKey } from "./page-document-contract";
import { rewriteEntityGraphUrls } from "./rewrite-jsonld-urls";
import { extractSubgraph } from "./subgraph";
import { SITE_URL } from "./site-config";

function buildSubgraph(seedIds: string[]): EntityGraph {
  const subgraph = extractSubgraph(entities, seedIds);
  return rewriteEntityGraphUrls(
    {
      "@context": "https://schema.org",
      "@graph": subgraph,
    },
    SITE_URL
  );
}

const identitySeeds = entities
  .filter((e) => e["@type"] === "Intangible" || e["@type"] === "Statement")
  .map((e) => e["@id"]);

const capabilitySeeds = entities.filter((e) => e["@type"] === "DefinedTerm").map((e) => e["@id"]);

const softwareSeeds = entities
  .filter(
    (e) =>
      e["@type"] === "SoftwareSourceCode" ||
      e["@type"] === "WebAPI" ||
      e["@type"] === "CreativeWork"
  )
  .map((e) => e["@id"]);

/**
 * Front page JSON-LD — identity-focused subgraph.
 *
 * Seeds: Person, WebSite, front page ProfilePage, identity constructs,
 * and capabilities. The closure follows references outward
 * to include all connected entities.
 */
export const frontPageJsonLd = buildSubgraph([
  "https://www.jimcresswell.net/#person",
  "https://www.jimcresswell.net/#website",
  getPageDocumentContractByRouteKey("home").pageEntityCanonicalId,
  ...identitySeeds,
  ...capabilitySeeds,
]);

/**
 * CV page JSON-LD — full career graph.
 *
 * Seeds: Person, WebSite, CV ProfilePage, all identity/capability/software
 * entities. The closure produces the complete graph.
 */
export const cvPageJsonLd = buildSubgraph([
  "https://www.jimcresswell.net/#person",
  "https://www.jimcresswell.net/#website",
  getPageDocumentContractByRouteKey("cv").pageEntityCanonicalId,
  ...identitySeeds,
  ...capabilitySeeds,
  ...softwareSeeds,
]);
