---
name: quality-gates
classification: active
description: Run quality gates and fix issues systematically. Use when running checks, fixing linter errors, preparing to commit, or when any quality gate fails.
---

# Quality Gates

Run gates sequentially from the repo root. Fix issues as they arise. After any fix, restart the full sequence — this prevents regressions from later fixes undoing earlier ones.

## The sequence

The definitive gate list with all command names lives in
`.agent/directives/principles.md` (Code Quality section). The summary:

- `pnpm check` runs the blocking gate sequence with auto-fix where appropriate
  (format, markdownlint, lint, typecheck, test, knip, gitleaks,
  validate-vital-surfaces, validate-portability, validate-subagents).
- `pnpm check:ci` runs them read-only (used by the pre-commit hook).
- `pnpm test:e2e` and `pnpm test:e2e:ui` are separate Playwright surfaces.
  `pnpm test:e2e` runs the full suite (journeys, behaviour, a11y, PDF)
  against a production build; the build is run by Playwright's web server.
- When changing Practice Core or directive docs, run
  `pnpm practice:fitness:informational` and
  `pnpm fitness-vocabulary:check` as advisory companion checks.

When running gates individually for restart-on-fix, start from
`pnpm format:fix`, then `pnpm markdownlint:fix`.

For rendering-risk changes, the visual regression harness is also blocking
proof even though it is not part of `pnpm check`. Run
`pnpm visual-regression-harness <base-ref> <target-ref>` during implementation
once a slice could affect rendered output, and rerun it after later slices as
needed. Do not leave all harness review until the end.

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
