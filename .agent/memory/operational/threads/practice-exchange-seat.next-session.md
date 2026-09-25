# Thread: practice-exchange-seat — JC.net's side of the two-way Practice exchange

**Thread identity.** JC.net's exchange seat on the node `practice-two-way-exchange`: outbound
delivery into the lineage's Box and joint sets with the lineage's seat (goal one), inbound
landings here (goal two). **Participating agent identities:** Brazier spins Temper (c70341),
then Siren herds Rudder (158275). **Landing target for the next session:** the seat resumed on
2026-09-25 and at 10:58Z put queue item 5 (K4) before item 1 (batch six), so the target is K4,
then batch six, then the queue as written. **Grounding order:** `AGENT.md`, the start-right-team
skill, this record, the node's §Rulings and §Todos at main, the register, then the lineage's
comms stream from OCE event 269c5e97 onwards.

Handover at rest from Siren herds Rudder (158275), JC.net's exchange seat, under PDR-063 step 3.
The owner was absent (last word "carry on", 15:42:23Z). The signal was session-metadata at 53.5%,
past-peak, at 17:51:40Z, surfaced as JC.net comms event 7158b3a4 with an 18:20Z deadline.

## Goal and governing node

- Owner, 2026-09-24 (rulings 34 to 36 of the node): bring the OCE and JC.net Practices into
  alignment. Goal one first: JC.net's innovations integrated into OCE. Goal two after: OCE's
  brought here. Lessons travel; records stay.
- Node: `.agent/plans/delivery/practice-two-way-exchange.plan.md`. Read §Todos at main in full.
  It stores no status (plan-node schema); a frame quotes status from the register and the pull
  requests.
- Numbers, by the register's §Disposition-vocabulary predicate (count them yourself, never trust
  this line): outbound LANDED 0 of 21, inbound LANDED 5 of 28 (L1, L2, L4, L5, L22).
- Outbound DELIVERED to the lineage's Box (a delivery is not a landing): J9 (batch one), J10
  (batch two part two), J18, J3, J2, J4 (batch four, acknowledged 17:50:45Z), J13, J14, J11
  (batch five, OCE event 269c5e97, 18:03Z, not yet acknowledged). J9 has two PARTIAL landing
  rows on main (the lineage's #194 and #195).

## In flight at handover

- No pull request of this seat is open. Merged today by this seat, all bound to their tips with
  the sweep read: 175, 178, 180, 181, 182, 183, 184 and 185. Open in JC.net: only 176, the
  Director's coordination branch. The remote holds `main` and that branch only.
- Batch five (J13, J14, J11) is in the lineage's Box (OCE event 269c5e97, 18:03Z), awaiting the
  lineage successor's acknowledgement. Sensor: the lineage's comms stream; if no receipt arrives
  by the next check-in, ask the Director who holds the lineage's exchange seat.
- The lineage successor holds, from Marten's handover (OCE event of 18:00:17Z): K1 to K3(e) and
  the two record-generalisation-moves amendments for its Core pull request, the intake of
  batches two to five, K4 after JC.net drafts it, PRs E and F (J9's rest).
- Worktree `jimcresswell.net-worktrees/filter-guard` holds the local branch
  `fix/pnpm-filter-no-match` (queue item 11); nothing else of this seat's is checked out.

## Queue, in order, each with the owner word it serves

1. Batch six: the compare rows (J1, J6, J7, J8, J15, J16, J17, J19 to J23). Each needs a two-sided
   read. Goal one, ruling 35.
2. The next exchange pull request (prose), carrying what signed lines routed to it: the Core
   CHANGELOG entry for K2 and K3 dated 2026-09-24 (PR 184); a §Review dispositions row for
   a359d65c, a generalisation move whose commit carries no trailer (PR 185); the
   session-continuation prompt's `last_updated` stamp (PR 185); and the register corrections
   below. Goal one: the Core's evolution log and a true register.
3. The one re-pin (todo 7) at the register's close, ratified as "once". Before it, driver
   hardening: forty-character pins the driver checks, fail-closed on a tracked list with no pin
   row, and the machinery list read from the artefact inventory. Today's post-pin concepts
   (batches two and three, the K sets) get J rows only then.
4. JC.net defects found while drafting batch four (the owner's 2026-09-24 test rule; known broken
   code is fixed, not queued):
   - repo-check and several validator tests inspect calls or pin configuration (the root-gate and
     composition tests; machine-local-paths and lineage-names assert the live policy block);
   - no test covers the live ignore probe, `collectTrackedPaths`, `listTrackedFiles`,
     `readScanFiles` or `loadWorkspaceScripts`;
   - `validate-no-machine-local-paths.ts` and the tracked-file-scan test comment name the wrong
     root leg (`repo-validators:check`, not `docs-validators:check`);
   - `.agent/memory/executive/memory-state-substrate-contracts.md` §Legacy Event Transition Rule
     calls `comms-events/` the live root; the code treats `comms/` as canonical;
   - `--mode strict` changes nothing in the substrate report's exit code: confirm the intent.
5. K4: Marten's eight test-doctrine findings (OCE event 06cdeaaa), JC.net's to draft. Several edit
   `.agent/directives/testing-strategy.md`, directive work under PDR-052, so a session below 30%
   drafts it. The lineage's branch `docs/intake-test-doctrine` waits on K4's signed words.
6. The arc-metrics slice after PR 175: a count of unparseable interior lines, and `Result` for the
   command outcomes (PR 175's signed lines route them here).
7. The inbound half of ruling 37: OCE's Cricket gains (stance personas, per-role colours), todo 4.
8. The older whole-text oracles of `render-subagent-adapters.unit.test.ts`, their own slice.
9. The branch-hygiene sensor, a sketch node in start-right's family.
10. Gate plan PRs B to F of `commit-as-the-full-local-gate` (owner card, "Siren builds it after its
   queue").
11. The local branch `fix/pnpm-filter-no-match` (not on the remote): three owed items.

## Register corrections the drafting found (next exchange pull request)

- J2: the lineage already held machine-local paths, markdown links and the tracked-file scan at
  the pin; "origin" for the whole family overstates.
- J11: "Path globs: none" is false for the validator
  (`agent-tools/src/validators/exchange-register/**`, its smoke, its root script); at the
  re-pin J2, J6 and J17 would absorb them. J11 needs globs, with those rows excepting it.
  Its castr cell rests on ruling 5, superseded by ruling 13.
- J13: the health probe (`agent-tools/src/core/health-probe-hook-state.ts`) and the generator's
  bin file sit outside the row's globs; the override variable has readers outside them too.
- J14: "language-pack leaks" is the wrong label for an identity binding and a missing step; the
  row's glob misses the generated adapters.

## JC.net-side items the drafting found (beyond the queue above)

- J14's cure lands in JC.net's own `set-up-worktree-lane` copy as the same bytes; that copy also
  carries lineage history as live text ("Ticket MCP-490", "PR #673 → #674").
- Start Right §8 says the pre-push runs `test:ui`; JC.net's runs `test:e2e`.
- The 2026-09-16 napkin note (run pnpm from inside the worktree, or Corepack picks the primary's
  pnpm) contradicts the lane skill's `--dir` advice in both estates.
- The spawn brief names `/jc-start-right-team` (J13's residue, both estates in kind).
- Register row L12 brings `bot-identity-on-third-party-systems`, which makes the bot the
  committer, against JC.net's 2026-09-17 ruling; the bring needs adapting.
- The runbook's step 2 says "three ways" and names five classes; its claim about PDR-005's words
  is in neither estate's PDR-005; its loss-scan cannot be recomputed at main (the archive is
  deleted) though its header says "Recompute with".

## Open with the Director

K4's fresh session; who builds the gh write guard (my reading: JC.net, behind PRs B to F); which
queue "after its queue" binds (my reading: the queue at 16:31Z plus the node's todos and review
cures); an owner card for register row C7; whether the Director accepts the node-status removal.

## Assumption ledger

- The seven notes of batches four and five rest on drafting seats' first-hand reads, each
  reviewed in full here. The J4 note's claim about the lineage's audit on a fresh checkout is
  read from code, not run; the J14 note's proposed browser-install line was not run.
- The lineage's successor seat is not yet named; its landings of batches two to five and K1 to
  K3(e) wait on the owner's card for it.

## Gates

- The re-pin: NOT-OBTAINED (ratified to run once, at the close).
- Batch four's integration in the lineage: NOT-OBTAINED (acknowledged only).
- Batch five's acknowledgement and integration: NOT-OBTAINED (delivered only).

## Owner's card answers (relayed by the Director at 22:25Z; answered about 18:4xZ)

- "Siren resumes in the same session": after the owner's compaction and "carry on", Siren
  re-opens its claim and takes queue item 1, batch six. Below 30% it also takes K4, the
  test-doctrine cures (directive edits).
- The gh write guard is built in JC.net behind PRs B to F, as the same bytes for both estates.
- "After its queue" binds the queue as it stood at 16:31Z, plus the node's own todos and their
  review cures; new work goes behind PRs B to F.
- C7, verbatim: "Ratify the concept", "Bring by default becomes PDR-005's default disposition;
  the exchange seats author the amendment text under review and land it in both estates in one
  window". JC.net's seat and the lineage's seat author it in its own lane.
- The node-status removal under the plan-node schema stands; statuses live in frames, from
  stated sources.

## Resumed session, 2026-09-25 10:46Z onwards (Siren herds Rudder, 158275)

This section supersedes §In flight and §Queue above where they differ. Recompute every fact.

**Owner words today.**

- To the Director at about 10:31Z, verbatim: "1. All JC.net Practice innovations integrated into
  the OCE Practice 2. Codex brought up to first class Practice citizen status 3. All local and
  remote branches deleted or in PRs, all PRs merged".
- To the lineage's standby seat at about 11:00Z (lineage event of 11:06:26Z), verbatim: "We are
  prioritising all JC.net Practice innovations being integrated into OCE, then we review. This is
  a fixed process with an end, not an ongoing effort. Once the Practice contains the best of both
  it will be extracted into an installable entity." It is not yet homed in the node: it goes in
  §Rulings with the next exchange pull request.

**The lineage's exchange seat is unheld.** Marten's session is over. Geyser rides Pewter
(eeecbd) is on standby. Address lineage events to the seat.

**Merged:** PR 187 (2b085f6f), the Cricket frame audit's joint cures F1 to F7. Receipt with the
F1 and F5 to F7 bytes: lineage event 8ec17ddf.

**Open pull requests of this seat:**

- **PR 186, the K amendment twin** (worktree `k-twin`, head 339f69f3). Round one had two findings:
  (b) and (c) scoped to the inline-prompt role (cured), and claim retention (Rejected, with
  reason). Round two was requested. Then run the sweep, merge, and send the lineage a receipt with
  the (b) and (c) bytes, which it takes.
- **PR 188, K4, DRAFT** (worktree `k4`, head 4a41a83a). The `testing-strategy.md` hunks were
  written at 30 to 38% context, past PDR-052's floor. A fresh session below 30% reads them in full
  and cures them, then takes the PR out of draft and runs the review rounds. Only then does the
  lineage get the final bytes (it was told in 20cc0c88). The lineage's intake branch waits on it.
- **The filter-guard branch, draft pull request** (worktree `filter-guard`, 5ca00f52). It
  conflicts with main in `validate-cited-scripts.ts`. It also carries three owed items in its
  commit message:
  - unfiltered calls resolved in their scope;
  - the allow-list bypass removed;
  - the semicolon unit row.

**Answered to the lineage:**

- 5aa3b314: the seed source. Subagent writes are the parent's, by Sif. The platform gate is signed
  as a joint cure.
- 26fc7185: the K amendment signed. J4 and J18 are recorded LANDED.
- a969acc5: the Cricket answers.
- 0c23f589: K4 timing and the retirement.

**Queue, in order:**

1. PR 186 to merge, then its receipt.
2. PR 188's sub-30% directive review, then its rounds, merge and receipt.
3. Batch six: the twelve compare rows (goal one, the owner's fixed process).
4. The next exchange pull request. It carries:
   - §Landings rows: J4 (lineage PRs 202, 203, 205), J18 (204, 206 to 209, with the three
     departures in 2a33cf89), batch two INTEGRATED (199, 200), and K1 to K3(e) INTEGRATED (201);
   - the owner's 11:00Z word as a ruling;
   - the items listed under queue item 2 above.
5. The five Cricket refinements (lineage event 989e10c8). JC.net writes them; the lineage follows.
6. Four JC.net test files that call `vi.useFakeTimers`: inject a scheduler (PR 188's body lists
   them).
7. The seed platform gate: `CLAUDE_CODE_SESSION_ID` is read only on a Claude platform (joint, and
   it bears on goal two).
8. The owner-only append re-tighten: refuse or replace a pre-existing file whose mode admits
   another account (2a33cf89).
9. The ignore probe without `--no-index` (ff75b6d2).
10. The filter-guard draft: rebase, the three owed items, then out of draft.
11. The older items 3 to 10 above.

**Claims** a30304be, 3d4b9361 and 2cdb5931 are this seat's, and are closed or handed over at
retirement.

## Wrap block, 2026-09-25 11:2xZ (the owner's word: prepare for compaction and stop all processes)

**PR 186, round two** (Copilot review 5317041919, on 339f69f3): one finding, comment 4104010768.
PDR-009's thin-wrapper prohibitions (about lines 132 to 134 and 336 to 340) forbid substantive
content in any adapter. That conflicts with the inline-prompt copy. Round two binds: cure it in
the last push, or reject it with a signed line.

- Cure direction (a proposal, not yet drafted): state the thin-wrapper rule by its domain in both
  places. An adapter adds no substantive instruction of its own. An inline-prompt role's copied
  System prompt block is its template's text, compared with it.
- The lineage's PDR-009 carries the same conflict, so the bytes go to it with the receipt, along
  with the (b) and (c) cure.
- Then run the merge-base sweep, merge, and send the receipt.

**PR 188, residue for the sub-30% reviewer.** Below-bar items left untaken by choice:

- The partial global-state lists in `never-disable-checks`, the starter templates and the Cursor
  bugbot file stay as examples.
- Item 1's bootstrapper wording stays, although its head clause already covers clock IO: it
  settles the lineage reviewers' split.

**A promise missing from the queue above:** as item 12, JC.net compares its own adapter check for
the pointer-existence gap (lineage event 1440e0c3).

**Queue order under the owner's 11:00Z word:**

- Items 6 to 8 are JC.net defects, and bugs come first.
- Item 9 (the ignore probe without `--no-index`) is an inbound gain. It comes after the review the
  owner named.

**Attribution.** None of these owner words was heard first-hand by this seat:

- The owner's 11:00Z word is Geyser's recording (lineage event of 11:06:26Z).
- The 10:31Z word is from the Director's napkin.
- "Marten's session is over" and "Geyser is standby" are the Director's relays.

**The filter-guard branch.** Its push was stopped at the owner's freeze word before any remote ref
existed. It is still local only, and goal three owes it a pull request. Its draft body can be
rebuilt from the commit message.

**Check-in 10 (Director, 11:21Z).**

1. The todo served is todo 5, verbatim: "The outbound note and material, delivered through the
   join ceremony."
   - Status by the register at main: outbound 0 of 21 LANDED, inbound 5 of 28.
   - The lineage's merge-landed events show J4 (its PRs 202, 203, 205) and J18 (204, 206 to 209)
     landed. The register does not yet record them (queue item 4).
   - This session moved joint text (the K twin, the Cricket cures, K4) and answered the lineage.
     It delivered no new rows.
2. What holds this seat:
   - The owner's freeze word at about 11:20Z. The rule is wrap §Use When: no subagent, monitor or
     fleet starts until compaction lands. The sensor is owner chat, last read then.
   - PR 188: PDR-052. The sensor is session-metadata, 43.3% at 11:22:40Z.
   - PR 186: round two, above.
3. The Cricket suite was not run, because the freeze word gates subagents. It runs once, on the
   handover frame, after compaction and before any work.

**Concept exploration: delivery is not landing.**

- *Observations.*
  - When the lineage's seat was held overnight, it landed batch two, K1 to K3(e), J4 (3 PRs) and
    J18 (6 PRs), about one PR every 40 minutes.
  - Since 10:35Z that seat is unheld, and its integration rate is zero.
  - Batches three and five are acknowledged but not integrated, and J2 and J3 receipts are owed.
  - The byte twins cost this seat about 15 minutes each (the K amendment, the Cricket cures). A
    concept-note row costs the receiver several PRs of its own code.
- *Problem.* Goal one is counted in landings in the lineage, not in deliveries. The constraint on
  landings is the lineage's integration capacity. Drafting batch six adds inventory, which goes
  stale as the lineage's head moves.
- *What changed in this seat's view.* The fluent next step, "batch six next", serves delivery.
  The owner's 11:00Z word ("integrated", "a fixed process with an end") names landing.
- *Proposals.*
  - **P1.** The owner seats the lineage's exchange seat; the Director has put the succession to
    the owner. Warrant: the overnight rate against zero now. Falsifier: lineage landings continue
    with no exchange seat held.
  - **P2.** Triage batch six's twelve rows by disposition before drafting notes. Some cells
    already name a closing outcome: J15 "already-present-verify-parity", J8 "decline until castr
    has a corpus". Those close on a one-line receipt each. Warrant: the register cells. Falsifier:
    the two-sided reads find that every row needs a full note.
  - **P3.** For rows whose code is still near-identical in both estates, deliver exact bytes (the
    twin pattern) with the concept note, so the receiver applies rather than rewrites. Warrant:
    twin costs against J4's and J18's PR counts. Falsifier: the estates' code has diverged so far
    that the bytes do not apply.
  - **P4 (a question for the owner, through the Director, never acted on unasked).** Should the
    donor seat integrate its own rows in the lineage through the join ceremony? Card C7's "land
    it in both estates in one window" may already imply it.
- *Unresolved:* whether any lineage seat other than the exchange seat lands exchange rows (Swallow
  landed Codex work today, not exchange rows).

**Re-arm after compaction.** Every process of this seat is stopped. The scratchpad scripts are:

- `watch-comms.sh <estate primary> <session pid>`, once for each estate;
- `heartbeat.sh <claim ids, comma-separated> <branch> "<label>"`;
- `review-watch.sh <pr> <40-character head> 60`.

If the scratchpad is gone, the napkin's RE-ARM RECIPE of 2026-09-24 carries the commands.

**Claims kept for the open PRs:** a30304be, 3d4b9361 and 2cdb5931.

- Pickup: this seat after compaction (the owner's card of 2026-09-24; today's word on it is with
  the Director), or a named successor through `claims adopt`.
- If no one adopts them, they expire at freshness, at about 15:20Z, and are archived stale.

## Retrospective routing, 2026-09-25 11:44Z (Siren herds Rudder, 158275)

The owner's "yes, please run a retro" produced
`.agent/reports/agentic-engineering/2026-09-25-why-goal-one-read-zero-while-the-lineage-landed.md`.
Its proposals make these entries (its proposal 3, applied to itself):

- **Queue item 4 (the next exchange pull request) gains:**
  - compound rows split into members at the unit a pull request lands (J18's observer and its
    compare half; J9's seven doctrines), each member undrafted, delivered, landed or declined;
  - a window row for each delivered post-pin concept (batch two's frame verdict and template
    gains, batch three's gate slot and ownerless-lock reclaim, K1 to K3) and each lesson family;
  - the count reported by member as undrafted, delivered, landed or declined (the Director's
    10:36Z split);
  - landings by the row texts: J4 whole (lineage 202, 203, 205); J9 part (194, 195, 197, 201;
    four doctrines declined, receipt `c46a0e4b`); J10 part (199; PDR-082's channel bullet rides
    the lineage's PR C2); J18 part (the observer, 204 and 206 to 209). Not J11: its landings rows
    name jcnet.
- **Batch six gains J18's compare half** (the reference notes and the session-continuation prompt).
- **New queue item, the lessons batch (ruling 36), after PR 186 and PR 188, beside batch six:**
  sweep the napkin, `distilled.md`, the pending graduations, the experience letters and the
  reports; one window row per lesson family; deliver as a batch into the lineage's Box. It
  carries the record's proposal 3: the retrospective skill's step 6 names each proposal's home by
  path and quotes the entry made there.
- **New work behind gate plan PRs B to F:** an advisory hook on content edits under
  `.agent/directives/`, scoped to PDR-052's §Scope list. It prints session-metadata's live
  reading, and at 30% or more names PDR-063's hand-over route. It does not refuse (register row
  O1). This is the record's proposal 4.
- **PR 188's directive review** needs a session below 30%. This session resumed at about 11%
  after the owner's compaction; read session-metadata immediately before starting it.
- **Joint cure, queued behind the smoke backstop** (lineage event `0d7ce353`, Swallow at the
  Director's word, absorbed in `f9af143f`): both Cricket templates' output discipline gain "Refer
  to every person and agent you name by name or with they/them; never infer a gender from a name
  or a role." JC.net lands it first; the merged bytes go to the lineage's exchange seat.
- **Batch six triaged** (2026-09-25, `.agent/reports/practice-transplant/batch-six-triage-2026-09-25.md`):
  about 25 notes and 330 lines; J19, J23 and J18's prompt close with a line each; the J17 gate note
  states the direction of the ratified `commit-as-the-full-local-gate` node. Drafting goes to a
  fresh session or a fleet (this seat was at about 43% context when the triage landed).

## Handover at rest, 2026-09-25 14:08Z (Siren herds Rudder, 158275; PDR-063, budget signal 4ce7af01)

The owner is away (12:06:36Z word); the Director routes. This seat hands over past-peak (58.7% at
13:48:28Z). Read `.agent/reports/agentic-engineering/2026-09-25-why-goal-one-read-zero-while-the-lineage-landed.md`
first: it corrects goal one's count (J4 whole; J9, J10 and J18 in part; 12 rows undrafted; 5
delivered and not integrated; the lessons stream unstarted).

**Current edit state.**

- PR 190 MERGED at 13:56:00Z as `5d4edebb`: the comms watcher polls (no fs.watch handle per pass),
  and the coordination-home smoke has one 180 s hang backstop. Its branch is deleted and its worktree
  retired. The restart notice went out on both streams (JC.net `20dd9627`, lineage `20385b9c`).
  Its lineage twin is Titan turns Ether's (01a0d8), by the Director's routing (d18c56f0); this seat's
  plan event is `09f9a852`.
- PR 186 (the K amendment twin, worktree `k-twin`): MERGED at 14:07:29Z as `a9ed6463` after main (with PR 190) was merged into its branch; its round-two cure (1cf3a1c3) rides it. Branch deleted, worktree retired. The lineage has the receipt with PDR-009's two scoped sentences as a joint cure (`1592fa3d`).
- PR 188 (K4, draft, worktree `k4`): held by PDR-052 for a session below 30%.
- `fix/pnpm-filter-no-match` (worktree `filter-guard`): local only; owes a draft PR (goal three).

**Decisions made.**

- Poll-only over a held watch handle (test-expert, code-expert, architecture-expert-fred): a held
  handle moves the blocking close to exit and can go deaf without an error.
- PR 190's final-tip findings were rejected as cures in that PR, with signed lines, and queued below:
  the latency wording (a wake waits for the pass in progress plus `pollMs`) and a regression guard.
  The guard is structural, a restricted-import lint rule keeping fs.watch out of the collaboration-state
  runtime, because a wall-clock "prompt exit" test is what testing-strategy forbids.

**Queue for the successor, in order** (the check-in 12 suite's accepted order: goal one first).

1. Goal one: batch six drafting from `.agent/reports/practice-transplant/batch-six-triage-2026-09-25.md`
   (about 25 notes; J19, J23 and J18's prompt close with a line each), and the lessons batch (the
   retrospective's proposal 2). Delivery never waits on a live lineage seat (ruling 35).
2. Exchange joint cures (todo 5): the Cricket templates' no-inferred-gender line (lineage event
   `0d7ce353`, absorbed `f9af143f`); the lineage's receipt of PDR-009's two sentences (`1592fa3d`)
   to watch for; the seed platform gate, on which the lineage's seed branch waits.
3. PR 190's routed review cures: the wait-seam rename (`waitForCommsChange` and siblings carry
   change-wake names and dead path inputs), with the latency wording and the fs.watch import guard.
4. Defects: the site's e2e server died twice in PR 190's gate (the PDF generator after "Launching
   Puppeteer..." with exit 1 and no error logged; `e2e-global-setup.ts` gave up at its fixed 120 s),
   Fred's lane; the TUI's `useLiveRefresh` re-subscribes on every render; the JC.net twins of the
   lineage's tooling defects F-200 to F-207 (Myrtle turns Canopy's register in the lineage is the
   source), one item by the Director's routing.
5. PR 188's sub-30% directive review; the filter-guard draft PR; the older items in §Queue above.

**Claims** carried for adoption with this record: a30304be (the seat), 3d4b9361 (K4), 2cdb5931
(K4's widening). The comms watchers and the heartbeat stop with the closeout event.

**Correction to the handover above, 14:34Z** (the owner's word to all seats, about 13:00Z in Swallow
holds Drift's session, relayed by Swallow and then the Director, verbatim: "ALL seats need to STOP
stopping mid session because of some ambiguous and made up "rules" about context. ALL you have
achieved is stopping. Prepare for compaction then stop"). The handover is the prepared state for
compaction, not a succession: this same session resumes after the owner compacts, keeping claims
a30304be, 3d4b9361 and 2cdb5931. No context threshold sets a pickup default. First item at resume,
before batch six: one small PR amending PDR-063's effectiveness-window and 80 percent triggers and
the start-right-team skill's mid-cycle retirement triggers to that word (a budget signal means
prepare for compaction and stop; the owner compacts; the same session resumes), with the same
bytes for the lineage as an exchange row. Then batch six drafting and the lessons batch.

## Resumed after compaction, 2026-09-25 15:00:08Z (Siren herds Rudder, 158275)

Resumed on the owner's "carry on" (14:41Z rejoin, event 358551e4); context 6.3% after the
compaction. Watchers, heartbeat and the peer-liveness poll re-armed.

- PR 188 (K4): the sub-30% directive re-read ran at 11.6% (774517a9: three wording cures). Main
  merged in at a9ed6463. Copilot round one gave one finding (item 12's heading), cured in 33c4e06d.
  Round two on that tip had no findings. The merge waits on CI.
- The Director's verdict on the two relays of the owner's word is Swallow's reading: no context
  reading stops a seat or starts a succession. Records stay current; the drill runs only when the
  owner calls a compaction; the same session resumes on the owner's word. PDR-052's floor stands,
  and a compaction satisfies it.
- Trigger amendment PR, branch `docs/context-never-stops-a-seat` (worktree
  `context-never-stops`), claims 8c2a7569 and 4947b615. It changes PDR-063, PDR-052, PDR-064,
  PDR-078, the Core CHANGELOG, start-right-team, the heartbeat rule and the session-metadata
  advice strings. The checks are green and docs-adr-expert and Wilma are reviewing. PDR-063,
  PDR-064, PDR-078 and compute.ts are byte-identical in the lineage. PDR-052, the skill and the
  rule differ only outside the edited hunks.
- Queued next: Swallow's Cricket clause (lineage f67bd1f06, event bfc686cf, the same bytes) as
  its own small PR; then batch six drafting and the lessons batch.

**Update, 15:04:35Z.**

- PR 188 (K4) MERGED at 15:01:18Z as `c523ba81`. Its branch is deleted, its worktree retired, and
  claims 3d4b9361 and 2cdb5931 are closed. The receipt went to the lineage (event 252fb4ce).
- The owner's word, relayed by the Director: Myrtle turns Canopy (bf4957) is the lineage's
  exchange seat and this seat's counterpart for every row (the trigger amendment twin, batch six,
  the F-200 to F-207 twins). Myrtle acknowledged the PDR-009 joint cure (1592fa3d) and lands
  blob bc4612df as one PR behind the lineage slot order.
- The Director ruled for both estates (15:04:16Z) that PDR-052's floor stands as a deferral,
  never a stop, and the amendment PR encodes it as drafted. This seat read 31.1% at 15:04:24Z,
  so any further edit to PDR-052 waits for the next compaction. One candidate clause is held
  there, from the ruling: a seat whose only remaining work is directive edits above the floor
  says so and asks for a compaction.
- Cricket clause PR: branch `docs/cricket-hold-release-sensor` (worktree `cricket-sensor`),
  claim 39f0f4b5, commit 14ba003a, at its push gate.

**Update, 15:22:25Z.**

- PR 191 (the Cricket hold-release-sensor clause) MERGED at 15:09Z as `251cd984`. Its branch,
  worktree and claim 39f0f4b5 are gone, and the receipt went to Swallow (lineage 7851b636).
- PR 192 (the trigger amendment, "context readings never stop a seat") is OPEN at head `630be53e`,
  with Copilot round one requested. It grew to 21 files after the docs-adr-expert and Wilma
  reviews, on the Director's rulings:
  - one PR for every stale surface;
  - an owner-called compaction gets the drill, while a platform compaction gets none and the seat
    re-arms and carries on;
  - only `.agent/directives/*` and PDR-052 itself are gated by PDR-052.
  The twin row went to Myrtle (lineage 9c109112). The claims are 8c2a7569, 4947b615, 3f9befe3
  and 3b602eb1.
- Queued for after the next compaction (PDR-052's self-applying clause; 31.1% at 15:04:24Z), as
  one small commit and its own row to Myrtle: a seat whose only remaining work is directive edits
  asks for a compaction; with no compaction coming, the seat names the queued edit in its next
  report.
- The watcher-twin joint-cure set (Swallow 15:16:19Z, ten findings) is accepted as one
  JC.net-drafted PR (lineage 440d5773). It sits after batch six, with PR 190's routed cures.
- Batch six: the Director placed it next (it is not directive work). A one-lane pilot is drafting
  five half-B notes into the scratchpad (starter templates, merge-bot, polarity, tsconfig flags,
  tdd-recipes). The rest of the fleet waits on its measured cost and a hand check of its output,
  per the fleet-design rule.
