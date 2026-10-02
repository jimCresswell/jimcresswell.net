# Agent Tooling Frictions Register

Live capture of frictions, gaps, and observed failures in the agent tooling
substrate. Each entry has source citation, observed behaviour, expected
behaviour, candidate cure, target surface, and current status.

**This is a capture surface, not an execution plan.** Items mature into:

1. A line on a `current/` or `future/` plan when they
   fit existing scope, OR
2. A new `current/` or `future/` plan when they
   justify their own work item, OR
3. A direct fix when the cure is small and obvious enough to land in a peer
   plan's commit cycle.

Owner standing direction (Pelagic, event `2dbd74f6` 2026-05-05): _"any
friction with agent tooling should always be noted so the tooling and
documentation can be improved. This is always true, not just for today's
identity-wordlist work. Agents are both users and authors of the tooling, so
agent-observed friction is first-class user feedback."_

## How To Add an Entry

```markdown
### F-NN — Short title

- **Source**: napkin entry / comms event ID / session reference
- **Surface**: which CLI / file / workflow
- **Observed**: what happened
- **Expected**: what should have happened
- **Candidate cure**: smallest concrete change that resolves the friction
- **Target surface**: agent-tools CLI / docs / rule / plan / ADR / PDR
- **Status**: open / partially-addressed / mitigated / addressed-in-plan-X /
  addressed-in-working-tree-YYYY-MM-DD / addressed-in-existing-behaviour /
  superseded
- **Owner direction status**: standing / session-scoped / unsolicited
```

Keep entries terse. Long-form analysis belongs in the napkin or in a
dedicated plan that this entry points to.

From F-218 the two estates (JC.net and OCE) share one id space: a new entry takes
the next number after the highest in either register, so an entry both estates
carry has one id and the same bytes.

---

## Friction Entries

Status lines are the disposition source of truth. Entries remain in this
section until a consolidation pass moves them; the addressed/mitigated section
below is a cross-reference index, not a second source of truth.

### F-164 — `pr-watch --watch` is silent across head and check transitions and exits ALL-GREEN on a conflicting, changes-requested PR

- **Observed**: 2026-08-17 (Director seat): `pr-watch 890 --watch` exited
  on ALL-GREEN (checks passed, threads resolved) while the PR sat
  CONFLICTING + CHANGES_REQUESTED — the one state where the watch is most
  wanted. 2026-09-02 (Luna seeks Twilight, 5c0ddc): armed as a Monitor on
  #945, it emitted nothing across two pushes and a full green check run
  (~30 minutes); its silence was indistinguishable from "no change", and a
  60 s `gh pr view` poll emitting only on reviewDecision / mergeStateStatus
  / head change, terminating on MERGED/CLOSED, caught the owner's merge
  within a minute. 2026-09-06 (Finch binds Sundog, 47f9d2): `pr-watch 58
  --watch --interval 60` under a Monitor emitted nothing for 33 minutes
  across three reviewer submissions, six threads and two failing checks;
  replaced by a direct `gh` read poll. The consolidation seat the same day
  armed a 60 s change-emitting `gh` poll from the start (head, merge state,
  review decision, check rollup, unresolved-thread count) and never the
  tool. 2026-09-16 (Zephyr guards Leeward, 281e44), a fourth instance:
  `pnpm --silent agent-tools:pr-watch 149 --watch --interval 60` under a
  Monitor, piped through `grep --line-buffered`, emitted only pnpm's echo line
  for ten minutes while the checks moved from 0 to 19 passing. The silence was
  read as "still waiting" until a blocking wait timed out and a one-shot
  `pr-watch 149` showed 19 passed, 1 pending, 0 failed. Replaced by a
  background `gh pr checks 149 --watch --interval 60`, which ends with the
  checks and returns their exit code. OCE's pr-lifecycle SKILL prescribed the `--watch` form as the supervised watch until its 2026-09-16 consolidation (`63b544464`, an OCE commit) replaced it with a compound GraphQL watch loop that ends only on MERGED or CLOSED; JC.net's copy of the skill still prescribes the `--watch` form (read 2026-10-01), and the tool still wants correcting.
- **Expected**: one line per head change and per check-state transition; a
  heartbeat line at a fixed cadence so a dead watcher is visible; ALL-GREEN
  requires mergeable plus no standing change-request, or a
  `--hold-until-merged` mode.
- **Route**: agent-tooling backlog (the watch-commands node).
- **Cause, read at the fifth instance, 2026-09-29** (Nova turns Penumbra): a Monitor on PR 311's
  `--watch` read zero lines in 30 minutes; `runPrWatchTopic` hands `runPrWatchCli` an
  `OutputBuffer` and returns its text at exit (`agent-tools-cli-topics.ts`, both estates).
- **Read 2026-10-01**: The candidate cure, unbuilt in both estates (the topic still hands the command an `OutputBuffer`), is to pass `process.stdout` and `process.stderr` when `--watch` is set; the seat's workaround calls `runPrWatchCli` from dist with the real streams.

### F-136 — practice-core CONTENT has no portability scanner (`portability:check` covers adapters only)

- **Source**: PDR-101 quorum over the 2026-07-08 consolidation batch (two seats
  independently): a new PDR shipped with host-adapter paths and host-local context, and
  no mechanical gate could catch it — `portability:check` validates skills/rules adapter
  parity, never Core file content. Existing PDRs carry the same leakage (precedent
  compounding, unguarded).
- **Observed**: `practice-core-portability` is a governance claim with no scanner
  (`governance-claim-needs-a-scanner` class): host paths (`.agent/...`), plan filenames,
  and seat names inside `practice-core/**` dangle in any adopting repo and nothing fires.
- **Expected**: a repo-validator scans `practice-core/**` for host-path/host-context
  fingerprints (path prefixes, plan-filename shapes) with a per-file allow for the
  bridge-index surfaces that are host-facing by design.
- **Candidate cure**: `validate-core-portability` in the repo-validators estate; per
  PDR-126 it lands at error with the existing leakage fixed or explicitly dispositioned
  in the same landing.
- **Target surface**: `agent-tools/src/validators/` (new validator).
- **Status**: open — tooling candidate.
- **Owner direction status**: standing (record-all-frictions).
- **Instance, 2026-09-25** (Copilot, in both estates): PDR-142 line 73 carried a session prefix
  and a comms event id, which PDR-079's portability rule bars ("event UUIDs, intent UUIDs, session
  identifiers"); cured by hand in both, and the candidate validator would refuse both forms.

### F-150 — `pnpm install --ignore-scripts` in a fresh worktree silently disarms ALL git hooks

- **Source**: Forge rides Brimstone's unit-1 delegate (AIP-159 fix-forward worktree),
  2026-07-21T07:08Z broadcast, first-hand; detected and manually mitigated in-lane.
- **Observed**: `pnpm install --ignore-scripts` skips the husky `prepare` lifecycle
  script, so `.husky/_` is never materialised in the fresh worktree — and git then
  SILENTLY SKIPS EVERY HOOK: pre-commit and pre-push ran as no-ops (push exit 0,
  fully ungated). No warning at any layer; the gates simply do not exist in that
  working copy. (Ironic composition: `--ignore-scripts` is itself the cure Sonar
  recommends for CI installs — the security posture and the gate posture collide.)
- **Mitigation used**: the delegate installed the husky shims and re-ran the full
  pre-push suite manually to exit 0 over the already-pushed tree.
- **Expected**: gate absence fails loud. Candidate cures: (a) the fresh-worktree
  setup path (start-right §8, worktree-hygiene) gains a mandatory
  `[ -d .husky/_ ]` verification before any commit ("verify `.husky/_` exists
  before trusting any gate"); (b) a repo-validator that recomputes
  hook-materialisation (hooksPath resolves + `_` shims present) so a hookless
  working copy cannot read green; (c) CI remains the backstop but is not the
  cure — the contract is local-gates-bind.
- **Status**: open. Cure (a) is a step of `set-up-worktree-lane` in both estates (its `.husky/_`
  check). Cure (b), a recomputing check on the commit and push path, exists in neither estate's
  agent-tools (no `hooksPath` reader found; read 2026-10-01).
- **Instance, 2026-09-27** (a seat, JC PR 231's first push): a fresh worktree's first install
  failed at postinstall and the second ran no husky prepare, so `.husky/_` was absent and the push
  ran ungated; the pre-open review widened cure (b) to git's own HEAD, objects and refs tests.

### F-194 — the `SHA:` prefix rule is unenforced, and the in-scope records carry hundreds of bare shas

- **Observed**: 2026-09-19, raised by Codex at #155's round two. `sha-prefix-in-collaboration-content`
  requires `SHA:` before every commit sha written into the napkin, the thread records and
  `repo-continuity.md`. At the #155 tip those surfaces held about 285 backticked bare shas
  beside about 130 prefixed ones (read with `grep -oE` over the four files), including every
  fold entry this seat wrote on 2026-09-16 and 17. No gate reads the rule: the gitleaks
  allowlist it exists for matches `<word>: <40-hex>`, which a backticked short sha never trips,
  so nothing refuses the bare form. The shas #155 introduced were prefixed in its second
  settlement push; the older ones stand.
- **Expected**: a rule that says MUST is read by something at write time, or it says SHOULD.
- **Route**: a validator row (the markdown records' sha form) in the repo validators, with the
  existing bare shas converted in one mechanical sweep in the same lane; until then a seat
  writing a sha into these surfaces prefixes it.
- **Instances, 2026-09-26 and 2026-09-29** (Copilot on PR 211's fold; Copilot on JC PR 268):
  four bare commit hashes in the napkin and records, then a plan-node merge commit without its
  prefix and a mistyped OCE head, each cured by a settlement push after a sweep.
- **Read 2026-10-01**: The rule's `globs` in both estates list only
  `.agent/state/collaboration/**` and `.agent/collaboration/**`, so it does not load when the
  napkin, a thread record or a plan node is written; widening them to its in-scope list rides with
  the validator row.

### F-201 — the merge door does not refuse a merge whose tip lacks an attested deletion sweep

- **Observed**: the merge-base deletion sweep ran after the door, not before, twice
  (Zephyr guards Leeward, 2026-09-21; Blazar lifts Corona, 2026-09-24), although the
  door's own output says to run it first. The door prints a note only
  (`agent-tools/src/merge-bot/merge-cli.ts`).
- **Expected**: the door refuses without an attested sweep on the tip, the same shape as
  the review-cost gate refusing at the push without the recorded budget, which did
  catch a seat the same day.
- **Route**: a merge-bot candidate. Two instances, two seats.
- **Instances, 2026-09-24 and 2026-09-25** (Siren herds Rudder, JC PR 178; Swallow holds Drift,
  OCE PR 214): each deletion sweep ran after the merge; every deleted line was read afterwards and
  no silent revert found. Both estates' `merge-cli.ts` still print only the note.

### F-124 — a repo-wide gate that rebuilds `agent-tools/dist` task-reclaims persistent Monitors; inner restart loops cannot recover a whole-task reclaim

- **Source**: curriculum-hub sessions 2026-07-01 (Deneb + Typhoon — a ~2h fleet blind gap,
  owner-caught); cure directions routed to the tooling lane on comms `31a99250`.
- **Surface**: `Monitor(persistent)` tasks shelling out to `pnpm agent-tools:*` during any
  gate that rebuilds `agent-tools/dist` (owner commit, `pnpm check`).
- **Observed**: the rebuild can reclaim the whole Monitor task; an inner `while true` loop
  only recovers an inner-command exit (dist transiently absent), not a task-level reclaim —
  the watcher/heartbeat is dead until manual re-arm, and in-window silence reads as
  retirement.
- **Candidate cures** (from the routed comms event): decouple monitors from a live
  `agent-tools/dist` during rebuilds (pre-resolved binary / copy); OR a task-level supervisor
  re-arming the whole task; OR don't rebuild dist under live monitors. Interim protocol
  (ratified in-window): after any repo-wide gate, re-arm watcher + heartbeat + post a
  catch-up sweep; treat in-window silence as reclaim, not retirement.
- **Status**: open.
- **Owner direction status**: standing (record-all-frictions).
- **Instances, 2026-09-24 and 2026-09-25** (the Director, JC; seats, OCE): push and fold-commit
  gates from the primary rebuilt `agent-tools/dist` under live readers with no broadcast, four in
  an hour (JC) and about twenty minutes at load 16 (OCE); no rule or hook announces a push's gate.
- **Read 2026-10-01**: The instances add a candidate cure: the pre-commit and pre-push hooks, run
  in the primary, post the start and result events of `check-singleton-per-window` themselves
  (`gate-slot`, now in both pre-push hooks, limits concurrent gates and posts nothing).

### F-198 — the merge door does not read the Codex connector's summary comment or its reaction

- **Observed**: 2026-09-24 ~12:45Z (Blazar lifts Corona, `b65a9a`), OCE PR 189. The Codex connector
  reported a clean review of the tip `ebe3123` through two transports. It edited its
  `codex-pull-request-review-summary` comment to "✅ Completed" with the commit in a table cell,
  and it put a 👍 reaction on the pull request. `merge-bot merge` refused with
  UNCLASSIFIED-EVIDENCE: the summary comment was "edited after creation", and the connector's
  quota comment "names no reviewed commit". The documented cure, a fresh `@codex review`, then
  bounced on the usage limit, as a comment. A quota notice counts as SKIPPED only when posted
  as a tip-bound review, so both OCE PR 188 and PR 189 stayed held on a vendor quota. The Director
  ruled to hold them rather than merge outside the door.
- **Expected**: the door reads each reporting transport a configured reviewer uses, under the
  owner's 2026-09-16 comment-evidence ruling. It reads the summary comment's commit and status
  cells as a tip-bound result, and a quota notice posted as a comment as the same
  scope-declared SKIPPED marker it honours as a review.
- **Route**: a merge-bot candidate. The door is shared by both estates, so the cure is portable.
- **Second instance, 2026-10-01** (Crucible binds Slag, first-hand): on OCE pull requests 299,
  313, 309 and 310 the connector reacted with a thumbs-up within about three minutes of each
  head and posted no review; it posted a review only where it had a finding (319). The seat
  read the silence as absence and wrote "unavailable" on three pull requests, each since
  corrected. The door's leg computation reads reviews and not the reaction, so a head the
  connector found nothing on cannot settle that leg. Two instances: a pattern.
- **Summary-comment instances, 2026-09-27 and 2026-09-28** (seats, OCE; the Director): the doors
  of OCE PRs 267, 268 and 264 held because Codex recorded each clean run only by editing its
  summary comment, posting a review object only with findings; 264 landed after PR 274's cure.
- **Status**: open (read 2026-10-01): the summary-comment arm is cured in OCE by `SHA:c85d4d8e8`
  (2026-09-28, PR 274, "the connector's own edit of its summary is its report"; OCE `pr-lifecycle`
  reads "unedited or last edited by its author"); JC's pr-watch and merge-bot carry no editor-aware
  reading (read 2026-10-01), so the arm stays open there; the quota-notice-as-comment arm and the
  reaction arm of the 2026-10-01 instance stay open in both.

### F-218 — the shared atomic writer takes caller-supplied paths with no link check (2026-10-01)

- **Source**: a review finding on the coordination fold of 2026-10-01 (the pattern
  `cli-writer-boundary-discipline` claimed an `lstat` seam the writer does not have), verified
  against the code in both estates by two seats (Crucible binds Slag; Hazel tracks Trunk) and
  then by `security-expert`, which traced each flag.
- **Surface**: the collaboration-state CLIs' path flags (`cli-claim-commands.ts`,
  `cli-comms-commands.ts`, `cli-json-commands.ts`, through `state-io.ts`) and the writer they
  reach, `agent-tools/src/collaboration-state/atomic-file.ts`.
- **Observed**: `--active`, `--closed`, `--comms-dir`, `--output` and `--file` reach the atomic
  writer with no containment or link check, and nothing under `collaboration-state/` calls
  `resolveWriteTargetWithinRepo` (`core/flag-path-resolve.ts`). The writer replaces a link
  planted at the target and follows a link in any parent directory. The JSON writers refuse a
  path that is not a named state file or state directory; `--output` has no such gate and
  replaces any file with the rendered log, the worst case. `--seen-file` reaches `appendFile`,
  which writes through a link. `--event-id` is checked only for being non-empty and becomes a
  file name.
- **Expected**: every writer under a caller-supplied path carries the pattern's three cells
  (name validated, atomic write, no link followed).
- **Severity**: hardening. To use the gap an attacker has to choose the CLI's arguments or plant
  a link in the coordination state directory, so is already acting as the user or steering an
  agent.
- **Candidate cure**: resolve every path flag through `resolveWriteTargetWithinRepo` at the
  spec-wiring boundary, on the resolved path with defaults included, with the coordination home
  as the base (a worktree seat's `--active` resolves to the primary checkout); cover
  `--output`, `--file` and `--seen-file`; give `--event-id` a closed grammar. Test first, the
  same bytes in both estates.
- **Target surface**: agent-tools CLI (`collaboration-state`).
- **Status**: open
- **Owner direction status**: standing
- **Instance, 2026-09-28** (architecture-expert-fred's routed item on OCE PR 291; JC lane B's
  board item of 2026-09-13): `atomic-file.ts` has three product importers in both estates, so
  the no-follow seam lands with its move to `core/`, a test and a header, one same-bytes change.

### F-219 — a comms event written without a render during the pre-push gate fails the push: the generated log is stale (2026-10-01)

- **Source**: Crucible binds Slag, first-hand, the push of the coordination fold on 2026-10-01.
- **Surface**: JC.net's pre-push `practice-substrate check`, reached through `pnpm check` (in OCE the script `practice:substrate:check` exists and no hook calls it); `collaboration-state -- comms append`.
- **Observed**: the check renders the comms log from the event files and refuses when the rendered text differs from `shared-comms-log.md` on disk (`live-shared-comms-log.ts`); it makes no age test. `comms send` appends and then renders (`cli-comms-send.ts`, both estates), so a send leaves the log current. The log goes stale for a writer that does not render (`comms append`) and in a race between two renders (the instances of 2026-09-26 and 2026-09-27 below). Which writer made the 2026-10-01 instance stale was not read. Cost: one full gate run. Cure used: `comms render`, then push again. Asking peers to hold `comms send` during a gate is not needed (a reviewer's finding on OCE's pull request 318, verified in the code).
- **Expected**: a push does not depend on an untracked, generated file that another seat's
  write can invalidate mid-gate.
- **Candidate cure**: the check writes the rendered log back before comparing (the repair is deterministic), or the file on disk stops being an input; `comms append` renders.
- **Target surface**: agent-tools CLI (`practice-substrate`, `collaboration-state`).
- **Status**: open
- **Owner direction status**: standing
- **Instances, 2026-09-26 and 2026-09-27** (the Director and a seat, JC): the pre-push check
  refused twice on a stale `shared-comms-log.md`; read first-hand at 11:38Z, two sends in one
  second each rendered without the other's event until the next send, a race a render lock cures.

### F-220 — `claims close` requires `--now` and the directed comms commands require both paths, where their siblings default them (2026-10-01)

- **Source**: a review finding on the coordination fold and Crucible binds Slag's first-hand
  runs, 2026-10-01.
- **Surface**: `agent-tools/README.md`; `collaboration-state -- comms direct`, `comms reply`,
  `claims close`.
- **Observed**: `comms direct` and `comms reply` require `--active` and `--comms-dir`; only
  `comms send`, `comms watch` and `comms validate` resolve the coordination home, as the README
  says since the fold. The README's sentence "`--now` defaults to the wall clock" is unscoped:
  `claims open` defaults it and `claims close` requires it. Read in both estates' source on
  2026-10-01.
- **Expected**: the directed commands and `claims close` take the same defaults as `comms send`
  and `claims open`.
- **Candidate cure**: wire the send defaults into the directed commands and default `--now` on
  every claims command, test first, both estates; until then the README scopes the sentence.
- **Target surface**: agent-tools CLI (`collaboration-state`).
- **Status**: open
- **Owner direction status**: standing

### F-221 — `codex-exec` reads lines through `node:readline`, which splits on U+2028 and U+2029 (2026-10-01)

- **Source**: the code review of the arc-metrics port, reported by Crucible binds Slag,
  2026-10-01. The same defect in `arc-metrics/file-system-node.ts` is cured in both estates.
- **Surface**: `agent-tools/src/codex-exec/cli.ts`.
- **Observed**: a line reader built on `node:readline` treats the Unicode line and paragraph
  separators as line ends, so a JSON line holding either is split and dropped.
- **Expected**: one entry per newline-terminated line, whatever the entry holds.
- **Candidate cure**: the line splitter arc-metrics now uses, shared by both readers, test first.
- **Target surface**: agent-tools CLI (`codex-exec`).
- **Status**: open
- **Owner direction status**: standing

### F-222 — the local gates read the shared working tree, so a peer's uncommitted hunk blocks a commit or a push (2026-09-28)

- **Source**: five comms events of 2026-09-28 across both estates, grouped at the second
  two-estate consolidation: a push from the primary failing the link validator on another
  workspace's uncommitted edits; two seats' records hunks in the same two files; a seat saving a
  peer's hunks as a patch and rewriting the files to stage only its own; a second commit racing
  the index during a gate.
- **Surface**: the pre-commit and pre-push hooks in a shared primary checkout.
- **Observed**: `respect-active-agent-claims` §Shared-state files already says a claim never
  blocks a write or an inclusion, and `stage-by-explicit-pathspec` covers the staging. The
  waits and rewrites recurred with both loaded, because the gates read the tree and not what
  ships.
- **Expected**: the pre-push gate judges the pushed commit and the pre-commit gate judges the
  index, so a peer's uncommitted work cannot fail either.
- **Candidate cure**: run the pre-push validators against a clean checkout of the pushed commit;
  the commit-queue ceremony prints the never-block-inclusion line when its pathspec names a
  shared-state file holding another seat's hunks.
- **Target surface**: hooks; agent-tools CLI (`commit-queue`).
- **Status**: open
- **Owner direction status**: standing
- **Further instance, 2026-10-01** (Hazel tracks Trunk, JC.net): the pre-push link check failed a
  coordination-branch push on two Markdown files in a gitignored analysis directory, copies of
  the other estate's register synced there as scratch. The gate reads ignored files as well as
  a peer's uncommitted ones. Cure used: the copies were renamed to a non-Markdown extension.

### F-223 — nothing refuses a process kill by name (2026-09-29)

- **Source**: a seat's incident line, 2026-09-29: stopping its own push with `pkill` by name
  also ended the Director's hook shell in the other estate.
- **Surface**: the PreToolUse Bash policy (`agent-tools/src/hook-policy`).
- **Observed**: `no-unbounded-host-load` says "Kill by the pids recorded at launch, never by
  command text", and `comms-all-channels-watcher` forbids a `pkill -f` pattern. The kill by
  name recurred after both; no hook checks it.
- **Expected**: the moment of the kill carries the rule.
- **Candidate cure**: a Bash policy check that refuses `pkill`, `killall` and a
  `pgrep … | xargs kill` pipeline and prints the kill-by-recorded-pid line.
- **Target surface**: agent-tools hook policy.
- **Status**: open
- **Owner direction status**: standing
- **Earlier instance, 2026-09-27** (a seat, OCE): stopping its own processes, a seat swept the
  process table for "sleep 240" and signalled a sleep in the Director's pulse loop (one early
  tick). The 2026-09-29 kill was read from both sides; its napkin entry was owed to the successor.

### F-224 — OCE's branch-guard smoke's PATH is narrower than the trusted-git allowlist (2026-09-26)

- **Source**: a seat's first-hand confirmation on OCE PR 246, round 4 (Swallow holds Drift),
  2026-09-26; accepted as a follow-up when the settlement budget was spent.
- **Surface**: `agent-tools/smoke-tests/trusted-shell-directories.ts` (`trustedShellPath`).
- **Observed**: the smoke's PATH on POSIX is `/usr/bin:/bin`, while `resolveTrustedGit` in
  `agent-tools/src/core/trusted-git.ts` also admits `/opt/homebrew/bin/git` and
  `/usr/local/bin/git`. On a host with git only there, the smoke's pass cases fail closed.
- **Expected**: the smoke can find any git the allowlist admits.
- **Candidate cure**: the smoke's PATH gains the directory of the resolved trusted git, joined
  with the platform's delimiter; both estates carry the same list.
- **Target surface**: agent-tools smoke tests.
- **Status**: open
- **Owner direction status**: standing

### F-225 — the Bash policy reads a force push across a whole compound command (2026-10-01)

- **Source**: Crucible binds Slag, first-hand, 2026-10-01.
- **Surface**: the PreToolUse Bash policy in JC.net (`agent-tools/src/hook-policy`); OCE's twin
  is not checked.
- **Observed**: a compound command holding `gh api graphql -f query=…`, the word "push" inside
  a pull request title, and "git" in prose was refused as a force push. No push was present.
  Cure used: the text goes in files and `-F query=@file` replaces `-f query=`.
- **Expected**: the matcher judges one simple command at a time
  (`hook-policy-substring-discipline`).
- **Candidate cure**: split the command line into simple commands before matching, and match
  `-f` only as an argument of a `git push`.
- **Target surface**: agent-tools hook policy.
- **Status**: open
- **Owner direction status**: standing

### F-226 — knip's entry glob makes every validator helper an entry (2026-09-28)

- **Source**: a seat's finding, 2026-09-28 (Nova turns Penumbra).
- **Surface**: JC.net `knip.config.ts`, the agent-tools entry `src/validators/**/validate-*.ts`.
- **Observed**: the glob also matches every `validate-*-helpers.ts`, so knip never reports an
  unused helper export. OCE's config names each validator entry.
- **Expected**: helpers are not entries.
- **Candidate cure**: name each validator entry as OCE's config does, or exclude
  `*-helpers.ts`, then clear what knip reports.
- **Target surface**: `knip.config.ts`.
- **Status**: open
- **Owner direction status**: standing

### F-228 — no command formats or lints a computed file list, so seats pass an unquoted variable (2026-09-30)

- **Source**: the napkin, 2026-09-30 (Hawthorn binds Bracken); the gotchas entry of 2026-09-03 is
  the first instance.
- **Surface**: `prettier` and `markdownlint` run by hand over a shell variable under zsh.
- **Observed**: an unquoted variable holding a file list reaches the tool as one argument. On
  2026-09-03 prettier exited 2 and markdownlint linted the whole tree; on 2026-09-30 prettier
  printed "0 files" above a clean verdict. The gotchas file carried the lesson for four weeks
  before the second instance.
- **Expected**: a seat lints exactly the files it changed with one command.
- **Candidate cure**: a root script that takes paths on stdin (or lints the files changed
  against a base ref) and prints the count of files it read; until then, `xargs`.
- **Target surface**: root package scripts.
- **Status**: open
- **Owner direction status**: standing

### F-230 — the divergence measure names a directory neither estate has and skips three shared trees (2026-10-01)

- **Source**: the second two-estate consolidation, 2026-10-01 (Hazel tracks Trunk): the docs
  check refused the rule's scope list for citing `.agent/reviewers/`.
- **Surface**: the measuring script in the 2026-09-30 retrospective report, which
  `cross-estate-work-must-reduce-divergence` makes the measure.
- **Observed**: the script's scope lists `.agent/reviewers/`, which neither estate has. The
  reviewer templates are under `.agent/sub-agents/`, which it does not read; it does not read
  `.agent/memory/active/patterns/` or `.agent/reference/` either, both shared doctrine.
- **Expected**: the measure covers every shared doctrine tree, from one tracked command.
- **Candidate cure**: the owed `agent-tools` divergence command takes its scope from the rule
  and adds the three trees; the first run with the wider scope sets a new baseline and is
  reported beside the old one.
- **Target surface**: agent-tools CLI; the rule's clause 1.
- **Status**: open
- **Owner direction status**: standing

### F-231 — boundary records sit uncommitted on a cited precedent with no live owner word (2026-09-15)

- **Source**: twenty comms events in both estates, 2026-09-15 to 2026-09-30, grouped at the second
  two-estate consolidation (2026-10-01); the owner's word for compaction boundary 6, relayed by
  the Director (Wick binds Temper) on 2026-09-26 at 11:04Z, is "commit and push post-compaction".
- **Surface**: the boundary block and resume step of `session-handoff`;
  `precedence-is-not-approval`, whose trigger list names "the shape of a prior owner
  intervention".
- **Observed**: after that word, seats left boundary records uncommitted on the primary citing
  "the owner's precedent", "the Director's precedent" or "the compaction precedent" at five later
  boundaries (2026-09-26, 2026-09-28, 2026-09-29), each traced to the one word, so their commit
  and push became the resume's first act. On 2026-09-26 a usage limit cut a seat's records commit
  and push promised "before the stop" (OCE). Earlier boundaries left records on a local branch or
  for a later seat to commit (2026-09-15, 2026-09-24, 2026-09-25).
- **Expected**: a boundary's records are committed by pathspec before the stop unless the owner's
  word at that boundary says otherwise, and the resume finds any that were not.
- **Candidate cure**: the boundary block takes a field "records: committed <sha> | uncommitted
  under the owner's word at this boundary <quote, time>", so a precedent with no live word reads
  empty; the resume step lists uncommitted records on the primary with their authoring seat.
- **Target surface**: `session-handoff` (boundary block, resume step).
- **Status**: open; five instances after the rule's home date (2026-09-12) cite a precedent.
- **Owner direction status**: standing

### F-232 — a proven-superseded local branch has no permitted delete command (2026-09-25)

- **Source**: seats' comms events in OCE, 2026-09-25 to 2026-09-28 (Swallow holds Drift and
  Myrtle turns Canopy among them), grouped at the second two-estate consolidation.
- **Surface**: the standing prune in `worktree-hygiene` §6 (both estates); `git branch -d`; JC's
  `merge-bot retire` (`agent-tools/src/merge-bot/retire-*.ts`); the harness classifier and the
  seat's Bash guard.
- **Observed**: §6 deletes a branch that "landed by squash or is content-superseded" once its
  content proof is recorded, but `git branch -d` refuses such a branch as not fully merged, and the harness's permission layer refuses `git branch -D` and `git update-ref -d` (OCE's `.claude/settings.json` deny list names both; neither estate's hook policy has such an entry). In
  five instances proven branches were held for the owner's word; one was cleared on 2026-09-28
  at the owner's word ("Delete it by the forced path on this word (Recommended)") by removing
  the loose ref file. JC's `merge-bot retire` deletes only a tip that is an ancestor of the
  default branch (`retire-decision.ts`); OCE has no retire command.
- **Expected**: the prune policy names one admissible route for the proven class, so a proven
  branch is deleted without routing to the owner.
- **Candidate cure**: `merge-bot retire` accepts a content-superseded local branch, recomputing
  the per-file content proof against a freshly fetched base and recording it before its
  compare-and-swap `update-ref -d`; OCE takes the command; §6 names it.
- **Target surface**: agent-tools CLI (`merge-bot retire`); `worktree-hygiene` §6, both estates.
- **Status**: open; five instances (OCE). Distinct from F-178, a merged branch whose configured
  upstream lacks it.
- **Owner direction status**: standing

### F-233 — the WIP limit is hand-counted, and prepared work waits outside a pull request (2026-09-26)

- **Source**: comms events in both estates, 2026-09-26 to 2026-09-29: the Director's rulings of
  2026-09-26 and 2026-09-27, a landing post of 2026-09-27, and seats' pause closeouts.
- **Surface**: the work-in-progress limit in `pr-lifecycle` (both estates), with the owner's words
  "The total number of allowed PRs not including coordination PRs is the number of implementer agents, in this case three"
  and the sentence "While the count is full, a seat prepares without a worktree or a commit".
- **Observed**: no command in either estate's agent-tools computes the count. On 2026-09-27 a
  count included a coordination PR until a first-hand read; on 2026-09-28, at 3 of 3, one seat
  pushed a branch as the bot with no PR "so the bytes are safe" and another pushed a branch with
  no PR; on 2026-09-29 J8 B2 and B3 were committed in a worktree and held unpushed. The owner's
  word quoted by the Director on 2026-09-27 is
  "All useful work must be pushed and in a PR or merged".
- **Expected**: the count is computed, and a first push or a new lane worktree meets the limit at
  the moment it acts.
- **Candidate cure**: an agent-tools command that counts open PRs across the team's repositories
  less those whose head is under `coordination/`, for check-in, landing and slot lines to quote;
  a command that makes a branch's first push and opens its draft PR in one step, refusing at the
  limit with the pr-lifecycle sentence; `set-up-worktree-lane` runs the same check.
- **Target surface**: agent-tools CLI; `pr-lifecycle`; `set-up-worktree-lane`.
- **Status**: open; four instances.
- **Owner direction status**: standing
- **Further instance, 2026-10-01** (Hazel tracks Trunk, both estates): with its own pull request
  open, the consolidation seat cut, committed and pushed two more branches and cut a third,
  with the sentence "While the count is full, a seat prepares without a worktree or a commit"
  loaded. The text did not hold; five instances.
- **The owner's word on the count, 2026-09-29** (recorded in OCE's estate-coordination thread,
  two days after the limit landed, with seventeen pull requests open under the label
  "residual"): "There are WIP limits for very good reasons."

### F-234 — commitlint refuses the message only after the pre-commit gate has run (2026-09-26)

- **Source**: comms events in both estates, 2026-09-26 to 2026-09-29, from seats (Myrtle turns
  Canopy among them) and the Director; nine refusals or warnings.
- **Surface**: `.husky/commit-msg` (commitlint), which git runs after `.husky/pre-commit`; the
  commit-queue workflow (`agent-tools/src/commit-queue/commit-workflow.ts`); the seats' records
  ceremony; `pnpm agent-tools:check-commit-message`.
- **Observed**: the commit-queue workflow runs the message check before `git commit` only as an advisory (`commit-workflow.ts` calls the advisory orchestrator, whose result does not block), so a header
  over length, a subject in the wrong case, or a body line opening with a word and a colon or a
  hash-prefixed PR number (read as a footer) is refused after the full gate. A push then carried
  only another seat's commit (2026-09-26), and a records ceremony ended exit 2 at an unchanged
  tip four times (2026-09-28 and 2026-09-29). The commit skill says the message is "validated by
  `pnpm agent-tools:check-commit-message` before `git commit` is invoked"; seats ran it by hand
  after a refusal. JC's commit-msg hook runs commitlint without `--strict`, so a warning passes
  there (one shipped on 2026-09-28); OCE's runs `--strict`.
- **Expected**: a message refusal costs no gate run and needs no seat to remember the step.
- **Candidate cure**: the commit paths (the commit-queue workflow, the records ceremony, OCE's
  designed `merge-bot commit --message-file`) run `check-commit-message` on the message file
  before any staging or gate and name the offending line; a commit refused at the hook prints
  "NOT COMMITTED: tip unchanged at <sha>"; JC's commit-msg hook takes `--strict`.
- **Target surface**: agent-tools CLI (`commit-queue`); `.husky/commit-msg`.
- **Status**: open; nine instances. F-209 covers commitlint in CI, not this order.
- **Owner direction status**: standing
- **Further instance, 2026-10-01** (Hazel tracks Trunk): one message body with a line opening
  "rule: re-arm" passed JC.net's `check-commit-message` and was refused by OCE's as a footer
  with no leading blank line; the same day a commit chained after the check with `;` ran on a
  refused header. Ten and eleven.

### F-235 — a stale `.git/index.lock` from a seat's own interrupted git child blocks the primary (2026-09-25)

- **Source**: comms events of 2026-09-25 (OCE, Swallow holds Drift) and 2026-09-28 (JC, Siren
  herds Rudder and Nova turns Penumbra; OCE, Nova turns Penumbra), grouped at the second
  two-estate consolidation.
- **Surface**: the commit skill's Foreign index lock section; `.agent/hooks/policy.json` (both
  estates).
- **Observed**: three stale 0-byte locks with no live holder, each left by the seat's own
  interrupted git child: a merge-bot push's pre-push hook (OCE primary, 2026-09-25), a heartbeat
  stopped mid-cycle (JC primary, 2026-09-28, git blocked from 17:11Z to 17:15Z) and a build
  backgrounded inside one shell call (an OCE worktree, 2026-09-28). The skill's premise "A
  foreign lock means another agent is mid-commit" fitted none. Two were removed without the
  owner's word, one on the Director's no-objection (2026-09-25) and one recorded afterwards as a
  deviation (2026-09-28); the third went with its worktree under the owner's word,
  "Yes, remove it (Recommended)". Neither policy file names `index.lock`.
- **Expected**: the moment a seat reaches for the lock carries the skill's direction and names the
  likely own-child causes.
- **Candidate cure**: a Bash policy entry refusing `rm`, `unlink` or `mv` of a path ending
  `index.lock` (argv patterns, not a substring), whose reappraisal names the Foreign index lock
  section, the own-child causes and the route to the owner through the Director, lock untouched.
- **Target surface**: agent-tools hook policy; the commit skill's foreign-lock premise.
- **Status**: open; three instances, two removals without the owner's word.
- **Owner direction status**: standing; the skill cites the owner's direction of 2026-05-03

### F-236 — a commit on the shared primary carries a peer's staged or uncommitted hunks (2026-09-25)

- **Source**: comms events in both estates, 2026-09-25 to 2026-09-29, grouped at the second
  two-estate consolidation; the 2026-09-28 events in the same blocks are F-222's sources.
- **Surface**: commit and records scripts staging by pathspec on a primary checkout several seats
  commit from; `stage-by-explicit-pathspec`.
- **Observed**: staging a shared file by pathspec took a peer's uncommitted edits with it: the
  napkin (OCE, 2026-09-25), the review-cost ledger and napkin (OCE, 2026-09-27), and a 13-line
  plan-node hunk through a records script's fixed pathspec (JC, 2026-09-29). On 2026-09-29 two
  failed commits left files staged in JC's primary index: a seat's register rows (its
  102-character header refused by commitlint) rode the Director's commit, and the Director's
  napkin stayed staged after a pre-commit failure. The rule says "staging a file captures its
  WHOLE uncommitted state"; F-222 holds the other face, a peer's hunk failing a gate.
- **Expected**: a commit carries only what its author's own change produced.
- **Candidate cure**: records and commit scripts stage from the patch they applied, with
  `git apply --cached` as one JC records script now does; the commit path checks the message
  before any `git add`; a pre-commit check refuses an index holding paths outside the commit's
  pathspec and lists any staged hunk in a shared live file the seat's patch did not produce (the
  rule's Structural-Enforcement Candidate, shape 1).
- **Target surface**: agent-tools CLI (`commit-queue`); hooks; `stage-by-explicit-pathspec`.
- **Status**: open; five instances.
- **Owner direction status**: standing; the rule marks its structural-enforcement choice as
  owner-direction-shaped

### F-237 — commit and push chains report an outcome not read from the repository (2026-09-26)

- **Source**: comms events in both estates, 2026-09-26 to 2026-09-29: the Director's own
  corrections (JC) and seats' gate-done lines (OCE).
- **Surface**: hand-composed commit, push and sign chains; the seats' records ceremony (gate
  notice, queued records commit, gate done), which no agent-tools module in either estate names.
- **Observed**: two JC push runs carried nothing, one through an index lock and one through a
  missing message file (2026-09-26); a "rotation done" line went out against an unmoved head
  after an index-lock test failed silently (2026-09-27); a chain masked an exit and signed two
  threads before its push landed (2026-09-28). In OCE a ceremony's entry script reported end 0
  over a refused push (2026-09-28, cured in that seat's script), and gate-done lines reported
  exit 1 or 2 at tips that already held the commit, once at a tip already reported exit 0, with
  the gate events posted twice (2026-09-26, 2026-09-29). The in-band exit-codes rule names "a
  gate-runner helper that owns capture" as future tooling.
- **Expected**: the reported outcome is computed from the repository: HEAD moved, the remote tip
  equals HEAD, one gate event each.
- **Candidate cure**: an agent-tools landing command that records HEAD before the commit, refuses
  when HEAD did not move, reads the remote tip back after the push and exits non-zero unless it
  equals HEAD, naming the failing step; signing and "done" lines chain on its exit, and the
  records ceremony becomes that tracked command.
- **Target surface**: agent-tools CLI.
- **Status**: open; seven instances.
- **Owner direction status**: standing

### F-238 — the Cricket frame is assembled by hand and omits or misstates plan items (2026-09-26)

- **Source**: the Director's check-in frames of 2026-09-26 and the suite judges' readings, five
  comms events in both estates.
- **Surface**: `cricket` §Build one identical frame, field 1 (both estates).
- **Observed**: one frame left P7 out of READING and NEXT and did not compute the plan's
  §Verification measures (four NARROWED readings); a later frame did not say P7, P6 and P10(a)
  were done (five judges); check-in 31 reported P7 "not started" when it had landed in JC pull
  request 214 and OCE 249 (CONTRADICTED 6, all on that line). Field 1 asks for "the governing
  plan node's todo lines, quoted verbatim with the file and commit they were read at".
- **Expected**: the frame's sources carry every named item of the governing plan node with its
  true status, so the judges spend no verdicts on omissions.
- **Candidate cure**: a frame-assembly command that renders the SOURCES block from the plan node,
  each todo line verbatim with file and commit and each todo's landed PR or holding seat looked
  up.
- **Target surface**: agent-tools CLI; `cricket`.
- **Status**: open; three instances, one seat, one day.
- **Owner direction status**: standing

### F-239 — the pre-push chain reads no commit message or added path against the privacy directive (2026-10-01)

- **Source**: a privacy review of the push path, read against the code on 2026-10-01.
- **Surface**: `.husky/pre-push`; `privacy.md` rule 1, rule 7 and §Private editorial material.
- **Observed**: `.husky/pre-push` runs `pnpm check` and the site's end-to-end suite; no step reads
  the pushed range's commit messages or added paths against the privacy directive. Rule 1 names
  commit messages as a carrier; rule 7's whole-document read names plans and records, not commit
  messages. A branch's first push publishes its commits and their messages, and under merge
  commits a later commit leaves an earlier one in history.
- **Expected**: a pushed range's commit messages and added paths are read against the privacy
  directive before a branch's first push.
- **Candidate cure**: rule 7 extends to the pushed range's commit messages; a pre-push check
  refuses an added path under the ignored private boundaries and holds the first push of a branch
  adding files under `linkedin/` until a recorded privacy-review line exists. The check carries
  path families only, never a term list: a list of private names in a public hook identifies
  what it guards, and no scan reads meaning.
- **Target surface**: `.husky/pre-push`; agent-tools CLI; `privacy.md`.
- **Status**: open.
- **Owner direction status**: standing

### F-240 — nothing makes a ruling name the primary surface it read (2026-09-28)

- **Source**: the Director's own corrections of 2026-09-28 on both streams, which count them as
  the sixth and seventh read-the-primary-surface instances against that seat in one window.
- **Surface**: the clause in `verify-dont-trust` that a ruling
  "names what was read: the file's blob at the default branch's tip (never a checkout on a coordination branch), the API response, the run list"
  (both estates, from 2026-09-26); ruling-bearing comms sends.
- **Observed**: a review verdict read the coordination branch's copy of the exchange register
  before the convergence merge, not origin/main; a ruling rested on an unread premise about a
  deployed entry point; a lift rested on a review's state, not its body (all 2026-09-28, each
  corrected by a later event).
- **Expected**: a ruling names its primary surface at the moment it is sent.
- **Candidate cure**: a ruling-bearing comms send takes a `--read` argument per primary surface (a
  path at the default-branch blob sha, an API response, a run id), and the comms CLI refuses a
  ruling without one.
- **Target surface**: agent-tools CLI (`collaboration-state` comms); `verify-dont-trust`.
- **Status**: open; three instances recorded here, seven by the seat's own count.
- **Owner direction status**: standing

### F-241 — a machine-local path written into a channel file blocks another seat's commit (2026-09-25)

- **Source**: seats' comms events of 2026-09-25 (OCE, 11:23Z and 15:24Z) and 2026-09-26.
- **Surface**: tracked ARC channel files; `validate-no-machine-local-paths` (OCE's pre-commit hook; in JC.net it runs at pre-push through `pnpm check`);
  the comms concept gate's path-scoped `machine-local-path` concept (`comms-concept-gate.ts`,
  both estates).
- **Observed**: temporary-directory prefixes written into a pairing channel by two seats sat in
  the tracked file until another seat's commit and coordination-branch push were refused by the
  validator; two commit tries failed before the prefixes were replaced by a placeholder (twice
  on 2026-09-25, the second after a scratchpad-guard bullet landed in
  `important-state-not-in-temp-files` that day). By the source's read, the concept gate checks
  comms events only.
- **Expected**: the writer meets the refusal when the channel is written.
- **Candidate cure**: extend the concept gate's `machine-local-path` concept, or a write hook, to
  ARC channel appends.
- **Target surface**: agent-tools CLI (`collaboration-state`); hooks.
- **Status**: open; two instances, one day.
- **Owner direction status**: standing; the no-machine-local-paths principle is the owner's
  ruling of 2026-06-12

### F-242 — pr-watch counts a seat's reply as a review round when its signature shape differs (2026-09-26)

- **Source**: seats' comms events of 2026-09-26 (OCE), one by the seat whose replies carried the
  earlier shape.
- **Surface**: `SIGNATURE_SUFFIX` in `agent-tools/src/pr-watch/reviewer-legs.ts` (both
  estates); `identify-as-agent-under-shared-credentials`.
- **Observed**: the reader takes a bot-account reply as signed only when its last line starts
  with an em dash and ends with the session prefix, so "— <agent-name> (<prefix>), an agent"
  reads as unsigned and counts as a review round. The rule placed the prefix last at 12:41Z; at
  15:32Z a seat's PR 255 reply lacked the signed line, a peer caught it, and one comment edit as
  the bot cured it.
- **Expected**: the replying seat learns of an unsigned reply from the watch, not from a peer.
- **Candidate cure**: pr-watch names in its own output each bot-account reply whose last line
  begins with an em dash but fails `SIGNATURE_SUFFIX`, as a seat reply read as unsigned.
- **Target surface**: agent-tools CLI (`pr-watch`).
- **Status**: open; one instance after the rule's home.
- **Owner direction status**: standing

### F-243 — nothing lists unanswered ACK-REQUESTED events, so the Director answers them late (2026-09-27)

- **Source**: the Director's recorded defects of 2026-09-27 on both streams.
- **Surface**: the comms CLI (`collaboration-state`); `directed-routing-requires-absorption-ack`;
  `use-monitor-for-event-driven-wake`.
- **Observed**: a seat's ACK-REQUESTED question was answered 36 minutes late and another seat's
  routing request and ping sat about eighteen minutes, because OCE's stream was not read
  between check-ins. The wake rule says nothing makes the seat "READ the buffer between wakes";
  no agent-tools source in either estate handles ACK-REQUESTED. The cure applied was by hand,
  "every wake now reads directed events first".
- **Expected**: the reading order at each wake is the tool's, not the seat's memory.
- **Candidate cure**: a wake-time line from the comms CLI listing ACK-REQUESTED directed events
  addressed to the reader with no threaded reply, oldest first with their age; the Director's
  bootstrap arms one Monitor-backed `comms watch` per directed estate stream.
- **Target surface**: agent-tools CLI (`collaboration-state` comms); the Director's bootstrap.
- **Status**: open; two instances, one seat, one day.
- **Owner direction status**: standing

### F-244 — a script switched the shared primary's branch under a peer's unpushed commit (2026-09-27)

- **Source**: the Director's recorded defect and a seat's lesson, 2026-09-27, on both streams.
- **Surface**: the Director's settlement script (untracked); the shared-checkout clause of
  `worktree-hygiene`; `.agent/hooks/policy.json` (both estates).
- **Observed**: at 15:58Z the script switched OCE's primary to PR 265's branch between
  Swallow holds Drift's commit and push; the push read the switched branch and moved nothing
  (exit 1, up to date), and the seat pushed at 16:07Z. The rule reads
  "Never switch or create a branch (`git checkout`, `git switch`, `checkout -b`) in a checkout you do not exclusively own without explicit approval";
  the policy files block only the `git checkout --` and
  `git checkout HEAD` forms, and a switch inside a script is out of the Bash guard's sight.
- **Expected**: a push reads the branch its committer left.
- **Candidate cure**: settlement and other Director scripts become tracked agent-tools commands
  that run in their own worktree and refuse to switch the primary's branch outside the fold
  rotation; a policy entry refuses `git switch` and `git checkout <branch>` in the primary
  outside the fold; `merge-bot push` refuses when HEAD's branch is not the one the seat committed
  on.
- **Target surface**: agent-tools CLI (`merge-bot push`); hook policy.
- **Status**: open; one instance, no work lost.
- **Owner direction status**: standing

### F-246 — no tracked push re-requests reviews, so legs stay bound to the old head (2026-09-29)

- **Source**: a seat's lesson of 2026-09-29 (OCE, PR 312), seen on the legs Monitor.
- **Surface**: settlement pushes; the configured-legs passage of `pr-lifecycle`; `merge-bot`
  (both estates).
- **Observed**: a hand-written settlement script pushed without the Copilot and `@codex review`
  re-requests, so both legs stayed bound to the old head until the seat saw it on the legs
  Monitor. `pr-lifecycle` says Copilot "reviews the FIRST push and any tip the bot explicitly
  requests it on"; no merge-bot source in either estate requests a review.
- **Expected**: every settlement push re-requests each available configured leg on the new tip.
- **Candidate cure**: the tracked push step of the door (the merge-bot front door or a settlement
  command) re-requests every available configured leg on the new tip as the bot after it pushes;
  the legs Monitor's bound-to-old-head reading stays as the check that it ran.
- **Target surface**: agent-tools CLI (`merge-bot`).
- **Status**: open, an observation (one instance).
- **Owner direction status**: standing

### F-247 — a template-filled broadcast posted with an unfilled placeholder token (2026-09-28)

- **Source**: the Director's ROTATION line of 2026-09-28 00:37Z (JC), corrected by a follow-up
  event.
- **Surface**: `comms send` (`collaboration-state`, both estates); `coordination-fold` step 10.
- **Observed**: the ROTATION line left `{BASE9}` where the successor's base sha belonged in its
  second mention. The fold skill says "A broadcast filled from a template by substitution is
  re-read whole before posting, not only at its placeholders"; the send path has no
  template-token check in either estate.
- **Expected**: a substituted broadcast cannot post with a hole.
- **Candidate cure**: the comms send path refuses a body still carrying an unfilled
  `{UPPER_CASE}` token and names it.
- **Target surface**: agent-tools CLI (`collaboration-state` comms send).
- **Status**: open, an observation (one instance).
- **Owner direction status**: standing

### F-248 — the landing slot is a posted line, so two holders can take it (2026-09-28)

- **Source**: the Director's lesson (JC stream, check-in 64) and a seat's friction line (Nova
  turns Penumbra, OCE), both 2026-09-28.
- **Surface**: the slot turn of `pr-lifecycle` ("slot taken" to "slot released" on the
  coordination stream), both estates; no landing-slot code in either estate's agent-tools
  (`gate-slot` is the host gate limit).
- **Observed**: two go-lines issued at once named no holder, so PRs 281 and 282 were both synced
  (JC); after PR 291's release at 23:14:57Z, #293's take and 291's retake came 43 seconds apart,
  both merges polling (OCE).
- **Expected**: a second take is refused while the slot is held, naming the holder.
- **Candidate cure**: a slot state the comms CLI computes from the stream's "slot taken" and "slot
  released" lines, or an atomic claim, refusing a second take or go-line while one is unreleased.
- **Target surface**: agent-tools CLI (`collaboration-state`); `pr-lifecycle`.
- **Status**: open; two instances, one day.
- **Owner direction status**: standing

### F-250 — JC has no skill-evals runner, so nine skills' eval fixtures go unexecuted (2026-09-26)

- **Source**: seats' lessons of 2026-09-26 (OCE), including a one-case probe of the host runner;
  read against JC on 2026-10-01.
- **Surface**: JC's agent-tools (no `src/skill-evals`); nine tracked `evals/evals.json` files under
  `.agent/skills/` (the parallax skills among them).
- **Observed**: OCE has since built `agent-tools/src/skill-evals`, a projection onto the host's
  `claude plugin eval` (cases with graders, a with-without ablation arm, a judge) that keeps
  traces with `--keep-temp`; JC carries the fixture shapes with nothing that runs them.
- **Expected**: the fixtures run in both estates.
- **Candidate cure**: port OCE's `skill-evals` with its manifest and tests.
- **Target surface**: agent-tools CLI (JC).
- **Status**: open.
- **Owner direction status**: standing; the owner's capability-parity word of 2026-10-01 covers it

### F-251 — the Bash guard's git entries match whitespace tokens, so a glued redirection hides a flag (2026-09-27)

- **Source**: OCE's security-reviewed scanner cure in PR 261 (merged 2026-09-27); read against
  both estates' live policy by security-expert on 2026-10-01.
- **Surface**: `.agent/hooks/policy.json` and `agent-tools/src/hook-policy` (`blocked-patterns.ts`,
  `shell-words.ts`), both estates; OCE's scanner under `agent-tools/src/shell`.
- **Observed**: neither estate's `policy.json` has a `match: argv` entry, so `git reset --hard`
  and its siblings are matched by a whitespace tokeniser (`tokenizeCommand`), where
  `--hard>/dev/null` is one token and passes. JC's word scanner also keeps an unquoted `<` or `>`
  inside the preceding word (its one-character operators are the pipe, the semicolon, the
  ampersand, newline and the parentheses; unchanged since 2026-09-12). OCE cured its scanner in
  PR 261, with a literal-last-character state after a security review, and its live guard does
  not use that scanner either.
- **Expected**: a flag glued to a redirection is matched as the flag.
- **Candidate cure**: port PR 261's scanner to JC, then move the git entries to `match: argv` in
  both estates (the same change as the nested-script entry), under a security-expert review.
- **Target surface**: agent-tools hook policy; `policy.json`, both estates.
- **Status**: open; the gap is live by the code (read 2026-10-01). Hardening: the matcher's own
  doc calls it accident prevention.
- **Owner direction status**: standing

### F-253 — JC's push secret scan reports DEGRADED on a bot push to the repository URL (2026-09-26)

- **Source**: OCE seats' follow-ups of 2026-09-26 (events a977f68c, 8a964a73, 6e9accc1) and OCE's
  cure `SHA:18df9cfc0`; read against JC on 2026-10-01.
- **Surface**: `agent-tools/src/secret-scan/compute-push-scan-ranges.ts`; `merge-bot push` (JC).
- **Observed**: the scan scopes its exclusion by configured remote name (`--not --remotes=<name>`)
  while `merge-bot push` pushes to the repository URL, so a bot push prints "secret scan: DEGRADED
  — the scan is no longer scoped to the push destination." OCE scoped a URL destination through
  the remotes that fetch from its repository, with tests, on 2026-09-26; JC's copy has no such
  scoping, and its continuity record names the gap only as a routed note.
- **Expected**: a bot push gets a scoped scan.
- **Candidate cure**: port `SHA:18df9cfc0` to JC; a bot push after the port that still prints
  DEGRADED falsifies it.
- **Target surface**: agent-tools CLI (`secret-scan`, JC).
- **Status**: open.
- **Owner direction status**: standing

### F-254 — test files set global fake timers against `no-global-state-in-tests` (2026-09-25)

- **Source**: the exchange seats' joint set K4, 2026-09-25 (OCE events 20cc0c88 and 252fb4ce);
  counted in both estates on 2026-10-01.
- **Surface**: `agent-tools/tests/collaboration-state/comms-watch-errors.unit.test.ts` and
  `comms-watch-loop-deadlines.unit.test.ts` (both estates); in OCE also four
  `packages/libs/logger` tests and three `packages/sdks/oak-curriculum-sdk` tests.
- **Observed**: these files call `vi.useFakeTimers` or `vi.setSystemTime` (2 in JC, 9 in OCE),
  which `no-global-state-in-tests` and the testing strategy forbid; by the source's read no lint
  rule refuses either call.
- **Expected**: time enters a test through an injected clock or scheduler.
- **Candidate cure**: inject a clock in each file, each estate's change its own slice; then a
  `no-restricted-properties` entry at error in the test preset.
- **Target surface**: agent-tools tests; OCE's logger and SDK tests; the lint test preset.
- **Status**: open.
- **Owner direction status**: standing

### F-255 — the merge-bot push credential helper is unscoped and admits ambient git config (2026-09-25)

- **Source**: Swallow holds Drift's PR 239 dispositions, 2026-09-25 (events 0b9d9046 and
  0f5b343d, condition 7), deferred to a credential-narrowing follow-up; read against both estates
  on 2026-10-01.
- **Surface**: `agent-tools/src/merge-bot/git-credential-chain.ts` (both estates);
  `agent-tools/src/core/git-remote-url.ts` (both estates since JC.net pull request 279, 2026-10-01).
- **Observed**: the push clears `credential.helper` and sets its own with no `github.com` scope,
  so a `pushInsteadOf` can redirect the token; `http.*` config and `GIT_CONFIG_*` reach the push;
  and remote URLs with default ports are refused, failing closed (its unit test expects
  `ssh://git@github.com:22/acme/widgets.git` to read no repository).
- **Expected**: the token reaches only github.com, and no ambient config steers the push.
- **Candidate cure**: scope the helper to github.com; pin proxy, TLS verification and extra
  headers on the push argv, since `http.*` and `url.*.pushInsteadOf` also live in config files;
  drop `GIT_CONFIG_*`, `GIT_SSL_NO_VERIFY` and the proxy variables from the push environment;
  compare the host of `git remote get-url --push` with github.com before the token file is
  staged; accept default ports. One change in both estates under a security-expert review.
- **Target surface**: agent-tools CLI (`merge-bot`, `core`).
- **Status**: open; a review finding, no incident. It needs write access to git config or the
  push environment on the host.
- **Owner direction status**: standing

### F-256 — JC's commit guard refuses only the literal `main` read through `symbolic-ref --short` (2026-09-26)

- **Source**: OCE PR 246's guard fix of 2026-09-26, whose JC twin routes to Siren herds Rudder on
  landing (OCE events 49b9a436 and 424ffd7b); read against JC on 2026-10-01.
- **Surface**: `.husky/refuse-commit-on-main.sh` (JC).
- **Observed**: the guard reads `git symbolic-ref --quiet --short HEAD` and refuses only `main`;
  a tag named like the branch makes git shorten the ref to `heads/main`, and the commit passes
  (reproduced in a scratch repository on git 2.54.0, 2026-10-01). OCE's guard reads `git branch --show-current` and refuses `main`,
  `master` and the branch `origin/HEAD` names, proven by `agent-tools/smoke-tests/
  branch-guard.smoke.ts`; JC has no branch-guard smoke.
- **Expected**: the guard refuses a commit on the default branch whatever refs share its name.
- **Candidate cure**: take OCE's guard bytes with the smoke, the fail-closed follow-up on a
  malformed `origin/HEAD` (F-190) and F-224's PATH follow-up.
- **Target surface**: `.husky/refuse-commit-on-main.sh`; agent-tools smoke tests (JC).
- **Status**: open; a routed twin, no incident.
- **Owner direction status**: standing

### F-257 — the push secret scan's name-scoped exclusion trusts tracking refs fetched before a URL rewrite (2026-09-26)

- **Source**: Copilot on OCE PR 257's synced head, 2026-09-26, pre-existing; dispositioned as a
  follow-up for the secret-scan lane and carried by Swallow holds Drift's lane, which then closed
  (events f007a5e7 and 4f858cd8).
- **Surface**: `agent-tools/src/secret-scan/compute-push-scan-ranges.ts` (both estates).
- **Observed**: the exclusion `--not --remotes=<name>` trusts a remote's tracking refs, so refs
  fetched before a `remote.<name>.url` rewrite can exclude commits the new destination did not
  receive, and those go unscanned. By the source's grep, only OCE's review-cost ledger row #257
  and a thread record hold the finding.
- **Expected**: the scan excludes only commits the destination holds.
- **Candidate cure**: take the exclusion from the destination's live ref advertisement
  (`git ls-remote` on the URL git passes the hook), excluding only advertised tips present
  locally; a failed read prints the DEGRADED warning. Test first, the same bytes in both estates,
  after JC takes OCE's URL scoping.
- **Target surface**: agent-tools CLI (`secret-scan`).
- **Status**: open; a review finding, no incident.
- **Owner direction status**: standing

### F-258 — the corpus-analysis checkpoint reader resolves a relative path against the working directory (2026-09-29)

- **Source**: Codex's P1 on PR 311, 2026-09-29, reported by Nova turns Penumbra, judged not a
  regression and named as a follow-up (JC event c8e26024; item 5 of JC's exchange register J8
  row).
- **Surface**: `agent-tools/src/corpus-analysis/post-run/checkpoint-io.ts` (both estates).
- **Observed**: the file documents "A RELATIVE flag path resolves against the invocation working
  directory", while core's `resolveReadPathWithinRepo` (`flag-path-resolve.ts`) anchors a
  relative path at the repo root, as the other agent-tools CLIs do.
- **Expected**: one resolution rule for relative flag paths across the CLIs.
- **Candidate cure**: route `makeCheckpointReader` through `resolveReadPathWithinRepo`.
- **Target surface**: agent-tools CLI (`corpus-analysis`).
- **Status**: open; one review finding.
- **Owner direction status**: standing

### F-259 — tree-reading validators resolve their root through `CLAUDE_PROJECT_DIR`, scanning the primary from a worktree (2026-09-28)

- **Source**: Copilot on JC PR 239, routed by Nova turns Penumbra (event e7afa526) and
  acknowledged by the Director (event 488766da), 2026-09-28; the same seat's finding in OCE's
  smoke runner that day.
- **Surface**: `resolveRepoRoot` in `agent-tools/src/core/repo-root.ts` (both estates) and its
  default callers.
- **Observed**: `resolveRepoRoot` takes `CLAUDE_PROJECT_DIR` before walking up from the caller,
  so a tree-reading gate run in a linked worktree by a session opened in the primary scans the
  primary's tree and can report the wrong tree green. Each found site was cured locally with
  `projectDir: undefined` (the smoke runner among them); 26 JC and 46 OCE source files still call
  `resolveRepoRoot(import.meta.url)` with the default (counted 2026-10-01). The route reached only
  an archived napkin.
- **Expected**: a validator reads the tree it runs in.
- **Candidate cure**: walk up from the caller's own file by default, with the harness leg an
  explicit option for hooks; proven by a smoke with a decoy `CLAUDE_PROJECT_DIR`.
- **Target surface**: agent-tools CLI (`core`, validators).
- **Status**: open; two instances, one day.
- **Owner direction status**: standing

### F-260 — JC's merge door has no path for a vendor declared unavailable (2026-09-28)

- **Source**: the Director's ruling adopted at suite 49, 2026-09-28 (JC event 549c2ac3); one
  instance.
- **Surface**: `merge-bot merge` (`agent-tools/src/merge-bot/merge-args.ts`, JC); JC's merge-bot
  reference.
- **Observed**: the ruling's JC door clause for a Copilot outage cannot run, since merge-bot
  refuses a blank expectation and Copilot is JC's only configured vendor; until the mechanism
  lands, a green JC PR with zero threads and its posted expert legs goes on the owner's ready
  list, which the Director owns. OCE's door takes `--unavailable` and merges on a declared
  stand-in (`SHA:785f9139e`, 2026-09-29, `pr-watch/declared-unavailable.ts`); JC's
  `merge-args.ts` has no such flag.
- **Expected**: the door handles a declared-unavailable vendor in both estates.
- **Candidate cure**: port OCE's `--unavailable` with its tests and re-true the merge-bot
  reference's empty-set sentence.
- **Target surface**: agent-tools CLI (`merge-bot`, JC).
- **Status**: open; one instance.
- **Owner direction status**: standing

### F-261 — inline eslint rule-off comments pass unreported, and some workspaces compose no test shape (2026-09-25)

- **Source**: a seat's review finding on JC PR 196 (OCE event 0a513742) and the OCE exchange
  seat's acknowledgement (event cc15b5bf), 2026-09-25; config-expert found the OCE half that day.
- **Surface**: the `no-eslint-disable` rule (JC `tooling/eslint/src/rules/`, OCE
  `packages/core/oak-eslint/src/rules/`); JC's `jcdotnet/eslint.config.ts`; OCE's `oak-eslint`
  and workspace-config self-bootstrap configs.
- **Observed**: the rule's pattern matches only `eslint-disable` directives, so an inline
  `/* eslint <rule>: "off" */` comment switches a rule off unreported, and neither estate sets
  `noInlineConfig`. JC's site config composes no test-shape config, so no vitest skip, only or
  todo rule reaches its tests (JC's plugin half was cured on 2026-09-25); by config-expert's
  finding, OCE's self-bootstrap configs compose neither tier.
- **Expected**: a rule is turned off only where a reviewed config says so, and every workspace's
  tests meet the test-shape rules.
- **Candidate cure**: the rule also reports `eslint` configuration comments, or the configs set
  `linterOptions.noInlineConfig`; compose the test shape in JC's site config and in OCE's
  self-bootstrap configs.
- **Target surface**: lint configs and the `no-eslint-disable` rule, both estates.
- **Status**: open; one review finding per estate.
- **Owner direction status**: standing

### F-262 — the Bash guard's default-mode git entries do not read a quoted `bash -c` script (2026-09-27)

- **Source**: Nova turns Penumbra, OCE event 160ab4ab, 2026-09-27, recorded outside PR 261's
  scope.
- **Surface**: `agent-tools/src/hook-policy` (`argv-nested.ts`, `argument-matcher.ts`);
  `.agent/hooks/policy.json` (both estates).
- **Observed**: the argv mode re-reads an interpreter's script (`argument-matcher.ts`), but no
  entry in either policy uses it. The git entries ("git push --force" and its siblings) carry no
  mode, match by token subsequence over whitespace tokens, and miss `bash -c 'git push --force'`,
  where the quotes stay on the tokens (read in the code 2026-10-01).
- **Expected**: a git shape inside a nested script is refused as it is at top level.
- **Candidate cure**: move the git entries to `match: argv`, giving one reader that also cures
  the glued-redirection entry, after checking the argv tables cover every git entry, including
  `git --no-verify` with no subcommand.
- **Target surface**: agent-tools hook policy.
- **Status**: open; one recorded gap, no incident.
- **Owner direction status**: standing

### F-263 — a merge-bot unit test runs the real `git check-ref-format` (2026-09-25)

- **Source**: Swallow holds Drift, 2026-09-25 (OCE event 6fbf1cc5), named as later test debt
  outside PR 239.
- **Surface**: `agent-tools/src/merge-bot/push-args.unit.test.ts` (both estates).
- **Observed**: the test runs git on purpose as the oracle for ref legality ("real `git
  check-ref-format` runs here, unfaked"), so a unit test does IO.
- **Expected**: unit tests do no IO; the oracle cases live in an integration test.
- **Candidate cure**: keep the oracle cases as one integration test and give the unit tests an
  injected ref-format check.
- **Target surface**: agent-tools tests.
- **Status**: open; known test debt.
- **Owner direction status**: standing

### F-264 — JC's `profile:sync push` returns before its merge guard when the profile holds no documents (2026-09-28)

- **Source**: JC PR 236's settlement head, routed to the OCE twin by Siren herds Rudder on
  2026-09-28 (JC event d6f01d08); OCE's twin carries the cure.
- **Surface**: `agent-tools/src/validators/operator-profile/operator-profile-git-push.ts` (JC).
- **Observed**: `stageAndCommit` returns `committed: false` when no paths are staged, before
  `mergeGuard` runs, so a profile root mid-merge on its git furniture is neither refused nor
  concluded. OCE probes first, since "a profile with no documents can still be mid-merge on its
  git furniture".
- **Expected**: the merge guard runs whatever the path count.
- **Candidate cure**: take OCE's ordering and its test case.
- **Target surface**: agent-tools CLI (operator profile, JC).
- **Status**: open.
- **Owner direction status**: standing

### F-266 — the merge door fails fast when its first poll reads `mergeable=UNKNOWN` (2026-09-24)

- **Source**: Siren herds Rudder, 2026-09-24 (JC events 539272ad and 05528fd1); two instances.
- **Surface**: `retryLabel` in `agent-tools/src/merge-bot/merge-cli.ts` (both estates).
- **Observed**: right after main moved, the first merge call for PR 180 and for a later PR exited
  1 with "mergeability not yet computed (mergeable=UNKNOWN)", and the re-run merged; the first
  refusal was also lost behind a tail filter. `retryLabel` retries a `ReadingUnavailableError`
  only when `poll > 1`, treating a first-poll failure as a broken environment, while the message
  from `pr-watch/state-gh.ts` itself says "re-run in a few seconds".
- **Expected**: an UNKNOWN mergeability reading retries within the poll budget on any poll.
- **Candidate cure**: classify the UNKNOWN reading as a wait, retried from poll 1, leaving other
  first-poll failures to fail fast.
- **Target surface**: agent-tools CLI (`merge-bot`).
- **Status**: open; two instances, one seat.
- **Owner direction status**: standing

### F-267 — the harness's auto-mode classifier refuses the persistent comms watcher (2026-09-29)

- **Source**: a seat's comms events e2324698 (2026-09-29) and 30d92cfd (2026-09-30), JC; two
  instances.
- **Surface**: the all-channels watcher launch under Claude Code's auto-mode permission check;
  `.claude/settings.json`, which names no allow rule for the watcher in either estate.
- **Observed**: the classifier denied the watcher; the seat read the stream by hand at its
  boundaries, the F-95 gate then refused `claims open`, and the lane ran claimless on broadcasts.
- **Expected**: the watcher arms in auto mode.
- **Candidate cure**: a project allow rule for the watcher's launch command, verified first-hand
  in an auto-mode session.
- **Target surface**: harness settings (`.claude/settings.json`).
- **Status**: open; two instances, one seat.
- **Owner direction status**: standing

### F-268 — a reviewer's read-only brief does not bind its Bash tool (2026-09-25)

- **Source**: a seat's disclosure, 2026-09-25 (OCE event ed4cd678); one instance.
- **Surface**: the sub-agent templates' tool sets (`.agent/sub-agents/templates/
  assumptions-expert.md` declares Read, Grep, Glob, Bash, WebFetch and WebSearch in both estates).
- **Observed**: an assumptions-expert review dispatched under a read-only brief ran
  `codex features list` on three releases and one logged-out `codex exec` that sent one
  unauthenticated request to the vendor (401, no model turn); the seat judged it within the
  owner's standing Codex permission. The template's "read-only review" mode disallows only Write,
  Edit and NotebookEdit.
- **Expected**: a review that is not to execute or reach the network says so in its tool set.
- **Candidate cure**: a read-only declaration variant without Bash and the web tools, used when a
  brief is read-only.
- **Target surface**: sub-agent declarations and templates.
- **Status**: open, an observation (one instance).
- **Owner direction status**: standing

### F-270 — the PreCompact log writer retightens a pre-existing file and then appends (2026-09-25)

- **Source**: the exchange seats' agreed joint cure, 2026-09-25 (events 2a33cf89, 26fc7185 and
  4aac9303), recorded only as a continuity line.
- **Surface**: OCE `agent-tools/src/core/owner-only-append.ts` (step 6, `fchmod`); JC
  `agent-tools/src/bin/claude-pre-compact-observe-hook.ts` (`fchmodSync`, then `appendFileSync`).
- **Observed**: both writers set a pre-existing log to 0o600 and then write, so a descriptor
  another account opened while the mode admitted it still reads the later bytes.
- **Expected**: "before any byte is written, refuse or replace a pre-existing file whose mode
  admits another account" (the joint cure's words).
- **Candidate cure**: one writer. JC takes OCE's `core/owner-only-append.ts` and its hook calls
  it (JC's writer has no no-follow flag and no owner, link-count or same-file check); the mode
  refusal lands at the `fstat` step, refusing when `mode & 0o077` is non-zero, before `fchmod`.
  Refuse; do not replace.
- **Target surface**: agent-tools CLI (`core`, the PreCompact hook).
- **Status**: open; a design finding, no incident.
- **Owner direction status**: standing

### F-272 — merge-bot's `--expect` grammar admits the `unknown` login of a deleted account (2026-09-20)

- **Source**: a security read of 2026-09-20 (event 9000d6ce), hardening items 2 to 4, carried in
  the 2026-09-25 comms decision table.
- **Surface**: `EXPECT_GRAMMAR` in `agent-tools/src/merge-bot/merge-args.ts` (both estates);
  pr-watch's login reading.
- **Observed**: the grammar accepts `unknown`, the login pr-watch gives a deleted account's
  comment (`harvest-fields.ts` in JC, `state-fields.ts` in OCE), so an operator who
  declared it would count such a comment; the same read named a `[bot]` suffix trap, Unicode
  format characters passing the sanitiser, and a code-unit slice; those three were not re-read on
  2026-10-01, and JC's `pr-watch/printable.ts` drops format characters today.
- **Expected**: no expected-reviewer declaration can match a sentinel login.
- **Candidate cure**: carry a deleted author as a value the login grammar cannot match (null or
  a tagged variant), so no denylist is needed; the grammar refusing `unknown` is then defence in
  depth. One lane, both estates.
- **Target surface**: agent-tools CLI (`merge-bot`, `pr-watch`).
- **Status**: open; a security read, no incident.
- **Owner direction status**: standing

### F-273 — a Copilot finding in the review body under "Findings: None" is invisible to a wait that counts threads (2026-10-01)

- **Source**: Crucible binds Slag (OCE pull request 322, two rounds) and Hazel tracks Trunk
  (JC.net pull request 281, rounds two and three), first-hand, 2026-10-01.
- **Surface**: Copilot's review overview comment; `pr-watch` and the seats' wait scripts; the
  merge door's grounds line.
- **Observed**: the overview prints "Findings: None" and lists items under "Previously missed"
  or in its summary sentence, with no review thread. A wait that counts unresolved threads
  reports a clean round. The door prints "tally body findings (SKILL item 2) before reading
  this round as zero-finding" and OCE's door does not read the body itself; JC.net's reads the tip-bound body for its headline verdict and suppressed count and holds on those (`suppressed-hold.ts`), and reads no "Previously missed" item.
- **Expected**: a round's body items are counted with its threads.
- **Candidate cure**: `pr-watch` reads the tip-bound review body for "Previously missed" and
  file-and-line items and reports their count beside the thread count; the door refuses a
  zero-finding reading while that count is above zero and no signed disposition names them.
- **Target surface**: agent-tools CLI (`pr-watch`, `merge-bot`).
- **Status**: open; four rounds on two pull requests, two seats.
- **Owner direction status**: standing

### F-274 — nothing flags a gendered pronoun for an agent at the moment it is written (2026-09-29)

- **Source**: the owner's word of 2026-09-29, at the end of a compaction order, recorded in OCE's
  estate-coordination thread and a handoff record: "STOP assigning gender to agents, I am sick
  of having to say that".
- **Surface**: `agents-default-no-gender` (both estates); the comms CLI, thread records, handoff
  records and commit messages.
- **Observed**: the rule was loaded and the owner still had to say it again; nothing reads the
  text a seat writes about another seat.
- **Expected**: the miswrite is caught at the write.
- **Candidate cure**: a validator over agent-authored records that flags he, she, him, her, his
  or hers in a sentence naming a registered seat identity (human referents stay out of scope),
  run by the record-append tool and the commit-msg hook.
- **Target surface**: agent-tools CLI (`collaboration-state`); `.husky/commit-msg`.
- **Status**: open; homed and recurred.
- **Owner direction status**: standing

### F-275 — a turn can end on a question to the owner, or a block on the owner, with no card (2026-08-19)

- **Source**: two owner words in OCE's records. Absorbed 2026-08-19: "never, EVER proclaim you
  are not going to do anything because you are blocked on me without raising a user card". At
  the end of a compaction order, 2026-09-17: "And when I say cards, I mean use the user question
  UI".
- **Surface**: `present-verdicts-not-menus` and `route-blocks-and-questions-to-director` (both
  estates), which name the question tool; the harness's turn end.
- **Observed**: both rules say a question reaches the owner as a card, never as prose, and
  questions still end turns as prose. On 2026-10-01 the consolidation seat held fourteen
  questions in report text with the owner away, because a card holds the turn until answered
  and `unattended-seats-never-prompt` forbids stopping on a prompt; it sent one push
  notification instead.
- **Expected**: the turn end carries the rule: a card when the owner is present, a push
  notification when the owner is away, and the question in the report text in both cases.
- **Candidate cure**: a Stop hook that refuses to end a turn whose final text carries an
  owner-directed question or a claim to be blocked on the owner when the turn made neither an
  AskUserQuestion call nor a push notification.
- **Target surface**: harness hooks; agent-tools hook policy.
- **Status**: open; homed and recurred.
- **Owner direction status**: standing

### F-276 — a pull request can be readied, and a test change committed, with no expert verdict on record (2026-09-29)

- **Source**: the owner's words of 2026-09-29 and 2026-09-30, recorded in JC.net's thread and
  handoff records: "use the testing expert and code expert subagent reviewers, you have clearly
  been decreasing the quality of the repo, breaking rules, creating rework and wasting time";
  "nothing about that test information was new, it is ALL written down in directives, in rules,
  in the test expert, so WHY were bad, wasteful tests written?"; and, of a test that pinned a
  setting, "And we never test for configuration."
- **Surface**: `invoke-code-experts`, `testing-strategy` and `test-immediate-fails` (both estates) and JC.net's `invoke-test-expert` (OCE has no such rule); the ready-for-review step of `pr-lifecycle`; the commit
  path.
- **Observed**: every rule the tests broke was loaded. Tests of configuration and of call
  sequences were written and committed with no reviewer run, three times in two days in one
  lane (2026-09-29 and 2026-09-30).
- **Expected**: the reviewer rules fire where the work leaves the seat.
- **Candidate cure**: the ready-for-review step, or a pull-request body check, refuses a body
  with no code-expert verdict line, and no test-expert line where test paths changed; the
  commit path refuses a commit staging test files, test helpers or test config whose message
  carries no test-expert verdict line; the test-expert checklist names fakes that branch on
  their own call arguments and assertions on our own configuration literals.
- **Target surface**: agent-tools CLI (`commit-queue`, `pr-watch`); `pr-lifecycle`; the
  test-expert template.
- **Status**: open; homed and recurred. The no-IO half is the no-IO test boundary plan's lint
  rule.
- **Owner direction status**: standing

### F-278 — nothing stops a commit or a push after the owner's stop word (2026-09-29)

- **Source**: the owner's correction of 2026-09-29 to a Director, recorded in OCE's
  estate-coordination thread: "I said acknowledge and stop, not do a bunch of jobs then commit".
- **Surface**: `owner-signal-interpretation` §Stop Words Are Freezes (both estates); the Bash
  guard.
- **Observed**: the freeze reading was homed and the seat still ran jobs and committed after an
  acknowledge-and-stop word.
- **Expected**: the first write after a stop-class word meets the word.
- **Candidate cure**: a PreToolUse check on `git commit` and `git push` that, when the owner's
  latest prompt carries a stop-class instruction (acknowledge, stop, hold, pause), refuses once
  with a message quoting that prompt.
- **Target surface**: agent-tools hook policy.
- **Status**: open; homed and recurred (one instance after the home).
- **Owner direction status**: standing

### F-279 — a handoff record can be written without the assumption ledger PDR-063 asks for (2026-09-25)

- **Source**: the owner's word at two boundaries on 2026-09-25, recorded in OCE's handoff
  records: "Identify assumptions and highlight them".
- **Surface**: `session-handoff` (the record step) and the handoff record's shape, both estates;
  PDR-063.
- **Observed**: the ledger was written at those boundaries because the owner asked for it by
  name; the PDR clause is not in front of the seat when the record is written.
- **Expected**: the record's shape carries the ledger.
- **Candidate cure**: the handoff record shape gains an assumption-ledger heading, and the
  record step's check refuses a record without one.
- **Target surface**: `session-handoff`; agent-tools CLI (`collaboration-state`).
- **Status**: open.
- **Owner direction status**: standing
- **Instance, read 2026-10-01**: neither estate holds a `handoff-record.schema.json` or a worked
  example: the second tranche of the handoff-record decision (OCE's ADR-182), which was to land
  them, never landed, so PDR-063's four sections are the only statement of the record's shape and no
  check reads a record against it.
