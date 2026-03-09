import { test, expect } from "@playwright/test";
import entitiesJson from "../../content/entities.json" with { type: "json" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getExpectedManifestIdentity(): {
  name: string;
  short_name: string;
  description: string;
} {
  const graph = entitiesJson["@graph"];
  if (!Array.isArray(graph)) {
    throw new Error("Expected entities graph to contain an @graph array");
  }

  const person = graph.find((entity) => isRecord(entity) && entity["@type"] === "Person");
  if (!person || typeof person.name !== "string" || typeof person.description !== "string") {
    throw new Error("Expected Person entity with name and description in entities graph");
  }

  return {
    name: person.name,
    short_name: person.name,
    description: person.description,
  };
}

test.describe("Manifest route", () => {
  test("GET /manifest.webmanifest returns Track A-owned identity fields aligned with the person entity", async ({
    request,
  }) => {
    const expected = getExpectedManifestIdentity();
    const response = await request.get("/manifest.webmanifest");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/manifest+json");

    const data = await response.json();
    expect(isRecord(data)).toBe(true);
    if (!isRecord(data)) {
      throw new Error("Expected manifest response to be a JSON object");
    }

    expect(data.name).toBe(expected.name);
    expect(data.short_name).toBe(expected.short_name);
    expect(data.description).toBe(expected.description);
  });
});
