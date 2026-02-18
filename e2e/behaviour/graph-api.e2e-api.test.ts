import { test, expect } from "@playwright/test";

test.describe("Knowledge graph API", () => {
  test("GET /api/graph returns a valid JSON-LD graph", async ({ request }) => {
    const response = await request.get("/api/graph");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const data = (await response.json()) as Record<string, unknown>;
    expect(data["@context"]).toBe("https://schema.org");
    expect(Array.isArray(data["@graph"])).toBe(true);
  });

  test("graph contains a Person node with expected properties", async ({ request }) => {
    const response = await request.get("/api/graph");
    const data = (await response.json()) as {
      "@graph": Array<Record<string, unknown>>;
    };

    const person = data["@graph"].find((node) => node["@type"] === "Person");
    expect(person).toBeDefined();
    expect(person!["name"]).toBe("Jim Cresswell");
    expect(person!["knowsAbout"]).toBeDefined();
    expect(Array.isArray(person!["knowsAbout"])).toBe(true);
  });

  test("graph is not cached while iterating", async ({ request }) => {
    const response = await request.get("/api/graph");
    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toContain("no-store");
  });

  test("graph is accessible via Accept: application/ld+json on any page", async ({ request }) => {
    const response = await request.get("/cv", {
      headers: { Accept: "application/ld+json" },
    });
    expect(response.status()).toBe(200);

    const data = (await response.json()) as {
      "@context": string;
      "@graph": Array<Record<string, unknown>>;
    };
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"].find((n) => n["@type"] === "Person")).toBeDefined();
  });
});
