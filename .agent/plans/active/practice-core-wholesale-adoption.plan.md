---
name: Practice Core Wholesale Adoption
overview: Adopt the incoming Practice Core wholesale (eight files plus three required directories, 24 PDRs, new verification surface), drop incidental local divergence, restructure `.agent/prompts/` to canonical form, install the full cross-platform agent framework (rules, sub-agents, skills, commands, hooks, validators) per PDR-009 and PDR-024, and integrate this repo's genuinely-unique substance (PKG, editorial governance, personal-identity defensives, CV-as-product) into the new structure.
todos:
  - id: phase-1-state-of-play
    content: "Phase 1 — State of play: three-way comparison snapshot, plan check-in, baseline gates green"
    status: pending
  - id: phase-2-replace-core
    content: "Phase 2 — Replace .agent/practice-core/ wholesale with the incoming package (eight files plus three required directories)"
    status: pending
  - id: phase-3-rename-principles
    content: "Phase 3 — Rename rules.md → principles.md and update every reference"
    status: pending
  - id: phase-4-restructure-prompts
    content: "Phase 4 — Restructure .agent/prompts/ to canonical form: archive completed, strip start-right boilerplate from active, README index"
    status: pending
  - id: phase-5-canonical-rules
    content: "Phase 5 — Adopt canonical rule set (granular, action-named) with full per-platform activation triggers per PDR-009"
    status: pending
  - id: phase-6-reviewer-roster
    content: "Phase 6 — Adopt canonical sub-agent reviewer roster with full cross-platform adapter coverage (canonical + Cursor + Codex + Copilot)"
    status: pending
  - id: phase-7-canonical-skills
    content: "Phase 7 — Adopt canonical skills estate: split start-right, add missing canonical skills, populate .agents/skills/ canonical (no-prefix) discovery layer"
    status: pending
  - id: phase-8-pdr008-gates
    content: "Phase 8 — Adopt PDR-008 canonical gate naming end to end (package.json, hooks, README, CONTRIBUTING, principles.md)"
    status: pending
  - id: phase-9-consolidate-docs
    content: "Phase 9 — Adopt new consolidate-docs shape (three-destination patterns, ADR/PDR doctrine scan, step 8 upstream Core review, PDR-007 outgoing narrowing)"
    status: pending
  - id: phase-10-vital-surfaces
    content: "Phase 10 — Create missing PDR-024 vital surfaces: practice-core/patterns/, .agent/memory/patterns/, .agent/skills/patterns/, docs/explorations/, hooks layer"
    status: pending
  - id: phase-11-github-adapters
    content: "Phase 11 — Complete .github/ adapter surface: Copilot reviewer adapters, CODEOWNERS, PR template aligned with the Practice"
    status: pending
  - id: phase-12-validation
    content: "Phase 12 — Adopt validation mechanisms: extend portability validator for PDR-009/024, add validate-subagents, vital-surface validator, fitness vocabulary validator, TDD on each"
    status: pending
  - id: phase-13-adr-reclassification
    content: "Phase 13 — Mark ADR-012/015/018 superseded by PDRs; split ADR-016 into product-tooling ADR + new PDR/pattern for the visual-regression discipline"
    status: pending
  - id: phase-14-practice-context-hygiene
    content: "Phase 14 — Practice-context hygiene under PDR-007: clear incoming/, narrow outgoing/ to ephemeral-only, migrate substance to PDRs/patterns/reference"
    status: pending
  - id: phase-15-index-and-anchor
    content: "Phase 15 — Regenerate .agent/practice-index.md and anchor PKG, editorial, personal-identity, CV-as-product clusters explicitly"
    status: pending
  - id: phase-16-final-verification
    content: "Phase 16 — Final verification: full PDR-024 vital-surfaces walk + Bootstrap Checklist + all validators + check + test:e2e on a fresh checkout"
    status: pending
isProject: false
---

# Practice Core Wholesale Adoption

## State of play — three-way comparison

Three estates in tension. The plan exists to converge them

### Host repo (this repo) today

- `.agent/practice-core/` carries the seven-file Core (no `practice-verification.md`, no `decision-records/`, no `patterns/`, no PDRs). The incoming Core is staged in `.agent/practice-core/incoming/practice-core/`.
- `.agent/directives/` carries `AGENT.md`, `rules.md` (incidental local name), `testing-strategy.md`, `editorial-guidance.md`, `metacognition.md`, `privacy.md`, `secops.md`.
- `.agent/rules/` carries six rules: `code-quality.md`, `invoke-reviewers.md`, `napkin-always-on.md`, `read-practice.md`, `tdd.md`, `type-safety.md`.
- `.agent/sub-agents/templates/` carries five canonical reviewers: `code-reviewer.md`, `editor.md`, `pkg-reviewer.md`, `test-reviewer.md`, `type-reviewer.md`.
- `.agent/skills/` carries: `author-skills`, `deslop`, `distillation`, `editorial-voice`, `napkin`, `package-deps-up-to-date`, `pkg`, `project-spec-creation`, `quality-gates`, `start-right` (single, not split).
- `.agent/commands/` carries one canonical command (`jc-plan.md`) — most commands live only as `jc-*` files in `.agents/skills/`.
- `.agent/prompts/` carries seven `.prompt.md` files; six bundle start-right boilerplate that should be a single skill reference; one is canonical (`session-continuation.prompt.md`); one is completed (PKG track A).
- `.agent/hooks/` is empty (no `policy.json`, no `README.md`).
- `.cursor/commands/` carries six `jc-*.md` adapters. `.cursor/rules/` carries six `.mdc` adapters. `.cursor/agents/` carries five reviewer adapters. `.cursor/skills/` carries skill adapters mirroring `.agent/skills/`.
- `.codex/` has `config.toml` and five `agents/*.toml` adapters.
- `.agents/skills/` carries 16 entries — all `jc-*` prefixed plus the bare canonical skills (`author-skills`, `deslop`, `distillation`, `editorial-voice`, `napkin`, `package-deps-up-to-date`, `pkg`, `project-spec-creation`, `quality-gates`, `start-right`). No `start-right-quick`/`-thorough`. No `patterns` skill.
- `.github/` has `copilot-instructions.md` and `dependabot.yml`. No CODEOWNERS, no PR template, no Copilot reviewer wrappers.
- `scripts/` has `validate-portability.mjs` and `validate-practice-fitness.mjs` (no helpers split, no `.unit.test.ts` companions, no `validate-subagents.mjs`, no vital-surface validator).
- `.agent/memory/` has `napkin.md`, `distilled.md`, an empty `code-patterns/`, and `archive/`. No `memory/patterns/` per PDR-007.
- `.agent/practice-context/` has `incoming/` (12 stale files) and `outgoing/` (six files needing PDR-007 narrowing).
- 18 ADRs in `docs/architecture/decision-records/`. 5+ EDRs in `docs/editorial/decision-records/`.
- `package.json` scripts use mixed gate names: `format:check`/`format:fix`, `lint:check`/`lint:fix`, `typecheck`, `test`, `check`, `check:ci`. No bare `format`/`lint`, no `clean`, no `fix`.
- No `docs/explorations/` (PDR-004 tier).

### Incoming Practice canon (Practice Core)

- Eight files: `practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `practice-verification.md` (NEW), `README.md`, `index.md`, `CHANGELOG.md`, `provenance.yml`.
- Three required directories: `decision-records/` (PDRs 001–024 plus README), `patterns/` (general ecosystem-agnostic abstractions plus README), `incoming/` (Practice Box, `.gitkeep` only).
- One optional companion: `practice-context/` (sender-maintained, ephemeral exchange only per PDR-007).
- Authoritative rules document: `principles.md` (per `practice-verification.md` Bootstrap Checklist item 6 and item 9).
- Start-flow skills: `start-right-quick` and `start-right-thorough` as separate canonical skills (PDR-024 Category A).
- Pattern discovery: a `patterns` skill pointing at `practice-core/patterns/` (general) then `memory/patterns/` (instances) (PDR-024 Category A).
- Owner-edited foundations: `subagent-practice-core-protection` rule (PDR-003, PDR-024 Category E).
- Canonical gate names per PDR-008: `clean`, `build`, `dev`, `format`, `format:fix`, `lint`, `lint:fix`, `typecheck`, `test`, `check` (alias for `check:fix`), `check:fix`, `check:ci`, `fix`. Semantics: bare = verify, `:fix` = apply, `:ci` = non-mutating CI form.
- Canonical-first cross-platform per PDR-009: canonical content in `.agent/`, thin platform adapters everywhere else, activation triggers distinct from policies.
- Domain specialist capability pattern per PDR-010: four-layer triplet (reviewer + skill + rule + optional operational tooling) plus classification taxonomy.
- Continuity surfaces and surprise pipeline per PDR-011: capture → distil → graduate → enforce.
- Vital integration surfaces per PDR-024: five categories (A orientation, B feedback, C genesis, D contracts, E defensive) — each enumerated below.
- Verification: Bootstrap Checklist (13 items) + Post-Installation Health Check (8 steps) + Minimum Operational Estate + Claimed/Installed/Activated audit + Fresh-Checkout Acceptance Criteria.

### Canonical reference Practice instance (the source repo of the incoming package)

The reference repo demonstrates the executed canonical pattern. It is informative for structure only; the plan adopts the contract from the incoming Core, not from any specific repo.

- `.agent/skills/<skill>/SKILL.md` with a `shared/<skill>.md` subdirectory carrying the substantive skill content (e.g. `start-right-quick/SKILL.md` reads `start-right-quick/shared/start-right.md`).
- `.agent/commands/<bare-name>.md` as canonical command files (no `jc-` prefix at canonical layer).
- `.cursor/commands/jc-<name>.md` as project-namespace command adapters (the `jc-` prefix lives at the platform-adapter layer, not at canonical).
- `.cursor/rules/<rule-name>.mdc` as one adapter per canonical rule, with platform-native activation triggers (alwaysApply, glob, agent-selected).
- `.cursor/agents/<reviewer>.md` as reviewer adapters mirroring canonical sub-agents (sometimes with platform-specific splits, e.g. multiple architecture-reviewer personae).
- `.codex/config.toml` registers reviewer roster; `.codex/agents/<reviewer>.toml` provides one adapter per reviewer.
- `.agents/skills/<skill>/SKILL.md` as cross-platform skill discovery adapters — both canonical-named (no prefix) for capability skills and `jc-<name>` for project-namespace command-shaped workflows.
- `.github/copilot-instructions.md`, `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/`, `.github/workflows/` as the GitHub adapter surface.
- `.agent/hooks/policy.json` and `.agent/hooks/README.md` as canonical hook policy with platform-specific runtimes mounted via tracked platform config.
- Validators in `scripts/`: `validate-portability.mjs` + `validate-portability-helpers.mjs` + `validate-portability.unit.test.ts`; `validate-practice-fitness.mjs` (+ helpers + unit test); `validate-subagents.mjs` (+ helpers + unit test); `validate-fitness-vocabulary.mjs` (+ unit test); `validate-root-application-version.mjs`. TDD applied to validators themselves.

### Convergence target

The plan converges all three estates. Where the host repo has carried incidental drift (`rules.md`, single `start-right`, missing `patterns` skill, missing `subagent-practice-core-protection` rule, partial gate naming, missing reviewer cluster, missing validators, empty hooks, partial `.github/`), it adopts the canon. Where the host repo has unique substance (PKG, editorial governance, personal-identity defensives, CV-as-product, the four-field fitness model, the portability validator, the visual-regression discipline), the substance is integrated into the new structure rather than displaced.

## Foundation alignment

- Outcome: a Practice instance that passes the Bootstrap Checklist (13 items including the PDR-024 vital-surfaces audit) plus the Post-Installation Health Check on a fresh checkout, with full cross-platform adapter coverage and validators that enforce the contract.
- Impact: the host repo regains its leading-edge-reference standing in the Practice network and supports rapid hydration on a fresh machine without prior knowledge.
- Value mechanism: a self-verifying Practice that catches drift via scanners (PDR-022), with bidirectional Core↔Repo flows (PDR-024) operational.
- Acceptance: every validator green; Bootstrap Checklist walked end-to-end with evidence captured in the plan completion section; vital-surface enumeration confirmed for every Category A/B/D/E surface.

## What is uniquely ours and must be integrated, not displaced

- **Personal Knowledge Graph (PKG)**: `content/entities.json`, JSON-LD generation, [`pkg-reviewer.md`](.agent/sub-agents/templates/pkg-reviewer.md), [`pkg/SKILL.md`](.agent/skills/pkg/SKILL.md), ADR-008, ADR-010, ADR-014.
- **Editorial governance**: [`editor.md`](.agent/sub-agents/templates/editor.md), [`editorial-voice/SKILL.md`](.agent/skills/editorial-voice/SKILL.md), [`editorial-guidance.md`](.agent/directives/editorial-guidance.md), `docs/editorial/decision-records/` (EDRs as a third governance class), tilt variants.
- **Personal-identity defensives**: [`privacy.md`](.agent/directives/privacy.md), [`secops.md`](.agent/directives/secops.md), PII audit posture, git-email hygiene.
- **CV-as-product**: build-time PDF (ADR-001/002), content negotiation (ADR-009), header layout (ADR-006), tilt aliases (ADR-017), security headers (ADR-013).
- **Network contributions already adopted upstream**: `validate-portability.mjs`, `validate-practice-fitness.mjs`, four-field fitness model, cross-platform agent surface matrix, UUID provenance.
- **Discipline candidates for outbound contribution**: visual-regression-as-blocking-proof for rendering-risk slices (ADR-016 splits into product-tooling ADR + new PDR/pattern); production-build E2E pattern (currently in `distilled.md`).

## What is not unique and goes

- `rules.md` filename → adopt `principles.md`.
- Single `start-right` skill → split to `start-right-quick` + `start-right-thorough`.
- `.agent/prompts/` carrying start-right boilerplate and skill-shaped content → audit and migrate.
- Current six-rule estate → re-derive against the canonical granular action-named rule set.
- Five-reviewer roster → expand with the canonical reviewers that apply to a UI-bearing TypeScript repo (config-reviewer, docs-adr-reviewer, security-reviewer, accessibility-reviewer, design-system-reviewer, react-component-reviewer, subagent-architect, plus at least one architecture-reviewer persona) per PDR-010.
- Current `pnpm check` script shape → adopt PDR-008 canonical names.
- Current `consolidate-docs` shape → adopt new tri-destination patterns + step 8 upstream Core review + PDR-007 outgoing narrowing.
- ADR-012, ADR-015, ADR-018 → mark superseded by PDR-011 / PDR-009 / PDR-007.
- 12 files in `.agent/practice-context/incoming/` (substance graduated upstream into PDRs); 6 files in `outgoing/` (re-scope to ephemeral-only per PDR-007).
- Empty `.agent/memory/code-patterns/` → replace with `.agent/memory/patterns/` per PDR-007.

## Naming kept

- `jc-*` prefix on commands and command adapters at platform-adapter layer (canonical layer remains bare; the `jc-` prefix lives in `.cursor/commands/` and `.agents/skills/jc-*/`).

## Cross-platform adapter coverage required

Every canonical artefact must have full adapter coverage per PDR-009. The matrix:

- **Canonical rule** (`.agent/rules/<rule>.md`)
  → `.cursor/rules/<rule>.mdc` (with platform-native activation trigger).
- **Canonical sub-agent** (`.agent/sub-agents/templates/<reviewer>.md`)
  → `.cursor/agents/<reviewer>.md` (one or more personae)
  → `.codex/agents/<reviewer>.toml` registered in `.codex/config.toml`
  → `.github/` Copilot reviewer wrapper if applicable.
- **Canonical capability skill** (`.agent/skills/<skill>/SKILL.md` + `shared/<skill>.md`)
  → `.agents/skills/<skill>/SKILL.md` (cross-platform discovery, no prefix)
  → `.cursor/skills/<skill>/SKILL.md` if Cursor-native skills are used.
- **Canonical command** (`.agent/commands/<bare-name>.md`)
  → `.cursor/commands/jc-<name>.md` (project-namespace prefix at adapter layer)
  → `.agents/skills/jc-<name>/SKILL.md` (cross-platform command-as-skill discovery).
- **Canonical hook policy** (`.agent/hooks/policy.json` + `README.md`)
  → tracked platform-specific activation per the cross-platform matrix.
- **Cross-platform surface matrix** (`.agent/reference/cross-platform-agent-surface-matrix.md`)
  is the single explicit contract for supported and unsupported states; updated whenever surfaces change.

## PDR-024 vital integration surfaces — full enumeration

The plan must produce a working surface for every item below. The Bootstrap Checklist item 13 audits these explicitly.

### Category A — Core → Repo (orientation)

- A1 **Entry-point chain**: root `AGENTS.md` (and `CLAUDE.md` if applicable) → `.agent/directives/AGENT.md` → `principles.md` + `testing-strategy.md` + `metacognition.md` + practice-core trinity.
- A2 **Practice-index bridge**: `.agent/practice-index.md` exists; every link resolves.
- A3 **Start-flow skills**: `start-right-quick` and `start-right-thorough` canonical skills with adapters.
- A4 **Pattern discovery skill**: `.agent/skills/patterns/SKILL.md` + adapters; points at `practice-core/patterns/` first then `memory/patterns/`.
- A5 **Rule activation**: every canonical rule has its per-platform activation trigger; Cursor `.cursor/rules/*.mdc`, Codex tracked config, Copilot instructions.

### Category B — Repo → Core (feedback)

- B1 **Capture surface**: `.agent/memory/napkin.md`.
- B2 **Refinement surface**: `.agent/memory/distilled.md`.
- B3 **Graduation workflow**: `consolidate-docs` command with three-destination pattern extraction, ADR/PDR doctrine scan, named graduation destinations.
- B4 **Upstream Core review**: step 8 of `consolidate-docs` surfaces contradictions, extensions, refinements, supersessions, and drift candidates against existing Core.
- B5 **Practice Box (inbound)**: `.agent/practice-core/incoming/.gitkeep`.
- B6 **Ephemeral exchange (outbound)**: `.agent/practice-context/outgoing/`, scoped to ephemeral exchange only per PDR-007.

### Category C — Genesis paths

- C1 **Cold-start hydration** path documented in `practice-bootstrap.md`.
- C2 **Plasmid integration** path documented in `practice-lineage.md` Integration Flow.
- C3 **Wholesale transplantation** path documented in PDR-005 Transplant Manifest.

### Category D — Cross-cutting canonical contracts

- D1 **Canonical agent artefact architecture** (PDR-009): canonical-first layered shape validated by portability validator.
- D2 **Canonical quality-gate naming** (PDR-008): canonical scripts in `package.json`; CI invokes `check:ci`.
- D3 **Domain specialist capability pattern** (PDR-010): triplet shape (reviewer + skill + rule + optional tooling) for each specialist domain.
- D4 **Continuity surfaces + surprise pipeline** (PDR-011): named continuity contract on a canonical surface; split-loop handoff/consolidate.
- D5 **Dev tooling per ecosystem** (PDR-006): host repo's leading-edge-reference status documented in the bridge or `docs/dev-tooling.md`.

### Category E — Defensive integrations

- E1 **Owner-edited foundations** (PDR-003): `.agent/rules/subagent-practice-core-protection.md` + adapters.
- E2 **Pedagogical reinforcement** (PDR-002): consolidation discipline does not mechanically deduplicate intentional cross-document repetition; principles.md substance may be reinforced in foundation docs.
- E3 **Explorations tier** (PDR-004): `docs/explorations/` exists with README.

## Validation mechanisms

The Practice ensures its own integrations exist. Validators must be installed, tested with TDD, and wired into the gate sequence.

- **`validate-portability.mjs`** — extend to enforce PDR-009 canonical-first layered architecture: every canonical surface has its required adapters; every adapter is thin (frontmatter + pointer + invocation only); activation triggers are distinct from policies. Split helpers into `validate-portability-helpers.mjs`. Add `validate-portability.unit.test.ts`.
- **`validate-practice-fitness.mjs`** — already present; add `validate-practice-fitness.unit.test.ts` and helpers split. Add new four-field fitness frontmatter validation for the eight Core files plus principles.md, testing-strategy.md, AGENT.md, metacognition.md.
- **`validate-subagents.mjs`** (NEW) — every canonical sub-agent has its required platform adapters (Cursor + Codex + optional Copilot); reviewer roster declared in tracked platform config matches canonical. With helpers and unit test.
- **`validate-vital-surfaces.mjs`** (NEW per PDR-022 + PDR-024) — walks Category A/B/D/E surface paths and exits non-zero if any vital surface is missing. Uses the cross-platform surface matrix as the source of truth for "must exist". With helpers and unit test.
- **`validate-fitness-vocabulary.mjs`** (NEW) — validates fitness frontmatter keys are from the canonical four-field vocabulary; flags drift. With unit test.
- **`validate-root-application-version.mjs`** (OPTIONAL — adopt if applicable to this repo's release shape).
- **Wiring**: every validator runs as part of `pnpm portability:check` (or its canonical-named successor) and contributes to `pnpm check:ci`. The pre-commit hook runs `check:ci`; the pre-push hook runs `check && test:e2e`.

## Phase summary

1. State of play snapshot, plan check-in, baseline gates.
2. Replace Practice Core wholesale.
3. Rename `rules.md` → `principles.md`.
4. Restructure `.agent/prompts/` to canonical form.
5. Adopt canonical rule set with full per-platform activation.
6. Adopt canonical sub-agent reviewer roster with full cross-platform adapter coverage.
7. Adopt canonical skills estate (start-right split + missing skills + `.agents/skills/` discovery layer).
8. Adopt PDR-008 canonical gate naming end to end.
9. Adopt new `consolidate-docs` shape.
10. Create missing PDR-024 vital surfaces (patterns, explorations, hooks).
11. Complete `.github/` adapter surface.
12. Adopt validation mechanisms with TDD.
13. ADR reclassification + visual-regression PDR/pattern.
14. Practice-context hygiene under PDR-007.
15. Anchor unique substance + regenerate practice-index.
16. Final verification: vital-surfaces walk + Bootstrap Checklist + validators + `check` + `test:e2e`.

## Phase 1 — State of play snapshot, plan check-in, baseline

Outcome: clean baseline with this plan checked in to the repo and current gates passing before any structural change.
Impact: integration is recoverable; every step has a known starting point; the plan is itself a continuity surface.
Value mechanism: PDR-011 named continuity contract on a canonical surface.
Acceptance: plan exists at `.agent/plans/active/practice-core-wholesale-adoption.plan.md`; `.agent/plans/active/README.md` points to it; `git status` clean; `pnpm check` and `pnpm test:e2e` green.

Tasks:

- Copy this plan into `.agent/plans/active/practice-core-wholesale-adoption.plan.md`.
- Update `.agent/plans/active/README.md` to make this the primary plan.
- Append a "Pre-state snapshot" appendix to the plan listing: current ADRs (with title), current rules, current commands, current skills, current sub-agents, current prompts, current `.cursor/agents/` adapters, current `.codex/agents/` adapters, current `.agents/skills/` entries, current scripts, current `practice-context/` files.
- Run `pnpm check` and `pnpm test:e2e`; record a green baseline in the plan.

## Phase 2 — Replace Practice Core wholesale

Outcome: `.agent/practice-core/` contains the eight-file Core package plus the three required directories per PDR-007, exactly mirroring the incoming package contract.
Impact: PDRs and patterns become first-class Core content; verification surface exists; the Practice contract upgrade is operational.
Value mechanism: portable governance and patterns travel with the Core by construction.
Acceptance: `.agent/practice-core/` contains `practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `practice-verification.md`, `README.md`, `index.md`, `CHANGELOG.md`, `provenance.yml`, `decision-records/` (with all 24 PDRs and `README.md`), `patterns/` (with `README.md`), `incoming/.gitkeep`. The staging directory is removed. `pnpm practice:fitness` green for all Core files.

Tasks:

- Move every file and directory from `.agent/practice-core/incoming/practice-core/` into `.agent/practice-core/`, replacing the seven existing files.
- Verify the eight files plus three directories are present.
- Confirm `decision-records/README.md` and all 24 PDR files are present.
- Confirm `patterns/README.md` is present.
- Confirm `incoming/.gitkeep` is in place as the Practice Box.
- Delete `.agent/practice-core/incoming/practice-core/` after verification.
- Run `pnpm practice:fitness` (informational); if Core files exceed line/char ceilings, defer to Phase 15 reconciliation.

## Phase 3 — Rename `rules.md` → `principles.md`

Outcome: authoritative rules document is `principles.md` matching the canonical Practice name; every reference resolves.
Impact: alignment with the network's canonical name; verification scripts find the file at the expected canonical path; cross-repo legibility.
Value mechanism: PDR-007 concept-level exchange — the local concept is renamed to its canonical concept name.
Acceptance: `.agent/directives/principles.md` exists; `.agent/directives/rules.md` does not; ripgrep for `rules.md` in tracked files (excluding archives and ADR/EDR historical records) returns zero matches; `pnpm check` green.

Tasks:

- Rename `.agent/directives/rules.md` to `.agent/directives/principles.md`.
- Update every reference: `AGENT.md`, `practice-index.md`, all `.agent/rules/*.md`, all `.agent/skills/*/SKILL.md`, all `.agent/commands/*.md`, all `.agents/skills/*/SKILL.md`, all `.cursor/rules/*.mdc`, all `.cursor/commands/jc-*.md`, all `.cursor/skills/*/SKILL.md`, all `.cursor/agents/*.md`, README, CONTRIBUTING, hooks (when present), `.agent/prompts/*.prompt.md`, `.agent/plans/active/*.plan.md`, `cross-platform-agent-surface-matrix.md`, `.github/copilot-instructions.md`.
- Apply PDR-002 (deliberate cross-document reinforcement) consciously: where principles substance is repeated in foundation docs for pedagogy, leave it; where it is incidental drift, reduce to a pointer.
- Sweep validator scripts for hard-coded `rules.md`.

## Phase 4 — Restructure `.agent/prompts/` to canonical form

Outcome: `.agent/prompts/` contains only session-entry workstream prompts; skill-shaped content lives in `.agent/skills/`; completed prompts are archived; a README indexes the active estate.
Impact: clear separation of concerns; prompts become legible; agents do not mistake skill content for session entry context.
Value mechanism: the prompts surface communicates state, not workflow; PDR-024 Category A start-flow skills carry the workflow.
Acceptance: every file in `.agent/prompts/` is either `session-continuation.prompt.md`, an active workstream prompt with no start-right boilerplate, an archived/completed prompt under `archive/`, a workstream subdirectory, or `README.md` (the index).

Tasks:

- Create `.agent/prompts/README.md` modelled on the canonical structure (active prompt index table; retained completed prompts table; archives section).
- Keep [`session-continuation.prompt.md`](.agent/prompts/session-continuation.prompt.md) as the canonical session-continuation prompt.
- Move [`personal-knowledge-graph-track-a-cv-metadata-proof.prompt.md`](.agent/prompts/personal-knowledge-graph-track-a-cv-metadata-proof.prompt.md) (status: completed) to `.agent/prompts/archive/`.
- Audit [`personal-knowledge-graph-track-a-external-validation.prompt.md`](.agent/prompts/personal-knowledge-graph-track-a-external-validation.prompt.md); if completed, move to `archive/`.
- For each remaining active prompt — [`dev-tooling-hygiene.prompt.md`](.agent/prompts/dev-tooling-hygiene.prompt.md), [`linkedin-content-preparation.prompt.md`](.agent/prompts/linkedin-content-preparation.prompt.md), [`personal-knowledge-graph-track-b-source-of-truth-design.prompt.md`](.agent/prompts/personal-knowledge-graph-track-b-source-of-truth-design.prompt.md), [`tilt-retirement.prompt.md`](.agent/prompts/tilt-retirement.prompt.md) — strip start-right boilerplate (replace with a single skill reference: "Ground first via `start-right-quick` or `start-right-thorough`."); keep "Grounding truths to preserve" and "Active task" sections.
- Group workstream prompts into subdirectories where two or more prompts share a workstream (e.g. `personal-knowledge-graph/`, `dev-tooling/`).
- Update plans `current/`/`active/` link references to the new locations.

## Phase 5 — Adopt canonical rule set with full per-platform activation

Outcome: `.agent/rules/` contains the canonical granular action-named rule set; every canonical rule has its per-platform activation trigger; the Cursor `.cursor/rules/` adapter set is complete; tracked platform config carries the rule activation contract.
Impact: rules fire reliably on every supported platform; missing defensive rules (PDR-003 owner-edited foundations) are added; PDR-024 Category A item A5 (rule activation) is operational.
Value mechanism: PDR-009 activation triggers distinct from policies; PDR-022 governance-enforcement-requires-a-scanner (rules backed by validators where governance, not aspiration).
Acceptance: every canonical rule that applies to this stack is present in `.agent/rules/`; every rule has a `.cursor/rules/<rule>.mdc` adapter with `alwaysApply` or glob trigger; `subagent-practice-core-protection.md` exists with adapter; `pnpm portability:check` (extended in Phase 12) passes the rule-coverage check.

Tasks:

- Map current `.agent/rules/` against the canonical action-named rule shape; produce a mapping table (rename / add / drop) appended to the plan.
- Rename `napkin-always-on.md` → `napkin-always-active.md` to match canonical.
- Rename `read-practice.md` → `follow-the-practice.md` to match canonical.
- Add `subagent-practice-core-protection.md` (PDR-003 enforcement: sub-agents must not edit Core files).
- Add `apply-architectural-principles.md`, `lint-after-edit.md`, `read-agent-md.md`, `tdd-for-refactoring.md`, `no-skipped-tests.md`, `no-global-state-in-tests.md`, `no-type-shortcuts.md`, `tsdoc-and-documentation-hygiene.md`, `strict-validation-at-boundary.md` (those that match this stack).
- Split `invoke-reviewers.md` into per-specialist invoke rules (`invoke-code-reviewers.md`, `invoke-pkg-reviewer.md`, plus those added in Phase 6: `invoke-accessibility-reviewer.md`, `invoke-design-system-reviewer.md`, `invoke-react-component-reviewer.md`, `invoke-config-reviewer.md`, `invoke-docs-adr-reviewer.md`, `invoke-security-reviewer.md`).
- Generate `.cursor/rules/<rule>.mdc` for every canonical rule with the correct activation trigger. Keep the wrapper to frontmatter + pointer + activation only (thin per PDR-009).
- Update every reference (directives, skills, commands, prompts).

## Phase 6 — Adopt canonical sub-agent reviewer roster with full cross-platform adapter coverage

Outcome: `.agent/sub-agents/templates/` carries the canonical reviewer roster appropriate for a UI-bearing TypeScript repo with a knowledge graph and editorial governance; every reviewer has Cursor and Codex adapters; Copilot reviewer wrappers exist where applicable; reviewer roster is registered in `.codex/config.toml`.
Impact: reviewer dispatch is correct (PDR-015) and discoverable; PDR-010 specialist capability pattern is satisfied for every domain; PDR-024 Category D D3 is operational.
Value mechanism: canonical-first reviewer architecture (PDR-009); each reviewer is a triplet (template + invoke rule + optional skill).
Acceptance: every reviewer in the roster has `<reviewer>.md` canonical, `<reviewer>.md` in `.cursor/agents/`, `<reviewer>.toml` in `.codex/agents/` registered in `config.toml`, an `invoke-<reviewer>.md` rule with adapter; `pnpm validate-subagents` (Phase 12) green.

Tasks:

- Decide reviewer roster for this repo. Required: keep existing 5 (`code-reviewer`, `editor`, `pkg-reviewer`, `test-reviewer`, `type-reviewer`). Add: `accessibility-reviewer`, `design-system-reviewer`, `react-component-reviewer`, `config-reviewer`, `docs-adr-reviewer`, `security-reviewer`, `subagent-architect`, at least one `architecture-reviewer` persona (consider all four — barney/betty/fred/wilma — per PDR-015 reviewer authority and dispatch). Defer reviewers that do not apply (`clerk-reviewer`, `elasticsearch-reviewer`, `sentry-reviewer`, `mcp-reviewer`, `ground-truth-designer`, `release-readiness-reviewer`, `onboarding-reviewer`); record explicit unsupported state in the cross-platform surface matrix.
- Author canonical `<reviewer>.md` files in `.agent/sub-agents/templates/` for each new reviewer (use canonical reference shape; integrate this repo's specifics for the editor and pkg reviewers).
- Generate `.cursor/agents/<reviewer>.md` adapters for each.
- Generate `.codex/agents/<reviewer>.toml` adapters; update `.codex/config.toml` to register the full roster.
- Add `.github/` Copilot reviewer wrappers if Copilot Chat reviewers are supported.
- Add per-specialist `invoke-<reviewer>.md` rules in `.agent/rules/` with `.cursor/rules/<rule>.mdc` adapters (Phase 5 may already have done this).
- Update `.agent/practice-index.md` reviewer table.
- Author or extend skills paired with each new reviewer where the specialist warrants a skill (PDR-010 four-layer triplet; specialist skill captures the operational knowledge of how to use the reviewer).

## Phase 7 — Adopt canonical skills estate

Outcome: `.agent/skills/` contains the canonical skill set including `start-right-quick`, `start-right-thorough`, `patterns`, plus existing capability skills; every canonical skill has a cross-platform `.agents/skills/<skill>/SKILL.md` adapter; project-namespace command-shaped skills carry the `jc-` prefix only at the adapter layer.
Impact: PDR-024 Category A items A3 and A4 (start-flow skills, pattern discovery skill) operational; cross-platform skill discovery is complete.
Value mechanism: PDR-009 canonical-first skill architecture; PDR-024 vital surface presence.
Acceptance: `start-right-quick/SKILL.md` + `shared/start-right.md`, `start-right-thorough/SKILL.md` + `shared/start-right-thorough.md`, `patterns/SKILL.md` exist canonically; bare `.agents/skills/<skill>/SKILL.md` exists for every canonical capability skill; `jc-start-right-quick`, `jc-start-right-thorough`, `jc-commit`, `jc-consolidate-docs`, `jc-editor`, `jc-gates`, `jc-plan` adapters exist; `pnpm portability:check` green.

Tasks:

- Create `.agent/skills/start-right-quick/SKILL.md` and `start-right-quick/shared/start-right.md` (this repo's content: foundation list pointing at `principles.md`, `testing-strategy.md`, `metacognition.md`, distilled, napkin; mention practice box; mention visual-regression posture).
- Create `.agent/skills/start-right-thorough/SKILL.md` and `start-right-thorough/shared/start-right-thorough.md` (one-gate-at-a-time discipline; reviewer invocation; explicit re-grounding cadence).
- Remove old `.agent/skills/start-right/` and the single-skill adapters (`.cursor/commands/jc-start-right.md`, `.agents/skills/jc-start-right/`, `.cursor/skills/start-right/`).
- Create `.agent/skills/patterns/SKILL.md` (pattern discovery; points at `practice-core/patterns/` first then `memory/patterns/`; notes Practice-governance lives in PDRs).
- Create canonical `.agent/commands/<bare>.md` files for every command currently only present as `jc-<name>` in `.cursor/commands/`: `start-right-quick`, `start-right-thorough`, `commit`, `consolidate-docs`, `editor`, `gates`, `plan`, plus `metacognition`, `go`, `session-handoff`, `review` per the canonical reference command set.
- Create `.cursor/commands/jc-<name>.md` adapters for the new canonical commands.
- Create `.agents/skills/jc-<name>/SKILL.md` adapters for the new canonical commands; create `.agents/skills/<name>/SKILL.md` canonical (no-prefix) discovery for capability skills.
- Update every reference.

## Phase 8 — Adopt PDR-008 canonical gate naming end to end

Outcome: `package.json` exposes the canonical gate set with PDR-008 semantics; hooks, README, CONTRIBUTING, AGENT.md, principles.md, and all skills/commands referencing gate names are aligned.
Impact: PDR-024 Category D item D2 operational; cross-repo gate-name legibility; CI invokes `check:ci` by canonical name.
Value mechanism: per PDR-008 the convention is bare = verify, `:fix` = apply, `:ci` = non-mutating CI form; `check` aliases `check:fix` as the one deliberate ergonomic exception.
Acceptance: `package.json` exposes `clean`, `build`, `dev`, `format`, `format:fix`, `lint`, `lint:fix`, `typecheck`, `test`, `check`, `check:fix`, `check:ci`, `fix`; pre-commit runs `check:ci`; pre-push runs `check && test:e2e`; documentation is consistent; `pnpm check` and `pnpm check:ci` both green.

Tasks:

- Rewrite [`package.json`](package.json) scripts to expose every canonical name; rename `format:check` → bare `format`; same for `lint`/`lint:check`; add bare `format`/`lint` (as verify aliases) and `:fix` variants; add `clean`, `fix`.
- Update Husky hooks (`.husky/pre-commit`, `.husky/pre-push` if present) to use canonical names.
- Update [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md), [`.agent/directives/AGENT.md`](.agent/directives/AGENT.md), `.agent/directives/principles.md` (post-rename), [`.agent/skills/quality-gates/SKILL.md`](.agent/skills/quality-gates/SKILL.md), all `start-right*` skills, all command files.
- Update [ADR-005](docs/architecture/decision-records/005-knip-unused-code-detection.md) if it cites old script names; add scope-narrowing note tying gate composition to PDR-008 + PDR-020 and tool choice to PDR-006 (as per Phase 13).
- Run `pnpm check` and `pnpm check:ci`; verify CI workflows continue to pass.

## Phase 9 — Adopt new `consolidate-docs` shape

Outcome: `.agent/commands/consolidate-docs.md` carries the new specification: pattern extraction with three destinations (memory/patterns instances, practice-core/patterns general abstractions, PDRs governance); ADR- AND PDR-shaped doctrine scan with adopter-scope test; named graduation destinations including PDRs and `practice-core/patterns/`; step 8 upstream Core review (contradiction, extension, refinement, supersession, drift); step 10 PDR-007 outgoing narrowing.
Impact: PDR-024 Category B items B3 and B4 operational; the feedback loop becomes systematic; drift between Core and repo is surfaced every consolidation pass.
Value mechanism: the Practice ensures its own integrations exist (PDR-024 self-reference); `consolidate-docs` is the named graduation workflow.
Acceptance: command file lists the new step set; `jc-consolidate-docs` skill points at it; one rehearsal pass produces an upstream-review report identifying any Core/repo drift surfaced by the new step 8.

Tasks:

- Author the new `.agent/commands/consolidate-docs.md` per the canonical specification (pattern extraction tri-destination, doctrine scan including PDR-shaped, graduation destinations, upstream Core review step 8, PDR-007 outgoing narrowing step 10).
- Update [`.agents/skills/jc-consolidate-docs/SKILL.md`](.agents/skills/jc-consolidate-docs/SKILL.md) to point at the rewritten command.
- Update `.cursor/commands/jc-consolidate-docs.md` adapter.
- Update prompts that reference consolidation.
- Run a rehearsal consolidation pass against the current state; capture the upstream-review output as a working note inside the plan.

## Phase 10 — Create missing PDR-024 vital surfaces

Outcome: every PDR-024 vital surface is present in some form including `practice-core/patterns/`, `.agent/memory/patterns/`, `.agent/skills/patterns/`, `docs/explorations/`, hooks layer, owner-edited foundations rule with adapter (created in Phase 5).
Impact: Practice Maturity Level 2 minimum reached; Bootstrap Checklist item 13 passes; the failure mode "structurally present but inert" is closed.
Value mechanism: PDR-024 vital-surface enumeration as binding contract.
Acceptance: every Category A/B/C/D/E item from the enumeration has a present, operational surface; vital-surface validator (Phase 12) green.

Tasks:

- Create `.agent/memory/patterns/README.md` (instances live here per PDR-007 — host-local engineering patterns proven in this repo).
- Delete empty `.agent/memory/code-patterns/`.
- Create `.agent/skills/patterns/SKILL.md` and `.agents/skills/patterns/SKILL.md` adapter (PDR-024 A4) — already covered by Phase 7; verify alignment.
- Create `docs/explorations/README.md` (PDR-004 tier; explanation of the tier and how to file an exploration).
- Create `.agent/hooks/policy.json` and `.agent/hooks/README.md` (start with empty/declarative policy if no hooks active; document deliberate-omission per practice-bootstrap.md).
- Document any deliberately-omitted vital surface in `.agent/reference/cross-platform-agent-surface-matrix.md` with rationale (no silent omissions; no surface absent without explicit recording).

## Phase 11 — Complete `.github/` adapter surface

Outcome: `.github/` carries the GitHub-platform Practice adapters: `copilot-instructions.md` (updated), `CODEOWNERS`, `PULL_REQUEST_TEMPLATE.md`, `ISSUE_TEMPLATE/`, optional `workflows/` for CI gating using PDR-008 canonical names.
Impact: GitHub becomes a fully-supported agent surface; reviewer wrappers and PR templates align with the Practice; Copilot reads the same canonical directives.
Value mechanism: PDR-009 canonical-first cross-platform; PDR-024 Category A entry-point chain extended to GitHub.
Acceptance: every required `.github/` artefact is present; Copilot reviewer adapters mirror the canonical reviewer roster (where Copilot supports them); `cross-platform-agent-surface-matrix.md` declares supported / unsupported states explicitly.

Tasks:

- Update [`.github/copilot-instructions.md`](.github/copilot-instructions.md) to reference `principles.md`, `testing-strategy.md`, the canonical practice-core entry points, and the canonical gate names.
- Create `.github/CODEOWNERS` mapping practice-core, directives, and core surfaces to the owner; require explicit owner approval per PDR-003.
- Create `.github/PULL_REQUEST_TEMPLATE.md` with a Practice-aligned PR checklist (gates run, visual-regression invoked if applicable, ADR/PDR/EDR considered, practice-index updated if surfaces changed).
- Create `.github/ISSUE_TEMPLATE/` if applicable.
- Add `.github/` Copilot reviewer wrappers for the canonical reviewer roster as thin pointer surfaces (per the canonical reference pattern).
- If GitHub Actions workflows exist or are added, ensure they invoke `pnpm check:ci` by canonical name.
- Update `cross-platform-agent-surface-matrix.md` with the GitHub adapter coverage.

## Phase 12 — Adopt validation mechanisms with TDD

Outcome: every validator named in the Validation Mechanisms section exists, has a unit-test companion (TDD per `principles.md` Testing section), and is wired into the gate sequence.
Impact: PDR-022 governance-enforcement-requires-a-scanner satisfied; PDR-024 vital-surface presence is enforceable; portability and fitness contracts are verified continuously.
Value mechanism: rules backed by scanners are governance; rules without scanners are aspiration.
Acceptance: validators exist with helpers split and unit-test companions; each is invoked from `pnpm check` (or canonical-named successor); every validator green; new vital-surface validator catches a deliberately-introduced fault in a smoke test before being committed clean.

Tasks:

- Extend [`scripts/validate-portability.mjs`](scripts/validate-portability.mjs) to enforce PDR-009 canonical-first layered architecture, PDR-024 cross-cutting contracts, PDR-008 canonical gate naming presence in `package.json`. Split helpers into `validate-portability-helpers.mjs`. Author `validate-portability.unit.test.ts` (TDD: write failing test cases for each rule first; then make them pass).
- Add helpers split and unit test for [`scripts/validate-practice-fitness.mjs`](scripts/validate-practice-fitness.mjs); extend to validate the new four-field fitness frontmatter for the eight Core files plus `principles.md`, `testing-strategy.md`, `AGENT.md`, `metacognition.md`.
- Author `scripts/validate-subagents.mjs` (+ helpers + `unit.test.ts`): every canonical sub-agent has its required platform adapters; reviewer roster declared in `.codex/config.toml` matches canonical; thin-wrapper contract enforced.
- Author `scripts/validate-vital-surfaces.mjs` (+ helpers + `unit.test.ts`): walks Category A/B/D/E vital surfaces; uses `cross-platform-agent-surface-matrix.md` as the authoritative supported/unsupported contract; exits non-zero if any required surface is missing or broken.
- Author `scripts/validate-fitness-vocabulary.mjs` (+ `unit.test.ts`): validates fitness frontmatter keys are from the canonical four-field vocabulary; flags drift.
- Wire validators into `package.json` scripts; update `pnpm check` (canonical-named) to invoke every validator in sequence.
- Update [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md), `principles.md` to document the validator estate.

## Phase 13 — ADR reclassification and visual-regression PDR/pattern

Outcome: ADRs that govern the Practice (not the product) are marked superseded by their canonical PDR equivalents; visual-regression discipline is captured as a portable PDR or pattern (candidate for upstream contribution).
Impact: ADR estate is honest about scope; the Practice gains a discipline that other UI-bearing repos can adopt; PDR-019 (ADR scope by reusability) satisfied locally.
Value mechanism: every ADR governs host-product; every PDR governs the Practice; the boundary is clean.
Acceptance: ADR-012, ADR-015, ADR-018 carry `Superseded by PDR-NNN` headers and concise redirect notes; ADR-016 is split into product-tooling ADR + new local PDR or `practice-core/patterns/` pattern; ADR-005 carries scope-narrowing note per PDR-019.

Tasks:

- Add `Superseded by PDR-011` to [ADR-012 Agent memory pipeline](docs/architecture/decision-records/012-agent-memory-pipeline.md) with a one-paragraph redirect.
- Add `Superseded by PDR-009` to [ADR-015 Codex adapter model](docs/architecture/decision-records/015-codex-adapter-model.md).
- Add `Superseded by PDR-007` to [ADR-018 Practice-context adjunct for plasmid exchange](docs/architecture/decision-records/018-practice-context-adjunct-for-plasmid-exchange.md).
- For [ADR-016 Visual regression harness](docs/architecture/decision-records/016-review-oriented-visual-regression-harness.md): keep the ADR for the harness tool choice; author a new local PDR (e.g. `PDR-LOCAL-001-rendering-risk-needs-blocking-visual-proof.md` in `.agent/practice-core/decision-records/`) for the discipline. If the discipline generalises across multiple instances, also draft a `practice-core/patterns/` entry as an outbound contribution candidate (executed in Phase 14 if appropriate).
- For [ADR-005 Knip](docs/architecture/decision-records/005-knip-unused-code-detection.md): add scope-narrowing note tying gate composition to PDR-008 + PDR-020 and tool choice to PDR-006.
- Update `.agent/practice-index.md` ADR table to reflect superseded states.

## Phase 14 — Practice-context hygiene under PDR-007

Outcome: `.agent/practice-context/incoming/` cleared of obsolete material; `outgoing/` re-scoped to ephemeral exchange only; substance graduated to PDRs / `practice-core/patterns/` / `.agent/reference/` as appropriate; outbound contribution candidates recorded.
Impact: practice-context becomes truthful; PDR-007 narrowing operationalised; future plasmid passes are not polluted by stale substance.
Value mechanism: `outgoing/` carries ephemeral exchange context only; substance lives in Core or in PDRs/patterns.
Acceptance: `.agent/practice-context/incoming/` contains only `.gitkeep`; `outgoing/` contains only ephemeral notes for the next outbound pass; substance worth keeping is anchored in PDRs / patterns / reference.

Tasks:

- Audit each of the 12 files in `.agent/practice-context/incoming/`. For each, identify whether substance has graduated upstream into the new PDR set (most have: `three-dimension-fitness-functions.md` → trinity fitness model; `practice-maturity-framework.md` → referenced by PDR-024; `production-reviewer-scaling.md` → PDR-010; `two-way-merge-methodology.md` → PDR-005; etc.).
- For files that do not have a graduated home but carry useful substance for this repo, move to `.agent/reference/`.
- Delete the rest.
- Audit each of the 6 files in `.agent/practice-context/outgoing/`; keep only those that are genuinely ephemeral exchange context for the next outbound pass; migrate substance to PDRs or patterns.
- Capture outbound contribution candidates: visual-regression-as-blocking-proof (Phase 13) and production-build E2E pattern (currently in distilled.md). Either author as `practice-core/patterns/` entries or as ephemeral `outgoing/` notes pointing at the local PDR/pattern.

## Phase 15 — Anchor unique substance + regenerate `.agent/practice-index.md`

Outcome: `.agent/practice-index.md` truthfully reflects the new estate; PKG, editorial, personal-identity, and CV-as-product clusters are explicitly anchored; AGENT.md, README, CONTRIBUTING reconciled with the new structure.
Impact: a hydrating agent on a fresh checkout finds every unique surface without prior knowledge; the bridge fulfils its PDR-007 role.
Value mechanism: the practice-index is the one permitted Core→local link; truthful reflection is the contract.
Acceptance: every link in `.agent/practice-index.md` resolves; explicit sections for PKG, editorial governance, personal-identity defensives, CV-as-product ADRs, EDR governance class, contributed validators; AGENT.md command/skill/rule/adapter tables updated; README, CONTRIBUTING, gate documentation aligned.

Tasks:

- Regenerate `.agent/practice-index.md` against the live estate; use the canonical bridge format.
- Add explicit sections: PKG cluster (entity model, JSON-LD, pkg-reviewer, pkg skill, related ADRs); Editorial governance (editor reviewer, editorial-voice skill, editorial-guidance directive, EDRs); Personal-identity defensives (privacy.md, secops.md, PII audit); CV-as-product ADRs; Contributed network artefacts (validators, fitness model, surface matrix).
- Reconcile [`AGENT.md`](.agent/directives/AGENT.md): foundation list, command list, skill list, rule list, sub-agent list, structure block.
- Update [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md) to reflect the new gate sequence, command names, directory structure, validator estate.
- Update `cross-platform-agent-surface-matrix.md` with the full adapter coverage and explicit unsupported states.

## Phase 16 — Final verification: vital-surfaces walk + Bootstrap Checklist + validators + check + e2e

Outcome: every validator green; every Bootstrap Checklist item passes; every PDR-024 vital surface confirmed present and operational; full gate sequence green on a fresh checkout.
Impact: hydration is repeatable; the Practice contract is enforced; the integration is provably complete.
Value mechanism: the verification surface (`practice-verification.md`) is the binding contract; passing it is the definition of done.
Acceptance: `pnpm portability:check`, `pnpm practice:fitness` (informational and strict), `pnpm validate-subagents`, `pnpm validate-vital-surfaces`, `pnpm validate-fitness-vocabulary`, `pnpm check`, `pnpm check:ci`, `pnpm test:e2e` all green; Bootstrap Checklist items 1–13 walked with evidence captured; Post-Installation Health Check 8 steps walked; Claimed/Installed/Activated audit complete; Fresh-Checkout Acceptance Criteria 1–6 satisfied.

Tasks:

- Run validators in this order: `pnpm validate-vital-surfaces`, `pnpm validate-portability`, `pnpm validate-subagents`, `pnpm validate-practice-fitness`, `pnpm validate-fitness-vocabulary`, `pnpm check`, `pnpm check:ci`, `pnpm test:e2e`. Fix any failures before declaring complete.
- Walk every Bootstrap Checklist item in [`.agent/practice-core/practice-verification.md`](.agent/practice-core/practice-verification.md); record evidence for each item in the plan completion section.
- Walk the Post-Installation Health Check 8 steps; record outcomes.
- Walk the Claimed/Installed/Activated audit; record any silent gaps and resolve them.
- Walk the Fresh-Checkout Acceptance Criteria; ideally on a clean clone or by simulation.
- Capture the upstream-review output (from Phase 9 rehearsal) as the inaugural feedback record back to the Practice network.
- Mark plan complete; archive into `.agent/plans/complete/`.

## Notes

- The continual-learning slash-command request that arrived earlier in this conversation is not part of this plan and can be handled separately.
- Each phase ends with the restart-on-fix discipline (a fix in one gate restarts the full sequence). Plan does not commit to commit boundaries; the executing agent decides commit slicing inside each phase, in alignment with `principles.md` and the canonical commit command.
- The plan file itself is the continuity surface (PDR-011) for this multi-session work; if work pauses, the next session resumes from Phase N's task list.
- TSDoc on all new validator scripts; READMEs for new directories (`.agent/memory/patterns/`, `docs/explorations/`, `.agent/hooks/`, `.github/ISSUE_TEMPLATE/` if added).
- The PDR numbering for any new local PDR uses a `PDR-LOCAL-NNN` namespace inside `.agent/practice-core/decision-records/` to distinguish local-authored from network-authored PDRs until graduation; alternative numbering schemes can be agreed during Phase 13 if a different convention is preferred.
