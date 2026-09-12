# Visual Regression Harness

## Status

Complete for the current PKG proof scope on 2026-03-08.
Future harness enhancements now live in
[future/visual-regression-harness-enhancements.plan.md](../future/visual-regression-harness-enhancements.plan.md).

## Overview

The visual regression harness is now a working, non-destructive
ref-to-ref proof tool.

- it compares exported refs without touching git state
- it supports the special `WORKTREE` comparison source
- it treats differences as review items rather than a failed check
- it keeps screenshot comparison strict
- it narrows HTML auto-acceptance to explicit, contract-backed rules

This plan records the closure of the historical PKG proof work.

## Settled behaviour

- `pnpm visual-regression-harness <base-ref> <target-ref>` runs end to end.
- Exports are read-only (`git rev-parse` + `git archive`); the caller's
  worktree, index, refs, and history are never touched.
- `WORKTREE` snapshots the live repository state, including staged,
  unstaged, untracked non-ignored files, and tracked deletions.
- `document.html` is normalised only for explicit Next.js/Vercel runtime
  noise.
- Screenshot comparison remains strict; there are no exclusion masks.
- Target-only CV section `id` additions are auto-accepted only when they
  match the shared page/document contract in
  `lib/page-document-contract.ts` exactly.

## Accepted PKG proof artefacts

The recorded comparison
`regression-artifacts/visual-regression-harness/b76824a-vs-WORKTREE/`
still contains 5 review items, but they are now explicitly approved for
the historical PKG proof.

### Accepted category 1: page-level JSON-LD additions

Accepted files:

- `home/main.html.diff.txt`
- `cv/main.html.diff.txt`
- `cv-public-sector/main.html.diff.txt`

Reason:

- these are intentional page-level structured-data additions from the PKG
  work
- they do not alter visible rendered output (`0` unexpected pixel
  differences across the full run)
- they are covered by the repo's Schema.org and rich-result-facing
  validation layers

### Accepted category 2: canonical CV page metadata correction

Accepted files:

- `cv/document.html.diff.txt`
- `cv/metadata.json.diff.txt`

Reason:

- this is the deliberate addition of the canonical link and canonical
  metadata for `/cv/`
- it fixes a real page-identity gap rather than introducing accidental
  drift
- it is validated by the shared page/document contract and the SEO E2E
  checks

### Result

For the PKG migration, the proof is now:

- visual content preserved relative to the pre-PKG baseline
- semantic data-layer changes present only where intentionally added and
  explicitly approved

## Verification

The close-out state was verified on 2026-03-08:

- `pnpm check` passed
- `pnpm test:e2e` passed (`48/48`)
- `pnpm visual-regression-harness b76824a WORKTREE` completed with:
  - `0` unexpected pixel differences
  - `5` approved semantic review items

## Future

Potential future enhancements are intentionally out of the active closure
path and are tracked in
[future/visual-regression-harness-enhancements.plan.md](../future/visual-regression-harness-enhancements.plan.md).

## Related

- [Graph metaplan](graph-metaplan.plan.md)
- [visual-regression-harness/README.md](../../visual-regression-harness/README.md)
- [ADR-016](../../docs/architecture/decision-records/016-review-oriented-visual-regression-harness.md)
- [ADR-017](../../docs/architecture/decision-records/017-cv-tilt-routes-are-canonical-aliases.md)
