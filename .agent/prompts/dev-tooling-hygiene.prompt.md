---
prompt_id: dev-tooling-hygiene
title: "Dev-Tooling Hygiene"
type: handoff
status: active
last_updated: 2026-04-18
---

Run the dev-tooling hygiene work for this repo: refresh outdated dependencies,
then introduce `dependency-cruiser` as a ninth blocking quality gate.

Ground the session first: follow the **start-right** skill
([`../skills/start-right/SKILL.md`](../skills/start-right/SKILL.md))
or the thin adapter
[`jc-start-right`](../../.agents/skills/jc-start-right/SKILL.md)
— same workflow (foundation docs, `plans/active/`, practice box, gates).

## Read first

1. [`../directives/AGENT.md`](../directives/AGENT.md)
2. [`../directives/rules.md`](../directives/rules.md)
3. [`../directives/testing-strategy.md`](../directives/testing-strategy.md)
4. [`../memory/distilled.md`](../memory/distilled.md)
5. [`../memory/napkin.md`](../memory/napkin.md)
6. [`../plans/roadmap.md`](../plans/roadmap.md)
7. [`../plans/current/dev-tooling-hygiene.plan.md`](../plans/current/dev-tooling-hygiene.plan.md)
8. [`../../package.json`](../../package.json) — current scripts, deps, knip config
9. [`../../docs/architecture/decision-records/005-knip-unused-code-detection.md`](../../docs/architecture/decision-records/005-knip-unused-code-detection.md) — ADR template reference for the new dep-cruiser ADR
10. [`../../README.md`](../../README.md) and `CONTRIBUTING.md` — gate-count surfaces to update in Phase 2

## Grounding truths to preserve

- `dependency-cruiser` is **pre-committed as a ninth blocking gate**. The
  introduction commit must either fix violations or land alongside the Phase 3
  cleanup session. The plan owns the cleanup as a dedicated follow-on session.
- The plan is independent of the editorial / graph / tilt-retirement threads.
  It can run in any order relative to them.
- No `--force`, no `--ignore-scripts`, no skipping hooks (`--no-verify`).
- One major upgrade per commit. Vercel preview verification required for any
  framework major (Next.js, React, Tailwind, Node).
- Visual regression harness is required for any rendering-touching upgrade.
- This repo is a single-package pnpm project; `pnpm outdated` and
  `pnpm -r outdated` produce identical output.

## Active task

Phase 1: deps refresh.

1. Snapshot `pnpm outdated` and triage into patch / minor / major / parked.
2. Apply patch and minor upgrades in one combined slice; full gates pass.
3. Apply each major upgrade in its own slice; full gates + E2E + visual
   regression harness + Vercel preview after each framework major.

Phase 2: introduce `dependency-cruiser`.

1. Install + write `.dependency-cruiser.cjs` (or equivalent) encoding the
   layering rules in the plan.
2. Write the new ADR documenting the decision and the rule set.
3. Wire `pnpm depcruiser` into `pnpm check` and `pnpm check:ci`; update
   `rules.md`, `README.md`, and any tooling docs from "eight gates" to "nine
   gates".
4. The first strict run will surface violations. Either fix them in this
   slice or land alongside the Phase 3 cleanup session.

Phase 3: dedicated cleanup session opens separately, with its own handoff,
once Phase 2 lands.

## Before editing

- read the plan; classify every outdated package before touching any
- check the current Vercel project state and that you have permission to
  trigger preview deploys
- confirm the gate sequence in `rules.md` and `package.json` agree before
  starting Phase 2

## Likely relevant files

- [`../plans/current/dev-tooling-hygiene.plan.md`](../plans/current/dev-tooling-hygiene.plan.md)
- [`../../package.json`](../../package.json)
- [`../../pnpm-lock.yaml`](../../pnpm-lock.yaml)
- [`../../docs/architecture/decision-records/`](../../docs/architecture/decision-records/) — for the new ADR
- [`../directives/rules.md`](../directives/rules.md) — gate count + sequence
- [`../../README.md`](../../README.md) — gate count surfaces
- [`../../scripts/`](../../scripts/) — depcruiser layering rules apply here
- [`../../lib/`](../../lib/), [`../../app/`](../../app/), [`../../components/`](../../components/), [`../../e2e/`](../../e2e/), [`../../visual-regression-harness/`](../../visual-regression-harness/) — the layered surface

## Do the work

- one slice per upgrade or rule change; no mixed slices
- update [`../memory/napkin.md`](../memory/napkin.md) with mistakes,
  corrections, and what was learned
- write the ADR in the same slice as the gate-wiring change

## Proof requirements

- visual regression harness required for any rendering-touching dep upgrade
  (Tailwind, Next, React, fonts, image tooling)
- E2E full pass after each major and after Phase 2 wiring
- `pnpm practice:fitness:informational` after `rules.md` / `README.md` updates

## After changes, run in order

- `pnpm format:fix`
- `pnpm markdownlint:fix`
- `pnpm lint:fix`
- `pnpm typecheck`
- `pnpm test`
- `pnpm knip`
- `pnpm gitleaks`
- `pnpm portability:check`
- `pnpm depcruiser` (once Phase 2 wires it in — this is the ninth gate)
- `pnpm test:e2e`

## End by summarising

- which packages were upgraded and which were parked
- whether the dep-cruiser ADR landed
- whether the gate count is updated to nine across all surfaces
- whether the Phase 3 cleanup session is needed and how many violations are
  outstanding
