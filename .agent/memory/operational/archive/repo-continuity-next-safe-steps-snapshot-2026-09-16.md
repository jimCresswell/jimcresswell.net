# Repo continuity, the next-safe-steps snapshot of 2026-09-16 with its later state notes

Moved byte-identical from `.agent/memory/operational/repo-continuity.md` §Next Safe Steps on 2026-09-30 by the
two-estate consolidation (Hawthorn binds Bracken, b3f117). The live section names the items still open,
each verified in the tree that day; the recipes recorded here are doctrine in the pull-request lifecycle skill,
the merge-bot reference, `verify-dont-trust` and `bot-identity-on-third-party-systems`.

STATE, 2026-09-30T14:3xZ (Galaxy binds Gravity, session close): the next safe step for the
estate is step 1 of `threads/two-estate-consolidation.next-session.md` (the two-estate
inventory, counts first). Every worktree lane now lives at `.claude/worktrees/<lane>`
(`worktree-hygiene` clause 0). The list below is the earlier state, kept for its unfinished
items.

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

STATE, 2026-09-17T19:42Z (Cauldron herds Lustre, Director), written at the close-out's end.

The open pull request count is zero (owner word 2026-09-17: "bring the number of open PRs down
to zero via normal procedures"; restated on resume, "land all PRs slowly and carefully, go
slowly, thoughtfully, do not use subagents"; the reminder at 20:20Z, "the goal is complete as
soon as the number of open PRs hits zero"). Landed 2026-09-17 evening, in order: #126
(`SHA: 6254f0cc`), #127 (`SHA: 4ecbc451`), #94 (`SHA: 20d0c8d9`), #95 (`SHA: d7f37d8a`),
PR #96 (`SHA: cff790fa`), #128 (`SHA: 867e9e0c`), #129 (`SHA: 931f4072`), then the fold of
this coordination branch. The plan `.agent/plans/delivery/archive/estate-fix-backlog.plan.md` records
each landing in §Close-out, every routed review finding in §Review dispositions, and the seat's
reviews in §Review record.

OWNER HOLDS, binding until the owner lifts them:

- **No subagents** (owner word 2026-09-17, evening: "do not use subagents"). Every review is the
  seat's own, under the template it would have invoked, stated in the pull request.

CLOSED, 2026-09-19 (Cauldron herds Lustre, Director). The owner's closing pull request, PR 131,
merged at `SHA: c68f831c` after two review rounds: round one settled in one push
(`SHA: 1f30331b`), round two answered with one signed rejection. Open pull requests after it:
zero, read from `gh pr list`. It carries the bash 5.2 floor held in the shellcheck gate, the hook
wrapper handing over on an older bash so the secrets hooks still block, node's exit status read in
the prompt hook, no `:-` default in the guard commands, and the approved text corrections. Its
branch and worktree are gone.

The plan `estate-fix-backlog` is complete and archived under `.agent/plans/delivery/archive/`:
slices 1, 7, 13 and 14 landed in PR 131, slice 6 was dropped by the owner, and the rest were
closed as not worth their time. Nothing is carried forward. No work is owed. The next session
starts from the owner's ask, not from a list. The worktree inputs named below serve no scheduled
work.

The backlog and every routed review finding live in the plan. The owner's twenty-three card
answers of 2026-09-17 are recorded verbatim in this file at `SHA: 3372b944`, removed from the
live text when the plan absorbed them as slices, each marked owner-approved; they are not
restated here.

Owner word, 2026-09-19: "I am not going to paste the cloud setup script, stop asking." The cloud
bash measurement will not happen and is never asked for again; the plan's bash-floor slice has no
path as written. The same message: "I am not interested in finishing things just because they are
on a list." The ratified backlog is permission, not obligation: a slice is picked up for what it
changes for a reader of the site, for the owner's secrets or for the next agent's behaviour, never
to shorten the list. The seat's review of the backlog under that word was given to the owner in
chat on 2026-09-19; the owner's choice among its proposals is the next input.

Uncommitted partial work, conserved in place (never discarded): `expert-roster` worktree
(`fix/site-relative-paths-in-rules`, 18 files, input to slice 15); `tools-lineage-paths` worktree
(13 files, input to slice 9). Local branches with no pull request: `fix/shellcheck-classifier-names`
(`SHA: 1594972a`) and `fix/shellcheck-gate-followups` (`SHA: 99eff2a3`), both superseded
by #122 and #126 and deletable on the owner's word; `fix/lint-warnings-fail` (`SHA: 1bae5445`),
superseded by #126, likewise. The remote `fix/shebang-refusal-remedy` (`SHA: 9d2dd5b8`) is
slice 7's input. Worktrees still present and retirable: `gate-output-noise`,
`eslint-tooling-dead-config`, `lineage-oak-identifiers`, `shellcheck-gate`, `override-floors`
(on `fix/mention-parse-node`, merged).

Orchestration recipe (the scratchpad scripts are gone with the session):

- **Push and review chain**, under the owner's word for the work (a push is part of the
  pull-request lifecycle the owner directs, never the recipe's own authority; `AGENT.md`'s
  rule stands): commit by pathspec, check port 3000 free, `git push` (the pre-push
  gate takes about ten minutes), open with `gh pr create --body-file`, request Copilot with a JSON
  body under the owner's CLI credential, watch by polling the reviews list for a Copilot review on
  the pushed head. When a settlement changes no commit (a description cure), key the watch on the
  review id exceeding the last round's, since the head does not move.
- **Merge:** `pnpm --silent agent-tools merge-bot merge --pr N --expect copilot-pull-request-reviewer`;
  retry after about twenty seconds on "mergeability not yet computed"; confirm with
  `gh pr view N --json state,mergeCommit`.
- **Merged-branch deletion:** REST DELETE as the bot after confirming the merged pull request;
  read back the ref absent. Then `git worktree remove` and `git branch -d`.
- **Signed lines:** the grammar in `agent-tools/src/pr-watch/disposition-lines.ts`; a lift needs
  `Cured in SHA:` or `Rejected`. A last-round finding that earns no diff is rejected with evidence
  and takes a row in the plan's §Review dispositions.
- **Reading another branch's claims:** read the files at the branch's base
  (`git show origin/main:<path>`), never in the primary checkout, which sits on the coordination
  branch behind main.

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
   nothing in those names says which model a seat runs, while the estate pairs model power
   INVERSELY with effort — low is fable, medium is opus, high is sonnet, xhigh is haiku. A caller
   who cannot read
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
