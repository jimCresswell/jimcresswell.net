---
name: Visual Regression Workspace
overview: Active first child of Sequence R. Reassess the landed comparison-policy seam, extract the first pnpm child only if its gate passes, and preserve the visual harness contract.
todos:
  - id: visual-contract-baseline
    content: Record CLI, configuration, artefact, git/ref safety, and current comparison behaviour.
    status: completed
  - id: visual-config-red-proof
    content: Write failing proof for injected or serialised repository comparison configuration.
    status: completed
  - id: visual-config-inversion
    content: Remove the harness import from product source and supply repository-owned policy through the final configuration interface.
    status: completed
  - id: workspace-bootstrap
    content: If the extraction gate passes and no workspace file exists, add pnpm-workspace.yaml with explicit public application and tooling patterns.
    status: pending
  - id: visual-package-extraction
    content: Move the harness implementation, tests, CLI, and dependencies to tooling/visual-regression.
    status: pending
  - id: visual-root-integration
    content: Preserve the root command, add static boundary rules, run comparison proof, and remove the old path.
    status: pending
isProject: true
---

# Visual Regression Workspace

## Status

**In progress from 2026-08-10 as the first Sequence R child of the
[Workspace Architecture Roadmap](workspace-architecture-roadmap.plan.md).**

This is an explicitly activated parallel implementation lane. The Track B
Source-of-Truth Design remains the single primary plan in `active/`; this plan
stays in `current/` until the repo-wide primary focus changes.

Under Sequence R this child creates `pnpm-workspace.yaml` only if its extraction
gate passes and no earlier workspace exists. Under Sequence A it consumes the
workspace established by
[Optional App Relocation](../archive/optional-app-relocation.plan.md). It never moves the
application.

## Outcome, impact, value mechanism, and proof

**Outcome:** visual-regression implementation, tests, and CLI live in a private
tooling workspace; repository-owned route/section allowances reach it through
a final serialisable or injected configuration API.

**Impact:** visual proof can evolve without importing application internals,
and the first workspace boundary is proven without product-domain movement.

**Value mechanism:** dependency inversion separates generic capture/comparison
machinery from this site's expected routes while package-local dependencies and
tests make the tool independently understandable.

**Proof:** tool-local tests pass; root invocation is unchanged; `WORKTREE` and
git-ref safety remain proven; a current application comparison produces the
same expected summary/artefacts; no tooling import reaches app or product
source.

## Entry conditions

- parent adopted and Sequence R recorded
- Optional App Relocation is Not Selected
- current harness tests and one known comparison are recorded green
- the root application path is stable
- no workspace manifest or child package exists
- live source, manifest, lockfile, and collaboration custody is re-checked at
  activation rather than inherited from this plan

## Historical baseline and landed configuration seam

The 2026-08-10 baseline recorded the pre-extraction contract: a two-ref root
command, review-oriented content-difference semantics, non-destructive Git and
`WORKTREE` export, owned temporary builds, and comparison artefacts. Its
three-route, 50-artefact, 22-PNG, and 196-test counts are historical evidence,
not current acceptance thresholds.

PR #39 merged the independently useful configuration inversion. The current
tree now has these verified properties:

- the root command remains
  `pnpm visual-regression-harness <base-ref> <target-ref>`
- the repository policy captures only `/` and `/cv`, with route-specific
  regions and explicit expected-section allowances
- `visual-regression.config.ts` owns the site projection; harness code
  receives validated policy and imports no product source
- validation rejects unsafe path segments, off-origin routes, duplicate keys
  and paths, and reserved artefact-name collisions
- comparison guardrails keep semantic/content changes reviewable even when
  expected section IDs are added or removed
- integration tests cover filesystem/ref/config behaviour at the correct test
  altitude
- the post-PR #36 exact-base run reported zero differing pixels across the
  current home and canonical CV captures; five HTML-only differences were
  reviewed as intentional identity/content/retirement changes
- no `pnpm-workspace.yaml`, child manifest, dependency move, or source
  relocation exists

This is a merged seam and a green pause point, not extraction approval.

## Extraction-gate question

Reassess the required per-route
`allowances.targetOnlyExpectedSectionIds` field before treating the
configuration as an extracted package API. It accurately exposes today's
bounded behaviour, but its name is coupled to one comparison algorithm. Keep it
while there is one consumer; at extraction, compare the current explicit flag
with a small named-policy representation and retain whichever is clearer
without speculative generalisation.

## Merged checkpoint — 2026-08-12

The configuration inversion landed through PR #39 and is independently
reviewable, revertible, and in active use by the root command. PR #36 then used
that seam to prove the current canonical-only application tree without changing
the tooling boundary.

This checkpoint does not upgrade the extraction disposition from **Expected
PASS** to authorised movement. Before `pnpm-workspace.yaml` or a package
manifest is created, compare the current explicit
`targetOnlyExpectedSectionIds` flag with the smallest clearer named-policy
shape. Retain the root-internal tool if the final package needs app imports, a
configuration wrapper larger than its engine, or workspace-only path guessing.

## Ownership boundary

The workspace owns:

- git ref and `WORKTREE` export safety
- production snapshot orchestration
- capture, comparison, normalisation, diff, and artefact formats
- CLI parsing and validation
- a final input contract for repository comparison configuration

It does not own Jim's routes, page contracts, section IDs, expected content,
product source, private editorial paths, or the root policy deciding whether a
visual run is blocking.

## Boundaries

### In scope

- `visual-regression-harness/**` implementation and tests
- repository-owned route/region/expected-section/allowance configuration
- `tooling/visual-regression/package.json`, TypeScript/Vitest configuration,
  explicit exports, README, and dependencies
- `pnpm-workspace.yaml` when this is the first passing child
- canonical root command and static no-app-import rule

### Out of scope

- changing accepted product differences or normalisation semantics
- changing routes, sections, content, layout, or styling
- future capture reuse, caching, remote storage, or `--force` enhancements
- Practice validator movement
- logo/asset generation
- app relocation

## Tasks

### Task 1 — Record the final tool contract

**Outcome:** the CLI, config inputs, output artefacts, failure modes, git/ref
safety, and caller-worktree guarantees are explicit.

**Impact:** packaging cannot turn current root-relative assumptions into hidden
APIs.

**Value mechanism:** contract-first analysis distinguishes repository policy
from reusable engine behaviour before either moves.

**Acceptance criteria and proof:** current root command, options, exit
semantics, config values, output paths, mutation prohibitions, and one known
comparison result are recorded in executable tests or the tool README.

### Task 2 — Invert comparison configuration with red proof

**Outcome:** the harness accepts repository-owned route and expected-section
configuration without importing `lib/page-document-contract.ts`.

**Impact:** generic tooling can run and test without compiling application or
Jim-profile code.

**Value mechanism:** the intended final configuration interface removes the
only current product-source reach-back before package movement.

**Acceptance criteria and proof:** failing tests cover missing/invalid config;
the schema covers route keys, paths, regions, expected section IDs, and bounded
allowance policy; existing comparison behaviour is reproduced; no bridge-only
adapter or duplicate policy remains.

Tasks 3–5 below are one atomic extraction slice, not separate merge or pause
boundaries. Workspace discovery cannot be proved without the real package, and
the implementation cannot move until its canonical root command is cut over.

### Task 3 — Establish workspace discovery

**Outcome:** pnpm discovers the selected application location plus
`packages/*` and `tooling/*`, with the root package included under Sequence R.

**Impact:** later children can add packages without repeating substrate work.

**Value mechanism:** workspace configuration lands with its first real child,
so every new surface has an immediate owner and proof.

**Acceptance criteria and proof:** `pnpm-workspace.yaml` contains only explicit
public workspace patterns; the ignored private editorial boundary is outside
discovery; root
commands reach both app and tool deliberately; `workspace:*` is used only for
real local dependencies; no placeholder package exists.

### Task 4 — Extract `tooling/visual-regression`

**Outcome:** engine, CLI, tests, and dependencies have one workspace owner.

**Impact:** visual proof can change without widening app dependencies.

**Value mechanism:** package-local verification and dependency declarations
make the boundary executable.

**Acceptance criteria and proof:** private manifest, explicit exports,
TypeScript/test config, and local checks pass; `WORKTREE` and ref safety remain
proven; package dependencies exclude Next/React/app runtime unless executed as
an external system. The old implementation path is removed only as the Task 5
root cutover completes in the same atomic slice.

### Task 5 — Preserve root integration and enforce the boundary

**Outcome:** contributors use the same root command while static rules prevent
tooling-to-product reach-back.

**Impact:** the extraction adds no invocation friction and cannot silently
regress into app coupling.

**Value mechanism:** root ergonomics plus static enforcement preserve the
package value after migration context disappears.

**Acceptance criteria and proof:** root command and docs retain their interface;
tool-local and root gates pass; current comparison artefacts are reviewed;
Knip/dependency rules report no old entry point or forbidden import; the
ignored private editorial boundary remains excluded without traversal. This
task closes the atomic Tasks 3–5 slice; no intermediate workspace-only or
moved-but-unwired tree is a delivery point.

## Extraction-gate disposition

Expected PASS because the harness has independent lifecycle, proof, safety
contract, and dependency weight even with one principal human invocation.

**Losing condition:** retain an enforced root-internal tool if the extracted
workspace needs app imports, configuration wrappers larger than the engine, or
workspace-specific path guessing that the root module did not need.

## Test and proof order

Baseline; red configuration proof; configuration inversion; narrow tests;
workspace discovery proof; one mechanical move; tool-local gates; root command;
current comparison; root gates; production app proof if workspace resolution
changed build behaviour.

## Documentation obligations

- tool README with API, CLI, safety, dependencies, config owner, tests, and
  non-goals
- root README/contributor command map and workspace map
- ADR-016 reconciliation if configuration/loading changes its contract
- workspace architecture ADR initial observed decision
- parent/roadmap and next-child handoff

## Completion handoff

Record final configuration API, package exports/dependencies, root command,
comparison artefacts, static rules, substrate friction, gate disposition, and
recommendation to promote
[Practice Validation Workspace](practice-validation-workspace.plan.md).
