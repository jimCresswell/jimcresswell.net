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

## Current handoff state (2026-10-01, pointer-biased by design)

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
