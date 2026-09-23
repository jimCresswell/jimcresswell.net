---
title: 'Strategy — Stream: the Practice'
type: strategy
status: ratified
last_updated: 2026-09-23
governed_by:
  - .agent/plans/strategy/README.md
---

# Stream — the Practice

_Part of the [strategy](README.md). The engineering practice and agent estate: one Practice
that several repositories carry, raised to the best of each, and a learning loop it must
actually close._

## Choices

- **PRACTICE-1 — Every instance of the Practice holds the best of each.** The practice and
  agent estate here are one instance of a Practice that several repositories carry (the
  2026-09-12 transplant from the lineage is the first generation here). The instances are
  aligned upward, never toward one of them: where they hold different things each takes the
  other's, where they hold two encodings of one thing every instance takes the higher, and
  what is bad is removed wherever it is carried. A decline is allowed and never the default;
  where neither encoding is shown higher, each instance keeps its own
  ([PDR-142](../../practice-core/decision-records/PDR-142-the-best-of-each-practice.md)).
  Shared concepts converge and are never aliased side by side, and what is repo-local by kind
  stays here and is recorded. What travels is the concept, in the owner's words of
  2026-09-23: "byte for byte transfer is never the goal, concept transfer is". Reworded
  2026-09-23 on the owner's card ("One node, reworded").
- **PRACTICE-2 — The learning loop is closed, not nominal.** Napkin → distilled → pending
  graduations → doctrine is the reason the Practice is here; the 57 archived lessons are
  synthesised by one seat and reviewed by the owner before anything graduates; every
  mechanism the estate claims has an instrument behind it (a validator, a bin, a gate).
- **PRACTICE-3 — Assertions are exercised, never trusted.** Every transplanted surface's
  claims (scripts exist, hooks set state, paths resolve) are checked by a validator before a
  seat meets them; a red is cured by making the assertion checkable, by removing the
  dependence, or by truing the text, in that order.

## Serving nodes

A strategic node serving a choice here declares `serves: PRACTICE-<n>`; a delivery node or
runbook declares the strategic node it serves. Enumerate them by searching `.agent/plans/`
for those `serves` values, never by a hand-kept list (the plans README); the plan-corpus
validator resolves every edge.

## Won't do

- Fork the Practice from its lineage; divergence is recorded, never silent.
- Graduate a lesson without the owner's review.
