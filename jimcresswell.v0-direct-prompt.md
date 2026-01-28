You are building jimcresswell.net using the latest stable Next.js (App Router) and modern React.

Treat the following files as canonical inputs:
- frontpage.content.json
- cv.content.json
- cv.og.json
- cv.presentation.json

Goal:
Create a minimal, editorial-quality personal site with a front page and CV pages. The design should feel calm, serious, and intentional — not like a SaaS dashboard or marketing site.

Routes:
- `/` front page
- `/cv/` CV
- Optional `/cv/<variant>/` mapped from cv.content.json tilts

Key requirements:
- Single-column CV layout, max width ~760px.
- Excellent typography and whitespace-driven hierarchy.
- Light and dark mode via CSS variables.
- WCAG 2.2 AA accessibility.
- Print-friendly CV (A4, proper margins, print button).
- Open Graph metadata from cv.og.json (no Twitter tags).
- JSON-LD injected from cv.content.json.
- Server components by default, minimal client JS.
- next/font for fonts, next/image if images are added.
- No invented content. No icons, charts, timelines, or gimmicks.

Front page:
- Hero with name, tagline, summary, and CV CTA.
- Highlights rendered as clean typographic sections.
- Minimal navigation.

CV page:
- Name, headline, positioning paragraphs.
- Experience, foundations, capabilities, education.
- Optional context/tilt variants.
- Strong reading experience on mobile and desktop.

Quality bar:
- Editorial, calm, credible.
- Lighthouse 95+.
- Modern dependencies only.
