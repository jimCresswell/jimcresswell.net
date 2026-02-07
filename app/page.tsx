import Link from "next/link";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { footerLinks } from "@/lib/cv-content";
import content from "@/content/frontpage.content.json";

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-content px-4 py-8 md:px-8 md:py-16">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="mb-6">
          <h1
            id="hero-heading"
            className="font-sans text-page-title md:text-page-title-md font-medium leading-tight tracking-tight text-foreground text-balance"
          >
            {content.hero.name}
          </h1>
          <p className="mt-3 md:mt-4 font-sans text-base text-accent">{content.hero.tagline}</p>
          <div className="mt-6 flex flex-col gap-3.5">
            {content.hero.summary.map((paragraph, index) => (
              <p
                key={index}
                className="font-serif text-base md:text-lg leading-prose text-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {/* Primary Navigation / CTA */}
          <nav aria-label="Primary navigation" className="mt-6">
            {content.primary_navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-block font-sans text-base md:text-lg font-medium text-foreground underline hover:opacity-80 transition-opacity min-h-11 py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        {/* Highlights Section */}
        <section aria-labelledby="highlights-heading">
          <h2 className="sr-only" id="highlights-heading">
            Highlights
          </h2>
          <div className="flex flex-col gap-6">
            {content.highlights.map((highlight, index) => (
              <article key={index} className="flex flex-col gap-2">
                <h3 className="font-sans text-base md:text-lg font-medium text-foreground">
                  {highlight.title}
                </h3>
                <p className="font-serif text-base leading-prose text-foreground">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter links={footerLinks} />
    </>
  );
}
