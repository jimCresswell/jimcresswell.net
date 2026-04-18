# CV Tilt Content and Canonical-Alias Rationale

## Status

Reference document.

This document preserves the editorial content and the architectural rationale
of the **CV tilt** feature so that the design context survives the feature
itself. It is intended to be the starting point if tilts are ever
reintroduced.

## Why this document exists

The site previously exposed audience-tilted variants of the canonical CV at
`/cv/[variant]` — `/cv/public_sector`, `/cv/private_ai`, `/cv/founder`. The
`HeadlineToggle` component swapped the canonical headline with an alternate
version on click. The variants reused the canonical CV body and only changed
the positioning paragraph and headline.

Tilts are being retired so that the source-of-truth design surface (see
ADR-014 and the architecture overview) can credibly scope to a single
canonical CV editorial view. Removing the live surface without preserving the
content and rationale would lose real editorial work and force any future
re-introduction to start from archaeology.

This document holds:

1. The verbatim tilt content as it existed at retirement.
2. The canonical-alias architectural rules that governed tilt routes.
3. The conditions under which tilts could be reintroduced and how to start.

## Preserved tilt content

> **Population pending.** The retirement work captures the verbatim content
> from `content/cv.content.json` (specifically `meta.headline_alt` and the
> `tilts` block, including `tilts._meta.order` and `tilts._meta.web_routes`,
> and the per-tilt `positioning` and any tilt-specific fields) into this
> section before the content is removed from the codebase. Each tilt's
> positioning paragraph is recorded verbatim, with its key, label, and
> intended audience.

### Alternate headline

> Population pending — current value of `meta.headline_alt`.

### Tilt entries

> Population pending — for each tilt key (`public_sector`, `private_ai`,
> `founder`):
>
> - audience and editorial intent (one short paragraph)
> - positioning paragraph (verbatim)
> - any other fields present in the JSON (e.g. headline override,
>   per-route metadata)

### Tilt metadata

> Population pending — verbatim copy of `tilts._meta` including `order` and
> `web_routes`.

## Canonical-alias rationale

The rules below superseded an earlier ambiguous state in which it was unclear
whether each tilt route was its own canonical page identity or an alternate
presentation of the canonical `/cv/` page. The rules treat tilts as
**alternate presentations of the canonical `/cv/` page**, not separate
canonical identities.

The rules were:

1. `/cv/` is the only canonical CV page for search and structured-data page
   identity.
2. Every tilt route emits `<link rel="canonical" href=".../cv/">`.
3. Every tilt route reuses the canonical CV `ProfilePage` JSON-LD node, with
   the canonical `@id` and `url` and the canonical CV page name.
4. Tilt routes are not rich-result targets in their own right.
5. Tilt routes may use route-specific human-facing titles and Open Graph URLs
   so the current presentation is clear to human readers and shared links.

The rationale for each rule:

- **Rule 1** prevented competing near-duplicate page identities for the same
  underlying CV, which would have fragmented search and structured-data
  signals across audiences.
- **Rule 2** kept canonical-URL signals consistent with rule 1.
- **Rule 3** kept the page-level graph node consistent with rule 1 — one
  `ProfilePage` for the CV irrespective of tilt.
- **Rule 4** ensured rich-result validation focused on the home page and
  canonical CV page rather than on every variant.
- **Rule 5** preserved a humane reading experience for shared links and
  page titles without contradicting the structured-data position.

These rules were originally recorded in ADR-017 (CV tilt routes are canonical
aliases of the base CV page). The ADR superseded by tilt retirement records
the canonical-only state and links back to this document.

## Re-entry conditions

Tilts can be reintroduced if there is a real, stated product requirement that
warrants the additional surface area — for example, distinct outreach
audiences whose distinct positioning materially improves engagement.

If tilts return, do not re-derive the design from scratch. Start from:

1. **This document**, for the editorial content and the rule rationale.
2. **The graph source-of-truth layer map's tilt-implications section**, which
   captured how tilt selection sits in the composition layer rather than the
   facts layer.
3. **A new ADR** that explicitly references this document as the starting
   point and either reaffirms or supersedes the canonical-alias rules.

Re-introduction work should land as a dedicated plan, not be folded into
unrelated work. The plan should explicitly answer:

- which audiences justify the additional surface
- how the composition layer selects between tilts
- whether tilts are HTML-visible only, PDF-also, or some other channel mix
- how rich-result and JSON-LD identity behaves under the new model
- what proof shape verifies the architecture (visual regression harness,
  Playwright E2E, JSON-LD validation)

## Related

- [ADR-014](../decision-records/014-entity-model-design.md) — entity model
  design
- ADR superseding ADR-017 — canonical-only CV identity (added when retirement
  lands)
- [Architecture README](../README.md)
