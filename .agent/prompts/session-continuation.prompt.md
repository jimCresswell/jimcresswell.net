---
prompt_id: session-continuation
title: "Session Continuation"
type: handoff
status: active
last_updated: 2026-04-18
---

Pick up the next session in this repo.

Ground first: follow the **start-right** skill
([`../skills/start-right/SKILL.md`](../skills/start-right/SKILL.md))
or the thin adapter
[`jc-start-right`](../../.agents/skills/jc-start-right/SKILL.md)
— foundation docs, `plans/active/`, practice box, gates.

> **Forward warning**: the Practice Core adoption (do-first below) replaces
> `start-right` with a `start-right-quick`/`start-right-thorough` split,
> renames `rules.md` → `principles.md`, restructures `.agent/prompts/`,
> reorganises plan-directory lanes (`icebox/` → canonical `future/`),
> creates the missing `.claude/` adapter directory, makes the GitHub
> Actions check/validation workflow set required, and adopts canonical
> gate names. After that adoption lands, re-ground via the new
> `start-right-thorough` skill. Until then, the references above are
> still live.

## Do this first — Practice Core wholesale adoption

A structural ratchet is sitting at the front of the queue. The incoming
Practice Core (eight files plus three required directories, 24 PDRs, new
verification surface, vital-surface enumeration per PDR-024) needs wholesale
adoption with this repo's unique substance integrated into the new shape.
The plan is checked in:

[`../plans/active/practice-core-wholesale-adoption.plan.md`](../plans/active/practice-core-wholesale-adoption.plan.md)

**Why first**: the adoption restructures `start-right`, the rules estate,
the gate names, and the prompt directory — surfaces every other in-flight
thread depends on. Running threads 1–4 (below) before completing at least
Phases 3, 4, 7, 8 of the adoption guarantees rework. The adoption plan
contains an "Interaction with active threads" section spelling out the
specific impacts.

**Integration-first principle**: the adoption is an inclusion exercise.
No file is held back, trimmed, or summarised because of fitness ceilings;
no skill, reviewer, command, rule, hook, or workflow is treated as
optional; compression and reduction happen in a dedicated post-integration
session. Fitness validators run informationally throughout; blocking
validators (portability, sub-agents, vital-surfaces) become blocking from
Phase 12 onwards. See the plan's "Integration-first principle" section.

## Other in-flight threads

The four threads below are queued behind the adoption. They remain
parallel-runnable amongst each other but should not race the adoption's
Phases 3, 4, 7, 8.

| #   | Thread                | Status      | Plan                                                                                                                                                 | Handoff prompt                                                                                                                           |
| --- | --------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Track B Phase B2.1    | In progress | [`../plans/active/personal-knowledge-graph-source-of-truth-design.plan.md`](../plans/active/personal-knowledge-graph-source-of-truth-design.plan.md) | [`personal-knowledge-graph-track-b-source-of-truth-design.prompt.md`](personal-knowledge-graph-track-b-source-of-truth-design.prompt.md) |
| 2   | LinkedIn content prep | Ready       | [`../plans/current/linkedin-update.plan.md`](../plans/current/linkedin-update.plan.md)                                                               | [`linkedin-content-preparation.prompt.md`](linkedin-content-preparation.prompt.md)                                                       |
| 3   | Tilt retirement       | In progress | [`../plans/current/tilt-retirement.plan.md`](../plans/current/tilt-retirement.plan.md)                                                               | [`tilt-retirement.prompt.md`](tilt-retirement.prompt.md)                                                                                 |
| 4   | Dev-tooling hygiene   | Ready       | [`../plans/current/dev-tooling-hygiene.plan.md`](../plans/current/dev-tooling-hygiene.plan.md)                                                       | [`dev-tooling-hygiene.prompt.md`](dev-tooling-hygiene.prompt.md)                                                                         |

The active plan in [`../plans/active/`](../plans/active/) now carries two
plans: the Practice Core adoption (top priority) and Track B Phase B2.1
(in progress).

## Grounding truths to preserve

- Track B Phase B2 is now scoped to a **single canonical CV view**.
- Live tilt routes (`/cv/[variant]`) are being retired in
  [`../plans/current/tilt-retirement.plan.md`](../plans/current/tilt-retirement.plan.md).
  Tilt content and the canonical-alias rationale are being preserved in
  [`../../docs/architecture/reference/cv-tilt-content-and-rationale.md`](../../docs/architecture/reference/cv-tilt-content-and-rationale.md)
  (currently a stub; populated during the retirement work).
- LinkedIn is **not downstream of the graph roadmap**. The earlier "subsumed"
  framing was wrong; LinkedIn derives from the editorial CV and
  `editorial-guidance.md`.
- `dependency-cruiser` is **pre-committed as a ninth blocking gate**. A
  dedicated cleanup session will resolve whatever the first strict run
  surfaces. Adoption Phase 12 gives this work its canonical home alongside
  the other validators.
- Visible HTML is still not graph-derived. The graph drives JSON-LD, the
  manifest, and some metadata.
- The previous session was a planning slice — no code, no dependency, no
  content changes — plus the Practice Core adoption plan authored, moved
  into `.agent/plans/active/`, expanded for cross-platform coverage and
  validation, and committed.
- The dead `continual-learning` Cursor-plugin skill (and its orphaned
  `.cursor/hooks/state/` payload) is fully replaced by the Practice's own
  learning loop (napkin → distilled → `consolidate-docs`). Adoption
  Phase 1 deletes the orphaned hook state; Phase 9 sweeps any remaining
  textual references in `AGENTS.md` and the distillation skill.

## How to choose a thread

- **default**: start the Practice Core adoption (do-first section above)
- pick **Track B (1)** if continuing the primary product design surface and
  the adoption is not yet underway (accept rework risk)
- pick **LinkedIn (2)** if Jim is available for collaborative editorial work
- pick **Tilt retirement (3)** if you want to remove design ambiguity for
  Track B by reducing the live surface (best run after adoption Phases 4 and 8)
- pick **Dev-tooling hygiene (4)** if you want a maintenance session before
  any further product work (best run after adoption Phase 12)

Each thread has its own handoff prompt with full grounding. Open the chosen
prompt and follow it.

## Cross-thread notes

- Tilt retirement (3) and Track B (1) interact only in scope — both are
  consistent with single-canonical-view. They can run in either order.
- Dev-tooling hygiene (4) is independent of all other threads. Running it
  first reduces gate noise during later product slices, but its work is
  partially absorbed by adoption Phase 12 (validator estate); coordinate.
- LinkedIn (2) may surface editorial-fact corrections in
  `content/cv.content.json`. Treat any such corrections as a separate slice
  with full gates.
