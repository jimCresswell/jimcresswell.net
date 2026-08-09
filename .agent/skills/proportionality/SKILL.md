---
name: proportionality
classification: active
description: >-
  Size the work and the instrument before shaping either. A pre-decision gate,
  sibling to concept-exploration, asking whether this is the right SIZE of question
  and the right LEVEL to answer it — four findings (too big, too small, wrong
  instrument weight, wrong level) under a non-override clause that keeps it from
  becoming an expediency door. Use before committing to an approach; when a loop
  stops converging; when adjacent findings are being absorbed rather than homed; or
  when a decision is about to route to the wrong seat.
---

# Proportionality

The pre-decision sizing gate that runs alongside
`.agent/skills/concept-exploration/SKILL.md` and ahead of the repo's
decision principles in `.agent/directives/principles.md`. Concept exploration
asks _"is this the right question?"_; this asks _"is this the right SIZE of
question, and the right LEVEL to answer it?"_ It is the general form of the
First Question ("could it be simpler without compromising quality or value or
functionality?") applied to the work itself and to the effort spent deciding
it. Imported and adapted 2026-08-09 from the Oak Open Curriculum Ecosystem
Practice.

Principles resolve **shape**; proportionality sizes — those are orthogonal
axes, so this gate runs **before** the shape principles, on the question, not
on the answer.

## The gate

Ask the three questions in order. Each has a symmetric answer set — a gate
that only ever shrinks things is expediency with better manners.

| Axis           | Question                                        | Findings                                                                                                                                                                          |
| -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**      | Is this one thing, or several wearing one name? | **Too big** → narrow; home the remainder as plan entries with named carriers. **Too small** → widen; the real work is larger than the ask implies                                 |
| **Instrument** | Is the tool matched to the question?            | **Too heavy** → re-tier (an inline check over a delegation; a probe over a plan). **Too light** → escalate the instrument; a cheap check on an irreversible call is false economy |
| **Level**      | Whose decision is this?                         | **Wrong level** → route it: the owner, the directing seat where one is standing, or resolve at this seat. A decision already covered by standing owner word is not an escalation  |

### The non-override clause

Proportionality bounds **scope, instrument weight, and attention cost**. It
never bounds **correctness, strictness, or architectural quality**.

_"This is smaller than I was treating it as"_ is a valid finding. _"This is
small enough to do badly"_ is expediency wearing this gate as a disguise. The
word _proportionate_ is exactly what a rush impulse reaches for, so the
clause is absolute: a proportionality finding may change what is built and
how much review it earns; it may never change whether the built thing is
correct.

## Why excellence needs it

A commitment to architectural excellence is absolute by design, and
absoluteness has a known failure mode: it supplies no stopping condition.
Unchecked, it produces rabbit-holing, generic-ideal drift, and
craft-as-value — each step locally excellent, the aggregate a global
pessimisation. Proportionality is the counterweight that makes excellence
safe to apply absolutely: excellence still decides the shape; proportionality
decides how much shape is in scope.

## Domain instances — cite these, never restate them

This skill is the general principle. Each surface below owns the operational
detail for its domain and is the single source of truth there:

- **Review loops** — `.agent/skills/pr-lifecycle/SKILL.md` owns convergence:
  the round tally, the mechanical step-back predicate, and the settled
  definition. Build the tally, or the trigger cannot fire.
- **Absorbing adjacent findings** — `.agent/skills/pr-lifecycle/SKILL.md`'s
  two-class disposition (findings the current story requires cure in the PR;
  valid-but-adjacent findings are replied to with a named owning home and
  never grow the diff). Its general form is
  `.agent/skills/concept-exploration/SKILL.md` §Loop Dynamics, which binds
  every iterative loop: work the current story does not require is routed to
  a named home, never absorbed, and **individual validity is not
  sufficiency** — correct, relevant, and proportionate are separate
  conjuncts, tested separately.
- **Changeset size** — round budgets bind at authoring time: slice the work
  when the plan is written, because at review time it is too late to plan
  work. A changeset that will need many review rounds was mis-sized before
  the first line was written.
- **Assurance rigour** — risk-tier assurance to the harm of getting it
  wrong, never uniform: cheap checks are proportionate where errors are
  visible and reversible, never where they are silent and terminal.

**When a domain instance exists, run it.** This skill does not substitute
for the mechanical instrument; it is the reason to reach for one, and the
fallback when a domain has none.

## Worked instance — ten rounds that a live trigger would have stopped at four

An upstream Practice PR ran ten review rounds and twelve cure commits, four
of which introduced new defects. Three of those four sat in security
hardening the ticket had never asked for; one had already been recorded as
sequenced-out and was then built into the same PR anyway.

The instructive part is not the count. The step-back predicate would have
fired around round four, and the two-class disposition would have homed the
adjacent findings from the first round. **Both existed. Neither ran, because
no tally was ever kept**, so nothing counted and non-convergence had no
observable surface.

The shepherd then escalated two questions to the owner: how to dispose of
the PR, and whether the cure-defect pattern signalled a personal reliability
problem. Applying this gate's **level** axis dissolves both — the first was
already answered by standing owner word, and the second was a seat-level
question that had climbed the reliability ladder from observation to
identity. Neither was the owner's to answer.

Read the failure precisely: **not an absent framework, but an unbuilt
instrument and an unasked sizing question.** That is the generator this gate
exists to catch, and it is why the gate runs before the work rather than as
a review of it.

## The success test

This gate has paid its way only if it **changed the size of the work, the
weight of the instrument, or the level the decision routes to**. A pass that
confirms the current shape is a real outcome — record it as a justified
no-change verdict with its reason, exactly as
`.agent/skills/metacognition/SKILL.md` requires.

It has failed if it produced a filled-in table, or if it was cited to reduce
rigour. The falsifier is deliberately sharp: **one use of this gate to
justify lower quality means the non-override clause is too weak, and the
gate is withdrawn rather than patched** — a cure that needs its own cure
buys false confidence, which is the failure it was written to prevent.
