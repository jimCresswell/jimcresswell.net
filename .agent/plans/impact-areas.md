# Impact areas — the closed registry

**Status: ratified** (rewritten for this repository at the plan-node
migration, 2026-09-13; ratified with the strategic nodes on the cards of that day). The registry
behind every plan's `impact_areas` field: which parts of the product a
plan changes. **Closed and additive** — a new area is added here, in a
reviewed change, before any plan may cite it; the estate validator
refuses membership drift.

The repository owns **impact structure** (durable — it changes only when
the product changes); a schedule system, if one is ever adopted, owns
delivery grouping. Neither duplicates the other.

| Area                  | What it covers                                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `editorial-content`   | The CV and page copy under the editorial directives, the entity facts they draw on, and the private LinkedIn boundary |
| `knowledge-graph`     | The personal knowledge graph: entities, relationships, JSON-LD and negotiated representations, and their proof         |
| `site`                | The Next.js site: routes, layouts, components, metadata, PDF generation, and the deployment contract                    |
| `visual-system`       | Theme tokens, typography, the statusline mark, the visual regression harness and its baselines                         |
| `practice-and-estate` | The engineering practice, agent estate, and planning estate itself                                                     |
