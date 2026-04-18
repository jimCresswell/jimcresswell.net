---
fitness_line_target: 165
fitness_line_limit: 190
fitness_char_limit: 11500
fitness_line_length: 100
split_strategy: Split by responsibility — extract testing rules to testing-strategy.md, type rules to a type-safety directive
---

# Rules

All of these rules MUST be followed at all times.

## First Question

Always apply the first question: **Ask: could it be simpler _without compromising quality_?** The
answer will often be no, and that is fine, but bring real critical thinking to the question each
time.

- **Trace work to value** — Every non-trivial piece of work must be traceable to a defined outcome,
  the impact that outcome is meant to create, and the mechanism by which that impact creates value.
  If you cannot state all three clearly, stop and reframe before planning or implementation.

## Code Design Principles

- **TDD** — ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run
  the test to _prove it fails_), Green (run the test to prove it passes, _because product code
  exists now_), Refactor (improve the product code implementation, now that the _behaviour_ at the
  interface will remain proven by the test).
- **Keep it simple** — DRY, KISS, YAGNI, SOLID principles.
- **Pure functions first** — No side effects, no I/O. Use TDD to design (test first, red, green,
  refactor).
- **Consistent naming** — Use consistent naming conventions for files, modules, functions, data
  structures, classes, constants, type information, and concepts. If you need to add nuance, use
  TSDoc to provide context, links, and examples.
- **Fail fast** — Fail fast with helpful error messages, never silently. Never ignore errors.
- **No backwards compatibility layers** — Replace old approaches with new approaches. Never create
  parallel versions.

## Type Safety

- **No type shortcuts** — Never use `as`, `any`, or `!` — they disable the type system.
- **Type imports must be labelled** — e.g. `import type { Type } from 'package'` or `import { type
Type } from 'package'`.
- **Prefer runtime constants as type sources** — When types and predicate guards derive naturally
  from a stable runtime list or object, define the runtime value with `as const` and derive the type
  from it.
- **Validate external data** — Parse and validate external signals (API responses, file reads,
  etc.). Use Zod where appropriate.
- **Single source of truth for types** — Define types once and import them consistently.

## Testing

For the full testing strategy, see [testing-strategy.md](./testing-strategy.md). Do not duplicate
its content here.

**Key principles:**

- **TDD at all levels** — Unit, integration, and E2E tests are all written FIRST.
- **Test behaviour, not implementation** — We should be able to change _how_ something works without
  breaking the test that proves _that_ it works.
- **No complex mocks** — Mocks should be simple fakes, injected as arguments. Complex mocks are a
  signal that product code needs simplifying.
- **No global state mutation in tests** — No `process.env` mutations, no `vi.stubGlobal`, no
  `vi.doMock`. Product code must accept configuration as parameters.
- **No skipped tests** — Fix it or delete it.
- **No useless tests** — Each test must prove something useful about the product code.
- **Do not test types** — Tests are for runtime logic. If a test only tests types, delete it.
- **Use the correct proof layer** — Tests prove behaviour. Type, lint,
  portability, and document-fitness concerns belong to their own validators.

## Tooling

Use the right tool for the job:

- **Vitest** for unit and integration tests
- **React Testing Library** for component integration tests
- **Playwright** for E2E tests (UI and API)
- **TypeScript** for compile-time type safety
- **ESLint** for syntax correctness and code-style adherence
- **Prettier** for code formatting

## CSS and Accessibility

- **Relative units for scalability** — Use rem/em for text sizing, spacing, focus rings, and border
  radii. px is only acceptable for design constraints (container max-width) and WCAG minimums (44px
  touch targets). Layouts must scale with text size at 200%+ zoom.
- **Work on branches for risky changes** — Use feature branches for experimental or risky changes to
  protect main from failed Vercel deployments and build-failure notifications.

## Code Quality

- **Never disable checks** — Never disable type checks, linting, formatting, tests, or Git hooks
  (`--no-verify`).
- **Never work around checks** — If a variable is unused, figure out why and fix it. Always fix the
  root cause.
- **Quality gates** — Run ALL gates after changes. `pnpm check` runs the full
  sequence with auto-fix; `pnpm check:ci` runs it read-only. The eight gates,
  in order:
  1. `pnpm format:fix` / `pnpm format:check` — Prettier
  2. `pnpm markdownlint:fix` / `pnpm markdownlint:check` — Markdown linting for authored docs
  3. `pnpm lint:fix` / `pnpm lint:check` — ESLint
  4. `pnpm typecheck` — TypeScript
  5. `pnpm test` — Vitest (unit and integration)
  6. `pnpm knip` — unused code and dependencies
     ([ADR-005](../../docs/architecture/decision-records/005-knip-unused-code-detection.md))
  7. `pnpm gitleaks` — secrets in git history
  8. `pnpm portability:check` — thin-wrapper and local surface-contract validation

  E2E tests are separate (slower, require Chromium):
  - `pnpm test:e2e` — Playwright suite against a production build (journeys,
    behaviour, a11y, PDF). The web server runs `pnpm build && pnpm start` on
    port 3000. PDF generation is part of the build, so PDF tests run
    alongside everything else.
  - `pnpm test:e2e:ui` — interactive Playwright UI mode for local diagnosis

  Run `pnpm check` and `pnpm test:e2e` sequentially, never in parallel. The
  `check` pipeline runs formatters and fixers, so overlapping it with the
  Playwright web server can create false app failures by mutating source files
  during the browser run.

  Git hooks enforce this: the pre-commit hook runs `pnpm check:ci`, and the
  pre-push hook runs `pnpm check && pnpm test:e2e`.

  When changing Practice Core, directives, or other docs that carry the
  four-field fitness frontmatter, run
  `pnpm practice:fitness:informational`. Use `pnpm practice:fitness` when you
  need strict enforcement.

- **Visual regression harness is blocking proof for rendering-risk changes** —
  If a change can affect rendered output through content-model changes, data or
  graph infrastructure, metadata wiring, page composition, or rendering
  plumbing, run `pnpm visual-regression-harness` during implementation on
  meaningful slices, not only at the end. Unexpected differences block the
  work until they are reviewed and either fixed or explicitly approved. This
  proof is separate from `pnpm check` and `pnpm test:e2e`; it complements
  them.

- **Restart on fix** — After any quality gate fix, restart the full sequence from `pnpm format:fix`.
  Fixes can introduce new issues downstream.
- **No unused code** — If a function is not used, delete it. If product code is only used in tests,
  delete it. Delete dead code.
- **No commented-out code** — Fix it or delete it.
- **Version with git, not with names** — Fix files in place. Never create parallel versions using
  naming (e.g. `foo.v2.ts`).

## Refactoring

- **TDD** — Always use TDD when refactoring. The tests prove behaviour is preserved.
- **Splitting long files** — Split into smaller files grouped by responsibility. Keep boundaries
  clear with index.ts files.
- **Splitting long functions** — Split into smaller, pure functions with a single responsibility.
- **Removing unused code** — If it is not used, delete it.

## Documentation

- **TSDoc everywhere** — All exported functions and non-trivial internal functions MUST have TSDoc
  comments. Public interfaces should include examples and usage patterns.
- **Good READMEs** — Each significant directory should have a README explaining what it contains and
  how to use it.
- **Inline comments for the "why"** — Comment the reasoning, not the mechanics. The code shows
  _what_; comments explain _why_.
- **Content lives in JSON** — Content changes go in `content/*.json`, never hardcoded in components.
- **Permanent docs never reference ephemeral docs** — Plans (`.agent/plans/`) are ephemeral;
  permanent documentation (`docs/`, `.agent/directives/`, ADRs, EDRs) must never reference or depend
  on them. Only the reverse direction is valid.
- **Tooling docs are contract surfaces** — When scripts, hooks, gate counts,
  or adapter surfaces change, update README, CONTRIBUTING, ADRs, and Practice
  docs in the same pass.
