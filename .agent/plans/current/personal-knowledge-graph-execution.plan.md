---
name: Graph Expression Execution Draft
overview: Draft candidate Track A execution plan captured during graph-metaplan authoring so the proposed graph-expression work is preserved for next-session assessment.
todos:
  - id: draft-captured
    content: Capture a candidate Track A execution plan without losing the current session's thinking.
    status: completed
  - id: draft-assessed
    content: In the next session, assess this draft against explicit outcomes, intended impacts, and value mechanisms.
    status: pending
  - id: execution-plan-adopted-or-rewritten
    content: In the next session, adopt, rewrite, split, or discard this draft as part of metaplan implementation.
    status: pending
isProject: false
---

# Graph Expression Execution Draft

## Status

Draft input recorded on 2026-03-09 during graph-metaplan authoring.

This document preserves a candidate Track A execution plan, but it is not yet
the live graph-work authority. Use [graph-metaplan.plan.md](../graph-metaplan.plan.md)
and [graph-current-state-audit.md](../research/graph-current-state-audit.md)
as the current authorities.

The next session must assess this draft against explicit outcomes, intended
impacts, and value mechanisms before adopting, rewriting, splitting, or
discarding it.

## Context

Read these first:

1. [graph-metaplan.plan.md](../graph-metaplan.plan.md) — parent planning context
2. [graph-current-state-audit.md](../research/graph-current-state-audit.md) —
   observed implementation truth and session findings
3. [personal-knowledge-graph-roadmap.plan.md](personal-knowledge-graph-roadmap.plan.md) —
   draft candidate Track A / Track B roadmap
4. [pkg-research-findings.md](../research/pkg-research-findings.md) — consumer
   value tiers, validation strategy, and Schema.org research
5. [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md)
   and related ADRs — durable design context

## What this draft is

This draft covers the work of using the existing entity model to improve
JSON-LD and related machine-readable outputs as deliberate expressions of graph
aspects.

If adopted, it would be the right place for:

- graph publication strategy
- page-subgraph and full-graph refinement
- consumer-value-driven output decisions
- structured-data validation and proof

It is **not** the place for:

- designing the graph-backed source-of-truth architecture
- migrating visible page composition into the graph
- claiming that the website is already graph-derived
- using LinkedIn as an architectural driver

That work belongs to **Track B** in the candidate design draft
[personal-knowledge-graph-source-of-truth-design.plan.md](../research/personal-knowledge-graph-source-of-truth-design.plan.md).

## Current truth

### What exists today

- `content/entities.json` is a validated entity graph
- JSON-LD publication derives from that graph
- the manifest and some metadata derive from graph entities
- the visual-regression proof record for the historical PKG work is closed

### What does not exist today

- visible page rendering does **not** derive from the graph
- `content/cv.content.json` and `content/frontpage.content.json` do **not**
  function as graph-backed composition files yet
- entity-level and role-level graph-to-DOM binding are not truly adopted in the
  rendered site

The audit at
[graph-current-state-audit.md](../research/graph-current-state-audit.md)
contains the supporting detail and should be treated as authoritative.

## Strategic goal

Track A should make the graph outputs more useful and more deliberate.

That means:

- decide what impact the structured-data layer is trying to create
- tie output work to actual consumer value
- improve graph publication mechanisms only when they serve that value
- validate correctness and usefulness explicitly

## Foundations already complete

These are now treated as completed groundwork for Track A:

- entity syntax, validation, and type mappings
- entity population across the current graph model
- full-graph publication and page-subgraph publication
- product-owned route and section identity contracts
- regression-proof infrastructure and the closed PKG visual proof record

Historical records for that work live in:

- [personal-knowledge-graph-phase-model.plan.md](../complete/personal-knowledge-graph-phase-model.plan.md)
- [personal-knowledge-graph-design-notes.md](../research/personal-knowledge-graph-design-notes.md)
- [visual-regression-harness.plan.md](../complete/visual-regression-harness.plan.md)

## Phases

### Phase A1 — Expression impact model

**Goal:** define what Track A is trying to achieve, for whom, and through which
graph-facing outputs.

**Approach:**

- identify the real consumers and channels
- map graph aspects to those consumers
- define what “better expression” actually means

**Acceptance criteria:**

- intended impact is explicit
- consumer-value tiers drive output decisions
- validation criteria exist before further enrichment work

### Phase A2 — Output expression audit

**Goal:** compare the current outputs against the impact model and identify the
highest-value refinements.

**Approach:**

- audit full-graph and page-subgraph outputs
- audit adjacent graph-facing outputs such as manifest and metadata
- classify gaps as correctness, expression quality, or channel mismatch

**Acceptance criteria:**

- current output strengths and gaps are documented
- each proposed refinement is tied to a stated impact
- no work is justified purely by generic graph completeness

### Phase A3 — Output refinement

**Goal:** implement the agreed graph-expression improvements.

**Approach:**

- refine graph outputs deliberately, not opportunistically
- keep the site’s current rendering truth explicit
- use TDD and reviewer discipline for all non-trivial changes

**Acceptance criteria:**

- output changes match the agreed impact model
- graph publication remains self-consistent and valid
- no new live plan wording implies graph-backed page composition unless it is
  actually implemented

### Phase A4 — Validation and proof

**Goal:** prove that Track A outputs are correct and fit for their intended
consumers.

**Approach:**

- internal graph and subgraph checks
- Schema.org Validator
- Google Rich Results Test where relevant
- reviewed artefacts and explicit recorded outcomes

**Acceptance criteria:**

- validation results are recorded in the plan or related proof artefacts
- output correctness is evidenced, not assumed
- any intentional exceptions are documented explicitly

## Reviewer protocol

After every non-trivial change, use:

- `code-reviewer` as gateway
- `pkg-reviewer` on all graph, JSON-LD, entity-model, and `@id` work
- `type-reviewer` on schema, validation, or type-flow changes
- `test-reviewer` on test additions or changes
- `editor` when wording or public framing changes

## Key files

| File                                                 | Purpose                                       |
| ---------------------------------------------------- | --------------------------------------------- |
| `content/entities.json`                              | Current graph source                          |
| `lib/entities.ts`                                    | Graph validation and typed access             |
| `lib/jsonld.ts`                                      | Full-graph publication                        |
| `lib/page-jsonld.ts`                                 | Page-subgraph publication                     |
| `lib/page-document-contract.ts`                      | Product-owned page and section identity rules |
| `.agent/plans/research/graph-current-state-audit.md` | Truth baseline for this execution plan        |
| `.agent/plans/research/pkg-research-findings.md`     | Track A research reference                    |

## What to do next with this draft

1. In the next session, assess whether this draft's phases and boundaries match
   the desired outcomes, intended impacts, and value mechanisms.
2. If adopted, complete Phase A1 before any refinement work.
3. Only then prioritise refinement and external validation work.

## Out of scope

- source-of-truth redesign
- graph-backed page composition
- phased migration of authored content into graph-owned structures
- publication-completeness proof for the eventual source-of-truth model
- LinkedIn derivation work

Those belong to Track B and later downstream planning.
