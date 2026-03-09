# Napkin

## Session: 2026-03-08 — Harness Artefact Approval and Icebox Split

### What Was Done

- Closed the historical PKG proof loop by recording the remaining
  harness review items as explicitly approved categories:
  page-level JSON-LD additions and the deliberate `/cv/` canonical
  metadata correction
- Moved the harness proof record into
  `.agent/plans/complete/visual-regression-harness.plan.md`
- Created `.agent/plans/icebox/` and moved non-active future work there,
  including the new harness-enhancements plan and the Neo4j migration
  plan
- Updated the PKG plans, roadmap, harness README, and related cross-links
  so they now treat the visual proof as closed and the enhancement work
  as icebox only
- Rotated the overgrown napkin to
  `.agent/memory/archive/napkin-2026-03-08.md`

### Patterns to Remember

- If a plan's live closure work is done, do not leave speculative
  enhancements inside it. Split them into an icebox plan so the active
  or completed plan describes reality rather than possibility.
- A harness review item can be closed by explicit approval when the diff
  is intentional, non-visual, and backed by product-owned validation.
  Approval is a documented decision, not a silent ignore rule.

## Session: 2026-03-09 — Deep Plan and Prompt Consolidation

### What Was Done

- Audited the current PKG plans, the archived/complete plans, and the
  prompt files for stale status markers, broken cross-links, and durable
  content still living only in ephemeral places
- Fixed plan-directory reorg fallout where `current/` plans still linked
  to `complete/` and `research/` as if they were siblings
- Updated the PKG execution, implementation, historical-design, and
  parent editorial plans so they all agree that the harness proof is
  closed and that the remaining PKG Phase 4 work is manual validator
  follow-up plus Phase 5
- Archived the superseded `pkg-next-closure_c4586ceb.plan.md` handoff
  into `complete/` so it no longer looks like active work
- Aligned `start-right.prompt.md` with the canonical `jc-start-right`
  command, including the excellence-over-expediency wording

### Patterns to Remember

- After reorganising a plans tree into `current/`, `complete/`,
  `icebox/`, and `research/`, do a relative-link audit from the point of
  view of each file's directory. Root-relative habits leave quiet broken
  links inside otherwise-correct docs.
- Superseded handoff notes should not stay under `current/`. If their
  live work has been absorbed elsewhere, move them out of the active
  directory and relabel them as historical context.

## Session: 2026-03-09 — DRY Ownership Cleanup

### What Was Done

- Made `.agent/prompts/start-right.prompt.md` the canonical start-right
  workflow and reduced `.agent/commands/jc-start-right.md` to a thin
  wrapper
- Reduced PKG live-status duplication by making the execution plan the
  explicit owner of mutable status, while the implementation plan,
  parent plan, and roadmap now summarise and point

### Patterns to Remember

- Deliberate repetition is fine when it reinforces norms for different
  audiences or decision points. The DRY problem appears when two files
  both own the same mutable workflow or live status.
- For plan stacks, keep one mutable execution source and let parent,
  roadmap, and implementation docs summarise structure and intent rather
  than restating current gate or proof details.

## Session: 2026-03-09 — One Current PKG Plan

### What Was Done

- Reduced the PKG plan set in `.agent/plans/current/` to a single live
  plan: `personal-knowledge-graph-execution.plan.md`
- Moved the historical design working document to
  `.agent/plans/research/personal-knowledge-graph-design-notes.md`
- Moved the full phase model and acceptance-criteria document to
  `.agent/plans/complete/personal-knowledge-graph-phase-model.plan.md`
- Rewired references across roadmap, parent plans, LinkedIn reference
  plan, PKG skill docs, reviewer docs, the Neo4j icebox plan, and older
  completed plans so the new topology resolves cleanly

### Patterns to Remember

- The right simplification is often one current plan, not one document
  total. Live execution, archived phase models, and historical design
  notes serve different jobs and should not all compete inside
  `current/`.

## Session: 2026-03-09 — Graph Metaplan Reframe

### What Was Done

- Reframed the graph work around a truthful baseline instead of the old
  single-sequence PKG narrative
- Added a parent `graph-metaplan.plan.md`, a strategic
  `personal-knowledge-graph-roadmap.plan.md`, a `graph-current-state-audit.md`
  record, and a Track B
  `personal-knowledge-graph-source-of-truth-design.plan.md`
- Rewrote `personal-knowledge-graph-execution.plan.md` as the Track A
  graph-expression plan
- Updated the repo roadmap, the CV parent plan, LinkedIn reference plan,
  PKG skill docs, and PKG reviewer prompt so the live plan stack now reflects
  the two-track structure

### Patterns to Remember

- A valid graph and valid JSON-LD do not mean the website is graph-derived.
  Live plans must distinguish current implementation truth from target-state
  architecture.
- When a planning model has drifted, add an explicit current-state audit
  before rewriting the plan stack. Otherwise the new structure inherits the
  old ambiguity.

## Session: 2026-03-09 — Metaplan Boundary and Value Traceability

### What Was Done

- Corrected the graph-metaplan scope so this session ends at the audit and the
  metaplan itself
- Preserved the candidate roadmap and successor-plan drafts, but relabelled
  them as draft inputs for the next session rather than adopted live authority
- Updated the roadmap, parent plans, PKG skill docs, and reviewer prompt so
  they point at the metaplan and audit as the current graph authorities
- Added a durable Practice rule that every non-trivial piece of work must be
  traceable to a defined outcome, the impact it should create, and the
  mechanism by which that impact creates value

### Patterns to Remember

- A metaplan is not implemented just because candidate successor docs have been
  drafted. If the current task is audit plus metaplan authoring, then roadmap
  and execution drafts must stay explicitly provisional until the next session
  assesses and adopts them.
- Goals and impacts are not enough on their own. Plans need the bridge from
  outcome to impact to value, or they drift into mechanism-first work and can
  solve only a narrow slice of the intended problem.

## Session: 2026-03-09 — Permanent Graph Truth and Practice-Core Structure

### What Was Done

- Moved the stable current-state graph/content ownership truth out of the graph
  audit and into `docs/architecture/README.md` and
  `docs/architecture/content-model.md`
- Clarified in permanent architecture docs that the site currently uses two
  related content layers: page-composition JSON for rendered HTML and the
  entity graph for JSON-LD, manifest, and some metadata
- Promoted the value-traceability planning rule into `practice-lineage.md` and
  the practice-core changelog, not just local directives and commands
- Tightened `practice.md` and `practice-bootstrap.md` so plan templates are
  treated as optional supporting artefacts rather than as a required
  `.agent/plans/templates/` subtree

### Patterns to Remember

- If a current-state architecture truth is stable and operationally important,
  it should not live only in a plan or audit. Move it into permanent
  architecture docs, especially when it corrects a likely misunderstanding.
- Practice-Core cohesion needs structural checks, not just content checks. If a
  repo does not actually rely on a required-looking directory layer, the core
  should describe that layer as optional or remove the assumption entirely.

## Session: 2026-03-09 — Practice Context Is Transient

### What Was Done

- Tightened the optional `.agent/practice-context/` pattern so the Core now
  says to remove it when the exchange is complete

### Patterns to Remember

- If something is genuinely transient, the cleanup step must be explicit in the
  integration flow. "Safe to delete" is weaker than "remove it when done" and
  leaves avoidable ambiguity behind.

## Session: 2026-03-09 — AGENTS Drift Cleanup

### What Was Done

- Validated a user correction to `AGENTS.md` against the actual Codex adapter
  layout in `.agents/skills/`, `.codex/`, and the canonical reviewer templates
- Strengthened `.codex/README.md` so the durable Codex model explicitly states
  that reviewer sub-agents are not skills
- Promoted the relative-link audit lesson into `jc-consolidate-docs.md`
- Removed stale pending-distillation residue from `AGENTS.md` and restored the
  collaborative-credit anchor so the landing pad does not silently lose
  anti-duplication protection
- Tightened the outgoing practice-context package so it carries only
  high-signal local rationale
- Added a repo-specific Codex adoption report to
  `.agent/practice-context/outgoing/` so future repos can learn from a
  completed first-class Codex wiring without pushing that platform detail into
  the portable Core
- Corrected the practice-context lifecycle model so `outgoing/` is
  sender-maintained support material that can build up over time, while
  `incoming/` is the receiver-side transient surface that must be cleared after
  integration
- Updated the consolidation command so changelog updates now trigger an
  explicit check for whether a supporting outgoing-context note would help a
  receiving repo

### Patterns to Remember

- If `AGENTS.md` holds stable structural truth, graduate that truth to the
  canonical docs and keep anchors where appropriate. Landing pads are useful
  entry points, but they are bad long-term owners of behaviour.
- The outgoing/incoming split only works if the lifecycle is asymmetric:
  outgoing may persist and accumulate; incoming must be read, integrated, and
  then cleared.

## Session: 2026-03-09 — Consolidation Audit Follow-Through

### What Was Done

- Re-ran the consolidation audit after the practice-context, Codex, and
  changelog-lifecycle work
- Confirmed the practice box is clean: `.agent/practice-core/incoming/`
  contains only `.gitkeep`, and `.agent/practice-context/incoming/` contains
  only its README
- Tightened stale wording in `lib/cv-content.ts` and ADR-007 so they no longer
  imply a still-current single-source content model
- Reclaimed a few lines of headroom in `practice-lineage.md` and
  `practice-bootstrap.md` so the fitness ceilings stay meaningful

### Patterns to Remember

- Historical ADRs can stay accepted and still need clarification notes when the
  current architecture has moved on. The goal is not to rewrite history; it is
  to stop historical wording from masquerading as current truth.
- Ceiling compliance with zero headroom is fragile. If a core file is sitting
  one line below its limit, tighten it before the next small change turns
  routine upkeep into forced restructuring.
