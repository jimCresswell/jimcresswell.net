# Practice Index

This file bridges the portable Practice Core and this repo's local artefacts.
It is **not** part of the travelling Practice Core package — it is host-local
and stays in the repo. The format is specified by
`practice-core/practice-bootstrap.md`.

For the Practice Core files and their roles, see
[practice-core/index.md](practice-core/index.md). For the transplant that
brought the OCE lineage here, and the owner rulings that shaped it, see
[`docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`](../docs/explorations/2026-09-12-oce-practice-lineage-transplant.md).

## Directives

| Directive                                                                   | Purpose                                                      |
| --------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [AGENT.md](directives/AGENT.md)                                             | Operational entry point for agents                           |
| [principles.md](directives/principles.md)                                   | Authoritative rules and decision lenses                      |
| [testing-strategy.md](directives/testing-strategy.md)                       | TDD at all levels; test types and naming                     |
| [tdd-as-design.md](directives/tdd-as-design.md)                             | Tests as the design instrument                               |
| [validation-strategy.md](directives/validation-strategy.md)                 | Runtime validation and boundary discipline                   |
| [definition-of-delivery.md](directives/definition-of-delivery.md)           | What "delivered" means                                       |
| [operationalisation-contract.md](directives/operationalisation-contract.md) | How doctrine becomes an operational surface                  |
| [continuity-practice.md](directives/continuity-practice.md)                 | Continuity surfaces and session resume                       |
| [metacognition.md](directives/metacognition.md)                             | Reflect before planning; friction and fluency                |
| [orientation.md](directives/orientation.md)                                 | Grounding before acting                                      |
| [agent-collaboration.md](directives/agent-collaboration.md)                 | Multi-seat collaboration doctrine                            |
| [user-collaboration.md](directives/user-collaboration.md)                   | Working with the owner                                       |
| [cloud-environment-routing.md](directives/cloud-environment-routing.md)     | Cloud-session routing                                        |
| [editorial-strategy.md](directives/editorial-strategy.md)                   | Audience, attention, structure, evidence — content about Jim |
| [editorial-guidance.md](directives/editorial-guidance.md)                   | Jim's editorial voice, identity and register                 |
| [privacy.md](directives/privacy.md)                                         | Psychological safety and PII handling                        |
| [secops.md](directives/secops.md)                                           | Git identity, PII audits, operational security               |

## Reference

| Reference                                                                                                          | Purpose                                                      |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [memory/executive/cross-platform-agent-surface-matrix.md](memory/executive/cross-platform-agent-surface-matrix.md) | Supported platform-adapter surfaces (OCE lineage)            |
| [memory/executive/cross-platform-agent-surface-matrix.md](memory/executive/cross-platform-agent-surface-matrix.md) | Supported and unsupported platform surfaces (executive memory) |
| [memory/executive/artefact-inventory.md](memory/executive/artefact-inventory.md)                                   | Canonical-vs-adapter taxonomy                                |
| [memory/executive/invoke-code-experts.md](memory/executive/invoke-code-experts.md)                                 | Expert catalogue and triage ladder                           |

## Architectural Decisions

Site architecture decisions are ADRs under
[`docs/architecture/decision-records/`](../docs/architecture/decision-records/).

| ADR                                                                                                   | Subject                                           |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [ADR-001](../docs/architecture/decision-records/001-build-time-pdf-generation.md)                     | Build-time PDF generation                         |
| [ADR-002](../docs/architecture/decision-records/002-pdf-serving-architecture.md)                      | PDF serving architecture                          |
| [ADR-003](../docs/architecture/decision-records/003-print-button-removed.md)                          | Print button removed                              |
| [ADR-004](../docs/architecture/decision-records/004-storybook-deferred.md)                            | Storybook deferred                                |
| [ADR-005](../docs/architecture/decision-records/005-knip-unused-code-detection.md)                    | Knip unused code detection                        |
| [ADR-006](../docs/architecture/decision-records/006-header-responsive-layout.md)                      | Header responsive layout                          |
| [ADR-007](../docs/architecture/decision-records/007-dry-content-metadata.md)                          | DRY content metadata                              |
| [ADR-008](../docs/architecture/decision-records/008-schema-org-compliance.md)                         | Schema.org compliance                             |
| [ADR-009](../docs/architecture/decision-records/009-content-negotiation-proxy.md)                     | Content negotiation proxy                         |
| [ADR-010](../docs/architecture/decision-records/010-canonical-url-graph-identity.md)                  | Canonical URL and graph identity                  |
| [ADR-011](../docs/architecture/decision-records/011-domain-appropriate-descriptions.md)               | Domain-appropriate descriptions                   |
| [ADR-012](../docs/architecture/decision-records/012-agent-memory-pipeline.md)                         | Agent memory pipeline                             |
| [ADR-013](../docs/architecture/decision-records/013-security-headers.md)                              | Security headers                                  |
| [ADR-014](../docs/architecture/decision-records/014-entity-model-design.md)                           | Entity model design                               |
| [ADR-015](../docs/architecture/decision-records/015-codex-adapter-model.md)                           | Codex adapter model                               |
| [ADR-016](../docs/architecture/decision-records/016-review-oriented-visual-regression-harness.md)     | Visual regression harness                         |
| [ADR-017](../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md)          | CV tilt route aliases (superseded by ADR-021)     |
| [ADR-018](../docs/architecture/decision-records/018-practice-context-adjunct-for-plasmid-exchange.md) | Practice exchange context                         |
| [ADR-019](../docs/architecture/decision-records/019-playwright-against-production-build.md)           | Playwright against the production build           |
| [ADR-020](../docs/architecture/decision-records/020-entity-model-source-of-truth-for-shared-atoms.md) | Entity model as source of truth for shared atoms  |
| [ADR-021](../docs/architecture/decision-records/021-canonical-only-cv-identity.md)                    | Canonical-only CV identity                        |
| [ADR-022](../docs/architecture/decision-records/022-rendering-risk-needs-blocking-visual-proof.md)    | Rendering-risk changes need blocking visual proof |

## Practice Decision Records

The portable Practice governance decisions are PDRs under
[`practice-core/decision-records/`](practice-core/decision-records/) — 140
records, PDR-001 through PDR-140, from the OCE lineage. Those most load-bearing
for this repo's day-to-day:

| PDR                                                                                              | Subject                                                  |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| [PDR-005](practice-core/decision-records/PDR-005-wholesale-practice-transplantation.md)          | Wholesale Practice transplantation (this repo's genesis) |
| [PDR-009](practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md) | Canonical-first cross-platform architecture              |
| [PDR-014](practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md) | Consolidation and knowledge-flow discipline              |
| [PDR-018](practice-core/decision-records/PDR-018-planning-discipline.md)                         | Planning discipline                                      |
| [PDR-049](practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md)       | Memory and state file merge semantics                    |
| [PDR-072](practice-core/decision-records/PDR-072-knowledge-curation-as-autonomic-learning.md)    | Knowledge curation as autonomic learning                 |
| [PDR-101](practice-core/decision-records/PDR-101-graduation-requires-quorum.md)                  | Graduation requires a review quorum                      |
| [PDR-130](practice-core/decision-records/PDR-130-two-speed-learning.md)                          | Two-speed learning                                       |

## Tools and Workflows

### Skills

Canonical skills live under [`skills/`](skills/). OCE-lineage skills use
`SKILL-CANONICAL.md`; local-lineage skills still use `SKILL.md` pending
normalisation. Platform adapters are generated by `pnpm portability:fix`.

| Skill family              | Skills                                                                                                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session entry and exit    | `start-right-quick`, `start-right-thorough`, `start-right-team`, `go`, `session-handoff`, `wrap`                                                                                                                     |
| Cognition                 | `cognition/metacognition`, `reason`, `concept-exploration`, `free-play`, `proportionality`, `retrospective`, `cricket`, `parallax` and its siblings                                                                  |
| Knowledge                 | `knowledge/napkin`, `consolidate-docs`, `consolidate-until-done`, `curator-pass`, `knowledge-safety-sweep`; local `distillation`, `patterns` (pending merge into knowledge/)                                         |
| Change custody            | `change-custody/commit`, `gates`, `pr-lifecycle`, `semantic-merge`, `undo-change`, `complex-merge`, `cross-fork-integration`; local `pr-lifecycle`, `semantic-merge`, `undo-change`, `quality-gates` (pending merge) |
| Planning                  | `planning/plan`, `planning/ticket-management`; local `plan` (pending merge)                                                                                                                                          |
| Collaboration             | `comms-channels`, `coordination-fold`, `cut-coordination-branch`, `set-up-worktree-lane`, `inter-practice-collaboration`, `sif`                                                                                      |
| Craft                     | `domain-craft/ui-design/*`, `tsdoc`, `dependency-currency`, `working-with-graphs`, `orientation/working-with-agentic-ai`                                                                                             |
| Site domain (local)       | `accessibility`, `architecture`, `config`, `design-system`, `docs-adr`, `react-component`, `security`, `subagent-architecture`, `author-skills`, `deslop`, `package-deps-up-to-date`, `project-spec-creation`        |
| PKG and editorial (local) | `pkg`, `editorial-voice`                                                                                                                                                                                             |

### Rules

Canonical always-applied rules live under [`rules/`](rules/) — 127 after the
transplant, of which 16 are `invoke-*-expert` dispatch rules for the roster
below. The OCE-lineage rules went through a single content-grain triage
(keep / adapt / drop) recorded in the transplant plan §Rules triage. Local-lineage rules:
`follow-the-practice`, `napkin-always-active`, `apply-architectural-principles`,
`lint-after-edit`, `no-type-shortcuts`, `no-skipped-tests`,
`strict-validation-at-boundary`, `subagent-practice-core-protection`,
`tdd-for-refactoring`, `tsdoc-and-documentation-hygiene`.

### Experts (sub-agents)

| Expert                                                                           | Purpose                                                  |
| -------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [editor](sub-agents/templates/editor.md)                                         | Editorial reviewer — strategy, voice, and fit            |
| [code-expert](sub-agents/templates/code-expert.md)                               | Gateway reviewer — quality, correctness, triage          |
| [test-expert](sub-agents/templates/test-expert.md)                               | TDD compliance and test quality                          |
| [type-expert](sub-agents/templates/type-expert.md)                               | TypeScript type safety                                   |
| [pkg-expert](sub-agents/templates/pkg-expert.md)                                 | PKG specialist — Schema.org, JSON-LD, graph              |
| [architecture-expert-barney](sub-agents/templates/architecture-expert-barney.md) | Data, graph, and PKG architecture                        |
| [architecture-expert-betty](sub-agents/templates/architecture-expert-betty.md)   | Navigation, layout, and experience architecture          |
| [architecture-expert-fred](sub-agents/templates/architecture-expert-fred.md)     | Build, caching, PDF, and runtime resilience              |
| [architecture-expert-wilma](sub-agents/templates/architecture-expert-wilma.md)   | Practice, plan, and documentation architecture           |
| [architecture-expert](sub-agents/templates/architecture-expert.md)               | Workspace boundaries, import direction, module structure |
| [accessibility-expert](sub-agents/templates/accessibility-expert.md)             | Accessibility and assistive flows                        |
| [design-system-expert](sub-agents/templates/design-system-expert.md)             | Tokens, spacing, and responsive rhythm                   |
| [react-component-expert](sub-agents/templates/react-component-expert.md)         | React hooks and component boundaries                     |
| [config-expert](sub-agents/templates/config-expert.md)                           | Build and configuration surfaces                         |
| [docs-adr-expert](sub-agents/templates/docs-adr-expert.md)                       | Docs and decision records                                |
| [security-expert](sub-agents/templates/security-expert.md)                       | Security and defensive surfaces                          |
| [subagent-architect](sub-agents/templates/subagent-architect.md)                 | Reviewer architecture and dispatch                       |
| [assumptions-expert](sub-agents/templates/assumptions-expert.md)                 | Adversarial assumptions check; PDR-101 graduation quorum |
| [prose-expert](sub-agents/templates/prose-expert.md)                             | Prose quality                                            |
| [onboarding-expert](sub-agents/templates/onboarding-expert.md)                   | Cold-start readability of docs and handoffs              |
| [release-readiness-expert](sub-agents/templates/release-readiness-expert.md)     | Release gates                                            |
| `corpus-mapper`, `corpus-meta`, `corpus-reducer`, `corpus-voter`                 | Parallax corpus roles                                    |
| `cricket-judgement-low`, `cricket-judgement-medium`, `cricket-judgement-high`, `cricket-judgement-lowestpower-low`, `cricket-procedure-xhigh` | Cricket panel roles (the effort-inversion quartet and the lowest-power judgement seat) |

### Validation

Practice validators live in [`agent-tools`](../agent-tools/README.md) and run
from the root:

| Command                           | Purpose                                                 |
| --------------------------------- | ------------------------------------------------------- |
| `pnpm portability:check` / `:fix` | Canonical ↔ adapter parity; `:fix` regenerates adapters |
| `pnpm subagents:check`            | Expert adapter coverage across platforms                |
| `pnpm practice:fitness`           | Four-field fitness frontmatter on governed files        |
| `pnpm practice:vocabulary`        | Canonical fitness frontmatter keys                      |

The pre-transplant validators under `jcdotnet/scripts/validate-*.mjs` are
retired once these pass.

## Repo-Specific Clusters

### PKG cluster

- [pkg skill](skills/pkg/SKILL-CANONICAL.md), [pkg-expert](sub-agents/templates/pkg-expert.md),
  [working-with-graphs](skills/working-with-graphs/SKILL-CANONICAL.md)
- [ADR-010](../docs/architecture/decision-records/010-canonical-url-graph-identity.md),
  [ADR-014](../docs/architecture/decision-records/014-entity-model-design.md),
  [ADR-020](../docs/architecture/decision-records/020-entity-model-source-of-truth-for-shared-atoms.md),
  [ADR-021](../docs/architecture/decision-records/021-canonical-only-cv-identity.md)

### Editorial governance

- [editorial-strategy.md](directives/editorial-strategy.md),
  [editorial-guidance.md](directives/editorial-guidance.md)
- [editorial-voice skill](skills/editorial-voice/SKILL-CANONICAL.md),
  [editor](sub-agents/templates/editor.md)
- [Editorial decision records](../docs/editorial/decision-records/)

### Personal-identity defensives

- [privacy.md](directives/privacy.md), [secops.md](directives/secops.md),
  [ADR-013](../docs/architecture/decision-records/013-security-headers.md)

### CV-as-product

- [ADR-001](../docs/architecture/decision-records/001-build-time-pdf-generation.md),
  [ADR-002](../docs/architecture/decision-records/002-pdf-serving-architecture.md),
  [ADR-016](../docs/architecture/decision-records/016-review-oriented-visual-regression-harness.md),
  [ADR-019](../docs/architecture/decision-records/019-playwright-against-production-build.md),
  [ADR-022](../docs/architecture/decision-records/022-rendering-risk-needs-blocking-visual-proof.md)

## Artefact Directories

| Location                                  | What lives there                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [`.agent/directives/`](directives/)       | Directives and the operational entry point                                                     |
| [`.agent/practice-core/`](practice-core/) | Portable Practice Core: trinity, provenance, protocol, PDRs                                    |
| `~/.practice/profile/` (home directory, not in this repository; may not exist) | The operator profile: `index.md` for the operator everywhere, `repos/<scope-key>.md` for this line, `machines/<machine-key>.md` for the host. Contract: [`practice-core/schemas/operator-profile.schema.json`](practice-core/schemas/operator-profile.schema.json); check with `pnpm profile:check`; sync with `pnpm profile:sync pull` at session open and `pnpm profile:sync push --message` after any write made on the operator's word ([PDR-141](practice-core/decision-records/PDR-141-operator-profile-in-the-home-directory.md)) |
| [`.agent/skills/`](skills/)               | Canonical skills                                                                               |
| [`.agent/rules/`](rules/)                 | Canonical always-applied rules                                                                 |
| [`.agent/sub-agents/`](sub-agents/)       | Expert templates                                                                               |
| [`.agent/plans/`](plans/)                 | Plan nodes, schema, templates; pre-transplant plan record                                      |
| [`.agent/prompts/`](prompts/)             | Session continuation and handoff prompts                                                       |
| [`.agent/memory/`](memory/)               | Three-mode memory: active, operational, executive                                              |
| [`.agent/experience/`](experience/)       | Experiential records                                                                           |
| [`.agent/reference/`](reference/)         | Local reference material                                                                       |
| [`.agent/collaboration/`](collaboration/) | Rapid-comms channels                                                                           |
| [`.agent/state/`](state/)                 | Coordination state (machine-local parts git-ignored)                                           |
| [`.agents/`](../.agents/)                 | Cross-tool skill adapters and rule mirrors (generated)                                         |
| [`.claude/`](../.claude/)                 | Claude adapters for skills, rules, and experts (generated)                                     |
| [`.codex/`](../.codex/)                   | Codex config and thin expert adapters (generated)                                              |
| [`.cursor/`](../.cursor/)                 | Cursor adapters (generated)                                                                    |
| [`.gemini/`](../.gemini/)                 | Gemini expert adapters (generated)                                                             |
| [`.github/`](../.github/)                 | Copilot instructions, expert wrappers, templates, CI workflows                                 |
| [`agent-tools/`](../agent-tools/)         | `@engraph/agent-tools` — validators, collaboration state, comms, commit queue                  |
| [`tooling/`](../tooling/)                 | `@engraph/*` shared packages: eslint plugin, result, safe-path, type-helpers, workspace-config |
