# Roadmap

Where everything stands and what depends on what.

## Active work

| Plan                                                                                         | Status      | Summary                                                                                                                                                                       | Next action                            |
| -------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [CV Editorial Improvements](cv-editorial-improvements.plan.md)                               | In progress | Parent plan. Positioning, capabilities, metadata, experience, and Before Oak are all settled. Knowledge graph is the open stream; LinkedIn follows from it.                   | Drive PKG to completion.               |
| [Personal Knowledge Graph — design reference](personal-knowledge-graph.plan.md)              | Planning    | Entity inventory, principles, Schema.org conventions, open design questions. The WHY — read this to understand the model.                                                     | Phase 1–2 design decisions with Jim.   |
| [Personal Knowledge Graph — implementation](personal-knowledge-graph-implementation.plan.md) | Pending     | Phased execution with todos and acceptance criteria: design → populate → wire → enrich → LinkedIn. The WHAT — references the design reference for context.                    | Start Phase 1 design session with Jim. |
| [LinkedIn Update](linkedin-update.plan.md)                                                   | Subsumed    | LinkedIn content will derive from the knowledge graph (PKG implementation Phase 5). The standalone plan remains as reference for editorial questions and automation findings. | Wait for PKG Phase 5.                  |

## Future

| Plan                                                          | Summary                                                                                                                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Neo4j Knowledge Graph](future/neo4j-knowledge-graph.plan.md) | Migrate the JSON entity model to a graph database. Not current work — exists to shape PKG design decisions (stable IDs, typed relationships, flat entities). |

## Deferred

These are tracked in the [parent plan](cv-editorial-improvements.plan.md) but have no dedicated plans yet.

| Item                        | Reason                                                                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tilt mechanism              | Tilts need headlines + positioning. Schema extension required. Three audiences: default, public sector, founder/funder. Possibly a fourth NED/board advisor tilt. |
| Tilt content                | Depends on tilt mechanism.                                                                                                                                        |
| A/B testing / user feedback | No infrastructure for this.                                                                                                                                       |

## Dependencies

```
CV Editorial Improvements (parent)
├── PKG design reference (the WHY) ← Neo4j (shapes design)
│   └── PKG implementation (the WHAT)
│       ├── Phases 1–4: design, populate, wire, enrich
│       └── Phase 5: LinkedIn as derived view (subsumes LinkedIn Update plan)
└── Tilt mechanism (deferred, no plan yet)
    └── Tilt content (depends on mechanism)
```

**Sequencing decided:** Knowledge graph first. LinkedIn derives from the graph — it is a view, not a parallel editing effort.

## Complete

Sixteen plans in [`complete/`](complete/) (7 infrastructure sub-plans + 9 named plans). The most relevant for current context:

| Plan                                                                | What it delivered                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Experience Editorial](complete/experience-editorial.plan.md)       | Research rewrite, voice fixes, capabilities consistency (21 items). |
| [Capabilities Editorial](complete/capabilities-editorial.plan.md)   | Five blended capabilities with concrete anchors.                    |
| [Meta & SEO Content Audit](complete/meta-seo-content-audit.plan.md) | `meta.summary`, KNOWS_ABOUT (20→34), OCCUPATION, OG descriptions.   |
| [Front Page Content](complete/front-page-content.plan.md)           | Personal narrative front page.                                      |

Infrastructure plans (also complete): E2E testing, PDF generation, component audit, RTL setup, Tailwind hygiene, section primitives, footer/header/CV layout/root layout refactors, onboarding docs.
