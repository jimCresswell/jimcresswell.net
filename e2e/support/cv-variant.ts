import { expect, type Page, type Response } from "@playwright/test";
import cvContent from "../../content/cv.content.json" with { type: "json" };

const PUBLIC_SECTOR_ROUTE = "/cv/public_sector";
const PUBLIC_SECTOR_POSITIONING = cvContent.tilts.public_sector.positioning;

/**
 * Navigate to the public-sector CV variant and prove that the visitor sees the
 * branded route content.
 *
 * @param page Playwright page for the current test.
 * @returns The initial navigation response so callers can assert the HTTP
 *   status separately when needed.
 */
export async function gotoAndExpectPublicSectorCv(page: Page): Promise<Response | null> {
  const response = await page.goto(PUBLIC_SECTOR_ROUTE);
  await page.waitForLoadState("domcontentloaded");
  await expect(page.getByText(PUBLIC_SECTOR_POSITIONING)).toBeVisible();
  return response;
}
