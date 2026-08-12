# ADR-021: Canonical-only CV identity

## Status

Accepted; supersedes ADR-017

## Date

2026-08-12

## Context

ADR-017 established that audience-tilted CV routes were aliases of the
canonical `/cv/` page. Only `/cv/public_sector` was exposed on the web;
additional variants existed in content. The feature required a dynamic route,
variant page contracts, tilt-specific graph statements, tests, and a dedicated
visual-regression slice. An adjacent alternate-headline toggle was also retired
because it had no current product requirement.

There is no current product requirement for audience-specific CV variants.
Keeping that surface increased maintenance cost and made the current
single-view content architecture ambiguous.

## Decision

Retire the live tilt surface and keep one canonical CV identity:

1. `/cv/` is the sole editorial CV document. Retired audience-tilt slugs such
   as `/cv/public_sector` return 404 across HTML, Markdown, and graph
   negotiation; the deliberate PDF subroutes retain their native responses.
2. The page/document contract contains only the home and canonical CV entries.
3. The CV headline is static; there is no headline toggle.
4. Tilt fields and their three retired tilt-specific `TiltVariant` graph
   statements are removed from live content.
5. The visual-regression policy covers `/` and `/cv` only.
6. Reintroducing tilts requires a new product requirement, plan, and ADR that
   explicitly starts from the preserved tilt reference.

The retired editorial material and ADR-017 rationale remain available in
[CV tilt content and canonical-alias rationale](../reference/cv-tilt-content-and-rationale.md).

## Consequences

- Search, structured-data, HTML, sitemap, and regression consumers see one CV
  page identity.
- The home and canonical CV page/document contracts no longer need the former
  tilt exception between HTML titles and inline `ProfilePage` JSON-LD names.
- Old variant links fail clearly with the normal branded 404 rather than
  silently selecting or redirecting to different editorial content.
- Optional future work is preserved as reference material without retaining
  current runtime or testing cost.

## Related

- [ADR-017](017-cv-tilt-routes-are-canonical-aliases.md) — superseded decision
- [CV tilt content and canonical-alias rationale](../reference/cv-tilt-content-and-rationale.md)
- [ADR-016](016-review-oriented-visual-regression-harness.md) — rendered-output
  review policy
