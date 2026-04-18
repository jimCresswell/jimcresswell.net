# Roadmap

Where everything stands and what depends on what.

**Session start — which plan is primary:** open **`active/`** — the active plan file lives there; start with **[`active/README.md`](active/README.md)** for the filename and context. This table summarises the full stack.

## Active work

| Plan                                                                                     | Status      | Summary                                                                                                                                                                                        | Next action                                                                              |
| ---------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [CV Editorial Improvements](current/cv-editorial-improvements.plan.md)                   | In progress | Parent editorial plan. Positioning, capabilities, metadata, experience, and Before Oak are settled. Remaining work now runs through dedicated plans below.                                     | Use the dedicated plans (graph, LinkedIn, tilt-retirement, dev-tooling) for active work. |
| [PKG Roadmap](current/personal-knowledge-graph-roadmap.plan.md)                          | In progress | Parent graph roadmap. Track A is complete for the current publication surface; Track B is now the active source-of-truth design track for a single canonical CV view.                          | Advance Track B Phase B2.1.                                                              |
| [Graph Expression Execution](current/personal-knowledge-graph-execution.plan.md)         | Complete    | Track A plan for improving the existing graph layer as a deliberate publication surface. Completed for the current publication surface.                                                        | Re-open only if the publication surface changes materially.                              |
| [Source-of-Truth Design](active/personal-knowledge-graph-source-of-truth-design.plan.md) | In progress | Active Track B plan, scoped to a single canonical CV view. Phase B1 is complete; Phase B2 is active. Tilt composition + A/B testing deferred door-open.                                        | Deliver Task B2.1 (Page Selection and Ordering Model).                                   |
| [LinkedIn Update](current/linkedin-update.plan.md)                                       | Ready       | Collaborative editorial plan. Derives from the editorial CV and editorial-guidance; no graph dependency. Parallel-runnable.                                                                    | Pick up via the LinkedIn handoff prompt.                                                 |
| [Tilt Retirement](current/tilt-retirement.plan.md)                                       | In progress | Code-work plan to retire `/cv/[variant]` routes, `HeadlineToggle`, and tilt content. Preserves tilt content and canonical-alias rationale as a discoverable reference doc for future re-entry. | Execute the retirement slices, then supersede ADR-017.                                   |
| [Dev-Tooling Hygiene](current/dev-tooling-hygiene.plan.md)                               | Ready       | Two-phase plan: refresh outdated dependencies, then introduce `dependency-cruiser` as a 9th blocking quality gate.                                                                             | Pick up via the dev-tooling handoff prompt; deps-refresh phase first.                    |

**Durable graph design decisions live in** [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) **and the related ADRs in** `docs/architecture/decision-records/`.
**Current graph authorities are** [personal-knowledge-graph-roadmap.plan.md](current/personal-knowledge-graph-roadmap.plan.md), [graph-current-state-audit.md](research/graph-current-state-audit.md), [personal-knowledge-graph-execution.plan.md](current/personal-knowledge-graph-execution.plan.md), [graph-source-of-truth-layer-map.md](research/graph-source-of-truth-layer-map.md), **and** [personal-knowledge-graph-source-of-truth-design.plan.md](active/personal-knowledge-graph-source-of-truth-design.plan.md).
**The graph reset record is** [graph-metaplan.plan.md](graph-metaplan.plan.md).
**Historical PKG references live in** [complete/personal-knowledge-graph-phase-model.plan.md](complete/personal-knowledge-graph-phase-model.plan.md) **and** [research/personal-knowledge-graph-design-notes.md](research/personal-knowledge-graph-design-notes.md).

## Icebox

| Plan                                                                                            | Summary                                                                                                      |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Visual Regression Harness Enhancements](icebox/visual-regression-harness-enhancements.plan.md) | Commit-addressed artifact directories, capture reuse, and `--force`. Non-blocking harness improvements only. |
| [Neo4j Knowledge Graph](icebox/neo4j-knowledge-graph.plan.md)                                   | Migrate the JSON entity model to a graph database. Not current work — exists to shape PKG design decisions.  |

## Deferred — door open

These are tracked in the [parent plan](current/cv-editorial-improvements.plan.md). Each entry names what would let it return.

| Item                        | Reason for deferral                                                                                                                               | Re-entry condition                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Tilt mechanism              | Live tilt routes are being retired in [tilt-retirement.plan.md](current/tilt-retirement.plan.md) so Track B can scope to a single canonical view. | A real product requirement for audience-specific CV variants. Re-entry starts from the preserved tilt reference doc + B1 layer map. |
| Tilt content                | Depends on tilt mechanism. Content preserved in the tilt reference doc.                                                                           | Tilt mechanism plan is opened.                                                                                                      |
| A/B testing / user feedback | No infrastructure exists, and Track B does not require it.                                                                                        | An explicit A/B testing plan with stated consumers, infrastructure choices, and proof model.                                        |

## Dependencies

```text
CV Editorial Improvements (parent)
├── PKG Roadmap (current graph authority)
│   ├── Graph current-state audit (research baseline)
│   ├── Graph Expression Execution (Track A, complete)
│   │   ├── Visual regression harness plan (complete proof record)
│   │   │   └── Visual regression harness enhancements (icebox)
│   ├── Source-of-truth design (Track B, active — single canonical view)
│   │   ├── Source-of-truth layer map (B1 complete)
│   │   └── Neo4j Knowledge Graph (icebox shaping input)
│   └── Graph Metaplan (complete reset record)
├── LinkedIn Update (parallel-runnable; derives from editorial CV)
├── Tilt Retirement (parallel-runnable; preserves content as reference)
│   └── Tilt mechanism + content (deferred door-open; re-entry via reference doc)
└── Dev-Tooling Hygiene (parallel-runnable; deps + dependency-cruiser as 9th gate)
```

**Sequencing:** the four active threads are independent and can run in any
order. The primary design-surface focus remains Track B Phase B2.1.

- **Track B** is now scoped to a single canonical CV view; tilt composition is
  not part of its design.
- **Tilt retirement** is the code-work counterpart that removes the live tilt
  surface so Track B's scope reflects reality.
- **LinkedIn** has no architectural dependency on either; the earlier
  "subsumed" framing was incorrect.
- **Dev-tooling hygiene** is independent maintenance; `dependency-cruiser` is
  pre-committed to land as a 9th blocking gate (with a dedicated cleanup
  session for whatever its first run surfaces).

**Current state:** the graph is an active concern, but the visible website is
still not graph-derived. Use the adopted roadmap and its linked authorities for
current graph work. Codex platform alignment is complete; its durable
architecture lives in ADR-015.

## Complete

Completed plans live in [`complete/`](complete/). The most relevant for current context:

| Plan                                                                    | What it delivered                                                                                                                   |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [Graph Metaplan](graph-metaplan.plan.md)                                | The reset that established the truthful baseline, required the value-led reassessment, and handed off to the adopted graph roadmap. |
| [Codex Platform Alignment](complete/codex-platform-alignment.plan.md)   | Real Codex reviewer sub-agents, canonical thin-adapter split, and ADR-015 for the durable Codex model.                              |
| [Visual Regression Harness](complete/visual-regression-harness.plan.md) | Review-oriented non-destructive harness, `WORKTREE` support, and the closed PKG proof record.                                       |
| [Experience Editorial](complete/experience-editorial.plan.md)           | Research rewrite, voice fixes, capabilities consistency (21 items).                                                                 |
| [Capabilities Editorial](complete/capabilities-editorial.plan.md)       | Five blended capabilities with concrete anchors.                                                                                    |
| [Meta & SEO Content Audit](complete/meta-seo-content-audit.plan.md)     | `meta.summary`, KNOWS_ABOUT (20→34), OCCUPATION, OG descriptions.                                                                   |
| [Front Page Content](complete/front-page-content.plan.md)               | Personal narrative front page.                                                                                                      |

Infrastructure plans (also complete): E2E testing, PDF generation, component audit, RTL setup, Tailwind hygiene, section primitives, footer/header/CV layout/root layout refactors, onboarding docs.
