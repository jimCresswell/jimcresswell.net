---
name: Workspace Architecture Roadmap
overview: Accepted parent plan for incrementally adopting only the pnpm workspace boundaries that create independent ownership, proof, or lifecycle value, with reassessment at every child gate.
todos:
  - id: owner-agreement
    content: Jim accepted the full revised report and plan family, including its extraction gates, optional app-location branch, child sequence, and reassessment contract.
    status: completed
  - id: app-location-decision
    content: Jim selected Sequence R; the application remains the root workspace and Optional App Relocation is Not Selected.
    status: completed
  - id: visual-regression-workspace
    content: Reassess the landed visual-configuration seam, introduce pnpm-workspace.yaml only if extraction passes, and prove the root application unchanged.
    status: in_progress
  - id: practice-validation-workspace
    content: Extract Practice validators only after live validator, dependency, manifest, workspace, and lockfile custody is re-checked.
    status: pending
  - id: profile-graph-workspace
    content: Extract stable professional-profile schemas, parsing, and pure graph algorithms without freezing Track B composition.
    status: pending
  - id: cv-workspace
    content: Prove and extract a Jim-free CV contract after tilt retirement, with composition and output policy injected.
    status: pending
  - id: jim-profile-workspace
    content: Adopt the completed Track B model through final interfaces and bounded single-source consumer cutovers.
    status: pending
  - id: web-page-and-enforcement
    content: Extract only proven web-page primitives, audit accumulated boundary rules, document observed architecture, and close the family.
    status: pending
isProject: true
---

# Workspace Architecture Roadmap

## Status

**In progress. Accepted by Jim on 2026-08-10 after an incremental-delivery
challenge; Sequence R is selected and the Visual Regression Workspace is the
first active child.**

This plan governs workspace sequencing. Jim explicitly activated the Visual
Regression child as a bounded parallel implementation lane while the existing
[Source-of-Truth Design](../active/personal-knowledge-graph-source-of-truth-design.plan.md)
remains the single primary repo plan. If workspace architecture becomes the
repo-wide primary focus, move the relevant plan into `active/` and reconcile
the active index; do not use a second file there merely to represent parallel
work.

## Reassessment contract

Acceptance records the best current direction; it does not freeze the target
topology or turn package candidates into commitments. At every child entry gate
and extraction gate, re-check the live source boundaries, consumers,
dependencies, active plans, vendor constraints, and available proof. New
evidence can revise the sequence, alter a boundary, retain an internal module,
or close a child as Not Selected or Rejected.

Any material reassessment updates this parent, the affected child, the context
report, and the repo roadmap in the same pass. No slice continues merely
because the family was accepted. Sequence R is the recorded app-location
decision. Reopening Sequence A requires new evidence and an explicit owner
decision before the first package move.

Read the evidence and concept-exploration record in
[workspace-architecture-context.md](../research/workspace-architecture-context.md)
before changing this family. It separates observations, changed assumptions,
candidate models, losing conditions, and unresolved evidence.

## Landed-seam reassessment — 2026-08-12

The accepted topology has been re-tested against the merged configuration seam
and the current application tree:

1. **Observed:** PR #39 landed the validated visual-regression configuration
   boundary without a workspace manifest, package manifest, dependency move, or
   source relocation.
2. **Observed:** PR #36 retired the audience-tilt surface and established
   bounded graph-owned identity atoms at application composition boundaries.
   Those changes clarify later CV, graph, Jim-profile, and web-page gates but do
   not prove any package extraction.
3. **Decision:** keep the root application, retain Sequence R, and leave
   workspace discovery unopened until the Visual Regression child re-runs its
   extraction gate against the live two-route harness and current dependencies.
4. **Delivery boundary:** the plan family is independently useful now. It
   authorises reassessment and sequencing, not package movement.

The configuration seam is a landed partial slice. The Visual Regression child
and the wider workspace programme remain incomplete.

### Family disposition ledger

| Child                             | Live disposition                                                           | Next authority                                                           |
| --------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Optional App Relocation           | Not Selected under Sequence R                                              | Reopen only by explicit owner decision before the first package move     |
| Visual Regression                 | In progress; contract and configuration seam complete, extraction unopened | Re-run the extraction gate and resolve the allowance-policy API question |
| Practice Validation               | Accepted, pending                                                          | Promote only after Visual disposition and a fresh live custody check     |
| Professional Profile Graph        | Accepted, pending                                                          | Promote only after earlier tooling dispositions and stable-core proof    |
| CV                                | Accepted, pending                                                          | Promote only after tilt retirement and a synthetic Jim-free contract     |
| Jim Profile                       | Accepted, pending and Track B-gated                                        | Consume Track B B2–B5 decisions; do not invent them here                 |
| Web Page and Boundary Enforcement | Accepted, pending and conditional                                          | Run last against real consumers; internal module remains a valid outcome |

## Outcome, impact, value mechanism, and proof

**Outcome:** a proportionate pnpm workspace architecture in which application
integration, professional-profile graph logic, CV logic, Jim-specific public
material, and repository tooling have only the physical boundaries their
independent ownership and proof justify.

**Impact:** maintainers and agents can change one coherent responsibility
without coordinating unrelated work, freezing unsettled domain decisions, or
depending on a narrow landing window.

**Value mechanism:** final typed interfaces remove reach-back first; package
manifests, explicit dependencies, local tests, and accumulated static rules
then enforce only proven seams. Every completed slice is green, revertible, and
safe to leave unchanged indefinitely.

**Proof:** each promoted child closes with its extraction disposition, local
contract proof, root integration proof, and relevant production/visual proof.
The final tree has one source for every fact, no bridge-only compatibility
layer, no forbidden imports, and no dependency on material behind the private
editorial boundary.

## Problem frame

The repository has one deployable but five responsibility classes:

1. generic web-page machinery
2. professional-profile graph machinery
3. CV-domain machinery
4. Jim-specific public facts, prose, composition, and brand policy
5. tooling and private custody

The present folder layout lets these classes reach through one another.
Several important files combine reusable declarations with Jim's configured
instance. The earlier plan correctly identified those seams but incorrectly
made a whole-app relocation the prerequisite for every extraction.

The programme must therefore create independently understandable and testable
boundaries without requiring a seven-package quota, a multi-branch cutover, or
a broad app move that has no owner-valued outcome of its own.

## Accepted decisions

Jim accepted these points on 2026-08-10:

1. Use native pnpm workspaces; do not add Turborepo, Nx, or Lerna now.
2. Keep every workspace private and unpublished initially.
3. Keep the ignored private editorial boundary outside workspace, build, test,
   packaging, dependency, and automated-sync surfaces permanently.
4. Treat every package path as a hypothesis. A failed extraction gate retains
   an enforced internal module and counts as a successful disposition.
5. Use seam first, package second: no source movement until the intended final
   interface is proven without Jim/app reach-back.
6. Keep the application at the repository root by default. Select the optional
   early `apps/www` relocation only if a pure orchestration root is itself a
   desired outcome worth one coordinated pause.
7. Promote one child plan at a time. Manifest and lockfile edits are always
   serial even where source responsibilities are independent.
8. The first child whose extraction gate passes creates and proves
   `pnpm-workspace.yaml` if it does not yet exist. A failed earlier child leaves
   no placeholder substrate and cannot block later independent candidates.

## Two explicit execution sequences

Sequence R was selected on 2026-08-10. Sequence A remains a documented
alternative, not an open implementation branch.

### Sequence R — root application, recommended

```text
visual-regression → practice-validation → professional-profile-graph
                  → cv → jim-profile → web-page/final closeout
```

The first child whose extraction gate passes introduces `pnpm-workspace.yaml`
with that real child package. Visual Regression gets the first opportunity but
does not own a prerequisite for later independent candidates. pnpm includes the
root package even when custom workspace patterns exist; no empty foundation or
app move is required.

### Sequence A — clean orchestration root

```text
optional app relocation → Sequence R
```

This sequence is valid only after Jim selects the clean-root outcome. The
relocation is one mechanical pause before semantic extraction, not evidence
that pnpm required it.

## Default target hypothesis

```text
./                                  # @jimcresswell/www app workspace
packages/
  web-page/                         # conditional
  professional-profile-graph/
  cv/
  jim-profile/
tooling/
  visual-regression/
  practice-validation/
```

If Sequence A wins, only the application location changes to `apps/www` and
the root manifest becomes orchestration-only.

Intended dependency direction:

```text
professional-profile-graph      web-page
             ^                     ^
             |                     |
             +--- jim-profile ---> cv
                       ^            ^
                       |            |
                       +--- application
```

Tooling is root-invoked and must not import application source. Product
packages must not import tooling. The application may compose all approved
product packages.

## Incremental delivery contract

Every implementation slice must satisfy all of these conditions:

1. begin from recorded green inherited proof and end independently green
2. introduce one final interface or move one responsibility already proven
   behind that interface
3. switch a bounded consumer atomically and remove its old path in the same
   slice
4. retain exactly one source of truth throughout the completed state
5. avoid path aliases, re-export shims, duplicated content, or branch-to-branch
   dependencies
6. include local contract proof and the smallest consumer integration proof
7. be revertible without reverting another completed child
8. remain safe if no later child starts for an indefinite period

A final interface may land while the current source still backs it when that
interface remains the settled end-state API. That is dependency inversion,
not a backwards-compatibility layer. Bridge-only APIs with deletion deadlines
are prohibited.

## Extraction gate

Before a child creates a product workspace, record PASS or FAIL for:

| Criterion                   | Required proof                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Coherent responsibility     | one stated reason to change and a bounded public API                                      |
| Boundary value              | two meaningful consumers, or independent custody, proof, lifecycle, or dependency value   |
| Inward dependencies         | dependency graph and static rule show no app/Jim reach-back                               |
| Configuration purity        | generic and CV packages contain no Jim literals, content imports, routes, or brand policy |
| Independent proof           | package contract runs without starting Next.js                                            |
| Operational proportionality | package setup removes more ambiguity than it adds                                         |
| Migration closure           | final API, atomic consumer switch, one source, and no bridge-only shim                    |

**Per-package losing condition:** a one-consumer package whose API is mainly
Jim/site configuration stays internal.

**Programme stop condition:** after two consecutive product candidates fail,
stop promotion and reassess the modular-monolith alternative before more
movement.

## Boundaries

### In scope

- optional, explicitly selected relocation of the single deployable
- workspace configuration introduced with the first real package
- visual-regression and Practice-validation tooling as separate children
- stable graph and CV seams that do not invent Track B decisions
- Jim-profile adoption after Track B through bounded single-source cutovers
- conditional generic web-page extraction
- package-local TypeScript, tests, dependency declarations, and documentation
- incremental dependency enforcement and final architecture audit
- app E2E and visual/PDF proof where behaviour could change

### Out of scope

- changing public copy, editorial positioning, or CV facts
- reintroducing CV tilts or A/B testing
- completing Track B design on behalf of its active plan
- Neo4j or another graph database
- publishing packages or adding another deployable
- remote caching or a second task orchestrator without measured need
- synchronising across the private editorial boundary
- a generic asset-generation package without a second consumer
- opportunistic dependency upgrades outside Dev-Tooling Hygiene
- temporary compatibility packages, duplicate content, or old-path shims

## Build-versus-buy decision

Native pnpm workspaces already provide local package discovery, one lockfile,
recursive commands, and the `workspace:*` resolution guarantee. Next.js can
transpile named local packages when required. See the official
[pnpm workspace settings](https://pnpm.io/settings#packages),
[workspace protocol](https://pnpm.io/workspaces#workspace-protocol-workspace),
and [Next.js local-package transpilation](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages).
No current evidence justifies a second orchestration product.

Do not revisit task orchestration unless measured repeated work, another
deployable, or a named remote-cache outcome changes that decision. Record any
future reconsideration separately with its measurements.

## Reconciliation boundaries

### Track B

Track B owns facts/prose/composition semantics, view selection, DOM binding,
adoption, and publication completeness. It gates the Jim Profile child and any
composition API. It does not gate stable graph schemas, parsers, subgraph and
URL algorithms, or a Jim-free CV renderer that accepts composition as input.

### Tilt retirement

ADR-021 has retired `/cv/[variant]`, `HeadlineToggle`, tilt content, and the
obsolete canonical-alias policy. The CV child may now enter its own gate, but no
new package contract may encode the retired behaviour.

### Dev-Tooling Hygiene and peer work

Dev-Tooling Hygiene retains the six parked major migrations and
`dependency-cruiser` ownership. Its security-coherent dependency tranche has
landed. The workspace family:

- re-checks live validator and manifest custody before the Practice Validation child
- serialises package-manifest and lockfile changes
- adds or updates settled dependency rules in every relevant child
- uses the final child to audit accumulated rules, not introduce enforcement
  for the first time

## Plan family

| Child plan                                                                                         | Role                                                               | Promotion gate                                                      |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| [Optional App Relocation](../archive/optional-app-relocation.plan.md)                              | one selected clean-root bootstrap, otherwise explicit Not Selected | Sequence A selected; overlapping app/config work settled            |
| [Visual Regression Workspace](visual-regression-workspace.plan.md)                                 | landed config inversion; first extraction-gate attempt             | app-location decision recorded; current visual proof green          |
| [Practice Validation Workspace](practice-validation-workspace.plan.md)                             | independent Practice validator package                             | live validator and Dev-Tooling lockfile ownership reconciled        |
| [Professional Profile Graph Workspace](professional-profile-graph-workspace.plan.md)               | stable schemas, parsing, algorithms, and configured adapter        | stable-core gate passes; no unsettled composition API enters        |
| [CV Workspace](cv-workspace.plan.md)                                                               | Jim-free CV model and renderer                                     | tilt retirement complete; synthetic contract passes extraction gate |
| [Jim Profile Workspace](jim-profile-workspace.plan.md)                                             | public Jim source, composition, configuration, and app adoption    | Track B B2–B5 and adoption design complete; graph/CV APIs stable    |
| [Web Page Workspace and Boundary Enforcement](web-page-workspace-and-boundary-enforcement.plan.md) | conditional generic UI plus final programme audit                  | earlier children dispositioned; real consumer evidence available    |

Each child is standalone and can be activated without chat history. The parent
owns sequence, state dependencies, owner decisions, and programme completion.

## Programme phases

### Phase 0 — Ratify the family and select the app location

**Outcome:** Jim has adopted the family and selected Sequence R or Sequence A.

**Impact:** implementation starts from an explicit topology value rather than
treating file movement as inevitable substrate.

**Value mechanism:** one owner decision eliminates both an unnecessary move
and a later path reversal.

**Acceptance criteria and proof:** owner disposition, selected sequence, child
links, roadmap status, and the single primary active plan agree.

**Completion record:** Jim accepted the family and selected Sequence R on
2026-08-10. Optional App Relocation is Not Selected; Visual Regression is the
first active child; Track B remains the single primary repo plan.

### Phase 1 — Run the optional relocation or record Not Selected

Owned by [Optional App Relocation](../archive/optional-app-relocation.plan.md).

**Outcome:** Sequence A has one proven `apps/www` deployable, or Sequence R has
an explicit Not Selected disposition and unchanged root application.

**Impact:** every later child works against a stable application location.

**Value mechanism:** the broad move, if valued, is paid once before package
paths accumulate; otherwise its risk disappears from the programme.

**Acceptance criteria and proof:** the child records Complete or Not Selected.
If run, production build, E2E, PDF, alternate-representation, deployment, and
visual proof preserve behaviour.

### Phase 2 — Run the visual-tooling extraction gate

Owned by [Visual Regression Workspace](visual-regression-workspace.plan.md).

**Outcome:** visual policy remains injected; if the extraction gate passes,
`pnpm-workspace.yaml` discovers the app and first real tool package and the root
command retains its interface. If it fails, the enforced internal tool remains
green and no placeholder workspace is created.

**Impact:** workspace mechanics and a strong independent boundary are proven
without moving product semantics.

**Value mechanism:** the first package pays the substrate cost and supplies a
real consumer of it; no placeholder workspace is created.

**Acceptance criteria and proof:** tool-local tests, root invocation, current
comparison artefacts, root type/test discovery, and production app proof pass.

### Phase 3 — Extract Practice validation independently

Owned by [Practice Validation Workspace](practice-validation-workspace.plan.md).

**Outcome:** validator implementations have one package owner while canonical
root commands and governed Practice documents retain their responsibilities.

**Impact:** Practice changes no longer widen product TypeScript or dependency
surfaces.

**Value mechanism:** independent tests and dependencies isolate repository
governance without coupling it to the app.

**Acceptance criteria and proof:** every validator retains arguments, exit
semantics, inspected roots, and blocking/informational posture through both
package-local and root proof.

### Phase 4 — Extract stable graph machinery

Owned by
[Professional Profile Graph Workspace](professional-profile-graph-workspace.plan.md).

**Outcome:** stable schemas, parsing, lookup, subgraph, rewriting, and bounded
validation accept supplied data and configuration; Jim's instance stays with
its configured owner.

**Impact:** graph machinery becomes independently testable without freezing
Track B composition or visible-rendering decisions.

**Value mechanism:** a final value/factory API removes singleton reach-back and
supports current app consumers plus later Jim-profile adoption.

**Acceptance criteria and proof:** synthetic package proof and current graph,
JSON-LD, metadata, manifest, and API integration remain green.

### Phase 5 — Extract a Jim-free CV boundary

Owned by [CV Workspace](cv-workspace.plan.md).

**Outcome:** a synthetic non-Jim CV and the current app use one injected CV
model/renderer contract with no site identity or route policy.

**Impact:** renderer and CV semantics can change without editing Jim's content.

**Value mechanism:** final composition and output inputs make reuse real while
leaving Track B's Jim-specific selection model unfrozen.

**Acceptance criteria and proof:** the CV gate passes or records Internal
Module; app integration, accessibility, E2E, PDF, and visual proof are green.

### Phase 6 — Adopt Jim-profile through bounded cutovers

Owned by [Jim Profile Workspace](jim-profile-workspace.plan.md).

**Outcome:** Track B facts, prose, composition, identity, and output policy
have one configured owner supplying each public channel through final APIs.

**Impact:** public material changes propagate predictably without a parallel
page-JSON and entity-graph ownership split.

**Value mechanism:** consumers switch one at a time behind settled interfaces;
every completed state has one source and can pause indefinitely.

**Acceptance criteria and proof:** all configured channels use the intended
owner; old sources are deleted as their final consumer switches; completeness,
rendering, graph, metadata, markdown, PDF, E2E, and visual proof pass.

### Phase 7 — Decide web-page status and close the programme

Owned by
[Web Page Workspace and Boundary Enforcement](web-page-workspace-and-boundary-enforcement.plan.md).

**Outcome:** generic primitives are packaged only if real consumers justify
them; all observed package/internal boundaries, CSS ownership, root commands,
and durable documents agree.

**Impact:** the final architecture is proportionate, enforced, and legible
without a remembered migration narrative.

**Value mechanism:** final evidence decides the weakest abstraction claim;
static rules and deletion preserve every winning boundary.

**Acceptance criteria and proof:** every candidate has Created, Internal
Module, Rejected, or Not Selected disposition; forbidden imports are zero;
recursive gates and required product proof are green; durable docs record the
observed tree.

## Re-grounding checkpoints

At the start and end of every promoted child:

1. re-read the active plan, roadmap, this parent, and the child
2. inspect Git, collaboration state, and current source custody
3. verify current Track B, tilt, and Dev-Tooling status from live files
4. record inherited proof once through the agreed gate runner
5. re-evaluate the child gate and the incremental delivery contract
6. update static rules for the boundary moved in that child
7. reconcile child, parent, roadmap, durable-doc obligations, and next authority

If a prerequisite or consumer graph has changed, re-plan the affected child.
Do not preserve stale sequence merely because the parent predicted it.

## Test and proof strategy

- Write failing behavioural proof before each interface or ownership change.
- Co-locate package unit/integration tests with the package contract.
- Keep cross-package integration tests with the consumer that owns behaviour.
- Keep production-build Playwright E2E with the application workspace.
- Run `pnpm check` and `pnpm test:e2e` sequentially.
- Use the visual harness during every rendering-risk slice.
- Make recursive typecheck explicit because Next ignores build type errors.
- A green package test never substitutes for app integration; a green Next
  build never substitutes for package type proof.

## Friction ratchet and rollback

Pause the current child and reconsider its shape after three structural
friction signals such as a dependency cycle, required policy exception,
persistent deployment workaround, reviewer-requested API expansion, or package
wrapper larger than its implementation.

- No old-path aliases, re-export bridges, or duplicate sources.
- No check weakening, new exclusions, or cwd guessing.
- Every child ends independently green and has a scoped revert.
- Roll back the child rather than leave a half-created package.
- A failed package gate collapses the concern into an enforced internal module.

## Documentation obligations

After adoption and as each boundary settles:

- record an ADR for the observed workspace architecture, dependency direction,
  extraction gate, app-location decision, and private-custody exclusion
- update root README/contributor commands when the first workspace lands
- add a README to every created workspace naming responsibility, API,
  consumers, non-goals, dependencies, and proof
- update deployment, PDF, E2E, visual, content-model, graph, and CSS docs in the
  child that changes those surfaces
- keep permanent docs free of dependency on this temporary plan estate
- archive only after durable knowledge is graduated

## Risks and mitigations

| Risk                                      | Mitigation and proof                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| package ceremony exceeds value            | extraction gate and modular-monolith losing outcome                     |
| root/app move is treated as inevitable    | explicit Sequence R/A owner decision and optional child                 |
| Track B contract freezes too early        | stable-core scope; Jim-profile adoption alone waits for B2–B5           |
| package work overlaps peer/lockfile edits | one promoted child and one manifest/lockfile owner at a time            |
| pause creates a half-migration            | final interfaces, atomic consumers, one source, green end states        |
| CSS changes hide architectural drift      | late bounded task with accessibility, responsive, PDF, and visual proof |
| generic package imports Jim/app policy    | synthetic fixtures, literal/import scans, and dependency rules          |
| private material enters automation        | permanent explicit exclusion from all public discovery/glob surfaces    |

## Disposition ledger

| Finding from the report                          | Revised disposition                                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| three requested classes were insufficient        | five responsibility classes remain                                     |
| seven packages may overfit a small site          | every candidate can remain an internal module                          |
| root package is always a workspace member        | first passing child creates substrate; root app is recommended default |
| a clean orchestration root may still have value  | optional early relocation with its own losing condition                |
| tooling candidates have different lifecycles     | separate Visual Regression and Practice Validation children            |
| Track B is incomplete                            | only Jim composition/adoption waits; stable graph/CV seams may proceed |
| tilt retirement is complete                      | CV may enter its synthetic gate; no package API preserves tilt policy  |
| graph schema and Jim instance are mixed          | value/factory API first, then stable-core move                         |
| CV renderer imports Jim/site policy              | final injected composition and output contract first                   |
| Jim migration spans many channels                | bounded consumer cutovers behind final APIs, never duplicate sources   |
| CSS combines owners                              | late explicit task, separate from source-model cutover                 |
| harness imports product source                   | visual config inversion precedes package movement                      |
| dependency-cruiser has another owner             | every child extends settled rules; final child audits                  |
| private editorial material has different custody | permanently excluded from workspace and build graphs                   |

## Completion criteria

This parent is complete only when:

- Jim's adoption and app-location decisions are recorded
- every child is Complete, Not Selected, Rejected, or closed with a gate FAIL
- the final workspace graph is documented as observed truth
- every dependency is explicit and statically enforced
- root commands prove each workspace and production application behaviour
- no old alias, duplicate source, or bridge-only API remains
- private editorial custody remains outside public source and automation
- durable ADRs and architecture docs contain the settled decisions
- roadmap and active index identify the next real authority

## Current executable slice

Sequence R is recorded. The current child is
[Visual Regression Workspace](visual-regression-workspace.plan.md). Its
configuration boundary is merged and used by the root application: repository
policy is supplied through a validated configuration interface and no harness
module imports product source. No workspace manifest or child package exists.

The next slice begins with a fresh extraction-gate decision. If the gate still
passes, introduce workspace discovery and move the visual tool as one separate,
reversible change. If it fails, retain the landed seam and record an enforced
root-internal tooling boundary.
