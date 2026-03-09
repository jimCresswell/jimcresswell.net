# Visual Regression Harness

Non-destructive ref-to-ref comparison for the PKG refactor and future rendering changes.

## What it captures

For `/`, `/cv`, and `/cv/public_sector`, the harness captures:

- full-page screenshots
- section-level screenshots
- full document HTML
- `main` HTML
- selected region HTML
- page metadata (`title`, description, canonical)

It then performs:

- pixel comparison
- text-artefact comparison for HTML and metadata

The comparison is strict about what counts as a difference, but it is not a
quality gate. Unexpected differences are written as review artefacts for human
approval or rejection.

For rendering-risk work in this repo, it is still a blocking proof
requirement. The command itself remains review-oriented, but you must run it
during implementation and resolve unexpected differences before proceeding.

## Safety

This tool is designed to be safe to run from a dirty repo.

- It does **not** use `git reset`, `git checkout`, branch switching, rebases, or force operations.
- It does **not** touch the caller's worktree, index, refs, or git history.
- It reads refs using `git rev-parse`.
- It exports snapshots using `git archive` into temporary directories.
- It deletes only its own temporary export directories and writes durable artifacts only under `regression-artifacts/`.

If the harness reports a difference, that is a review signal unless an explicit
documented comparison rule says otherwise.

## Usage

```bash
pnpm visual-regression-harness <base-ref> <target-ref>
```

Example:

```bash
pnpm visual-regression-harness b76824a HEAD
```

The special value `WORKTREE` snapshots the repository exactly as it exists now:

- committed files from the current checked-out `HEAD`
- staged and unstaged tracked changes
- untracked, non-ignored files
- tracked deletions

Either comparison input may use `WORKTREE`, though the common workflow is a
known-good git ref versus the current in-flight state.

Example:

```bash
pnpm visual-regression-harness b76824a WORKTREE
```

Optional flags:

```bash
pnpm visual-regression-harness <base-ref> <target-ref> \
  --repo-root /path/to/repo \
  --output-dir /path/to/output \
  --base-port 3200 \
  --target-port 3201
```

The command prints the artifact directory on success.

## Current limitations

- There is no capture cache yet. Every run exports, builds, and captures from scratch.
- There is no `--force` flag yet, because there is currently nothing to bypass.
- Re-running the same label pair writes into the same output directory unless `--output-dir` is set explicitly.

## Output

Artifacts are written under:

```text
regression-artifacts/visual-regression-harness/<base>-vs-<target>/
```

Key contents:

- `comparison.json` — refs, resolved commits, and safety metadata
- `summary.txt` — short human-readable result
- `baseline/` — captured artefacts for the base ref
- `target/` — captured artefacts for the target ref
- `diff/summary.json` — machine-readable review summary (`requiresReview`, unexpected differences, per-artefact records)
- `diff/<route>/<artifact>.png` — PNG diff image for each captured screenshot, written even when blank
- `diff/<route>/<artifact>.review.png` — baseline/diff/target review strip for each captured screenshot
- `diff/<route>/<artifact>.diff.txt` — line-level diff for changed text artefacts

When `WORKTREE` is used, `comparison.json` also records that source type and the
mixed extraction methods (`git archive` for the committed side, `git archive +
worktree overlay` for the live side).

## Comparison policy

### Screenshots

Screenshot comparison stays strict. There are no screenshot exclusion masks.

If the pixels differ, the harness records that as an unexpected difference and
stores the raw screenshots plus the diff/review images for human judgement.

### HTML artefacts

`main.html`, section HTML, and `metadata.json` comparisons are strict by
default.

`document.html` is normalised explicitly before comparison so Next.js/Vercel
build noise does not dominate the review. The normalisation removes:

- Next.js and Vercel runtime asset tags
- inline Next.js flight/runtime payload scripts
- the ephemeral route announcer node
- hashed next/font class tokens on the root `<html>` element

For the CV routes only, the harness also auto-accepts target-only section `id`
additions when all of the following are true:

- the `id` matches the shared document contract in `lib/page-document-contract.ts`
- removing the `id` from the target makes the artefact match the baseline exactly
- the change is only an expected structural anchor addition, not a mixed diff

This rule is narrow on purpose. Unexpected ids, missing expected ids, metadata
changes, JSON-LD changes, and content changes remain visible and require
explicit approval or rejection.

## Validation layers

The harness is not the only proof mechanism for page-as-data behaviour.

- Schema.org validity is enforced separately by `lib/schema-org-check.integration.test.ts`.
- Rich-result-facing page identity is enforced by `lib/search-structured-data.ts`,
  `lib/page-document-contract.integration.test.ts`, and
  `e2e/behaviour/seo.e2e-api.test.ts`.
- The shared page/document contract in `lib/page-document-contract.ts` is the
  source of truth for CV section anchors and canonical page identity rules.

## When to use it

- proving a refactor did not change rendered output
- checking whether metadata drift appeared between two revisions
- generating artefacts for human review before accepting intentional UI changes
- proving rendering-risk infrastructure or content-model changes while the work
  is still in flight, not only at the end

## Current PKG rule

For the PKG refactor, rendered-page differences are **not expected** across the
captured site surfaces (`/`, `/cv`, and `/cv/public_sector`) except for
explicitly documented comparison rules such as the contract-backed CV section
anchor additions.

The harness is a blocking proof requirement for rendering-risk changes. Run it
on meaningful implementation slices rather than waiting until all coding is
done.

If the harness surfaces any HTML, metadata, or pixel difference:

1. stop
2. inspect the generated artefacts
3. approve or reject the difference explicitly

## Approved historical PKG differences

For the recorded historical comparison `b76824a` versus `WORKTREE`, the
remaining 5 non-pixel review items are explicitly approved.

Approved category 1:

- page-level JSON-LD `<script type="application/ld+json">` additions in
  `home/main.html`, `cv/main.html`, and `cv-public-sector/main.html`

Approved category 2:

- the deliberate canonical-page correction on `/cv/`, visible in
  `cv/document.html` and `cv/metadata.json`

Those approvals are specific to the recorded PKG proof run. They do not turn
new future differences into auto-accepts. New occurrences still require review
unless they fall under an explicit documented comparison rule.
