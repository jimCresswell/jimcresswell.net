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

**Source**: `the sibling OCE checkout` — read-only for the duration.
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

## Amendment 2026-09-12 — transplant started (owner) — state and corrected frame

**Owner corrections to the first evaluation.** Three things I reported as problems are not:

- **Workspace count.** Ruling 5 said two; seven were required because `agent-tools` depends on
  five `@engraph/*` tooling packages via `workspace:*`. That is the outcome, not a tension.
  `agent-tools` transplants at **full scope**.
- **Dangling adapters.** `.claude/`, `.agents/`, `.cursor/`, `.codex/` are **built artefacts**.
  They point at `.agent/` paths that moved because they have not been rebuilt yet, and they will
  not be rebuilt until the semantic merge below has run. Expected state, not error.
- **`.agent/` needing work.** A next step, not a defect.

**End state (owner-set).** `.agent-original/` is **gone**, and every piece of unique value in it
is preserved inside the updated `.agent/`. That is the acceptance test for the merge phase.

**Oak references (owner-set).** Where "Oak" names the **organisation** in migrated files, replace
with **Engraph**. Where it is more specific, decide case by case. There must be no Oak as package
name or code origin anywhere in this repo; the CV content is the only legitimate mention.

### State at evaluation

Branch `feat/monorepo`. Site moved to `jcdotnet/` (untracked). OCE `.agent/` copied in wholesale
(staged). Old Practice preserved as `.agent-original/` — all 14 preserve rows verified present.
`agent-tools/` and `tooling/*` copied and re-scoped to `@engraph/*`. Index: 747 tracked at HEAD →
11,732 staged, ~1.98M insertions.

**Semantic conflict residue from #47 (one file).**
`.agent-original/prompts/session-continuation.prompt.md` is two versions concatenated —
duplicate `## Current focus` and `## Other live threads`, contradicting on the primary workstream
(LinkedIn-current vs Track-B-primary), on tilt retirement (in progress vs complete), and on
workspace state. The napkin merged correctly (rotated + Ginger entry, 132 lines).
`linkedin-update.plan.md` is clean. This file is the first semantic-merge target.

**Index hygiene (before any commit).** No root `.gitignore` — it moved into `jcdotnet/`. Staged
as a result: `agent-tools/node_modules/` (6,154), `agent-tools/dist/` (4,676),
`.agent/.logs/statusline.log` ×5, `.agent/state/`, `.agent/operator-local/`. Root `.gitignore`
from OCE's as base → `git reset` → restage.

**OCE corpus copied in** (~4,400 of ~4,500 staged `.agent/` files; owner confirms deletable):
`plans-refounding` 705 · `plans-backlog-2026-07` 649 · `plans-old-archive` 593 · `reports` 527 ·
`memory` 521 (OCE content — structure only is wanted) · `experience` 434 · `research` 411 ·
`plans` 148 (templates + schema only) · `analysis` 38 · `archive` 26 · `proposals` 15 ·
`milestones` 5 · `state` 14.

**Root/workspace placement to correct.** Into `jcdotnet/` but belong at root (OCE keeps them at
root): `.gitignore`, `README.md`, `LICENSE`, `LICENSE-CONTENT`, `prettier.config.ts`,
`eslint.config.ts`, and this `docs/` directory. Left at root but belong with the site:
`__snapshots__/` (2 pre-migration JSON files, referenced nowhere — move or delete),
`accept-md.config.js`.

### Finding 9 — Oak reference load in `agent-tools` + `tooling`, by shape

Measured across `agent-tools/{src,tests,config}`, `tooling/`, `pnpm-workspace.yaml`,
`turbo.json`, excluding `node_modules` and `dist`:

| Shape                              | Files | Hits  | Treatment                          |
| ---------------------------------- | ----- | ----- | ---------------------------------- |
| `<upstream-scope>/` scope          | 465   | 1,102 | **Split by target** — see below    |
| `oak-open-curriculum-ecosystem`    | 37    | 110   | Org → mechanical rename            |
| `Oak National` / `oaknational.`    | 12    | 41    | Org → mechanical rename            |
| `oak-curriculum-mcp`               | 34    | 200   | Product-specific → case by case    |
| `thenational.academy`              | 10    | 42    | Product-specific → case by case    |
| `\boak\b` (lowercase, prose/paths) | 183   | 1,440 | Clusters in the seam modules below |

**The `<upstream-scope>/` split is decidable mechanically.** `agent-tools/package.json` already
declares only `@engraph/result`, `@engraph/safe-path`, `@engraph/type-helpers`. Source still
imports `<upstream-scope>/result` (409), `<upstream-scope>/type-helpers` (29), `<upstream-scope>/agent-tools`
(44), `<upstream-scope>/workspace-config` (27), `<upstream-scope>/eslint-plugin-standards` (17) — targets
that **exist here** as `@engraph/*` → rename. It also references `<upstream-scope>/sdk-codegen` (78),
`curriculum-sdk` (38), `oak-design-{assets,ink,tokens,system,react}` (~175), `design-tokens-core`
(28), `posthog-node` (27), `oak-search-sdk` (21) — targets that **do not exist here** → the code
importing them is excised, not renamed. The build is broken until this pass runs.

### Finding 10 — OCE domain-seam defect (report upstream)

Owner rule: there should be no curriculum content in `agent-tools`; if there is, OCE has a seam
problem. There is. 71 of 1,177 `agent-tools/src` files match curriculum vocabulary, and four
modules are OCE product code living inside the Practice tooling package:

| Module                            | Files   | Lines       |
| --------------------------------- | ------- | ----------- |
| `mcp-content-current-source`      | 71      | 8,330       |
| `mcp-conformance`                 | 23      | 2,691       |
| `mcp-content-workspace`           | 18      | 2,602       |
| `under-the-hood-content-generate` | 8       | 917         |
| **Total**                         | **120** | **~14,540** |

Treatment: excised here. Nothing is reported back to OCE (owner ruling, 2026-09-12).

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

OCE's live in `<upstream-scope>/agent-tools`, a pnpm **workspace package**. This is a single-package
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

### Phases and estimate (revised after transplant start)

| Phase                                               | Work                                                                                                                                                                                                                                                                                                                                                           | Estimate    |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **1 — Monorepo scaffold**                           | Done in outline: 7 workspaces, `@engraph/*` scope, site in `jcdotnet/`. Remaining: root `package.json` scripts, turbo wiring, husky, Vercel root directory                                                                                                                                                                                                     | 2–3 h       |
| **2 — Index hygiene + corpus removal**              | Root `.gitignore`; reset/restage; delete the ~4,400 OCE corpus files from `.agent/`; correct root/workspace file placement                                                                                                                                                                                                                                     | 1–2 h       |
| **3 — Oak → Engraph scrub** (Finding 9)             | Mechanical: org-shaped renames + `<upstream-scope>/*` → `@engraph/*` where the target exists. Case by case: `oak-curriculum-mcp`, `thenational.academy`. Excise: the four seam modules (Finding 10) and every import of a package that does not exist here. Rebuild `agent-tools` green                                                                        | 5–8 h       |
| **4 — Semantic merge** `.agent-original` → `.agent` | Per OCE `semantic-merge`: concept-level, not line-level. 255 files (excl. `reference-local`). Fix the doubled continuation prompt first. Numbering collision PDR-030 → local ADR per PDR-049. Reference cascade for every moved path. Emit as a reviewable diff; verdict "no _known_ invariant violated", never "complete". **Then delete `.agent-original/`** | 6–9 h       |
| **5 — Rebuild**                                     | `portability:fix` regenerates adapters against the merged `.agent/`; validators re-pointed; `-expert` rename lands here as part of the rebuild                                                                                                                                                                                                                 | 2–3 h       |
| **6 — Rules triage** (ruling 4)                     | All 126 OCE rules at content grain                                                                                                                                                                                                                                                                                                                             | 5–7 h       |
| **7 — Directives merge + index + audits**           | Per-section merge of `principles`, `testing-strategy`, `AGENT.md`; rebuild `practice-index.md`; four-audit close incl. cohesion                                                                                                                                                                                                                                | 5–8 h       |
|                                                     | **Total**                                                                                                                                                                                                                                                                                                                                                      | **26–40 h** |

Phase 3 grew from the first estimate because `agent-tools` is full scope (owner ruling) and
carries the seam modules. The semantic merge is a new named phase — it was implicit before and
is now the phase whose acceptance test is owner-set.

**The shadow-layer risk.** Taking OCE-substrate-dependent skills as-is and letting them sit inert
would cut ~4 h from Phase 3 — and is precisely what PDR-005 warns against: _"a permanent shadow
layer of half-adopted infrastructure."_ Its three-state model (Received / Promoted / Rejected)
exists to prevent it. Every such skill therefore gets an explicit state, never silent inertness.

**Framing.** Per
[PDR-072](../../.agent/practice-core/decision-records/PDR-072-knowledge-curation-as-autonomic-learning.md),
this is Practice-substrate output, not overhead — it changes the conditions under which all
subsequent work in this repo is done. The owner rejected the hour-count estimate as inflated; the
first hour's actual throughput is recorded in §Hour 1 below.

### Phase 8 — Harness integration (added 2026-09-12; not yet brought over)

A fourth layer the three-layer model missed: the wiring that binds Practice doctrine to the
platform runtimes and CI. Practice machinery, outside `.agent/`, not generated. Five agent-tools
validators fail today for exactly this absence. Bring over from OCE, adapted:

| Surface                    | Items                                                                                                                                                                                                                                                                                                   | Verdict                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Claude hooks + statusline  | `.claude/hooks/{run-pretooluse-guard,practice-session-identity,plan-gate-drift-alert}.mjs`, `_lib/log-hook-errors.sh`, `sonar-secrets/*`, `.claude/scripts/statusline-identity.mjs`; `settings.json` `hooks` (SessionStart / PreToolUse / UserPromptSubmit), `statusLine`, `skillListingBudgetFraction` | Bring over                                                                             |
| Codex / Cursor hooks       | `.codex/hooks/practice-session-identity.mjs`; `.cursor/hooks.json`, `.cursor/hooks/*session-identity.mjs`                                                                                                                                                                                               | Bring over                                                                             |
| `.agent/hooks/policy.json` | Overwritten by the local pre-transplant copy during the merge; lacks `blocked_patterns`, `platform_support`, `machine-local-path`                                                                                                                                                                       | Restore OCE's, merge local additions                                                   |
| Husky                      | `commit-msg`, `prepare-commit-msg`, `pre-merge-commit`, `pre-rebase`, `applypatch-msg`, `refuse-commit-on-main.sh`                                                                                                                                                                                      | Bring over                                                                             |
| CI                         | `ci.yml`, `codeql.yml`, `dependency-review.yml`, `release.yml`, `preview-serves.yml`, `actions/setup`, `codeql-config.yml`, `merge-bot.json.example`                                                                                                                                                    | Bring over, adapted (`check-ci-parity` checks `check:ci` against `ci.yml`)             |
| CI (reject / case by case) | `mcp-conformance-unattended.yml` — drop; `upstream-carrier.yml`, `upstream-mirror.yml` — only if this repo pulls OCE upstream                                                                                                                                                                           | —                                                                                      |
| Root config                | `.gitleaks.toml`, `.dependency-cruiser.mjs`, `knip.config.ts`, `commitlint.config.mjs`, `.releaserc.mjs`, `.nvmrc`, `.gitattributes`, `.prettierrc.json`, `.markdownlint.json`, `tsdoc.json`, `.cursorignore`, `.mcp.json.example`, `.sonarcloud.properties`                                            | Bring over; reconcile with `jcdotnet`'s own gitleaks/knip/prettier; Sonar key is local |
| Root docs                  | `SECURITY.md`, `CODE_OF_CONDUCT.md`, `skills.md`                                                                                                                                                                                                                                                        | Bring over. `VISION`, `BRANDING`, `ATTRIBUTION` are Oak — no                           |
| Gemini                     | 20 `.gemini/commands/review-*.toml` + settings, `GEMINI.md`                                                                                                                                                                                                                                             | **Owner decision**: adopt the platform or reject the surface                           |
| Small                      | `.claude-plugin/marketplace.json`, `.vscode/extensions.json`, `runtime-only-scripts/README.md`                                                                                                                                                                                                          | Bring over                                                                             |
| Statusline mark            | `agent-tools/src/claude/logo.ts` glyph art is the upstream acorn (a brand mark); replace with a mark for this estate or default the style to `none`                                                                                                                                                     | Decide with the statusline                                                             |
| Drop                       | `.design-sync/` (Oak design system), `.cursor/plans/*` (OCE plan records)                                                                                                                                                                                                                               | —                                                                                      |

Acceptance: `validate-claim-freshness`, `validate-pretooluse-guard-routing`, `validate-check-ci-parity`,
`validate-no-machine-local-paths` and `smoke:pre-tool-use-dispatch` pass.

### Owner re-sequencing (2026-09-12, round 3)

1. **Directives merge** first — it helps everything.
2. **Rules triage** — bring over only relevant rules.
3. **Harness integration** (Phase 8).
4. **Re-evaluate** before anything further.

Standing rule for this work: any document whose frontmatter no longer matches a valid schema
(plan-node, skill, directive, fitness) is updated to a valid schema when touched; the 39 legacy
plan files are the known batch.

### Directives merged; fifth surface found (2026-09-12, evening)

- `principles.md`: OCE structure; local sections inserted at role positions (value traceability,
  type safety, testing bullets, CSS and accessibility, documentation bullets, site gate sequence);
  Cardinal Rule, Architectural Model and Layer Role Topology rewritten for this repo.
- `testing-strategy.md`: tooling corrected; §Site Workspace Conventions added.
- `AGENT.md`: rewritten on OCE's structure with this repo's context, roster lanes, content-work
  section, commands and structure.
- **Fifth surface — the Practice documentation layer.** Directives and rules cite
  `docs/governance/*`, `docs/engineering/*`, `docs/foundation/*` and ~20 OCE Practice-governance
  ADRs. 29 Practice docs brought over with the org scrub (Oak-product docs rejected); product
  residue remains in ~16 (`extending` 24, `working-with-this-repo-for-devs` 21,
  `safety-and-security` 17 …) — a case-by-case pass. OCE ADR references were replaced with the
  PDR carrying the same doctrine where one exists; six directive links still dangle.
- Fitness: inherited hard/critical warnings on copied governance docs; substance not trimmed.

### Owner note (2026-09-12): `docs/governance` may be a pre-Practice artefact

`docs/governance/`, `docs/engineering/` and `docs/foundation/` in OCE may be artefacts of that
repo's pre-Practice origins. Those files — and other `docs/` files — may belong, in whole, in
part, or in concept, under `.agent/` (directives, reference, or the memory executive contracts).
The 29 docs brought over today are therefore **provisionally placed**; the re-evaluate step
decides each one's true home by role (PDR-014 §Knowledge artefact roles), not by the path it
arrived on. Directive links that point into `docs/` are to be treated as pointers to be re-homed,
not as evidence that `docs/` is the right home.

### Audits (PDR-005 four-audit close)

| Audit            | Method                                                                                                           | Phase                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Foreign-antigen  | grep `oak`, `oaknational`, `curriculum`, `sentry`, `elasticsearch`, `clerk`, `algo-experiments`, OCE ADR numbers | 2                          |
| Completeness     | Every P-row present and resolving                                                                                | 2                          |
| Manifest-closure | Every row executed or rejected in writing                                                                        | 4                          |
| **Cohesion**     | Transplanted directives do not contradict retained ADRs                                                          | 4 — cannot be done earlier |

---

## Hour 1 — executed 2026-09-12

Done, mechanically, in about an hour of agent time:

- Root `.gitignore` written (OCE base, product lines dropped); index reset and restaged.
- OCE corpus removed from `.agent/`: 4,500 → 603 files before the merge copy. Memory, plans,
  prompts and collaboration reduced to structure + registers.
- Root/workspace placement corrected: `README`, `LICENSE*`, `eslint.config.ts`,
  `prettier.config.ts`, `docs/` back to root; `__snapshots__/`, `accept-md.config.js` into
  `jcdotnet/`.
- Oak → Engraph: org-shaped renames applied across `agent-tools`, `tooling`, workspace config;
  the four seam modules (~14.5k lines) and their scripts excised; `<upstream-scope>/*` renamed
  wherever the target exists as `@engraph/*`.
- Semantic-merge copy from `.agent-original` → `.agent`: 4 local directives, 21 local skills,
  21 local rules, 17 sub-agent templates renamed to `-expert` (frontmatter + references),
  commands, plans, prompts, memory content into `active/`, experience, reference, hooks,
  practice-context, state, collaboration. PDR-030 re-homed as **ADR-022**. The doubled
  `session-continuation.prompt.md` reconciled into one authoritative version.
- Vendor experts (`clerk`, `sentry`, `elasticsearch`) and their invoke rules dropped.
- Root `package.json` scripts wired through turbo and `@engraph/agent-tools`; `jcdotnet`
  gained a `type-check` alias so turbo reaches it.

Judgement calls made during the copy, flagged for review rather than hidden:

- **Local won on 11 same-named expert templates** (`accessibility`, `code`, `config`,
  `design-system`, `docs-adr`, `mcp`, `react-component`, `security`, `subagent-architect`,
  `test`, `type`). Local versions are 94–100% novel site-domain content; OCE's carried monorepo
  and Turbo knowledge now absent from `.agent/`. A per-template merge is still owed.
- `provenance.yml` and `practice-lineage.md` left as OCE's; the local versions remain only in
  `.agent-original/practice-core/` pending a lineage decision (P13).
- Historical records (napkin, experience, archived plans) were **not** rewritten for the
  `-reviewer` → `-expert` rename; they are records.

Still open after hour 1 (in priority order): `tooling/eslint` boundary rules encode OCE's
package topology (≈470 `<upstream-scope>/` hits) — rewrite for this repo's topology or drop the
boundary rule family; case-by-case Oak mentions in `agent-tools` tests/fixtures; `tsc` green on
`agent-tools`; `portability:fix` adapter rebuild; P13 lineage decision; the 11 template merges;
directives merge (Finding 7); 126-rule triage; `.agent-original/` deletion once the loss-scan
diff has been reviewed by the owner (semantic-merge skill: the author's own scan is not a
completeness certificate).

## Owner rulings — round 2 (2026-09-12) and what was executed

| Ruling                                                                                             | Executed                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Drop the eslint boundary family                                                                    | Rules, `configs/base.ts`, vendor-import rules, `validate-boundaries`, consumers in `result`/`safe-path`/`type-helpers`, README section — removed; plugin type-checks clean                                                     |
| Drop Oak's MCP work; third-party MCP tools stay                                                    | Conformance smoke, plugin-binding test, `the-codex-dialogues`, Oak MCP tools spec — removed                                                                                                                                    |
| Local `mcp` skill / `mcp-expert` is an upstream backronym defect                                   | Skill, template and invoke rule removed; cross-platform coherence stays with `subagent-architecture` + validators                                                                                                              |
| P13: OCE's history plus an entry recording the JC merge                                            | Entry added under `practice-lineage.md` in `provenance.yml`; OCE's Fitness Functions section already carries the three-zone model, so no local section merged                                                                  |
| Validators: agent-tools wins                                                                       | Root scripts already route there; `vital-surfaces` port and retirement of `jcdotnet/scripts/validate-*.mjs` still to do                                                                                                        |
| Per-template merge of the 11 experts                                                               | Contract conformance done 2026-09-12 (adapters generated, component references added); the content-grain merge of OCE's richer template bodies remains for re-evaluate                                                         |
| Owner reviews the loss-scan before `.agent-original` deletion                                      | Pending owner                                                                                                                                                                                                                  |
| Keep `@jimcresswell/www`                                                                           | No change                                                                                                                                                                                                                      |
| Retire `commands/` once `portability:fix` proves regeneration                                      | Done 2026-09-12 — `.agent/commands`, `.claude/commands`, `.cursor/commands` removed; `editor` usage folded into `invoke-editor`, `go` gained the continuation-prompt step                                                      |
| Drop both third-party MCP rules (Sonar, Linear)                                                    | Removed                                                                                                                                                                                                                        |
| Adopt the plan-node estate; rewrite `impact-areas.md`; migrate local plans later                   | Pending                                                                                                                                                                                                                        |
| Empty the OCE-seeded registers                                                                     | `pending-graduations`, `frictions-register`, `repo-continuity` emptied to doctrine + skeleton; `open-questions` carried no entries                                                                                             |
| Rewrite `.agent/README.md`, `HUMANS.md`, `practice-index.md` now                                   | Pending — next                                                                                                                                                                                                                 |
| Directives merge: OCE structure, local sections at role positions                                  | Pending                                                                                                                                                                                                                        |
| Trim `refounding`, `restatement-audit`, `corpus-analysis`, `typescript-estate`, `workspace-census` | Trimmed; five `refounding` leaf modules restored because `plan-state` (adopted) imports them                                                                                                                                   |
| Residual Oak pass: agent does it                                                                   | Done — 0 `<upstream-scope>`, 0 "Oak", 0 Oak domains in `agent-tools`/`tooling`; rule namespace is `@engraph/`; `oak-session-identity-hook` → `session-identity-hook`, `oak-logo` → `logo` (glyph art still an acorn — replace) |
| Leave historical records                                                                           | No rewrite of napkin/experience/archived plans                                                                                                                                                                                 |
| Rules triage: one pass, table in this plan                                                         | Done 2026-09-12 — see §Rules triage below                                                                                                                                                                                      |
| Vercel root directory: owner, before the PR                                                        | Pending owner                                                                                                                                                                                                                  |
| Hooks: light commit, full push                                                                     | `.husky/pre-commit` = prettier on staged + turbo lint on changed workspaces; `.husky/pre-push` = `check:ci` + site e2e                                                                                                         |
| Review `tsconfig.base.json` now                                                                    | Reviewed: generic compiler options only, nothing OCE-specific; kept                                                                                                                                                            |
| 57-lesson synthesis right after `.agent-original` deletion, with quorum                            | Pending                                                                                                                                                                                                                        |

### Round 2 — further drops and resolutions

- Dropped as Oak product/ops domain: skills `chatgpt-report-normalisation`, `codex-helper`,
  `slack-watcher`, `talk-to-slack-watcher`, `update-bulk-download-schema`, `update-dependencies`,
  `update-upstream-api-spec`, `ground-truth-design`, `ground-truth-evaluation`,
  `orientation/under-the-hood`; rules `oak-chrome-session-is-metered`,
  `source-curriculum-content-via-api-not-cdn`, `eef-corpus-grounding`, both `notion-*`;
  directive `editorial-tone.md`; expert `ground-truth-designer`.
- Kept after inspection: `working-with-graphs` (generic graph doctrine — serves PKG; closes that
  open row), `domain-craft/ui-design/*`, `orientation/working-with-agentic-ai`.
- `validate-vital-surfaces` has no OCE equivalent; it checks the local
  `reference/cross-platform-agent-surface-matrix.md`, which OCE supersedes with
  `memory/executive/cross-platform-agent-surface-matrix.md` + `validate-portability`. Verdict:
  retire the local validator and matrix once `portability:check` passes against OCE's matrix.
- `.agent/README.md` and `HUMANS.md` rewritten for this repo; `practice-index.md` rewritten from
  the live inventory.

### Validators and adapters after round 2

- `pnpm portability:check` **passes**: 51 canonical skills, 131 canonical rules, 131 Cursor
  triggers, 131 Claude rules, 131 `.agents` rules. `portability:fix` regenerated rules/skills
  adapters; 117 Cursor triggers and 80 expert wrappers were scripted (copied from OCE or from
  HEAD with the `-expert` rename); `RULES_INDEX.md` generated from `.agent/rules/`.
- `pnpm subagents:check`: 175 issues in four classes, all the adapter/template **contract**
  (unrecognised `tools`/`readonly` frontmatter, missing template loading line, Cursor wrapper
  reference form, missing identity/reading-discipline components). This is the pending
  per-template merge, not new breakage.
- `agent-tools` `build` restored (it had been dropped with the trimmed workflow scripts);
  `tsc` clean.

### Process records (owner request, 2026-09-12)

- Napkin: `.agent/memory/active/napkin.md` §Session 2026-09-12 — running capture of the
  transplant, mistakes and patterns.
- [`.agent/reports/practice-transplant/efficiency-guidance.md`](../../.agent/reports/practice-transplant/efficiency-guidance.md)
  — how to do the next transplant efficiently; graduation target: PDR-005 amendment or runbook.
- [`.agent/reports/practice-transplant/practice-as-installable-thing.md`](../../.agent/reports/practice-transplant/practice-as-installable-thing.md)
  — concept-exploration of packaging the Practice; status provisional; five proposals with
  falsifiers.

State after round 2: 2,504 files tracked; `agent-tools` and the eslint plugin type-check clean.

## Rules triage — executed 2026-09-12 (ruling 4, one pass)

Criterion: a rule stays when the surface it governs exists here (a skill, a CLI, a platform, a
workflow this repo runs) or it is universal engineering or behavioural doctrine; it goes when its
subject is an upstream product, vendor or organisational arrangement this repo does not have.
Dated worked instances and upstream ticket keys (`MCP-393`, `PR #315`) stay as provenance; upstream
ADR citations, paths and product names do not. Inputs: 126 OCE rules, 29 pre-transplant local rules.
Output: **127 canonical rules** — 111 from the lineage (46 adapted, 65 unchanged beyond the org
scrub) and 16 local (the twelve `invoke-*-expert` lanes, `napkin-always-active`, `no-skipped-tests`,
`no-type-shortcuts`, `tsdoc-and-documentation-hygiene`). Adapters and `RULES_INDEX.md` regenerated;
`portability:check` passes; zero broken links in `.agent/rules/`.

| Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Verdict | Change                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bot-identity-on-third-party-systems`                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Drop    | No bot identity exists here; the body is the upstream bot, its App id and Linear                                                                                                                                          |
| `foreign-board-write-discipline`                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Drop    | Linear/Notion boards; links to the two dropped `notion-*` rules                                                                                                                                                           |
| `downstream-checkout-never-writes-upstream-surfaces`                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Drop    | This repo is not a downstream checkout of anything                                                                                                                                                                        |
| `generator-first-mindset`                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Drop    | SDK codegen / OpenAPI; the derivation doctrine here is the Cardinal Rule and `schema-first-execution.md`                                                                                                                  |
| 11 dropped in round 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Drop    | `invoke-{clerk,elasticsearch,mcp,sentry}-expert`, `linear-mcp-*`, `notion-*` ×2, `oak-chrome-*`, `sonarqube-mcp-*`, `source-curriculum-*`, `eef-*`                                                                        |
| `apply-architectural-principles`                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Merge   | Local text (value tracing, EDRs) + OCE pointer; ADR index path localised                                                                                                                                                  |
| `follow-the-practice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Merge   | Local canonical chain + OCE "not a single file"                                                                                                                                                                           |
| `tdd-for-refactoring`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Merge   | Local "not an exception to TDD" + OCE signature-first RED                                                                                                                                                                 |
| `lint-after-edit`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Merge   | OCE thresholds (match `@engraph/eslint`) + local gate-restart sentence                                                                                                                                                    |
| `read-agent-md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Merge   | OCE worked instance + local re-read trigger                                                                                                                                                                               |
| `subagent-practice-core-protection`                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Merge   | OCE body + local root entry points bullet; upstream ADR block removed                                                                                                                                                     |
| `invoke-editor`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Merge   | Retired `/jc-editor` command usage folded in                                                                                                                                                                              |
| `strict-validation-at-boundary`                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Adapt   | MCP tool-surface paragraph → this repo's boundaries (content JSON, env, fetches); header → principles + typescript-practice                                                                                               |
| `no-global-state-in-tests`, `no-conditional-tests`, `test-immediate-fails`                                                                                                                                                                                                                                                                                                                                                                                                                             | Adapt   | ADR-011/078/161 → `testing-strategy.md` §Stubs vs Fakes; `initialiseSentry` example generalised                                                                                                                           |
| `verify-data-supports-shape-before-building`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Adapt   | Oak bulk-export instance → entity model (ADR-020); EEF/MCP failure modes generalised as lineage instances                                                                                                                 |
| `read-nextjs-docs-before-coding`                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Adapt   | Path → `jcdotnet/node_modules/next/dist/docs/`; Clerk instance generalised; ADR-009 proxy named                                                                                                                           |
| `design-values-come-from-the-system`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Adapt   | `@engraph/oak-design-system` → `jcdotnet/app/globals.css` (`:root` + `@theme`); archive path and MCP tickets removed                                                                                                      |
| `render-the-reference-before-reproducing`                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Adapt   | DDR-009 / showcase widths → visual-regression harness (ADR-022)                                                                                                                                                           |
| `no-warning-toleration`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Adapt   | ADR-163 / Sentry / `sentry-expert` / CodeQL exception removed; owner ruling "no errors and no warnings of any kind" cited                                                                                                 |
| `never-disable-checks`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Adapt   | Rule URL → `tooling/eslint/src/rules/no-eslint-disable.ts`; widget/a11y/Sentry gates generalised                                                                                                                          |
| `use-result-pattern`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Adapt   | `apps/**` paths removed; `@engraph/result` named; `no-throw-statement` off by owner ruling recorded; `preserve-caught-error` named as the mechanical check (not yet enabled)                                              |
| `identify-as-agent-under-shared-credentials`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Adapt   | Bot frame → "no bot identity here yet, owner credentials"; Notion ledger clauses removed                                                                                                                                  |
| `capability-landing-decision-procedure`                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Adapt   | "Oak skills/content", curriculum audience, WS0 report link → repo-authored, sites' content                                                                                                                                |
| `skill-naming-and-description-quality`, `plan-body-first-principles-check`                                                                                                                                                                                                                                                                                                                                                                                                                             | Adapt   | "Oak-authored" → "repo-authored"; ADR-217 → "an ADR (upstream lineage)"                                                                                                                                                   |
| `third-party-skills-require-security-review`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Adapt   | ADR-125 → PDR-009 / skills README; clerk/mcp-inspector adoptions → "none here"                                                                                                                                            |
| `source-is-typescript-esm-only`                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Adapt   | ADR-001/168 → principles §Tooling; `oak-theme.js` generalised                                                                                                                                                             |
| `no-parallel-long-lived-branches`                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Adapt   | "Linear-ticketed" → "ticketed"; AIP gates → "as they land here"                                                                                                                                                           |
| `no-hedging-vocabulary`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Adapt   | Curriculum/lesson examples → content prose; ADR-078 → testing strategy                                                                                                                                                    |
| `pr-comments-resolve-and-recheck`                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Adapt   | F-130 register pointer (register emptied) → "not yet built here"                                                                                                                                                          |
| `coordination-branch-24h-lifetime`, `directed-routing-requires-absorption-ack`                                                                                                                                                                                                                                                                                                                                                                                                                         | Adapt   | "moved for teachers" → "for the sites"; dangling delivery-plan path removed                                                                                                                                               |
| `register-identity-on-thread-join`                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Adapt   | Hook/mirror/env names → `practice-session-identity.mjs`, `practice-composer-session.local.json`, `PRACTICE_AGENT_IDENTITY_OVERRIDE`; threads README copied                                                                |
| `per-user-memory-is-a-buffer`, `present-verdicts-not-menus`, `use-monitor-for-event-driven-wake`, `executive-memory-drift-capture`                                                                                                                                                                                                                                                                                                                                                                     | Adapt   | `oak-*` skill invocations → `jc-*`                                                                                                                                                                                        |
| `agent-state-observable`, `continuity-surface-commits-as-orphans`, `handoff-messages-self-contained`, `capture-practice-tool-feedback`, `documentation-hygiene`, `markdown-code-blocks-must-have-language`, `pre-merge-divergence-analysis`, `invoke-assumptions-expert`, `invoke-code-experts`, `invoke-doc-and-onboarding-experts-on-significant-changes`, `unattended-seats-never-prompt`, `practice-core-portability`, `verify-dont-trust`, `lockfile-rebuild-survivability`, `read-before-asking` | Adapt   | Upstream ADR citations → the local home (PDR-011/014/023/009/057, principles §Code Quality, `sub-agents/README.md`, plan-node README, `safety-and-security.md`); dangling quarantine/troubleshooting/report links removed |
| `comms-all-channels-watcher`, `liveness-heartbeat-cron`, `ping-before-escalate`, `follow-agent-collaboration-practice`, `check-singleton-per-window`, `worktree-hygiene`, `worktree-residency`                                                                                                                                                                                                                                                                                                         | Adapt   | ADR-182/183/186/197/204 → "the `agent-tools` comms substrate" / `.agent/state/README.md`; state README, conventions and scaffolding copied                                                                                |
| `never-commit-to-main`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Adapt   | `.husky/refuse-commit-on-main.sh` copied and wired into `pre-commit` (rest of the hook set is Phase 8)                                                                                                                    |
| `design-from-impact-not-the-cowpath`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Adapt   | One word ("curriculum/orientation" → "domain/orientation")                                                                                                                                                                |
| 65 remaining lineage rules                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Keep    | Unchanged beyond the org scrub — universal doctrine or substrate that exists here                                                                                                                                         |

Also landed in the pass: `ATTRIBUTION.md` (documentation-hygiene §2 requires it; records the lineage);
`OAK_*` environment variables, `OakLogoStyle`, `OAK_LOGO_ROWS` and `oak-composer-session` renamed to
`PRACTICE_*` / `LogoStyle` / `LOGO_ROWS` / `practice-composer-session` across `agent-tools` and docs
(tsc clean, 308 targeted tests green); `oak-logo.test.ts` → `logo.test.ts`. Left for Phase 8: the
statusline glyph art is still the upstream acorn mark; `OAK_API_KEY` survives only in two copied
governance docs (re-home pass); `preserve-caught-error` is not yet enabled in `@engraph/eslint`.

**Duplicate skills in the Claude Code picker (owner report 2026-09-12).** The documented collision is
`.claude/commands/jc-<name>.md` beside `.claude/skills/jc-<name>/SKILL.md` (ten names). Retiring
`commands/` removes it. Falsifier: if the picker still lists doubles after a restart, the remaining
suspect is `.agents/skills/` (identical `jc-*` names; discovery undocumented) and the cure is to stop
emitting the `.claude/skills/` wrappers, since the open-standard directory would then serve both
Claude Code and Codex.

## Phase 8 — executed 2026-09-12 (harness integration)

Executed after the rules triage, in the owner's order. The wiring that binds doctrine to the
runtimes now exists on this estate; everything below is tracked and exercised.

| Surface                    | Landed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude hooks + statusline  | `.claude/hooks/{run-pretooluse-guard,practice-session-identity,plan-gate-drift-alert}.mjs`, `_lib/log-hook-errors.sh`, `secrets/{pretool,prompt}-secrets.sh` (the Sonar-CLI best-effort scans, renamed off the brand), `.claude/scripts/statusline-identity.mjs`; `settings.json` carries `hooks` (SessionStart, PreToolUse Bash/Edit/Write/Read, UserPromptSubmit), `statusLine` (the JC mark) and `skillListingBudgetFraction`. Guard verified live: it fired in the transplanting session.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `.agent/hooks/policy.json` | OCE's 34 Bash blocked patterns and six content-guard concept groups restored; description and citations localised; `platform_support` re-grounded 2026-09-12 (Claude Code pinned 2.1.269; the other platforms carried with an explicit "not exercised here" note and `not-tracked` pins). README brought over.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Codex / Cursor             | `.codex/hooks/practice-session-identity.mjs` + `config.toml` SessionStart wiring and `RULES_INDEX.md` fallback; `.cursor/hooks.json` + `hooks/practice-session-identity.mjs`, `scripts/{statusline-identity,install-statusline-cli-config}.mjs`, `statusline.cli.fragment.json`. The Cursor hook bin renamed `cursor-session-identity-hook`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Husky                      | Full hook set: light `pre-commit` (branch guard, prettier-staged, markdownlint-staged, lint on changed workspaces), `commit-msg` (major-version guard + commitlint), `prepare-commit-msg`, `pre-merge-commit`, `applypatch-msg`, `pre-rebase`, full `pre-push` (`pnpm check` + site e2e). `lint:shell` covers them.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| CI                         | `ci.yml` (secret-scan, install, static-checks, build-and-test, e2e) replaces `check.yml`, `e2e.yml`, `validators.yml`; `codeql.yml` + `codeql-config.yml` (actions + javascript-typescript, `.agent-original` ignored), `dependency-review.yml`, `actions/setup`, `merge-bot.json.example`. `validate-check-ci-parity` passes: every leg of `pnpm check` is a CI step. `release.yml`/`.releaserc.mjs`, `preview-serves.yml`, `upstream-*.yml`, `mcp-conformance-unattended.yml` not brought (nothing to release, no upstream, no MCP server).                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Root config                | `.gitleaks.toml` (three allowlists kept: reference docs, test fixtures, `SHA:` audit refs), `knip.config.ts` (fresh, seven workspaces), `.dependency-cruiser.mjs` (product rules dropped; hook-policy, substrate, workspace-config and ESM rules kept) + `tsconfig.depcruise.json`, `.nvmrc` (24), `.gitattributes`, `tsdoc.json`, `.cursorignore`, `eslint.runtime-only.config.mjs`, `.vscode/extensions.json`, `runtime-only-scripts/README.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `skills.md`. Prettier split: root `prettier.config.ts` carries the tooling convention, `jcdotnet/prettier.config.ts` the site's; `.prettierignore` and the markdownlint config adopt the lineage footprint (canonical corpus and generated adapters excluded from prettier; lineage rule set for markdownlint). `.mcp.json.example`, `.sonarcloud.properties` (needs a SonarCloud project — owner decision) and `.claude-plugin/marketplace.json` (Oak product) not brought. |
| Root scripts               | `pnpm:devPreinstall`, `postinstall` (agent-tools bootstrap), the `agent-tools:*` aliases the rules cite, `secrets:scan*`, `skills:check`, `skills:generate`, `encoding:check`, `knip[:gate]`, `depcruise`, `lint:runtime-only`, `docs-validators:check`, `plan-gates:check`, `format:root`/`markdownlint:root`(lineage names) beside the local names.`pnpm check` is now the read-only aggregate (`check:ci`its alias),`pnpm fix`the mutating pass,`check:fix` the chain; AGENT.md, principles, README and the quality-gates skill say so.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Sub-agent conformance      | 175 issues → 0: Claude wrappers reshaped to the lineage contract, Cursor and Codex adapters generated for all 27 templates, `.codex/config.toml` registry regenerated, the 16 local templates gained the reading-discipline and identity component references.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Tests                      | agent-tools suite green after: two upstream-only tests removed (`the-codex-dialogues` probe, release config), the design-review register validator removed, fixtures localised (depcruise `tooling/` paths, spawn `jc-<slug>` worktree prefix, Codex roster).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

Acceptance: `validate-claim-freshness`, `validate-pretooluse-guard-routing`, `validate-check-ci-parity`, `validate-no-machine-local-paths`, `smoke:pre-tool-use-dispatch`, `validate-workspace-config-isolation`, `smoke:install-version-guard`, `validate-policy-reappraisal`, `validate-lifecycle-scripts` all pass. Still failing, all outside Phase 8: `validate-patterns-index` (no pattern files yet), `validate-plan-corpus` / `check-plan-gate-drift` (plan-node migration), `validate-ratified-lists` (upstream refounding artefacts — retire with the trimmed module), `validate-fitness-vocabulary` (`.agent-original` only), `smoke:collaboration-tui` (needs the machine-local closed-claims archive), `smoke:codex-session-alert-bootstrap` (`pnpm -s` is not accepted by pnpm 12).

**Lesson (recorded in the efficiency guidance):** writing `.claude/settings.json` hooks before the policy file exists locks the session out of Bash, Edit and Write at once — the guard fails closed by design. Restore `policy.json` first, wire settings second.

### Oak residue in tooling (scan 2026-09-12, for replacement at re-evaluate)

`git grep -i oak -- agent-tools tooling` after Phase 8. Three classes, none load-bearing today:

- **Product code (2 files, fix first).** `agent-tools/src/pr-throughput/gh-fetch.ts` hard-codes
  `CANONICAL_REPOSITORY = 'oaknational/jimcresswell.net'` — a scrub artefact that names a repo
  which does not exist; derive it from the git remote or set `jimCresswell/jimcresswell.net`.
  `agent-tools/src/pr-throughput/index.ts` links PDR-130/131 by upstream GitHub URLs on an OCE
  coordination branch; repoint to the local `.agent/practice-core/decision-records/` files.
- **Package metadata (5 files).** `repository`, `bugs` and `homepage` in
  `tooling/{eslint,result,safe-path,type-helpers,workspace-config}/package.json` still name
  `oaknational/jimcresswell.net` and `packages/core/<name>` paths; set the real remote and
  `tooling/<name>`.
- **Test fixtures (14 files).** Neutral stand-ins wanted (`example-org/example-repo`,
  `linear.app/example-org/…`): `src/claude/statusline-owner-jobs.unit.test.ts`,
  `src/merge-bot/{cli,mint-installation-token,repo-config}.unit.test.ts`,
  `src/pr-watch/{gh,state-cli,state-fields,state-gh,states}.unit.test.ts`,
  `src/pr-watch/state-view-fixture.ts`, `src/secret-scan/run-push-secret-scan.unit.test.ts`.
  The earlier antigen scrub turned `apps/oak-…` fixture paths into `jcdotnet/…` in one test and
  silently put it out of the rule's scope — replace fixtures by hand, then re-run the suite.

### Owner rulings on the agent-tools scripts (2026-09-12, late)

- Keep the Codex scripts (`codex-exec`, `codex-reviewer-resolve`, the Codex identity hook); multi-agent collaboration is a later exploration.
- Keep `check-commit-message` and make it discoverable: its point is checking a message's validity without running the hook chain first, and it was hardly used because nobody found it. Root alias `agent-tools:check-commit-message` added; README §Git hooks and AGENT.md §Commands name it; the commit skill already cites it.
- Retirement candidates stand as listed above (`validate-ratified-lists`, `protocol-conformance`, `pr-throughput`, `merge-bot`, `ci-turbo-report`) for re-evaluate.

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

- `skills/working-with-graphs` may serve PKG — unassessed.
- `.claude/` · `.cursor/` · `.codex/` · `.agents/` adapter regeneration is coupled to P5 via
  `validate-portability`; adapter counts differ sharply (local 96/98/19/60 vs OCE 301/195/33/313).
- The 8-gram measure detects _presence_ of content, not whether OCE's version is better. Low
  novelty licenses replacement; it does not prove improvement.

## Ordering note

Run the transplant **before** the outstanding 57-lesson synthesis pass over
`archive/napkin-2026-08-12.md`. The old lineage has nowhere to route those lessons —
no `pending-graduations` register, no three-mode memory. That absence is _why_ PR #41
rotated unearned. The transplant creates the destination; the synthesis then has
somewhere to land.

## Re-evaluate — seed contract (executed 2026-09-12)

The first re-evaluate slice trues two transplanted assertions and re-homes the copied docs;
this section records the first. Finding: the Claude `SessionStart` identity hook reported that
`PRACTICE_AGENT_SESSION_ID_CLAUDE` was set in `$CLAUDE_ENV_FILE`, yet no Bash tool call in this
session saw it, so every collaboration-state write was refused. Evidence: the session's env file
was born at the second compaction with one export line; the startup hook wrote nothing and
logged nothing; the persistent Bash shell predated the compaction-time write by twelve minutes.
The hook's context line was emitted before the env-file decision, and its unit test pinned the
no-write case still making the claim.

Cure, structural: `CLAUDE_CODE_SESSION_ID` — exported by the harness into every Bash tool shell
and equal to the seed — joins both seed cascades (`collaboration-seed.ts`, `agent-identity-cli.ts`)
after the cloud seat's remote id and before the Codex fallback; PDR-027 carries the amendment
(2026-09-12). The hook's context now states whether a write was planned. The identity hook
timeout in `.claude/settings.json` rises from 5 s to 20 s as the leading hypothesis for the
missed startup write; the falsifier is the env file appearing at the next session start. Docs
trued: `agent-tools/docs/agent-identity.md`, `launch-command.ts`, `use-built-agent-tools-cli.md`.
Proof: with the env-file variable absent, `agent-identity --format display` and
`identity preflight` resolve `Cauldron herds Lustre` / `880ff9` with `seed_source:
CLAUDE_CODE_SESSION_ID`.

Restart assessment (2026-09-12, the same session resumed after compaction): the timeout
hypothesis is refuted and the timeout returns to 5 s. The hook shim runs in 0.11 s against a
built `agent-tools/dist`, and the "missed startup write" was not a miss: the session started at
09:09 BST and the `SessionStart` hook entry was installed by the Phase 8 harness commit at 14:13
BST, so no hook existed at startup; the env file was born at the first compaction after the
install (14:28 BST) and has gained one export line per `SessionStart` since (compaction, the
owner's `/compact`, the resume). Every run of the installed hook wrote. Confirmed at the resume:
`PRACTICE_AGENT_SESSION_ID_CLAUDE` and `CLAUDE_CODE_SESSION_ID` are both present in the first
Bash call; `identity preflight` reports `seed_source: PRACTICE_AGENT_SESSION_ID_CLAUDE`, and with
that variable unset it reports `CLAUDE_CODE_SESSION_ID`; the hook's context line reads "is
appended to $CLAUDE_ENV_FILE". Residue: the hook appends an identical export line on every
`SessionStart`; inert, and a guard that skips an already-present line is a one-line cure when
the hook is next touched.

Peer note: the OCE seat (read-only source, pinned at `a55fd8fdd`) verified the hook-message and
`ADR-199` findings first-hand and will cure them in its own lane; the claimed PDR-105 portability
violations from Core into `docs/` were a mis-read by this seat's inventory explorer and are
retracted (the validator reports 0). OCE's pull-request machinery moved after the transplant scan
(PR #136 still moving, PR #138 at `352ad0ee5`); re-import is scheduled after this slice.

## Re-evaluate — session-open surfaces (executed 2026-09-12)

Finding: the shared start-right workflow (`start-right-quick/shared/start-right.md`, read by
the quick and team skills) and its thorough sibling were lineage-shaped: a gate block in which
only 7 of 19 `pnpm` citations existed while 13 real gates were missing, five dangling record
citations, five dead paths, and five clauses about people, services and products this repository
does not have. Cure: the gates skill (`change-custody/gates`) became the one gate list, unrolling
`pnpm check` and naming the gates outside it; both workflows cite it. The named-person clause,
the foreign-service cross-check, the codegen nuance and the dead links were removed or re-pointed
to local homes; the identity paragraph now names the native seed fallback. The same lineage skill
names were scrubbed from nine other `.agent/` files.

Structural cure: `validate-cited-scripts` (agent-tools, wired into `docs-validators:check`)
reads every `pnpm` command in fenced blocks and code spans across `.agent/`, `docs/`, the
platform directories and the root documents, and refuses a script name that neither the root
nor the filtered workspace defines (root-installed bins count). Its first run found 70
citations: 30 real dead names outside the copied docs (all cured), 5 tokenizer false positives
(cured with unit tests), and the remainder inside the docs layer, which the next section
re-homes. `validate-reference-direction` is green (three fixed-address singletons allowlisted;
the ADR prefix trued to `decision-records/`). `validate-markdown-links` no longer walks the
pre-transplant snapshot or any reference-local tree.

Backlog recorded here, not cured in this slice: `validate-markdown-links` reports broken links in
99 files outside the snapshot (19 `.agent/memory`, 17 `.agent/skills`, 15 `.agent/plans`, 10
`docs/engineering`, 8 `.agent/directives`, 7 `docs/governance`, the rest scattered); wiring
`check:docs` into `check` waits on that repair. The team skill still cites lineage ADR numbers in
prose (ADR-182, ADR-183) — a record-citation scrub across `.agent/` is a re-evaluate item.

## Re-evaluate — docs layer (executed 2026-09-12)

The 29 files copied into `docs/governance|engineering|foundation` were provisionally placed
(§Owner note). Each was assigned a role and a home by PDR-014 §Knowledge artefact roles and
`orientation.md`'s "most durable layer that fits its read-trigger": doctrine agents internalise
→ `.agent/directives/` or an existing rule; recipes and host guides agents consult →
`.agent/reference/`; a stable contract looked up when acting → `.agent/memory/executive/`;
human-facing developer narrative → `docs/engineering/`; an Oak-product subject with nothing local
to say → drop. Every drop is reversible: the read-only sibling OCE checkout is pinned at
`a55fd8fdd` and re-import reads `git show` at that commit, never its working tree (another seat
operates there). Inputs before the pass: none of the three directories was linked from any index;
AGENT.md linked 7 of the 29; the files carried about 100 dangling links, mostly the lineage ADR
path. The owner ratified the list as one on 2026-09-12 (plan approval); no item was declined.

| #   | File                                                  | Verdict                                                                                  |
| --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | `governance/README.md`                                | drop — the directory dissolves (30)                                                      |
| 2   | `governance/accessibility-practice.md`                | → `.agent/reference/`; de-widget                                                         |
| 3   | `governance/development-practice.md`                  | merge unique substance → `principles.md` and the gates skill; drop the rest              |
| 4   | `governance/logging-guidance.md`                      | drop — 925 lines of lineage observability, zero inbound                                  |
| 5   | `governance/problem-hiding-patterns.md`               | merge → `.agent/rules/no-warning-toleration.md`                                          |
| 6   | `governance/safety-and-security.md`                   | split — generic → `secops.md` + `privacy.md`; the lineage product sections dropped       |
| 7   | `governance/sonar-disposition-policy.md`              | drop; the rule citation cut — Sonar adoption is a separate owner decision                |
| 8   | `governance/typescript-gotchas.md`                    | → `.agent/reference/`; de-widget                                                         |
| 9   | `governance/typescript-practice.md`                   | merge → `.agent/directives/validation-strategy.md`                                       |
| 10  | `engineering/README.md`                               | rewrite as the index of the survivors; `docs/README.md` indexes `engineering/`           |
| 11  | `engineering/agent-tools-operational-requirements.md` | → `.agent/memory/executive/`                                                             |
| 12  | `engineering/build-system.md`                         | stays; rewritten against the real graph                                                  |
| 13  | `engineering/ci-policy.md`                            | drop — its subject is the codegen contract                                               |
| 14  | `engineering/claude-design-conversion-playbook.md`    | → `.agent/reference/`; provenance to one attribution line                                |
| 15  | `engineering/developer-experience.md`                 | stays; dead `operations/` links removed                                                  |
| 16  | `engineering/extending.md`                            | drop; AGENT.md and the artefact inventory re-pointed at `docs/architecture/README.md`    |
| 17  | `engineering/merge-bot.md`                            | → `.agent/reference/`                                                                    |
| 18  | `engineering/pr-label-ledger.md`                      | drop — rows enumerate the lineage's labels                                               |
| 19  | `engineering/pre-merge-analysis.md`                   | → `.agent/reference/`                                                                    |
| 20  | `engineering/testing-patterns.md`                     | stays; scrubbed; fitness frontmatter trued                                               |
| 21  | `engineering/testing-tdd-recipes.md`                  | stays; scrubbed                                                                          |
| 22  | `engineering/tooling.md`                              | → `.agent/reference/`                                                                    |
| 23  | `engineering/vendor-cli-adoption.md`                  | drop — every example is a lineage vendor                                                 |
| 24  | `engineering/workflow.md`                             | stays; scrubbed                                                                          |
| 25  | `engineering/working-with-this-repo-for-devs.md`      | stays; `/oak-*` → `/jc-*`; lineage worked example replaced                               |
| 26  | `foundation/README.md`                                | drop — its organising claim rests on a vision document the transplant rejected           |
| 27  | `foundation/agentic-engineering-system.md`            | merge unique substance → `.agent/HUMANS.md`; drop                                        |
| 28  | `foundation/cost-of-change-gradient.md`               | → `.agent/reference/` (the host guide to PDR-135)                                        |
| 29  | `.agent/directives/schema-first-execution.md`         | reduce to a derivation clause in `principles.md`; drop the directive                     |
| 30  | `docs/governance/`, `docs/foundation/`                | dissolved; validator roots, the hedging rule's scope and the mechanism catalogue amended |

Correction to the plan's rationale for 22 and 28: no practice-core file linked to either docs file
(the reference-direction validator reported 0 portability findings); the moves stand on role alone.

A thirtieth copied file surfaced during execution: `governance/understanding-agent-references.md`
(102 lines, zero inbound) described the lineage's `.agent/reference/` inventory (MCP and Clerk
vendor digests). Dropped; the local `.agent/reference/README.md` is the index and now lists every
file in the directory.

### Execution record (2026-09-12, same day)

All 31 verdicts executed. The merges carry disposition ledgers in the commit messages and the
subagent reports; the honest count for `development-practice` was mostly `already-covered`
(principles, the rules and the gates skill already held it) with ten applied paragraphs, and for
`safety-and-security` roughly half generic (into `secops.md` and `privacy.md`, which now carry the
credential, secret-scan, PII and machine-local-paths doctrine) and half product (dropped). The
`validation-strategy.md` stub became the real home for compile-time and boundary validation (341
lines). `HUMANS.md` gained the one section a curious human needs on how the loops hold together.

Found and cured while executing, outside the 31: `principles.md` still described the framework /
consumer split in the lineage's product terms (rewritten to this repo's `@engraph/*` framework
and `jcdotnet` consumer); `testing-strategy.md` cited a mutation runner this repo does not have
and three lineage records — one of which (ADR-011) shares a number with a local record on a
different subject; the machine-local-paths validator ran only under `check:docs` while the hook
policy claimed commit/CI enforcement (now a `check` leg and a CI step, parity 15 legs); and
`agent-tools/src/bootstrap/bootstrap.ts` still built its workspace closure from the lineage's
`packages/core/*` paths, so a cold `pnpm install` would have failed postinstall (paths trued to
`tooling/*`, proven by running the bootstrap). Two surviving-doc findings recorded for later:
`turbo.json`'s site `build` outputs do not name `.next/`, so a Turbo cache hit restores nothing
for the site; and the lineage path residue in `tooling/*/package.json` metadata remains (already
in §Oak residue in tooling).

Validators at close: `validate-cited-scripts` green over 1198 files; `validate-reference-direction`
green; `validate-markdown-links` clear for `docs/**` and every re-homed file, with 418 broken
links remaining repo-wide (lineage record links in memory, skills, plans and three local ADRs
that cite pre-transplant skill paths) — the link-repair backlog; `pnpm check` green on all 15
legs.

## Link repair and script naming — executed 2026-09-12 (resumed session)

**Link repair.** The 418-link backlog closed to 0 first-hand in about an hour, by class: 243 by
regenerating the patterns index from the empty local corpus (the lineage's 243 pattern files did
not travel; the generator gained a zero-corpus case and a test); 50 links to archived plans and
prompts became plain text naming the node (the validator treats `archive/` as non-live); about
25 moved targets were re-pointed (`memory/active`, `jcdotnet/` paths, the local skill
directories, ADR-022 for the renumbered rendering-proof record, PDR-020 and PDR-021 by path);
about 90 citations of lineage-only records and surfaces were removed with each sentence reworded
to stand alone; and two lineage methodology docs were imported from the pin
(`ephemeral-to-permanent-homing.md`, `collaboration-state-lifecycle.md`) rather than removing
five citations to them. `docs-validators:check` became a `check` leg and a CI step.

**Owner ruling (2026-09-12): adopt the lineage's `package.json` script naming as practised.**
Applied at the root and in the site workspace: `format-check:root` / `format:root`,
`markdownlint-check:root` / `markdownlint:root`, `fix` and `fix:docs` as the mutating aggregates,
`test:ui`, `visual-regression:harness`, `repo-validators:check` (nine validators that were green
but unwired) and `docs-validators:check` (with the patterns index) as `check` legs; `check:ci`,
`check:fix`, `format`, `format:fix`, `markdownlint:check`, `markdownlint:fix` and every
site-level duplicate of a root gate retired (the site keeps `build`, `clean`, `dev`, `start`,
`type-check`, `lint`, `lint:fix`, `test*`, and its `<subject>:<verb>` tools). Pre-push runs
`pnpm check`; CI runs the same legs (parity validator: 16). PDR-008 carries the amendment: the
lineage's own copy of PDR-008 was never amended and its `package.json` contradicts it, a
cohesion finding for the source estate. Every citation was re-pointed and the cited-scripts
validator is green; the ARC channel records under `.agent/collaboration/rapid-comms/` are now an
excluded root of that validator, as frozen records.

## Re-evaluate slice 2, item 1 — the lineage's pull-request machinery (executed 2026-09-12)

Source pins named by the OCE seat: PR #136 at `2b1b15ab8`, PR #138 at `e477e62f7`. Measured
first: the upstream delta between this transplant's pin (`a55fd8fdd`) and `e477e62f7` on the
named surfaces is nine files, of which seven are doctrine and two are a recorded fixture
(1,205 lines of that repository's PR #135 harvest plus its README). Local drift against
`a55fd8fdd` was zero on the rule, the proportionality skill and the coordination-fold skill,
four lines on pr-lifecycle, and whole-file on the PR template, the Copilot instructions and
`AGENTS.md` (all three rewritten for this repository at the transplant).

Applied: the four doctrine patches by `git apply` (clean); the `## Scope` section, its review
contract and intake bullets added to this repository's PR template (which had no scope section);
the `## Code review` section added to the Copilot instructions and `AGENTS.md`. Not carried: the
PR #135 harvest fixture and its README — another repository's review data with no consumer here
(no tally reader exists in `agent-tools` upstream or here at these pins); the pr-lifecycle
sentence that cited the fixture path now names it as the lineage's and points this repository at
its own first tallied pull request. Antigen scan of the applied hunks: none. Gates: markdown
links, cited scripts, portability and skills adapters green. No Core file changed, so no
provenance entry.

## Re-evaluate slice 2, item 2 — the ten expert templates at content grain (executed 2026-09-12)

The transplant kept the local 60-line templates for eleven same-named experts (`mcp` since
dropped) because their site substance was 94–100% novel; the lineage's versions (180–550 lines)
carried the review method those short files lacked. Merged first-hand in four commits, one
method per antigen density: the seven generic templates (`config`, `security`, `docs-adr`,
`subagent-architect`, `code`, `test`, `type`) took the lineage file as the base with the local
identity block, reading rows, seams and triage targets grafted in and the upstream product
sentences removed; the three site-facing templates (`accessibility`, `design-system`,
`react-component`) were rewritten on the lineage's two-mode structure with the site's surfaces
(App Router pages and components, the Tailwind `@theme` tokens in `globals.css`, the theme
provider and toggle, the generated PDF, the Playwright and axe-core suite, the visual-regression
harness and the rendered-proof records). `type-expert`'s source of truth moved from an API
schema to the entity graph and its Zod schemas. Every path each template names was checked to
exist (two corrections found that way: a PDR filename and an `.env.example` that does not
exist); `subagents:check`, `portability:check`, cited scripts and markdown links green after
each batch. Identity `Name:` fields now match the roster. Not done: regenerating the adapter
descriptions from the new identity summaries (the generator is the delivery node's slice 5).

## Re-evaluate slice 2, item 3 — lineage record numbers in the agent-tools sources (executed 2026-09-12)

Measured: fifteen source-lineage ADR numbers across about two hundred sites in the agent-tools
sources, tests and docs, every one above the local series' last number (022). Each number was
mapped to the concept its record named (the lineage's title at the pin) and substituted by a
script; compound and link forms first, bare numbers second, then a pass for the doubled and
adjectival articles a noun-phrase substitution produces ("the the", "an the", "the heartbeat
lifecycle substrate heartbeat"). One lineage doc path in the fitness-vocabulary allowlist was
removed with its test re-pointed, and two fixture tests that quoted the phrase inside a link
text were re-worded so the validator under test still sees only the preserved filename. Lint,
type-check, the 3,488 agent-tools tests and `pnpm check` green. PDR numbers were left: the Core
numbering transplanted whole, and every cited PDR resolves to the record it names.

## Plan-node migration — design brief (measured 2026-09-13, before compaction)

The next slice 2 item is design-laden; these are the measured facts a fresh session starts
from, and the one fork the owner decides. Facts:

- The plan-corpus validator (`validate-plan-corpus`) scans only `*.plan.md` files under
  `.agent/plans/`; an empty corpus is a failure by design. It resolves a strategic node's
  `serves` against a **strategic-choice registry** recomputed from `docs/strategy/README.md`
  plus `docs/strategy/stream-*.md`, a delivery or runbook node's `serves` against a strategic
  node in the corpus, `impact_areas` against `.agent/plans/impact-areas.md`, and `depends_on`
  against real plans. This repository has no `docs/strategy/`; the validator crashes there
  before reading a single plan. `check-plan-gate-drift` fails for the same reason.
- The lineage names nodes `<id>.plan.md`. The two nodes ratified on 2026-09-12 are named
  `practice-lineage-transplant.md` and `<second-host>-lineage-update-preparation.md`, so the validator
  would not see them even when it runs; the delivery node's `serves` names the runbook, not a
  strategic node, and the runbook has no `serves`. Both are defects to cure in the migration,
  with every citing path (reports index, continuity, the continuation prompt, the letter)
  re-pointed.
- The impact registry still lists the source's product areas; only `practice-and-estate`
  applies here. Local areas are the site, the personal knowledge graph and its JSON-LD, the
  editorial content, the visual system, and the Practice.
- The legacy corpus: active 2, current 12, future 2, research 10, archive 26 `*.md` files under
  `.agent/plans/`, most `*.plan.md`. Whether the validator scans `archive/` is not yet measured;
  the lineage keeps `delivery/archive/` inside the scan root, which suggests it does not, but
  the helper decides and the first run tells.

The fork (owner's): does this estate want a **strategy layer** — a `docs/strategy/` README with
one stream file per stream (the site, the knowledge graph, the Practice) and a strategic node per
stream that delivery and runbook nodes serve — or a flat node estate under one implicit goal,
with the validator amended to accept an absent strategy directory as zero streams (the same
zero-case cure the patterns index needed)? The first is the lineage's shape and gives
`serves` a real target; the second is smaller and honest about a three-surface repository.

Proposal (a sketch, not a decision): a minimal strategy layer of three streams, because the
estate already has three durable goals the plans keep naming and continuity keeps parking
(the site's editorial and graph work, the knowledge graph, the Practice); one strategic node per
stream; the two ratified nodes renamed and re-parented under the Practice stream; the active
and current legacy plans re-authored as delivery nodes only where their intent is live
(continuity's parked threads name which) and archived otherwise with the intent conserved in
the stream file; `future/` and `research/` left outside the node estate as records; the
registry rewritten to the local areas; `validate-plan-corpus` and `check-plan-gate-drift`
joined to `repo-validators:check`. Falsifier: if the strategy layer takes more than one sitting
to author, the flat shape was the right size. Free-play seed, not a finding: a validator that
crashes on an absent corpus and an index that pointed at 243 absent files are one shape; both
cures are a zero-case.

## Owner rulings, round 5 (2026-09-13, two card rounds after compaction)

Eight cards, every open question and unknown the wrap left; the answers are the rulings the
migration and the rest of slice 2 run under.

1. **"The design and transformation" is the plan-node migration**, from the design brief above.
2. **The plan corpus lives in the standard Practice location, under `.agent/plans/`.** Three
   high-level nodes are fine for now. Owner verbatim on the streams: "eventually I expect that the
   site and Practice will be relatively stable and the content and graphs will be the priority.
   Ultimately this is my CV, the content is what matters." Consequences: the strategic-choice
   registry the validator recomputes moves with the corpus (`.agent/plans/strategy/README.md` plus
   `stream-*.md`, the validator's `STRATEGY_DIR` re-pointed from `docs/strategy`; this estate has
   no `docs/strategy/`); the three streams are read from the owner's sentence as **the content**
   (the CV and its editorial), **the knowledge graph**, and **the platform** (the site and the
   Practice, the two surfaces expected to stay stable) — a reading, confirmed at the next card
   round with the legacy dispositions.
3. **Legacy plans: convert live intent, archive the rest — and review every legacy plan first;
   the owner does not want to lose good ideas.** The 52 files are digested and dispositioned one
   by one (convert / conserve the idea in a stream file / history), the table presented as cards.
   The corpus loader walks every subdirectory and directory names carry no archive semantics
   (`plan-corpus-loading.ts`), so a pre-schema `*.plan.md` anywhere under `.agent/plans/` fails
   the validator; the legacy lanes are conserved as a sibling corpus outside the scan root, the
   lineage's own shape (`plans-backlog-2026-07`, `plans-v0-sketch-2026-07-21`).
4. **Wrap commits stay.** A wrap before compaction lands as its own `chore(continuity)` commit; the
   session-handoff skill's clause is amended so the skill and the practice agree.
5. **The picker falsifier is closed:** after the compaction restart each `jc-*` skill shows once.
6. **OCE channel:** send all historical, current and future issues as they arise, batched
   sensibly so the OCE seat can record them without being overwhelmed. Sent before this ruling:
   seven findings (2026-09-12; 1, 2, 3, 7 verified there, 5 transplant-side, 6 retracted), the
   cited-scripts validator's shape, the PDR-008 cohesion gap. Unsent at the ruling: the batch in
   §OCE findings batch 1 below.
7. **`.agent-original/`:** a loss-scan list is presented first; deletion follows the owner's
   per-item rulings.
8. **57-lesson synthesis quorum** means: one seat synthesises the candidates onto the
   pending-graduations register; the owner reviews the list before anything graduates.

### OCE findings batch 1 (2026-09-13, sent under ruling 6)

1. `agent-tools/src/validators/plan-schema/validate-plan-corpus.ts` hard-codes
   `STRATEGY_DIR = 'docs/strategy'` and reads it with a bare `readFile`; on a host without that
   directory the validator crashes with an unhandled ENOENT before reading a plan, instead of the
   fail-closed message every other refusal in the family carries.
2. `plan-corpus-loading.ts` walks every subdirectory of `.agent/plans/` and states that directory
   names carry no archive semantics; the lineage keeps `delivery/archive/` inside the scan root, so
   archived nodes are validated live for ever. Intentional (archived nodes stay conformant) or a
   latent cost as the archive grows — a question, not a defect.
3. The patterns-index generator rendered 243 links to absent files on an empty corpus; the
   zero-case (`renderPatternIndex([])` → one italic line) is a one-function cure, landed here.
4. `pnpm -s` is rejected by pnpm 12 ("unexpected argument '-s'"); OCE pins pnpm 11.20 and uses
   `pnpm -s` fifteen times in `agent-tools/package.json` `test:e2e` and in the commit skill. A
   forward warning for the next pnpm major: `--silent` works on both.
5. The transplanted `pr-lifecycle` skill fixture cites OCE's PR #135 by number; a shared skill
   carrying one repository's PR as its worked example transplants as a dead pointer.
6. `session-handoff` forbids dedicated handover commits (owner ruling 2026-07-15) while this
   owner asks for a clean tree at every compaction and ruled today that wraps commit; the two
   rulings coexist by estate. A note for the lineage's next consolidation, not a defect.
7. The cited-scripts validator shared earlier now also excludes `.agent/collaboration/rapid-comms/`
   from its scan (comms events quote scripts as history).

### OCE findings batch 2 (2026-09-13, after compaction; the completeness check the OCE seat relayed)

The OCE seat reported batch 1 dispositioned and relayed the owner's ask that every OCE-affecting
finding held here be reported. Every earlier send was reconstructed from the session transcript
(seven messages) and every remaining candidate was checked at the pin `e477e62f7` before
sending, per the distilled lesson that a claim reaching a peer estate is checked first.

Sent:

1. **Correction** to the first batch's item 1: the "leading candidate" for the missed startup
   env-file write, a 5 s hook timeout, was wrong. The hook shim runs in 0.11 s and the hook did
   not exist at that session's startup (installed mid-session). The unconditional context line
   stands; the lineage's `timeout: 5` needs no change.
2. **New:** `session-identity-hook.ts` plans an `appendLine` on every `SessionStart` with no
   presence check, and the shim appends it; Claude Code fires `SessionStart` on startup, resume
   and compaction, so the env file accumulates identical export lines (observed here: six lines,
   one distinct, after a day). Inert but unbounded; a skip-if-present read or a single-line write
   is the cure.

Verified at the pin and therefore **not** sent: the ADR-065/144/182/199/203 citations in the
start-right workflows resolve there (the lineage names ADRs `NNN-slug.md`; the dangling links
were this transplant's); the observability backlog artefact resolves; the `*-reviewer.md`,
`skills/free-play/` and `reference/cross-platform-agent-surface-matrix.md` drift occurs only in
the lineage's old plans archive, so it is local; `.claude/commands/` is empty at the pin, so the
picker duplication seen here does not apply. Held, not withheld: the installable-Practice
proposals (sent as a proposals batch once the `practice-completion` node is ratified) and the
cited-paths validator's shape (sent when it lands), both under ruling 6.

## Plan-node migration — executed (2026-09-13)

Under §Owner rulings, round 5. What landed, in the order it was built:

1. **The validator moved with the corpus.** `validate-plan-corpus` reads the strategy
   registry from `.agent/plans/strategy/` (`STRATEGY_DIR`), and an absent or unreadable
   registry is a fail-closed message naming the path, not an unhandled ENOENT. Its header
   names this repository's conserved corpus. The schema unit tests (66) pass unchanged; the
   `serves` message and the registry doc comments name the new path.
2. **The strategy corpus:** `strategy/README.md` (three families: `CONTENT-*`, `GRAPH-*`,
   `PLATFORM-*`; the open decisions the owner ratifies on cards) and three stream files
   carrying ten concrete choices, each written from the legacy corpus's live intent and the
   owner's sentence on priority.
3. **Three strategic nodes**, born sketch: `content-as-cv` (CONTENT-1),
   `personal-knowledge-graph` (GRAPH-1), `platform-site-and-practice` (PLATFORM-1).
4. **The two ratified nodes** renamed to `*.plan.md` and re-parented under
   `platform-site-and-practice` (the runbook gains `serves`; the delivery node's `serves`
   moves off the runbook); every citing path re-pointed (reports index, continuation prompt).
5. **The impact registry** rewritten to five local areas: `editorial-content`,
   `knowledge-graph`, `site`, `visual-system`, `practice-and-estate`.
6. **The legacy corpus conserved** at `.agent/plans-legacy-2026-09/` (the five lanes and the
   roadmap, moved with `git mv`, untouched), with `DISPOSITIONS.md`: one row per file
   (converted at pickup / conserved in a stream choice / superseded by events / record) and
   the ideas harvested from the archive. Proposed, for the owner's cards. Six workspace-family
   plans are superseded by events: the transplant's monorepo closed their premise, the
   validators live in `agent-tools`, and no `packages/` tier exists; their extraction-gate
   rule survives as PLATFORM-2.
7. **Citations re-pointed** in the live surfaces (the pkg skill and reviewer template, the
   dev-tooling and Track B prompts, the continuation prompt, the Wilma template, the napkin's
   handoff line, `.agent/README.md`); archives and comms records untouched. markdownlint
   ignores the conserved corpus as it ignored `plans/archive/`.
8. **Wired:** `validate-plan-corpus` is the tenth `repo-validators:check` leg (CI parity
   holds through the aggregate). `check-plan-gate-drift` stays the non-blocking session-open
   alert it was designed as (owner ruling 2026-07-31, upstream) and is not a gate.

Measured: `validate-plan-corpus` green on five nodes at the first run after the estate was
written, so Wrap 4's prediction (a) — a stub registry would fail next on the nodes' names or
`serves` — was never exercised (the defects were cured before the run). Prediction (b) was
refuted by reading: the corpus walk enters `archive/`. Timing: the strategy layer took one
sitting to author, so by the brief's own falsifier the three-stream shape was the right size.

Owner-held next: ratify or amend the streams, the ten choices, the three strategic nodes and
the dispositions table on cards; the Track B delivery node is authored at pickup from the
conserved design record.

## Owner rulings, round 6 (2026-09-13, after the migration landed)

1. **Four streams, not three:** the platform stream is split into **the site** (`SITE-*`:
   stable and provable; workspace boundaries by the extraction gate; dependency hygiene one
   major per slice) and **the Practice** (`PRACTICE-*`: a lineage taken deliberately; the
   learning loop closed, not nominal; assertions exercised, never trusted). The two transplant
   nodes serve `practice`.
2. **The strategic layer is ratified** ("Ratify all three now", given in the same round as the
   split): `content-as-cv`, `personal-knowledge-graph`, `site`, `practice` carry the stamp
   (Jim Cresswell, 2026-09-13, these cards). The fourth node exists only because of the
   split ruling; its stamp says so, and one word from the owner returns it to sketch.
3. **The dispositions table is ratified as proposed**, including the six workspace-family plans
   superseded by events.
4. **The Track B delivery node is authored at pickup** by the seat that resumes it, as the
   schema says; GRAPH-1 and the conserved design record carry the intent until then.

## Owner rulings, round 7 (2026-09-13, late morning) — direction: the entire Practice

1. **Second-host preparation stops until the owner says.** The ratified delivery node stays
   for now; its slices are parked on continuity, not in the node (execution state is never a
   node field). Withdrawn outright in round 8.
2. **Define what belongs to the Practice.** Done as
   `.agent/reports/practice-transplant/what-the-practice-is.md` (nine functions; the transplant
   set by function; gaps by evidence class). Owner's constraint on method: a survey of the
   lineage cannot tell you what the survey missed; the definition is function-first and the
   estate's own claims are exercised as the second source.
3. **The entire Practice comes over, as appropriate for this repository's context,** with a
   record of what, how and why so the next transplant is much quicker, and an exploration of
   the Practice as a separate installable entity that keeps the learning loop, self-improvement
   and contributions back to the Practice and its ecosystem. This flips the 2026-09-12 default
   (a surface stayed only when the host ran what it governs); rulings made under the old default
   for Practice surfaces reopen; product drops stand. Recorded as the delivery node
   `.agent/plans/delivery/practice-completion.plan.md` (sketch; two owner gates; six todos).
4. **The private editorial boundary is cloned** into its ignored location and read for
   understanding. The public tree carries no URL, commit id or content from it; the working
   rule in `.agent/directives/privacy.md` governs.

## Owner rulings, round 8 (2026-09-13, after the second compaction) — ratification

One card round of four; every answer applied the same session.

1. **`practice-completion` is ratified as written.** Stamp: Jim Cresswell, 2026-09-13, this
   round. Its todo 1 starts now: the cited-paths validator first, then the class A cures.
2. **Gemini is carried; Windsurf is rejected.** Gate 1a cleared; the ruling is in the node's
   §Owner rulings and lands through todo 3.
3. **The Practice's knowledge base comes over as the cited subset, scrubbed.** Gate 1b cleared:
   the records live doctrine cites and the research the definition names; the rest stays at the
   pin, re-importable.
4. **The transplant instruments re-home under `practice-completion`, and the second-host
   preparation node is withdrawn as premature** — the owner's words, the repository name
   elided at the owner's own instruction: "delete all mention of [it], that was premature and
   I don't want it steering the general understanding of the Practice and its future". Applied: the node file removed; every steering surface this
   transplant authored (the strategic and runbook nodes, the strategy stream, continuity, the
   continuation prompt, the four reports and their index, the formation letter, the napkin,
   this record) now speaks of "the next host" or "the next instance" and names no repository.
   Left as they are, with the reason stated: the lineage's own records and Core files that name
   that estate as a sibling in a worked instance or a provenance entry (`practice-core/`
   CHANGELOG, `provenance.yml`, the incoming bundle, the cloud-environment scripts, two
   `agent-tools` test comments and its identity doc, one skill and one rule). Those are
   history of the lineage, not this estate's understanding of its future; rewriting them would
   falsify a record. Undo is one word.

## Practice completion — todo 1 executed (2026-09-13, after the second compaction)

**Measure first.** `validate-cited-paths` (agent-tools, `docs-validators:check` leg): every
code-formatted `.agent/` or `docs/` path in live doctrine — directives, rules, skills and the
entry points — must exist. Pre-cure run: 52 citations of 35 absent paths across 20 files
(prediction (a) from Wrap 5 said about forty; the two runtime-created targets are allowlisted
with a reason). At the wider cited-scripts scan scope the count was 81, the extra 46 in plans,
reports, memory and Core; the leg starts at the doctrine scope the node's acceptance criterion
names and widening is a todo-3 item. The walker the cited-scripts and stale-script-invocations
validators each carried became one module (`core/authored-surfaces`, injected file-system port,
unit-tested) under `consolidate-at-second-consumer`; the new validator would have been the third
copy. Four claim-directed mutants, all killed (commit 5d44218 body).

**Cures, by kind.**

- Re-points (mechanical): nine `*-reviewer.md` template citations in nine rules and six skills
  → `*-expert.md`; `skills/free-play/`, `skills/retrospective/`, `skills/knowledge-safety-sweep/`
  → their `cognition/` and `knowledge/` homes; `quality-gates/SKILL.md`, `napkin/SKILL.md`,
  `editorial-voice/SKILL.md` → the local canonical files; `reference/cross-platform-agent-
surface-matrix.md` → `memory/executive/`; `memory/{distilled,napkin}.md` → `memory/active/`;
  `docs/architecture/architectural-decisions/` → `decision-records/`; `docs/operations/` →
  `docs/engineering/`; the orientation table's plans row → the plan-node estate.
- Imports from the pin under the cited-subset ruling, each with a provenance line and the
  lineage-name scrub: five pattern records (the four doctrine cites plus the one they link),
  the diagnostics convention, the WS-8 reviewer synthesis, the workspace-basis research
  record, the Watcher estate review (adapter prefixes and account names scrubbed; the
  lineage's sibling-estate mention generalised), and a local README for the continuity
  research home (the lineage's seven syntheses stay at the pin, named there). The pattern
  index regenerated to five.
- Rewordings where the record is lineage-only and not knowledge-base class: the archived
  napkin of 2026-05-24, the consumed resonance import record, a product plan, and the
  lineage's identity ADR are named in prose without a path.

**After:** `validate-cited-paths: OK (274 files scanned)`; markdown links 0; cited scripts
green; the leg is a `docs-validators:check` leg and CI parity holds through that aggregate.

**Carried forward to todo 3 (under the new default):** the lineage's doctrine cites about
forty pattern records; the 2026-09-12 link repair removed the local link-form citations
instead of importing the targets, so re-triage which of those citations return with their
patterns; the 46 unresolved paths outside the doctrine scope; Gemini per the ruling.

## Owner direction, round 9 (2026-09-13, midday) — the universal Practice and its languages

Three items in one message, with the cognition suite invoked.

1. **The two estates' divergence.** The owner finds it fascinating that this seat and the
   lineage's seat have made significant and different improvements since the transplant began.
   Recorded as an observation in the language-separation exploration: the divergence sits in
   the universal layer (validators, the plan estate, PR machinery), none of it language-bound.
2. **Separate the universal Practice from its language-specific parts** — documents, rules and
   skills, and the agent tools; support at least TypeScript, Python and Rust; define the agent
   tools' contracts and interactions language-agnostically and enforce them ("JSON schema?
   Something else?"). Not urgent; important. Answered in
   `.agent/reports/practice-transplant/practice-language-separation.md` (six proposals with
   warrants and falsifiers; JSON Schema 2020-12 for shapes on the wire schema's own precedent,
   a conformance corpus for behaviour, a host profile for host facts, thin language packs, the
   reference implementation as a built binary first) and sequenced as the delivery node
   `.agent/plans/delivery/practice-language-separation.plan.md` (sketch; three gates expiring
   2026-10-04; eight todos; beneficial dependency on `practice-completion`).
3. **Commit and push.** The branch was clean; pushed with upstream tracking at 12cf86f, the
   pre-push gate green (the full check plus 58 end-to-end tests). The node and this record are
   pushed after it. No pull request has been opened; that word has not been given.

Addendum (same day, early afternoon): 4. **Open the PR** — done: draft PR #53 (`feat/monorepo` → `main`), described from the diff (the
site moves to `jcdotnet/`, the root package renamed with its licence field changed, 302
renames, `.agent-original/` tracked pending the loss-scan) with the records-class intake
declared in §Scope; the Vercel root directory was then configured by the owner and the first monorepo build
completed (owner-observed 2026-09-13, early afternoon; the PR carries the passing Vercel
check and a preview deployment for the branch). 5. **The Python
Practice repository is a very rough sketch, not a template**: the Python pack's structure must
be much closer to the lineage's, and that repository "provides hints rather than intent".
Applied to the language-separation node's third gate and todo 6 and to the exploration's
unresolved-evidence list.

### PR #53 — first CI triage (2026-09-13, early afternoon)

Three checks red at open; each read in full and cured at source:

1. **static-checks: `validate-cited-paths` red in CI, green locally** — 34 citations of six
   targets that exist on this checkout and not in CI: the untracked-by-design instance tier
   (`comms/`, the claims files, the rendered log) and the private boundary. The leg had proved
   its own path (validation-strategy §Gate integrity). Cure: the validator no longer consults
   the disk; a target resolves when the repository itself says it belongs — tracked (via
   `git ls-files`, directories implied) or ignored by the repository's rules (`git
check-ignore`, with a directory probe so `comms/*` resolves the directory). The hand
   allowlist is empty by design. Found on the way: `privacy.md` claims `.agent/private/` is an
   ignored boundary and no ignore rule existed; the rule is added, so the claim is now true.
   The tracked-paths helper the markdown-links validator carried moved to
   `core/repository-paths` (second consumer).
2. **CodeQL: three high alerts**, all pre-existing site code the rename made visible: the
   JSON-LD URL rewriter matched the canonical origin by string prefix (a host that merely
   begins with it would be rewritten); cured by parsing and comparing the origin, with a unit
   test for the look-alike host; two test assertions used a substring and an unanchored regex
   on hosts, replaced by hostname equality.
3. **dependency-review: `next@16.3.0`** carries two critical advisories (unauthenticated RCE
   on Windows hosts; RCE in the image optimisation API with AVIF), patched at 16.3.3; bumped
   to 16.3.5, the latest, exact-pinned as before. An urgent advisory patch takes the ordinary
   commit path (dependency-currency skill scope).
4. **static-checks, second run: `depcruise` red in CI, green locally** — four
   `workspace-config-no-phantom-deps` errors, every workspace's `eslint.config.ts` importing
   `@engraph/eslint-plugin-standards`. The dependency is declared; it could not be _resolved_
   because the plugin's exports point at `dist/` and the postinstall bootstrap builds the
   workspace packages agent-tools imports at runtime, not the plugin the config files import
   (the bootstrap's own comment names this exact class: a new install-time config dependency
   must be added or every cold install fails while warm checkouts mask it). Reproduced locally
   by hiding the plugin's `dist`; cured by adding `tooling/eslint` to the bootstrap's closure,
   proved on the cold path (dist hidden, the bootstrap rebuilt it, `depcruise` green).

## Owner rulings, round 10 (2026-09-13, afternoon) — compute, don't hope; the private boundary

1. **"Nothing should be hand kept, ever … compute don't hope."** Recorded as the rule
   `.agent/rules/compute-dont-hope.md` (the general form; `validators-must-recompute-not-just-record`
   points at it as its gate-shaped half). Applied the same afternoon: the postinstall bootstrap's
   workspace closure is derived from the workspace manifests (every package whose exports resolve
   only to built output, in workspace-dependency order; `install-time-closure.ts`, pure and
   tested), proved from a fully cold tooling tree (five built outputs hidden, all rebuilt in
   order, dependency-cruise green); the three authored-surface validators take the tracked tree
   as their universe, so the ignore-class exclusions (`node_modules`, the local boundary) left
   every list. Still hand-kept, named as the closure's first item: the rules index and the Cursor
   rule triggers, whose facts (classification, description, globs) live nowhere canonical yet.
2. **The private editorial material is optional, confidential, and never a dependency.** Every
   deterministic interaction removed: the start-right precondition that checked the clone, the
   continuity sentence that recorded it, the working-contract file folded into `privacy.md`
   (one mention of the boundary directory, the never-publish rule, the recovery principles) and
   removed, its eight inbound links re-pointed, the path dropped from the editor template, two
   skills, the LinkedIn prompt and the content stream, the directory-map row made generic, the
   definition report's line removed. The cited-paths validator resolves the remaining mention
   through the ignore rules, so it passes with or without the material present. Remaining
   mentions: `privacy.md` (the rule) and the continuation prompt (one sentence), by design.
3. The napkin's "rehearse against a cold state before each push" candidate is withdrawn; the
   owner's correction is item 1.
