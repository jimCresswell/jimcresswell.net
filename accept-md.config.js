/** @type { import('accept-md-runtime').NextMarkdownConfig } */
const config = {
  include: ["/**"],
  exclude: ["/api/**", "/_next/**"],
  cleanSelectors: ["nav", "footer", ".no-markdown"],
  outputMode: "markdown",
  cache: true,
  transformers: [],
  // Self-fetch via the internal Vercel URL to bypass the Cloudflare proxy.
  // Locally, leave undefined so the route handler falls back to localhost.
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
};

export default config;
