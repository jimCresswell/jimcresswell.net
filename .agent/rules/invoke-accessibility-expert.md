---
classification: situational
description: Invoke accessibility-expert when changes touch rendered HTML, ARIA attributes, keyboard interaction, colour contrast, focus management, or WCAG compliance in UI-shipping workspaces.
trigger: surface:accessibility — Accessibility-touching change (WCAG / keyboard / focus / contrast / ARIA)
globs:
  - "**/*.tsx"
  - "**/*.html"
  - "**/*.css"
---

# Invoke Accessibility Reviewer

Invoke `accessibility-reviewer` when changes alter markup, interaction flows, focus order,
semantics, motion, PDF accessibility, or assistive-technology behaviour. Use it for any rendered
change where WCAG, keyboard access, or screen-reader interpretation could regress.

See `.agent/sub-agents/templates/accessibility-expert.md` for the full reviewer brief.
