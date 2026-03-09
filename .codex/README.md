# Codex Adapters

This directory holds Codex-specific project configuration.

- `.agents/skills/` holds thin Codex adapters for repo-local skills and
  `jc-*` command workflows.
- `.codex/config.toml` registers the repo's Codex reviewer sub-agents.
- Reviewer sub-agents are not skills. They live here, not in `.agents/skills/`.
- `.codex/agents/*.toml` are thin per-agent adapters.
- Canonical reviewer instructions stay in `.agent/sub-agents/templates/`.
