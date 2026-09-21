---
type: register
status: active
date: 2026-09-21
fitness_line_target: 260
fitness_line_limit: 340
fitness_line_length: 100
---

# Practice exchange register

The concept register of the `practice-two-way-exchange` node (todo 2): one row per concept,
never per file, with a disposition and a landing per estate. The three estates are this one
(`jcnet`), the lineage (`lineage`, EngraphCode/open-curriculum-ecosystem) and castr
(`castr`, EngraphCode/castr); the owner's rulings of 2026-09-21 that shape the register are
recorded in the node's §Rulings of 2026-09-21.

Every path in the four computed lists (`inputs/exchange-delta-*.tsv`, from the pins in
`inputs/exchange-pins.tsv`) maps to at least one row through the row's path globs; the
register validator (`pnpm exchange-register:check`) refuses a path with none, and it refuses a
glob that matches nothing in any list the row covers. A row's group names the lists its globs
cover: L rows cover both lineage lists, J rows the jcnet list, C rows the castr list and the
lineage-since-castr list. A row marked `(catch-all)` covers a path only when no other row of
its group does. Heads at the window's opening: lineage `72cab5667c`, this estate
`c68f831c6a`, castr `d1fe56b928`; re-pinned once before the register closes.

## Disposition vocabulary

Where a twin exists, the PDR-125 clause 6 words: `twinned-in-window` (both estates in one
window, diff-proven), `already-present-verify-parity`, `their-lane-owns-coordinate`,
`impossible-with-named-reason`. Otherwise: `origin` (the estate that authored the concept),
`bring`, `compare` (two encodings of one concept, the higher form or a merge decided at the
row's landing), `decline (reason)`, `records, not portable`, `graduated into <row>`, `card`
(an owner decision), `local` (host-specific by nature). A landing column carries the merged
pull request once one exists.

## Rows from the lineage's delta (since `e477e62f7e`)

| Row | Concept | jcnet | lineage | castr | Path globs |
| --- | --- | --- | --- | --- | --- |
| L1 | Operator profile in the home directory: PDR-141, the schema, the validators and sync, the start-right §3a read, the index row, the checkout tier retired | bring (PR 138) | origin | bring at re-transplant | `.agent/practice-core/decision-records/PDR-141*`, `.agent/practice-core/schemas/operator-profile.schema.json`, `agent-tools/src/validators/operator-profile/**` |
| L2 | PDR-117 amendments: takeover verification, routing, planning, executor binding, review lanes, emeritus seats | bring | origin | bring | `.agent/practice-core/decision-records/PDR-117*` |
| L3 | PDR-027 amendment: designation versus character, fork identity, the model-name open question | bring | origin | bring | `.agent/practice-core/decision-records/PDR-027*` |
| L4 | PDR-026 amendment: owner endorsement of surfaced falsifiable structure | bring | origin | bring | `.agent/practice-core/decision-records/PDR-026*` |
| L5 | PDR-011 amendment: graduate, then archive; the four-part surface lifecycle | bring | origin | bring | `.agent/practice-core/decision-records/PDR-011*`, `.agent/practice-core/CHANGELOG.md`, `.agent/practice-core/decision-records/README.md` |
| L6 | pr-lifecycle: the review-round state machine and its tally | compare (with the merge hold and the plan-ledger disposition of 2026-09-17) | origin | bring | `.agent/skills/change-custody/pr-lifecycle/**` |
| L7 | review-cost push gate: budget, pricing, survey, ledger | twinned-in-window (lineage to jcnet) | origin | bring | `agent-tools/src/review-cost/**`, `agent-tools/tests/review-cost/**`, `.husky/pre-push` |
| L8 | pr-tally: harvest, findings, markers, rows, dispositions, settlement, verdict | compare (with pr-watch); the signed-line grammar twins back (J5) | origin | bring after the merge | `agent-tools/src/pr-tally/**`, `agent-tools/tests/pr-tally/**` |
| L9 | pr-watch reconvergence: one codebase forked at the pin; seventeen shared files differ, the lineage alone holds the completion-comment, completion-evidence, expected-reviewer, harvest, run-evidence and state-conversation modules, this estate alone holds the body tally, the disposition-line grammar, harvest bracket and fields, issue comments, printable and the suppressed-findings hold | compare (two windows: each estate takes the other's unique modules where the concept applies, the shared files merge by concept, a diff-proof at the end) | compare (the same row, their lane for their half) | bring after the reconvergence | `agent-tools/src/pr-watch/**` |
| L10 | testing-strategy rewrite | compare (per-section merge against the site-merged version; the lineage's non-negotiables carried whole: the IO invariant, the PDR-091 sentence, counters as configuration echoes, growth measured at two sizes; a conflicting section is the owner's card, never a merge) | origin | bring | `.agent/directives/testing-strategy.md` |
| L11 | Owner rulings graduated into rules, skills and a template on 2026-09-14 and since: 42 rules shared with this estate changed, plus the skills and the test-expert template | bring clause by clause; already-present-verify-parity where the transplant took them | origin | bring | `.agent/rules/*.md`, `.agent/skills/**`, `.agent/sub-agents/templates/*.md` |
| L12 | Generic rules absent here: one-instance-is-an-observation, one-pr-per-leaf-issue, bot-identity-on-third-party-systems | bring (check one-pr-per-leaf-issue's tracker assumption) | origin | bring | `.agent/rules/one-instance-is-an-observation.md`, `.agent/rules/one-pr-per-leaf-issue.md`, `.agent/rules/bot-identity-on-third-party-systems.md` |
| L13 | Product-bound and fork-custody surfaces in the delta: the Linear hygiene and SonarQube instruction rules, the downstream-checkout rule, the editorial-tone directive, the cross-fork-integration skill and the upstream carrier and mirror workflows (product rules that did not change since the pin are not in any delta and have no row) | decline (product or fork custody; the concept "a downstream fork keeps an upstream carrier" may be portable, judged at landing) | local | decline | `.agent/rules/linear-mcp-team-and-project-hygiene.md`, `.agent/rules/sonarqube-mcp-instructions.md`, `.agent/rules/downstream-checkout-never-writes-upstream-surfaces.md`, `.agent/directives/editorial-tone.md`, `.agent/skills/change-custody/cross-fork-integration/**`, `.github/workflows/upstream-carrier.yml`, `.github/workflows/upstream-mirror.yml` |
| L14 | Directives touched since the pin, and schema-first-execution, which this estate lacks | compare (per-section merge); schema-first-execution bring; editorial-tone declined (L13) | origin | bring at re-transplant | `.agent/directives/*.md` |
| L15 | skills-adapter-generate and commit-advisories changes, with their tests | compare (a diff of the two copies; the lineage lands the merge if they diverged since the pin, the prefix-pin generalisation went the other way) | origin | bring | `agent-tools/src/skills-adapter-generate/**`, `agent-tools/src/commit-advisories/**`, `agent-tools/tests/skills-adapter-generate/**` |
| L16 | The docs-only bot-authored class at the merge door (the lineage's item 8): both estates' merge decisions are the same slice and neither encodes the class; the suppressed-findings hold here is a different thing | bring once built | build (their lane; the third instance fired 2026-09-21) | bring | `agent-tools/src/merge-bot/**` |
| L17 | Product tooling: mcp-content-current-source, mcp-content-workspace, under-the-hood-content-generate, workspace-census | decline (product) | local | decline | `agent-tools/src/mcp-content-current-source/**`, `agent-tools/src/mcp-content-workspace/**`, `agent-tools/src/under-the-hood-content-generate/**`, `agent-tools/src/workspace-census/**`, `agent-tools/tests/workspace-census.unit.test.ts` |
| L18 | The lineage's hand-kept platform adapters and rules index | graduated into J1 | local | graduated into J1 | `.claude/**`, `.agents/**`, `.cursor/**`, `.codex/**`, `RULES_INDEX.md` |
| L19 | Landing instruments read the evidence: the door reads a reviewer's completion comment, a configured vendor's zero-findings result, inline-only reviews as a leg input (the lineage's item 1) | bring with L9 | build (their lane; twins with the pr-watch row) | bring | `agent-tools/src/merge-bot/**`, `agent-tools/src/pr-tally/**` |
| L20 | TypeScript strictness brought to the target set as maintenance, by this estate's slice method (the lineage's item 7) | origin | their-lane-owns-coordinate (inherited there already) | bring | none: the tsconfig files sit outside the machinery universe |
| L21 | Root manifests, hooks, CI, the CLI topic registry and the index surfaces touched since the pin (the pre-push secret scan over pushed refs, script registrations, the Practice index, the tooling README) | compare (line by line with the jcnet copies) | origin | bring | `package.json`, `agent-tools/package.json`, `agent-tools/README.md`, `turbo.json`, `.husky/**`, `.github/**`, `.agent/practice-index.md`, `agent-tools/src/bin/**`, `agent-tools/tests/agent-tools-cli.unit.test.ts` |
| L22 | The Workflow tool operating note under the harness integrations | bring | origin | bring | `.agent/claude-harness-integrations/**` |
| L23 | The dedicated consolidation session prompt | compare (with the consolidate-until-done skill here) | origin | bring | `.agent/prompts/**` |
| L24 | Reference notes: the shell and tooling gotchas, skill composition | bring | origin | bring | `.agent/reference/**` |
| L25 | collaboration-state test helpers (frontmatter, repo document) | compare | origin | bring | `agent-tools/src/collaboration-state/**` |
| L26 | The plugin-skill-copies validator and the plugin package invariants | compare (this estate carries a plugin marketplace file; the invariant may apply) | origin | decline until castr ships a plugin | `agent-tools/src/validators/plugin-skill-copies/**`, `agent-tools/tests/skills/**` |

## Rows from this estate's delta (since `55649a20e6`)

| Row | Concept | jcnet | lineage | castr | Path globs |
| --- | --- | --- | --- | --- | --- |
| J1 | Rule and sub-agent declarations, and the generators that render every adapter and the rules index byte for byte | origin | their-lane-owns-coordinate (a lineage lane lands the frontmatter in slices with the generators) | bring at re-transplant (replaces C6) | `agent-tools/src/rule-declarations/**`, `agent-tools/src/subagent-declarations/**`, `.agent/rules/*.md`, `.agent/sub-agents/**`, `RULES_INDEX.md`, `.claude/**`, `.cursor/**`, `.codex/**`, `.agents/**`, `.gemini/**` (jcnet list) |
| J2 | Tracked-universe validators: cited paths, cited scripts, markdown links, the authored-surfaces walker, machine-local paths, lineage names | origin | bring (their lane, after J1; the two share the tracked-universe read) | bring | `agent-tools/src/validators/**` (jcnet list) |
| J3 | repo-check: prettier, markdownlint and shellcheck over the tracked tree; the bash floor | origin | already-present-verify-parity (repo-check exists there; the bash floor to compare) | bring | `agent-tools/src/repo-check/**`, `.husky/**` (jcnet list) |
| J4 | practice-substrate: the instance tier derived from the ignore rules | origin | bring (the lineage's audit blocks on a fresh checkout) | bring | `agent-tools/src/practice-substrate/**` |
| J5 | Merge bot with the measured-state hold and the signed disposition-line grammar | origin | graduated into L9 (the hold and the grammar are this estate's unique pr-watch modules; the grammar twins into pr-tally todo 2, their lane) | bring | `agent-tools/src/merge-bot/**`, `agent-tools/src/pr-watch/**` |
| J6 | The smoke runner discovered from `smoke-tests/*.smoke.ts`; the derived postinstall closure | origin | compare (against the lineage's hand-chained smokes and its bootstrap) | bring | `agent-tools/src/smoke/**`, `agent-tools/smoke-tests/**`, `agent-tools/src/bootstrap/**`, `agent-tools/package.json` |
| J7 | hook-policy path scoping (root-anchored `./`) and the shared unreadable-file describer | origin | compare (the lineage carries the argv matcher and its follow-ups; the path scoping may be one of them) | bring | `agent-tools/src/hook-policy/**`, `agent-tools/src/core/**`, `.agent/hooks/**` |
| J8 | corpus-analysis and workflow-build adaptations | origin | already-present-verify-parity (the lineage carries the mapper, reducer, voter and meta agents) | decline until castr has a corpus | `agent-tools/src/corpus-analysis/**`, `agent-tools/src/workflow-build/**` |
| J9 | Doctrine: compute-dont-hope, record-generalisation-moves, channel-by-audience-lifetime-and-consumer, no-skipped-tests, no-type-shortcuts, tsdoc hygiene, napkin-always-active | origin | bring (none of the seven exists there; records-class, one pull request) | bring | `.agent/rules/compute-dont-hope.md`, `.agent/rules/record-generalisation-moves.md`, `.agent/rules/channel-by-audience-lifetime-and-consumer.md`, `.agent/rules/no-skipped-tests.md`, `.agent/rules/no-type-shortcuts.md`, `.agent/rules/tsdoc-and-documentation-hygiene.md`, `.agent/rules/napkin-always-active.md` |
| J10 | PDR-008 (gate naming as practised), PDR-082 (channel clause), PDR-132 (round budgets) amendments | origin | compare (76, 36 and 38 lines differ; both sides may have amended, so clause by clause before any landing) | bring | `.agent/practice-core/decision-records/PDR-008*`, `.agent/practice-core/decision-records/PDR-082*`, `.agent/practice-core/decision-records/PDR-132*` |
| J11 | The transplant runbook, the loss-scan, the generalisation register, the exchange instrument | origin | bring the runbook and instruments; the registers are records | bring (the re-transplant runs them) | none: plans and reports sit outside the machinery universe |
| J12 | Site-specific doctrine: CSS and accessibility, editorial, privacy, secops, the four architecture personas, pkg, editor, the site skills | local | decline | decline | the named directives, rules, templates and skills |
| J13 | Practice tooling text that named one estate's prefix (the adapter generator's usage, the health probe) | origin | bring | bring | `agent-tools/src/skills-adapter-generate/**`, `agent-tools/src/claude/**` (jcnet list) |
| J14 | Language-pack leaks found this window: the worktree-lane skill's committer step names one estate's identity contract and omits the browser install | cure | cure | cure at re-transplant | `.agent/skills/set-up-worktree-lane/**` |
| J15 | Everything else in the jcnet list: adaptations made at transplant time (lineage numbers replaced by concepts, product modules excised, names scrubbed) | origin | already-present-verify-parity (the lineage's own text stands there) | bring at re-transplant | `**` (catch-all) |

## Rows from castr (since `c048173929`) and the lineage since castr's pin (`4470266647`)

| Row | Concept | jcnet | lineage | castr | Path globs |
| --- | --- | --- | --- | --- | --- |
| C1 | semantic-merge git merge driver: refuse a line merge of memory files and route to the skill | bring | bring (the fold's manual napkin union is the recorded friction) | origin | `agent-tools/src/semantic-merge/**` |
| C2 | drift validator: count claims and anchors consistent across the substrate | bring | bring | origin | `agent-tools/src/validators/drift/**` |
| C3 | loop-closure-references validator: hollow enforcement claims, unresolved script references in doctrine | compare (with cited-scripts, J2; bring what it adds) | bring | origin | `agent-tools/src/validators/loop-closure-references/**` |
| C4 | Coverage-as-signal CI wiring with the fail-loud workspace enumeration guard | bring | bring | origin | `.github/workflows/ci.yml` (castr list) |
| C5 | Statusline: an absent registry reads as truthful solo; the checkout-directory label | compare (verify parity) | compare (verify parity) | origin | `agent-tools/src/claude/statusline-*` (castr list) |
| C6 | agent-adapter-generate and its cricket-contract integration test | graduated into J1; the contract test taken | graduated into J1 | replace at re-transplant | `agent-tools/src/agent-adapter-generate/**` |
| C7 | PDR-005 §Default disposition: bring by default; the gradient governs how, never whether | card (a PDR-005 amendment lands in both estates in one window by the birthplace ruling; its own lane) | card (the same) | origin | `.agent/practice-core/decision-records/PDR-005*` (castr) |
| C8 | PDR-124 multi-agent audit harness (a pattern PDR) | bring, renumbered above 141 | bring, renumbered | origin (renumber) | `.agent/practice-core/decision-records/PDR-124*` (castr) |
| C9 | castr's colliding PDR-096 and PDR-097 | compare (judge on substance; renumber if portable) | compare | origin | `.agent/practice-core/decision-records/PDR-096*`, `.agent/practice-core/decision-records/PDR-097*` (castr) |
| C10 | Generic rules: no-manufactured-permission, unknown-is-type-destruction, never-edit-generated-files, one-push-per-review-wave, quality-gate-failures | bring after reading each body | bring | origin | the rule paths (castr) |
| C11 | Product doctrine and reviewers: IDENTITY, requirements, acceptance criteria, the input-output pair rule, the three schema experts, the ADRs | decline | decline | local (the preserve set) | the named paths (castr) |
| C12 | castr's June transplant of lineage machinery and its own adaptations since | graduated into the lineage rows above | already-present-verify-parity | replaced at re-transplant | `**` (catch-all) |
| C13 | The nine castr surfaces the owner named as leaving: the long practice-lineage, the session-continuation bridge, the plan directories, ADRs in directives, reviewer-suffixed templates, the workflows directory, the duplicate report directory, the cloud setup scripts, memory/collaboration | none | none | drop at re-transplant, each recorded under the ruling of 2026-09-21 | the named paths (castr) |
| C14 | Distilled insights: genotype and phenotype (rules are host expression, PDRs travel); a fitness number is a signal, never a goal | records, not portable (observations until a second instance; the owner's word of 2026-09-21 that two instances never override innovation work applies to extraction, not to these) | records, not portable | origin | none: memory sits outside the machinery universe |
| C15 | The lineage's changes since castr's pin that the rows above do not name | graduated into the L rows | origin | bring at re-transplant | `**` (catch-all) |

## Rows from the owner's word of 2026-09-21

| Row | Concept | jcnet | lineage | castr | Source |
| --- | --- | --- | --- | --- | --- |
| O1 | A context-measuring mechanism or workflow that stops the agent rather than making it work more efficiently is an antipattern | a PDR clause that names PDR-063's measured hand-over and the compaction-preparation passes as the compliant shape (they hand work over or prepare it; they do not stop it), so the clause retires nothing | same | same | the owner's aside, verbatim in the napkin of 2026-09-21; the lineage's reading on the channel the same day |
| O2 | "Two instances before extraction" applies sometimes and never overrides innovation work | amend `consolidate-at-second-consumer` | same | same | the same aside |
| O3 | Innovation's value is discovery and knowledge creation; it never requires a proven need | amend the warrant clauses that demand a need (the reason skill's stop gate, PDR-130's lanes) | same | same | the same aside |

## Landings

Appended as each row lands: row, estate, pull request, head read.

| Row | Estate | Pull request | Head read |
| --- | --- | --- | --- |
| L1 | jcnet | PR 138 (draft, open) | lineage `72cab5667c` |
