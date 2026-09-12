---
name: mcp
classification: active
description: Use when work changes multi-platform agent surfaces across .agent and platform layers.
---

# MCP

Use this skill while changing the multi-platform agent surface: canonical
templates, platform adapters, reviewer wiring, rules, commands, or cross-host
discovery. It complements `mcp-reviewer`; use the reviewer for the independent
cross-platform coherence pass.

## Read in order

1. `.agent/sub-agents/templates/mcp-reviewer.md`
2. `.agent/rules/invoke-mcp-reviewer.md`
3. `CLAUDE.md` and `.codex/config.toml`
4. The relevant changed surfaces under `.agent/`, `.cursor/`, `.claude/`,
   `.codex/`, `.github/`, and `.agents/`

## How to use it

1. Start from the canonical source in `.agent/`, then trace the matching
   adapter on every supported platform before you write anything.
2. Keep adapters thin: frontmatter, a short description, and `Read and follow`
   back to the canonical source.
3. If a change affects reviewer, skill, or rule discovery, check the same
   capability across all platform surfaces in one pass rather than patching
   platform by platform.
4. Hand off to `mcp-reviewer` once the wiring is complete, and use
   `subagent-architecture` alongside it when the change alters the reviewer
   estate itself.
