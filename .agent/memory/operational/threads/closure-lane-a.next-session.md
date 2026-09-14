# Thread: closure-lane-a — instruments activated, lineage residue off the live surfaces

**Thread identity.** Lane A of the transplant closure (node
`.agent/plans/delivery/practice-completion.plan.md` §Transplant closure, items 3 then 5).
Director: Cauldron herds Lustre (880ff9), claim `1db07581`; route questions and blocks to the
Director by directed comms event, never to the owner (`route-blocks-and-questions-to-director`).

## State at 17:45Z, 2026-09-13 (n=2 with the Director since 17:16Z)

Item 3 landed (PR #56, `SHA: 1829cd4`; `closure/lane-a` merged). Live: PR #60
(`fix/e2e-port-per-worktree`, the per-checkout Playwright port; three Copilot threads routed for
cure) and the #55 path-escape cure in the `closure-lane-b` worktree on `closure/lane-b`. Next:
item 5 on a fresh branch from `main` (SHA: 64aa005 held on `closure/lane-a-checkpoint` rides it), and
the follow-on that brings `@engraph/result` into the site workspace for the port helper.
Dialogue on the ARC channel
`.agent/collaboration/rapid-comms/2026-09-13-transplant-closure-n2-cauldron-herds-lustre-saffron-turns-verdure.md`;
quick coordination native; state on the comms stream.

## Continuation at the go (2026-09-13 about 14:00Z; historical since the hand-back above)

- **Role:** Implementer (PDR-117). Enter your own worktree before any edit
  (`worktree-residency`); branch `closure/lane-a` from `main` (at or after `SHA: 55649a2`).
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
  (scripts, sources, tests, doc mentions; re-importable from the pin `SHA: e477e62f7`); keep
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
  one-hour backstop), heartbeat loop live on claim f024e1f1; both stay armed through
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
  (thread ids PRRT_kwDORH1Wfc6h6llh, …6llo, …6llt; comment ids 4000332532, 4000332541, 4000332547).
  Follow-on on the Director's board under lane A: `@engraph/result` into the site workspace so
  `getFreePort` and the handshake parse return `Result`.
- **Open, routed to me: PR #55** (lane B's sweep, closure/lane-b at SHA: 6b1b4c3, lane B closed out):
  one Copilot thread PRRT_kwDORH1Wfc6h6iq- (comment 4000314563) on
  `agent-tools/src/rule-declarations/sweep-rule-frontmatter.ts:157`: `ruleNames` documented as
  basenames but interpolated into `.agent/rules/<name>.md`, `.cursor/rules/<name>.mdc` and
  `.claude/rules/<name>.md` unvalidated, so `../../outside` escapes and `--write` overwrites an
  arbitrary file. Cure at the public boundary (`sweepRuleFrontmatter`'s `SweepInput.ruleNames`): a
  Result refusal for any name with a separator, a parent segment, an absolute form or empty, before
  any path is built; class rows through the public boundary with a plain name as control; TDD red
  first; one minimal commit; the dropped-check mutant killed and recorded; code-expert pass; slot
  ask; reply and resolve as the bot. Mechanics ruled: EnterWorktree refuses lane B's worktree, so
  cut a local branch from origin/closure/lane-b in this worktree and push HEAD to closure/lane-b as
  a fast-forward; claim 383cde5e is open on that boundary. Read lane B's handoff record
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
  (`pr-60-state.sh`). Heartbeat loop stopped by design. Claims retained: f024e1f1 (lane A),
  5828b0ee (port PR), 383cde5e (#55 boundary).
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

## Waypoint 2026-09-14 ~07:50Z — fourth checkpoint, compaction (Saffron turns Verdure, c39ad7)

- **Landed since the third waypoint.** #65 (5a-ii) at SHA: 53d9495; #67 (5a-iii) at
  SHA: fca804e; #68 (5b) at SHA: f362cce; #69 (e2e follow-on 2) at SHA: e67559a; #70
  (records-4) at SHA: 1643be8; #71 (5c, the residue scrub and the leak validator); #72 (body
  tally hardening) at SHA: 37eebe9; #73 (records-5) at SHA: 50546ee; #75 (records-6) at
  SHA: f7f4a74. Closure item 5 is whole on main. #76 (records-7) open at SHA: e344fc8.
- **Open, mine: PR #74 (2a, the rules generator)** on `chore/rules-generator`. Origin at
  SHA: 62bd5ff (round two); local tip SHA: 87b7793, the round-three cure, one commit ahead,
  unpushed at this checkpoint: the plain-pointer ruling (scoped Claude rule adapters carry
  the same code-span pointer as every rule, never an `@` import, which the owner's falsifier
  showed expands at launch; a cell pins no `@` on any projection; 28 projections
  regenerated), rule names closed to lowercase hyphenated groups at the canonical boundary
  (`rule-name.ts`, shared with the sweep), every mutation re-classified unfollowed before it
  acts and written atomically with a typed outcome (`rule-projection-fs.ts`), the entry read
  through an `O_NOFOLLOW` open with `fstat` (`rule-surface-fs.ts`), the LF normalisation
  stated in the leg. 173 cells, tsc, eslint, knip, `portability:fix` and `:check` green; five
  mutants killed and restored (hashes in the commit body). The code-expert pass on 87b7793
  was running at this checkpoint; its verdict decides the push. Three rounds spent; further
  rounds are the Director's grant.
- **Open promise on #74:** the PR body's proof gains the LF-normalisation statement (the
  commit body says "the PR proof says the same"); edit the body as the bot at push time.
- **Complete locally, unpushed: 2b-i (the sub-agent declarations)** on
  `chore/subagent-declarations` at SHA: a5efd78, five commits on the base SHA: 1643be8 (the
  WIP SHA: fd360a5, the module SHA: c3516c4, the 27 written templates SHA: 0f4a874, the
  records SHA: e696c31, the code-expert changes SHA: a5efd78). 46 cells; subagents:check,
  markdownlint and the docs validators green; the dry run reads 27 templates already declared.
  PR body drafted at scratchpad `pr-2b-i-body.md` (four reconciliations tabled, REVIEW line,
  the seven serialisation-normalised blocks on record). The register row cites c3516c4 bare.
- **Standing slot (Director, "slot free" at ~07:55Z).** Until "Director back": push #74's
  round three when its verdict is in, then push `chore/subagent-declarations` and open 2b-i's
  PR as the bot, one release line each on native messaging, no ask; the Copilot requests and
  the bot on those tips wait for the Director, who re-arms on resume from the release lines;
  anything needing a ruling is held.
- **Queue after 2b-i's PR opens, the Director's order (~07:20Z):** (1) 5a-vi, the fourth
  measured-state clause: a tip-bound review body with any suppressed finding holds the merge
  until the finding is cured or routed by the Director as a recorded follow-on (the settled
  path in `pr-watch/settlement.ts` beside the in-flight hold; the cell beside the closer-look
  cell in `states.unit.test.ts`); (2) the PDR-008, PDR-132 and PDR-082 card amendments in one
  small PR (the gate enumeration; the retired pr-throughput sentence; the 120-second state
  line as the n=2 liveness convention); (3) 5c-ii, four items (scratchpad `e2e-follow-on-2.md`
  tail); (4) 5a-v; (5) the graduations one home per PR on the Director's batch list (fast
  lane all but entry 7, which graduated with the setup recipe: the merge-bot verification
  clause plus a one-line machine-local allowed-signers recipe in the onboarding doc, nothing
  tracked carrying a key; slow lane A, B, C, 1a, 1b promoted); (6) 2b-ii, the generator
  (byte-equal regeneration of the three adapter trees except the four reconciled variants and
  the seven serialisation blocks, the Codex registry entries, the Gemini row); then the
  handed-back residue (Gemini projection, the corpus-analysis restore with five patterns,
  sif, the stub invoke rules); item 7 is the Director's, last.
- **The 2a follow-on list (from the three code-expert passes; a recorded follow-on, not a
  round):** one typed reader for the index in the entry point; one shared lstat-classify port
  for `rule-surface-fs` and `sweep-fs` with the atomic writer; a shared cause-of helper in
  core; `portability-fs.ts` `listSubdirs` and `listFiles` read a failed readdir as empty
  (failure-as-absence, pre-existing); `exists` and `readOptionalText` as typed outcomes; the
  ancestor-classification-to-rename window (directory descriptors); the leg and the sweep
  file sit near the line cap.
- **The 2b-i follow-on list:** a role cannot say "no permissionMode" or "no effort" (absent
  and default collapse in `unlessDefault`); a mid-loop write failure escapes the sweep as an
  exception with no partial `written` list; `derive-subagent-declaration.ts` is the shared
  core, not a deriver (naming); `sweep-subagent-frontmatter.ts` at 242 lines needs its readers
  split out before 2b-ii extends it; the four Claude role notes may converge on the standard
  closing on the owner's word.
- **Rules carried, new this segment.** The Director's chain owns thread replies, resolves and
  Copilot re-requests on every PR; I write nothing to threads. A code-expert verdict is quoted
  in its words before mine, and a pass that died (an API credit error killed one) is re-run,
  never inferred. Cure rounds take the round's findings and nothing else; the reviewer's
  suggestions go to the follow-on list with homes. The report's commit column stays bare in
  reports; `SHA:` prefixes belong to collaboration state.
- **Inferences flagged, not observed.** That `chore/subagent-declarations` carries an
  upstream (the branch-switch hint said so); that the claim under thread closure-lane-a is
  still open with a fresh heartbeat (not verified this segment; the claims CLI topic is not
  where I remembered it); that #74's round three will be Copilot's last (three spent; the
  grant is the Director's).
- **Blind-spot bounds.** The all-channels watcher's state is unknown to this seat since the
  third waypoint; the comms stream carried no state line from me this segment (dialogue went
  native to the Director, whose records carry the state); the fence sweep could not run
  because no fenced owner wording is on record for this segment. The post-compaction summary
  is not this seat's to write.
- **Re-arm recipe (nothing survives compaction).** From the worktree root:
  `bash <scratchpad>/pr-merge-wait.sh <scratchpad> 74` in the background (exits on #74's
  merge or close); verify the task list first and re-arm only what is absent. No cron, no
  heartbeat loop at n=2. The scratchpad is the session's own temp directory under the
  harness's per-project temp root (`gh-as-bot.sh`, `pr-wait.sh`, `pr-merge-wait.sh`,
  `mutants-74*.py`, `apply-*.py`, `commit-*.txt`, `pr-2b-i-body.md`, `follow-on-2a.md`,
  `napkin-lane-a.md`, `dry-run-2b.txt`).
- **Index of homes.** This record (state, promises, queue); the commit bodies on both
  branches (causes, dispositions, mutants); `.agent/reports/practice-transplant/generalisations.md`
  (the 2b-i row); `.agent/sub-agents/README.md` §Declarations (the shape); the PR #74 body and
  threads (the rounds); the napkin session block landed with this checkpoint (lessons);
  `.agent/experience/2026-09-14-saffron-turns-verdure.md` (formation).
- **Fixed point.** A further metaloss pass would only re-find the unverified claim state and
  the absent stream line; the recursion closes here.

### Addendum ~08:00Z, after the owner's stop word

- **#74 round three is on origin at SHA: eafe7a6** (the cure SHA: 87b7793 plus the
  code-expert changes SHA: eafe7a6: a failed write or removal is a typed outcome, the
  residual window named as mkdir, rename or unlink into a linked ancestor, the ancestor
  refusal worded per act, `rule-name.unit.test.ts` pins the closed shape; 196 cells; two
  more mutants killed, hashes in the commit body). The PR body carries the LF proof row and
  the measured @-import fact above the original falsifier. Release line sent; the chain owns
  the three threads and the re-request. Rounds spent: three.
- **2b-i's push and PR were NOT started**: the owner's word "prepare for compaction and then
  stop all processes" arrived before them. `chore/subagent-declarations` at SHA: a5efd78 is
  local only, five commits on SHA: 1643be8, all gates green; the PR body is at scratchpad
  `pr-2b-i-body.md`. First act after compaction: confirm the standing slot with the Director
  (it held until "Director back", which arrived; re-ask), then push the branch and open the
  PR as the bot with that body, one release line.
- **Processes at this checkpoint:** the #74 poll stopped by the owner's word; no watcher,
  cron or heartbeat loop owned by this seat. This checkpoint branch (records/lane-a-checkpoint-4)
  stays local until the queue ahead of it has pushed (the Director's word).

### Correction ~08:05Z: the watcher was live

- The addendum above said no watcher was this seat's. Wrong: the all-channels comms watcher
  (monitor task, re-armed the previous evening) was still armed and delivered the Director's
  post-compaction broadcast at 06:51Z. Stopped now under the owner's word. The blind-spot
  bound in the fourth waypoint ("the watcher's state is unknown") was the honest statement;
  the addendum's "no watcher" was an inference reported as a fact, and this line corrects it.
  Re-arm after compaction, verifying the task list first, from the worktree root in the
  background: `node agent-tools/dist/src/bin/agent-tools.js collaboration-state -- comms watch
  --platform claude --model claude-fable-5-1 --supervisor-pid <this session's pid>
  --step-timeout-ms 120000 --max-events-per-drain 100` (the canonical shape, supervisor pid
  bound, per the Director's #76 cure).

## Fifth waypoint (2026-09-14, 08:50Z), the second compaction of this seat

Written at the owner's word "prepare for compaction ... and then stop all processes", after
the #79 round-one push landed. Every line below is first-hand unless marked as an inference.

### State

- **#74 (2a, the rule projections generator) is merged**: the bot merged it at 558be52 at
  zero threads with Copilot bound to 9ca6ffb (round four, granted by the Director under
  PDR-132; eight findings cured, the seam and the projection leg on the estate's fd-anchored
  reader). 2a is on main; its claim (40d94c60) is closed.
- **#77 (2b-i, the sub-agent declarations)**: `chore/subagent-declarations` is on origin at
  SHA: 5affe55b, equal to origin (the five base commits on SHA: 1643be8, the round-one cure
  SHA: 2f95a4a, the merge from main SHA: 943dfa1 resolving two record conflicts on the 2a
  side, the round-two cure SHA: 5affe55b). Rounds spent: two. **Round three is granted**
  (Director decision, PDR-132) and **not started**: it is the first act after compaction.
  Its findings, as absorbed: the open thread at `sweep-subagent-frontmatter.ts:192` (the
  exported sweep interpolates caller-provided template and adapter names into paths with no
  basename validation, so a `SweepInput` carrying a traversal writes outside `repoRoot`; add
  the preflight basename validation the rule sweep uses, before any path is built) and four
  suppressed findings of one class, "the reader admits what the declaration schema rejects on
  the next read" (an inline YAML sequence stored as its literal string; a decoded scalar with
  a newline passing into a line field; an empty heading yielding an empty title; an empty
  TOML value passing). The Director's ruling on the class: every derived declaration is parsed
  through the same strict schema `readSubagentDeclaration` uses before anything is written,
  and a failure refuses the sweep naming the adapter, the field and the schema issue (one
  function, its cells over the four shapes); two reader refusals stay because they change
  semantics, not validity (the inline sequence, with its own message; the empty TOML value,
  as the Markdown reader refuses one); the newline and the empty title fall out of the schema
  pass. One addition this seat will carry into the round: a role's title is reconciled, not
  declared, so an empty heading on a role never reaches the schema; the reader refuses an
  empty heading too, and the release line says so. The reachable cell for the schema pass is
  a double-quoted description carrying an escaped newline.
- **#79 (5a-vi, the suppressed-findings hold)**: `fix/merge-bot-suppressed-hold` is on origin
  at SHA: 2b08e619, equal to origin (the clause SHA: 0fb988dc on main SHA: 1b44f5b; the
  round-one cure SHA: 2b08e619). Rounds spent: one. The clause: `SUPPRESSED-FINDINGS-OPEN`
  in the closed verdict set after `THREADS-OPEN`; a tip-bound, landed, non-self-reply review
  body declaring N suppressed findings holds the merge while fewer than N distinct items carry
  a lifting disposition line (a signed comment line by the repository owner or the pull
  request's author, bound to this head and this review, whose sentence after the first
  " — " is `Cured in SHA:<sha>` or `Rejected`; `Routed to` does not lift); the comments leg is
  read after the confirm; the PR body carries a REVIEW line for the owner on the sentence
  rule (the Director's joining of the ratified disposition format and the card "block on any
  finding", item 78; `dispositionLifts` is the one place to change). The live read of #77
  through the leg named Copilot's six suppressed findings on the tip: the clause on a real
  round.
- **This checkpoint branch** (`records/lane-a-checkpoint-4`) is local by the Director's word,
  now four commits on f7f4a74 and forty behind main; main has since moved the napkin and a
  formation letter (#76, #78), so its landing will need a merge from main resolved on
  main's side with these rows re-applied, as #77's merge was.
- **Claims**: f024e1f1 (lane A, heartbeat refreshed at this waypoint) and the Director's
  1db07581 are the live rows; closed this session per the Director's hygiene list: 5828b0ee,
  383cde5e, 0edc9b88, 40d94c60.
- **Comms**: one registration broadcast at 07:01Z (rendered); every state and release line
  since went natively to the Director, whose records carry them. A compaction note goes on
  the stream at this waypoint, rendered.

### The queue after #79 and #77 (the Director, 08:4xZ, on the owner's proportionality word)

1. 2b-ii: the sub-agent adapter generator rendering the three trees byte-equal to the current
   ones (except the four reconciled variants and the seven serialisation-normalised blocks on
   record), then the Gemini row per item 70 (`.gemini/agents/<name>.md`, the Gemini CLI
   subagents surface). Name the sweep's retirement condition there: once the generator owns
   the adapters, the hand-kept readers have no consumer and are deleted.
2. Item 4's residue rows: the corpus-analysis restore with the five patterns, then `sif`'s
   routing.
3. One small PR carrying 5a-v, 5c-ii and the three PDR amendments by card (PDR-008, PDR-132,
   PDR-082 E).
4. Item 7 is the Director's. **No graduation PRs**: the drain of the register entries is
   outside the closure's bound (item 8's proof is the register carrying the dispositions, the
   ruling round and `unconsolidated/` empty); the drain is curator work later, in batches of
   six to eight.

### Standing words that bind every act

Route questions to the Director, never the owner; never push without the Director's slot
word, ask then wait (three crickets and the Director confirmed it again this segment); PR
mutations as the merge bot; cures as commits on top, never amend; one killed mutant per
claim, restored byte-identical, hashes in the commit body; the code-expert pass before every
push, its verdict quoted in its words first; `SHA:` prefixes in collaboration content, bare in
reports; a cure round takes the round's findings only; measured state governs merges; the
gate list is the `check` script's list (depcruise was missing from this seat's list until the
code-expert ran it; it is on the list now); one gate at a time on the host (the Director's
memory note).

### Follow-on lists (the human record; the bot never reads them)

#### 2a (rules generator, PR #74, merged)

##### 2a follow-ons from the #74 round-one code-expert pass (2026-09-14)

- The entry point still reads RULES_INDEX.md through readOptionalText (link-following) for the Codex byte budget; one typed reader (readEntry) for the index there.
- One shared lstat-classify-then-read port for rule-surface-fs.readEntry and sweep-fs.readSource, with writeTextAtomically behind the projection leg writeText (its fs.writeFile is non-atomic).
- rule-projection-validation.ts sits one line under the 250 max-lines cap; the next cure needs a planned split.
- A no-follow leaf open (POSIX O_NOFOLLOW) for the classify-then-write window named in rule-surface-fs.ts.
- exists and readOptionalText as typed outcomes (Result), not a throw at the entry point.
- One shared cause-of helper in core: rule-surface-fs.ts, skills-walk.ts and validate-portability.ts each hand-roll error instanceof Error ? message : String(error).
- portability-fs.ts listSubdirs and listFiles read a failed readdir as an empty listing: an unreadable .agent/skills root validates zero skills and exits 0 (the same failure-as-absence class as the #74 rounds; pre-existing).

##### From the #74 round-four code-expert pass (2026-09-14, verdict "ship")

- listFiles (portability-fs.ts) still maps every readdir failure to []: the class of round-four finding 8, consumed by the reviewer-adapter parity leg (.cursor/.claude/.codex agents), validate-subagents, validate-patterns-index and live-retired-paths. Cure as listSubdirs: FsRead, injectable readdir, each consumer surfacing the failure. readOptionalText (exists then readText) is the same check-then-use pair, one consumer (.claude/settings.json); same card.
- discovery.ts (skills-adapter-generate) hasCanonical probes through readFileOrUndefined (follows links) and onCanonical opens the file a second time: the class of round-four finding 4; cure as the walk's (probe through readRegularFileTextNoFollow, carry the text).
- skills-walk.ts catch is untyped and WalkFailure is decorative: rethrow anything that is not a WalkFailure so a walker or handler defect stays loud (validate-portability.ts hook and permission legs share the untyped-catch shape).
- Move describe('collectCanonicalSkillPaths') from validate-portability.unit.test.ts to skills-walk.integration.test.ts (it drives an injected port) and make the fake's unlisted-directory arm a typed failure rather than ok([]), the semantics finding 8 removed.
- classifyAncestors never yields 'files'; narrow its return type so ancestorRefusal and admitAncestors stop handling an unreachable arm.
- FsRead is homed in carriage-fs.ts and now imported by six portability modules: home it in core/ (consolidate-at-second-consumer).
- Framing for the card (code-expert's ratchet note): retire the permissive helpers in portability-fs.ts in favour of the typed ports, one card, rather than a fifth tactical round; an assumptions-expert pass on that framing first.

#### 2b (sub-agent declarations, PR #77)

##### 2b-i follow-ons from the #77 round-one code-expert pass (2026-09-14, verdict "ship with changes")

- Style-aware unwrapping: readFrontmatterLines discards the scalar style, so a folded block whose joined text is quote-wrapped is unwrapped (YAML reads a fold literally). Cure: a scalar reader in frontmatter-lines.ts carrying { value, folded } with readFrontmatterLines as its value projection; unwrap only plain scalars. Then the consolidation question (three quote-unwrapping sites: stripMatchingQuotes, splitCommaList, isQuoted/quotedScalar; the natural home is readScalar's plain-line branch) to architecture-expert-wilma; changing what the rule readers receive is a separate cycle.
- adapter-groups.unit.test.ts beside the pure module: the longest-prefix rule in templateOf (templates a and a-b, adapter a-b-c owns a-b) and pointerIssue directly; a dropped sort survives every cell today.
- One leaf home (adapter-fields.ts) for the per-platform key sets: MARKDOWN_KEYS restates KNOWN_FIELDS.cursor ∪ KNOWN_FIELDS.claude with no test binding them.
- namedTemplate reads the last backtick pair on the line; a tail with its own code span misdirects the refusal. Read the first pair after the fixed sentence start; say which pair in the TSDoc. Guide the "not one quoted scalar" refusal (quote the whole value, or none of it); note the leading-quote-only asymmetry (read verbatim, as Cursor reads it) in the header.
- adapter-frontmatter.ts duplicates the reader's fence checks and hedges `block.value ?? new Map()`; sweep-subagent-frontmatter.ts deriveAll's `!heads.undeclared.has(template)` branch is unreachable once heads.refused is empty; the Codex "blank or comment" predicate is written twice.
- The list-valued cell asserts the line reader's own message; match on the adapter path and key instead.
- Name the sweep's retirement condition where the closure plan tracks 2b-ii: once the generator owns the adapters the hand-kept readers have no consumer and are deleted, so the next hardening round is weighed against deletion.

##### From the #77 round-two code-expert pass (2026-09-14, verdict "changes requested, then ship")

- A pointer line ending in the stop then a trailing space yields a pointerTail of ". " the schema would declare as a tail (no live adapter has it); a later slice treats whitespace after the stop as a skeleton deviation.
- AdapterSurface in adapter-surfaces.ts shares its name with skills-adapter-generate/adapter-render.ts's AdapterSurface ('claude' | 'agents'), a different concept; rename one when either is next touched (one concept, one name).

#### 5a-vi (the suppressed-findings hold, PR #79)

##### 5a-vi follow-ons from the code-expert pass (2026-09-14, verdict "ship with changes")

- The paginated GraphQL argv builder has three copies (gh.ts reviewThreadsArgs, harvest-bracket.ts reviewsHarvestArgs, issue-comments.ts issueCommentsArgs), differing only in the query: one paginatedGraphqlArgs(query, prNumber, repo) in gh.ts retires all three; the tests pin the argv so the refactor is covered.
- commentsPagesSchema models the non-empty page array as z.array().min(1) while harvest-fields.ts uses z.tuple([page]).rest(page): pick one shape.
- The state-gh*.unit.test.ts suites drive injected executors and are integration tests under the taxonomy (pre-existing naming).
- GraphQL IssueComment.authorAssociation would be a cleaner lift-authority key than the owner/author login pair; its value for a GitHub App comment must be verified live before it is authored (a Bot comment by vercel reads NONE on #74).

##### From the #79 round-one code-expert pass (2026-09-14, verdict "ship")

- The 'unknown' sentinel filter has two consumers (state-gh.ts expectedSet, suppressed-hold.ts liftingLogins): one exported predicate beside the transform that mints it (isKnownLogin in state-fields.ts or harvest-fields.ts). Lane-level: a typed absence for a deleted author (author: string | null, or a branded sentinel) would dissolve every consumer filter.
- The seam's call-order guard is folded into the "composes" cell; a named cell, or an executor that serves the disposition comment only after the confirm and asserts reading.issueComments, discovers better.
- The empty-item cell covers the two-space shape (`·  — Cured`); the one-space shape (`· — Cured`) parses as an item beginning with the dash and an empty sentence (lifts nothing); name the class in the cell.
- parseLine carries no TSDoc (pre-existing).

### Promises sweep

Every release line was sent (#77 twice, #74, #79 twice); every slot was asked and waited for;
the code-expert's before-merge items were applied in every round and its follow-ons recorded
above with homes; the one-pass authoring of 5a-vi's new suites and of #77 round two's cells
is named in those commit bodies (the Director accepted the note; the mutants are the proof
the cells bite); the Director was told #77 round three is not started. No promise is silently
dropped. Forwarded with a named owner: the 2b-ii retirement condition (this seat, in 2b-ii);
the lane C record's alignment on the Gemini path (the Director, done on records-8).

### Inferences flagged, not observed

That the Director's chain replied on #77's and #79's threads and re-requested Copilot (their
word); that #77 still reads mergeable against main after 5affe55b (a test merge was clean at
that time; not re-read since); that the live adapters carry nothing above their titles (the
code-expert's measurement, backed by the byte-identical round trip); that #79's clause is
the shape the owner meant by "block on any finding" (the Director's reading, REVIEW-marked).

### Blind-spot bounds

The comms stream carried no state line from this seat after the registration broadcast; the
watcher's inbound events were never read except through the Director's native messages; the
crickets' and code-experts' transcripts are dead contexts (their verdicts are quoted in the
commit bodies and here, their reasoning is not); the post-compaction summary is not this
seat's to write. The fence sweep found no fenced owner wording on record this segment.

### Re-arm recipe (nothing survives compaction)

Verify the task list, the cron list and the process table first, then from the worktree root
in the background: `node agent-tools/dist/src/bin/agent-tools.js collaboration-state -- comms
watch --platform claude --model claude-fable-5-1 --supervisor-pid <this session's pid>
--step-timeout-ms 120000 --max-events-per-drain 100`, then `collaboration-state comms
assert-watcher-live --platform claude --model claude-fable-5-1`. No cron, no heartbeat loop at
n=2. Heartbeat the claim: `collaboration-state claims heartbeat --claim-id f024e1f1-00c7-4c0d-be73-4a8371fe7d47
--now <iso>`. Then one native message to the Director before any act. The scratchpad is the
session's temp directory under the harness's per-project temp root (`gh-as-bot.sh`,
`mutants-*.py`, `roundtrip-77.py`, `measure-pre-pointer.py`, `commit-*.txt`, the follow-on
lists, `napkin-lane-a.md`, `pr-*-body.md`); the scripts take the worktree root as their
first argument.

### Index of homes

This record (state, queue, promises, follow-ons); the commit bodies on the three branches
(causes, dispositions, mutants, the code-expert verdicts in their words); the PR bodies of #77
and #79 (the proofs, the REVIEW line); `.agent/reports/practice-transplant/generalisations.md`
(the 2b-i row); `.agent/sub-agents/README.md` §Declarations; `.agent/reference/merge-bot.md`
and the pr-lifecycle SKILL (the clause, the sentence rule, the separator); the napkin
segments nine and ten landed with this checkpoint (lessons); the formation letter's coda.

### Fixed point

A further metaloss pass would only re-find the absent stream lines and the dead reviewer
contexts; the recursion closes here.

### Addendum 08:58Z: the first act after compaction is #79 round three, then #77 round three

The Director (08:57Z) granted #79 round three (PDR-132): Copilot on SHA: 2b08e619 left one
open thread and two suppressed, all three block, and this round comes BEFORE #77's because
5a-vi is the mechanism every later merge waits on and the round is small. The findings, as
absorbed: (1) `suppressed-hold.ts:60`, `loginKey` reuses `normaliseLogin`, which strips the
`[bot]` suffix, so a comment from `foo[bot]` is treated as the permitted `foo` and can lift;
compare only the `app/` prefix and case at this boundary, with a regression cell for a
bot-suffixed login. (2) `state-gh.ts:136`, the final `pr view` confirm checks `headRefOid`
only and never revalidates the review harvest, so a review landing on the same tip between
the closing harvest and the confirm leaves the hold reading the old list; close the review
and thread bracket after the confirm, or run a final harvest consistency check before
returning (one bracket for all three legs, reviews, threads and comments, is the shape that
ends the class round one's comments finding belongs to). (3) `state-gh.ts:137`, the
`readPrStateReading` `@throws` contract omits the issue-comments leg's failures; add it so
the fail-closed contract is complete. Then #77 round three as designed above. Code-expert
before each push; slot ask each time.

### Addendum 09:02Z: cold pause on the owner's word; frozen until the owner lifts it

The owner, minutes after the compaction landed: "Go into cold pause please, we need to wait
for the session limit to reset". Applied as the standing cold-pause feedback reads: every
owned process stopped and verified by process table at 09:00Z (no watcher, Monitor, cron or
agent under this session; the one claude-platform watcher live on the host, supervisor pid
55622, belongs to the Director's session, not to this seat), no push, no comms event, one
line to the Director, no question asked. Claim f024e1f1's heartbeat was refreshed once at
09:01Z (four-hour freshness, so it reads stale from 13:01Z if the pause outlasts it, which is
honest state for a frozen seat). The freeze binds over any Director word: a slot "push now"
arriving during the pause is held, not obeyed. On the owner's lift: re-ground per
start-right-team, one native message to the Director before acting, then #79 round three as
the 08:58Z addendum reads.

Harvest from the pause entry: `assert-watcher-live --platform claude --model claude-fable-5-1`
cannot tell this seat's watcher from the Director's (same platform and model; the re-arm
recipe passes no session prefix), so it read "live" here while nothing of this seat's ran.
Liveness of this seat's watcher is verified by the process table against the supervisor pid.
The watcher accepts `--session-prefix` (the castr seat runs with it); adding
`--session-prefix c39ad7` to the recipe is a proposal for the Director, not applied.

## Sixth waypoint (2026-09-14, ~17:0xZ): #79 merged, #77 merged, A1 and A2 authored

### State of the branches (verified by `git log` and `git status` at writing)

- `fix/merge-bot-suppressed-hold` (#79, 5a-vi): merged by the bot at SHA: 014fc6e, zero threads
  and zero suppressed on its sixth review; the branch deleted local and origin. Six rounds
  landed as commits on top of SHA: 0fb988dc (round three SHA: d271c24b, round four
  SHA: 8a599092 and its notes SHA: 8d63df7b, round five SHA: 2e4e18b4, round six
  SHA: 17adbcda). Round six was the Director's exception under the owner's rounds ruling (a
  correctness defect in the PR's own claim); from here findings are dispositioned by signed
  line in the same turn, no further cure push unless it is again a bypass of the hold.
- `chore/subagent-declarations` (#77, 2b-i): merged by the bot at SHA: 0e70a2b, zero threads;
  two findings of its last review routed (the wrapped-pointer trailing stop to the 2b
  follow-on; the Gemini empty `tools` array into slice B).
- `chore/subagent-generator` (#81, 2b-ii A1): origin at SHA: 142bedd5, four commits on
  main's SHA: 0e70a2bd (the generator and the leg SHA: 67b77565, the code-expert's notes
  SHA: 670193bc, round two SHA: 64743f0a, the disposition turn SHA: 142bedd5). Round two was
  the budget's last (four cures, one signed Rejected line); the disposition turn under the
  owner's ruling carried four cures (the platform-contract refusal in the leg, the backtick
  tail, the control character in the line schema, the transitional-state sentence) and one
  signed Rejected line (the duplicated surface table, home the reader-retirement PR). From
  here signed lines only on #81. Eleven adapters regenerated on record (four folded and three
  apostrophe-quoted Cursor descriptions, two Claude wrapped pointers, two Claude titles); 75
  of 86 byte-equal.
- `chore/subagent-registry` (2b-ii A2): local at the second merge commit SHA: ceeaf9a7 (A2's
  own commit SHA: ba608a95, its code-expert notes SHA: 3f3ab3dc, the generator's tips
  SHA: 64743f0a and SHA: 142bedd5 merged by merge commits, conflicts resolved by keeping both
  sides). Full gate green on the merged tree; four mutants re-killed; the registry
  regenerated (one block, corpus-voter, moved into name order). Code-expert "PASS WITH
  NOTES", its notes landed. The PR opens against main after #81 merges, with the body drafted
  at scratchpad `pr-2b-ii-a2-body.md`.
- `records/lane-a-checkpoint-4`: local, stays local by the Director's word; lands after the
  queue with a merge from main.

### The queue after A2 (the Director's order)

1. Slice B: the Gemini row `.gemini/agents/<name>.md` as the fourth surface of the same leg
   (the Gemini CLI subagents reference re-read at authoring time for the exact frontmatter
   keys and body semantics), the `tools` schema without `.min(1)` with a cell for `[]`, the
   surface matrix row and CLAUDE.md, and the plan node's item 4 method clause amended on the
   owner's word of 2026-09-14 (the Gemini projection is the generator's fourth output, no
   hand-authored extension), cited the way the 2026-09-13 clause is.
2. The reader-retirement PR (a fourth 2b-ii PR): the sweep, the hand-kept adapter readers,
   the second platform map, and the health probe's platform contract deriving from the
   declarations; the 2b follow-on list's reader items dissolve with them.
3. Item 4's residue rows (the corpus-analysis restore with the five patterns, `sif`'s
   routing); one small PR carrying 5a-v, 5c-ii and the PDR-008, PDR-082 and named PDR-132
   amendments (not the item 92 sizing, which is an operating default); item 7 is the
   Director's. No graduation PRs.

### Standing words added this session (all recorded as memory too)

- The owner (relayed 14:50Z): take your time; no subagents without planning; one or two at a
  time, never fleets; a second reviewer runs after the first's verdict, never beside it.
- The owner (relayed 15:15Z): the number of review rounds per PR does not go up; PDR-132's
  two rounds bind; after round two every remaining finding is dispositioned in the same slot
  turn as the last push (a trivial cure rides it, else a signed Rejected line with its
  rationale or routed home); a round three is the Director's call on a correctness defect in
  the PR's own claim. Slices are planned to about eight review-facing claims.
- The owner's card answers (15:2xZ): only Cured and Rejected lift, a routed finding is a
  signed Rejected line naming its home (the REVIEW mark on that reading is closed); the item 4
  method clause is amended in slice B's PR; the card-amendments PR carries PDR-008, PDR-082
  and the named PDR-132 item only; the napkins archive after full processing, outside the
  closure.

### Lessons of the session (technical)

- A cold pause's "verify by process table" means this seat's processes keyed by supervisor
  pid; `assert-watcher-live --platform claude --model claude-fable-5-1` cannot tell two seats'
  watchers apart on one platform and model (the watcher accepts `--session-prefix`).
- A reviewer's suggested cure can fail to compile (the never-keyed generic constraint
  collapsed the inferred type to never); verify a suggestion by building it before adopting
  its shape.
- Prettier's YAML quote rule, measured: a double quote present means single quotes with the
  apostrophe doubled; else an apostrophe means double quotes; else single. `.cursor/` is
  prettier-ignored, `.claude/agents` is formatted, which is why the hand-kept files differed.
- The estate's Claude frontmatter key order that reproduces every file is `tools`,
  `disallowedTools`, `color`, `permissionMode`, `model`, `effort`.
- The encoding check reads the tracked-file list: a deleted module must be staged
  (`git rm`) before the gate, or the check fails on the missing path.
- Commitlint reads a line-initial `Word:` in a body as a footer and warns
  (footer-leading-blank); avoid line-initial "Live:", "Cells:", "Mutants:" in bodies.
- The yaml library's `stringify(value, { lineWidth: 0 }) === value + '\n'` is a sound
  plain-scalar test for the `line` schema's domain (measured over sixty values by the
  code-expert); at the default width a long value folds and would be quoted.

### Re-arm recipe (unchanged) and the seat's processes

Watcher: from the worktree root, background,
`node agent-tools/dist/src/bin/agent-tools.js collaboration-state -- comms watch --platform claude --model claude-fable-5-1 --supervisor-pid <claude pid> --step-timeout-ms 120000 --max-events-per-drain 100`;
verify by `ps` against the supervisor pid, not by `assert-watcher-live` alone. Claim
heartbeat: `collaboration-state claims heartbeat --claim-id f024e1f1-00c7-4c0d-be73-4a8371fe7d47 --now <iso> --active <repo>/.agent/state/collaboration/active-claims.json`.
PR mutations as the bot: `scratchpad/gh-as-bot.sh <gh args>`. Follow-on lists in the
scratchpad: `follow-on-2b.md`, `follow-on-5a-vi.md`; the slice plan `plan-2b-ii.md`.
