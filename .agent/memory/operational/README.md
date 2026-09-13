# Operational Memory

Continuity / session-resume memory. The surfaces here answer the
question *"where are we right now, what's live, what's next."* They
let the next session (human or agent) recover orientation after any
interruption, handoff, or restart.

See [`.agent/memory/README.md`](../README.md) for the three-mode
memory taxonomy (active / operational / executive). Doctrine for the
continuity-surface split lives in
[PDR-011](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(portable Practice doctrine).

## Surfaces

| Surface | Purpose | Horizon | Writers | Authority |
| --- | --- | --- | --- | --- |
| [`repo-continuity.md`](repo-continuity.md) | Canonical repo-level continuity contract | Current session to a few sessions | `session-handoff` | Canonical for continuity contract; subordinate to active plans for scope |
| [`threads/<slug>.next-session.md`](threads/README.md) | Continuity-unit next-session record — identity table + landing target + lane state for a named stream of work that persists across sessions | Indefinite; deleted when thread archives | `session-handoff`; each joining session adds/updates its identity row per the additive-identity rule (PDR-027) | Identity + next-session landing + lane state authoritative for the thread; subordinate to plans for scope |
| [`pending-graduations.md`](pending-graduations.md) | Canonical pending-graduations register: decision-debt entries (status pending/due/overdue) awaiting graduation or rejection; do not create shard-like sidecar buffers | Until every entry is graduated, rejected, or duplicate — the empty buffer is the target (PDR-100) | `consolidate-docs` / curator passes | Live decision-debt; not archive material |
| [`open-questions.md`](open-questions.md) | Register of non-urgent unresolved planning, design, or process questions | Until answered in place, surfaced to owner, withdrawn, or left open with deferral-honesty | Any agent appends; `consolidate-docs` drains | Sibling to pending-graduations; subordinate to active plans, ADRs, and PDRs |
| [`collaboration-state-conventions.md`](collaboration-state-conventions.md) | Operational guide to live state in `.agent/state/collaboration/` (lifecycle, schema-field provenance, trusted-agents threat model) | Indefinite; evolves alongside `.agent/state/` surfaces | `consolidate-docs` and amendments to `agent-collaboration.md` | Subordinate to `agent-collaboration.md` directive for doctrine |
| [`collaboration-state-lifecycle.md`](collaboration-state-lifecycle.md) | Detailed recipes for opening, refreshing, closing, archiving, and reporting collaboration state | Indefinite; evolves alongside `.agent/state/collaboration/` lifecycle rules | Collaboration protocol implementation and remediation passes | Subordinate to `collaboration-state-conventions.md` for state indexing |
| [`ephemeral-to-permanent-homing.md`](ephemeral-to-permanent-homing.md) | Shared methodology for moving content out of ephemeral surfaces into permanent homes; `session-handoff` and `consolidate-docs` defer to it | Indefinite | Consolidation passes that refine the method | Methodology, not state; subordinate to the skills that invoke it |
| [`frictions-register.md`](frictions-register.md) | Capture surface for frictions, gaps, and observed failures in the agent tooling substrate; items mature into a plan line, a plan, or a direct fix | Until each entry matures or is withdrawn | Any agent that meets a tooling friction | Capture only, never an execution plan; subordinate to plans |
| [`diagnostics/`](diagnostics/README.md) | Append-only operational diagnostic traces and evidence bundles that support later decisions and consolidation | Indefinite; historical traces are retained, never rewritten | Diagnostic sessions and consolidation | Evidence, not conclusions; the substrate manifest's `memory-operational-diagnostics` entry is its substrate contract and this directory's README its content contract |
| [`quarantine/`](quarantine/README.md) | Doctrine or guidance removed from circulation pending owner review; read-only for agents, never applied | Until the owner re-authors or archives each item | Consolidation and owner-directed quarantine or disposition edits | Not guidance; the manifest's `memory-operational-quarantine` entry is its substrate contract and this directory's README its content contract |
| `documentation-sync-logs/` | Per-collection documentation-sync logs, one section per phase, kept by the plan templates' documentation-propagation component | Runtime-created at a collection's first propagation step; absent until then | The documentation-propagation plan component | The manifest's `memory-operational-documentation-sync-logs` entry is the contract |

## Authority Order

The authority order is a **tiebreaker for same-scope conflicts**, not
a gating rule across different-scope claims. When two surfaces
disagree on the same field, the higher-authority surface wins. It
does not mean a higher-authority surface must contain or override
lower-authority surfaces' scope-specific content.

1. **Plans** (`.agent/plans/*/active/*`) — scope, sequencing,
   acceptance criteria, validation.
2. **`repo-continuity.md`** — canonical continuity contract.
3. **`threads/<slug>.next-session.md`** — thread-level identity +
   next-session landing + lane state.

## Relationship to Other Memory Modes

- **Active memory** (`../active/`) — learning loop (napkin, distilled,
  patterns). Operational memory is NOT a second memory doctrine;
  promotable signals in thread records route into active
  memory via the normal capture/distil pipeline.
- **Executive memory** (`../executive/`) — organisational contracts.
  Operational memory is short-horizon; executive memory is stable.

## Relationship to Directives

Directives are read-and-internalise (doctrine). Operational memory is
read-and-written (state). The orientation directive
(`.agent/directives/orientation.md`) names the layering contract that
governs how these surfaces compose.
