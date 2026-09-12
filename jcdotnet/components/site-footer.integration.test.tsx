// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./site-footer";

const siteOwnerName = "Test Site Owner";

const allLinks = {
  linkedin: "https://linkedin.com/in/test",
  github: "https://github.com/test",
  google_scholar: "https://scholar.google.com/test",
  shiv: "https://shiv.example.com",
};

describe("SiteFooter", () => {
  it("renders copyright text with the current year and the site owner name", () => {
    render(<SiteFooter siteOwnerName={siteOwnerName} />);

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${currentYear}.*${siteOwnerName}`))).toBeInTheDocument();
  });

  it("renders all provided link labels", () => {
    render(<SiteFooter siteOwnerName={siteOwnerName} links={allLinks} />);

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("Google Scholar")).toBeInTheDocument();
    expect(screen.getByText("Shiv")).toBeInTheDocument();
  });

  it("renders external links with target=_blank and rel=noopener noreferrer", () => {
    render(<SiteFooter siteOwnerName={siteOwnerName} links={allLinks} />);

    const linkedinLink = screen.getByRole("link", { name: "LinkedIn" });
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");

    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("omits links that are not provided", () => {
    render(
      <SiteFooter
        siteOwnerName={siteOwnerName}
        links={{ linkedin: "https://linkedin.com/in/test" }}
      />
    );

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(screen.queryByText("Google Scholar")).not.toBeInTheDocument();
    expect(screen.queryByText("Shiv")).not.toBeInTheDocument();
  });

  it("renders no nav element when links is undefined", () => {
    render(<SiteFooter siteOwnerName={siteOwnerName} />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
