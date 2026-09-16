# Why the transplant arc cost what it cost (2026-09-15)

A retrospective on the lineage-Practice transplant and its closure, 2026-09-12 08:09Z to
2026-09-15 11:24Z, run at the owner's word by Cauldron herds Lustre (880ff9) under the
`retrospective` skill as a Parallax inquiry at standard depth. Every number was recomputed from
primary sources on 2026-09-15; the appendix says how. Status: **provisional** (see §Epistemic
profile).

## The answer in brief

**Read this section with §Corrections after the fact (2026-09-16):** five figures below and
one platform claim in §Proposal 10 were corrected after publication, by a tool built to make
the counting structural and by reading an implementation instead of its documentation.

- **The cost.** About 60 agent-active hours across four seats (10.3 in the lead seat to the
  monorepo and transplant, #53; about 50 for the closure); 38 merged pull requests (#53 to #91,
  #59 closed); 133 Copilot reviews, 595 suppressed findings and 245 threads; 6,662 model calls
  and 8.35M output tokens; 193 owner messages and 97 card questions; 78.6 wall hours for the
  lead seat. The owner opened with "an hour at most" and rejected the agent's 26 to 40 hour
  estimate.
- **Scope was the largest driver, and it was never re-costed.** The mechanical transplant took
  about the hour the owner expected (the plan of record's §Hour 1). The rest was the scope the
  owner's rulings set: the entire Practice, the rules triage, the eight closure items, nothing
  hand kept. Across sixteen manifest ruling rounds and the closure's cards, no seat restated
  the cost as the scope grew.
- **The records stream was the largest avoidable cost.** Twelve records-only pull requests
  carried 1.4% of the added lines and drew 43% of Copilot reviews, 56% of suppressed findings
  and 45% of threads.
- **The review loop was chosen, and the estate already priced it.** `main`'s ruleset does not
  review on push; #62's twenty-one Copilot reviews were twenty-one explicit requests, one every
  ten to twelve minutes for four hours. PDR-140 ("pushes are the rationed unit"; a records-class
  loop terminates on merit) entered this estate in the transplant commit on 2026-09-12 and was
  never applied to its own pull requests.
- **Usage limits set the elapsed days.** About 17.6 of the lead seat's 78.6 wall hours were
  stalls on the account's limit, both seats stopping at the same instants; the median context
  per model call was 382K tokens in the lead seat and 486K in lane A.
- **The arc contains its own cheaper segments**: records frozen at open; six single-fix code
  pull requests (#64 to #69) at 1.5 reviews each; two seats merging four times faster per
  seat-hour than four.

## Charter (Parallax)

- **Inquiry**: `retro-transplant-arc-2026-09-15`, revision 1; artefact revision 1.
- **Execution**: emulated-reduced (the Parallax siblings emulated in one context); pass A in the
  lead seat's context; pass B a protected subagent pass that did not see pass A's framing.
  Independence: shared primary sources and model family; pass B's loaded memory index carried
  the owner's 2026-09-15 records card, which it disclosed.
- **Question**: why did the arc cost what it cost against the owner's opening expectation;
  which causes were within the estate's control; what would most reduce the next instance's
  cost?
- **Claim types**: causal, interpretive, design.
- **Decision owner**: the owner. The inquiry investigates and proposes; it decides nothing.
- **Scales**: the pull request (review rounds), the seat session (compaction windows), the team
  (five seats, then two), the account (usage limits), the estate's doctrine, the owner's
  attention.
- **Frames held apart**: F0 investment (the machinery bought); F1 scope growth; F2 review-loop
  economics; F3 the records process; F4 owned doctrine unapplied; F5 capacity.
- **Defeaters**: the account's usage export disagreeing with the transcript token counts; a
  path-based pull request classification reversing the records share; evidence that #62's
  requests were an owner instruction rather than a seat's loop.
- **Reopen when**: any proposal's falsifier fires in the next arc, or a defeater is observed.

## Timeline

| Instant (UTC)          | Event                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| 2026-09-12 08:24       | Owner: the quickest way to transplant the entire lineage Practice, "an hour at most"                  |
| 2026-09-12 09:53       | Owner: "you have 1 hour"; the 26 to 40 hour estimate rejected                                         |
| 2026-09-12 12:43       | The transplant commit (`SHA: 6156fc4`) lands PDR-140 with the rest of the Practice                    |
| 2026-09-13 09:36       | Owner: the entire Practice brought over; the definition and the eight closure items follow            |
| 2026-09-13 12:41       | Owner: a decision-complete plan for items 1 to 8, "two sessions total"                                |
| 2026-09-13 13:22       | #53 merged: the monorepo and the transplant; the lead seat's transplant phase took 10.3 active hours |
| 2026-09-13 13:34       | Director role; three Implementer lanes start                                                          |
| 2026-09-13 15:29       | Owner: "we need to slow down, just you and one implementer"                                           |
| 2026-09-13 15:49       | Owner: four open pull requests is too many; aim for zero                                              |
| 2026-09-13 17:16       | n=2 (the Director and lane A)                                                                         |
| 2026-09-13 20:51–00:56 | #62 (records): twenty-one Copilot requests                                                            |
| 2026-09-14 01:04–02:31 | Usage limit, both seats                                                                               |
| 2026-09-14 04:01–06:04 | Both seats idle until the owner's "good morning"                                                      |
| 2026-09-14 06:08–06:22 | The morning cards: thirty-six questions                                                               |
| 2026-09-14 09:00–13:02 | Cold pause, waiting on the session limit                                                              |
| 2026-09-14 15:09       | Owner: "I don't want the number of rounds of PRs to go up"                                            |
| 2026-09-14 18:20–19:41 | Usage limit, both seats                                                                               |
| 2026-09-14 21:01       | Owner: "this transplant has been going on long enough"                                                |
| 2026-09-15 00:04–10:52 | Usage limit, then no automatic continue; both seats stopped                                           |
| 2026-09-15 11:24       | #91 merged: the closure complete                                                                      |

Merges on `main` by day: 2026-09-13 eleven, 2026-09-14 twenty-five, 2026-09-15 two.

## Causal stack

Each cause carries its evidence, which pass found it (A, B, or both), and whether it was within
the estate's control.

### Technical roots

- **The reviewer's yield is a floor** (A and B). Three to eight findings per pass, never zero,
  sampling rather than conserving (the Director's handoff item 92, sixteen pull requests
  measured). Not controllable; what the estate controls is how often it asks.
- **Hand-written boundary code draws edge-shape findings** (A). The YAML-emulating reader (#86)
  and the declared-adapters reader beside the seam-backed surface reads (#91, where CodeQL
  found the race). Controllable.
- **Context per call spends the account** (A and B). Median context per model call: lead 382K,
  lane A 486K, lane B 398K, lane C 520K tokens; 2.96B cache-read tokens over 6,662 calls. Three
  limit stops and a cold pause, about 17.6 hours. Partly controllable (compaction cadence,
  output kept out of context, seat count); the plan's limits are not.
- **A conflicting pull request runs no CI, and the merge gate names no required check** (A,
  from lane A's finding). Controllable; carried to the owner as a card.

### Process roots

- **Scope grew without a re-estimate** (B ranks it first, about 35 to 40% of cost; A agrees).
  The transplant phase took 10.3 active hours in one seat; the closure about 50 across four.
  Closure item 6 alone (nothing hand kept) was seven pull requests (#55, #74, #77, #81, #83,
  #84, #91), 28 of 133 reviews and 40% of summed open hours (pass B's count). The pre-closure
  phase drew 61% of the owner's messages and 46% of card questions (pass B). Partly
  controllable: the scope was the owner's to set; restating its cost was the estate's.
- **Records-only pull requests** (A and B; B about 25 to 30% of cost). Twelve merged (#54, #58,
  #62, #63, #70, #73, #75, #76, #78, #80, #82, #88): 32% of merged pull requests, 1.4% of added
  lines, 43% of Copilot reviews, 56% of suppressed findings, 45% of threads; 7.98 suppressed
  findings per 100 added lines against 0.08 for substantive work. Pass B adds that records
  pull requests took 58% of commits and that the lead seat, whose output was mostly records
  and routing, took 46% of closure seat-hours. #62 alone: 16% of reviews, 22% of suppressed
  findings. Within control.
- **Cure by default, request per cure** (A). Until the owner's rounds word (2026-09-14 15:09Z,
  applied from 15:15Z), findings were cured push by push and Copilot re-requested after each
  push; #62's twenty-one requests in four hours are the extreme. Within control.
- **Five seats, then two** (A and B; B about 5 to 8%). With four seats (13:34Z to 17:16Z on
  2026-09-13), 11.4 seat-hours for three merges; with two (17:16Z to 01:05Z), 11.3 seat-hours
  for twelve (pass B's windows). Lanes B and C spent about 4.3 agent-hours and handed most of
  their items back; host contention produced the per-worktree e2e port (#60, #66, #69). Pass B
  cautions that work started in the first window merged in the second. Within control.
- **The process's instruments were built inside the arc** (A and B; B about 10 to 15%). The
  pr-watch and merge-bot work (#64, #65, #67, #72, #79) took 10% of Copilot reviews and 4% of
  suppressed findings; #79 alone six reviews over eight hours. Smaller in review load than it
  looked from inside. Within control.
- **Idle waiting overnight** (B). Both seats idle from about 04:01Z to 06:04Z on 2026-09-14,
  after the owner's "do not block work on me"; the cause is not verified. Probably within
  control.

### Meta root

- **Owned doctrine did not fire at the seat's need** (A only; pass B was kept from this
  framing and did not read the doctrine). The estate owned the answer to four situations the
  arc met, and each surfaced only through the owner or a peer: PDR-140 on review response
  (present from 2026-09-12, cited in the handoff only for the lineage curator's own pull
  request); the 2026-07-15 ban on handover pull requests (caught by lane A on 2026-09-15); the
  coordination branch as the home for wraps (the owner, 2026-09-15); pr-lifecycle's clause that
  a conflicting pull request runs no CI (homed 2026-07-31). The transplant imported the
  doctrine in a day; operating by it did not come with the import. The facts are strong; the
  counterfactual that applying PDR-140 would have prevented #62's loop is an inference.
- **The correction channel was the owner's attention** (A). Hand-kept lists (2026-09-13
  11:51Z), slowing down (15:29Z), zero open pull requests (15:49Z), rounds not going up
  (2026-09-14 15:09Z), the records home (2026-09-15).
- The next "why" (seats search forward from the task, not backward from the purpose) is model
  behaviour, outside the estate's control; where doctrine fires is inside it.

## Crosswalk and dependence

| Claim                                     | Pass A              | Pass B                          | Reading                                     |
| ----------------------------------------- | ------------------- | ------------------------------- | ------------------------------------------- |
| Scope growth drives the cost              | yes, unranked       | first, about 35 to 40%          | agreed; shares are pass B's estimates       |
| Records-only pull requests                | yes, review load    | second; commits and seat-hours  | agreed; different measures, same direction  |
| Usage limits set elapsed time             | about 17.6 hours    | about 17.25 hours (lane A)      | agreed                                      |
| Instruments built inside the arc          | small in review     | about 10 to 15%                 | agreed as secondary                         |
| Five seats, then two                      | yes                 | 3.8 against 0.95 seat-hours per merge | agreed, with pass B's caveat          |
| Owned doctrine unapplied (PDR-140 etc.)   | meta root           | not seen (by design)            | pass A only; uncorroborated                 |
| Overnight idle                            | not seen            | about two hours, both seats     | pass B only; verified in the transcripts    |
| Token totals                              | first count 3.5x high | counted per message id        | pass B corrected pass A's data              |

Both passes read the same data files, which pass A computed; one of them contained pass A's
token error, which pass B caught. Agreement between them is weaker evidence than it looks.

## Counterfactuals inside the arc

- **Records frozen at open** (#70 to #88, from handoff item 58): 3.25 Copilot reviews (median
  3.5) and 11.75 suppressed findings per pull request, against 7.75 (median 4.5) and 60.5 for
  #54 to #63; the mean before is driven by #62.
- **Single-fix code pull requests** (#64 to #69, 23:00Z on 2026-09-13 to 01:05Z; pass B): 1.5
  Copilot reviews, 0.67 threads and 4.3 suppressed findings per pull request, median 17 minutes
  open to merge, against 3.47, 6.32, 12.3 and 88 minutes for the other nineteen non-records
  pull requests; each carried one code claim with its tests and was cut from `main`.
- **After the rounds ruling**: six of eleven pull requests settled at two reviews; #81 took
  three (before the terminating shape was understood), #82 four (records; one push under the
  correctness exception after a replacement script silently failed), #86 and #90 three
  (correctness exceptions), #91 five (an exception push, a merge from `main` to clear a
  conflict, a red-check cure). Records pull requests fell from 5.56 to 3.00 reviews each.
- **The one-pass cure**: #91's CodeQL cure, with its exit criterion (the analyser green) ruled
  before authoring, settled in one pass.
- **Two seats against four**: see §Process roots.

## Credit

The cost bought the machinery that makes the next instance cheaper, and it should be named
plainly: generators replaced every hand-kept copy (the rules index and rule adapters; the
sub-agent adapters for four platforms; the templates' declarations as the one source); the
merge bot settles on measured state, holds on suppressed findings and terminates on signed
lines; the lineage-name leak gate; the tracked-universe lint; the per-worktree e2e port; the
corpus-analysis workflow restored; the cited patterns imported; the Cricket quartet; the
closure record, the runbook's recorded outcomes and three PDR amendments; the two-way exchange
node. None of it excuses the records stream's review load or the owner attention spent on
answers the estate already owned.

## Proposals

Each carries its warrant, its falsifier and its PDR-130 lane.

1. **Records ride the pull request they describe; wraps go to the coordination branch; no seat's
   output is a parallel stream of records pull requests.** Fast lane; the owner decided the
   first two on 2026-09-15, and the register holds the coordination-branch entry. Warrant: the
   records share above; pass B's single largest recurring cost. Falsifier (pass B's): in the
   next arc, pull requests carrying records average more than 4.5 Copilot reviews, or seat-hours
   per deliverable merge do not fall below this arc's 2.0.
2. **Apply PDR-140 to this estate's prose and records pull requests at open.** The pull request
   body declares the artefact class, the verification point and the settlement budget; Copilot
   is requested once per settlement push, never once per cure. Fast lane (operating an accepted
   record). Warrant: #62's twenty-one requests in four hours; PDR-140 present and unapplied.
   Falsifier: the next ten declared prose or records pull requests still average more than three
   Copilot reviews.
3. **Re-cost at every scope ruling.** When a ruling widens an arc, the seat restates the cost in
   measured agent-hours before work continues, and the owner confirms or narrows. Fast lane.
   Warrant: sixteen ruling rounds and eight closure items with no restated cost; about 60 hours
   against an hour. Falsifier: in the next arc the restated estimates miss by more than 2x, or
   the owner's decisions do not change with them (then the restatement is ceremony).
4. **The arc's metrics as a bin.** Agent-active hours, model calls, tokens counted once per
   message id, context per call, compactions, limit stalls and owner messages (excluding peer
   sessions), recorded per arc and per pull request in the runbook's timing table. Fast lane.
   Warrant: instance 1 recorded agent time as not instrumented; this retrospective derived it by
   hand and made three counting errors on the way (appendix). Falsifier: the bin's token counts
   diverge from the account's usage export by more than 10%, or instance 2 counts by hand again.
5. **Budget context per call.** A seat whose median context per call passes about 400K tokens
   compacts at its next natural boundary; tool output goes to files and is read bounded. Fast
   lane. Warrant: three synchronized limit stops and a cold pause; medians of 382K and 486K.
   Falsifier: limit-stall hours per agent-hour do not fall in the next arc.
6. **Start at two seats; widen on measured throughput.** Widen only when lanes are file-disjoint
   and the current shape's seat-hours per merge is measured. Fast lane, an operating default
   under PDR-082 for the owner to confirm. Warrant: 3.8 against 0.95 seat-hours per merge;
   lanes B and C handed their items back. Falsifier: a two-seat start the owner widens as too
   slow, and the widened shape then merges at fewer seat-hours per merge.
7. **Fire owned doctrine at the seat's need.** Audit an imported or long-held doctrine set for
   the situations seats meet (review response, records home, merge evidence, team shape) and
   place each governing rule at the step where the situation arises, not only at its own
   ceremony. Slow lane (it changes how the estate adopts doctrine). Prediction: owner
   corrections that owned doctrine already answered fall to at most one in the next arc.
   Falsifier: two or more. Review date 2026-12-15. Warrant: four owned-but-unfired instances in
   this arc; pass A only.
8. **Before the owner sleeps, the queue holds owner-independent work for every seat.** Fast
   lane, conditional on first verifying why both seats idled from 04:01Z. Falsifier: the next
   overnight run idles more than thirty minutes with such work available.
9. **Required status checks on `main`** are the owner's card already (the Director's handoff item
   110).

## Epistemic profile

- **Measurements**: high. Recomputed from GitHub and the transcripts; two passes agree within
  class-boundary differences; three counting errors found and corrected (appendix).
- **Cause shares**: low to medium. They are pass B's estimates; the lead seat's generation time
  could not be split between records, routing and decisions.
- **The meta root**: facts strong, the counterfactual an inference, and seen by one pass only.
- **Independence**: limited; shared sources, model family and a disclosed shared card.
- **Status `provisional`** permits routing the proposals to the owner as proposals and filing
  proposal 7 as a slow-lane candidate. It forbids treating the shares as measured or the meta
  root as corroborated.

## World-return contract

For the next arc (the two-way exchange window or instance 2), owned by that arc's lead seat,
read at its close: Copilot reviews per pull request by class; suppressed findings per 100
added lines by class; seat-hours per deliverable merge; limit-stall hours per agent-hour; owner
corrections answered by owned doctrine; restated estimate error. Thresholds are the proposals'
falsifiers. Reopen this record additively when any fires, or when the account's usage export
contradicts the token counts.

## Practice learning signal

Three counting errors in one retrospective share a shape: a transcript or API surface whose
records are not one-to-one with the thing counted (peer-session messages recorded as user turns;
one model response split across content blocks carrying the same usage; the bot's thread
replies counted among reviews and truncating a first page). Recurrence hypothesis: any
hand-written transcript count repeats one of them. Destination: proposal 4's bin, with a cell
for each. Pending outcome: instance 2's first metrics run.

## Appendix: how each number was derived

| Measure                    | Value                                                                                                                          | Source and method                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Pull requests              | #53 to #91: 38 merged, #59 closed                                                                                              | GitHub GraphQL per pull request, reviews paginated to completion                                      |
| Copilot reviews            | 133, each on a distinct commit (checked for #79 to #91)                                                                        | reviews by `copilot-pull-request-reviewer[bot]`                                                       |
| Copilot requests on #62    | 21, all explicit, 20:51Z to 00:56Z                                                                                             | the pull request timeline; the ruleset's `review_on_push` is false                                    |
| Suppressed findings        | 595                                                                                                                            | `Suppressed comments (N)` in each Copilot review body, summed                                         |
| Threads                    | 245                                                                                                                            | `reviewThreads.totalCount`                                                                            |
| Records share              | 12 of 38 merged; 43% of reviews; 56% of suppressed findings; 45% of threads; 1.4% of added lines                              | the twelve records-only pull requests listed in §Process roots                                        |
| Agent-active hours         | lead 33.4 (10.3 transplant, 23.2 closure); lane A 22.7; lane B 2.5; lane C 1.8                                                | transcripts; consecutive events at most 10 minutes apart; 5- and 20-minute gaps give lead 27.0, 35.2 |
| Model calls and tokens     | 6,662 calls; 8.35M output; 2.96B cache-read; median context per call 382K lead, 486K lane A, 398K lane B, 520K lane C          | transcripts, usage counted once per message id                                                        |
| Compactions                | lead 12; lane A 10; lane B 2; lane C 1; eight owner-prompted wraps, about 69 minutes                                           | transcript compaction summaries; the owner's wrap words                                               |
| Limit stalls               | about 17.6 hours of the lead seat's 78.6 wall hours                                                                            | transcript system events; the cold pause                                                              |
| Owner messages | 193 (2026-09-12 60; -13 72; -14 40; -15 18; -16 3), of which 51 mid-turn; about 13.4 active hours | the lead seat's transcript: user turns plus `queue-operation` `enqueue` entries, deduplicated, excluding peer-session messages and limit continues |
| Card questions             | 97 (2026-09-12 20; -13 30; -14 44; -15 3)                                                                                      | `AskUserQuestion` calls, questions counted                                                            |
| PDR-140 arrival            | 2026-09-12, `SHA: 6156fc4`                                                                                                     | `git log --diff-filter=A`                                                                             |
| Site against Practice      | 20 commits touched `jcdotnet/`; 322 touched `.agent/`; 98 touched `agent-tools/`                                               | `git log origin/main --since=2026-09-12 -- <path>`                                                    |

Counting corrections found on the way:

- The owner message count first read 417: peer-session messages arrive as user turns.
- Copilot reviews first read 123: the first page held 40 reviews, and bot thread replies are
  reviews too.
- Token totals first read 35.8M output and 8.64B cache-read: one response spans several content
  blocks carrying the same usage. Counted once per message id: 8.35M and 2.96B (pass B's catch).
- The first records classification missed #54 (a `docs:` title with no scope).
- The efficiency guidance's closure addendum says every pull request after the rounds ruling
  settled at two reviews plus a signed step; six of eleven did. Its source, handoff item 106,
  qualified the sentence with two exceptions and omitted #82.
- The runbook's recorded outcomes count forty-six card questions on 2026-09-14; the transcript
  counts forty-four. The morning's thirty-nine counted register entries where the cards bundled
  them (thirty-six questions), and one card at 08:48Z went uncounted.

## Owner decisions (2026-09-16)

Adopted as operating defaults: proposal 1 (already ruled on 2026-09-15), proposal 2 (PDR-140's
intake declaration at pull-request open, one review request per settlement push), proposal 3
(re-cost at every scope ruling) and proposal 6 (start at two seats, widen on measured
throughput). Proposal 4 (the metrics bin) is built before the next arc. Proposal 7 goes to a
second protected pass that may read the doctrine before it is filed to the slow lane; it is not
filed yet. Proposal 9: both halves — the ruleset now requires `install`, `static-checks`,
`build-and-test`, `e2e`, `secret-scan` and `CodeQL` on `main` (applied 2026-09-16; strict
policy off; bypass actors unchanged at none), and the settlement naming its required checks is
queued for an Implementer seat. Proposal 5 (a context budget of about 400K tokens) was replaced
by the owner's question, which became proposal 10.

## Proposal 10: a seat's own compaction trigger at 60% (owner's direction, 2026-09-16)

The owner's direction: a seat should start its compaction preparation at a percentage of the
context window, not a token count, "because token ceilings will change over time", and the
preparation should be guaranteed to run before the compaction.

What the platform allows, read at 2026-09-16: a seat cannot compact itself (`/compact` is the
user's command) and no hook can trigger a compaction or change a running session's settings or
environment. A `PreCompact` hook exists and can distinguish `manual` from `auto`, but it cannot
block compaction (exit code 2 is not honoured for it). The auto-compact threshold is
configurable as a token window — the `autoCompactWindow` setting, the `/autocompact` command,
the `--autocompact` flag, `CLAUDE_CODE_AUTO_COMPACT_WINDOW` — accepting 100K to 1M, defaulting
to about 967K on million-token models.

What the estate already has: Claude Code passes the statusline command
`context_window.used_percentage`, `remaining_percentage`, `context_window_size` and the token
counts on every refresh (ten seconds here), and this estate's adapter appends each raw payload
to the path in `PRACTICE_STATUSLINE_LOG_FILE` when it is set; `agent-tools session-metadata`
computes percentage used from the transcript and classifies it on the owner's taught curve
(healthy under 40, peak 40 to 50, past-peak 50 to 65, mistake-prone 65 to 80, degraded from 80).
Sixty per cent sits in past-peak, just before mistake-prone.

The design, therefore, guarantees the preparation's WINDOW and the VISIBILITY of a missed
preparation, not that compaction waits:

1. The preparation fires at 60% as an event, not a memory: a monitor reads the percentage (from
   the statusline payload log, or from `session-metadata` on hosts without one) and wakes the
   seat at the threshold.
2. The auto-compact window is set above it, computed from a percentage at session start (75 to
   80% of the resolved window), so the harness cannot compact before the preparation's window
   has opened.
3. A `PreCompact` hook reads the marker the wrap writes and carries "preparation ran" or
   "preparation did not run" into the session after compaction, so a missed preparation is
   visible rather than silent.

Warrant: twelve compactions in the lead seat across this arc, each preceded by an owner word;
the preparation depended on the owner noticing the moment. Falsifier: with the trigger armed,
a seat still reaches auto-compact without its preparation having run, or the 60% threshold
fires so often that seats compact more than the arc's cadence without a fall in the
mistake-prone-zone corrections. Lane: fast, once built. Prerequisite found while reading: the
window registry in `agent-tools/src/session-metadata/window-registry.ts` knows the 4.x models,
Fable 5 and Haiku 4.5, but not the models this arc ran (Opus 5, Fable 5.1, and their 1M
variants), so the percentage would not resolve for them today.

## The second pass on proposal 7 (2026-09-16)

At the owner's instruction, a second protected pass tested the meta root adversarially, this
time permitted to read the doctrine. Verdict: **partly supported**, and it corrected the claim.

- **Instance 1 (PDR-140) changes shape.** #62's own pull request body declares PDR-140's
  clause-3 intake contract, naming its records class and a settlement budget of one push; eleven
  of thirty-nine pull request bodies carry that declaration, five name a budget, and nineteen
  cite pr-lifecycle's disposition route. The doctrine was consulted at pull-request open and
  then breached twenty-one times at the action moment. That is a compliance failure, not a
  consultation failure, and it moves the cure: the gate belongs at the push, not at the
  declaration.
- **Instances 2 and 4 hold.** The handover ruling was in the tree from the transplant commit and
  no seat cites it before lane A's catch on 2026-09-15; the settle-watch clause was owned from
  2026-08-09, and a review round and a merge poll ran on a tip with no CI. The pass judges
  instance 4's severity overstated, since the conflict leg would have refused the merge — as
  this record already says.
- **Instance 3 is corroborated after all.** The pass could not find the owner's
  coordination-branch correction in the extracted messages and marked it unverified. The
  extraction was at fault: the correction is in the transcript at 2026-09-15T11:37:07Z as a
  mid-turn message, an entry class the extractor dropped.
- **Doctrine firing was the norm.** The pass counted seventeen PDRs and twenty-eight rules cited
  across the arc's pull requests and commit messages, against a denominator of about 307
  doctrine units, with PDR-132's two-round budget declared and honoured exactly on six pull
  requests. The failure is concentrated in review-response pricing, records-pull-request shape
  and branch-home decisions, not general.
- **Its classification of owner corrections needs a re-run.** By its rule, ten of the fifteen
  owner corrections after the transplant landed were answerable by doctrine already in the tree
  (67%). That was computed on the incomplete message set (145 of 193 messages, missing every
  mid-turn one), so the ratio is indicative, not measured; the corrected set now exists.

**Proposal 7, reframed.** Not "audit doctrine so it fires", but: *a declared budget is enforced
where it is spent*. A pull request that declares a settlement budget at open has that budget
read at each push — by the seat, by the bot, or by a gate — and an exhausted budget refuses the
push rather than being noticed afterwards. Warrant: #62 declared one push and took twenty-one
review requests. Falsifier: with the enforcement in place, a declared budget is still exceeded,
or budgets stop being declared to avoid the gate. The slow-lane question left for the owner is
narrower than before: whether the estate needs a general mechanism for placing owned doctrine at
the action moment, or whether per-instrument gates like this one suffice.

## Owner decisions on the second pass (2026-09-16)

Proposal 7 takes both lanes: the push-time budget gate is built now, and the general question —
whether the estate needs a mechanism for placing owned doctrine at action moments, or whether
per-instrument gates suffice — is filed to the slow lane for review on 2026-12-15. The
correction ratio is re-measured by one protected pass on the corrected 193-message set, since
the earlier ratio rested on the incomplete one. The queued work (the settlement's required
checks, the metrics bin, the 60% preparation trigger, the model-window registry) is built by
this seat, where the Director and Implementer roles collapse at one seat, as the team skill
allows.

## Corrections after the fact (2026-09-16)

Additive, per the `retrospective` skill: the record keeps what it said and states what changed.

1. **PreCompact CAN block a compaction; §Proposal 10 says it cannot.** That section reads "A
   `PreCompact` hook exists and can distinguish `manual` from `auto`, but it cannot block
   compaction (exit code 2 is not honoured for it)", and its design therefore claims only the
   preparation's WINDOW and the VISIBILITY of a missed preparation. The installed binary (Claude
   Code 2.1.273) carries `executePreCompactHooks`, `Compaction blocked by PreCompact hook`,
   `compaction blocked by PreCompact hook; continuing uncompacted`, `SKIP_PRECOMPACT_THRESHOLD`,
   `preCompactTokenCount` and `.precompact.json`. So the owner's design holds as they put it: the
   hook blocks while the wrap's marker is absent and the session continues uncompacted. Two
   riders: a hook that blocks unconditionally leaves a session at full occupancy, so it must
   block only on the missing marker; and `SKIP_PRECOMPACT_THRESHOLD` beside `preCompactTokenCount`
   *reads like* a wedge guard, which is an inference from a symbol name, not a fact. Method note,
   because it is the transferable part: the documentation gave three incompatible answers to this
   question through `WebFetch`'s summarising model — cannot block, can block, section absent — and
   the implementation settled it.
2. **The arc had six sessions, not four.** §The answer in brief and the appendix count four seats
   because four transcripts were named by hand. Scanning the project directories finds six: the
   extra two are the headless sessions that ran the @-import falsifier on 2026-09-14, about twenty
   seconds each. Corrected arc figures, from the `arc-metrics` run of 2026-09-16: **62.2
   agent-active hours, 6,720 model calls, 8.56M output tokens, 3.0B cache-read tokens, 25
   compactions, 6 usage-limit stalls** (against 60 hours, 6,662 calls, 8.35M tokens, 25
   compactions as published).
3. **Owner messages belong to a stated filter.** The record reports 193 for the lead seat from an
   extractor written for one pass; the protected pass estimated about 118 were owner prose; the
   tool reports **140**, and 1,322 filtered beside it, because it also excludes command wrappers,
   shell echoes, re-invocation notices and interrupt markers. Arc-wide the tool reports 204 owner
   messages, 79 of them mid-turn. Quote the number whose filter is written down and tested.
4. **The correction ratio is measured now, not indicative.** §The second pass on proposal 7 says
   ten of fifteen post-transplant corrections were doctrine-answerable, computed on the incomplete
   message set, and that a re-run was owed. The re-run on the complete set: **40 corrections
   across the arc, 29 after the doctrine landed, 17 answered by doctrine already in the tree —
   59% post-transplant, 43% arc-wide — and 11 of the 17 were mid-turn messages the first pass
   could not see.** Its per-match list, with each doctrine's path and a confidence, is in the
   Director's handoff (item 111's addendum).
5. **The counting family now has five members, not three.** To the three in the appendix add: a
   hand enumeration standing in for a directory scan (correction 2), and a count published without
   its filter (correction 3). Every one is the same shape — a surface whose records are not
   one-to-one with the thing counted — which is the warrant for proposal 4 having been built
   rather than left as a proposal.

## Proposal 10, revised (2026-09-16): the owner's combined design

The owner combined the two halves after the platform reading was corrected: a nudge that makes
the preparation an event, an auto-compact window with headroom, and a blocking gate with a valve.
Written here as the build's contract.

**A. One occupancy read, shared by every component.** A hook payload carries `transcript_path`,
so the read needs no session bookkeeping: take a BOUNDED TAIL of that file, find the latest
assistant usage, resolve the window from the model id the transcript itself carries, and emit the
percentage. `agent-tools session-metadata` computes exactly this today but takes `--session-id`
and reads the WHOLE file; the measured transcripts reach 76MB and more, so a whole-file read on
every prompt is not viable. The build adds a `--transcript <path>` form and a tail-bounded read.

**B. The nudge.** Below 60%: exit 0, silent. At or above 60%: return an instruction to run the
compaction preparation now and write its marker. It fires on `UserPromptSubmit` (one cheap check
per owner turn, landing at the natural decision point) and on `Stop` (the backstop for a long
autonomous stretch where the owner says nothing for hours — this arc had several). It is
idempotent per crossing: the marker records the occupancy at which it last spoke, so a long turn
is nudged once, not on every tool call.

**C. The window.** Auto-compact set to 70% of the resolved context window. The setting, command,
flag and environment variable all take TOKENS, not a percentage, so the number is computed per
model at session start and recomputed when the model changes — which is the point of specifying
it as a percentage: token ceilings move, the intent does not.

**D. The gate.** `PreCompact` reads the marker. It allows the compaction when the preparation
completed AFTER the last compaction and at an occupancy within about fifteen points of now;
otherwise it blocks, naming in its message which of those two conditions failed, and increments
an attempt counter. On the THIRD attempt it allows the compaction regardless and says loudly that
it did, and why. Every error path fails OPEN: a hook that throws exits 0 and never blocks. The
deliberate refusal is the only refusal.

**E. The marker.** Instance-tier, per session, untracked: written by the wrap when the
preparation finishes, carrying the session id, the timestamp, the occupancy percentage, and the
transcript position at that moment. The gate reads it; the nudge updates its own "last spoke at"
field in it; a successful compaction resets the attempt counter.

**Unknowns the build probes FIRST, rather than assumes.** `SKIP_PRECOMPACT_THRESHOLD` sits beside
`preCompactTokenCount` in the binary and reads like a guard that stops consulting PreCompact
hooks above some occupancy; if it is, it interacts with D's valve and may mean the valve is never
reached. `.precompact.json` is a session's project-level sibling file (the binary's own
validation text says so); whether it carries attempt state is unknown, and our counter must not
collide with it. Whether `SessionStart` names a compaction as its source decides how the counter
resets. Whether hooks fire inside subagent sessions decides whether the nudge must suppress
itself there. Each is settled by one session with the hooks installed and a deliberate
compaction, not by reading more documentation — that page has already given three incompatible
answers about this event.

**Falsifiers.** (1) With the nudge armed, two or more of the next ten compactions happen with no
preparation marker: the nudge is not landing, and the event choice is wrong. (2) The third-attempt
valve fires more than once in ten compactions: either the preparation is too slow or the 60/70 gap
is too narrow. (3) The occupancy read adds more than about 200ms to a prompt: it is reading too
much of the transcript. (4) A hook error ever blocks a compaction: the fail-open discipline is
broken, and the design is more dangerous than the problem it solves.

**Sequence.** Probe the four unknowns; then A (the read); then E and D (marker and gate, the half
that protects the preparation); then B (the nudge); then C (the window), which is one setting and
is worthless before D exists.

### First probe of the design's unknowns (2026-09-16)

The owner asked for the smallest piece first: a `PreCompact` hook that never blocks, whose only
job is to report what the harness puts on stdin and what it does with what the hook writes back.
It exists as `agent-tools/src/claude/pre-compact-observation.ts` (pure, tested) with its entry at
`agent-tools/src/bin/claude-pre-compact-observe-hook.ts`, activated in `.claude/settings.json` as
a built artefact with NO hand-authored JavaScript shim, appending to a git-ignored log under
`.claude/logs/`. Every path, including every error path, ends at exit 0.

Fired once against a synthetic payload, it already moved three of the four unknowns:

- **There is no `.precompact.json`.** The session's sibling directory holds `custom-title.json`,
  `subagents/` and `tool-results/`, and nothing matching that name exists anywhere in the project
  directory. The string in the binary is a RESERVED filename in storage-key validation, not live
  state — so the attempt counter has no harness state to read and must live in our own marker.
  This is the flagged inference failing in the direction the flag existed to catch.
- **The session shape is already in the hook's environment.** The harness exports
  `CLAUDE_CODE_CHILD_SESSION` and `CLAUDE_CODE_SESSION_ATTENDED`, so "suppress the nudge inside a
  subagent" and "is anyone watching" need no new plumbing — they are two environment reads. It
  also exports `CLAUDE_CODE_MESSAGING_TOKEN`, `CLAUDE_CODE_MESSAGING_SOCKET` and
  `CLAUDE_CODE_SSE_PORT`; the observer records those by NAME with the value withheld, by an
  allowlist rather than a denylist, so a variable the harness adds tomorrow is withheld by
  default.
- **The bounded-tail requirement is now measured, not recalled.** This session's transcript stood
  at 79,962,698 bytes when the hook stat-ed it.

What the probe CANNOT settle from a synthetic payload, and what the next real compaction will:
whether the harness delivers `systemMessage`, `hookSpecificOutput.additionalContext`, both or
neither at this event. The hook plants the same marker on both surfaces for exactly that reason —
after the next compaction, whichever marker appears in the transcript names the surface that
works. `SKIP_PRECOMPACT_THRESHOLD` stays unsettled and stays out of the design's load-bearing
parts until it is measured.

**The hook runs from TypeScript source, with no build step and no shim.** The owner asked whether
Node 24 could just run it, given `erasableSyntaxOnly` is already set repo-wide. It can, and the
question was settled by experiment rather than recall: Node 24.18 strips the types, resolves
`zod` from the workspace, and resolves a relative `./x.ts` specifier — measured at about ten
milliseconds over running the compiled file (68-79ms against 58-69ms), against a hook timeout of
ten seconds. The only obstacle was this repository's `.js`-specifier convention, which exists so
that tsc-emitted `dist` resolves under plain Node ESM — a reason that does not reach source Node
runs directly. So `tsconfig.base.json` gained `allowImportingTsExtensions` and
`rewriteRelativeImportExtensions`: the hook's source carries a `.ts` specifier for Node, and tsc
rewrites it to `.js` on emit, which was verified by reading the emitted line and running the
emitted file, not by trusting the option's name. The specifier guard's accepted set gained `.ts`
with that reasoning recorded where the guard lives. A hook that runs from source needs nothing
built, so it works on a fresh clone — which also makes it the rewrite path for the three
surviving hand-authored `.mjs` shims.
