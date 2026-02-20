# Quality Gates

Run the quality gates sequentially, fixing issues as they arise. Restart the full sequence after every fix.

## The Sequence

Run each gate in order from the repo root. If a gate fails, fix the issue and restart from step 1.

```bash
pnpm format          # 1. Prettier — auto-fixes formatting
pnpm lint            # 2. ESLint — syntax and style
pnpm type-check      # 3. TypeScript — type safety
pnpm test            # 4. Vitest — unit and integration tests
pnpm knip            # 5. Knip — unused code and dependencies
pnpm gitleaks        # 6. Gitleaks — secrets in git history
```

`pnpm check` runs all six as a single command (using `format-check` instead of `format`). The pre-commit hook runs `pnpm check`.

E2E tests are separate — run explicitly when needed:

```bash
pnpm test:e2e        # Playwright — UI and API tests
pnpm test:e2e:pdf    # Playwright — PDF generation tests (requires prior build)
```

## Rules

1. **All issues are blocking** — there is no such thing as "someone else's problem"
2. **Fix, don't disable** — never use `eslint-disable`, `@ts-ignore`, or similar escapes
3. **Restart on fix** — after fixing any issue, restart from `pnpm format`
4. **No skipping** — every gate must pass before proceeding to the next

## Success Criteria

All gates pass without disabled checks, skipped tests, type assertions (`as`, `any`, `!`), or ignored errors.

When complete, confirm: "All quality gates pass."

@.agent/directives/rules.md
@.agent/directives/testing-strategy.md
