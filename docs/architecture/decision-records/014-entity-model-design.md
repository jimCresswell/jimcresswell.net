# ADR-014: Entity model design for the personal knowledge graph

## Status

Accepted

## Date

2026-03-06

## Context

The site has evolved from a single content file (ADR-007) through Schema.org-typed JSON-LD (ADR-008) and canonical URL identity (ADR-010) towards a unified entity model — a personal knowledge graph where all site outputs derive from the same underlying reality.

Phase 1 resolves five open design decisions and establishes the structural foundations: file layout, entity types, Zod validation, and ID conventions.

## Decisions

### 1. Model structure: layered content files (Option A)

`content/entities.json` holds all entities at all abstraction levels as a valid JSON-LD document with `@context` and `@graph`. Page composition files (`cv.content.json`, `frontpage.content.json`) become views that reference entities by ID. Editorial prose stays in page files; shared structured data lives in the entity model.

**Rationale:** Cleanest separation of concerns. The entity file is directly consumable by RDF tools and Neo4j import. Page files remain small editorial documents.

### 2. Type mappings for abstract and expressive entities

| Entity                                                     | Schema.org type                  | Discriminator                    |
| ---------------------------------------------------------- | -------------------------------- | -------------------------------- |
| ProfessionalIdentity, ResearchBackground, GroundedPractice | `Intangible` + `additionalType`  | Non-physical concepts            |
| PositioningNarrative, TiltVariant                          | `Statement` + `additionalType`   | Authored expressions of identity |
| Capability                                                 | `DefinedTerm` + `additionalType` | Real competences                 |

`Statement` extends `CreativeWork`, inheriting `text`, `author`, `inLanguage`, `dateCreated` — nothing is lost. `Intangible` is correct for abstract identity constructs because they are non-physical concepts, not authored text.

The positioning belongs to ProfessionalIdentity, not Person directly. The front page narrative is a separate entity related to Person.

### 3. Wikidata entity linking for knowsAbout

All ~34 `knowsAbout` items link to Wikidata entities via `sameAs` (e.g. `{"@type": "Thing", "name": "Cosmology", "sameAs": "https://www.wikidata.org/wiki/Q338"}`). This is the highest-impact improvement for Google entity reconciliation.

### 4. Google Scholar indexing is not a goal

Jim manages his Google Scholar entry independently. The PKG links TO Scholar via `Person.sameAs`. No Highwire Press `citation_*` meta tags needed. `ScholarlyArticle` markup remains valuable for Google Search entity-building (Tier 2).

### 5. HTML semantic binding: all three levels

Section-level (`#experience`), entity-level (`#org-oak`, `#cred-phd`), and role anchors (`cv/#role-oak-2020-present`) all match between JSON-LD `@id` values and HTML `id` attributes. This extends ADR-010 to every entity in the graph.

### 6. Capability evidence: prose, not typed links

`isBasedOn` is not in the domain of `DefinedTerm` (which extends `Intangible`, not `CreativeWork`). Capability-to-evidence grounding is expressed through description prose and the shared Person node, not as typed graph edges.

### 7. Organisation relationships: provider, not makesOffer

`WebAPI.provider → Organization` is the correct direction. `Organization.makesOffer` expects an `Offer` intermediary, which adds complexity for minimal consumer value.

## File structure

```text
content/
  entities.json           # JSON-LD @graph — all entities with @context
  cv.content.json         # Page composition: entity references + editorial prose
  frontpage.content.json  # Page composition: entity references + hero narrative

lib/
  entities.ts             # Zod schemas, parse-time validation, derived types
```

## ID conventions

Extends ADR-010's `#person`, `#website`, `cv/#webpage` patterns:

| Pattern                   | Example                               |
| ------------------------- | ------------------------------------- |
| `#org-<slug>`             | `#org-oak`                            |
| `#cred-<slug>`            | `#cred-phd`                           |
| `#thesis-<slug>`          | `#thesis-phd`                         |
| `cv/#role-<slug>-<dates>` | `cv/#role-oak-principal-2022-present` |
| `#role-<slug>`            | `#role-growing-communities-volunteer` |
| `#software-<slug>`        | `#software-jimcresswell-net`          |
| `#service-<slug>`         | `#service-oak-api`                    |
| `#professional-identity`  | `#professional-identity`              |
| `#research-background`    | `#research-background`                |
| `#positioning-<variant>`  | `#positioning-default`                |
| `#cap-<slug>`             | `#cap-zero-to-one`                    |
| `#tilt-<slug>`            | `#tilt-public-sector`                 |

Publications use canonical external URLs (DOI, arXiv).

## Validation

Zod schemas in `lib/entities.ts` parse `entities.json` at import time. Invalid data causes a build failure. TypeScript types derive from the schemas — single source of truth, no parallel type definitions.

36 unit tests validate individual schemas (happy path + rejection). 7 integration tests validate the full graph (referential integrity, type census, role reachability, inSupportOf compliance).

## Consequences

- All site outputs derive from a single entity model — content changes propagate everywhere
- The entity file is valid JSON-LD consumable by RDF tools and ready for Neo4j import
- Zod catches structural errors at build time, not at runtime in production
- Adding a new entity type requires: adding it to entities.json, adding a Zod schema, and adding it to the discriminated union
- Phase 2 populates the skeleton; Phase 3 rewires existing code to import from the entity model

## Related

- ADR-007: DRY content and metadata consolidation (foundation)
- ADR-008: Schema.org compliance (type constraints)
- ADR-010: Canonical URL and graph identity (ID conventions)
- ADR-011: Domain-appropriate descriptions (view derivation)
