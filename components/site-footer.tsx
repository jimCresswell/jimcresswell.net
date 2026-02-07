import Link from "next/link";
import frontpageContent from "@/content/frontpage.content.json";

interface SiteFooterProps {
  links?: {
    email?: string;
    linkedin?: string;
    github?: string;
    google_scholar?: string;
    shiv?: string;
  };
}

/** Shared className for all link-style items in the footer (email span and external links). */
const linkClassName =
  "underline opacity-70 hover:opacity-100 transition-opacity py-2 sm:py-0 sm:min-h-11 flex items-center";

/** Shared className for the email display (not a link, so no underline). */
const emailClassName = "opacity-70 py-2 sm:py-0 sm:min-h-11 flex items-center";

/**
 * Site footer with copyright notice and optional external links.
 * Hidden in print media via the `print-hidden` class.
 */
export function SiteFooter({ links }: SiteFooterProps) {
  const externalLinks = links
    ? [
        links.linkedin ? { label: "LinkedIn", href: links.linkedin } : null,
        links.github ? { label: "GitHub", href: links.github } : null,
        links.google_scholar ? { label: "Google Scholar", href: links.google_scholar } : null,
        links.shiv ? { label: "Shiv", href: links.shiv } : null,
      ].filter((link): link is { label: string; href: string } => link !== null)
    : [];

  const hasLinks = links && (links.email || externalLinks.length > 0);

  return (
    <footer className="print-hidden mt-6 border-t border-foreground/10">
      <div className="mx-auto max-w-page px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-3">
          {/* Copyright and external links */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm opacity-60">
              &copy; {new Date().getFullYear()} {frontpageContent.hero.name}
            </p>
            {hasLinks && (
              <nav
                aria-label="External links"
                className="flex flex-col sm:flex-row sm:gap-4 text-sm"
              >
                {links.email && <span className={emailClassName}>{links.email}</span>}
                {externalLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
