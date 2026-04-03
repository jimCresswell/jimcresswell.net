# Cross-Platform Agent Surface Matrix

Operational truth for supported and unsupported agent platform mappings in this
repository. When the Practice Core or local docs reference platform support,
this file is the authoritative local source.

## Adapter Families

| Surface        | Cursor              | GitHub Copilot    | Codex             | `.agents/`             |
| -------------- | ------------------- | ----------------- | ----------------- | ---------------------- |
| **Skills**     | `.cursor/skills/`   | unsupported       | unsupported       | `.agents/skills/`      |
| **Commands**   | `.cursor/commands/` | unsupported       | unsupported       | `.agents/skills/jc-*/` |
| **Rules**      | `.cursor/rules/`    | entry-point chain | entry-point chain | entry-point chain      |
| **Sub-agents** | `.cursor/agents/`   | unsupported       | `.codex/`         | unsupported            |
| **Hooks**      | unsupported         | unsupported       | unsupported       | unsupported            |

## Project Configuration

Tracked project config is part of the shared tooling contract here:

| Surface         | Location                | Role                                                            |
| --------------- | ----------------------- | --------------------------------------------------------------- |
| Cursor plugins  | `.cursor/settings.json` | Enables the repo's checked-in Cursor plugin baseline            |
| Codex reviewers | `.codex/config.toml`    | Registers the reviewer roster and points to thin Codex adapters |

## Entry Points

| Platform           | Entry File                                                       |
| ------------------ | ---------------------------------------------------------------- |
| Cursor             | `.agent/directives/AGENT.md`                                     |
| GitHub Copilot     | `.github/copilot-instructions.md` → `.agent/directives/AGENT.md` |
| Codex / `.agents/` | `AGENTS.md` → `.agent/directives/AGENT.md`                       |

## Notes

- `.agents/skills/` is a narrow portable skill and command-workflow layer, not
  evidence for blanket `.agents/` parity with other platforms.
- Unsupported states are written down explicitly rather than inferred from
  missing files.
- Practice provenance uses UUID entry IDs. Chain order and `date` carry
  chronology, and integration still compares detailed content rather than
  relying on UUID or legacy-index matching alone.
