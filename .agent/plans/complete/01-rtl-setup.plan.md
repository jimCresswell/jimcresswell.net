# Cloud Sub-Plan 01: React Testing Library Setup

**Parent plan:** [component-audit.plan.md](../component-audit.plan.md) — Part 6
**Dependencies:** None
**Enables:** All subsequent component sub-plans (03–07)

## Goal

Install and configure React Testing Library so that component integration tests can be written. This is infrastructure — no product components are tested here, only the setup itself.

## Intended Impact

Unblocks all component-level testing across the project. Without this, Parts 3–5 of the component audit cannot proceed.

## Context

- **Test runner:** Vitest (already configured, `vitest.config.ts`)
- **Current environment:** `environment: "node"` — no DOM available
- **Component tests:** None exist yet. Only pure function unit tests and Playwright E2E tests.
- **Setup file:** None exists. Vitest config has no `setupFiles` entry.

## Steps

### 1. Install dependencies

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom jsdom
```

### 2. Create `vitest-setup.ts` at the project root

```ts
import "@testing-library/jest-dom/vitest";
```

This registers the custom matchers (`toBeInTheDocument`, `toHaveAttribute`, etc.) for all test files.

### 3. Update `vitest.config.ts`

Add the setup file reference. Do **not** change the global environment — component tests will use per-file `// @vitest-environment jsdom` pragmas.

Current config:

```ts
test: {
  globals: true,
  environment: "node",
  include: ["**/*.test.{ts,tsx}"],
  exclude: ["node_modules/**", "e2e/**"],
  ...
},
```

Add only:

```ts
test: {
  ...
  setupFiles: ["./vitest-setup.ts"],
  ...
},
```

### 4. Verify with a trivial test

Create `components/rtl-setup.integration.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";

describe("RTL setup", () => {
  it("renders and queries the DOM", () => {
    render(<p>Hello</p>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

Run `pnpm test` and confirm the test passes.

### 5. Delete the verification test

The trivial test exists only to verify setup. Delete `components/rtl-setup.integration.test.tsx` after confirming it passes. Do not commit verification scaffolding.

**Note:** The rules say "no useless tests" — a test that only proves RTL is installed is not useful long-term. The real component tests (in subsequent sub-plans) are what matter.

### 6. Run quality gates

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm test
```

All must pass.

## Acceptance Criteria

- [ ] `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` are in `devDependencies`
- [ ] `vitest-setup.ts` exists at the project root and imports `@testing-library/jest-dom/vitest`
- [ ] `vitest.config.ts` references the setup file
- [ ] `pnpm test` passes (existing tests still work; the trivial test was used to verify, then deleted)
- [ ] `pnpm lint`, `pnpm type-check`, and `pnpm format-check` pass
- [ ] No other files were changed

## Files Affected

| File               | Changes                    |
| ------------------ | -------------------------- |
| `package.json`     | Add three dev dependencies |
| `pnpm-lock.yaml`   | Updated by pnpm            |
| `vitest.config.ts` | Add `setupFiles`           |
| `vitest-setup.ts`  | New — RTL matcher setup    |
