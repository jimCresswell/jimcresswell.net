---
name: pkg-next-closure
overview: Close the remaining PKG work by proving the refactor caused no rendered-page changes, completing the still-required HTML binding, running manual structured-data validation, then moving into LinkedIn derivation with specialist review after each implementation slice.
todos:
  - id: prove-no-regression
    content: "Build and record dual regression proof: HTML/DOM comparison plus pixel comparison against the pre-PKG baseline, with zero expected rendered differences and user review for any exception."
    status: in_progress
  - id: complete-html-binding
    content: Implement the still-required entity-level and role-anchor HTML binding, test it first, then re-run the full regression proof and reviewer triage.
    status: pending
  - id: finish-phase4-validation
    content: Run manual Schema.org Validator and Rich Results validation after binding/regression work, record results, and sync plans/docs to the actual PKG state.
    status: pending
  - id: commit-safe-baseline-capture
    content: After current work is committed, capture the full historical visual baseline from the pre-PKG commit using a separate worktree or detached checkout only.
    status: pending
  - id: start-phase5-linkedin
    content: Begin LinkedIn-as-derived-view from the graph, using editorial review and PKG review on each content slice.
    status: pending
isProject: false
---

# PKG Next Steps

## Overview

The next PKG work should close the gap between `code complete` and `actually proven complete`.

Two decisions are now fixed and must govern the work:

- Regression proof is **both** `pixel comparison` and `HTML/DOM comparison`.
- The default expectation is **no rendered differences at all**. This is infrastructure refactoring, not visible change.
- If any difference appears and looks potentially legitimate, stop and bring it to Jim before accepting or normalising it.
- Entity-level and role-anchor HTML binding are still part of PKG completion, not deferred.

## Current Reality

The live handoff document is `[.agent/plans/personal-knowledge-graph-execution.plan.md](/Users/jim/code/personal/new-cv/.agent/plans/personal-knowledge-graph-execution.plan.md)`. It correctly shows Phase 4 as code-complete but not fully closed.

Current implementation sources to lean on:

- `[content/entities.json](/Users/jim/code/personal/new-cv/content/entities.json)`: canonical PKG graph source.
- `[lib/entities.ts](/Users/jim/code/personal/new-cv/lib/entities.ts)`: parse-time validation and typed access.
- `[lib/subgraph.ts](/Users/jim/code/personal/new-cv/lib/subgraph.ts)`: graph traversal and dangling-ref checks.
- `[lib/page-jsonld.ts](/Users/jim/code/personal/new-cv/lib/page-jsonld.ts)`: page-level subgraph derivation.
- `[components/page-section.tsx](/Users/jim/code/personal/new-cv/components/page-section.tsx)`: only section-level HTML binding exists today.
- `[app/page.tsx](/Users/jim/code/personal/new-cv/app/page.tsx)`, `[app/cv/page.tsx](/Users/jim/code/personal/new-cv/app/cv/[variant]/page.tsx)`: current page JSON-LD integration points.

Docs that need to stay aligned with reality:

- `[.agent/plans/roadmap.md](/Users/jim/code/personal/new-cv/.agent/plans/roadmap.md)`
- `[.agent/plans/personal-knowledge-graph.plan.md](/Users/jim/code/personal/new-cv/.agent/plans/personal-knowledge-graph.plan.md)`
- `[.agent/plans/personal-knowledge-graph-implementation.plan.md](/Users/jim/code/personal/new-cv/.agent/plans/personal-knowledge-graph-implementation.plan.md)`
- `[.agent/plans/personal-knowledge-graph-execution.plan.md](/Users/jim/code/personal/new-cv/.agent/plans/personal-knowledge-graph-execution.plan.md)`
- `[docs/architecture/README.md](/Users/jim/code/personal/new-cv/docs/architecture/README.md)`
- `[docs/architecture/content-model.md](/Users/jim/code/personal/new-cv/docs/architecture/content-model.md)`

## Phases

### Phase 1: Regression Harness and Baseline Proof

Goal: create a formal before/after proof that PKG refactoring has had no effect on rendered pages.

Intended impact:

- Turns an unverified assumption into an auditable proof.
- Establishes a hard guardrail before any further PKG completion work.

Acceptance criteria:

- A trusted pre-PKG baseline is identified from commit `b76824a` using a safe separate checkout/worktree approach.
- The proof covers `/`, `/cv`, and `/cv/public_sector` at minimum.
- HTML/DOM comparison shows no rendered differences.
- Pixel comparison shows no rendered differences.
- Any observed difference is treated as a blocker and escalated to Jim before proceeding.

Tasks:

1. Define the regression harness and artifact format.
   Impact: future runs are repeatable, not ad hoc.
   Acceptance criteria: the plan names where DOM snapshots, screenshots, and comparison outputs live, and which pages/sections are in scope.
2. Capture or reconstruct the pre-PKG baseline safely.
   Impact: comparisons are tied to the actual pre-migration site, not memory.
   Acceptance criteria: baseline comes from `b76824a` in a separate worktree or detached checkout; the current worktree stays untouched.
3. Implement the proof tests in TDD order.
   Impact: regression proof becomes executable rather than narrative.
   Acceptance criteria: failing tests exist first, current tree is then brought to green, and both DOM and pixel checks are runnable locally.

### Phase 2: Complete HTML Binding Scope

Goal: finish the still-missing entity-level and role-anchor binding promised by the design docs.

Intended impact:

- Brings implementation back into line with [ADR-014](/Users/jim/code/personal/new-cv/docs/architecture/decision-records/014-entity-model-design.md) and the design reference.
- Makes graph identity visible in the DOM at section, entity, and role levels.

Acceptance criteria:

- Section-level binding remains intact.
- Entity-level IDs are present where PKG entities are rendered.
- Role-anchor IDs match the PKG `@id` fragment scheme for rendered role entries.
- No rendered-page differences are introduced; the Phase 1 DOM and pixel proof remains green.

Tasks:

1. Map rendered entities to the current component seams.
   Impact: binding is added at the right layer rather than patched in ad hoc.
   Acceptance criteria: the implementation approach is explicit across `[components/cv-layout.tsx](/Users/jim/code/personal/new-cv/components/cv-layout.tsx)`, `[components/article-entry.tsx](/Users/jim/code/personal/new-cv/components/article-entry.tsx)`, and any page-level wrappers actually rendering the entities.
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
   Acceptance criteria: implementation/execution/design/roadmap docs agree on Phase 4 closure state, binding scope, and regression-proof standard; architecture docs match the code paths in `[lib/cv-content.ts](/Users/jim/code/personal/new-cv/lib/cv-content.ts)` and `[app/manifest.ts](/Users/jim/code/personal/new-cv/app/manifest.ts)`.

### Phase 4: Historical Screenshot Archive

Goal: capture a clean visual archive of the pre-PKG site once the current tree is safely committed.

Intended impact:

- Preserves a trustworthy historical baseline for future comparison.
- Satisfies the existing execution-plan safety requirement.

Acceptance criteria:

- Work happens only after the current tree is committed.
- A separate worktree or detached checkout is used.
- Full-page and section-level screenshots are captured for all relevant live pages.

### Phase 5: LinkedIn as a Derived View

Goal: start the downstream work only after PKG closure work is actually complete.

Intended impact:

- Keeps LinkedIn derivation grounded in a stable, validated graph.
- Avoids building new derived content on top of unsettled infrastructure.

Acceptance criteria:

- PKG Phase 4 is genuinely closed first.
- LinkedIn headline/About, experience, and supporting sections derive from graph entities, not parallel manual re-definition.
- Editorial decisions still needing Jim’s input are surfaced explicitly from `[.agent/plans/linkedin-update.plan.md](/Users/jim/code/personal/new-cv/.agent/plans/linkedin-update.plan.md)`.

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
- Re-read `[.agent/directives/AGENT.md](/Users/jim/code/personal/new-cv/.agent/directives/AGENT.md)`, `[.agent/directives/rules.md](/Users/jim/code/personal/new-cv/.agent/directives/rules.md)`, and `[.agent/directives/testing-strategy.md](/Users/jim/code/personal/new-cv/.agent/directives/testing-strategy.md)` before each phase.
- Run full gates after each implementation piece, then reviewer passes, then update the execution doc before moving on.
