import { test, expect } from "@playwright/test";
import cvContent from "../../content/cv.content.json" with { type: "json" };
import { stripInlineMarkdown } from "../../lib/strip-inline-markdown";

test.describe("REQ-06: Content integrity — rendered content matches JSON source", () => {
  test("CV page renders all experience entries from content JSON", async ({ page }) => {
    await page.goto("/cv");
    for (const exp of cvContent.experience) {
      await expect(page.getByRole("heading", { name: exp.organisation })).toBeVisible();
      await expect(page.getByText(exp.role, { exact: false })).toBeVisible();
    }
  });

  test("CV page renders all prior role entries from content JSON", async ({ page }) => {
    await page.goto("/cv");
    for (const role of cvContent.prior_roles) {
      await expect(page.getByText(role.title)).toBeVisible();
    }
  });

  test("CV page renders all capabilities from content JSON", async ({ page }) => {
    await page.goto("/cv");
    for (const capability of cvContent.capabilities) {
      const visibleText = stripInlineMarkdown(capability);
      await expect(page.getByText(visibleText)).toBeVisible();
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
