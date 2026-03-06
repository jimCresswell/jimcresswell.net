# Practice Index

This file bridges the portable practice-core files and this repo's local
artefacts. It is **not** part of the travelling practice-core package — it is
created during hydration and stays in the repo. The format is specified by
`practice-core/practice-bootstrap.md`.

For the practice-core files and their roles, see
[practice-core/index.md](practice-core/index.md).

## Directives

| Directive                                                 | Purpose                                     |
| --------------------------------------------------------- | ------------------------------------------- |
| [AGENT.md](directives/AGENT.md)                           | Operational entry point for agents          |
| [rules.md](directives/rules.md)                           | Authoritative rules                         |
| [testing-strategy.md](directives/testing-strategy.md)     | TDD approach and test types                 |
| [editorial-guidance.md](directives/editorial-guidance.md) | Jim's editorial voice and identity          |
| [metacognition.md](directives/metacognition.md)           | Pause and reflect before planning           |
| [privacy.md](directives/privacy.md)                       | Psychological safety and PII handling       |
| [secops.md](directives/secops.md)                         | Git email, PII audits, operational security |

## Architectural Decisions

| ADR                                                                                     | Subject                          |
| --------------------------------------------------------------------------------------- | -------------------------------- |
| [ADR-001](../docs/architecture/decision-records/001-build-time-pdf-generation.md)       | Build-time PDF generation        |
| [ADR-002](../docs/architecture/decision-records/002-pdf-serving-architecture.md)        | PDF serving architecture         |
| [ADR-003](../docs/architecture/decision-records/003-print-button-removed.md)            | Print button removed             |
| [ADR-004](../docs/architecture/decision-records/004-storybook-deferred.md)              | Storybook deferred               |
| [ADR-005](../docs/architecture/decision-records/005-knip-unused-code-detection.md)      | Knip unused code detection       |
| [ADR-006](../docs/architecture/decision-records/006-header-responsive-layout.md)        | Header responsive layout         |
| [ADR-007](../docs/architecture/decision-records/007-dry-content-metadata.md)            | DRY content metadata             |
| [ADR-008](../docs/architecture/decision-records/008-schema-org-compliance.md)           | Schema.org compliance            |
| [ADR-009](../docs/architecture/decision-records/009-content-negotiation-proxy.md)       | Content negotiation proxy        |
| [ADR-010](../docs/architecture/decision-records/010-canonical-url-graph-identity.md)    | Canonical URL and graph identity |
| [ADR-011](../docs/architecture/decision-records/011-domain-appropriate-descriptions.md) | Domain-appropriate descriptions  |
| [ADR-012](../docs/architecture/decision-records/012-agent-memory-pipeline.md)           | Agent memory pipeline            |
| [ADR-013](../docs/architecture/decision-records/013-security-headers.md)                | Security headers                 |

## Tools and Workflows

### Commands

| Command                                                | Purpose                                          |
| ------------------------------------------------------ | ------------------------------------------------ |
| [jc-start-right](commands/jc-start-right.md)           | Ground yourself before beginning work            |
| [jc-gates](commands/jc-gates.md)                       | Run quality gates with restart-on-fix            |
| [jc-commit](commands/jc-commit.md)                     | Well-formed commit with safety checks            |
| [jc-consolidate-docs](commands/jc-consolidate-docs.md) | Ensure plans, prompts, and memory are up to date |
| [jc-plan](commands/jc-plan.md)                         | Create a structured plan                         |
| [jc-editor](commands/jc-editor.md)                     | Invoke editorial review                          |

### Skills

| Skill                                              | Purpose                                 |
| -------------------------------------------------- | --------------------------------------- |
| [napkin](skills/napkin/SKILL.md)                   | Session learning log — always active    |
| [distillation](skills/distillation/SKILL.md)       | Rotate napkin into curated distilled.md |
| [editorial-voice](skills/editorial-voice/SKILL.md) | Apply Jim's editorial voice             |
| [quality-gates](skills/quality-gates/SKILL.md)     | Run quality gates with restart-on-fix   |
| [deslop](skills/deslop/SKILL.md)                   | Remove AI-generated code slop           |

### Rules

| Rule                                          | Purpose                                             |
| --------------------------------------------- | --------------------------------------------------- |
| [read-practice](rules/read-practice.md)       | Read directives and practice-index at session start |
| [napkin-always-on](rules/napkin-always-on.md) | Read and write napkin continuously                  |
| [tdd](rules/tdd.md)                           | TDD at all levels                                   |
| [type-safety](rules/type-safety.md)           | No type shortcuts                                   |
| [code-quality](rules/code-quality.md)         | Fail fast, never disable checks                     |
| [invoke-reviewers](rules/invoke-reviewers.md) | Invoke code-reviewer after non-trivial changes      |

### Sub-agents

| Agent                                                  | Purpose                                           |
| ------------------------------------------------------ | ------------------------------------------------- |
| [editor](sub-agents/templates/editor.md)               | Editorial reviewer — voice, consistency, pitfalls |
| [code-reviewer](sub-agents/templates/code-reviewer.md) | Gateway reviewer — quality, correctness, triage   |
| [test-reviewer](sub-agents/templates/test-reviewer.md) | TDD compliance and test quality                   |
| [type-reviewer](sub-agents/templates/type-reviewer.md) | TypeScript type safety                            |

## Artefact Directories

| Location                                  | What lives there                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| [`.agent/directives/`](directives/)       | Principles, rules, and operational directives                                    |
| [`.agent/practice-core/`](practice-core/) | Portable practice-core files (trinity, entry points, changelog) and practice box |
| [`.agent/commands/`](commands/)           | Canonical commands (platform-agnostic)                                           |
| [`.agent/skills/`](skills/)               | Canonical skills (platform-agnostic)                                             |
| [`.agent/rules/`](rules/)                 | Canonical always-applied rules (platform-agnostic)                               |
| [`.agent/sub-agents/`](sub-agents/)       | Canonical sub-agent templates                                                    |
| [`.agent/plans/`](plans/)                 | Work planning — active and archived                                              |
| [`.agent/prompts/`](prompts/)             | Reusable prompt playbooks                                                        |
| [`.agent/memory/`](memory/)               | Institutional memory — napkin, distilled, code patterns                          |
| [`.agent/experience/`](experience/)       | Experiential records across sessions                                             |
