import { describe, expect, it } from "vitest";
import { resolveSameAsUrlByHostname } from "./same-as";

const sameAsUrls = [
  "https://github.com/jimCresswell",
  "https://www.linkedin.com/in/jimcresswell",
  "https://scholar.google.co.uk/citations?user=7yf2vEEAAAAJ&hl=en",
];

describe("resolveSameAsUrlByHostname", () => {
  it("returns the sole URL with the exact hostname", () => {
    expect(resolveSameAsUrlByHostname(sameAsUrls, "github.com")).toBe(
      "https://github.com/jimCresswell"
    );
    expect(resolveSameAsUrlByHostname(sameAsUrls, "www.linkedin.com")).toBe(
      "https://www.linkedin.com/in/jimcresswell"
    );
  });

  it("does not match hostname-like text in a path or different hostname", () => {
    expect(() =>
      resolveSameAsUrlByHostname(
        ["https://example.com/github.com", "https://github.com.evil.example/profile"],
        "github.com"
      )
    ).toThrow("Expected exactly one sameAs URL for hostname github.com (found 0)");
  });

  it("rejects a missing provider URL", () => {
    expect(() => resolveSameAsUrlByHostname(sameAsUrls, "example.com")).toThrow(
      "Expected exactly one sameAs URL for hostname example.com (found 0)"
    );
  });

  it("rejects ambiguous provider URLs", () => {
    expect(() =>
      resolveSameAsUrlByHostname(
        [...sameAsUrls, "https://github.com/jimCresswell?tab=repositories"],
        "github.com"
      )
    ).toThrow("Expected exactly one sameAs URL for hostname github.com (found 2)");
  });
});
