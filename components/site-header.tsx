"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import type { ReactNode } from "react";

interface SiteHeaderProps {
  actions?: ReactNode;
}

/** Navigation items — adding a link requires only a new entry here. */
const navItems = [
  { label: "Home", href: "/", match: (path: string) => path === "/" },
  { label: "CV", href: "/cv/", match: (path: string) => path.startsWith("/cv") },
];

/**
 * Site header with logo, data-driven navigation, optional actions slot,
 * and theme toggle. Hidden in print media via the `print-hidden` class.
 */
export function SiteHeader({ actions }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="print-hidden">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 md:px-8 md:py-6">
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/"
            aria-label="Jim Cresswell — Home"
            className="text-foreground hover:text-accent transition-colors min-h-11 flex items-center print:hover:text-foreground"
          >
            <Logo className="h-8 w-8 md:h-9 md:w-9" />
          </Link>
          <span className="h-5 w-px bg-foreground/20" aria-hidden="true" />
          <nav
            aria-label="Main navigation"
            className="flex items-center font-sans text-sm print-hidden"
          >
            {navItems.map((item, index) => (
              <Fragment key={item.href}>
                {index > 0 && (
                  <span className="mx-2 opacity-50" aria-hidden="true">
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
        <div className="flex items-center gap-4 print-hidden">
          {actions && (
            <>
              {actions}
              <span className="opacity-30" aria-hidden="true">
                |
              </span>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
