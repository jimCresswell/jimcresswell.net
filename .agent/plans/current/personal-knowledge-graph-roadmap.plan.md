---
name: Personal Knowledge Graph Roadmap
overview: Adopted graph roadmap. Both tracks are required. Track A comes first to extract concrete value from the current graph layer, then Track B follows to design and adopt a graph-backed source-of-truth architecture.
todos:
  - id: roadmap-adopted
    content: Adopt the two-track graph roadmap after metaplan evaluation and stakeholder decision.
    status: completed
  - id: track-a-impact-model
    content: Define Track A consumers, channels, intended impacts, and proof criteria before refinement work.
    status: completed
  - id: track-a-refinement-and-proof
    content: Execute Track A graph-expression refinement and validation work.
    status: completed
  - id: track-b-design
    content: Complete the required Track B source-of-truth design for a single canonical CV view. Tilt composition and A/B testing are deferred door-open.
    status: in_progress
  - id: track-b-adoption-plan
    content: Turn the Track B design into an implementation-ready migration plan.
    status: pending
  - id: tilts-retired-prerequisite
    content: Tilt routes and components are being retired in tilt-retirement.plan.md so Track B can credibly scope to a single canonical CV view.
    status: pending
isProject: false
---

# Personal Knowledge Graph Roadmap

## Status

Adopted on 2026-03-09 after the graph-metaplan evaluation and stakeholder
decision.

Both tracks are required.

Track A comes first.

Track A Phase A1, Phase A2, Phase A3, and Phase A4 are now complete in
[personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md).
Track B design remains the current graph-design task in
[personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md).

Use this roadmap together with
[graph-current-state-audit.md](../research/graph-current-state-audit.md),
[graph-publication-consumer-and-proof-model.md](../research/graph-publication-consumer-and-proof-model.md),
[graph-publication-output-audit.md](../research/graph-publication-output-audit.md),
[graph-negotiated-media-type-refinement.md](../research/graph-negotiated-media-type-refinement.md),
[graph-cv-metadata-description-proof.md](../research/graph-cv-metadata-description-proof.md),
[graph-rich-result-external-validator-evidence.md](../research/graph-rich-result-external-validator-evidence.md),
[graph-source-of-truth-layer-map.md](../research/graph-source-of-truth-layer-map.md),
[personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md),
and
[personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md)
as the live graph-planning stack.

[graph-metaplan.plan.md](../archive/graph-metaplan.plan.md) remains the completed reset
record that established this structure.

## Strategic outcome

**Outcome:** run the graph programme in two explicit stages: first make the
current graph layer intentionally valuable, then redesign the site so the graph
can become the real source of truth.

**Impact:** the repo stops conflating current graph publication with future
graph-backed composition, while still committing to both forms of value.

**Value mechanism:** Track A improves what the existing graph publishes and
proves. Track B removes the long-term split between authored page content and
graph entities.

## Current truth

The roadmap starts from the observed implementation baseline recorded in
[graph-current-state-audit.md](../research/graph-current-state-audit.md):

- visible page rendering still comes from `content/cv.content.json` and
  `content/frontpage.content.json`
- the graph currently drives JSON-LD, the manifest, and some metadata
- page content and graph entities are related but still structurally separate
- section-level page/document contracts exist, but entity-level graph-to-DOM
  binding is not yet adopted in rendered HTML

## Why both tracks are required

### Track A — Graph Expression

The current graph is already real enough to justify deliberate improvement.
Ignoring it would leave value on the table and weaken the proof that the graph
layer is worth keeping.

**Outcome:** more useful and better validated graph-facing outputs from the
architecture that exists today.

**Impact:** stronger entity signals, cleaner machine-readable publication, and
clearer evidence that the graph serves real consumers.

**Value mechanism:** improved JSON-LD, graph API output, and graph-adjacent
metadata create value for search/indexing consumers, programmatic clients, and
future graph-aware tools without destabilising page rendering.

### Track B — Graph as Source of Truth

The current two-layer model is workable but structurally incomplete. If the
graph is meant to become central rather than auxiliary, the repo needs a
designed migration path.

**Outcome:** a decision-complete architecture for graph-owned content, explicit
composition, and phased adoption.

**Impact:** reduced drift between prose and entities, clearer ownership, and a
truthful basis for saying the site is a view onto the graph.

**Value mechanism:** moving ownership and composition into graph-backed
structures eliminates duplicated modelling effort and creates one publishable
reality across HTML, JSON-LD, metadata, and future derived outputs.

## Sequencing

Track A is first because it acts on the architecture that already exists and
creates near-term value with low structural risk.

Track B remains required, but it follows Track A in priority. Do not let Track
B design displace Track A execution before Track A has defined:

- which consumers and channels matter now
- what the current graph layer is expected to achieve
- where the present architecture's limits actually are

Track B design may begin once Track A has completed its impact model and the
roadmap boundary still stands, but Track B implementation remains out of scope
until its design work is decision-complete.

Track B is now scoped to a **single canonical CV view**. Tilt composition and
A/B testing are deferred door-open; live tilt routes are being retired in
[`tilt-retirement.plan.md`](tilt-retirement.plan.md) so Track B can close on
real boundaries.

LinkedIn is **not** downstream of this roadmap. It draws evidence from the
editorial CV while applying `editorial-strategy.md` and `editorial-guidance.md`.
None depends on graph adoption. LinkedIn composition is optimised for its own
audience and interface rather than copied from the CV. The earlier "subsumed"
framing was incorrect: LinkedIn is parallel-runnable as collaborative editorial
work and is tracked in [`linkedin-update.plan.md`](linkedin-update.plan.md).

## Phases

### Phase 1 — Track A Establishment

**Goal:** make Track A the live execution path and define what success means for
the current graph layer.

**Impact:** the repo stops doing generic graph enrichment and instead works from
a consumer-led value model.

**Value mechanism:** explicit consumers, channels, and proof criteria constrain
the work to improvements that serve real use cases.

**Acceptance criteria:**

- Track A execution is owned by
  [personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md)
- the implementation-backed impact model is recorded in
  [graph-publication-consumer-and-proof-model.md](../research/graph-publication-consumer-and-proof-model.md)
- the target consumers and output channels are named explicitly
- each planned refinement can be tied to a stated impact and value mechanism
- proof criteria exist before implementation starts

### Phase 2 — Track A Delivery and Proof

**Goal:** refine graph-facing outputs and record proof that they are correct and
useful.

**Impact:** the current graph layer becomes an intentional publication surface
rather than a technically valid but weakly prioritised one.

**Value mechanism:** better-targeted outputs and explicit validation improve the
graph's usefulness to the consumers identified in Phase 1.

**Acceptance criteria:**

- Track A changes are implemented from the execution plan, not ad hoc
- validation and reviewed artefacts are recorded explicitly
- for rendering-risk slices, blocking harness proof is captured during
  implementation rather than deferred to the end
- no Track A work claims graph-backed page composition where none exists

Phase A2 is now complete via
[graph-publication-output-audit.md](../research/graph-publication-output-audit.md).
That audit found no confirmed correctness failures in the current Track A
surfaces. Track A now moves into proof-led refinement and validation rather
than generic graph enrichment.

The first Track A Phase A3 refinement slice is now recorded in
[graph-negotiated-media-type-refinement.md](../research/graph-negotiated-media-type-refinement.md).
The closing Track A Phase A3 proof slice is now recorded in
[graph-cv-metadata-description-proof.md](../research/graph-cv-metadata-description-proof.md).
Track A Phase A4 external validation is now recorded in
[graph-rich-result-external-validator-evidence.md](../research/graph-rich-result-external-validator-evidence.md).
That note captures the home-page Schema.org Validator pass plus the accepted
validator-side boundary on the remaining `/cv/` Schema.org and Google Rich
Results Test evidence, so Track A closes truthfully without widening scope or
pretending the external tooling was cleaner than it was.

### Phase 3 — Track B Design

**Goal:** produce the required source-of-truth design for a single canonical
CV view after Track A has established the boundary of the current architecture.

**Impact:** future migration work is driven by demonstrated structural needs,
not by a general preference for elegance, and is not blocked on tilt
composition design for a feature being retired.

**Value mechanism:** a design grounded in current limits and proven value
reduces the risk of unnecessary architectural churn. Single-canonical-view
scope keeps the design auditable.

**Acceptance criteria:**

- Track B design is owned by
  [personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md)
- the layered model, composition model, binding model, and adoption path are
  decision-complete for the canonical CV view
- tilt composition and A/B testing are explicitly deferred door-open with
  re-entry conditions named
- Track B remains design-only until the plan says otherwise

Track B Phase B1 is now recorded in
[graph-source-of-truth-layer-map.md](../research/graph-source-of-truth-layer-map.md).
That note fixes the first Track B design boundary:

- facts, authored prose, and composition are distinct ownership concerns
- those concerns still resolve into one cohesive graph across multiple files
- the current rendering truth remains unchanged until later adoption work

Phase B2 is now the current Track B design slice in
[personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md).

### Phase 4 — Track B Adoption Planning

**Goal:** turn the completed design into a phased migration plan for
implementation.

**Impact:** the repo gets a controlled path from split ownership to a real
graph-backed source of truth.

**Value mechanism:** explicit phases, review posture, and rollback boundaries
allow the architecture to evolve without pretending the target state already
exists.

**Acceptance criteria:**

- the migration is broken into implementable slices
- source-of-truth adoption work has clear review and proof requirements
- the graph-backed composition claim is made only when the rendering path is
  actually graph-backed

## Success criteria for this roadmap

- current implementation truth stays explicit
- both tracks remain clearly separated
- Track A is unambiguously first in sequencing
- Track B remains required and value-led
- the live graph authority is discoverable from this roadmap, the repo roadmap,
  and related plans
