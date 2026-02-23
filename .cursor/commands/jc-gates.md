# Quality Gates

Run the quality gates sequentially, fixing issues as they arise. Restart the full sequence after every fix.

The gate list, command names, and restart-on-fix discipline are defined in @.agent/directives/rules.md (Code Quality section) — the single source of truth.

Quick start: `pnpm check` runs all six gates with auto-fix. If any gate fails, fix the issue and restart from `pnpm format:fix`.

## Rules

1. **All issues are blocking** — there is no such thing as "someone else's problem"
2. **Fix, don't disable** — never use `eslint-disable`, `@ts-ignore`, or similar escapes
3. **Restart on fix** — after fixing any issue, restart from `pnpm format:fix`
4. **No skipping** — every gate must pass before proceeding to the next

## Success Criteria

All gates pass without disabled checks, skipped tests, type assertions (`as`, `any`, `!`), or ignored errors.

When complete, confirm: "All quality gates pass."

@.agent/directives/testing-strategy.md
