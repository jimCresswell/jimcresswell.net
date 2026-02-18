import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Literata } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { footerLinks } from "@/lib/cv-content";
import { SITE_URL } from "@/lib/site-config";
import { Analytics } from "@vercel/analytics/next";
import frontpageContent from "@/content/frontpage.content.json";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  display: "swap",
});

// Site-wide metadata from frontpage content
const siteTitle = frontpageContent.meta.title;
const siteDescription = frontpageContent.meta.description;

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  generator: "Next.js",
  manifest: "/manifest.webmanifest",
  icons: {
    // Single SVG with CSS media query for dark mode support
    icon: "/icons/favicon.svg",
    // Apple Touch Icon must be PNG (iOS requirement)
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title: siteTitle,
    description: siteDescription,
    locale: frontpageContent.meta.locale.replace("-", "_"),
    siteName: siteTitle,
    images: [
      {
        url: `${SITE_URL}/icons/og-image.png`,
        alt: siteTitle,
        width: 1200,
        height: 630,
      },
    ],
  },
  // Opt-in to Chrome's text scaling feature (all sizes use rem)
  other: {
    "text-scale": "scale",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={frontpageContent.meta.locale}
      className={`${inter.variable} ${literata.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink />
          <SiteHeader />
          <main id="main-content" className="mx-auto max-w-page px-4 py-8 md:px-8 md:py-16">
            {children}
          </main>
          <SiteFooter links={footerLinks} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
