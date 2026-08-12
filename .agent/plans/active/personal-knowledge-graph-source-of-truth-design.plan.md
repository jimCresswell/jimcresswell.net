---
name: Personal Knowledge Graph Source-of-Truth Design
overview: Adopted Track B design plan. Design the graph-backed source-of-truth architecture that should follow the Track A graph-expression work.
todos:
  - id: design-entry-condition
    content: Start Track B design only after Track A has defined the current graph layer's impact model.
    status: completed
  - id: layered-model-design
    content: Define the layered source-of-truth model and file topology.
    status: completed
  - id: composition-and-binding-design
    content: Define graph-to-view composition and graph-to-DOM binding for a single canonical CV view.
    status: in_progress
  - id: migration-and-completeness-design
    content: Define the phased adoption path and publication-completeness model.
    status: pending
  - id: tilt-composition-deferred
    content: Tilt composition design is deferred door-open. ADR-021 retires tilts; if reintroduced later, restart from the preserved tilt reference doc and the B1 layer map's tilt-implications section.
    status: deferred
  - id: ab-testing-deferred
    content: A/B testing is deferred door-open. Not in scope for the source-of-truth design.
    status: deferred
isProject: false
---

# Personal Knowledge Graph Source-of-Truth Design

## Status

Adopted on 2026-03-09 as the required follow-on Track B plan under
[personal-knowledge-graph-roadmap.plan.md](../current/personal-knowledge-graph-roadmap.plan.md).

Track A is now complete for the current publication surface. Treat this as the
active graph design track, not an implementation brief.

Use this plan with
[graph-current-state-audit.md](../research/graph-current-state-audit.md),
[graph-publication-consumer-and-proof-model.md](../research/graph-publication-consumer-and-proof-model.md),
[graph-publication-output-audit.md](../research/graph-publication-output-audit.md),
[graph-negotiated-media-type-refinement.md](../research/graph-negotiated-media-type-refinement.md),
[graph-source-of-truth-layer-map.md](../research/graph-source-of-truth-layer-map.md),
[personal-knowledge-graph-roadmap.plan.md](../current/personal-knowledge-graph-roadmap.plan.md),
and [ADR-014](../../../docs/architecture/decision-records/014-entity-model-design.md).

## Outcome, impact, and value mechanism

**Outcome:** a decision-complete design for moving from today's split ownership
to a graph-backed source-of-truth architecture.

**Impact:** future graph adoption work is driven by a clear model, explicit
composition rules, and a phased migration path rather than by architectural
intuition alone.

**Value mechanism:** a designed source-of-truth model reduces drift between
page prose and graph entities, creates durable ownership boundaries, and makes
it possible for the site to become a truthful view onto the graph.

## Entry condition

Track B is required, but it is not first.

Do not treat this plan as active implementation work until Track A has at least
completed its impact model and confirmed the boundaries of the current graph
layer.

That entry condition was satisfied on 2026-03-09 by
[graph-publication-consumer-and-proof-model.md](../research/graph-publication-consumer-and-proof-model.md).
The latest Track A boundary record is now
[graph-publication-output-audit.md](../research/graph-publication-output-audit.md).
The Track A Phase A3 refinement slices are now recorded in
[graph-negotiated-media-type-refinement.md](../research/graph-negotiated-media-type-refinement.md)
and
[graph-cv-metadata-description-proof.md](../research/graph-cv-metadata-description-proof.md).
Track A Phase A4 is now complete for the current publication surface.
Track B design remains the current graph-design workstream. With the Practice
Core adoption archived on 2026-04-19, this plan is once again the primary
repo-wide active plan. It remains design-only work.

No full composition implementation should be shipped from this plan until its
design work is decision-complete and an explicit migration plan exists.
ADR-020 is an owner-accepted bounded consolidation outside that prohibition: it
removes duplicate Person identity atoms and injects them through existing
composition boundaries without choosing B2 selection or ordering rules.

## Scope decision: single canonical CV view

Track B Phase B2 onward is now scoped to a **single canonical CV editorial
view**. Tilt composition (formerly Task B2.2) and A/B testing are both deferred
door-open — see [Deferred / door left open](#deferred--door-left-open) below.

ADR-021 retires the live audience-tilt routes. The retirement plan preserves
their content and former canonical-alias rationale as a discoverable reference
so future re-introduction has a real starting point.

This scope decision shrinks the Track B design surface so it can credibly close
without fabricating tilt composition rules for a retired feature.

## Next session start

Phase B1 is now complete via
[graph-source-of-truth-layer-map.md](../research/graph-source-of-truth-layer-map.md).

Begin with Phase B2, not a new audit. **Task B2.1 only.** Task B2.2 has been
deferred:

- Task B2.1 — Page Selection and Ordering Model (single canonical CV view)

The fresh first-contact re-integration of the 2026-04-19 upstream Practice
pack was run and closed on 2026-04-19/20; both incoming directories are back
to `.gitkeep`-only. See the practice-core CHANGELOG and
`.agent/prompts/session-continuation.prompt.md` for the integration outcome.
This plan is the primary product workstream; return to it now.

Use the B1 note as fixed boundary:

- facts, authored prose, and composition are distinct ownership layers
- those layers must still resolve into one cohesive graph across multiple files
- editorial prose and full selection/ordering are still not graph-derived;
  ADR-020 is a bounded Person identity-atom seam
- tilts are retired by ADR-021; do not design tilt composition into B2

## Problem statement

Today the repo has two related but separate ownership layers:

- page-composition JSON drives visible rendering
- the entity graph drives JSON-LD, the manifest, and some metadata

That split creates real limits:

- page prose and graph descriptions can drift
- page composition depends on content-file structure rather than graph
  relationships; the bounded shared identity atoms already derive from Person
- graph-to-DOM binding is partial
- the repo cannot honestly claim that the website is yet a view onto the graph

Track B exists to resolve those limits deliberately.

## Phases

### Phase B1 — Layered Model and File Topology

**Goal:** define the durable source-of-truth model and where each kind of data
and prose should live.

**Impact:** ownership becomes explicit before migration work begins.

**Value mechanism:** clear layer boundaries reduce duplication and stop the repo
from recreating today's split model under new names.

**Acceptance criteria:**

- the layer boundaries are explicit
- ownership of domain facts, authored prose, and presentation-specific
  selections is unambiguous
- worked examples exist for both `/` and `/cv`

**Completion record:** see
[graph-source-of-truth-layer-map.md](../research/graph-source-of-truth-layer-map.md).

#### Tasks

##### Task B1.1 — Source-of-Truth Layer Map

**Outcome:** a defined model for graph-owned facts, authored prose, and
composition structures.

**Impact:** future implementation work has a stable conceptual frame.

**Value mechanism:** clearer ownership prevents accidental duplication across
content and graph files.

**Acceptance criteria:**

- each content class has a named owner
- file topology is proposed explicitly
- the model does not recreate today's page JSON shape under another label

##### Task B1.2 — Worked Ownership Examples

**Outcome:** concrete examples for home-page and CV ownership.

**Impact:** the design can be judged against real site surfaces, not only
abstract principles.

**Value mechanism:** worked examples expose weak assumptions early.

**Acceptance criteria:**

- `/` has a worked ownership example
- `/cv` has a worked ownership example
- tilt implications are noted where relevant

### Phase B2 — Graph-to-View Composition Model (single canonical CV view)

**Goal:** define how the canonical `/cv/` page becomes a view onto the graph.

**Impact:** page rendering can later migrate from file-shaped composition to
relationship-shaped composition for the single supported view.

**Value mechanism:** explicit composition rules are required before any claim of
graph-backed rendering is credible. Scoping to one canonical view removes the
largest open question (tilt composition) and lets the design close on real
boundaries.

**Acceptance criteria:**

- the composition mechanism is explicit
- the design covers the canonical `/cv/` route and explicitly declares tilt
  composition out of scope (deferred door-open)
- the design explains how visible sections map back to graph-owned sources
- the design does not depend on tilt composition primitives or canonical-alias
  machinery; if those return later, they re-enter through a separate phase

#### Tasks

##### Task B2.1 — Page Selection and Ordering Model

**Outcome:** a model for selection, ordering, grouping, and page-specific
narrative for the canonical CV view.

**Impact:** graph composition can express page structure without relying on
today's brittle content-file layout, and without coupling to a feature
(tilts) that is retired.

**Value mechanism:** explicit composition logic avoids accidental parallel
ownership. Single-view scope keeps the model auditable.

**Acceptance criteria:**

- page selection rules are defined for the canonical `/cv/` route
- ordering and grouping rules are defined
- page-specific narrative is accounted for without breaking shared ownership
- the design names the seam where tilt composition could re-enter later
  without rewriting the canonical-view model

### Phase B3 — Identity and Binding Model

**Goal:** define the relationship between graph entities, rendered HTML, and
canonical page identity.

**Impact:** the site can later prove that graph entities are not just published
alongside HTML but actually anchor into it.

**Value mechanism:** stable identities and DOM anchors make graph-backed
rendering testable and discoverable.

**Acceptance criteria:**

- binding rules are defined for section, entity, and role levels where needed
- identity rules stay consistent with ADR-010 and the canonical-only decision
  in ADR-021
- worked examples show graph node to HTML anchor mapping

#### Tasks

##### Task B3.1 — ID Governance Model

**Outcome:** rules for generating, reusing, and governing stable IDs.

**Impact:** later implementation avoids ad hoc anchor schemes.

**Value mechanism:** stable IDs allow graph entities and rendered HTML to refer
to the same real things.

**Acceptance criteria:**

- required ID levels are named
- generation and governance rules are explicit
- tilt identity behaviour is **not required** here (tilts are retired);
  the model must remain compatible with later tilt re-introduction without
  forcing a redesign

##### Task B3.2 — Binding Examples

**Outcome:** worked examples linking graph nodes to rendered HTML anchors.

**Impact:** the design becomes concretely testable.

**Value mechanism:** examples expose missing identity or binding assumptions
before migration work starts.

**Acceptance criteria:**

- at least one CV example exists
- at least one home-page example exists where appropriate

### Phase B4 — Adoption Plan

**Goal:** define the phased migration from split ownership to graph-backed
source of truth.

**Impact:** the architecture can evolve in controlled slices instead of one
large rewrite.

**Value mechanism:** phased adoption lowers delivery risk and reveals structural
problems early.

**Acceptance criteria:**

- the migration is broken into ordered phases
- each phase has goal, impact, risks, and review posture
- the first adoption slice is small enough to test assumptions early

#### Tasks

##### Task B4.1 — Early Discovery Slice

**Outcome:** a proposed first cross-linking or adoption slice.

**Impact:** the design includes a practical way to discover modelling risks
early.

**Value mechanism:** early discovery reduces the chance of committing to a bad
structure at scale.

**Acceptance criteria:**

- the first slice is explicit
- it is reversible or tightly controlled
- it does not require pretending the target state already exists

##### Task B4.2 — Migration Sequence

**Outcome:** an ordered path from current architecture to source-of-truth
adoption.

**Impact:** future implementation can be planned without permanent dual systems.

**Value mechanism:** explicit sequence and rollback posture reduce migration
risk.

**Acceptance criteria:**

- the migration order is explicit
- compatibility-layer sprawl is avoided by design
- review and rollback posture are documented

### Phase B5 — Publication Completeness Model

**Goal:** define how to prove that graph facts surface through the correct
published channels.

**Impact:** the future source-of-truth model is judged by publication coverage,
not just by internal elegance.

**Value mechanism:** completeness rules ensure graph-owned content produces real
visible or machine-readable value.

**Acceptance criteria:**

- channel rules are explicit
- the validation model exists before implementation
- intentional non-publication is defined and justifiable

#### Tasks

##### Task B5.1 — Channel Coverage Rules

**Outcome:** rules for which facts should appear in HTML, JSON-LD, OG,
manifest, markdown, and other channels.

**Impact:** source-of-truth adoption stays tied to published outcomes.

**Value mechanism:** explicit coverage rules prevent the graph from becoming a
private internal model with weak publication value.

**Acceptance criteria:**

- the relevant channels are named
- channel expectations are explicit
- intentionally unpublished facts are accounted for

##### Task B5.2 — Validation Model

**Outcome:** a design for how publication completeness will later be tested.

**Impact:** implementation can be planned with proof in mind.

**Value mechanism:** a defined proof model reduces the risk of untestable
architecture.

**Acceptance criteria:**

- completeness can later be tested in product code and test suites
- proof expectations are linked to the adoption phases

## Expected outputs

This plan is complete only when it produces:

- a decision-complete layered source-of-truth architecture
- worked composition examples for the home page and the CV page
- a graph-to-DOM binding model
- a phased adoption plan
- a publication-completeness model
- a list of durable decisions that should later become ADRs

## Reviewer expectations

Use:

- `code-reviewer` as gateway
- `pkg-reviewer` for graph and Schema.org correctness
- `type-reviewer` when the design implies new typing or validation boundaries
- `test-reviewer` for proof and migration-validation strategy
- `editor` when authored-content ownership or public framing is affected

## Deferred / door left open

The following items are deliberately out of scope for this Track B design and
are recorded here so the door is discoverable, not implicit.

### Tilt composition

**Why deferred:** tilts are retired by ADR-021 and recorded in
[`../current/tilt-retirement.plan.md`](../current/tilt-retirement.plan.md).
Designing tilt composition into Track B would either fabricate rules for a
removed feature or block this design on a feature that is leaving the codebase.

**Where the content goes:** the retirement plan preserves the tilt content and
the canonical-alias rationale (historically in
[ADR-017](../../../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md),
superseded by ADR-021)
in a discoverable reference doc under `docs/architecture/reference/`.

**Re-entry condition:** if tilts return as a real product requirement, the
composition design starts from:

- the preserved tilt reference doc
- the B1 layer map's [tilt implications section](../research/graph-source-of-truth-layer-map.md#tilt-implications)
- [ADR-021](../../../docs/architecture/decision-records/021-canonical-only-cv-identity.md)
  and a new re-entry ADR

The Track B B2 design must keep the seam clear so that later tilt re-entry
extends the canonical-view model rather than rewriting it.

### A/B testing

**Why deferred:** no infrastructure for A/B testing exists, and this design
does not require it. Routing or audience-variant work belongs to a separate
plan if the requirement returns.

**Re-entry condition:** an explicit A/B testing plan with stated consumers,
infrastructure choices, and proof model.
