import cvContent from "../content/cv.content.json";
import frontpageContent from "../content/frontpage.content.json";
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
  identityMode: "canonical-page" | "canonical-alias";
  variantKey?: string;
  tiltContext?: string;
}

const canonicalHomeContract: PageDocumentContract = {
  routeKey: "home",
  routePath: "/",
  routeUrl: withTrailingSlash(`${SITE_URL}/`),
  canonicalPath: "/",
  canonicalUrl: withTrailingSlash(`${SITE_URL}/`),
  routeTitle: frontpageContent.meta.title,
  pageEntityCanonicalId: `${CANONICAL_SITE_URL}/#webpage`,
  structuredDataPageId: `${SITE_URL}/#webpage`,
  structuredDataPageUrl: withTrailingSlash(`${SITE_URL}/`),
  structuredDataPageName: frontpageContent.meta.title,
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
  routeTitle: `${cvContent.meta.name} — CV`,
  pageEntityCanonicalId: `${CANONICAL_SITE_URL}/cv/#webpage`,
  structuredDataPageId: `${SITE_URL}/cv/#webpage`,
  structuredDataPageUrl: withTrailingSlash(`${SITE_URL}/cv`),
  structuredDataPageName: `${cvContent.meta.name} — CV`,
  richResultTarget: true,
  expectedSectionIds: cvSectionIds,
  identityMode: "canonical-page",
};

const tiltPageDocumentContracts = getActiveTiltKeys().flatMap((variantKey) => {
  const tiltContext = getTiltContext(variantKey);
  if (!tiltContext) {
    return [];
  }

  return [
    {
      routeKey: toCvVariantRouteKey(variantKey),
      routePath: `/cv/${variantKey}`,
      routeUrl: withTrailingSlash(`${SITE_URL}/cv/${variantKey}`),
      canonicalPath: canonicalCvContract.canonicalPath,
      canonicalUrl: canonicalCvContract.canonicalUrl,
      routeTitle: `${cvContent.meta.name} — CV (${tiltContext})`,
      pageEntityCanonicalId: canonicalCvContract.pageEntityCanonicalId,
      structuredDataPageId: canonicalCvContract.structuredDataPageId,
      structuredDataPageUrl: canonicalCvContract.structuredDataPageUrl,
      structuredDataPageName: canonicalCvContract.structuredDataPageName,
      richResultTarget: false,
      expectedSectionIds: cvSectionIds,
      identityMode: "canonical-alias",
      variantKey,
      tiltContext,
    } satisfies PageDocumentContract,
  ];
});

/** All known page/document contracts for rendered routes. */
const pageDocumentContracts: readonly PageDocumentContract[] = [
  canonicalHomeContract,
  canonicalCvContract,
  ...tiltPageDocumentContracts,
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
 * Variant-key lookup for tilt route contracts.
 *
 * @param variantKey Tilt route key from `cv.content.json`.
 */
export function getPageDocumentContractByVariantKey(
  variantKey: string
): PageDocumentContract | null {
  const routeKey = toCvVariantRouteKey(variantKey);
  return pageDocumentContracts.find((contract) => contract.routeKey === routeKey) ?? null;
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

  for (const variantKey of getActiveTiltKeys()) {
    const routeKey = toCvVariantRouteKey(variantKey);
    const variantContract = pageDocumentContracts.find(
      (contract) => contract.routeKey === routeKey
    );
    if (!variantContract) {
      violations.push(`Missing page contract for active tilt route: ${variantKey}`);
      continue;
    }

    if (variantContract.canonicalUrl !== canonicalCvContract.canonicalUrl) {
      violations.push(
        `Tilt route ${routeKey} must canonicalise to ${canonicalCvContract.canonicalUrl}`
      );
    }

    if (variantContract.structuredDataPageId !== canonicalCvContract.structuredDataPageId) {
      violations.push(
        `Tilt route ${routeKey} must reuse canonical CV page entity ${canonicalCvContract.structuredDataPageId}`
      );
    }

    if (variantContract.structuredDataPageUrl !== canonicalCvContract.structuredDataPageUrl) {
      violations.push(
        `Tilt route ${routeKey} must reuse canonical CV structured-data URL ${canonicalCvContract.structuredDataPageUrl}`
      );
    }

    if (variantContract.structuredDataPageName !== canonicalCvContract.structuredDataPageName) {
      violations.push(
        `Tilt route ${routeKey} must reuse canonical CV structured-data name ${canonicalCvContract.structuredDataPageName}`
      );
    }

    if (variantContract.richResultTarget) {
      violations.push(`Tilt route ${routeKey} must not be marked as a rich-result target`);
    }

    if (!sameStringArray(variantContract.expectedSectionIds, cvSectionIds)) {
      violations.push(`Tilt route ${routeKey} must expose the canonical CV section ids`);
    }
  }

  return violations;
}

function getActiveTiltKeys(): readonly string[] {
  return cvContent.tilts._meta.web_routes ?? [];
}

function getTiltContext(variantKey: string): string | null {
  if (variantKey === "public_sector") {
    return cvContent.tilts.public_sector.context;
  }

  if (variantKey === "private_ai") {
    return cvContent.tilts.private_ai.context;
  }

  if (variantKey === "founder") {
    return cvContent.tilts.founder.context;
  }

  return null;
}

/**
 * Convert a tilt route key to the shared page-document route key.
 *
 * @param variantKey Tilt route key from `cv.content.json`.
 */
function toCvVariantRouteKey(variantKey: string): string {
  return `cv-${variantKey.replaceAll("_", "-")}`;
}

function withTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

function sameStringArray(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}
