import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./site-config", () => ({
  SITE_URL: "https://www.jimcresswell.net",
}));

describe("jsonLd export", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("exports a valid JSON-LD graph with @context and @graph", async () => {
    const { jsonLd } = await import("./jsonld");
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(Array.isArray(jsonLd["@graph"])).toBe(true);
    expect(jsonLd["@graph"].length).toBeGreaterThan(0);
  });

  it("contains all entity types from the entity model", async () => {
    const { jsonLd } = await import("./jsonld");
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

  it("contains at least as many entities as the pre-migration snapshot", async () => {
    const { jsonLd } = await import("./jsonld");
    expect(jsonLd["@graph"].length).toBeGreaterThanOrEqual(14);
  });

  it("rewrites canonical URLs to SITE_URL", async () => {
    const { jsonLd } = await import("./jsonld");
    const person = jsonLd["@graph"].find((e) => e["@type"] === "Person");
    expect(person).toBeDefined();
    if (person) {
      expect(person["@id"]).toBe("https://www.jimcresswell.net/#person");
    }
  });

  it("does not rewrite external URLs", async () => {
    const { jsonLd } = await import("./jsonld");
    const article = jsonLd["@graph"].find(
      (e) => e["@type"] === "ScholarlyArticle" && e["@id"].includes("doi.org")
    );
    expect(article).toBeDefined();
    if (article) {
      expect(article["@id"]).toContain("doi.org");
    }
  });

  it("preserves Wikidata sameAs links on knowsAbout items", async () => {
    const { jsonLd } = await import("./jsonld");
    const person = jsonLd["@graph"].find((e) => e["@type"] === "Person");
    if (!person || person["@type"] !== "Person") throw new Error("Person not found");
    const systemsThinking = person.knowsAbout.find((item) => item.name === "Systems thinking");
    expect(systemsThinking?.sameAs).toMatch(/wikidata\.org/);
  });
});

describe("jsonLd URL rewriting with preview deployment", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("uses preview URL when SITE_URL points to a preview deployment", async () => {
    vi.doMock("./site-config", () => ({
      SITE_URL: "https://preview-abc123.vercel.app",
    }));
    const { jsonLd } = await import("./jsonld");
    const person = jsonLd["@graph"].find((e) => e["@type"] === "Person");
    expect(person?.["@id"]).toBe("https://preview-abc123.vercel.app/#person");
  });
});
