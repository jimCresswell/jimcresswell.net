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
"Surfaces" are the lineage's realisation; "here" is this estate's state on 2026-09-13.

| #   | Function                                                                                                       | Surfaces (lineage)                                                                                                                                                                                                  | Here                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | **Orientation** — a seat or a human lands and knows what this is, where to start, and what governs             | `AGENT.md`, `HUMANS.md`, `practice-index.md`, `README.md`, `orientation.md`, the start-right skills, `RULES_INDEX.md`, `skills.md`                                                                                  | Present; entry points describe this host                                                                       |
| 2   | **Doctrine** — the constitution and its amendment record                                                       | `practice-core/` (PDRs, verification, bootstrap, lineage, provenance, CHANGELOG, schemas), `principles.md`, the directives, the rules with adapters                                                                 | Present; 9 Core files amended locally, recorded in provenance                                                  |
| 3   | **Capability** — how work is done                                                                              | Skills (planning, change custody, cognition, knowledge, session lifecycle, collaboration), sub-agent templates and their adapters, commands, workflows (`.agent/state/*.workflow.js`, `agent-tools/workflow-build`) | Skills and templates present; workflows absent, their templates present (see gap A5)                          |
| 4   | **Enforcement** — the immune system: nothing claimed without a check                                           | `agent-tools` validators, the PreToolUse guard and policy, husky, CI parity, `check` and its legs, fitness budgets                                                                                                  | Present; two instruments installed but not activated (gap B3)                                                  |
| 5   | **Identity and collaboration** — seats know who they are and coordinate                                        | PDR-027 identity, collaboration-state (claims, registry, comms, heartbeat), rapid-comms, join ceremony, coordination branches, handoff records, sif                                                                 | Present; `sif` routes to instruments this estate dropped (gap A4)                                              |
| 6   | **Memory and the learning loop** — the reason the Practice exists                                              | napkin → distilled → pending-graduations → doctrine; consolidate-docs, curator-pass, knowledge-safety-sweep; the patterns corpus; experience letters; executive contracts; the operational registers                | Skeleton present; the patterns corpus is empty and four doctrine-cited patterns are absent (gap A1); registers absent (B2) |
| 7   | **Planning and intent** — why work exists and who ratified it                                                  | The plan-node estate, strategy corpus, impact registry, plan validators; the knowledge-artefact homes (reports, research, analysis, proposals, explorations)                                                       | Present since 2026-09-13; homes exist when needed                                                              |
| 8   | **Cross-platform projection** — one canonical source, thin adapters per platform                               | `.claude`, `.codex`, `.cursor`, `.agents`, `.gemini` + `GEMINI.md`, `.windsurf`, the surface matrix, portability and sub-agent validators, the adapter generators                                                   | Four platforms present; Gemini and Windsurf are an open owner decision (B1); one generator not yet a bin        |
| 9   | **Records and provenance** — what happened, why, and where it came from                                        | `provenance.yml`, the Core CHANGELOG, explorations, transplant manifests, ATTRIBUTION, the Practice's own research and reports about itself                                                                        | Present for this host; the lineage's Practice knowledge base not carried (B4)                                  |

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
   nine `invoke-*` skills and `author-skills`). Not a transplant miss; a lineage drift this
   estate inherited, and a validator would have caught it.
3. **The Practice's knowledge base**: three `reports/agentic-engineering/` records and two
   `research/agentic-engineering/` directories are cited by rules and skills here and do not
   exist; `memory/operational/diagnostics/README.md` likewise.
4. **`sif` routes to dropped instruments**: `the-codex-dialogues` and `codex-helper` (9 citations)
   were dropped with the Oak MCP work; the invocation framework that names them stayed.
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
   the pin later.
5. **Cure the path drift (A2) here and send it to the lineage** as findings batch 2.

## Unresolved evidence

- Whether the private editorial boundary (`.agent/reference-local/editorial-private/`) is
  cloned in this checkout: the path does not exist on disk today; the rule that names it is
  right, the checkout may be incomplete.
- Whether the lineage regards the operational registers as runtime-created (B2); its
  substrate manifest is the source, and this estate carries the same manifest.
