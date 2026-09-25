# Batch six triage: the twelve compare rows and J18's compare half (2026-09-25)

An input for drafting batch six, the last undrafted outbound rows of goal one (the retrospective
`../agentic-engineering/2026-09-25-why-goal-one-read-zero-while-the-lineage-landed.md` counts 12
rows never drafted). Two read-only research agents dispatched by Siren herds Rudder (158275)
triaged the rows in two halves, each reading both estates first-hand at four revisions (below).
The seat spot-checked two claims before this record was written at 12:43Z: J1's frontmatter count
(0 of 130 lineage rules, 131 of 131 here, recomputed) and J19's parity (this estate's patterns
carry "Imported from the lineage at pin `e477e62f7`"). Every note is re-read first-hand when it
is drafted; this triage sizes and orders the work, it does not replace that read.

**Totals.** About 25 notes (12 from half A, 13 from half B), about 330 lines. J19 closes with one
line and a 3-line cure, J23 with one line, and J18's session-continuation prompt with one line
(LOCAL).

**One question the triage raised, answered from the record.** Half B asks whether the two gate
doctrines converge: the lineage's "the commit is the gate; never run gates by hand" against this
estate's bounded runs and gate slot. This estate's ratified node `commit-as-the-full-local-gate`
(gate plan PRs B to F, owner card of 2026-09-24) already moves toward the lineage's doctrine, so
the J17 gate note states that direction instead of asking.

**Next.** Drafting goes to a fresh session or a fleet, one note per member marked BRING or
COMPARE, delivered as batch six into the lineage's Box through the join ceremony.

## B6 triage A: rows J1, J6, J7, J8, J15, J16

Read-only triage, 2026-09-25 13:40 BST. Donor JC.net at `origin/main` (cf689735); receiver the
lineage at `origin/engraph` (1a4450a69). The three-way base is JC.net's transplant merge
`55649a20e6` and the lineage pin `e477e62f7e`. Path membership comes from
`inputs/exchange-delta-jcnet-since-transplant.tsv`, mapped by the register's own glob dialect,
catch-all and excepting rules. The per-row counts match `exchange-coverage-counts.tsv`: J1 357,
J6 27, J7 18, J8 74, J15 118, J16 2.

Method. For every path, the blob ids at the four revisions (JC.net base and tip, lineage pin
and tip). Where the tips differ, a three-way line count: lines JC.net added since its transplant
that the lineage tip lacks (`jcU`), lines the lineage added since its pin that the JC.net tip lacks
(`lnU`), and lines JC.net removed that the lineage still holds (`jcR`). Markdown frontmatter is
stripped where noted. A file with 0/0/0 has no movement unique to either side in the window. Any
remaining byte difference is a transplant-time adaptation.

State key: PARITY, BRING, COMPARE, LOCAL, UNCLEAR. "Rides X" means the member's note is the note
for concept X, so it needs no note of its own.

## J1: rule and sub-agent declarations, generators, adapters (357 paths)

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| Rule declarations and generator: `agent-tools/src/rule-declarations/**` (27 A), the frontmatter on 116 rules, the rendered `.claude/rules`, `.cursor/rules` and `.agents/rules`, and `RULES_INDEX.md` | BRING | The generator directory is absent at `origin/engraph`. Rules carrying frontmatter: lineage 0 of 130, JC.net 131 of 131. The lineage checks its hand-kept index with `validators/portability/rules-index-checks.ts`. | N1: 35, shared with the next member |
| Sub-agent declarations and generator: `agent-tools/src/subagent-declarations/**` (21 A), declarations on 21 templates, the rendered `.claude/.cursor/.codex/agents`, the Codex registry in `.codex/config.toml` and 15 new `.gemini/agents/*`. Also the declared-adapter parity in `core/health-probe-parity.ts` (J7 paths), the deletion of `reviewer-adapter-platform-contract.ts` and `tests/health-probe.unit.test.ts` (J15 path) | BRING | Lineage templates open on `## Delegation Triggers` with no frontmatter. The lineage's inline-prompt roles copy their System prompt block by hand ("Edit this block first, then copy it into `.claude/agents/corpus-mapper.md`; `pnpm subagents:check` compares the two"). JC.net renders that block through `system-prompt-block.ts`. The lineage's `.gemini` holds 20 hand-kept `commands/review-*.toml` and no agents (L18 graduates into J1). | in N1 |
| Rule bodies, 92 files | PARITY | 0/0/0 after stripping frontmatter. For example, `verify-dont-trust` moved 152 lines here and 151 there with the same text. | 0 |
| `lockfile-rebuild-survivability.md` | BRING | jcU 63, lnU 0. The lineage is unchanged since the pin. JC.net adds "Resolve the declarations cold, in an empty directory, never in a checkout with `node_modules`…", measured on pnpm 12.4.2. | N2: 8 |
| `no-global-state-in-tests.md` | COMPARE | jcU 8, lnU 3. JC.net: the composition root may include "global setup", plus a pointer to testing-patterns. Lineage: "(its composition root is the one exception, below)". | N3: 4 |
| `test-immediate-fails.md`, `no-warning-toleration.md` | COMPARE | jcU/lnU 38/14 and 6/12. Already in L11's seven-rule compare list. | rides L11 |
| `check-singleton-per-window.md`, `register-active-areas-at-session-open.md` | PARITY outbound | JC.net's unique lines only rewrap the same text. The lineage adds the gate-beside-a-commit clause and the open-PR claim clause, both inbound under L11. | 0 |
| 11 rules with 1 to 4 unique lines (the invoke-assumptions, code, doc-and-onboarding and react invokes, never-disable-checks, no-conditional-tests, no-moving-targets, pr-comments, strict-validation, use-result, use-agent-comms-log) | LOCAL | Roster and path references: the architecture personas, `jcdotnet/`, `docs/architecture/decision-records/`. use-agent-comms-log's 4-line pointer to `channel-by-audience-lifetime-and-consumer` rides J9. | 0 |
| 7 JC.net-only invoke rules (architecture, config, docs-adr, security, subagent-architect, test, type) | LOCAL | Absent in the lineage at both the pin and the tip. Added in the transplant commit 6156fc46. The lineage routes these reviewers through `invoke-code-experts.md` and its executive catalogue. | 0 |
| Template bodies (21) | LOCAL | The triage tables name each estate's roster: JC.net's personas; the lineage's clerk, mcp, sentry and elasticsearch experts. The portable gains are already in the lineage: b13ddbff1 (2026-09-24), "four reviewer templates take the exchange's gains". The onboarding reconcile clause is already present there (lineage template lines 58 to 61). | 0 |
| Persona components deleted (barney, betty, fred, wilma) | LOCAL | J12's site-specific personas. | 0 |
| Cricket fan-out adapters (Claude and Codex: judgement high, low, medium; procedure xhigh) | PARITY | Identical blobs on both sides. | 0 |
| Skill adapters `.agents/skills/jc-*`, `.claude/skills/jc-*` (10 M) | LOCAL | Generated from canonical descriptions under this estate's prefix. The canonical changes ride their own rows. | 0 |
| Secrets hooks `.claude/hooks/secrets/{pretool,prompt}-secrets.sh` | BRING | JC.net 34→64 and 40→158 lines. The lineage copies (`sonar-secrets/build-scripts/`) are unchanged since the pin and matched JC.net's base byte for byte. The rewrite adds the jq payload read, the @-mention scan using Claude Code's own patterns, and the bash floor. The directory rename is LOCAL. | N4: 12 |
| Owner-only hook logs: `_lib/append-owner-only-log.mjs` (A), wrapper tightening in `log-hook-errors.sh`, callers in `practice-session-identity.mjs` and `run-pretooluse-guard.mjs` | COMPARE | The lineage built its own owner-only writer in TypeScript for the observer: `core/owner-only-append.ts`, `-fs.ts` and tests, added since the pin. | N5: 10 |
| `plan-gate-drift-alert.mjs`: answer, then let the process end | BRING | jcU 33, lnU 0: "The exit code is set, never forced with `process.exit`…". | in N5 |
| `.claude/settings.json` | COMPARE | JC.net quotes every `${CLAUDE_PROJECT_DIR}` path. The lineage quotes the wrapper entries (2866b274d, 2026-09-25). The PreCompact entry runs from TypeScript source here and from `dist` there, which rides J18. | in N5 |

## J6: smoke runner and derived postinstall closure (27 paths)

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| Discovered smoke runner: `src/smoke/smoke-suite.ts` (+ test), `src/bin/run-smoke-tests.ts`, `smoke-tests/run-smoke-tests-cli.smoke.ts`, and `test:e2e` → `node dist/src/bin/run-smoke-tests.js` | BRING | Lineage `test:e2e` is a hand chain of 19 `pnpm -s smoke:*`/validator steps. Its `smoke:collaboration-tui` stays outside the chain on purpose: its README says the startup smoke "is intentionally separate". The runner depends on `repo-check/repo-check-runtime.js` (J3). | N6: 18 |
| Smoke hardening: collaboration-tui seeds its own coordination home; commit-queue-worktree runs the built CLI with pinned streams; install-version-guard reads the guard's own log; esm-import-extensions accepts `.ts`. Plus the fixtures | BRING | jcU 34, 99+41, 33 and 10, all with lnU 0; the lineage is unchanged since the pin. The collaboration-tui fix is what lets the runner include that smoke. The `jc-` temp-name prefixes are LOCAL. | in N6 |
| `agent-tools/package.json` | COMPARE, split by entry | `lint`/`lint:fix` gain `--max-warnings 0`, which is absent from every lineage manifest: BRING, in N6. The `test:e2e` line goes in N6. `pnpm -s`→`--silent` is LOCAL. Scripts added for other rows (rule-frontmatter-sweep, lineage-names, exchange-register, gate-slot, arc-metrics, corpus) ride those rows. The retired scripts are LOCAL. Dependency bumps and the TypeScript 7 alias are LOCAL. | in N6 |
| Derived install-time closure (`bootstrap/install-time-closure*.ts`) | BRING | The lineage `bootstrap.ts` is unchanged since the pin and keeps a hand-written `const WORKSPACE_DEPS: readonly WorkspaceDep[] = [`. JC.net's derivation was already present at 55649a20e6, so it is not in the delta list, but it is this row's concept. | N7: 8 |
| `bootstrap.ts` changes in the window (resolving bins through the manifest, `@typescript/native`) | LOCAL until the lineage adopts TypeScript 7 | The lineage is on `typescript ^6.0.3`. JC.net pairs `@typescript/typescript6` with `@typescript/native` 7.0.2. | 0 |
| `claude-hook-command-fixture.ts` (A) and `hook-error-logs*.smoke.ts` | COMPARE | Both estates built a fixture that runs the registered hook command the way the harness does, independently. The lineage has `registered-hook-command-fixture.ts` and `hook-wrapper-quoting.smoke.ts` (2026-09-25; throwaway project, symlinked node, trusted shell path). JC.net substitutes an environment variable and passes the repo root as data. | N8: 8 |
| New smokes for other rows' concepts: secrets hooks (4 files), plan-gate-drift-alert, pre-compact-observe-hook, repo-check-cli, validate-no-lineage-names-cli, build-run-artefact-cli, corpus-drivers-tree-bound-root, post-run-drivers-invalid-flags | rides N4, N5, J18, J3, J2, N11 | All absent in the lineage. | 0 |

## J7: hook-policy path scoping and the unreadable-file describer (18 paths)

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| Root-anchored `./` scopes: `hook-policy/path-scope.ts` + test (A); wiring in `matchers.ts`, `evaluate.ts` (+ test), `policy-loader.ts` (exports `REPO_ROOT`); `claude-adapter.ts` (+ integration test) resolves a payload path against the payload's `cwd` and fails closed | BRING | The lineage's hook-policy is unchanged since the pin. Its `matchers.ts` still has the substring-or-`**/*`-suffix `matchesPathScope`, which JC.net removed. | N9: 15 |
| The argv matcher and its follow-ups (named in the register cell) | PARITY | 27 of 41 JC.net hook-policy files, all the `argv-*` and `argument-matcher*` files among them, are byte-identical to the lineage tip. The lineage made no hook-policy follow-ups after the pin, so there is nothing to compare. | 0 |
| `describeUnreadable` in `core/tracked-file-scan.ts` (+ test) | BRING | Lineage validators print ``(${String(scan.error.cause)})`` (in `validate-no-machine-local-paths.ts` and `validate-identity-naming.ts`), which carries the absolute path. Inbound pointer: the lineage's `core/error-code.ts` `errorCodeOf` lets only code-shaped identifiers cross, which is stricter than JC.net's "code or `cause.name`". | N10: 6 |
| `tracked-file-scan.ts`: lineage-side change | not owed | The lineage moved `listTrackedFiles` to `repository-paths.ts` (f54facbd7). That is lineage-origin and belongs to an L row. | 0 |
| `.agent/hooks/policy.json` | COMPARE, split by entry | The `./.agent/hooks/policy.json` anchor goes in N9. The `lineage-name` block is LOCAL; its concept is J2. The collapsed-array formatting is LOCAL. Both sides rewrote the `claude_code.notes` observer sentence differently, which rides J18. | in N9 |
| `.agent/hooks/README.md` | COMPARE, split by paragraph | Path-scope forms → N9. The @-mention paragraph → N4. The owner-only log writers → N5. The observer paragraphs → J18: the lineage documents running from `dist`, its own log subdirectory and "Departures from the concept note"; JC.net documents running from source. The lineage's "Quoted wrapper paths" section is inbound. | in N4, N5 and N9 |
| `health-probe-parity.ts`, `health-probe-shared.ts`, and the deletion of `reviewer-adapter-platform-contract*.ts` | rides N1 | Parity is computed against `readDeclaredAdapters`. | 0 |
| `health-probe-hook-state.ts` (`oak-consolidate-docs` → "the consolidate-docs skill") | rides J13 | Tooling text that named one estate's prefix. | 0 |
| `iso-date-time.ts` comment | LOCAL | Follows the retirement of pr-throughput. | 0 |

## J8: corpus-analysis and workflow-build (74 paths)

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| The restore itself: 54 files | PARITY (the adaptation is LOCAL) | The lineage is unchanged since the pin for all 73 shared files. After normalising the lineage's package scope to `@engraph/` and removing the "Restored from the lineage at pin `e477e62f7`" header, 54 files are identical. The rest of the adaptation: ADR-078 and MCP-app references dropped. | 0 |
| Post-run hardening: `claimed-home-existence.ts` (+ test) takes a regular file under the two named roots, with containment checked against the matched root; `banked-verdicts.ts`, where held-for-review is incomplete; `post-run-analysis.ts` (+ test), which fails on `mapComplete: false`; `recall-named-kills.ts` + new test (lineage-absent), a whole-token id matcher | BRING | Normalised residue of 44+71, 12, 29+29 and 33 lines. Commit 1e2efef4. | N11: 30 |
| Input hardening: `stage-io.ts` accepts only repo-relative partition files; `run-inputs.ts` refuses an empty reduce as a no-findings run; `harness-emitter.ts` adds `class` to the meta binding | BRING | 17, 7 and 2 lines: `(?:var\|let\|const\|function\|class)`. | in N11 |
| Tree-bound drivers and concise flag errors: `post-run-driver.ts`, `salvage-driver.ts`, `build-run-artefact.ts` (the smokes are J6 paths) | BRING | 60, 45 and 39 lines. Commit 9eeb31ae: "a Claude session pointed at another checkout would anchor every checkpoint read … at the wrong repository". | in N11 |
| Lineage-logic findings from PR #86, recorded in JC.net's signed Rejected lines "to the exchange window" | BRING (findings, no code) | The map leaf window label; the recall rule for killed or held candidates; validate-set completeness at close; the salvage tripwire; the harness setTimeout jitter; the parallel null slot; the emitter's `async function`/generator forms; meta's missing empty-candidates guard. Sources: the commit messages of 1e2efef4 and 9eeb31ae. | in N11 |

## J15: catch-all (118 paths)

Sampling. All 118 paths were classified mechanically: blob ids at the four revisions, plus
jcU, lnU and jcR for the 87 files that differ. The 22 deletions and the 9 lineage-absent paths
were enumerated in full. The unique lines of 37 files were read, drawn from every stratum: every
file both sides moved, every file with 9 or more unique lines not owned by another row, and 12 of
the 44 files with 1 to 3 unique lines.

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| Name scrubs (about 55 files, mostly tests): `oak-wt-eef`→`jc-wt-eef`, `OakText`→`Text`, `$oak-`→`$jc-`, `oak-commit`→`jc-commit`, `OAK_*`→`PRACTICE_*` (`cursor/session-identity-hook.ts`, lineage `oak-session-identity-hook.ts`) | LOCAL | jcU equals jcR, one for one, with lnU 0. The portable part (estate-neutral env names) rides J13. | 0 |
| Retired instruments: pr-throughput (7), ci-turbo-report (7), protocol-conformance (8), plus knock-ons (the `coordination-home.ts` exports made private, the `eslint.config.ts` ignore, README lines) | LOCAL | Commit d27790fe: "the plan of record's four instruments that carried no consumer in this estate go, re-importable from the lineage pin". | 0 |
| 6 JC.net reviewer-domain skills (architecture, config, docs-adr, react-component, security, subagent-architecture) and `.agent/skills/pkg` | LOCAL | Absent at both the pin and the tip. Next.js-flavoured, and paired with the per-reviewer invoke rules. pkg is J12's concept, but J12's globs miss `.agent/skills/pkg/**` (a register glob gap). | 0 |
| Bash 5.2 floor in `.agent/setup/*.sh` and `cloud-environment-*.sh` | rides J3 | "The bash floor: the shellcheck gate holds it once and requires this guard first." | 0 |
| `agent-tools/tsconfig.json` rewriting `.ts` extensions | rides J18 | Added for the source-run PreCompact observer. | 0 |
| `tests/health-probe.unit.test.ts` | rides N1 | Declared-adapter parity cells. | 0 |
| `check-blocked-content.unit.test.ts` | rides N9 | Imports `isPathInScope` from `path-scope.js`. | 0 |
| gates skill and `arc-rapid-communication.md` lines | ride J3, J6, J2 and J9 | Shellcheck, the discovered smoke suite, the validator list, native messaging via channel-by-audience. | 0 |
| pr-lifecycle skill, `testing-strategy.md`, cross-fork-integration skill, skills-adapter-generate bin and tests | covered by L6/L9, L10, L13, L15/J13 | Both sides moved: jcU/lnU 117/363, 108/64, 6/65, 7/39. | 0 |
| commit skill | LOCAL outbound | JC.net commits under the shared owner identity with no `--author`; the lineage uses a bot committer. That is the estate identity contract (J14). The lineage's 36 commitlint-verdict lines are inbound (L15). | 0 |
| start-right-team, cricket, reason, inter-practice-collaboration | PARITY outbound | The same 120 s state line on both sides. The lineage's cricket skill already cites this estate's labelling, "came here through the Practice Box exchange of 2026-09-24". JC.net's additions are channel-rule pointers (J9). The lineage's additions are inbound. | 0 |
| `sif` skill | LOCAL | Re-routed to the instruments this estate carries (codex-exec); `the-codex-dialogues` and `codex-helper` removed. | 0 |
| `provenance.yml` | LOCAL | Records. | 0 |
| Small portable riders: curator-pass ("remove them … the commit that routed the substance and the substance's permanent home are the record", replacing the lineage's "migrate those out … to the archive"); `role-architectural-typescript-champion.md` (the copied tsconfig block replaced by "Strictness is defined once, in `tsconfig.base.json`"); `commit-queue/core.ts` fingerprint-tag remark | BRING | jcU 4, 17 and 5; lnU 0; the lineage is unchanged since the pin. | N12: 8 |
| Strictness-driven code edits: `item-count.ts`, `markdown.ts` (safe destructuring), `comms-migration-records.ts` (`writeWarning`), `plan-state/status-mapping/v1.ts` comment | rides J21/L20 | 3 to 25 unique lines. | 0 |

## J16: root platform entrypoints (2 paths)

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| `CLAUDE.md` | BRING at J1's landing | The lineage's is 3 lines ("Read AGENT.md"), last changed 2026-04-28. JC.net's adapter-model section, including "renders every sub-agent adapter surface … from the templates' declarations", only becomes true in the lineage once J1's generators land. | rides N1 |
| `GEMINI.md` | BRING at J1's landing, after a local cure | The lineage's is 3 lines, unchanged. JC.net's copy is stale: last changed 2026-09-13 (a015d89d), before `.gemini/agents/` were generated on 2026-09-14 (e61d8849), and it still says "read the template for the role directly". The `jc-*` naming is LOCAL. | rides N1; a JC.net-side cure |

## Notes owed, and cross-row findings

Twelve notes, about 162 lines:

- N1: declarations and generators, 35
- N2: lockfile, 8
- N3: no-global-state-in-tests, 4
- N4: secrets hooks, 12
- N5: owner-only logs, plan-gate answer and quoting, 10
- N6: smoke runner, hardening and max-warnings, 18
- N7: install-time closure, 8
- N8: hook-command fixture, 8
- N9: path scope, 15
- N10: describeUnreadable, 6
- N11: corpus hardening and findings, 30
- N12: J15 riders, 8

Findings outside these rows:

- J18: the lineage landed the PreCompact observer on 2026-09-25 (6b194b9e5, 96120b0ea, bcdd871ad) from a concept note. "Bring the observer (absent there)" is now a compare: source-run against dist-run.
- J9: `compute-dont-hope.md` exists at `origin/engraph`, contradicting "none of the seven exists there".
- J12: the glob misses `.agent/skills/pkg/**`.
- Outside the pinned list: `core/parse-json-line.ts` (+ test) and `core/runtime-agent-events.ts` (arc-metrics, 6d60e056) sit under J7's globs, but no row names arc-metrics. Not triaged.
- Tool behaviour: this estate's `lineage-name` write-hook fired on this scratchpad file, outside the repo, because no root-anchored exemption covers a path outside the project. That is the fail-closed anchor working as documented. The literal lineage package scope was left out of this report rather than reworded.

## B6 triage B: rows J17 to J23 (J18 compare half only)

Read-only. Donor: this estate at `origin/main` `cf68973561`. Receiver: the lineage at
`origin/engraph` `1a4450a69e`. Every member was read four ways: this estate at its transplant
pin `55649a20e6` (jp) and at `origin/main` (jn); the lineage at this estate's pin `e477e62f7e`
(lp) and at `origin/engraph` (ln). "jp>jn" is this estate's movement since the pin, "lp>ln"
the lineage's, "jn~ln" the cross-estate difference now (all in changed lines from `diff`).

Window caveat: the register's jcnet list ends at `c68f831c6a` (PR 131). Reading at `cf68973561`
takes in later work that touches these rows: the gate slot (`44cb8d64`), the no-IO test
doctrine taken from the lineage (`7d5dd154` and its four cure commits), the dependency upgrade
(`b983fc1d`), PDR-141's rows.

States: PARITY, BRING, COMPARE, LOCAL, UNCLEAR. "Rides Jn" means the member is carried by
another row's note, so it needs no note of its own.

## J17: machinery this estate rewrote

Sampling: all ten members diffed in full on both sides except `pnpm-workspace.yaml` (first 80
diff lines plus top-level keys on both sides) and `starter-templates.md` (first 120 diff lines,
plus a grep of the heading and bullet lines across the rest). Finding on the row's premise:
"rewrote by more than 100 lines" is the cross-estate gap (jn~ln), mostly transplant adaptation.
This estate's own movement since the pin is small for six members: practice-index 8,
AGENT.md 8, `.agent/README.md` 4, ci.yml 7, turbo.json 17 and package.json 51 lines. The large
movers are starter-templates (331), pnpm-workspace (292), carriage-hardening (200) and
principles (82).

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| `.agent/practice-index.md` | PARITY (+LOCAL) | jp>jn=8, lp>ln=1. This estate added the operator-profile row, which is PARITY: the lineage added its own row at ln:293, the L1 twin. The `.agents/` and `.gemini/` rows are PARITY: the lineage's index lists both at ln:366-367. The cricket quartet naming and the architecture-expert description are LOCAL: the lineage's index has no roles table. | 1 (decline) |
| `.agent/directives/AGENT.md` | COMPARE | Both sides changed the Commands paragraph. This estate: "`pnpm check` is the canonical full aggregate, writing no tracked file ... its legs are listed once, in principles.md §Quality gates". The lineage: "The commit is the gate ... never run the gates separately, before, beside or after a commit (owner, 2026-09-14)", "`pnpm check` is ... not a command a seat runs by hand", "The browser suites run as pull request checks". Inbound only (L14): the lineage's "metacognition generative mode is the default". This estate's `.gemini/` tree line is LOCAL, because the lineage's AGENT.md has no tree block. | 25 (shared with principles, J22 build-system) |
| `.agent/directives/principles.md` | COMPARE (+PARITY, LOCAL) | jp>jn=82, lp>ln=58. PARITY: the test-doctrine clauses (the no-IO invariant, E2E and smoke checks as validation surfaces, TDD at all levels) now read the same on both sides. COMPARE: §Quality gates. This estate lists the `pnpm check` legs (`agent-tools:test:e2e`, repo-validator legs) and adds "each is a full-host run ... at most two at once ... inside one worktree gate runs are sequential", restating the lineage's own no-unbounded-host-load item 6. The lineage's §Quality gates says "Run ALL gates after changes", which its AGENT.md now forbids by hand. LOCAL: the `jcdotnet/` paths, Vercel, and the knip/gitleaks scope. Inbound only (L14): the lineage's "No change freezes" is portable; its open-source-by-default policy paragraph is LOCAL there. | shared with AGENT.md |
| `turbo.json` | COMPARE (+LOCAL) | Both sides changed the same task, `agent-tools#test:e2e`. This estate set `"cache": false`; `80e31891` gives the reason: "it spawns processes and reads root surfaces outside its inputs". The lineage kept `"cache": true` and added `.claude/settings.json`, `.claude/hooks/_lib/log-hook-errors.sh` and `.claude/hooks/sonar-secrets/**` to its inputs, which pairs with its new build-system section "A root file a test reads must be among the task's inputs". LOCAL: this estate's `www#build` task and the lineage's product env and comment changes. | 12 (shared with J22 build-system) |
| `.github/workflows/ci.yml` | BRING (rides J3) + PARITY + LOCAL | This estate's side is the "Install pinned shellcheck" step (J3) and the "Agent-tools end-to-end and smoke suite" step. That second step is PARITY: the lineage's CI runs `turbo run test:e2e ...`, which reaches its agent-tools e2e task. The lineage's side is only a `pnpm/action-setup` bump to v6.1.0, which is LOCAL: this estate uses the composite `./.github/actions/setup`. | 0 |
| `pnpm-workspace.yaml` | LOCAL | jp>jn=292, lp>ln=0. This estate pruned overrides for packages absent from its tree (the `@ai-sdk/provider-utils>undici` floors, `@clerk/shared`, `@sentry/cli`), re-scoped the brace-expansion floors per major and added `minimumReleaseAgeExclude`. The overrides are per dependency tree. Both estates share the annotated-floor discipline. | 1 (decline) |
| `.agent/reference/starter-templates.md` | BRING (+LOCAL) | jp~lp=0 and lp>ln=0: the lineage still holds the pin text. That text inlines component copies that drifted from its own components (5 "DRY and YAGNI" mentions, while its `components/principles/subagent-principles.md` is now "Sub-agent Principles / Reviewer Mandate"). It also cites `reviewer-system-guide.md`, which is absent from the lineage tree. This estate replaced the inline copies with pointers ("Copy these components from `.agent/sub-agents/components/`") and gave each template its frontmatter `description` (J1). LOCAL: the one-template-per-persona-lane structure (J12). | 10 |
| `package.json` (root) | rides J2/J3/J4/J6/J11 + PARITY + BRING + LOCAL | The script registrations ride their rows: `validate-no-lineage-names` (J2), the `*-tracked` legs and `depcruise-gate` (J3), `practice:substrate:check` (J4), `agent-tools:test:e2e` (J6), `exchange-register:check` (J11). `profile:check` and `profile:sync` are PARITY: the lineage added the same pair. BRING: `agent-tools:gate-slot` (`44cb8d64`, "gate slots bound full local gates to two per host and one per working tree"). This is the mechanism the lineage's own no-unbounded-host-load item 6 prescribes ("a host-wide semaphore the full local gate acquires, limit 2, hard ceiling 3, with a test"), and no gate-slot path exists in the lineage tree. It landed after the window head, so no row covers `agent-tools/src/gate-slot/**`. BRING: `--max-warnings 0` on `lint:runtime-only` (the warnings note below). LOCAL: the versions, the TypeScript 6/7 alias, the `test:e2e` filter and `packageManager`. | 12 (gate slot) |
| `.agent/README.md` | PARITY + LOCAL | jp>jn=4, lp>ln=0. The `.gemini/` line is PARITY: the lineage's README lists `.gemini/` at ln:32. The "operator-local/ Retired tier" row is LOCAL: the lineage's README has no operator-local row. | 1 (decline) |
| `carriage-hardening.integration.test.ts` | LOCAL | jp>jn=200, lp>ln=0. It is the prefix swap from the lineage's prefix to `jc-` (`fe265310`). After the swap is applied to the pin copy, 14 changed lines remain: one prettier reflow and the second-prefix fixture. | 1 (decline) |

## J18 (compare half): the two reference notes and the prompt

The lineage's counterparts are at other paths. The notes were re-homed from `docs/engineering/`
at this estate's `d4235cc0`. This estate authored its own prompt in the transplant commit
`6156fc46`; the lineage's prompt is archived.

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| `.agent/reference/merge-bot.md` ↔ ln `docs/engineering/merge-bot.md` | COMPARE (two-way) | jp~lp=4 (the transplant baseline), jp>jn=20, lp>ln=51 (7 lineage commits). This estate added the suppressed body findings hold (`SUPPRESSED-FINDINGS-OPEN`, owner card item 78), outstanding requests and live runs in the measured state, and "Requesting the Copilot reviewer is the one write the bot cannot make here" (GraphQL `reviewRequests`). The lineage added reviewer logins "without the `[bot]` suffix", "A review with an EMPTY body satisfies no leg", the completion-comment transport with the `UNCLASSIFIED-EVIDENCE` refusal (owner 2026-09-16), the `workflow-dispatch` scope and "The installation holds `actions: write`". The lineage's `upstream-mirror-dispatch` scope is LOCAL there (fork custody, L13). This twins with L30, L9 and L19. | 20 |
| `.agent/reference/tooling.md` ↔ ln `docs/engineering/tooling.md` | BRING (rides J3) + LOCAL | lp>ln=0: one-sided. This estate added the pinned shellcheck prerequisite (J3), a jq prerequisite for "the secrets hook smokes", and the wording `pnpm run outdated`. The jq line is LOCAL unless the lineage takes these hook smokes: its secrets hook is `.claude/hooks/sonar-secrets/`, and no jq smoke exists in its `agent-tools`. The rest of the 54-line gap is transplant adaptation (product prerequisites, the release tooling, the TSDoc third layer). | 0 |
| `.agent/prompts/session-continuation.prompt.md` ↔ ln `.agent/prompts/archive/session-continuation.prompt.md` | LOCAL | The two files share only a name. This estate's is its live continuation prompt (transplant closure, parked site threads; 87 lines at authoring, 92 now). The lineage's is "M1 Merge — Final Gates (Archived)", `status: complete`, dated 2026-03-02, unchanged since the pin. The lineage retired the surface, and castr's copy leaves under C13. | 1 (decline) |

## J19: canonical patterns

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| `cross-session-pattern-emergence`, `legitimate-principle-as-avoidance-cover` | PARITY | jn~ln=2 each: only this estate's line "Imported from the lineage at pin `e477e62f7` on 2026-09-14". Both files existed at lp. | 0 |
| `fluency-is-a-failure-vector`, `fabricated-gate-as-avoidance` | PARITY | jn~ln=4 and 8: the import line plus de-linking of records not imported ("(at the pin, not imported)"). The lineage's machine-specific plan filename was generalised to `<plan>`. | 0 |
| `baseline-transmits-its-stance` | PARITY (inbound under L27) | jn~ln=17. The lineage moved since the pin (lp>ln=9): the bullet "A consultation transmits the asker's frame the same way", plus `related_patterns` gained `passive-guidance-loses-to-artefact-gravity`. This estate has nothing to give back. | 0 |
| `referent-narrowing` | PARITY + BRING (tiny cure) | The lineage moved (lp>ln=4): the reference was renamed to "the read-surface-is-not-decide-surface pattern", which is inbound. This estate's copy carries the `> **POLARITY: ANTI-PATTERN.**` header block that the lineage's own README §Polarity requires ("Header marker"). 75 lineage patterns carry that block. The lineage's copy has `polarity: anti-pattern` in its frontmatter but no header. | 3 |
| `patterns/README.md` | PARITY | This estate's jp>jn=10 are index rows for the six imports. The lineage's README indexes all six (one row each). | 0 |

Finding on the row's premise: this estate did not record these six. It imported them from the
lineage on 2026-09-14, and each file says so. The row closes as PARITY with one 3-line cure.

## J20: root configuration

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| `.dependency-cruiser.mjs` | LOCAL | jp>jn=5, lp>ln=0. `stryker` was dropped from the config-file patterns (Stryker retired here; the lineage's ln:226 and ln:257 still use it). The `'fakes\\.'` orphan exemption was dropped too (`d8e37ba6`), but the lineage holds `test-helpers/fakes.ts` files and keeps the pattern at ln:29. | 1 (decline) |
| `.gitattributes` | LOCAL | This estate's comment dropped `pnpm sdk-codegen` (a lineage product command). | 0 |
| `.gitignore` | BRING (rides J3) + PARITY + LOCAL | `.tools/`, the pinned shellcheck home, rides J3. `.github/merge-bot.json` is PARITY (lineage ln:39). The operator-profile comment is LOCAL: the lineage still ignores `.agent/operator-local/**` at ln:110-113. The `!agent-tools/src/corpus-analysis/workflows/build/` un-ignore is LOCAL: the lineage does not ignore `build` broadly (only `build/Release`). | 0 |
| `.markdownlint-cli2.jsonc` | BRING (rides J3) | jp>jn=30, lp>ln=0. This estate dropped `globs` and the disk-walk ignores: "The universe is the tracked tree, computed by `repo-check markdownlint-tracked` from `git ls-files` ... declares only ownership". The lineage keeps `globs` and the disk walk. | 0 |
| `.prettierignore` | BRING (rides J3) | jp>jn=24, lp>ln=0: "Ownership only. The universe is the tracked tree, computed by `repo-check prettier-tracked`". | 0 |
| `knip.config.ts` | BRING + rides J1/J8 + PARITY | Both sides moved, on different clauses. BRING: `treatConfigHintsAsErrors: true` and `treatTagHintsAsErrors: true` (`c5ca76b3`); the lineage has neither (warnings note below). The entries for `rule-frontmatter-sweep` (J1), the corpus-analysis workflows (J8) and `gate-slot` ride their rows. The operator-profile entries are PARITY (the lineage added three). The lineage's plugin-skill-copies entry (L26) and its `.tsx` comment are its own. | shared (warnings note) |
| `tsconfig.base.json` | BRING | jp~lp=0, lp>ln=0. This estate added `verbatimModuleSyntax`, `noImplicitOverride`, `allowUnreachableCode: false` and `allowUnusedLabels: false` (`5746ad87`, "one strict base that every tsconfig extends"). `git grep` of every `*tsconfig*.json` at `origin/engraph` finds none of the four. This refutes L20's lineage cell, "inherited there already". | 8 |
| `tsconfig.depcruise.json` | LOCAL (until the lineage adopts TypeScript 7) | This estate dropped `baseUrl`, "which TypeScript 7 removes" (`76fc0616`). The lineage is on `typescript` `^6.0.3` and still sets `baseUrl`. It becomes a cure when the lineage moves to TypeScript 7. | 1 (decline) |

## J21: shared tooling workspaces

Sampling: `lp>ln=0` holds for all 37 paths (`git log e477e62f7e..origin/engraph --
packages/core/` is empty), so every difference is this estate's. Paths were mapped
`tooling/eslint/` → the lineage's `packages/core/` eslint-plugin directory and `tooling/X` →
`packages/core/X`. Diffed in full: the five rules and their unit tests, `plugin.ts`,
`strict.ts`, the `result` sources, test and README, the three workspace-config sources, the
eslint `package.json` and `type-helpers/eslint.config.ts`. `recommended.ts` was read to its
first 150 diff lines. `shared.ts` was read by its removed lines only. The remaining manifests,
READMEs and eslint configs were characterised from diff size and the commit messages
(`b7cb9853`, `708bac15`, `245743d1`, `d89306bb`, `a3de586e`, `a4b4cb9c`).

Finding on the row's premise: the rules were not "tightened". Their logic is unchanged except
one index guard, and `b7cb9853` says "no severity changed". Most of the diff re-points
citations from lineage ADRs, which exist there, to this estate's rules.

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| The five rules' source (`no-real-io-in-tests`, `no-agent-substrate-access`, `no-eslint-disable`, `no-throw-statement`, `no-export-trivial-type-aliases`) | LOCAL + BRING (small) | The diffs are 37, 12, 4, 16 and 8 lines. Citation swaps: "per ADR-078" became "`.agent/rules/test-immediate-fails.md`", and "ADR-088" became "`.agent/rules/use-result-pattern.md`". These are LOCAL. BRING: `no-export-trivial-type-aliases` changed `split('.')[0]` to `split('.').at(0)` with an `undefined` guard. The `no-real-io-in-tests` docblock went from "a frozen historical-violation inventory" to "The consuming config records each entry's reason". | eslint-cures note |
| `recommended.ts` and `strict.ts` comments | BRING | The lineage's `recommended.ts` still reads "wired at `warn` per the new-ESLint-rule convention" (ln:207) and "a frozen historical-violation inventory" (ln:231). Both contradict its own PDR-126 ("gates land strict in one landing"; PDR-126 is present there). This estate rewrote both as PDR-126 transition debt and dropped the commented-out "Potentials" rules. LOCAL: `no-throw-statement` `'off'` "by owner ruling (2026-09-12)", and the allowlist entries. | eslint-cures note |
| The eslint README | BRING (+LOCAL) | The lineage's rules table lists one custom rule (`no-export-trivial-type-aliases`) while its `plugin.ts` registers about ten. This estate's table lists the seven it registers. LOCAL: the `LIB_PACKAGES` section, which is real in the lineage (`scripts/validate-boundaries.ts`). | eslint-cures note (15 in all) |
| `max-files-per-dir` removal | BRING (an owner card on the lineage's side, per the register) | In the lineage it is referenced by no code outside its own two files (`git grep` over `*.ts`, `*.mjs`, `*.js`, `*.json`). The lineage's own corpus data records "the custom max-files-per-dir ESLint rule was found unwired" (2026-07-15). It is dead code on both sides. | 6 |
| `require-observability-emission` removal | LOCAL | It is live in the lineage: enabled by two app and four SDK `eslint.config.ts` files. There is no consumer here. | 1 (decline) |
| `result` (`index.ts`, `result-type.ts`, `unwrapping.ts`, README, unit test) | BRING (small) + LOCAL | A doc truth cure: "Forces explicit handling of both cases" became "TypeScript rejects a read of `value` or `error` until the union is narrowed ... The type does not make a caller handle the failure". The README API was completed (`collect`, `unwrapOrThrow`, `assertNeverResult`, the Types section). The misnamed test "forces exhaustive error handling" was deleted (`a3de586e`): it asserts `result.value` only. LOCAL: the ADR-088 citation swaps and the install section (`workspace:*`). | 12 |
| workspace-config (the `tsup` base and the two `vitest` bases, README, manifests) | LOCAL | `createSdkConfig` and `createAppConfig` were removed as unconsumed here (`245743d1`). The lineage consumes them in two apps, an SDK and `knip.config.ts`. The `vitest` bases dropped the MCP-403, ADR-078, ADR-168 and `stryker-tmp` references, which are all real in the lineage. | 1 (decline) |
| The manifests and per-workspace eslint configs | BRING + LOCAL | BRING: `"lint": "eslint --max-warnings 0 ."` on every lint script (`d89306bb`); no lineage `package.json` passes `--max-warnings` (warnings note below). LOCAL: the dependency versions, TypeScript 7 native beside `typescript6`, vitest 5, the `stryker.config.mjs` blocks, the prefix keyword and the repository URL. | shared (warnings note) |
| `shared.ts` ignores | LOCAL | This estate dropped TypeDoc and design-sync ignore paths that are real lineage surfaces. | 0 |

## J22: docs/engineering

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| `README.md` | LOCAL | jp>jn=2 (link text), lp>ln=0. | 0 |
| `build-system.md` | COMPARE (+LOCAL) | jp>jn=219, lp>ln=35. The lineage added "A root file a test reads must be among the task's inputs, or the cache replays a stale pass" and renamed the mutating aggregate `pnpm make` ("`pnpm check` applies no fixes"). This estate rewrote "`pnpm check` — the full aggregate" (tracked-universe legs, smokes discovered from the directory, gate slots at pre-push) and a caching table row: "`@engraph/agent-tools#test:e2e` ❌ The smoke suite proves the built binaries every run". The overlap is the check contract (the gates note) and the e2e caching clause (the turbo note). LOCAL: the workspace layout, "ESLint 9 and ESLint 10 coexist", `tsc6` beside TypeScript 7, and the site PDF. | shared (gates + turbo notes) |
| `testing-patterns.md` | COMPARE (two-way) | jp>jn=99, lp>ln=114, jn~ln=246, spread across the file. Both sides moved the no-IO doctrine differently. This estate: "A test never imports a production config loader that reads files or the environment" and "Module-level state with IO is a missing seam". The lineage: "A production config loader is imported only where the test directly proves the loader", "Module-level state = integration" (ln:147) and a new "In-Process App Construction" section. Both hold "A socket is IO". | 25 |
| `testing-tdd-recipes.md` and `workflow.md` | COMPARE (small, two-way) | Outbound: the lineage's §Test Types anchor is stale (its `testing-strategy.md` has no such section, having `## Rules`); this estate's cure is "§Rules". The example test files take the `*.unit.test.ts` suffix. The shellcheck and jq troubleshooting in `workflow.md` rides J3. Inbound: the lineage renamed to "E2E checks", in "E2E Check TDD" and "E2E checks (validators, not tests)". This estate's `principles.md` already says "E2E checks", but its `workflow.md` (jn:42, "E2E tests") and `testing-tdd-recipes.md` (jn:111, "E2E Test TDD") do not, which leaves this estate inconsistent with itself. LOCAL: the site's test-suffix discovery paragraph and the reviewer table (J12). | 12 |

## J23: architecture decision records

| Member | State | Evidence | Note (lines) |
| --- | --- | --- | --- |
| `005-knip-unused-code-detection.md` | LOCAL | The config moved from the `package.json` `knip` field to the root `knip.config.ts`. | 0 |
| `009-content-negotiation-proxy.md` | LOCAL | `accept-md.config.js` became `lib/accept-md-config.ts`, a site decision. | 0 |
| `019-playwright-against-production-build.md` | LOCAL | The site harness now binds and holds its own port ("a run can only ever prove its own build"). The concept is already PARITY in the lineage's own Playwright configs (`reuseExistingServer: false` in two configs), and its gate side travels in the principles clause (J17). | 0 |
| `022-rendering-risk-needs-blocking-visual-proof.md` | LOCAL | The renumbering note for this estate's own PDR-030, which became ADR-022. | 0 |
| `README.md` | LOCAL | The index row for 022. | 0 |

The row closes with one line: all five are site decisions, and none decides a Practice concept.

## Notes needed

| # | Note | State | Rows | Lines |
| --- | --- | --- | --- | --- |
| 1 | Gate-running doctrine: the full aggregate as runnable and bounded (this estate) against "the commit is the gate; never run gates by hand" (the lineage, owner 2026-09-14) | COMPARE | J17 (AGENT.md, principles), J22 (build-system) | 25 |
| 2 | Caching for a task that reads root files: uncached (this estate) against root inputs declared (the lineage) | COMPARE | J17 (turbo), J22 (build-system) | 12 |
| 3 | Starter templates: pointers in place of drifted inline component copies; the dangling guide link | BRING | J17 | 10 |
| 4 | Gate slot: the mechanism the lineage's no-unbounded-host-load item 6 prescribes (outside the register's window) | BRING | J17 (package.json) | 12 |
| 5 | The merge-bot reference note, both halves | COMPARE | J18 | 20 |
| 6 | The polarity header on `referent-narrowing` | BRING | J19 | 3 |
| 7 | The four strictness flags in the base tsconfig (refutes L20's "inherited") | BRING | J20 | 8 |
| 8 | Warnings fail every gate: eslint `--max-warnings 0`, knip hints as errors (pairs with L11's no-warning-toleration compare) | BRING | J20, J21, J17 | 10 |
| 9 | Eslint plugin cures: comments against PDR-126, the README rules table, the index guard | BRING | J21 | 15 |
| 10 | `max-files-per-dir` removal (dead code there; an owner card per the register) | BRING | J21 | 6 |
| 11 | Result: the doc truth cure, the complete API list, the misnamed type-only test | BRING | J21 | 12 |
| 12 | testing-patterns: the no-IO doctrine texts, both directions | COMPARE | J22 | 25 |
| 13 | tdd-recipes and workflow: the stale anchor out, E2E-check vocabulary in | COMPARE | J22 | 12 |

Thirteen notes, about 170 lines. Carried elsewhere with no note of their own: the J3 rides (the
ci shellcheck step, `.tools/` ignore, the markdownlint and prettier ownership model, the
shellcheck lines in the tooling note and in workflow). The LOCAL members take one-line declines.

## Not determined

- Whether notes 1 and 4 should converge: the lineage forbids hand-run gates, while this estate
  bounds them and slots them. That call is the owner's.
- The retrofit cost of note 7 in the lineage. No type-check was run there (read-only).
- Which row owns the gate slot: its paths postdate the register's pins, so the validator's
  coverage counts do not include them.
- The jq prerequisite in the tooling note: it stays LOCAL unless the lineage takes this estate's
  secrets-hook smokes (J6 and J7).
