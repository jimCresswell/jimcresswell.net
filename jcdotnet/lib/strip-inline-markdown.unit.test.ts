import { describe, it, expect } from "vitest";
import { stripInlineMarkdown } from "./strip-inline-markdown";

describe("stripInlineMarkdown", () => {
  it("returns plain text unchanged", () => {
    expect(stripInlineMarkdown("No special syntax here.")).toBe("No special syntax here.");
  });

  it("strips markdown links", () => {
    expect(stripInlineMarkdown("Visit [Oak](https://oak.org/) for details.")).toBe(
      "Visit Oak for details."
    );
  });

  it("strips emphasis markers", () => {
    expect(stripInlineMarkdown("Third-order effects carry _impact_.")).toBe(
      "Third-order effects carry impact."
    );
  });

  it("strips both links and emphasis in one string", () => {
    expect(stripInlineMarkdown("Visit [Oak](https://oak.org/) for _great_ resources.")).toBe(
      "Visit Oak for great resources."
    );
  });

  it("handles multiple links", () => {
    expect(stripInlineMarkdown("[one](https://one.com/) and [two](/two)")).toBe("one and two");
  });

  it("returns empty string for empty input", () => {
    expect(stripInlineMarkdown("")).toBe("");
  });
});
