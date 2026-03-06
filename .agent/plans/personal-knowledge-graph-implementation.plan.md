---
name: Personal Knowledge Graph
overview: Build a unified entity model where all representations of Jim — CV, front page, JSON-LD, LinkedIn, tilts, PDF — are derived views onto a single knowledge graph, designed at all four abstraction levels from the start.
todos:
  - id: phase1-design
    content: "Phase 1: Entity model design — schema, ID conventions, page-composition mechanism, example skeleton"
    status: pending
  - id: phase2-populate
    content: "Phase 2: Entity population — concrete entities, abstract/expressive entities, role descriptions, constant migration"
    status: pending
  - id: phase3-wire
    content: "Phase 3: View derivation — rewire jsonld.ts, cv-content.ts, manifest.ts, page composition; verify no visible change"
    status: pending
  - id: phase4-enrich
    content: "Phase 4: New views — front page JSON-LD, expanded graph, domain-appropriate descriptions, HTML binding, validation"
    status: pending
  - id: phase5-linkedin
    content: "Phase 5: LinkedIn as a derived view — derive all LinkedIn content from the graph"
    status: pending
isProject: false
---

# Personal Knowledge Graph

## Direction

The graph is the source of truth for Jim's identity. Every output — page rendering, Open Graph, JSON-LD, manifest, sitemap, PDF, LinkedIn, tilt variants — is a derived view. The model contains entities at all abstraction levels (concrete, abstract, expressive, presentational) because all are real. The design targets the full model from the start; population and wiring happen incrementally.

## What exists today

- **[content/cv.content.json](content/cv.content.json)** — editorially settled page composition (positioning, experience, capabilities, education, tilts)
- **[content/frontpage.content.json](content/frontpage.content.json)** — front page narrative
- **[lib/jsonld.ts](lib/jsonld.ts)** — JSON-LD graph builder with invisible constants: `KNOWS_ABOUT` (34 items), `OCCUPATION`, `CREDENTIAL_DETAILS`, `PUBLICATIONS` (4 works)
- **[lib/cv-content.ts](lib/cv-content.ts)** — OG metadata derivation, tilt routing
- **Front page has no JSON-LD** — Person entity only exists on `/cv`
- **[archive/prior_cv_content.json.bak](archive/prior_cv_content.json.bak)** — full career history: 11 roles across 9 organisations, 3 education entries with theses, 35 skills
- **Content negotiation** (ADR-010) returns the full graph for any page URL via `Accept: application/ld+json`

## What changes

A new `content/entities.json` becomes the canonical model. Page composition files (`cv.content.json`, `frontpage.content.json`) become views that reference entities by ID. `lib/jsonld.ts` reads from the entity model instead of defining its own constants.

## Phasing

### Phase 1 — Entity model design (collaborative, no code changes)

Design the schema: entity types, relationships, ID conventions, and how page composition files reference entities. Key decisions:

- **Entity shape** — flat definitions with typed relationship references (Neo4j-ready per [future plan](/.agent/plans/future/neo4j-knowledge-graph.plan.md)), not nesting
- **ID scheme** — stable, human-readable IDs that map to JSON-LD `@id` fragments and HTML element IDs (e.g. `person-jim`, `org-oak`, `role-oak-principal-2022`)
- **How page files reference entities** — do `cv.content.json` and `frontpage.content.json` reference entity IDs inline, or does a separate page-composition layer define traversals?
- **Where positioning, capabilities, and tilts live** — currently in `cv.content.json` as page content; in the target model they are expressive entities (PositioningNarrative, Capability, TiltVariant) referenced by a ProfessionalIdentity node
- **Domain-appropriate descriptions** (ADR-011) — Person description for machines, OG descriptions per page, manifest description — each lives on the appropriate entity

Produces: a schema definition (likely an ADR), an example `entities.json` skeleton showing all entity types and relationships, and agreement on how page composition works.

### Phase 2 — Entity population (editorial-intensive, the core work)

Populate the model with all entities. Sources: current content files, `lib/jsonld.ts` constants, career archive, Jim's input.

**Concrete entities:**

- Person (enriched: honorificPrefix, pronouns, description, sameAs)
- All organisations (Oak, FT Labs, HMPO, BA, HP Labs, universities, Code Science, Growing Communities, etc.) with URLs and sameAs
- Full role history (11+ roles from archive) with titles, dates, organisations
- Role descriptions framed for who Jim is now ("Framing is identity, not history" principle)
- All credentials (3 degrees + certifications as JSON-LD-only entities)
- Theses (3, linked to credentials)
- Publications (4, with DOIs/arXiv IDs)
- Projects and software (Oak SDK/MCP, this website, Obaith)
- Services (Oak Curriculum API)

**Abstract entities:**

- ProfessionalIdentity — the identity construct that positioning, capabilities, and tilts express
- ResearchBackground — linked to credentials, publications, research domain

**Expressive entities:**

- PositioningNarrative (the two positioning paragraphs)
- Capabilities (5, each grounded by evidence: roles, projects, publications)
- TiltVariants (public_sector, private_ai, founder)

**Invisible constants migrated:**

- KNOWS_ABOUT → entity model (linked to Person or ProfessionalIdentity)
- OCCUPATION → entity model
- CREDENTIAL_DETAILS → merged into credential entities
- PUBLICATIONS → merged into publication entities

The role descriptions are the most editorial-intensive part — each needs Jim's input to ensure framing reflects who he is now, not the job-title framing of the era.

### Phase 3 — View derivation (structural refactoring, no visible change)

Rewire all views to consume from the entity model:

- `lib/jsonld.ts` — imports entities, composes the JSON-LD graph
- `lib/cv-content.ts` — derives OG from entity model
- `app/manifest.ts` — derives from entity model
- Page composition files reference entities by ID
- **Verify**: rendered pages pixel-identical, all tests pass, JSON-LD graph structurally equivalent

### Phase 4 — New views and enrichment

- **Front page JSON-LD** — Person + identity-focused subset (the canonical document for `#person` should contain structured data)
- **Expanded JSON-LD graph** — full role history, all credentials, theses, projects, volunteer work, certifications
- **Domain-appropriate descriptions** — Person entity gets its own machine-facing description; pages get their own OG descriptions; manifest gets its own description (completing ADR-011)
- **HTML semantic binding** — graph `@id` values map to HTML element `id` attributes where appropriate
- **Schema.org validation** — validate against schema.org validator and Google Rich Results Test
- **"Knowledge graphs" added to KNOWS_ABOUT** — once the graph is built, Jim demonstrably knows about knowledge graphs

### Phase 5 — LinkedIn as a derived view

With the graph complete and editorially excellent, derive LinkedIn content:

- Headline, About/Summary from ProfessionalIdentity + PositioningNarrative
- Experience entries from Role entities (title, org, dates, description)
- Education from Credential entities
- Certifications from certification entities
- Publications from publication entities
- Skills from KNOWS_ABOUT

This replaces the existing [LinkedIn update plan](/.agent/plans/linkedin-update.plan.md) — LinkedIn becomes a view, not a parallel editing effort.

## Key principles (from the existing plan, still valid)

- **All entities are real** — a ProfessionalIdentity is as real as a Role; it is more abstract, not less real
- **Visible content unchanged during structural migration** — editorial changes and structural migration are separate commits
- **Shape for Neo4j** — flat entities, typed relationships as references, stable IDs
- **Every entity must be published** — no orphan data; every entity appears in at least one published output
- **Framing is identity, not history** — historical titles are facts; descriptions express what Jim was actually doing

## Files affected

| File                             | Phase | Changes                                          |
| -------------------------------- | ----- | ------------------------------------------------ |
| `content/entities.json` (new)    | 1-2   | All entities at all abstraction levels           |
| `content/cv.content.json`        | 3     | References entities by ID; editorial prose stays |
| `content/frontpage.content.json` | 3     | References shared entities                       |
| `lib/jsonld.ts`                  | 3     | Imports from entity model, composes graph        |
| `lib/cv-content.ts`              | 3     | May import shared entity data                    |
| `app/page.tsx`                   | 4     | Add JSON-LD to front page                        |
| `app/manifest.ts`                | 3     | Derive from entity model                         |
| `components/cv-layout.tsx`       | 4     | Possibly: entity-level `id` attributes           |
| `docs/architecture/`             | 1     | New ADR for entity model design                  |
