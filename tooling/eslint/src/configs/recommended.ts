import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import type { TSESLint } from '@typescript-eslint/utils';
import { importX } from 'eslint-plugin-import-x';
import sonarjs from 'eslint-plugin-sonarjs';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unicorn from 'eslint-plugin-unicorn';

import { engraphPlugin } from '../plugin.js';

/**
 * Restricted types shared between recommended and strict configs.
 *
 * Strict config spreads this and adds FORBIDDEN-prefixed overrides
 * plus strict-only additions. Adding a type here automatically
 * includes it in strict — no duplication needed.
 */
export const RECOMMENDED_RESTRICTED_TYPES = {
  'Record<string, unknown>': {
    message:
      'Avoid Record<string, unknown>. Use an existing internal or library type where possible.',
  },
  'Record<string, undefined>': {
    message:
      'Avoid Record<string, undefined>. Use an existing internal or library type where possible. If keys are optional, prefer Partial.',
  },
  'Readonly<Record<string, undefined>>': {
    message:
      'Avoid Readonly<Record<string, undefined>>. Use an existing internal or library type where possible.',
  },
  'Record<PropertyKey, undefined>': {
    message:
      'Avoid Record<PropertyKey, undefined>. Use an existing internal or library type where possible.',
  },
} as const;

const recommendedBase: TSESLint.FlatConfig.ConfigArray = defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  // `sonarjs.configs.recommended` is not activated: only the rules below are,
  // each annotated with the Sonar rule it corresponds to. Sonar S7778 maps to
  // unicorn/prefer-single-call; enable that one rule without adopting the
  // full Unicorn preset.
  {
    plugins: { sonarjs, unicorn },
    rules: {
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-alphabetical-sort': 'error',
      'sonarjs/no-nested-functions': ['error', { threshold: 4 }],
      'sonarjs/void-use': 'error',
      'unicorn/prefer-single-call': 'error',

      // Matching unicorn rules for the SonarJS idiom classes, enabled at `error`
      // with every existing violation cleared in the same landing, so no
      // warn-debt is introduced (PDR-126; principles.md §Code Quality, "No
      // warning toleration, anywhere"). Each maps to a Sonar rule.
      // Two related classes are deliberately not enabled: S6594
      // (prefer-regexp-exec is a @typescript-eslint rule overlapping generated
      // output, not a clean
      // autofix) and S7765 (prefer-includes force-converts the `value is X`
      // type-guard `.some((id) => id === value)` idiom of the
      // constant-type-predicate pattern, in
      // .agent/directives/validation-strategy.md, to a type-unsound
      // `.includes(value)` where the argument is wider than the element type —
      // incompatible with the house type-guard pattern).
      'unicorn/prefer-string-replace-all': 'error', // S7781
      'unicorn/prefer-string-raw': 'error', // S7780
      'unicorn/prefer-number-properties': 'error', // S7773
      'unicorn/prefer-at': 'error', // S7755
      'prefer-object-has-own': 'error', // S6653 (ESLint core rule, not unicorn)
      'unicorn/prefer-node-protocol': 'error', // S7772
      'unicorn/prefer-global-this': 'error', // S7764

      'unicorn/no-abusive-eslint-disable': 'error',
    },
  },
  prettierConfig,
  {
    plugins: {
      tsdoc: tsdocPlugin,
    },
    rules: {
      // Types
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      curly: 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: RECOMMENDED_RESTRICTED_TYPES,
        },
      ],

      // Type imports and exports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],

      // General good practices
      'no-console': 'error',
      'preserve-caught-error': ['error', { requireCatchParameter: true }],
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-constant-condition': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/consistent-return': 'error',

      // Import rules
      'import-x/no-namespace': 'error',
      'import-x/no-cycle': ['error'],
      'import-x/no-useless-path-segments': ['error'],
      'import-x/no-named-as-default': 'error',

      // TSDoc
      'tsdoc/syntax': 'error',

      // Prevent export *
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
      ],
    },
  },
);

/**
 * Shared plugin registration for the `@engraph` namespace.
 *
 * This wires the same plugin definition that `src/index.ts` exports so the
 * packaged rule inventory and the rules available through
 * `configs.recommended` cannot drift apart.
 */
const oakRecommendedConfig: TSESLint.FlatConfig.Config = {
  plugins: {
    '@engraph': engraphPlugin,
  },
  rules: {
    '@engraph/no-eslint-disable': 'error',
    '@engraph/no-conditional-tests': 'error',
    '@engraph/no-dynamic-import': 'error',
    // Architectural boundary: application code must not READ the `.agent/`
    // knowledge substrate at runtime (fs reads / `new URL` into `.agent/`).
    // agent-tools/ (the substrate operator) is exempt inside the rule. The
    // companion IMPORT boundary is enforced by the depcruise
    // `no-import-from-agent-substrate` forbidden rule. Its transition-debt
    // `warn` tier (PDR-126) retired at `error` once every lint gate, run with
    // `--max-warnings 0`, measured its surface empty (2026-09-25).
    // Doctrine: owner 2026-06-22, .agent/directives/testing-strategy.md.
    '@engraph/no-agent-substrate-access': 'error',
    // Bans `throw` in favour of the Result pattern. Switched off in this
    // repository by owner ruling (2026-09-12), recorded in
    // .agent/rules/use-result-pattern.md; until the owner re-enables it,
    // reviewers carry that rule.
    '@engraph/no-throw-statement': 'off',
    // The `warn` level and the `allowlistPathShapes` entries below are
    // transition debt under PDR-126 (gates land strict, in one landing): each
    // entry's recorded reason names the move that retires it, and a retired
    // entry leaves the list. The structural defaults (`**/test-helpers/**`,
    // `**/test-fakes/**`, `**/vitest.config.ts`, `**/vitest.*.config.ts`,
    // `**/vitest.setup.ts`) are hardcoded inside the rule and are not
    // removable through this option.
    //
    // Per `.agent/rules/never-disable-checks.md`, per-file `eslint-disable`
    // comments to bypass this rule are FORBIDDEN.
    '@engraph/no-real-io-in-tests': [
      'warn',
      {
        allowlistPathShapes: [
          // Recorded reason: transplanted 2026-09-12 with the Practice lineage.
          // These integration tests prove real filesystem behaviour on mkdtemp
          // temp trees (path resolution, Codex agent and reviewer resolution,
          // state integrity, watcher staleness, the runtime agent index); a
          // fake fs would make the proofs theatre. The rule has no class for
          // an mkdtemp integration test, so each is a per-file entry that
          // retires when the rule gains that class.
          '**/agent-tools/src/core/flag-path-resolve.integration.test.ts',
          '**/agent-tools/tests/codex-project-agents.integration.test.ts',
          '**/agent-tools/tests/codex-reviewer-resolve.integration.test.ts',
          '**/agent-tools/tests/collaboration-state/state-integrity.integration.test.ts',
          '**/agent-tools/tests/collaboration-state/watcher-staleness-io.integration.test.ts',
          '**/agent-tools/tests/runtime-agent-index.integration.test.ts',
          // Recorded reason: transplanted 2026-09-12 with the Practice lineage.
          // A consolidation guard: it reads the real `collaboration-state/`
          // source tree and fails if the deleted silent root-finder
          // reappears, so a fake fs would leave it nothing to scan. Retires
          // when the guard moves to a repo validator, PDR-126's home for
          // filesystem checks.
          '**/agent-tools/src/collaboration-state/coordination-home-consolidation.integration.test.ts',
          // Recorded reason: transplanted 2026-09-12 with the Practice lineage.
          // The suite does no IO (its fs is an in-memory `DebugLogFs` fake);
          // its one finding is the `node:fs` import of `constants` for the
          // expected open flags, an import that runs no IO. Retires when the
          // rule stops reporting such imports, as it already skips type-only
          // ones.
          '**/agent-tools/tests/claude/statusline-debug-log.integration.test.ts',
          // Recorded reason: `testing-strategy.md` §"No reading the `.agent/`
          // knowledge substrate in tests" mandates an mkdtemp fixture repo for
          // product code that resolves `.agent/` paths, and this rule permits
          // real IO structurally only under test-helpers/, test-fakes/ and the
          // vitest configs, with no class for that mandated shape, so every such
          // test is a per-file entry. This one proves the health probe's
          // platform truth at its file-system boundary (an absent or empty
          // templates directory, a symlinked template, an undeclared one).
          // Retires when `readDeclaredAdapters` reads through the seam-backed
          // `SurfaceFs` (the probe is synchronous today, that seam async); the
          // lane's follow-on list names that move and the rule's integration
          // class.
          '**/agent-tools/src/subagent-declarations/declared-adapters.integration.test.ts',
        ],
      },
    ],
  },
};

export const recommended: TSESLint.FlatConfig.ConfigArray = [
  ...recommendedBase,
  oakRecommendedConfig,
];
