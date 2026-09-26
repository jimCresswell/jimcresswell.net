# The estates' programme, as planned and approved on 2026-09-26

The plan the Director (Wick binds Temper, ed7b48) wrote at the owner's word of 2026-09-26 about
10:3xZ ("reflect deeply on what needs doing across the estates, and plan it") and the owner
approved in the harness's plan mode at about 10:56Z, conserved here verbatim because the harness's
plan file lives outside the repository. It is a record of the plan as approved, not a plan node:
the plan skill types a delivery node as one step of a lane authored by its implementer at pickup,
and the programme's long-lived home is the strategic node `best-of-each-practice`, which takes the
programme's decisions by amendment under review. The owner's four card answers and the words
recorded in the plan's "Decided this hour" section are verbatim; the napkin's dated blocks of
2026-09-26 (10:17Z, 11:01Z, 11:06Z, 11:28Z) carry the same words with their clock reads. The
state readings are as of the times the plan names and are not maintained here.

---

# The estates' programme: zero open PRs, the door, the exchange, Codex citizenship

Plan by the Director (Wick binds Temper, ed7b48) at the owner's word of 2026-09-26, about
10:3xZ: "reflect deeply on what needs doing across the estates, and plan it", with pr-lifecycle,
proportionality, metacognition, free-play, concept-exploration, reason, plan and parallax
invoked, on the earlier word of 10:09Z: "work is safe when it is merged, the target number of open
PRs is always zero. 24 open PRs is a process failure and creates a risk of losing work and
creating rework".

## Context (the problem, not a solution)

Two estates carry one Practice: JC.net (`jimCresswell/jimcresswell.net`, primary on
`coordination/2026-09-25-cf6897`) and the lineage (`EngraphCode/open-curriculum-ecosystem`,
default `engraph`, primary on `coordination/2026-09-25-749769`). The owner's three goals
(2026-09-24, verbatim): "1. All JC.net Practice innovations integrated into the OCE Practice
2. Codex brought up to first class Practice citizen status 3. All local and remote branches
deleted or in PRs, all PRs merged". The owner's arc for goal one (2026-09-25, recorded by Geyser
in lineage event 777320b2, read first-hand): "We are prioritising all JC.net Practice innovations
being integrated into OCE, then we review. This is a fixed process with an end, not an ongoing
effort. Once the Practice contains the best of both it will be extracted into an installable
entity." The owner's standing word at the seats' boundary (Myrtle's handoff, 2026-09-26): "All
useful work must be pushed and in a PR or merged, all other work, branches and worktrees that are
no longer needed or wanted must be deleted. This is always true."

**The gap.** At 10:10Z the lineage held 24 open PRs (17 green, zero-thread and BEHIND engraph;
241 BLOCKED on six threads; 240 red; 211 conflicting; four drafts) and nothing had merged since
22:24Z the night before. JC.net held one (189, the coordination draft, whose fold was due 11:17Z).
The exchange register in JC.net is fifteen landings stale (Siren's read, 10:31Z). Goal two has
zero of its items complete. Local worktrees and remote branches outside PRs exist in the lineage.

**Who it harms.** The owner: unmerged work is unsafe work, and every day it waits it drifts
against engraph and costs rework. The seats: each slot sync re-opened a review round on
unchanged text and burned the two-round budget. The estate: 24 exposures to loss.

**The mechanism (read first-hand, not from a seat's line).** (1) The engraph ruleset
(21202096) requires branches up to date (`strict_required_status_checks_policy: true`), so every
merge knocks every open PR BEHIND and each landing is one sync push plus 13.5 to 15 minutes of CI,
serial. (2) The readiness slot that serialises the door is hand-run by a live seat; when the
harness paused every seat (22:32Z to 09:49Z) a BLOCKED PR held the slot for eleven hours. (3) The
review round on each sync push is SELF-INFLICTED: the seats' own identity re-requests Copilot two
minutes after every sync (PR 241 timeline 22:28:36Z after the 22:26:41Z sync; PR 216 likewise), and
the Codex connector reviews every push on its own. (4) Opening a PR is free and landing costs a
door turn; two exchange seats cut twelve PRs in one evening, and nothing bounds the intake.
(5) The register that counts goal one is written by hand after landings and fell behind.

**What is NOT the cure (verified by the assumptions reviewer, 2026-09-26).** A GitHub merge queue
on engraph: codeql-action#1537 is open (last confirmed 2026-05-22) and the ruleset's required
"CodeQL" check is the code-scanning app's (integration 57789), which never reports on a
`merge_group` ref under any setup, so a queue would time out and dequeue every PR; GitHub documents
the queue as the alternative to require-up-to-date, not its partner. ADR-204's premise stands,
though for a different reason than it records. The Director itself taking the door: PDR-117's
2026-07-06 amendment forbids a Director seizing a large remaining workload; the seats land, the
Director routes.

**Success looks like.** Both estates at zero open non-draft PRs at the end of each day, the day's
coordination draft folded by rule; a door a seat can run without a review round per sync; an
intake that cannot outrun the door; the exchange register true to the merged list; goal two's
items landing in their order with a Codex seat's live proof; every branch and worktree either in
a PR or deleted on the owner's word.

## Inquiry charter (parallax, Core depth)

- **Purpose and decision owner.** Decide the programme's order and its process cures. The owner
  owns the constitutive decisions (ruleset, intake bound, the two-round rule's counting, their own
  draft PR 224, deletions); the Director owns routing, the slot rule and the door order; the seats
  own execution.
- **Why Core, not Standard.** Stakes are real (work loss, rework) but every action is a two-way
  door except the ruleset and deletions, which are the owner's; the evidence is already first-hand
  (the ruleset, the workflows, the ADR, the timelines, the vendor issue). One serious counterframe
  suffices; a Standard run would cost more than the drain it delays.
- **The counterframe held.** "The bottleneck is seat attention, not the door: PRs need cures, and
  a faster door just moves the queue to the seats." Test: 17 of the 24 have zero threads and green
  legs, so for the current backlog the door binds; for 241, 216, 245, 240 and 211 the seats' cures
  bind. Both are true at different scales; the plan carries both.
- **Scales.** Observation: the generated snapshot (both estates, per check-in). Mechanism: the
  ruleset and the seats' landing recipe. Intervention: seat tooling today, owner decisions by
  card. Consequence: the open-PR count per estate per day. Monitoring: the Director's cadence.
- **Budget and stopping.** The plan is written from the evidence in hand; no further inquiry
  before the drain starts. Reopen if the door's realised throughput is below two landings per
  hour with a seat continuously at it, or if the count rises fold over fold (the strategic node's
  own failure signal).
- **Defeaters.** #1537 closes (reopens the queue question); the Codex connector's push review
  proves unconfigurable; the intake bound idles seats while the door is empty.

## Proportionality gate (before the lenses)

Four things wore one name: the drain (operational, today), the door mechanism (systemic), the
intake (systemic), and the seats' cures (per PR). Kept separate below. Instrument: the drain is
seats and `gh`; the owner's decisions take one numbered card; the queue question was worth the
nine-agent suite once and is not worth a second. Level: named per item.

## The state as read (2026-09-26, 10:10Z to 10:45Z; every line names its surface)

- **Lineage door, live.** PR 241 (the Codex seat-landing rules) MERGED as fc645531c at 10:32Z
  under the Director's ruling, six findings disposed as the ruled residual, no sync (Swallow).
  Myrtle resumed 10:33Z and took the slot for 217 at 10:34Z (sync, CI, legs, door). Swallow holds
  the Codex lane (244, 246, 247, 211 under new claim 56f6f270). Siren holds JC.net (the twin of 216,
  the register PR). The Director routes and folds; it does not merge seats' PRs (PDR-117).
- **Lineage open after 241: 23.** Green, zero threads, BEHIND, in age order: 217 (at the slot),
  218, 220, 221, 226, 229, 231, 232, 234, 235, 236, 237 (after 217), 238, 243, 244 (legs pending).
  One unresolved P2 each: 216 (its twin must settle in JC.net first, ruling 4), 245 (Myrtle's cure
  on resume). Red: 240 (Turbopack Google-font module failing the hub build inside unit-tests on a
  docs-only PR; F-208's class, second instance; the bot cannot re-run CI). Conflicting: 211
  (Swallow: keep engraph's §2.10, renumber the addendum 2.11; the private capture never pushed).
  Drafts: 223 (the fold, due 17:05Z), 224 (the owner's own), 246 (its four focused reviews died on
  the weekly usage limit, reset 2026-09-27 02:00 London), 247 (a design pin).
- **JC.net: 1.** PR 189, the coordination draft; the fold's merge of main is committed locally
  (5516a3cd) with Siren's wrap on top (1d7b57be); the push waits on this plan's approval.
- **Goal one (JC.net into the lineage), by the register's rule.** The register
  (`.agent/reports/practice-transplant/exchange-register.md`) reads 0 of 21 outbound because
  fifteen landings were never written into §Landings; by the merged list it is J4 whole (202, 203,
  205), J18's observer (204, 206 to 209), J15 (227), parts of J9 and J10. In open lineage PRs: J1
  (226), J14 (216), J17 (229, 235), J19 (234), J21 (231, 232, 238), J22 (235), J9's members (220,
  240); joint texts that are not J rows: 217 and 237 (K4), 221 and 236 (the watcher), 218, 243, 245.
  No PR yet: J2 and J3 (not started), J11 and J13 (batch five, delivered, not integrated), J6, J7,
  J8, J16, J20 (batch six code lanes), J18's merge-bot compare half. Owed after batch six: the
  lessons batch, arc-metrics, J18's observer compare. The lineage's own exchange node is
  `status: sketch`; the seat works under the owner's direct mandate of 2026-09-25 14:53Z. Inbound
  (the lineage into JC.net): 5 of 28 landed; the owner's word says this direction comes after the
  review.
- **Goal two (Codex citizenship): the bridge node's three todos plus the exec-binding node's three
  open slices.** Landed: seat-landing rules (241), 2a (228), 2a-ii (233), PR A (222). Open: B0
  (244), the probe record (211), 2b's design pin (247), the branch guard (246). No PR: 2b's three
  PRs, 2c, the bridge's todo 3 (the launch command and the start skill, whose doctrine twins into
  JC.net), exec-binding B, C, D, slice 2 (ends with the live probe), slice 3 (doctrine), the
  landing toolkit (commit and sync wrappers replacing the git allows), the credential-narrowing PR
  (condition 7), the live acceptance seat (blocked on the bridge and the guard-parity node). The
  acceptance test for 241 is the next Codex seat's push without a prompt.
- **Goal three (branches and worktrees), the inventory.** Lineage remote, merged with no PR:
  `feat/codex-dialogue-probe`, `feat/codex-wake-sink`, `fix/merge-bot-refuses-default-branch`,
  `refactor/codex-thread-id-owner`. Unmerged with no PR: `claude/objective-nightingale-b4ba25` (one
  commit, an eight-line macOS validation runner; its PR 123 closed as superseded by 129). Worktree
  `oce-wt-gh-write-guard` (Marten's PR G, uncommitted, judged not landable on 2026-09-24, its patch
  conserved beside Marten's handoff). Local `docs/codex-queue-probe-2026-09-25` at ae110f662 holds
  the private capture commit that never leaves the machine. Twelve local merged branches; five
  worktrees on merged branches plus the temp-directory worktree of the comms EMFILE lane (merged
  as PR 193); the primary's untracked incoming batch directories (Myrtle's; every row is on a PR)
  and Gale's letter. The lineage's `main` is the upstream mirror, kept. JC.net: nothing at risk
  beyond the fold's push.

## Proposals held and refuted this morning (so no seat re-opens them)

- Merge queue on engraph: REFUTED on vendor facts (above); ADR-204's decision stands; its stated
  reason is stale (advanced setup does not cure #1537) and gets a dated amendment-log note.
- The Director at the door: REFUTED by PDR-117's 2026-07-06 amendment; seats land, the Director
  routes; Gale's custodian request answered by naming Swallow.
- "Rounds bind to content heads" as an owner concept: NARROWED. Most of the round is self-inflicted
  (the Copilot re-request); the residual is the Codex connector's own push review, an owner-console
  setting or a counting refinement, the owner's choice.
- The intake bound: the owner's concept by PDR-142 ("no seat-made gate on a lane the owner
  approved"); wording is seat work once ratified.

## Decided this hour (the owner's answers, about 10:50Z; and what the owner did)

Provenance for items 1 to 4: the owner's answers to the Director's four-question card in this
session (the harness's question tool, about 10:50Z on 2026-09-26); the selected option is quoted
verbatim in each item; the napkin's check-in 24 tally records them with this plan's path.

1. **No intake bound** (selected: "No bound"). The seats keep cutting one PR per row; the door's
   pace and the count in every check-in are the only brakes.
2. **The coordination drafts count toward zero and fold twice a day** (selected: "Fold them twice
   a day"): at the UTC rollover and at midday, each estate's coordination PR folds and a successor
   is cut; a fold is the Director's ceremony (coordination-fold skill) and takes the first free slot.
3. **PR 224 (the owner's draft) is landed by a seat on the owner's word** (selected: "A seat lands
   it on this word"): mark ready, sync once, legs, bot merge, at its turn in the size order.
4. **Deletions approved** (selected: "Delete all listed"; the list under Lane 6), by the bot with
   read-back, never before the deleting seat has verified the conserved copy of anything unmerged.
5. **The owner took the door by hand and is done**: thirteen lineage PRs merged by jimCresswell
   under the ruleset bypass between 10:35Z and 10:50Z (240, 211, 229, 235, 243, 247, 226, 231, 236,
   220, 232, 237, 216), some BEHIND with CI in flight; read from gh at 10:52Z. The owner's word at
   about 10:55Z, verbatim: "I have finished landing PRs. I can make judgements that allow me to
   merge small PRs many, many times faster than Practice agents". Consequences: engraph's push CI
   on the final tip (81e126e8e, PR 216's merge, runs pending at 10:52Z) is the proof that the
   waived guarantee held, read before any seat lands; a red run is the first cure lane. Open on
   the lineage at 10:52Z: 217, 218, 221, 223, 224, 234, 238, 244, 245, 246 (ten). JC.net: 189.
6. **The door's shape from now (the owner's word, about 11:00Z, verbatim: "don't block small
   green PRs on manual, but do maintain a list so that when I ask you can give me links").** The
   seat door keeps landing every ready PR without waiting for the owner's hand. The Director
   maintains THE READY LIST: every open PR on both estates that is green with zero unresolved
   threads, as number, link, changed-file count and class, ORDERED BY CHANGED-FILE COUNT smallest
   first, which is the order the owner used (verified from the merged list at 10:58Z: one-file PRs
   240, 229, 235, 243, 247, then 226 at two, 231 and 236 at three, 220 and 232 at four, 237 at
   five, 216 at seven; the owner's word: "I merged them in order of the number of changed files").
   The list is regenerated by the snapshot script at every check-in and handed to the owner with
   links the moment the owner asks; while the owner lands from it, the seats hold syncs on the
   listed PRs until the owner says done. The seat door uses the same size order among ready PRs.
   Falsifier: the owner asks and the list is stale or unlinked.

## Lanes (who does what, in order)

**Lane 0, the door, now.** One seat reads engraph's push CI on 81e126e8e and posts it. Then the
seat door resumes serially for the ten open, smallest first by changed files at 10:58Z: 221 (11
files), 234 (11), 224 (12, readied by a seat on the owner's word), 217 (13), 244 (14, Swallow),
223 (14, the Director's fold), 238 (20), 218 (23), 245 (42, after Myrtle's one cure push; it
deletes the curator-pass records, 39 added and 5,062 removed lines), and 246 (9, draft) once its
reviews run or a posted subagent review stands in lieu. The ready list with links is kept current
for the owner throughout. Seat-door turns: "slot taken" / one sync push /
legs / `merge-bot merge --pr N --expect copilot-pull-request-reviewer --expect
chatgpt-codex-connector` / "slot released" / the remote branch deleted as the bot. A PR takes the
slot when its legs are green and its unresolved threads are zero or resolvable by signed lines
without a push; a BLOCKED holder yields; a holder silent for twenty minutes frees the slot
(Director ruling, 10:21Z, wording cured: "CLEAN" meant green with zero threads, not GitHub's
mergeStateStatus).

**Lane 1, the Director (on this plan's approval, in this order).**
1. Push the JC.net fold (5516a3cd, the merge of main, plus Siren's 1d7b57be), 600 s timeout, gate
   notice first; update PR 189's body (§Scope naming the two reports riding the branch as
   records-class with their intake; the product-gravity line; Siren's dirty files carried across
   by the tree-preserving cut); mark ready; request Copilot under the owner's credential; merge
   through `merge-bot merge --pr 189 --expect copilot-pull-request-reviewer`; cut the successor
   with `pnpm --silent agent-tools coordination successor-name --base "$BASE"` from ONE resolved
   post-fold sha; re-arm the monitor with the new branch label; the fold entry on the seated block
   and the tracked thread record; the rotation broadcast; the loss scan.
2. The lineage fold (PR 223, DUE by the UTC-date rule): stage Gale's letter by path, commit the
   records, merge engraph in (twelve landings moved it), push, mark ready, merge by the bot (or
   the owner lands it), cut the successor, rotation broadcast.
3. Mirror to both comms streams what this hour decided: the suite's nine verdicts in one tally
   line each, the wording cures, the owner's four answers, the door mode; the napkin block for
   check-in 24's tally, with the ninth stale-surface instance (an Explore pass read the lineage's
   coordination-branch copy of PDR-142, 56 commits behind engraph; the cure is to read Practice
   text at `origin/engraph`, never at a checkout on a stale branch).
4. The cadence resumes as check-in 25 about 11:45Z on the generated snapshot (`snapshot.sh` in the
   session scratchpad, owner-ratified), reading the four numbers under Verification; the suite 22
   minutes after each check-in, both stances, on a frame built from the snapshot.
5. P9, the handoff drain, on the successor branch: graduate every behaviour-changing line of
   §Live board, §Routed verdict, §Decisions overnight and §Routing log to its home, move the
   blocks whole to `.agent/memory/operational/archive/director-handoff-2026-09-26.md` proven by
   `cmp`, the live block one pointer-biased page; rides the next JC.net fold.
6. P7, the rule "a ruling names the primary surface it read": distilled entry first (owed in both
   `distilled.md`), then the rule file in both estates, same bytes; JC.net PR today, the lineage
   twin after its drain.
7. The retrospective trigger (below) when it fires.

**Lane 2, Myrtle (the lineage exchange seat).** 216's signed disposition now, its door after
Siren's twin settles (ruling 4); 245's cure as its one settlement push; the remaining green rows
at their turns; then the rows with no PR yet (J11, J13 from batch five; J2, J3; J6, J7, J8, J16,
J20 as code lanes; J18's merge-bot compare half), one PR per row in the register's order; a receipt
to Siren per landing; the incoming batch directories deleted when their last row lands; P8 (PDR-081:
mark §Rationale, §Cascade, §Consequences, §Forbids and §Falsifiability with the file's own
"Superseded 2026-06-14" convention plus a 2026-09-26 amendment-log entry) after 245 lands, twin to
JC.net through Siren; P10(b) is void (PDR-142 is byte-identical, Siren's read); the lineage's own
exchange node (`status: sketch`) gets its ratification stamp from the owner's 2026-09-25 14:53Z
mandate on its next touch. Delete its merged worktrees and branches (approved).

**Lane 3, Swallow (the Codex lane).** 244 (B0) at its turn; 246's four reviews when the limit
resets (2026-09-27 02:00 London) or a posted subagent review in lieu (owner ruling 2026-09-10);
then P1 as the next lineage code PR, worth a door turn the moment it is green: `syncLineage` on
the PR state reading (`agent-tools/src/pr-watch/state-types.ts`), computed in `state-gh.ts` by
lifting the pure-sync test from `agent-tools/src/review-cost/git.ts` (a merge whose tree equals
`git merge-tree --write-tree` of its parents, walk bounded at five), `bindsTip` in
`agent-tools/src/pr-watch/reviewer-legs.ts` accepting a review bound to any head in the lineage,
the same predicate in `settlement.ts`'s two tip filters, a unit test (review on T, head H with
lineage [T] reads SATISFIED; a content push reads OWED), and one clause in pr-lifecycle §Phase 7
and the bot-identity rule: a pure sync push requests nothing. JC.net takes the code by the next
upstream carrier; its text twin is dormant (its ruleset has `strict: false`). Then P2, the door
verb: `merge-bot door --pr N... --expect ... --resync-budget 2` in `agent-tools/src/merge-bot/`
(a pure step machine beside `merge-decision.ts`; `updateBranch` and `deleteRef` beside `putMerge`;
failure rules by verdict name: BEHIND-BASE re-syncs at most twice, SILENT-WAIT-NO-REVIEWER requests
once, QUOTA-SKIPPED, CHECKS-RED, THREADS-OPEN and CONFLICT-DIRTY hand back to the seat); until it
lands, a `door.sh` in the seat's scratchpad runs the same steps; under the door's new shape (item
6) the verb is built only if the seat door runs for more than a day of code PRs, else the script
suffices (proportionality). Also now: the one-file docs PR curing the exec-binding plan node's two
"§2.10" citations (the owner's conflict resolution on 211 renumbered the section to 2.11; commit
c7fdf7192 in Gale's worktree), opened as the bot and left for the owner's hand. Then the wake
companion's 2b as
three PRs on 247's design, 2c, the bridge's todo 3 (whose doctrine twins into JC.net), exec-binding
B, C, D, slice 2 (ends with the live probe), slice 3 (doctrine), the landing toolkit (commit and
sync wrappers replacing the git allows), the credential-narrowing PR (condition 7). Delete the
four Codex worktrees, the merged branches and the private capture branch `ae110f662` (211 merged;
never pushed) (approved). P3, the ADR-204 amendment-log entry (advanced setup since 2026-07-24;
#1537 open; the app's check never reports on merge_group; the low-volume premise refuted; decision
unchanged), is the first act offered to the next Codex seat (below).

**Lane 4, Siren (JC.net).** The register PR (48824c5b: fifteen landings, the corrections, the two
Core CHANGELOG entries) and the 216 twin (1e5b8d30) land in parallel today (JC.net's door needs no
sync); P10(a): the two-round rule's text into JC.net (PDR-132 §Decision item 1's paragraph, PDR-140
clause 4's paragraph, pr-lifecycle's state-machine paragraph, byte-identical to the lineage's);
P6, the readiness slot protocol as one bullet replacing both copies of the landing-slot text in
pr-lifecycle §Phase 7 (the lineage's extra readiness paragraph kept), JC.net PR today, the lineage
twin after its drain; the lessons batch, arc-metrics and J18's observer compare as the last
outbound material; the JC.net twin of 246's guard fix when it lands; todo 8 (the Core's 79 bare ADR
numbers) stays the lineage's lane (PR E under Marten's receipt).

**Lane 5, the next Codex seat (the owner starts it).** Its first act is PR 241's acceptance test:
author P3 (the ADR-204 amendment note, a one-file docs PR) in an isolated worktree and land it
through the merge-bot path with no owner prompt. A prompt on the push is the landing toolkit's
first cure; a clean landing closes condition 5.

**Lane 6, deletions (approved; the bot's REST delete with read-back; each seat its own).**
Remote: `feat/codex-dialogue-probe`, `feat/codex-wake-sink`, `fix/merge-bot-refuses-default-branch`,
`refactor/codex-thread-id-owner` (merged); `claude/objective-nightingale-b4ba25` (the deleting
seat quotes its eight-line runner in the deletion event). Local: the merged branches (twelve at
the morning count, more after today's landings; each verified merged with `git branch --merged
origin/engraph` before removal); `docs/codex-queue-probe-2026-09-25` at ae110f662 (never pushed).
Worktrees: the five on merged branches, the comms-EMFILE temp worktree, and
`oce-wt-gh-write-guard` after the deleting seat diffs its four files against the patch beside
Marten's handoff and finds them equal. Standing from now: every lane's worktree and remote branch
go at its PR's merge. The lineage's `main` (the upstream mirror) and JC.net's branches are kept.

## Goal horizons (honest clocks)

- **Goal one.** After today's landings, J4, J15, J18's observer, J1, J14, J17, J19, J21, J22 and
  J9's members are whole or partial; ten rows have no PR yet (two or three days at the exchange
  seat's pace, five of them code lanes); then "then we review" (the lineage into JC.net, 5 of 28)
  and the installable entity, both after the owner's review. The register PR makes the count true.
- **Goal two.** One of six landed today (241); about fourteen PRs remain across the bridge and the
  exec-binding nodes plus the toolkit and the narrowing: about a week at one seat's pace, faster
  with a second Codex-capable seat; the live proof is Lane 5's first act.
- **Goal three.** Today: JC.net at its coordination draft only; the lineage at its coordination
  draft only by the evening if the owner keeps landing or the seat door runs from about 11:15Z
  (eight green at 16 minutes each is about two hours, plus 245, 216, 224, 223); the deletions done
  and read back.

## Verification (every check-in, from the generated snapshot)

- Open PRs per estate, excluding nothing: the target is one (the coordination draft) each by the
  end of the day, zero at each fold moment.
- Heads with CI in flight: exactly one in seat-door mode, zero while the owner lands; two or more
  is an off-slot sync; zero with a non-empty green list is an unkept slot (name a keeper).
- Landings since the last check-in: two or more per 45 minutes in seat-door mode; fewer names the
  holder's verdict and applies the door's failure rule.
- Slot-holder age over 25 minutes triggers the yield rule.
- `review_requested` events after sync commits: zero once P1 lands.
- Engraph's push CI on the last owner-landed tip: green before the seat door resumes.
- The folds: PR 189 merged as a named sha and the successor cut; the same for 223.
- Deletions: each ref read back absent by the API; each worktree absent from `git worktree list`.

## The retrospective trigger

When both estates read one open PR each (the coordination draft), `jc-retrospective` runs on the
arc "the twenty-four open PRs, 2026-09-25 to zero": the causal stack (an unbounded intake, a
serial door under strict currency, self-inflicted review rounds, a BLOCKED holder across an
eleven-hour pause, a harness pause with no backstop), the counterfactual of a mechanised door, and
P1 to P10 read against their falsifiers; recorded under the lineage's
`.agent/reports/agentic-engineering/` with a pointer in JC.net.

## Risks and reopen conditions

- The owner's bypass landings merged heads whose CI had not finished on the merged tree; the
  proof is engraph's push CI; a red run reopens Lane 0 as a fix-forward lane before any further
  landing.
- The reviewers' weekly usage limit (until 2026-09-27 02:00 London) may hold 246 and any new PR's
  legs; the 2026-09-10 ruling (a vendor declared unavailable on the stream is not in `--expect`;
  a posted subagent review bound to the tip stands as its leg) applies.
- A merge queue is not reconsidered until codeql-action#1537 closes or the required check moves
  off the code-scanning app; the Director does not take the door under any backlog (PDR-117).
- Reads of Practice text happen at `origin/engraph` and `origin/main`, never at a checkout on a
  coordination branch (today's PDR-142 misread).
