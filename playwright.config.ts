import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E tests.
 *
 * Two projects:
 * - `default` — runs against `pnpm dev` for journey, behaviour, and accessibility tests.
 * - `with-build` — runs against a pre-built production server on port 3001 for PDF tests.
 *   Requires `pnpm build && pnpm start -p 3001` to be running separately.
 *
 * Tests with `.with-build.` in the filename run only in the `with-build` project.
 * All other tests run in the `default` project.
 *
 * Scripts:
 * - `pnpm test:e2e` — runs the default project (most tests)
 * - `pnpm test:e2e:pdf` — runs the with-build project (PDF tests)
 * - `pnpm test:e2e:ui` — opens Playwright UI mode
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "list" : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "default",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /\.with-build\./,
    },
    {
      name: "with-build",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
      },
      testMatch: /\.with-build\./,
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
