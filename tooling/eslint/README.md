# @engraph/eslint-plugin-standards

Custom ESLint plugin for code standards
across the personal-sites monorepo.

## Purpose

This plugin provides:

1. **Custom ESLint rules** that enforce Engraph-specific code quality constraints
2. **Shared configs** that standardise linting across all workspaces

## Rules

### Custom Rules

| Rule                             | Description                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `no-export-trivial-type-aliases` | Disallows exporting trivial type aliases that only rename an imported type. Prefer re-exporting the original type directly. |

#### Removing a lib from `LIB_PACKAGES`

When removing an entry from `LIB_PACKAGES`, check ALL packages
`../${otherLib}/**` relative paths — removing a lib without
updating all consumers silently breaks their boundary rules.

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

"Autofixable" idiom rules are not automatically safe: Sonar idiom rules
(S7765 prefer-includes, S7755 prefer-at — implemented in this repo via the
matching `unicorn/*` rules, see `recommended.ts`) are **type-affecting, not
stylistic** — their autofixes can force type-unsound rewrites (one broke a
`value is X` type-guard of the constant-type-predicate pattern,
`.agent/directives/validation-strategy.md`). When activating a new rule:

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
  export as deprecated and names the core replacement (verified against
  eslint ≥10.5; re-verified on the installed 10.6.0).

## Usage

This plugin is consumed internally by workspaces in this monorepo via
`eslint.config.js` files. It is not published to npm.

```javascript
import oakStandards from '@engraph/eslint-plugin-standards';

export default [
  ...oakStandards.configs.recommended,
  // workspace-specific overrides
];
```

## Development

```bash
pnpm test        # Run rule tests
pnpm build       # Build the plugin
pnpm type-check  # Type-check
```
