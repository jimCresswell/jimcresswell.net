---
name: plan
classification: active
description: >-
  Author a plan in this repo's plan estate (.agent/plans/) aligned with the
  foundation documents — the four value questions, phased structure with
  measurable acceptance criteria, and the authoring disciplines (design gate,
  altitude fork, frame-the-problem, build-vs-buy, friction ratchet, no
  invented scope, no imaginary flows). Use when creating or substantially
  revising any plan, and before committing to an approach on non-trivial
  work.
---

# Author a Plan

Create a plan aligned with `.agent/directives/principles.md` and
`.agent/directives/testing-strategy.md`. Imported authoring disciplines
adapted 2026-08-09 from the Oak Open Curriculum Ecosystem Practice, merged
with this repo's plan command.

## Before Writing

1. **Design gate**: Has the design intent been explored and confirmed with
   the owner? If the scope is ambiguous or the approach has multiple valid
   paths, run `.agent/skills/metacognition/SKILL.md` first to explore
   intent, constraints, and trade-offs before committing to a plan
   structure. Do not skip this step for non-trivial work.

   When "plan X" spans **altitudes** — future strategy vs immediate
   executable work; the product vs the estate that produces it — surface
   the altitude fork (or state the lighter/immediate verdict) BEFORE
   drafting; never default to the heavier altitude, and never bake an open
   decision in as a load-bearing thesis. A reviewer can validate a plan's
   facts but cannot catch a wrong altitude — the frame is the owner's to
   set.

   **Verdict-vs-menu discipline**: when the agent has no strong basis for a
   verdict, surface 2–3 approaches with trade-offs as a genuine question.
   When the agent has analysed and has a verdict, present the verdict with
   cited evidence — do not convert completed findings into a
   multiple-choice form. The diagnostic: _could the agent rank these
   options by evidence already in context?_ If yes, the quiz is evasion.

   **Frame the problem, not the solution.** Before choosing a structure,
   state the problem as gap + who it harms + mechanism (your causal
   hypothesis) + constraints + what success looks like. A statement that
   already names a solution ("we need X") has skipped the framing. For
   complex plans, rewrites, or high-stakes work, read
   `.agent/reference/grammar-of-thinking.md` as the yardstick, and use
   `.agent/skills/reason/SKILL.md` to structure the framing before
   committing to plan shape.

2. Read the directives: `.agent/directives/principles.md` and
   `.agent/directives/testing-strategy.md`.

3. Know the estate: the primary execution plan lives in
   `.agent/plans/active/` (named in `.agent/plans/active/README.md`); other
   in-flight plans in `.agent/plans/current/`; design notes and evidence in
   `.agent/plans/research/`; completed plans in `.agent/plans/archive/`;
   the cross-track summary in `.agent/plans/roadmap.md`. Session-handoff
   prompts live under `.agent/prompts/`.

4. Resolve discoverable unknowns before asking the owner. Search the repo,
   relevant plans, ADRs/PDRs/EDRs, vendor docs or CLIs, and existing code
   first. Ask specific questions only for owner-only decisions or genuinely
   undiscoverable intent. Do not guess scope, intent, or acceptance
   criteria.

## The Four Questions

Every non-trivial plan must answer clearly:

1. What outcome are we trying to produce?
2. What impact should that outcome create?
3. Through what mechanism does that impact create value?
4. How will we know it worked?

Every phase and every task carries the same structure in miniature: name,
description, intended outcome, intended impact, value mechanism, and
explicit, measurable acceptance criteria. Acceptance criteria measure
outcomes, not activity, and each names its proof (a test, a gate, an
observable state, or the owner's confirming act).

## Body Requirements

Every non-trivial plan MUST define:

1. **Goal** — the user-impact outcome sought.
2. **Mechanism** — why the named means produce that outcome.
3. **Acceptance criteria, each with a proof.**
4. **Out of scope** — what the plan explicitly will not do (YAGNI).
5. **Tasks/slices** — sliced at authoring time so each slice is a single
   coherent change within its review budget. Round budgets bind at
   authoring time: slicing at plan time is free; slicing at the first
   over-budget review round is the measured expensive path.
6. **Documentation obligations** — TSDoc on logic and state with examples
   on public interfaces; READMEs where a surface gains or changes purpose;
   an ADR/EDR when the work settles an architectural or editorial decision.

## Authoring Disciplines

### Build-vs-Buy Before Build-Shape

Before committing a plan that integrates with a vendor, answer first:
**which first-party integrations does the vendor ship (plugin, SDK, managed
flow, official GitHub Action), and why are we not choosing one of them?**
Name the vendor's first-party ecosystem explicitly in the plan. Build-vs-buy
is a different question from build-shape and must be answered first — once
the plan is weighing bespoke shapes, the cheapest option has already been
lost.

Two companion disciplines:

- **Decision-record intent-vs-implementation audit.** An ADR that names
  specific CLI commands, argv shapes, or per-step error postures is
  implementation spec in ADR form, foreclosing alternatives without
  evaluating them. ADRs state WHAT outcome must be reached; HOW belongs in
  the plan.
- **Friction ratchet — stop the line at three.** Count signals against the
  solution _shape_ (not against individual tactics): a lint size or
  complexity cap, a dependency cycle, a reviewer finding that requires more
  code, a decision-record amendment to match implementation, a vendor-rule
  exception. When three or more have fired, the next response is a
  shape-reconsideration pause, never another tactical fix. Sunk-cost
  detector phrases in your own reasoning — "we'd have to throw away…",
  "the current implementation is valuable because it's tested" — are paid
  costs, not reasons to continue; future maintenance cost is the only cost
  that matters.

### Pre-Author Scope-Vocabulary Check

Before saving any forward-looking framing in a plan body (`Cycle N`,
`Phase N`, `Round N`, `Next session`, `Follow-on`), ask: _am I authoring
vocabulary that implies scope or commitments the owner did not authorise?_
A series that exists in no owner direction or agreed artefact is invented
obligation — future readers treat "Cycle 2" as agreed scope and plan
accordingly. Strip it and use neutral language naming only what is
authorised; where a future commitment IS authorised, cite the authorising
source inline. The check runs at compose time, never left to review time.

### Schedule It, Sequence It — No Imaginary Flows

Plans commit to concrete scheduled sequence positions, never conditional
triggers ("when X ships", "tripwire fires on Z"). Conditional-trigger soup
creates the illusion of activation flow while quietly stalling; work
happens on definite ordering, not imagined event chains. Where genuine
schedule uncertainty exists, name it as a real owner decision needing
resolution now, with an explicit expiry — no open-ended holding states.

### A Boundary Move Reshapes Every Surface It Lived On

When the owner moves a plan boundary (an out-of-scope item into scope, a
scope item out), it is never a single-spot patch: search the artefact for
every assertion the old boundary was holding up — out-of-scope, acceptance
criteria, mechanism, risks — and move them coherently, then report the
blast radius transparently when the ask named only one section. Editing
only the named section leaves live contradictions on every other surface
the old boundary touched.

### Disposition Ledger For "Apply All Of X" Inputs

When a plan's input is _"apply all of X"_ — every audit finding, every
reviewer comment, every entry in a list — thoroughness is **every item
having a recorded decision**, not every item triggering a separate
execution cycle: every input gets a recorded decision (`applied`,
`already-covered`, `superseded`, `out-of-scope`); implementation work is
sized to the unique substance, not the input count; and counts derived from
the input list are re-derived at execution time so substance preservation
outranks stale arithmetic.

## Agreement, Completion and Archival

A plan governs work once the owner has agreed its shape — present the
draft, receive the word, record it. Status changes reconcile the whole
stack in the same pass: the active plan, `.agent/plans/active/README.md`,
`.agent/plans/roadmap.md`, and any parent-plan summary or prompt naming the
same work.

A plan completes when its acceptance criteria are proven at their declared
proofs; it then moves to `.agent/plans/archive/` with its disposition
recorded. A landed slice, session close, or green gate is not completion
unless the acceptance criteria for the scope are proven. Completion and
archival route through `.agent/skills/consolidate-docs/SKILL.md` so
learning is conserved.

## First Question

Before every decision in the plan: **could it be simpler without
compromising quality or value or functionality?**
