# @engraph/workspace-config

Shared workspace tooling configuration, consumed only through declared
`package.json` dependencies. This package exists so that no workspace
config file ever reaches outside its workspace by relative path — the
violation class it replaced was invisible to lint three layers deep and
broke tool sandboxes that resolve inside a single workspace. A fully
copyable workspace subtree additionally needs the tsconfig `extends` chain
packaged the same way, which this package does not yet cover.

## Exports

| Subpath                                      | Export             | Purpose                                                                      |
| -------------------------------------------- | ------------------ | ---------------------------------------------------------------------------- |
| `@engraph/workspace-config/vitest`           | `baseTestConfig`   | Unit/integration vitest base                                                 |
| `@engraph/workspace-config/vitest-e2e`       | `baseE2EConfig`    | E2E vitest base (network-blocked)                                            |
| `@engraph/workspace-config/tsup`             | `createLibConfig`  | tsup factory for workspace libraries                                         |
| `@engraph/workspace-config/no-network-setup` | side-effect module | The fetch-blocking E2E setup; keep it FIRST in any `mergeConfig` composition |

Consume with a `workspace:*` devDependency and import by package name:

```typescript
import { baseTestConfig } from '@engraph/workspace-config/vitest';

export default baseTestConfig;
```

## Two properties consumers inherit

- **Consumed from `dist/`**: turbo-driven runs (`build`, `lint`, `test`,
  `type-check`) build this package first via `dependsOn: ["^build"]`.
  Direct in-workspace tool invocation (`pnpm --filter X test` without a
  prior build, IDE test integrations on a cold clone) needs one prior
  `pnpm --filter @engraph/workspace-config build` — the same
  property `@engraph/eslint-plugin-standards` has.
- **Zero internal workspace dependencies**: the standards package's own
  configs consume this package, so a dependency back onto any internal
  package risks a workspace cycle that hard-fails turbo. Its lint config
  is hand-rolled for that reason (see `eslint.config.ts`); its own
  `tsup.config.ts` imports from `./src/` directly.

## Assurance

This package carries no unit tests by design: tests prove behaviour,
and everything here is configuration. Its assurance is consuming
proof — the estate's builds, lints, and test suites run green THROUGH
these exports on every gate, and the boundary validator's inline-fixture
red-proof covers the isolation invariant.
