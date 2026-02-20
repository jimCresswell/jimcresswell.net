# EDR-004: Enabling vision — leverage through third-order effects

## Status

Accepted

## Date

2026-02-18

## Context

Jim's SDK and MCP work at Oak was originally described in passive, strategic-explanation terms: "treating...as public digital infrastructure rather than a product destination," "the intent is deliberately indirect," "preserve optionality." This framing explained Jim's reasoning but did not convey what he is actually doing or why it matters.

Through the editorial session, Jim articulated the vision clearly: he is creating a lever for system-level change through third-order effects. He knows what that means, he is doing it on purpose, and he is doing it well.

The concrete picture:

- Oak's curriculum data is fully sequenced, pedagogically rigorous, and released under the Open Government Licence (see [EDR-001](001-oak-curriculum-data-description.md)).
- Teachers are already using AI products to reduce their workloads. Developers and edtech companies are already building in this space.
- Jim conceived and built tools (SDK, MCP server) that make this data directly accessible to AI-powered services on the open web.
- Reliable access to trusted curriculum material at this quality lowers the cost of innovation for everyone.
- The lasting impact is in what others will build — second and third-order effects that far outstrip the effort of creating the tools.

This connects directly to positioning P2: "changing constraints in large-scale systems so that the natural paths lead to different, better outcomes, lasting far beyond my direct involvement." The SDK/MCP work is an instance of that pattern.

## Decision

The enabling/leverage framing replaces the "deliberately indirect" / "preserve optionality" framing across all content. The key concepts:

1. **Lowering the cost of innovation for others** — what the tools do
2. **The lasting impact is in what others will build** — where the value lives
3. **Product safety** — the live challenge (ensuring AI services consuming the data are reliable, accurate, safe)

This framing should be reflected consistently in:

- Oak P3 (experience narrative) — shows it happening
- Cap 5 (capabilities) — names the enabling mechanism
- KNOWS_ABOUT (structured data) — carries the concept for machine consumers
- Future tilt variants and LinkedIn — should use the same framing

### Oak's growth context

Oak is a new type of public service, funded by the Government. The engineering function's growth (four contractors to five product squads and three platform groups over five years) happened because of end-to-end team excellence and because Oak proved it could deliver serious impact at a fraction of the cost of a large tech company. This is not a startup growth story.

## Consequences

- Oak P3 rewritten around this framing (see [EDR-005](005-oak-p3-rewrite.md)).
- Cap 5 refined: "contributes to infrastructure that supports" → "I create infrastructure that lowers the cost of innovation for others, enabling lasting change in."
- KNOWS_ABOUT expanded: "Holding space for systems change through second and third-order effects, mediated through the creation of open digital infrastructure."
- Commercial sensibility principle in `editorial-guidance.md` updated to reflect enabling infrastructure framing.

## Related

- [EDR-001](001-oak-curriculum-data-description.md) — what the data actually is
- [EDR-002](002-show-dont-justify.md) — how to describe it (show, don't justify)
- [EDR-005](005-oak-p3-rewrite.md) — the rewrite that implemented this
- [editorial-guidance.md](../../../.agent/directives/editorial-guidance.md) — commercial sensibility principle
