import { describe, it, expect } from "vitest";
import type { Entity } from "./entities";
import { extractSubgraph, findDanglingRefs } from "./subgraph";

const PERSON: Entity = {
  "@type": "Person",
  "@id": "https://example.com/#person",
  name: "Test",
  honorificPrefix: "Dr",
  url: "https://example.com/",
  description: "Test.",
  sameAs: [],
  email: "test@test.com",
  knowsAbout: [],
  hasOccupation: [],
  worksFor: [{ "@id": "https://example.com/cv/#role-a" }],
  hasCredential: [{ "@id": "https://example.com/#cred-phd" }],
  alumniOf: [{ "@id": "https://example.com/#org-uni" }],
  subjectOf: [],
  memberOf: [],
};

const ROLE: Entity = {
  "@type": "EmployeeRole",
  "@id": "https://example.com/cv/#role-a",
  roleName: "Engineer",
  worksFor: { "@id": "https://example.com/#org-acme" },
  startDate: "2020-01",
  description: "Test.",
};

const ORG_ACME: Entity = {
  "@type": "Organization",
  "@id": "https://example.com/#org-acme",
  name: "Acme Corp",
};

const ORG_UNI: Entity = {
  "@type": "CollegeOrUniversity",
  "@id": "https://example.com/#org-uni",
  name: "University",
};

const CREDENTIAL: Entity = {
  "@type": "EducationalOccupationalCredential",
  "@id": "https://example.com/#cred-phd",
  credentialCategory: "PhD",
  name: "PhD, Physics",
  recognizedBy: { "@id": "https://example.com/#org-uni" },
};

const WEBSITE: Entity = {
  "@type": "WebSite",
  "@id": "https://example.com/#website",
  url: "https://example.com/",
  name: "Test",
};

const ALL_ENTITIES: Entity[] = [PERSON, ROLE, ORG_ACME, ORG_UNI, CREDENTIAL, WEBSITE];

describe("extractSubgraph", () => {
  it("returns seed entities and all entities reachable by @id references", () => {
    const subgraph = extractSubgraph(ALL_ENTITIES, [PERSON["@id"]]);

    const ids = subgraph.map((e) => e["@id"]);
    expect(ids).toContain(PERSON["@id"]);
    expect(ids).toContain(ROLE["@id"]);
    expect(ids).toContain(ORG_ACME["@id"]);
    expect(ids).toContain(ORG_UNI["@id"]);
    expect(ids).toContain(CREDENTIAL["@id"]);
  });

  it("does not include unreachable entities", () => {
    const subgraph = extractSubgraph(ALL_ENTITIES, [PERSON["@id"]]);

    const ids = subgraph.map((e) => e["@id"]);
    expect(ids).not.toContain(WEBSITE["@id"]);
  });

  it("returns only seed entities when they have no outbound references", () => {
    const subgraph = extractSubgraph(ALL_ENTITIES, [WEBSITE["@id"]]);
    expect(subgraph).toHaveLength(1);
    expect(subgraph[0]["@id"]).toBe(WEBSITE["@id"]);
  });

  it("follows transitive references (Person → Role → Org)", () => {
    const subgraph = extractSubgraph(ALL_ENTITIES, [PERSON["@id"]]);
    const ids = subgraph.map((e) => e["@id"]);
    expect(ids).toContain(ORG_ACME["@id"]);
  });

  it("handles multiple seeds", () => {
    const subgraph = extractSubgraph(ALL_ENTITIES, [PERSON["@id"], WEBSITE["@id"]]);
    const ids = subgraph.map((e) => e["@id"]);
    expect(ids).toContain(PERSON["@id"]);
    expect(ids).toContain(WEBSITE["@id"]);
    expect(ids).toContain(ROLE["@id"]);
  });

  it("handles circular references without infinite loops", () => {
    const circA: Entity = {
      "@type": "Organization",
      "@id": "https://example.com/#a",
      name: "A",
      sameAs: ["https://example.com/#b"],
    };
    const circB: Entity = {
      "@type": "Organization",
      "@id": "https://example.com/#b",
      name: "B",
    };
    const subgraph = extractSubgraph([circA, circB], ["https://example.com/#a"]);
    expect(subgraph).toHaveLength(1);
  });

  it("returns an empty array for unknown seed IDs", () => {
    const subgraph = extractSubgraph(ALL_ENTITIES, ["https://example.com/#unknown"]);
    expect(subgraph).toEqual([]);
  });

  it("does not follow sameAs strings as entity references", () => {
    const personWithSameAs: Entity = {
      ...PERSON,
      sameAs: ["https://github.com/test"],
    };
    const subgraph = extractSubgraph(
      [personWithSameAs, ROLE, ORG_ACME, ORG_UNI, CREDENTIAL],
      [PERSON["@id"]]
    );
    const ids = subgraph.map((e) => e["@id"]);
    expect(ids).not.toContain("https://github.com/test");
  });
});

describe("findDanglingRefs", () => {
  it("returns empty array when all references resolve", () => {
    expect(findDanglingRefs(ALL_ENTITIES)).toEqual([]);
  });

  it("detects references to entities not in the graph", () => {
    const entitiesWithDangling: Entity[] = [
      {
        "@type": "EmployeeRole",
        "@id": "https://example.com/#role",
        roleName: "Test",
        worksFor: { "@id": "https://example.com/#missing-org" },
        startDate: "2020-01",
        description: "Test.",
      },
    ];
    const dangling = findDanglingRefs(entitiesWithDangling);
    expect(dangling).toContain("https://example.com/#missing-org");
  });
});
