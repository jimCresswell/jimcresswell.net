import type { Linter } from 'eslint';

/**
 * Common rules for test files.
 *
 * ALL of these exceptions are problems, and need removing at the earliest opportunity.
 *
 * Structural limits (max-lines, max-lines-per-function) are temporarily relaxed for
 * test files.
 *
 * Tests may import workspace-local devDependencies, but they still must
 * declare those packages in the workspace manifest rather than relying on
 * the repo root toolchain.
 *
 * The `no-restricted-syntax` and `no-restricted-properties` entries below
 * enforce the lint-checkable items of the test-immediate-fails checklist
 * (`.agent/rules/test-immediate-fails.md`) when ESLint runs: process.env and
 * process.cwd access, and vi.mock-family cache mutation, all at `error`.
 *
 * @see `.agent/rules/no-global-state-in-tests.md` for the dependency-injection
 *   rationale behind the vi.mock ban
 * @see principles.md "No type shortcuts" — applies to test code equally
 * @see `.agent/rules/test-immediate-fails.md` — the authoritative checklist
 */
export const testRules = {
  'max-lines': ['error', 700],
  'max-lines-per-function': ['error', 1000],
  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/consistent-type-definitions': 'off',
  '@typescript-eslint/no-restricted-types': 'off',
  '@typescript-eslint/unbound-method': 'off',
  'import-x/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: true,
      optionalDependencies: false,
      peerDependencies: false,
      includeTypes: false,
    },
  ],
  'import-x/no-named-as-default-member': 'off',
  // Hermetic-test enforcement: process.env / process.cwd access is
  // prohibited. Re-includes the ExportAllDeclaration selector from
  // `recommended` because per-file rule values replace rather than merge.
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ExportAllDeclaration',
      message:
        'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
    },
    {
      selector: "MemberExpression[object.name='process'][property.name='env']",
      message:
        'Tests must not read or write process.env. Pass literal inputs via dependency injection. See .agent/rules/test-immediate-fails.md.',
    },
    {
      selector: "CallExpression[callee.object.name='process'][callee.property.name='cwd']",
      message:
        'Tests must not consume process.cwd(). Anchor paths at import.meta.dirname. See .agent/rules/test-immediate-fails.md.',
    },
  ],
  // Module-cache / global-state manipulation: prohibited by
  // .agent/rules/no-global-state-in-tests.md, at `error` in the test files of
  // every workspace whose ESLint config applies these rules.
  'no-restricted-properties': [
    'error',
    {
      object: 'vi',
      property: 'mock',
      message:
        'vi.mock mutates the module cache, which tests must never do. Use dependency injection instead. See .agent/rules/test-immediate-fails.md.',
    },
    {
      object: 'vi',
      property: 'doMock',
      message:
        'vi.doMock mutates the module cache, which tests must never do. Use dependency injection instead. See .agent/rules/test-immediate-fails.md.',
    },
    {
      object: 'vi',
      property: 'stubGlobal',
      message:
        'vi.stubGlobal mutates global state. Use dependency injection or explicit parameter passing. See .agent/rules/test-immediate-fails.md.',
    },
  ],
} as const satisfies Linter.RulesRecord;
