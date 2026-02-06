import { test, expect } from "@playwright/test";

test.describe("REQ-07: PDF response correctness", () => {
  test("GET /cv/pdf returns application/pdf with correct headers", async ({ request }) => {
    const response = await request.get("/cv/pdf");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/pdf");
    expect(response.headers()["content-disposition"]).toContain("Jim-Cresswell-CV.pdf");
  });

  test("PDF body is a valid PDF file", async ({ request }) => {
    const response = await request.get("/cv/pdf");
    const body = await response.body();

    expect(body.length).toBeGreaterThan(0);

    // PDF files start with %PDF
    const header = body.subarray(0, 5).toString();
    expect(header).toBe("%PDF-");
  });

  test("PDF response has immutable cache headers", async ({ request }) => {
    const response = await request.get("/cv/pdf");
    expect(response.headers()["cache-control"]).toContain("immutable");
  });
});
