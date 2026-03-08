---
name: PKG Implementation Execution
overview: Operationalise the Personal Knowledge Graph implementation plan with explicit reviewer invocations, skill activations, TDD discipline, and quality gates at every step. Five phases from entity model design through LinkedIn as a derived view.
todos:
  - id: quality-gates
    content: "Automated gates pass on current tree (`pnpm check`, `pnpm test:e2e`)"
    status: completed
  - id: phase4-consistency
    content: "Phase 4: Cross-output consistency and framing review (comprehensive editorial pass)"
    status: completed
  - id: phase4-knows-about
    content: "Phase 4: Add 'Knowledge graphs' to knowsAbout with Wikidata link"
    status: completed
  - id: phase4-schema-dts
    content: "Phase 4: Add schema-dts compile-time Schema.org vocabulary validation"
    status: completed
  - id: phase4-final-gates
    content: "Phase 4: Final quality gates (Schema.org Validator, Rich Results Test, commit)"
    status: in_progress
  - id: phase3-regression-proof
    content: "Phase 3: Formal proof that PKG migration preserved visible site content"
    status: pending
  - id: historical-screenshots
    content: "Post-commit: capture full-page and sectional screenshots from the pre-PKG baseline commit"
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

### Current state (updated 2026-03-08, verified 2026-03-08 after latest refactor)

| Phase                       | Code status      | Gate status             | Key metric                                      |
| --------------------------- | ---------------- | ----------------------- | ----------------------------------------------- |
| 1. Entity model design      | ✅ Code complete | ✅ Automated gates pass | 17 Zod schemas, ADR-014                         |
| 2. Entity population        | ✅ Code complete | ✅ Automated gates pass | ~50 entities in `entities.json`                 |
| 3. View derivation          | ✅ Code complete | ✅ Automated gates pass | `lib/jsonld.ts` 287→30 lines + shared helper    |
| 4. New views and enrichment | ✅ Code complete | 🔄 Manual checks left   | 8/8 tasks code-complete; manual validators left |
| 5. LinkedIn as derived view | ⬜ Pending       | —                       | —                                               |

**132 vitest tests passing across 15 test files, and 46 Playwright E2E tests passing.** Historical PKG work was committed on `feature/pkg-phase1-entity-model` and merged locally into `main` on 2026-03-08. The Phase 4 follow-up was then committed on `main` as `83a16fa` (`feat: complete PKG phase 4 follow-up`). The current uncommitted layer is the later docs-consolidation pass requested immediately afterwards.

**Automated gates pass on the current tree.** `pnpm check` and `pnpm test:e2e` both passed on 2026-03-08 after completing Tasks 4.6-4.8 and after the later test-simplification refactor that moved schema-org allowlists into product code. Manual Schema.org Validator and Rich Results Test checks remain outstanding. Phase 3 pixel-identical regression check is still not formally verified.

**Dependency/tooling note:** the dependency refresh is complete. `eslint` is intentionally held at `9.x` because `eslint-config-next` is not yet compatible with `10.x` in this repo. ESLint now enforces the repo's policy against `as`, `!`, `vi.doMock`, and `vi.stubGlobal`.

### What to do next

1. **Run Phase 4 manual validation** — Schema.org Validator and Rich Results Test. Automated gates already pass on the current tree.
2. **Decide whether to formally verify the Phase 3 render-regression proof now** — snapshots exist, but the comparison has still not been run and recorded.
3. **Decide whether to commit the docs-consolidation pass before or after manual validation** — the worktree is currently dirty only because `/jc-consolidate-docs` was run after `83a16fa`.
4. **Capture historical screenshots from the pre-PKG baseline** — after the current worktree is committed, go back to the pre-PKG baseline commit in a safe way and capture screenshots of every part of every page for regression comparison.
5. **Phase 5** — LinkedIn as a derived view.

### Current worktree snapshot

At the start of the next session, expect the following uncommitted files unless Jim has committed or changed them:

- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`
- `.agent/memory/napkin.md`
- `.agent/plans/cv-editorial-improvements.plan.md`
- `.agent/plans/personal-knowledge-graph-execution.plan.md`
- `.agent/plans/personal-knowledge-graph-implementation.plan.md`
- `.agent/plans/personal-knowledge-graph.plan.md`
- `.agent/plans/roadmap.md`
- `AGENTS.md`
- `docs/architecture/README.md`
- `docs/architecture/content-model.md`

These changes correspond to:

- `/jc-consolidate-docs` follow-up after the Phase 4 commit
- permanent capture of the new testing and type-derivation preferences
- architecture and plan refresh so the next session starts from the current PKG state

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

## Proof status: content regression

This section is critical for any fresh agent continuing Phase 4.

### What is currently proven

- **Rendered content matches the current JSON source.** `e2e/behaviour/content-integrity.e2e-ui.test.ts` proves that the CV page renders experience entries, prior roles, capabilities, education, and the public-sector tilt from `content/cv.content.json`.
- **Core page-level behaviour still works.** `pnpm test:e2e` also covers navigation journeys, SEO tags, accessibility, graph API, markdown negotiation, and theming.
- **Structured-data output is internally consistent.** `lib/entities.integration.test.ts`, `lib/jsonld.integration.test.ts`, and `lib/schema-org-check.integration.test.ts` prove referential integrity, published-graph behaviour, and schema-org vocabulary constraints for the validated PKG types.
- **The full graph is richer than the old snapshot.** `lib/jsonld.integration.test.ts` asserts the current graph contains at least as many entities as the pre-migration snapshot.

### What is NOT currently proven

- **We do not have a formal proof that the PKG migration left visible website content unchanged relative to the pre-migration site.**
- There are pre-migration snapshots at `__snapshots__/cv-content-pre-migration.json` and `__snapshots__/jsonld-pre-migration.json`, but there is no automated or recorded comparison proving byte-identical, text-identical, or pixel-identical output after the migration.
- The current E2E content-integrity tests prove correctness against the current JSON source, not preservation against the historical pre-migration rendering.

### Practical implication

Do **not** claim “content unchanged” as a verified fact. The accurate statement is:

- visible content appears stable and current behaviour passes all automated tests
- but the historical regression proof remains incomplete until a before/after comparison is actually run and recorded

### Options to close this gap

1. **Rendered-text proof** — capture current rendered page text for `/`, `/cv`, and `/cv/public_sector`, normalise it, and compare with a trusted pre-migration capture.
2. **HTML proof** — compare rendered HTML or selected DOM sections before/after, allowing for expected structural differences such as JSON-LD block changes or harmless attribute ordering.
3. **Pixel proof** — run screenshot comparison for `/`, `/cv`, and `/cv/public_sector` against trusted pre-migration screenshots.

The original design/implementation intent called for pixel-identical or equivalent regression proof; that remains a pending validation task, not a completed one.

### Historical screenshot requirement (Jim instruction, 2026-03-08)

Once the current PKG follow-up work is committed, take screenshots of **every part of every page** from the point in git history **before PKG work started**.

- **Baseline commit:** `b76824a` (`docs: make Practice properly self-contained`) — this is the last commit before the PKG-related plan/doc commits (`a7e5ecd`, `b29dad9`) and before the PKG implementation commits (`4712590`, `0d6c112`).
- **Safety requirement:** do **not** rewrite history, reset branches, or risk the current worktree. Use a **separate git worktree** or a **detached checkout in another directory**, leaving the current `main` worktree untouched.
- **Scope:** capture the homepage (`/`), CV (`/cv`), public-sector variant (`/cv/public_sector`), and any other live pages required for a complete visual baseline. For each page, capture both the full page and the constituent sections so later comparison can be granular.
- **Purpose:** produce a trustworthy pre-PKG visual baseline so we can compare the current site against a point-in-time snapshot from before the entity-model migration began.
- **Do not perform this step until the current work is committed.**

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

**Note:** The historical branch-recovery problem has been resolved: Phase 1-4 PKG work was committed on `feature/pkg-phase1-entity-model` and merged locally into `main` on 2026-03-08. Jim explicitly asked to continue on `main`, which departs from the preferred branch strategy in `rules.md`. For future risky follow-on work, return to a feature branch where practical.

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

All 5 tasks code-complete. Design decisions resolved with Jim, entity schema defined in `lib/entities.ts` (17 Zod schemas, discriminated union), `content/entities.json` skeleton created as valid JSON-LD `@graph`, ADR-014 documents the entity model design. 38 unit tests + 8 integration tests.

**Key decisions recorded:**

- Model structure: Option A (layered content files)
- Expressive entities: `Statement` for positioning/tilts, `Intangible` + `additionalType` for abstract identity constructs
- Wikidata linking: all 35 `knowsAbout` items linked (24 linked so far)
- Google Scholar: not a goal (PKG links TO Scholar via `sameAs`)
- HTML binding depth: all three levels (section, entity, role anchors)

**Remaining:** Historical work already committed and merged locally into `main` on 2026-03-08.

---

### Phase 2 -- Entity Population (code complete, automated gates pass)

All 4 tasks completed. Entity model populated with ~50 entities across all abstraction levels.

**What was done:**

- Migrated all invisible constants (`KNOWS_ABOUT` 35 items with 24 Wikidata links, `OCCUPATION`, `CREDENTIAL_DETAILS`, `PUBLICATIONS`) from `lib/jsonld.ts` to `content/entities.json`. Fixed `inSupportOf` to use Text (Schema.org-compliant).
- Populated all concrete entities: Person (enriched with `honorificPrefix`, `pronouns`, `sameAs`), 7 Organisations (with URLs and Wikidata `sameAs`), 6 Credentials (3 degrees + 3 certifications), 3 Theses, 4 ScholarlyArticles, 2 SoftwareSourceCode, 2 CreativeWork projects, 1 WebAPI, 1 Occupation.
- Created 11 roles (EmployeeRole/OrganizationRole) with identity-framed descriptions. Historical titles preserved as `roleName`; descriptions express leadership and origination.
- Created abstract entities (ProfessionalIdentity, ResearchBackground, GroundedPractice as `Intangible` + `additionalType`) and expressive entities (PositioningNarrative + 3 TiltVariants as `Statement`, 5 Capabilities as `DefinedTerm`).

**PKG-reviewer findings addressed:** `isBasedOn` removed from DefinedTerm (not in domain), `makesOffer` removed from Organisation (expects Offer, not WebAPI), orphaned roles connected to Person, ArXiv publication retyped to ScholarlyArticle.

**Remaining:** Historical work already committed and merged locally into `main` on 2026-03-08. Role descriptions are not all explicitly confirmed by Jim.

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

**Remaining:** Historical work already committed and merged locally into `main` on 2026-03-08. Pixel-identical regression check not formally verified (snapshots exist in `__snapshots__/` but no comparison run). See **Proof status: content regression** above.

---

### Phase 4 -- New Views and Enrichment (CODE COMPLETE, MANUAL VALIDATION REMAINING)

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

Programmatic `@id` resolution check implemented in integration tests (`lib/entities.integration.test.ts` — dangling reference detection, `lib/jsonld.integration.test.ts` — subgraph self-containment). Automated gates pass on the current tree (`pnpm check`, `pnpm test:e2e`, both 2026-03-08). Manual Schema.org Validator and Rich Results Test remain outstanding.

#### Task 4.6 -- Cross-output consistency and framing review ✅ COMPLETE

Editor reviewer invoked for comprehensive editorial pass on `content/entities.json`. Two "Must Fix" issues identified and resolved:

1. **Ambiguous phrasing "support climate breakdown"** — Changed to "address climate breakdown, biodiversity loss, and social disconnection" in the Obaith EmployeeRole and CreativeWork entities.
2. **Inconsistent capability description register** — Five DefinedTerm/Capability descriptions now all use consistent gerund form ("Setting...", "Conceiving...", "Carrying...", "Shaping...", "Creating..."). Previously mixed past-tense fragments ("Conceived, prototyped, and delivered", "Helped shape") with gerunds.

Editor reviewer re-run completed after the follow-up collaborative-credit fix in `#cap-strategy-leadership` ("Helping shape..."). Verdict: **APPROVED**. Task 4.6 can be marked complete with no remaining blockers. Non-blocking "Consider" items remain for future editorial hardening only.

#### Task 4.7 -- Add "Knowledge graphs" to KNOWS_ABOUT ✅ COMPLETE

Added `Knowledge graphs` to `Person.knowsAbout` in `content/entities.json` with Wikidata `sameAs` link `https://www.wikidata.org/wiki/Q33002955`. Added integration coverage in `lib/entities.integration.test.ts` and `lib/jsonld.integration.test.ts` so the term is verified both in the entity model and in the published JSON-LD graph.

**Acceptance criteria:**

- Term present in entity model and published JSON-LD
- Wikidata `sameAs` link included

#### Task 4.8 -- Schema.org vocabulary validation with schema-dts ✅ COMPLETE

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
2. Create `lib/schema-org-check.ts` — compile-time validation that rebuilds key PKG entity types as fresh schema-dts literals (Person, Organization, EmployeeRole, ScholarlyArticle, DefinedTerm, Statement, Thesis, WebAPI), plus `Graph` checks for the full graph and page subgraphs
3. If `tsc --noEmit` passes (already a quality gate), Schema.org vocabulary is correct
4. Write a companion integration test that validates the exported graphs and asserts the product code reports no raw-source vocabulary violations for the validated types

##### Design decision: why schema-dts, not ajv + schemaorg-jsd

`ajv` + `schemaorg-jsd` (pre-1.0) would provide runtime Schema.org validation but duplicates Zod's role and adds dependency weight. schema-dts provides the same vocabulary correctness at compile time with zero runtime cost, zero bundle size, and backing from Google. The maturity gap (schemaorg-jsd v0.17.1 vs schema-dts v1.1.5) further favours schema-dts.

**Implemented:** `schema-dts` added as a devDependency. `lib/schema-org-check.ts` now validates the graph in two layers: fresh-literal schema-dts conversions for the core/high-value PKG entity types, and `Graph` assignability for the full graph and page subgraphs. The raw-source allowlist and derived type guard now live in product code as `as const` runtime data, and `lib/schema-org-check.integration.test.ts` simply asserts that the product code reports no vocabulary violations for the validated types.

**TDD note:** manual red-phase proof completed on 2026-03-08 by temporarily adding the historically problematic `isBasedOn` property to the `DefinedTerm` schema-dts bridge and verifying that `pnpm typecheck` failed with `Object literal may only specify known properties, and 'isBasedOn' does not exist in type 'DefinedTermLeaf'`. The temporary bad property was then removed and the tree returned to green.

**Testing/design follow-up applied:** Jim prefers as little definition as possible in tests, and prefers deriving types from runtime `as const` constants where possible. The schema-org allowlist and validated-entity-type definitions now live in product code (`lib/schema-org-check.ts`), and the integration test simply asserts that product code reports no vocabulary violations.

**Reviewers:** Invoke **type-reviewer** (type flow from schema-dts types through our Zod-derived types). Invoke **pkg-reviewer** (Schema.org correctness of the approach). Invoke **code-reviewer** as gateway.

#### Phase 4 quality gates (PARTIAL)

- ✅ `pnpm check` passes on the current tree (2026-03-08)
- ✅ `pnpm test:e2e` passes on the current tree (2026-03-08)
- Rendered content matches the current JSON source (`e2e/behaviour/content-integrity.e2e-ui.test.ts`)
- Historical content-preservation proof still pending (see **Proof status: content regression**)
- Every `@id` reference resolves (programmatic test — already in place)
- Schema.org Validator: no errors (manual, pre-deployment)
- Google Rich Results Test: ProfilePage and WebSite eligible (manual, post-deployment)
- ✅ schema-dts compile-time check passes (integrated into `tsc --noEmit`)
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
- `lib/entities.ts` -- Zod schemas (17 entity types), discriminated union, parse + export
- `lib/entities.unit.test.ts` -- 38 unit tests for individual schemas
- `lib/entities.integration.test.ts` -- 8 integration tests (full parse, referential integrity, `Knowledge graphs`)
- `lib/subgraph.ts` -- subgraph closure algorithm (`extractSubgraph`, `findDanglingRefs`)
- `lib/subgraph.unit.test.ts` -- 10 unit tests for closure and dangling-ref detection
- `lib/page-jsonld.ts` -- page-specific JSON-LD subgraphs (`frontPageJsonLd`, `cvPageJsonLd`)
- `lib/jsonld.integration.test.ts` -- 8 integration tests for URL rewriting, graph validity, and `Knowledge graphs`
- `lib/rewrite-jsonld-urls.ts` -- shared URL rewriting with Zod re-validation
- `docs/architecture/decision-records/014-entity-model-design.md` -- ADR for entity model
- `lib/schema-org-check.ts` -- compile-time Schema.org vocabulary assertions and raw-source vocabulary guard
- `lib/schema-org-check.integration.test.ts` -- 2 integration tests for schema-org compatibility behaviour

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
