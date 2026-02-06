import { test, expect } from "@playwright/test";
import frontpageContent from "../../content/frontpage.content.json" with { type: "json" };
import cvOgContent from "../../content/cv.og.json" with { type: "json" };

test.describe("US-09: SEO and discoverability", () => {
  test.describe("home page", () => {
    test("has correct title and meta description", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(frontpageContent.meta.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    });

    test("has Open Graph tags", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        "content",
        /.+/
      );
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    });
  });

  test.describe("CV page", () => {
    test("has correct title and meta description", async ({ page }) => {
      await page.goto("/cv");
      await expect(page).toHaveTitle(cvOgContent.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    });

    test("has Open Graph tags", async ({ page }) => {
      await page.goto("/cv");
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        cvOgContent.title
      );
    });

    test("has JSON-LD structured data", async ({ page }) => {
      await page.goto("/cv");
      const jsonLd = page.locator('script[type="application/ld+json"]');
      await expect(jsonLd).toBeAttached();

      const content = await jsonLd.textContent();
      expect(content).toBeTruthy();

      const data = JSON.parse(content!) as Record<string, unknown>;
      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@graph"]).toBeTruthy();
    });
  });

  test.describe("sitemap", () => {
    test("/sitemap.xml returns valid XML with expected URLs", async ({ request }) => {
      const response = await request.get("/sitemap.xml");
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toMatch(/xml/);

      const body = await response.text();
      expect(body).toContain("<urlset");
      expect(body).toContain("https://jimcresswell.net");
      expect(body).toContain("https://jimcresswell.net/cv");
    });
  });
});
