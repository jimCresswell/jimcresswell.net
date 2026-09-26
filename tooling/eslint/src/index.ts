import { engraphPlugin } from './plugin.js';

export type { NoRealIoInTestsOptions } from './rules/no-real-io-in-tests.js';
export { oakRuleModules as rules } from './plugin.js';

import { recommended } from './configs/recommended.js';
import { strict } from './configs/strict.js';
import { react } from './configs/react.js';
import { next } from './configs/next.js';

export {
  defineConfigArray,
  createImportResolverSettings,
  commonSettings,
  ignores,
} from './shared.js';
export { testRules } from './test-rules.js';
export type { ImportResolverSettingsOptions } from './shared.js';

export const configs = {
  recommended,
  strict,
  react,
  next,
};

/**
 * ESLint plugin for Engraph standards.
 *
 * Exported as a plain object so the shared rule inventory and bundled
 * config arrays preserve their native inferred shapes.
 */
const plugin = {
  ...engraphPlugin,
  configs: configs,
};

export default plugin;
