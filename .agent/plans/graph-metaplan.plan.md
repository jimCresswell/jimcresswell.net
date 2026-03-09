---
name: Graph Metaplan
overview: Record the truthful current-state audit and author the metaplan that the next session will use to assess recent graph work and create the authoritative roadmap and successor plans.
todos:
  - id: current-state-audit
    content: Record the current graph and page architecture from observed implementation, proof, and lessons learned.
    status: completed
  - id: preserve-candidate-successor-docs
    content: Preserve candidate roadmap and successor-plan drafts so the thinking from this session is not lost.
    status: completed
  - id: assess-existing-work-against-goals-impact-value
    content: In the next session, assess all graph work and draft successor docs against explicit outcomes, intended impacts, and value mechanisms.
    status: pending
  - id: adopt-authoritative-roadmap-and-successor-plans
    content: In the next session, adopt, rewrite, split, or discard the preserved draft roadmap and successor-plan docs.
    status: pending
  - id: retire-metaplan
    content: Archive this metaplan once the authoritative roadmap and successor plans exist.
    status: pending
isProject: false
---

# Graph Metaplan

## Status

In progress as of 2026-03-09. This session's authoritative deliverables are the
current-state audit and this metaplan.

During metaplan authoring, candidate roadmap and successor-plan drafts were
also captured so the work and thinking from this session are not lost. Those
drafts are preserved inputs for the next session, not yet the authoritative
graph-planning stack.

The next session must assess everything done so far against explicit outcomes,
intended impacts, and value mechanisms before adopting, rewriting, splitting,
or discarding those drafts.

## Why this exists

The existing personal knowledge graph work produced a valuable entity model and
useful JSON-LD outputs, but it also accumulated a planning drift:

- the graph is real and operational for structured-data outputs
- the website is **not yet** graph-derived in any strong sense
- some live planning docs described the intended source-of-truth architecture as
  if it were already implemented

This metaplan corrects that drift. It is the parent plan for graph work and the
authoring brief for the next session's graph roadmap and successor plans.

## Truth baseline

The current-state audit at [graph-current-state-audit.md](research/graph-current-state-audit.md)
is the required grounding document for all future graph planning.

Its core findings are:

- visible page rendering still comes from `content/cv.content.json` and
  `content/frontpage.content.json`
- the graph currently drives JSON-LD, the manifest, and some metadata, but not
  page composition
- page/graph linkage is mostly manual or coincidental rather than modelled
- section-level HTML binding exists, but entity-level and role-level binding are
  not yet adopted in the rendered site
- some live planning documents needed reframing because they described target
  state rather than current implementation

## Authoritative documents now

These are the documents that are authoritative during metaplan authoring.

| Document                                                                                              | Role                                                                                                 |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [graph-metaplan.plan.md](graph-metaplan.plan.md)                                                      | Parent planning document for the graph reset                                                         |
| [graph-current-state-audit.md](research/graph-current-state-audit.md)                                 | Deep-dive record of what exists, what is proven, what missed the mark, and what needs to happen next |
| [personal-knowledge-graph-phase-model.plan.md](complete/personal-knowledge-graph-phase-model.plan.md) | Historical phase model retained as an archive record                                                 |
| [personal-knowledge-graph-design-notes.md](research/personal-knowledge-graph-design-notes.md)         | Historical design exploration and entity-audit record                                                |

## Preserved draft inputs for next session

These drafts were captured during metaplan authoring so the thinking from this
session is preserved, but they are not yet authoritative.

| Document                                                                                                                    | Role                                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [personal-knowledge-graph-roadmap.plan.md](current/personal-knowledge-graph-roadmap.plan.md)                                | Candidate strategic roadmap draft using the proposed two-track model |
| [personal-knowledge-graph-execution.plan.md](current/personal-knowledge-graph-execution.plan.md)                            | Candidate Track A execution-plan draft                               |
| [personal-knowledge-graph-source-of-truth-design.plan.md](research/personal-knowledge-graph-source-of-truth-design.plan.md) | Candidate Track B design-plan draft                                  |

## Proposed track model for next-session assessment

### Track A — Graph Expression

Use the existing entity model to improve machine-readable and graph-facing
outputs as deliberate expressions of graph aspects.

**Strategic motivation:** the repo already has a valid entity foundation and
published graph outputs. The next value comes from making those outputs more
intentional, useful, and validated, rather than pretending the website is
already graph-composed.

**Candidate plan draft:** [personal-knowledge-graph-execution.plan.md](current/personal-knowledge-graph-execution.plan.md)

### Track B — Graph as Source of Truth

Design and then adopt a layered graph model where content, domain data, and
page composition all derive from graph-owned structures.

**Strategic motivation:** the current architecture leaves authored content and
graph entities structurally separate. That creates duplication risk, weak
binding, and no durable proof that the site is actually a view onto the graph.

**Candidate design-plan draft:** [personal-knowledge-graph-source-of-truth-design.plan.md](research/personal-knowledge-graph-source-of-truth-design.plan.md)

## Phases of this metaplan

### Phase 1 — Truth Baseline

**Goal:** capture what exists, what is proven, what was exploratory, and what
the architecture actually is.

**Impact:** future graph work starts from observed implementation rather than
wishful descriptions.

**Acceptance criteria:**

- the audit records current rendering, metadata, graph publication, and binding
- the audit explicitly distinguishes implemented behaviour from intended target
  state
- the session’s insights are preserved outside ephemeral chat

### Phase 2 — Preserve Candidate Successor Drafts

**Goal:** capture the candidate roadmap and successor-plan thinking from this
session without letting those drafts masquerade as completed metaplan output.

**Impact:** the next session inherits the full thinking and structure work from
this session without confusing draft inputs for adopted authority.

**Acceptance criteria:**

- the candidate roadmap and successor-plan drafts exist
- each preserved draft is labelled clearly as draft input, not live authority
- the current authoritative graph-planning documents remain the metaplan and
  the current-state audit

### Phase 3 — Next-Session Assessment and Adoption

**Goal:** in the next session, assess all graph work done so far against
explicit outcomes, intended impacts, and value mechanisms, then decide what the
authoritative roadmap and successor plans should be.

**Impact:** the new plan stack will be adopted because it creates defined value,
not just because it was structurally tidy or already half-written.

**Acceptance criteria:**

- recent graph work is assessed against explicit outcome, impact, and value
  statements
- the proposed Track A / Track B split is validated or revised deliberately
- the authoritative roadmap and successor plans are adopted, rewritten, split,
  or discarded explicitly
- no live planning doc claims that the website is graph-derived unless the
  rendering path is actually graph-backed

### Phase 4 — Retire the Metaplan

**Goal:** remove this metaplan from the live stack once it has done its job.

**Impact:** the repo returns to a simpler planning topology with the
authoritative roadmap as the clear driver.

**Acceptance criteria:**

- the authoritative roadmap and successor plans exist
- repo-level and parent-plan cross-links point to them
- this metaplan is archived as a historical record

## Reviewer expectations

Non-trivial changes in this plan stack should go through:

- `code-reviewer` as gateway
- `pkg-reviewer` for graph, JSON-LD, and architecture correctness
- `editor` when changes affect public narrative, identity framing, or wording

## Next actions

1. In the next session, assess all recent graph work and the preserved draft
   successor docs against explicit outcomes, intended impacts, and value
   mechanisms.
2. Decide whether the proposed Track A / Track B split stands as drafted or
   needs reframing.
3. Adopt, rewrite, split, or discard the preserved draft roadmap and
   successor-plan docs.
4. Retire this metaplan once the authoritative roadmap becomes the clear
   driving force.
