# @engraph/eslint-plugin-standards

Custom ESLint plugin for code standards
across the personal-sites monorepo.

## Purpose

This plugin provides:

1. **Custom ESLint rules** that enforce Engraph-specific code quality constraints
2. **Shared configs** that standardise linting across the workspaces that consume the plugin

## Rules

### Custom Rules

The plugin registers these rules under the `@engraph/` prefix.
`src/configs/recommended.ts` sets the severity of each rule the shared configs
enable; a rule it does not name is registered but enabled by no shared config.

| Rule                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-agent-substrate-access`      | In any file outside `agent-tools/`, reports `new URL(...)` and read calls bound to a `fs`, `node:fs`, `fs/promises` or `node:fs/promises` import (such as `readFileSync`, `readdir`, `stat`, `existsSync` or `open`) when a string or template literal argument contains a `.agent/` path segment.                                                                                                                                                                                                                                  |
| `no-conditional-tests`           | Reports `skipIf` and `runIf` on Vitest's `it`, `test`, `describe` and `suite`, whether reached as a global, an aliased or namespace import, or a chained form, so every suite registers the same tests on every machine.                                                                                                                                                                                                                                                                                                            |
| `no-dynamic-import`              | Reports every dynamic `import(...)` expression, so module boundaries stay static, reviewable and lintable.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `no-eslint-disable`              | Reports a comment carrying an `eslint-disable` directive without the project-owner approval marker (`APPROVAL_MARKER_PATTERN` in `src/rules/no-eslint-disable.ts`), and every `@ts-ignore` or `@ts-nocheck` comment; a comment carrying `@ts-expect-error` is left to `@typescript-eslint/ban-ts-comment`.                                                                                                                                                                                                                          |
| `no-export-trivial-type-aliases` | Reports `export type A = B` where `A` has no type parameters and `B` is a non-generic reference rooted in an imported binding whose name starts with a capital letter; import the canonical type where it is needed instead.                                                                                                                                                                                                                                                                                                        |
| `no-real-io-in-tests`            | In `*.test.*` and `*.spec.*` files outside `test-helpers/`, `test-fakes/`, the Vitest config and setup files and the configured `allowlistPathShapes`, reports value imports (static, dynamic or `require`) of `fs`, `fs/promises`, `child_process`, `worker_threads`, `http`, `https`, `net` and `dgram` (with or without `node:`); `process.env` access; `process.cwd()` and `process.chdir()` calls; and a bare `fetch(...)` whose first argument is not a string literal URL on `http(s)://localhost` or `http(s)://127.0.0.1`. |
| `no-throw-statement`             | Reports every `throw` statement, so errors flow through the Result pattern and stay in the type signature.                                                                                                                                                                                                                                                                                                                                                                                                                          |

## Configs

| Config        | Description                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `recommended` | Base: ESLint recommended, TypeScript strict + stylistic, import-x, Prettier, TSDoc, Engraph-specific rules |
| `strict`      | Extends `recommended`: restricts `Object.keys`/`values`/`entries`, `Reflect.*`, stronger type rules        |
| `react`       | React + React Hooks rules                                                                                  |
| `next`        | Extends `react` with Next.js recommended and core-web-vitals                                               |

### Restricted Type Patterns

The `strict` config restricts 10 type-destroying patterns via
`@typescript-eslint/no-restricted-types`:

`Record<string, unknown>`, `Record<string, any>`,
`Record<string, undefined>`, `Readonly<Record<string, undefined>>`,
`Record<PropertyKey, undefined>`, `object`, `Object`, `Function`,
`unknown[]`, `{}`

The `satisfies Record<...>` pattern is acceptable because `satisfies`
validates without widening — the inferred type stays narrow.

**Flat config caveat**: ESLint flat config uses last-writer-wins for rule
declarations. When `strict.ts` overrides a rule from `recommended.ts`, all
entries from the recommended declaration are silently lost. The `strict`
config must replicate all restricted type entries from `recommended`.

### Activating new rules

"Autofixable" idiom rules are not automatically safe: Sonar idiom rules are
**type-affecting, not stylistic** — their autofixes can force type-unsound
rewrites. S7765 (prefer-includes) is the worked case: its autofix turns the
`value is X` type-guard of the constant-type-predicate pattern
(`.agent/directives/validation-strategy.md`) into a type-unsound
`.includes(value)`, so `unicorn/prefer-includes` is deliberately not enabled,
while S7755 (prefer-at) is enabled as `unicorn/prefer-at` (see
`recommended.ts`). When activating a new rule:

- Land it at `error` with full conformance in ONE landing (PDR-126,
  graduating the 2026-07-07 owner ruling — this supersedes the earlier
  warn-first preference): the same landing clears every violation with
  **type-sound** fixes (review each autofix's type effect, never bulk-apply)
  or category-moves the genuine non-fits.
- If the violation surface cannot be cleared soundly in one landing, the
  conformance work is sequenced FIRST and the rule lands at `error` as that
  sequence's final slice — never at `warn` over a violation inventory.
  Downgrading an existing `error` rule to `warn` remains forbidden
  (`never-disable-checks`).

### Flat-config gotchas

- **`typescript-eslint`'s `projectService` is a per-run singleton — use ONE
  options object for the whole config.** Two flat-config blocks with different
  `projectService` values (`true` for ts/tsx; `{allowDefaultProject: ['*.mjs']}`
  for mjs) fail non-obviously: the service is created from the FIRST options
  seen, so a full `eslint .` run drops the mjs allowance ("not found by the
  project service") while linting the mjs file alone passes. Cure: one files
  block `['**/*.ts', '**/*.tsx', '**/*.mjs']` with a single `projectService`
  object (verified 2026-07-02 in the Practice lineage, before the transplant).
- **`includeIgnoreFile` ships in ESLint core (`eslint/config`)** — do not add
  `@eslint/compat` for it; `@typescript-eslint/no-deprecated` flags the compat
  export as deprecated and names the core replacement.

## Usage

This plugin is private to this monorepo and is not published to npm. A
consuming workspace declares `"@engraph/eslint-plugin-standards": "workspace:*"`
in its `devDependencies` and imports the named exports in its
`eslint.config.ts`:

```typescript
import {
  configs,
  createImportResolverSettings,
  defineConfigArray,
  ignores as globalIgnores,
  testRules,
} from '@engraph/eslint-plugin-standards';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

export default defineConfigArray(
  { ignores: [...globalIgnores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'] },
  configs.strict,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { projectService: false, project: wsTsProject, tsconfigRootDir: thisDir },
    },
    settings: createImportResolverSettings({ project: wsTsProject }),
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: testRules,
  },
  // workspace-specific overrides
);
```

`testRules` carries the hermetic-test protections (no `process.env` or
`process.cwd()`, no `vi.mock`, `vi.doMock` or `vi.stubGlobal`), so its `files`
block covers every test-file shape the workspace has: `*.test.*`, `*.spec.*`
and `__tests__/`. [`agent-tools/eslint.config.ts`](../../agent-tools/eslint.config.ts)
and [`tooling/result/eslint.config.ts`](../result/eslint.config.ts) are complete
consumer configurations.

## Development

```bash
pnpm test        # Run rule tests
pnpm build       # Build the plugin
pnpm type-check  # Type-check
```
