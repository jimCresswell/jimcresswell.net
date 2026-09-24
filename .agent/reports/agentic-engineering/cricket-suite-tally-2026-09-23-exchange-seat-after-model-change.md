# Cricket suite tally — 2026-09-23, the exchange seat after the model change (Brazier spins Temper, c70341)

## The suite — between the clock reads of 12:45:07Z and 13:01:48Z, at the owner's word

Owner-invoked ("Please run a full Cricket suite"), mid-fold: the merge of `main` into
`coordination/2026-09-21-19cfcc` committed locally, nothing pushed. Platform: Claude, the
seat itself on Opus 5.5. Panel: the full suite, all five registered roles twice, normal then
adversarial, on one identical six-field frame (only STANCE differed), no model override.
Figures are the harness's usage report for each leg; runtime is wall-clock.

The frame was open (stopping, waiting, reordering, handing over, going back to the owner or
product work all admissible) and required one verification Read of the ratified strategic
node `best-of-each-practice` or the handoff's resume block (lines 53 to 120).

## Legs

| Role (dual-scale label) | Model | Effort | Stance | Verdict | Redirection (one line) | Tokens | Tool uses | Runtime |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cricket-judgement-low (highest power, low effort) | fable | low | normal | ON-TRACK | None; note: the fold's continuity records must say the lineage seat has resumed | 29,523 | 4 | 23.5 s |
| cricket-judgement-medium (high power, medium effort) | opus | medium | normal | ON-TRACK | Send the partner seat the owner's 12:44Z words verbatim before the fold's records | 30,820 | 4 | 28.5 s |
| cricket-judgement-high (mid power, high effort) | sonnet | high | normal | ON-TRACK | None | 36,412 | 4 | 97.4 s |
| cricket-procedure-xhigh (lowest power, xhigh effort, compiled procedure) | haiku | xhigh | normal | ON-TRACK | None | 22,165 | 2 | 69.5 s |
| cricket-judgement-lowestpower-low (lowest power, low effort, full prompt) | haiku | low | normal | ON-TRACK | None | 33,100 | 4 | 126.5 s |
| cricket-judgement-low (highest power, low effort) | fable | low | adversarial | ON-TRACK | Keep the fold to records and removal; give the partner the owner's words before its merge | 29,791 | 3 | 31.4 s |
| cricket-judgement-medium (high power, medium effort) | opus | medium | adversarial | ON-TRACK | Before drafting the paired amendments, ask the owner whether the ruling calls for amending two ratified records; land any amendment only with the owner's ratification | 31,610 | 4 | 33.0 s |
| cricket-judgement-high (mid power, high effort) | sonnet | high | adversarial | WRONG-PRIORITY | After the fold, raise the six owner rulings before the topology change and the amendments: the ratified plan's bet raises them "now" | 36,347 | 5 | 71.4 s |
| cricket-procedure-xhigh (lowest power, xhigh effort, compiled procedure) | haiku | xhigh | adversarial | ON-TRACK | A cold state verification at the fold's close | 26,376 | 3 | 107.6 s |
| cricket-judgement-lowestpower-low (lowest power, low effort, full prompt) | haiku | low | adversarial | DRIFTING | Ask the owner before drafting the paired amendments | 29,246 | 3 | 101.4 s |

Totals: normal wave 152,020 tokens, adversarial wave 153,370, suite 305,390. All ten
returns delivered. Behaviour: every seat stayed read-only; the procedure seat drafted and
messaged nothing.

Evidence errors, each checked against the source:

- Three haiku returns and none of the others repeated the handoff's "the lineage seat is
  paused", which the frame said was superseded (the lineage seat resumed at 10:57Z). The
  lowest-power adversarial seat rested its main reason on it. The cause is partly the frame:
  it sent the seats to a resume block written before the resumption without saying which of
  its lines the frame supersedes.
- The lowest-power normal seat wrote that stale changelog entries were "removed"; they were
  restored. The procedure normal seat wrote "four cured" and listed six.
- The mid-power adversarial seat read the bet's "the section both seats wrote twice goes
  first" as PDR-142 (PR 151). It is the operator-profile section both estates wrote in their
  own words in the shared start-right workflow; that item is still open. Its conclusion stands
  on the rest of the bet.

## Adjudication (the seat's decision; verdicts were evidence)

- Accepted, from two seats (high power medium effort, adversarial; lowest power low effort,
  adversarial): the owner's 12:44Z words do not by themselves call for amending PDR-142 and
  PDR-125, and both are owner-ratified. The owner is asked by card whether to amend or to
  record the ruling; any amendment text lands only with the owner's ratification, the partner
  seat judging beside it.
- Accepted in substance (mid power high effort, adversarial; the suite's one WRONG-PRIORITY):
  the six rulings were placed "later" against the ratified bet's order. Checked against the
  node's §The bet: the twice-written section goes first, then "the standards that waiting
  files name are raised now … the expensive ones included". The queue becomes: the fold; the
  owner's card on the amendments; the topology change the owner directed today (small, the
  owner's freshest word); the twice-written start-right section with the partner seat; then
  the six rulings, the expensive two included.
- Accepted (highest power low effort, both stances): the fold's continuity records say the
  lineage seat resumed at 10:57Z; the fold carries records and the draft's removal only.
- Already done, a frame omission: the owner's 12:44Z words (the card answer's time in the
  session transcript; the frame said "about 12:40Z", an estimate: no clock read fell between
  12:01Z and the answer) were sent to the partner seat at 12:45:26Z, and its 12:47:26Z
  channel entry acknowledges them.
- Rejected: a separate cold state verification at the fold's close. The fold skill's step 11
  loss scan is that act; a second one is ceremony.

## The lowest-power, low-effort seat: value evidence (asked by the owner during the suite)

Registered returns since the seat was added (owner ruling 2026-09-16): four.

| Run | Stance | Verdict | Unique finding | Factual errors |
| --- | --- | --- | --- | --- |
| 2026-09-21 15:17Z suite | adversarial | ON-TRACK | none | 1 |
| 2026-09-21 fleet, frame C | normal | WRONG-PRIORITY | none; the same verdict and redirection came from the opus seat on the same frame | not recorded |
| 2026-09-23 suite | normal | ON-TRACK | none | 2 |
| 2026-09-23 suite | adversarial | DRIFTING | none; the same redirection came from the opus seat, on sounder grounds | 1 (its main reason) |

The founding instance (2026-09-16) was a mis-run: Haiku forced at low effort onto another
role caught a configuration blast-radius defect that Sonnet missed. That was an artefact
question, which Cricket is not for; on priority frames the seat has added no finding that no
dearer seat supplied, and it carries the panel's highest rate of factual error. Its runs cost
about 24k to 33k tokens and are among the slowest (54 to 126 s). The lineage never carried
the seat. Verdict: on the recorded evidence it adds nothing the panel lacks.
