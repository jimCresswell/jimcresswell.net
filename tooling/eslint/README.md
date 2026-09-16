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

| Rule                             | Description                                                                                                                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-agent-substrate-access`      | Forbids application code from reading the `.agent/` knowledge substrate; only `agent-tools/` operates on it.                                                                                              |
| `no-conditional-tests`           | Bans Vitest's `skipIf` and `runIf` so every suite registers the same tests on every machine.                                                                                                              |
| `no-dynamic-import`              | Bans dynamic `import(...)` so module boundaries stay static, reviewable and lintable.                                                                                                                     |
| `no-eslint-disable`              | Bans `eslint-disable` comments without the project-owner approval marker, and `@ts-ignore` and `@ts-nocheck` outright; `@ts-expect-error` is left to `@typescript-eslint/ban-ts-comment`.                 |
| `no-export-trivial-type-aliases` | Disallows exporting trivial type aliases that only rename an imported type. Prefer re-exporting the original type directly.                                                                               |
| `no-real-io-in-tests`            | Bans real IO (filesystem, child processes, worker threads, network, `process`, non-localhost `fetch`) in test files outside the structural path-shape allowlist and the configured `allowlistPathShapes`. |
| `no-throw-statement`             | Bans `throw` statements so errors flow through the Result pattern and stay in the type signature.                                                                                                         |

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
  { ignores: [...globalIgnores, 'dist/**', 'coverage/**'] },
  configs.strict,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { projectService: false, project: wsTsProject, tsconfigRootDir: thisDir },
    },
    settings: createImportResolverSettings({ project: wsTsProject }),
  },
  { files: ['**/*.test.ts'], rules: testRules },
  // workspace-specific overrides
);
```

[`tooling/result/eslint.config.ts`](../result/eslint.config.ts) is a complete
consumer configuration.

## Development

```bash
pnpm test        # Run rule tests
pnpm build       # Build the plugin
pnpm type-check  # Type-check
```
