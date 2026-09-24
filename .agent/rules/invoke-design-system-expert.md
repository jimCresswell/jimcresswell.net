---
classification: situational
description: Invoke design-system-expert when changes touch design tokens, CSS custom properties, colour palettes, spacing scales, typography scales, motion, theming, or visual consistency in UI-shipping workspaces.
trigger: surface:design — Design token / theming / CSS custom property / global CSS / colour palette / spacing / typography / motion / layout rhythm / breakpoint / multi-surface (page and PDF) styling / shared-component styling / visual-consistency change
globs:
  - packages/design/**
  - "**/*.css"
---

# Invoke Design System Reviewer

Invoke `design-system-expert` when changes touch shared visual language: tokens, theming,
spacing, typography, motion, layout rhythm, breakpoints, or multi-surface styling. Use it for
global CSS, shared components, and visual-system drift checks.

See `.agent/sub-agents/templates/design-system-expert.md` for the full reviewer brief.
