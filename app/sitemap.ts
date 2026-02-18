import type { MetadataRoute } from "next";
import { activeTiltKeys, getTilt } from "@/lib/cv-content";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/cv`,
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
        url: `${SITE_URL}/cv/${key}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    })
    .filter((page): page is NonNullable<typeof page> => page !== null);

  return [...staticPages, ...variantPages];
}
