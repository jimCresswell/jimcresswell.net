# Plans

Canonical plan-lifecycle lanes live here.

## Lane semantics

- `active/` — the single primary in-progress execution plan.
- `current/` — queued or paused-but-resumable executable plans that are still part of the live stack.
- `future/` — strategic later-intent plans with named promotion triggers.
- `archive/` — completed or superseded historical plan records.
- `research/` — supporting investigations and audits; not a lifecycle lane.

## Working rules

1. Keep exactly one primary plan in `active/`.
2. When focus changes, move the old active plan to `current/` or `archive/` as appropriate.
3. Update [`active/README.md`](active/README.md), [`roadmap.md`](roadmap.md), and any parent-plan tables in the same pass.
4. Keep loose root-level plan files out of this directory; plans belong in a lifecycle lane.
