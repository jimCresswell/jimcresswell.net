---
name: Personal Knowledge Graph Phase Model
overview: Archived PKG phase model retained for full goals, impacts, tasks, and acceptance criteria after live execution ownership moved to the PKG execution plan.
todos:
  - id: preserve-phase-model
    content: Preserve the full PKG phase model and acceptance criteria as a non-current reference.
    status: completed
  - id: move-live-ownership
    content: Move mutable execution status, proof state, and next actions to the PKG execution plan.
    status: completed
isProject: false
---

# Personal Knowledge Graph — Phase Model

## Status

Archived reference as of 2026-03-09. This file preserves the full PKG phase model: goals, impacts, tasks, and acceptance criteria.

For current graph work, use the [graph metaplan](../graph-metaplan.plan.md) and
the [current-state audit](../research/graph-current-state-audit.md). For
historical design reasoning, use the
[design notes](../research/personal-knowledge-graph-design-notes.md). Durable
architectural decisions live in
[ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md)
and related ADRs.

## How to use this reference

Use this file for:

- phase goals, impacts, and acceptance criteria
- full task inventories by phase
- reference-quality implementation scope

Do not use this file for:

- current phase status
- proof or validator state
- latest gate results
- next-session starting point

## Reading requirements

Before starting any phase, read:

1. [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) plus the related ADRs it references — canonical design decisions
2. [Historical design working notes](../research/personal-knowledge-graph-design-notes.md) — entity inventory, audit detail, and design exploration context
3. `.agent/directives/editorial-guidance.md` — voice, editorial hierarchy, "physics as silent ballast"
4. `.agent/directives/rules.md` and `.agent/directives/testing-strategy.md` — project conventions

Before Phase 2 (editorial-intensive), additionally read:

1. `.agent/skills/editorial-voice/SKILL.md` — common pitfalls, two registers
2. `content/cv.content.json` — the `prior_roles` descriptions are exemplars of the right framing for role descriptions
3. `docs/editorial/decision-records/` — editorial decisions already made
4. `.agent/private/identity.md` — deeper biographical context, additional career breadth roles, volunteer work (gitignored — local access only)

## Overview

This plan assumes Option A (layered content files with `content/entities.json`). Phase 1 task 1 confirms or changes this assumption. Page composition files (`cv.content.json`, `frontpage.content.json`) become views that reference entities by ID. `lib/jsonld.ts` reads from the entity model instead of defining its own constants. The front page gets JSON-LD. LinkedIn content derives from the graph.

The Person entity is defined once and its `@id` (`https://www.jimcresswell.net/#person`) resolves against the root URL — the front page is the canonical document for the Person entity. Each page's inline JSON-LD contains a subgraph that includes the Person node; same `@id` means same entity across pages.

## Phases

| Phase                         | Key principle                              | Nature                                    |
| ----------------------------- | ------------------------------------------ | ----------------------------------------- |
| 1. Entity model design        | Design the schema before writing code      | Collaborative design + skeleton + schemas |
| 2. Entity population          | All entities are real, framing is identity | Editorial-intensive, Jim's input needed   |
| 3. View derivation            | Visible content unchanged during migration | Structural refactoring                    |
| 4. New views and enrichment   | Every entity must be published             | New capabilities                          |
| 5. LinkedIn as a derived view | LinkedIn is a view, not a parallel effort  | Editorial derivation                      |

---

### Phase 1 — Entity model design

**Goal:** Formalise the entity schema, file structure, ID conventions, and page-composition mechanism before writing any code. The canonical durable decision for this phase is recorded in ADR-014; the historical design working notes capture the exploration that led there.

**Impact:** All subsequent phases have a clear, agreed structure to build against. No ambiguity about where entities live or how views reference them.

**Key decisions** (see [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) and the [historical design notes](../research/personal-knowledge-graph-design-notes.md) for context):

- File structure: layered content files (entities.json + page composition files) vs alternatives
- Entity shape: flat definitions with typed relationship references (Neo4j-ready)
- ID scheme: stable, human-readable IDs that map to JSON-LD `@id` fragments and HTML element IDs
- How page files reference entities: inline IDs vs separate composition layer
- Where positioning, capabilities, and tilts live in the model
- TypeScript validation strategy: the entity model needs runtime validation at the JSON boundary (Zod schemas or equivalent) — the project's type-safety rules (no `as`, no `any`, validate external data) require this

#### Phase 1 tasks

1. **Resolve the model structure question**
   - Present Option A (layered files), Option B (expanded cv.content.json), and any alternative to Jim
   - Impact: determines the file architecture for all subsequent work
   - Acceptance criteria: Jim has chosen an option; decision is recorded in this plan and as an ADR

2. **Define the ID scheme**
   - Agree on ID patterns for all entity types (see [historical design notes](../research/personal-knowledge-graph-design-notes.md#schema-org-structural-conventions))
   - Impact: IDs are stable across the project lifecycle and compatible with Neo4j migration
   - Acceptance criteria: every entity type has a documented ID pattern; patterns are consistent with ADR-010

3. **Design the page-composition mechanism**
   - Define how `cv.content.json` and `frontpage.content.json` reference entities from `entities.json`
   - Impact: clean separation between entity definitions and page-level presentation
   - Acceptance criteria: a worked example showing how at least one page section (e.g. experience) references entity IDs

4. **Produce an example `entities.json` skeleton**
   - Create a skeleton showing all entity types, relationships, and at least one populated example per type
   - The file should be valid JSON-LD: include `@context` and `@graph` so any RDF tool (including future Neo4j migration tools like rdflib-neo4j) can consume it directly
   - Impact: concrete reference for Phase 2 population work; forward-compatible with Linked Data tooling
   - Acceptance criteria: skeleton validates as JSON-LD (not just JSON); all entity types from the historical design audit are represented; relationships use `@id` references, not nesting

5. **Create an ADR for the entity model design**
   - Document the schema, file structure, ID conventions, and composition mechanism
   - Impact: architectural decision is permanent and discoverable
   - Acceptance criteria: ADR exists in `docs/architecture/decision-records/`; references ADR-007, ADR-008, ADR-010

6. **Create Zod schemas for entity validation**
   - Define Zod schemas for all entity types so `entities.json` is parsed and validated at build time
   - The project's type-safety rules require external data validation (no `as`, no `any` — see `rules.md`)
   - Impact: type errors in entity data surface at build time, not runtime; TypeScript types derive from Zod schemas (single source of truth)
   - Acceptance criteria: every entity type has a Zod schema; `entities.json` is parsed through the schema at import time; invalid entity data causes a build failure with a helpful error message

---

### Phase 2 — Entity population

**Goal:** Populate the entity model with all entities at all abstraction levels. This is the editorial core — role descriptions need Jim's input.

**Impact:** The complete reality of Jim's career, identity, and work exists as structured, visible content. No facts are buried in TypeScript constants.

**Sources:** current content files, `lib/jsonld.ts` constants, `archive/prior_cv_content.json.bak`, Jim's input.

#### Phase 2 tasks

1. **Migrate invisible constants**
   - Move `KNOWS_ABOUT`, `OCCUPATION`, `CREDENTIAL_DETAILS`, `PUBLICATIONS` from `lib/jsonld.ts` into the entity model
   - Impact: all content decisions about Jim's identity are visible in the content layer
   - Acceptance criteria: `lib/jsonld.ts` no longer defines these constants; entity model contains equivalent data; existing JSON-LD output is structurally identical

2. **Create concrete entities**
   - Person (enriched: honorificPrefix, pronouns, description, sameAs), all organisations, all credentials, theses, publications, projects, software, services
   - Impact: every real-world entity has a first-class representation with a stable ID
   - Acceptance criteria: all entities from the historical design audit are present; each has an `@id`-compatible key

3. **Create full role history**
   - All 11+ roles from the career archive with titles, dates, organisations, and descriptions
   - Role descriptions framed for who Jim is now (see "Framing is identity, not history" in the historical design notes)
   - Impact: the graph contains Jim's complete career; views select subsets
   - Acceptance criteria: every role from the archive has an entity; each description has been reviewed with Jim; historical titles preserved as `roleName`, descriptions express leadership and change

4. **Create abstract and expressive entities**
   - ProfessionalIdentity, ResearchBackground, GroundedPractice, PositioningNarrative, Capabilities (5), TiltVariants (3)
   - Impact: higher-level identity constructs are explicit entities with Schema.org types, not implicit JSON structure
   - Acceptance criteria: all abstract and expressive entities from the historical design audit are present; each has typed relationships to the entities that ground it

---

### Phase 3 — View derivation

**Goal:** Rewire all views to consume from the entity model. No visible change to rendered pages.

**Impact:** The entity model is the single source of truth. Every output derives from it.

**Key principle:** Visible content unchanged. Snapshot rendered output before starting; diff after each step. Editorial changes happen separately, never in the same commit as structural migration.

#### Phase 3 tasks

1. **Rewire `lib/jsonld.ts`**
   - Import entities from the content model; compose the JSON-LD `@graph` from entity data
   - **Migration note**: the existing `lib/jsonld.ts` uses `Thesis.inSupportOf` as an entity reference (`{"@id": ".../#cred-mphys"}`), but Schema.org defines `inSupportOf` as expecting `Text`. During this rewire, correct to use `inSupportOf` as `Text` and `Thesis.about` as the typed `@id` reference to the credential (per [research findings](../research/pkg-research-findings.md)). This is a structural correction, not an editorial change.
   - Impact: JSON-LD graph is derived from entities, not hardcoded constants; `inSupportOf` usage becomes Schema.org-compliant
   - Acceptance criteria: `lib/jsonld.ts` imports from entity model; JSON-LD output is structurally equivalent to current output except for the `inSupportOf` correction; `pnpm check` and `pnpm test:e2e` pass

2. **Rewire `lib/cv-content.ts`**
   - Derive OG metadata from entity model where shared data exists (Person name, links)
   - Impact: no duplicated Person data between content files
   - Acceptance criteria: overlapping data (name, links) comes from entity model; OG output unchanged

3. **Rewire `app/manifest.ts`**
   - Derive manifest from entity model
   - Impact: manifest description can diverge from CV OG description (completing ADR-011)
   - Acceptance criteria: manifest output unchanged; source is entity model

4. **Update page composition files**
   - `cv.content.json` and `frontpage.content.json` reference entities by ID where appropriate
   - Impact: pages compose from the graph rather than owning entity data
   - Acceptance criteria: no duplicated entity data across content files; rendered pages pixel-identical

5. **Implement subgraph closure**
   - Build the CBD-inspired closure algorithm (Concise Bounded Description with pruning) that derives page-level JSON-LD subgraphs from the canonical graph (see [historical design notes](../research/personal-knowledge-graph-design-notes.md#design-phase-3-derive-all-views-from-the-model))
   - The closure function accepts a pruning predicate — pruning policy is configuration, not algorithm. This is a pure function (entity graph in, pruning config in, subgraph array out) — write unit tests first (TDD)
   - Impact: each page can get its own JSON-LD subgraph, scoped to the entities it presents
   - Acceptance criteria: closure algorithm produces a valid JSON-LD `@graph`; every `@id` reference in the subgraph resolves to a node within the same subgraph; CV page subgraph matches current full graph; unit tests cover closure, pruning, and dangling-reference detection

---

### Phase 4 — New views and enrichment

**Goal:** Add capabilities that the entity model makes possible: front page JSON-LD, expanded graph, domain-appropriate descriptions, HTML binding.

**Impact:** The front page becomes the canonical document for the Person entity. The JSON-LD graph covers Jim's complete career. HTML elements are anchored to graph nodes.

#### Phase 4 tasks

1. **Add JSON-LD to the front page**
   - Identity-focused subgraph: WebSite + ProfilePage + Person + top capabilities + current role
   - Impact: `https://www.jimcresswell.net/#person` resolves to a document that actually contains the Person's structured data
   - Acceptance criteria: front page HTML contains a `<script type="application/ld+json">` with a valid subgraph; Person `@id` is consistent with CV page

2. **Expand the JSON-LD graph**
   - Full role history, all credentials, theses, projects, volunteer work, certifications (JSON-LD only where not on visible pages)
   - Impact: machine consumers see Jim's complete career, not just the editorial selection
   - Acceptance criteria: every entity from `entities.json` appears in at least one published output (page JSON-LD subgraph, `/api/graph` endpoint, OG metadata, or HTML content); the existing `/api/graph` endpoint returns the expanded graph
   - **Note — Google Scholar**: research confirms Google Scholar does not consume JSON-LD (it uses `citation_*` HTML meta tags). `ScholarlyArticle` markup helps Google Search entity-building but does not reach Scholar. **Decision for Jim**: if Google Scholar indexing from this site is a goal, `<meta name="citation_*">` tags would need to be added separately. This is independent of the graph expansion.

3. **Implement domain-appropriate descriptions**
   - Person entity gets a machine-facing description; pages get their own OG descriptions; manifest gets its own description (completing ADR-011)
   - Impact: each domain has a description written for its audience
   - Acceptance criteria: Person `description` differs from OG `description` differs from manifest `description`; all are editorially consistent

4. **Add HTML semantic binding**
   - Map graph `@id` values to HTML element `id` attributes where appropriate (binding level decided with Jim — section, entity, and role-anchor levels are all required)
   - Impact: deep-links for humans, stable identifiers for machines
   - Acceptance criteria: section-, entity-, and role-anchor binding all exist, and any resulting HTML/DOM differences are explicitly reviewed with Jim rather than silently accepted

5. **Validate structured data**
   - Four-tool validation workflow (see [research findings](../research/pkg-research-findings.md)): programmatic `@id` resolution check during development, Schema.org Validator for spec compliance, Google Rich Results Test for Google eligibility, Google Search Console for ongoing monitoring
   - Programmatic check: every `@id` reference in a page's subgraph resolves to a node within the same subgraph
   - Impact: confidence that the graph is correctly consumed by search engines and AI
   - Acceptance criteria: no errors from Schema.org Validator; Rich Results Test shows expected eligible types (ProfilePage, WebSite); every `@id` reference resolves; programmatic check integrated into test suite

6. **Cross-output consistency and framing review**
   - Review all outputs for editorial consistency: OG descriptions, JSON-LD Person description, page prose, manifest description (see [historical design notes](../research/personal-knowledge-graph-design-notes.md#design-phase-5-consistency-and-framing-review))
   - Review every role `description` against the "Framing is identity, not history" principle — the reader should see a leader and originator, not a job title progression
   - Impact: every representation of Jim tells the same story in its respective register
   - Acceptance criteria: no contradictions between OG, JSON-LD, page prose, and manifest; role descriptions reviewed with Jim; framing pass documented

7. **Add "Knowledge graphs" to KNOWS_ABOUT**
   - Once the graph is built, Jim demonstrably knows about knowledge graphs
   - Impact: structured data reflects demonstrated capability
   - Acceptance criteria: term present in entity model and published JSON-LD

8. **Add Schema.org vocabulary validation with `schema-dts`**
   - Add compile-time Schema.org vocabulary validation alongside the existing Zod shape validation
   - Impact: invalid Schema.org properties or wrong property/type pairings fail at typecheck time, not only in review
   - Acceptance criteria: `schema-dts` is added as a devDependency; core entity types are checked against Schema.org vocabulary; `tsc --noEmit` fails on known-bad property usage

---

### Phase 5 — LinkedIn as a derived view

**Goal:** Derive all LinkedIn content from the knowledge graph. The standalone [LinkedIn update plan](../current/linkedin-update.plan.md) is retained as a subsumed reference so its source-material checklist, editorial questions, role inventory, and API findings are not lost.

**Impact:** LinkedIn content is editorially consistent with the CV and all other views because it derives from the same source.

#### Phase 5 tasks

1. **Derive headline and About section**
   - From ProfessionalIdentity + PositioningNarrative entities
   - Impact: LinkedIn positioning is consistent with CV positioning
   - Acceptance criteria: copy-paste-ready headline and About section; reviewed with Jim

2. **Derive experience entries**
   - From Role entities (title, org, dates, description)
   - Impact: LinkedIn role descriptions use the same "framing is identity" descriptions as the graph
   - Acceptance criteria: every role Jim wants on LinkedIn has a copy-paste-ready entry

3. **Derive education, certifications, publications, skills**
   - From Credential, Publication, and KNOWS_ABOUT entities
   - Impact: complete LinkedIn profile derived from graph
   - Acceptance criteria: all sections copy-paste ready; document at `.agent/temp/linkedin-update-content.md`

4. **Resolve LinkedIn-specific editorial questions**
   - See [LinkedIn plan Phase 2](../current/linkedin-update.plan.md) for open questions (headline keywords, role grouping, description length, skills section)
   - Impact: LinkedIn-specific decisions are made with Jim's input
   - Acceptance criteria: each question from the LinkedIn plan is answered and recorded

---

## Quality gates (every phase)

- `pnpm check` passes
- `pnpm test:e2e` passes
- Phase 3 only: `pnpm visual-regression-harness <base-ref> <target-ref>` reports zero HTML/DOM differences and zero pixel differences unless Jim explicitly approves a flagged exception
- Phase 4: no regression to existing rendered output; if the harness flags DOM-only or metadata-only differences, stop and review them with Jim before proceeding
- Phase 4+: [Schema.org Validator](https://validator.schema.org/) — no errors
- Phase 4+: [Google Rich Results Test](https://search.google.com/test/rich-results) — all pages pass
- Every `@id` reference resolves to a defined node

**Neo4j forward-compatibility checklist** (see [research findings](../research/pkg-research-findings.md) and [icebox/neo4j-knowledge-graph.plan.md](../icebox/neo4j-knowledge-graph.plan.md)):

- [ ] Every entity has `@id` and `@type` — no exceptions, even abstract entities
- [ ] Relationships are `{"@id": "..."}` references — no embedded entity definitions
- [ ] Entity IDs are content-derived slugs — not array positions or hashes
- [ ] Schema.org property names used as-is — `worksFor`, `alumniOf`, `hasCredential` (map directly to Neo4j relationship types)
- [ ] Entities file is valid JSON-LD — `@context`, `@graph`, `@id`, `@type` throughout
- [ ] No deep nesting — flat entity definitions with relationship references

## Files affected

| File                             | Phase | Changes                                          |
| -------------------------------- | ----- | ------------------------------------------------ |
| `content/entities.json` (new)    | 1–2   | All entities at all abstraction levels           |
| `content/cv.content.json`        | 3     | References entities by ID; editorial prose stays |
| `content/frontpage.content.json` | 3     | References shared entities                       |
| `lib/jsonld.ts`                  | 3     | Imports from entity model, composes graph        |
| `lib/cv-content.ts`              | 3     | May import shared entity data                    |
| `app/page.tsx`                   | 4     | Add JSON-LD to front page                        |
| `app/manifest.ts`                | 3     | Derive from entity model                         |
| `components/page-section.tsx`    | 4     | Section-level HTML `id` binding                  |
| `docs/architecture/`             | 1     | New ADR for entity model design                  |

## Agent tooling

- **PKG skill** (`pkg` in `.agent/skills/pkg/SKILL.md`) — compact operational reference for entity model work: type mappings, `@id` conventions, JSON-LD constraints, consumer value tiers, Neo4j checklist, validation workflow, common pitfalls
- **PKG reviewer** (`pkg-reviewer` in `.agent/sub-agents/templates/pkg-reviewer.md`) — specialist reviewer for Schema.org correctness, JSON-LD constraints, `@id` resolution, consumer value alignment, and Neo4j forward-compatibility. The gateway `code-reviewer` triages to this reviewer for PKG-related changes.

## Related

- [research/pkg-research-findings.md](../research/pkg-research-findings.md) — Schema.org, JSON-LD, Google structured data, and Neo4j research findings
- [personal-knowledge-graph-design-notes.md](../research/personal-knowledge-graph-design-notes.md) — historical design working notes and audit context
- [personal-knowledge-graph-execution.plan.md](../drafts/personal-knowledge-graph-execution.plan.md) — preserved candidate execution draft
- [visual-regression-harness.plan.md](visual-regression-harness.plan.md) — completed harness proof record
- [cv-editorial-improvements.plan.md](../current/cv-editorial-improvements.plan.md) — parent plan
- [linkedin-update.plan.md](../current/linkedin-update.plan.md) — subsumed LinkedIn reference plan
- [icebox/neo4j-knowledge-graph.plan.md](../icebox/neo4j-knowledge-graph.plan.md) — shapes design decisions (stable IDs, typed relationships, flat entities)
- [ADR-007](../../docs/architecture/decision-records/007-dry-content-metadata.md) — current single-source approach
- [ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md) — Schema.org compliance throughout the graph
- [ADR-010](../../docs/architecture/decision-records/010-canonical-url-graph-identity.md) — canonical URL and graph identity
- [ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md) — domain-appropriate descriptions
- [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) — canonical PKG design decisions
