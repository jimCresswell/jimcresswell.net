import type { Metadata } from "next";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PrintButton } from "@/components/print-button";
import { CVLayout } from "@/components/cv-layout";
import { cvContent, jsonLd, cvOpenGraph, footerLinks } from "@/lib/cv-content";

export const metadata: Metadata = {
  title: cvOpenGraph.title,
  description: cvOpenGraph.description,
  openGraph: {
    type: "website",
    url: cvOpenGraph.url,
    title: cvOpenGraph.title,
    description: cvOpenGraph.description,
    locale: cvOpenGraph.locale,
    siteName: cvOpenGraph.siteName,
    images: [
      {
        url: cvOpenGraph.image.url,
        alt: cvOpenGraph.image.alt,
        width: cvOpenGraph.image.width,
        height: cvOpenGraph.image.height,
      },
    ],
  },
};

// Base positioning content
function BasePositioning() {
  return (
    <div className="flex flex-col gap-[0.875rem]">
      {cvContent.positioning.paragraphs.map((paragraph, index) => (
        <p key={index} className="font-serif text-base leading-[1.7] text-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default function CVPage() {
  return (
    <>
      <SkipLink />
      <SiteHeader actions={<PrintButton />} />
      <main id="main-content" className="mx-auto max-w-[760px] px-4 py-8 md:px-8 md:py-16">
        <CVLayout positioning={<BasePositioning />} />
      </main>
      <SiteFooter links={footerLinks} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
