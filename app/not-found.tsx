import Link from "next/link";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { footerLinks } from "@/lib/cv-content";

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-[760px] px-4 py-8 md:px-8 md:py-16 flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <h1 className="font-sans text-[2rem] md:text-[2.625rem] font-medium leading-tight tracking-tight text-foreground mb-4">
          Page not found
        </h1>
        <p className="font-serif text-base md:text-lg leading-[1.7] text-foreground/80 mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="font-sans text-base md:text-lg font-medium text-foreground underline hover:opacity-80 transition-opacity min-h-[44px] flex items-center"
        >
          Go back home
        </Link>
      </main>
      <SiteFooter links={footerLinks} />
    </>
  );
}
