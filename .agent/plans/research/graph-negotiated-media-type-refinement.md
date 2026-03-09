# Graph Negotiated Media-Type Refinement

## Status

Recorded on 2026-03-09 as the first delivered Track A Phase A3 slice for
[personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md).

Use this note with:

- [graph-publication-output-audit.md](graph-publication-output-audit.md)
- [graph-publication-consumer-and-proof-model.md](graph-publication-consumer-and-proof-model.md)
- [graph-rich-result-external-validator-evidence.md](graph-rich-result-external-validator-evidence.md)
- [personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md)

## Decision

The graph payload remains one shared JSON-LD document.

When a client requests either:

- `application/ld+json`
- `application/json`

the app returns the same graph payload, with the response `Content-Type`
matching the explicit request.

This preserves one publication surface while expressing the negotiated contract
truthfully.

## Implementation

The delivered slice is:

- `lib/graph-media-type.ts` centralises Accept-header parsing for the supported
  graph media types
- `proxy.ts` now rewrites page-route requests for both
  `application/ld+json` and `application/json`
- `app/api/graph/route.ts` now returns the same JSON-LD body with a response
  `Content-Type` that matches the requested graph media type

No change was made to the graph payload itself.

## Proof

Automated proof added on 2026-03-09:

- `lib/graph-media-type.unit.test.ts`
- `e2e/behaviour/graph-api.e2e-api.test.ts`

The E2E proof now covers:

- direct `/api/graph` requests with `Accept: application/ld+json`
- page-route negotiation for `/`
- page-route negotiation for `/cv`
- page-route negotiation for `/cv/public_sector`

For future rendering-risk slices, this repo now treats the visual regression
harness as blocking proof during implementation, not just as end-of-work
confirmation.

### Harness proof for this slice

Blocking harness proof was run on 2026-03-09 with:

```bash
pnpm visual-regression-harness HEAD WORKTREE
```

Result:

- comparison label: `HEAD-vs-WORKTREE`
- captured site surfaces: `/`, `/cv`, `/cv/public_sector`
- outcome: no unexpected differences recorded

Artefacts:

- `regression-artifacts/visual-regression-harness/HEAD-vs-WORKTREE/summary.txt`
- `regression-artifacts/visual-regression-harness/HEAD-vs-WORKTREE/diff/summary.json`

## What this closes

This slice closes the following previously-open Track A issues:

- the weak-expression issue where the negotiated graph channel always answered
  with `application/json`
- the proof gap around negotiated page-route coverage for `/` and tilt routes
- the proof gap around the negotiated response media-type contract

## What remains open now

The following items were closed later in Track A:

- home-page inline JSON-LD emitted-channel proof
- dedicated automated proof for `/manifest.webmanifest`
- tighter proof for graph-derived CV metadata descriptions

That follow-on is now recorded in
[graph-rich-result-external-validator-evidence.md](graph-rich-result-external-validator-evidence.md):

- the home-page Schema.org Validator code-mode evidence is now captured
- the remaining `/cv/` Schema.org result and Google Rich Results Test verdicts
  are now accepted validator-side limits for this slice

## Track boundary

This is still Track A publication work.

It does not change:

- visible HTML ownership
- Track B source-of-truth responsibilities
- the rule that the site is not yet graph-derived in visible rendering
