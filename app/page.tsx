import Link from "next/link";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { footerLinks } from "@/lib/cv-content";

// Content from content/frontpage.content.json
const content = {
  meta: {
    site_section: "home",
    page: "front_page",
    title: "Jim Cresswell",
    locale: "en-GB",
  },
  hero: {
    name: "Jim Cresswell",
    tagline:
      "Exploratory AI Application leader · Zero-to-One Systems · Digital-First Public Services",
    summary: [
      "I lead exploratory work in early, unstructured problem spaces where the path forward is not yet clear.",
      "My focus is on identifying leverage in large-scale systems and shaping conditions for meaningful, positive change — often by enabling others through open data and AI-enabled ecosystems.",
    ],
  },
  primary_navigation: [
    {
      label: "Here is my CV",
      href: "/cv/",
    },
  ],
  highlights: [
    {
      title: "Exploration → judgement → action",
      description:
        "Exploration and discovery feed critical analysis, enabling clear judgement and, when appropriate, decisive application.",
    },
    {
      title: "Public value, open infrastructure",
      description:
        "I'm interested in making high-quality public resources discoverable and usable where people already are, including through modern AI interfaces.",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-[760px] px-4 py-8 md:px-8 md:py-16">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="mb-6">
          <h1
            id="hero-heading"
            className="font-sans text-[32px] md:text-[42px] font-medium leading-tight tracking-tight text-foreground text-balance"
          >
            {content.hero.name}
          </h1>
          <p className="mt-3 md:mt-4 font-sans text-base text-accent">
            {content.hero.tagline}
          </p>
          <div className="mt-6 flex flex-col gap-[14px]">
            {content.hero.summary.map((paragraph, index) => (
              <p
                key={index}
                className="font-serif text-base md:text-lg leading-[1.7] text-foreground"
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
                className="inline-block font-sans text-base md:text-lg font-medium text-foreground underline hover:opacity-80 transition-opacity min-h-[44px] py-2"
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
                <p className="font-serif text-base leading-[1.7] text-foreground">
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
