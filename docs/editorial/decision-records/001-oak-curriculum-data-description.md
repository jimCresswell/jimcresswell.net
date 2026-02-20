# EDR-001: Oak curriculum data description

## Status

Accepted

## Date

2026-02-18

## Context

The CV's description of Oak's curriculum data used generic terms — "openly licensed," "high-quality curriculum materials" — and framed Jim as "treating" the data as public digital infrastructure, implying a conceptual reframing rather than a factual description.

In reality, Oak's curriculum data is:

- **Fully sequenced** — a complete curriculum progression, not isolated resources
- **Fully resourced** — complete lesson materials at every point in the sequence
- **Pedagogically rigorous** — expert-created and quality-assured
- **Released under the Open Government Licence** — government-funded, deliberately public
- **Standards-compliant** — has an OpenAPI specification

The data IS public digital infrastructure. Jim did not reframe it; he built tools (SDK, MCP server) to make it more accessible.

## Decision

All content describing Oak's curriculum data must reflect its actual nature: fully sequenced, pedagogically rigorous, released under the Open Government Licence. The description should carry enough weight for the reader to see why easy access to this data is significant, without the content having to explain the significance.

The framing is factual, not conceptual: Jim built tools to make existing public infrastructure more accessible, not to reimagine what the data could be.

### Product safety, not data safety

The responsibility concern at Oak is **product safety** — ensuring AI services that consume the data are reliable, accurate, and safe. The data itself is open by design; access is not constrained. The KNOWS_ABOUT term "Responsible AI" should be understood in this light when applied to Jim's work.

## Consequences

- Oak P3 rewritten to lead with the data description: "fully sequenced, pedagogically rigorous...released under the Open Government Licence."
- "Treating...as public digital infrastructure" replaced by factual framing.
- Product safety framing replaces any implication of data access concerns.
- Future content (tilt variants, LinkedIn, any description of the SDK/MCP work) should use this framing.

## Related

- [EDR-005](005-oak-p3-rewrite.md) — the P3 rewrite that implemented this decision
- [editorial-guidance.md](../../../.agent/directives/editorial-guidance.md) — commercial sensibility principle
