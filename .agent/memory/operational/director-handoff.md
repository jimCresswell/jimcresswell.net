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

- A green, clean pull request is merged, by merge commit, without asking; cards are for
  decisions only the owner can make.
- The owner's answer "A seat lands it on this word" (2026-09-26 10:50Z) covered PR 224 only. A
  cloud-authored or owner-authored draft is ready-marked by the owner or by the owner's stated
  acceptance (PR 250's Appendix E, 20:25Z), never by precedent: the Director widened the 224
  answer to 250 and the owner reversed the mark within five minutes (20:24Z).
- Compute, don't hope: no hand-kept list; every list is derived or gated by a validator.
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
- The overall goal of the exchange work, verbatim (owner, 2026-09-24): "The overall goal here is
  to bring the Engraph OCE Practice and JC.net Practice into alignment". Every Practice change is
  judged against that convergence; a text ratified in one estate lands as the same bytes in the other.
- The goal's order, verbatim (owner to the JC.net exchange seat, 2026-09-24 about 13:30Z, relayed):
  "Our purpose here is to first make sure that all of our Practice innovations are integrated into the
  OCE Practice, our second goal is to bring our Practice up to speed with their innovations". Outbound
  delivery into the lineage is the exchange seat's own act through the join ceremony and does not wait
  on a live OCE seat. And: "the memories and records of this repo are local to this repo, but the
  lessons learned from them are not".
- Owner, 2026-09-24 about 13:55Z, verbatim: "the labelling of Cricket agents is better in JC.net than in
  OCE: make sure the Cricket implementations and other sub-agent details are compared between the
  repos". A goal-one item, routed to both exchange seats.
- Every 45 minutes the Director checks in with all agents, corrects where needed, and has each run a
  full Cricket suite (owner, 2026-09-24, verbatim: "once every 45 minutes, check in with all agents and
  make sure they are staying on track, correct them if needed, and instruct them to run full Cricket
  suites"). One identical frame to every seat; the seat runs its own suite and acts on its verdicts.
- The Director runs its own full Cricket suite at the same cadence, about 22 minutes after the
  seats' check-in (owner, 2026-09-24, verbatim: "run your own Cricket suites at the same cadence, but
  out of phase, about 22 minutes after the others"); the owner's timer outranks the cricket skill's
  event-boundary default for this seat.
- Owner, 2026-09-24, to the JC.net exchange seat (Siren), relayed by Siren, verbatim: "Standing rule,
  with aim for zero open PRs on balance , no work in remote branches that is not in a PR, and  work is
  not delivered until it is merged". And: "do not assume that a branch existing on the remote means
  that it should be merged, assess each one first. I suspect most have been assessed before. Any that
  should not be merged get deleted. A branch on the remote is NOT a compromise, they are not safe,
  they are not a backup option, they should be in PRs, or they should be deleted. That is a rule,
  remember it". A coordination branch is in a draft PR opened by the bot until its fold.
- Owner, 2026-09-24 about 15:27Z, to the Codex support seat (Swallow), given directly, verbatim:
  "Finish the inflight work, but switch strategic focus to making Codex a first class peer in the
  Practice". Goal two runs beside goal one; the arc's "then we review" sequences goal one's two
  directions (outbound first, inbound after the review), not the goals.
- The owner's compaction word is a freeze until "carry on"; the drill runs at that word (owner,
  2026-09-24 18:3xZ, 2026-09-25 13:00Z; verbatim in the archive's second-trim section).
- Standing lesson for every Director: an owner card holds the turn until answered; the cadence loop,
  the monitor and the heartbeat all stop with it. Raise a card only when no seat's deadline waits on
  the Director, after telling the seats the Director goes dark, and put the questions in the report
  text as well.
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
  (owner, 2026-09-26 10:50Z; `coordination-branch-24h-lifetime` carries it; verbatim in the archive).
- The owner's answers of 2026-09-27 09:1xZ (the Director's thirteen questions; the napkin's 09:06Z
  block carries each verbatim): the WIP limit is three across both estates together; PR 250 counts
  throughout as "a first class PR, not a separate blocker"; 250's lane comes before goal one's
  remaining rows; the retrospective trigger's re-anchor is ratified and the Director authors the
  retrospective; the late-cure leg ruling (PDR-140 clause 4) and PR 224's private-citation
  disposition are ratified; the transplant runbook is ratified in both estates; the three local
  lineage branches are deleted on the owner's word; goal two's Codex items ride Swallow's lane in
  order; Dependabot PRs count and a seat lands each green one at its size turn; the word "Clef"
  stays out of the repository for now and reads "Student Support Experiments".
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

## Current handoff state (2026-09-28 12:2xZ, resumed on the owner's "carry on"; pointer-biased by design)

**Resumed 2026-09-28 11:4xZ on the owner's "carry on".** The live reading is now the napkin's
2026-09-28T10:22Z block (the owner's review) with the two 11:3xZ blocks after it (the owner's
answers: Codex support deprioritised, PR 250 to Myrtle, suites before folds and at frame changes,
Siren resumed, Nova back on JC.net's todo 8; the LinkedIn workspace as material to commit); the
08:26Z boundary block below them is the frozen state, superseded where they differ.

**Boundary 10, 2026-09-28 08:26Z (the owner's compaction word).** The reading at the boundary was
the napkin's 2026-09-28T08:26Z block: work safety verbatim, the state at the boundary, the seats
(Siren frozen, Myrtle on PR 250 from 08:22Z, Nova retired), that window's rulings with their homes,
the card queue, the processes stopped, the re-arm recipe and the owed-on-resume order. The block
below it is the 00:1xZ state, kept; the rollover folds landed (227 at 00:34:06Z as 87689ea1,
264 at 02:46:51Z as 96b273d3) and the successors are 234 and 275, DUE at 12:00Z.

At the rollover (00:1xZ) the reading was the napkin's then-newest Director block: check-in 52
(23:36Z on 2026-09-27, the pre-fold state) and the suite 45 tally (22:36Z), with the fold recipe
(20:10Z) and its addenda (21:51Z); superseded by the paragraphs above. State at the rollover folds: two non-coordination PRs open across both estates (250 the owner's
draft on THE READY LIST, 273 Siren's non-blocking profile read); the lineage landed 261 and 265 to
272 since the 12:00Z fold and JC.net 226 and 228 to 233; both coordination drafts synced, pushed
and ready-marked at 00:0xZ (264 at 7f6bb5f5f after one cured round, 227 at 97a0db5f2), their doors
on their legs, the successors to be cut and named in the rotation broadcasts; the owner card at
lines (b) to (f) (250's action moment and Nova's worktree, shellcheck, the bash floor, the vendored
scripts, seats for both goals), none blocking; the retrospectives 265 and 267 landed with 268's
addenda. Processes of this seat: the monitor (arm 20), the drafts CI watch, the fold scripts and
the merge-bot doors. Claim 58c2684a retained.

Fold entry, 2026-09-27: PR 215 (coordination/2026-09-26-26ca4d) merged by the bot at 10:04:50Z as
cb4644c4 at full condition after two settlement pushes (nine findings cured, three dispositions
deferred to this branch's first records commit); the successor coordination/2026-09-27-cb4644 cut
at 10:06Z from that sha, tree-preserving, DUE at 12:00Z. moved for the sites: nothing. / moved for
the Practice: the day's records (check-ins 28 to 33, suites 25 to 28, boundaries 8 and 9, the
owner's thirteen answers, Siren's two wraps and letters), the plan's two amendments, and main's
landings 216, 217, 218 folded in.

Fold entry, 2026-09-27 (second): PR 225 (coordination/2026-09-27-cb4644) merged by the bot at
12:39:05Z as 3699c155d at full condition after two settlement pushes (round one's three findings
cured, round two's two cured, round three's one Accepted-deferred to the exchange seat's resume:
her thread record's opener); the successor coordination/2026-09-27-3699c1 cut at 12:4xZ from that
sha, tree-preserving, DUE at the UTC rollover. The push took four gate runs, none for the branch
(a peer's unlinted append; the comms-log projection's read window twice; a moved file's links).
moved for the sites: nothing. / moved for the Practice: the morning's records (check-ins 33 to 37,
suites 28 to 31), the napkin's rotation filed as unconsolidated, the handoff's second trim, the
plan's third amendment, and main's landing 224 folded in.

- The programme: the approved plan of 2026-09-26, conserved verbatim as
  `.agent/reports/agentic-engineering/2026-09-26-the-estates-programme-plan.md`; its lanes are the
  seats' todos; its §Verification numbers are read at every check-in from the generated snapshot,
  except that its 25-minute slot-holder line is superseded by the landed slot text (pr-lifecycle
  §Phase 7 at main: a holder lands and releases, yields when it needs a cure push, or is freed
  after twenty silent minutes and an unanswered ping), which the check-ins read instead.
- The cadence: check-ins every 45 minutes on the generated snapshot (the script in the seat's
  scratchpad, described in the napkin's boundary blocks), the full Cricket suite 22 minutes after
  each, both stances, the tally on the napkin and both streams.
- The door: seats land every ready PR in changed-file order through the bot; the Director routes
  and does not execute (PDR-117), keeps THE READY LIST with links for the owner's hand, and runs
  the two folds a day (12:00Z and the UTC rollover) by the coordination-fold skill.
- The seats on 2026-09-26: Siren herds Rudder (JC.net Practice; the exchange rows into lineage PRs
  beside Myrtle from 12:42Z), Myrtle turns Canopy (the lineage exchange seat), Swallow holds Drift
  (the Codex lane), and from 14:4xZ Phobos wakes Void (01a0de; the owner's Codex team member, on
  the lineage). Their state is on the comms streams and in their thread records, never here.
- Open at this block's writing: the two rollover folds at their doors (264 on the lineage, 227 on
  JC.net), their successors owed with the fold entries and the rotation broadcasts; the owner card
  lines (b) to (f), batched for the next contact, none blocking; 250 on THE READY LIST for the
  owner's human review of the eval readings and the ready-mark; Nova's return or the owner's word on
  her lane and worktrees; Siren's order (273's door; the profile git runner's `core.symlinks=false`
  in both estates with the register's J3 and J7 landings; the L1 flow-back after its divergence
  read; the shellcheck gate on card line (c)'s default; the flagged-fixture smoke pair); goal one at
  13 of 23 rows by the register plus J2, J3 and J7 landed today; the next suite after the folds.

## The archive

The live board, the routed verdict and decisions of 2026-09-13, and the routing log to 2026-09-26
11:09Z are in `archive/director-handoff-2026-09-26.md`, moved whole on 2026-09-26; the napkin's
dated blocks are the routing record from then on.
