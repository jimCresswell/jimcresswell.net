---
classification: situational
description: Route reviewer, rule, skill, and adapter-estate changes through subagent-architect
trigger: surface:.agent/sub-agents/, platform agent adapters
globs:
  - .agent/**/*
  - .cursor/**/*
  - .claude/**/*
  - .codex/**/*
  - .github/**/*
  - .agents/**/*
---

# Invoke Subagent Architect

Invoke `subagent-architect` when the reviewer roster, rules, skills, or cross-platform agent
wiring changes. Use it to validate canonical-first architecture, thin wrappers, and the
overall specialist landscape.

See `.agent/sub-agents/templates/subagent-architect.md` for the full reviewer brief.
