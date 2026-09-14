import type { NextMarkdownConfig } from "accept-md-runtime";

/**
 * The accept-md runtime configuration the markdown route hands to
 * `getMarkdownForPath`. The library's own file loader reads only a
 * JavaScript `accept-md.config.*` file through `require`, so the site keeps
 * its configuration as this typed module and never calls the loader
 * (ADR-009).
 *
 * @param vercelUrl - `process.env.VERCEL_URL` on Vercel; undefined locally,
 *   where the route falls back to the request origin or localhost.
 */
export function acceptMdConfigFor(vercelUrl: string | undefined): NextMarkdownConfig {
  return {
    include: ["/**"],
    exclude: ["/api/**", "/_next/**"],
    cleanSelectors: ["nav", "footer", ".no-markdown"],
    outputMode: "markdown",
    cache: true,
    transformers: [],
    // Self-fetch via the internal Vercel URL to bypass the Cloudflare proxy.
    baseUrl: vercelUrl ? `https://${vercelUrl}` : undefined,
  };
}

export const acceptMdConfig: NextMarkdownConfig = acceptMdConfigFor(process.env.VERCEL_URL);
