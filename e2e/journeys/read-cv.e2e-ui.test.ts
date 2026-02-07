import { test, expect } from "@playwright/test";
import cvContent from "../../content/cv.content.json" with { type: "json" };

test.describe("US-02: Visitor reads the full CV", () => {
  test("CV page presents all sections so a visitor can assess Jim's experience", async ({
    page,
  }) => {
    await page.goto("/cv");

    // Visitor sees whose CV this is
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(cvContent.meta.name);

    // Positioning gives the visitor context on Jim's approach
    for (const paragraph of cvContent.positioning.paragraphs) {
      await expect(page.getByText(paragraph)).toBeVisible();
    }

    // All key sections are present for assessment
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Foundations" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Capabilities" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();

    // Experience entries are substantive
    for (const exp of cvContent.experience) {
      await expect(page.getByRole("heading", { name: exp.organisation })).toBeVisible();
    }

    // Education entries are present
    for (const edu of cvContent.education) {
      await expect(page.getByText(edu.institution)).toBeVisible();
    }

    // Visitor can download the PDF for offline use
    await expect(page.locator('a[href="/cv/pdf"][download]')).toBeVisible();
  });
});
