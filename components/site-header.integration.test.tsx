// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./site-header";

// Mock usePathname — the only justified mock for this client component
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock next-themes to avoid jsdom hydration issues
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

let usePathname: ReturnType<typeof vi.fn>;

beforeEach(async () => {
  const navigation = await import("next/navigation");
  usePathname = navigation.usePathname as ReturnType<typeof vi.fn>;
});

describe("SiteHeader", () => {
  it("renders Home and CV nav items", () => {
    usePathname.mockReturnValue("/");
    render(<SiteHeader />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("CV")).toBeInTheDocument();
  });

  it("marks Home as active when pathname is /", () => {
    usePathname.mockReturnValue("/");
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
    usePathname.mockReturnValue("/cv");
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
    usePathname.mockReturnValue("/cv/timeline");
    render(<SiteHeader />);

    const cvElement = screen.getByText("CV");
    expect(cvElement).toHaveAttribute("aria-current", "page");
  });

  it("inactive nav items are links with correct href", () => {
    usePathname.mockReturnValue("/cv");
    render(<SiteHeader />);

    const homeLink = screen.getByText("Home");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders download PDF link on CV pages", () => {
    usePathname.mockReturnValue("/cv");
    render(<SiteHeader />);

    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });

  it("does not render download PDF link on non-CV pages", () => {
    usePathname.mockReturnValue("/");
    render(<SiteHeader />);

    expect(screen.queryByText("Download PDF")).not.toBeInTheDocument();
  });

  it("does not match paths that merely start with /cv but are not CV routes", () => {
    usePathname.mockReturnValue("/cvv");
    render(<SiteHeader />);

    const cvElement = screen.getByText("CV");
    expect(cvElement.tagName).toBe("A");
    expect(cvElement).not.toHaveAttribute("aria-current");
    expect(screen.queryByText("Download PDF")).not.toBeInTheDocument();
  });
});
