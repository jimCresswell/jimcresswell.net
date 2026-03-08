import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-restricted-properties": [
        "error",
        {
          object: "vi",
          property: "doMock",
          message: "Use injected fakes or a static vi.mock call instead of vi.doMock.",
        },
        {
          object: "vi",
          property: "stubGlobal",
          message: "Inject dependencies instead of mutating globals with vi.stubGlobal.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-specific ignores:
    "logo/**",
    ".agent/temp/**",
    // Playwright output directories:
    "test-results/**",
    "playwright-report/**",
    "blob-report/**",
  ]),
]);

export default eslintConfig;
