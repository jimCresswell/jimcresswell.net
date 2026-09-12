---
prompt_id: personal-knowledge-graph-track-b-source-of-truth-design
title: "Track B Source-of-Truth Design"
type: handoff
status: active
last_updated: 2026-04-19
---

Continue the personal knowledge graph programme in this repo.

Ground first via `start-right-quick` or `start-right-thorough`.

## Read first

1. [`../../directives/AGENT.md`](../../directives/AGENT.md)
2. [`../../directives/principles.md`](../../directives/principles.md)
3. [`../../directives/testing-strategy.md`](../../directives/testing-strategy.md)
4. [`../../memory/distilled.md`](../../memory/distilled.md)
5. [`../../memory/napkin.md`](../../memory/napkin.md)
6. [`../../plans/roadmap.md`](../../plans/roadmap.md)
7. [`../../plans/active/README.md`](../../plans/active/README.md)
8. [`../../plans/current/personal-knowledge-graph-roadmap.plan.md`](../../plans/current/personal-knowledge-graph-roadmap.plan.md)
9. [`../../plans/active/personal-knowledge-graph-source-of-truth-design.plan.md`](../../plans/active/personal-knowledge-graph-source-of-truth-design.plan.md)
10. [`../../plans/research/graph-source-of-truth-layer-map.md`](../../plans/research/graph-source-of-truth-layer-map.md)
11. [`../../plans/research/graph-current-state-audit.md`](../../plans/research/graph-current-state-audit.md)
12. [`../../plans/research/graph-publication-consumer-and-proof-model.md`](../../plans/research/graph-publication-consumer-and-proof-model.md)
13. [`../../plans/research/graph-publication-output-audit.md`](../../plans/research/graph-publication-output-audit.md)
14. [`../../plans/research/graph-rich-result-external-validator-evidence.md`](../../plans/research/graph-rich-result-external-validator-evidence.md)
15. [`../../../docs/architecture/README.md`](../../../docs/architecture/README.md)
16. [`../../../docs/architecture/content-model.md`](../../../docs/architecture/content-model.md)
17. [`../../../docs/architecture/decision-records/014-entity-model-design.md`](../../../docs/architecture/decision-records/014-entity-model-design.md)

## Grounding truths to preserve

- The live parent authority is
  `personal-knowledge-graph-roadmap.plan.md`.
- Track A is complete for the current publication surface.
- Track B design is now the active graph task, **scoped to a single canonical
  CV view**.
- Track B Phase B1 is complete and recorded in
  `graph-source-of-truth-layer-map.md`.
- **Tilt composition design is deferred door-open.** Live tilt routes were
  retired under ADR-021; the completion record is
  [`../../plans/archive/tilt-retirement.plan.md`](../../plans/archive/tilt-retirement.plan.md).
  Do not design tilt composition into B2. Re-entry, if it ever happens, starts
  from the preserved tilt reference doc + the B1 layer map's
  tilt-implications section.
- A/B testing is also deferred door-open and is not part of this design.
- Track B remains design-only. Do not ship source-of-truth implementation code
  from this slice.
- Visible HTML still comes from `content/cv.content.json` and
  `content/frontpage.content.json`.
- The graph currently drives JSON-LD, the manifest, and some metadata.
- The current architecture still has split ownership between page-composition
  JSON and the entity graph, while the target Track B model is now defined as
  one cohesive graph across multiple source layers.
- No compatibility layers, no stub-preservation docs, no edits under
  `.agent/plans/archive/`.
- Proof is still required, but for this slice the proof is architectural and
  documentary rather than external-validator capture.

## Start from the live execution handoff

- begin with Track B Phase B2, not a new audit
- use `graph-source-of-truth-layer-map.md` as the fixed B1 boundary rather than
  re-deciding ownership
- use the completed Track A notes to define the boundary of the current
  architecture, not to reopen Track A work
- keep Track A / Track B boundaries explicit
- preserve the current rendering truth: the site is not yet graph-derived in
  visible HTML

## Active task

Deliver the next Track B design slice (single canonical CV view):

- Task B2.1 — Page Selection and Ordering Model

Task B2.2 (Tilt Composition Model) is **deferred door-open** — do not design it.

The output should define:

- how route/view nodes select facts and prose for the canonical `/cv/` route
- how ordering and grouping work without recreating today's page JSON shape
- how page-specific narrative slots sit alongside reusable statement entities
- where the seam sits for later tilt re-introduction without rewriting the
  canonical-view model

## Before editing

- confirm the smallest useful B2.1 slice that advances Track B without spilling
  into implementation
- preserve the B1 ownership boundary rather than reopening it
- inspect the current page-document behaviour that B2 will need to model
  deliberately for the canonical view
- keep the current rendering and publication boundaries explicit
- do not block on tilt-retirement; the two threads are parallel-runnable

## Likely relevant files

- [`../../plans/active/personal-knowledge-graph-source-of-truth-design.plan.md`](../../plans/active/personal-knowledge-graph-source-of-truth-design.plan.md)
- [`../../plans/current/personal-knowledge-graph-roadmap.plan.md`](../../plans/current/personal-knowledge-graph-roadmap.plan.md)
- [`../../plans/research/graph-source-of-truth-layer-map.md`](../../plans/research/graph-source-of-truth-layer-map.md)
- [`../../plans/research/graph-current-state-audit.md`](../../plans/research/graph-current-state-audit.md)
- [`../../plans/research/graph-publication-output-audit.md`](../../plans/research/graph-publication-output-audit.md)
- [`../../../lib/page-document-contract.ts`](../../../lib/page-document-contract.ts)
- [`../../../docs/architecture/content-model.md`](../../../docs/architecture/content-model.md)
- [`../../../docs/architecture/decision-records/014-entity-model-design.md`](../../../docs/architecture/decision-records/014-entity-model-design.md)
- [`../../../content/frontpage.content.json`](../../../content/frontpage.content.json)
- [`../../../content/cv.content.json`](../../../content/cv.content.json)
- [`../../../content/entities.json`](../../../content/entities.json)

## Do the work

- produce the next Track B design material for page selection, ordering, and
  tilt composition
- update the live Track B plan and any discoverable supporting note needed to
  keep the design standalone
- update other live plans or prompts only if status, next steps, or cross-links
  change
- update [`../../memory/napkin.md`](../../memory/napkin.md) with mistakes,
  corrections, and what was learned

## Proof requirements

- if the slice stays design-only, explain why the visual regression harness was
  not required
- if any change unexpectedly crosses into implementation or rendered-output
  plumbing, stop and tighten the slice before continuing

## After changes, run in order

- `pnpm format:fix`
- `pnpm markdownlint:fix`
- `pnpm lint:fix`
- `pnpm typecheck`
- `pnpm test`
- `pnpm knip`
- `pnpm secrets:scan`
- `pnpm test:e2e`

## End by summarising

- what design material was added or updated
- whether Track B Phase B2 status changed
- what open design questions remain after the slice
- whether any stakeholder decision is needed before Track B continues
