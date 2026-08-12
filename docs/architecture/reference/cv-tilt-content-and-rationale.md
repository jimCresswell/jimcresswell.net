# CV Tilt Content and Canonical-Alias Rationale

## Status

Reference document.

This document preserves the editorial content and the architectural rationale
of the **CV tilt** feature so that the design context survives the feature
itself. It is intended to be the starting point if tilts are ever
reintroduced.

## Why this document exists

The site previously held three audience tilts. Only `public_sector` was exposed
as `/cv/public_sector`; `private_ai` and `founder` remained content-only. Each
tilt reused the canonical CV body and supplied a context label plus a
positioning paragraph. Separately, the shared `HeadlineToggle` component
swapped the canonical headline with an alternate version; tilts did not own
alternate headlines.

Tilts were retired by [ADR-021](../decision-records/021-canonical-only-cv-identity.md)
so the live architecture has one canonical CV editorial view. This document
preserves the removed content and rationale so any future re-entry begins from
the actual design, not archaeology.

This document holds:

1. The verbatim tilt content as it existed at retirement.
2. The canonical-alias architectural rules that governed tilt routes.
3. The conditions under which tilts could be reintroduced and how to start.

## Preserved tilt content

Captured verbatim from `content/cv.content.json` before retirement.

### Alternate headline

> The questions keep getting bigger

It toggled against the primary headline **“Understanding systems, shaping
change”**, which remains live.

### Tilt entries

#### `public_sector` — UK Civil Service / Public AI Leadership

> I work on complex, long‑term problems where AI, data, and public services
> intersect, particularly in early or unstructured contexts where new forms of
> public value and access are possible but not yet well understood. I lead
> exploratory work that reframes what public services could offer, unlocking
> novel ways for people to benefit from shared data and digital capability. My
> focus is on shaping the early conditions for high‑impact use of AI in public
> systems, enabling others to create value responsibly and at scale.

#### `private_ai` — Private AI Companies / Frontier Exploration

> I work on complex, early‑stage problem spaces at the frontier of AI
> capability, where the right questions are not yet clear and premature
> solutions can distort long‑term value. I lead exploratory work that reframes
> problems, identifies leverage, and gives initial shape to systems before they
> become products. My strength is turning ambiguity into coherent direction,
> enabling others to build with lasting impact.

#### `founder` — Founder / Origination

> I explore complex, high‑impact problem spaces where existing models no longer
> fit and new systems are required. My work centres on discovery and creation:
> forming new conceptual frameworks, testing what is worth building at all, and
> shaping the first coherent versions of ideas that can grow beyond me. I'm
> driven by origination, leverage, and impact that emerges through others rather
> than incremental optimisation.

### Tilt metadata

- `primary`: `public_sector`
- `order`: `public_sector`, `private_ai`, `founder`
- `web_routes`: `public_sector`
- `note`: “primary is the default variant; others are contextual reframings,
  not alternatives. Only web_routes variants are exposed on the website; all
  variants are available for PDF generation.”

The note's PDF clause described an intention, not implemented behaviour. PDF
generation rendered only `/cv`; any future per-tilt PDF support would need an
explicit product decision and implementation.

The graph also held three `Statement` nodes with `additionalType`
`.../TiltVariant`: `#tilt-public-sector`, `#tilt-private-ai`, and
`#tilt-founder`. They carried the positioning text above and were removed with
the web/content surface. A future re-entry must decide deliberately whether
and how those expressive nodes return.

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

These rules were originally recorded in ADR-017. ADR-021 supersedes that
record with the canonical-only state and links back to this document.

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
- [ADR-021](../decision-records/021-canonical-only-cv-identity.md) —
  canonical-only CV identity
- [Architecture README](../README.md)
