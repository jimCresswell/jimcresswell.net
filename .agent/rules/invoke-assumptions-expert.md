---
classification: situational
description: Invoke assumptions-expert when plans are marked decision-complete, propose 3+ agents, assert blocking relationships, integrate a third-party vendor, or commit to technology choices before research.
trigger: ceremony:plan-authoring — Plan authoring, decision-complete or ready-for-execution marks, blocking claims, 3+ agents, workspace or package topology changes, third-party vendor integration, technology commitments before research, related document sets, requested assumption audits or proportionality checks
---

# Invoke Assumptions Expert

Operationalises the [`assumptions-expert` brief](../sub-agents/templates/assumptions-expert.md) within the [sub-agent architecture](../sub-agents/README.md).

When plans, designs, or architectural proposals are being finalised, invoke the `assumptions-expert` specialist in addition to the standard `code-expert` gateway.

## Trigger Conditions

Invoke `assumptions-expert` when:

- Any plan is marked "DECISION-COMPLETE" or "READY FOR EXECUTION"
- A plan asserts blocking relationships over other workstreams
- A plan proposes 3+ new specialist agents
- A plan proposes new workspace categories or package topology changes
- A plan integrates a third-party vendor without attesting that first-party
  integrations (plugins, SDKs, managed flows, official GitHub Actions) were
  evaluated before a bespoke wrapper's shape is chosen
- A plan commits to technology choices before research phases complete
- A related PDR, ADR, or plan set is drafted in one session or depends on
  cross-document coupling; review the set boundary, not only each document
  in isolation
- A user or agent requests an assumption audit or proportionality check

## Non-Goals

Do not invoke `assumptions-expert` for:

- Code quality, style, or implementation correctness (use `code-expert`)
- Architectural boundary compliance in code (use the architecture reviewers)
- Documentation completeness or ADR accuracy (use `docs-adr-expert`)
- Test quality or TDD compliance (use `test-expert`)
- Domain-specific technology validation (use the relevant domain specialist)

## Overlap Boundaries

- **`code-expert`**: Always invoke as the gateway for code changes. `assumptions-expert` operates at the plan level, not the code level — they do not overlap.
- **`docs-adr-expert`**: Validates documentation accuracy. `assumptions-expert` questions whether the documented decisions are proportional — complementary, not overlapping.
- **`architecture-expert` and the four personas**: Review a proposed structure at the architecture level — `architecture-expert` for workspace boundaries and import direction, and the persona for the lane the plan touches ([reviewer-team.md](../sub-agents/components/architecture/reviewer-team.md)). `assumptions-expert` questions whether that structure is proportional at the plan level. When a plan proposes significant architectural changes, invoke `assumptions-expert` and those architecture reviewers together.
- **`subagent-architect`**: Reviews agent triplet quality. `assumptions-expert` questions whether the proposed agents are needed at all. Invoke `assumptions-expert` first when 3+ agents are proposed; `subagent-architect` reviews the triplets after the count is validated.

## Invocation

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer catalogue and invocation policy. The `assumptions-expert` canonical template is at `.agent/sub-agents/templates/assumptions-expert.md`.

For a related decision set, name the whole set in the reviewer prompt and ask
for cross-document coupling defects. The set-scope review is what catches
premature dependency closure, namespace coupling, or one Proposed decision
foreclosing another Proposed decision's open question.
