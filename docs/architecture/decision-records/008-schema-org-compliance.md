# ADR-008: Schema.org compliance as a constraint on the personal knowledge graph

## Status

Accepted

## Date

2026-02-15

## Context

The site is evolving from a single content file (`cv.content.json`) with derived metadata (ADR-007) towards a personal knowledge graph — a unified entity model where all site outputs (page rendering, Open Graph, JSON-LD, Web App Manifest, sitemap, PDF) are derived views onto the same underlying reality. See [personal-knowledge-graph.plan.md](../../../.agent/plans/personal-knowledge-graph.plan.md).

The knowledge graph models real entities at multiple levels of abstraction:

| Level          | Examples                                                    |
| -------------- | ----------------------------------------------------------- |
| Specific       | Role, Organisation, Credential, Publication, Project, dates |
| Abstract       | Person, ProfessionalIdentity, ResearchBackground            |
| Expressive     | PositioningNarrative, Capability, TiltVariant               |
| Presentational | CVPage, FrontPage, OGCard, PDFView                          |

All of these are real. Jim really is a Person. He really does have a ProfessionalIdentity. That identity really does have Capabilities. Those capabilities really are grounded by Roles and Projects. A PositioningNarrative is a real expression of a real identity. None of these are "editorial constructs" that exist only for content management — they are qualities, attributes, and expressions of real entities.

The question: can the graph be fully compliant with standard [Schema.org](https://schema.org/) definitions?

### Schema.org's expressive range

Schema.org is broader than its well-known specific types (`Person`, `Organization`, `ScholarlyArticle`). Every type inherits from `Thing`, which provides:

- `name` — what the entity is called
- `description` — what the entity is
- `disambiguatingDescription` — what distinguishes it from similar entities
- `identifier` — a stable ID
- `additionalType` — a more specific type IRI, designed for extending specificity while remaining standard
- `url`, `sameAs` — links to canonical or equivalent resources

Key types for abstract and expressive entities:

| Schema.org type    | Covers                                                              |
| ------------------ | ------------------------------------------------------------------- |
| `Intangible`       | Abstract concepts — parent of `Occupation`, `Role`, `DefinedTerm`   |
| `DefinedTerm`      | A word, concept, or phrase with a definition — maps to capabilities |
| `Statement`        | A statement about something — maps to positioning narratives        |
| `CreativeWork`     | A creative expression — parent of `Statement`, `TextObject`         |
| `WebPage`          | A page — maps to CVPage, FrontPage                                  |
| `Occupation`       | A profession or occupation — already used                           |
| `OrganizationRole` | A role at an organisation with dates — already used                 |

Using `Intangible` + `additionalType` for ProfessionalIdentity, `DefinedTerm` for Capability, `Statement` for PositioningNarrative — these are all standard Schema.org usage. The `additionalType` property exists specifically for this purpose: indicating more specific typing while using a recognised base type.

### Options evaluated

1. **Two-class model: Schema.org entities + "editorial" entities.** Only specific entities (Person, Organisation, Role) appear in JSON-LD. Abstract entities are labelled "editorial" and excluded.
   - Problem: Creates an artificial hierarchy of reality. ProfessionalIdentity is just as real as Role — it's more abstract, not less real. Labelling higher-abstraction entities "editorial" and excluding them from JSON-LD impoverishes the published graph and creates a two-tier system in the codebase.

2. **Schema.org throughout, using the vocabulary's full range.** All entities use standard Schema.org types — specific types where available (Person, Organization, ScholarlyArticle), generic types with `additionalType` where not (Intangible, DefinedTerm, Statement). Every entity in the graph can appear in JSON-LD.
   - Advantage: No two-class system. Every entity is real, every entity has a standard type, every entity can be published as structured data.
   - Advantage: `additionalType` is the standard mechanism for this — it exists specifically to extend type specificity.
   - Trade-off: Generic types (`Intangible`) are less useful to current search engine rich results than specific types (`Person`). But they're valid, they're standard, and they make the graph available to AI consumers and future Schema.org tooling.

3. **Custom vocabulary.** Invent types and properties.
   - Problem: No consumer understands custom types. Harmful for interoperability.

## Decision

**Option 2 — Schema.org compliance throughout the graph, using the vocabulary's full range including generic types and `additionalType`.**

Rules:

1. **Every entity in the graph uses a standard Schema.org `@type`.** For specific entities, use the most precise type available (`Person`, `Organization`, `OrganizationRole`, `EducationalOccupationalCredential`, `ScholarlyArticle`). For abstract entities, use the most appropriate generic type (`Intangible`, `DefinedTerm`, `Statement`, `CreativeWork`, `WebPage`) and add `additionalType` for specificity.
2. **Every property and relationship uses a standard Schema.org property.** `name`, `description`, `disambiguatingDescription`, `knowsAbout`, `hasOccupation`, `alumniOf`, `additionalType`, etc. No invented vocabulary.
3. **`additionalType` carries domain specificity.** Where Schema.org doesn't have a precise type, `additionalType` points to a well-defined IRI (e.g. `https://www.jimcresswell.net/schema/ProfessionalIdentity`). The base `@type` is always a standard Schema.org type. The `additionalType` provides specificity for custom consumers without breaking standard ones.
4. **All entities can appear in JSON-LD.** There is no class of entity excluded from structured data by design. The JSON-LD view decides what to include based on what's useful for machine consumers, not based on whether an entity is "real enough."
5. **No entity hierarchy of reality.** A ProfessionalIdentity at the abstract level is as real as a Role at the specific level. The difference is abstraction, not validity. Both are Schema.org-typed. Both can be published.

### Suggested Schema.org type mappings

| Entity               | Schema.org `@type`                     | `additionalType`           |
| -------------------- | -------------------------------------- | -------------------------- |
| Person               | `Person`                               | —                          |
| WebSite              | `WebSite`                              | —                          |
| Organisation         | `Organization` / `CollegeOrUniversity` | —                          |
| Role (employed)      | `EmployeeRole`                         | —                          |
| Role (volunteer)     | `OrganizationRole`                     | —                          |
| Credential           | `EducationalOccupationalCredential`    | —                          |
| Thesis               | `Thesis`                               | —                          |
| Publication          | `ScholarlyArticle`                     | —                          |
| Project              | `CreativeWork`                         | `.../Project`              |
| ProfessionalIdentity | `Intangible`                           | `.../ProfessionalIdentity` |
| ResearchBackground   | `Intangible`                           | `.../ResearchBackground`   |
| Capability           | `DefinedTerm`                          | `.../Capability`           |
| PositioningNarrative | `Statement`                            | `.../PositioningNarrative` |
| TiltVariant          | `Statement`                            | `.../TiltVariant`          |
| CVPage               | `ProfilePage`                          | —                          |
| FrontPage            | `ProfilePage`                          | —                          |

These mappings are suggestions for Phase 2 of the knowledge graph plan. The base types are all standard Schema.org. The `additionalType` IRIs would be defined under a namespace on `www.jimcresswell.net`.

### JSON-LD-only entities

Some entities appear in the JSON-LD structured data but not on visible pages. This is a valid and intended use of the graph — the model holds the complete reality, and each view selects what to present. Examples: certifications that also appear on LinkedIn (linked from the footer on all pages), historical roles not shown on the current CV, volunteer work details. The "every entity must be published" principle is satisfied by JSON-LD publication — it is published HTML in `<script type="application/ld+json">`.

### How this evolves ADR-007

ADR-007 established `cv.content.json` as the single source of truth, with JSON-LD derived from it in `lib/jsonld.ts`. This ADR extends that principle: the knowledge graph is the new single source, and JSON-LD remains a derived view — but now the view can express the full graph because every entity has a standard Schema.org type. The `lib/jsonld.ts` module-level constants (`KNOWS_ABOUT`, `PUBLICATIONS`, `OCCUPATION`, `CREDENTIAL_DETAILS`) move into the content model as entities in the graph.

## Consequences

**Benefits:**

- No two-class system. Every entity is real, every entity is Schema.org-typed, every entity can appear in published structured data. Developers don't need to reason about which entities are "eligible" for JSON-LD.
- The full graph — including abstract entities like ProfessionalIdentity and Capability — is available to AI consumers, knowledge graph aggregators, and future Schema.org tooling that understands generic types.
- `additionalType` provides a clean extension mechanism: standard consumers see `Intangible`, advanced consumers see `.../ProfessionalIdentity`. No consumer is confused.
- The architecture aligns with the principle that all entities are real. The vocabulary matches the ontology.

**Trade-offs:**

- Generic types (`Intangible`, `DefinedTerm`) don't trigger Google Rich Results the way `Person` or `Article` do. The abstract entities are valid structured data but won't generate search result enhancements today. This is acceptable — correctness and completeness matter more than current rich result coverage, and AI consumers increasingly process full JSON-LD graphs.
- The `additionalType` IRIs need to be defined and hosted. A lightweight vocabulary document at `www.jimcresswell.net/schema/` would suffice — it doesn't need to be a formal ontology, just stable IRIs with human-readable descriptions.
- More entities in JSON-LD means a larger structured data payload. Mitigated by the fact that the graph is modest in size (dozens of entities, not thousands).

## Related

- [ADR-007: DRY content and metadata consolidation](007-dry-content-metadata.md) — predecessor; this ADR extends its principles
- [Schema.org](https://schema.org/) — the vocabulary constraint
- [Schema.org `additionalType`](https://schema.org/additionalType) — the standard extension mechanism
- [Schema.org `Intangible`](https://schema.org/Intangible) — base type for abstract entities
- [Schema.org `DefinedTerm`](https://schema.org/DefinedTerm) — for capabilities and expertise areas
- [Schema.org `Statement`](https://schema.org/Statement) — for positioning narratives and expressions
- [personal-knowledge-graph.plan.md](../../../.agent/plans/personal-knowledge-graph.plan.md) — the plan this ADR constrains
- [future/neo4j-knowledge-graph.plan.md](../../../.agent/plans/future/neo4j-knowledge-graph.plan.md) — future migration; all entities migrate as labelled nodes
