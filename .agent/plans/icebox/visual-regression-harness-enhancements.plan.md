# Icebox: Visual Regression Harness Enhancements

## Status

Icebox. These are potential future improvements, not current work.
Promote them back into an active plan only when there is a concrete
need.

## Overview

The current harness already closes the historical PKG proof work.
The items below are quality-of-life or scaling enhancements for later,
not blockers for the present repo state.

## Candidate enhancements

### 1. Commit-addressed artifact directories

Goal:

- key durable artifact directories by resolved commit SHA rather than by
  user-supplied ref labels

Value:

- repeated comparisons of the same commits land in the same place
- branch aliases stop creating duplicate artifact trees

Acceptance criteria:

- the output directory is stable for equivalent resolved commits
- `comparison.json` still records both requested refs and resolved SHAs

### 2. Per-commit capture reuse

Goal:

- reuse existing captured artefacts for a resolved commit instead of
  exporting, building, and capturing from scratch every time

Value:

- repeated comparisons get materially faster
- target-only work can reuse the baseline side

Acceptance criteria:

- a second run against an already captured commit reuses that side
- reused artefacts are byte-identical to the prior capture

### 3. `--force` regeneration

Goal:

- bypass reuse and force a fresh export/build/capture when required

Value:

- stale or suspicious artefacts can be regenerated without manual
  directory cleanup

Acceptance criteria:

- `--force` always regenerates captures
- the default path reuses captures once reuse exists

## Promotion rule

Do not pull this work back into an active plan unless:

- the current harness behaviour is insufficient for a real task
- the need is concrete rather than speculative
- the active proof work has already been closed

## Related

- [Completed harness plan](../complete/visual-regression-harness.plan.md)
- [visual-regression-harness/README.md](../../visual-regression-harness/README.md)
