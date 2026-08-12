# Roadmap

Where everything stands and what depends on what.

**Session start — which plan is primary:** open **`active/`** — the active plan file lives there; start with **[`active/README.md`](active/README.md)** for the filename and context. This table summarises the full stack.

## Active work

| Plan                                                                                     | Status      | Summary                                                                                                                                                                                              | Next action                                                                              |
| ---------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [Source-of-Truth Design](active/personal-knowledge-graph-source-of-truth-design.plan.md) | In progress | Current Track B plan, scoped to a single canonical CV view. Phase B1 is complete; Phase B2.1 is the next graph-design slice and now the primary repo-wide workstream.                                | Resume Task B2.1.                                                                        |
| [CV Editorial Improvements](current/cv-editorial-improvements.plan.md)                   | In progress | Parent editorial plan. Positioning, capabilities, metadata, experience, and Before Oak are settled. Remaining work now runs through dedicated plans below.                                           | Use the dedicated plans (graph, LinkedIn, tilt-retirement, dev-tooling) for active work. |
| [PKG Roadmap](current/personal-knowledge-graph-roadmap.plan.md)                          | In progress | Parent graph roadmap. Track A is complete for the current publication surface; Track B is now the active source-of-truth design track for a single canonical CV view.                                | Advance Track B Phase B2.1.                                                              |
| [Graph Expression Execution](current/personal-knowledge-graph-execution.plan.md)         | Complete    | Track A plan for improving the existing graph layer as a deliberate publication surface. Completed for the current publication surface.                                                              | Re-open only if the publication surface changes materially.                              |
| [LinkedIn Update](current/linkedin-update.plan.md)                                       | In progress | Private working-draft iteration guided by editorial strategy and voice. LinkedIn composition is distinct from the CV; no graph dependency.                                                           | Continue the About section; the headline is closed unless Jim reopens it.                |
| [Tilt Retirement](current/tilt-retirement.plan.md)                                       | Verifying   | PR #36 replacement has removed audience-tilt routes, adjacent headline toggle, tilt content and graph statements; local full-gate, 49-test E2E, and zero-pixel-difference visual proof are complete. | Complete preview/review/merge; then archive.                                             |
| [Dev-Tooling Hygiene](current/dev-tooling-hygiene.plan.md)                               | In progress | PR #36 replacement refreshes all patch/minor lines and security-driven majors to audit zero; local full-gate, E2E, and visual proof are complete. Six parked majors and dependency-cruiser remain.   | Complete preview/review/merge, then sequence the six parked majors and layering gate.    |

**Durable graph design decisions live in** [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) **and the related ADRs in** `docs/architecture/decision-records/`.
**Current graph authorities are** [personal-knowledge-graph-roadmap.plan.md](current/personal-knowledge-graph-roadmap.plan.md), [graph-current-state-audit.md](research/graph-current-state-audit.md), [personal-knowledge-graph-execution.plan.md](current/personal-knowledge-graph-execution.plan.md), [graph-source-of-truth-layer-map.md](research/graph-source-of-truth-layer-map.md), **and** [personal-knowledge-graph-source-of-truth-design.plan.md](active/personal-knowledge-graph-source-of-truth-design.plan.md).
**The graph reset record is** [graph-metaplan.plan.md](archive/graph-metaplan.plan.md).
**Historical PKG references live in** [archive/personal-knowledge-graph-phase-model.plan.md](archive/personal-knowledge-graph-phase-model.plan.md) **and** [research/personal-knowledge-graph-design-notes.md](research/personal-knowledge-graph-design-notes.md).

## Future

| Plan                                                                                            | Summary                                                                                                      |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Visual Regression Harness Enhancements](future/visual-regression-harness-enhancements.plan.md) | Commit-addressed artifact directories, capture reuse, and `--force`. Non-blocking harness improvements only. |
| [Neo4j Knowledge Graph](future/neo4j-knowledge-graph.plan.md)                                   | Migrate the JSON entity model to a graph database. Not current work — exists to shape PKG design decisions.  |

## Deferred — door open

These are tracked in the [parent plan](current/cv-editorial-improvements.plan.md). Each entry names what would let it return.

| Item                        | Reason for deferral                                                                               | Re-entry condition                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Tilt mechanism              | Audience-tilt routes are retired by ADR-021 so Track B scopes to a single canonical editorial CV. | A real product requirement for audience-specific CV variants. Re-entry starts from the preserved tilt reference doc + B1 layer map. |
| Tilt content                | Depends on tilt mechanism. Content preserved in the tilt reference doc.                           | Tilt mechanism plan is opened.                                                                                                      |
| A/B testing / user feedback | No infrastructure exists, and Track B does not require it.                                        | An explicit A/B testing plan with stated consumers, infrastructure choices, and proof model.                                        |

## Dependencies

```text
CV Editorial Improvements (parent)
├── PKG Roadmap (current graph authority)
│   ├── Graph current-state audit (research baseline)
│   ├── Graph Expression Execution (Track A, complete)
│   │   ├── Visual regression harness plan (archive proof record)
│   │   │   └── Visual regression harness enhancements (future)
│   ├── Source-of-truth design (Track B, primary active plan — single canonical view)
│   │   ├── Source-of-truth layer map (B1 complete)
│   │   └── Neo4j Knowledge Graph (future shaping input)
│   └── Graph Metaplan (archive reset record)
├── LinkedIn Update (parallel-runnable; draws evidence from the editorial CV)
├── Tilt Retirement (parallel-runnable; preserves content as reference)
│   └── Tilt mechanism + content (deferred door-open; re-entry via reference doc)
└── Dev-Tooling Hygiene (parallel-runnable; deps + dependency-cruiser as 9th gate)
```

**Sequencing:** the Practice Core adoption is now complete and archived. Track B
Phase B2.1 is the primary repo-wide workstream. LinkedIn, tilt-retirement, and
dev-tooling remain parallel-runnable current threads around it.

- **Track B** is now scoped to a single canonical CV view; tilt composition is
  not part of its design.
- **Tilt retirement** is implemented and locally proved in the PR #36
  replacement; preview/review/merge remain. ADR-021 records the accepted
  canonical-only state.
- **LinkedIn** has no architectural dependency on either; the earlier
  "subsumed" framing was incorrect.
- **Dev-tooling hygiene** is independent maintenance; `dependency-cruiser` is
  pre-committed to land as a 9th blocking gate (with a dedicated cleanup
  session for whatever its first run surfaces).

**Current state:** the graph is an active concern. Editorial prose and full page
composition are not yet graph-derived, while ADR-020 adopts bounded
Person-owned identity atoms injected at composition boundaries. Use the adopted
roadmap and its linked authorities for current graph work. Codex platform
alignment is complete; its durable architecture lives in ADR-015.

## Archive

Completed plans live in [`archive/`](archive/). The most relevant for current context:

| Plan                                                                                 | What it delivered                                                                                                                   |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| [Graph Metaplan](archive/graph-metaplan.plan.md)                                     | The reset that established the truthful baseline, required the value-led reassessment, and handed off to the adopted graph roadmap. |
| [Practice Core Wholesale Adoption](archive/practice-core-wholesale-adoption.plan.md) | The structural Practice migration: canonical lanes, five-platform adapter estate, validator suite, and workflow contract.           |
| [Codex Platform Alignment](archive/codex-platform-alignment.plan.md)                 | Real Codex reviewer sub-agents, canonical thin-adapter split, and ADR-015 for the durable Codex model.                              |
| [Visual Regression Harness](archive/visual-regression-harness.plan.md)               | Review-oriented non-destructive harness, `WORKTREE` support, and the closed PKG proof record.                                       |
| [Experience Editorial](archive/experience-editorial.plan.md)                         | Research rewrite, voice fixes, capabilities consistency (21 items).                                                                 |
| [Capabilities Editorial](archive/capabilities-editorial.plan.md)                     | Five blended capabilities with concrete anchors.                                                                                    |
| [Meta & SEO Content Audit](archive/meta-seo-content-audit.plan.md)                   | `meta.summary`, KNOWS_ABOUT (20→34), OCCUPATION, OG descriptions.                                                                   |
| [Front Page Content](archive/front-page-content.plan.md)                             | Personal narrative front page.                                                                                                      |

Infrastructure plans (also complete): E2E testing, PDF generation, component audit, RTL setup, Tailwind hygiene, section primitives, footer/header/CV layout/root layout refactors, onboarding docs.
