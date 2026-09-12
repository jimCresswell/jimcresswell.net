---
name: gates
classification: active
description: Run all quality gates and fix issues.
---

# Quality Gates

Run the quality gates one by one from the repo root. Fix any and all issues
that arise, regardless of location or cause.

After each fix, **restart the quality gate sequence from the beginning**. This prevents regressions to earlier gates from later fixes.

Treat the gate surface as a stack, not a flat list. An upstream red gate can
hide downstream failures because later stages do not become trustworthy until
the earlier stage is green. When one gate clears, expect the next gate to
surface a previously hidden problem. Discovery helpers such as
a continue-mode turbo run (`pnpm exec turbo run lint type-check test --continue`) can reveal more of the
stack, but final acceptance still requires the sequence below to pass cleanly
from the beginning.

This sequence is the current `pnpm check` script — the canonical read-only
aggregate local proof gate — unrolled one leg per line, followed by the gates
that live outside it. The pre-commit hook runs the staged subset, the pre-push
hook runs `pnpm check:ci` (an alias of `check`) plus the site's end-to-end
tests, and CI runs the same legs (`validate-check-ci-parity` refuses a drift
between `check` and `.github/workflows/ci.yml`). Re-read `package.json` before
editing this list; the root script is the source of truth when the gate graph
changes, and the cited-scripts validator refuses a `pnpm <script>` citation
that `package.json` does not define.

## The Sequence

Run each gate in order. If a gate fails, fix the issues before proceeding.

```bash
pnpm format
pnpm markdownlint:check
pnpm lint:shell
pnpm lint:runtime-only
pnpm lint
pnpm type-check
pnpm test
pnpm knip
pnpm depcruise
pnpm secrets:scan
pnpm portability:check
pnpm subagents:check
pnpm skills:check
pnpm encoding:check
```

Gates outside `check`, run when the work touches their surface:

```bash
pnpm build                      # the site and every workspace; PDF generation is part of it
pnpm test:e2e                   # Playwright against a production build (pre-push runs this)
pnpm test:e2e:ui                # the same suite in Playwright's UI mode
pnpm visual-regression-harness  # rendered-proof comparison for visual work
pnpm check:docs                 # format + markdownlint + the docs validators
pnpm plan-gates:check           # plan-node gate drift
```

Use mutating repair commands such as `pnpm fix` (the mutating aggregate),
`pnpm lint:fix`, `pnpm markdownlint:fix` or `pnpm format:fix` only to fix a
failing proof, then re-run the proof sequence from the beginning; `pnpm
check:fix` runs the repair aggregate and then the proof. Do not treat mutating
repair commands as final evidence that the tree is clean.

## Rules

1. **All issues are blocking** - There is no such thing as "someone else's problem"
2. **Fix, don't disable** - Never use `eslint-disable`, `@ts-ignore`, or similar escapes
3. **Restart on fix** - After fixing any issue, restart from the beginning
4. **No skipping** - Every gate must pass before proceeding to the next

## Process

For each gate in the sequence above:

- If the gate fails, fix the issue
- After fixing, restart from the beginning (`pnpm format`)
- If the gate passes, proceed to the next one

The full sequence mirrors `pnpm check` in `package.json`.

## Success Criteria

All gates pass without:

- Disabled checks
- Skipped tests
- Type assertions (`as`, `any`, `!`)
- Ignored errors

When complete, confirm: "All quality gates pass."
