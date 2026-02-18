/** @type { import('accept-md-runtime').NextMarkdownConfig } */
const config = {
  include: ["/**"],
  exclude: ["/api/**", "/_next/**"],
  cleanSelectors: ["nav", "footer", ".no-markdown"],
  outputMode: "markdown",
  cache: true,
  transformers: [],
};

export default config;
