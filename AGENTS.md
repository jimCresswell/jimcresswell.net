# Agents

Agent direction lives in [AGENT.md](.agent/directives/AGENT.md), read it.

## Codex Adapter Model

- `.agent/` contains the canonical skills, rules, and reviewer templates.
- `.agents/skills/` contains the cross-tool `jc-*` skill adapters (the open Agent Skills layout) and `.agents/rules/` mirrors the canonical rules for loaders that read it. Sub-agents are not skills and live in `.codex/`.
- `.codex/config.toml` registers the real Codex reviewer sub-agents, with thin per-agent adapters under `.codex/agents/`.
- Always-on behaviour comes from this entry point plus [AGENT.md](.agent/directives/AGENT.md) and the canonical rules in `.agent/rules/`, enumerated in `RULES_INDEX.md`; Codex reads every canonical rule at session open.
- If a canonical rule tells you to invoke a skill, use the corresponding `.agents/skills/` adapter. Reviewer roles remain canonical in `.agent/sub-agents/templates/` and are wired through platform-specific configuration, in this case of Codex in `.codex/`, see [.codex/README.md](.codex/README.md).
- Supported and unsupported platform mappings are documented in
  [.agent/memory/executive/cross-platform-agent-surface-matrix.md](.agent/memory/executive/cross-platform-agent-surface-matrix.md).
- After changing adapter surfaces or reviewer wiring, run `pnpm portability:check`.

## Code review

Review against the pull request description's `## Scope` section. A finding whose remedy
falls outside the declared scope is reported as an out-of-scope observation with no
proposed change; do not propose additions the scope does not ask for. On a prose- or
records-class changeset, and on the prose findings of a mixed one, grade against the
declared intake (artefact class, verification point, bar) rather than against
completeness; code findings keep the code review's own standard.

Entries below are temporary capture points in the Practice learning loop.
During distillation and `consolidate-docs`, entries are moved to permanent docs
and replaced with anchors. Do not re-add entries that already have anchors.

## Learned User Preferences

Anchored (already in permanent docs — do not re-add):

- Plans standalone and discoverable → [AGENT.md](.agent/directives/AGENT.md) Agent Behaviour
- Don't push commits unless asked → [AGENT.md](.agent/directives/AGENT.md) Agent Behaviour
- Verify claims with evidence → [AGENT.md](.agent/directives/AGENT.md) Agent Behaviour
- CSS rem/em, not px → [principles.md](.agent/directives/principles.md) CSS and Accessibility
- Work on branches for risky changes → [principles.md](.agent/directives/principles.md) CSS and Accessibility
- Content in JSON, not components → [principles.md](.agent/directives/principles.md) Documentation
- Permanent docs never reference ephemeral → [principles.md](.agent/directives/principles.md) Documentation
- Gate restart discipline → [principles.md](.agent/directives/principles.md) Code Quality
- Prefer `as const` runtime values to derive types and guards → [principles.md](.agent/directives/principles.md) Type Safety
- Front page is not CV-lite, registers differ → [editorial-guidance.md](.agent/directives/editorial-guidance.md) Voice and register
- Product safety not data safety → [editorial-guidance.md](.agent/directives/editorial-guidance.md)
- Don't claim solo credit → [editorial-guidance.md](.agent/directives/editorial-guidance.md) Collaborative credit
- No checkboxes for editorial discussions → [editorial-guidance.md](.agent/directives/editorial-guidance.md) Voice and register
- Minimise definitions in tests; move real domain rules into product code → [testing-strategy.md](.agent/directives/testing-strategy.md) Philosophy

## Learned Workspace Facts

Anchored (already in permanent docs — do not re-add):

- postcss.config must be .mjs (Turbopack gotcha) → [docs/architecture/README.md](docs/architecture/README.md) Repo-Specific Operational Constraints
- Print button removed → [ADR-003](docs/architecture/decision-records/003-print-button-removed.md)
- JSON-LD ID convention → [ADR-010](docs/architecture/decision-records/010-canonical-url-graph-identity.md)
- Schema.org compliance → [ADR-008](docs/architecture/decision-records/008-schema-org-compliance.md)
