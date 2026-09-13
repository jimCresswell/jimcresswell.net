---
title: 'Strategy — Stream: the platform (the site and the Practice)'
type: strategy
status: sketch
last_updated: 2026-09-13
governed_by:
  - .agent/plans/strategy/README.md
---

# Stream — the platform (the site and the Practice)

_Part of the [strategy](README.md). The owner expects the site and the Practice to be
relatively stable; this stream keeps them that way, and provable, so the content and the
graph can be the priority._

## Choices

- **PLATFORM-1 — The site stays stable and provable.** The Next.js site, its PDF generation
  and deployment contract are proved at the production layer: `pnpm check` green on every
  leg, Playwright against a production build, the visual regression harness with reviewed
  baselines. Prefer more proof at the production layer over working around dev-server
  transients.
- **PLATFORM-2 — Workspace boundaries only where they create ownership, proof or lifecycle
  value.** The monorepo exists (the 2026-09-12 transplant: `jcdotnet`, `agent-tools`,
  `tooling/*`); the accepted extraction-gate rule from the legacy workspace family still
  governs any further package: a candidate loses package status when it has one meaningful
  consumer, its API is dominated by the owner's configuration, framework coupling makes
  independent use implausible, or overhead exceeds the enforced boundary. Never create a
  second artificial consumer to force a pass.
- **PLATFORM-3 — The Practice is a lineage the repository takes deliberately.** The
  engineering practice and agent estate follow the shared lineage (the 2026-09-12 transplant
  is the first generation here); a host takes a newer generation by the transplant runbook
  when its owner decides the delta is worth the rulings, preserving local divergence; the
  learning loop (napkin → distilled → pending graduations → doctrine) is the reason the
  Practice is here at all.
- **PLATFORM-4 — Dependency hygiene, one major per slice.** Security-required majors and
  patched transitives land promptly; unrelated majors are parked, risk-graded, and taken one
  per slice with full gates and a preview build each; a layering gate (dependency-cruiser)
  is a blocking `check` leg.

## What the transplant already settled (2026-09-12)

The monorepo scaffold and root gates, the harness (hooks, statusline, husky, CI parity), the
validator estate in `agent-tools`, and the plan-node estate this strategy lives in. The legacy
workspace family's premise ("no workspace manifest exists") is therefore stale; its extraction
gates survive as PLATFORM-2 and its children are re-read against the tree that exists.

## Won't do

- Extract a package to prove the workspace machinery works.
- Fork the Practice from its lineage; divergence is recorded, never silent.
