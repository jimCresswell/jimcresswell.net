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

export function SiteFooter({ links }: SiteFooterProps) {
  return (
    <footer className="print-hidden mt-6 border-t border-foreground/10">
      <div className="mx-auto max-w-[760px] px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-3">
          {/* Copyright and external links */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm opacity-60">
              &copy; {new Date().getFullYear()} {frontpageContent.hero.name}
            </p>
            {links && (
              <nav aria-label="External links" className="flex flex-col sm:flex-row sm:gap-4 text-sm">
                {links.email && (
                  <span className="opacity-70 py-2 sm:py-0 sm:min-h-[44px] flex items-center">
                    {links.email}
                  </span>
                )}
                {links.linkedin && (
                  <Link
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline opacity-70 hover:opacity-100 transition-opacity py-2 sm:py-0 sm:min-h-[44px] flex items-center"
                  >
                    LinkedIn
                  </Link>
                )}
                {links.github && (
                  <Link
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline opacity-70 hover:opacity-100 transition-opacity py-2 sm:py-0 sm:min-h-[44px] flex items-center"
                  >
                    GitHub
                  </Link>
                )}
                {links.google_scholar && (
                  <Link
                    href={links.google_scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline opacity-70 hover:opacity-100 transition-opacity py-2 sm:py-0 sm:min-h-[44px] flex items-center"
                  >
                    Google Scholar
                  </Link>
                )}
                {links.shiv && (
                  <Link
                    href={links.shiv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline opacity-70 hover:opacity-100 transition-opacity py-2 sm:py-0 sm:min-h-[44px] flex items-center"
                  >
                    Shiv
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
