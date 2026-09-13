import { test, expect } from "@playwright/test";

test.describe("US-04: Visitor downloads the CV as PDF", () => {
  test("visitor finds and downloads the PDF from the CV page", async ({ page }) => {
    await page.goto("/cv");

    // Download link is visible and discoverable
    const downloadLink = page.locator('a[href="/cv/pdf"][download]').first();
    await expect(downloadLink).toBeVisible();

    // Clicking initiates a file download without navigating away
    const downloadPromise = page.waitForEvent("download");
    await downloadLink.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("Jim-Cresswell-CV.pdf");
  });
});
