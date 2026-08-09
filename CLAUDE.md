# Claude

Agent direction lives in [AGENT.md](.agent/directives/AGENT.md), read it.

## Adapter Model

- `.agent/` contains the canonical commands, skills, rules, and reviewer
  templates.
- `.claude/commands/`, `.claude/skills/`, `.claude/rules/`, and
  `.claude/agents/` are thin Claude adapters that point back to `.agent/`.
- Supported and unsupported platform mappings are documented in
  [.agent/reference/cross-platform-agent-surface-matrix.md](.agent/reference/cross-platform-agent-surface-matrix.md).
- After changing Claude adapters or any shared cross-platform surface, run
  `pnpm portability:check` and `pnpm subagents:check`.
