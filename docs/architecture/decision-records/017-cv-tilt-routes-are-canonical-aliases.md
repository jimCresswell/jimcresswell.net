# ADR-017: CV tilt routes are canonical aliases of the base CV page

## Status

Accepted

## Date

2026-03-08

## Context

The site exposes tilt routes such as `/cv/public_sector` that change the
positioning narrative while keeping the rest of the CV shared. Once the page
document contract and the inline JSON-LD graph became first-class proof
surfaces, the repo needed a clear answer to a previously implicit question:

- is each tilt route its own canonical page identity?
- or is each tilt route an alternate presentation of the canonical `/cv/` page?

This choice affects:

- `<link rel="canonical">`
- the inline `ProfilePage` JSON-LD node
- which pages are treated as rich-result-facing targets
- what the regression harness should treat as expected page identity

The implementation before this ADR already leaned toward aliasing:
tilt routes rendered alternative HTML titles for humans but reused the canonical
CV `ProfilePage` JSON-LD node and pointed their canonical metadata at `/cv/`.
That behaviour needed to become explicit.

## Decision

Tilt routes are **alternate presentations of the canonical `/cv/` page**, not
separate canonical page identities.

Rules:

1. `/cv/` is the only canonical CV page for search and structured-data page identity.
2. Every tilt route emits `<link rel="canonical" href=".../cv/">`.
3. Every tilt route reuses the canonical CV `ProfilePage` JSON-LD node:
   - `@id` is `.../cv/#webpage`
   - `url` is `.../cv/`
   - `name` is the canonical CV page name
4. Tilt routes are **not** rich-result targets in their own right.
5. Tilt routes may still use route-specific human-facing titles and Open Graph URLs
   so the current presentation is clear to human readers and shared links.

## Consequences

- Search and structured-data consumers see one canonical CV page identity rather
  than several competing near-duplicates.
- Tilt routes remain useful as audience-specific entry points without fragmenting
  the page-level graph.
- The repo must not claim that every page's HTML `<title>` matches the inline
  `ProfilePage` JSON-LD `name`; tilt routes are the deliberate exception.
- Rich-result-facing validation applies to the home page and canonical CV page,
  while tilt routes are validated as canonical aliases.
- The visual regression harness can treat tilt-route page identity drift as a
  real regression rather than an ambiguous difference.

## Related

- [ADR-010](010-canonical-url-graph-identity.md) — full graph from any page URL
- [ADR-016](016-review-oriented-visual-regression-harness.md) — review contract
  for historical proof work
- [content-model.md](../content-model.md) — route/content relationship and tilt
  behaviour
