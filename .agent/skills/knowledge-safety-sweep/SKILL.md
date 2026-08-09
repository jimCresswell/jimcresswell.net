---
name: knowledge-safety-sweep
classification: active
description: >-
  Sweep the live session context for knowledge that would be lost if the context ceased, and
  capture it durably — WITHOUT closing the seat. The loss-scan discipline of session-handoff and
  consolidate-docs, decoupled from closeout: class inventory, durable first-capture, named homes,
  metaloss recursion. Fires at owner word, at compaction risk, before risky operations, or at any
  knowledge-heavy boundary that is not a session end.
---

# Knowledge Safety Sweep

Extracts the deep loss-scan from `.agent/skills/session-handoff/SKILL.md`
and the conservation discipline of `.agent/skills/consolidate-docs/SKILL.md`
into a standalone, mid-session invocable. Imported and adapted 2026-08-09
from the Oak Open Curriculum Ecosystem Practice (itself imported from the
Resonance estate, 2026-07-20). The seat stays LIVE throughout: no watcher
stand-down, no closeout broadcast. Knowledge preservation outranks fitness
warnings; the napkin and, where a collaboration session is live, the comms
event stream are the first-capture vehicles; permanent homes are the
destination tier — channels, plans, and continuity surfaces are temporary.

## Trigger

- The owner asks for a knowledge safety sweep (or equivalent: "what would be
  lost?", "prepare for compaction" when the session continues after).
- Context budget approaches a compaction boundary and the seat is NOT
  closing (a closing seat runs `.agent/skills/wrap/SKILL.md`).
- A risky operation is imminent (host change, large refactor of memory
  surfaces, an operation that could kill the session).
- A knowledge-heavy arc completes mid-session (a design settled in chat, an
  owner ruling given in conversation, delegated work that changed a
  proposal) and its substance has no durable home yet.

## Workflow

The sweep is retrospective metacognition under time pressure: enter
`.agent/skills/metacognition/SKILL.md` genuinely at its open — what does
THIS context uniquely hold, and what is the fluent "already captured
somewhere" claim that has not actually been checked? — before walking the
classes. Time pressure is the reason to enter properly, not the excuse to
tick it.

1. **Inventory by loss class.** Sweep the session context — not the repo —
   for substance whose ONLY home is this context. The classes, scoped to a
   live seat:
   - owner rulings, directions, grants, and definitions given in chat and
     not yet mirrored;
   - in-context reasoning where only conclusions landed anywhere (the WHY
     behind a design, a verdict trail that changed a proposal);
   - own errors whose mechanism only this seat can name;
   - standing promises and custody commitments made in chat;
   - in-flight uncommitted work and its intent and provenance;
   - sub-agent products held only in this context or session-local files;
   - scratchpad and session-local temp artefacts whose consumed use has NOT
     superseded them (a draft consumed by its send is redundant; an
     analysis file nothing durable cites is not);
   - artefact discoverability — work that IS durable but reachable from no
     index, entry point, or continuity surface a successor actually loads
     (durable-but-undiscoverable is a loss class, not a conservation).
2. **Capture durably, in one place.** Compose the inventory as one durable
   artefact: a napkin section (the default here), or — in a live
   collaboration session — one comms event or ARC channel entry, explicitly
   marked NOT-a-handoff, seat-LIVE. Per item: the substance compressed but
   decision-complete, its named git-durable home, and its graduation
   vehicle (typically the napkin then the next consolidation pass). The
   capture is first capture, not the final home — the capture → distil →
   graduate pipeline carries it onward.
3. **Land what already has a vehicle.** Any item whose git-durable landing
   is already in flight (an authored edit, a queued commit) is named with
   its exact coordinates so a successor can land it from the capture alone.
4. **Metaloss recursion.** Scan the scan, bounded: what can it not see?
   Name the declared-not-conserved items WITH reasons (re-derivable from
   named durable sources; session-local by design; recomputable state) and
   the scan's bounds (recall-limited to what the seat attended to; watcher
   blind spots). A resume POINTER is not conservation when re-derivation
   needs the dying context — such items are conserved, never declared
   re-derivable.
5. **Report.** Tell the owner what was captured, where it lives, and what
   remains deliberately context-only. The seat continues.

## Success Test

The sweep has paid its way only if a successor holding ONLY the durable
surfaces (the capture plus the homes it names) could continue every named
thread without re-deriving from the dead context. A sweep that lists items
without naming homes and vehicles is inventory theatre — a failed pass.
