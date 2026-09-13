---
name: Practice Validation Workspace
overview: Accepted independent tooling child. Move Practice validator implementations and tests into one private workspace without changing governed documents, root commands, or exit semantics.
todos:
  - id: practice-validator-custody
    content: Re-check live validator, dependency, manifest, workspace, and lockfile custody before movement.
    status: pending
  - id: practice-contract-baseline
    content: Record every validator's arguments, inspected roots, output, exit semantics, and blocking posture.
    status: pending
  - id: practice-entry-red-proof
    content: Write failing proof for the package CLIs and stable root command mapping.
    status: pending
  - id: practice-package-extraction
    content: Move validator implementations, helpers, fixtures, and tests to tooling/practice-validation.
    status: pending
  - id: practice-root-integration
    content: Rewire canonical root commands, enforce boundaries, prove parity, and remove old implementations.
    status: pending
isProject: true
---

# Practice Validation Workspace

## Status

**Accepted independent child of the
[Workspace Architecture Roadmap](workspace-architecture-roadmap.plan.md); not
active pending its entry conditions and explicit promotion.**

This child is deliberately separate from visual regression. Its custody gate
is live rather than inherited: it must not start while another seat owns
validator files, dependency refresh, root manifests, workspace configuration,
or the lockfile, but no such ownership is assumed merely because an earlier
review observed it.

## Outcome, impact, value mechanism, and proof

**Outcome:** portability, subagent, vital-surface, fitness, and vocabulary
validator implementations live in `tooling/practice-validation`; canonical
root commands and governed Practice documents retain their existing roles.

**Impact:** repository governance can change and test independently of the
Next application and product TypeScript surface.

**Value mechanism:** one tool package owns validator algorithms, helpers,
fixtures, dependencies, and local proof while root wrappers preserve familiar
commands and repository-root inspection.

**Proof:** each validator passes package-local tests and root invocation with
unchanged arguments, diagnostics, exit codes, informational/blocking modes,
and inspected repository paths; no governed Practice document moves.

## Entry conditions

- parent adopted and this child promoted
- Visual Regression child is complete or explicitly dispositioned
- live validator changes and ownership are reconciled
- the six parked major migrations, dependency-cruiser work, and live lockfile
  ownership in Dev-Tooling Hygiene are reconciled
- current validator unit/integration tests and canonical root commands are
  recorded green
- live collaboration and source custody for `scripts/validate-*`, manifests,
  the lockfile, and workspace configuration is re-checked at activation

## Ownership boundary

The workspace owns validation algorithms, helpers, fixtures, tests, and CLIs.
The repository root owns canonical command names and blocking posture. The
canonical Practice estate owns the documents being validated.

The workspace must inspect a supplied repository root deliberately. It must
not infer product ownership from its own package directory or import app code.

## Boundaries

### In scope

- `scripts/validate-*.mjs` implementations, helpers, fixtures, and tests
- `tooling/practice-validation` manifest, exports, TypeScript/Vitest config,
  dependencies, and README
- root command wrappers and Knip/dependency entry points
- static no-product-import and explicit-repository-root rules

### Out of scope

- changing validator semantics to ease movement
- editing governed Practice content to make validation pass
- changing which checks are blocking or informational
- product, visual-harness, logo, or app refactors
- changing cross-platform authorisation policy

## Tasks

### Task 1 — Reconcile custody and record contracts

**Outcome:** every validator has one current implementation owner and a recorded
input/output/failure contract before source moves.

**Impact:** extraction cannot overwrite peer work or silently alter governance.

**Value mechanism:** live custody plus behavioural baselines make parity
testable rather than inferred from filenames.

**Acceptance criteria and proof:** Git/ARC state is clear; all peer changes are
accounted for; each validator's arguments, inspected roots, output form, exit
semantics, blocking posture, and current tests are inventoried.

### Task 2 — Specify package CLIs and root mapping with red proof

**Outcome:** tests describe final package entry points and canonical root
wrappers before movement.

**Impact:** root ergonomics and governance semantics remain stable while
implementation ownership changes.

**Value mechanism:** contract-first proof prevents path wrappers from becoming
the package API accidentally.

**Acceptance criteria and proof:** failing tests cover each CLI, supplied repo
root, expected diagnostics/exit codes, and root command mapping; tests do not
redefine governed rules that belong in product validator code.

Tasks 3–4 below are one atomic extraction/cutover slice. They may execute for
all validators in one tranche or one validator at a time, but each moved
validator must switch its canonical root command and delete its old
implementation in the same green change. A duplicate validator estate or a
broken root command is never a pause or merge boundary.

### Task 3 — Extract `tooling/practice-validation`

**Outcome:** implementations, helpers, fixtures, tests, and dependencies have
one workspace owner.

**Impact:** Practice validation becomes independently understandable and
testable.

**Value mechanism:** package-local boundaries keep repository-governance code
out of product dependency and Knip surfaces.

**Acceptance criteria and proof:** private manifest, explicit exports, local
type/lint/test/Knip checks, and all validator tests pass; no package source
imports app/product code or private paths; no canonical Practice document is
moved or duplicated. If this is the first passing extraction,
`pnpm-workspace.yaml` is created with explicit public patterns and root plus
package discovery is proved in the same slice.

### Task 4 — Rewire root commands and delete old ownership

**Outcome:** canonical commands execute the package CLIs and the old
implementations no longer exist.

**Impact:** contributors see no command churn and future changes have one
owner.

**Value mechanism:** atomic root cutover plus deletion prevents a second
validator estate.

**Acceptance criteria and proof:** portability, subagent, vital-surface,
fitness, and vocabulary commands preserve behaviour; old scripts/helpers are
removed; dependency/Knip rules have correct entry points; package and root
gates pass; private paths remain explicitly excluded where traversal could
reach them. This task closes the atomic Task 3–4 cutover for every validator
moved in that tranche.

## Extraction-gate disposition

Expected PASS because independent lifecycle, proof, dependency weight, and
cross-platform governance justify a package even though the root is its
principal invoker.

**Losing condition:** retain an enforced root-internal domain if packaging
requires wrapper code larger than the validators, changes repository-root
semantics, or duplicates canonical Practice definitions.

## Test and proof order

Custody reconciliation; inherited validator proof; red CLI/root contract;
mechanical move; tool-local tests; one validator at a time through its root
command; full validator/root gates; static/Knip closure.

## Documentation obligations

- tool README with API, CLIs, inspected root, failure modes, dependencies,
  tests, and non-goals
- root README/contributor command map
- Practice index or cross-platform docs only where actual canonical locations
  or behaviour change
- workspace ADR observed tool boundary
- parent/roadmap and graph-child handoff

## Completion handoff

Record final package APIs, root command map, parity proof, dependency rules,
peer changes incorporated, package disposition, and recommendation to promote
[Professional Profile Graph Workspace](professional-profile-graph-workspace.plan.md).
