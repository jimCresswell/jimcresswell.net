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
| 2026-10-05 | 322 | 2 | 22.07 / 40 | warn | the code landing: opening head `ac72f09c` 184.34 (priced for size), settlement push `b1988de4` 22.07 (nine threads: six cured, three observations); two further pushes carried gate cures and one review cure (`d371218b`), unpriced at the survey; the seat's stop round is the second (Crucible binds Slag, 7b999c) | agreed: warn at half on a landing of this size | the family shape and the carries |
| 2026-10-05 | 321 | 2 | 13.98 / 40 | within | the doctrine landing, surveyed merged: opening head `fa4bd8b1` 111.74, settlement push `a9081f17` 13.98; the seat's stop round is the second (Crucible binds Slag, 7b999c) | agreed | the general layer one text |
| 2026-10-05 | 318 | 1 | 0 / 40 | within | closed into 322 with a comment; the opening head `da0e9568` 27.31, no settlement push (Crucible binds Slag, 7b999c) | agreed | carry C24, the specification family |

## Weight changes

| Date | Change | Against which rows | By |
| --- | --- | --- | --- |
| 2026-10-05 | The sibling's policy as carried (floor 3; 0.5 per finding; 0.2 per thousand comment characters; 0.3 per hundred lines; 0.1 per file; relatedness and reactivity weights 1; unit 20 per push; warn at half; converging ratio 0.5) | none here yet | Crucible binds Slag, 7b999c |
