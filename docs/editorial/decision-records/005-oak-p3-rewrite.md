# EDR-005: Oak P3 rewrite — from passive description to confident intent

## Status

Accepted

## Date

2026-02-18

## Context

The original Oak P3 had multiple problems identified during the experience editorial session:

1. **Incorrect data framing** — described Jim as "treating" data as public infrastructure; the data IS public infrastructure (see [EDR-001](001-oak-curriculum-data-description.md)).
2. **Passive, descriptive voice** — "my work has focused on," "this has included" — while cap 2 claims Jim "conceived, prototyped, and delivered...end-to-end."
3. **Justificatory tone** — "the intent is deliberately indirect, reflecting organisational constraints and long-term leverage considerations" — explaining strategy instead of showing impact (see [EDR-002](002-show-dont-justify.md)).
4. **Redundant tell sentence** — "Across Oak, I have held responsibility for early trade-offs that fixed architectural direction..." restated what P1 and P2 already demonstrated.
5. **"Preserve optionality"** — unclear what this implied in context; removed.

### The three-paragraph arc

The Oak section has a deliberate narrative arc that a future editor must understand:

- **P1** — Who Jim is at Oak: the role, the teams, the stakes
- **P2** — What he did: the rebuild decision, judgment under pressure
- **P3** — What he's doing now: enabling infrastructure, the live frontier

P3 is the most forward-looking paragraph and should carry the energy of current, exciting work.

## Decision

Full P3 rewrite. The new paragraph follows a four-sentence arc:

1. **What Jim built + what the data is.** "I conceived and built an SDK and MCP server for Oak's fully sequenced, pedagogically rigorous curriculum data, released under the Open Government Licence and now directly accessible to AI-powered services on the open web."
2. **Who's already here.** "Teachers are already using AI to reduce their workloads; edtech developers are already building in this space."
3. **What this creates.** "Reliable access to trusted curriculum material at this quality lowers the cost of innovation for everyone — the lasting impact is in what others will build."
4. **Where Jim's thinking is now.** "The live challenge is product safety: ensuring AI services that consume this data are reliable, accurate, and safe."

### Additional changes triggered by the rewrite

The reframing was bigger than one paragraph:

- **Cap 5 refined** — "contributes to infrastructure that supports" → "I create infrastructure that lowers the cost of innovation for others, enabling lasting change in" (see [EDR-004](004-enabling-vision-leverage-third-order.md)).
- **KNOWS_ABOUT expanded** — added "Holding space for systems change through second and third-order effects, mediated through the creation of open digital infrastructure."

## Consequences

- P3 is now agentic ("I conceived and built"), factually grounded (data description), and forward-looking (product safety frontier).
- The tell sentence is gone — P1 and P2 already show what it was saying.
- Future editors should maintain the three-paragraph arc structure.
- Cap 2 still says "openly licensed curriculum data" — whether it should carry the richer OGL description is flagged for a future consistency pass.

## Related

- [EDR-001](001-oak-curriculum-data-description.md) — Oak data description
- [EDR-002](002-show-dont-justify.md) — the principle that resolved the justification problem
- [EDR-004](004-enabling-vision-leverage-third-order.md) — the enabling vision that replaced "deliberately indirect"
- [experience-editorial.plan.md](../../../.agent/plans/experience-editorial.plan.md) — change list items 5–7
