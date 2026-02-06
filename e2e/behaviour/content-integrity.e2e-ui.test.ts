import { test, expect } from "@playwright/test";
import cvContent from "../../content/cv.content.json" with { type: "json" };

test.describe("REQ-06: Content integrity — rendered content matches JSON source", () => {
  test("CV page renders all experience entries from content JSON", async ({ page }) => {
    await page.goto("/cv");
    for (const exp of cvContent.experience) {
      await expect(page.getByRole("heading", { name: exp.organisation })).toBeVisible();
      await expect(page.getByText(exp.role, { exact: false })).toBeVisible();
    }
  });

  test("CV page renders all foundation entries from content JSON", async ({ page }) => {
    await page.goto("/cv");
    for (const foundation of cvContent.foundations) {
      await expect(page.getByText(foundation.title)).toBeVisible();
    }
  });

  test("CV page renders all capabilities from content JSON", async ({ page }) => {
    await page.goto("/cv");
    for (const capability of cvContent.capabilities) {
      await expect(page.getByText(capability)).toBeVisible();
    }
  });

  test("CV page renders all education entries from content JSON", async ({ page }) => {
    await page.goto("/cv");
    for (const edu of cvContent.education) {
      await expect(page.getByText(edu.institution)).toBeVisible();
      // Check degree + field combination to avoid ambiguous matches
      await expect(page.getByText(`${edu.degree}, ${edu.field}`)).toBeVisible();
    }
  });

  test("variant page renders variant-specific positioning from content JSON", async ({ page }) => {
    await page.goto("/cv/public_sector");
    await expect(page.getByText(cvContent.tilts.public_sector.positioning)).toBeVisible();
  });
});
