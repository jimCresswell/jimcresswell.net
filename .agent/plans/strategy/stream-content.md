---
title: 'Strategy — Stream: the content'
type: strategy
status: ratified
last_updated: 2026-09-13
governed_by:
  - .agent/plans/strategy/README.md
---

# Stream — the content

_Part of the [strategy](README.md). The owner's word: "Ultimately this is my CV, the
content is what matters."_

The repository publishes one person's professional identity as a CV. The content is the
product; everything else in the estate exists to carry it truthfully, to make it known, and
to keep it provable.

## Choices

- **CONTENT-1 — One canonical CV, editorially governed.** The CV is a single canonical view
  (ADR-021 retired the audience tilts); every claim is factual, sourced from the entity
  facts, and written under the editorial directives (`editorial-strategy.md`,
  `editorial-guidance.md`). Editorial work is collaborative: the owner's facts and voice,
  real editorial craft, no invention.
- **CONTENT-2 — LinkedIn is parallel, private, owner-led.** LinkedIn draws evidence from the
  editorial CV but is composed for its own audience and interface, behind the private
  editorial boundary (private material, never quoted or published; `privacy.md`).
  The public estate carries routing and safety only; the headline is closed; field order is
  the owner's; the About section is deliberately last. Two rejected methods stay rejected:
  deriving copy from an identity model, and verbatim owner-transcription without craft.
- **CONTENT-3 — Deferred doors stay discoverable, not implicit.** The tilt mechanism and
  tilt content (preserved as reference under ADR-021's re-entry route), A/B testing and user
  feedback, and Lighthouse performance testing are closed until a product requirement, a
  plan and a decision record reopen them.

## What is settled (read from the legacy corpus, 2026-09-13)

Positioning, capabilities, metadata and SEO, the experience and Before Oak sections, the
front page, and the factual audit are settled and archived (the conserved corpus lists each
record). The single-string `meta.summary` is an interim simplification (ADR-011) that the
graph decouples when the Person entity carries its own description.

## Won't do

- Variant CVs or per-audience copy without a reopened tilt decision.
- Editorial copy staged in the public repository for LinkedIn.
