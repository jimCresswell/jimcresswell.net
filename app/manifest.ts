import type { MetadataRoute } from "next";
import { person } from "@/lib/entities";

/**
 * Web App Manifest — derived from the entity model's Person entity
 * so the description stays in sync across all site outputs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: person.name,
    short_name: person.name,
    description: person.description,
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
