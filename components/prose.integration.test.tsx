// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Prose } from "./prose";

describe("Prose", () => {
  it("renders a paragraph with the given text", () => {
    render(<Prose>Hello world</Prose>);

    const paragraph = screen.getByText("Hello world");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.tagName).toBe("P");
  });

  it("renders markdown-style links via RichText", () => {
    render(<Prose>Visit [Example](https://example.com) for details.</Prose>);

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("applies additional className when provided", () => {
    render(<Prose className="mt-4">Text content</Prose>);

    const paragraph = screen.getByText("Text content");
    expect(paragraph).toHaveClass("mt-4");
  });
});
