import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // Custom config (testing-strategy §Canonical Vitest Configuration, Pattern 2): only the
    // in-process conventions run here, and every E2E suffix is excluded wherever it sits, so an
    // E2E test outside `e2e/` never runs under Vitest. Playwright owns `e2e/`.
    include: ["**/*.unit.test.ts", "**/*.integration.test.{ts,tsx}"],
    exclude: [
      "node_modules/**",
      "e2e/**",
      "**/*.e2e.test.ts",
      "**/*.e2e-api.test.ts",
      "**/*.e2e-ui.test.ts",
    ],
    setupFiles: ["./vitest-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", ".next/", "**/*.config.*"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
