---
classification: situational
description: Invoke react-component-expert when changes touch React component architecture, hooks, render performance, prop API design, or component composition patterns in UI-shipping workspaces.
trigger: surface:react-component — React component edit (hooks, render, prop API, composition)
globs:
  - "**/*.tsx"
---

# Invoke React Component Reviewer

Invoke `react-component-reviewer` when changes touch `app/`, `components/`, hooks, client or server
boundaries, hydration, or component performance. Use it for React composition and lifecycle
questions before completion.

See `.agent/sub-agents/templates/react-component-expert.md` for the full reviewer brief.
