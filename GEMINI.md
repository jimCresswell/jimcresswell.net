# Gemini

Agent direction lives in [AGENT.md](.agent/directives/AGENT.md), read it.

## Gemini Adapter Model

- `.agent/` contains the canonical skills, rules, and reviewer templates.
- `.agents/skills/` contains the cross-tool `jc-*` skill adapters (the open Agent Skills
  layout), which Gemini CLI loads as the repo's portable skills; `.agents/rules/` mirrors the
  canonical rules for loaders that read it.
- Always-on behaviour comes from this entry point plus [AGENT.md](.agent/directives/AGENT.md)
  and the canonical rules in `.agent/rules/`, enumerated in `RULES_INDEX.md`; Gemini reads
  every canonical rule at session open, as Codex does.
- Reviewer roles remain canonical in `.agent/sub-agents/templates/`; read the template for the
  role directly.
- Supported and unsupported platform mappings are documented in
  [.agent/memory/executive/cross-platform-agent-surface-matrix.md](.agent/memory/executive/cross-platform-agent-surface-matrix.md).
- After changing adapter surfaces or reviewer wiring, run `pnpm portability:check`.
