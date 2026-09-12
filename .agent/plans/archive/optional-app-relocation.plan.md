---
name: Optional App Relocation
overview: Optional first child for the clean-root sequence. Relocate the unchanged Next.js deployable to apps/www only when Jim explicitly values a pure orchestration root.
todos:
  - id: relocation-disposition
    content: Sequence R selected; Optional App Relocation recorded Not Selected before implementation.
    status: completed
  - id: relocation-baseline
    content: Capture current root commands, production behaviour, deployment, PDF, E2E, and visual proof.
    status: deferred
  - id: relocation-contract-red-proof
    content: Add failing proof for the selected root/app command, workspace, and deployment contract.
    status: deferred
  - id: relocate-app
    content: Move the deployable mechanically to apps/www and make the repository root orchestration-only.
    status: deferred
  - id: restore-operational-paths
    content: Restore root commands, CI, Vercel, PDF, accept-md, E2E, aliases, and proof paths.
    status: deferred
  - id: relocation-proof
    content: Run all blocking product and operational proof, then remove every transitional path.
    status: deferred
isProject: true
---

# Optional App Relocation

## Status

**Archived as Not Selected on 2026-08-10. Jim selected Sequence R, retaining
the root application.**

This is a complete disposition, not deferred work. Reopen this child only if
new evidence makes a clean orchestration root an owner-valued outcome before
the first package move. The active sequence begins with
[Visual Regression Workspace](../current/visual-regression-workspace.plan.md).

## Outcome, impact, value mechanism, and proof

**Outcome:** the repository root owns monorepo orchestration and its unchanged
Next.js deployable lives at `apps/www`.

**Impact:** every later workspace sees a physically explicit app boundary and
no later package extraction needs to move application paths.

**Value mechanism:** when clean-root ownership is an explicit goal, paying the
mechanical path cost once before semantic extraction avoids repeated path
adjustments and keeps app dependencies out of the root manifest.

**Proof:** root-recursive gates discover the app; Vercel builds it from the
settled configuration; production E2E, PDF, graph, markdown negotiation,
metadata, accessibility, and visual comparison preserve current behaviour.

## Dormant re-entry conditions

These conditions are not current work. They apply only if new evidence and an
explicit owner decision reopen Sequence A before the first package move.

- Jim has selected Sequence A in the parent and promoted this child
- live collaboration and custody for app, configuration, validator, manifest,
  and lockfile paths is re-checked
- canonical-only CV retirement remains the current product decision
- the six parked major migrations, dependency-cruiser work, and live lockfile
  ownership in Dev-Tooling Hygiene are reconciled
- current `pnpm check`, production-build/E2E, PDF, and visual state is recorded
- the deployment contract from ADR-019 and PDF contracts from ADR-001/002 are
  understood

## Boundaries

### In scope

- `pnpm-workspace.yaml`
- orchestration-only root `package.json`
- `apps/www/package.json`
- mechanical relocation of app, components, libraries, public content/assets,
  application E2E, app-specific scripts, and app configuration
- root and app TypeScript, Vitest, Playwright, ESLint, Prettier, and Knip paths
- CI, Vercel, hooks, accept-md, PDF, and visual-harness path updates
- documentation required to run and deploy the relocated application

### Out of scope

- extracting any product or tooling package
- changing routes, copy, layout, styling, metadata, JSON-LD, or PDF bytes by
  design
- changing graph or Track B semantics
- dependency upgrades unrelated to the path move
- preserving root application imports after this child closes
- adding task orchestration beyond pnpm

## Design constraints

1. Keep one deployable and one Vercel project.
2. Root manifest owns orchestration/governance; app manifest owns runtime and
   app build dependencies.
3. `@/*` resolves from `apps/www`, never through a compatibility alias.
4. Root typecheck explicitly reaches the app even though Next ignores build
   type errors.
5. E2E continues against the production build.
6. Vercel outside-root source access and Next output tracing are configured
   explicitly where required; no cwd guessing.
7. Practice validators may remain root-internal until their separate child.
8. The ignored private editorial boundary remains outside all globs and
   discovery.

## Tasks

### Task 1 — Freeze current behaviour

**Outcome:** current paths, commands, deployment settings, emitted outputs, and
visual artefacts form a recorded baseline.

**Impact:** relocation failures can be distinguished from inherited failures.

**Value mechanism:** the move is judged by behaviour and operations rather
than filesystem appearance.

**Acceptance criteria and proof:** current Git/peer custody, root scripts, CI,
Vercel, PDF output, Playwright server, `pnpm check`, sequential E2E, and visual
artefacts are recorded; no move begins on unexplained non-green state.

### Task 2 — Specify the selected root/app contract with red proof

**Outcome:** checks describe workspace discovery, root command reachability,
app location, resolved build/E2E/PDF paths, and deployment root.

**Impact:** partial moves cannot look successful because local `next dev` runs.

**Value mechanism:** contract proof makes every operational path explicit.

**Acceptance criteria and proof:** the checks fail for the expected pre-move
location and cover every blocking root command plus Vercel, PDF, accept-md,
Playwright, aliases, and output tracing.

### Task 3 — Relocate the application mechanically

**Outcome:** the current deployable and app-owned configuration have one owner
under `apps/www`; the root is orchestration-only.

**Impact:** later package boundaries start from their intended permanent app
path.

**Value mechanism:** mechanical separation creates physical app ownership
without mixing in domain refactoring.

**Acceptance criteria and proof:** manifests have distinct responsibilities;
source/content/assets/E2E/build scripts resolve from `apps/www`; Git movement
is reviewable; no product file receives semantic changes in the move commit.

### Task 4 — Restore every operational path

**Outcome:** contributor, CI, deployment, PDF, alternate-representation, test,
and visual commands work from the repository root.

**Impact:** clean-root ownership does not add contributor or production
fragility.

**Value mechanism:** explicit root orchestration preserves current ergonomics
while keeping app implementation app-owned.

**Acceptance criteria and proof:** dev/build/start, unit/integration, E2E,
visual, Vercel, PDF, accept-md, TypeScript, Vitest, Playwright, ESLint,
Prettier, Knip, PostCSS, Tailwind, hooks, and CI use explicit settled paths.

### Task 5 — Prove behaviour and delete transition paths

**Outcome:** `apps/www` is the only live application source and the child is
independently green.

**Impact:** later children never inherit a half-relocated application.

**Value mechanism:** complete deletion makes revert—not dual ownership—the
only alternative to success.

**Acceptance criteria and proof:** root/app gates, production build, sequential
E2E, PDF generation/serving, graph/JSON-LD/manifest/SEO/markdown/accessibility,
visual comparison, Knip, and dependency checks pass; no old source path,
alias, wrapper, or cwd fallback remains.

## Losing condition and rollback

Stop and retain the application at root if clean-root ownership requires any
of the following after one bounded configuration attempt:

- persistent duplicate manifests or app dependencies at the root
- opaque Vercel settings or outside-root source workarounds
- cwd-dependent PDF, accept-md, E2E, or visual behaviour
- output-tracing exceptions wider than the app's named dependencies
- transition aliases that cannot be deleted in this child

The child then records **Rejected** and is reverted as a unit. Do not protect
spent effort by keeping a partial relocation.

## Test order

For every changed operational boundary: red contract proof; smallest path
change; narrow proof; app unit/integration proof; root gates; production build
and sequential E2E; visual/PDF review where relevant.

## Documentation obligations

- root README and contributing command map
- architecture README and workspace ADR app-location decision
- deployment, PDF, E2E, accept-md, and visual-harness path docs
- ADR-001/002/019 reconciliation if their operational contract changes
- parent/roadmap disposition and next child

## Completion handoff

Record the selected/rejected layout, root/app command map, deployment proof,
full product proof, deleted transition paths, any disproved clean-root
assumption, and recommendation to promote
[Visual Regression Workspace](../current/visual-regression-workspace.plan.md).
