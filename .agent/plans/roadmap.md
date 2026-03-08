# Roadmap

Where everything stands and what depends on what.

## Active work

| Plan                                                                                         | Status         | Summary                                                                                                                             | Next action                                                                                    |
| -------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [CV Editorial Improvements](cv-editorial-improvements.plan.md)                               | In progress    | Parent plan. Positioning, capabilities, metadata, experience, and Before Oak are all settled. Knowledge graph is the active stream. | Wait for PKG manual validation and regression-proof decision.                                  |
| [Personal Knowledge Graph — design reference](personal-knowledge-graph.plan.md)              | Implementation | Entity inventory, principles, and Schema.org conventions. All design decisions are resolved. The WHY.                               | Reference only — design is settled.                                                            |
| [Personal Knowledge Graph — implementation](personal-knowledge-graph-implementation.plan.md) | In progress    | Phases 1-4 code complete. Automated gates pass. Manual validation and regression proof remain outstanding. The WHAT.                | Run manual validation, decide the regression-proof path, then capture the historical baseline. |
| [PKG Execution Plan](personal-knowledge-graph-execution.plan.md)                             | In progress    | Detailed operational plan with reviewer invocations, skill activations, and per-task status. The HOW.                               | **Start here** for next session.                                                               |
| [LinkedIn Update](linkedin-update.plan.md)                                                   | Subsumed       | LinkedIn content will derive from the knowledge graph in PKG Phase 5. The standalone plan remains useful as editorial reference.    | Wait for PKG Phase 5.                                                                          |

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

```text
CV Editorial Improvements (parent)
├── PKG design reference (the WHY) ← Neo4j (shapes design)
│   └── PKG implementation (the WHAT)
│       └── PKG execution plan (the HOW) ← start here
│           ├── Phases 1–3: code complete (automated gates pass) ✅
│           ├── Phase 4: code complete, manual validation pending 🔄
│           └── Phase 5: LinkedIn as derived view (subsumes LinkedIn Update plan)
└── Tilt mechanism (deferred, no plan yet)
    └── Tilt content (depends on mechanism)
```

**Sequencing decided:** Knowledge graph first. LinkedIn derives from the graph — it is a view, not a parallel editing effort.

**Current state (2026-03-08):** PKG Phases 1-4 code complete (entity model, population, view derivation, and follow-up validation work). **Automated gates pass on the current tree** — `pnpm check` and `pnpm test:e2e` both passed on 2026-03-08. 132 vitest tests passing, 46 Playwright E2E tests passing. Manual Schema.org Validator and Rich Results Test checks remain outstanding, and the historical content-regression proof is still pending. Uncommitted work on `main` is currently docs consolidation only, added after `83a16fa`.

## Complete

Sixteen plans in [`complete/`](complete/) (7 infrastructure sub-plans + 9 named plans). The most relevant for current context:

| Plan                                                                | What it delivered                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Experience Editorial](complete/experience-editorial.plan.md)       | Research rewrite, voice fixes, capabilities consistency (21 items). |
| [Capabilities Editorial](complete/capabilities-editorial.plan.md)   | Five blended capabilities with concrete anchors.                    |
| [Meta & SEO Content Audit](complete/meta-seo-content-audit.plan.md) | `meta.summary`, KNOWS_ABOUT (20→34), OCCUPATION, OG descriptions.   |
| [Front Page Content](complete/front-page-content.plan.md)           | Personal narrative front page.                                      |

Infrastructure plans (also complete): E2E testing, PDF generation, component audit, RTL setup, Tailwind hygiene, section primitives, footer/header/CV layout/root layout refactors, onboarding docs.
