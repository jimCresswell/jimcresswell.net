import { describe, expect, it } from "vitest";
import { metadata as cvMetadata } from "@/app/cv/page";
import { generateMetadata } from "@/app/cv/[variant]/page";
import {
  getPageDocumentContractByRouteKey,
  pageDocumentIntegrityViolations,
} from "./page-document-contract";
import { frontPageJsonLd } from "./page-jsonld";
import { searchStructuredDataViolations } from "./search-structured-data";

describe("page document contract", () => {
  it("reports no page document integrity violations", () => {
    expect(pageDocumentIntegrityViolations).toEqual([]);
  });

  it("reports no rich-result structured-data violations", () => {
    expect(searchStructuredDataViolations).toEqual([]);
  });

  it("keeps the home-page structured-data identity aligned with the home document contract", () => {
    const contract = getPageDocumentContractByRouteKey("home");
    const pageEntity = frontPageJsonLd["@graph"].find(
      (entity) => entity["@id"] === contract.structuredDataPageId
    );

    expect(pageEntity).toBeDefined();
    if (!pageEntity || pageEntity["@type"] !== "ProfilePage") {
      throw new Error(`Expected home ProfilePage entity ${contract.structuredDataPageId}`);
    }

    expect(pageEntity.url).toBe(contract.structuredDataPageUrl);
    expect(pageEntity.name).toBe(contract.structuredDataPageName);
  });

  it("keeps the base CV metadata aligned with the canonical CV document contract", () => {
    const contract = getPageDocumentContractByRouteKey("cv");

    expect(cvMetadata.title).toBe(contract.routeTitle);
    expect(cvMetadata.openGraph?.url).toBe(contract.canonicalUrl);
  });

  it("canonicalises the public-sector tilt route to the base CV document", async () => {
    const contract = getPageDocumentContractByRouteKey("cv-public-sector");
    const canonicalCvContract = getPageDocumentContractByRouteKey("cv");
    const metadata = await generateMetadata({
      params: Promise.resolve({ variant: "public_sector" }),
    });

    expect(metadata.title).toBe(contract.routeTitle);
    expect(metadata.alternates?.canonical).toBe(canonicalCvContract.canonicalUrl);
  });
});
