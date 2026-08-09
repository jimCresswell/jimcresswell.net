# .claude

Claude platform adapters for this repo.

## Structure

- `commands/` — thin `jc-*` command adapters pointing to `.agent/commands/`
- `skills/` — thin skill adapters pointing to `.agent/skills/`
- `rules/` — thin rule adapters pointing to `.agent/rules/`
- `agents/` — thin reviewer adapters pointing to `.agent/sub-agents/templates/`

After changing any of these surfaces, run `pnpm portability:check` and
`pnpm subagents:check`.
