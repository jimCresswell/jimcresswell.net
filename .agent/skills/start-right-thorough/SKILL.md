---
name: start-right-thorough
classification: active
description: Thorough session grounding for structural, risky, or multi-phase work across code, Practice, and platform surfaces — full foundation pass, live-state checks, structured reasoning, and one-gate-at-a-time discipline from the start.
---

# Start Right Thorough

## Goal

Load `.agent/skills/start-right-thorough/shared/start-right-thorough.md` and
enforce its directives in the current session before substantial work.
Thorough grounding extends quick grounding; it does not replace the live
git-state, collaboration, and active-plan checks with a smaller
directive-only subset.

## Workflow

1. Read `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
   end to end.
2. Follow its reading order in full, including the inbound and continuity
   pass.
3. Convert the workflow content into active commitments for this session:
   - use one-gate-at-a-time quality validation for non-trivial work;
   - include explicit re-grounding points in any long-running execution
     plan;
   - invoke specialist reviewers whenever a change crosses their domain;
   - check live ARC/comms state and git state (including peer staged work
     in this shared checkout) before edits or commits.
4. Post a concise grounding summary to the user confirming the thorough
   workflow is active.
5. Continue the user task while enforcing these commitments.

## Failure Handling

If a referenced file is missing or unreadable, report the exact path, apply
all available directives, and ask the user whether to proceed or provide
the missing file.
