import type { Config } from "prettier";

/** Site formatting convention (double quotes, ES5 trailing commas). */
const config: Config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
};

export default config;
