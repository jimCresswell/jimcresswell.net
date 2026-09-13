import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/**
 * Dynamic robots.txt — sitemap URL derived from the deployment environment
 * so it resolves correctly in production, preview, and local development.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    // The rules are handled by Cloudflare
    rules: {},
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
