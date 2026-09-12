# Practice transplant — process records

Records from the first wholesale transplant of the OCE Practice lineage into this repo
(2026-09-12). The transplant manifest itself lives where PDR-005 mandates,
[`docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`](../../../docs/explorations/2026-09-12-oce-practice-lineage-transplant.md);
these are the process outputs kept alongside the work.

| Record                                                               | Purpose                                                                                                         | Graduation target                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [efficiency-guidance.md](efficiency-guidance.md)                     | How to run the next transplant efficiently — measured sequence, rules that held, mistakes to design out         | PDR-005 amendment or a Practice-Core runbook |
| [practice-as-installable-thing.md](practice-as-installable-thing.md) | Concept-exploration of packaging the Practice as a standalone installable thing; five proposals with falsifiers | PDR candidate after a second transplant      |

Both are born-sketch explorations: they govern nothing until ratified. Running capture for the
session is in `.agent/memory/active/napkin.md`.

The procedure these records distil is the runbook node
[`.agent/plans/runbooks/practice-lineage-transplant.md`](../../plans/runbooks/practice-lineage-transplant.md),
and the work that makes the next instance (castr) run by that runbook is the delivery node
[`.agent/plans/delivery/castr-lineage-update-preparation.md`](../../plans/delivery/castr-lineage-update-preparation.md).
That node lands this instance's verdict data under `inputs/` here, one file per runbook step that
reads it.
