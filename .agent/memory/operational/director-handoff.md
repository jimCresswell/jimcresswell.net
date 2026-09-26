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
- Compute, don't hope: no hand-kept list; every list is derived or gated by a validator.
- The private editorial material is optional, confidential, never a dependency, mentioned
  minimally, never quoted.
- Records are technical, not emotional. A move is a stepping stone, never an end state; an
  archive holds only processed material.
- The transplant is bounded: closure items 3 to 8 finish it, then editorial work.
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
- Owner, 2026-09-24 about 13:57Z, verbatim: "Crickets judge in the frame provided, we need them to also
  judge the frame itself". Every Cricket role returns a frame verdict beside the work verdict; the
  Director's own dispatches ask it explicitly until the templates carry it.
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
- Owner, 2026-09-24 about 15:5xZ, to the OCE exchange seat (Marten), relayed by Marten, verbatim:
  "it is also reasonable to send information to a fellow agent, sometimes that is important and is
  neither a question not a request, but it should be useful information". A message to the Director
  or a peer carries a question, a request, or useful information.
- Owner, 2026-09-24 about 18:3xZ, to the Director, verbatim: "Tell everyone who is over the context
  limit to prepare for compaction, you all know the drill, you've seen it a hundred time"; "Then,
  some how, trigger compaction"; "Ask me any unknowns or questions now". Compaction itself is run by
  the owner in each session's terminal; the Director tells the seats to run the drill and reports
  ready. The owner's compaction word is a freeze until "carry on" (2026-09-25 and 2026-09-26).
- Standing lesson for every Director: an owner card holds the turn until answered; the cadence loop,
  the monitor and the heartbeat all stop with it. Raise a card only when no seat's deadline waits on
  the Director, after telling the seats the Director goes dark, and put the questions in the report
  text as well.
- OWNER WORD, 2026-09-25 about 11:30Z, in the Director's chat (native, no event id), verbatim:
  "Myrtle turns Canopy (bf4957) takes the exchange seat, but not until they have completed their
  dedicated consolidation session". Myrtle is the lineage's curator (OCE team start 11:26:10Z), so
  the seat is the lineage's exchange seat, vacant since Marten mends Shadow stood down; relayed to
  Myrtle natively at 11:31Z with Marten's handoff record named as the brief. Siren herds Rudder
  resumed in the same session at 11:27Z on the owner's "yes, please run a retro" (a retrospective
  on the two-day exchange arc, for the Director to commit).

- OWNER WORD, 2026-09-25 about 11:40Z, in the Director's chat (native, no event id), verbatim:
  "why do we need the ChatGPT desktop host? My interest is Codex CLI", and on the Director's
  explanation that the Codex seats were started through the desktop app: "nope! They were both
  started via the terminal with `codex`". So the Codex membership programme targets the Codex CLI
  (a terminal TUI, `codex exec`); the wake bridge's node premise that a seat sits on the desktop
  host is corrected; todo 1 drops its desktop legs and Titan's TUI runs are its evidence. Relayed to Swallow natively with the node's todo 1 wording as seat work (same bytes both
  estates). Swallow's card A is closed; no owner action is pending.
- DECIDED by the Director, 11:41Z, overturnable by a line: the lineage's overdue fold (OCE PR 187)
  is the Director's to run once the host load allows a gate, with the gate announced and the sweep
  coordinated with Myrtle and Swallow (the owner's launch word ranks Myrtle's consolidation above
  the fold for Myrtle, not for the fold); Siren's P4 is dissolved by the word seating Myrtle and by
  todo 5 (the donor delivers, the receiver lands).

- OWNER WORD, 12:06Z on 2026-09-25, in the Director's chat (native, no event id), verbatim: "I will
  be away from keyboard for a few hours. All questions go to you first, and any that genuinely
  survive the decision matrix can come to me via push notification, but I don't expect there to be
  many". So while the owner is away: every seat's question comes to the Director; the Director
  decides by the lenses and PDR-063 (owner-absent: a declared deadline and a default); only a
  question that survives all five lenses and is constitutively the owner's goes to the owner, by
  PushNotification, never a card. Relayed to Siren, Swallow and Myrtle natively and broadcast on
  both streams at 12:06Z.

- OWNER WORD to ALL seats, 2026-09-25 about 13:00Z, given in Swallow's session and relayed by
  Swallow at 14:33Z (recorded as relayed, consistent with the owner's compaction words of
  2026-09-24), verbatim: "ALL seats need to STOP stopping mid session because of some ambiguous and
  made up "rules" about context. ALL you have achieved is stopping. Prepare for compaction then
  stop". So: no seat hands over on a context threshold; at a budget signal a seat prepares for
  compaction (records committed, processes stopped, claim retained) and stops; the owner compacts;
  the same session resumes on "carry on". PDR-063's effectiveness-window and 80% triggers and the
  start-right-team skill's mid-cycle retirement triggers are amended to this word, as the same
  bytes in both estates: JC.net's exchange seat at its resume, the lineage's seat as the twin. The
  Director accepted two threshold handovers today (Swallow 51.3%, Siren 58.7%) under PDR-063; that
  reading is retired.

- 2026-09-25 17:2xZ (native, verbatim, answering the Director's three open decisions): "1. Approve
  2. Delete all 3. Try passing my approval to Gale and see if that does the job, I absolutely need
  all seats to be able to push without me". Read: the wake sensor beside the Codex seat is
  approved (slice 2 built by Swallow); the eight branches on the card are deleted (Myrtle, the
  owner's word and each last sha recorded); the owner's approval for Gale's PR 211 push is relayed
  verbatim; every seat must be able to push without an owner prompt, which the Codex config split
  must deliver.
- The owner lands small green PRs by hand and never waits for a seat (owner, 2026-09-26 11:00Z,
  verbatim): "don't block small green PRs on manual, but do maintain a list so that when I ask you
  can give me links". The Director keeps THE READY LIST: every open PR on both estates that is
  green with zero unresolved threads and not a draft, as number, link, changed-file count and
  class, ordered by changed-file count ascending (the order the owner used on 2026-09-26),
  regenerated by the snapshot script at every check-in and handed over the moment the owner asks;
  while the owner lands from it, every seat holds syncs on the listed PRs until the owner says
  done. The seat door lands every ready PR in the same order without waiting for the owner.
- The coordination drafts count toward zero and fold twice a day (owner card answer, 2026-09-26
  about 10:50Z, verbatim: "Fold them twice a day"): at the UTC rollover and at midday each estate's
  coordination PR folds and a successor is cut; the fold is the Director's ceremony and takes the
  first free slot. The rule text (`coordination-branch-24h-lifetime`, the coordination-fold skill)
  is the Director's small PR, same bytes in both estates.
- OWNER CARD QUEUE (lines the owner may reverse by a word at the next contact; none blocks work):
  (1) the Director's ruling that a late-cure push requests its leg so the tip binds and that leg's
  findings are dispositions only (PDR-140 clause 4's last sentence, one blob in both estates;
  lineage event ba36625a; rides JC.net PR 212 and Myrtle's lineage twin).
  (2) Answered by the owner at 14:4xZ: Phobos wakes Void (01a0de) is the Codex team member; P3 is
  its first act (lineage PR 255).
  (3) PR 224's Codex finding that the adoption profile cites private Library records by title,
  disposed by Swallow as the owner's private provenance. (4) PR 250, the owner's new draft of
  12:38Z (`codex/user-value-across-levels`): a seat lands it on the owner's word, as 224. Red at
  14:51Z (static-checks and run-quality-gates FAILURE): a seat cures and lands it on the owner's word.
  (5) At PR 253's landing, the operator's machine-local lineage `.claude/settings.local.json` must
  name PRACTICE_STATUSLINE_LOG_FILE in place of OAK_STATUSLINE_LOG_FILE, or the statusline log
  stops (Siren, 13:10Z; the file is the operator's).

- The WIP limit (owner, 2026-09-26 19:2xZ, verbatim summary: "Each repo is allowed one
  coordination PR"; "The total number of allowed PRs not including coordination PRs is the number
  of implementer agents, in this case three"; "We always strive for all PRs to be merged"). The
  count is read across both estates together; external PRs (fork syncs, Dependabot, CV content)
  count, and the Director analyses and schedules each into the door order; no PR opens while the
  count reads three or more, and the opener reads it first-hand and posts "WIP slot taken: N of
  3" on the estate's stream. Supersedes "No bound" (10:50Z). The full word and the operated rule:
  the napkin's 2026-09-26T19:29Z block.

## Current handoff state (2026-09-26, resumed 19:1xZ after COMPACTION BOUNDARY 8; pointer-biased by design)

Resumed at the owner's start word (19:1xZ) after COMPACTION BOUNDARY 8 (16:32Z); the boundary
records are on origin (SHA:fd448c0b). The napkin's 19:29Z block is the live reading: the state,
the ready list, the owner's WIP-limit word and the rule as operated, the drain schedule, the
card queue (nine lines). PR 211 folded at 15:28:25Z as
SHA:26ca4dab9; the primary resides on coordination/2026-09-26-26ca4d (draft PR 215, DUE at the
rollover). Processes: none of this seat's. Claim 58c2684a retained.

Written for a reader who was never here and may run on a different model. The live reading is
the napkin's latest dated block (`.agent/memory/active/napkin.md`; on 2026-09-26 the check-in and
suite-tally blocks from 11:28Z on, the 13:08Z boundary block, the 15:00Z check-in 27, and the
blocks after them), then the continuity record's newest bullet, then this block. The owner's words are
verbatim in the napkin's dated blocks and in §Standing owner rulings above.

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
- Open at this block's writing: the owner card queue in §Standing owner rulings (five numbered
  lines, one answered; the live copy with the newest lines is in the napkin's latest check-in);
  the retrospective when both estates read one open PR each; the lineage fold (PR 254) at the
  rollover.

## The archive

The live board, the routed verdict and decisions of 2026-09-13, and the routing log to 2026-09-26
11:09Z are in `archive/director-handoff-2026-09-26.md`, moved whole on 2026-09-26; the napkin's
dated blocks are the routing record from then on.
