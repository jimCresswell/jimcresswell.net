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
- raw HTML/DOM artifact comparison

The default standard is strict: **zero expected differences**.

## Safety

This tool is designed to be safe to run from a dirty repo.

- It does **not** use `git reset`, `git checkout`, branch switching, rebases, or force operations.
- It does **not** touch the caller's worktree, index, refs, or git history.
- It reads refs using `git rev-parse`.
- It exports snapshots using `git archive` into temporary directories.
- It deletes only its own temporary export directories and writes durable artifacts only under `regression-artifacts/`.

If the harness reports a difference, that is a review signal, not an auto-normalisation path.

## Usage

```bash
pnpm visual-regression-harness <base-ref> <target-ref>
```

Example:

```bash
pnpm visual-regression-harness b76824a HEAD
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

## Output

Artifacts are written under:

```text
regression-artifacts/visual-regression-harness/<base>-vs-<target>/
```

Key contents:

- `comparison.json` — refs, resolved commits, and safety metadata
- `baseline/` — captured artifacts for the base ref
- `target/` — captured artifacts for the target ref
- `diff/` — diff images, text diffs, and `summary.json`

## When to use it

- proving a refactor did not change rendered output
- checking whether metadata drift appeared between two revisions
- generating artifacts for human review before accepting intentional UI changes

Active harness refinements and acceptance criteria are tracked in `.agent/plans/visual-regression-harness.plan.md`.

## Current PKG rule

For the PKG refactor, rendered-page differences are **not expected**.

If the harness surfaces any HTML/DOM or pixel difference:

1. stop
2. inspect the generated artifacts
3. review the difference explicitly before deciding whether it is acceptable
