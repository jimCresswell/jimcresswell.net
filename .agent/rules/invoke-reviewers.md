# Invoke Reviewers

After non-trivial changes, invoke the code-reviewer sub-agent. In Codex, use the
reviewer roles registered in `.codex/config.toml`. The code-reviewer is the
gateway — it assesses overall quality and triages to specialists
(`test-reviewer`, `type-reviewer`, `editor`, `pkg-reviewer`) as needed.

Triage to `pkg-reviewer` when changes involve entity model files, JSON-LD generation, `@id` conventions, or structured data output.

Reviewer roster: `.agent/sub-agents/templates/`
