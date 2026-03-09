import { expect, type Page, type Response } from "@playwright/test";

const BRANDED_NOT_FOUND_HEADING = "Page not found";
const BRANDED_NOT_FOUND_MESSAGE = "The page you're looking for doesn't exist or has been moved.";
const NEXT_RUNTIME_ERROR_HEADING =
  /Application error: a client-side exception has occurred while loading localhost/;

/**
 * Navigate to a missing route and prove that the branded 404 page is what the
 * visitor ultimately sees.
 *
 * In local Playwright runs against `pnpm dev`, Next.js can occasionally render
 * a transient runtime chunk overlay instead of the route content on first
 * navigation. When that specific overlay is present, reload once and then
 * assert the real 404 content.
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
  const notFoundHeading = page.getByRole("heading", {
    name: BRANDED_NOT_FOUND_HEADING,
  });

  try {
    await expect(notFoundHeading).toBeVisible();
  } catch (error) {
    const runtimeErrorHeading = page.getByRole("heading", {
      name: NEXT_RUNTIME_ERROR_HEADING,
    });

    if (!(await runtimeErrorHeading.isVisible())) {
      throw error;
    }

    await page.reload();
    await expect(notFoundHeading).toBeVisible();
  }

  await expect(page.getByText(BRANDED_NOT_FOUND_MESSAGE)).toBeVisible();
  return response;
}
