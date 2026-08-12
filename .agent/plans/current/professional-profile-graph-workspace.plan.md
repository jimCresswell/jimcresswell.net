---
name: Professional Profile Graph Workspace
overview: Accepted product child. Prove a stable value/factory API, separate Jim's configured graph, and extract only reusable schemas, parsing, and pure graph algorithms without freezing Track B composition.
todos:
  - id: graph-stable-core-disposition
    content: Classify every candidate as stable core, configured app/Jim ownership, or deferred Track B composition.
    status: pending
  - id: graph-synthetic-red-proof
    content: Write failing package-contract tests with a complete non-Jim professional-profile fixture.
    status: pending
  - id: graph-final-api-in-place
    content: Introduce final data-in/value-out APIs in place and switch current configured consumers without duplicating the graph.
    status: pending
  - id: graph-package-extraction
    content: Move the proven stable core to packages/professional-profile-graph.
    status: pending
  - id: graph-integration-closure
    content: Prove current outputs, enforce inward imports, document ownership, and remove old implementations.
    status: pending
isProject: true
---

# Professional Profile Graph Workspace

## Status

**Accepted child of the
[Workspace Architecture Roadmap](workspace-architecture-roadmap.plan.md); not
active pending its entry conditions and explicit promotion.**

This plan no longer waits for all of Track B. It extracts only responsibilities
whose semantics are already stable. Track B remains authoritative for
selection, composition, binding, adoption, and publication completeness; those
concepts stay outside this package until their own design is complete.

ADR-020 and the merged application tree provide bounded evidence, not a package
verdict: the graph parser enforces exactly one Person, `sameAs` values are
URL-validated, and profile selection uses exact-hostname resolution. The
configured Jim graph and singleton remain root-owned, while Person name, email,
description, and profile URLs now feed selected application boundaries.
Editorial prose and full page composition remain page-owned.

## Outcome, impact, value mechanism, and proof

**Outcome:** `packages/professional-profile-graph` owns reusable validated
schemas, parsing, graph types, exact-one selection, lookup, subgraph, URL rewriting, and bounded
generic validation through data-in/value-out APIs. Jim's public data, configured
singleton, site URL, routes, and composition remain with configured owners.

**Impact:** stable graph machinery can change and test independently of one
person's profile or Next.js without pre-deciding Track B's visible-page model.

**Value mechanism:** a final value/factory interface separates declaration and
algorithm from configured instance first; moving that already-proven seam into
a package then adds dependency and lifecycle enforcement without semantic
cutover pressure.

**Proof:** synthetic fixtures exercise the package independently; Jim's current
full graph, page subgraphs, JSON-LD, metadata, manifest, negotiated graph API,
and Schema.org checks remain green through configured app integration.

## Entry conditions

- parent adopted and this child promoted
- Visual Regression and Practice Validation children are complete, rejected,
  or closed with explicit gate dispositions
- ADR-008, ADR-010, ADR-014, current graph consumer/proof notes, and the live
  Track B boundary have been re-read
- candidate APIs can be classified without importing or inventing composition,
  binding, or publication-completeness semantics
- current graph and application proof is green
- live collaboration and custody for graph source, manifests, the lockfile, and
  dependency-rule files is re-checked at activation

## Candidate ownership

### Package should own

- Zod schemas and derived types for the bounded professional-profile domain
- graph-document parsing and integrity validation
- entity lookup over supplied graph values
- subgraph extraction and dangling-reference checks
- URL rewriting over supplied graphs and a supplied base URL
- media-type negotiation only where independent of Next.js
- generic Schema.org/profile validation over supplied inputs

### Package must not own

- `content/entities.json` or any Jim-specific fact
- configured `entityGraph`, singleton `person`, or implicit global selection
- `SITE_URL`, canonical Jim IDs, route paths, section order, or metadata copy
- Track B composition, binding, view selection, or completeness rules
- Next request/response objects, routes, manifests, pages, or deployment code
- CV rendering, Jim prose/brand/output policy, or private editorial material

## API design constraint

Prefer values and factories:

```ts
const graph = parseProfessionalProfileGraph(input);
const person = resolveSinglePerson(graph);
const pageGraph = extractSubgraph(graph, rootIds);
const published = rewriteGraphUrls(graph, siteBaseUrl);
```

Exact names remain test-led. The invariant is that every package function
accepts validated data/configuration and never imports a configured instance.
Runtime schemas remain the single source for derived types and guards.

## Boundaries

### In scope

- stable reusable portions of `lib/entities.ts`, `lib/subgraph.ts`,
  `lib/rewrite-jsonld-urls.ts`, and `lib/graph-media-type.ts`
- reusable builder/validation portions of `lib/jsonld.ts`,
  `lib/page-jsonld.ts`, `lib/schema-org-check.ts`, and
  `lib/search-structured-data.ts` only when they pass the no-route/no-Jim gate
- synthetic fixtures, package-local tests, configured app adapters, exports,
  manifest, README, and dependency rules

### Out of scope

- Track B composition/binding/adoption/completeness APIs
- moving public Jim data or visible composition
- expanding the taxonomy to support arbitrary Schema.org graphs
- Neo4j, RDF persistence, databases, or network access
- changing structured-data output to ease extraction
- app routes, metadata integration, or CV rendering

## Tasks

### Task 1 — Draw the stable-core boundary

**Outcome:** every candidate function/type is classified as package-stable,
configured app/Jim ownership, or deferred Track B responsibility.

**Impact:** extraction cannot freeze an unsettled visible-page model or pull Jim
configuration into a nominally generic package.

**Value mechanism:** an explicit disposition ledger narrows the package to
already-demonstrated consumers and one reason to change.

**Acceptance criteria and proof:** current import/consumer graph is recorded;
singleton/configured imports have final replacement owners; no candidate needs
route, Jim, CV, composition, or binding values; the package gate has a
provisional PASS or the plan closes Internal Module before source movement.

### Task 2 — Specify the value API with synthetic red proof

**Outcome:** a non-Jim professional profile defines parser, lookup, subgraph,
rewriting, and validation behaviour through supplied values.

**Impact:** hidden current-instance assumptions fail before becoming exports.

**Value mechanism:** a second configured graph shapes a domain contract rather
than merely renaming Jim constants.

**Acceptance criteria and proof:** fixtures contain no Jim names, URLs, route
keys, or public copy; success/rejection, discriminated schemas, lookup,
subgraph, dangling refs, and rewriting are covered where stable; tests fail
because the final API is absent, never because type assertions test types.

### Task 3 — Introduce the final interface in place

**Outcome:** reusable logic takes supplied data/configuration while one current
configured owner parses Jim's graph and supplies current consumers.

**Impact:** app integration can pause green before any filesystem/package move.

**Value mechanism:** dependency inversion removes the semantic coupling first;
the same interface remains after extraction, so no temporary shim exists.

**Acceptance criteria and proof:** Jim's graph is parsed once; person/site
configuration is explicit; current builders and validators receive values;
every bounded consumer switches atomically; no duplicate graph or old singleton
path remains after its consumer switch; current graph integration is green.

### Task 4 — Move the proven core to the package

**Outcome:** the already-used stable implementation has a private manifest,
explicit exports, dependencies, TypeScript/test configuration, and README.

**Impact:** graph changes receive independent custody and proof without a new
semantic migration.

**Value mechanism:** the package enforces the seam already demonstrated in the
application and synthetic fixture.

**Acceptance criteria and proof:** package-local type/lint/test/Knip checks
pass; source imports no content/app/CV/site config; app declares `workspace:*`;
current configured adapter uses public exports; old root implementations are
removed in the same slice. If this is the first passing extraction,
`pnpm-workspace.yaml` is created with explicit public patterns and root plus
package discovery is proved in the same slice.

### Task 5 — Prove outputs and close ownership

**Outcome:** package and configured owners are the only graph implementations,
with static inward dependencies and documented consumers.

**Impact:** later Jim-profile adoption starts from a stable graph dependency
rather than parallel systems.

**Value mechanism:** app proof plus deletion and enforcement preserve both
generic and configured responsibilities.

**Acceptance criteria and proof:** package/root gates, graph API, negotiated
media, JSON-LD, metadata, manifest, SEO and Schema.org validation pass;
dependency rules prevent reach-back; no visible-rendering claim is made unless
Track B adoption has actually changed rendering.

## Extraction-gate decision

Expected PASS from multiple consumers, synthetic proof, inward Zod/Schema.org
dependencies, and substantial stable responsibility.

**Losing condition:** retain an enforced
`domains/professional-profile-graph` module if the useful API needs current
route, section, Jim composition, or package configuration larger than the
stable implementation.

## Test and proof strategy

- synthetic unit/integration tests for schemas and pure algorithms
- configured app integration for Jim graph parsing and emitted channels
- API E2E for media negotiation and graph response
- metadata/manifest/Schema.org proof at app level
- visual proof only if rendered output or anchors actually change

## Documentation obligations

- package README with domain, API, consumers, non-goals, dependencies, and tests
- content-model docs distinguishing configured graph from reusable machinery
- ADR-014 reconciliation if the accepted package boundary changes its target
- graph publication/validation docs for final import/configuration paths
- parent/roadmap and CV-child handoff

## Completion handoff

Record final exports, configured-instance owner, PASS/FAIL disposition, app
publication proof, deferred Track B concepts, any disproved assumption, and
recommendation to promote [CV Workspace](cv-workspace.plan.md).
