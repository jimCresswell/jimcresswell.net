# Graph Publication Consumer and Proof Model

## Status

Recorded on 2026-03-09 as the Track A Phase A1 deliverable for
[personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md).

Use this note with:

- [personal-knowledge-graph-roadmap.plan.md](../current/personal-knowledge-graph-roadmap.plan.md)
- [graph-current-state-audit.md](graph-current-state-audit.md)
- [graph-publication-output-audit.md](graph-publication-output-audit.md)
- [graph-negotiated-media-type-refinement.md](graph-negotiated-media-type-refinement.md)
- [personal-knowledge-graph-source-of-truth-design.plan.md](../current/personal-knowledge-graph-source-of-truth-design.plan.md)
- [pkg-research-findings.md](pkg-research-findings.md)

This note is implementation-backed. It defines the current Track A publication
surface from code and tests that exist today, not from target-state design
intent.

## Why this exists

Track A Phase A1 needed a grounded answer to five questions:

1. Which graph publication outputs actually exist today?
2. Which consumers and channels do those outputs serve?
3. What impact should each output area create?
4. Through what mechanism does that impact create value?
5. What proof counts, and what is explicitly not part of Track A?

## Implementation-verified baseline

### Visible rendering is not Track A scope

The rendered website still follows the page-content path:

- `app/page.tsx` renders home-page prose from `content/frontpage.content.json`
- `app/cv/page.tsx` renders CV prose from `cvContent`
- `app/cv/[variant]/page.tsx` renders tilt-specific positioning while still
  passing `cvContent` into `CVLayout`
- `e2e/behaviour/content-integrity.e2e-ui.test.ts` proves the CV and tilt HTML
  against `content/cv.content.json`

Track A therefore does not own visible HTML composition. It owns the graph
publication layer that sits alongside that rendering path.

### Graph publication is the current Track A surface

The code path for graph publication today is:

- `content/entities.json` defines the entity graph
- `lib/entities.ts` validates that graph and exports `entityGraph`, `entities`,
  and `person`
- `lib/page-jsonld.ts` derives the home-page and CV page subgraphs
- `app/page.tsx`, `app/cv/page.tsx`, and `app/cv/[variant]/page.tsx` publish
  those subgraphs inline as JSON-LD
- `lib/jsonld.ts` derives the full deployment-specific graph
- `app/api/graph/route.ts` serves that full graph directly
- `proxy.ts` rewrites `Accept: application/ld+json` on page routes to
  `/api/graph`
- `app/manifest.ts` derives manifest identity fields from `person`
- `lib/cv-content.ts` derives the existing graph-backed CV metadata fields from
  `person`
- `lib/page-document-contract.ts` and `lib/search-structured-data.ts` define
  the canonical page identity and rich-result-facing structured-data contract

## Track A outputs in scope right now

### In scope

- Inline page JSON-LD on `/`, `/cv/`, and `/cv/[variant]`
- Full-graph publication through `/api/graph`
- Full-graph publication through `Accept: application/ld+json` on page routes
- `manifest.webmanifest`
- Existing graph-derived metadata on `/cv` and `/cv/[variant]`

### Explicitly not in scope

- Visible HTML composition on `/`, `/cv`, or tilt routes
- Markdown content negotiation and `.md` routes
- PDF generation and serving
- `robots.txt` and `sitemap.xml`
- Home-page and site-wide metadata that still derives from
  `content/frontpage.content.json`
- New downstream channels that are not already wired to the graph

These exclusions matter because several outputs are machine-readable but not
graph-derived today. Track A should not claim them.

## Consumer and channel matrix

| Consumer                            | Channel                                      | Output area                               | Intended impact                                                                                 | Value mechanism                                                                                                                                                |
| ----------------------------------- | -------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search and indexing engines         | Inline JSON-LD on `/`                        | Home-page subgraph                        | Strengthen root-page entity understanding and canonical page identity                           | A self-contained `ProfilePage` / `WebSite` / `Person` graph gives crawlers stable IDs and page-scoped meaning                                                  |
| Search and indexing engines         | Inline JSON-LD on `/cv/` and `/cv/[variant]` | CV subgraph and canonical-alias behaviour | Strengthen career, credential, and identity signals without fragmenting the CV page identity    | The canonical CV graph carries the richer career graph, while tilt routes reuse the canonical `ProfilePage` so one CV identity is reinforced rather than split |
| Programmatic graph consumers        | `/api/graph`                                 | Full graph endpoint                       | Make the full graph directly consumable without HTML scraping                                   | One deployment-specific JSON-LD document exposes the entire validated graph                                                                                    |
| Programmatic graph consumers        | `Accept: application/ld+json` on page routes | Content-negotiated full graph             | Make graph discovery possible from page URLs without teaching clients a separate endpoint first | Content negotiation exposes the same full graph behind the visited page URL                                                                                    |
| Browser and install surfaces        | `/manifest.webmanifest`                      | Manifest                                  | Keep install and discovery metadata aligned with the central person identity                    | Manifest fields reuse `person.name` and `person.description` instead of drifting copies                                                                        |
| Link-preview and metadata consumers | Next metadata on `/cv` and `/cv/[variant]`   | Graph-derived CV metadata                 | Keep CV descriptors aligned with the person entity and canonical contract                       | `lib/cv-content.ts` and the page-document contract reuse graph-backed identity fields rather than per-route copy                                               |
| Internal maintainers and reviewers  | Tests, validators, and review passes         | Proof layer                               | Make Track A success falsifiable and maintainable                                               | Every output area maps to explicit automated proof, manual validation, and reviewer ownership                                                                  |

## Success and proof model

### Output area: page subgraphs

#### Success statement

- `/` and `/cv/` publish self-contained `@graph` payloads with the correct
  canonical `ProfilePage`, `WebSite`, and `Person` identity
- tilt routes reuse the canonical CV page entity and do not create a second
  `ProfilePage` identity

#### Validation surfaces

- `lib/search-structured-data.ts`
- `lib/page-document-contract.integration.test.ts`
- `lib/schema-org-check.integration.test.ts`
- `lib/entities.integration.test.ts`
- `e2e/behaviour/seo.e2e-api.test.ts`

#### External validators

- Schema.org Validator for `/` and `/cv/` when structured-data shape changes
- Google Rich Results Test for `/` and `/cv/` when rich-result-facing markup
  changes

#### Reviewers

- `code-reviewer`
- `pkg-reviewer`
- `test-reviewer`
- `type-reviewer` when schema or validation flow changes

#### Current proof status

- The home-page emitted-channel gap is now closed:
  `lib/page-document-contract.integration.test.ts` proves the home
  `ProfilePage` contract directly, and
  `e2e/behaviour/seo.e2e-api.test.ts` proves that `/` emits the inline
  JSON-LD script with the expected canonical page identity

### Output area: full-graph publication

#### Success statement

- `/api/graph` and `Accept: application/ld+json` both return the
  deployment-specific full graph with the Schema.org context, a non-empty
  `@graph`, and the current no-store iteration behaviour

#### Validation surfaces

- `lib/jsonld.integration.test.ts`
- `e2e/behaviour/graph-api.e2e-api.test.ts`

#### External validators

- Schema.org Validator or raw JSON-LD inspection when vocabulary or graph
  topology changes materially

#### Reviewers

- `code-reviewer`
- `pkg-reviewer`
- `test-reviewer`
- `type-reviewer` when URL rewriting or schema flow changes

### Output area: manifest

#### Success statement

- manifest `name`, `short_name`, and `description` stay aligned with `person`
  and remain valid browser-install metadata

#### Validation surfaces

- `app/manifest.integration.test.ts`
- `e2e/behaviour/manifest.e2e-api.test.ts`
- `pnpm typecheck`

#### Manual checks

- Request `/manifest.webmanifest` directly after changes
- Inspect manifest fields in the browser application panel when needed

#### Reviewers

- `code-reviewer`
- `type-reviewer` when manifest typing or entity shape changes

#### Current proof status

- The manifest emitted-channel gap is now closed:
  `app/manifest.integration.test.ts` proves the Track A-owned identity fields
  directly from `person`, and
  `e2e/behaviour/manifest.e2e-api.test.ts` proves that
  `/manifest.webmanifest` emits those same fields with the live
  `application/manifest+json` response contract

### Output area: graph-derived CV metadata

#### Success statement

- `/cv` and `/cv/[variant]` titles, descriptions, Open Graph URL fields, and
  canonical behaviour stay aligned with `person` and the page-document
  contract

#### Validation surfaces

- `lib/page-document-contract.integration.test.ts`
- `e2e/behaviour/seo.e2e-api.test.ts`

#### Manual checks

- Inspect the rendered `<head>` when metadata wiring changes materially
- Use link-preview tooling only when a metadata change is intended to affect
  unfurl behaviour

#### Reviewers

- `code-reviewer`
- `pkg-reviewer` when graph fields change
- `editor` when wording changes

#### Current scope boundary

- Home-page and site-wide metadata are not graph-derived, so they must not be
  counted as Track A metadata success

### Cross-cutting rule for future Track A work

Every Phase A2 and A3 refinement proposal must name:

- the consumer
- the channel
- the intended impact
- the value mechanism
- the automated proof
- the external validator, if one is relevant
- the reviewer set that should be used

If a proposed change cannot fill those fields truthfully, it does not yet
qualify as Track A work.

## Explicit non-goals

- Do not move visible rendering away from `content/cv.content.json` and
  `content/frontpage.content.json`
- Do not design the graph-backed source-of-truth architecture here; that is
  Track B
- Do not treat markdown, PDF, sitemap, robots, or home-page/site metadata as
  graph-publication channels just because they are machine-readable
- Do not add new downstream channels such as LinkedIn derivation, Neo4j export,
  or citation meta tags as part of Phase A1
- Do not claim publication completeness across HTML and graph channels; that is
  future Track B completeness work
- Do not create compatibility layers, stub-preservation docs, or duplicate
  ownership to make the current architecture sound tidier than it is
- Do not let tilt routes drift into separate page identities

## Follow-on record

Phase A2 is now recorded in
[graph-publication-output-audit.md](graph-publication-output-audit.md).

That audit confirmed:

- no correctness failures in the current Track A surfaces
- the home-page inline JSON-LD emitted-channel gap is now closed
- the manifest proof gap is now closed
- the remaining proof gap is CV metadata field alignment
- the clearest weak-expression issue was the negotiated
  `Accept: application/ld+json` channel still resolving to an
  `application/json` response contract

That negotiated-channel issue is now closed by
[graph-negotiated-media-type-refinement.md](graph-negotiated-media-type-refinement.md):
the same JSON-LD payload is served for both `application/ld+json` and
`application/json`, with the response `Content-Type` matching the request.

Track A Phase A3 should now refine the remaining proof gaps rather than
redefining the consumer model again.
