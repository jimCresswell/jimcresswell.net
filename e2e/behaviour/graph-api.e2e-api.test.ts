import { test, expect } from "@playwright/test";
import { getExpectedPersonName } from "../support/expected-person";

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
    expect(person["name"]).toBe(getExpectedPersonName());
    expect(person["knowsAbout"]).toBeDefined();
    expect(Array.isArray(person["knowsAbout"])).toBe(true);
  });

  test("graph is not cached while iterating", async ({ request }) => {
    const response = await request.get("/api/graph");
    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toContain("no-store");
  });

  test("GET /api/graph returns LD+JSON when explicitly requested", async ({ request }) => {
    const response = await request.get("/api/graph", {
      headers: { Accept: "application/ld+json" },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/ld+json");

    const data = getGraphPayload(await response.json());
    expect(data["@context"]).toBe("https://schema.org");
  });

  test.describe("page-route graph negotiation", () => {
    [
      {
        path: "/",
        accept: "application/ld+json",
        expectedContentType: "application/ld+json",
      },
      {
        path: "/cv",
        accept: "application/json",
        expectedContentType: "application/json",
      },
    ].forEach(({ path, accept, expectedContentType }) => {
      test(`returns the full graph for ${path} when Accept is ${accept}`, async ({ request }) => {
        const response = await request.get(path, {
          headers: { Accept: accept },
        });
        expect(response.status()).toBe(200);
        expect(response.headers()["content-type"]).toContain(expectedContentType);
        expect(
          response
            .headers()
            ["vary"]?.toLowerCase()
            .split(/\s*,\s*/)
        ).toEqual(expect.arrayContaining(["accept", "rsc"]));

        const data = getGraphPayload(await response.json());
        expect(data["@context"]).toBe("https://schema.org");
        expect(
          data["@graph"].find((node) => isRecord(node) && node["@type"] === "Person")
        ).toBeDefined();
      });
    });

    ["application/ld+json", "application/json"].forEach((accept) => {
      test(`retired CV variants remain 404 when Accept is ${accept}`, async ({ request }) => {
        const response = await request.get("/cv/public_sector", {
          headers: { Accept: accept },
        });

        expect(response.status()).toBe(404);
      });
    });

    test("the PDF subroute retains its native representation", async ({ request }) => {
      const response = await request.get("/cv/pdf", {
        headers: { Accept: "application/ld+json" },
      });

      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/pdf");
    });
  });
});
