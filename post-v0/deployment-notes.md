# Deployment Notes (Post-v0)

## Recommended Hosting

**Vercel** (preferred for Next.js):

- Zero-config deployment
- Automatic preview deployments
- Edge functions if needed
- Built-in analytics (optional)

**Alternatives**:

- Netlify (with Next.js adapter)
- Cloudflare Pages
- Self-hosted with Docker

---

## Security Headers

Add to `next.config.js` or middleware:

```js
// next.config.js
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
```

### Content Security Policy (CSP)

Start permissive, tighten over time:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
```

Note: `'unsafe-inline'` for styles may be needed for Tailwind. Consider nonce-based CSP if stricter policy required.

---

## SEO & Indexing

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://jimcresswell.net/sitemap.xml
```

### sitemap.xml

Next.js App Router can generate this automatically:

```ts
// app/sitemap.ts
export default function sitemap() {
  return [
    { url: "https://jimcresswell.net", lastModified: new Date() },
    { url: "https://jimcresswell.net/cv", lastModified: new Date() },
    // Add variant URLs from tilts
  ];
}
```

### Canonical URLs

- `/cv/` is canonical for the CV
- Variants should set `rel="canonical"` to `/cv/` (prevents SEO dilution)

---

## Performance Checklist

- [ ] Images optimized via `next/image`
- [ ] Fonts loaded via `next/font` (no external requests)
- [ ] No layout shift (CLS < 0.1)
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] Bundle size reasonable (check with `npx next build` output)

---

## Domain & DNS

- Primary: `jimcresswell.net`
- Redirect: `www.jimcresswell.net` → `jimcresswell.net`
- HTTPS enforced (automatic with Vercel)

---

## Monitoring (Optional)

Consider adding after launch:

- Vercel Analytics (free tier)
- Sentry for error tracking
- Uptime monitoring (UptimeRobot, Better Uptime)
