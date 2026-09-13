// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageSection } from "./page-section";

describe("PageSection", () => {
  it("renders a section element with aria-labelledby linked to the heading", () => {
    render(
      <PageSection id="experience" heading="Experience">
        <p>Content here</p>
      </PageSection>
    );

    const section = screen.getByRole("region", { name: "Experience" });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-labelledby", "experience-heading");
  });

  it("renders visible heading text when srOnly is false", () => {
    render(
      <PageSection id="skills" heading="Skills">
        <p>Content</p>
      </PageSection>
    );

    const heading = screen.getByRole("heading", { name: "Skills", level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).not.toHaveClass("sr-only");
  });

  it("renders heading with sr-only class when srOnly is true", () => {
    render(
      <PageSection id="positioning" heading="Positioning" srOnly>
        <p>Content</p>
      </PageSection>
    );

    const heading = screen.getByRole("heading", { name: "Positioning", level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("sr-only");
  });

  it("renders children inside the section", () => {
    render(
      <PageSection id="test" heading="Test">
        <p>Child content</p>
      </PageSection>
    );

    const section = screen.getByRole("region", { name: "Test" });
    expect(section).toHaveTextContent("Child content");
  });

  it("applies additional className to the section element", () => {
    render(
      <PageSection id="test" heading="Test" className="mb-6">
        <p>Content</p>
      </PageSection>
    );

    const section = screen.getByRole("region", { name: "Test" });
    expect(section).toHaveClass("mb-6");
  });
});
