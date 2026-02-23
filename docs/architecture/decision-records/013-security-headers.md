# ADR-013: Security headers and Content Security Policy

## Status

Accepted

## Date

2026-02-23

## Context

The site had no application-level security headers. Cloudflare provides `Strict-Transport-Security` (HSTS) automatically, but the response included no `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, or `Permissions-Policy`.

While the site is a static personal website with no user input, no authentication, and no forms — meaning the practical attack surface is small — security headers are defence in depth. They cost nothing at runtime and protect against classes of attack that could emerge if the site evolves.

### The nonce question

The [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy) recommends nonce-based CSP via the proxy, which allows strict `script-src` without `'unsafe-inline'`. However, nonces require **every page to be dynamically rendered** — the nonce must be unique per request, so static generation and CDN caching are impossible.

This site is almost entirely statically generated. Pages are prerendered at build time, cached by Vercel's CDN, and served from the edge. Converting to dynamic rendering would:

- Eliminate CDN caching (every request hits the origin server)
- Increase Time to First Byte significantly
- Increase server costs
- Require `await connection()` in every page component to force dynamic rendering

For a site with no user input and no meaningful XSS vector, this is a disproportionate trade-off. The `'unsafe-inline'` concession is pragmatic — it allows the inline scripts that `next-themes` (FOUC prevention) and Vercel Analytics (bootstrap) require, without sacrificing static generation.

### What needs `'unsafe-inline'`

| Source           | Why                                                                                                                                    | Could it be removed?                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `next-themes`    | Injects an inline `<script>` to read `localStorage` and set the theme class before first paint, preventing a flash of unstyled content | Only by replacing next-themes with a server-side solution that reads a cookie — significant rework for marginal security gain |
| Vercel Analytics | Bootstrap script inlined by `@vercel/analytics/next`                                                                                   | Controlled by the library; would need upstream changes                                                                        |
| React (dev only) | Uses `eval` for error stack reconstruction in development                                                                              | `'unsafe-eval'` is added only when `NODE_ENV === 'development'` and is never present in production                            |

### CSP reporting

CSP supports `report-uri` and `report-to` directives that send violation reports to a collection endpoint. Neither Cloudflare nor Vercel provides a native CSP reporting endpoint. Adding one would require either a dedicated service (Sentry, report-uri.com) or a custom Cloudflare Worker.

For a static site with a small, well-understood CSP allowlist, reporting adds complexity without proportionate benefit. Violations are visible in browser developer tools during development and E2E testing. If the site evolves to include user input or third-party integrations, reporting should be reconsidered.

### External resources

The CSP allowlist reflects the site's actual resource loading:

| Directive     | Allowed origins                                                                           | Reason                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `script-src`  | `'self'`, `'unsafe-inline'`, `static.cloudflareinsights.com`                              | Next.js bundles, next-themes/Analytics inline scripts, Cloudflare Web Analytics beacon (injected by CF proxy) |
| `style-src`   | `'self'`, `'unsafe-inline'`                                                               | Tailwind CSS (external stylesheet), possible inline styles from Next.js                                       |
| `font-src`    | `'self'`                                                                                  | Fonts self-hosted via `next/font` (Inter, Literata)                                                           |
| `img-src`     | `'self'`, `data:`, `blob:`                                                                | Local images, possible inline SVGs                                                                            |
| `connect-src` | `'self'`, `va.vercel-scripts.com`, `vitals.vercel-insights.com`, `cloudflareinsights.com` | RSC data fetches, Vercel Analytics/Speed Insights telemetry, Cloudflare beacon reporting                      |

## Decision

Add static security headers via the `headers()` function in `next.config.ts`. No nonces, no dynamic rendering.

### Headers applied to all routes

| Header                    | Value                                                          | Purpose                                                                                    |
| ------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Content-Security-Policy` | See allowlist above                                            | Restricts resource loading to known origins                                                |
| `X-Content-Type-Options`  | `nosniff`                                                      | Prevents MIME type sniffing                                                                |
| `X-Frame-Options`         | `DENY`                                                         | Prevents clickjacking via iframes (belt-and-braces alongside CSP `frame-ancestors 'none'`) |
| `Referrer-Policy`         | `strict-origin-when-cross-origin`                              | Sends origin on cross-origin requests, full URL on same-origin                             |
| `Permissions-Policy`      | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | Disables browser APIs the site does not use; opts out of FLoC                              |

### `unsafe-eval` in development

The CSP adds `'unsafe-eval'` only when `NODE_ENV === 'development'`. React uses `eval` in development mode to reconstruct server-side error stacks in the browser; it does not use `eval` in production. The `headers()` function in `next.config.ts` evaluates `NODE_ENV` at build/startup time:

| Environment                        | `NODE_ENV`    | `unsafe-eval` | Correct                                   |
| ---------------------------------- | ------------- | ------------- | ----------------------------------------- |
| `pnpm dev` (local)                 | `development` | Yes           | React dev mode needs it                   |
| `pnpm build && pnpm start` (local) | `production`  | No            | Production React, no `eval`               |
| Vercel Preview                     | `production`  | No            | Preview deployments are production builds |
| Vercel Production                  | `production`  | No            | As expected                               |

### CORS and host spoofing

Neither requires additional protection:

- **CORS** — Vercel sets `access-control-allow-origin: *` by default. This is appropriate: both API endpoints (`/api/graph` and `/api/accept-md`) serve public content. The knowledge graph is intended to be consumed by any Linked Data client. There are no state-changing endpoints, no authentication, and no cookies that grant access.
- **Host spoofing** — host header attacks matter when the application uses the `Host` header to construct URLs. This site derives `SITE_URL` from Vercel environment variables, the accept-md handler uses `VERCEL_URL` from env (see ADR-009), and Cloudflare only forwards requests for the configured domain.

### Headers NOT added (and why)

| Header                      | Reason                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| `Strict-Transport-Security` | Already set by Cloudflare (`max-age=63072000`). Duplicating it could cause conflicting values.           |
| `X-XSS-Protection`          | Deprecated. Modern browsers use CSP instead. The header can introduce vulnerabilities in older browsers. |
| `X-Powered-By`              | Next.js does not set this by default (it was removed in Next.js 14).                                     |

## Consequences

**Benefits:**

- Defence in depth against XSS, clickjacking, MIME sniffing, and unwanted API access — even though the current attack surface is small.
- No performance impact — headers are added at the framework level, not per-request middleware.
- Static generation and CDN caching are preserved.
- The CSP allowlist is small and auditable. Any new external resource will trigger a visible browser console error, making undocumented dependencies obvious.

**Trade-offs:**

- `'unsafe-inline'` for `script-src` means CSP cannot prevent inline script injection. For a site with no user input, this is an acceptable risk. If the site adds forms, comments, or user-generated content, this should be revisited.
- The CSP allowlist must be updated manually if new external resources are added (e.g. a new analytics provider or CDN-hosted library). E2E tests will catch most issues, but violations in production are only visible if someone checks browser devtools.
- Cloudflare injects the Web Analytics beacon at the edge. If Cloudflare changes the beacon's domain, the CSP will block it silently. This is low-risk (Cloudflare maintains backward compatibility) but worth noting.

## Related

- [ADR-009: Content negotiation proxy](009-content-negotiation-proxy.md) — the proxy handles content negotiation; security headers are set separately via `next.config.ts`
- [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy) — documents the nonce approach we chose not to use
- `next.config.ts` — the implementation
