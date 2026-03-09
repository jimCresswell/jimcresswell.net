# Roadmap

Where everything stands and what depends on what.

## Active work

| Plan                                                                                      | Status      | Summary                                                                                                                                                            | Next action                                                            |
| ----------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [CV Editorial Improvements](current/cv-editorial-improvements.plan.md)                    | In progress | Parent editorial plan. Positioning, capabilities, metadata, experience, and Before Oak are settled. Remaining graph work now runs through the adopted graph stack. | Use the graph roadmap as the live dependency for remaining graph work. |
| [PKG Roadmap](current/personal-knowledge-graph-roadmap.plan.md)                           | In progress | Parent graph roadmap. Both tracks are required; Track A comes first, Track B follows as the source-of-truth design track.                                          | Complete Track A Phase A1.                                             |
| [Graph Expression Execution](current/personal-knowledge-graph-execution.plan.md)          | In progress | Live Track A plan for improving the existing graph layer as a deliberate publication surface.                                                                      | Define consumers, channels, and proof criteria.                        |
| [Source-of-Truth Design](current/personal-knowledge-graph-source-of-truth-design.plan.md) | Planned     | Required Track B follow-on plan for the graph-backed source-of-truth architecture.                                                                                 | Start only after Track A's impact model is complete.                   |
| [LinkedIn Update](current/linkedin-update.plan.md)                                        | Subsumed    | Reference-only downstream plan. LinkedIn stays downstream of the graph roadmap and does not drive the architecture.                                                | Wait for later derived-view work.                                      |

**Durable graph design decisions live in** [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) **and the related ADRs in** `docs/architecture/decision-records/`.
**Current graph authorities are** [personal-knowledge-graph-roadmap.plan.md](current/personal-knowledge-graph-roadmap.plan.md), [graph-current-state-audit.md](research/graph-current-state-audit.md), [personal-knowledge-graph-execution.plan.md](current/personal-knowledge-graph-execution.plan.md), **and** [personal-knowledge-graph-source-of-truth-design.plan.md](current/personal-knowledge-graph-source-of-truth-design.plan.md).
**The graph reset record is** [graph-metaplan.plan.md](graph-metaplan.plan.md).
**Historical PKG references live in** [complete/personal-knowledge-graph-phase-model.plan.md](complete/personal-knowledge-graph-phase-model.plan.md) **and** [research/personal-knowledge-graph-design-notes.md](research/personal-knowledge-graph-design-notes.md).

## Icebox

| Plan                                                                                            | Summary                                                                                                      |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Visual Regression Harness Enhancements](icebox/visual-regression-harness-enhancements.plan.md) | Commit-addressed artifact directories, capture reuse, and `--force`. Non-blocking harness improvements only. |
| [Neo4j Knowledge Graph](icebox/neo4j-knowledge-graph.plan.md)                                   | Migrate the JSON entity model to a graph database. Not current work — exists to shape PKG design decisions.  |

## Deferred

These are tracked in the [parent plan](current/cv-editorial-improvements.plan.md) but have no dedicated plans yet.

| Item                        | Reason                                                                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tilt mechanism              | Tilts need headlines + positioning. Schema extension required. Three audiences: default, public sector, founder/funder. Possibly a fourth NED/board advisor tilt. |
| Tilt content                | Depends on tilt mechanism.                                                                                                                                        |
| A/B testing / user feedback | No infrastructure for this.                                                                                                                                       |

## Dependencies

```text
CV Editorial Improvements (parent)
├── PKG Roadmap (current graph authority)
│   ├── Graph current-state audit (research baseline)
│   ├── Graph Expression Execution (Track A, first)
│   │   ├── Visual regression harness plan (complete proof record)
│   │   │   └── Visual regression harness enhancements (icebox)
│   │   └── LinkedIn update (reference only; downstream)
│   └── Source-of-truth design (Track B, required follow-on)
│       └── Neo4j Knowledge Graph (icebox shaping input)
├── Graph Metaplan (complete reset record)
└── Tilt mechanism (deferred, no plan yet)
    └── Tilt content (depends on mechanism)
```

**Sequencing:** both tracks are required. Track A is first. Track B starts only
after Track A establishes the current graph layer's impact model.

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
