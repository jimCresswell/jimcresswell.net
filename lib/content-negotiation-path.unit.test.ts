import { describe, expect, it } from "vitest";
import { resolveNegotiablePagePath } from "./content-negotiation-path";

describe("resolveNegotiablePagePath", () => {
  it.each([
    ["/", "/"],
    ["/cv", "/cv"],
    ["/cv/", "/cv"],
  ] as const)("resolves %s to %s", (pathname, expected) => {
    expect(resolveNegotiablePagePath(pathname)).toBe(expected);
  });

  it.each(["/cv/pdf", "/cv/public_sector", "/missing", "//cv", "/cv?x=1"])(
    "rejects non-editorial path %s",
    (pathname) => {
      expect(resolveNegotiablePagePath(pathname)).toBeNull();
    }
  );
});
