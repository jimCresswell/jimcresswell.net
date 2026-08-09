# Invoke Code Reviewers

Invoke `code-reviewer` after every non-trivial change. Use it as the gateway reviewer: it assesses
overall quality, decides whether review can stop there, and triages to specialists from the
installed roster when the diff touches their domain. In Codex, use the reviewer roles registered in
`.codex/config.toml`.

See `.agent/sub-agents/templates/code-reviewer.md` for the full reviewer brief.
