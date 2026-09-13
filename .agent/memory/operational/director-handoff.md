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

## Current handoff state (2026-09-13, about 17:40Z, n=2 with lane A)

Where this block and the routing log disagree, the log's last entry is current; this block is
rewritten at each Director push.

- Director: Cauldron herds Lustre (880ff9), claim `1db07581`, thread `transplant-closure`,
  branch `chore/director-records-2` (records only; the Director makes no source edits).
- Controlling node: `.agent/plans/delivery/practice-completion.plan.md` §Transplant closure.
  Landed on `main`: item 1 (archive deleted), item 2 (PR #53, `55649a2`), item 3 (PR #56,
  `1829cd4`), item 4 as bounded (PR #57, `4a61112`), the Director records and the channel rule
  (PR #54, `c426c6c`).
- Open pull requests: #58 (this records branch; bot merge at zero threads once Copilot binds the
  tip); #60 (lane A, the per-checkout Playwright port, option A, under Copilot); #55 (lane B's
  sweep, handed back; one Copilot thread, a path escape in the sweep's rule names, cure by lane A
  in lane B's worktree); #59 (lane C's napkin capture, carried on #58 as `a3bb608`; closes as
  carried when #58 merges).
- Team state: owner word 17:16Z, "this is now an n=2 session, you and Saffron" (PDR-082; the
  Director's heartbeat stopped, watcher kept); 17:18Z the ARC channel opened beside native
  messaging. Lanes B and C handed every responsibility back and stood down (closeouts on the
  stream; lane B's record `handoffs/707ed764-…3.json`; lane C's claim closed).
- Merge mechanics learned today: every agent PR write runs as the bot; the bot cannot request
  Copilot here (the owner's CLI credential can; the request registers on the timeline within a
  minute unless the previous request's review is still in flight, when it registers nothing; the
  review takes 8 to 15 minutes); a push re-opens the round; `merge-bot merge --expect
  copilot-pull-request-reviewer` binds the leg and merges only at SETTLE-READY (a ten-minute
  quiet window after the last review, which the owner wants replaced by measured state); pushes
  serialise for host load: the seat asks, the Director confirms, the seat pushes and releases.
- Re-arm after compaction, checking first (PDR-133): the all-channels comms watcher (Monitor,
  `comms watch --exclude-tag heartbeat`), then `assert-watcher-live`; the ARC channel tail; no
  heartbeat loop at n=2. Checked 15:39Z: background tasks outlive a compaction.
- Next safe step: merge #58, #60 and #55 by the bot at zero threads (Copilot bound to each tip);
  close #59 as carried; remove the `closure-lane-c-restore` worktree and branch; then the owner's
  word on the next shape for the holdings on the board.

## Live board

| Lane | Items | Owns exclusively | Seat | Claim | Branch / PR | State |
| ---- | ----- | ---------------- | ---- | ----- | ----------- | ----- |
| A | 3 done; the port PR; the #55 cure; then 5 | root scripts, CI workflow, `agent-tools/` legs and retirements, the leak validator, `tooling/*/package.json`, `turbo.json`, `jcdotnet/accept-md.config.js`, the incoming bundle, the Playwright harness config | Saffron turns Verdure (c39ad7) | f024e1f1, 5828b0ee | `fix/e2e-port-per-worktree` PR #60 at 4fad844; `closure/lane-b` for the #55 cure; 64aa005 held on `closure/lane-a-checkpoint` for item 5 | ACTIVE at n=2 |
| B | 6 | `.agent/rules/**`, `RULES_INDEX.md`, `.cursor/rules/**`, `.claude/rules/**`, `.agents/rules/**`, the rules-index and trigger generator, sub-agent adapter descriptions | Sirocco wakes Wingspan (45fe02) | closed | `closure/lane-b` PR #55 at 6b1b4c3; `closure/lane-b-generator` at d76bb86 (2a fold conserved in the record) | STOOD DOWN 17:14Z; handed back: #55 to merge, 2a, 2b, PR 3 |
| C | 4 then 7 | the definition report, `testing-strategy.md`, the substrate manifest's register declarations, the Gemini projection | Djinn hunts Solder (36720b) | closed | `closure/lane-c` deleted (merged, #57); `closure/lane-c-restore` at 8cbebb6 (PR #59, carried on #58) | STOOD DOWN 16:57Z; handed back: the restore, `sif`, five patterns, the Gemini projection after 2b, item 7 |
| Director | 7 | reports index, runbook step 13, `provenance.yml` completion entry; merges | Cauldron herds Lustre | 1db07581 | after the holdings land | routing lane A; merging |

Sequencing constraints: B owns `.agent/rules/` alone, so C's rule edits travel to B as a
directed event, not a commit. A's two items are two PRs, item 3 first. Pushes serialise, one
gate at a time, for host load: two full-host gates exceed the host (the earlier reason, Playwright
reusing a running :3000 server, is retired by the per-worktree port PR). Item 7 is written last
because it records 3 to 6.

## Routing log

- 2026-09-13 evening: seat opened; team-start `ca1ba4d8`; lanes A, B, C authored, unfilled.
- 2026-09-13 evening: pre-push gate red on the Director records because markdownlint walks the
  disk and linted the untracked, generated `shared-comms-log.md` (green in CI, red locally: a
  check that reads the local disk proves the local disk). Stepping stone applied by the Director
  (one ignore line, `.markdownlint-cli2.jsonc`); the cure is routed to lane A: lint the tracked
  universe, not disk globs, and drop the hand-kept ignore list (`compute-dont-hope`). Prettier
  failed the same way minutes later on an untracked editor workspace file; second stepping stone
  (`*.code-workspace` in `.prettierignore`), same routed cure.
- 2026-09-13 13:49Z: three Implementer team-starts landed (Saffron c39ad7, Sirocco 45fe02, Djinn 36720b);
  routed A, B, C by arrival order (events `cc2786a4`, then the roster event); all hold on the
  owner's word. Lane A also carries the tracked-universe lint cure.
- 2026-09-13 about 14:00Z: owner go received; relayed natively and as directed events `0349479b`,
  `8cca63df`, `7b0ab8aa`; all three absorbed. Verdict to lane B: `trigger` key added; the index wins
  where the two hand-kept sources disagree, reconciled rules listed in the PR. OCE checkout location
  sent to lane C natively (machine-local; never a tracked line). Lanes A and C entered their
  worktrees; lane A follows the practised commit identity (no merge-bot identity here).
- 2026-09-13 about 14:10Z: lane B sub-class (eight index-core rules with hand-kept globs and paths)
  ruled situational: the more specific declaration wins; recorded in the lane B record.
- 2026-09-13 about 14:15Z: lane C asked two decisions. Gemini projection: generated by lane B's
  generator as a fourth platform, extension authored by lane C after B's PR 2 (B releases the
  emitter path then). Rows 3 and 5 residue: removed, separate PR after item 4. Substrate-leg
  finding (reads instance-tier files relative to cwd) routed to lane A with credit.
- 2026-09-13 about 14:25Z: lane A corrected the routed substrate-leg shape: a gate must not resolve the
  primary coordination home (that reads another checkout's disk); it derives the instance tier from
  the ignore rules instead. Accepted. Lane C bumps the substrate surface-count guard in its PR by
  that constant's contract; lane A told. Identity rows added to the three lane records.
- 2026-09-13 about 14:35Z: PR #54 (Director records, channel rule) merged at `c426c6c`. Push order set:
  lane B sweep, lane A PR 1, lane C item 4. Board follow-ons from lane B: ten `invoke-*` rule
  descriptions are name-only (authored content, later small PR).
- 2026-09-13 about 14:50Z: owner: "I expressly said to keep the merge bot tools, this makes me
  concerned for what other instructions are being overturned." Audit of in-flight verdicts against
  ratified text found two overturns, both reversed: the Director's removal verdict on the corpus
  workflow and `sif` instruments (todo 1 says restore) and lane C's "not brought" on two registers
  (todo 3 says create or declare). Merge-bot: kept and scrubbed as ratified; the owner created the
  app (slug in `.github/merge-bot.json`, per-checkout, untracked; key at the documented location;
  mint proved). From now every agent PR write runs as the bot; PR #54 was merged as the owner
  before the bot existed. Lesson: a ratified todo is owner text; the Director's lenses resolve
  questions the text leaves open, never the text itself.
- 2026-09-13 about 14:52Z: lane C round two NOT READY; verdicts: the Director rulings ledger entry
  removed (the rule permanent-doc-is-the-consolidation-record rejects the form; homing proof lives in
  the plan of record and this log); five unrooted pattern citations to a follow-on PR with the leg
  extended to that shape; a focused docs-adr pass instead of a third round. Lane B PR 2 split into
  2a (rules generator) and 2b (sub-agent adapter generator, Gemini as a fourth row); Claude
  adapters gain `paths` as a YAML list (the hand-kept string form matched nothing). PR #55 checks
  green; the bot refused to merge until the requested Copilot review binds the tip; review
  requested as the bot. Board follow-on: the deferred-controls register needs a creating mechanism
  (secops binding), post-transplant.
- 2026-09-13 about 14:55Z (Copilot request on #55 registered 14:53:56Z): lane C READY after a focused docs-adr pass; slot confirmed after lane A's
  review-cure push landed. Node item 4 amended (method only): the Gemini projection is generated,
  not hand-imported, under compute-dont-hope; carried-ness unchanged. Copilot review on #55 requested
  under the owner's CLI credential because the bot's own request registers nothing (finding for
  lane A's merge-bot documentation); CODEOWNERS requests the owner on every PR.
- 2026-09-13 about 15:15Z: PR #55 third round granted (PDR-132 budget exceeded). Generator answer: the
  round-one cure grew the changeset (nine files, a reader module the second PR needed), giving the
  second Copilot pass new surface. Rule from here: cure commits minimal; later-PR material goes to
  that PR. Board: CLAUDE_PROJECT_DIR precedence lets validator entry points rebind to the primary
  checkout from a worktree (protocol-conformance opts out); estate-wide cure is post-transplant.
- 2026-09-13 about 15:25Z: PR #57 merged by the bot at 4a61112, ahead of #56 and #55 by readiness. Merge
  tool finding: reviews are read via GraphQL where bot logins carry no [bot] suffix, so --expect
  copilot-pull-request-reviewer[bot] never binds; the suffix-less form merges. Routed to lane A item 5
  with the second finding (the bot cannot request Copilot here; the owner CLI credential can).
- 2026-09-13 about 15:35Z: owner: "we need to slow down, just you and one implementer, the rest
  paused." Lane A active (closest to landing: #56 green, two threads); lanes B and C paused with
  state saved (WIP commits pushed, PAUSED events, claims kept, heartbeats stopped). Resume is owner
  word through the Director. Open: #55 third round (lane B), #56 (lane A), restore not started (C).
- 2026-09-13 15:39Z to 15:50Z: post-compaction pickup. Monitors survived (prediction falsified;
  recorded). Records branch pushed (gate green, 58 e2e) and PR #58 opened as the bot, Copilot
  requested under the owner's credential. #56 red at 9a90d1b: lane A owns three causes (smoke
  tests reading the host's registry and a CI lockfile refusal; CodeQL check-then-use; no Copilot
  request on the tip); cure in progress, slot on ask. Lane B declined the save push: cold-paused
  by owner word in its session; that word binds over the Director's routing. Lane C asked a slot
  for its napkin commit; granted (unpushed capture before compaction is a work-safety exposure;
  worktree hygiene opens the draft PR at first push). Slot order: C, then A on ask.
- 2026-09-13 about 15:45Z: pre-compaction wrap. Records committed on `chore/director-records-2`
  (push queued behind lane A and lane B's pushes in the slot order; the post-compaction Director
  pushes first thing if it has not landed).
- 2026-09-13 about 15:58Z: owner: "please go into warm pause, your only job is to support Saffron, do
  not talk to the cold pause seats unless I say so." Director WARM-PAUSED: watcher and heartbeat
  kept; lane A (Saffron turns Verdure) is the only seat routed; no message to lanes B or C until
  the owner's word; PR #58 (records, Copilot requested on 28a7676) waits for that word too.
- 2026-09-13 about 15:59Z: owner: "four open PRs, that is too many, aim for zero, only via proper
  means, green and clean and sensible." #56 cures: 1c00b5c (three causes), 341e069 (the guard's
  testimony read from its own log, the Linux executor drops lifecycle stderr), ad006e8 (tracked
  legs subtract `ls-files --deleted`; three doc contracts trued). Rulings: pushes confirmed ahead
  of Copilot binding so one round covers each pair; `principles.md`'s `pnpm check` block granted
  to lane A for this PR (not in lane C's exclusive set; a contract change cures every doc that
  publishes it, same commit). Lesson from lane A, for the record: a new CI leg's first green must
  be a CI run, not the host.
- 2026-09-13 16:20Z to 16:50Z: #56 rounds on ee3c396 (three threads, all real: the retired `-s` flag
  still in the commit skill, the resolver's leading `--`) and f2b2048 (zero threads, three doc nits;
  ruled: the sequential-rule rationale rides the port PR, its subject). Bot verdict
  SETTLING-QUIET-WINDOW; owner: "nothing is happening on the PR ... the 'quiet window' could be
  replaced with measured state. As for this specific instance, merge." Merged by the owner at
  `1829cd4`; item 3 done. Practice signal for the record: the settlement quiet window is a proxy
  the owner wants replaced by measured state (no review run live, no reviewer requested).
  Owner: "if e2e tests are clashing on a port, fix it!" Routed to lane A ahead of item 5: a
  per-worktree e2e port (validated override, 3000 under CI, else a stable hash of the checkout
  path in 3100 to 3999); go given on the design. Owner lifted lane B's pause for the #55 cure
  only ("ask the Director how to cure PR 55, carry that out, then hand back all responsibilities
  ... this session is over"); cure confirmed as ruled before the pause; slot given for afe58c8,
  then the generator save push; lane B hands back 2a remainder, 2b and PR 3 at closeout.
- 2026-09-13 about 16:55Z: owner: "please make sure that all work respects the definitions and
  constraints of our testing and validation approaches" (principles, testing-strategy,
  validation-strategy). Check of the work in flight: the port design I had approved (hashed
  per-checkout port, `E2E_PORT` override, `reuseExistingServer` kept) contradicts
  testing-strategy §Harnesses Adapt to Shared Hosts, which rules this collision's cure
  verbatim (an ephemeral port probed at config load, no `process.env` in config,
  `reuseExistingServer` false), and principles §No timing dependence (collision odds are a
  window, not an elimination). Go reversed; lane A amends to the ruled shape, proof by
  exercising the boundary once (two concurrent gates) and construction, no invented pure
  function for a unit test. Lane B asked to confirm the #55 cure's test shape (directive
  definitions, injected fakes, class-shaped rows, relation to the seam) and one killed mutant
  per claim in the commit body. Lesson, same class as the ratified-text overturn: a verdict
  quotes the governing text; a verdict from memory of the problem is the failure shape.
  Lane C stood down by intent (heartbeat-end 16:56Z) after verifying the carry byte-identical.
- 2026-09-13 about 17:00Z: owner: "port assignments belong in a test harness config, not in tests."
  Relayed to lane A as binding on the port PR: the ephemeral port is probed and assigned in
  `jcdotnet/playwright.config.ts` alone; tests and e2e helpers never mention, compute or read a
  port; any probe helper shared with `generate-pdf.ts` lives under `jcdotnet/scripts`.
- 2026-09-13 about 17:05Z: Copilot's review of PR #58 opened six threads on the records, all real,
  all cured on the branch: the routing log re-sorted by time (two labels corrected from the #55
  timeline); the stale first bullet of `repo-continuity.md` and the stale focus paragraph of the
  continuation prompt replaced with current truth; PR #54's merge attributed to the owner; and the
  item 4 Gemini method carded to the owner because a Director verdict had changed ratified text.
  Owner, verbatim: "this is not a matter of competing authorities, what does sensible look like?
  The Gemini adapters are generated, just like everything else." Ruling 1 on the node now carries
  that word; the lane C record follows. Lesson: a method question is asked as "what is sensible
  under the estate's own rules", never framed as one authority against another; the card's two
  options were the false either/or the principles name. Port PR: lane A's worker falsifier fired
  (workers re-evaluate the config and re-probe); option A (the runner probes once and hands the
  port to its workers through its own pid-stamped handshake; external values inert) ruled sensible,
  with the directive sentence amended in the same PR to state the mechanism.
- 2026-09-13 17:16Z: owner: "this is now an n=2 session, you and Saffron." PDR-082 n=2 owner-visible
  mode: the Director's heartbeat loop stopped (confirmed gone), the watcher kept, mode declared on
  the stream. Lanes B and C had handed back and stood down (closeouts on the stream; lane B's
  handoff record v3 keyed by claim 707ed764; lane C's claim closed). 17:18Z: owner: "Open an Arc
  channel with Saffron, but continue to use native comms where appropriate"; channel
  `.agent/collaboration/rapid-comms/2026-09-13-transplant-closure-n2-cauldron-herds-lustre-saffron-turns-verdure.md`
  opened, tailed by both seats, announced; native for quick coordination, the channel for
  dialogue whose transcript is the record, the stream for state.
- 2026-09-13 about 17:20Z: PR #55 was CONFLICTING on the generalisation register (append-only,
  both sides added rows); the Director merged `main` into `closure/lane-b` in lane B's worktree
  with the rows spliced and pushed it through the full gate (lane B's own push had skipped the
  gate on the owner's one-off word). Copilot re-requested on the merge tip; bot polling.
  Merge-bot finding for the scrub (item 5): with a Copilot review run in progress on the tip the
  bot read the leg as SILENT-WAIT-NO-REVIEWER, so its live-run detection misses this run shape.
- 2026-09-13 about 17:30Z: port PR triage on the channel; two items routed here: the handoff
  file's retired reason for serialised pushes (cured above) and `getFreePort` rejecting with a bare
  Error (ruled: a named follow-on PR under lane A that brings `@engraph/result` into the site
  workspace, not this PR and not unnamed debt). Board follow-ons from the hand-backs: the atomic
  writer re-homed to core at its second consumer; a shared no-follow write helper; the
  CLAUDE_PROJECT_DIR opt-out as an estate rule; PR #59 closes as carried when #58 merges; lane C's
  restore worktree and branch removed then.
