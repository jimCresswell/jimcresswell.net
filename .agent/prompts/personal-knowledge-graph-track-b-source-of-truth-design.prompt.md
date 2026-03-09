---
prompt_id: personal-knowledge-graph-track-b-source-of-truth-design
title: "Track B Source-of-Truth Design"
type: handoff
status: active
last_updated: 2026-03-09
---

Continue the personal knowledge graph programme in
`/Users/jim/code/personal/new-cv`.

Use
[$jc-start-right](/Users/jim/code/personal/new-cv/.agents/skills/jc-start-right/SKILL.md).

## Read first

1. `/Users/jim/code/personal/new-cv/.agent/directives/AGENT.md`
2. `/Users/jim/code/personal/new-cv/.agent/directives/rules.md`
3. `/Users/jim/code/personal/new-cv/.agent/directives/testing-strategy.md`
4. `/Users/jim/code/personal/new-cv/.agent/memory/distilled.md`
5. `/Users/jim/code/personal/new-cv/.agent/memory/napkin.md`
6. `/Users/jim/code/personal/new-cv/.agent/plans/current/personal-knowledge-graph-roadmap.plan.md`
7. `/Users/jim/code/personal/new-cv/.agent/plans/current/personal-knowledge-graph-source-of-truth-design.plan.md`
8. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-current-state-audit.md`
9. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-publication-consumer-and-proof-model.md`
10. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-publication-output-audit.md`
11. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-rich-result-external-validator-evidence.md`
12. `/Users/jim/code/personal/new-cv/docs/architecture/README.md`
13. `/Users/jim/code/personal/new-cv/docs/architecture/content-model.md`
14. `/Users/jim/code/personal/new-cv/docs/architecture/decision-records/014-entity-model-design.md`

## Grounding truths to preserve

- The live parent authority is
  `personal-knowledge-graph-roadmap.plan.md`.
- Track A is complete for the current publication surface.
- Track B design is now the active graph task.
- Track B remains design-only. Do not ship source-of-truth implementation code
  from this slice.
- Visible HTML still comes from `content/cv.content.json` and
  `content/frontpage.content.json`.
- The graph currently drives JSON-LD, the manifest, and some metadata.
- The current architecture still has split ownership between page-composition
  JSON and the entity graph.
- No compatibility layers, no stub-preservation docs, no edits under
  `.agent/plans/complete/`.
- Proof is still required, but for this slice the proof is architectural and
  documentary rather than external-validator capture.

## Start from the live execution handoff

- begin with Track B Phase B1, not a new audit
- use the completed Track A notes to define the boundary of the current
  architecture, not to reopen Track A work
- keep Track A / Track B boundaries explicit
- preserve the current rendering truth: the site is not yet graph-derived in
  visible HTML

## Active task

Deliver the first Track B design slice:

- Task B1.1 — Source-of-Truth Layer Map
- Task B1.2 — Worked Ownership Examples

The output should define:

- which concerns belong to graph-owned facts
- which concerns belong to authored prose
- which concerns belong to composition structures
- the proposed file topology for those layers
- worked ownership examples for `/` and `/cv`
- tilt implications where they matter

## Before editing

- confirm the smallest useful design slice that advances Track B without
  spilling into implementation
- identify where current plan wording still implies Track B is inactive or
  under-specified
- keep the current rendering and publication boundaries explicit

## Likely relevant files

- `/Users/jim/code/personal/new-cv/.agent/plans/current/personal-knowledge-graph-source-of-truth-design.plan.md`
- `/Users/jim/code/personal/new-cv/.agent/plans/current/personal-knowledge-graph-roadmap.plan.md`
- `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-current-state-audit.md`
- `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-publication-output-audit.md`
- `/Users/jim/code/personal/new-cv/docs/architecture/content-model.md`
- `/Users/jim/code/personal/new-cv/docs/architecture/decision-records/014-entity-model-design.md`
- `/Users/jim/code/personal/new-cv/content/frontpage.content.json`
- `/Users/jim/code/personal/new-cv/content/cv.content.json`
- `/Users/jim/code/personal/new-cv/content/entities.json`

## Do the work

- produce the first Track B design material for the layered model and worked
  ownership examples
- update the live Track B plan and any discoverable supporting note needed to
  keep the design standalone
- update other live plans or prompts only if status, next steps, or cross-links
  change
- update `/Users/jim/code/personal/new-cv/.agent/memory/napkin.md` with
  mistakes, corrections, and what was learned

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
- `pnpm gitleaks`
- `pnpm test:e2e`

## End by summarising

- what design material was added or updated
- whether Track B Phase B1 status changed
- what open design questions remain after the slice
- whether any stakeholder decision is needed before Track B continues
