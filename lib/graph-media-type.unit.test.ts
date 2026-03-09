import { describe, expect, it } from "vitest";
import { getRequestedGraphMediaType } from "./graph-media-type";

describe("getRequestedGraphMediaType", () => {
  it("returns LD+JSON when the Accept header requests application/ld+json", () => {
    expect(getRequestedGraphMediaType("application/ld+json")).toBe("application/ld+json");
  });

  it("returns JSON when the Accept header requests application/json", () => {
    expect(getRequestedGraphMediaType("application/json")).toBe("application/json");
  });

  it("prefers LD+JSON when both graph media types are accepted", () => {
    expect(getRequestedGraphMediaType("application/json;q=0.9, application/ld+json;q=1.0")).toBe(
      "application/ld+json"
    );
  });

  it("returns null when neither supported graph media type is requested", () => {
    expect(getRequestedGraphMediaType("text/html,application/xhtml+xml")).toBeNull();
  });
});
