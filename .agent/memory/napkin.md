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
