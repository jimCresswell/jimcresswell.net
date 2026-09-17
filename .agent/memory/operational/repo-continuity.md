---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure on a file that grows by append each session; 115 clears the
  noise while still flagging genuine over-runs.
fitness_content_role: reference
overflow_disposition: "leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)"
merge_class: index-narrative-tables
---

# Repo Continuity

The canonical continuity contract for `jimcresswell.net`: where we are, what is
live, what is next. Refreshed by `session-handoff`; read at session resume.

## Current State

- `main` carries the monorepo and the Practice since PR #53 merged (`55649a2`, 2026-09-13); the
  transplant closure ran as small PRs against `main` and is complete (the last, #91, merged
  2026-09-15 at `SHA: f8aab12`). Plan of record:
  `docs/explorations/2026-09-12-oce-practice-lineage-transplant.md` (§Owner rulings, rounds 1
  to 16; the closure's later rulings are in the Director's handoff).
- Seven pnpm workspaces; root scripts through Turborepo; root devDeps installed.

Landed before the closure, all on `main` since PR #53 (kept as the record of how; nothing below
names a live branch):

- **Landed through `feat/monorepo`** (merged in #53): the transplant
  (directives merged, 127 rules triaged, skills + adapters, JC statusline mark,
  `preserve-caught-error` on) and Phase 8 harness (Claude/Codex/Cursor hooks and
  statusline, hook policy restored, full Husky set, `ci.yml` with CI parity,
  root gates: gitleaks, knip, depcruise, markdownlint footprint, sub-agent
  adapters for 27 templates). **`pnpm check` is green end to end.**
- **Re-evaluate slice 1 committed** (plan §Re-evaluate ×3): the identity CLIs read
  the harness-native `CLAUDE_CODE_SESSION_ID` (PDR-027 amendment) and the hook
  reports truthfully; the shared start-right workflows cite the gates skill
  instead of a lineage gate list; the copied docs layer is re-homed by role —
  `docs/governance` and `docs/foundation` dissolved, six developer docs stay in
  `docs/engineering`, eight host guides in `.agent/reference`, six doctrine
  merges into directives and rules. `.agent-original/` deleted 2026-09-13 after
  the computed loss-scan (round 13).
- **Link repair done (2026-09-12, resumed session):** `validate-markdown-links`
  reports 0; `docs-validators:check` (reference direction, machine-local paths,
  markdown links, cited scripts) is a `check` leg and a CI step, so `check:docs`
  is now a subset of `check`. The patterns index is generated from the (empty)
  local corpus and its validator is green. Two lineage methodology docs were
  imported: `memory/operational/{ephemeral-to-permanent-homing,collaboration-state-lifecycle}.md`.
- Gates since closure item 3 (PR #56, `1829cd4`): `repo-validators:check` runs check-ci-parity,
  claim-freshness, pretooluse-guard-routing, policy-reappraisal, lifecycle-scripts,
  no-stale-script-invocations, collaboration-state, identity-naming,
  workspace-config-isolation and plan-corpus as `check` legs; the agent-tools smoke suite
  (collaboration-tui, codex-session-alert with `--silent`) runs as the e2e leg. Still to
  retire under item 5: `validate-ratified-lists`. Not re-checked today: the fitness vocabulary
  in the `practice-fitness` sources.

- Deep consolidation status: **due — the transplant closure (a plan milestone) closed on
  2026-09-15**, and the napkin holds the arc's segments at over 1,650 lines. It was not run at
  the end-of-arc wrap: the graduation drain is curator work in batches (the Director's handoff
  item 94); the owner's retrospective is recorded in
  `.agent/reports/agentic-engineering/why-the-transplant-arc-cost-what-it-cost-2026-09-15.md`,
  so the drain is next. Session 2's cards and archive gates are
  in `threads/session-2-synthesis.next-session.md`.
- The generators: lane B's PR #55 (item 6, PR 1) landed the frontmatter sweep; the rules-index
  and trigger generator remains item 6 part 2a (`closure/lane-b-generator` at `SHA: d76bb86`);
  the sub-agent adapter generator (2b) and 2a are handed back to the Director
  (lane B's handoff record v3).
- **2026-09-13, late afternoon (wrap 6, historical):** `practice-completion` ratified with its three gates
  cleared and the transplant closure as eight checked exit conditions in two sessions (node
  §Transplant closure); the private editorial material made optional and minimally mentioned;
  `compute-dont-hope` and `record-generalisation-moves` are rules; the generalisation register
  holds fifteen rows, six owed to the lineage; the bootstrap closure and the validators' universe
  are derived; draft PR #53 open and green through 653f274, CI running on 7d6f292. No watcher,
  cron, claim or monitor was live at the wrap; nothing survives compaction and nothing needs
  re-arming.

- **2026-09-13, evening (wrap 7, the Director session):** the owner named this seat Director (PDR-117)
  and started three Implementer seats. Landed on `main`: the Director records and the channel rule
  (PR #54, `c426c6c`), closure item 4 (PR #57, `4a61112`, merged by the merge bot the owner created:
  App `jimbot-of-the-devonshire-jimbots`, config per-checkout and untracked, key outside the repo).
  Then, the same evening: item 3 merged (PR #56, `1829cd4`, by the owner); lanes B and C handed
  back and stood down; the owner set n=2 (Director and lane A, 17:16Z) with an ARC channel beside
  native messaging; open at 17:40Z: #58 (records), #60 (the per-checkout Playwright port), #55
  (one thread, cure by lane A), #59 (carried on #58). The live map is `director-handoff.md`
  (§Current handoff state, the board, the routing log whose last entry is current); it is the
  successor Director's first read.

## Active Threads

- Closure session 2's synthesis (`threads/session-2-synthesis.next-session.md`): the cards were
  answered 2026-09-14 (the Director's handoff item 78); the graduation drain is curator work.

## Paused Threads

- LinkedIn editorial pass (owner-led, private boundary; headline is the only
  settled field).
- Track B Source-of-Truth Design, Phase B2.1.
- Dev-Tooling Hygiene (dependency updates handled locally).

## Next Safe Steps

STATE, 2026-09-16 afternoon (Cauldron herds Lustre, Director), owner-directed in this order:

- #92 merged (`SHA: 9fe00be`): TypeScript 7 beside the 6.0 compiler API through npm aliases,
  holds recorded in `docs/engineering/build-system.md` §Dependency updates. After
  2026-09-17T08:24Z, delete the `minimumReleaseAgeExclude` block in `pnpm-workspace.yaml`: all
  five excluded packages were published 2026-09-16 and it is dead config once they age past the
  24h floor.
- #93 merged by the owner 2026-09-16 20:38Z (`SHA: 958919c`): the `PreCompact` observer, run
  from TypeScript source, with its review settled (CodeQL alerts 8 and 9 fixed; an unreadable
  stdin recorded as `stdin-unreadable`; the observation log owner-only).
- The coordination branch `coordination/2026-09-15-b9dcfb` folded after #93 and landed as #97
  (`SHA: bee0141`, 2026-09-16); this branch, `coordination/2026-09-16-bee014`, was cut from that
  merge and carries #97's fourth-review record cures. The primary checkout's `.claude/logs` and
  the `falsifier-2a` worktree's were made owner-only by hand the same evening.
- Strictness, owner word 2026-09-16: "I want the tsconfig brought up to strict everywhere, but if
  there is a better way to do it that is fine, I was being explicit but I am happy with standard
  approaches." Landed as drafts, all green through the full pre-push gate:
  - #94 (`SHA: 5746ad8`): one strict base that all 22 tsconfigs extend, adding
    `verbatimModuleSyntax`, `noImplicitOverride`, `allowUnreachableCode: false` and
    `allowUnusedLabels: false` (each measured at zero errors first).
  - #95 (`SHA: 7877996`): `noUncheckedIndexedAccess` slice 2a, jcdotnet and tooling/eslint.
  - #96 (`SHA: fa4207b`): slice 2b, agent-tools
    `src/validators` and `src/practice-fitness`; agent-tools errors under the flag 202 → 142.
  Remaining, one draft pull request each, cut from `origin/main` (worktree
  `strict-index-site` is reused by switching a clean tree to a fresh branch): 2c agent-tools tests
  and smoke tests (`tests/collaboration-state`, `tests/claude`, `tests/commit-workflow`, two smoke
  tests); 2d `src/pr-watch`, `src/corpus-analysis`, `src/spawn`; 2e the remaining eleven `src`
  files; then the flip of `noUncheckedIndexedAccess` into `tsconfig.base.json`, which needs a
  config-expert review and a flag-on ESLint run across all of agent-tools first. Then
  `exactOptionalPropertyTypes` (210 errors) by the same method. Measure with
  `tsc -p <config> --noEmit --incremental false --noUncheckedIndexedAccess`; prove each slice at zero
  errors with the flag on AND off. Idioms, settled so the ~140 remaining fixes read one way:
  `.at(i)` inside an existing guard; `for (const [index, rawLine] of lines.entries())`;
  `const [head = ''] = text.split(sep)`; a mandatory capture group handled with the function's own
  not-found result; tests assert `toMatchObject([{ ... }])` (it checks length and fields together),
  or `map` then `toEqual` for id lists. `noPropertyAccessFromIndexSignature` is NOT adopted — owner
  word 2026-09-16: "sounds like it is more pain than it is worth" (234 mostly stylistic sites, and
  it fights ESLint `dot-notation`).
- The owner directed that the sibling estate's strictness be raised to the same target set as
  maintenance after these slices land; sent to Zephyr guards Leeward (281e44) as directed comms
  event 42fe1d6f and by live message, and absorbed there (recorded in that estate's coordination
  thread record, scheduled as maintenance).
- The primary checkout's uncommitted owner files were discarded at the owner's word ("if my work
  is covered elsewhere then you can discard it"), each proven first: the twelve dependency paths
  byte-identical to the patch that became #92, the seven tsconfig edits adding only flags #94's
  base carries.

STATE, 2026-09-17T13:55Z (Cauldron herds Lustre, Director). Every fix lane stopped at once when
the session hit its usage limit (reset 03:20 Europe/London); several stopped mid-merge or
mid-cure. No lane process, monitor or port-3000 listener survives (census at 13:55Z).

FIRST ACTION: finish the in-flight inventory below, in its order, before starting any new lane.
Open no new fix lane while more than four fix pull requests are open (the night's loop grew faster
than it closed: see the napkin segment of 2026-09-17). Each pull request keeps the two-round
budget; a finding after the last round is cured forward on a branch cut from the reviewed head,
lifted by a signed line naming that commit, and landed in its own pull request.

Merged 2026-09-16/17 (owner word 2026-09-16: "If you know there is broken code, fix it"): #98
(`SHA: 262a9f7`), #99 (`SHA: bb284c9`), #100 (`SHA: d8852f0`), #101 (`SHA: 65cf1d0`), #102
(`SHA: fb0409f`), #103 (`SHA: cd56dd5`), #104 (`SHA: 4d5d334`), #106 (`SHA: e13bce2`), #107
(`SHA: e98134b`), #108 (`SHA: dbc1feb`), #109 (`SHA: 6667514`), #110 (`SHA: 9a8db1b`), #113
(`SHA: 278a8cd`), #115 (`SHA: b2cd959`).

In-flight, in order (worktrees are named by their directory under the sibling worktrees folder):

1. PR 119 `fix/site-vitest-conventions` (`SHA: 530678da`): approved in round one, no findings,
   CLEAN. Merge it.
2. PR 116 `fix/override-floors` (`SHA: ad6454d7`): approved in round one, no findings, but it
   conflicts with #115. The `override-floors` worktree holds `git merge origin/main` IN PROGRESS:
   no unmerged paths, 29 paths staged, not committed; the lane stopped before its checks. Check
   the resolution (`jcdotnet/package.json` carries neither the `pnpm` nor the `knip` field;
   `build-system.md` keeps #115's sentence and this branch's override paragraphs), run
   `CI=true pnpm install --frozen-lockfile`, `pnpm audit`, markdown lint and `turbo run lint`,
   commit the merge, push, request round two.
3. PR 117 `fix/lineage-oak-identifiers` (`SHA: 5c58858a`): the same shape. The
   `lineage-oak-identifiers` worktree holds a merge of `origin/main` IN PROGRESS: no unmerged
   paths, 30 staged, not committed. Verify, rerun the `oak-` grep over the lane's scoped paths,
   run the agent-tools suite and smokes, commit, push, request round two.
4. PR 105 `fix/session-start-hook-paths` (`SHA: 8dab8e86`): round two (the last) found five
   defects in the relative-script check: quoted `~` and a lower-cased project variable counted
   as anchored; a drive-relative program (`C:hook.cmd`); a relative program passed to the
   `log-hook-errors.sh` wrapper; a leading `NAME=value`; tab or newline separators. The cure is
   UNCOMMITTED in the `hook-program-positions` worktree (branch
   `fix/hook-script-program-positions` from 8dab8e86: a new `claude-hook-script-anchoring.ts` and
   its unit test, edits to the quoting module, its test and `validate-portability.ts`); the lane
   stopped while re-running gates. Its design: program positions (after leading assignments, and
   after the exec wrappers `env` and `log-hook-errors.sh`) must be anchored; an interpreter at a
   program position is followed directly by an anchored script; a shell control character is
   outside the shape; plain arguments are not checked. Verify the diff against that design and
   the seven mutants its brief named, commit, then post one signed comment on #105 (review
   `PRR_kwDORH1Wfc8AAAABN7QJxw`: the thread `PRRT_kwDORH1Wfc6jJ73j`, comment 4031787676, answered
   and resolved; four Below-bar lines for `claude-hook-quoting.ts` lines 164, 183, 185 and 180),
   merge #105, push the branch, open its pull request.
5. PR 111 `fix/reviewer-template-citations` (`SHA: 6adf66bb`): round two (the last) found three
   routing defects; all are cured in `SHA: 4458f26d` on `fix/expert-roster-and-personas` (the
   `expert-roster` worktree, not pushed), with `SHA: 682f4ce8` (the expert roster and persona
   lenses) on top. Lift on #111 (review `PRR_kwDORH1Wfc8AAAABN7Up5Q`: thread
   `PRRT_kwDORH1Wfc6jKGpw`, comment 4031855784; Below-bar lines for `assumptions-expert.md:397`
   and `onboarding-expert.md:90`), merge #111, push `fix/expert-roster-and-personas`, open its
   pull request. The same worktree is on `fix/site-relative-paths-in-rules` (cut at 682f4ce8) with
   18 UNCOMMITTED files (rule globs and site-relative paths in templates, partial): finish or
   restart that branch after branch one lands.
6. PR 112 `fix/shellcheck-gate-v2` (`SHA: 359d5fd5`): round two (the last, review
   `PRR_kwDORH1Wfc8AAAABN7dTlA`) found: thread `PRRT_kwDORH1Wfc6jKa9E` (comment 4031983405, a
   grammar slip in `ci.yml:68`); `repo-check-shellcheck-files.ts:31` misses `#!/usr/bin/env -S
   /bin/bash`; `repo-check-shellcheck.ts:48` reads 256 bytes while a macOS shebang may reach 512;
   `prompt-secrets.smoke.ts:165` requires jq although the hook treats jq as optional; the PR
   description still says `/usr/local/bin` (now the repository's `.tools/bin`). Verify, cure
   forward from 359d5fd5, correct the description, lift, merge.
7. PR 114 `fix/eslint-tooling-dead-config` (`SHA: 09d8db46`): approved in round two with two
   suppressed findings (review `PRR_kwDORH1Wfc8AAAABN7YIQw`): the README's copyable config omits
   the Node and ES globals every consumer adds (`tooling/eslint/README.md:123`), and
   `tooling/result/README.md:7` overstates what the type forces. The `eslint-tooling-dead-config`
   worktree is on `docs/eslint-readme-follow-ups` (cut at 09d8db46, no commits). Cure, lift,
   merge #114, open the follow-up.
8. PR 118 `fix/gate-output-noise` (`SHA: 48dc6e81`): round one found thread
   `PRRT_kwDORH1Wfc6jKWtj` (comment 4031956494): `repo-check-lint-changed.ts:125` replays a
   successful dry run's stderr warning without failing, so an empty plan with a warning still
   exits 0. Cure on the branch, push, answer, request round two.
9. `fix/lint-warnings-fail` (`SHA: 1bae5445`, not pushed, 7 behind main): `--max-warnings 0` on
   every lint and `lint:fix` script, and a quoted `lint:runtime-only` glob (sh has no globstar).
   Its message trips commitlint `footer-leading-blank` (body lines beginning `Checks:` and
   `review:`). Never amend: build `fix/lint-warnings-fail-v2` from its parent with
   `cherry-pick --no-commit` and a message without `word:` line starts, check
   `commitlint --strict`, push v2. Its root `package.json` line sits next to #112's `lint:shell`.
10. `fix/tools-lineage-paths` (the `tools-lineage-paths` worktree, from 9a8db1b6, nothing
    committed, 13 files UNCOMMITTED): the lane deleted the `ui-visual-design` evals (their grader
    imported a `demos/` directory that does not exist) and edited the `visual-comparison` skill
    and the design-conversion playbook, then stopped. Not yet done: `comms-provenance-check.ts:35`
    and `comms-archive-move.ts:50` scan `docs/architecture/architectural-decisions`, which does not
    exist (reported to exit 1 on every run; not yet run). Verify the partial work or restart.

Retire after merge: the worktrees `session-start-paths`, `reviewer-template-citations`,
`shellcheck-gate`, `gate-output-noise`, `site-vitest-conventions`,
`ignored-config-and-rebuild-recipe` (merged now), and delete merged remote branches by the bot's
REST call (`fix/ignored-config-and-rebuild-recipe` is still on origin). The strictness
drafts #94, #95 and #96 are unchanged. The `minimumReleaseAgeExclude` hold lifted at
2026-09-17T08:24Z: deleting that block in `pnpm-workspace.yaml` is now due, in its own pull request.

Owed, as fixes (each verified by a lane report unless marked; each its own pull request):
`.husky/commit-msg` runs commitlint without `--strict`, so message warnings pass; root gate scripts
calling `pnpm --filter @engraph/agent-tools` lack `--fail-if-no-match`; the commit-queue CLI topic
ignores `PRACTICE_COORDINATION_HOME` (`agent-tools-cli-topics.ts:52`); nine tests outside the site
have no class suffix (listed in #119); ADR-005 says knip configuration lives in `package.json`;
`tooling/eslint/src/configs/recommended.ts:218-224` says `warn` avoids blocking work, false once
lint fails on warnings; no workflow runs `pnpm audit`, and the dependency-currency skill reads only
GitHub's reviewed advisories (a Practice change); gitleaks pins differ (CI 8.30.1, cloud setup
8.30.0) and a `run-quality-gates` job named in `validate-check-ci-parity.ts` and
`cloud-environment-routing.md:52` does not exist; the site pins vite 7.3.5, the only reason vite
crosses to esbuild 0.28 (7.3.6 admits it); unverified, security-expert: @-mentioned files may
bypass the Read secrets scan. Lineage residue: about 55 ticket-ID lines in agent-tools outside the
validators; `MCP-000` in the delivery-plan template; lineage paths in
`operationalisation-contract.md:48`, `comms-cited-events.md:23`, PDR-079, PDR-125, the parallax
skill's `references.md:94-95`, the consolidate-docs skill (line 352), the safe-path README and
`documentation-propagation.md:11-12`; `/oak-under-the-hood` in the onboarding-expert template;
`oakRuleModules`, `oakRecommendedConfig` and lineage fixture paths in three eslint rule tests; the
markdown-links exclusion `.github/copilot-worktrees/**`; an unreachable `.d.ts` guard in
`workspace-topology.ts:25-27`; git's "Preparing worktree" line in the comms-watch smoke fixture.

Proposals from this wrap's concept exploration, for routing, not yet owner-ratified: (P1) most of
the night's defects share one generator, text the transplant copied without re-truing, on surfaces
no validator reads (templates, tooling source, rule globs, `.gitattributes`); extend cited-path,
cited-ADR and agent-name validation to every tracked text surface. Falsifier: run on today's
`main`, it finds instances no open pull request fixes. (P2) a second generator is the vacuous
gate: the lockfile rebuild test, lint warnings, non-strict commitlint, `pnpm --filter` without
`--fail-if-no-match`, a manifest field no tool read; a planted-violation smoke per `pnpm check`
leg would prove each gate fails. Falsifier: a leg that passes with its planted violation. (P3) cap
concurrent fix lanes at the throughput of serial pushes and two-round reviews (about three), and
finish before starting.

Improvements, not defects: the observer's other measurements could carry their failure reason
(a failed size read or listing is recorded as absent, which the record's TSDoc states);
`@typescript-eslint/no-import-type-side-effects` would guard type-only imports in source-run
hooks; a validator could fail any script that runs eslint without `--max-warnings 0`; the eslint
plugin's `configs.react` and `configs.next` have no consumer.

Decisions for the owner, each named: whether the prompt secrets hook blocks when Sonar itself
errors (today it lets the prompt through); `no-warning-toleration.md` still says a new rule may
begin at `warn`, which PDR-126 superseded; enable or delete `no-export-trivial-type-aliases`,
registered and enabled nowhere; `testing-strategy.md` still defines the system under test as the
lineage's MCP server and carries MCP-only E2E guidance (proposed wordings in #110's lane report:
system = the site over HTTP or an agent-tools CLI over stdio); doctrine contradicts itself on test
fakes (§Stubs vs Fakes allows call-count assertions, §Philosophy (e) forbids call inspection);
whether `principles.md:528` should say knip and gitleaks run in every workspace; whether to rename
`oak-commit-queue-v1` (a one-time refusal of commit intents in flight at the rebuild); which
identity lane commits use (`set-up-worktree-lane` expects the merge bot's, this repository commits
under the owner's); where a test helper shared by `agent-tools` and `jcdotnet` lives; whether
`repo-check profile`, which nothing consumes, stays.

Orchestration notes (the scripts lived in the session scratchpad and are gone with it): pushes
ran through a bash queue that checks port 3000 before each `git push` and stops at the first
failure; review watches ran as a bash script polling `pulls/<n>/reviews` for the Copilot login and
the head SHA prefix, proven on an already-landed review before arming (zsh does not word-split an
unquoted list). Lane briefs name a private `mktemp -d` for message files, a `git show --stat`
check per commit, no push, and no amend.

Holds, each with its lift condition: ESLint 10 for `jcdotnet` waits on `eslint-plugin-react`
supporting it (install prints `deprecated eslint@9.39.5` until then); an assumptions-expert
review of source-run hooks comes before the `PreCompact` gate is built.

The transplant closure is complete on `main` (2026-09-15): every item of
`.agent/plans/delivery/practice-completion.plan.md` §Transplant closure carries its Done line
and proof (item 4's rows closed by #85 `SHA: eed1f2e`, #87 `SHA: 6b5676b`, #86
`SHA: 47299c7`, re-dated in #90 `SHA: a47a559`; item 5's leak validator green since #79
`SHA: 014fc6e`; item 6's retirement in #91 `SHA: f8aab12`; item 7 in #89 `SHA: ffd37d1`; item
8 filed in #63 with the cards answered). The compiled record is
`.agent/reports/practice-transplant/README.md` §The record, compiled. Live now, in order:

1. The coordination branch carrying the arc's closing records is folded and lands through #97,
   the FIRST ACTION above. The owner's retrospective of the arc is recorded (the
   agentic-engineering report of 2026-09-15, with its corrections and the owner's decisions on
   the second pass). The Director's handoff
   `.agent/memory/operational/director-handoff.md` §Current handoff state is the resume
   contract. The owner's card on required status checks closed at the retrospective: `main`'s
   ruleset requires `install`, `static-checks`, `build-and-test`, `e2e`, `secret-scan` and
   `CodeQL` since 2026-09-16, and the settlement naming its own required checks is queued for
   an Implementer seat. The arc's metrics bin is built and pushed (`feat/arc-metrics` at
   `SHA: 6d60e05`, gate green, pull request owed); still queued, decided but not built, are the
   60% compaction-preparation trigger of the retrospective's proposal 10 and the push-time
   settlement-budget gate the owner adopted as proposal 7's fast lane.
2. Maintenance, prioritised by the owner (2026-09-16): remove the hand-authored JavaScript
   shims from the Claude Code hook surface. Node 24 runs TypeScript sources directly under the
   repository's `erasableSyntaxOnly` setting, and `agent-tools/tsconfig.json` carries
   `allowImportingTsExtensions` and `rewriteRelativeImportExtensions`, so a hook entry is a
   TypeScript file invoked as `node <source>.ts` with no shim — proven by the `PreCompact`
   observer. A build step remains for what the entry imports: a workspace package that exports
   only its built `dist` (the observer imports `@engraph/type-helpers`) must be built, or the
   hook exits before its own code runs. The three survivors are
   `.claude/hooks/practice-session-identity.mjs`, `.claude/hooks/plan-gate-drift-alert.mjs` and
   `.claude/hooks/run-pretooluse-guard.mjs`; each spawns a built artefact and the last also
   translates verdicts into a decision, so each gets its own first-hand fire and no-fire probe
   before its shim is deleted (the enforcement-surface discipline in
   `hook-policy-substring-discipline`). Routed to Zephyr guards Leeward (281e44) the same day.

   Second maintenance item at the same priority (2026-09-16): the Cricket seat naming. The
   quartet's generated adapter names encode effort alone (`-low`, `-medium`, `-high`, `-xhigh`), so
   nothing in those names says which model a seat runs (the fifth seat,
   `cricket-judgement-lowestpower-low`, added the same day, already names both), while the estate pairs model power INVERSELY with
   effort — low is fable, medium is opus, high is sonnet, xhigh is haiku. A caller who cannot read
   that from the name mis-launches the suite, as the Director did on 2026-09-16 by overriding
   every seat's model and inverting the design. Names should carry both dimensions. The change
   lives in `.agent/sub-agents/templates/cricket-judgement.md` and
   `.agent/sub-agents/templates/cricket-procedure.md` and then regenerates across the four
   platform adapter trees (`pnpm portability:fix`), so it is a rename with a blast radius rather
   than a one-line edit.
3. The `practice-two-way-exchange` node (ratified 2026-09-14) is the next Practice work and
   opens on the owner naming its window; the closure's routed findings (the exchange-window
   items on #84, #86, #89, #90 and #91; the hold's second lifting path; the boundary
   re-implementation finding of the Director's handoff item 108) are its register's first rows.
4. The graduation drain is curator work on its own cadence, in batches of six to eight
   entries (owner word 2026-09-14, the Director's handoff item 94); the napkins under
   `unconsolidated/` are archived only after that processing (no privacy review needed).
5. The `practice-language-separation` node (sketch; not urgent) awaits ratification on cards.
6. Editorial work follows the closure (the node's own words); nothing on the Practice side
   blocks it.
