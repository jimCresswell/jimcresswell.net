/**
 * Composable tsup base configuration.
 *
 * @remarks
 * {@link createLibConfig} carries the shared build defaults, so each
 * workspace library's tsup config is a short import: the tooling libraries,
 * the ESLint standards plugin and this package itself build through it.
 *
 * @packageDocumentation
 */

import { defineConfig, type Options } from 'tsup';

/**
 * Re-exported so TypeScript's declaration emitter can name the type in
 * consumers via this package: a consumer's `export default
 * createLibConfig(...)` expands to a type over `Options`, and without an
 * accessible export path the emitter reaches for a relative path into
 * this package's own `node_modules/tsup` — the non-portable-declaration
 * error TS2883.
 */
export type { Options } from 'tsup';

/**
 * The configuration shape {@link createLibConfig} returns.
 *
 * @remarks Exported so a consumer's `export default createLibConfig(...)`
 * infers a type nameable through THIS package (the module the consumer
 * already imports). Without it, TypeScript names the inferred type via a
 * relative path into this package's own `node_modules/tsup` — the
 * non-portable-declaration error TS2883 in every consumer whose
 * type-check validates declaration emit.
 */
export type WorkspaceTsupConfig = ReturnType<typeof defineConfig>;

/** Shared defaults applied to every workspace build. */
const SHARED_DEFAULTS = {
  format: ['esm'],
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  splitting: false,
  dts: false,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
} as const satisfies Partial<Options>;

/** Override options for {@link createLibConfig}. */
interface LibConfigOverrides {
  /** Dependencies to exclude from the bundle. */
  readonly external?: string[];
  /** Custom entry points (default: `['src/index.ts']`). */
  readonly entry?: Record<string, string> | string[];
  /** Emit `.d.ts` declaration files (default: `false`). */
  readonly dts?: boolean;
  /** Compilation target (default: `'es2022'`). */
  readonly target?: string;
}

/**
 * Create a tsup config for a library package.
 *
 * @remarks Libraries are bundled (`bundle: true`); pass `external` for
 * dependencies that must stay imports.
 *
 * @example
 * ```typescript
 * // Simple lib — no overrides
 * export default createLibConfig();
 *
 * // Lib with externals
 * export default createLibConfig({ external: ['eslint', 'typescript'] });
 *
 * // Multi-entry lib
 * export default createLibConfig({
 *   entry: ['src/vitest.config.base.ts', 'src/tsup.config.base.ts'],
 *   external: ['tsup', 'vitest'],
 * });
 * ```
 */
export function createLibConfig(overrides?: LibConfigOverrides): WorkspaceTsupConfig {
  return defineConfig({
    ...SHARED_DEFAULTS,
    entry: overrides?.entry ?? ['src/index.ts'],
    target: overrides?.target ?? 'es2022',
    bundle: true,
    ...(overrides?.dts !== undefined && { dts: overrides.dts }),
    ...(overrides?.external && { external: overrides.external }),
  });
}
