"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { DownloadPdfLink } from "./download-pdf-link";
import { MarkdownPageLink } from "./markdown-page-link";

interface SiteHeaderProps {
  /** Public site owner name supplied by the server composition boundary. */
  siteName: string;
  /** CV download filename supplied without importing graph-backed config. */
  pdfFilename: string;
}

/** Navigation items — adding a link requires only a new entry here. */
const navItems = [
  { label: "Home", href: "/", match: (path: string) => path === "/" },
  { label: "CV", href: "/cv/", match: (path: string) => path === "/cv" || path.startsWith("/cv/") },
];

/**
 * Site header with logo, data-driven navigation, conditional download link,
 * and theme toggle. Hidden in print media via the `print-hidden` class.
 *
 * The download PDF link is rendered on the canonical CV document based on the
 * current pathname. Identity content is injected so this client component does
 * not bundle repository-specific content or entity-graph validation.
 */
export function SiteHeader({ siteName, pdfFilename }: SiteHeaderProps) {
  const pathname = usePathname();
  const isCanonicalCV = pathname === "/cv";

  return (
    <header className="print-hidden">
      <div className="mx-auto flex flex-wrap max-w-page items-center justify-between gap-x-6 gap-y-2 px-4 py-4 md:px-8 md:py-6 font-sans text-sm">
        <div className="flex items-center gap-[clamp(0.375rem,1.5vw,1rem)]">
          <Link
            href="/"
            aria-label={`${siteName} — Home`}
            className="text-foreground hover:text-accent transition-colors min-h-11 flex items-center print:hover:text-foreground"
          >
            <Logo className="h-8 w-8 md:h-9 md:w-9" />
          </Link>
          <span className="h-5 w-px bg-foreground/20" aria-hidden="true" />
          <nav aria-label="Main navigation" className="flex items-center print-hidden">
            {navItems.map((item, index) => (
              <Fragment key={item.href}>
                {index > 0 && (
                  <span className="mx-[clamp(0.25rem,0.75vw,0.5rem)] opacity-50" aria-hidden="true">
                    ·
                  </span>
                )}
                {item.match(pathname) ? (
                  <span className="font-medium underline" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {item.label}
                  </Link>
                )}
              </Fragment>
            ))}
          </nav>
        </div>

        <nav aria-label="Page controls" className="flex items-center gap-2 print-hidden">
          <MarkdownPageLink pathname={pathname} />
          <a
            href="/api/graph"
            className="print-hidden underline text-accent hover:opacity-80 transition-opacity min-h-11 flex items-center"
          >
            DATA
          </a>
          {isCanonicalCV && <DownloadPdfLink filename={pdfFilename} />}
          <span className="ml-1 h-5 w-px bg-foreground/20" aria-hidden="true" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
