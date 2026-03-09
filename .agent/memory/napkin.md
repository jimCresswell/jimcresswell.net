# Napkin

## Session: 2026-03-08 — Harness Artefact Approval and Icebox Split

### What Was Done

- Closed the historical PKG proof loop by recording the remaining
  harness review items as explicitly approved categories:
  page-level JSON-LD additions and the deliberate `/cv/` canonical
  metadata correction
- Moved the harness proof record into
  `.agent/plans/complete/visual-regression-harness.plan.md`
- Created `.agent/plans/icebox/` and moved non-active future work there,
  including the new harness-enhancements plan and the Neo4j migration
  plan
- Updated the PKG plans, roadmap, harness README, and related cross-links
  so they now treat the visual proof as closed and the enhancement work
  as icebox only
- Rotated the overgrown napkin to
  `.agent/memory/archive/napkin-2026-03-08.md`

### Patterns to Remember

- If a plan's live closure work is done, do not leave speculative
  enhancements inside it. Split them into an icebox plan so the active
  or completed plan describes reality rather than possibility.
- A harness review item can be closed by explicit approval when the diff
  is intentional, non-visual, and backed by product-owned validation.
  Approval is a documented decision, not a silent ignore rule.

## Session: 2026-03-09 — Deep Plan and Prompt Consolidation

### What Was Done

- Audited the current PKG plans, the archived/complete plans, and the
  prompt files for stale status markers, broken cross-links, and durable
  content still living only in ephemeral places
- Fixed plan-directory reorg fallout where `current/` plans still linked
  to `complete/` and `research/` as if they were siblings
- Updated the PKG execution, implementation, historical-design, and
  parent editorial plans so they all agree that the harness proof is
  closed and that the remaining PKG Phase 4 work is manual validator
  follow-up plus Phase 5
- Archived the superseded `pkg-next-closure_c4586ceb.plan.md` handoff
  into `complete/` so it no longer looks like active work
- Aligned `start-right.prompt.md` with the canonical `jc-start-right`
  command, including the excellence-over-expediency wording

### Patterns to Remember

- After reorganising a plans tree into `current/`, `complete/`,
  `icebox/`, and `research/`, do a relative-link audit from the point of
  view of each file's directory. Root-relative habits leave quiet broken
  links inside otherwise-correct docs.
- Superseded handoff notes should not stay under `current/`. If their
  live work has been absorbed elsewhere, move them out of the active
  directory and relabel them as historical context.

## Session: 2026-03-09 — DRY Ownership Cleanup

### What Was Done

- Made `.agent/prompts/start-right.prompt.md` the canonical start-right
  workflow and reduced `.agent/commands/jc-start-right.md` to a thin
  wrapper
- Reduced PKG live-status duplication by making the execution plan the
  explicit owner of mutable status, while the implementation plan,
  parent plan, and roadmap now summarise and point

### Patterns to Remember

- Deliberate repetition is fine when it reinforces norms for different
  audiences or decision points. The DRY problem appears when two files
  both own the same mutable workflow or live status.
- For plan stacks, keep one mutable execution source and let parent,
  roadmap, and implementation docs summarise structure and intent rather
  than restating current gate or proof details.

## Session: 2026-03-09 — One Current PKG Plan

### What Was Done

- Reduced the PKG plan set in `.agent/plans/current/` to a single live
  plan: `personal-knowledge-graph-execution.plan.md`
- Moved the historical design working document to
  `.agent/plans/research/personal-knowledge-graph-design-notes.md`
- Moved the full phase model and acceptance-criteria document to
  `.agent/plans/complete/personal-knowledge-graph-phase-model.plan.md`
- Rewired references across roadmap, parent plans, LinkedIn reference
  plan, PKG skill docs, reviewer docs, the Neo4j icebox plan, and older
  completed plans so the new topology resolves cleanly

### Patterns to Remember

- The right simplification is often one current plan, not one document
  total. Live execution, archived phase models, and historical design
  notes serve different jobs and should not all compete inside
  `current/`.
