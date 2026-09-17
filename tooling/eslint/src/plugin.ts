import type { TSESLint } from '@typescript-eslint/utils';

import { noAgentSubstrateAccessRule } from './rules/no-agent-substrate-access.js';
import { noConditionalTestsRule } from './rules/no-conditional-tests.js';
import { noDynamicImportRule } from './rules/no-dynamic-import.js';
import { noEslintDisableRule } from './rules/no-eslint-disable.js';
import { noExportTrivialTypeAliasesRule } from './rules/no-export-trivial-type-aliases.js';
import { noRealIoInTestsRule } from './rules/no-real-io-in-tests.js';
import { noThrowStatementRule } from './rules/no-throw-statement.js';

export const oakRuleModules = {
  'no-agent-substrate-access': noAgentSubstrateAccessRule,
  'no-conditional-tests': noConditionalTestsRule,
  'no-dynamic-import': noDynamicImportRule,
  'no-eslint-disable': noEslintDisableRule,
  'no-export-trivial-type-aliases': noExportTrivialTypeAliasesRule,
  'no-real-io-in-tests': noRealIoInTestsRule,
  'no-throw-statement': noThrowStatementRule,
} satisfies NonNullable<TSESLint.FlatConfig.Plugin['rules']>;

export const engraphPlugin = {
  rules: oakRuleModules,
} satisfies TSESLint.FlatConfig.Plugin;
