# Graph Current-State Audit

Deep-dive record of what the repo’s graph work currently is, what it is not,
what is proven, what was exploratory, and what must happen next.

## Status

Recorded on 2026-03-09 as the grounding document for the graph reset.

Use
[personal-knowledge-graph-roadmap.plan.md](../current/personal-knowledge-graph-roadmap.plan.md)
for the current parent planning structure. The metaplan is now a completed
historical reset record, and the adopted Track A and Track B plans are the live
successors that inherit this audit as their factual baseline.

The output-level follow-on for Track A is now recorded in
[graph-publication-output-audit.md](graph-publication-output-audit.md).

## Executive summary

The repo has a valid and useful personal knowledge graph foundation, but it does
**not** yet have fully graph-derived page composition.

What is true today:

- `content/entities.json` contains a validated entity graph
- JSON-LD outputs derive from that graph
- the manifest, some metadata, and ADR-020's bounded shared identity atoms
  derive from the Person entity
- visible editorial prose and page selection/order still render from
  `content/cv.content.json` and `content/frontpage.content.json`
- the relationship between page content and graph entities is mostly manual,
  semantic, or coincidental rather than modelled in a composition layer

The main planning correction is therefore:

- keep the graph-expression work
- stop describing the site as already graph-composed
- plan graph-as-source-of-truth work as a separate track

## What has been implemented

### Entity foundation

- `content/entities.json` exists as a valid JSON-LD `@graph`
- `lib/entities.ts` validates the graph at import time with Zod
- the entity model includes concrete, abstract, and expressive entities
- the graph is published through full-graph and page-subgraph outputs

### Graph publication

- `lib/jsonld.ts` publishes the full graph
- `lib/page-jsonld.ts` publishes page-level subgraphs
- `/` and canonical `/cv` inject JSON-LD from the entity model
- the web app manifest derives from the graph’s Person entity

### Proof and validation infrastructure

- the visual-regression harness exists, has a closed PKG proof record for the
  earlier migration work, and is now a live blocking-proof requirement during
  implementation for rendering-risk changes on its captured site surfaces
- graph integrity and structured-data checks exist in tests
- page/document contract logic exists for canonical identity and section IDs

## What is proven

- the PKG migration did not introduce unexpected pixel-level drift in the
  recorded historical comparison
- current rendered content matches the current page JSON sources
- the structured-data layer is internally validated and referentially checked
- page identity and some document-level constraints are encoded in product code

## What was exploratory and useful but missed the real target

The initial PKG framing treated the work as if the graph had already become the
source of truth for the site. That was useful in one narrow sense: it pushed the
repo toward a serious entity model, page-level JSON-LD, and stronger identity
rules.

But it missed the larger target:

- page rendering did not migrate to graph-backed composition
- content files did not become views that reference entities by ID
- entity-level and role-level HTML binding did not become real rendered-site
  behaviour
- “view derivation” was achieved for structured-data outputs, not for visible
  page composition

So the exploratory work was productive, but it solved a smaller problem than the
plans claimed.

## What the architecture actually is today

### Visible page rendering

- home and CV editorial prose render from their page-composition JSON
- the Person-owned name, email, description, and identity-profile URLs are
  injected through application/server composition boundaries under ADR-020
- ADR-021 retires audience-tilt routes; full selection and ordering still use
  page-file structure rather than graph-owned composition

### Graph-owned outputs

- JSON-LD is graph-derived
- the manifest is graph-derived
- some OG and metadata fields derive from graph entities

### Binding layer

- section-level IDs are product-owned and verified
- page/document contracts exist for route identity and canonical rules
- there is no fully adopted entity-to-DOM binding layer in the rendered site

### Ownership model

- authored page prose lives in content JSON files
- graph entities live in `content/entities.json`
- the repo currently has split ownership, not graph-owned authored content

## Current architecture classification

| Concern               | Current owner                                               | Notes                                         |
| --------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| Visible page prose    | `content/cv.content.json`, `content/frontpage.content.json` | Primary source for editorial HTML             |
| Shared identity atoms | `content/entities.json`                                     | Bounded visible derivation under ADR-020      |
| Graph entities        | `content/entities.json`                                     | Canonical machine-readable entity model       |
| JSON-LD               | Graph-derived                                               | Strong integration                            |
| Manifest              | Graph-derived                                               | Strong integration                            |
| OG and some metadata  | Mixed                                                       | Some graph-derived, some page-content-derived |
| Page composition      | Page content JSON plus injected Person atoms                | Not fully graph-derived                       |
| Section binding       | Product contract                                            | Exists                                        |
| Entity/role binding   | Not truly adopted                                           | Still target state                            |

## What the adopted plan stack now requires

The outcome/impact/value assessment has now been completed, and the live graph
stack has been adopted. This audit remains the baseline for both tracks.

### Track A

Treat the current graph as a real publication layer and improve it
deliberately:

- define the impact sought from graph-expression outputs
- tie output work to real consumer value
- validate correctness and usefulness explicitly

### Track B

Design and then adopt the architecture that would make the website a true view
onto the graph:

- define the layered graph model
- define graph-owned authored content and page-composition strategy
- cross-link early to surface structural problems
- migrate deliberately rather than leaving dual ownership in place
- prove publication completeness across all channels

## Doc-truth alignment

### Accurate as-is

- `docs/architecture/content-model.md` accurately describes current rendering as
  content-JSON-driven
- `content/entities.json` plus `lib/entities.ts` are accurately described as the
  graph source and validation layer
- the completed visual-regression harness record is accurate about proof status
- the current rules and architecture docs are accurate that the harness is now
  blocking proof for rendering-risk changes on the captured site surfaces

### Historical or target-state records that are still valuable

- `docs/architecture/decision-records/014-entity-model-design.md` records the
  intended layered architecture and remains a valid target-state design record
- `.agent/plans/research/personal-knowledge-graph-design-notes.md` remains
  useful as historical design exploration
- `.agent/plans/archive/personal-knowledge-graph-phase-model.plan.md` remains
  useful as an archive of the previous phase model

### Docs that needed reframing during the reset

- `.agent/plans/current/personal-knowledge-graph-roadmap.plan.md`
- `.agent/plans/current/personal-knowledge-graph-execution.plan.md`
- `.agent/plans/active/personal-knowledge-graph-source-of-truth-design.plan.md`
- `.agent/plans/roadmap.md`
- `.agent/plans/current/cv-editorial-improvements.plan.md`
- `.agent/plans/current/linkedin-update.plan.md`

These live planning docs needed to stop implying that the site was already
graph-derived and to adopt the new two-track structure with Track A first.

## Lessons from this session

- a valid graph and valid JSON-LD do not automatically make the website
  graph-derived
- current-state truth and target-state intent must be named separately in live
  planning docs
- if page composition does not reference graph entities explicitly, the repo
  still has split content ownership even if the graph is rich
- section-level binding is not enough to claim full graph-to-DOM adoption

## Related documents

- [graph-metaplan.plan.md](../archive/graph-metaplan.plan.md)
- [personal-knowledge-graph-roadmap.plan.md](../current/personal-knowledge-graph-roadmap.plan.md) — adopted roadmap authority
- [graph-publication-consumer-and-proof-model.md](graph-publication-consumer-and-proof-model.md) — Track A Phase A1 consumer, channel, and proof authority
- [graph-publication-output-audit.md](graph-publication-output-audit.md) — Track A Phase A2 output, proof-gap, and prioritisation audit
- [personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md) — adopted Track A execution authority
- [personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md) — adopted Track B design authority
- [personal-knowledge-graph-design-notes.md](personal-knowledge-graph-design-notes.md)
- [ADR-014](../../../docs/architecture/decision-records/014-entity-model-design.md)
