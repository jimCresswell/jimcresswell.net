# Graph Source-of-Truth Layer Map

## Status

Recorded on 2026-03-09 as the Track B Phase B1 deliverable for
[personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md).

This note completes:

- Task B1.1 — Source-of-Truth Layer Map
- Task B1.2 — Worked Ownership Examples

## Use this note with

- [personal-knowledge-graph-roadmap.plan.md](../current/personal-knowledge-graph-roadmap.plan.md)
- [personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md)
- [graph-current-state-audit.md](graph-current-state-audit.md)
- [graph-publication-output-audit.md](graph-publication-output-audit.md)
- [content-model.md](../../../docs/architecture/content-model.md)
- [ADR-014](../../../docs/architecture/decision-records/014-entity-model-design.md)
- [ADR-020](../../../docs/architecture/decision-records/020-entity-model-source-of-truth-for-shared-atoms.md)
- [ADR-021](../../../docs/architecture/decision-records/021-canonical-only-cv-identity.md)

## Boundary from Track A

Track A is complete for the current publication surface. This note does not
re-open Track A proof, refinement, or external validation.

Current implementation truth remains unchanged in this slice:

- `content/entities.json` is the live entity source for JSON-LD, the manifest,
  some metadata, and ADR-020's bounded Person identity atoms
- `content/frontpage.content.json` remains the live source for visible `/`
  editorial prose
- `content/cv.content.json` remains the live source for visible `/cv`
  editorial prose; ADR-021 retires `/cv/[variant]`

Track B remains design-only here:

- no source-of-truth implementation code ships from this note
- no compatibility layers or stub-preservation docs are introduced
- no claim is made that full visible composition is graph-derived; ADR-020 is
  the accepted bounded identity-atom seam

The purpose of this slice is architectural: define how distinct ownership
layers can still form one cohesive graph when later stored across multiple
source files.

## Layer map

The target state is one cohesive graph with distinct ownership layers.
Different files are storage boundaries, not separate realities.

Every source node in every layer must:

- have a stable identifier
- resolve relationships through IDs rather than anonymous duplication
- be selectable by later view-composition rules
- remain publishable into one integrated graph for downstream outputs

| Layer          | Owns                                                                                                                                                                                                                               | Does not own                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Facts          | Typed domain entities and durable relationships: person, organisations, roles, credentials, capabilities, abstract identity entities, shared links, and reusable authored statements that are themselves first-class domain claims | Route selection, page ordering, channel exposure, and page-only connective copy |
| Authored prose | Stable-ID prose nodes that are written for a page or page section but are not durable domain entities in their own right                                                                                                           | Canonical role/org/credential facts, route identity, or selection/order rules   |
| Composition    | Route/view nodes that select, order, group, and expose fact and prose nodes for a specific surface or channel                                                                                                                      | Underlying domain facts or the wording of prose nodes                           |

The key ownership rule is:

- if a written artefact is a durable, reusable claim about the domain, model it
  in the facts layer as a first-class typed node
- if a written artefact exists to connect, introduce, or frame material for a
  particular page or section, keep it in authored prose
- if a concern decides which nodes appear where, in what order, under which
  route or channel, it belongs to composition

That rule keeps the layers distinct without turning them into silos.

## Target source topology

Track B should move towards a multi-file source model that still resolves into
one graph:

```text
content/graph/
  entities/       # person, organisations, roles, credentials, capabilities
  prose/          # positioning, tilt statements, page-scoped prose nodes
  composition/    # home, cv, and future view definitions
```

This topology is intentionally graph-integrated rather than "one graph file plus
two unrelated content files".

The intended semantics are:

- `content/graph/entities/` stores fact-bearing nodes and stable relationships
- `content/graph/prose/` stores prose nodes with stable IDs, linked to the
  concepts, pages, or sections they support
- `content/graph/composition/` stores view definitions that reference IDs from
  the other two layers and determine selection, ordering, grouping, route
  exposure, and channel-specific presentation choices

Storage location does not by itself redefine ownership. A canonical positioning
or tilt statement may still live under `content/graph/prose/` because it is
authored text, while remaining fact-layer material semantically when it is a
durable typed claim reused across outputs.

At publication time, those files resolve into one cohesive graph for machine
and view consumers. They are not parallel systems.

The current live files remain authoritative until a later adoption slice
migrates them:

- `content/entities.json`
- `content/frontpage.content.json`
- `content/cv.content.json`

## Worked ownership example: `/`

### Current implementation boundary

Today:

- visible `/` prose renders from `content/frontpage.content.json`, with
  Person-owned name/profile atoms injected at composition boundaries
- the inline JSON-LD subgraph for `/` is derived from `content/entities.json`
- there is no graph-derived visible composition for the home page yet

### Target ownership

Facts own:

- `#person`
- `#website`
- shared contact and profile links that describe the person across surfaces
- reusable identity entities that the home page may surface, such as
  professional-identity or research-background concepts

Authored prose owns:

- the hero narrative as stable-ID prose nodes
- the prose copy for the home-page invitation to visit the CV
- any future page-specific narrative paragraph that is written for `/` rather
  than as a reusable domain statement

Composition owns:

- the home-page route/view node, including the `ProfilePage`-style page
  selection for `/`
- which fact nodes and prose nodes are surfaced on `/`
- hero paragraph order
- CTA placement
- ordering of surfaced links

This means the text for the home-page narrative is authored once as addressable
prose, while the decision to place that prose before or after links, or to
surface a specific CTA on `/`, remains composition-owned.

## Worked ownership example: `/cv`

### Current implementation boundary

Today:

- visible `/cv` prose renders from `content/cv.content.json`, with Person-owned
  name/email/description atoms injected at composition boundaries
- ADR-021 retires `/cv/[variant]`; `/cv/` is the sole editorial CV document
- the inline JSON-LD subgraph and graph-derived metadata derive from
  `content/entities.json`

### Target ownership

Facts own:

- roles, organisations, credentials, theses, publications, and capabilities
- abstract identity entities such as professional identity and research
  background
- shared links and durable relationships between those entities
- canonical positioning and possible future tilt statements when they are durable,
  graph-addressable claims about Jim's professional identity rather than
  page-only connective copy

Authored prose owns:

- any page-scoped connective text that introduces or bridges sections without
  being a canonical domain statement
- future section-intro or contextual copy written specifically for `/cv`
- any prose fragment written for a particular rendered section rather than for
  reuse across routes or channels

Composition owns:

- the `/cv` route/view node and its canonical page identity
- section order and grouping
- section-to-entity mapping
- which positioning statement is selected for the canonical route
- route exposure for the canonical CV surface

Under this model, a canonical positioning statement can remain a durable
identity claim in the facts layer while composition decides how `/cv/` surfaces
it. Future tilt selection remains a re-entry seam, not a current requirement.

## Tilt implications

Tilt behaviour stays explicit as a future re-entry design:

- tilt statement text is source material, not route logic
- whether a tilt is exposed on the web, remains PDF-only, or is withheld from a
  channel is composition-owned
- canonical-alias behaviour for tilt routes is composition and identity
  governance, not fact ownership
- choosing a tilt changes which statement the route surfaces; it does not
  create a second set of role, organisation, or credential facts

The historical canonical-alias option is preserved in ADR-017 and the tilt
reference. ADR-021 is the current truth: no live audience-tilt route exists.

## What remains for B2+

This note settles ownership and topology. It does not yet settle composition
mechanics.

Phase B2 should define:

- how route/view nodes select facts and prose by ID
- how ordering and grouping are expressed without recreating today's page JSON
  shape under new names
- how page-scoped narrative slots work alongside reusable statement entities
- how the canonical positioning is selected; tilt selection is deferred until
  a real re-entry requirement exists

Later Track B phases still need to define:

- identity and binding rules between graph nodes and rendered HTML
- the phased adoption path from current files to the target topology
- publication-completeness rules across HTML, JSON-LD, metadata, and future
  derived outputs

## Proof / harness boundary

This slice is design-only.

The visual regression harness was not required because:

- no rendering code changed
- no graph publication plumbing changed
- no metadata wiring changed
- no visible HTML output changed

The proof for this slice is architectural and documentary:

- the ownership model is now explicit
- the target topology is now explicit
- worked examples exist for `/` and `/cv`
- tilt ownership is now placed in composition rather than left implicit
