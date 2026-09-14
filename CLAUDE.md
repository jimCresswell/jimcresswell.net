# Claude

Agent direction lives in [AGENT.md](.agent/directives/AGENT.md), read it.

## Adapter Model

- `.agent/` contains the canonical skills, rules, and reviewer templates.
- `.claude/skills/`, `.claude/rules/`, and `.claude/agents/` are thin Claude
  adapters that point back to `.agent/`; regenerate them with
  `pnpm portability:fix`, which renders every sub-agent adapter surface
  (`.cursor/agents/`, `.claude/agents/`, `.codex/agents/` with the Codex
  registry, and `.gemini/agents/`) from the templates' declarations.
- Supported and unsupported platform mappings are documented in
  [.agent/memory/executive/cross-platform-agent-surface-matrix.md](.agent/memory/executive/cross-platform-agent-surface-matrix.md).
- After changing Claude adapters or any shared cross-platform surface, run
  `pnpm portability:check` and `pnpm subagents:check`.
