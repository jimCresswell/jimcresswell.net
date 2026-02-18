/**
 * Derive the site URL from the deployment environment.
 *
 * On Vercel production: uses the configured production domain (via `VERCEL_PROJECT_PRODUCTION_URL`).
 * On Vercel preview: uses the deployment-specific URL (so OG cards work for preview links).
 * Locally: falls back to `localhost`.
 *
 * Accepts env values as parameters for testability — the module-level
 * `SITE_URL` constant wires in `process.env` at the call site.
 *
 * @param vercelEnv - Value of `VERCEL_ENV`
 * @param vercelProjectProductionUrl - Value of `VERCEL_PROJECT_PRODUCTION_URL` (no protocol)
 * @param vercelUrl - Value of `VERCEL_URL` (no protocol)
 * @param port - Value of `PORT` for local development
 * @returns Site URL with protocol
 */
export function getSiteUrl(
  vercelEnv?: string,
  vercelProjectProductionUrl?: string,
  vercelUrl?: string,
  port?: string
): string {
  if (vercelEnv === "production" && vercelProjectProductionUrl) {
    return `https://${vercelProjectProductionUrl}`;
  }
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return `http://localhost:${port ?? "3000"}`;
}

/** Canonical site URL — derived from the deployment environment. */
export const SITE_URL = getSiteUrl(
  process.env.VERCEL_ENV,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_URL,
  process.env.PORT
);
