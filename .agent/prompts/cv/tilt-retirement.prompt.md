---
prompt_id: tilt-retirement
title: "CV Tilt Retirement"
type: handoff
status: active
last_updated: 2026-04-19
---

Retire the live CV tilt feature: routes, components, content fields, tests,
and ADR-017. Preserve the tilt content and the canonical-alias rationale in
the existing reference doc so future re-introduction is supported.

Ground first via `start-right-quick` or `start-right-thorough`.

## Read first

1. [`../../directives/AGENT.md`](../../directives/AGENT.md)
2. [`../../directives/principles.md`](../../directives/principles.md)
3. [`../../directives/testing-strategy.md`](../../directives/testing-strategy.md)
4. [`../../memory/distilled.md`](../../memory/distilled.md)
5. [`../../memory/napkin.md`](../../memory/napkin.md)
6. [`../../plans/roadmap.md`](../../plans/roadmap.md)
7. [`../../plans/current/tilt-retirement.plan.md`](../../plans/current/tilt-retirement.plan.md)
8. [`../../plans/active/personal-knowledge-graph-source-of-truth-design.plan.md`](../../plans/active/personal-knowledge-graph-source-of-truth-design.plan.md) — Track B scope decision that justifies retirement
9. [`../../plans/research/graph-source-of-truth-layer-map.md`](../../plans/research/graph-source-of-truth-layer-map.md) — B1 layer map's tilt-implications section
10. [`../../../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md`](../../../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md) — to be superseded
11. [`../../../docs/architecture/reference/cv-tilt-content-and-rationale.md`](../../../docs/architecture/reference/cv-tilt-content-and-rationale.md) — preservation target (currently a stub; populate before deletion)
12. [`../../../docs/architecture/README.md`](../../../docs/architecture/README.md) — Routes table to update
13. [`../../../docs/architecture/content-model.md`](../../../docs/architecture/content-model.md) — tilt references to remove

## Grounding truths to preserve

- Track B Phase B2 has been scoped to a **single canonical CV view**, with
  tilt composition and A/B testing deferred door-open. This plan removes the
  live tilt surface so that scope reflects reality.
- The reference doc at
  `docs/architecture/reference/cv-tilt-content-and-rationale.md` exists as a
  stub. **Populate it with verbatim tilt content before deleting that content
  from the codebase.**
- ADR-017 will be superseded by a new ADR. Do not edit ADR-017's body; only
  add a `Superseded by` line.
- This is real code work: routes, components, library code, content fields,
  tests, fixtures, ADRs, and authored docs all change. Run the visual
  regression harness during rendering-affecting slices, not at the end.
- Canonical positioning paragraphs, headline, and capabilities **do not
  change**. This is not editorial work.
- No `as`, `any`, `!`, `--no-verify`, no commented-out code.

## Active task

Run the three-phase plan:

1. Inventory + populate the reference doc (Phase 1).
2. Delete tilt routes, components, library code, content fields, tests, and
   fixtures in coherent slices (Phase 2).
3. Supersede ADR-017 with a new ADR; reconcile `content-model.md`,
   `architecture/README.md`, `README.md`, and any EDR or doc that referenced
   tilts (Phase 3).

## Before editing

- inventory every tilt-touching surface (use the plan's surface list as the
  starting point)
- confirm the reference doc captures every tilt content field verbatim
  before deletion begins
- decide whether `HeadlineToggle` is deleted or refactored to a static
  headline that always renders the canonical headline; default is deletion
  with the canonical headline rendered directly

## Likely relevant files

- [`../../plans/current/tilt-retirement.plan.md`](../../plans/current/tilt-retirement.plan.md)
- [`../../../app/cv/[variant]/page.tsx`](../../../app/cv/%5Bvariant%5D/page.tsx)
- [`../../../components/headline-toggle.tsx`](../../../components/headline-toggle.tsx)
- [`../../../lib/cv-content.ts`](../../../lib/cv-content.ts)
- [`../../../lib/page-document-contract.ts`](../../../lib/page-document-contract.ts)
- [`../../../app/sitemap.ts`](../../../app/sitemap.ts)
- [`../../../content/cv.content.json`](../../../content/cv.content.json)
- [`../../../__snapshots__/cv-content-pre-migration.json`](../../../__snapshots__/cv-content-pre-migration.json)
- [`../../../e2e/journeys/cv-variant.e2e-ui.test.ts`](../../../e2e/journeys/cv-variant.e2e-ui.test.ts)
- [`../../../e2e/support/cv-variant.ts`](../../../e2e/support/cv-variant.ts)
- [`../../../e2e/behaviour/accessibility.e2e-ui.test.ts`](../../../e2e/behaviour/accessibility.e2e-ui.test.ts)
- [`../../../e2e/behaviour/content-integrity.e2e-ui.test.ts`](../../../e2e/behaviour/content-integrity.e2e-ui.test.ts)
- [`../../../e2e/behaviour/seo.e2e-api.test.ts`](../../../e2e/behaviour/seo.e2e-api.test.ts)
- [`../../../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md`](../../../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md)
- [`../../../docs/architecture/reference/cv-tilt-content-and-rationale.md`](../../../docs/architecture/reference/cv-tilt-content-and-rationale.md)

## Do the work

- one rendering-affecting slice at a time; restart-on-fix through the gate
  sequence each time
- run the visual regression harness during Phase 2 slices, not deferred
- write the new superseding ADR in the same slice as the doc reconciliation
- update [`../../memory/napkin.md`](../../memory/napkin.md) with mistakes,
  corrections, and what was learned
- once Phase 3 closes, move this plan to `archive/` and reconcile the
  roadmap

## Proof requirements

- visual regression harness during every rendering-affecting slice in Phase 2;
  unexpected diffs block the slice until reviewed and approved
- full Playwright E2E pass after Phase 2 and Phase 3
- `pnpm practice:fitness:informational` after Phase 3 doc reconciliation

## After changes, run in order

- `pnpm format:fix`
- `pnpm markdownlint:fix`
- `pnpm lint:fix`
- `pnpm typecheck`
- `pnpm test`
- `pnpm knip`
- `pnpm secrets:scan`
- `pnpm portability:check`
- `pnpm test:e2e`
- `pnpm visual-regression-harness` for rendering slices

## End by summarising

- which surfaces were retired in this slice
- whether the reference doc is fully populated
- whether ADR-017 is superseded and the new ADR exists
- whether the plan is moving to `archive/`
