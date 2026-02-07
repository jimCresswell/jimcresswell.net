// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleEntry } from "./article-entry";

describe("ArticleEntry", () => {
  it("renders the heading as an h3", () => {
    render(
      <ArticleEntry heading="Acme Corp">
        <p>Body content</p>
      </ArticleEntry>
    );

    const heading = screen.getByRole("heading", { name: "Acme Corp", level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it("renders metadata when provided", () => {
    render(
      <ArticleEntry heading="Acme Corp" meta="Engineering Lead · 2020–2024">
        <p>Body content</p>
      </ArticleEntry>
    );

    expect(screen.getByText("Engineering Lead · 2020–2024")).toBeInTheDocument();
  });

  it("does not render a metadata paragraph when meta is undefined", () => {
    const { container } = render(
      <ArticleEntry heading="Acme Corp">
        <p>Body content</p>
      </ArticleEntry>
    );

    // Only the body paragraph should exist when meta is undefined
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toHaveTextContent("Body content");
  });

  it("renders children within the article", () => {
    render(
      <ArticleEntry heading="Acme Corp">
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </ArticleEntry>
    );

    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph")).toBeInTheDocument();
  });
});
