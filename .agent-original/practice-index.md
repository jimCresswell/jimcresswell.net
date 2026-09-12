# Practice Index

This file bridges the portable practice-core files and this repo's local
artefacts. It is **not** part of the travelling practice-core package — it is
created during hydration and stays in the repo. The format is specified by
`practice-core/practice-bootstrap.md`.

For the practice-core files and their roles, see
[practice-core/index.md](practice-core/index.md).

For the explicit local agent-surface contract, see
[cross-platform-agent-surface-matrix.md](reference/cross-platform-agent-surface-matrix.md).

## Directives

| Directive                                                 | Purpose                                      |
| --------------------------------------------------------- | -------------------------------------------- |
| [AGENT.md](directives/AGENT.md)                           | Operational entry point for agents           |
| [principles.md](directives/principles.md)                 | Authoritative rules                          |
| [testing-strategy.md](directives/testing-strategy.md)     | TDD approach and test types                  |
| [editorial-strategy.md](directives/editorial-strategy.md) | Audience, attention, structure, and evidence |
| [editorial-guidance.md](directives/editorial-guidance.md) | Jim's editorial voice and identity           |
| [metacognition.md](directives/metacognition.md)           | Pause and reflect before planning            |
| [privacy.md](directives/privacy.md)                       | Psychological safety and PII handling        |
| [secops.md](directives/secops.md)                         | Git email, PII audits, operational security  |

## Reference

| Reference                                                                                  | Purpose                                                                                  |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| [cross-platform-agent-surface-matrix.md](reference/cross-platform-agent-surface-matrix.md) | Supported and unsupported Cursor, Claude, GitHub Copilot, Codex, and `.agents/` surfaces |

## Architectural Decisions

| ADR                                                                                                   | Subject                          |
| ----------------------------------------------------------------------------------------------------- | -------------------------------- |
| [ADR-001](../docs/architecture/decision-records/001-build-time-pdf-generation.md)                     | Build-time PDF generation        |
| [ADR-002](../docs/architecture/decision-records/002-pdf-serving-architecture.md)                      | PDF serving architecture         |
| [ADR-003](../docs/architecture/decision-records/003-print-button-removed.md)                          | Print button removed             |
| [ADR-004](../docs/architecture/decision-records/004-storybook-deferred.md)                            | Storybook deferred               |
| [ADR-005](../docs/architecture/decision-records/005-knip-unused-code-detection.md)                    | Knip unused code detection       |
| [ADR-006](../docs/architecture/decision-records/006-header-responsive-layout.md)                      | Header responsive layout         |
| [ADR-007](../docs/architecture/decision-records/007-dry-content-metadata.md)                          | DRY content metadata             |
| [ADR-008](../docs/architecture/decision-records/008-schema-org-compliance.md)                         | Schema.org compliance            |
| [ADR-009](../docs/architecture/decision-records/009-content-negotiation-proxy.md)                     | Content negotiation proxy        |
| [ADR-010](../docs/architecture/decision-records/010-canonical-url-graph-identity.md)                  | Canonical URL and graph identity |
| [ADR-011](../docs/architecture/decision-records/011-domain-appropriate-descriptions.md)               | Domain-appropriate descriptions  |
| [ADR-012](../docs/architecture/decision-records/012-agent-memory-pipeline.md)                         | Agent memory pipeline            |
| [ADR-013](../docs/architecture/decision-records/013-security-headers.md)                              | Security headers                 |
| [ADR-014](../docs/architecture/decision-records/014-entity-model-design.md)                           | Entity model design              |
| [ADR-015](../docs/architecture/decision-records/015-codex-adapter-model.md)                           | Codex adapter model              |
| [ADR-016](../docs/architecture/decision-records/016-review-oriented-visual-regression-harness.md)     | Visual regression harness        |
| [ADR-017](../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md)          | CV tilt route aliases            |
| [ADR-018](../docs/architecture/decision-records/018-practice-context-adjunct-for-plasmid-exchange.md) | Practice exchange context        |

## Practice Decision Records

| PDR                                                                                              | Subject                                           |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| [PDR-008](practice-core/decision-records/PDR-008-canonical-quality-gate-naming.md)               | Canonical quality gate naming                     |
| [PDR-009](practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md) | Canonical-first cross-platform architecture       |
| [PDR-010](practice-core/decision-records/PDR-010-domain-specialist-capability-pattern.md)        | Domain-specialist capability pattern              |
| [PDR-011](practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)   | Continuity surfaces and surprise pipeline         |
| [PDR-022](practice-core/decision-records/PDR-022-governance-enforcement-scanners.md)             | Governance enforcement scanners                   |
| [PDR-024](practice-core/decision-records/PDR-024-vital-integration-surfaces.md)                  | Vital integration surfaces                        |
| [PDR-025](practice-core/decision-records/PDR-025-quality-gate-dismissal-discipline.md)           | Quality-gate dismissal discipline                 |
| [PDR-030](practice-core/decision-records/PDR-030-rendering-risk-needs-blocking-visual-proof.md)  | Rendering-risk changes need blocking visual proof |

## Tools and Workflows

### Commands

| Command                                                  | Purpose                                                        |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| [commit](commands/commit.md)                             | Create a well-formed commit with safety checks                 |
| [consolidate-docs](commands/consolidate-docs.md)         | Ensure plans, prompts, memory, and Practice docs stay truthful |
| [editor](commands/editor.md)                             | Invoke editorial review                                        |
| [gates](commands/gates.md)                               | Run quality gates with restart-on-fix                          |
| [go](commands/go.md)                                     | Resume from the current continuity surfaces                    |
| [metacognition](commands/metacognition.md)               | Apply the metacognition directive explicitly                   |
| [plan](commands/plan.md)                                 | Create a structured plan with value traceability               |
| [review](commands/review.md)                             | Run the reviewer flow after a non-trivial change               |
| [session-handoff](commands/session-handoff.md)           | Prepare the repo for the next session                          |
| [start-right-quick](commands/start-right-quick.md)       | Fast session grounding                                         |
| [start-right-thorough](commands/start-right-thorough.md) | Deep session grounding                                         |
| [wrap](commands/wrap.md)                                 | Deep session closeout via the wrap skill                       |

### Skills

| Skill                                                              | Purpose                                                         |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| [start-right-quick](skills/start-right-quick/SKILL.md)             | Core session grounding for routine work                         |
| [start-right-thorough](skills/start-right-thorough/SKILL.md)       | Deeper grounding for structural or risky work                   |
| [patterns](skills/patterns/SKILL.md)                               | Pattern discovery across Practice Core and repo-local instances |
| [accessibility](skills/accessibility/SKILL.md)                     | Active accessibility workflow                                   |
| [architecture](skills/architecture/SKILL.md)                       | Active architecture workflow across the reviewer personae       |
| [config](skills/config/SKILL.md)                                   | Active configuration and tooling workflow                       |
| [design-system](skills/design-system/SKILL.md)                     | Active design-system workflow                                   |
| [docs-adr](skills/docs-adr/SKILL.md)                               | Active ADR and durable-doc workflow                             |
| [mcp](skills/mcp/SKILL.md)                                         | Active multi-platform agent-surface workflow                    |
| [react-component](skills/react-component/SKILL.md)                 | Active App Router and component-boundary workflow               |
| [security](skills/security/SKILL.md)                               | Active defensive and secrets-sensitive workflow                 |
| [subagent-architecture](skills/subagent-architecture/SKILL.md)     | Active reviewer-estate architecture workflow                    |
| [project-spec-creation](skills/project-spec-creation/SKILL.md)     | Core — project specs for generative UI handoff                  |
| [napkin](skills/napkin/SKILL.md)                                   | Session learning log — always active                            |
| [distillation](skills/distillation/SKILL.md)                       | Rotate napkin into curated distilled.md                         |
| [author-skills](skills/author-skills/SKILL.md)                     | Create or update repo-local skills                              |
| [editorial-voice](skills/editorial-voice/SKILL.md)                 | Apply Jim's editorial voice                                     |
| [quality-gates](skills/quality-gates/SKILL.md)                     | Run quality gates with restart-on-fix                           |
| [deslop](skills/deslop/SKILL.md)                                   | Remove AI-generated code slop                                   |
| [pkg](skills/pkg/SKILL.md)                                         | PKG entity model and structured data guide                      |
| [package-deps-up-to-date](skills/package-deps-up-to-date/SKILL.md) | Audit and update `package.json` dependencies                    |
| [start-right-team](skills/start-right-team/SKILL.md)               | Team grounding for multi-seat ARC collaboration                 |
| [metacognition](skills/metacognition/SKILL.md)                     | Inward mode — reflective depth behind the directive             |
| [reason](skills/reason/SKILL.md)                                   | Outward mode — structured reasoning gates and moves             |
| [concept-exploration](skills/concept-exploration/SKILL.md)         | Explore unshaped concepts before options form                   |
| [proportionality](skills/proportionality/SKILL.md)                 | Pre-decision sizing gate for scope, instrument, level           |
| [plan](skills/plan/SKILL.md)                                       | Author plans with the four value questions                      |
| [session-handoff](skills/session-handoff/SKILL.md)                 | Continuity surfaces and the deep context-loss scan              |
| [consolidate-docs](skills/consolidate-docs/SKILL.md)               | Consolidate the estate; graduate durable knowledge              |
| [consolidate-until-done](skills/consolidate-until-done/SKILL.md)   | Persistent curation programme until buffers drain               |
| [knowledge-safety-sweep](skills/knowledge-safety-sweep/SKILL.md)   | Mid-session loss capture without closing the seat               |
| [wrap](skills/wrap/SKILL.md)                                       | Deep closeout programme with metaloss recursion                 |
| [retrospective](skills/retrospective/SKILL.md)                     | Post-mortem on a completed arc with routed proposals            |
| [pr-lifecycle](skills/pr-lifecycle/SKILL.md)                       | PR from branch to merge with review-round convergence           |
| [semantic-merge](skills/semantic-merge/SKILL.md)                   | Concept-preserving merge of memory and state files              |
| [undo-change](skills/undo-change/SKILL.md)                         | Safety decision tree for undo, revert, and reset                |

### Rules

| Rule                                                                            | Purpose                                                |
| ------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [follow-the-practice](rules/follow-the-practice.md)                             | Read the canonical Practice chain at session start     |
| [napkin-always-active](rules/napkin-always-active.md)                           | Read and write the napkin continuously                 |
| [apply-architectural-principles](rules/apply-architectural-principles.md)       | Work from the repo's architectural principles          |
| [lint-after-edit](rules/lint-after-edit.md)                                     | Re-run the gate sequence after edits                   |
| [no-type-shortcuts](rules/no-type-shortcuts.md)                                 | Ban `as`, `any`, and `!` shortcuts                     |
| [strict-validation-at-boundary](rules/strict-validation-at-boundary.md)         | Validate external data at boundaries                   |
| [subagent-practice-core-protection](rules/subagent-practice-core-protection.md) | Prevent sub-agents editing protected Practice surfaces |
| [invoke-code-reviewers](rules/invoke-code-reviewers.md)                         | Invoke the gateway reviewer after non-trivial changes  |

### Sub-agents

| Agent                                                                                | Purpose                                         |
| ------------------------------------------------------------------------------------ | ----------------------------------------------- |
| [editor](sub-agents/templates/editor.md)                                             | Editorial reviewer — strategy, voice, and fit   |
| [code-reviewer](sub-agents/templates/code-reviewer.md)                               | Gateway reviewer — quality, correctness, triage |
| [test-reviewer](sub-agents/templates/test-reviewer.md)                               | TDD compliance and test quality                 |
| [type-reviewer](sub-agents/templates/type-reviewer.md)                               | TypeScript type safety                          |
| [pkg-reviewer](sub-agents/templates/pkg-reviewer.md)                                 | PKG specialist — Schema.org, JSON-LD, graph     |
| [architecture-reviewer-barney](sub-agents/templates/architecture-reviewer-barney.md) | Data, graph, and PKG architecture               |
| [architecture-reviewer-betty](sub-agents/templates/architecture-reviewer-betty.md)   | Navigation, layout, and experience architecture |
| [architecture-reviewer-fred](sub-agents/templates/architecture-reviewer-fred.md)     | Build, caching, PDF, and runtime resilience     |
| [architecture-reviewer-wilma](sub-agents/templates/architecture-reviewer-wilma.md)   | Practice, plan, and documentation architecture  |
| [accessibility-reviewer](sub-agents/templates/accessibility-reviewer.md)             | Accessibility and assistive flows               |
| [design-system-reviewer](sub-agents/templates/design-system-reviewer.md)             | Tokens, spacing, and responsive rhythm          |
| [react-component-reviewer](sub-agents/templates/react-component-reviewer.md)         | React hooks and component boundaries            |
| [config-reviewer](sub-agents/templates/config-reviewer.md)                           | Build and configuration surfaces                |
| [docs-adr-reviewer](sub-agents/templates/docs-adr-reviewer.md)                       | Docs and decision records                       |
| [security-reviewer](sub-agents/templates/security-reviewer.md)                       | Security and defensive surfaces                 |
| [mcp-reviewer](sub-agents/templates/mcp-reviewer.md)                                 | MCP and cross-platform coherence                |
| [subagent-architect](sub-agents/templates/subagent-architect.md)                     | Reviewer architecture and dispatch              |

Codex reviewer sub-agents are registered in [`.codex/config.toml`](../.codex/config.toml)
and use thin adapters under [`.codex/agents/`](../.codex/agents/).

### Validation

| Validation                                                                      | Purpose                                                                         |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`validate-portability.mjs`](../scripts/validate-portability.mjs)               | Validate thin wrappers, reviewer registration, and the local surface matrix     |
| [`validate-subagents.mjs`](../scripts/validate-subagents.mjs)                   | Validate reviewer adapters across Cursor, Claude, Copilot, and Codex            |
| [`validate-vital-surfaces.mjs`](../scripts/validate-vital-surfaces.mjs)         | Validate vital Practice surfaces against the local matrix                       |
| [`validate-practice-fitness.mjs`](../scripts/validate-practice-fitness.mjs)     | Validate the four-field fitness frontmatter used by Practice and directive docs |
| [`validate-fitness-vocabulary.mjs`](../scripts/validate-fitness-vocabulary.mjs) | Validate canonical fitness frontmatter keys                                     |

## Repo-Specific Clusters

### PKG Cluster

- [pkg skill](skills/pkg/SKILL.md)
- [pkg-reviewer](sub-agents/templates/pkg-reviewer.md)
- [ADR-014](../docs/architecture/decision-records/014-entity-model-design.md)
- [ADR-010](../docs/architecture/decision-records/010-canonical-url-graph-identity.md)

### Editorial Governance

- [editorial-strategy.md](directives/editorial-strategy.md)
- [editorial-guidance.md](directives/editorial-guidance.md)
- [editorial-voice skill](skills/editorial-voice/SKILL.md)
- [editor reviewer](sub-agents/templates/editor.md)
- [Editorial decision records](../docs/editorial/decision-records/)

### Personal-Identity Defensives

- [privacy.md](directives/privacy.md)
- [secops.md](directives/secops.md)
- [ADR-013](../docs/architecture/decision-records/013-security-headers.md)

### CV-as-Product ADRs

- [ADR-001](../docs/architecture/decision-records/001-build-time-pdf-generation.md)
- [ADR-002](../docs/architecture/decision-records/002-pdf-serving-architecture.md)
- [ADR-017](../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md)

### Contributed Network Artefacts

- [cross-platform-agent-surface-matrix.md](reference/cross-platform-agent-surface-matrix.md)
- [practice-verification.md](practice-core/practice-verification.md)
- [`validate-portability.mjs`](../scripts/validate-portability.mjs)
- [`validate-subagents.mjs`](../scripts/validate-subagents.mjs)
- [`validate-vital-surfaces.mjs`](../scripts/validate-vital-surfaces.mjs)

## Artefact Directories

| Location                                        | What lives there                                                                                         |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [`.agent/directives/`](directives/)             | Principles, rules, and operational directives                                                            |
| [`.agent/practice-core/`](practice-core/)       | Portable Practice Core files (trinity, entry points, changelog, provenance) and Practice Box             |
| [`.agent/commands/`](commands/)                 | Canonical commands (platform-agnostic)                                                                   |
| [`.agent/skills/`](skills/)                     | Canonical skills (platform-agnostic)                                                                     |
| [`.agent/rules/`](rules/)                       | Canonical always-applied rules (platform-agnostic)                                                       |
| [`.agent/sub-agents/`](sub-agents/)             | Canonical sub-agent templates                                                                            |
| [`.agent/plans/`](plans/)                       | Work planning — active, current, future, archive, research, and roadmap surfaces                         |
| [`.agent/prompts/`](prompts/)                   | Session-entry prompt estate plus archived handoff prompts                                                |
| [`.agent/memory/`](memory/)                     | Institutional memory — napkin, distilled, and local pattern instances                                    |
| [`.agent/hooks/`](hooks/)                       | Hook policy and deliberate hook-surface documentation                                                    |
| [`.agent/experience/`](experience/)             | Experiential records across sessions                                                                     |
| [`.agent/reference/`](reference/)               | Stable local reference material, including the cross-platform surface matrix                             |
| [`.agent/practice-context/`](practice-context/) | Optional repo-local exchange context — transient incoming workspace and sender-maintained outgoing notes |
| [`.agents/`](../.agents/)                       | Codex skill and command adapters, plus adapter-local metadata                                            |
| [`.claude/`](../.claude/)                       | Claude platform adapters for commands, skills, rules, and reviewers                                      |
| [`.codex/`](../.codex/)                         | Codex project config and thin sub-agent adapters                                                         |
| [`.cursor/`](../.cursor/)                       | Cursor platform adapters — thin wrappers and rule triggers                                               |
| [`.github/`](../.github/)                       | GitHub Copilot entry instructions, reviewer wrappers, templates, and CI workflows                        |
