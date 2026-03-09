# Napkin

## Session: 2026-03-09 — Track A Phase A2 Output Audit

### What Was Done

- Verified the live Track A publication surfaces from implementation and
  targeted tests before editing the plan stack: inline page JSON-LD,
  `/api/graph`, `Accept: application/ld+json`, `manifest.webmanifest`, and the
  current graph-derived CV metadata
- Implemented the first narrow Track A Phase A3 slice for negotiated graph
  responses: page routes now negotiate to the graph for both
  `application/ld+json` and `application/json`, and the graph route returns the
  same JSON-LD payload with a response `Content-Type` that matches the request
- Added `.agent/plans/research/graph-publication-output-audit.md` as the Track
  A Phase A2 research note, classifying current findings into correctness
  problems, weak expression, proof gaps, and deliberate low-priority channels
- Updated the roadmap, Track A execution plan, Track B design plan, the
  current-state audit, and the Phase A1 consumer/proof model so they all agree
  that Track A Phase A2 is complete and Track A Phase A3 is next
- Raised the visual regression harness from a historical proof asset to a live
  blocking proof requirement for rendering-risk work, and documented that it
  must run during implementation rather than only at the end
- Ran `pnpm visual-regression-harness HEAD WORKTREE` for the current in-flight
  slice and confirmed no unexpected differences across the captured site
  surfaces (`/`, `/cv`, `/cv/public_sector`)
- Corrected a live-stack consistency slip after that work: the roadmap prose
  already said Track A Phase A3 was active, but its frontmatter todo still said
  Track A refinement and proof were pending, and the A2 audit next steps still
  read as if the negotiated media-type slice had not landed yet
- Corrected one remaining research-note lag after that cleanup: the
  current-state audit still described the visual regression harness only as a
  closed historical proof record instead of also reflecting its new live
  blocking-proof role for rendering-risk slices
- Promoted the resulting process lesson into permanent docs: the
  consolidate-docs workflow and portable practice-core wording now explicitly
  treat frontmatter status, narrative status, next-step sections, and
  current-state or audit notes as one truth-maintenance pass
- Tightened the live Track A execution plan so a fresh agent now has an
  explicit next-session handoff in the plan itself, not only an ordered list in
  the supporting A2 audit note

### Mistakes Made

- Tried to use `pnpm exec tsx -e` in the sandbox to inspect module outputs more
  directly. `tsx` attempted to open an IPC pipe under `/var/...` and hit
  `EPERM`. For this repo, treat `tsx` the same way as local web servers: if the
  sandbox blocks IPC or binding behaviour and the check matters, rerun with
  escalation or rely on existing proof surfaces plus source inspection.
- Let the live plan stack lag one implementation slice behind after shipping
  the negotiated media-type change. The fix itself was documented, but the
  execution plan and A1/A2 follow-on notes still read as if that slice had not
  yet landed.
- Left one smaller status mismatch behind after tightening the harness rule:
  roadmap narrative and todo status diverged. When a phase becomes active,
  check frontmatter task state as well as body text.
- Missed one secondary research-note update after changing the repo-wide
  harness rule. When a tool or proof surface changes role, re-check not only
  live execution plans but also "current state" notes that summarise the stack.

### Patterns to Remember

- A clean Track A audit can legitimately end with "no correctness problems
  found". If the live evidence is green, the next value may be proof coverage
  and better channel expression rather than more graph enrichment.
- For the current publication layer, the clearest refinement opportunities are
  home-page emitted-channel proof, manifest proof, and the exact contract of
  `Accept: application/ld+json`. Do not let those gaps get blurred into Track B
  source-of-truth ambitions.
- If the same graph payload is served under both `application/ld+json` and
  `application/json`, centralise the Accept matching in product code. That
  keeps the proxy rewrite rule and the route response contract from drifting
  apart.
- After shipping even a narrow slice from the next phase, check the live parent
  and follow-on docs immediately. Otherwise the implementation can be truthful
  while the execution status and open-gap list are one step behind.
- For plan docs in this repo, narrative status, frontmatter todo status, and
  "recommended next steps" all need the same pass. Fixing only one of those
  layers still leaves a stale handoff for the next agent.
- When a proof mechanism shifts from historical evidence to a live blocking
  requirement, update both the workflow docs and any audit note that summarises
  current validation infrastructure. Otherwise the repo truth is split between
  "how we work now" and "what the architecture note still says".
- During consolidation, treat frontmatter status, body status, recommended next
  steps, and current-state summaries as one consistency surface. Updating only
  one layer leaves a believable but stale handoff.
- If a supporting research note contains the real ordered next steps, copy the
  immediate handoff back into the live execution plan as well. A fresh agent
  should not have to infer the first move by combining multiple docs.
- When a repo already has a review-oriented harness, "blocking proof
  requirement" does not have to mean "convert it into CI-style pass/fail". It
  can mean the review workflow itself becomes mandatory and must happen before
  work continues.

## Session: 2026-03-09 — Track A Phase A1 Consumer and Proof Model

### What Was Done

- Verified the current rendering path from implementation before touching the
  graph plans: home-page HTML still comes from `content/frontpage.content.json`
  and CV/tilt HTML still comes from `content/cv.content.json`
- Verified the current graph publication path from implementation: inline page
  JSON-LD, `/api/graph`, `Accept: application/ld+json`, the manifest, and the
  existing graph-derived CV metadata
- Added
  `.agent/plans/research/graph-publication-consumer-and-proof-model.md` as the
  Track A Phase A1 research note covering consumers, channels, impacts, value
  mechanisms, proof criteria, validation surfaces, reviewers, and non-goals
- Updated the live PKG roadmap, execution plan, source-of-truth design plan,
  and current-state audit so they cross-link the new Phase A1 authority and
  agree that Track A Phase A2 is next

### Mistakes Made

- Tried to read `app/cv/[variant]/page.tsx` without quoting the path, and zsh
  expanded the brackets as a glob. Quote route paths with brackets when using
  shell commands.
- Broke the repo's gate discipline once by starting `pnpm typecheck` and
  `pnpm test` in parallel. Even read-only gates should be run one at a time in
  this repo so the reported evidence is clean and ordered.

### Patterns to Remember

- For Track A planning, derive scope from the code paths that already publish
  graph outputs. Machine-readable does not automatically mean graph-owned:
  markdown, PDF, sitemap, robots, and home-page metadata are out of scope
  unless the implementation really routes them through the graph.
- The current publication layer has stronger automated proof for inline JSON-LD
  and the full graph API than it does for the manifest. Track A audits should
  treat proof gaps as first-class findings, not as implementation trivia.
- The home-page subgraph is validated in product code, but the repo does not
  yet have end-to-end proof that the inline JSON-LD script is emitted on `/`.
  Keep the distinction between graph correctness and emitted-channel proof.
- Do not question whether the chosen direction is important once the user has
  already decided it. Treat direction as settled unless the user reopens it.
- Proof is always required. The right question is whether the current evidence
  proves the intended outcome, not whether proof itself is necessary.

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

## Session: 2026-03-09 — Graph Evaluation Grounding

### What Was Done

- Grounded the graph-metaplan evaluation in current implementation evidence,
  not just the plan stack, by checking the rendering path, JSON-LD
  publication, graph API, manifest derivation, and graph-related tests

### Patterns to Remember

- When assessing graph plans, verify the live rendering and publication paths
  first. Otherwise it is too easy to evaluate the plan stack against its own
  claims rather than against the implemented system.

## Session: 2026-03-09 — Adopted Graph Plan Stack

### What Was Done

- Adopted the graph roadmap, Track A execution plan, and Track B design plan
  under `.agent/plans/current/`
- Retired the metaplan in place as a completed reset record
- Initially replaced the old draft docs with historical stubs so archived links
  would still resolve

### Mistakes Made

- Treated doc-path preservation as more important than the repo rule against
  compatibility layers. For plan adoption work here, clean breaks matter more
  than keeping legacy draft paths alive.

### Patterns to Remember

- When draft plans are promoted to live authority in this repo, remove the old
  draft files rather than leaving stubs behind. Clean breaks beat compatibility
  layers, even for planning artefacts.

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

## Session: 2026-03-09 — Draft Plan Topology

### What Was Done

- Created `.agent/plans/drafts/` for preserved graph roadmap and successor-plan
  drafts
- Moved the graph roadmap draft, Track A execution draft, and Track B
  source-of-truth design draft out of `current/` and `research/`
- Repaired graph-plan, PKG-skill, reviewer, roadmap, and historical-plan
  references so the metaplan remains the only current graph entry point

### Patterns to Remember

- If a document is explicitly a preserved draft for later assessment, do not
  leave it under `current/`. A dedicated `drafts/` location removes avoidable
  ambiguity for the next session.

## Session: 2026-03-09 — Consolidation Truthfulness Pass

### What Was Done

- Removed stale `drafts/` descriptions from `.agent/README.md` and
  `.agent/practice-index.md` after the clean break from preserved graph-plan
  draft files
- Promoted three stable repo facts into `docs/architecture/README.md`: the
  canonical public host, the PostCSS `.mjs` constraint, and the `tsx`
  path-alias limitation
- Trimmed those now-permanent facts back out of `distilled.md` and rewired the
  `AGENTS.md` anchor for the PostCSS gotcha to point at permanent docs again
- Rechecked the practice box and practice-context surfaces: no incoming
  material beyond `.gitkeep` and placeholder READMEs
- Confirmed all directive and practice-core fitness ceilings remain under
  their declared limits

### Patterns to Remember

- Distilled memory should shrink when a fact graduates. If a quick-reference
  rule becomes stable enough to shape recurring setup or build decisions, move
  it to permanent docs and remove the duplicate from `distilled.md`.
- A plan-topology clean break is not finished until the repo indexes and
  directory maps stop describing the removed layer.

## Session: 2026-03-09 — Roadmap Re-entry Grounding

### What Was Done

- Re-entered the graph work through the adopted
  `personal-knowledge-graph-roadmap.plan.md` after the plan-stack commit
- Reconfirmed from `graph-current-state-audit.md` that the current site is
  still split-owned: page JSON drives visible rendering, while the graph drives
  JSON-LD, the manifest, and some metadata
- Reconfirmed that the next active work is Track A Phase A1: define consumers,
  channels, intended impacts, and proof criteria before any further graph
  refinement

### Patterns to Remember

- The roadmap is the parent authority, but the first actionable entry point for
  execution is Track A Phase A1. Do not jump into enrichment work before the
  impact model is explicit.

## Session: 2026-03-09 — Track A Phase A3 Home-Page Emitted-Channel Proof

### What Was Done

- Added route-level proof in `e2e/behaviour/seo.e2e-api.test.ts` that `/`
  emits the inline JSON-LD script and that the emitted home `ProfilePage`
  keeps the canonical root-page identity
- Added focused contract proof in
  `lib/page-document-contract.integration.test.ts` that `frontPageJsonLd`
  still matches the home page-document contract
- Updated the live Track A execution and research notes so the next handoff is
  manifest proof first, then tighter CV metadata proof

### Mistakes Made

- Tried to import `page-document-contract.ts` directly into the Playwright SEO
  spec. Node's ESM runner rejected the module because it depends on JSON
  imports that the Next/Vite toolchain resolves without explicit
  `with { type: "json" }` attributes.

### Patterns to Remember

- When an E2E proof needs product-owned contract values from a module that
  relies on bundler-resolved JSON imports, split the proof cleanly: keep the
  emitted-channel assertion in Playwright and the contract assertion in Vitest
  unless there is a deliberate reason to harden the production module for raw
  Node ESM use.
- After a proof-only Track A slice lands, update both the execution handoff and
  the ordered next steps in the A2 audit, even if the active phase does not
  change.

## Session: 2026-03-09 — Track A Phase A3 Manifest Proof

### What Was Done

- Added `app/manifest.integration.test.ts` to prove that the Track A-owned
  manifest identity fields stay aligned with `person`
- Added `e2e/behaviour/manifest.e2e-api.test.ts` to prove that
  `/manifest.webmanifest` returns `application/manifest+json` and emits the
  same Track A-owned identity fields
- Updated the live Track A execution and research notes so the next handoff is
  the remaining CV metadata description proof gap

### Patterns to Remember

- For Track A manifest work, keep the boundary explicit: prove only `name`,
  `short_name`, and `description`. Icons, colours, display mode, and
  `start_url` remain app-owned unless the architecture actually changes.
- A proof-only metadata-route slice does not need the visual regression harness
  when no rendered HTML, graph payload, metadata wiring, or rendering plumbing
  changes.
- For Playwright API proof that should stay decoupled from app module imports,
  importing `content/entities.json` with an explicit JSON import attribute is a
  clean way to source expected graph-backed identity fields.
