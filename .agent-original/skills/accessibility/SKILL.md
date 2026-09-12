---
name: accessibility
classification: active
description: Use when work changes rendered, semantic, motion, or PDF surfaces with a11y risk.
---

# Accessibility

Use this skill while planning, implementing, or checking changes that affect
rendered output, semantics, focus order, motion, or assistive-technology
behaviour. It complements `accessibility-reviewer`; use the reviewer for the
independent read-only pass.

## Read in order

1. `.agent/sub-agents/templates/accessibility-reviewer.md`
2. `.agent/rules/invoke-accessibility-reviewer.md`
3. Relevant changed files in `app/`, `components/`, `content/`, `lib/`, and
   `public/`
4. `docs/architecture/decision-records/016-review-oriented-visual-regression-harness.md`
   when the slice changes rendered states or layout

## How to use it

1. Trace the user flow first: keyboard path, headings, landmarks, status
   messaging, and any PDF fallback or unavailable state.
2. Prefer semantic HTML, explicit text, and predictable focus order over
   aria-only patches or post-hoc fixes.
3. Pair the change with proof at the right layer: component or integration
   tests for local behaviour, `pnpm visual-regression-harness` for rendering
   risk, and `pnpm test:e2e` for end-to-end behaviour.
4. Hand off to `accessibility-reviewer` once the slice is implemented, or
   sooner if the trade-offs are unclear.
