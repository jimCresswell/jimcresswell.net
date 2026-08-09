# Quality Gates

Run the quality gates sequentially, fixing issues as they arise. Restart the full sequence after every fix.

The gate list, command names, and restart-on-fix discipline are defined in `.agent/directives/principles.md` (Code Quality section) — the single source of truth.

Quick start: `pnpm check` runs the blocking gate sequence with auto-fix where
appropriate. If any gate fails, fix the issue and restart from
`pnpm format:fix`.

For rendering-risk changes, the visual regression harness is also blocking proof. Run it during the implementation slices rather than deferring it until the end. Unexpected differences must be reviewed and either fixed or explicitly approved before proceeding.

## Rules

1. **All issues are blocking** — there is no “someone else’s problem”.
2. **Fix, don’t disable** — never use `eslint-disable`, `@ts-ignore`, or similar escapes.
3. **Restart on fix** — after fixing any issue, restart from `pnpm format:fix`.
4. **No skipping** — every gate must pass before progressing.

## Success Criteria

All gates pass without disabled checks, skipped tests, type assertions (`as`, `any`, `!`), or ignored errors. Confirm: “All quality gates pass.”

See also: `.agent/directives/testing-strategy.md`
