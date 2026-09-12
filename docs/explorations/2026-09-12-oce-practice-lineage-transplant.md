---
type: exploration
status: sketch
date: 2026-09-12
ratified_by:
ratified_date:
ratified_where:
fitness_line_target: 400
fitness_line_limit: 560
fitness_line_length: 100
---

# OCE Practice Lineage Transplant

Transplant manifest for bringing the Oak Open Curriculum Ecosystem (OCE) Practice lineage into
`jimcresswell.net`, per
[PDR-005](../../.agent/practice-core/decision-records/PDR-005-wholesale-practice-transplantation.md)
(wholesale Practice transplantation) and
[PDR-004](../../.agent/practice-core/decision-records/PDR-004-explorations-as-durable-design-space-tier.md)
(explorations as the durable design-space tier).

> **Born sketch.** This plan governs no work until it carries an owner ratification stamp
> (`ratified_by` + `ratified_date` + `ratified_where`). Executed is not ratified.

**Source**: `/Users/jim/code/oak/oak-open-curriculum-ecosystem` — read-only for the duration.
OCE is a **sibling lineage**, not a canonical upstream. No OCE divergence is automatically
correct; each row is judged on substance.

---

## Owner rulings (2026-09-12)

Recorded as inputs, not yet a ratification of this plan.

1. **Adopt OCE naming.** Reviewers become `*-expert`. Where the two lineages diverge on a
   convention with no substantive difference, standardise on OCE's.
2. **File-grain checks required**, done mechanically — length first, then diff, never by loading
   files into context. Executed; see Finding 6.
3. **PDR-030 becomes a local ADR.**
4. **Triage all rules at content grain** — all 126 OCE rules, not a subset.
5. **Monorepo conversion is acceptable** if needed to host the agent tools: Turbo + pnpm, exactly
   two workspaces (`jcdotnet`, `@engraph/agent-tools`), on a fresh branch, with Vercel config
   changes as required to keep the site building.

**Budget consequence.** The original one-hour estimate assumed the opposite of rulings 1, 4 and 5.
Those three each expand scope. See [Execution](#execution) for the restated phasing; the
mechanical transplant is still about an hour, but it is now one phase of four.

---

## Problem frame

**Gap.** This repo's Practice is roughly 110 decision records behind its sibling: 27 PDRs
topping out at PDR-030 against OCE's 141 topping out at PDR-140. It lacks the three-mode memory
model (`active` / `operational` / `executive`), the `pending-graduations` register, the cognition
skill suite (parallax, free-play, concept-exploration), and `protocol.json`.

**Who it harms.** Every future session in this repo, and the owner who pays for the same lessons
twice.

**Mechanism.** Demonstrated, not hypothesised. PR #41 archived a 480-line napkin carrying ~57
learning bullets while promoting two entries to `distilled.md`. Four sampled lessons had no
permanent home; one was recorded as promoted to a file that never received it. That is what the
old lineage produces under fitness pressure when there is no graduation register to drain into —
the absent mechanism is the cause, not the agent.

**Constraints.** `pnpm check` is blocking and Practice-coupled (five validators; Finding 5). OCE
is read-only. Locally-unique substance must survive — what exists _only_ here, not every point
where the lineages differ.

**Success.** The OCE lineage runs here; every locally-unique row survives or is explicitly and
knowingly rejected in writing; gates green or their failure a recorded, scheduled debt.

---

## What the diff found

### Finding 1 — `practice-core` and the cognition skills are stale OCE copies

All 25 shared PDRs have diverged, and in 13 the **local file is longer**. That looks like local
elaboration. It is not.

Local PDRs carry `Host-local context (this repo only)` sections describing **OCE**: PDR-004 names
`oak-open-curriculum-ecosystem` as _"this repo"_; PDR-010 lists `elasticsearch-reviewer`,
`clerk-reviewer`, `sentry-reviewer`; PDR-013→023 cite Sentry, Knip and `algo-experiments`
instances; PDR-001 cites OCE ADR numbers. **18 of 27 `practice-core` files carry OCE antigens.**

Finding 6 extends this: the cognition skills are the same story. The extra length is stale source
context, not local substance.

### Finding 2 — Antigen contamination is confined

`practice-core/` 18 files · `skills/` 2 (`start-right-team`, `session-handoff`) · `reference/` 1
(`cross-platform-agent-surface-matrix.md`) · `plans/` 3. Directives, rules and sub-agents are
clean of OCE references — which is _not_ the same as being replaceable (Finding 7).

### Finding 3 — PDR-030 is a number collision that would silently destroy local doctrine

Local `PDR-030-rendering-risk-needs-blocking-visual-proof` vs OCE `PDR-030-plane-tag-vocabulary`.
Same number, different decisions. Local PDR-030 is the only genuinely local-unique PDR here and it
governs the visual-regression harness. A directory copy overwrites it with no conflict and no
signal. **Ruling 3: becomes a local ADR in `docs/architecture/decision-records/`.**

### Finding 4 — The editorial surface is unique, for a sharper reason than absence

OCE has `directives/editorial-tone.md`, governing **Oak's institutional voice** for Oak-named
outward copy. Local `editorial-guidance.md` (201) and `editorial-strategy.md` (249) govern **Jim
Cresswell's personal identity, voice, register and surface fit**. Different subject; OCE's file is
itself an antigen here. Preserved because OCE's cannot substitute, not because OCE lacks one.

_Worth taking separately:_ `editorial-tone.md`'s structural move — an explicit "where this applies
and where it must not" boundary separating narrative voice from builder-precision surfaces.

### Finding 5 — OCE's validators cannot travel; ours are load-bearing

OCE's live in `@oaknational/agent-tools`, a pnpm **workspace package**. This is a single-package
repo, so they cannot be copied. Local standalone equivalents in `scripts/` do the same jobs under
the same names, each with unit tests:

`validate-portability.mjs` · `validate-subagents.mjs` · `validate-practice-fitness.mjs` ·
`validate-fitness-vocabulary.mjs` · `validate-vital-surfaces.mjs`

Three are wired into blocking `pnpm check`. They are the single-repo expression of OCE's Practice
tooling and encode the _old_ structure — after transplant they validate the wrong shape.
**Ruling 5 resolves this**: convert to a two-workspace monorepo so the tools have a proper home.

### Finding 6 — Content-novelty analysis (ruling 2)

**Method.** 105 shared files matched across the two `.agent/` trees by four strategies: identical
relative path, basename anywhere, `SKILL.md`↔`SKILL-CANONICAL.md`, and `-reviewer`↔`-expert`.
Line-count and line-diff first (3 seconds). Line-diffs proved noisy — rewrapping inflates them
(`grammar-of-thinking.md` showed 163 differing lines at identical total length).

So the real measure is **8-gram set difference against OCE's entire 1,611-file corpus**
(2,690,125 distinct 8-grams). For each local file: what fraction of its content appears _nowhere_
in OCE? This catches content that merely **moved** between files, which pairwise diff cannot.
Scripts in the session scratchpad; 70 seconds to run.

**Result — safe to replace (novelty ≤ 25%):**

| Band   | Files                                                                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–14%  | **Most shared PDRs** (PDR-010 at 4%), `practice-verification` 10%, `CHANGELOG` 13%, `grammar-of-thinking` **0%**                                   |
| 15–24% | `skills/metacognition` 17%, `skills/undo-change` 18%, `skills/napkin` 19%, `skills/concept-exploration` 20%, **PDR-024 at 20%**, `practice.md` 24% |

`grammar-of-thinking.md` at 0% novel across 6,425 8-grams is the cleanest possible confirmation
that these are one lineage. The residual novelty in the PDRs _is_ the host-local antigen sections.

**Result — genuine local substance (novelty ≥ 60%):** all 17 sub-agent templates (94–100%), all
`invoke-*` rules (97–100%), `memory/napkin.md` 100%, `memory/distilled.md` 99%, `plans/roadmap.md`
100%, `directives/AGENT.md` 98%, `provenance.yml` 98%, `practice-index.md` 93%,
`directives/testing-strategy.md` 92%, `directives/principles.md` 92%,
`practice-core/practice-lineage.md` 76%, plus the local READMEs and `commands/go.md`.

### Finding 7 — Directives must be merged, not replaced

This corrects the first draft of this plan, which had directives as "portable-with-adaptation,
take OCE's". The novelty scores refute that.

`directives/principles.md` is 92% novel (1,189 of 1,285 8-grams) despite OCE's being 4× longer.
The reason is structural, not stylistic:

|       | Sections                                                                                                                                                                                                                                                                                                                                                                                              |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| local | First Question · Code Design · Type Safety · Testing · Tooling · **CSS and Accessibility** · Code Quality · Refactoring · Documentation                                                                                                                                                                                                                                                               |
| OCE   | **Decision Lenses** · Concept Exploration · Proportionality · First Question · Strict and Complete · Architectural Excellence · Owner Direction Beats Plan · Core Rules (Cardinal Rule · Separate Framework from Consumer · Context Specificity Gradient · Decompose at the Tension) · Code Design · Refactoring · Tooling · Code Quality · **Agentic Quality** · Testing · Any User Any Machine · DX |

OCE adds a governance layer local lacks; local carries site-domain specifics (CSS and
accessibility) OCE has no equivalent for. Neither is a subset. Same for `testing-strategy.md` (92%
novel — local is Vitest/Playwright/axe/visual-regression specific) and `AGENT.md` (98%).

**Merge, per-section, both directions.** Blind replacement loses the site's engineering doctrine.

### Finding 8 — Two files inside `practice-core` are exceptions to Finding 1

`practice-core/` is otherwise a clean wholesale replace. Two files are not:

- **`provenance.yml` (98% novel)** — this repo's own Practice lineage chain. Identity, not
  doctrine. Replacing it erases where this Practice came from.
- **`practice-lineage.md` (76% novel, 768 lines vs OCE's 301)** — carries the Practice Blueprint,
  Adaptation Levels, Practice Maturity, and the **three-zone fitness model with its threshold
  vocabulary**. High novelty here means OCE has _retired_ this content, so it cannot be recovered
  from OCE later. And `validate-practice-fitness.mjs` / `validate-fitness-vocabulary.mjs` depend
  on that zone vocabulary (PDR-022's host-local note names the scanner explicitly).

Deleting either breaks local tooling and local identity. Both are preserve rows.

---

## Portability gradient classification

PDR-005's vocabulary. The manifest is **inverted** — it classifies the destination (what must
survive), not the source (what arrives).

**Warrant.** PDR-005 mandates source-side classification because _"the transplant manifest IS the
substitute for the receiving Practice's gradient — performed by an agent with no established local
gradient."_ This repo has a gradient. The reason is absent; the risk PDR-005 forbids third —
**silent discard** — is fully live.

### Preserve

| #   | Row                                                                                                                        | Grade  | Evidence                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------- |
| P1  | `directives/editorial-guidance.md`, `editorial-strategy.md`                                                                | local  | Finding 4                                   |
| P2  | `skills/editorial-voice/`, `editor` expert, `invoke-editor` rule                                                           | local  | Editorial lane                              |
| P3  | `skills/pkg/`, `pkg-expert`, `invoke-pkg-*` rule                                                                           | local  | No OCE analogue                             |
| P4  | PDR-030 → local ADR                                                                                                        | local  | Finding 3 · ruling 3                        |
| P5  | `scripts/validate-*.mjs` + tests + gate wiring                                                                             | hybrid | Finding 5 → workspace                       |
| P6  | `directives/privacy.md`, `secops.md`                                                                                       | local  | No OCE equivalent                           |
| P7  | Architecture experts Barney / Betty / Fred / Wilma + rules                                                                 | hybrid | 94–100% novel                               |
| P8  | Site-domain skills: accessibility, react-component, design-system, config, security, quality-gates, docs-adr, architecture | hybrid | Site domain                                 |
| P9  | All 17 sub-agent templates + all `invoke-*` rules                                                                          | local  | 94–100% novel; rename only                  |
| P10 | `memory/` content — napkin, distilled, archive, experience                                                                 | local  | 99–100% novel; holds the 57 unhomed lessons |
| P11 | `plans/`, `prompts/`, `docs/architecture/decision-records/`                                                                | local  | Site history                                |
| P12 | `.agent/reference-local/`                                                                                                  | local  | Git-ignored private repo — do not touch     |
| P13 | `practice-core/provenance.yml`, `practice-lineage.md`                                                                      | local  | **Finding 8**                               |
| P14 | `directives/principles.md`, `testing-strategy.md`, `AGENT.md`                                                              | hybrid | **Finding 7 — merge per-section**           |

### Transplant

| Row                                                                                                                                                                                                                                                                                 | Grade                    | Note                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------ |
| `practice-core/` — 141 PDRs, trinity, `protocol.json` — **except P4, P13**                                                                                                                                                                                                          | fully-portable           | Findings 1, 6                              |
| `skills/cognition/` — parallax suite, free-play, concept-exploration, reason, metacognition, proportionality, retrospective, cricket                                                                                                                                                | fully-portable           | Local copies are 17–20% novel              |
| `skills/knowledge/` — napkin, consolidate-docs, consolidate-until-done, curator-pass, knowledge-safety-sweep                                                                                                                                                                        | fully-portable           | Graduation machinery                       |
| `skills/change-custody/` — pr-lifecycle, undo-change, semantic-merge                                                                                                                                                                                                                | fully-portable           | Supersedes local                           |
| Memory **model**: `active/` · `operational/` · `executive/` + `pending-graduations`                                                                                                                                                                                                 | fully-portable           | Structure only; P10 supplies content       |
| OCE directives with no local counterpart: `orientation`, `schema-first-execution`, `tdd-as-design`, `definition-of-delivery`, `continuity-practice`, `validation-strategy`, `operationalisation-contract`, `user-collaboration`, `agent-collaboration`, `cloud-environment-routing` | portable-with-adaptation | Net-new                                    |
| `sub-agents/templates/assumptions-expert.md`                                                                                                                                                                                                                                        | fully-portable           | **Required** by PDR-101's quorum           |
| `sub-agents/templates/`: `prose-expert`, `onboarding-expert`, `release-readiness-expert`, `code-expert`, `corpus-*`, `cricket-*`                                                                                                                                                    | portable-with-adaptation | Net-new capability                         |
| All 126 OCE rules                                                                                                                                                                                                                                                                   | —                        | **Ruling 4: full content triage.** Phase 3 |

### Reject — explicit, per PDR-005's ban on silent omission

| Row                                                                                                                                                                                                                                    | Rationale                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `.agent/state/` (16,620), `plans-*/` (~2,000), `reports/`, `experience/`, `research/`, `analysis/`, `milestones/`, `collaboration/`, `reference-local/`                                                                                | OCE's accumulated **corpus**, not machinery                                                   |
| `directives/editorial-tone.md`                                                                                                                                                                                                         | Oak institutional voice; wrong subject (Finding 4)                                            |
| OCE-domain skills: `slack-watcher`, `talk-to-slack-watcher`, `update-bulk-download-schema`, `update-upstream-api-spec`, `chatgpt-report-normalisation`, `the-codex-dialogues`, `ground-truth-*`, `codex-helper`, `update-dependencies` | OCE product domain; `update-dependencies` superseded by local `package-deps-up-to-date`       |
| `clerk-expert`, `sentry-expert`, `elasticsearch-expert`                                                                                                                                                                                | Vendors absent from this stack                                                                |
| `skills/planning/plan` as-is                                                                                                                                                                                                           | Depends on plan-node schema, impact-areas registry, Linear. Take the discipline, not the file |

---

## Monorepo conversion (ruling 5)

Fresh branch, ahead of the transplant. Two workspaces only.

| Workspace              | Holds                                                                       |
| ---------------------- | --------------------------------------------------------------------------- |
| `jcdotnet`             | The Next.js site — app, content, components, e2e, visual-regression harness |
| `@engraph/agent-tools` | The five Practice validators + their unit tests                             |

Work: root `package.json` with `workspaces` + `turbo.json`; `pnpm-workspace.yaml`; move
`scripts/validate-*.mjs` and tests into the tools package with its own `package.json` bin entries;
re-point root gate scripts at `pnpm --filter @engraph/agent-tools …`, mirroring OCE's shape.

**Vercel.** The project builds from repo root today
(`vercel.com/engraph/jimcresswell-net`). After conversion the Root Directory must point at the
site workspace and the install command must resolve the workspace root. This is the one step that
can break the live site, so it is proved on a preview deploy before merge.

**Verify:** `pnpm check` green from root; Vercel preview builds; PDF generation and the
visual-regression harness still run (both are build-coupled).

---

## Execution

### Scope correction (2026-09-12)

The first draft scoped the transplant around the 105 **shared** files and rejected much of the
rest as OCE corpus. That was wrong: the owner needs OCE's Practice and agentic-engineering
resources _whole_, including the files, folders and mechanisms with no local counterpart at all.

Measured machinery in scope — `skills` + `rules` + `directives` + `prompts` + `sub-agents` +
`reference` + `practice-core`:

|                                                                          | Files   |
| ------------------------------------------------------------------------ | ------- |
| Total machinery                                                          | **525** |
| Clean — copy verbatim                                                    | 268     |
| Carry OCE-specific references needing adaptation or documented retention | **257** |

Antigen breakdown across those 525: ADR-`NNN` references 143 · coordination vocabulary
(`comms`/`ARC`/`worktree`) 142 · curriculum domain 136 · Oak naming 82 · vendor experts 39 ·
Linear 27 · plan-node/impact-areas 7.

Net-new mechanisms with no local equivalent: `collaboration/` (87 — the ARC/comms coordination
substrate), `prompts/` (66 vs 8), `roles/`, `setup/`, `claude-harness-integrations/`,
`evaluations/` (the skill-eval mechanism), plans templates + node schema, and the memory registers.

Adapters are **generated**, not hand-written — OCE exposes `portability:fix`. That collapses
~800 adapter files across six platforms into a command, and is the single largest saving available.

### Phases and estimate

| Phase                           | Work                                                                                                                                                                                                             | Estimate    |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **1 — Monorepo**                | Turbo + pnpm; `jcdotnet` + `@engraph/agent-tools`; move validators; Vercel root-directory change proved on preview                                                                                               | 2–3 h       |
| **2 — Mechanical transplant**   | PDR-030 → ADR; tag pre-state; copy 268 clean files; install memory model; restore preserve set; `-reviewer` → `-expert`; run `portability:fix`                                                                   | 1–2 h       |
| **3 — Antigen adaptation**      | 257 files. Tier A scriptable (PDR host-local sections, path/name renames) ~140; Tier B real judgement (skills bound to OCE substrate — comms CLI, plan-node estate, Linear) ~85; Tier C reject as OCE-domain ~30 | 6–10 h      |
| **4 — Rules triage** (ruling 4) | 126 rules at content grain, adopt/adapt/reject with written rationale. The 8 name-shared rules are 97–100% novel — different rules, no free duplicates                                                           | 5–7 h       |
| **5 — Directives merge**        | Per-section merge of `principles`, `testing-strategy`, `AGENT.md` (Finding 7)                                                                                                                                    | 2–3 h       |
| **6 — Validators + fitness**    | Re-point the five validators at the new structure; resolve fitness metrics across ~600 newly-governed files                                                                                                      | 4–6 h       |
| **7 — Index + audits**          | Rebuild `practice-index.md` and local READMEs; four-audit close including cohesion                                                                                                                               | 3–5 h       |
|                                 | **Total**                                                                                                                                                                                                        | **23–36 h** |

Roughly **6–10 sessions**. The estimate's variance lives almost entirely in Phase 3 Tier B and
Phase 6: skills that depend on OCE substrate (comms CLI, worktree lanes, the plan-node estate,
Linear) either get adapted, get stubbed, or arrive inert.

**The shadow-layer risk.** Taking OCE-substrate-dependent skills as-is and letting them sit inert
would cut ~4 h from Phase 3 — and is precisely what PDR-005 warns against: _"a permanent shadow
layer of half-adopted infrastructure."_ Its three-state model (Received / Promoted / Rejected)
exists to prevent it. Every such skill therefore gets an explicit state, never silent inertness.

**Framing.** Per
[PDR-072](../../.agent/practice-core/decision-records/PDR-072-knowledge-curation-as-autonomic-learning.md),
this is Practice-substrate output, not overhead — it changes the conditions under which all
subsequent work in this repo is done. It is still 23–36 hours, and that is the owner's call to
size.

### Audits (PDR-005 four-audit close)

| Audit            | Method                                                                                                           | Phase                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Foreign-antigen  | grep `oak`, `oaknational`, `curriculum`, `sentry`, `elasticsearch`, `clerk`, `algo-experiments`, OCE ADR numbers | 2                          |
| Completeness     | Every P-row present and resolving                                                                                | 2                          |
| Manifest-closure | Every row executed or rejected in writing                                                                        | 4                          |
| **Cohesion**     | Transplanted directives do not contradict retained ADRs                                                          | 4 — cannot be done earlier |

---

## Falsifiers

- **Finding 1/6 (load-bearing).** Tested and passed: every shared PDR ≤ 14% novel,
  `grammar-of-thinking` 0%. Had any shared PDR scored high, wholesale replacement would have been
  unsafe. Re-run `novelty.sh` if the corpus changes.
- **Antigen load.** If Phase 2's post-copy grep returns more than ~50 distinct references needing
  hand resolution, the phasing is wrong — stop and stage further.
- **Vercel.** If the preview deploy does not build after conversion, Phase 1 does not merge.
  No transplant on an unbuildable site.
- **Cohesion.** Known unreachable before Phase 4. If it is never scheduled, this plan failed
  regardless of the other three audits.

## Residual risk and open rows

- 126 OCE rules undiffed at content grain against local TS/test discipline — Phase 3 resolves.
- `skills/working-with-graphs` may serve PKG — unassessed.
- `.claude/` · `.cursor/` · `.codex/` · `.agents/` adapter regeneration is coupled to P5 via
  `validate-portability`; adapter counts differ sharply (local 96/98/19/60 vs OCE 301/195/33/313).
- The 8-gram measure detects _presence_ of content, not whether OCE's version is better. Low
  novelty licenses replacement; it does not prove improvement.

## Ordering note

Run the transplant **before** the outstanding 57-lesson synthesis pass over
`archive/napkin-2026-08-12.md`. The old lineage has nowhere to route those lessons — no
`pending-graduations` register, no three-mode memory. That absence is _why_ PR #41 rotated
unearned. The transplant creates the destination; the synthesis then has somewhere to land.
