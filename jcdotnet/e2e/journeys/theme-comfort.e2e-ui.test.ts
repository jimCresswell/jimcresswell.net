import { test, expect } from "@playwright/test";

test.describe("US-07: Visitor adjusts theme for comfortable reading", () => {
  test("visitor switches to dark mode and it persists across navigation", async ({ page }) => {
    await page.goto("/");

    // Theme toggle is discoverable
    await expect(page.getByRole("group", { name: "Theme selection" })).toBeVisible();

    // Visitor switches to dark mode for comfort
    await page.getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Visitor navigates to the CV — theme persists
    await page.goto("/cv");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("visitor can switch back to light mode", async ({ page }) => {
    await page.goto("/");

    // Set dark first
    await page.getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Switch to light
    await page.getByRole("button", { name: "Light" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("Auto option respects system preference", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Auto" }).click();
    await expect(page.getByRole("button", { name: "Auto" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
