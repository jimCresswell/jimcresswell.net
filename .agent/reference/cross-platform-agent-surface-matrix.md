# Cross-Platform Agent Surface Matrix

Operational truth for supported and unsupported agent platform mappings in this
repository. When the Practice Core or local docs reference platform support,
this file is the authoritative local contract.

## Adapter Families

| Surface        | Cursor              | Claude              | GitHub Copilot    | Codex             | `.agents/`             |
| -------------- | ------------------- | ------------------- | ----------------- | ----------------- | ---------------------- |
| **Skills**     | `.cursor/skills/`   | `.claude/skills/`   | unsupported       | unsupported       | `.agents/skills/`      |
| **Commands**   | `.cursor/commands/` | `.claude/commands/` | unsupported       | unsupported       | `.agents/skills/jc-*/` |
| **Rules**      | `.cursor/rules/`    | `.claude/rules/`    | entry-point chain | entry-point chain | entry-point chain      |
| **Sub-agents** | `.cursor/agents/`   | `.claude/agents/`   | `.github/agents/` | `.codex/`         | unsupported            |
| **Hooks**      | unsupported         | unsupported         | unsupported       | unsupported       | unsupported            |

## Entry Points

| Platform           | Entry File                                                       | Notes                                            |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------ |
| Cursor             | `.agent/directives/AGENT.md`                                     | canonical entry for Cursor                       |
| Claude             | `CLAUDE.md` → `.agent/directives/AGENT.md`                       | root Claude entry-point chain                    |
| GitHub Copilot     | `.github/copilot-instructions.md` → `.agent/directives/AGENT.md` | Copilot entry-point chain                        |
| Codex              | `AGENTS.md` → `.agent/directives/AGENT.md`                       | repo entry-point chain                           |
| Portable discovery | `AGENTS.md` → `.agent/directives/AGENT.md`                       | portable discovery follows the Codex entry chain |

## Project Configuration

| Surface               | Location                | Role                                                            |
| --------------------- | ----------------------- | --------------------------------------------------------------- |
| Cursor plugins        | `.cursor/settings.json` | Checked-in Cursor plugin baseline                               |
| Codex reviewers       | `.codex/config.toml`    | Registers the reviewer roster and points to thin Codex adapters |
| GitHub ownership      | `.github/CODEOWNERS`    | Protects owner-edited Practice surfaces                         |
| GitHub workflows      | `.github/workflows/`    | Runs check, validator, and E2E workflows                        |
| Hook policy           | `.agent/hooks/`         | Declares hook policy and deliberate omission state              |
| Claude adapter README | `.claude/README.md`     | Documents the Claude adapter estate                             |

## Vital Practice Surfaces

| Surface                 | Location                                        | Role                                                  |
| ----------------------- | ----------------------------------------------- | ----------------------------------------------------- |
| Practice bridge         | `.agent/practice-index.md`                      | Core-to-local bridge                                  |
| Practice Box            | `.agent/practice-core/incoming/`                | Receiver for inbound Practice Core packages           |
| Portable patterns       | `.agent/practice-core/patterns/`                | Portable general abstractions                         |
| Local pattern instances | `.agent/memory/patterns/`                       | Repo-local proven pattern instances                   |
| Explorations tier       | `docs/explorations/`                            | Design-space work between notes and durable decisions |
| Prompt estate           | `.agent/prompts/README.md`                      | Index for live and archived prompt surfaces           |
| Practice verification   | `.agent/practice-core/practice-verification.md` | Bootstrap and vital-surface contract                  |

## Explicit Unsupported

| Surface                             | State       | Reason                              |
| ----------------------------------- | ----------- | ----------------------------------- |
| `validate-root-application-version` | unsupported | single-package repo                 |
| `clerk-reviewer`                    | unsupported | no Clerk auth surface               |
| `elasticsearch-reviewer`            | unsupported | no Elasticsearch surface            |
| `sentry-reviewer`                   | unsupported | no Sentry or OpenTelemetry pipeline |
| `ground-truth-designer`             | unsupported | Oak-curriculum-specific reviewer    |
| `release-readiness-reviewer`        | unsupported | Vercel owns deploy and release flow |
| `onboarding-reviewer`               | unsupported | single-contributor repo             |

## Notes

- `.agents/skills/` is the portable discovery layer for skills and `jc-*`
  command workflows. It is not evidence for blanket parity across every
  platform surface.
- Unsupported states are written down explicitly rather than inferred from
  missing files.
- The dead Cursor-plugin learning-hook implementation remains intentionally
  absent; hook policy is declarative-only in `.agent/hooks/`.
