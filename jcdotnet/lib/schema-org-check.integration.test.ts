import { describe, expect, it } from "vitest";
import { entityGraph } from "./entities";
import {
  schemaOrgCoreEntityCounts,
  schemaOrgCvPageGraph,
  schemaOrgEntityGraph,
  schemaOrgFrontPageGraph,
  schemaOrgKeyViolations,
} from "./schema-org-check";

describe("schema-dts compatibility", () => {
  it("exports graphs that remain usable at runtime after compile-time validation", () => {
    expect(schemaOrgEntityGraph["@context"]).toBe("https://schema.org");
    expect(schemaOrgEntityGraph["@graph"]).toHaveLength(entityGraph["@graph"].length);
    expect(schemaOrgFrontPageGraph["@graph"].length).toBeGreaterThan(0);
    expect(schemaOrgCvPageGraph["@graph"].length).toBeGreaterThanOrEqual(
      schemaOrgFrontPageGraph["@graph"].length
    );
    expect(schemaOrgCoreEntityCounts.people).toBe(1);
    expect(schemaOrgCoreEntityCounts.organizations).toBeGreaterThan(0);
    expect(schemaOrgCoreEntityCounts.employeeRoles).toBeGreaterThan(0);
    expect(schemaOrgCoreEntityCounts.articles).toBeGreaterThan(0);
    expect(schemaOrgCoreEntityCounts.definedTerms).toBeGreaterThan(0);
    expect(schemaOrgCoreEntityCounts.statements).toBeGreaterThan(0);
    expect(schemaOrgCoreEntityCounts.theses).toBeGreaterThan(0);
    expect(schemaOrgCoreEntityCounts.webApis).toBeGreaterThan(0);
  });

  it("reports no raw-source vocabulary violations for validated PKG entity types", () => {
    expect(schemaOrgKeyViolations).toEqual([]);
  });
});
