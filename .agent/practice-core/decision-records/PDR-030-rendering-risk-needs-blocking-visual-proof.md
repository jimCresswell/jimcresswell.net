# PDR-030: Rendering-Risk Changes Need Blocking Visual Proof

## Status

Accepted

## Date

2026-04-19

> **Renumbering note (2026-04-19):** originally landed locally as PDR-025 on
> 2026-04-19. An incoming Practice Core integration the same day carried an
> upstream PDR-025 (Quality-Gate Dismissal Discipline) with prior network
> reservations on PDR-026 through PDR-029, so this local PDR moved to the next
> free number (PDR-030) without altering its substance. The original local
> acceptance date is retained.

## Related

- [PDR-020](PDR-020-check-driven-development.md)
- [PDR-021](PDR-021-test-validity-discipline.md)
- [ADR-016](../../../docs/architecture/decision-records/016-review-oriented-visual-regression-harness.md)

## Context

Some changes can preserve functional correctness while still changing the
rendered artefact in meaningful ways: layout shifts, visual hierarchy changes,
contrast regressions, unintended PDF drift, missing sections, or structural DOM
changes that alter the user-facing output. Unit, integration, and behavioural
E2E tests remain necessary, but they are not sufficient to prove that the
rendered output stayed within the intended contract.

Teams often treat visual proof as optional, end-loaded, or advisory. That fails
in two ways:

1. rendering regressions are discovered late, after many unrelated changes have
   been layered on top
2. the absence of explicit visual proof creates a gap where claims about
   rendered output travel without evidence

The Practice needs a reusable decision for when visual proof is required and
how it should behave, independent of any particular harness or framework.

## Decision

For rendering-risk work, visual proof is **blocking**.

### 1. Qualifying changes must carry explicit visual proof

A change is rendering-risk when it can affect user-visible output through:

- layout, styling, typography, or theming
- content-model, metadata, or graph wiring that changes rendered output
- PDF or image-generation surfaces
- routing, composition, or template changes
- framework or tooling upgrades that alter rendering semantics

For those slices, the work is not complete until visual proof has been reviewed
and resolved.

### 2. The proof surface is review-oriented, not content-difference-failing by default

Visual proof tools may record differences as review items rather than treating
every content difference as a command failure. Operational errors still fail the
tool immediately. Content differences require human review and explicit
disposition.

This does **not** make the proof optional. It means the workflow separates:

- tool/runtime failure
- observed rendering difference
- human acceptance or rejection of that difference

### 3. Proof must happen during implementation, not only at the end

For multi-slice work, visual proof should run on meaningful intermediate slices.
Do not defer the first visual comparison until the end of a long refactor or
migration.

### 4. Artefacts must be durable enough for review

The chosen proof surface must preserve enough evidence for a reviewer to judge
what changed. Typical artefacts include:

- baseline and target screenshots
- diff artefacts
- HTML or metadata snapshots
- PDF before/after outputs
- concise review summaries tied to those artefacts

### 5. Auto-acceptance must be narrow and contract-backed

If a team allows a visual or structural change to be auto-accepted, that rule
must be explicit, narrow, and backed by product-owned validation. Broad
normalisation that hides meaningful differences is prohibited.

### 6. Tool choice is host-local

This PDR does not mandate a specific harness, framework, or artefact format.
Host repos choose the tool that fits their stack. The reusable rule is the
blocking-proof requirement and the review discipline around it.

## Rationale

Rendering is part of product behaviour. When a repo claims that a UI-affecting
change is safe, it needs evidence at the rendered-output layer rather than only
at the code or data layer. Making visual proof blocking closes the gap between
engineering claims and user-facing evidence while still allowing host repos to
choose their own implementation.

## Consequences

- UI-bearing repos need an explicit visual-proof workflow for rendering-risk
  slices
- review-oriented harnesses are valid, provided review is mandatory before the
  work proceeds
- teams must decide what counts as rendering-risk and document that threshold
- visual-proof outputs become part of the evidence chain for high-risk changes
- host-local ADRs may still govern the specific harness, artefact layout, and
  automation choices
