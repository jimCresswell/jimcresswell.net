import type { Entity, EntityGraph } from "./entities";
import { frontPageJsonLd, cvPageJsonLd } from "./page-jsonld";
import { getPageDocumentContractByRouteKey } from "./page-document-contract";
import { SITE_URL } from "./site-config";

interface SearchStructuredDataViolation {
  routeKey: string;
  message: string;
}

const SEARCH_STRUCTURED_DATA_GRAPHS = [
  {
    routeKey: "home",
    graph: frontPageJsonLd,
  },
  {
    routeKey: "cv",
    graph: cvPageJsonLd,
  },
] as const;

/** Rich-result-facing structured-data integrity violations. */
export const searchStructuredDataViolations = SEARCH_STRUCTURED_DATA_GRAPHS.flatMap(
  ({ routeKey, graph }) => validateSearchStructuredData(routeKey, graph)
);

function validateSearchStructuredData(
  routeKey: string,
  graph: EntityGraph
): SearchStructuredDataViolation[] {
  const violations: SearchStructuredDataViolation[] = [];
  const contract = getPageDocumentContractByRouteKey(routeKey);
  const pageEntity = findEntityById(graph, contract.structuredDataPageId);
  const websiteEntity = findEntityById(graph, `${SITE_URL}/#website`);
  const personEntity = findEntityById(graph, `${SITE_URL}/#person`);

  if (graph["@context"] !== "https://schema.org") {
    violations.push({
      routeKey,
      message: "Structured data must publish the Schema.org context.",
    });
  }

  if (!pageEntity || pageEntity["@type"] !== "ProfilePage") {
    violations.push({
      routeKey,
      message: `Missing canonical ProfilePage entity ${contract.structuredDataPageId}.`,
    });
  } else {
    if (pageEntity.url !== contract.structuredDataPageUrl) {
      violations.push({
        routeKey,
        message: `ProfilePage URL must be ${contract.structuredDataPageUrl}.`,
      });
    }

    if (pageEntity.name !== contract.structuredDataPageName) {
      violations.push({
        routeKey,
        message: `ProfilePage name must be ${contract.structuredDataPageName}.`,
      });
    }

    if (pageEntity.isPartOf["@id"] !== `${SITE_URL}/#website`) {
      violations.push({
        routeKey,
        message: "ProfilePage must point back to the WebSite entity via isPartOf.",
      });
    }

    if (pageEntity.about["@id"] !== `${SITE_URL}/#person`) {
      violations.push({
        routeKey,
        message: "ProfilePage must describe the Person entity via about.",
      });
    }

    if (pageEntity.mainEntity["@id"] !== `${SITE_URL}/#person`) {
      violations.push({
        routeKey,
        message: "ProfilePage must expose the Person entity as mainEntity.",
      });
    }
  }

  if (!websiteEntity || websiteEntity["@type"] !== "WebSite") {
    violations.push({
      routeKey,
      message: "Structured data must include the WebSite entity.",
    });
  } else if (websiteEntity.url !== `${SITE_URL}/`) {
    violations.push({
      routeKey,
      message: `WebSite URL must be ${SITE_URL}/.`,
    });
  }

  if (!personEntity || personEntity["@type"] !== "Person") {
    violations.push({
      routeKey,
      message: "Structured data must include the Person entity.",
    });
  } else {
    if (personEntity.url !== `${SITE_URL}/`) {
      violations.push({
        routeKey,
        message: `Person URL must be ${SITE_URL}/.`,
      });
    }

    if (personEntity.description.trim().length === 0) {
      violations.push({
        routeKey,
        message: "Person description must not be empty.",
      });
    }

    if (personEntity.sameAs.length === 0) {
      violations.push({
        routeKey,
        message: "Person sameAs must include at least one external profile.",
      });
    }
  }

  return violations;
}

function findEntityById(graph: EntityGraph, entityId: string): Entity | undefined {
  return graph["@graph"].find((entity) => entity["@id"] === entityId);
}
