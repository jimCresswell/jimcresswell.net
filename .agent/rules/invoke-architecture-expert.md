---
classification: situational
description: invoke architecture expert
trigger: surface:workspace boundaries, import direction, module structure, dependency injection, public APIs
---

# Invoke Architecture Reviewer

Invoke `architecture-expert` when changes touch workspace boundaries, import direction between
`jcdotnet`, `agent-tools` and `tooling/*`, module structure, dependency injection, or a public API.
Use it for structural review across the workspaces, and invoke the persona whose lane the change
also touches (`.agent/sub-agents/components/architecture/reviewer-team.md`).

See `.agent/sub-agents/templates/architecture-expert.md` for the full reviewer brief.
