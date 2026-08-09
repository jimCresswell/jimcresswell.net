---
name: subagent-architecture
classification: active
description: Use when work changes the reviewer estate: roster, skills, rules, commands, or wiring.
---

# Subagent Architecture

Use this skill while changing the reviewer estate itself: canonical templates,
skills, situational rules, commands, or the platform adapters that wire them
together. It complements `subagent-architect`; use that reviewer for the
independent estate-shape review.

## Read in order

1. `.agent/sub-agents/templates/subagent-architect.md`
2. `.agent/rules/invoke-subagent-architect.md`
3. The relevant changed surfaces under `.agent/`, `.cursor/`, `.claude/`,
   `.codex/`, `.github/`, and `.agents/`
4. `docs/architecture/decision-records/015-codex-adapter-model.md` when Codex
   reviewer wiring is involved

## How to use it

1. Start from the canonical artefact, then add or revise the smallest possible
   set of thin adapters on the platform surfaces.
2. Treat reviewer, skill, and situational rule as one coordinated unit. If one
   layer changes, trace the matching change across the others.
3. Keep adapter bodies lean: frontmatter plus `Read and follow` back to the
   canonical source.
4. Hand off to `subagent-architect` once the estate change is wired, and use
   `mcp` alongside it when the same change affects multiple platform surfaces.
