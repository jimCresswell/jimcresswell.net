# Personal Knowledge Graph Source-of-Truth Design Draft

Draft candidate Track B design plan for moving from a graph-powered
structured-data layer to a graph-backed source-of-truth architecture.

## Status

Draft input recorded on 2026-03-09 during graph-metaplan authoring.

No implementation work should be done from this draft. The next session must
assess it against explicit outcomes, intended impacts, and value mechanisms
before adopting, rewriting, splitting, or discarding it.

Use [graph-metaplan.plan.md](../graph-metaplan.plan.md) for the parent planning
context, [graph-current-state-audit.md](../research/graph-current-state-audit.md)
for the observed baseline, and
[personal-knowledge-graph-roadmap.plan.md](personal-knowledge-graph-roadmap.plan.md)
for the preserved candidate roadmap draft.

## Goal

Design a layered graph model in which:

- all domain facts and authored content live in graph-owned structures
- the website becomes a view onto those structures
- graph-to-view mechanisms are explicit and testable
- adoption can happen in phased, low-surprise slices

This draft is intentionally design-only. If adopted, it should produce the
architecture and the phased adoption path, not code.

## Strategic motivation

The current split between content JSON files and graph entities creates weak
structural guarantees:

- page prose and graph descriptions can drift
- composition depends on content-file structure rather than graph relationships
- graph-to-DOM binding is partial
- the repo cannot honestly claim that the website is a view onto the graph

Track B resolves that architecture directly.

## Design questions to answer

### 1. Layered model and file topology

Define the durable layered model, likely across multiple files rather than one
monolith.

The design must answer:

- what kinds of content live in which graph-owned files
- whether authored prose is attached to entities, expressions, composition
  entities, or all three
- how page composition is represented without recreating today’s brittle page
  JSON structures under another name

**Acceptance criteria:**

- the layer boundaries are explicit
- ownership of domain facts, authored prose, and presentation-specific
  selections is unambiguous
- at least one worked example exists for both `/` and `/cv`

### 2. Graph-to-view composition model

Define how pages become views onto the graph.

The design must answer:

- how a page selects entities and authored content
- how order, grouping, and page-specific narrative are represented
- how tilt variants compose from the same underlying model
- how graph-backed composition avoids accidental parallel ownership

**Acceptance criteria:**

- the composition mechanism is explicit
- the design supports both canonical and tilt CV routes
- the design explains how visible page sections map back to graph-owned sources

### 3. Identity and binding model

Define the binding between graph entities, rendered HTML, and canonical page
identity.

The design must answer:

- which entities need stable DOM anchors
- how section-, entity-, and role-level IDs are generated and governed
- how page composition exposes those bindings in rendered HTML
- how tilt routes reuse or vary canonical identity

**Acceptance criteria:**

- the binding model is defined at all required levels
- identity rules remain consistent with ADR-010 and ADR-017 unless intentionally
  superseded later
- worked examples show graph node to HTML anchor mapping

### 4. Adoption plan

Define the phased migration from today’s split ownership to graph-backed source
of truth.

The plan must answer:

- what the first cross-linking slice is
- how to discover structural problems early
- which slices can migrate without destabilising the site
- how to avoid permanent dual ownership or compatibility layers

**Acceptance criteria:**

- the migration is broken into ordered phases
- each phase has goal, impact, risks, and rollback/review posture
- the first adoption slice is small enough to expose assumptions early

### 5. Publication completeness model

Define how to prove that graph facts surface through the right published
channels.

The design must answer:

- which graph facts must be visible in HTML, JSON-LD, OG, manifest, markdown, or
  other channels
- what counts as intentionally unpublished
- how publication completeness is validated

**Acceptance criteria:**

- channel rules are explicit
- the validation model exists before implementation
- completeness is defined in a way that can later be tested

## Expected outputs

If this draft is adopted, it is complete only when it produces:

- a decision-complete layered source-of-truth architecture
- a worked composition example for the home page and the CV page
- a graph-to-DOM binding model
- a phased adoption plan
- a publication-completeness model
- a list of any durable decisions that should later become ADRs

## Reviewer expectations

Use:

- `code-reviewer` as gateway
- `pkg-reviewer` for graph and Schema.org correctness
- `type-reviewer` when the design implies new typing/validation boundaries
- `test-reviewer` for proof and migration-validation strategy
- `editor` when authored-content ownership or public framing is affected

## Relationship to historical PKG documents

- [personal-knowledge-graph-design-notes.md](../research/personal-knowledge-graph-design-notes.md)
  remains the historical design exploration and entity audit
- [personal-knowledge-graph-phase-model.plan.md](../complete/personal-knowledge-graph-phase-model.plan.md)
  remains the archive of the previous single-sequence model
- this draft preserves one candidate design entry point for Track B
