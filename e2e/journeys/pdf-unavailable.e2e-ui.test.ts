import { test, expect } from "@playwright/test";

test.describe("US-05: Visitor encounters missing PDF", () => {
  test("visitor sees a helpful error page and can navigate to the online CV", async ({ page }) => {
    await page.goto("/cv/pdf/unavailable");

    // Visitor understands what happened
    await expect(page.getByRole("heading", { name: "PDF not found" })).toBeVisible();
    await expect(
      page.getByText("The CV PDF has not been generated for this deployment")
    ).toBeVisible();

    // Visitor can still access the CV online
    const cvLink = page.getByRole("link", { name: "View the CV online" });
    await expect(cvLink).toBeVisible();
    await cvLink.click();
    await expect(page).toHaveURL(/\/cv\/?$/);
  });
});
