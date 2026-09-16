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
- This branch folded after #93 (merge `SHA: 2961e9c`), every file both sides touched taking
  `main`'s version; it lands through #97, and the primary checkout now runs `main`'s observer
  (its smoke passes there). The primary's `.claude/logs` and both logs were made owner-only by
  hand the same evening.
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

FIRST ACTION: land #97 (this branch's fold) at full condition, then cut the fresh day-stamped
coordination branch from the merged tip (`coordination-branch-24h-lifetime` step 3). Then the
owed pull request on `feat/arc-metrics`.

Known defects get fixed, not queued (owner word 2026-09-16: "If you know there is broken code,
fix it"). These fixes are in flight, each on its own branch from `origin/main`, one pull request
each:

- `fix/hook-quoting-and-log-modes`: the Read and UserPromptSubmit secrets hooks left
  `${CLAUDE_PROJECT_DIR}` unquoted and did not run under a project path holding a space; a
  portability check now fails on any unquoted reference. The hook logs are owner-only from every
  writer, and the Read secrets guard scans paths holding a quote or backslash.
- `fix/export-ref-worktree-flake`: the visual-regression export read git's output on the child
  process's `exit` event, which on Linux can fire before stdout is read; it now resolves on
  `close`.
- `fix/depcruise-compiler-gate`: dependency-cruiser could pass having parsed nothing; with it,
  knip's redundant-entry hints, dead `no-restricted-imports` rules and the bootstrap docblock's
  stale statements.
- `fix/smol-toml-advisory-and-tsdoc-peer`: the `smol-toml` advisory GHSA-7w5x-hrqm-74c2 and the
  unmet `typescript` peer through `eslint-plugin-tsdoc`.

Owed after those, as fixes: the observer's other measurements carry their failure reason (a
failed transcript size or sibling listing is recorded as absent, a stdin error keeps only its
message); `@typescript-eslint/no-import-type-side-effects`, so an inline type import cannot
become a runtime import in a source-run hook (config-expert); a probe of whether the two
`SessionStart` hooks' relative paths resolve after a `cd` in the session; and
`set-up-worktree-lane`, which expects a bot committer while this repository commits as the owner.

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
