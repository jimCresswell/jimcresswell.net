"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import type { ReactNode } from "react";

interface SiteHeaderProps {
  actions?: ReactNode;
}

export function SiteHeader({ actions }: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCV = pathname.startsWith("/cv");

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
            {isHome ? (
              <span className="font-medium underline" aria-current="page">
                Home
              </span>
            ) : (
              <Link href="/" className="opacity-70 hover:opacity-100 transition-opacity">
                Home
              </Link>
            )}
            <span className="mx-2 opacity-50" aria-hidden="true">
              ·
            </span>
            {isCV ? (
              <span className="font-medium underline" aria-current="page">
                CV
              </span>
            ) : (
              <Link href="/cv/" className="opacity-70 hover:opacity-100 transition-opacity">
                CV
              </Link>
            )}
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
