import globals from 'globals';
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

const config = defineConfigArray(
  {
    ignores: [...globalIgnores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  configs.strict,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        projectService: false,
        project: wsTsProject,
        tsconfigRootDir: thisDir,
      },
    },
    settings: createImportResolverSettings({ project: wsTsProject }),
  },
  {
    // The collaboration-state runtime polls on a plain timer. A per-pass
    // fs.watch handle blocked the event loop on close under load, so no
    // watch primitive may come back in. A later block that sets this rule
    // replaces these options rather than merging with them.
    files: ['src/collaboration-state/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            ...['node:fs', 'fs'].map((name) => ({
              name,
              importNames: ['watch', 'watchFile', 'unwatchFile', 'promises', 'default'],
              message: 'The collaboration-state runtime polls on a plain timer; no fs watch.',
            })),
            ...['node:fs/promises', 'fs/promises'].map((name) => ({
              name,
              importNames: ['watch', 'default'],
              message: 'The collaboration-state runtime polls on a plain timer; no fs watch.',
            })),
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      ...testRules,
    },
  },
  {
    files: ['eslint.config.ts', 'vitest.config.ts'],
    languageOptions: {
      parserOptions: {
        project: wsTsProject,
        tsconfigRootDir: thisDir,
      },
    },
  },
);

export default config;
