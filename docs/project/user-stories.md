# User Stories

Key user stories for jimcresswell.net. Each story describes a behaviour the site must support from the user's perspective.

---

## US-01: View the home page

**As a** visitor,
**I want to** get a sense of who Jim is, what he cares about, and what he works on,
**so that** I can decide whether to engage further — via his CV, code, research, or other links.

**Acceptance criteria:**

- The home page displays Jim's name and a personal narrative.
- Inline links within the narrative connect to the CV, GitHub, Google Scholar, and other relevant destinations.
- The page works as a personal presence, not just a gateway to the CV.

---

## US-02: View the CV online

**As a** visitor,
**I want to** read Jim's full CV in my browser,
**so that** I can assess his experience and skills.

**Acceptance criteria:**

- The CV page shows positioning, experience, prior roles, capabilities, and education.
- Editorial content and shared identity atoms are rendered from their JSON
  owners; structural component labels remain component-owned.
- The page is readable on mobile, tablet, and desktop.

---

## US-03: Retired — view a CV variant

This former story was retired by ADR-021 because there is no current product
requirement for audience-specific CV variants. Preserved material and re-entry
conditions live in the CV tilt architecture reference.

**Acceptance criteria:**

- The canonical CV remains available at `/cv/`.
- An obsolete tilt link such as `/cv/public_sector` returns the branded 404.
- Re-entry requires a new product requirement, plan, and ADR.

---

## US-04: Download the CV as PDF

**As a** visitor,
**I want to** download the CV as a PDF,
**so that** I can read it offline or share it with colleagues.

**Acceptance criteria:**

- A link to download the PDF is visible on the CV page.
- Clicking the link downloads a PDF file without navigating away from the page.
- The downloaded PDF has correct formatting, fonts, and page breaks.

---

## US-05: See a helpful error when the PDF is unavailable

**As a** visitor,
**I want to** see a clear, branded error page if the PDF has not been generated,
**so that** I understand what happened and can still access the CV online.

**Acceptance criteria:**

- When no PDF is available, `/cv/pdf` redirects to a branded 404 page.
- The error page explains that the PDF has not been generated.
- A link back to the online CV is provided.
- The HTTP status code is 404.

---

## US-06: See a helpful 404 for any non-existent route

**As a** visitor who has followed a broken or outdated link,
**I want to** see a branded 404 page,
**so that** I can navigate to a valid page.

**Acceptance criteria:**

- Any non-existent route returns a branded 404 page.
- The error page includes a link back to the home page.
- The HTTP status code is 404.

---

## US-07: Switch between light and dark themes

**As a** visitor,
**I want to** switch between light, dark, and system themes,
**so that** I can read comfortably in my preferred mode.

**Acceptance criteria:**

- A theme toggle is visible in the site header.
- Three options: Light, Dark, Auto (system preference).
- The selected theme persists across page navigations.
- Theme transitions are instant (no flash of wrong theme).

---

## US-08: Use the site with assistive technology

**As a** visitor with a disability,
**I want to** access all content and functionality using assistive technology,
**so that** I am not excluded from any part of the site.

**Acceptance criteria:**

- All pages meet WCAG 2.2 AA compliance (see [requirements](requirements.md)).
- A skip link allows keyboard users to bypass navigation.
- All interactive elements have sufficient size (44px minimum touch target).
- Focus indicators are visible on all interactive elements.
- Heading hierarchy is correct and complete.
- All content is accessible via keyboard navigation.

---

## US-09: Find the site via search engines

**As a** recruiter or colleague,
**I want to** find Jim's site via a search engine,
**so that** I can view his CV and contact information.

**Acceptance criteria:**

- All pages have appropriate `<title>` and `<meta description>` tags.
- Open Graph metadata is present for social sharing.
- A sitemap is generated and accessible at `/sitemap.xml`.
- Schema.org structured data (JSON-LD) is present on CV pages.

---

## US-10: Access content as a machine or AI system

**As an** AI system, LLM crawler, or programmatic consumer,
**I want to** access the site's content in machine-readable formats,
**so that** I can understand Jim's professional identity, experience, and skills.

**Acceptance criteria:**

- Requesting the home or canonical CV document with `Accept: text/markdown`
  returns clean markdown with YAML frontmatter.
- Requesting the home or canonical CV document with
  `Accept: application/ld+json` returns the full Schema.org knowledge graph.
- Requesting a native subroute or missing route with an alternate `Accept`
  header preserves that route's status and representation.
- Browser-friendly `.md` aliases (e.g. `/cv.md`, `/cv/index.md`) serve markdown without custom headers.
- The knowledge graph is also available at `/api/graph` as a JSON endpoint.
- The site header exposes MD and DATA links on the supported editorial
  documents, adds PDF on the canonical CV, and omits unsupported MD links on
  other routes.
- API routes are not intercepted by content negotiation.
