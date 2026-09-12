---
name: Web Page Workspace and Boundary Enforcement
overview: Accepted final child. Decide generic web-page package status from real consumers, then audit accumulated dependency, proof, documentation, and deletion contracts across the observed workspace graph.
todos:
  - id: web-page-entry-gate
    content: Reassess generic web candidates against actual consumers created by earlier children.
    status: pending
  - id: web-page-contract-red-proof
    content: If the gate passes, write failing proof for the smallest Jim-free semantic page API.
    status: pending
  - id: web-page-disposition
    content: Extract packages/web-page or retain a statically enforced internal module, then delete the losing shape.
    status: pending
  - id: final-boundary-audit
    content: Audit accumulated dependency rules, recursive gates, CSS owners, private exclusion, and root/app command contracts.
    status: pending
  - id: programme-closeout
    content: Graduate decisions, disposition every hypothesis, remove transition residue, and close the parent.
    status: pending
isProject: true
---

# Web Page Workspace and Boundary Enforcement

## Status

**Accepted final child of the
[Workspace Architecture Roadmap](workspace-architecture-roadmap.plan.md); not
active and still conditional on real consumer evidence.**

“Generic component” remains the weakest package claim in the source estate.
This child runs last so actual app and CV consumers—not current folder names—
decide package status. Dependency enforcement is not postponed here: every
earlier child must add its own settled rules. This child audits and closes the
accumulated graph.

The current tree supplies useful negative and positive evidence. Site header
and footer identity atoms are injected rather than imported from Jim content,
but the chrome still has one meaningful app consumer and owns Next navigation,
route-aware MD/PDF controls, branding, and app-shell composition. The shared
`content-negotiation-path.ts` allowlist is explicit site-route policy, not
generic web-page machinery. These seams reduce coupling without yet passing the
package extraction gate.

## Outcome, impact, value mechanism, and proof

**Outcome:** generic semantic page primitives live in `packages/web-page` only
if real consumers pass the extraction gate; otherwise they remain a coherent
enforced internal module. The final dependency graph, CSS ownership, root
commands, proof, and durable docs match the observed tree.

**Impact:** the programme closes with proportionate physical boundaries and no
reliance on remembered migration context.

**Value mechanism:** real consumers shape the final generic API; static rules,
recursive proof, explicit negative dispositions, and deletion preserve both
created packages and deliberately internal modules.

**Proof:** every candidate has a final disposition; package tests use Jim-free
fixtures if extraction wins; dependency checks report zero forbidden imports;
root/app gates, required E2E/visual/PDF/graph proof, and durable docs agree.

## Entry conditions

- parent adopted and this child promoted
- Optional App Relocation, Visual Regression, Practice Validation, Graph, CV,
  and Jim Profile children are complete, rejected, Not Selected, or closed with
  explicit gate dispositions
- actual app/CV/Jim/graph/tool APIs and CSS owners are stable enough to reveal
  consumers
- Dev-Tooling Hygiene's settled static enforcement exists
- no unresolved duplicate source or transition bridge remains
- current root/application proof and live collaboration custody are re-checked
  at activation

## Candidate boundary

Reassess concepts, not former paths:

- semantic `PageSection` and `ArticleEntry`
- prose/rich-text rendering and inline markdown-link handling
- skip-link semantics
- theme provider/toggle mechanics
- generic alternate-representation link mechanics
- the smallest shared styling/token layer required by real consumers

Do not assume site header/footer/logo, download/PDF link, site configuration,
route contracts, app layouts, brand tokens, or CV composition are generic.

## Boundaries

### In scope

- evidence-based web-page PASS/FAIL disposition
- smallest public API and Jim-free proof if PASS
- enforced internal module and negative decision record if FAIL
- final audit—not first introduction—of dependency rules and recursive commands
- verification of CSS owners established by earlier children
- workspace architecture ADR and durable documentation
- family disposition, knowledge graduation, and archive preparation

### Out of scope

- inventing a design-system or component-library roadmap
- Storybook without a demonstrated requirement
- visual redesign, token refresh, editorial change, or new CV policy
- extracting one-file packages or artificial second consumers
- publishing packages, adding orchestration/caching, or changing deployment
- reopening settled graph/CV/Jim source models
- changing private editorial custody

## Tasks

### Task 1 — Re-run proportionality and the extraction gate

**Outcome:** each candidate has observed consumers, one reason to change,
dependency direction, configuration boundary, and proof cost.

**Impact:** package status reflects the final architecture rather than an
earlier component directory.

**Value mechanism:** consumer evidence prevents genericisation through prop
explosion or package ceremony.

**Acceptance criteria and proof:** a consumer table names real imports/use
cases; one-consumer candidates default internal; API sketches contain no Jim,
CV composition, routes, or brand policy; React/Next/dependency weight is
explicit; one combined PASS or FAIL is recorded before movement.

### Task 2 — Specify the smallest Jim-free contract

Run only after Task 1 records PASS.

**Outcome:** failing behavioural tests describe only the semantics shared by
real consumers.

**Impact:** extraction preserves accessibility/document meaning without
absorbing app composition.

**Value mechanism:** contract-first proof keeps the API small and exposes
framework coupling before movement.

**Acceptance criteria and proof:** fixtures/labels are non-Jim and non-CV;
heading, section, prose, link, skip, theme, and alternate-representation
semantics are covered only where shared; Next adapters stay separate where a
React primitive is sufficient; tests fail because public exports are absent.

### Task 3 — Extract or retain, then delete the losing shape

**Outcome:** candidates have exactly the physical boundary their evidence
warrants.

**Impact:** both reuse and non-reuse decisions remain legible and enforced.

**Value mechanism:** a named Internal Module/Rejected disposition prevents
future repetition of the same speculative extraction.

**Acceptance criteria and proof for PASS:** private manifest, explicit exports,
minimal dependencies, package tests/typecheck, and app/CV public-API consumers
pass; source contains no app/Jim/CV policy; old paths/re-exports are removed. If
this is the first passing extraction, `pnpm-workspace.yaml` is created with
explicit public patterns and root plus package discovery is proved in the same
slice.

**Acceptance criteria and proof for FAIL:** primitives remain or move to one
coherent internal domain; static rules enforce it; report/ADR record the losing
condition; no placeholder manifest/directory remains.

### Task 4 — Audit the accumulated architecture contracts

**Outcome:** workspace/internal dependency direction, CSS ownership,
root/application commands, private exclusion, and proof discovery are
mechanically complete.

**Impact:** earlier children cannot individually green while the combined
repository silently skips or violates a boundary.

**Value mechanism:** a whole-graph audit verifies integration while preserving
each child's responsibility for introducing its own rules.

**Acceptance criteria and proof:** graph/web leaves have no outward reach-back;
CV imports only approved inward packages; Jim profile imports graph/CV but not
app/tooling; application composes products; tooling imports no application;
private paths are excluded from all discovery; root gates reach every package
and explicit app typecheck; CSS/import order matches settled owners; full
dependency scan reports zero unexplained violations.

### Task 5 — Remove residue and close the programme

**Outcome:** only settled paths, APIs, commands, boundaries, and durable
documents remain.

**Impact:** future contributors encounter one truthful architecture.

**Value mechanism:** deletion and knowledge graduation turn a temporary
programme into ordinary maintainable structure.

**Acceptance criteria and proof:** no old alias, duplicate source, deprecated
wrapper, transition bridge, or stale docs remain; every hypothesis has Created,
Internal Module, Rejected, or Not Selected disposition; package/internal
READMEs and accepted ADR match the live tree; parent completion criteria pass;
roadmap/active index name the next authority.

## Final dependency matrix

Replace this hypothesis with observed PASS/FAIL results:

| Importer                     | May import                                           | Must not import                                  |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| application workspace        | approved product packages                            | private editorial source; tooling implementation |
| `jim-profile`                | `cv`, `professional-profile-graph`                   | application, tooling                             |
| `cv`                         | `web-page` if created                                | Jim profile, application, tooling                |
| `web-page`                   | React and explicit small dependencies                | CV, Jim profile, graph, application, tooling     |
| `professional-profile-graph` | Zod/Schema.org and explicit small dependencies       | CV, Jim profile, web page, application, tooling  |
| tooling                      | tool dependencies and serialisable repository config | application/product internals; private source    |

## Extraction-gate losing condition

`web-page` loses package status when it has one meaningful consumer, its API
is dominated by app/Jim configuration, Next coupling makes independent use
implausible, or package overhead exceeds the enforced boundary. Do not create a
second artificial consumer to force PASS.

## Test and proof strategy

- red package contract only after PASS
- synthetic package tests plus real app/CV integration
- dependency-cruiser and Knip whole-graph closure
- recursive TypeScript/unit/integration/root commands
- production build and sequential E2E
- accessibility, content integrity, graph publication completeness
- PDF generation/serving and visual review where affected
- explicit private-path exclusion rather than traversal

## Documentation obligations

- accepted workspace ADR with observed graph, app-location decision, extraction
  gate, dispositions, enforcement, and private-custody boundary
- root README/contributor command and workspace maps
- package or internal-domain READMEs
- architecture/content/graph/PDF/E2E/visual/deployment docs where changed
- dependency-rule documentation beside enforcement
- parent/roadmap reconciliation and archive only after graduation

## Completion handoff

Record final tree/dependency matrix, every hypothesis disposition, full gate and
product-proof evidence, durable-doc destinations, remaining friction/owner,
private-custody confirmation, and the next primary plan—or a truthful statement
that no workspace work remains.
