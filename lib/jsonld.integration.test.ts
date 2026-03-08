import { describe, it, expect } from "vitest";
import { buildJsonLd } from "./jsonld";

function getPersonId(siteUrl: string): string {
  const person = buildJsonLd(siteUrl)["@graph"].find((entity) => entity["@type"] === "Person");
  if (!person || person["@type"] !== "Person") {
    throw new Error("Person not found");
  }
  return person["@id"];
}

describe("jsonLd export", () => {
  it("exports a valid JSON-LD graph with @context and @graph", () => {
    const jsonLd = buildJsonLd("https://www.jimcresswell.net");
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(Array.isArray(jsonLd["@graph"])).toBe(true);
    expect(jsonLd["@graph"].length).toBeGreaterThan(0);
  });

  it("contains all entity types from the entity model", () => {
    const jsonLd = buildJsonLd("https://www.jimcresswell.net");
    const types = new Set(jsonLd["@graph"].map((e) => e["@type"]));
    expect(types).toContain("Person");
    expect(types).toContain("WebSite");
    expect(types).toContain("ProfilePage");
    expect(types).toContain("Organization");
    expect(types).toContain("EmployeeRole");
    expect(types).toContain("EducationalOccupationalCredential");
    expect(types).toContain("Thesis");
    expect(types).toContain("ScholarlyArticle");
  });

  it("contains at least as many entities as the pre-migration snapshot", () => {
    const jsonLd = buildJsonLd("https://www.jimcresswell.net");
    expect(jsonLd["@graph"].length).toBeGreaterThanOrEqual(14);
  });

  it("rewrites canonical URLs to SITE_URL", () => {
    expect(getPersonId("https://www.jimcresswell.net")).toBe(
      "https://www.jimcresswell.net/#person"
    );
  });

  it("does not rewrite external URLs", () => {
    const jsonLd = buildJsonLd("https://www.jimcresswell.net");
    const article = jsonLd["@graph"].find(
      (e) => e["@type"] === "ScholarlyArticle" && e["@id"].includes("doi.org")
    );
    expect(article).toBeDefined();
    if (article) {
      expect(article["@id"]).toContain("doi.org");
    }
  });

  it("preserves Wikidata sameAs links on knowsAbout items", () => {
    const jsonLd = buildJsonLd("https://www.jimcresswell.net");
    const person = jsonLd["@graph"].find((e) => e["@type"] === "Person");
    if (!person || person["@type"] !== "Person") throw new Error("Person not found");
    const systemsThinking = person.knowsAbout.find((item) => item.name === "Systems thinking");
    expect(systemsThinking?.sameAs).toMatch(/wikidata\.org/);
  });

  it("publishes Knowledge graphs in the exported JSON-LD graph", () => {
    const jsonLd = buildJsonLd("https://www.jimcresswell.net");
    const person = jsonLd["@graph"].find((e) => e["@type"] === "Person");
    if (!person || person["@type"] !== "Person") throw new Error("Person not found");

    const knowledgeGraphs = person.knowsAbout.find((item) => item.name === "Knowledge graphs");

    expect(knowledgeGraphs).toBeDefined();
    expect(knowledgeGraphs?.sameAs).toBe("https://www.wikidata.org/wiki/Q33002955");
  });

  it("uses preview URL when building a preview deployment graph", () => {
    expect(getPersonId("https://preview-abc123.vercel.app")).toBe(
      "https://preview-abc123.vercel.app/#person"
    );
  });
});
