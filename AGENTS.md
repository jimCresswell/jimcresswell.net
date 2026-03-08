# Agents

Agent direction lives in [AGENT.md](.agent/directives/AGENT.md), read it.

## Codex Adapter Model

- `.agent/` contains the canonical skills, rules, commands, and reviewer templates.
- `.agents/skills/` contains the Codex adapters for repo-local skills and `jc-*` commands.
- `.codex/config.toml` registers the real Codex reviewer sub-agents, with thin per-agent adapters under `.codex/agents/`.
- Always-on behaviour comes from this entry point plus [AGENT.md](.agent/directives/AGENT.md) and the canonical rules in `.agent/rules/`; there is no separate `.agents/rules/` layer.
- If a canonical rule tells you to invoke a command or skill, use the corresponding `.agents/skills/` adapter. Reviewer roles remain canonical in `.agent/sub-agents/templates/` and should be wired through `.codex/`, not `.agents/skills/`.

Entries below are landing pads for the continual-learning skill.
During distillation, entries are moved to permanent docs and
replaced with anchors. Do not re-add entries that have anchors.

## Learned User Preferences

Anchored (already in permanent docs — do not re-add):

- Plans standalone and discoverable → [AGENT.md](.agent/directives/AGENT.md) Agent Behaviour
- Don't push commits unless asked → [AGENT.md](.agent/directives/AGENT.md) Agent Behaviour
- Verify claims with evidence → [AGENT.md](.agent/directives/AGENT.md) Agent Behaviour
- CSS rem/em, not px → [rules.md](.agent/directives/rules.md) CSS and Accessibility
- Work on branches for risky changes → [rules.md](.agent/directives/rules.md) CSS and Accessibility
- Content in JSON, not components → [rules.md](.agent/directives/rules.md) Documentation
- Permanent docs never reference ephemeral → [rules.md](.agent/directives/rules.md) Documentation
- Gate restart discipline → [rules.md](.agent/directives/rules.md) Code Quality
- Prefer `as const` runtime values to derive types and guards → [rules.md](.agent/directives/rules.md) Type Safety
- Front page is not CV-lite, registers differ → [editorial-guidance.md](.agent/directives/editorial-guidance.md) Voice and register
- Product safety not data safety → [editorial-guidance.md](.agent/directives/editorial-guidance.md)
- Don't claim solo credit → [editorial-guidance.md](.agent/directives/editorial-guidance.md) Collaborative credit
- No checkboxes for editorial discussions → [editorial-guidance.md](.agent/directives/editorial-guidance.md) Voice and register
- Minimise definitions in tests; move real domain rules into product code → [testing-strategy.md](.agent/directives/testing-strategy.md) Philosophy

## Learned Workspace Facts

Anchored (already in permanent docs — do not re-add):

- postcss.config must be .mjs (Turbopack gotcha) → [distilled.md](.agent/memory/distilled.md) Troubleshooting
- Print button removed → [ADR-003](docs/architecture/decision-records/003-print-button-removed.md)
- JSON-LD ID convention → [ADR-010](docs/architecture/decision-records/010-canonical-url-graph-identity.md)
- Schema.org compliance → [ADR-008](docs/architecture/decision-records/008-schema-org-compliance.md)
