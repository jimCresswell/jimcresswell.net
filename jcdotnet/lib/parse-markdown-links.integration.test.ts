// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { parseMarkdownLinks } from "./parse-markdown-links";

/** Render the ReactNode returned by parseMarkdownLinks into the DOM. */
function renderResult(text: string) {
  const result = parseMarkdownLinks(text);
  render(createElement("p", null, result));
}

describe("parseMarkdownLinks", () => {
  it("returns plain text unchanged", () => {
    const result = parseMarkdownLinks("No special syntax here.");
    expect(result).toBe("No special syntax here.");
  });

  it("renders an external link as an <a> with target=_blank", () => {
    renderResult("Visit [Oak](https://oak.org/) for more.");

    const link = screen.getByRole("link", { name: "Oak" });
    expect(link).toHaveAttribute("href", "https://oak.org/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveClass("inline-link");
  });

  it("renders a relative link as a Next.js Link (an <a> without target=_blank)", () => {
    renderResult("My [CV is here](/cv/).");

    const link = screen.getByRole("link", { name: "CV is here" });
    // Next.js Link may normalise trailing slashes; check the path is correct
    expect(link.getAttribute("href")).toMatch(/^\/cv\/?$/);
    expect(link).not.toHaveAttribute("target");
    expect(link).toHaveClass("inline-link");
  });

  it("renders emphasis as <em>", () => {
    renderResult("Third-order effects carry _impact_.");

    const em = screen.getByText("impact");
    expect(em.tagName).toBe("EM");
  });

  it("handles multiple links in one string", () => {
    renderResult("See [one](https://one.com/) and [two](/two).");

    const one = screen.getByRole("link", { name: "one" });
    expect(one).toHaveAttribute("href", "https://one.com/");
    expect(one).toHaveAttribute("target", "_blank");

    const two = screen.getByRole("link", { name: "two" });
    expect(two).toHaveAttribute("href", "/two");
    expect(two).not.toHaveAttribute("target");
  });

  it("handles links and emphasis in the same string", () => {
    renderResult("Visit [Oak](https://oak.org/) for _great_ resources.");

    expect(screen.getByRole("link", { name: "Oak" })).toBeInTheDocument();
    const em = screen.getByText("great");
    expect(em.tagName).toBe("EM");
  });

  it("returns plain text for empty string", () => {
    const result = parseMarkdownLinks("");
    expect(result).toBe("");
  });
});
