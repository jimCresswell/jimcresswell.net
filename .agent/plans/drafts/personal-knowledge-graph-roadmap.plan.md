---
name: Personal Knowledge Graph Roadmap Draft
overview: Draft candidate roadmap captured during graph-metaplan authoring so the proposed two-track model is preserved for next-session assessment.
todos:
  - id: draft-captured
    content: Capture a candidate two-track roadmap so the current session's thinking is preserved.
    status: completed
  - id: draft-assessed
    content: In the next session, assess this draft against explicit outcomes, intended impacts, and value mechanisms.
    status: pending
  - id: roadmap-adopted-or-rewritten
    content: In the next session, adopt, rewrite, split, or discard this draft as part of metaplan implementation.
    status: pending
isProject: false
---

# Personal Knowledge Graph Roadmap Draft

## Status

Draft input recorded on 2026-03-09 during graph-metaplan authoring.

This document preserves a candidate roadmap so the work from this session is
not lost, but it is not yet the authoritative graph roadmap. The current
authorities are [graph-metaplan.plan.md](../graph-metaplan.plan.md) and
[graph-current-state-audit.md](../research/graph-current-state-audit.md).

The next session must assess this draft against explicit outcomes, intended
impacts, and value mechanisms before adopting, rewriting, splitting, or
discarding it.

If this draft is adopted, it would work with
[personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md)
as the candidate Track A execution plan and
[personal-knowledge-graph-source-of-truth-design.plan.md](personal-knowledge-graph-source-of-truth-design.plan.md)
as the candidate Track B design plan.

## Strategic summary

The graph work now has two distinct goals:

- **Track A: Graph Expression** — improve JSON-LD and related machine-readable
  outputs so they express the existing graph deliberately and usefully.
- **Track B: Graph as Source of Truth** — design and adopt a layered graph model
  where the website, metadata, and other outputs become views onto graph-owned
  content and data.

This split is deliberate. The repo already has a functioning graph and useful
structured-data outputs, but the website is not yet graph-composed. Treating
those as one linear programme confuses current truth with target state.

## Foundation already in place

These are now treated as completed groundwork rather than the active roadmap:

- entity syntax, type mappings, and parse-time validation in `content/entities.json`
  and `lib/entities.ts`
- an entity population pass with role, capability, identity, and publication
  entities
- JSON-LD publication through full-graph and page-subgraph outputs
- a visual-regression proof record that current graph work did not create
  unexpected pixel drift
- product-owned structural checks around section IDs, page identity, and some
  metadata rules

These are valuable foundations, but they do **not** by themselves mean the
website is already a view onto the graph.

## Track A — Graph Expression

### Track A principle

Use the graph to publish better machine-readable expressions of Jim’s work and
identity, with effort proportional to consumer value.

### Strategic motivation

The existing graph already powers meaningful outputs. The next high-value work
is to make those outputs intentional:

- clearer expression of graph aspects in JSON-LD and related channels
- deliberate consumer-value choices rather than generic graph publication
- explicit validation of correctness and usefulness

### Phases

#### A1. Expression impact model

**Goal:** define what impact Track A is trying to create and for which
consumers.

**Approach:** identify target consumers and output channels, then define the
graph aspects that matter for each.

**Success criteria:**

- impact goals are explicit
- consumer-value tiers are tied to actual output decisions
- validation criteria exist before further enrichment work

#### A2. Output expression refinement

**Goal:** improve JSON-LD and adjacent machine-readable outputs as deliberate
expressions of graph structure.

**Approach:** refine page subgraphs, supporting metadata, and related output
channels using the impact model from A1.

**Success criteria:**

- output changes are tied to explicit consumer value
- graph publication is self-consistent and intentional
- no new claims are made about graph-backed page composition

#### A3. Validation and evidence

**Goal:** prove that Track A outputs are valid, useful, and correctly targeted.

**Approach:** combine internal checks, schema validation, rich-results checks,
and reviewed output artefacts.

**Success criteria:**

- correctness is externally validated where appropriate
- usefulness is evidenced against the chosen consumer goals
- the proof record is explicit and discoverable

### Candidate execution handoff

If this draft is adopted, Track A implementation should be managed from
[personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md).

**Primary reviewers:** `code-reviewer`, `pkg-reviewer`, `type-reviewer`,
`test-reviewer`, and `editor` when wording changes.

## Track B — Graph as Source of Truth

### Track B principle

The graph becomes the fundamental structure. The website, metadata, and future
derived outputs become views onto graph-owned content and domain data.

### Strategic motivation

Today, authored page content and graph entities are structurally separate. That
means:

- duplication risk between content files and graph entities
- weak, mostly manual linkage between page rendering and graph identity
- no structural proof that the site is graph-derived

Track B addresses that architecture directly.

### Phases

#### B1. Source-of-truth design

**Goal:** design the layered graph model, file topology, and graph-to-view
mechanisms before implementation.

**Approach:** define authored content ownership, page composition strategy,
identity/binding rules, and a phased adoption model.

**Success criteria:**

- the layered model is decision-complete
- worked examples exist for CV and front-page composition
- the phased adoption path is explicit

#### B2. Early cross-linking and risk discovery

**Goal:** connect content and entities in minimal, reversible ways to expose
structural problems early.

**Approach:** introduce cross-linking and composition experiments that preserve
current rendering while surfacing weak assumptions.

**Success criteria:**

- fundamental modelling or binding issues are discovered early
- the first adopted links are explicit rather than incidental
- rendered output remains reviewable and controlled

#### B3. Source-of-truth adoption

**Goal:** move domain ownership and authored content into the layered graph
model and make graph-backed composition the default.

**Approach:** migrate in deliberate slices, replacing parallel ownership rather
than creating permanent dual systems.

**Success criteria:**

- graph-owned structures become the default source for content and data
- page composition is graph-backed rather than coincidentally aligned
- the migration is broken into implementable sub-plans

#### B4. Publication completeness proof

**Goal:** prove that every extractable graph fact is published somewhere it
should be.

**Approach:** define publication channels and then validate graph-to-channel
coverage across HTML, JSON-LD, OG, manifest, and other relevant outputs.

**Success criteria:**

- publication completeness rules are explicit
- every graph fact that should surface is visible in at least one channel
- any intentionally unpublished graph content is justified explicitly

### Candidate design handoff

If this draft is adopted, Track B design should be owned by
[personal-knowledge-graph-source-of-truth-design.plan.md](personal-knowledge-graph-source-of-truth-design.plan.md).

**Primary reviewers:** `code-reviewer`, `pkg-reviewer`, `type-reviewer`,
`test-reviewer`, and `editor` when content framing is affected.

## Dependencies and sequencing

- Track A and Track B can overlap, but they serve different purposes.
- If adopted, Track B design can start immediately.
- Track B implementation should not begin until the design plan is
  decision-complete.
- LinkedIn remains downstream of this roadmap. It is a future derived-view
  concern, not a driver of graph architecture.

## Success criteria for the roadmap itself

- the current implementation is described truthfully
- Track A and Track B are clearly separated
- phase boundaries, strategic motivations, and measurable outcomes are explicit
- the roadmap stays above execution detail
- downstream work such as LinkedIn derives from the graph programme rather than
  steering it
