# ADR-005: Knip for unused code and dependency detection

## Status

Accepted

## Date

2026-02-06

## Context

The project's rules (`.agent/directives/rules.md`) are explicit:

> "No unused code — If a function is not used, delete it. If product
> code is only used in tests, delete it. Delete dead code."

ESLint catches unused local variables and imports within a file, but
it cannot detect:

- **Unused exports** — a function exported from `lib/utils.ts` but
  never imported anywhere else in the project.
- **Unused dependencies** — packages in `package.json` that no source
  file references.
- **Unused dev dependencies** — tools listed in `devDependencies`
  that no config file or script references.
- **Unused files** — entire modules that exist but are not reachable
  from any entry point.

These are the categories of dead code that accumulate silently in any
project. They add cognitive load, increase install times, and — in a
codebase intended to demonstrate engineering discipline — undermine
the signal.

### Options evaluated

1. **Manual review** — periodically grep for unused exports. Error-
   prone, not repeatable, not automatable.
2. **`ts-prune`** — detects unused exports in TypeScript projects.
   Unmaintained since 2023. Does not cover dependencies or files.
3. **Knip** — a comprehensive unused code detector for JavaScript
   and TypeScript projects. Detects unused files, exports,
   dependencies, dev dependencies, and more. Actively maintained.
   Zero-config for common toolchains (Next.js, Vitest, Playwright,
   ESLint, PostCSS, Tailwind, Husky, lint-staged are all recognised
   automatically).

## Decision

**Adopt Knip as a required quality gate.**

Knip is installed as a dev dependency (`knip@^5`) and runs as part
of the `pnpm check` script, which is the project's standard quality
gate:

```
pnpm check = format-check → lint → type-check → test → knip
```

This means Knip runs:

- On every `pnpm check` invocation (manual or CI).
- After all other checks pass, so failures are clearly attributable
  to unused code rather than syntax or type errors.

### Configuration

Knip runs with **zero configuration**. It auto-detects the project's
toolchain from `package.json`, `tsconfig.json`, `next.config.ts`,
`vitest.config.ts`, `playwright.config.ts`, and other config files.
There is no `knip.json` or `knip` field in `package.json`.

If a false positive arises (e.g. a dynamically imported module that
Knip cannot trace), the preferred resolution order is:

1. Fix the code so Knip can trace it (e.g. use a static import).
2. If that is not possible, add a targeted `knip.json` config to
   explicitly include the entry point or ignore the specific export.
3. Never suppress Knip wholesale or remove it from `pnpm check`.

### Why it is in the quality gate, not just advisory

Dead code is a defect, not a warning. An unused export signals one
of two things: the code should be deleted, or the code that should
use it is missing. Both are problems. Running Knip as advisory
(outside the gate) would mean violations accumulate silently — the
same failure mode as not running it at all.

Including it in the gate enforces the "no unused code" rule
mechanically rather than relying on discipline alone.

### Why it is unusual

Most projects do not gate on unused export detection. The common
objection is that false positives slow development. In practice,
Knip's toolchain auto-detection eliminates most false positives for
standard setups, and this project's small size means the remaining
surface for false positives is minimal. The cost is low; the signal
is high.

## Consequences

**Benefits:**

- Enforces the "no unused code" rule automatically.
- Catches dead dependencies before they accumulate.
- Catches orphaned files (e.g. a component that was replaced but
  not deleted).
- Zero-config — no maintenance burden beyond keeping the package
  up to date.
- Fast — adds roughly 1–2 seconds to `pnpm check`.

**Trade-offs:**

- Developers unfamiliar with Knip may be surprised by failures on
  `pnpm check` that ESLint would not catch. The error messages are
  clear, but the tool is less well-known than ESLint or Prettier.
- If a future dependency uses a pattern Knip cannot trace (e.g.
  runtime string-based `require()`), a targeted config override
  will be needed.
- Knip must be kept up to date as the toolchain evolves (e.g. new
  Next.js config formats). In practice, the maintainers track
  major framework releases closely.

## Related

- `.agent/directives/rules.md` — "No unused code" rule
- `package.json` — `scripts.check` and `scripts.knip`
- [Knip documentation](https://knip.dev/)
