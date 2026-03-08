import { describe, it, expect } from "vitest";
import { EntityGraphSchema, entities, entityGraph } from "./entities";
import entitiesJson from "@/content/entities.json";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

describe("Entity model integration", () => {
  it("parses the full entities.json through the graph schema", () => {
    const result = EntityGraphSchema.safeParse(entitiesJson);
    expect(result.success).toBe(true);
  });

  it("exports the parsed entity graph", () => {
    expect(entityGraph["@context"]).toBe("https://schema.org");
    expect(entities.length).toBeGreaterThan(0);
  });

  it("contains all expected entity types", () => {
    const types = new Set(entities.map((e) => e["@type"]));
    expect(types).toContain("WebSite");
    expect(types).toContain("ProfilePage");
    expect(types).toContain("Person");
    expect(types).toContain("Occupation");
    expect(types).toContain("Organization");
    expect(types).toContain("CollegeOrUniversity");
    expect(types).toContain("EmployeeRole");
    expect(types).toContain("OrganizationRole");
    expect(types).toContain("EducationalOccupationalCredential");
    expect(types).toContain("Thesis");
    expect(types).toContain("ScholarlyArticle");
    expect(types).toContain("CreativeWork");
    expect(types).toContain("SoftwareSourceCode");
    expect(types).toContain("WebAPI");
    expect(types).toContain("Intangible");
    expect(types).toContain("Statement");
    expect(types).toContain("DefinedTerm");
  });

  it("has exactly one Person entity", () => {
    const people = entities.filter((e) => e["@type"] === "Person");
    expect(people).toHaveLength(1);
    expect(people[0]["@id"]).toBe("https://www.jimcresswell.net/#person");
  });

  it("includes Knowledge graphs in Person.knowsAbout with a Wikidata link", () => {
    const people = entities.filter((e) => e["@type"] === "Person");
    expect(people).toHaveLength(1);

    const person = people[0];
    const knowledgeGraphs = person.knowsAbout.find((item) => item.name === "Knowledge graphs");

    expect(knowledgeGraphs).toBeDefined();
    expect(knowledgeGraphs?.sameAs).toBe("https://www.wikidata.org/wiki/Q33002955");
  });

  it("has no dangling @id references", () => {
    const ids = new Set(entities.map((e) => e["@id"]));

    function collectRefs(obj: unknown): string[] {
      if (Array.isArray(obj)) return obj.flatMap(collectRefs);
      if (!isRecord(obj)) return [];
      const record = obj;
      if ("@id" in record && !("@type" in record)) {
        const id = record["@id"];
        return typeof id === "string" ? [id] : [];
      }
      return Object.values(record).flatMap(collectRefs);
    }

    const allRefs = entities.flatMap(collectRefs);
    const dangling = allRefs.filter((ref) => !ids.has(ref));
    expect(dangling).toEqual([]);
  });

  it("every EmployeeRole is reachable from Person.worksFor", () => {
    const person = entities.find((e) => e["@type"] === "Person");
    if (!person || person["@type"] !== "Person") throw new Error("Person not found");

    const roleIds = entities.filter((e) => e["@type"] === "EmployeeRole").map((e) => e["@id"]);

    const personRoleIds = person.worksFor.map((ref) => ref["@id"]);
    for (const roleId of roleIds) {
      expect(personRoleIds).toContain(roleId);
    }
  });

  it("every Thesis uses inSupportOf as text, not an @id ref", () => {
    const theses = entities.filter((e) => e["@type"] === "Thesis");
    for (const thesis of theses) {
      if (thesis["@type"] !== "Thesis") continue;
      expect(typeof thesis.inSupportOf).toBe("string");
    }
  });
});
