# Thread: practice-exchange-seat — JC.net's side of the two-way Practice exchange

**Thread identity.** JC.net's exchange seat on the node `practice-two-way-exchange`: outbound
delivery into the lineage's Box and joint sets with the lineage's seat (goal one), inbound
landings here (goal two). **Participating agent identities:** Brazier spins Temper (c70341),
then Siren herds Rudder (158275). **Landing target for the next session:** queue item 1, or
item 2 if the Director asks first. **Grounding order:** `AGENT.md`, the start-right-team
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
