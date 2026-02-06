# Rules

All of these rules MUST be followed at all times.

## First Question

Always apply the first question: **Ask: could it be simpler _without compromising quality_?** The answer will often be no, and that is fine, but bring real critical thinking to the question each time.

## Code Design Principles

- **TDD** — ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to _prove it fails_), Green (run the test to prove it passes, _because product code exists now_), Refactor (improve the product code implementation, now that the _behaviour_ at the interface will remain proven by the test).
- **Keep it simple** — DRY, KISS, YAGNI, SOLID principles.
- **Pure functions first** — No side effects, no I/O. Use TDD to design (test first, red, green, refactor).
- **Consistent naming** — Use consistent naming conventions for files, modules, functions, data structures, classes, constants, type information, and concepts. If you need to add nuance, use TSDoc to provide context, links, and examples.
- **Fail fast** — Fail fast with helpful error messages, never silently. Never ignore errors.
- **No backwards compatibility layers** — Replace old approaches with new approaches. Never create parallel versions.

## Type Safety

- **No type shortcuts** — Never use `as`, `any`, or `!` — they disable the type system.
- **Type imports must be labelled** — e.g. `import type { Type } from 'package'` or `import { type Type } from 'package'`.
- **Validate external data** — Parse and validate external signals (API responses, file reads, etc.). Use Zod where appropriate.
- **Single source of truth for types** — Define types once and import them consistently.

## Testing

For the full testing strategy, see [testing-strategy.md](./testing-strategy.md). Do not duplicate its content here.

**Key principles:**

- **TDD at all levels** — Unit, integration, and E2E tests are all written FIRST.
- **Test behaviour, not implementation** — We should be able to change _how_ something works without breaking the test that proves _that_ it works.
- **No complex mocks** — Mocks should be simple fakes, injected as arguments. Complex mocks are a signal that product code needs simplifying.
- **No global state mutation in tests** — No `process.env` mutations, no `vi.stubGlobal`, no `vi.doMock`. Product code must accept configuration as parameters.
- **No skipped tests** — Fix it or delete it.
- **No useless tests** — Each test must prove something useful about the product code.
- **Do not test types** — Tests are for runtime logic. If a test only tests types, delete it.

## Tooling

Use the right tool for the job:

- **Vitest** for unit and integration tests
- **React Testing Library** for component integration tests
- **Playwright** for E2E tests (UI and API)
- **TypeScript** for compile-time type safety
- **ESLint** for syntax correctness and code-style adherence
- **Prettier** for code formatting

## Code Quality

- **Never disable checks** — Never disable type checks, linting, formatting, tests, or Git hooks (`--no-verify`).
- **Never work around checks** — If a variable is unused, figure out why and fix it. Always fix the root cause.
- **Quality gates** — Run ALL gates after changes: format → lint → type-check → test → knip. See [ADR-005](../../docs/architecture/decision-records/005-knip-unused-code-detection.md) for why Knip is in the gate.
- **No unused code** — If a function is not used, delete it. If product code is only used in tests, delete it. Delete dead code.
- **No commented-out code** — Fix it or delete it.
- **Version with git, not with names** — Fix files in place. Never create parallel versions using naming (e.g. `foo.v2.ts`).

## Refactoring

- **TDD** — Always use TDD when refactoring. The tests prove behaviour is preserved.
- **Splitting long files** — Split into smaller files grouped by responsibility. Keep boundaries clear with index.ts files.
- **Splitting long functions** — Split into smaller, pure functions with a single responsibility.
- **Removing unused code** — If it is not used, delete it.

## Documentation

- **TSDoc everywhere** — All exported functions and non-trivial internal functions MUST have TSDoc comments. Public interfaces should include examples and usage patterns.
- **Good READMEs** — Each significant directory should have a README explaining what it contains and how to use it.
- **Inline comments for the "why"** — Comment the reasoning, not the mechanics. The code shows _what_; comments explain _why_.
