---
name: Dev-Tooling Hygiene
overview: Refresh the outdated dependency surface and introduce dependency-cruiser as a ninth blocking quality gate. The depcruiser introduction is committed; a dedicated cleanup session will resolve whatever its first run surfaces.
todos:
  - id: deps-snapshot
    content: Snapshot the current outdated surface with `pnpm outdated` and group upgrades by risk.
    status: pending
  - id: deps-patch-and-minor
    content: Apply patch and minor upgrades in one slice, run full gates, commit.
    status: pending
  - id: deps-majors-sequenced
    content: Apply major upgrades one package at a time, with full gates and Vercel preview verification each time.
    status: pending
  - id: depcruiser-install-and-config
    content: Install dependency-cruiser, write the initial config encoding the repo's layering rules, and commit advisory output as evidence.
    status: pending
  - id: depcruiser-promote-to-gate
    content: Add depcruiser as the ninth blocking gate in pnpm check / check:ci, write the ADR, update rules.md and README.
    status: pending
  - id: depcruiser-cleanup-session
    content: Dedicated follow-on session to resolve every depcruiser violation surfaced by the first strict run.
    status: pending
isProject: true
---

# Dev-Tooling Hygiene

## Status

Adopted on 2026-04-18. Two-phase plan with a committed follow-on cleanup
session.

## Outcome, impact, and value mechanism

**Outcome:** the repo runs on currently-supported dependency versions and
enforces module-layering rules through `dependency-cruiser` as a blocking
quality gate.

**Impact:** maintenance backlog stops growing silently; architectural drift
between layers (`app/`, `components/`, `lib/`, `content/`, `scripts/`, `e2e/`,
`visual-regression-harness/`) is detected at gate time rather than discovered
in code review or in production.

**Value mechanism:** fresh dependencies reduce security exposure, unlock
framework features actually wired in (Next.js, React, Tailwind), and let
downstream tooling (e.g. `eslint-config-next`, `knip`) work against the
versions they're tested for. A blocking architecture-rule gate enforces the
layering decisions already made implicitly by the repo structure.

## Boundaries

- This plan does not change product behaviour; rendered output should be
  identical except where a major dependency upgrade demands intentional
  changes.
- This plan does not retire tilts (see `tilt-retirement.plan.md`) or design
  graph composition (see Track B). It can run before, during, or after either
  of those.
- `dependency-cruiser` is committed as a blocking gate in advance. Whatever
  its first run surfaces will be cleaned up in a dedicated follow-on session,
  not in the introduction slice itself.

## Phases

### Phase 1 — Dependency refresh

**Goal:** move the repo onto currently-supported versions of its declared
dependencies, in risk-graded slices.

**Impact:** the codebase stops carrying invisible upgrade debt across Next.js,
React, Tailwind, Vitest, ESLint config, and the supporting tooling.

**Value mechanism:** fresh deps unlock features the repo already uses
(Next.js / React features, Tailwind 4 features), close known security
advisories, and are a precondition for `dependency-cruiser` baselining
against a stable surface.

**Acceptance criteria:**

- `pnpm outdated` (or `pnpm -r outdated`, identical output for this
  single-package repo) is captured at the start of the phase as the baseline
- patch + minor upgrades land in one combined slice with the full gate
  sequence passing
- each major upgrade lands in its own slice, with: targeted release-notes
  read first; one package per commit; full `pnpm check` + `pnpm test:e2e`
  after each; a Vercel preview deploy verified for any framework upgrade
  (Next.js, React, Tailwind, Node) before merge
- no upgrade is applied with `--force` or `--ignore-scripts`
- the final state has zero outstanding upgrades except those explicitly
  parked with documented reason in this plan

#### Tasks

##### Task 1.1 — Capture baseline and triage

**Outcome:** a documented inventory of all outdated packages with a risk
classification and proposed sequencing.

**Acceptance criteria:**

- baseline output committed to this plan or a sibling research note
- each package classified `patch` / `minor` / `major` / `parked` (with reason)
- the major sequence is ordered: framework majors (Next, React) before tooling
  majors; build-time before runtime where possible

##### Task 1.2 — Apply patch and minor upgrades

**Outcome:** all patch and minor versions are current.

**Acceptance criteria:**

- single slice; single commit
- full gate sequence passes including E2E
- visual regression harness run if the slice touches Tailwind or any rendering
  dependency

##### Task 1.3 — Apply majors sequentially

**Outcome:** all targeted major upgrades land cleanly; parked items are
documented.

**Acceptance criteria:**

- one major per commit
- gate sequence + E2E + visual regression harness after each
- Vercel preview verified before merge for any framework major
- breaking-change notes recorded in this plan or commit messages where
  product or test code had to change

### Phase 2 — Introduce `dependency-cruiser` as the ninth blocking gate

**Goal:** install `dependency-cruiser`, write a layering config, and add it as
a ninth blocking gate to `pnpm check` and `pnpm check:ci`.

**Impact:** module-layering decisions become enforced rather than implied; the
gate sequence reflects the architectural surface the repo actually wants.

**Value mechanism:** layering rules in code (no `app → e2e`, no cyclic deps,
`lib/` purity, no `components → app`) are easy to violate accidentally and
hard to detect in review. A blocking gate makes the rule actionable.

**Acceptance criteria:**

- `dependency-cruiser` installed as a devDependency
- a config file (`.dependency-cruiser.cjs` or equivalent) encodes:
  - no circular dependencies (severity: error)
  - no `app → e2e`, `lib → app`, `lib → components`, `components → app`
  - `lib/` modules cannot depend on `content/` JSON shapes — they must use
    typed accessors
  - `scripts/` cannot import from `app/` or `e2e/`
  - `visual-regression-harness/` is a leaf
  - test files (`*.test.ts`, `*.integration.test.ts`, `e2e/`) may depend on
    product code but product code may not depend on tests
- a new ADR records the decision to make depcruiser blocking and names the
  layering rules
- `rules.md` updates to call out the ninth gate in the gate sequence
- `package.json` `check` and `check:ci` scripts gain `pnpm depcruiser`
- `README.md` and `CONTRIBUTING.md` (if present) reflect the ninth gate
- the introduction commit captures the **first strict run output** as a
  baseline (committed advisory note), but the gate is **already strict** at
  merge — meaning this commit must either fix the violations or land alongside
  Phase 3 cleanup
- Phase 3 cleanup is opened as a dedicated follow-on session, not folded into
  this slice

#### Tasks

##### Task 2.1 — Install and configure depcruiser

**Outcome:** depcruiser runs locally with the layering config.

**Acceptance criteria:**

- config exists and is readable
- `pnpm depcruiser` script defined
- config covers every directory listed in the acceptance criteria above

##### Task 2.2 — Write the ADR

**Outcome:** an ADR documents the decision and the rule set.

**Acceptance criteria:**

- ADR follows the existing template
- explicitly names depcruiser as the ninth blocking gate
- explicitly names the layering rules and the rationale for each
- explicitly names the dedicated cleanup session as the path for resolving
  the first strict run's violations

##### Task 2.3 — Wire depcruiser into the gate sequence

**Outcome:** `pnpm check` and `pnpm check:ci` run depcruiser; pre-commit and
pre-push hooks pick this up automatically.

**Acceptance criteria:**

- both scripts updated
- gate count in `rules.md`, `README.md`, and any tooling docs updated from
  "eight gates" to "nine gates"
- restart-on-fix discipline still applies

### Phase 3 — Dedicated cleanup session

**Goal:** resolve every violation surfaced by depcruiser's first strict run.

**Impact:** the codebase complies with the layering rules it now enforces.

**Value mechanism:** doing this in a dedicated session keeps the introduction
commit atomic and the cleanup commits coherent and reviewable. Mixed slices
hide the value of either change.

**Acceptance criteria:**

- a fresh session opens this phase as its primary task
- every violation is either fixed or documented as an explicit
  `dependency-cruiser` allowed-exception in the config (with rationale)
- `pnpm check:ci` passes cleanly
- the cleanup commits are scoped per-rule or per-module, not as one giant
  refactor

#### Tasks

##### Task 3.1 — Triage violations

**Outcome:** classified list of violations with proposed fix or exception.

**Acceptance criteria:**

- list captured in this plan or a sibling research note
- each entry classified `fix` / `exception (with reason)`

##### Task 3.2 — Apply fixes and exceptions

**Outcome:** strict run is clean; no unjustified exceptions remain.

**Acceptance criteria:**

- per-rule or per-module commits
- gate sequence passes after each commit (restart-on-fix)

## Reviewer expectations

- `code-reviewer` — gateway for every slice
- `type-reviewer` — for major upgrades that change type surfaces (React 19+,
  Next 16+, TypeScript 5.9+) and for any `lib/` cleanup in Phase 3
- `test-reviewer` — for any test changes forced by major upgrades
- `pkg-reviewer` — only if a dep upgrade affects JSON-LD or schema-dts output
- `editor` — not required

## Proof posture

- visual regression harness required for any rendering-touching dep upgrade
- E2E full pass after each major and after Phase 2 wiring
- `pnpm practice:fitness:informational` after the rules.md / README updates in
  Phase 2
