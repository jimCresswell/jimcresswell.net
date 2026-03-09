# Graph CV Metadata Description Proof

## Status

Recorded on 2026-03-09 as the second delivered Track A Phase A3 slice for
[personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md).

Use this note with:

- [graph-publication-output-audit.md](graph-publication-output-audit.md)
- [graph-publication-consumer-and-proof-model.md](graph-publication-consumer-and-proof-model.md)
- [graph-rich-result-external-validator-evidence.md](graph-rich-result-external-validator-evidence.md)
- [personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md)

## Decision

This slice stays proof-only.

`/cv` and `/cv/[variant]` already derive `description` and
`openGraph.description` from `person.description` through `lib/cv-content.ts`.
Track A does not need new metadata wiring here; it needs tighter proof that the
existing graph-backed fields are what the app actually exports and emits.

## Implementation

No product metadata wiring changed.

The delivered slice adds proof in the existing Track A-owned surfaces:

- `lib/page-document-contract.integration.test.ts` now proves that the base CV
  metadata export and the active tilt metadata generation both keep
  `description` and `openGraph.description` aligned with `person.description`
- `e2e/behaviour/seo.e2e-api.test.ts` now proves that the emitted
  `<meta name="description">` and `<meta property="og:description">` values on
  `/cv` and `/cv/public_sector` match the same Person description

`/cv/public_sector` remains the currently active `/cv/[variant]` route, so the
emitted-route proof stays truthful to the implementation that exists today.

## Proof

Automated proof added on 2026-03-09:

- `lib/page-document-contract.integration.test.ts`
- `e2e/behaviour/seo.e2e-api.test.ts`

### Harness proof for this slice

Blocking harness proof was not required for this slice.

Reason:

- only proof surfaces changed
- no metadata wiring changed
- no graph plumbing, rendering infrastructure, or page composition changed
- the harness rule in this repo applies to rendering-risk slices, which this
  proof-only update was not

## What this closes

This slice closes the remaining Track A Phase A3 proof gap for graph-derived CV
metadata descriptions.

Track A now has automated proof that:

- the `/cv` metadata export keeps description fields aligned with
  `person.description`
- the active `/cv/[variant]` metadata export keeps description fields aligned
  with `person.description`
- the emitted head fields on `/cv` and `/cv/public_sector` match that same
  Person description

## Follow-on record

The Track A Phase A4 external-validator follow-on is now recorded in
[graph-rich-result-external-validator-evidence.md](graph-rich-result-external-validator-evidence.md).

That note captures:

- the recorded Schema.org Validator code-mode result for `/`
- the current validator-side limitations for `/cv/`
- the current Google Rich Results Test limitations for both `/` and `/cv/`

## Track boundary

This is still Track A publication work.

It does not change:

- visible HTML ownership
- Track B source-of-truth responsibilities
- the rule that the site is not yet graph-derived in visible rendering
