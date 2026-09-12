import { test, expect } from "@playwright/test";
import { gotoAndExpectBrandedNotFound } from "../support/not-found";

test.describe("US-06: Visitor hits a broken link", () => {
  test("visitor sees a branded 404 and can navigate home", async ({ page }) => {
    const response = await gotoAndExpectBrandedNotFound(page, "/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: "MD" })).toHaveCount(0);

    // Visitor can navigate to a valid page
    await page.getByRole("link", { name: "Go back home" }).click();
    await expect(page).toHaveURL("/");
  });
});
