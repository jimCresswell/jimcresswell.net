import { expect, type Page, type Response } from "@playwright/test";
import cvContent from "../../content/cv.content.json" with { type: "json" };

const NEXT_ERROR_ROOT = "html#__next_error__";
const NEXT_RUNTIME_ERROR_HEADING =
  /Application error: a client-side exception has occurred while loading localhost/;
const PUBLIC_SECTOR_ROUTE = "/cv/public_sector";
const PUBLIC_SECTOR_POSITIONING = cvContent.tilts.public_sector.positioning;

async function hasNextRuntimeOverlay(page: Page): Promise<boolean> {
  if ((await page.locator(NEXT_ERROR_ROOT).count()) > 0) {
    return true;
  }

  const runtimeErrorHeading = page.getByRole("heading", {
    name: NEXT_RUNTIME_ERROR_HEADING,
  });

  return runtimeErrorHeading.isVisible().catch(() => false);
}

/**
 * Navigate to the public-sector CV variant and prove that the visitor sees the
 * branded route content rather than a transient Next.js dev overlay.
 *
 * In local Playwright runs against `pnpm dev`, Next.js can occasionally render
 * a runtime chunk overlay on first navigation. When that specific overlay is
 * present, reload once and then assert the real variant content.
 *
 * @param page Playwright page for the current test.
 * @returns The initial navigation response so callers can assert the HTTP
 *   status separately when needed.
 */
export async function gotoAndExpectPublicSectorCv(page: Page): Promise<Response | null> {
  const response = await page.goto(PUBLIC_SECTOR_ROUTE);
  await page.waitForLoadState("domcontentloaded");

  const positioning = page.getByText(PUBLIC_SECTOR_POSITIONING);

  try {
    await expect(positioning).toBeVisible();
  } catch (error) {
    if (!(await hasNextRuntimeOverlay(page))) {
      throw error;
    }

    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(positioning).toBeVisible();
  }

  return response;
}
