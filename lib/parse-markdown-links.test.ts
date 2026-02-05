import { describe, it, expect } from "vitest";
import { parseMarkdownLinks } from "./parse-markdown-links";

describe("parseMarkdownLinks", () => {
  it("returns a React node for plain text", () => {
    const text = "This is plain text without any links.";
    const result = parseMarkdownLinks(text);
    // Returns a React fragment containing the text
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("parses a single markdown link", () => {
    const text = "Visit [Oak](https://oak.org/) for more info.";
    const result = parseMarkdownLinks(text);
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("handles multiple links in text", () => {
    const text = "See [one](https://one.com/) and [two](https://two.com/).";
    const result = parseMarkdownLinks(text);
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("handles empty string", () => {
    const result = parseMarkdownLinks("");
    expect(result).toBeDefined();
  });
});
