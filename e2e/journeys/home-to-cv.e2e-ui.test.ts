import { test, expect } from "@playwright/test";
import content from "../../content/frontpage.content.json" with { type: "json" };

test.describe("US-01: Visitor discovers who Jim is and navigates to CV", () => {
  test("visitor can identify Jim, understand what he does, and navigate to his CV", async ({
    page,
  }) => {
    await page.goto("/");

    // Visitor immediately knows whose site this is
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(content.hero.name);

    // Visitor understands what Jim does
    await expect(page.getByText(content.hero.tagline)).toBeVisible();

    // Visitor reads the summary to decide whether to continue
    for (const paragraph of content.hero.summary) {
      await expect(page.getByText(paragraph)).toBeVisible();
    }

    // Highlights give additional context on Jim's expertise
    for (const highlight of content.highlights) {
      await expect(page.getByText(highlight.title)).toBeVisible();
    }

    // Visitor decides to view the CV and can do so
    await page.getByRole("link", { name: content.primary_navigation[0].label }).click();
    await expect(page).toHaveURL(/\/cv\/?$/);

    // They arrive at the CV, confirming the journey completed
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  });
});
