import { person } from "./entities";
import { SITE_URL } from "./site-config";

const CANONICAL_SITE_URL = "https://www.jimcresswell.net";

/**
 * Shared CV section contract for rendered HTML anchors and headings.
 *
 * This is product code, not a harness-only allowlist. The same identifiers
 * anchor the rendered document, structural integrity checks, and harness
 * comparison behaviour.
 */
export const cvSections = {
  positioning: {
    id: "positioning",
    heading: "Positioning",
    srOnly: true,
  },
  capabilities: {
    id: "capabilities",
    heading: "Capabilities",
    srOnly: false,
  },
  experience: {
    id: "experience",
    heading: "Experience",
    srOnly: false,
  },
  beforeOak: {
    id: "before-oak",
    heading: "Before Oak",
    srOnly: false,
  },
  education: {
    id: "education",
    heading: "Education",
    srOnly: false,
  },
} as const;

/** Stable CV section render order. */
export const cvSectionOrder = [
  "positioning",
  "capabilities",
  "experience",
  "beforeOak",
  "education",
] as const;

/** Expected CV section ids in render order. */
const cvSectionIds = cvSectionOrder.map((sectionKey) => cvSections[sectionKey].id);

interface PageDocumentContract {
  routeKey: string;
  routePath: string;
  routeUrl: string;
  canonicalPath: string;
  canonicalUrl: string;
  routeTitle: string;
  pageEntityCanonicalId: string;
  structuredDataPageId: string;
  structuredDataPageUrl: string;
  structuredDataPageName: string;
  richResultTarget: boolean;
  expectedSectionIds: readonly string[];
  identityMode: "canonical-page";
}

const canonicalHomeContract: PageDocumentContract = {
  routeKey: "home",
  routePath: "/",
  routeUrl: withTrailingSlash(`${SITE_URL}/`),
  canonicalPath: "/",
  canonicalUrl: withTrailingSlash(`${SITE_URL}/`),
  routeTitle: person.name,
  pageEntityCanonicalId: `${CANONICAL_SITE_URL}/#webpage`,
  structuredDataPageId: `${SITE_URL}/#webpage`,
  structuredDataPageUrl: withTrailingSlash(`${SITE_URL}/`),
  structuredDataPageName: person.name,
  richResultTarget: true,
  expectedSectionIds: [],
  identityMode: "canonical-page",
};

const canonicalCvContract: PageDocumentContract = {
  routeKey: "cv",
  routePath: "/cv",
  routeUrl: withTrailingSlash(`${SITE_URL}/cv`),
  canonicalPath: "/cv/",
  canonicalUrl: withTrailingSlash(`${SITE_URL}/cv`),
  routeTitle: `${person.name} — CV`,
  pageEntityCanonicalId: `${CANONICAL_SITE_URL}/cv/#webpage`,
  structuredDataPageId: `${SITE_URL}/cv/#webpage`,
  structuredDataPageUrl: withTrailingSlash(`${SITE_URL}/cv`),
  structuredDataPageName: `${person.name} — CV`,
  richResultTarget: true,
  expectedSectionIds: cvSectionIds,
  identityMode: "canonical-page",
};

/** All known page/document contracts for rendered routes. */
const pageDocumentContracts: readonly PageDocumentContract[] = [
  canonicalHomeContract,
  canonicalCvContract,
];

/**
 * Route-key lookup for page/document contracts.
 *
 * @param routeKey Harness/app route key.
 */
export function getPageDocumentContractByRouteKey(routeKey: string): PageDocumentContract {
  const contract = pageDocumentContracts.find((candidate) => candidate.routeKey === routeKey);
  if (!contract) {
    throw new Error(`Unknown page document contract: ${routeKey}`);
  }
  return contract;
}

/**
 * Expected section ids for a route.
 *
 * @param routeKey Harness/app route key.
 */
export function getExpectedSectionIdsForRouteKey(routeKey: string): readonly string[] {
  return getPageDocumentContractByRouteKey(routeKey).expectedSectionIds;
}

/**
 * Durable validation output for page/document contract consistency.
 *
 * These are product-owned structural checks used by tests and docs.
 */
export const pageDocumentIntegrityViolations = findPageDocumentIntegrityViolations();

function findPageDocumentIntegrityViolations(): string[] {
  const violations: string[] = [];
  const routeKeys = new Set<string>();
  const routePaths = new Set<string>();
  const routeUrls = new Set<string>();
  const sectionIds = new Set<string>();

  for (const contract of pageDocumentContracts) {
    if (routeKeys.has(contract.routeKey)) {
      violations.push(`Duplicate route key: ${contract.routeKey}`);
    }
    routeKeys.add(contract.routeKey);

    if (routePaths.has(contract.routePath)) {
      violations.push(`Duplicate route path: ${contract.routePath}`);
    }
    routePaths.add(contract.routePath);

    if (routeUrls.has(contract.routeUrl)) {
      violations.push(`Duplicate route URL: ${contract.routeUrl}`);
    }
    routeUrls.add(contract.routeUrl);
  }

  for (const sectionId of cvSectionIds) {
    if (sectionIds.has(sectionId)) {
      violations.push(`Duplicate CV section id: ${sectionId}`);
    }
    sectionIds.add(sectionId);
  }

  return violations;
}

function withTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}
