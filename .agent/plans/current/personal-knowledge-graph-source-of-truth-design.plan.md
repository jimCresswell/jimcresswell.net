---
name: Personal Knowledge Graph Source-of-Truth Design
overview: Adopted Track B design plan. Design the graph-backed source-of-truth architecture that should follow the Track A graph-expression work.
todos:
  - id: design-entry-condition
    content: Start Track B design only after Track A has defined the current graph layer's impact model.
    status: pending
  - id: layered-model-design
    content: Define the layered source-of-truth model and file topology.
    status: pending
  - id: composition-and-binding-design
    content: Define graph-to-view composition and graph-to-DOM binding.
    status: pending
  - id: migration-and-completeness-design
    content: Define the phased adoption path and publication-completeness model.
    status: pending
isProject: false
---

# Personal Knowledge Graph Source-of-Truth Design

## Status

Adopted on 2026-03-09 as the required follow-on Track B plan under
[personal-knowledge-graph-roadmap.plan.md](personal-knowledge-graph-roadmap.plan.md).

Track A comes first. Treat this as a required design track, not an active
implementation brief.

Use this plan with
[graph-current-state-audit.md](../research/graph-current-state-audit.md),
[personal-knowledge-graph-roadmap.plan.md](personal-knowledge-graph-roadmap.plan.md),
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

No code should be shipped from this plan until its design work is
decision-complete and an explicit migration plan exists.

## Problem statement

Today the repo has two related but separate ownership layers:

- page-composition JSON drives visible rendering
- the entity graph drives JSON-LD, the manifest, and some metadata

That split creates real limits:

- page prose and graph descriptions can drift
- page composition depends on content-file structure rather than graph
  relationships
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

### Phase B2 — Graph-to-View Composition Model

**Goal:** define how pages become views onto the graph.

**Impact:** page rendering can later migrate from file-shaped composition to
relationship-shaped composition.

**Value mechanism:** explicit composition rules are required before any claim of
graph-backed rendering is credible.

**Acceptance criteria:**

- the composition mechanism is explicit
- the design supports canonical and tilt CV routes
- the design explains how visible sections map back to graph-owned sources

#### Tasks

##### Task B2.1 — Page Selection and Ordering Model

**Outcome:** a model for selection, ordering, grouping, and page-specific
narrative.

**Impact:** graph composition can express page structure without relying on
today's brittle content-file layout.

**Value mechanism:** explicit composition logic avoids accidental parallel
ownership.

**Acceptance criteria:**

- page selection rules are defined
- ordering and grouping rules are defined
- page-specific narrative is accounted for without breaking shared ownership

##### Task B2.2 — Tilt Composition Model

**Outcome:** a design for how tilt variants derive from shared graph-owned
structures.

**Impact:** tilt behaviour becomes a real composition concern rather than an
afterthought.

**Value mechanism:** shared underlying structures reduce duplicate editorial
maintenance.

**Acceptance criteria:**

- the design supports canonical CV and tilt routes
- the reuse and variation rules are explicit

### Phase B3 — Identity and Binding Model

**Goal:** define the relationship between graph entities, rendered HTML, and
canonical page identity.

**Impact:** the site can later prove that graph entities are not just published
alongside HTML but actually anchor into it.

**Value mechanism:** stable identities and DOM anchors make graph-backed
rendering testable and discoverable.

**Acceptance criteria:**

- binding rules are defined for section, entity, and role levels where needed
- identity rules stay consistent with ADR-010 and ADR-017 unless deliberately
  superseded later
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
- tilt identity behaviour is covered

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
