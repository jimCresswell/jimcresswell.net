---
title: What the Practice is — the transplant set defined by function
status: provisional
date: 2026-09-13
author: Cauldron herds Lustre (880ff9), the transplant seat
---

# What the Practice is — the transplant set defined by function

Asked by the owner on 2026-09-13: what belongs to the Practice, what a new repository needs
to have a working and full Practice, and what this transplant failed to migrate. The owner's
constraint on method, verbatim: "looking at your surveys of the Practice in OCE cannot tell
you if something was missed from those surveys."

## Method: three sources, ranked

1. **Function first.** The Practice is defined by what it must do, not by which directories
   the lineage happens to have. The estate's own first-principles sources are
   `practice-core/practice-verification.md` (§Minimum Operational Estate, §Vital Integration
   Surfaces, §Claimed / Installed / Activated Audit) and PDR-005 (the transplant set and its
   four audits). Everything below starts from those and from the owner's kernel: persistence,
   learning and improvement for agents, independent of model and vendor.
2. **Exercise the estate's own claims.** A transplant's misses show up as doctrine that cites a
   surface the estate lacks. That is measurable without any survey: every backticked `.agent/`
   path in skills, rules and directives is tested for existence; every cited script is tested
   against `package.json` (the cited-scripts validator); every link is tested (markdown-links).
   This source finds what the surveys missed, because it reads the Practice's dependencies
   rather than the source tree.
3. **The diff against the lineage** (OCE at `e477e62f7`), weakest: it lists what the lineage
   has and this estate lacks, but a wholesale drop leaves no trace in a diff of what remains,
   and it cannot see a function neither tree carries.

## The definition: nine functions

A repository has a working Practice when every function below has a mechanism, and a full
one when each mechanism is the lineage's current generation with local divergence recorded.
"Surfaces" are the lineage's realisation; "here" is this estate's state, re-dated at the
closure's end (2026-09-14) with the proof each row cites. A row reads "present" only when
its proof exists on `main` or in the pull request the row describes.

| #   | Function                                                                                                       | Surfaces (lineage)                                                                                                                                                                                                  | Here                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | **Orientation** — a seat or a human lands and knows what this is, where to start, and what governs             | `AGENT.md`, `HUMANS.md`, `practice-index.md`, `README.md`, `orientation.md`, the start-right skills, `RULES_INDEX.md`, `skills.md`                                                                                  | Present. The entry points describe this host: `.agent/directives/AGENT.md`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, the Copilot instructions, `RULES_INDEX.md`, the start-right skills. Proof: `validate-cited-paths` green over them (2026-09-13). |
| 2   | **Doctrine** — the constitution and its amendment record                                                       | `practice-core/` (PDRs, verification, bootstrap, lineage, provenance, CHANGELOG, schemas), `principles.md`, the directives, the rules with adapters                                                                 | Present. The locally amended Core files are recorded in `practice-core/provenance.yml`. Proof: `validate-cited-paths` and `validate-markdown-links` green (2026-09-13). |
| 3   | **Capability** — how work is done                                                                              | Skills (planning, change custody, cognition, knowledge, session lifecycle, collaboration), sub-agent templates and their adapters, commands, workflows (`.agent/state/*.workflow.js`, `agent-tools/workflow-build`) | Present. Skills and templates present; the corpus-analysis workflow (`agent-tools/src/corpus-analysis/`, 62 files) and its build (`agent-tools/src/workflow-build/`, 11 files) restored from the pin on 2026-09-14 (closure item 4, row 3; pull request #86, merged at `SHA: 47299c7`), scrubbed (the lineage's result and safe-path packages read as the estate's), with a provenance line in every module and the four package scripts the trees own; `pnpm --filter @engraph/agent-tools build:workflows` proves each of the four stages (map, reduce, validate, meta) bundles into a valid harness artefact under the build's output contract (the launchable, seeded artefacts are written by `build-run-artefact` from validated checkpoint data), so the four `corpus-*` templates and the consolidate-docs synthesis-engine pointer name a runnable instrument. No corpus workflow file exists under `.agent/state/` at the pin (the only workflow file there is a retired audit artefact), so nothing is restored under that directory (Director ruling, 2026-09-14; the todo's wording, which names that file, is raised to the owner as a card). The recall baseline fixture (`recall-baseline-fixture.ts`) is the lineage's calibration data, eighteen baselines citing two lineage syntheses absent here, so on a corpus of this estate the post-run recall gate reports a miss by construction until a local baseline is recorded (reported, never failed); the three drivers bind to the checkout they run in. Proof: the trees' 27 test files green on `main` at `SHA: 47299c7` (315 cells, read 2026-09-14); the build's output contract green on all four stages; the estate's lint, type-check, knip and dependency gates green on the restored files |
| 4   | **Enforcement** — the immune system: nothing claimed without a check                                           | `agent-tools` validators, the PreToolUse guard and policy, husky, CI parity, `check` and its legs, fitness budgets                                                                                                  | Present. Validators, the PreToolUse guard and policy, husky, CI parity and the `check` legs; the two installed-but-inactive instruments (`practice-substrate`, `validate-protocol-wire-contract`) and the smoke suite wired as legs, and the root gates reading the tracked universe, by lane A's item 3 (pull request #56, merged 2026-09-13 at `SHA: 1829cd4`). Proof: those legs and `validate-check-ci-parity` green on `main` since that merge |
| 5   | **Identity and collaboration** — seats know who they are and coordinate                                        | PDR-027 identity, collaboration-state (claims, registry, comms, heartbeat), rapid-comms, join ceremony, coordination branches, handoff records, sif                                                                 | Present. Identity preflight, claims, comms and heartbeats were in live use by a Director and three Implementer seats on 2026-09-13. `sif`'s routing rewritten on 2026-09-14 (closure item 4, row 5; pull request #87, merged at `SHA: 6b5676b`; the smaller of the node's two ratified options) to the instruments this estate carries: cricket and its Codex legs, the Codex CLI's exec mode with the agent-tools codex-exec result reader (no instrument skill), the reviewer fleet, named background agents; the cross-vendor dialogue instrument (`the-codex-dialogues`) and its probe record stay at the lineage pin, named as such, so no instrument opens on Annex A's binding here. Proof: `validate-collaboration-state` and `validate-identity-naming` green as `repo-validators:check` legs (2026-09-13); for the rewrite, on `main` at `SHA: 6b5676b`: the skill file, its two generated adapters read byte-equal by `skills:check`, and the docs validators green (2026-09-14). |
| 6   | **Memory and the learning loop** — the reason the Practice exists                                              | napkin → distilled → pending-graduations → doctrine; consolidate-docs, curator-pass, knowledge-safety-sweep; the patterns corpus; experience letters; executive contracts; the operational registers                | Present. Registers present; patterns present: live doctrine cites nine pattern files, five imported at todo 1 (four of the nine, plus the one they link) and the other five (`referent-narrowing`, `baseline-transmits-its-stance`, `legitimate-principle-as-avoidance-cover`, `cross-session-pattern-emergence`, `fabricated-gate-as-avoidance`) imported from the pin on 2026-09-14 (closure item 4, row 6; pull request #85, merged at `SHA: eed1f2e`) with provenance lines, the cited-paths leg extended to resolve the `patterns/<name>.md` citation shape it had not read (red on the tree before the import: five citations of four absent paths in two rules and two skills; green after). Every register named at B2 has its disposition (item 4): `diagnostics/` and `threads/` existing; `quarantine/` with its README contract; `documentation-sync-logs/` and the deferred-controls register declared runtime-created, each with the moment that creates it; a curator pass's record is the commit plus the homed substance (PDR-081 §Amendment Log, 2026-06-14), and an owner ruling's homing proof is the plan of record's ruling rounds and the Director handoff file's routing log (the `permanent-doc-is-the-consolidation-record` rule). Proof: the manifest's 24 surfaces validating against its schema; the substrate audit in check mode reporting no manifest finding (its clean exit on a fresh checkout is lane A's item 3); the operational README table (2026-09-13). |
| 7   | **Planning and intent** — why work exists and who ratified it                                                  | The plan-node estate, strategy corpus, impact registry, plan validators; the knowledge-artefact homes (reports, research, analysis, proposals, explorations)                                                       | Present since 2026-09-13: the plan-node estate, with `validate-plan-corpus` a `repo-validators:check` leg. Proof: that leg green. |
| 8   | **Cross-platform projection** — one canonical source, thin adapters per platform                               | `.claude`, `.codex`, `.cursor`, `.agents`, `.gemini` + `GEMINI.md`, `.windsurf`, the surface matrix, portability and sub-agent validators, the adapter generators                                                   | Present for Cursor, Claude Code, Codex, `.agents/` and Gemini. `GEMINI.md` is the entry point; the per-role Gemini adapters under `.gemini/agents/` are the adapter generator's fourth surface, rendered from the sub-agent templates' declarations (closure item 6, pull requests #81, #83 and #84, merged 2026-09-14 at `SHA: d660ac7`, `SHA: aba2c0e` and `SHA: b17fee8`) and recomputed byte for byte, all four surfaces and the Codex registry's blocks, by `portability:check`; `subagents:check` reads the Cursor, Claude and Codex wrappers' pointer and identity lines against the templates. Windsurf is unsupported by ruling, recorded in the surface matrix. Proof: those two legs green on `main` (2026-09-14); `validate-cited-paths` green over `GEMINI.md`; the matrix §Notes |
| 9   | **Records and provenance** — what happened, why, and where it came from                                        | `provenance.yml`, the Core CHANGELOG, explorations, transplant manifests, ATTRIBUTION, the Practice's own research and reports about itself                                                                        | Present. The cited knowledge-base subset was imported at todo 1 with provenance lines naming the pin; the rest stays at the pin, re-importable (owner ruling, round 8). Proof: `validate-cited-paths` green (2026-09-13). |

**What a new repository needs, therefore:** functions 1, 2, 4, 6 and 7 with their mandatory
surfaces are the working minimum (the verification doc's §Mandatory Surfaces says the same
in path terms); 3, 5, 8 and 9 make it full. Product surfaces (an app, its vendors, its
domain docs, its design system) are never Practice, however many rules mention them; the
triage criterion from the rules pass holds: a surface belongs when the thing it governs
exists in the host or it is universal doctrine.

## What this transplant failed to migrate

### A. Found by exercising claims (doctrine cites it; the estate lacks it)

Measured 2026-09-13: 40 distinct backticked `.agent/` paths cited in live skills, rules and
directives do not resolve; 20 files cite them. After removing placeholders (`...`,
`YYYY-MM-DD`) and runtime-created directories, the real classes:

1. **Four pattern files** the lineage's doctrine depends on
   (`eager-rounding-off-on-partial-structures`, `inherited-framing-without-first-principles-check`,
   `parallel-worktree-dispatch-unreliable`, `passive-guidance-loses-to-artefact-gravity`; cited by
   `plan-body-first-principles-check`, `worktree-residency`, the commit skill and others). The
   patterns corpus (243 files) was dropped wholesale and its index regenerated to zero; the
   lineage's own doctrine cites seven of the 243. Those seven are Practice substance.
2. **Path drift inside the estate**: `skills/free-play/` (lives under `cognition/`),
   `reference/cross-platform-agent-surface-matrix.md` (lives under `memory/executive/`),
   nine `sub-agents/templates/*-reviewer.md` (the templates are `*-expert.md`; cited by the
   nine `invoke-*` skills and `author-skills`). Verified at the pin on 2026-09-13: the
   lineage's live surfaces carry none of these citations (they occur only in its old plans
   archive), so the drift is this estate's own, and a validator would have caught it.
3. **The Practice's knowledge base**: three `reports/agentic-engineering/` records and two
   `research/agentic-engineering/` directories are cited by rules and skills here and do not
   exist; `memory/operational/diagnostics/README.md` likewise.
4. **`sif` routes to dropped instruments**: `the-codex-dialogues` and `codex-helper` (9 citations)
   were dropped with the Oak MCP work; the invocation framework that names them stayed. (The
   2026-09-13 snapshot: superseded on 2026-09-14 by row 5, the routing rewritten to the
   instruments this estate carries.)
5. **The corpus-analysis workflow**: trimmed from `agent-tools` by ruling, yet its four
   sub-agent templates and Claude adapters (`corpus-mapper`, `-reducer`, `-voter`, `-meta`) and
   consolidate-docs §the synthesis engine (PDR-122) remain. Either the instrument returns or
   the templates go; today the estate claims a capability it cannot run.

### B. Found by the diff, awaiting a ruling or a wire

1. **Gemini and Windsurf projections** (`.gemini/` 20 files, `GEMINI.md`, `.windsurf/rules`):
   recorded as an owner decision at the transplant, still open.
2. **The operational registers** the learning loop writes to: `deferred-controls-register`,
   `director-rulings-ledger` (rulings live in the plan of record here), `quarantine/`,
   `diagnostics/`, `documentation-sync-logs/`, `curator-passes/`, `threads/` (one file). The
   substrate manifest declares several; the skills that write them exist; the directories do
   not. Runtime-created on first use, or a broken claim — the substrate audit decides.
3. **Installed but not activated**: `agent-tools` `practice-substrate` (the claimed/installed/
   activated audit as code; its script still says `pnpm -s`, which pnpm 12 rejects) and
   `validate-protocol-wire-contract` have no root script and no `check` leg; the `agent-tools`
   smoke suite (15 files) has no `test:e2e` script; `protocol:conformance`,
   `practice:substrate:check`, `lint:shell:syntax`, `check:profile`, `outdated`,
   `depcruise:report` are lineage root scripts absent here.
4. **The lineage's Practice research and reports** (`research/agentic-engineering` 44 files,
   `reports/agentic-engineering` 195, the experience letters 434, the curator passes 29): the
   record of why the Practice is shaped as it is. Not needed to work; needed to be full in the
   sense of "a new seat can learn why". Owner's call, per directory.
5. **Mutation testing** (`stryker`, `mutate`): `testing-strategy.md` cited it; the runner was
   never installed here.
6. **Rules dropped as vendor-shaped that carry a generic core**: `generator-first-mindset`
   (derivation doctrine beyond OpenAPI), `downstream-checkout-never-writes-upstream-surfaces`
   (multi-repo discipline this seat practised all day against OCE), `foreign-board-write-
   discipline`, `bot-identity-on-third-party-systems`. Ruled drops on 2026-09-12; the ruling
   stands unless the owner reopens it.

### C. What the diff cannot see

A function neither tree carries. Candidates from the day's work: an instrument that turns
"what belongs to the Practice" into a check (a Practice manifest: functions → surfaces →
existence and activation, run as a validator), and the cited-path check itself. Both are
proposals below.

## Proposals, each with a warrant and a falsifier

1. **A cited-paths validator** (backticked `.agent/` and `docs/` paths in live doctrine must
   resolve; placeholders and runtime directories allowlisted; archives excluded). Warrant: it
   found every class A item in one command and would have found them on 2026-09-12. Falsifier:
   if it reports more than a handful of true positives after class A is cured, the doctrine
   cites paths as prose too often for the check to be a gate, and it becomes advisory.
2. **Run the substrate audit as a gate**: fix `practice-substrate`'s `pnpm -s`, wire it and
   `validate-protocol-wire-contract` into `repo-validators:check`, and add the smoke suite as
   `test:e2e`. Warrant: the audit is the estate's own claimed/installed/activated check and
   already exists; class B2 and B3 are exactly its domain. Falsifier: if the audit is red on
   things the owner rules are runtime-created, the manifest is amended, not the gate.
3. **Import the seven doctrine-cited patterns** and the five doctrine-cited research and report
   records from the pin, scrubbed, as the Practice substance they are; leave the rest of the
   243 and the 195 to the owner's per-directory ruling. Warrant: doctrine cites them; a rule
   that cites an absent pattern is a latent refusal. Falsifier: if a cited pattern reads as
   Oak-product-specific on import, it is dropped and the citing rule rewritten instead.
4. **Resolve class A4 and A5 one way**: restore `corpus-analysis` + `workflow-build` (and
   `the-codex-dialogues` for `sif`) or remove the templates, adapters and citations. Warrant:
   a capability claimed and not runnable is the nominal-adoption shape this day has been
   curing. Falsifier: the owner's synthesis ruling ("one seat synthesises") makes the workflow
   unnecessary now; if so, removal is the honest cure and the instrument is re-importable at
   the pin later. (Resolved one way on 2026-09-14: `sif` rewritten to route to what this
   estate carries, row 5, pull request #87; the `corpus-analysis` and `workflow-build`
   restore is pull request #86, row 3, merged at `SHA: 47299c7` and read on that row;
   `the-codex-dialogues` stays at the pin.)
5. **Cure the path drift (A2) here and send it to the lineage** as findings batch 2.

## Unresolved evidence

- Whether the lineage regards the operational registers as runtime-created (B2); its
  substrate manifest is the source, and this estate carries the same manifest.

## Owner direction (2026-09-13, late morning)

The owner ruled that the entire Practice comes over, as appropriate for this repository's
context, with the record of what, how and why, and the installable-entity exploration. The
proposals above are carried as the delivery node
[`practice-completion`](../../plans/delivery/practice-completion.plan.md) (sketch, two owner
gates); the ecosystem frame is the installable-thing report's 2026-09-13 addendum. The nine-row
table is re-dated when each row's proof lands.

## Closure item 4 — completeness by function (2026-09-13, evening)

Lane C of the transplant closure (node §Transplant closure item 4). Each gap above that the
item names, with its disposition:

- **A1 residue (patterns).** Measured at item 4's review: live doctrine cites nine pattern
  files; four of the five imported at todo 1 are among them and five are absent
  (`referent-narrowing`, `baseline-transmits-its-stance`,
  `legitimate-principle-as-avoidance-cover`, `cross-session-pattern-emergence`,
  `fabricated-gate-as-avoidance`). The cited-paths leg reads only rooted `.agent/` and `docs/`
  citations, and these are cited relative to the patterns directory, so the class had no check.
  Both landed on 2026-09-14 as row 6's own pull request (the Director's slicing of the
  residue, 2026-09-14): the five files from the pin, scrubbed, with provenance lines, and
  the leg extended to resolve `patterns/<name>.md` against the patterns directory.
- **A4, A5 (`sif` instruments; the corpus workflow).** The node's ratified todo 1 governs:
  the corpus-analysis workflow (62 source files under `agent-tools/src/corpus-analysis/` at
  the pin) is restored from the pin, scrubbed, with provenance lines, so the four `corpus-*`
  templates and the consolidate-docs synthesis-engine pointer name a runnable instrument;
  the workflow file under `.agent/state/` the todo also names has no corpus referent at the
  pin, so nothing is restored under that directory (Director ruling, the todo's wording
  raised to the owner as a card); for `sif`, the ratified text offers
  "give it its concrete instruments or rewrite its routing", and the smaller is the rewrite
  (seven files at the pin against a routing paragraph), so `sif` routes to the instruments
  this estate carries. The restore landed on 2026-09-14 as row 3's own pull request (the
  Director's slicing of the residue, 2026-09-14); the routing rewrite follows as row 5's
  (neither `the-codex-dialogues` nor `codex-helper` is restored).
- **B1 (Gemini and Windsurf).** Gemini carried, Windsurf rejected (owner ruling, round 8).
  `GEMINI.md` is the entry point; the per-role command projection will be generated from the
  sub-agent templates by the adapter generator (basename identity; the four `corpus-*` seats
  narrowed in the platform-support contract): adapters are thin projections of canonical
  substance (PDR-009), and here they are generated (Director ruling 2026-09-13 under
  `compute-dont-hope`), so it lands with the generator pull request. The pin's empty Gemini settings file and its
  two product commands are not carried. Windsurf is recorded as unsupported in the surface
  matrix.
- **B2 (the operational registers).** Read at the pin: `curator-passes/` (a README contract
  and the lineage's pass records), `documentation-sync-logs/` (three collection logs),
  `quarantine/` (a README contract and one quarantined record), `deferred-controls-register.md`
  and `director-rulings-ledger.md`. Here, per the node's todo 3 (create or declare
  runtime-created, per the substrate manifest): `diagnostics/` and `threads/` already exist;
  `quarantine/` gains its README contract (imported, provenance line, scrubbed) and the
  manifest names it; `documentation-sync-logs/` and the deferred-controls register are
  declared runtime-created in the manifest, each entry naming the moment that creates it (a
  plan collection's first propagation step; the first control a plan here defers), the same
  shape as the commit queue's entry. A curator pass's record is the commit plus the homed
  substance, and an owner ruling's homing proof is the plan of record's ruling rounds and the
  Director handoff file's routing log (PDR-081 §Amendment Log, 2026-06-14, and the
  `permanent-doc-is-the-consolidation-record` rule, which rejects the disposition-ledger
  form); the lineage's pass records, rulings ledger, collection logs and quarantined record
  stay at the pin as its own records. The manifest's discovery roots that named lineage plans
  and absent archive directories are corrected in the same edit, and the audit's
  surface-count pin moves from 22 to 24 by its own contract.
- **B5 (mutation testing).** Already stated: `testing-strategy.md` records that no mutation
  runner is adopted and that the mutation check is a manual discipline on every gap-closing
  test. No edit.
- **B6 (the four generic rules).** Re-triaged under "bring unless product" and sent to lane B,
  the only writer of `.agent/rules/`, as one directed comms event
  (`f9f5dd67-cb49-4e69-9041-2802cfb62a7d`, absorbed 14:01Z): `generator-first-mindset` not brought (product; its generic core already lives in
  `principles.md` §Cardinal Rule); `downstream-checkout-never-writes-upstream-surfaces`,
  `foreign-board-write-discipline` and `bot-identity-on-third-party-systems` brought, adapted
  (lineage links replaced by the sentences they stand for, lineage systems and identities
  scrubbed, the host's own bot configuration the derivation source). They land as lane B's
  third pull request, born with frontmatter and generated adapters.

Unresolved evidence from above, closed: the lineage's own manifest declares `quarantine/` and
`diagnostics/` and none of the other registers, so "runtime-created" was never a manifest fact
there; here it is one, per surface, and the substrate audit validates the manifest against its
schema and its surface count on every run.
