import { describe, expect, it } from "vitest";
import {
  getExpectedSectionIdsForRouteKey,
  getPageDocumentContractByRouteKey,
} from "./lib/page-document-contract";
import { visualRegressionConfiguration } from "./visual-regression.config";
import { parseVisualRegressionConfiguration } from "./visual-regression-harness/configuration";

describe("visualRegressionConfiguration", () => {
  it("is complete and derives repository capture policy from product contracts", () => {
    const configuration = parseVisualRegressionConfiguration(visualRegressionConfiguration);

    expect(configuration.routes).toEqual([
      {
        key: "home",
        path: getPageDocumentContractByRouteKey("home").routePath,
        regions: [
          { key: "site-header", selector: "body header.print-hidden" },
          { key: "hero", selector: 'main section:has(> h1:has-text("Jim Cresswell"))' },
          { key: "site-footer", selector: "body footer" },
        ],
        expectedSectionIds: getExpectedSectionIdsForRouteKey("home"),
        allowances: { targetOnlyExpectedSectionIds: false },
      },
      {
        key: "cv",
        path: getPageDocumentContractByRouteKey("cv").routePath,
        regions: expectedCvRegions,
        expectedSectionIds: getExpectedSectionIdsForRouteKey("cv"),
        allowances: { targetOnlyExpectedSectionIds: true },
      },
      {
        key: "cv-public-sector",
        path: getPageDocumentContractByRouteKey("cv-public-sector").routePath,
        regions: expectedCvRegions,
        expectedSectionIds: getExpectedSectionIdsForRouteKey("cv-public-sector"),
        allowances: { targetOnlyExpectedSectionIds: true },
      },
    ]);
  });
});

const expectedCvRegions = [
  { key: "site-header", selector: "body header.print-hidden" },
  { key: "cv-header", selector: "main > div > header" },
  { key: "positioning", selector: 'main section:has(> h2:has-text("Positioning"))' },
  { key: "capabilities", selector: 'main section:has(> h2:has-text("Capabilities"))' },
  { key: "experience", selector: 'main section:has(> h2:has-text("Experience"))' },
  { key: "before-oak", selector: 'main section:has(> h2:has-text("Before Oak"))' },
  { key: "education", selector: 'main section:has(> h2:has-text("Education"))' },
  { key: "site-footer", selector: "body footer" },
];
