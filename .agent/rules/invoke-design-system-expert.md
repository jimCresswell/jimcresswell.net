---
classification: situational
description: Invoke design-system-expert when changes touch design tokens, CSS custom properties, colour palettes, spacing scales, typography scales, theming, or visual consistency in UI-shipping workspaces.
trigger: surface:design — Design token / theming / CSS custom property / colour palette change
globs:
  - packages/design/**
  - "**/*.css"
---

# Invoke Design System Reviewer

Invoke `design-system-reviewer` when changes touch shared visual language: tokens, spacing,
typography, layout rhythm, breakpoints, or multi-surface styling. Use it for global CSS, shared
components, and visual-system drift checks.

See `.agent/sub-agents/templates/design-system-expert.md` for the full reviewer brief.
