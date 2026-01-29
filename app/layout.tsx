import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Literata } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  title: "Jim Cresswell",
  description:
    "Exploratory AI Application leader focused on zero-to-one systems, digital-first public services, and high-leverage impact through open data and AI-enabled ecosystems.",
  generator: "Next.js",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/apple-icon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/apple-icon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: "https://jimcresswell.net/",
    title: "Jim Cresswell",
    description:
      "Exploratory AI Application leader focused on zero-to-one systems, digital-first public services, and high-leverage impact through open data and AI-enabled ecosystems.",
    locale: "en_GB",
    siteName: "Jim Cresswell",
    images: [
      {
        url: "https://jimcresswell.net/og-image.png",
        alt: "Jim Cresswell",
        width: 1200,
        height: 630,
      },
    ],
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
      lang="en"
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
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
