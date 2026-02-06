# Testing Strategy

Always use TDD at ALL levels (unit, integration, E2E).

## Tooling

- **Vitest** — Unit and integration tests
- **React Testing Library** — Component integration tests
- **Playwright** — E2E tests (both UI and API)

## Philosophy

- ALWAYS test behaviour, NEVER test implementation.
- ALL tests must prove something useful about the product code, tests that exercise test code should be deleted.
- Prefer pure functions and unit tests.
- Always use TDD at ALL levels (unit, integration, E2E).
- ALL mocks MUST be simple fakes, injected as arguments to the function under test.
- NEVER manipulate global state in tests — no `process.env` mutations, no `vi.stubGlobal`, no `vi.doMock`. Product code must accept configuration as parameters.
- NEVER add complex logic to tests — complexity in tests risks testing the test code rather than the code under test.
- Each proof should happen ONCE — repeated proofs are fragile and waste resources.

## Test Types

### Unit Tests (Vitest)

Tests that verify the behaviour of a single pure function in isolation. No mocks, no IO, no side effects.

- **Named**: `*.unit.test.ts`
- **Location**: Next to the code they test
- **Runner**: `pnpm test`

### Integration Tests (Vitest + React Testing Library)

Tests that verify how multiple units work together as code, imported into the test process. Can include simple injected fakes. Can test React component trees with React Testing Library.

- **Named**: `*.integration.test.ts`
- **Location**: Next to the code they test
- **Runner**: `pnpm test`

**Important**: Integration tests are NOT about testing a running system — they test how code units integrate when imported and called directly.

### E2E-UI Tests (Playwright)

Browser automation tests against a running application. Full access to file system and network. No constraints.

- **Named**: `*.e2e-ui.test.ts`
- **Location**: `e2e/` directory at project root
- **Runner**: `pnpm test:e2e`

### E2E-API Tests (Playwright request API)

HTTP-level tests against a running application using Playwright's `APIRequestContext`. Full access to file system and network. No constraints.

- **Named**: `*.e2e-api.test.ts`
- **Location**: `e2e/` directory at project root
- **Runner**: `pnpm test:e2e`

## TDD at All Levels

Write tests FIRST at every level. Red, Green, Refactor.

| Test Level      | What It Specifies       | When to Write                   | RED Phase                    |
| --------------- | ----------------------- | ------------------------------- | ---------------------------- |
| **Unit**        | Pure function behaviour | Before function exists          | No function — test fails     |
| **Integration** | How units work together | Before integration exists       | Units not wired — test fails |
| **E2E**         | System behaviour        | Before system behaviour changes | Old behaviour — test fails   |

When behaviour changes, update tests at the SAME level as the change FIRST, before changing implementation.

## Rules

- **No skipped tests** — Fix it or delete it. Never use `it.skip`, `describe.skip`, or any other skipping mechanism.
- **No useless tests** — Each test must prove something useful about product code.
- **Do not test types** — Tests are for runtime logic. Use TypeScript to validate types.
- **No complex mocks** — If mocks are complex, that is a signal to simplify the product code.
- **Test to interfaces, not internals** — Tests should survive refactoring.
