import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DownloadPdfLink } from "@/components/download-pdf-link";
import { CVLayout } from "@/components/cv-layout";
import {
  cvContent,
  jsonLd,
  cvOpenGraph,
  activeTiltKeys,
  getTilt,
  isActiveTiltKey,
  footerLinks,
} from "@/lib/cv-content";

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
      url: `https://jimcresswell.net/cv/${variant}/`,
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
      canonical: "https://jimcresswell.net/cv/",
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
      <SkipLink />
      <SiteHeader actions={<DownloadPdfLink />} />
      <main id="main-content" className="mx-auto max-w-content px-4 py-8 md:px-8 md:py-16">
        <CVLayout content={cvContent} positioning={variantPositioning} />
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
