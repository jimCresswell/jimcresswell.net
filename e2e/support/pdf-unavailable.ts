import { expect, type Page, type Response } from "@playwright/test";

const PDF_NOT_FOUND_HEADING = "PDF not found";
const PDF_NOT_FOUND_MESSAGE = "The CV PDF has not been generated for this deployment";
const NEXT_ERROR_ROOT = "html#__next_error__";

/**
 * Navigate to the missing-PDF page and prove that the branded unavailable
 * content is what the visitor ultimately sees.
 *
 * In local Playwright runs against `pnpm dev`, Next.js can occasionally render
 * its dev error shell instead of the route content on first navigation. When
 * that specific shell is present, reload once and then assert the real PDF
 * unavailable content.
 *
 * @param page Playwright page for the current test.
 * @returns The initial navigation response so callers can assert the HTTP
 *   status separately when needed.
 */
export async function gotoAndExpectPdfUnavailable(page: Page): Promise<Response | null> {
  const response = await page.goto("/cv/pdf/unavailable");
  await page.waitForLoadState("domcontentloaded");

  const heading = page.getByRole("heading", {
    name: PDF_NOT_FOUND_HEADING,
  });

  try {
    await expect(heading).toBeVisible();
  } catch (error) {
    const nextErrorRoot = page.locator(NEXT_ERROR_ROOT);

    if ((await nextErrorRoot.count()) === 0) {
      throw error;
    }

    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(heading).toBeVisible();
  }

  await expect(page.getByText(PDF_NOT_FOUND_MESSAGE)).toBeVisible();
  return response;
}
