# Cricket suite tally — 2026-09-21, the exchange seat after the compaction (Brazier spins Temper, c70341)

## Suite 1 — 15:11Z to 15:18Z, at the owner's word

Owner-invoked ("/jc-start-right-team please run a Cricket suite, pick two normal and two
adversarial", 15:04Z, the first message after the compaction landed). Platform: Claude; panel:
four of the five registered Cricket roles, chosen by the seat to span both base templates and
both stances with the off-diagonal seat included, one wave of four concurrent Agent calls on
one identical six-field frame (only STANCE differed). Recorded at occurrence. Per-leg figures
are the harness's usage report for each leg (tokens are the leg's total; runtime wall-clock).

Frame in one line: the three-estate exchange opened on the owner's sixteen rulings of
2026-09-21; four landings on main today; a compaction landed at 15:04:45Z after a full wrap;
the queue in handoff item 119 runs the overdue coordination fold (PR 141), the action pins
(PR 142), the red deps lane and the Dependabot closes, then the exchange's own inbound
landings; Codex out on its usage limit (events 40ce4858, dac869d4); no owner hold.

## Legs (platform / model / effort / stable role / stance)

| Role (dual-scale label) | Model | Effort | Stance | Verdict | Redirection (one line) | Tokens | Runtime |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cricket-judgement-low (Cricket judgement: highest power, low effort, normal frame) | fable | low | normal | ON-TRACK | Keep the re-arm minimal; fire PR 141's Copilot re-request before reading PR 142 so both reviews run in parallel | ~27.3k | ~18 s |
| cricket-procedure-xhigh (Cricket procedure: lowest power, xhigh effort, compiled procedure, normal frame) | haiku | xhigh | normal | ON-TRACK | None (CONSUMER, DISPLACEMENT, GATES, PROPORTION all PASS) | ~36.2k | ~208 s |
| cricket-judgement-medium (Cricket judgement: high power, medium effort, adversarial frame) | opus | medium | adversarial | ON-TRACK | Close Dependabot #132–#136 when PR 142 merges; move the deps-green work behind the inbound landings | ~28.3k | ~26 s |
| cricket-judgement-lowestpower-low (Cricket judgement: lowest power, low effort, full prompt, adversarial frame) | haiku | low | adversarial | ON-TRACK | None | ~28.9k | ~110 s |

Panel shape: one wave of four, identical frame, two stances, owner-chosen shape (not the full
suite of every role twice). All four returns delivered. Behaviour note: the procedure seat
stayed inside the read-only lens (no messaging, no drafting, no write-access request). No leg
spent a verification Read on repository state; each judged the frame as supplied and listed
what it took on trust under UNGROUNDED. One factual error in a leg's evidence: the
lowest-power adversarial seat wrote that PR 141 "carries schema required by exchange inbound
landings"; PR 141 is a records-only fold and the schema landed in PR 138. Its verdict rests on
its other two grounds (the owner's Dependabot instruction; the wrap's deliberate sequence).

## Adjudication (the seat's decision; verdicts were evidence)

- Convergence: four ON-TRACK on the same reading. Items 2 and 4 of the queue are the owner's
  instruction of 2026-09-21; item 3 is forced by `coordination-branch-24h-lifetime`, breached
  by four days; the only hold is a vendor outage with event ids, and it blocks nothing.
- Accepted (highest power, low effort, normal): the PR 141 re-request goes out first so the
  Copilot round runs while the seat works PR 142; the re-arm is the watcher, the heartbeat and
  the claims, nothing wider.
- Accepted in part (high power, medium effort, adversarial): the deps-green work has no forcing
  fact and is the item most likely to swallow hours, so it is capped: if the two named roots do
  not close in one bounded attempt, the lane is parked behind the inbound landings.
- Rejected (the same seat, as worded): closing Dependabot #132–#136 at PR 142's merge. The
  owner's instruction couples the closes to their replacement ("closed and replaced with a
  single upgrade PR"); the replacement cannot exist while the gate is red
  (`local-broken-code-never-leaves`), and a Dependabot PR closed without a replacement is not
  re-opened for the same version. PR 142 replaces no open Dependabot PR: all five open ones are
  package upgrades.
- Ungrounded and now grounded by the seat's own reads at 15:14Z: PR 142's Copilot review is on
  the tip with zero findings and zero threads; PR 141's CI is green on the tip with zero
  unresolved threads and its Copilot review sits on the previous tip.
