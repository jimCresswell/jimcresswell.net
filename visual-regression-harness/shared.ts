import fs from "node:fs/promises";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";

/** Root directory for all generated regression artifacts. */
export const REGRESSION_ARTIFACTS_DIR = "regression-artifacts";

/** Artifact bucket for the reusable visual regression harness. */
export const VISUAL_REGRESSION_HARNESS_DIR = "visual-regression-harness";

/** Fixed viewport to keep captures stable across runs. */
export const HARNESS_VIEWPORT = {
  width: 1440,
  height: 1200,
} as const;

/** One named DOM region captured alongside the full page. */
interface RouteSelector {
  key: string;
  selector: string;
}

/** One route covered by the harness. */
export interface RegressionRoute {
  key: string;
  path: string;
  selectors: readonly RouteSelector[];
}

/** Core proof surface for the PKG refactor. */
export const regressionRoutes: readonly RegressionRoute[] = [
  {
    key: "home",
    path: "/",
    selectors: [
      { key: "site-header", selector: "body header.print-hidden" },
      { key: "hero", selector: 'main section:has(> h1:has-text("Jim Cresswell"))' },
      { key: "site-footer", selector: "body footer" },
    ],
  },
  {
    key: "cv",
    path: "/cv",
    selectors: [
      { key: "site-header", selector: "body header.print-hidden" },
      { key: "cv-header", selector: "main > div > header" },
      { key: "positioning", selector: 'main section:has(> h2:has-text("Positioning"))' },
      { key: "capabilities", selector: 'main section:has(> h2:has-text("Capabilities"))' },
      { key: "experience", selector: 'main section:has(> h2:has-text("Experience"))' },
      { key: "before-oak", selector: 'main section:has(> h2:has-text("Before Oak"))' },
      { key: "education", selector: 'main section:has(> h2:has-text("Education"))' },
      { key: "site-footer", selector: "body footer" },
    ],
  },
  {
    key: "cv-public-sector",
    path: "/cv/public_sector",
    selectors: [
      { key: "site-header", selector: "body header.print-hidden" },
      { key: "cv-header", selector: "main > div > header" },
      { key: "positioning", selector: 'main section:has(> h2:has-text("Positioning"))' },
      { key: "capabilities", selector: 'main section:has(> h2:has-text("Capabilities"))' },
      { key: "experience", selector: 'main section:has(> h2:has-text("Experience"))' },
      { key: "before-oak", selector: 'main section:has(> h2:has-text("Before Oak"))' },
      { key: "education", selector: 'main section:has(> h2:has-text("Education"))' },
      { key: "site-footer", selector: "body footer" },
    ],
  },
] as const;

/**
 * Ensure a directory exists.
 *
 * @param directoryPath Directory path to create.
 */
export async function ensureDirectory(directoryPath: string): Promise<void> {
  await fs.mkdir(directoryPath, { recursive: true });
}

/**
 * Wait until a page is fully ready for stable capture.
 *
 * @param page Browser page being captured.
 * @param url URL to visit.
 */
async function waitForStablePage(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("body").waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

/**
 * List the artifacts expected for a route capture.
 *
 * @param route Route definition.
 */
export function getRouteArtifactPaths(route: RegressionRoute): string[] {
  const artifactPaths = ["document.html", "main.html", "metadata.json", "full-page.png"];

  for (const selector of route.selectors) {
    artifactPaths.push(`${selector.key}.html`);
    artifactPaths.push(`${selector.key}.png`);
  }

  return artifactPaths;
}

/**
 * Capture the full page plus key DOM regions for one route.
 *
 * @param page Playwright page instance.
 * @param baseUrl Base URL of the running server.
 * @param outputDirectory Root output directory for this capture set.
 * @param route Route to capture.
 */
export async function captureRouteArtifacts(
  page: Page,
  baseUrl: string,
  outputDirectory: string,
  route: RegressionRoute
): Promise<void> {
  const routeDirectory = path.join(outputDirectory, route.key);
  await ensureDirectory(routeDirectory);

  const targetUrl = new URL(route.path, baseUrl).toString();
  await waitForStablePage(page, targetUrl);

  await writeTextArtifact(path.join(routeDirectory, "document.html"), await page.content());

  const main = page.locator("main");
  await main.waitFor();
  await writeTextArtifact(path.join(routeDirectory, "main.html"), await captureHtml(main));

  const metadata = await page.evaluate(() => {
    const description =
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null;
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;

    return {
      title: document.title,
      description,
      canonical,
    };
  });
  await writeTextArtifact(
    path.join(routeDirectory, "metadata.json"),
    `${JSON.stringify({ path: route.path, ...metadata }, null, 2)}\n`
  );

  await page.screenshot({
    path: path.join(routeDirectory, "full-page.png"),
    fullPage: true,
  });

  for (const selector of route.selectors) {
    const locator = page.locator(selector.selector);
    await locator.waitFor();
    await writeTextArtifact(
      path.join(routeDirectory, `${selector.key}.html`),
      await captureHtml(locator)
    );
    await locator.screenshot({
      path: path.join(routeDirectory, `${selector.key}.png`),
    });
  }
}

/**
 * Make a filesystem-safe label from a git ref-like string.
 *
 * @param value Git ref-like string.
 */
export function sanitiseLabel(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

async function captureHtml(locator: Locator): Promise<string> {
  return locator.evaluate((element) => element.outerHTML);
}

async function writeTextArtifact(filePath: string, contents: string): Promise<void> {
  await ensureDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, contents, "utf8");
}
