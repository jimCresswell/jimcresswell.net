import { chromium } from "@playwright/test";
import type { RegressionRoute } from "./configuration";
import { captureRouteArtifacts, ensureDirectory, HARNESS_VIEWPORT } from "./shared";

/**
 * Capture full-page screenshots, section screenshots, and HTML artifacts for
 * the configured regression routes.
 *
 * @param options Capture configuration.
 */
export async function captureSiteArtifacts(options: {
  baseUrl: string;
  outputDirectory: string;
  routes: readonly RegressionRoute[];
}): Promise<void> {
  await ensureDirectory(options.outputDirectory);

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: HARNESS_VIEWPORT,
      colorScheme: "light",
      locale: "en-GB",
      reducedMotion: "reduce",
    });

    const page = await context.newPage();

    for (const route of options.routes) {
      await captureRouteArtifacts(page, options.baseUrl, options.outputDirectory, route);
    }

    await context.close();
  } finally {
    await browser.close();
  }
}
