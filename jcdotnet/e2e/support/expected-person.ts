import entitiesJson from "../../content/entities.json" with { type: "json" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function findPerson(): Record<string, unknown> {
  const graph = entitiesJson["@graph"];
  if (!Array.isArray(graph)) {
    throw new Error("Expected entities graph to contain an @graph array");
  }

  const people = graph.filter((entity) => isRecord(entity) && entity["@type"] === "Person");
  if (people.length !== 1 || !isRecord(people[0])) {
    throw new Error(`Expected exactly one Person entity (found ${people.length})`);
  }
  return people[0];
}

/** Read the expected public name directly from the entity source. */
export function getExpectedPersonName(): string {
  const { name } = findPerson();
  if (typeof name !== "string") throw new Error("Expected Person entity to have a string name");
  return name;
}

/** Read the expected public description directly from the entity source. */
export function getExpectedPersonDescription(): string {
  const { description } = findPerson();
  if (typeof description !== "string") {
    throw new Error("Expected Person entity to have a string description");
  }
  return description;
}
