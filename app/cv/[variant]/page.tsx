import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CVLayout } from "@/components/cv-layout";
import { cvContent, cvOpenGraph, activeTiltKeys, getTilt, isActiveTiltKey } from "@/lib/cv-content";
import { SITE_URL } from "@/lib/site-config";
import { jsonLd } from "@/lib/jsonld";

interface Props {
  params: Promise<{ variant: string }>;
}

export async function generateStaticParams() {
  return activeTiltKeys.map((variant) => ({
    variant,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { variant } = await params;

  if (!isActiveTiltKey(variant)) {
    return {};
  }

  const tilt = getTilt(variant);
  if (!tilt) {
    return {};
  }

  const title = `${cvContent.meta.name} — CV (${tilt.context})`;

  return {
    title,
    description: cvOpenGraph.description,
    openGraph: {
      type: "website",
      url: `${SITE_URL}/cv/${variant}/`,
      title,
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
    alternates: {
      canonical: `${SITE_URL}/cv/`,
    },
  };
}

export default async function CVVariantPage({ params }: Props) {
  const { variant } = await params;

  if (!isActiveTiltKey(variant)) {
    notFound();
  }

  const tilt = getTilt(variant);
  if (!tilt) {
    notFound();
  }

  // Variant positioning content
  const variantPositioning = (
    <p className="font-serif text-base leading-prose text-foreground">{tilt.positioning}</p>
  );

  return (
    <>
      <CVLayout content={cvContent} positioning={variantPositioning} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
