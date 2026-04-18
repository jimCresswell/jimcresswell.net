import { expect, type Page, type Response } from "@playwright/test";

const PDF_NOT_FOUND_HEADING = "PDF not found";
const PDF_NOT_FOUND_MESSAGE = "The CV PDF has not been generated for this deployment";

/**
 * Navigate to the missing-PDF page and prove that the branded unavailable
 * content is what the visitor ultimately sees.
 *
 * @param page Playwright page for the current test.
 * @returns The initial navigation response so callers can assert the HTTP
 *   status separately when needed.
 */
export async function gotoAndExpectPdfUnavailable(page: Page): Promise<Response | null> {
  const response = await page.goto("/cv/pdf/unavailable");
  await page.waitForLoadState("domcontentloaded");
  await expect(
    page.getByRole("heading", {
      name: PDF_NOT_FOUND_HEADING,
    })
  ).toBeVisible();
  await expect(page.getByText(PDF_NOT_FOUND_MESSAGE)).toBeVisible();
  return response;
}
