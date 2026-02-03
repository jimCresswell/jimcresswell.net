import type { MetadataRoute } from "next";
import { activeTiltKeys, getTilt } from "@/lib/cv-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jimcresswell.net";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Dynamic CV variant pages
  const variantPages: MetadataRoute.Sitemap = activeTiltKeys
    .map((key) => {
      const tilt = getTilt(key);
      if (!tilt) return null;
      return {
        url: `${baseUrl}/cv/${key}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    })
    .filter((page): page is NonNullable<typeof page> => page !== null);

  return [...staticPages, ...variantPages];
}
