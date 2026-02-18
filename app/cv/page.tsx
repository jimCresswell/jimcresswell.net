import type { Metadata } from "next";
import { CVLayout } from "@/components/cv-layout";
import { cvContent, cvOpenGraph } from "@/lib/cv-content";
import { jsonLd } from "@/lib/jsonld";

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
    <div className="flex flex-col gap-3.5">
      {cvContent.positioning.paragraphs.map((paragraph, index) => (
        <p key={index} className="font-serif text-base leading-prose text-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default function CVPage() {
  return (
    <>
      <CVLayout content={cvContent} positioning={<BasePositioning />} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
