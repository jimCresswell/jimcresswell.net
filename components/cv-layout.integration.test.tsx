// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CVLayout } from "./cv-layout";

const fakeContent = {
  meta: { name: "Test Person", headline: "Test Headline" },
  links: { email: "test@example.com" },
  experience: [
    {
      organisation: "Acme",
      role: "Lead",
      start_year: 2020,
      end_year: "2024",
      summary: ["Did great things."],
    },
  ],
  foundations: [{ title: "Foundation A", description: ["Description paragraph."] }],
  capabilities: ["Capability one", "Capability two"],
  education: [{ degree: "BSc", field: "Computer Science", institution: "University of Test" }],
};

describe("CVLayout", () => {
  it("renders the person's name as an h1", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    expect(screen.getByRole("heading", { name: "Test Person", level: 1 })).toBeInTheDocument();
  });

  it("renders the email address", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders the headline", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders positioning content", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    expect(screen.getByText("Positioning text")).toBeInTheDocument();
  });

  it("renders experience section with heading, entry heading, metadata, and prose", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    const section = screen.getByRole("region", { name: "Experience" });
    expect(section).toBeInTheDocument();
    expect(within(section).getByRole("heading", { name: "Acme", level: 3 })).toBeInTheDocument();
    expect(within(section).getByText(/Lead/)).toBeInTheDocument();
    expect(within(section).getByText("Did great things.")).toBeInTheDocument();
  });

  it("renders foundations section with heading and prose", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    const section = screen.getByRole("region", { name: "Foundations" });
    expect(section).toBeInTheDocument();
    expect(
      within(section).getByRole("heading", { name: "Foundation A", level: 3 })
    ).toBeInTheDocument();
    expect(within(section).getByText("Description paragraph.")).toBeInTheDocument();
  });

  it("renders capabilities as a list", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    const section = screen.getByRole("region", { name: "Capabilities" });
    expect(within(section).getByText("Capability one")).toBeInTheDocument();
    expect(within(section).getByText("Capability two")).toBeInTheDocument();
  });

  it("renders education with degree, field, and institution", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    const section = screen.getByRole("region", { name: "Education" });
    expect(within(section).getByText("BSc")).toBeInTheDocument();
    expect(within(section).getByText(/Computer Science/)).toBeInTheDocument();
    expect(within(section).getByText("University of Test")).toBeInTheDocument();
  });

  it("has correct aria-labelledby attributes on all sections", () => {
    render(<CVLayout content={fakeContent} positioning={<p>Positioning text</p>} />);

    expect(screen.getByRole("region", { name: "Positioning" })).toHaveAttribute(
      "aria-labelledby",
      "positioning-heading"
    );
    expect(screen.getByRole("region", { name: "Experience" })).toHaveAttribute(
      "aria-labelledby",
      "experience-heading"
    );
    expect(screen.getByRole("region", { name: "Foundations" })).toHaveAttribute(
      "aria-labelledby",
      "foundations-heading"
    );
    expect(screen.getByRole("region", { name: "Capabilities" })).toHaveAttribute(
      "aria-labelledby",
      "capabilities-heading"
    );
    expect(screen.getByRole("region", { name: "Education" })).toHaveAttribute(
      "aria-labelledby",
      "education-heading"
    );
  });
});
