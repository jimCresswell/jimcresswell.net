# Graph Publication Output Audit

## Status

Recorded on 2026-03-09 as the Track A Phase A2 deliverable for
[personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md).

Use this note with:

- [personal-knowledge-graph-roadmap.plan.md](../current/personal-knowledge-graph-roadmap.plan.md)
- [graph-current-state-audit.md](graph-current-state-audit.md)
- [graph-publication-consumer-and-proof-model.md](graph-publication-consumer-and-proof-model.md)
- [graph-negotiated-media-type-refinement.md](graph-negotiated-media-type-refinement.md)
- [personal-knowledge-graph-source-of-truth-design.plan.md](../current/personal-knowledge-graph-source-of-truth-design.plan.md)

This note is implementation-backed. It audits only the graph publication
surfaces that exist today. It does not widen Track A into graph-backed page
composition, publication completeness across all channels, or other Track B
concerns.

## Scope and verification method

### Output areas audited

- inline page JSON-LD on `/`, `/cv/`, and `/cv/[variant]`
- full-graph publication through `/api/graph`
- full-graph publication through `Accept: application/ld+json` on page routes
- `manifest.webmanifest`
- existing graph-derived CV metadata on `/cv` and `/cv/[variant]`

### Explicitly out of scope

- visible HTML composition on `/`, `/cv`, or tilt routes
- markdown, PDF, `robots.txt`, and `sitemap.xml`
- home-page and site-wide metadata that still derives from
  `content/frontpage.content.json`
- publication completeness claims across all channels

### Implementation surfaces inspected

- `app/page.tsx`
- `app/cv/page.tsx`
- `app/cv/[variant]/page.tsx`
- `app/api/graph/route.ts`
- `app/manifest.ts`
- `app/layout.tsx`
- `proxy.ts`
- `lib/jsonld.ts`
- `lib/page-jsonld.ts`
- `lib/page-document-contract.ts`
- `lib/search-structured-data.ts`
- `lib/cv-content.ts`
- `lib/entities.ts`
- `content/entities.json`

### Proof surfaces inspected

- `lib/jsonld.integration.test.ts`
- `lib/entities.integration.test.ts`
- `lib/schema-org-check.integration.test.ts`
- `lib/page-document-contract.integration.test.ts`
- `e2e/behaviour/graph-api.e2e-api.test.ts`
- `e2e/behaviour/seo.e2e-api.test.ts`
- `e2e/behaviour/content-integrity.e2e-ui.test.ts`

### Baseline evidence captured on 2026-03-09

- `pnpm test lib/jsonld.integration.test.ts lib/entities.integration.test.ts lib/schema-org-check.integration.test.ts lib/page-document-contract.integration.test.ts`
  passed with 22 tests across 4 files
- `pnpm exec playwright test e2e/behaviour/graph-api.e2e-api.test.ts e2e/behaviour/seo.e2e-api.test.ts e2e/behaviour/content-integrity.e2e-ui.test.ts --project=default`
  passed with 18 tests across 3 specs

No correctness failures were found in the current implementation and baseline
tests. The main A2 outcome is therefore prioritisation: proof gaps and weak
channel expression matter more than new entity enrichment right now.

The negotiated media-type issue identified here is now followed by
[graph-negotiated-media-type-refinement.md](graph-negotiated-media-type-refinement.md),
which records the first delivered Track A Phase A3 slice.

## Output-by-output audit

| Output area                   | Consumers and channel                                                  | Strengths confirmed                                                                                                                             | Existing automated proof                                                                                                          | Main A2 result                                                                             |
| ----------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Inline page JSON-LD           | Search/indexing via inline scripts on `/`, `/cv/`, and `/cv/[variant]` | Page subgraphs derive from `content/entities.json`, honour the shared page-document contract, and keep tilt routes on the canonical CV identity | `lib/schema-org-check.integration.test.ts`, `lib/page-document-contract.integration.test.ts`, `e2e/behaviour/seo.e2e-api.test.ts` | Strong on graph correctness and CV-route emission; missing home-page emitted-channel proof |
| `/api/graph`                  | Programmatic graph consumers via direct full-graph endpoint            | Full graph derives from the validated entity graph, rewrites to deployment URLs, and is intentionally uncached while iterating                  | `lib/jsonld.integration.test.ts`, `lib/entities.integration.test.ts`, `e2e/behaviour/graph-api.e2e-api.test.ts`                   | Strongest current Track A surface; no confirmed correctness problems                       |
| `Accept: application/ld+json` | Programmatic graph consumers discovering graph output from page URLs   | Proxy rewrites page requests to the same full-graph endpoint, so discovery works without a separate endpoint-first assumption                   | `e2e/behaviour/graph-api.e2e-api.test.ts`                                                                                         | Functionally correct, but the media-type expression is weak and proof is narrow            |
| `manifest.webmanifest`        | Browser/install surfaces                                               | Identity text derives from `person`, so name and description stay aligned with the graph                                                        | `app/manifest.integration.test.ts`, `e2e/behaviour/manifest.e2e-api.test.ts`, `pnpm typecheck`                                    | Track A-owned identity fields are now directly proven                                      |
| Graph-derived CV metadata     | Link-preview and metadata consumers on `/cv` and `/cv/[variant]`       | CV title, description, canonical behaviour, and key OG identity fields reuse graph-backed person data and page-document contract rules          | `lib/page-document-contract.integration.test.ts`, `e2e/behaviour/seo.e2e-api.test.ts`                                             | Correctly bounded, but the proof stops short of full head-field alignment                  |

## Correctness problems

None confirmed from the current implementation and baseline tests.

That matters for prioritisation. Track A Phase A3 should begin from proof and
expression improvements, not from emergency data or schema repair.

## Weak expression

### Content-negotiated graph media type

`proxy.ts` rewrites `Accept: application/ld+json` requests to `/api/graph`, but
`app/api/graph/route.ts` uses `NextResponse.json(...)`. The channel therefore
returns a correct JSON-LD payload, but it expresses that payload as
`application/json` rather than an explicit LD+JSON response contract.

This is a weak expression problem rather than a proven correctness failure:
programmatic consumers still get the full graph, but the negotiated channel
signals less clearly than its `Accept` contract suggests.

Stakeholder decision on 2026-03-09: keep one shared graph payload for both
`application/ld+json` and `application/json`, with the response
`Content-Type` matching the explicit request. This removes the decision as an
open question for later Track A work.

That follow-on implementation is now recorded in
[graph-negotiated-media-type-refinement.md](graph-negotiated-media-type-refinement.md).

### Manifest ownership wording

`app/manifest.ts` is graph-derived only for identity text fields:
`name`, `short_name`, and `description` come from `person`. Icons, colours,
display mode, and `start_url` remain app-owned constants.

Track A docs should keep calling this a graph-aligned manifest, not a fully
graph-owned manifest, unless the non-identity fields really move.

### CV metadata boundary wording

The current graph-derived metadata surface is narrower than the shorthand
"graph-derived metadata" can imply. On `/cv` and tilt routes:

- title, description, site name, and image alt reuse `person`
- canonical behaviour uses the page-document contract
- locale still comes from `content/cv.content.json`
- home-page and site-wide metadata still come from `content/frontpage.content.json`

Track A language must stay route-specific and field-specific here.

## Proof gaps

### Home-page inline JSON-LD emission

This emitted-channel proof gap is now closed.

The app now has:

- route-level proof in `e2e/behaviour/seo.e2e-api.test.ts` that `/` emits the
  inline JSON-LD script and exposes the expected canonical home `ProfilePage`
- contract-level proof in `lib/page-document-contract.integration.test.ts`
  that the home-page `ProfilePage` identity still matches the page-document
  contract

### Manifest route proof

This proof gap is now closed.

The app now has:

- module-level proof in `app/manifest.integration.test.ts` that the Track
  A-owned manifest identity fields derive from `person`
- route-level proof in `e2e/behaviour/manifest.e2e-api.test.ts` that
  `/manifest.webmanifest` returns `application/manifest+json` and emits those
  same identity fields

### Content-negotiation proof follow-on

The specific negotiated-channel proof gap identified in this A2 audit is now
closed by
[graph-negotiated-media-type-refinement.md](graph-negotiated-media-type-refinement.md).
The app now has automated proof for:

- `/` negotiated as `application/ld+json`
- `/cv` negotiated as `application/json`
- `/cv/public_sector` negotiated with both graph media types present
- direct `/api/graph` requests for `application/ld+json`

### CV metadata field alignment

This proof gap is now closed by
[graph-cv-metadata-description-proof.md](graph-cv-metadata-description-proof.md).

The app now has:

- module-level proof in `lib/page-document-contract.integration.test.ts` that
  the base CV metadata export and active tilt metadata generation keep
  `description` and `openGraph.description` aligned with `person.description`
- route-level proof in `e2e/behaviour/seo.e2e-api.test.ts` that `/cv` and the
  active `/cv/[variant]` route emit those same description fields in the
  rendered `<head>`

## Deliberate low-priority channels

### Tilt routes as separate rich-result targets

This is intentionally deprioritised. The page-document contract explicitly
marks tilt routes as canonical aliases, not as separate rich-result-facing page
identities. The current tests already prove that boundary and Track A should
preserve it.

### Page-specific content-negotiated subgraphs

Also intentionally deprioritised. The current architecture deliberately exposes
the full person graph from any page URL when `Accept: application/ld+json` is
used. Page-specific negotiated subgraphs would be a different publication model
and do not need to be invented during Track A unless a real consumer case
appears.

### Manifest presentation fields

Graph-owning colours, icons, or display mode is low priority. The consumer
value in the current manifest channel is identity alignment, not maximal graph
coverage of install-surface decoration.

### Caching refinement for `/api/graph`

The route currently sends `Cache-Control: no-store`, and the TODO in
`app/api/graph/route.ts` makes that temporary posture explicit. Reintroducing a
cache strategy is lower priority than closing the current proof gaps.

## Track boundary after Phase A2

Track A now has a truthful working position:

- the current graph publication layer is functionally sound
- its strongest proof is around the full-graph endpoint and the canonical CV
  subgraph
- the home-page emitted-channel proof gap is now closed
- the manifest proof gap is now closed
- the CV metadata field-alignment proof gap is now closed
- visible HTML still comes from `content/cv.content.json` and
  `content/frontpage.content.json`
- Track B still owns graph-backed source of truth, graph-backed page
  composition, and future publication-completeness claims

## Recommended next steps

### Track A Phase A4

Phase A3 proof-led refinement is now complete. The external-proof follow-on is
now partially recorded in
[graph-rich-result-external-validator-evidence.md](graph-rich-result-external-validator-evidence.md):

- Schema.org Validator code-mode evidence is recorded for `/`
- Schema.org Validator and Google Rich Results Test limitations are recorded
  truthfully instead of being left implicit
- Track A remains in Phase A4 until the remaining `/cv/` Schema.org result and
  stable Google Rich Results Test verdicts can be captured or consciously
  accepted as external-tool limits

That note is now the discoverable record for both successful results and
validator-side limitations.
