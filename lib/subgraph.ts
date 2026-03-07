/**
 * Subgraph closure — extract a self-contained subset of the entity graph.
 *
 * Given a set of seed entity IDs, follows all `@id` references outward
 * (transitively) to collect every entity reachable from the seeds. The
 * result is a closed subgraph: every `@id` reference within it resolves
 * to an entity that is also in the subgraph.
 *
 * Used to derive page-specific JSON-LD graphs from the full entity model.
 * The front page gets an identity-focused subgraph (Person, identity
 * constructs, capabilities). The CV page gets the full career graph.
 */
import type { Entity } from "./entities";

/**
 * Collect `@id` references from an entity, excluding the entity's own `@id`.
 *
 * Only follows objects with `@id` but no `@type` — these are references to
 * other entities. Objects with both `@id` and `@type` are entity definitions,
 * not references. String values (even if they look like URLs) are not
 * followed — `sameAs`, `url`, `codeRepository` etc. are external links.
 */
function collectRefs(entity: Entity): string[] {
  const refs: string[] = [];

  function walk(value: unknown): void {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    const record = value as Record<string, unknown>;
    if ("@id" in record && !("@type" in record)) {
      const id = record["@id"];
      if (typeof id === "string") {
        refs.push(id);
      }
    }
    Object.values(record).forEach(walk);
  }

  walk(Object.fromEntries(Object.entries(entity).filter(([key]) => key !== "@id")));
  return refs;
}

/**
 * Extract a closed subgraph starting from the given seed entity IDs.
 *
 * Follows `@id` references transitively until no new entities are discovered.
 * Unknown seed IDs are silently ignored (they don't exist in the graph).
 */
export function extractSubgraph(
  allEntities: readonly Entity[],
  seedIds: readonly string[]
): Entity[] {
  const entityMap = new Map(allEntities.map((e) => [e["@id"], e]));
  const included = new Set<string>();
  const queue = [...seedIds];

  while (queue.length > 0) {
    const id = queue.pop()!;
    if (included.has(id)) continue;

    const entity = entityMap.get(id);
    if (!entity) continue;

    included.add(id);
    for (const ref of collectRefs(entity)) {
      if (!included.has(ref)) {
        queue.push(ref);
      }
    }
  }

  return allEntities.filter((e) => included.has(e["@id"]));
}

/**
 * Find `@id` references that don't resolve to any entity in the graph.
 *
 * Returns an array of dangling reference IDs. An empty array means all
 * references resolve — the graph is internally consistent.
 */
export function findDanglingRefs(allEntities: readonly Entity[]): string[] {
  const ids = new Set(allEntities.map((e) => e["@id"]));
  const dangling = new Set<string>();

  for (const entity of allEntities) {
    for (const ref of collectRefs(entity)) {
      if (!ids.has(ref)) {
        dangling.add(ref);
      }
    }
  }

  return [...dangling];
}
