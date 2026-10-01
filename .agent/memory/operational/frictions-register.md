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

### F-219 — a peer's comms event during the pre-push gate fails the push: the generated log is stale (2026-10-01)

- **Source**: Crucible binds Slag, first-hand, the push of the coordination fold on 2026-10-01.
- **Surface**: the pre-push `practice-substrate check`; `collaboration-state -- comms append`.
- **Observed**: the check refuses a push when the generated `shared-comms-log.md` is older than
  the newest event file. `comms append` writes an event without rendering the log, and any
  seat's event written during the ten-minute gate makes the log stale. Cost: one full gate run.
  Cure used: `comms render`, then push again, with the peer asked to hold comms writes.
- **Expected**: a push does not depend on an untracked, generated file that another seat's
  write can invalidate mid-gate.
- **Candidate cure**: the check renders the log itself before comparing (the repair is
  deterministic), or reads the event files and not the rendered log; `comms append` renders.
- **Target surface**: agent-tools CLI (`practice-substrate`, `collaboration-state`).
- **Status**: open
- **Owner direction status**: standing

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

### F-224 — the branch-guard smoke's PATH is narrower than the trusted-git allowlist (2026-09-26)

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
