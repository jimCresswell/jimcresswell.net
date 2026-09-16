import { createLibConfig } from '@engraph/workspace-config/tsup';

export default createLibConfig({
  external: [
    'fs',
    'path',
    'node:fs',
    'node:path',
    'eslint',
    'typescript',
    '@eslint/js',
    '@next/eslint-plugin-next',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    '@typescript-eslint/utils',
    'eslint-config-prettier',
    'eslint-plugin-import-x',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-sonarjs',
    'eslint-plugin-tsdoc',
    'typescript-eslint',
    'minimatch',
    'zod',
  ],
});
