import path from "node:path";
import { describe, it, expect } from "vitest";
import { getDeployKey, getBlobPath, getLocalPdfPath, PDF_FILENAME } from "./pdf-config.js";

describe("getDeployKey", () => {
  it("prefers commit SHA when both are provided", () => {
    expect(getDeployKey("sha123", "dep456")).toBe("sha123");
  });

  it("falls back to deployment ID when commit SHA is absent", () => {
    expect(getDeployKey(undefined, "dep456")).toBe("dep456");
  });

  it("falls back to deployment ID when commit SHA is empty", () => {
    expect(getDeployKey("", "dep456")).toBe("dep456");
  });

  it("returns 'local' when neither is provided", () => {
    expect(getDeployKey()).toBe("local");
  });

  it("returns 'local' when both are empty strings", () => {
    expect(getDeployKey("", "")).toBe("local");
  });
});

describe("getBlobPath", () => {
  it("formats the path with the deploy key", () => {
    expect(getBlobPath("abc123")).toBe("pdf/cv-abc123.pdf");
  });
});

describe("getLocalPdfPath", () => {
  it("joins the cwd with .next and the PDF filename", () => {
    const result = getLocalPdfPath("/Users/jim/project");
    expect(result).toBe(path.join("/Users/jim/project", ".next", "Jim-Cresswell-CV.pdf"));
  });
});

describe("PDF_FILENAME", () => {
  it("is a non-empty string ending in .pdf", () => {
    expect(PDF_FILENAME).toBe("Jim-Cresswell-CV.pdf");
  });
});
