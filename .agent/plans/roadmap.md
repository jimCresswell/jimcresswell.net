# Roadmap

Where everything stands and what depends on what.

## Active work

| Plan                                                                   | Status      | Summary                                                                                                                                                             | Next action                                           |
| ---------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [CV Editorial Improvements](current/cv-editorial-improvements.plan.md) | In progress | Parent editorial plan. Positioning, capabilities, metadata, experience, and Before Oak are settled. Remaining graph work is currently framed by the graph metaplan. | Wait for metaplan implementation in the next session. |
| [Graph Metaplan](graph-metaplan.plan.md)                               | In progress | Parent graph plan. Records the truthful baseline and defines how the next session must assess recent graph work before adopting a new roadmap and successor plans.  | Use this as the current graph authority.              |
| [LinkedIn Update](current/linkedin-update.plan.md)                     | Subsumed    | Reference-only downstream plan. LinkedIn stays downstream of the graph roadmap and does not drive the architecture.                                                 | Wait for later derived-view work.                     |

**Durable graph design decisions live in** [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) **and the related ADRs in** `docs/architecture/decision-records/`.
**Current graph authorities are** [graph-metaplan.plan.md](graph-metaplan.plan.md) **and** [graph-current-state-audit.md](research/graph-current-state-audit.md).
**Historical PKG references live in** [complete/personal-knowledge-graph-phase-model.plan.md](complete/personal-knowledge-graph-phase-model.plan.md) **and** [research/personal-knowledge-graph-design-notes.md](research/personal-knowledge-graph-design-notes.md).

## Graph metaplan draft inputs

These documents were captured during metaplan authoring so the work is not
lost. The next session must assess them against explicit outcomes, intended
impacts, and value mechanisms before any of them become authoritative.

| Document                                                                                       | Role                                                                 |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [PKG Roadmap Draft](drafts/personal-knowledge-graph-roadmap.plan.md)                           | Candidate strategic roadmap for the proposed Track A / Track B split |
| [Graph Expression Execution Draft](drafts/personal-knowledge-graph-execution.plan.md)          | Candidate Track A execution-plan draft                               |
| [Source-of-Truth Design Draft](drafts/personal-knowledge-graph-source-of-truth-design.plan.md) | Candidate Track B design-plan draft                                  |

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
├── Graph Metaplan (current graph authority)
│   ├── Graph current-state audit (research baseline)
│   ├── PKG roadmap draft (candidate strategic roadmap)
│   ├── Graph Expression Execution draft (candidate Track A plan)
│   └── Source-of-truth design draft (candidate Track B plan)
│   ├── Visual regression harness plan (complete proof record)
│   │   └── Visual regression harness enhancements (icebox)
│   └── LinkedIn update (reference only; downstream)
└── Tilt mechanism (deferred, no plan yet)
    └── Tilt content (depends on mechanism)
```

**Sequencing under assessment:** the preserved drafts currently propose separate
graph-expression and source-of-truth tracks. The next session must decide
whether that split stands.

**Current state:** the graph is an active concern, but the visible website is
not yet graph-derived and there is not yet an adopted post-metaplan graph
roadmap. Use [graph-metaplan.plan.md](graph-metaplan.plan.md) and
[graph-current-state-audit.md](research/graph-current-state-audit.md) as the
current authorities. Codex platform alignment is complete; its durable
architecture lives in ADR-015.

## Complete

Completed plans live in [`complete/`](complete/). The most relevant for current context:

| Plan                                                                    | What it delivered                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Codex Platform Alignment](complete/codex-platform-alignment.plan.md)   | Real Codex reviewer sub-agents, canonical thin-adapter split, and ADR-015 for the durable Codex model. |
| [Visual Regression Harness](complete/visual-regression-harness.plan.md) | Review-oriented non-destructive harness, `WORKTREE` support, and the closed PKG proof record.          |
| [Experience Editorial](complete/experience-editorial.plan.md)           | Research rewrite, voice fixes, capabilities consistency (21 items).                                    |
| [Capabilities Editorial](complete/capabilities-editorial.plan.md)       | Five blended capabilities with concrete anchors.                                                       |
| [Meta & SEO Content Audit](complete/meta-seo-content-audit.plan.md)     | `meta.summary`, KNOWS_ABOUT (20→34), OCCUPATION, OG descriptions.                                      |
| [Front Page Content](complete/front-page-content.plan.md)               | Personal narrative front page.                                                                         |

Infrastructure plans (also complete): E2E testing, PDF generation, component audit, RTL setup, Tailwind hygiene, section primitives, footer/header/CV layout/root layout refactors, onboarding docs.
