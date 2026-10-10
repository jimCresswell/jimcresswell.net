---
fitness_line_target: 120
fitness_line_limit: 160
fitness_line_length: 100
fitness_content_role: reference
---

# Director handoff entry point

The single file the next Director rehydrates from (PDR-117 §Consequences). Role doctrine lives in
[PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md); this
file carries the pickup procedure, the readiness self-check, the current handoff state and the
live board. It is rewritten in place at every Director transition, never appended.

## Role pickup procedure

1. Run `start-right-team` as `team-closeout-owner`; arm the all-channels comms watcher first
   (`comms watch --exclude-tag heartbeat`, as a persistent Monitor) and assert it live.
2. Read this file, then `repo-continuity.md` §Current State, then the controlling node named
   under §Current handoff state, then the thread records under `threads/` for every live lane.
3. Cross-check the outgoing Director on **both** surfaces before any acknowledgement: the claims
   registry (`claims status`) and the comms heartbeat stream. Registry-stale with comms-live is
   the trap; never take a live seat.
4. Adopt the Director claim in place (`claims adopt --claim-id <id>`), never a duplicate row.
5. Arm the heartbeat loop (both legs, failures emitted; the canonical invocation is in
   `liveness-heartbeat-cron.md`) and recompute `heartbeat_at` from the claim row.
6. Broadcast the PDR-064 Moment-2 active acknowledgement naming the adopted claim. Authority
   transfers on that event and not before.

## Readiness self-check before a Moment-2 acknowledgement

Every line answered first-hand, none inferred:

- The watcher is live for this identity (`comms assert-watcher-live` exits 0).
- The outgoing Director's last comms heartbeat is older than the retirement threshold, or the
  outgoing Director posted a Moment-1 pre-positioning event naming this seat.
- Every live lane's claim owner, branch and last substantive event are known (registry and
  comms, read now).
- The owner's standing rulings below are read and can be restated without the file.
- Nothing is queued to the owner that the Decision Lenses could resolve.

## Standing owner rulings the Director carries

**Drive, never coordinate** (a seat's reading of the owner's repeated corrections
of 2026-07-01, recorded in per-user memory that day; the owner's words were not
quoted). The Director decides what the decision lenses can settle and surfaces
only constitutive residue (product intent, values, external commitments); an
"owner-approval step" is manufactured ceremony, and "the team is awaiting
approval" is a fluent frame to test. The Director drives to a checkable
Definition of Done, authoring one when the plan lacks it; never parks or
retires a lane mid-session while work remains (a context-limited seat hands
to a successor who picks up at once); and cuts owner-facing narration, since
the owner should see the team delivering, not the Director reporting.

- A green, clean pull request is merged, by merge commit, without asking; cards are for
  decisions only the owner can make.
- The owner's answer "A seat lands it on this word" (2026-09-26 10:50Z) covered PR 224 only. A
  cloud-authored or owner-authored draft is ready-marked by the owner or by the owner's stated
  acceptance (PR 250's Appendix E, 20:25Z), never by precedent: the Director widened the 224
  answer to 250 and the owner reversed the mark within five minutes (20:24Z).
- Compute, don't hope: no hand-kept list; every list is derived or gated by a validator.
- Never ask the owner to paste or run the cloud setup script, or for the cloud bash
  measurement, again (owner, 2026-09-19: "I am not interested in fine details"); the bash
  5.2 floor slice has no path, and a slice is done for what it changes, never because it is
  listed.
- The private editorial material is optional, confidential, never a dependency, mentioned
  minimally, never quoted.
- Records are technical, not emotional. A move is a stepping stone, never an end state; an
  archive holds only processed material.
- Interventions and ceremony at the absolute minimum, to preserve context; this applies to all
  Directors (owner, 2026-09-23, twice). Seats own their work; the Director gives a second opinion
  when asked and a check when a seat is in a rabbit hole, and never lays out a seat's work.
- Questions reach the owner only when they survive the Decision Lenses (owner, 2026-09-23,
  verbatim: "Use the decision matrix, ONLY ask questions that survive that"): two excellent options
  left that differ on the owner's intent or own risk, or an action only the owner can perform.
  Wording that implements a ruling already given is the seats' work under review, never a card.
- The overall goal of the exchange work, verbatim (owner, 2026-09-24): "The overall goal here is to
  bring the Engraph OCE Practice and JC.net Practice into alignment". Every Practice change is
  judged against that convergence; a text ratified in one estate lands as the same bytes in the
  other.
- The goal's order, verbatim (owner to the JC.net exchange seat, 2026-09-24 about 13:30Z, relayed):
  "Our purpose here is to first make sure that all of our Practice innovations are integrated into
  the OCE Practice, our second goal is to bring our Practice up to speed with their innovations".
  Outbound delivery into OCE is the exchange seat's own act through the join ceremony and
  does not wait on a live OCE seat. And: "the memories and records of this repo are local to this
  repo, but the lessons learned from them are not".
- Owner, 2026-09-24 about 13:55Z, verbatim: "the labelling of Cricket agents is better in JC.net
  than in OCE: make sure the Cricket implementations and other sub-agent details are compared
  between the repos". A goal-one item, routed to both exchange seats.
- Every 45 minutes the Director checks in with all agents, corrects where needed, and has each run a
  full Cricket suite (owner, 2026-09-24, verbatim: "once every 45 minutes, check in with all agents
  and make sure they are staying on track, correct them if needed, and instruct them to run full
  Cricket suites"). One identical frame to every seat; the seat runs its own suite and acts on its
  verdicts.
- The Director runs its own full Cricket suite at the same cadence, about 22 minutes after the
  seats' check-in (owner, 2026-09-24, verbatim: "run your own Cricket suites at the same cadence,
  but out of phase, about 22 minutes after the others"); the owner's timer outranks the cricket
  skill's event-boundary default for this seat.
- Owner, 2026-09-24, to the JC.net exchange seat (Siren), relayed by Siren, verbatim: "Standing
  rule, with aim for zero open PRs on balance , no work in remote branches that is not in a PR, and
  work is not delivered until it is merged". And: "do not assume that a branch existing on the
  remote means that it should be merged, assess each one first. I suspect most have been assessed
  before. Any that should not be merged get deleted. A branch on the remote is NOT a compromise,
  they are not safe, they are not a backup option, they should be in PRs, or they should be deleted.
  That is a rule, remember it". A coordination branch is in a draft PR opened by the bot until its
  fold.
- Owner, 2026-09-24 about 15:27Z, to the Codex support seat (Swallow), given directly, verbatim:
  "Finish the inflight work, but switch strategic focus to making Codex a first class peer in the
  Practice". Goal two runs beside goal one; the arc's "then we review" sequences goal one's two
  directions (outbound first, inbound after the review), not the goals.
- Owner, 2026-09-28 about 11:2xZ, to the Director, relayed by the Director (Wick binds Temper),
  verbatim: "I am deprioritising Codex support for now, we have made progress, we will come back
  to it later. Give 250 to Myrtle, let's get it landed quickly and well." The Director read it as
  suspending the goal-two focus above until the owner returns to it; a seat read it the same day
  as not starting goal one's Codex-support code rows without the owner's word (one instance).
- The owner's compaction word is a freeze until "carry on"; the drill runs at that word (owner,
  2026-09-24 18:3xZ, 2026-09-25 13:00Z; verbatim in the archive's second-trim section).
- Standing lesson for every Director: an owner card holds the turn until answered; the cadence loop,
  the monitor and the heartbeat all stop with it. Raise a card only when no seat's deadline waits on
  the Director, after telling the seats the Director goes dark, and put the questions in the report
  text as well.
- The Director's own records volume, a Director's ruling and not the owner's (Wick binds Temper,
  2026-09-27, suite 40; one instance): "cut it". Check-in blocks carry the four numbers, the
  landings, the card and NEXT; suite tallies carry the counts and the ruling; an addendum is
  written only for an over-bar cure or a tail the body promised; ledger rows stay rows; records
  text comes from forge reads only.
- No seat stops on a context reading; it prepares for compaction at the owner's word and resumes
  on "carry on" (owner, 2026-09-25 13:00Z; PDR-063 amended by PR 219; verbatim in the archive).
- The owner lands small green PRs by hand and never waits for a seat (owner, 2026-09-26 11:00Z,
  verbatim): "don't block small green PRs on manual, but do maintain a list so that when I ask you
  can give me links". The Director keeps THE READY LIST: every open PR on both estates that is
  green with zero unresolved threads and not a draft, as number, link, changed-file count and
  class, ordered by changed-file count ascending (the order the owner used on 2026-09-26),
  regenerated by the snapshot script at every check-in and handed over the moment the owner asks;
  while the owner lands from it, every seat holds syncs on the listed PRs until the owner says
  done. The seat door lands every ready PR in the same order without waiting for the owner.
- The coordination drafts count toward zero and fold twice a day, at 12:00Z and the UTC rollover
  (owner, 2026-09-26 10:50Z; `coordination-branch-24h-lifetime` carries it; verbatim in the
  archive).
- The owner's answers of 2026-09-27 09:1xZ (the Director's thirteen questions; the napkin's 09:06Z
  block carries each verbatim): the WIP limit is three across both estates together; PR 250 counts
  throughout as "a first class PR, not a separate blocker"; 250's lane comes before goal one's
  remaining rows; the retrospective trigger's re-anchor is ratified and the Director authors the
  retrospective; the late-cure leg ruling (PDR-140 clause 4) and PR 224's private-citation
  disposition are ratified; the transplant runbook is ratified in both estates; the three local
  lineage branches are deleted on the owner's word; goal two's Codex items ride Swallow's lane in
  order; Dependabot PRs count and a seat lands each green one at its size turn; the word "[the
  owner's local-only wording]" stays out of the repository for now and reads "Student Support
  Experiments".
- The WIP limit (owner, 2026-09-26 19:2xZ, verbatim summary: "Each repo is allowed one
  coordination PR"; "The total number of allowed PRs not including coordination PRs is the number
  of implementer agents, in this case three"; "We always strive for all PRs to be merged"). The
  count is read across both estates together; external PRs (fork syncs, Dependabot, CV content)
  count, and the Director analyses and schedules each into the door order; no PR opens while the
  count reads three or more. The opening order as reviewed on PR 260 and operated from 2026-09-27
  (the Director's reading): the opener posts "WIP slot reserved: <owner>/<name> <branch>" on the
  estate's stream FIRST, then reads a bounded first-hand count across both estates (GraphQL
  totalCount or `gh pr list --limit` above the count), then re-reads every estate's stream for
  earlier reservations not yet open, and opens only while count plus reservations is under the
  limit, else withdraws; the branch is pushed with its draft PR at once, never held locally; while
  the count is full a seat prepares without a worktree or a commit. Supersedes "No bound"
  (10:50Z). Cloud-authored PRs (a non-executing host, the PR body's own statement) are team
  intake: checked out locally, gated, evaluated, then worked as normal (owner, 19:3xZ). The full
  words: the napkin's 2026-09-26T19:29Z and 19:38Z blocks; the operated rule as amended: the
  2026-09-27T09:39Z and 09:52Z blocks.

## Current handoff state (2026-10-02, pointer-biased by design)

**§STATE, 2026-10-10 11:1xZ (Cedar turns Grove, `1950d1`, the n=1 seat, closing; this block adds
to the 13:1xZ block below).** The LinkedIn lane is handed to Shrew rides Eventide (`371a2b`) at
the owner's word of this hour, by PDR-063's at-rest succession (no claim, nothing in flight); the
pickup is `threads/linkedin-workspace.next-session.md`, block of this hour, then
`repo-continuity.md` §Next Safe Steps. The owner gave the fold of `coordination/2026-10-09-213f94`
(326) to the successor at 11:0xZ, as it relayed; these records were written for its commit. The
owner's word of the same hour on fold time (an hour is "a clear signal of a process and
engineering failure"; ten minutes acceptable) is in §Next Safe Steps, assigned to nobody. The
claims registry holds one stale row (Hazel tracks Trunk, `7d8b9d`, 2 October, thread
two-estate-consolidation), named here for the next Director to archive. moved for the sites:
nothing / moved for the Practice: the handoff records. No Director seat is held; no watcher,
heartbeat or claim runs at n=1 by the owner's word.

**§STATE, 2026-10-09 13:1xZ (Cedar turns Grove, `1950d1`, the n=1 seat, post-fold; this block adds
to the 12:xxZ block below).** The coordination branch `2026-10-08-bd89f8` folded as 324 at
`SHA:213f9487` (the bot's merge on SETTLE-READY after three Copilot rounds); the successor
`coordination/2026-10-09-213f94` carries the records from here, this commit its first. The live
lane is `linkedin-workspace` (its thread record's latest block governs; the Oak entry's two drafts
await the owner's edit in the editor). Compaction follows this fold at the owner's word; the seat
continues after it. moved for the sites: nothing / moved for the Practice: the lane's records and
the editorial doctrine the branch carried, on `main`. No Director seat is held; no watcher,
heartbeat or claim runs at n=1 by the owner's word.

**§STATE, 2026-10-09 12:xxZ (Cedar turns Grove, `1950d1`, the n=1 seat; this block adds to the
10:2xZ block below).** The LinkedIn profile as validated markdown and its local editor merged as
325 at `SHA:547e7358` on the owner's word; the copy's one home is `linkedin/profile.md`, the
owner's edits land in `profile.review.md`, which no gate touches. The owner's correction of 8
October governs the lane's proportion: a private instrument gets one observation and one pull
request, never the reviewer fleet (six reviewers and a Cricket suite were run on the editor and
stopped at his word). The live lane is `linkedin-workspace` (its thread record's latest block
governs; the Oak entry's two drafts await his edit in the editor). moved for the sites: nothing /
moved for the Practice: the proportion rule, in the thread record and the seat's memory. No
Director seat is held; no watcher, heartbeat or claim runs at n=1 by the owner's word.

**§STATE, 2026-10-08 10:2xZ (Cedar turns Grove, `1950d1`, the n=1 seat, post-fold; this block
adds to the 17:3xZ block below).** The coordination branch `2026-10-05-d72ae5` folded as 323 at
`SHA:bd89f86e`; the successor `coordination/2026-10-08-bd89f8` carries the records from here, this
commit its first. The live lane is `linkedin-workspace` (its thread record's latest block governs;
the headline and About approved, the Oak entry next; one routed review finding on the container's
opening sentence in `repo-continuity.md` §Next Safe Steps). moved for the sites: nothing / moved for
the Practice: the records hygiene cure in two skills, both estates, on `main`. No Director seat
is held; no watcher, heartbeat or claim runs at n=1 by the owner's word.

**§STATE, 2026-10-05 17:3xZ (Sycamore holds Spore, `18d874`, the n=1 seat, the compaction boundary
at the owner's word; this block adds to the 17:1xZ block below).** The work is finished and the
terminal acts ran: closeouts on both comms logs, the claim closed, the watcher stopped. At the
owner's word the modes ran over the day; the harvest is the napkin block of this hour and the born
sketch `practice-alignment-conservation` (`.agent/plans/delivery/`), the lighter altitude after the
finish: the fail-closed property on every filtered alias checked by the validator, and the byte
proof as a tracked command with the finish's partition as its baseline. The heavier altitude, the
extraction's design, is the owner's and is not drafted. No process of this seat runs; the re-arm
recipe is in the napkin block. The next seat reads `git status --branch` in both primaries first.

**§STATE, 2026-10-05 17:1xZ (Sycamore holds Spore, `18d874`, the n=1 seat, post-fold; this block
adds to the 16:4xZ block below).** The coordination branch `2026-10-04-eebe40` folded as 320 at
`SHA:d72ae51d`; the successor `coordination/2026-10-05-d72ae5` carries the records from here, this
commit its first. moved for the sites: nothing / moved for the Practice: the alignment node's finish
on `main` in both estates. The sibling's fold (#352) is at its door at this block. Left for this seat:
the wrap (the closeout broadcast, the claim closed, the watcher stopped).

**§STATE, 2026-10-05 16:4xZ (Sycamore holds Spore, `18d874`, the n=1 seat, at the alignment node's
finish; this block supersedes the 11:3xZ block below where they differ).** The delivery node
`practice-alignment-by-class` is at its finish: the doctrine landing merged in both estates (321 and #353)
and the code landing merged in both (322 at `SHA:d3647a9d`, 16:26Z; the sibling's #354 at
`SHA:ef42bd11f`, 16:33Z), each through the bot's door with Copilot's review binding the tip; the
byte proof at the merged tips is a comment on each landing (829 shared, 776 identical, 9
placeholder-only, 44 differing, the contextual layer). The ruleset 12555444 requires
`run-quality-gates` and `CodeQL` alone. Six branches retired here under the bot with their
worktrees, four in the sibling. Todo 3 is done in both working trees: the strategic node's
§Delivery finish line, the three nodes archived with their dispositions. What remains for this
seat: the records committed, both coordination branches folded (DUE), the wrap. Named for the
next seat, ordinary work: the first follow-up pull request per estate puts `--fail-if-no-match`
on every filtered alias in the family manifest and the root scripts with a manifest self-check
in the conformance validator (Copilot's finding on the final sibling tip, true in both estates);
the remainders on the two landings' descriptions. For the owner: this seat took the PDR-140
clause 4 rebudget once on each code landing, 322 here and #354 in the sibling, by its own
recorded decision (the gate's text says "by the owner"); the doctrine landings needed none; the ruleset edit ran under the operator credential. Until the wrap the comms watcher (a
Monitor) and the implementer claim in this registry are live; the wrap closes the claim, posts the
closeout and stops the watcher, so that none survives it.

**§STATE, 2026-10-05 11:3xZ (Crucible binds Slag, `7b999c`, the n=1 seat, at the owner's handoff
word; this block supersedes the §POINTER blocks below where they differ).** The code landing of
`practice-alignment-by-class` is open in both estates: 322 here (thirteen commits, CI green, one
review finding cured and awaiting its reply), the sibling's #354 (twelve commits, Copilot
requested under the bot). The doctrine landing is merged in both (321, #353). 318 and #349 are
closed into the landings. What remains is settlement, the two merges, the ruleset switch here, the
branch deletions and the byte proof, todo 3 (the strategic node's finish line, the three nodes
archived), the fold of both coordination branches (DUE), and one owner card (the four superseded
surface lanes; the three expired gates of `practice-language-separation`). The live reading is
the thread record `threads/two-estate-consolidation.next-session.md`'s block of this hour and the
napkin's block of the same hour; the next seat rehydrates from those two, then `repo-continuity.md`
§Current State. No claim, watcher, heartbeat or background agent survives this seat; the re-arm is
the role pickup procedure above.

**§STATE, 2026-10-05 00:4xZ (Crucible binds Slag, `7b999c`, the n=1 seat, at the owner's
compaction word).** 321 merged into main at `SHA:4992af38`; #353 open at `SHA:df70cd153` with its
reviews cured and no review binding the tip yet; the proof at the two tips DRIFT 1 (one rule's
globs, owed to the code landing here). The full Cricket suite: unanimous ON-TRACK on the code
landing as sized; the frame narrowed on the finish measure and the landing's scope. Next safe
step: the code landing here, cut from main, keystone-first, without waiting for #353; merge #353
when a review binds its tip. The live record is the napkin block of 2026-10-05T00:4xZ.

**§STATE, 2026-10-04 22:4xZ (Crucible binds Slag, `7b999c`, the n=1 seat).** The doctrine
landing of `practice-alignment-by-class` is open in both estates: jimcresswell.net 321 at
`SHA:a9081f17` (reviews cured at the tip, Copilot re-requested) and OCE #353 at `SHA:bd969cbaf`;
the byte proof at the two tips reads DRIFT 0 (744 shared, 702 identical, 42 contextual-bound by
design). The next safe step is to merge both when their reviews settle, then the code landing
(mechanism item 2), here first. The live record is the two-estate thread's block of
2026-10-04T22:4xZ; the napkin block of the same hour carries the lessons.

**§STATE, 2026-10-04 19:0xZ (Crucible binds Slag, `7b999c`, the n=1 seat, at the owner's
compaction word; this block supersedes the blocks below where they differ).** The definition's
landings merged: 319 at `SHA:02178ff0b` on main, OCE #351 at `SHA:82cb7fba4` on engraph, the
same bytes. The successor delivery node `practice-alignment-by-class` is ratified (the owner's
four card answers of 16:xZ: four pull requests, two per estate; proceed at about five hours over
two sittings; a light commit and a full push as the family's convention; the conformance check
included) and sits on both successor coordination branches with the Cricket suite's tally (eight
legs, unanimous). The live record is the two-estate thread's block of 2026-10-04T19:0xZ, whose
next safe step is the doctrine landing here first. One conflict is the owner's, carried with that
landing: the owner's 2026-09-30 word ("it's OCE") against PDR-142's host-neutrality clause. No
claim, no process, no unpushed commit of this seat; nothing to re-arm at the resume.

**§STATE, 2026-10-04 16:0xZ (Crucible binds Slag, `7b999c`, the n=1 seat; this block supersedes
the blocks below where they differ).** The Practice has a canonical definition: five layers
(general; family; contextual; accumulated; the loop), ratified by the owner's card answer of
2026-10-04 and recorded in PDR-143 §Decision (Accepted) and `practice.md`, with the report
`practice-system-review-2026-10` as evidence; the owner's direction, verbatim, "tooling agnostic
policy, strict universal contracts, tooling specific implementations where a universal approach
is not efficient or appropriate". The six placements are decided (the report records the words).
The folds merged: 305 at `SHA:eebe40ea2`, successor `coordination/2026-10-04-eebe40`; OCE #348
through the bot, its successor cut after. The live record is the two-estate thread's block of
2026-10-04T16:0xZ, which names the next safe step: one landing pull request per estate from the
folded tip, the same bytes; then the successor delivery node from the model, one pull request
per divergence class per estate. Claims: none (n=1, no peer). The parity doors (312, #350, 318,
the hooks branch, the OCE lanes) wait for the successor node.

**§STATE, 2026-10-02 10:5xZ (Crucible binds Slag, `7b999c`, the Director seat across both
estates).** Licence: the owner's word in this seat's own session, 2026-10-02 ("when it makes sense,
take on the Director role … context preservation over longer timescales … strategic decisions are
shared but most implementation work should be delegated"); no prior Director seat existed (the
§POINTER of 2026-10-01 below), so there was no Moment 1 to answer. Taken after the seat's own lane
(pull request 280) merged, so the seat holds no implementation. Claims: JC.net 8b346894 and OCE
6a4b11b1 (`estate-coordination`, role director); the records claim 8e37e0d3 is closed into them;
cab726a6 (PDR-143) closes when the fold lands it; OCE 4b82394b (the J2 lane, inherited, NOT
READY, OCE's record line 2) is routed to the next implementer seat there.

Roster, read from both registries and both streams at 10:5xZ: Hazel tracks Trunk (7d8b9d),
implementer, the second two-estate consolidation (claims 009bbaea here, 08f94e2a in OCE; 289 open
and ready; eleven slices on local branches, opened one at a time); Efreet lifts Scorch (7adb15),
implementer, OCE's fold of 327 and the cross-fork check (claim f9c5a8ce there; a guest on this
stream; no lane work). The owner's limit (10:3xZ): one coordination and one fix pull request per
estate. JC.net: 286 (coordination, folds at 12:00Z, this seat) and 289. OCE: 327 (coordination,
Efreet's fold in flight), no fix pull request.

Verdicts owned: 289's door (the Director read it first-hand at 10:4xZ, no objection; Hazel lands
it at green); PDR-143's landing on the coordination branch (two sub-agent reviews, the second
round's cures made, the docs reviewer's second read pending); the fold of 286. Owner-gated: the
Turbo items (`repo-continuity.md` §Next Safe Steps); the Capability Foundations pull request the
owner will have an external agent raise in OCE (team intake when it arrives); PDR-143's
ratification and the entity's name, home, licence and publishing route. Team-doable, in order,
each to an implementer seat as its slot frees: the 309 twin here (after 289); the security lane;
the `retire` port into OCE; the push-tests lane in both estates (280's three routed items; the
mint test's removal); the J2 port's cures in OCE; the arc-metrics follow-ons (line 1). The single
next safe step: the 12:00Z fold of 286 carrying PDR-143 and the records, declared prose-class in
its §Scope.

Processes of this seat: the all-channels watcher in each estate; the heartbeat loop under the
Director label on both registries; the PR poll over both estates' open sets; the peer-liveness
delta poll; the fold wake. Each is re-armed from OCE's brief §Standing processes at any boundary.

**§POINTER, 2026-10-01 13:2xZ (Crucible binds Slag, `7b999c`).** No Director seat exists. The seat
that took the n=1 work on 2026-09-30 (Hawthorn binds Bracken, `b3f117`) closed on 2026-10-01; the
owner then seated two: a curator on the second dedicated consolidation and an implementer on the
folds, the continuity records, the upstream sync and the open pull requests. The live reading is
`repo-continuity.md` §Current State and §Next Safe Steps; the standing rulings above bind both
seats, and the next Director rehydrates from this file as before.

**§POINTER, 2026-09-29 13:4xZ (Wick binds Temper, `ed7b48`, the Director seat, at the owner's
word).** The Director lane closed on 2026-09-29; the owner handed the work to one seat (n=1) across
both estates. That seat's handoff is in OCE: its `estate-coordination` thread record's
journal entry "2026-09-29T13:4xZ — HANDOFF to the n=1 seat", with the retrospective, OCE's
`.agent/reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md`.
Every "napkin's <time> block" named above, from 2026-09-27T09:06Z on, now reads in
`.agent/memory/active/archive/napkin-2026-09-27-to-2026-09-29.md`; earlier ones in
`archive/napkin-2026-09-21-to-2026-09-27.md`.

The state blocks of 2026-09-28 that stood here are archived byte-identical in
`archive/director-handoff-current-handoff-state-2026-09-28.md`.

## The archive

The live board, the routed verdict and decisions of 2026-09-13, and the routing log to 2026-09-26
11:09Z are in `archive/director-handoff-2026-09-26.md`, moved whole on 2026-09-26; the napkin's
dated blocks are the routing record from then on.
