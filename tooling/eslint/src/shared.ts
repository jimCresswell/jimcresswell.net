import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x';
import type { TSESLint } from '@typescript-eslint/utils';

type ConfigSegment = TSESLint.FlatConfig.Config | TSESLint.FlatConfig.ConfigArray;

/**
 * Flattens shared config fragments while staying in the same config type
 * family as the bundled `@engraph` presets.
 */
export function defineConfigArray(
  ...segments: readonly ConfigSegment[]
): TSESLint.FlatConfig.ConfigArray {
  const flattened: TSESLint.FlatConfig.Config[] = [];

  for (const segment of segments) {
    if (Array.isArray(segment)) {
      flattened.push(...segment);
      continue;
    }

    flattened.push(segment);
  }

  return flattened;
}

type ImportResolverProject = string | string[];
type NodeResolverOptions = Parameters<typeof createNodeResolver>[0];

export interface ImportResolverSettingsOptions {
  readonly project?: ImportResolverProject;
  readonly node?: NodeResolverOptions;
}

/**
 * Shared import-resolution settings for flat-config ESLint consumers.
 *
 * The TypeScript resolver understands TS pathing and declaration surfaces.
 * The Node resolver is chained after it so lint follows real Node/package
 * export semantics when the TypeScript resolver produces false negatives.
 */
export function createImportResolverSettings(options: ImportResolverSettingsOptions = {}) {
  const { project, node } = options;
  const typeScriptResolver =
    project === undefined
      ? createTypeScriptImportResolver({
          alwaysTryTypes: true,
        })
      : createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project,
        });

  return {
    'import-x/resolver-next': [typeScriptResolver, createNodeResolver(node)],
  };
}

/**
 * Default resolver settings for workspaces that do not need explicit project
 * or Node-resolution overrides.
 */
export const commonSettings = createImportResolverSettings();

/**
 * Global ignore patterns for ESLint: scratch, build output, dependencies,
 * declaration files and test results.
 */
export const ignores = [
  'tmp/',
  'dist/',
  'node_modules/',
  '**/*.d.ts',
  // Ignore ephemeral bundled config artifacts (e.g., tsup.config.bundled_*.mjs)
  '**/*.bundled_*.mjs',
  // Test results
  '**/test-results/',
  '**/coverage/',
];
