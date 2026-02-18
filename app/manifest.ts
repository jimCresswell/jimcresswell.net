import type { MetadataRoute } from "next";
import cvContent from "@/content/cv.content.json";

/**
 * Web App Manifest — generated from cv.content.json so the description
 * stays in sync with the rest of the site's editorial content.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: cvContent.meta.name,
    short_name: cvContent.meta.name,
    description: cvContent.meta.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#1c1917",
    icons: [
      {
        src: "/icons/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
