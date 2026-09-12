---
name: pkg-next-closure
overview: Historical PKG closure handoff retained so the intermediate closure reasoning is not lost. Archived once its live work was absorbed into the PKG execution plan and the completed harness proof record.
todos:
  - id: preserve-historical-reasoning
    content: Preserve the intermediate closure reasoning that informed the final PKG proof workflow.
    status: completed
  - id: transfer-live-work
    content: Transfer active closure work to the PKG execution plan and the completed visual regression harness plan.
    status: completed
  - id: archive-handoff
    content: Archive this superseded handoff outside `current/` so it no longer reads as live work.
    status: completed
isProject: false
---

# PKG Next Steps (Historical Handoff)

## Status

Historical handoff note, archived on 2026-03-09. Superseded by:

- [graph-metaplan.plan.md](graph-metaplan.plan.md) and [graph-current-state-audit.md](../research/graph-current-state-audit.md) for current graph authority
- [visual-regression-harness.plan.md](visual-regression-harness.plan.md) for the completed harness proof record

This file is retained because it captured intermediate closure reasoning that should not be thrown away. The phases below are preserved as historical context, not as the active work queue.

## Overview

The next PKG work should close the gap between `code complete` and `actually proven complete`.

Two decisions are now fixed and must govern the work:

- Regression proof is **both** `pixel comparison` and `HTML/DOM comparison`.
- The default expectation is **no rendered differences at all**. This is infrastructure refactoring, not visible change.
- If any difference appears and looks potentially legitimate, stop and bring it to Jim before accepting or normalising it.
- Entity-level and role-anchor HTML binding are still part of PKG completion, not deferred.

## Current Reality

The current graph authority is [graph-metaplan.plan.md](graph-metaplan.plan.md)
with the supporting [current-state audit](../research/graph-current-state-audit.md).
The adopted execution authority now lives in
[current/personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md).
This archived handoff remains for historical reasoning rather than as a live work queue.

Current proof status:

- A reusable, non-destructive ref-to-ref harness now lives in `visual-regression-harness/`.
- The CLI entrypoint is `pnpm visual-regression-harness <base-ref> <target-ref>`.
- The harness resolves refs read-only, exports them with `git archive`, builds them in temporary directories, captures full-page screenshots plus HTML artifacts, and writes durable output only under `regression-artifacts/`.
- The next harness improvement should make durable artifact directories commit-addressed rather than label-addressed, and should let repeat runs reuse artifacts already captured for the exact same resolved commits.
- The first real comparison run was `pnpm visual-regression-harness b76824a HEAD`.
- That run produced **HTML/DOM differences but no pixel diff images**. The current evidence points to DOM-only drift rather than visible rendering drift.
- The captured diffs show at least one concrete cause already: section-level `id` attributes such as `id="positioning"` and `id="experience"` exist in `HEAD` but not in the pre-PKG baseline.
- This means the harness has already surfaced a live review decision for Jim: whether those DOM-only changes are acceptable as part of the PKG refactor, or whether they violate the zero-difference rule and must be removed/reworked.

Current implementation sources to lean on:

- [content/entities.json](../../content/entities.json): canonical PKG graph source.
- [lib/entities.ts](../../lib/entities.ts): parse-time validation and typed access.
- [lib/subgraph.ts](../../lib/subgraph.ts): graph traversal and dangling-ref checks.
- [lib/page-jsonld.ts](../../lib/page-jsonld.ts): page-level subgraph derivation.
- [components/page-section.tsx](../../components/page-section.tsx): only section-level HTML binding exists today.
- [app/page.tsx](../../app/page.tsx), [app/cv/page.tsx](../../app/cv/[variant]/page.tsx): current page JSON-LD integration points.
- [visual-regression-harness/README.md](../../visual-regression-harness/README.md): usage, artifact layout, and safety guarantees for the harness.
- [visual-regression-harness/cli.ts](../../visual-regression-harness/cli.ts): CLI entrypoint for ref-to-ref comparison.

Docs that need to stay aligned with reality:

- [roadmap.md](../roadmap.md)
- [personal-knowledge-graph-design-notes.md](../research/personal-knowledge-graph-design-notes.md)
- [personal-knowledge-graph-phase-model.plan.md](personal-knowledge-graph-phase-model.plan.md)
- [graph-metaplan.plan.md](graph-metaplan.plan.md)
- [docs/architecture/README.md](../../docs/architecture/README.md)
- [docs/architecture/content-model.md](../../docs/architecture/content-model.md)

## Phases

### Phase 1: Regression Harness and Baseline Proof

Goal: create a formal before/after proof that PKG refactoring has had no effect on rendered pages.

Intended impact:

- Turns an unverified assumption into an auditable proof.
- Establishes a hard guardrail before any further PKG completion work.

Acceptance criteria:

- A trusted pre-PKG baseline is identified from commit `b76824a` using a safe non-destructive export or checkout approach.
- The proof covers `/`, `/cv`, and `/cv/public_sector` at minimum.
- HTML/DOM comparison shows no rendered differences.
- Pixel comparison shows no rendered differences.
- Any observed difference is treated as a blocker and escalated to Jim before proceeding.
- The current known DOM-only differences from section-level IDs are explicitly resolved one way or the other, not silently normalised.

Tasks:

1. Define the regression harness and artifact format.
   Impact: future runs are repeatable, not ad hoc.
   Acceptance criteria: the plan names where DOM snapshots, screenshots, and comparison outputs live, and which pages/sections are in scope.
2. Capture or reconstruct the pre-PKG baseline safely.
   Impact: comparisons are tied to the actual pre-migration site, not memory.
   Acceptance criteria: baseline comes from `b76824a` via a non-destructive export path; the current worktree and git history stay untouched.
3. Implement the proof tests in TDD order.
   Impact: regression proof becomes executable rather than narrative.
   Acceptance criteria: failing tests exist first, current tree is then brought to green, and both DOM and pixel checks are runnable locally.
4. Improve artifact identity and reuse.
   Impact: repeated proof runs become cheaper, clearer, and less error-prone.
   Acceptance criteria: durable artifact directories are keyed by resolved commit SHAs; the harness can detect when the exact base/target artifact sets already exist on disk and reuse them rather than rebuilding and recapturing unnecessarily.

### Phase 2: Complete HTML Binding Scope

Goal: finish the still-missing entity-level and role-anchor binding promised by the design docs.

Intended impact:

- Brings implementation back into line with [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) and the historical design notes.
- Makes graph identity visible in the DOM at section, entity, and role levels.

Acceptance criteria:

- Section-level binding remains intact.
- Entity-level IDs are present where PKG entities are rendered.
- Role-anchor IDs match the PKG `@id` fragment scheme for rendered role entries.
- No rendered-page differences are introduced; the Phase 1 DOM and pixel proof remains green.
- If existing or new binding introduces DOM-only differences, those differences are reviewed with Jim before they are accepted.

Tasks:

1. Map rendered entities to the current component seams.
   Impact: binding is added at the right layer rather than patched in ad hoc.
   Acceptance criteria: the implementation approach is explicit across [components/cv-layout.tsx](../../components/cv-layout.tsx), [components/article-entry.tsx](../../components/article-entry.tsx), and any page-level wrappers actually rendering the entities.
2. Add tests first for binding behaviour.
   Impact: keeps the binding work inside repo TDD rules.
   Acceptance criteria: tests prove expected IDs appear for representative sections, entities, and roles before implementation is changed.
3. Implement binding and immediately re-run full regression proof.
   Impact: catches any accidental UI drift at once.
   Acceptance criteria: HTML/DOM and pixel proof both remain at zero differences.

### Phase 3: Manual Structured-Data Validation and Documentation Sync

Goal: close remaining Phase 4 validation work and remove drift between plans, architecture docs, and actual implementation.

Intended impact:

- Makes PKG status truthful and durable.
- Ensures permanent docs describe the actual entity-model pipeline and binding scope.

Acceptance criteria:

- Schema.org Validator results are recorded.
- Rich Results Test results are recorded.
- Any discrepancy between validator output and expectations is either fixed or escalated to Jim.
- Plans and architecture docs clearly say that rendered-page differences are not expected from PKG refactoring.
- Docs no longer imply that section-only binding completed the whole HTML-binding decision.

Tasks:

1. Run manual validators after the binding work is green.
   Impact: validates the final intended PKG shape, not an intermediate state.
   Acceptance criteria: validator outcomes are captured in the execution plan and reflected in roadmap status.
2. Synchronise drifted docs.
   Impact: a fresh agent can trust the docs again.
   Acceptance criteria: implementation/execution/design/roadmap docs agree on Phase 4 closure state, binding scope, and regression-proof standard; architecture docs match the code paths in [lib/cv-content.ts](../../lib/cv-content.ts) and [app/manifest.ts](../../app/manifest.ts).

### Phase 4: Historical Screenshot Archive

Goal: capture a clean visual archive of the pre-PKG site once the current tree is safely committed.

Intended impact:

- Preserves a trustworthy historical baseline for future comparison.
- Satisfies the existing execution-plan safety requirement.

Acceptance criteria:

- Work happens only after the current tree is committed.
- A non-destructive export path such as `git archive`, or another equally safe no-history-risk checkout approach, is used.
- Full-page and section-level screenshots are captured for all relevant live pages.

### Phase 5: LinkedIn as a Derived View

Goal: start the downstream work only after PKG closure work is actually complete.

Intended impact:

- Keeps LinkedIn derivation grounded in a stable, validated graph.
- Avoids building new derived content on top of unsettled infrastructure.

Acceptance criteria:

- PKG Phase 4 is genuinely closed first.
- LinkedIn headline/About, experience, and supporting sections derive from graph entities, not parallel manual re-definition.
- Editorial decisions still needing Jim’s input are surfaced explicitly from [linkedin-update.plan.md](../current/linkedin-update.plan.md).

## Reviewer Protocol

After each non-trivial implementation slice, invoke the gateway reviewer and then the relevant specialists.

Required pattern:

- `code-reviewer` after every meaningful change.
- `pkg-reviewer` for entity model, JSON-LD, `@id`, graph binding, or structured-data output.
- `type-reviewer` for type flow, schemas, and ID-propagation changes.
- `test-reviewer` whenever tests are added or changed.
- `editor` for any user-facing wording, validation notes, or LinkedIn-derived content.

Minimum review checkpoints:

1. After regression harness creation.
2. After HTML binding implementation.
3. After manual-validation/doc-sync changes.
4. After each LinkedIn content slice.

## Guardrails

- Treat PKG render preservation as a hard requirement: **no rendered-page differences expected**.
- Do not silently whitelist or normalise differences.
- If metadata-only differences or any other exceptions seem necessary, stop and review them with Jim first.
- Re-read [.agent/directives/AGENT.md](../../directives/AGENT.md), [.agent/directives/principles.md](../../directives/principles.md), and [.agent/directives/testing-strategy.md](../../directives/testing-strategy.md) before each phase.
- Run full gates after each implementation piece, then reviewer passes, then update the execution doc before moving on.
