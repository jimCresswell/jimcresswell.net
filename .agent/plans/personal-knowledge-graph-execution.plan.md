---
name: PKG Implementation Execution
overview: Operationalise the Personal Knowledge Graph implementation plan with explicit reviewer invocations, skill activations, TDD discipline, and quality gates at every step. Five phases from entity model design through LinkedIn as a derived view.
todos:
  - id: quality-gates
    content: "Automated gates pass on current tree (`pnpm check:ci`, `pnpm test:e2e`)"
    status: completed
  - id: phase4-consistency
    content: "Phase 4: Cross-output consistency and framing review (comprehensive editorial pass)"
    status: in_progress
  - id: phase4-knows-about
    content: "Phase 4: Add 'Knowledge graphs' to knowsAbout with Wikidata link"
    status: pending
  - id: phase4-schema-dts
    content: "Phase 4: Add schema-dts compile-time Schema.org vocabulary validation"
    status: pending
  - id: phase4-final-gates
    content: "Phase 4: Final quality gates (Schema.org Validator, Rich Results Test, commit)"
    status: pending
  - id: phase5-linkedin
    content: "Phase 5: Derive all LinkedIn content from the graph (headline, About, experience, education, skills)"
    status: pending
isProject: false
---

# PKG Implementation Execution Plan

## Start here

This is the **standalone entry point** for continuing PKG implementation. A fresh agent with no prior context should be able to pick up and execute from this plan.

### Session start protocol

1. Read `.agent/directives/AGENT.md` — core directives, project context, session start protocol
2. Read `.agent/directives/rules.md` — development principles, type safety, testing, quality gates
3. Read `.agent/memory/distilled.md` and scan `.agent/memory/napkin.md` — hard-won patterns and recent context
4. Read `.agent/directives/editorial-guidance.md` — voice, registers, editorial hierarchy
5. Read this plan — understand what's done, what's next, how to work

### What this plan is

This plan operationalises the two existing PKG plans:

- [Design reference](personal-knowledge-graph.plan.md) -- entity inventory, principles, Schema.org conventions. All design decisions resolved. The WHY.
- [Implementation plan](personal-knowledge-graph-implementation.plan.md) -- phased tasks with acceptance criteria. The WHAT.

This plan defines the HOW -- reviewer invocations, skill activations, per-task status, and quality gates.

### Current state (updated 2026-03-08, verified 2026-03-08)

| Phase                       | Code status         | Gate status             | Key metric                                   |
| --------------------------- | ------------------- | ----------------------- | -------------------------------------------- |
| 1. Entity model design      | ✅ Code complete    | ✅ Automated gates pass | 17 Zod schemas, ADR-014                      |
| 2. Entity population        | ✅ Code complete    | ✅ Automated gates pass | ~50 entities in `entities.json`              |
| 3. View derivation          | ✅ Code complete    | ✅ Automated gates pass | `lib/jsonld.ts` 287→30 lines + shared helper |
| 4. New views and enrichment | 🔄 Code in progress | ✅ Current tree passes  | 6/8 tasks code-complete; manual checks left  |
| 5. LinkedIn as derived view | ⬜ Pending          | —                       | —                                            |

**128 vitest tests passing** across 14 test files. **All PKG and supporting tooling changes remain uncommitted on `main`** (no branch created).

**Automated gates pass on the current tree.** `pnpm check:ci` and `pnpm test:e2e` both passed on 2026-03-08. Manual Schema.org Validator and Rich Results Test checks remain outstanding. Phase 3 pixel-identical regression check is still not formally verified. Branch-per-phase strategy was missed and all work remains uncommitted on `main`.

**Dependency/tooling note:** the dependency refresh is complete. `eslint` is intentionally held at `9.x` because `eslint-config-next` is not yet compatible with `10.x` in this repo. ESLint now enforces the repo's policy against `as`, `!`, `vi.doMock`, and `vi.stubGlobal`.

### What to do next

1. **Complete Task 4.6** — Re-run the editor reviewer to verify the editorial fixes are sufficient. Check "Should Fix" and "Consider" items.
2. **Complete Task 4.7** — Add "Knowledge graphs" to `knowsAbout` in `content/entities.json` with Wikidata `sameAs` link.
3. **Complete Task 4.8** — Add `schema-dts` as a devDependency. Create compile-time Schema.org vocabulary validation. TDD.
4. **Run Phase 4 manual validation** — Schema.org Validator and Rich Results Test. Automated gates already pass on the current tree.
5. **Decide the recovery path for the missed branch strategy** — all PKG work is still uncommitted on `main`. Discuss with Jim before more structural work.
6. **Commit all Phase 1-4 changes** — Create a well-structured commit (or series of commits) once the remaining Phase 4 work is finished.
7. **Phase 5** — LinkedIn as a derived view.

### Key files to understand

| File                                                            | Purpose                                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `content/entities.json`                                         | The entity model — JSON-LD `@graph` with ~50 entities at all abstraction levels       |
| `lib/entities.ts`                                               | Zod schemas (17 types), discriminated union, parse at import, derive TypeScript types |
| `lib/subgraph.ts`                                               | Subgraph closure algorithm — `extractSubgraph`, `findDanglingRefs`                    |
| `lib/page-jsonld.ts`                                            | Page-specific JSON-LD subgraphs (`frontPageJsonLd`, `cvPageJsonLd`)                   |
| `lib/jsonld.ts`                                                 | Full graph with URL rewriting (30 lines — thin layer over entity model)               |
| `lib/rewrite-jsonld-urls.ts`                                    | Shared URL-rewrite helper with Zod re-validation                                      |
| `lib/cv-content.ts`                                             | OG metadata — imports Person from entity model                                        |
| `eslint.config.ts`                                              | Enforces no `as`, no `!`, no `vi.doMock` / `vi.stubGlobal`                            |
| `docs/architecture/decision-records/014-entity-model-design.md` | ADR documenting the entity model design                                               |

---

## Foundation doc discipline

Before every phase, re-read and re-commit to:

- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/AGENT.md`

Before every session, read `.agent/memory/distilled.md` and scan `.agent/memory/napkin.md`. Update the napkin continuously.

## Branch strategy

Per rules.md, use feature branches for risky changes. The PKG is structural work that touches content derivation, JSON-LD output, and page rendering -- all risky.

- Phase 4: `feature/pkg-phase4-new-views`
- Phase 5: `feature/pkg-phase5-linkedin`

Each phase merges to main after all quality gates pass and reviews are approved.

**Note:** Phases 1-4 have been worked directly on `main` without branches. All changes remain uncommitted. Before any further structural work, agree the recovery path with Jim: either commit the current Phase 1-4 state on `main` first, or create a rescue branch from the current tree and proceed from there.

## Reviewer protocol

After every non-trivial change, invoke the **code-reviewer** sub-agent (the gateway). The code-reviewer triages to specialists:

- **pkg-reviewer** -- on any change to entity model, JSON-LD generation, `@id` conventions, Zod schemas for entities, or structured data output
- **type-reviewer** -- on any change to type definitions, Zod schemas, generic parameters, or type flow through content accessors
- **test-reviewer** -- on any change that adds or modifies tests
- **editor** -- on any change to editorial content (entity descriptions, role descriptions, positioning, Person description, OG descriptions)

**Invoke reviewers liberally** -- when in doubt, invoke. The PKG touches Schema.org correctness, type safety, editorial voice, and test quality simultaneously. Most tasks in this plan should trigger 2-3 specialists.

## Skill activations

- **pkg skill** (`.agent/skills/pkg/SKILL.md`) -- read before any entity model or JSON-LD work. Contains type mappings, `@id` conventions, JSON-LD constraints, consumer value tiers, Neo4j checklist, common pitfalls.
- **editorial-voice skill** (`.agent/skills/editorial-voice/SKILL.md`) -- read before any content work (entity descriptions, role descriptions, Person description). Two registers, common pitfalls.
- **quality-gates skill** (`.agent/skills/quality-gates/SKILL.md`) -- read before running gates. Restart-on-fix discipline, prohibited shortcuts.

---

## Phases

| Phase                       | Key principle                              | Nature                       | Primary reviewers     |
| --------------------------- | ------------------------------------------ | ---------------------------- | --------------------- |
| 1. Entity model design      | Design before code                         | Collaborative + schema + Zod | pkg, type, code       |
| 2. Entity population        | All entities are real; framing is identity | Editorial-intensive          | editor, pkg, code     |
| 3. View derivation          | Visible content unchanged                  | Structural refactoring + TDD | code, test, type, pkg |
| 4. New views and enrichment | Every entity must be published             | New capabilities             | all five reviewers    |
| 5. LinkedIn as derived view | LinkedIn is a view                         | Editorial derivation         | editor, pkg           |

---

### Phase 1 -- Entity Model Design (code complete, automated gates pass)

All 5 tasks code-complete. Design decisions resolved with Jim, entity schema defined in `lib/entities.ts` (17 Zod schemas, discriminated union), `content/entities.json` skeleton created as valid JSON-LD `@graph`, ADR-014 documents the entity model design. 38 unit tests + 7 integration tests.

**Key decisions recorded:**

- Model structure: Option A (layered content files)
- Expressive entities: `Statement` for positioning/tilts, `Intangible` + `additionalType` for abstract identity constructs
- Wikidata linking: all 35 `knowsAbout` items linked (24 linked so far)
- Google Scholar: not a goal (PKG links TO Scholar via `sameAs`)
- HTML binding depth: all three levels (section, entity, role anchors)

**Remaining:** Automated gates pass on the current tree. No branch created. No commit yet.

---

### Phase 2 -- Entity Population (code complete, automated gates pass)

All 4 tasks completed. Entity model populated with ~50 entities across all abstraction levels.

**What was done:**

- Migrated all invisible constants (`KNOWS_ABOUT` 35 items with 24 Wikidata links, `OCCUPATION`, `CREDENTIAL_DETAILS`, `PUBLICATIONS`) from `lib/jsonld.ts` to `content/entities.json`. Fixed `inSupportOf` to use Text (Schema.org-compliant).
- Populated all concrete entities: Person (enriched with `honorificPrefix`, `pronouns`, `sameAs`), 7 Organisations (with URLs and Wikidata `sameAs`), 6 Credentials (3 degrees + 3 certifications), 3 Theses, 4 ScholarlyArticles, 2 SoftwareSourceCode, 2 CreativeWork projects, 1 WebAPI, 1 Occupation.
- Created 11 roles (EmployeeRole/OrganizationRole) with identity-framed descriptions. Historical titles preserved as `roleName`; descriptions express leadership and origination.
- Created abstract entities (ProfessionalIdentity, ResearchBackground, GroundedPractice as `Intangible` + `additionalType`) and expressive entities (PositioningNarrative + 3 TiltVariants as `Statement`, 5 Capabilities as `DefinedTerm`).

**PKG-reviewer findings addressed:** `isBasedOn` removed from DefinedTerm (not in domain), `makesOffer` removed from Organisation (expects Offer, not WebAPI), orphaned roles connected to Person, ArXiv publication retyped to ScholarlyArticle.

**Remaining:** Automated gates pass on the current tree. Role descriptions not all explicitly confirmed by Jim. No branch created. No commit yet.

---

### Phase 3 -- View Derivation (code complete, automated gates pass)

All 6 tasks completed. Every view now derives from the entity model.

**What was done:**

- Snapshotted pre-migration output for regression testing.
- Rewired `lib/jsonld.ts` from 287-line inline-constant builder to 30-line import + URL-rewrite layer. All constants removed.
- Rewired `lib/cv-content.ts` and `app/manifest.ts` to import Person data from entity model (`lib/entities.ts`).
- Implemented subgraph closure algorithm in `lib/subgraph.ts` — `extractSubgraph` (BFS from seed IDs, follows `@id` refs, excludes `sameAs`/external links) and `findDanglingRefs` (detects broken internal references). 10 unit tests.
- Created `lib/page-jsonld.ts` — page-specific JSON-LD subgraphs (`frontPageJsonLd`, `cvPageJsonLd`) using seed-based closure and URL rewriting.
- Updated page components (`app/page.tsx`, `app/cv/page.tsx`, `app/cv/[variant]/page.tsx`) to inject page-specific JSON-LD instead of the full graph.

**Files changed:** `lib/jsonld.ts`, `lib/cv-content.ts`, `app/manifest.ts`, `app/page.tsx`, `app/cv/page.tsx`, `app/cv/[variant]/page.tsx`. **Files created:** `lib/subgraph.ts`, `lib/subgraph.unit.test.ts`, `lib/page-jsonld.ts`.

**Remaining:** Automated gates pass on the current tree. Pixel-identical regression check not formally verified (snapshots exist in `__snapshots__/` but no comparison run). No branch created. No commit yet.

---

### Phase 4 -- New Views and Enrichment (IN PROGRESS)

**Goal:** Add capabilities the entity model makes possible: front page JSON-LD, expanded graph, domain-appropriate descriptions, HTML binding, validation, and Schema.org vocabulary verification.

**Impact:** The front page becomes the canonical document for the Person entity. The JSON-LD graph covers Jim's complete career. HTML elements are anchored to graph nodes. Schema.org vocabulary correctness is programmatically verified.

**Branch:** `feature/pkg-phase4-new-views`

**Skill activations:** Read pkg skill, editorial-voice skill, quality-gates skill.

#### Task 4.1 -- Add JSON-LD to the front page ✅ COMPLETE

Front page now has `<script type="application/ld+json">` with identity-focused subgraph: WebSite, ProfilePage, Person, identity constructs (ProfessionalIdentity, ResearchBackground, GroundedPractice), capabilities, and tilt variants. Uses `frontPageJsonLd` from `lib/page-jsonld.ts` with seed-based subgraph closure.

#### Task 4.2 -- Expand the CV page JSON-LD graph ✅ COMPLETE

CV page subgraph now includes the full career graph — all roles, credentials, theses, publications, projects, software, services. Uses `cvPageJsonLd` from `lib/page-jsonld.ts` which adds software/project seeds on top of the front page seeds.

#### Task 4.3 -- Implement domain-appropriate descriptions ✅ COMPLETE

Person entity has a machine-facing description. OG and manifest descriptions derive from Person via `lib/cv-content.ts` and `app/manifest.ts`. ADR-011 intent completed.

#### Task 4.4 -- Add HTML semantic binding ✅ COMPLETE

`components/page-section.tsx` updated to add `id` attribute directly to the `<section>` element: `<section id={id} aria-labelledby={headingId}>`. Section-level binding in place.

#### Task 4.5 -- Validate structured data ✅ COMPLETE

Programmatic `@id` resolution check implemented in integration tests (`lib/entities.integration.test.ts` — dangling reference detection, `lib/jsonld.integration.test.ts` — subgraph self-containment). Automated gates pass on the current tree (`pnpm check:ci`, `pnpm test:e2e`, both 2026-03-08). Manual Schema.org Validator and Rich Results Test remain outstanding.

#### Task 4.6 -- Cross-output consistency and framing review (IN PROGRESS)

Editor reviewer invoked for comprehensive editorial pass on `content/entities.json`. Two "Must Fix" issues identified and resolved:

1. **Ambiguous phrasing "support climate breakdown"** — Changed to "address climate breakdown, biodiversity loss, and social disconnection" in the Obaith EmployeeRole and CreativeWork entities.
2. **Inconsistent capability description register** — Five DefinedTerm/Capability descriptions now all use consistent gerund form ("Setting...", "Conceiving...", "Carrying...", "Shaping...", "Creating..."). Previously mixed past-tense fragments ("Conceived, prototyped, and delivered", "Helped shape") with gerunds.

**Remaining for this task:**

- Re-verify with editor reviewer that fixes are sufficient
- Check "Should Fix" and "Consider" items from original editor feedback
- Verify the Code Science Limited description rework is editorially sound

#### Task 4.7 -- Add "Knowledge graphs" to KNOWS_ABOUT (PENDING)

Once the graph is built, Jim demonstrably knows about knowledge graphs. Add to `knowsAbout` in `content/entities.json` with Wikidata `sameAs` link and update Zod schema count expectation if applicable.

**Acceptance criteria:**

- Term present in entity model and published JSON-LD
- Wikidata `sameAs` link included

#### Task 4.8 -- Schema.org vocabulary validation with schema-dts (PENDING — NEW)

Add compile-time Schema.org vocabulary validation using `schema-dts` (Google's TypeScript types for Schema.org, 1.5M weekly downloads, zero runtime cost).

**Problem this solves:** Our Zod schemas validate entity _shape_ (required fields, value types) but don't validate that the properties we use are valid Schema.org vocabulary for their declared `@type`. This gap has been caught by the pkg-reviewer manually (`isBasedOn` not valid on `DefinedTerm`, `makesOffer` expecting `Offer` not `WebAPI`). A compile-time check prevents this class of error permanently.

**Validation stack after this task:**

| Layer                    | Tool                                     | What it catches                           |
| ------------------------ | ---------------------------------------- | ----------------------------------------- |
| Compile-time: shape      | Zod (types derived)                      | Missing fields, wrong property types      |
| Compile-time: vocabulary | **schema-dts** (new)                     | Invalid Schema.org properties, wrong type |
| Runtime: validation      | Zod (parse)                              | Malformed entities.json at build time     |
| Runtime: integrity       | Subgraph tests                           | Dangling `@id` refs, orphaned entities    |
| Manual: richness         | Schema.org Validator + Rich Results Test | Google's interpretation                   |

**Implementation approach:**

1. `pnpm add -D schema-dts`
2. Create `lib/schema-org-check.ts` — compile-time type assertions that verify our entity types satisfy schema-dts Schema.org types (using the `Graph` type for `@graph` validation and individual type checks for entity schemas)
3. If `tsc --noEmit` passes (already a quality gate), Schema.org vocabulary is correct
4. Write a companion integration test that validates the complete `entities.json` graph can be assigned to the schema-dts `Graph` type

##### Design decision: why schema-dts, not ajv + schemaorg-jsd

`ajv` + `schemaorg-jsd` (pre-1.0) would provide runtime Schema.org validation but duplicates Zod's role and adds dependency weight. schema-dts provides the same vocabulary correctness at compile time with zero runtime cost, zero bundle size, and backing from Google. The maturity gap (schemaorg-jsd v0.17.1 vs schema-dts v1.1.5) further favours schema-dts.

**Acceptance criteria:**

- `schema-dts` added as devDependency
- Type-assertion file compiles without errors
- At least the core entity types (Person, Organization, EmployeeRole, ScholarlyArticle, DefinedTerm, Statement) are verified against schema-dts
- Invalid Schema.org properties cause `tsc` failure
- TDD: write the type assertions first, verify they catch a known-bad property, then confirm they pass with current entities

**Reviewers:** Invoke **type-reviewer** (type flow from schema-dts types through our Zod-derived types). Invoke **pkg-reviewer** (Schema.org correctness of the approach). Invoke **code-reviewer** as gateway.

#### Phase 4 quality gates (PARTIAL)

- ✅ `pnpm check:ci` passes on the current tree (2026-03-08)
- ✅ `pnpm test:e2e` passes on the current tree (2026-03-08)
- No regression to existing page content
- Every `@id` reference resolves (programmatic test — already in place)
- Schema.org Validator: no errors (manual, pre-deployment)
- Google Rich Results Test: ProfilePage and WebSite eligible (manual, post-deployment)
- schema-dts compile-time check passes (integrated into `tsc --noEmit`)
- All reviewer verdicts APPROVED or APPROVED WITH SUGGESTIONS
- Neo4j forward-compatibility checklist passes

---

### Phase 5 -- LinkedIn as a Derived View

**Goal:** Derive all LinkedIn content from the knowledge graph. Subsumes the standalone [LinkedIn update plan](linkedin-update.plan.md).

**Impact:** LinkedIn content is editorially consistent with all other views because it derives from the same source.

**Branch:** `feature/pkg-phase5-linkedin`

**Skill activations:** Read editorial-voice skill. Read editorial-guidance.md.

#### Task 5.1 -- Derive headline and About section

From ProfessionalIdentity + PositioningNarrative entities. Present to Jim for review.

**Acceptance criteria:**

- Copy-paste-ready headline and About section
- Editorially consistent with CV positioning
- Reviewed with Jim

**Reviewers:** Invoke **editor** (voice, register -- LinkedIn is its own context).

#### Task 5.2 -- Derive experience entries

From Role entities. Title, org, dates, description -- using the "framing is identity" descriptions from the graph.

**Acceptance criteria:**

- Every role Jim wants on LinkedIn has a copy-paste-ready entry
- Descriptions match graph role descriptions (same source)
- Reviewed with Jim

**Reviewers:** Invoke **editor** (framing, voice, LinkedIn-specific length considerations).

#### Task 5.3 -- Derive education, certifications, publications, skills

From Credential, Publication, and KNOWS_ABOUT entities.

**Acceptance criteria:**

- All sections copy-paste ready
- Document at `.agent/temp/linkedin-update-content.md`

**Reviewers:** Invoke **editor** (completeness, consistency).

#### Task 5.4 -- Resolve LinkedIn-specific editorial questions

Per the [LinkedIn plan](linkedin-update.plan.md): headline keywords, role grouping, description length, skills section strategy.

**Acceptance criteria:**

- Each question answered and recorded
- Decisions documented

**Reviewers:** Invoke **editor** (editorial decisions).

#### Phase 5 quality gates

- All LinkedIn content reviewed and approved by Jim
- Editorial consistency verified across CV, front page, structured data, and LinkedIn

---

## Documentation requirements

Throughout all phases:

- **TSDoc** on all exported functions, types, and schemas. Extensive examples on public interfaces (graph builder, closure algorithm, entity accessor functions).
- **READMEs** where appropriate -- at minimum, update `docs/architecture/README.md` Content and Metadata section, and update or create `docs/architecture/content-model.md`.
- **ADR** for entity model design (Task 1.5) ✅ ADR-014 created.
- **EDRs** for significant editorial decisions that emerge during Phase 2/4/5 content work.

## Files affected (summary)

### Created (Phases 1-4)

- `content/entities.json` -- JSON-LD `@graph` with ~50 entities at all abstraction levels
- `lib/entities.ts` -- Zod schemas (16 entity types), discriminated union, parse + export
- `lib/entities.unit.test.ts` -- 38 unit tests for individual schemas
- `lib/entities.integration.test.ts` -- 7 integration tests (full parse, referential integrity)
- `lib/subgraph.ts` -- subgraph closure algorithm (`extractSubgraph`, `findDanglingRefs`)
- `lib/subgraph.unit.test.ts` -- 10 unit tests for closure and dangling-ref detection
- `lib/page-jsonld.ts` -- page-specific JSON-LD subgraphs (`frontPageJsonLd`, `cvPageJsonLd`)
- `lib/jsonld.integration.test.ts` -- 7 integration tests for URL rewriting and graph validity
- `lib/rewrite-jsonld-urls.ts` -- shared URL rewriting with Zod re-validation
- `docs/architecture/decision-records/014-entity-model-design.md` -- ADR for entity model
- `lib/schema-org-check.ts` (planned) -- compile-time Schema.org vocabulary assertions

### Modified (Phases 3-4)

- `lib/jsonld.ts` -- rewired from 287-line builder to 30-line import + URL rewrite
- `lib/cv-content.ts` -- OG metadata now imports Person from entity model
- `app/manifest.ts` -- manifest name/description from Person entity
- `app/page.tsx` -- injects `frontPageJsonLd`
- `app/cv/page.tsx` -- injects `cvPageJsonLd`
- `app/cv/[variant]/page.tsx` -- injects `cvPageJsonLd`
- `components/page-section.tsx` -- `id` attribute added to `<section>` element
- `eslint.config.ts` -- tightened to enforce type-safety and test-discipline rules

### Pending

- `docs/architecture/README.md` -- update Content and Metadata section
- `.agent/temp/linkedin-update-content.md` -- Phase 5 LinkedIn content

## Related

- [Design reference](personal-knowledge-graph.plan.md) -- entity inventory, principles, Schema.org conventions (the WHY)
- [Implementation plan](personal-knowledge-graph-implementation.plan.md) -- phased tasks with acceptance criteria (the WHAT)
- [LinkedIn update plan](linkedin-update.plan.md) -- subsumed by Phase 5; retained for editorial questions
- [PKG research findings](research/pkg-research-findings.md) -- Schema.org, JSON-LD, Google structured data, Neo4j research
- [Neo4j future plan](future/neo4j-knowledge-graph.plan.md) -- shapes design decisions
- [ADR-007](../../docs/architecture/decision-records/007-dry-content-metadata.md) -- single-source approach
- [ADR-008](../../docs/architecture/decision-records/008-schema-org-compliance.md) -- Schema.org compliance
- [ADR-010](../../docs/architecture/decision-records/010-canonical-url-graph-identity.md) -- canonical URL and graph identity
- [ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md) -- domain-appropriate descriptions
- [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) -- entity model design
