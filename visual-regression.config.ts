import {
  getExpectedSectionIdsForRouteKey,
  getPageDocumentContractByRouteKey,
} from "./lib/page-document-contract";
import type {
  RegressionRegion,
  RegressionRoute,
  VisualRegressionConfiguration,
} from "./visual-regression-harness/configuration";

const siteChromeRegions = [
  { key: "site-header", selector: "body header.print-hidden" },
  { key: "site-footer", selector: "body footer" },
] satisfies readonly RegressionRegion[];

const cvRegions = [
  { key: "site-header", selector: "body header.print-hidden" },
  { key: "cv-header", selector: "main > div > header" },
  { key: "positioning", selector: 'main section:has(> h2:has-text("Positioning"))' },
  { key: "capabilities", selector: 'main section:has(> h2:has-text("Capabilities"))' },
  { key: "experience", selector: 'main section:has(> h2:has-text("Experience"))' },
  { key: "before-oak", selector: 'main section:has(> h2:has-text("Before Oak"))' },
  { key: "education", selector: 'main section:has(> h2:has-text("Education"))' },
  { key: "site-footer", selector: "body footer" },
] satisfies readonly RegressionRegion[];

/** Repository-owned routes, regions, and bounded comparison allowances. */
export const visualRegressionConfiguration = {
  routes: [
    createRoute(
      "home",
      [
        siteChromeRegions[0],
        { key: "hero", selector: 'main section:has(> h1:has-text("Jim Cresswell"))' },
        siteChromeRegions[1],
      ],
      false
    ),
    createRoute("cv", cvRegions, true),
  ],
} satisfies VisualRegressionConfiguration;

/**
 * Project one repository page contract into generic harness policy.
 *
 * @param routeKey Repository page-contract key.
 * @param regions Named regions captured for this route.
 * @param targetOnlyExpectedSectionIds Whether expected target-only anchors may be normalised.
 * @returns A complete route configuration for the harness.
 */
function createRoute(
  routeKey: string,
  regions: readonly RegressionRegion[],
  targetOnlyExpectedSectionIds: boolean
): RegressionRoute {
  const pageContract = getPageDocumentContractByRouteKey(routeKey);

  return {
    key: pageContract.routeKey,
    path: pageContract.routePath,
    regions: [...regions],
    expectedSectionIds: [...getExpectedSectionIdsForRouteKey(routeKey)],
    allowances: { targetOnlyExpectedSectionIds },
  };
}
