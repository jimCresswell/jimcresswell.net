import { test, expect } from "@playwright/test";
import { gotoAndExpectPdfUnavailable } from "../support/pdf-unavailable";

test.describe("US-05: Visitor encounters missing PDF", () => {
  test("visitor sees a helpful error page and can navigate to the online CV", async ({ page }) => {
    await gotoAndExpectPdfUnavailable(page);

    // Visitor understands what happened
    await expect(page.getByRole("heading", { name: "PDF not found" })).toBeVisible();
    await expect(
      page.getByText("The CV PDF has not been generated for this deployment")
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "PDF" })).toHaveCount(0);

    // Visitor can still access the CV online
    const cvLink = page.getByRole("link", { name: "View the CV online" });
    await expect(cvLink).toBeVisible();
    await cvLink.click();
    await expect(page).toHaveURL(/\/cv\/?$/);
  });
});
