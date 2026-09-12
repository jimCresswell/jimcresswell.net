# Plans

Canonical plan-lifecycle lanes live here.

## Lane semantics

- `active/` — the single primary in-progress execution plan.
- `current/` — queued or paused-but-resumable executable plans that are still part of the live stack.
- `future/` — strategic later-intent plans with named promotion triggers.
- `archive/` — completed or superseded historical plan records.
- `research/` — supporting investigations and audits; not a lifecycle lane.

## Node-type directories (the ratified plan-node estate)

New plans are nodes typed by directory, per the [plan-node schema](plan-node-schema.md) and the
[templates](templates/README.md): `strategic/` (the outcome and the bet), `delivery/` (one step
of a lane, authored at pickup) and `runbooks/` (a repeatable procedure). The lifecycle lanes above
hold the pre-schema plans until the plan-node migration re-homes them; a node never moves between
directories while live.

## Working rules

1. Keep exactly one primary plan in `active/`.
2. When focus changes, move the old active plan to `current/` or `archive/` as appropriate.
3. Update [`active/README.md`](active/README.md), [`roadmap.md`](roadmap.md), and any parent-plan tables in the same pass.
4. Keep loose root-level plan files out of this directory; plans belong in a lifecycle lane.
