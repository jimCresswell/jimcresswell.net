# Future: Neo4j Knowledge Graph

Migrate the personal knowledge graph from JSON files to a Neo4j graph database.

## Status: Future

This is a long-term consideration, not current work. It exists to shape decisions during the [personal knowledge graph](../personal-knowledge-graph.plan.md) work — ensuring the current JSON-based model remains compatible with a future graph database migration.

---

## Context

The personal knowledge graph represents Jim's career, work, identity, and relationships as real entities and typed relationships at multiple levels of abstraction — from specific entities (Roles, Organisations) through abstract entities (ProfessionalIdentity, ResearchBackground) to expressive entities (PositioningNarrative, Capability, TiltVariant). All are real. All use standard Schema.org types ([ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md)). The current implementation uses JSON files in `content/` with TypeScript transforms to derive views (page rendering, JSON-LD, OG, manifest, sitemap, PDF).

JSON-LD is itself a graph serialisation format (it serialises RDF). The entity model being designed in the current plan is structurally a knowledge graph — entities with stable identities connected by typed relationships. Neo4j is a natural home for this data if the model ever outgrows static files. The labelled property graph model is particularly well suited to the multi-level abstraction architecture, where specific, abstract, expressive, and presentational entities all coexist as nodes with typed relationships.

---

## Why Neo4j

- **Labelled property graph** — entities are nodes with properties and labels, relationships are typed edges. This maps directly to the entity model (Person, WebSite, Organisation, Role, Credential, Thesis, Publication, Project, ProfessionalIdentity, Capability, PositioningNarrative) and relationships (worksFor, alumniOf, author, inSupportOf, publisher, about).
- **Cypher query language** — views become queries. "Give me the CV page graph" is a Cypher query that traverses from Person through Roles, Credentials, and Publications. "Give me the front page graph" is a different traversal of the same data.
- **Schema flexibility** — new entity types and relationship types can be added without migrations.
- **Visualisation** — Neo4j's browser provides interactive graph exploration, useful for reviewing the entity model across all abstraction levels.

---

## What this shapes in current work

These considerations should influence decisions during the personal knowledge graph plan:

- **Stable entity IDs** — use IDs that would survive a migration (e.g. `person-jim`, `org-oak`, `role-oak-principal`). Avoid IDs derived from array position or content hashing.
- **Typed relationships** — name relationships explicitly (worksFor, alumniOf, author) rather than using generic containment. These become edge labels in Neo4j.
- **Entities over nesting** — prefer flat entity definitions with relationship references over deeply nested JSON. A Role should reference an Organisation by ID, not nest inside it.
- **All entities are real, all migrate.** A ProfessionalIdentity is as real as a Role — it's more abstract, not less real. In Neo4j, a PositioningNarrative is a node linked to a ProfessionalIdentity. A Capability is a node linked to evidence. Entities at all abstraction levels become labelled nodes in the same graph. See "Abstraction levels" below.
- **Graph-shaped thinking** — when designing the JSON structure, ask: "Would this be a node, an edge, or a property in a graph database?" If the answer is "edge", it should be a reference, not nesting.

### Abstraction levels in the graph

The graph naturally contains entities at different levels of abstraction. This is a central organising principle — what appears "cross-cutting" in a hierarchical content model is just an entity at a higher abstraction level that hasn't been named yet.

| Level          | Examples                                            | Schema.org `@type`                             | In Neo4j                     |
| -------------- | --------------------------------------------------- | ---------------------------------------------- | ---------------------------- |
| Specific       | Role, Organisation, Credential, Thesis, Publication | `EmployeeRole`, `Organization`, `Thesis`, etc. | Nodes with date properties   |
| Abstract       | ProfessionalIdentity, ResearchBackground            | `Intangible` + `additionalType`                | Nodes linking to expressions |
| Expressive     | PositioningNarrative, Capability, TiltVariant       | `Statement`, `DefinedTerm` + `additionalType`  | Nodes with text properties   |
| Presentational | WebSite, CVPage, FrontPage, OGCard                  | `WebSite`, `ProfilePage`                       | Nodes defining traversals    |

All entities are real and all have standard Schema.org types ([ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md)). All migrate to Neo4j as labelled nodes. All can appear in JSON-LD. The difference between levels is abstraction, not validity.

In Neo4j, a Cypher query for the CV page traverses from `(:CVPage)-[:PRESENTS]->(:ProfessionalIdentity)-[:CLAIMS]->(:Capability)-[:GROUNDED_BY]->(:Role)`. The front page traverses a different path through the same graph. Different views, same reality, same database.

---

## Migration sketch (not for current implementation)

1. Export the JSON entity model to Neo4j-compatible format (CSV or Cypher `CREATE` statements).
2. Set up a Neo4j instance (Neo4j Aura free tier or self-hosted).
3. Build a lightweight API or build-time query layer that fetches subgraphs for each view.
4. Replace the JSON file imports with graph queries during `next build`.
5. Retain JSON-LD as the published serialisation — Neo4j becomes the source, JSON-LD remains the output.

---

## Related

- [personal-knowledge-graph.plan.md](../personal-knowledge-graph.plan.md) — the current work this future plan shapes
- [ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md) — Schema.org compliance throughout the graph; all entities have standard types
- [Neo4j](https://neo4j.com/) — graph database
- [Cypher Query Language](https://neo4j.com/docs/cypher-manual/current/) — Neo4j's query language
- [JSON-LD](https://json-ld.org/) — the graph serialisation format already in use
