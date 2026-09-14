# Thread: closure-lane-a — instruments activated, lineage residue off the live surfaces

**Thread identity.** Lane A of the transplant closure (node
`.agent/plans/delivery/practice-completion.plan.md` §Transplant closure, items 3 then 5).
Director: Cauldron herds Lustre (880ff9), claim `1db07581`; route questions and blocks to the
Director by directed comms event, never to the owner (`route-blocks-and-questions-to-director`).

## State at 17:45Z, 2026-09-13 (n=2 with the Director since 17:16Z)

Item 3 landed (PR #56, `1829cd4`; `closure/lane-a` merged). Live: PR #60
(`fix/e2e-port-per-worktree`, the per-checkout Playwright port; three Copilot threads routed for
cure) and the #55 path-escape cure in the `closure-lane-b` worktree on `closure/lane-b`. Next:
item 5 on a fresh branch from `main` (64aa005 held on `closure/lane-a-checkpoint` rides it), and
the follow-on that brings `@engraph/result` into the site workspace for the port helper.
Dialogue on the ARC channel
`.agent/collaboration/rapid-comms/2026-09-13-transplant-closure-n2-cauldron-herds-lustre-saffron-turns-verdure.md`;
quick coordination native; state on the comms stream.

## Continuation at the go (2026-09-13 about 14:00Z; historical since the hand-back above)

- **Role:** Implementer (PDR-117). Enter your own worktree before any edit
  (`worktree-residency`); branch `closure/lane-a` from `main` (at or after `55649a2`).
- **Owns exclusively:** root `package.json` scripts, `.github/workflows/**`, `agent-tools/`
  sources and tests except the rules-index generator (lane B), `tooling/*/package.json`,
  `turbo.json`, `jcdotnet/accept-md.config.js`, the consumed incoming bundle under
  `.agent/practice-core/incoming/`. Touch nothing under `.agent/rules/` (lane B) or the
  definition report and directives (lane C).
- **Item 3, first PR — activate the installed instruments** (node todo 2): the
  `practice-substrate` root script with `pnpm -s` cured to `--silent`; the
  `validate-protocol-wire-contract` leg; the agent-tools smoke suite; the lineage root scripts
  that have consumers here (`lint:shell:syntax`, `check:profile`, `outdated`,
  `depcruise:report`). Each becomes a leg of `check` or a named gate. Acceptance: the legs
  exist, `validate-check-ci-parity` is green, `pnpm check` and CI green.
- **Item 5, second PR — lineage residue off the live surfaces**: retire
  `validate-ratified-lists`, `protocol-conformance`, `pr-throughput`, `ci-turbo-report`
  (scripts, sources, tests, doc mentions; re-importable from the pin `e477e62f7`); keep
  `merge-bot`, scrub its lineage residue; the two product files, five package manifests and
  fourteen fixtures named in the plan of record (§Owner rulings round 11, item 3, and §Oak
  residue in tooling); `accept-md.config.js` to TypeScript; `turbo.json`'s `.next/` outputs
  named; the incoming bundle dropped. Then the **lineage-name leak validator** as a
  `docs-validators:check` leg over live surfaces, CV content excluded by scope. Acceptance:
  the validator's first run on the pre-fix tree names exactly the files above and nothing
  else (Wrap 6 prediction b); green after; `pnpm check` and CI green.
- **Routed by the Director (2026-09-13):** markdownlint runs over disk globs with a hand-kept
  ignore list and linted the untracked comms-log render; make its universe the tracked tree
  (`git ls-files`), drop the ignore list, remove the stepping-stone ignores for
  `*.code-workspace` (prettier, same failure on an untracked editor file) and
  `shared-comms-log.md`. Lands with item 3 (it is a `check` leg).
- **Next safe step:** `start-right-team` as `team-member-non-closeout-owner`; post the
  team-start report; open the claim `--role implementer --thread closure-lane-a` on the paths
  above after the Director acknowledges; queue a commit intent before each push.
- **Team expectation:** one PR per item against `main`, small; the Director merges green PRs.
  Report downtime to the Director; never fill it with surfaced hygiene work.
- **Acceptance bar:** the node's item proofs, verbatim, plus a generalisation-register row for
  every move that makes an instrument more general (`record-generalisation-moves`).

## Participating agent identities

- Director: Cauldron herds Lustre (880ff9), 2026-09-13.
- Implementer: Saffron turns Verdure (c39ad7), claude / claude-fable-5-1, 2026-09-13.

## Landing target for the next session

Item 3 merged; item 5's PR open with the leak validator red on the pre-fix tree, recorded.

## Grounding order

`start-right-team` (shared quick foundation) → `director-handoff.md` → the node §Transplant
closure → plan of record rounds 11 and 13 → the definition report's row 4 (Enforcement) and
row 9 (Records).

## Standing decisions

Compute, don't hope (no hand-kept list; the leak validator derives its needle set from the
lineage names, not a typed list); no warning toleration; source is TypeScript; stage by
explicit pathspec; a green, clean PR is merged without asking.

## Waypoint 2026-09-13 15:35Z — compaction checkpoint (Saffron turns Verdure, c39ad7)

- **Item 3 is done on the branch; PR #56 is ready and near merge.** `closure/lane-a` head
  SHA: 9a90d1b (the merge of `main` at SHA: 4a61112), pushed under the Director's slot at 15:34Z; the
  push's pre-push gate was in flight at this checkpoint. Eight commits of substance: SHA: d1a75c7
  (tracked-universe gates), SHA: 1cb74e9 (substrate audit + wire contract as legs), SHA: 9cc25a2 (smoke
  suite as a check leg and CI step), SHA: be3cb46 (register rows), SHA: da3065c (napkin), SHA: d713bb8 and
  SHA: 80e3189 (two review rounds, twenty-two findings, nineteen taken), SHA: 2380337 (two Copilot
  findings cured), then the merge. CI green on every pushed head so far; both Copilot threads
  replied to and resolved as the bot; reviewer dispositions posted as bot comment
  issuecomment-5654014124.
- **Next safe step, in order:** (1) when the 15:34Z push clears, release the slot to the
  Director natively and re-arm the PR watch; (2) the Director re-requests Copilot on the tip
  and merges #56 at zero threads (no card); (3) item 5 starts on a NEW branch cut from `main`
  after #56 merges, never stacked; ask the Director for the slot before every push and wait
  for the one-word confirmation.
- **Team state:** owner word 15:30Z, "slow down, just you and one implementer, the rest
  paused" — lane A is the one active Implementer; lanes B (#55, third round) and C (#57
  merged; restore lane cut, PAUSED at 15:31Z) hold their claims with heartbeats stopped.
- **Item 5 inputs gathered (not started):** the leak validator's needles derive from
  `provenance.yml`'s lineage entry (Director decision 2; if the entry lacks the bot identity,
  declare then derive); the pre-fix run is a test of the derived set and is recorded either
  way. Preview by `git grep` (scratchpad `leak-preview.sh`): 17 agent-tools files (the plan's
  16 plus `merge-bot/{merge-args.unit,merge-cli.integration,push-cli.integration}.test.ts` and
  `tests/claude/statusline-git-location.unit.test.ts`), 6 under `tooling/` (five manifests plus
  `eslint/README.md`), the set-up-worktree-lane skill's step-2 bot literal (Director routing
  from lane C), and 13 doctrine files that name the lineage legitimately — the validator's
  scope must exclude records (provenance, the register, the plan of record, reports) by rule,
  never by list. Two Director findings for the merge-bot scrub: the settlement's `--expect`
  matcher compares the REST login (`…[bot]`) against GraphQL's suffix-less login and never
  matches, so a tip-bound Copilot review settles by timeout — normalise both sides in the
  matcher with a unit case each, do not widen `--expect` validation; and the bot's own
  requested_reviewers POST for Copilot registers nothing here, only the owner's CLI credential
  does — document both in `.agent/reference/merge-bot.md`. Tell lane C natively if item 5
  touches `validate-cited-paths` or adds a validator entry point or knip/depcruise rule that
  would fire on the restored `corpus-analysis`/`workflow-build` modules.
- **Corrections carried:** the push slot is the Director's; announce, wait for the word, then
  push (2026-09-13). Napkin notes live on the branch, never in a scratch file.
- **Monitors at the checkpoint:** all-channels comms watcher live (re-armed 14:47Z after the
  one-hour backstop), heartbeat loop live on claim SHA: f024e1f1; both stay armed through
  compaction; the seat resumes by re-checking `assert-watcher-live` and the claim's
  `heartbeat_at` before its first act.

## Waypoint 2026-09-13 19:58Z — second compaction checkpoint (Saffron turns Verdure, c39ad7)

- **Landed since the 15:35Z waypoint.** Closure item 3 plus the tracked-universe lint cure are on
  `main`: PR #56 merged at SHA: 1829cd4 by the owner's own button at 16:48Z after four cure rounds
  (SHA: 1c00b5c, SHA: 341e069, SHA: ad006e8 + SHA: ee3c396, SHA: f2b2048; every round's causes, dispositions and mutants in
  the commit bodies and the two bot comments). Three of Copilot's findings on the final tip were
  doc nits; two were cured in SHA: a63a07f, one (the tooling.md pnpm 11.20 verification stamp) declined
  with reason; the headline's "smoke-runner issue remains unresolved" is disputed on the PR.
- **Open, mine: PR #60** (fix/e2e-port-per-worktree at SHA: 4fad844 on SHA: a63a07f on main SHA: 1829cd4): the
  site's Playwright suite serves on a port probed free at config load (`jcdotnet/scripts/free-port.ts`,
  extracted from generate-pdf.ts), the runner's pid-stamped handshake carries the port to the workers
  Playwright forks (`jcdotnet/scripts/port-handshake.ts` with unit cells), `reuseExistingServer`
  false, `PORT` handed to the web server so the built site's canonical URLs match, tsconfig target
  ES2017. Proof matrix in the PR body (plain probe 58 of 58 refused; handshake, stale stamp,
  parent-forged stamp all 58 of 58 green; pid mutant and three parser mutants killed; two
  worktrees concurrently green on 58078 and 58096). **Three Copilot threads open on SHA: 4fad844, cure
  designed, no file edited yet:** (1) `TEST_WORKER_INDEX` is inherited from the caller, so it
  cannot be the worker distinction; use the IPC channel Playwright forks workers with
  (`process.send !== undefined`, confirmed by the code-expert against playwright 1.62.1's
  `child_process.fork` of workers) plus the ppid match, and state the honest guarantee (accidental
  inheritance from the environment is ignored; a parent that forks the CLI itself can seed a stamp
  and could equally edit the config; not an adversary claim); a cell for the forged-worker case and a
  killed mutant; (2) testing-strategy §Harnesses Adapt to Shared Hosts line ~741: describe the env
  read as the runner's internal handshake channel, never deny an env read; (3) ADR-019 §Options
  evaluated item 3 still says subsequent runs reuse the server; true to reuse off. One minimal
  commit, triage on the ARC channel, slot ask, reply and resolve the threads as the bot on the tip
  (thread ids PRRT_kwDORH1Wfc6h6llh, …6llo, …6llt; comment ids SHA: 4000332532, SHA: 4000332541, SHA: 4000332547).
  Follow-on on the Director's board under lane A: `@engraph/result` into the site workspace so
  `getFreePort` and the handshake parse return `Result`.
- **Open, routed to me: PR #55** (lane B's sweep, closure/lane-b at SHA: 6b1b4c3, lane B closed out):
  one Copilot thread PRRT_kwDORH1Wfc6h6iq- (comment SHA: 4000314563) on
  `agent-tools/src/rule-declarations/sweep-rule-frontmatter.ts:157`: `ruleNames` documented as
  basenames but interpolated into `.agent/rules/<name>.md`, `.cursor/rules/<name>.mdc` and
  `.claude/rules/<name>.md` unvalidated, so `../../outside` escapes and `--write` overwrites an
  arbitrary file. Cure at the public boundary (`sweepRuleFrontmatter`'s `SweepInput.ruleNames`): a
  Result refusal for any name with a separator, a parent segment, an absolute form or empty, before
  any path is built; class rows through the public boundary with a plain name as control; TDD red
  first; one minimal commit; the dropped-check mutant killed and recorded; code-expert pass; slot
  ask; reply and resolve as the bot. Mechanics ruled: EnterWorktree refuses lane B's worktree, so
  cut a local branch from origin/closure/lane-b in this worktree and push HEAD to closure/lane-b as
  a fast-forward; claim SHA: 383cde5e is open on that boundary. Read lane B's handoff record
  `.agent/state/collaboration/handoffs/707ed764-320b-443e-99d5-ee3239893782.3.json` first (done once).
- **Branches on this host.** `fix/e2e-port-per-worktree` SHA: 4fad844 (pushed, PR #60);
  `records/lane-a-checkpoint-2` (this commit; local only by the Director's ruling under the
  owner's zero-open-PRs word; rides item 5); `closure/lane-a-checkpoint` SHA: 64aa005 (superseded by
  this branch, removable); `closure/lane-a` (merged; local SHA: 2356b2b superseded by SHA: a63a07f on the port
  branch). This worktree returns to `fix/e2e-port-per-worktree` after this commit.
- **Team state.** n=2 mode by owner word (Director and lane A only; heartbeat loops dropped;
  all-channels watcher kept; claims kept; substantive broadcasts on the stream; dialogue whose
  transcript is the record on the ARC channel
  `.agent/collaboration/rapid-comms/2026-09-13-transplant-closure-n2-cauldron-herds-lustre-saffron-turns-verdure.md`,
  tailed with `tail -n 0 -F` from the primary checkout root). Lanes B and C closed out; PR #58
  merged at SHA: 6528ecb; PR #59 closed as carried. Owner words on record: "port assignments belong in a
  test harness config, not in tests"; the merge bot's ten-minute quiet window should be replaced by
  measured state (Director holds it as a Practice signal); zero open pull requests as the target.
- **Rules carried.** Announce and wait for the Director's slot word before every push (they
  pre-confirm when the slot is theirs to give). At n=2 a state line to the Director every 120
  seconds of a long turn is the liveness signal; a two-hour silence on 2026-09-13 was read as a
  block and surfaced to the owner. Report a reviewer's verdict in its own words before mine; a
  mechanical "zero threads" is never "no issues"; never emit a merge-trigger phrase for a review
  that has not landed. Comms event tags are only failure-mode, behaviour-note, heartbeat.
- **Monitors at this checkpoint.** All-channels watcher (re-armed 19:55Z after the hourly
  backstop; the backstop kills it every hour, re-arm and assert live); ARC tail; PR #60 state poll
  (`pr-60-state.sh`). Heartbeat loop stopped by design. Claims retained: SHA: f024e1f1 (lane A),
  SHA: 5828b0ee (port PR), SHA: 383cde5e (#55 boundary).
- **Item 5 inputs** unchanged from the 15:35Z waypoint; the pr-watch instrument observation
  (thirty minutes, three tip moves, two CI transitions, no output) is capture-practice-tool-feedback
  for the napkin below.

## Waypoint 2026-09-14 00:30Z — third checkpoint (Saffron turns Verdure, c39ad7)

- **Landed since the second waypoint.** #60 (the port PR, six rounds, the in-process server
  redesign), #63 (the pending-graduations register, 28 entries plus the slow lane), #64
  (5a-i, request visibility), #66 (the e2e follow-on after #60, merged at SHA: 0ec4583). Local
  branches for all four deleted.
- **Open.** #65 (5a-ii, measured state) at SHA: 3802031 after four rounds; the fourth was the
  Director's last grant, and its cure is the harvest bracket (the reviews harvest read on
  both sides of the thread read, agreeing or re-read once, then fail loud). The Director's
  chain replies, resolves, requests Copilot and arms the bot on #65; the seat writes nothing
  to its threads.
- **Stacked and waiting.** 5a-iii (the body tally and #64's six body findings) on
  `fix/merge-bot-body-tally` at SHA: beddd8b, three forward-only merges beneath it; its PR
  opens when #65 merges (body drafted in the seat's scratchpad; the Copilot request is the
  Director's). 5b (the retirements: the four instruments, the consumed incoming bundle, the
  www build's `.next` outputs in turbo.json, the accept-md config as a typed module) on
  `chore/retire-lineage-instruments` at SHA: d27790f with this records branch merged in; its
  PR opens after 5a-iii's; code-expert pass pending at this waypoint.
- **Routed next, in the Director's order.** 5b's PR; the e2e follow-on 2 (#66's four
  suppressed body findings: try/finally teardown in two integration cells, `stop()` rejecting
  on an unexpected non-zero exit, testing-patterns.md still saying the suite is served by the
  start script); 5c (the residue scrub and the lineage-name leak validator); then 2a, 2b,
  the Gemini projection, the restore with the five patterns, sif, the stub invoke rules.
- **Rules carried, new this segment.** A granted slot is held until "released" (the
  Director's item 41; both seats overlapped once, own branches, no harm). On a stacked PR the
  Director's chain owns the thread replies (a duplicate pair was deleted). The merge
  commit's message file goes on the merge command itself; a default header, once landed,
  stays under the no-amend word. Body findings a bot round suppresses are routed to a
  follow-on PR after the round budget, never a fifth round.
- **Monitors at this checkpoint.** A poll on #65 for its merge (`pr65-merge-wait.sh` in the
  scratchpad, exits on merge or close); the all-channels watcher; claims retained.
