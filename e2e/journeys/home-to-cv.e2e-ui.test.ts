import { test, expect } from "@playwright/test";
import content from "../../content/frontpage.content.json" with { type: "json" };
import { stripInlineMarkdown } from "../../lib/strip-inline-markdown";

test.describe("US-01: Visitor discovers who Jim is and navigates to CV", () => {
  test("visitor can identify Jim and read about him", async ({ page }) => {
    await page.goto("/");

    // Visitor immediately knows whose site this is
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(content.hero.name);

    // Visitor reads the narrative to understand who Jim is
    for (const paragraph of content.hero.summary) {
      const displayText = stripInlineMarkdown(paragraph);
      await expect(page.getByText(displayText)).toBeVisible();
    }
  });

  test("visitor can navigate to the CV via inline link", async ({ page }) => {
    await page.goto("/");

    // The narrative contains an inline link to the CV
    await page.getByRole("link", { name: "CV is available here" }).click();
    await expect(page).toHaveURL(/\/cv\/?$/);

    // They arrive at the CV, confirming the journey completed
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  });
});
