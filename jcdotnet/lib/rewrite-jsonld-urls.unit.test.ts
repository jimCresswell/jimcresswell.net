import { describe, expect, it } from "vitest";

import { rewriteCanonicalUrl } from "./rewrite-jsonld-urls";

const SITE = "https://preview.example.test";

describe("rewriteCanonicalUrl", () => {
  it("rewrites a canonical URL to the site URL, keeping path, query and fragment", () => {
    expect(rewriteCanonicalUrl("https://www.jimcresswell.net/cv?v=1#top", SITE)).toBe(
      `${SITE}/cv?v=1#top`
    );
    expect(rewriteCanonicalUrl("https://www.jimcresswell.net/#person", SITE)).toBe(
      `${SITE}/#person`
    );
  });

  it("leaves a URL whose host merely begins with the canonical host untouched", () => {
    expect(rewriteCanonicalUrl("https://www.jimcresswell.net.example.test/x", SITE)).toBe(
      "https://www.jimcresswell.net.example.test/x"
    );
  });

  it("leaves external URLs, other schemes and plain strings untouched", () => {
    expect(rewriteCanonicalUrl("https://doi.org/10.1/abc", SITE)).toBe("https://doi.org/10.1/abc");
    expect(rewriteCanonicalUrl("http://www.jimcresswell.net/x", SITE)).toBe(
      "http://www.jimcresswell.net/x"
    );
    expect(rewriteCanonicalUrl("Jim Cresswell", SITE)).toBe("Jim Cresswell");
  });
});
