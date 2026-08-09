import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { gotoAndExpectPublicSectorCv } from "../support/cv-variant";
import { gotoAndExpectBrandedNotFound } from "../support/not-found";
import { gotoAndExpectPdfUnavailable } from "../support/pdf-unavailable";

const pages = [
  { name: "Home", url: "/" },
  { name: "CV (base)", url: "/cv" },
  { name: "CV (variant)", url: "/cv/public_sector" },
  { name: "PDF unavailable", url: "/cv/pdf/unavailable" },
  { name: "404", url: "/non-existent-route" },
];

async function gotoStablePage(page: Page, url: string): Promise<void> {
  if (url === "/cv/public_sector") {
    await gotoAndExpectPublicSectorCv(page);
    return;
  }

  if (url === "/cv/pdf/unavailable") {
    await gotoAndExpectPdfUnavailable(page);
    return;
  }

  if (url === "/non-existent-route") {
    await gotoAndExpectBrandedNotFound(page, url);
    return;
  }

  await page.goto(url);
  await page.waitForLoadState("domcontentloaded");
}

async function setThemeAndWaitForTransitions(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.evaluate((nextTheme) => {
    const root = document.documentElement;
    root.classList.toggle("light", nextTheme === "light");
    root.classList.toggle("dark", nextTheme === "dark");
  }, theme);

  // Axe must inspect the settled theme, not the first frame of a colour transition.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  );
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState === "finished")
  );
}

test.describe("US-08: WCAG 2.2 AA compliance", () => {
  for (const { name, url } of pages) {
    test.describe(name, () => {
      test("passes axe checks in light theme", async ({ page }) => {
        await gotoStablePage(page, url);

        await setThemeAndWaitForTransitions(page, "light");

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });

      test("passes axe checks in dark theme", async ({ page }) => {
        await gotoStablePage(page, url);

        await setThemeAndWaitForTransitions(page, "dark");

        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    });
  }
});
