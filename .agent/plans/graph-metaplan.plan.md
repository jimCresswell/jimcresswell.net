---
name: Graph Metaplan
overview: Completed reset record for the graph work. It established the truthful current-state baseline, required a value-led reassessment, and handed authority to the adopted roadmap and successor plans.
todos:
  - id: current-state-audit
    content: Record the current graph and page architecture from observed implementation, proof, and lessons learned.
    status: completed
  - id: preserve-candidate-successor-docs
    content: Preserve candidate roadmap and successor-plan drafts so the thinking from the reset session is not lost.
    status: completed
  - id: assess-existing-work-against-goals-impact-value
    content: Assess the recent graph work and draft successor docs against explicit outcomes, intended impacts, and value mechanisms.
    status: completed
  - id: adopt-authoritative-roadmap-and-successor-plans
    content: Adopt the authoritative roadmap and successor plans with stakeholder-confirmed sequencing.
    status: completed
  - id: retire-metaplan
    content: Retire the metaplan once the authoritative roadmap and successor plans exist.
    status: completed
isProject: false
---

# Graph Metaplan

## Status

Completed on 2026-03-09.

This metaplan has done its job. It reset the graph work around observed truth,
forced an outcome/impact/value assessment, and led to the adopted live plan
stack:

- [graph-current-state-audit.md](research/graph-current-state-audit.md)
- [personal-knowledge-graph-roadmap.plan.md](current/personal-knowledge-graph-roadmap.plan.md)
- [personal-knowledge-graph-execution.plan.md](current/personal-knowledge-graph-execution.plan.md)
- [personal-knowledge-graph-source-of-truth-design.plan.md](current/personal-knowledge-graph-source-of-truth-design.plan.md)

It remains at this path as a historical record and stable reference target for
older links.

## What it corrected

The reset was necessary because the earlier PKG planning had drifted:

- the graph was real and operational for structured-data outputs
- the website was not yet graph-derived in visible rendering
- some live plans described the target source-of-truth architecture as if it
  already existed

This metaplan corrected that drift by making the current-state audit mandatory
and by refusing to adopt a new plan stack until the work had been assessed
against explicit outcomes, intended impacts, and value mechanisms.

## Result

The reassessment concluded that both graph tracks are required:

- **Track A — Graph Expression** is required first, because it improves the
  graph layer that already exists and produces near-term value
- **Track B — Graph as Source of Truth** is also required, but as the follow-on
  design track for the architecture that does not yet exist

That sequencing now lives in
[personal-knowledge-graph-roadmap.plan.md](current/personal-knowledge-graph-roadmap.plan.md).

## Historical artefacts from the reset

The original draft inputs were superseded when the adopted plans were moved into
`current/`.

No compatibility-layer draft stubs remain. The live planning surface is the
adopted `current/` stack only.

## Reviewer expectations

Non-trivial changes in the successor plan stack should go through:

- `code-reviewer` as gateway
- `pkg-reviewer` for graph, JSON-LD, and architecture correctness
- `editor` when changes affect public narrative, identity framing, or wording
