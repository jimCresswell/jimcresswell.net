import type { Config } from 'prettier';

/**
 * Root formatting convention for the Practice tooling and docs
 * (`agent-tools`, `tooling/*`, `.agent/`, `docs/`, root files). The site
 * workspace keeps its own convention in `jcdotnet/prettier.config.ts`.
 */
const config: Config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  useTabs: false,
};

export default config;
