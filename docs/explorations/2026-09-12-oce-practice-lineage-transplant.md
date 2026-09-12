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

Peer note: the OCE seat (read-only source, pinned at `a55fd8fdd`) verified the hook-message and
`ADR-199` findings first-hand and will cure them in its own lane; the claimed PDR-105 portability
violations from Core into `docs/` were a mis-read by this seat's inventory explorer and are
retracted (the validator reports 0). OCE's pull-request machinery moved after the transplant scan
(PR #136 still moving, PR #138 at `352ad0ee5`); re-import is scheduled after this slice.
