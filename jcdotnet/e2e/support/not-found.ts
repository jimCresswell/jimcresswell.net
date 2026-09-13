import { expect, type Page, type Response } from "@playwright/test";

const BRANDED_NOT_FOUND_HEADING = "Page not found";
const BRANDED_NOT_FOUND_MESSAGE = "The page you're looking for doesn't exist or has been moved.";

/**
 * Navigate to a missing route and prove that the branded 404 page is what the
 * visitor ultimately sees.
 *
 * @param page Playwright page for the current test.
 * @param path Missing route path to request.
 * @returns The initial navigation response so callers can assert the HTTP
 *   status separately.
 */
export async function gotoAndExpectBrandedNotFound(
  page: Page,
  path: string
): Promise<Response | null> {
  const response = await page.goto(path);
  await expect(
    page.getByRole("heading", {
      name: BRANDED_NOT_FOUND_HEADING,
    })
  ).toBeVisible();
  await expect(page.getByText(BRANDED_NOT_FOUND_MESSAGE)).toBeVisible();
  return response;
}
