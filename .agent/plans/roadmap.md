# Roadmap

Where everything stands and what depends on what.

## Active work

| Plan                                                                     | Status      | Summary                                                                                                                                      | Next action                                 |
| ------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [CV Editorial Improvements](current/cv-editorial-improvements.plan.md)   | In progress | Parent plan. Positioning, capabilities, metadata, experience, and Before Oak are all settled. Knowledge graph is the active stream.          | Wait for PKG manual validation and Phase 5. |
| [PKG Execution Plan](current/personal-knowledge-graph-execution.plan.md) | In progress | Detailed operational plan with reviewer invocations, skill activations, and per-task status. The active PKG plan.                            | **Start here** for next session.            |
| [LinkedIn Update](current/linkedin-update.plan.md)                       | Subsumed    | LinkedIn content will derive from the knowledge graph in PKG Phase 5. The standalone plan remains useful as a reference for source material. | Wait for PKG Phase 5.                       |

**Durable PKG design decisions live in** [ADR-014](../../docs/architecture/decision-records/014-entity-model-design.md) **and the related ADRs in** `docs/architecture/decision-records/`.
**PKG supporting references live in** [complete/personal-knowledge-graph-phase-model.plan.md](complete/personal-knowledge-graph-phase-model.plan.md) **and** [research/personal-knowledge-graph-design-notes.md](research/personal-knowledge-graph-design-notes.md).

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
├── PKG implementation (plan with acceptance criteria)
│   ├── PKG execution plan (active) ← start here
│   ├── Visual regression harness plan (complete proof record)
│   │   └── Visual regression harness enhancements (icebox)
│   └── Phase 5: LinkedIn as derived view (uses LinkedIn Update as reference only)
└── Tilt mechanism (deferred, no plan yet)
    └── Tilt content (depends on mechanism)
```

**Sequencing decided:** Knowledge graph first. LinkedIn derives from the graph — it is a view, not a parallel editing effort.

**Current state:** PKG is the active stream. For live validation status, proof state, and the next-session entry point, use the [PKG execution plan](current/personal-knowledge-graph-execution.plan.md). Codex platform alignment is complete; its durable architecture lives in ADR-015.

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
