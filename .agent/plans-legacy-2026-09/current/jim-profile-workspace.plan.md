---
name: Jim Profile Workspace
overview: Accepted product-adoption child. Establish a final configured Jim-profile facade, switch public consumers independently, adopt Track B's source model without duplication, then settle presentation ownership.
todos:
  - id: jim-profile-track-b-contract
    content: Reconcile completed Track B composition, binding, migration, and publication-completeness decisions into an executable ownership map.
    status: pending
  - id: jim-profile-final-facade
    content: Specify and introduce the final Jim-profile API over the current canonical sources without duplication.
    status: pending
  - id: jim-profile-consumer-cutovers
    content: Switch configured graph, shell/metadata, CV/home views, and emitted-channel consumers in bounded green slices.
    status: pending
  - id: jim-profile-package
    content: Move the proven configured facade and its one live public source into packages/jim-profile.
    status: pending
  - id: jim-profile-track-b-adoption
    content: Execute Track B's source migration order inside the package, deleting each old ownership as it moves.
    status: pending
  - id: jim-profile-presentation
    content: Settle generic, CV/print, Jim-theme, and app-shell CSS ownership in a separate rendering-risk slice.
    status: pending
  - id: jim-profile-proof
    content: Prove publication completeness, rendering, PDF, graph, metadata, markdown, dependencies, and deletion.
    status: pending
isProject: true
---

# Jim Profile Workspace

## Status

**Accepted product-adoption child of the
[Workspace Architecture Roadmap](workspace-architecture-roadmap.plan.md); not
active and still gated by Track B B2–B5.**

This is the only workspace child blocked on Track B B2–B5. It consumes the
adopted source, composition, binding, migration, and completeness design; it
does not invent replacements. It proceeds through final interfaces and bounded
consumer cutovers so every completed state remains deployable and pauseable.

ADR-020 establishes only a bounded current seam: Person name, email,
description, and profile URLs are graph-owned, and server/application
boundaries inject the required name and derived PDF filename into shared site
chrome. Page prose, selection, ordering, grouping, and complete composition are
still owned by the page content layer. This evidence reduces consumer coupling;
it does not complete Track B or prove a `jim-profile` package.

## Outcome, impact, value mechanism, and proof

**Outcome:** `packages/jim-profile` owns Jim's public facts, prose,
composition, site identity, brand/output configuration, and configured graph;
the application consumes final view/configuration APIs and passes those values
into the CV package's Jim-free interface. The CV package never imports
`jim-profile` or configured content.

**Impact:** public changes propagate predictably across HTML and
machine-readable outputs, while generic graph and CV packages contain no Jim
data or site policy.

**Value mechanism:** establish the final facade over the current single sources
first, switch consumers one at a time, then change storage behind that same API
according to Track B. This separates integration risk from source-model risk
without temporary public shims or duplicate live facts.

**Proof:** every public channel resolves from the configured owner; package and
app tests prove Track B identities/composition/completeness; old direct imports
and source ownership are deleted; rendering, accessibility, graph, metadata,
manifest, markdown, PDF, E2E, and visual proof pass.

## Entry conditions

- parent adopted and this child promoted
- graph and CV children are complete or explicitly dispositioned
- Track B B2–B5 and its executable adoption sequence are decision-complete
- tilt retirement is complete
- current facts/prose/composition, graph, HTML, metadata, manifest, markdown,
  PDF, accessibility, and visual baselines are green
- live collaboration and custody for public content, consumers, CSS,
  manifests, the lockfile, and package paths is re-checked for each promoted
  slice
- `jim-profile` extraction gate is recorded before its manifest is created

## Ownership boundary

### Package owns

- all public Jim facts and professional-profile entities
- all public Jim-authored prose used by the site/CV
- home and canonical CV composition: selection, order, grouping, labels, and
  page-specific narrative
- configured graph instance and stable public IDs
- site identity, public contact/profile links, brand/output configuration, and
  configured CV filename
- final view/configuration APIs supplying application composition adapters;
  those adapters pass explicit values into CV APIs

### Package does not own

- reusable graph algorithms or generic CV rendering rules
- Next routes, metadata protocol types, deployment APIs, or Vercel/PDF runtime
  orchestration
- generic web-page primitives
- a reverse `cv -> jim-profile` dependency; the application composes the
  Jim-profile outputs with the CV package
- private editorial material, access, history, or automated transfer

### Application retains

- Next routes/layouts and app shell assembly
- metadata/manifest/robots/sitemap/JSON-LD route integration
- accept-md and graph negotiation adapters
- Vercel Blob and production PDF orchestration
- public assets and E2E

## Target public source topology

Use Track B's adopted layers inside one cohesive graph:

```text
packages/jim-profile/content/graph/
  entities/
  prose/
  composition/
```

Every node has a stable ID and exactly one live owner. This topology must not
reproduce `cv.content.json` under a new name. Private editorial sources are not package inputs; only deliberate,
owner-approved public changes may enter the public source topology.

## Incremental migration invariant

- The final Jim-profile facade is intended architecture, not a compatibility
  wrapper, and remains after migration.
- Before source movement, all direct consumers switch to that API while the
  current sources remain the sole live owners.
- Track B's adoption sequence then moves bounded facts/prose/composition groups
  behind the same API. A field/node is removed from its old owner in the slice
  that introduces its new owner.
- No completed slice contains duplicate live facts, an old/new selection flag,
  or a branch-to-branch dependency.
- Every consumer/source slice closes green and can wait indefinitely.

## Boundaries

### In scope

- public Jim portions of all three current content JSON files
- configured portions of `entities`, `cv-content`, page-document contract,
  site/PDF config, header/footer/logo inputs, metadata, graph, and view models
- final Jim-profile API, package manifest/exports/tests/README, app adapters,
  consumer cutovers, Track B source adoption, and old ownership deletion
- a separately reviewed late CSS/presentation ownership slice

### Out of scope

- changing editorial claims or adding CV/home sections
- tilt variants or A/B testing
- generic graph/CV/web-page implementation
- moving Next/Vercel route code into the package
- CMS, graph database, or private-source sync
- copying private drafts, evidence, history, or working notes

## Tasks

### Task 1 — Convert Track B into an executable ownership map

**Outcome:** every current source field, consumer, configured seam, stable ID,
and published channel has one intended owner and a scheduled cutover slice.

**Impact:** implementation advances the adopted cohesive graph rather than
recreating today's split behind packages.

**Value mechanism:** explicit composition/binding/migration/completeness
ownership makes each cutover independently testable.

**Acceptance criteria and proof:** Track B/ADR sources are linked; old-to-final
mapping names selection/order/grouping, identities, DOM binding, channel
coverage, rollback, and proof; consumer and source cutovers are ordered; the
package gate has provisional PASS or closes Internal Module.

### Task 2 — Specify and introduce the final facade

**Outcome:** runtime/package-contract tests describe Jim's configured graph,
home/CV view models, site identity, and output configuration; one implementation
supplies them from current canonical sources.

**Impact:** consumers can decouple from file shapes before source-model change.

**Value mechanism:** the API remains final while internals evolve, isolating
consumer migration from Track B storage migration.

**Acceptance criteria and proof:** configured runtime parsing, stable refs,
view selection, and channel inputs have red then green tests; current sources
remain sole owners; facade contains no private access; no bridge-only export,
feature flag, or duplicate model is introduced.

### Task 3 — Switch consumers in bounded slices

Execute in this order unless the adopted Track B plan records a different
evidence-backed order: configured graph/identity; shell and metadata inputs;
canonical CV and home view models; remaining graph/JSON-LD/manifest/sitemap/
robots/markdown/PDF inputs.

**Outcome:** each consumer imports the final facade and its previous direct
content/config import is deleted in the same slice.

Here, consumers are application adapters and publication surfaces. The CV
package never imports `jim-profile`; the application passes facade-derived
values into the CV package's Jim-free API.

**Impact:** no later source change must coordinate every public channel at once.

**Value mechanism:** one bounded consumer plus its integration proof creates a
green, pauseable step while all consumers still see the same live facts.

**Acceptance criteria and proof:** each slice starts/ends green; direct imports
and duplicate mapping disappear; the consumer's narrow integration/E2E proof
passes; rendering-risk switches include visual proof; remaining unswitched
consumers are explicit current users, not deprecated paths.

### Task 4 — Extract `packages/jim-profile`

**Outcome:** the proven facade, configured current source owner, tests, and
dependencies have one package owner; app consumers use public workspace
exports.

**Impact:** Jim-specific public material gains independent custody before its
internal source model changes.

**Value mechanism:** a mechanical move of an already-adopted API separates
package/integration risk from Track B content migration.

**Acceptance criteria and proof:** private manifest, explicit exports, local
tests/type/lint/Knip, README, and `workspace:*` consumers pass; source contains
no Next route or private editorial access; old root implementations/content
paths move atomically and are removed. If this is the first passing extraction,
`pnpm-workspace.yaml` is created with explicit public patterns and root plus
package discovery is proved in the same slice.

### Task 5 — Adopt Track B behind the stable API

**Outcome:** package internals use Track B's facts/prose/composition topology
and old current file ownership is gone.

**Impact:** visible and machine-readable outputs resolve from one cohesive
public graph rather than parallel page and entity sources.

**Value mechanism:** Track B's ordered node/field moves preserve stable
consumers while deleting each displaced source immediately.

**Acceptance criteria and proof:** every migration slice follows the adopted
sequence; stable IDs/refs resolve; old fields/files are removed as ownership
moves; no fact/prose has two live owners; package tests plus affected channel
proof pass after every slice; final completeness model passes.

### Task 6 — Settle presentation ownership separately

**Outcome:** generic base, CV/print, Jim theme, configured pagination, and app
assembly styles have explicit owners and deterministic import order.

**Impact:** CSS no longer bypasses the dependency graph or hides identity
policy inside generic code.

**Value mechanism:** a separate rendering-risk review prevents source-model
success from masking visual regressions or an unjustified style package.

**Acceptance criteria and proof:** generic/CV styles contain no Jim/site policy;
Jim/app owns brand/configured pagination; app owns composition order;
accessibility, responsive E2E, PDF review, and blocking visual comparison show
no unexplained difference.

### Task 7 — Prove publication and delete old ownership

**Outcome:** `jim-profile` is the only configured public source owner and every
published channel/dependency/document reflects it.

**Impact:** the split remains truthful after migration context is forgotten.

**Value mechanism:** completeness proof, static rules, and deletion turn the
configured facade into durable architecture.

**Acceptance criteria and proof:** package/root gates; graph publication and
channel completeness; production build and sequential E2E; accessibility,
metadata, manifest, markdown, PDF and visual proof; inward dependency rules;
no old content, alias, bridge, or private source in build/test/lock traces.

## Extraction-gate decision

Expected PASS from independent public-content custody, configured graph proof,
many app consumers, and one coherent reason to change even with one deployed
site.

**Losing condition:** retain an enforced `domains/jim-profile` module if the
package becomes a bag of re-exports with no independent validation,
composition, custody, or proof value.

## Test and proof strategy

- facade/runtime tests before consumers or sources move
- package graph resolution/completeness integration tests
- one consumer-level integration/E2E proof per cutover
- one source-owner proof per Track B migration slice
- production home/CV/graph/metadata/manifest/markdown/PDF/a11y E2E
- blocking visual/PDF proof for rendering and presentation slices
- dependency, Knip, secrets/privacy, and private-path exclusion proof

## Documentation obligations

- package README with public source model, API, consumers, IDs, migration
  invariants, non-goals, dependencies, and tests
- content-model/graph/publication-completeness docs and ADR-014 reconciliation
- CSS, PDF, metadata, manifest, markdown, E2E, and deployment docs where changed
- workspace ADR observed Jim-profile and app integration boundary
- parent/roadmap and final-child handoff

## Completion handoff

Record final package exports, public source topology, consumer/source cutover
ledger, completeness/render/PDF proof, CSS owners, deleted paths, PASS/FAIL
disposition. If CV and Jim Profile are two consecutive failed product
candidates, stop and reassess the modular-monolith alternative under the parent
programme condition; record both dispositions in the parent and roadmap, and
do not promote another child. Otherwise recommend promotion of
[Web Page Workspace and Boundary Enforcement](web-page-workspace-and-boundary-enforcement.plan.md).
