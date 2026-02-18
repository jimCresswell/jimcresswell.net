// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

// Mock usePathname — the only justified mock for this client component
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock next-themes to avoid jsdom hydration issues
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

beforeEach(() => {
  vi.mocked(usePathname).mockReset();
});

describe("SiteHeader", () => {
  it("renders Home and CV nav items", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<SiteHeader />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("CV")).toBeInTheDocument();
  });

  it("marks Home as active when pathname is /", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<SiteHeader />);

    const homeElement = screen.getByText("Home");
    expect(homeElement).toHaveAttribute("aria-current", "page");
    expect(homeElement.tagName).toBe("SPAN");

    // CV should be a link, not active
    const cvElement = screen.getByText("CV");
    expect(cvElement.tagName).toBe("A");
    expect(cvElement).not.toHaveAttribute("aria-current");
  });

  it("marks CV as active when pathname starts with /cv", () => {
    vi.mocked(usePathname).mockReturnValue("/cv");
    render(<SiteHeader />);

    const cvElement = screen.getByText("CV");
    expect(cvElement).toHaveAttribute("aria-current", "page");
    expect(cvElement.tagName).toBe("SPAN");

    // Home should be a link, not active
    const homeElement = screen.getByText("Home");
    expect(homeElement.tagName).toBe("A");
    expect(homeElement).not.toHaveAttribute("aria-current");
  });

  it("marks CV as active for nested CV paths like /cv/timeline", () => {
    vi.mocked(usePathname).mockReturnValue("/cv/timeline");
    render(<SiteHeader />);

    const cvElement = screen.getByText("CV");
    expect(cvElement).toHaveAttribute("aria-current", "page");
  });

  it("inactive nav items are links with correct href", () => {
    vi.mocked(usePathname).mockReturnValue("/cv");
    render(<SiteHeader />);

    const homeLink = screen.getByText("Home");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders a link to the PDF download on CV pages", () => {
    vi.mocked(usePathname).mockReturnValue("/cv");
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: /pdf/i })).toHaveAttribute("href", "/cv/pdf");
  });

  it("does not render PDF download link on non-CV pages", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<SiteHeader />);

    const links = screen.getAllByRole("link");
    const pdfLink = links.find((link) => link.getAttribute("href") === "/cv/pdf");
    expect(pdfLink).toBeUndefined();
  });

  it("renders a MD link on the homepage pointing to /index.md", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<SiteHeader />);

    const mdLink = screen.getByRole("link", { name: "MD" });
    expect(mdLink).toHaveAttribute("href", "/index.md");
  });

  it("renders a MD link on the CV page pointing to /cv.md", () => {
    vi.mocked(usePathname).mockReturnValue("/cv");
    render(<SiteHeader />);

    const mdLink = screen.getByRole("link", { name: "MD" });
    expect(mdLink).toHaveAttribute("href", "/cv.md");
  });

  it("renders a MD link on a CV variant pointing to the variant .md path", () => {
    vi.mocked(usePathname).mockReturnValue("/cv/public_sector");
    render(<SiteHeader />);

    const mdLink = screen.getByRole("link", { name: "MD" });
    expect(mdLink).toHaveAttribute("href", "/cv/public_sector.md");
  });

  it("renders a data link pointing to /api/graph on every page", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<SiteHeader />);

    const dataLink = screen.getByRole("link", { name: "DATA" });
    expect(dataLink).toHaveAttribute("href", "/api/graph");
  });

  it("does not match paths that merely start with /cv but are not CV routes", () => {
    vi.mocked(usePathname).mockReturnValue("/cvv");
    render(<SiteHeader />);

    const cvElement = screen.getByText("CV");
    expect(cvElement.tagName).toBe("A");
    expect(cvElement).not.toHaveAttribute("aria-current");
    const links = screen.getAllByRole("link");
    const pdfLink = links.find((link) => link.getAttribute("href") === "/cv/pdf");
    expect(pdfLink).toBeUndefined();
  });
});
