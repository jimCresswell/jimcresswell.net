// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./site-footer";
import frontpageContent from "@/content/frontpage.content.json";

const allLinks = {
  email: "test@example.com",
  linkedin: "https://linkedin.com/in/test",
  github: "https://github.com/test",
  google_scholar: "https://scholar.google.com/test",
  shiv: "https://shiv.example.com",
};

describe("SiteFooter", () => {
  it("renders copyright text with the current year and the site owner name", () => {
    render(<SiteFooter />);

    const currentYear = new Date().getFullYear().toString();
    const name = frontpageContent.hero.name;
    expect(screen.getByText(new RegExp(`${currentYear}.*${name}`))).toBeInTheDocument();
  });

  it("renders all provided link labels", () => {
    render(<SiteFooter links={allLinks} />);

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Google Scholar")).toBeInTheDocument();
    expect(screen.getByText("Shiv")).toBeInTheDocument();
  });

  it("renders email as text, not as a link", () => {
    render(<SiteFooter links={allLinks} />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    // Email should not be rendered as a link
    const emailElement = screen.getByText("test@example.com");
    expect(emailElement.tagName).not.toBe("A");
  });

  it("renders external links with target=_blank and rel=noopener noreferrer", () => {
    render(<SiteFooter links={allLinks} />);

    const linkedinLink = screen.getByRole("link", { name: "LinkedIn" });
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");

    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("omits links that are not provided", () => {
    render(<SiteFooter links={{ linkedin: "https://linkedin.com/in/test" }} />);

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(screen.queryByText("Google Scholar")).not.toBeInTheDocument();
    expect(screen.queryByText("Shiv")).not.toBeInTheDocument();
  });

  it("renders no nav element when links is undefined", () => {
    render(<SiteFooter />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
