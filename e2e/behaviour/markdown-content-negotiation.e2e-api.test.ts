import { test, expect } from "@playwright/test";

test.describe("Markdown content negotiation (accept-md)", () => {
  test("homepage returns markdown when Accept: text/markdown is sent", async ({ request }) => {
    const response = await request.get("/", {
      headers: { Accept: "text/markdown" },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");

    const body = await response.text();
    expect(body).toContain("Jim Cresswell");
  });

  test("CV page returns markdown when Accept: text/markdown is sent", async ({ request }) => {
    const response = await request.get("/cv", {
      headers: { Accept: "text/markdown" },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");

    const body = await response.text();
    expect(body).toContain("Jim Cresswell");
    expect(body).toContain("Positioning");
  });

  test("CV variant returns markdown when Accept: text/markdown is sent", async ({ request }) => {
    const response = await request.get("/cv/public_sector", {
      headers: { Accept: "text/markdown" },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");

    const body = await response.text();
    expect(body).toContain("Jim Cresswell");
  });

  test("markdown response includes YAML frontmatter with metadata", async ({ request }) => {
    const response = await request.get("/cv", {
      headers: { Accept: "text/markdown" },
    });
    const body = await response.text();
    expect(body).toMatch(/^---\n/);
    expect(body).toContain('title: "Jim Cresswell');
  });

  test("API routes are excluded from markdown conversion", async ({ request }) => {
    const response = await request.get("/api/graph", {
      headers: { Accept: "text/markdown" },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
  });

  test(".md suffix serves markdown for the homepage", async ({ request }) => {
    const response = await request.get("/index.md");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");

    const body = await response.text();
    expect(body).toContain("Jim Cresswell");
  });

  test(".md suffix serves markdown for the CV page", async ({ request }) => {
    const response = await request.get("/cv.md");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");

    const body = await response.text();
    expect(body).toContain("Positioning");
  });

  test("/cv/index.md serves markdown for the CV page (directory-style)", async ({ request }) => {
    const response = await request.get("/cv/index.md");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");

    const body = await response.text();
    expect(body).toContain("Positioning");
  });

  test(".md suffix serves markdown for a CV variant", async ({ request }) => {
    const response = await request.get("/cv/public_sector.md");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");

    const body = await response.text();
    expect(body).toContain("Jim Cresswell");
  });

  test("/cv/variant/index.md serves markdown for a CV variant (directory-style)", async ({
    request,
  }) => {
    const response = await request.get("/cv/public_sector/index.md");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");

    const body = await response.text();
    expect(body).toContain("Jim Cresswell");
  });
});
