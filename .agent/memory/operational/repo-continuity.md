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

STATE, 2026-09-17T16:15Z (Cauldron herds Lustre, Director), written at the owner's wrap for
compaction.

OWNER HOLDS, binding until the owner lifts them:

- **No new subagent lanes.** Owner word 2026-09-17, about 16:00Z: "don't start any more until I say
  otherwise, the exception is expert reviewers". The resume starts none: it lands and closes what
  exists.
- **Open pull requests go to zero** through normal procedures (owner word, same afternoon), under
  the plan `.agent/plans/delivery/estate-fix-backlog.plan.md`. The plan is a sketch awaiting the
  owner's ratification. Close-out is already authorised by that word and by `pr-lifecycle`'s
  standing zero-open objective. Its §Mechanism item 2 is the change that ends the loop: a true
  low-value finding from a last review round becomes a row in the plan's §Review dispositions and a
  resolved thread, never a new pull request. Only a correctness defect in the pull request's own
  claim is cured forward.

FIRST ACTION on resume, in order:

1. Read the plan's §Close-out.
2. Read the assumptions-expert review of the plan, if it reported before the stop (the result
   is summarised below when it did). Apply its fixes to the sketch.
3. Present the sketch for ratification as one card.

Merged 2026-09-17 after the resume:

- #119 (`SHA: 79da5c9`)
- #111 (`SHA: ed7e074`)
- #116 (`SHA: a2cf91b`)
- #114 (`SHA: 8915de0`)
- #117 (`SHA: 504109b`)
- #121 (`SHA: 6f94f6d`)
- #112 (`SHA: 8fafbf2`)
- #105 (`SHA: ad5d7a6`)
- #123 (`SHA: f86136d`, #105's closed hook grammar)
- #122 (`SHA: 83e6cb8`, #112's cures and the closed shebang set)
- #120 (`SHA: 4e9cd80`)
- #118 (`SHA: 92b596d`, after the owner's one bounded extra review of its CI cure)
- #124 (`SHA: 68e68e9`)

PR #125 was closed with its reason (its finding is a plan ledger row). The merged branches are deleted
on origin.

Open, in order:

1. PR #126 `fix/lint-warnings-fail-v2` (worktree `lint-warnings-fail`): pushed as `SHA: 0aad8e48`, a
   merge of main over `SHA: d89306bb`. Check `gh pr list`: if its pull request is missing, the
   push did not finish, so push and open it (the description states the red evidence on main,
   the mutant and the invocation table). Old `fix/lint-warnings-fail` (`SHA: 1bae5445`) is
   superseded.
2. `fix/architecture-reviewer-pairing` (worktree `reviewer-template-citations`,
   `SHA: 21668df0`, NOT pushed): #120's last-round cure. Push, open, review, land.
3. `fix/mention-secrets-scan` (worktree `override-floors`, 5 files UNCOMMITTED, 24 behind main).
   The bypass is real: on Claude Code 2.1.274 an @-mentioned file reaches the model with no
   PreToolUse call, and the prompt hook sees only the prompt text. The cure widens the prompt hook
   to scan mentioned files. Next steps are the plan's close-out item 5. The lane was stopped at the
   owner's wrap; its security-expert review was stopped with it.
4. Drafts #94, #95, #96 (strictness), then the coordination branch fold. This branch's stamp is
   2026-09-16, so the fold was already due at this session's open (missed at open).

Uncommitted partial work, conserved in place (never discarded):

- `expert-roster` worktree (`fix/site-relative-paths-in-rules`, 18 files): input to plan slice 15.
- `tools-lineage-paths` worktree (13 files): input to slice 9.

Local superseded branches, deletable once confirmed:

- `fix/shellcheck-classifier-names` (`SHA: 1594972a`, replaced by the closed set in #122);
- `fix/shellcheck-gate-followups` (`SHA: 99eff2a3`, a commitlint-failing message, replaced by v2).

The remote `fix/shebang-refusal-remedy` stays as slice 7's input.

Owner actions pending:

- Re-paste the cloud environment setup script from main (its first line is now
  `#!/usr/bin/env bash`).
- Start one cloud session and report `bash --version` and `command -v bash`. This is the plan's
  owner gate for the bash 5.2 floor.

The owner was told at about 15:50Z.

Worktrees to retire after their branches land: `gate-output-noise` (#118 merged),
`eslint-tooling-dead-config` (#124 merged), `lineage-oak-identifiers` (#117 and #121 merged),
`shellcheck-gate` (once slice 7 takes its branch).

Orchestration recipe (nothing survives compaction):

- **Push queue:** scratchpad `push-queue.sh <logdir> <worktree>=<branch>…`. It checks port 3000,
  runs `git push -u`, and stops at the first failure.
- **Review watch:** `review-watch.sh <repo> <pr>:<head-prefix>…`, run under bash. In zsh, write
  `"${n}:<sha>"`, never `"$n:<sha>"`: zsh reads `:a` after a variable as a path modifier. This
  broke one watch today.
- **Merged-branch deletion:** `delete-merged.sh <repo> <branch>…`. It mints the bot token, confirms
  a merged pull request, deletes over REST, and reads back that the branch is absent.
- **Signed lines:** the grammar in `agent-tools/src/pr-watch/disposition-lines.ts`. A lift needs
  `Cured in SHA:<sha>` or `Rejected`.

The scratchpad scripts are ephemeral; this recipe rebuilds them.

Owed, as fixes (each verified by a lane report unless marked; each its own pull request):
the three PreToolUse guard commands use `${CLAUDE_PROJECT_DIR:-.}`, which runs a
working-directory guard when the variable is unset (remove the fallback, security-expert review;
falsifier: evidence the variable is always set for hooks); root `knip.config.ts` prints four
"Remove redundant entry pattern" hints on every run; the merge bot's disposition grammar lifts
only `Cured in SHA:` or `Rejected`, so a finding cured in a pull request description has no true
verb (#112 item 2 was written as a rejected code change with the description corrected);
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

Owner answers by user cards, 2026-09-17 15:20Z to 15:35Z (each is now work, routed as its own pull
request after the in-flight list, lanes capped at about three):

- The prompt secrets hook, when Sonar itself errors: let the prompt through, but warn visibly that
  it was not scanned (today it passes silently).
- Remove the `${CLAUDE_PROJECT_DIR:-.}` fallback from the three PreToolUse guard commands, with a
  security-expert review.
- Verify next whether files @-mentioned in a prompt bypass the Read secrets scan (plant a fake
  secret; fix if real).
- Bash scripts require bash 5.2 or later: a guard at the top of each bash script that fails with
  install advice, fail-closed in the security hooks (a block decision, never a bare non-zero exit),
  enforced by the shellcheck gate, the floor defined once and listed as a prerequisite. Lands after
  #122 and after the cloud image's bash is measured. Scripts use `#!/usr/bin/env bash` (moved in
  #122's round-one cure).
- Husky hooks stay strict POSIX, checked by `shellcheck --shell=sh`; Husky runs them with `sh`.
- Disable Turbo telemetry for the repository, CI and cloud sessions.
- Add a CI job running `pnpm audit`, and widen the dependency-currency skill to read repository
  advisories for pinned floors.
- Enable `no-export-trivial-type-aliases` at error, violations measured and fixed in the same
  pull request.
- `no-warning-toleration.md`: remove the start-at-warn allowance and cite PDR-126.
- `testing-strategy.md`: the system under test is the site over HTTP or an agent-tools CLI over
  stdio; drop the MCP-only E2E guidance.
- Test fakes: tests assert outcomes; no call inspection (resolve `testing-strategy` §Stubs vs
  Fakes against §Philosophy (e) that way).
- `use-result-pattern.md:11`: "Errors are part of the type signature, and the compiler rejects a
  read of value or error until ok is checked; handling the failure is the caller's job." (rides
  `docs/eslint-readme-follow-ups`).
- Fix pull requests may correct factual errors in rule and doctrine text; a change to what a rule
  requires or allows comes to the owner as a card first.
- The disposition grammar gains the verb "Cured in description", in the parser
  (`disposition-lines.ts`) and the pr-lifecycle skill together.
- Ratified: (P1) extend cited-path, cited-ADR and agent-name validation to every tracked text
  surface; (P2) a planted-violation smoke per `pnpm check` leg; (P3) cap concurrent fix lanes at
  about three and finish before starting.
- `principles.md:528`: say knip and gitleaks run repo-wide, verified against the root scripts.
- Rename `oak-commit-queue-v1` when no intent is queued.
- Lane commits stay under the owner's identity; correct `set-up-worktree-lane` to say so.
- The test helper shared by agent-tools and the site moves to a private `tooling/` package.
- Delete `repo-check profile`.
- The owner re-pastes `cloud-environment-setup.sh` and starts one cloud session to measure bash
  once #122 merges; tell the owner when.
- The strictness drafts (#94 to #96) resume after the fix inventory.
- Loosen the site's exact vite 7.3.5 pin to `^7.3.6`, with a cold resolution and the site suite.

Improvements, not defects: the observer's other measurements could carry their failure reason
(a failed size read or listing is recorded as absent, which the record's TSDoc states);
`@typescript-eslint/no-import-type-side-effects` would guard type-only imports in source-run
hooks; a validator could fail any script that runs eslint without `--max-warnings 0`; the eslint
plugin's `configs.react` and `configs.next` have no consumer.

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
