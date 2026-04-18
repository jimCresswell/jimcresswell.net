---
name: Practice Core Wholesale Adoption
overview: Adopt the incoming Practice Core wholesale (eight files plus three required directories, 24 PDRs, new verification surface), drop incidental local divergence, restructure `.agent/prompts/` to canonical form, install the full cross-platform agent framework (rules, sub-agents, skills, commands, hooks, workflows, validators) across all five required platforms (Cursor, Claude, Codex, Copilot, cross-platform discovery) per PDR-009 and PDR-024, and integrate this repo's genuinely-unique substance (PKG, editorial governance, personal-identity defensives, CV-as-product) into the new structure. Integration-first: no compression, deletion, or fitness-driven trimming during the adoption — those happen in a separate session afterwards.
todos:
  - id: phase-1-state-of-play
    content: "Phase 1 — State of play snapshot, plan organisation (lifecycle lanes per canonical convention; clear icebox into future/), delete dead Cursor-plugin continual-learning hook state, baseline gates green"
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
    content: "Phase 6 — Adopt canonical sub-agent reviewer roster (full canonical + Cursor + Claude + Codex + Copilot adapters) including mcp-reviewer and the four architecture-reviewer personae"
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
    content: "Phase 11 — Complete .github/ Copilot platform adapter surface: copilot-instructions, CODEOWNERS, PR template, ISSUE templates, REQUIRED workflows for check/validation (build/deploy stays with Vercel), Copilot reviewer adapters"
    status: pending
  - id: phase-12-validation
    content: "Phase 12 — Adopt validation mechanisms: extend portability validator for PDR-009/024 across all five platforms, add validate-subagents, vital-surface validator, fitness vocabulary validator, TDD on each. Fitness validators stay informational until integration is complete."
    status: pending
  - id: phase-13-adr-reclassification
    content: "Phase 13 — Mark ADR-012/015/018 superseded by PDRs; split ADR-016 into product-tooling ADR + new PDR/pattern for the visual-regression discipline. Strictly local concerns stay as ADRs; reusable Practice concerns become PDRs in the same numbering scheme."
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

Three estates in tension. The plan exists to converge them.

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

The plan converges all three estates. Where the host repo has carried incidental drift (`rules.md`, single `start-right`, missing `patterns` skill, missing `subagent-practice-core-protection` rule, partial gate naming, missing reviewer cluster, missing validators, empty hooks, partial `.github/`, no `.claude/` adapter directory), it adopts the canon. Where the host repo has unique substance (PKG, editorial governance, personal-identity defensives, CV-as-product, the four-field fitness model, the portability validator, the visual-regression discipline), the substance is integrated into the new structure rather than displaced.

### Integration-first principle

The adoption is an **inclusion exercise**, not a compression exercise. During every phase:

- **No file is held back, trimmed, summarised, or omitted because of a fitness ceiling.** The four-field fitness vocabulary (`line target`, `line limit`, `char limit`, `line length`) is informational during integration. Fitness validators run in informational mode and never block.
- **No skill, reviewer, command, rule, hook, or workflow is treated as optional.** If a platform requires an adapter, the adapter is required. If a specialist domain warrants a triplet (reviewer + skill + rule), all three exist.
- **Compression, deletion, and reduction happen in a dedicated post-integration session.** Once the canonical estate is fully installed, a separate fitness-reconciliation pass enforces ceilings, deletes genuine duplication, and confirms each surface earns its place.

This protects against the common failure mode of integration-time pruning that quietly omits required surfaces because they look "non-essential" in isolation.

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
- Five-reviewer roster → expand with the canonical reviewers that apply to a UI-bearing TypeScript repo with a knowledge graph and MCP-adjacent work (config-reviewer, docs-adr-reviewer, security-reviewer, accessibility-reviewer, design-system-reviewer, react-component-reviewer, mcp-reviewer, subagent-architect, plus the four architecture-reviewer personae barney/betty/fred/wilma) per PDR-010 / PDR-015.
- Current `pnpm check` script shape → adopt PDR-008 canonical names.
- Current `consolidate-docs` shape → adopt new tri-destination patterns + step 8 upstream Core review + PDR-007 outgoing narrowing.
- ADR-012, ADR-015, ADR-018 → mark superseded by PDR-011 / PDR-009 / PDR-007.
- 12 files in `.agent/practice-context/incoming/` (substance graduated upstream into PDRs); 6 files in `outgoing/` (re-scope to ephemeral-only per PDR-007).
- Empty `.agent/memory/code-patterns/` → replace with `.agent/memory/patterns/` per PDR-007.

## Naming kept

- `jc-*` prefix on commands and command adapters at platform-adapter layer (canonical layer remains bare; the `jc-` prefix lives in `.cursor/commands/` and `.agents/skills/jc-*/`).

## Interaction with active threads

This plan is a structural ratchet that touches the surfaces every other in-flight thread depends on. Recommended sequence: **finish this plan before resuming the other threads**, or at minimum complete Phases 3 (rename `principles.md`), 4 (restructure prompts), 7 (split `start-right`), and 8 (canonical gate names) before touching any thread that handles gates, prompts, or rules.

- **Track B Phase B2.1 — PKG source-of-truth design** ([plan](.agent/plans/active/personal-knowledge-graph-source-of-truth-design.plan.md))
  - Affected: Phase 7, Phase 15.
  - The `pkg` skill and `pkg-reviewer` get re-anchored as the canonical PKG cluster in the regenerated practice-index. No substance change.
- **LinkedIn content prep** ([plan](.agent/plans/current/linkedin-update.plan.md))
  - Affected: Phase 4.
  - `linkedin-content-preparation.prompt.md` loses start-right boilerplate, gains a single skill reference. Substance preserved.
- **Tilt retirement** ([plan](.agent/plans/current/tilt-retirement.plan.md))
  - Affected: Phase 4, Phase 8.
  - Prompt restructured (boilerplate stripped); any reference to gate names in the plan needs realignment to PDR-008 canonical names.
- **Dev-tooling hygiene** ([plan](.agent/plans/current/dev-tooling-hygiene.plan.md))
  - Affected: Phase 4, Phase 8, Phase 12.
  - Prompt restructured; gate names canonicalised; the dependency-cruiser ninth-gate work integrates cleanly with the validator estate adopted in Phase 12.

The four prompts retain their `## Grounding truths to preserve` and `## Active task` sections through Phase 4; only start-right boilerplate is replaced with a single skill reference. Plan files are unchanged unless they cite the old gate names or the old `rules.md` filename.

## Cross-platform adapter coverage required

Every canonical artefact must have an adapter on every supported platform per PDR-009. Adapters are thin (frontmatter + pointer + activation trigger only); substance lives in canonical layer.

### Required platforms

| Platform                 | Root entry                        | Adapter directory                                                                                          | Status                                        |
| ------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Universal contract       | `AGENTS.md`, `CLAUDE.md`          | n/a (root files)                                                                                           | Required                                      |
| Cursor                   | (reads `.cursor/`)                | `.cursor/{agents,commands,rules,skills}/`                                                                  | Required                                      |
| Claude Code              | `CLAUDE.md`                       | `.claude/{agents,commands,rules,skills,settings.json}`                                                     | Required (currently absent — must be created) |
| Codex                    | `AGENTS.md`                       | `.codex/{agents/,config.toml}`                                                                             | Required                                      |
| Copilot                  | `.github/copilot-instructions.md` | `.github/{copilot-instructions.md,CODEOWNERS,PULL_REQUEST_TEMPLATE.md,ISSUE_TEMPLATE/,workflows/,agents/}` | Required                                      |
| Cross-platform discovery | (read by any agent host)          | `.agents/skills/<skill-or-jc-command>/SKILL.md`                                                            | Required                                      |

### Adapter matrix per artefact type

- **Canonical rule** (`.agent/rules/<rule>.md`)
  → `.cursor/rules/<rule>.mdc` (with Cursor-native `alwaysApply` / glob trigger)
  → `.claude/rules/<rule>.md` (with Claude-native activation)
  → `.codex/` rule registration via `config.toml` (Codex has no separate rules layer)
  → Copilot rule reference via `.github/copilot-instructions.md` (Copilot consumes a single instructions file).
- **Canonical sub-agent** (`.agent/sub-agents/templates/<reviewer>.md`)
  → `.cursor/agents/<reviewer>.md` (one file per reviewer; multiple personae for the architecture reviewer per PDR-015)
  → `.claude/agents/<reviewer>.md`
  → `.codex/agents/<reviewer>.toml` registered in `.codex/config.toml`
  → `.github/agents/<reviewer>.md` (Copilot reviewer wrapper) and reference in `copilot-instructions.md`.
- **Canonical capability skill** (`.agent/skills/<skill>/SKILL.md` + `shared/<skill>.md`)
  → `.cursor/skills/<skill>/SKILL.md`
  → `.claude/skills/<skill>/SKILL.md`
  → `.agents/skills/<skill>/SKILL.md` (cross-platform discovery, no prefix)
  → Codex: skills surface as command-shaped via `.agents/skills/` and `.codex/` registration.
- **Canonical command** (`.agent/commands/<bare-name>.md`)
  → `.cursor/commands/jc-<name>.md` (project-namespace prefix at adapter layer)
  → `.claude/commands/jc-<name>.md`
  → `.agents/skills/jc-<name>/SKILL.md` (cross-platform command-as-skill discovery)
  → Codex inherits via `.agents/skills/`.
- **Canonical hook policy** (`.agent/hooks/policy.json` + `README.md`)
  → Cursor: `.cursor/hooks/<hook>.json` (only when an active hook is required; policy file is the canonical contract)
  → Claude: `.claude/settings.json` `hooks` section
  → other platforms inherit declaratively via the policy contract.
- **Canonical workflow** (`.agent/workflows/` if used; otherwise platform-only)
  → `.github/workflows/<name>.yml` (REQUIRED — see Phase 11 for the check/validation set; build/deploy stays with Vercel and is not in scope here).

### Cross-platform surface matrix

`.agent/reference/cross-platform-agent-surface-matrix.md` is the single authoritative contract listing every supported platform, every adapter that must exist, and every explicit unsupported state. Phase 15 regenerates it; Phase 12's `validate-vital-surfaces.mjs` consumes it as the source of truth.

## PDR-024 vital integration surfaces — full enumeration

The plan must produce a working surface for every item below. The Bootstrap Checklist item 13 audits these explicitly.

### Category A — Core → Repo (orientation)

- A1 **Entry-point chain**: root `AGENTS.md` and `CLAUDE.md` → `.agent/directives/AGENT.md` → `principles.md` + `testing-strategy.md` + `metacognition.md` + practice-core trinity. Each platform-specific entry (Cursor, Codex, Copilot) routes through the same canonical chain.
- A2 **Practice-index bridge**: `.agent/practice-index.md` exists; every link resolves.
- A3 **Start-flow skills**: `start-right-quick` and `start-right-thorough` canonical skills with adapters.
- A4 **Pattern discovery skill**: `.agent/skills/patterns/SKILL.md` + adapters; points at `practice-core/patterns/` first then `memory/patterns/`.
- A5 **Rule activation**: every canonical rule has its per-platform activation trigger on every required platform — Cursor `.cursor/rules/*.mdc`, Claude `.claude/rules/`, Codex tracked config, Copilot via `copilot-instructions.md`.

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
- D3 **Domain specialist capability pattern** (PDR-010): full triplet (reviewer + skill + invoke-rule) for every specialist domain plus operational tooling where the specialism warrants it.
- D4 **Continuity surfaces + surprise pipeline** (PDR-011): named continuity contract on a canonical surface; split-loop handoff/consolidate.
- D5 **Dev tooling per ecosystem** (PDR-006): host repo's leading-edge-reference status documented in the bridge or `docs/dev-tooling.md`.

### Category E — Defensive integrations

- E1 **Owner-edited foundations** (PDR-003): `.agent/rules/subagent-practice-core-protection.md` + adapters.
- E2 **Pedagogical reinforcement** (PDR-002): consolidation discipline does not mechanically deduplicate intentional cross-document repetition; principles.md substance may be reinforced in foundation docs.
- E3 **Explorations tier** (PDR-004): `docs/explorations/` exists with README.

## Validation mechanisms

The Practice ensures its own integrations exist. Validators are installed, tested with TDD, and wired into the gate sequence. Per the integration-first principle, fitness validators run in informational mode throughout the adoption and only become blocking after the dedicated post-integration reconciliation session.

- **`validate-portability.mjs`** — extend to enforce PDR-009 canonical-first layered architecture across all five required platforms (Cursor, Claude, Codex, Copilot, cross-platform discovery): every canonical surface has its required adapters on every required platform; every adapter is thin (frontmatter + pointer + invocation only); activation triggers are distinct from policies. Split helpers into `validate-portability-helpers.mjs`. Add `validate-portability.unit.test.ts`. Blocking from Phase 12 onwards.
- **`validate-practice-fitness.mjs`** — extend with four-field fitness frontmatter validation for the eight Core files plus `principles.md`, `testing-strategy.md`, `AGENT.md`, `metacognition.md`. Split helpers; add `validate-practice-fitness.unit.test.ts`. **Informational only during integration**; promoted to blocking by the post-integration fitness reconciliation session.
- **`validate-subagents.mjs`** (NEW) — every canonical sub-agent has its required platform adapters on every required platform (Cursor + Claude + Codex + Copilot); reviewer roster declared in `.codex/config.toml`, `.claude/`, and `.github/` matches canonical. With helpers and unit test. Blocking from Phase 12 onwards.
- **`validate-vital-surfaces.mjs`** (NEW per PDR-022 + PDR-024) — walks Category A/B/C/D/E surface paths and exits non-zero if any vital surface is missing. Uses `.agent/reference/cross-platform-agent-surface-matrix.md` as the source of truth for "must exist". With helpers and unit test. Blocking from Phase 12 onwards.
- **`validate-fitness-vocabulary.mjs`** (NEW) — validates fitness frontmatter keys are from the canonical four-field vocabulary; flags drift. With unit test. **Informational only during integration**; vocabulary lock-in happens at post-integration reconciliation.
- **Wiring**: every validator is registered in `package.json` and runs as part of `pnpm check` (canonical name per PDR-008). Blocking validators contribute to `pnpm check:ci`; informational validators run with a non-zero exit suppressed during the adoption window. The pre-commit hook runs `check:ci`; the pre-push hook runs `check && test:e2e`.

`validate-root-application-version.mjs` is **not adopted** — this repo is not a monorepo and has no other versions to distinguish from the root. Recorded as explicitly unsupported in the surface matrix.

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
11. Complete `.github/` Copilot platform adapter surface (instructions, CODEOWNERS, PR/issue templates, reviewer wrappers, REQUIRED check/validator/e2e workflows).
12. Adopt validation mechanisms with TDD (blocking surface validators; informational fitness validators during integration).
13. ADR reclassification + visual-regression PDR/pattern.
14. Practice-context hygiene under PDR-007.
15. Anchor unique substance + regenerate practice-index.
16. Final verification: vital-surfaces walk + Bootstrap Checklist + validators + `check` + `test:e2e`.

## Phase 1 — State of play snapshot, plan organisation, baseline

Outcome: clean baseline with this plan checked in to the repo, plan directory aligned with the canonical lifecycle convention, dead Cursor-plugin hooks removed, and current gates passing before any structural change.
Impact: integration is recoverable; every step has a known starting point; the plan is itself a continuity surface; downstream agents do not hit dead hook references.
Value mechanism: PDR-011 named continuity contract on a canonical surface.
Acceptance: plan exists at `.agent/plans/active/practice-core-wholesale-adoption.plan.md`; `.agent/plans/active/README.md` points to it; plan-directory lifecycle lanes match the canonical convention (`active/`, `current/`, `future/`, `archive/` semantics); `.cursor/hooks/` cleared of dead `continual-learning` state; `git status` clean; `pnpm check` and `pnpm test:e2e` green.

Tasks:

- Confirm this plan lives at `.agent/plans/active/practice-core-wholesale-adoption.plan.md`.
- Update `.agent/plans/active/README.md` to make this the primary plan.
- Reconcile plan-directory lifecycle lanes against the canonical `plan` command convention: keep `active/` (NOW), `current/` (NEXT), introduce `future/` as the canonical name for strategic later-intent plans (current `icebox/` content moves into `future/`; `icebox/` is removed). Decide explicitly whether `complete/` keeps its name or renames to `archive/` — record the decision in the plan and apply uniformly. Move loose root-level plan files (e.g. `graph-metaplan.plan.md`) into the lane that matches their lifecycle.
- Update `.agent/plans/README.md` (and any plan-discovery skill) to describe the lane semantics: `active/` in-progress executable, `current/` queued executable, `future/` strategic brief, `archive/` (or `complete/`) completed; `research/` is supplementary reference, not a lifecycle lane.
- Remove dead Cursor-plugin hook surfaces: delete `.cursor/hooks/state/continual-learning.json` and `.cursor/hooks/state/.gitignore`; remove the empty `.cursor/hooks/state/` and `.cursor/hooks/` directories. The Practice has its own learning loop (napkin → distilled → `consolidate-docs`); the dead `continual-learning` skill from an uninstalled Cursor plugin is fully replaced and must not leave orphaned state.
- Append a "Pre-state snapshot" appendix to the plan listing: current ADRs (with title), current rules, current commands, current skills, current sub-agents, current prompts, current `.cursor/agents/` adapters, current `.claude/` adapter coverage (currently absent), current `.codex/agents/` adapters, current `.agents/skills/` entries, current scripts, current `practice-context/` files, current `.github/` surface, current GitHub Actions workflow set.
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
- Run `pnpm practice:fitness` in informational mode; record output as a working note. Per the integration-first principle, no Core file is trimmed, summarised, or held back during this phase regardless of fitness output. A dedicated post-integration session enforces ceilings.

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

- Reviewer roster (required, full): keep existing 5 (`code-reviewer`, `editor`, `pkg-reviewer`, `test-reviewer`, `type-reviewer`); add `accessibility-reviewer`, `design-system-reviewer`, `react-component-reviewer`, `config-reviewer`, `docs-adr-reviewer`, `security-reviewer`, `mcp-reviewer` (this repo authors and integrates with MCP servers, and runs in MCP-rich agent environments), `subagent-architect`, plus all four architecture-reviewer personae (`architecture-reviewer-barney`, `architecture-reviewer-betty`, `architecture-reviewer-fred`, `architecture-reviewer-wilma`) per PDR-015 reviewer authority and dispatch.
- Reviewers explicitly unsupported here (record in `cross-platform-agent-surface-matrix.md` with one-line rationale): `clerk-reviewer` (no Clerk auth), `elasticsearch-reviewer` (no Elasticsearch), `sentry-reviewer` (no Sentry/OTel pipeline), `ground-truth-designer` (Oak-curriculum-specific), `release-readiness-reviewer` (Vercel handles release), `onboarding-reviewer` (single-contributor repo).
- Author canonical `<reviewer>.md` files in `.agent/sub-agents/templates/` for each new reviewer (use canonical reference shape; integrate this repo's specifics for the editor and pkg reviewers).
- Generate `.cursor/agents/<reviewer>.md` adapters for each.
- Generate `.claude/agents/<reviewer>.md` adapters for each (creating `.claude/agents/` if absent).
- Generate `.codex/agents/<reviewer>.toml` adapters; update `.codex/config.toml` to register the full roster.
- Generate `.github/agents/<reviewer>.md` Copilot reviewer wrappers for the canonical roster (Copilot is a required platform — adapters are not optional).
- Add per-specialist `invoke-<reviewer>.md` rules in `.agent/rules/` with adapters on every required platform (Cursor `.mdc`, Claude rule, Codex registration, Copilot reference) — Phase 5 may already have produced some.
- Update `.agent/practice-index.md` reviewer table.
- Author or extend skills paired with each new reviewer where the specialist warrants a skill (PDR-010 triplet; specialist skill captures the operational knowledge of how to use the reviewer). Skills here are not optional — every domain that gets a reviewer also gets the skill component of the triplet.

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
- Update `.cursor/commands/jc-consolidate-docs.md` adapter; create `.claude/commands/jc-consolidate-docs.md` adapter.
- Sweep `continual-learning` references across the repo and replace with the Practice learning loop (napkin → distilled → `consolidate-docs`). Files known to need updates: [`AGENTS.md`](AGENTS.md) (replace the "landing pads for the continual-learning skill" framing with the Practice learning loop wording; keep the anchor lists), [`.agent/skills/distillation/SKILL.md`](.agent/skills/distillation/SKILL.md) (update lines that name the continual-learning skill to reference the canonical learning loop). The Practice has its own learning loop; the dead Cursor-plugin terminology is fully replaced.
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

## Phase 11 — Complete `.github/` Copilot platform adapter surface

Outcome: `.github/` carries the full GitHub/Copilot Practice platform adapter set: `copilot-instructions.md`, `CODEOWNERS`, `PULL_REQUEST_TEMPLATE.md`, `ISSUE_TEMPLATE/`, `agents/` reviewer wrappers, and **required** `workflows/` for check and validation gating. Build and deploy remain Vercel's responsibility and are deliberately out of scope here.
Impact: GitHub/Copilot becomes a fully-supported agent surface alongside Cursor, Claude, and Codex; PRs are gated by the same canonical validators that run locally; reviewer wrappers and PR templates align with the Practice.
Value mechanism: PDR-009 canonical-first cross-platform; PDR-024 Category A entry-point chain extended to GitHub; PDR-022 governance-enforcement-requires-a-scanner extended to PR gates.
Acceptance: every required `.github/` artefact is present; Copilot reviewer adapters mirror the canonical reviewer roster one-for-one; GitHub Actions workflows run `check:ci` and the validator suite on every PR; `cross-platform-agent-surface-matrix.md` declares the GitHub/Copilot platform fully supported and lists every adapter.

Tasks:

- Update [`.github/copilot-instructions.md`](.github/copilot-instructions.md) to reference `principles.md`, `testing-strategy.md`, `metacognition.md`, the canonical practice-core entry points (`practice-core/practice.md`, `practice-bootstrap.md`, `practice-verification.md`), and the canonical gate names.
- Create `.github/CODEOWNERS` mapping `.agent/practice-core/`, `.agent/directives/`, and core surfaces to the owner; require explicit owner approval per PDR-003.
- Create `.github/PULL_REQUEST_TEMPLATE.md` with a Practice-aligned PR checklist (gates run, visual-regression invoked if applicable, ADR/PDR/EDR considered, practice-index updated if surfaces changed, validator suite green).
- Create `.github/ISSUE_TEMPLATE/` with bug-report and feature-request templates.
- Create `.github/agents/<reviewer>.md` Copilot reviewer wrappers for every reviewer in the canonical roster (Phase 6) as thin pointer surfaces. Copilot is a required platform; these adapters are not optional.
- Create the **required** GitHub Actions workflow set for check and validation (build/deploy is Vercel's job and stays out of scope):
  - `.github/workflows/check.yml` — runs on every PR and push; invokes `pnpm install --frozen-lockfile` then `pnpm check:ci`.
  - `.github/workflows/validators.yml` — invokes the validator estate from Phase 12 (`pnpm validate-portability`, `pnpm validate-subagents`, `pnpm validate-vital-surfaces`, `pnpm validate-practice-fitness` informational, `pnpm validate-fitness-vocabulary` informational).
  - `.github/workflows/e2e.yml` — invokes `pnpm test:e2e` against a production build per the production-build E2E pattern.
  - All workflows pin `actions/checkout`, `pnpm/action-setup`, and `actions/setup-node` to specific versions; node version mirrors `.nvmrc` / `package.json` `engines`.
- Update `cross-platform-agent-surface-matrix.md` with the GitHub/Copilot adapter coverage; mark Copilot as a fully-supported platform.

## Phase 12 — Adopt validation mechanisms with TDD

Outcome: every validator named in the Validation Mechanisms section exists, has a unit-test companion (TDD per `principles.md` Testing section), and is wired into the gate sequence.
Impact: PDR-022 governance-enforcement-requires-a-scanner satisfied; PDR-024 vital-surface presence is enforceable; portability and fitness contracts are verified continuously.
Value mechanism: rules backed by scanners are governance; rules without scanners are aspiration.
Acceptance: validators exist with helpers split and unit-test companions; each is invoked from `pnpm check` (or canonical-named successor); every validator green; new vital-surface validator catches a deliberately-introduced fault in a smoke test before being committed clean.

Tasks:

- Extend [`scripts/validate-portability.mjs`](scripts/validate-portability.mjs) to enforce PDR-009 canonical-first layered architecture across all five required platforms (Cursor, Claude, Codex, Copilot, cross-platform discovery), PDR-024 cross-cutting contracts, PDR-008 canonical gate naming presence in `package.json`. Split helpers into `validate-portability-helpers.mjs`. Author `validate-portability.unit.test.ts` (TDD: write failing test cases for each rule first; then make them pass). Blocking.
- Add helpers split and unit test for [`scripts/validate-practice-fitness.mjs`](scripts/validate-practice-fitness.mjs); extend to validate the new four-field fitness frontmatter for the eight Core files plus `principles.md`, `testing-strategy.md`, `AGENT.md`, `metacognition.md`. **Informational only during integration**; promoted to blocking by the post-integration fitness reconciliation session.
- Author `scripts/validate-subagents.mjs` (+ helpers + `unit.test.ts`): every canonical sub-agent has its required platform adapters on all four platforms (Cursor, Claude, Codex, Copilot); reviewer roster declared in `.codex/config.toml`, `.claude/`, and `.github/agents/` matches canonical; thin-wrapper contract enforced. Blocking.
- Author `scripts/validate-vital-surfaces.mjs` (+ helpers + `unit.test.ts`): walks Category A/B/C/D/E vital surfaces; uses `cross-platform-agent-surface-matrix.md` as the authoritative supported/unsupported contract; exits non-zero if any required surface is missing or broken. Blocking.
- Author `scripts/validate-fitness-vocabulary.mjs` (+ `unit.test.ts`): validates fitness frontmatter keys are from the canonical four-field vocabulary; flags drift. **Informational only during integration**; vocabulary lock-in happens at post-integration reconciliation.
- Wire validators into `package.json` scripts; update `pnpm check` (canonical-named) to invoke every blocking validator in sequence; informational validators run separately or with non-zero exit suppressed during the adoption window.
- Update [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md), `principles.md` to document the validator estate, including the integration-first informational-vs-blocking distinction and the post-integration promotion path.

Note: `validate-root-application-version.mjs` is **not adopted** here — this repo is single-package and has no other versions to distinguish from the root. Recorded as explicitly unsupported in `cross-platform-agent-surface-matrix.md`.

## Phase 13 — ADR reclassification and visual-regression PDR/pattern

Outcome: ADRs that govern the Practice (not the product) are marked superseded by their canonical PDR equivalents; visual-regression discipline is captured as a PDR (because the discipline generalises across rendering-risk repos and is therefore reusable Practice substance).
Impact: ADR estate is honest about scope; the Practice gains a discipline that other UI-bearing repos can adopt; PDR-019 (ADR scope by reusability) satisfied locally; the ADR-vs-PDR boundary becomes clean and operational.
Value mechanism: every ADR governs host-product specifics that do not generalise; every PDR governs reusable Practice substance regardless of where it was authored. PDRs are PDRs whether they arrive from upstream Practice integration or originate locally — the distinction is reusability, not provenance.
Acceptance: ADR-012, ADR-015, ADR-018 carry `Superseded by PDR-NNN` headers and concise redirect notes; ADR-016 is split into product-tooling ADR + new PDR for the visual-regression discipline; ADR-005 carries scope-narrowing note per PDR-019.

Tasks:

- Add `Superseded by PDR-011` to [ADR-012 Agent memory pipeline](docs/architecture/decision-records/012-agent-memory-pipeline.md) with a one-paragraph redirect.
- Add `Superseded by PDR-009` to [ADR-015 Codex adapter model](docs/architecture/decision-records/015-codex-adapter-model.md).
- Add `Superseded by PDR-007` to [ADR-018 Practice-context adjunct for plasmid exchange](docs/architecture/decision-records/018-practice-context-adjunct-for-plasmid-exchange.md).
- For [ADR-016 Visual regression harness](docs/architecture/decision-records/016-review-oriented-visual-regression-harness.md): keep the ADR for this repo's specific harness tool choice; author a new PDR `PDR-NNN-rendering-risk-needs-blocking-visual-proof.md` (where `NNN` is the next available number after the inbound 24) in `.agent/practice-core/decision-records/` for the reusable discipline. The PDR is authored here but is no different in kind from upstream PDRs — it is a candidate for plasmid exchange in the next outbound pass. Pair with a `practice-core/patterns/` entry if a concrete implementation pattern is also worth carrying.
- For [ADR-005 Knip](docs/architecture/decision-records/005-knip-unused-code-detection.md): add scope-narrowing note tying gate composition to PDR-008 + PDR-020 and tool choice to PDR-006.
- Update `.agent/practice-index.md` ADR and PDR tables to reflect superseded states and the new local-origin PDR(s).
- Audit remaining ADRs for any that document reusable Practice substance rather than host-product specifics; promote to PDRs case-by-case. Strictly local concerns stay as ADRs; reusable concerns become PDRs in the same numbering scheme.

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
Acceptance: `pnpm validate-vital-surfaces`, `pnpm validate-portability`, `pnpm validate-subagents` (all blocking), `pnpm validate-practice-fitness` and `pnpm validate-fitness-vocabulary` (informational during this adoption, exit captured for the post-integration session), `pnpm check`, `pnpm check:ci`, `pnpm test:e2e` all green; GitHub Actions workflows green on a PR-shaped run; Bootstrap Checklist items 1–13 walked with evidence captured; Post-Installation Health Check 8 steps walked; Claimed/Installed/Activated audit complete; Fresh-Checkout Acceptance Criteria 1–6 satisfied.

Tasks:

- Run validators in this order: `pnpm validate-vital-surfaces`, `pnpm validate-portability`, `pnpm validate-subagents` (blocking gates), then `pnpm validate-practice-fitness` and `pnpm validate-fitness-vocabulary` (informational; capture output for the post-integration reconciliation session), then `pnpm check`, `pnpm check:ci`, `pnpm test:e2e`. Fix any blocking failure before declaring complete; informational findings are recorded, not fixed in this session.
- Trigger the GitHub Actions workflow set on a PR; confirm `check.yml`, `validators.yml`, `e2e.yml` all green.
- Walk every Bootstrap Checklist item in [`.agent/practice-core/practice-verification.md`](.agent/practice-core/practice-verification.md); record evidence for each item in the plan completion section.
- Walk the Post-Installation Health Check 8 steps; record outcomes.
- Walk the Claimed/Installed/Activated audit; record any silent gaps and resolve them.
- Walk the Fresh-Checkout Acceptance Criteria; ideally on a clean clone or by simulation.
- Capture the upstream-review output (from Phase 9 rehearsal) as the inaugural feedback record back to the Practice network.
- Mark plan complete; archive into `.agent/plans/complete/`.

## Notes

- The dead `continual-learning` Cursor-plugin skill is fully replaced by the Practice's own learning loop (napkin → distilled → `consolidate-docs`). Phase 1 deletes the orphaned hook state; Phase 9 sweeps any remaining textual references in `AGENTS.md` and `.agent/skills/distillation/SKILL.md`.
- Each phase ends with the restart-on-fix discipline (a fix in one gate restarts the full sequence). The plan does not commit to commit boundaries; the executing agent decides commit slicing inside each phase, in alignment with `principles.md` and the canonical commit command.
- The plan file itself is the continuity surface (PDR-011) for this multi-session work; if work pauses, the next session resumes from Phase N's task list.
- TSDoc on all new validator scripts; READMEs for new directories (`.agent/memory/patterns/`, `docs/explorations/`, `.agent/hooks/`, `.github/ISSUE_TEMPLATE/` if added, `.claude/` and its sub-directories).
- All new PDRs (whether arriving from upstream Practice integration or originating locally during Phase 13 and beyond) use the same numbering scheme inside `.agent/practice-core/decision-records/`. Provenance is recorded in the PDR frontmatter, not encoded into the filename. PDRs are PDRs; reusability is the criterion, not authorship origin.
- Fitness-driven trimming, deletion, deduplication, and ceiling enforcement happen in a dedicated post-integration session — not during this adoption. The integration-first principle is binding for every phase.
