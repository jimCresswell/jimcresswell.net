import Link from "next/link";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { footerLinks } from "@/lib/cv-content";

/** Branded 404 page shown when the CV PDF is not available for this deployment. */
export default function PdfNotFound() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-content px-4 py-8 md:px-8 md:py-16 flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <h1 className="font-sans text-page-title md:text-page-title-md font-medium leading-tight tracking-tight text-foreground mb-4">
          PDF not found
        </h1>
        <p className="font-serif text-base md:text-lg leading-prose text-foreground/80 mb-8 max-w-md">
          The CV PDF has not been generated for this deployment. It is created automatically during
          production builds.
        </p>
        <Link
          href="/cv"
          className="font-sans text-base md:text-lg font-medium text-foreground underline hover:opacity-80 transition-opacity min-h-11 flex items-center"
        >
          View the CV online
        </Link>
      </main>
      <SiteFooter links={footerLinks} />
    </>
  );
}
