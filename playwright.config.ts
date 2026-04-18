import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E tests.
 *
 * The default project runs against a production build served by `pnpm start`
 * on port 3000. The build is run by Playwright's web server (re-used between
 * runs locally; built fresh on CI) so every test exercises the same artefact
 * a visitor would see in production. This eliminates dev-only flakes — the
 * Turbopack `Runtime ChunkLoadError` overlay and the Next.js dev-tools issue
 * badge — at the source.
 *
 * The PDF is generated as part of `pnpm build` (postbuild script), so PDF
 * tests no longer need a separate project; they run alongside everything else.
 *
 * Scripts:
 * - `pnpm test:e2e` — run the full E2E suite against the production build
 * - `pnpm test:e2e:ui` — open Playwright UI mode
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
    },
  ],

  webServer: {
    command: "pnpm build && pnpm start --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
