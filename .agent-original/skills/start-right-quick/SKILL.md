---
name: start-right-quick
classification: active
description: Fast session grounding — read the foundation documents, active plan, memory, live collaboration and git state, and inbound Practice surfaces, then convert them into active session commitments before starting work.
---

# Start Right Quick

## Goal

Load `.agent/skills/start-right-quick/shared/start-right.md` and enforce its
directives in the current session before substantial work. The shared
workflow file is the source of truth for the reading order; this skill body
is only the invocation contract.

## Workflow

1. Read `.agent/skills/start-right-quick/shared/start-right.md` end to end.
2. Follow the workflow's referenced reading order. Do not replace it with a
   smaller directive-only subset.
3. Convert the workflow content into active commitments for this session:
   - Challenge assumptions and check that work is happening at the right
     layer.
   - Optimise for system-level value and architectural correctness over
     short-term expediency.
   - Check live ARC/comms state and git state (including peer staged work
     in this shared checkout) before edits or commits.
   - Discuss first-step direction with the user before committing to a
     major implementation path when intent is genuinely unclear.
4. State the landing target and leave a proportionate work-shape artefact
   per the shared workflow.
5. Post a concise grounding summary to the user confirming the workflow was
   applied and listing the commitments now in force.
6. Include periodic re-grounding checkpoints in any non-trivial plan.
7. Continue the user task while enforcing these commitments.

## Failure Handling

If a referenced file is missing or unreadable, report the exact path, apply
all available directives, and ask the user whether to proceed or provide
the missing file.
