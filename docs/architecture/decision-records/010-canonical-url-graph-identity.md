# ADR-010: Canonical URL and graph identity

## Status

Accepted

## Date

2026-02-15

## Context

The JSON-LD knowledge graph models Jim Cresswell as a Schema.org entity. That entity needs a canonical identifier — its `@id` — and the graph document itself needs a canonical location. These choices affect how search engines, AI systems, and Linked Data tooling discover and reference the structured data.

### The current state

The Person entity's `@id` is `https://www.jimcresswell.net/#person`. The `#person` fragment means the _document_ URL is `https://www.jimcresswell.net/` — resolving the fragment takes you to the root of the site. The graph document is served at two locations:

1. **`/api/graph`** — an explicit API endpoint that returns the full JSON-LD graph as `application/json`.
2. **Any page URL with `Accept: application/ld+json`** — content negotiation via the proxy (ADR-009) rewrites to `/api/graph`.

### The tension: full graph vs subgraph

Each page in the browser renders content relating to a _subgraph_ of the full entity model:

| URL       | Renders                                                              |
| --------- | -------------------------------------------------------------------- |
| `/`       | The front page — personal narrative, links, minimal identity context |
| `/cv`     | The CV — positioning, experience, capabilities, education            |
| `/cv/...` | Variant CVs — alternative positioning, same body                     |

But requesting any of these URLs with `Accept: application/ld+json` returns the _full_ graph — every entity, every relationship, regardless of which page was requested.

This is an intentional design choice, not a limitation. The rationale:

1. **The graph models the person, not the page.** The Person entity exists once. Its relationships to Organisations, Capabilities, Publications, and Credentials exist once. A page is a _view_ that selects and presents a subset of this reality. The graph is the reality.

2. **Linked Data convention.** In Linked Data, resolving a resource's `@id` should return the document that describes that resource. `https://www.jimcresswell.net/#person` resolves to `https://www.jimcresswell.net/`, and that document should contain the graph that describes `#person`. Returning a partial graph would be technically valid but semantically incomplete — a consumer would have to discover and merge graphs from multiple page URLs to reconstruct the full entity.

3. **Simplicity for consumers.** An AI system, knowledge graph aggregator, or LLM that requests `application/ld+json` on any page URL gets everything in one response. No crawling, no merging, no guessing which pages have which parts of the graph.

4. **Future evolution.** As the knowledge graph grows (Phase 2: full role history, projects, publications, volunteer work), page-specific subgraphs become a real option — the CV page's JSON-LD `<script>` tag could embed just the subgraph rooted at the CVPage entity, while content negotiation still returns the full graph. This ADR does not prevent that evolution; it documents the current position.

### Options evaluated

1. **Per-page subgraphs via content negotiation.** `Accept: application/ld+json` on `/cv` returns only the CV-relevant subgraph. On `/` returns only the front-page subgraph. Semantically precise but complex to implement (requires a subgraph-closure algorithm), and forces consumers to crawl multiple URLs.

2. **Full graph from any page URL.** Content negotiation always returns the complete graph. Simple, complete, follows the "the graph models the person" principle. The `<script type="application/ld+json">` in each page's HTML can still embed a page-relevant subgraph for search engines that prefer inline structured data.

3. **Full graph only from the root URL or `/api/graph`.** Restrict content negotiation to `https://www.jimcresswell.net/` only; other pages return `406 Not Acceptable` for `application/ld+json`. Technically correct but unnecessarily restrictive. A consumer shouldn't need to know that the graph lives at the root.

## Decision

**Option 2 — full graph from any page URL.**

- `Accept: application/ld+json` on any page URL returns the complete Schema.org knowledge graph.
- The explicit endpoint `/api/graph` returns the same graph as `application/json` (for tools that don't do content negotiation, and for direct browser access).
- The `<script type="application/ld+json">` embedded in each page's HTML may, in future, contain a page-relevant subgraph. This does not conflict with the content negotiation response — they serve different consumers (inline script for search engine crawlers, content negotiation for Linked Data clients and AI systems).

### `www.jimcresswell.net/` as the canonical document URL

The root URL `https://www.jimcresswell.net/` is the canonical document that describes the `#person` entity. This is the URL that should appear in `sameAs`, external references, and Linked Data link headers. The `/api/graph` endpoint is an implementation convenience, not the canonical location.

### Cache-Control

During active development of the knowledge graph, the graph endpoint returns `Cache-Control: no-store`. This will be changed to a production-appropriate caching policy once the graph stabilises (tracked with a TODO in the route handler).

## Consequences

**Benefits:**

- Any consumer that knows the site URL can get the full structured data in one request. No need to crawl the site or guess which page holds which entities.
- The canonical URL is clean and memorable: `https://www.jimcresswell.net/`.
- The architecture naturally supports the future "subgraph per page" evolution without breaking backward compatibility — content negotiation continues to return the full graph, while inline `<script>` tags can specialise.
- Consistent with Linked Data best practices: resolve the `@id`, get the graph.

**Trade-offs:**

- The full graph is returned even when the consumer only wanted entities related to a specific page. For a modest personal knowledge graph (dozens to low hundreds of entities), the payload is small. This becomes a consideration only if the graph grows to thousands of entities — at which point the subgraph-closure approach (Option 1) becomes worth implementing.
- Consumers cannot currently distinguish "which entities appear on this page" from content negotiation alone. They would need to parse the HTML or compare the inline JSON-LD with the full graph. This is a minor concern for the current scale.

## Related

- [ADR-008: Schema.org compliance](008-schema-org-compliance.md) — the graph this ADR serves is Schema.org-compliant
- [ADR-009: Content negotiation proxy](009-content-negotiation-proxy.md) — the routing mechanism
- [ADR-007: DRY content and metadata consolidation](007-dry-content-metadata.md) — the single-source principle this extends
- [personal-knowledge-graph.plan.md](../../../.agent/plans/personal-knowledge-graph.plan.md) — the plan that drives this architecture
- `app/api/graph/route.ts` — the graph endpoint
- `proxy.ts` — the content negotiation proxy
