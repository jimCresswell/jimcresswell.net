# Bugbot Rules

For full project context, read `.agent/directives/AGENT.md` and `.agent/directives/rules.md`.

## Project

Personal website and CV for Jim Cresswell.
Stack: Next.js 16, React 19, Tailwind CSS 4, deployed on Vercel.
Package manager: pnpm (never npm/yarn).

## Review Focus

- **Type safety** — Flag uses of `as`, `any`, or `!` (non-null assertion). These disable the type system.
- **Type imports** — Must use `import type` or `import { type ... }` syntax.
- **No dead code** — Flag unused functions, commented-out code, or skipped tests.
- **No backwards compatibility layers** — Old approaches should be replaced, not left alongside new ones.
- **Fail fast** — Errors must never be silently ignored.
- **External data validation** — API responses, file reads, and other external signals must be parsed and validated.

## Testing

- TDD is mandatory: tests are written before product code.
- Tests must assert behaviour, not implementation details.
- No complex mocks — mocks should be simple fakes injected as arguments.
- No global state mutation in tests (`process.env`, `vi.stubGlobal`, `vi.doMock`).
- No skipped or useless tests.

## Documentation

- All exported functions must have TSDoc comments.
- Inline comments explain "why", not "what".

## Style

- British spelling throughout (e.g. "behaviour", "colour", "organise").
- Accessibility matters — flag missing ARIA attributes, poor semantic HTML, or missing alt text.
