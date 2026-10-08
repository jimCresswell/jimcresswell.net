---
fitness_line_target: 200
fitness_line_limit: 300
fitness_char_limit: 60000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'every row is live while the gate''s weights are calibrated against it; rows older than the last weights change graduate into that change''s row, then archive to a dated file proven byte-identical (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: mostly-append-register
---

# Review Cost Ledger

The record the review cost gate is calibrated against (`agent-tools review-cost`, received from OCE
in the code landing of `practice-alignment-by-class`, 322, 2026-10-05, where the gate first ran on
this estate's push hook). The gate's weights are an experiment, not a constant: every session's wrap
runs `review-cost survey --since <session start>` and appends one row per pull request the session
touched: the survey's numbers, the seat's reading of the round the loop should have stopped at, and
whether the gate agreed, fired early or fired late. The owner's correction on a row is the
calibration label. The weights change only against this ledger, and every change is a row in the
changes table; the sibling's ledger carries the weights' history since 2026-09-12 and this estate's
gate runs the same policy.

## Rows

| Date | PR | Rounds | Settlement cost / budget | Verdict | Seat's stop round | Gate | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-10-05 | 320 | 2 | 22.65 / 40 | warn | the coordination fold: opening head `2d8a7bca` 268.76 (priced for size, the day's records and the archived nodes), settlement push `dd120a8f` 22.65 (seven threads over two rounds: five cured, two deferred to the successor's first commit); the seat's stop round is the second (Sycamore holds Spore, 18d874) | agreed | the fold of the alignment node's finish |
| 2026-10-08 | 323 | 2 | 16.05 / 40 | within | the coordination fold: opening head `bffe11ff` 19.9 (fifteen Copilot findings: five on the lane's public records identifying private editorial material, two stale continuity pointers, an identity row, two fact cures, two doctrine contradictions cured in the thread README, two declined with reasons), settlement push `210c4adb` 16.05 (one finding, the container's "every field" sentence, routed to the lane seat); the seat's stop round is the second (Cedar turns Grove, 1950d1, the fold run by its fork) | agreed | the fold of the LinkedIn lane's records; the records pass before the ready-mark was skipped and the fifteen findings were its price |
| 2026-10-05 | 322 | 7 | 62.74 / 120 (6 pushes, the one PDR-140 rebudget) | warn | the code landing, surveyed merged: six settlement pushes from the opening head (`15804f7a` 6.12, `a3635494` 8.18, `159b5d95` 8.89, `aeb49538` 6.54 the rebudgeted one); the seat's stop round is the fifth (`159b5d95`): the sixth carried three correctness cures the sampling reviewer found on changed code, a class half-cured in the fifth; after it signed lines only (Sycamore holds Spore, 18d874) | fired at the sixth push as the ledger prices it (cost 55.86 of 40 at rounds 6); agreed that a landing of this size under a sampling reviewer needs the rebudget, not a defect class | the family layer merged; the alias fail-closed remainder to a follow-up |
| 2026-10-05 | 321 | 2 | 13.98 / 40 | within | the doctrine landing, surveyed merged: opening head `fa4bd8b1` 111.74, settlement push `a9081f17` 13.98; the seat's stop round is the second (Crucible binds Slag, 7b999c) | agreed | the general layer one text |
| 2026-10-05 | 318 | 1 | 0 / 40 | within | closed into 322 with a comment; the opening head `da0e9568` 27.31, no settlement push (Crucible binds Slag, 7b999c) | agreed | carry C24, the specification family |

## Weight changes

| Date | Change | Against which rows | By |
| --- | --- | --- | --- |
| 2026-10-05 | The sibling's policy as carried (floor 3; 0.5 per finding; 0.2 per thousand comment characters; 0.3 per hundred lines; 0.1 per file; relatedness and reactivity weights 1; unit 20 per push; warn at half; converging ratio 0.5) | none here yet | Crucible binds Slag, 7b999c |
