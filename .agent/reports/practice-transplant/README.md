# Practice transplant — process records

Records from the first wholesale transplant of the OCE Practice lineage into this repo
(2026-09-12). The transplant manifest itself lives where PDR-005 mandates,
[`docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`](../../../docs/explorations/2026-09-12-oce-practice-lineage-transplant.md);
these are the process outputs kept alongside the work.

| Record                                                               | Purpose                                                                                                         | Graduation target                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [efficiency-guidance.md](efficiency-guidance.md)                     | How to run the next transplant efficiently — measured sequence, rules that held, mistakes to design out         | PDR-005 amendment or a Practice-Core runbook |
| [practice-as-installable-thing.md](practice-as-installable-thing.md) | Concept-exploration of packaging the Practice as a standalone installable thing; seven proposals with falsifiers, scored at the closure | PDR candidate after a second transplant      |
| [journey-so-far.md](journey-so-far.md)                               | An understanding of the journey to date: the spine, three frames and a counterframe, bridge claims, status | Reopened after the 57-lesson synthesis or the next transplant |
| [what-the-practice-is.md](what-the-practice-is.md)                   | The Practice defined by nine functions, the transplant set that follows, and what this transplant failed to migrate by evidence class (owner-asked 2026-09-13; provisional) | The `practice-completion` node's completeness audit |
| [practice-language-separation.md](practice-language-separation.md)   | The universal Practice and its language packs: the measured leakage, the three kinds of instrument contract, six proposals with falsifiers (owner-directed 2026-09-13; provisional) | The `practice-language-separation` node; a PDR amendment candidate |
| [generalisations.md](generalisations.md)                                 | The generalisation register: every move that made a Practice element more general or portable, with its commit and lineage status (owner-directed 2026-09-13; append-only) | Contributions back, the update from the lineage, the next transplant, the extraction |
| [best-of-each-practice-draft-v5.md](best-of-each-practice-draft-v5.md) | UNRATIFIED joint draft by the two exchange seats: the definition of "the best of each Practice" and the shared plan, assembled whole for the owner's ratification (owner-directed 2026-09-21) | PDR-142 in the Core and a strategic plan node; this draft is removed on ratification |

## The record, compiled (closure item 7)

The transplant's record is four documents read in this order: **what** the Practice is,
[what-the-practice-is.md](what-the-practice-is.md) (nine functions, each row with its proof);
**how** it was brought over, the runbook
[`practice-lineage-transplant.plan.md`](../../plans/runbooks/practice-lineage-transplant.plan.md)
(its step 13 cites the nine functions as its completeness audit); **why** it went the way it
went, [journey-so-far.md](journey-so-far.md); and **how the next one is faster**,
[efficiency-guidance.md](efficiency-guidance.md). The closure's decisions and their evidence
are in the Director's handoff `.agent/memory/operational/director-handoff.md` §Decisions
overnight (the numbered items) and §Routing log; the closure's completion entry is on the `practice-lineage.md` chain of
`.agent/practice-core/provenance.yml`.

The five explorations are born sketch and govern nothing until ratified; the register is a live
append-only record. Running capture for
the session is in `.agent/memory/active/napkin.md`.

The procedure these records distil is the runbook node
[`.agent/plans/runbooks/practice-lineage-transplant.plan.md`](../../plans/runbooks/practice-lineage-transplant.plan.md),
and the work that completes the Practice here and lands the instruments for the next instance
is the delivery node
[`.agent/plans/delivery/practice-completion.plan.md`](../../plans/delivery/practice-completion.plan.md)
(ratified 2026-09-13). That node lands this instance's verdict data under `inputs/` here, one
file per runbook step that reads it. The first is the loss-scan (runbook step 13, the fourth
audit): `inputs/loss-scan-dispositions.sh` computes a disposition for every file of the
pre-transplant archive against the live tree, and `inputs/loss-scan-dispositions.tsv` is its
2026-09-13 output.
