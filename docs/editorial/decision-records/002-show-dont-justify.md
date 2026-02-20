# EDR-002: Show, don't justify

## Status

Accepted

## Date

2026-02-18

## Context

During the experience section editorial session, multiple drafts fell into a justificatory register — explaining why Jim did something rather than stating what he did and what it creates. This pattern appeared repeatedly:

- "I built these tools to lower the cost of innovation for others" — explains why
- "The intent is deliberately indirect, reflecting organisational constraints" — explains strategy
- "I backed a rebuild because..." — explains reasoning

Each of these asks the reader to understand Jim's reasoning. A confident register states what happened and what it makes possible, trusting the reader to see the significance.

The distinction is not about removing intent — Jim's intent matters. It is about register: justification explains a past decision defensively; confident intent inhabits a present reality.

| Justification (wrong register)                       | Confident intent (right register)                              |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| "I built these tools to lower the cost of..."        | "These tools lower the cost of innovation for everyone"        |
| "The intent is deliberately indirect, reflecting..." | Describe what the work does and what it makes possible         |
| "I backed a rebuild because..."                      | "I backed a rebuild, accepting and managing near-term risk..." |

## Decision

**Show, don't justify.** Describe what Jim did and what it makes possible. Do not explain why. A reader who understands the positioning will recognise the pattern; a reader who doesn't will not be convinced by explanation.

This is now codified as an editorial principle in `editorial-guidance.md`.

## Consequences

- Added as a named principle in `editorial-guidance.md`.
- Included in the editorial voice skill (`.cursor/skills/editorial-voice/SKILL.md`) as a common pitfall with examples.
- Applied throughout the Oak P3 rewrite and should be applied to all future content work.
- Agents should check: "Is this sentence showing or justifying?" If justifying, rewrite to show.

## Related

- [editorial-guidance.md](../../../.agent/directives/editorial-guidance.md) — "Show, don't justify" principle
- [EDR-005](005-oak-p3-rewrite.md) — the rewrite where this principle was most applied
