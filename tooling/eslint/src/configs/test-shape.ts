import vitestPlugin from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';

/**
 * The vitest test-shape immune surface (PDR-044 § Memetic Immune System,
 * principles.md § Testing "no skipped tests"): `it.skip`, `describe.skip`,
 * `it.todo`, `describe.todo`, `it.only`, `describe.only` and the adjacent
 * skipping and focusing forms are errors. `strict` composes it, and this
 * package's own lint config, which cannot lint through its own build,
 * imports it from source.
 */
export const testShape = defineConfig({
  plugins: {
    vitest: vitestPlugin,
  },
  rules: {
    'vitest/no-disabled-tests': 'error',
    'vitest/warn-todo': 'error',
    'vitest/no-focused-tests': 'error',
  },
});
