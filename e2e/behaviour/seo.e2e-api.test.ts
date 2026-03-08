import { test, expect } from "@playwright/test";
import frontpageContent from "../../content/frontpage.content.json" with { type: "json" };
import cvContent from "../../content/cv.content.json" with { type: "json" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getJsonLdGraph(data: unknown): Array<Record<string, unknown>> {
  if (!isRecord(data)) {
    throw new Error("Expected JSON-LD payload to be an object");
  }

  const graph = data["@graph"];
  if (!Array.isArray(graph)) {
    throw new Error("Expected JSON-LD payload to contain an @graph array");
  }

  if (!graph.every(isRecord)) {
    throw new Error("Expected every JSON-LD graph entry to be an object");
  }

  return graph;
}

function findGraphEntityById(
  graph: Array<Record<string, unknown>>,
  entityId: string
): Record<string, unknown> {
  const entity = graph.find((candidate) => candidate["@id"] === entityId);
  if (!entity) {
    throw new Error(`Expected JSON-LD entity ${entityId}`);
  }

  return entity;
}

test.describe("US-09: SEO and discoverability", () => {
  test.describe("home page", () => {
    test("HTML lang attribute matches content locale", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
    });

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
      await expect(page).toHaveTitle(`${cvContent.meta.name} — CV`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    });

    test("has Open Graph tags", async ({ page }) => {
      await page.goto("/cv");
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        `${cvContent.meta.name} — CV`
      );
    });

    test("has JSON-LD structured data", async ({ page }) => {
      await page.goto("/cv");
      const jsonLd = page.locator('script[type="application/ld+json"]');
      await expect(jsonLd).toBeAttached();

      const content = await jsonLd.textContent();
      expect(content).toBeTruthy();
      if (!content) {
        throw new Error("Expected JSON-LD script content");
      }

      const data = JSON.parse(content);
      expect(isRecord(data)).toBe(true);
      if (!isRecord(data)) {
        throw new Error("Expected JSON-LD payload to be an object");
      }
      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@graph"]).toBeTruthy();
    });

    test("aligns the canonical CV page identity with inline JSON-LD", async ({ page }) => {
      await page.goto("/cv");

      const canonicalUrl = new URL("/cv/", page.url()).toString();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonicalUrl);

      const jsonLd = page.locator('script[type="application/ld+json"]');
      const content = await jsonLd.textContent();
      expect(content).toBeTruthy();
      if (!content) {
        throw new Error("Expected JSON-LD script content");
      }

      const pageEntity = findGraphEntityById(
        getJsonLdGraph(JSON.parse(content)),
        `${canonicalUrl}#webpage`
      );

      expect(pageEntity["@type"]).toBe("ProfilePage");
      expect(pageEntity.url).toBe(canonicalUrl);
      expect(pageEntity.name).toBe(`${cvContent.meta.name} — CV`);
    });

    test("treats the public-sector tilt as a canonical alias of the CV page", async ({ page }) => {
      await page.goto("/cv/public_sector");

      const canonicalUrl = new URL("/cv/", page.url()).toString();
      await expect(page).toHaveTitle(
        `${cvContent.meta.name} — CV (${cvContent.tilts.public_sector.context})`
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonicalUrl);

      const jsonLd = page.locator('script[type="application/ld+json"]');
      const content = await jsonLd.textContent();
      expect(content).toBeTruthy();
      if (!content) {
        throw new Error("Expected JSON-LD script content");
      }

      const pageEntity = findGraphEntityById(
        getJsonLdGraph(JSON.parse(content)),
        `${canonicalUrl}#webpage`
      );

      expect(pageEntity["@type"]).toBe("ProfilePage");
      expect(pageEntity.url).toBe(canonicalUrl);
      expect(pageEntity.name).toBe(`${cvContent.meta.name} — CV`);
    });
  });

  test.describe("sitemap", () => {
    test("/sitemap.xml returns valid XML with entries for expected pages", async ({ request }) => {
      const response = await request.get("/sitemap.xml");
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toMatch(/xml/);

      const body = await response.text();
      expect(body).toContain("<urlset");
      expect(body).toMatch(/<loc>[^<]+\/cv<\/loc>/);
    });
  });
});
