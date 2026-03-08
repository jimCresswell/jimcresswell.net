# ADR-016: Review-oriented visual regression harness for exported refs

## Status

Accepted

## Date

2026-03-08

## Context

The personal knowledge graph refactor needed historical before/after proof
without touching the live worktree or rewriting git state. The repo already had
an export-based visual regression harness under `visual-regression-harness/`,
but two parts of its behaviour still needed to be settled.

- It treated any difference as a command failure, which made the tool behave
  like a gate rather than a review workflow.
- `document.html` diffs were polluted by Next.js and Vercel runtime noise
  (hashed assets, runtime scripts, flight payloads), even when the rendered page
  had not changed.

At the same time, Jim wanted the screenshot comparison to remain strict because
the pages are static: if pixels move, that should be reviewed explicitly rather
than hidden behind ignore masks.

## Decision

The visual regression harness uses the following model.

### 1. Compare exported refs, or a deliberate WORKTREE snapshot, never by mutating git state

- resolve refs with `git rev-parse`
- export snapshots with `git archive`
- allow the special source value `WORKTREE`, implemented as an archive of
  `HEAD` plus a safe overlay of tracked, staged, unstaged, and untracked
  working-tree changes
- build and serve only from temporary directories
- write durable artefacts only under `regression-artifacts/`

The harness remains non-destructive and safe to run from a dirty repo.

### 2. Differences are review items, not automatic check failures

The harness records unexpected differences for human approval or rejection. It
does not fail the command merely because base and target differ.

- `diff/summary.json` records `requiresReview` plus the unexpected differences
- `summary.txt` gives a short human-readable outcome
- HTML, JSON metadata, and PNG differences are durable review artefacts, not
  implicit verdicts

Operational errors still fail the command; content differences do not.

### 3. Screenshot comparison stays strict and reviewable

Screenshot comparison does not support ignore masks by default.

- baseline and target screenshots are preserved in `baseline/` and `target/`
- each PNG comparison writes a diff PNG, even when it is blank
- each PNG comparison also writes a `*.review.png` strip in the order:
  baseline, diff, target

This keeps the visual proof surface honest: any pixel difference is surfaced and
must be reviewed explicitly.

### 4. HTML comparison uses explicit, narrow normalisation

Only `document.html` is normalised, and only for build/runtime noise that is
not meaningful page content:

- Next.js and Vercel runtime asset tags
- inline Next.js flight/runtime payload scripts
- the ephemeral route announcer node
- hashed next/font class tokens on the root `<html>` element

`main.html`, region HTML, metadata, and screenshots remain strict by default.
JSON-LD additions and other semantic DOM changes remain review signals unless a
separate explicit contract-backed rule says otherwise.

### 5. Structural HTML auto-acceptance must be contract-backed and one-way

The harness may auto-accept a structural HTML change only when the rule is
explicit, narrow, and backed by product-owned validation.

For the current PKG work, this means:

- target-only CV section `id` additions may be auto-accepted
- only if the `id` values match the shared page/document contract
- only if removing those ids makes the target artefact match the baseline exactly

Unexpected ids, missing expected ids, mixed HTML diffs, metadata changes, and
JSON-LD changes remain review items.

## Consequences

- The harness is now a durable approval workflow rather than a brittle binary
  gate
- Historical comparisons can be run safely from active work without touching the
  caller's git state
- Reviewers can inspect baseline, target, diff, and review-strip screenshots for
  every captured PNG artefact
- Next.js build noise no longer drowns `document.html` review
- Narrow, contract-backed anchor additions can be kept out of the review set
  without hiding structural regressions
- The harness is intentionally unsuitable as a simple pass/fail CI check for UI
  changes; it is a review tool whose outputs need human judgement

## Related

- [ADR-014](014-entity-model-design.md) — the PKG refactor that required
  historical proof
- [ADR-017](017-cv-tilt-routes-are-canonical-aliases.md) — canonical identity
  rules for tilt routes and inline page JSON-LD
- [visual-regression-harness/README.md](../../../visual-regression-harness/README.md)
  — operational usage and artefact layout
- [docs/architecture/README.md](../README.md) — architecture overview including
  regression proofing
