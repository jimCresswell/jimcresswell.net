---
prompt_id: personal-knowledge-graph-track-a-cv-metadata-proof
title: "Track A CV Metadata Proof"
type: handoff
status: active
last_updated: 2026-03-09
---

Continue Track A of the personal knowledge graph programme in
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
7. `/Users/jim/code/personal/new-cv/.agent/plans/current/personal-knowledge-graph-execution.plan.md`
8. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-current-state-audit.md`
9. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-publication-consumer-and-proof-model.md`
10. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-publication-output-audit.md`
11. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-negotiated-media-type-refinement.md`
12. `/Users/jim/code/personal/new-cv/docs/architecture/README.md`
13. `/Users/jim/code/personal/new-cv/docs/architecture/content-model.md`

## Grounding truths to preserve

- The live parent authority is `personal-knowledge-graph-roadmap.plan.md`.
- Track A comes first. Track B remains required but is not the active task.
- Track A Phase A1 and A2 are complete.
- Track A Phase A3 is active.
- The negotiated media-type slice, home-page emitted-channel proof slice, and
  manifest proof slice are complete.
- Do not start a new audit.
- The next task is the remaining A3 proof slice: tighter CV metadata
  description proof on `/cv` and `/cv/[variant]`.
- Visible HTML still comes from `content/cv.content.json` and
  `content/frontpage.content.json`.
- The graph currently drives JSON-LD, the manifest, and some metadata.
- No compatibility layers, no stub-preservation docs, no edits under
  `.agent/plans/complete/`.
- Proof is required.

## Start from the live execution handoff

- begin with proof for the graph-derived description fields already emitted on
  `/cv` and `/cv/[variant]`
- prove the rendered description and Open Graph description stay aligned with
  `person.description`
- only after that lands should later work move to Track A Phase A4 external
  validator evidence for `/` and `/cv/`

## Before editing

- inspect the current metadata implementation and proof surfaces for `/cv` and
  `/cv/[variant]`
- confirm which fields already derive from `person.description`
- identify the smallest truthful proof addition needed
- keep Track A / Track B boundaries explicit

## Likely relevant files

- `/Users/jim/code/personal/new-cv/app/cv/page.tsx`
- `/Users/jim/code/personal/new-cv/app/cv/[variant]/page.tsx`
- `/Users/jim/code/personal/new-cv/lib/cv-content.ts`
- `/Users/jim/code/personal/new-cv/lib/page-document-contract.ts`
- `/Users/jim/code/personal/new-cv/e2e/behaviour/seo.e2e-api.test.ts`
- `/Users/jim/code/personal/new-cv/lib/page-document-contract.integration.test.ts`

## Do the work

- add proof that `/cv` emits metadata description fields aligned with
  `person.description`
- add proof that `/cv/[variant]` keeps the same graph-derived description
  alignment while preserving canonical-alias behaviour
- update the live Track A docs only if the delivered proof changes recorded
  status or next steps
- update `/Users/jim/code/personal/new-cv/.agent/memory/napkin.md` with
  mistakes, corrections, and what was learned

## Proof requirements

- if the slice stays proof-only, explain why the visual regression harness was
  not needed
- if fixing a real defect changes metadata wiring, graph plumbing, or other
  rendered-output infrastructure, run `pnpm visual-regression-harness HEAD
WORKTREE` during implementation, not only at the end
- unexpected differences are blocking until reviewed and resolved

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

- what changed
- what proof was added for `/cv` and `/cv/[variant]`
- whether Track A Phase A3 status changed
- what proof gaps remain after this slice
- whether any stakeholder decision is still needed
