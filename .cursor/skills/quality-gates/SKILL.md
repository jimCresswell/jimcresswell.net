---
name: quality-gates
description: Run quality gates and fix issues systematically. Use when running checks, fixing linter errors, preparing to commit, or when any quality gate fails. Covers the full gate sequence, restart-on-fix discipline, and prohibited shortcuts.
---

# Quality Gates

Run gates sequentially from the repo root. Fix issues as they arise. After any fix, restart the full sequence — this prevents regressions from later fixes undoing earlier ones.

## The sequence

The definitive gate list with all command names lives in [rules.md](../../.agent/directives/rules.md#code-quality). The summary:

- `pnpm check` runs all six gates with auto-fix (format, lint, typecheck, test, knip, gitleaks).
- `pnpm check:ci` runs them read-only (used by the pre-commit hook).
- `pnpm test:e2e` and `pnpm test:e2e:pdf` are separate (E2E, require Chromium).

When running gates individually for restart-on-fix, start from `pnpm format:fix`.

## Restart-on-fix discipline

If any gate fails:

1. Fix the issue in product code (not by disabling the check).
2. Restart from `pnpm format:fix`.
3. Repeat until all gates pass without fixes.

This matters because a type-check fix might introduce a lint issue, or a test fix might introduce unused code that Knip catches.

## Prohibited shortcuts

- `eslint-disable`, `@ts-ignore`, `@ts-expect-error` — fix the root cause
- `as`, `any`, `!` — these disable the type system
- `it.skip`, `describe.skip` — fix or delete the test
- `--no-verify` on git operations — never bypass hooks
- Commenting out code — fix or delete it

## When to run

- Before every commit (the pre-commit hook enforces this).
- After any substantive code change.
- After resolving merge conflicts.
- When asked to verify the codebase is clean.

## Success

All gates pass. No disabled checks, no skipped tests, no type assertions, no ignored errors. Confirm: "All quality gates pass."
