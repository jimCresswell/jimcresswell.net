import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { name: "Home", url: "/" },
  { name: "CV (base)", url: "/cv" },
  { name: "CV (variant)", url: "/cv/public_sector" },
  { name: "PDF unavailable", url: "/cv/pdf/unavailable" },
  { name: "404", url: "/non-existent-route" },
];

test.describe("US-08: WCAG 2.2 AA compliance", () => {
  for (const { name, url } of pages) {
    test.describe(name, () => {
      test("passes axe checks in light theme", async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState("domcontentloaded");

        // Ensure light theme
        await page.evaluate(() => {
          document.documentElement.classList.remove("dark");
        });

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test("passes axe checks in dark theme", async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState("domcontentloaded");

        // Switch to dark theme
        await page.evaluate(() => {
          document.documentElement.classList.add("dark");
        });

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    });
  }
});
