---
name: design-system
classification: active
description: Use when work changes shared tokens, spacing, type, theming, or responsive visuals.
---

# Design System

Use this skill while changing the shared visual language: tokens, spacing,
typography, theming, responsive layout, or reusable presentation components. It
complements `design-system-reviewer`; use that reviewer for the independent
check once the slice is shaped.

## Read in order

1. `.agent/sub-agents/templates/design-system-reviewer.md`
2. `.agent/rules/invoke-design-system-reviewer.md`
3. Relevant changed files in `app/`, `components/`, `app/globals.css`, `lib/`,
   and `public/`
4. `docs/architecture/decision-records/006-header-responsive-layout.md` when
   the layout rhythm or responsive structure moves

## How to use it

1. Reuse existing tokens and rhythm before inventing new values; prefer relative
   units and shared helpers over ad hoc numbers.
2. Treat mobile, desktop, zoom, and theme states as part of the same contract,
   not follow-up polish.
3. Run `pnpm visual-regression-harness` on any slice that can visibly shift the
   layout, spacing, or theming.
4. Hand off to `design-system-reviewer` once the component or style surface is
   implemented, and pull in `accessibility` when contrast or motion are part of
   the trade-off.
