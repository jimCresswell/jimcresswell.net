import { expect, test } from "@playwright/test";
import { gotoAndExpectBrandedNotFound } from "../support/not-found";

test.describe("Retired CV variant routes", () => {
  test("the former public-sector route returns the branded 404", async ({ page }) => {
    const response = await gotoAndExpectBrandedNotFound(page, "/cv/public_sector");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: "PDF" })).toHaveCount(0);
  });
});
