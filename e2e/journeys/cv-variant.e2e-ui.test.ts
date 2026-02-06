import { test, expect } from "@playwright/test";
import cvContent from "../../content/cv.content.json" with { type: "json" };

test.describe("US-03: Visitor follows a variant link", () => {
  test("variant page shows tailored positioning while preserving shared content", async ({
    page,
  }) => {
    await page.goto("/cv/public_sector");

    // Visitor sees variant-specific positioning framing
    await expect(page.getByText(cvContent.tilts.public_sector.positioning)).toBeVisible();

    // Base positioning is replaced, not shown alongside
    for (const paragraph of cvContent.positioning.paragraphs) {
      await expect(page.getByText(paragraph)).not.toBeVisible();
    }

    // Shared sections remain unchanged — this is the same person's CV
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Foundations" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Capabilities" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();

    for (const exp of cvContent.experience) {
      await expect(page.getByRole("heading", { name: exp.organisation })).toBeVisible();
    }
  });

  test("invalid variant slug returns 404", async ({ page }) => {
    const response = await page.goto("/cv/nonexistent");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });
});
