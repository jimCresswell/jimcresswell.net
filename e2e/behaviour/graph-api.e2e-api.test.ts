import { test, expect } from "@playwright/test";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getGraphPayload(data: unknown): {
  "@context"?: unknown;
  "@graph": unknown[];
} {
  if (!isRecord(data)) {
    throw new Error("Expected graph payload to be an object");
  }
  if (!Array.isArray(data["@graph"])) {
    throw new Error("Expected graph payload to contain an @graph array");
  }
  return {
    "@context": data["@context"],
    "@graph": data["@graph"],
  };
}

test.describe("Knowledge graph API", () => {
  test("GET /api/graph returns a valid JSON-LD graph", async ({ request }) => {
    const response = await request.get("/api/graph");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const data = getGraphPayload(await response.json());
    expect(data["@context"]).toBe("https://schema.org");
    expect(Array.isArray(data["@graph"])).toBe(true);
  });

  test("graph contains a Person node with expected properties", async ({ request }) => {
    const response = await request.get("/api/graph");
    const data = getGraphPayload(await response.json());

    const person = data["@graph"].find((node) => isRecord(node) && node["@type"] === "Person");
    expect(person).toBeDefined();
    if (!person || !isRecord(person)) {
      throw new Error("Expected Person node in graph");
    }
    expect(person["name"]).toBe("Jim Cresswell");
    expect(person["knowsAbout"]).toBeDefined();
    expect(Array.isArray(person["knowsAbout"])).toBe(true);
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

    const data = getGraphPayload(await response.json());
    expect(data["@context"]).toBe("https://schema.org");
    expect(
      data["@graph"].find((node) => isRecord(node) && node["@type"] === "Person")
    ).toBeDefined();
  });
});
