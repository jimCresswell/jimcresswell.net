---
prompt_id: personal-knowledge-graph-track-a-external-validation
title: "Track A External Validation Evidence"
type: handoff
status: completed
last_updated: 2026-03-09
---

This handoff is complete. The current external-validator record accepts the
remaining `/cv/` Schema.org and Google Rich Results Test gaps as validator-side
limits for Track A Phase A4. Re-open this slice only if the live structured-data
output changes materially or a fresh manual validation pass is explicitly
requested. The next active graph task is now
`/Users/jim/code/personal/new-cv/.agent/prompts/personal-knowledge-graph-track-b-source-of-truth-design.prompt.md`.

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
12. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-cv-metadata-description-proof.md`
13. `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-rich-result-external-validator-evidence.md`
14. `/Users/jim/code/personal/new-cv/docs/architecture/README.md`
15. `/Users/jim/code/personal/new-cv/docs/architecture/content-model.md`

## Grounding truths to preserve

- The live parent authority is `personal-knowledge-graph-roadmap.plan.md`.
- Track A comes first. Track B remains required but is not the active task.
- Track A Phase A1, A2, and A3 are complete.
- Track A Phase A4 is complete for the current publication surface.
- The negotiated media-type slice, home-page emitted-channel proof slice,
  manifest proof slice, and CV metadata description proof slice are complete.
- Do not start a new audit.
- External-validator evidence is already recorded for Track A Phase A4.
- The home-page Schema.org Validator code-mode proof has already been captured.
- The remaining task from this handoff was to determine whether the remaining
  `/cv/` Schema.org result and Google Rich Results Test verdicts could be
  captured cleanly or had to be recorded as current tool-side limits.
- That decision is now recorded: the remaining `/cv/` Schema.org result and
  Google Rich Results Test verdicts are accepted validator-side limits for this
  slice.
- Visible HTML still comes from `content/cv.content.json` and
  `content/frontpage.content.json`.
- The graph currently drives JSON-LD, the manifest, and some metadata.
- No compatibility layers, no stub-preservation docs, no edits under
  `.agent/plans/complete/`.
- Proof is required.

## Start from the live execution handoff

- begin with the existing Track A proof record, not with new enrichment
- continue from
  `graph-rich-result-external-validator-evidence.md`, not from the older A3
  proof notes alone
- do not re-capture the already-recorded home-page Schema.org code-mode pass
  unless a validator or deployment change makes that necessary
- keep Track A / Track B boundaries explicit
- record outcomes and limitations in a discoverable research note if the work
  adds new evidence

## Before editing

- confirm which current inline JSON-LD claims are rich-result-facing and in
  scope for Track A external validation
- confirm which validators are relevant and what each one can truthfully prove
- identify the smallest truthful documentation update needed to record the
  external evidence
- keep the current rendering truth explicit: visible HTML is not graph-derived

## Likely relevant files

- `/Users/jim/code/personal/new-cv/.agent/plans/current/personal-knowledge-graph-execution.plan.md`
- `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-publication-consumer-and-proof-model.md`
- `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-publication-output-audit.md`
- `/Users/jim/code/personal/new-cv/.agent/plans/research/graph-cv-metadata-description-proof.md`
- `/Users/jim/code/personal/new-cv/e2e/behaviour/seo.e2e-api.test.ts`
- `/Users/jim/code/personal/new-cv/lib/page-document-contract.integration.test.ts`

## Do the work

- validate the inline graph outputs for `/` and `/cv/` with the appropriate
  external tools
- record what newly succeeded, what still could not be proven, and whether the
  remaining gaps are now best treated as validator-side limits
- update the live Track A docs only if the new external evidence changes
  recorded status or next steps
- update `/Users/jim/code/personal/new-cv/.agent/memory/napkin.md` with
  mistakes, corrections, and what was learned

## Proof requirements

- if no product or rendering changes are needed, explain why the visual
  regression harness was not required
- if fixing any validator-discovered issue changes metadata wiring, graph
  plumbing, page composition, or other rendered-output infrastructure, run
  `pnpm visual-regression-harness HEAD WORKTREE` during implementation
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
- what additional external validator evidence was added for `/` and `/cv/`
- whether Track A Phase A4 status changed
- what proof gaps or accepted validator limits remain after this slice
- whether any stakeholder decision is still needed
