import { test, expect } from "@playwright/test";

test.describe("US-06: Visitor hits a broken link", () => {
  test("visitor sees a branded 404 and can navigate home", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);

    // Visitor sees a branded error page, not a raw server error
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await expect(
      page.getByText("The page you're looking for doesn't exist or has been moved.")
    ).toBeVisible();

    // Visitor can navigate to a valid page
    await page.getByRole("link", { name: "Go back home" }).click();
    await expect(page).toHaveURL("/");
  });
});
