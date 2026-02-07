# Timeline Page

Add a chronological career history page at `/cv/timeline` to complement the editorial CV.

## Status: Planning

## Context

The editorial CV is a thematic, narrative document — it deliberately groups experience by arc rather than chronology, and only Oak National Academy appears as a standalone entry. This is an intentional positioning choice and works well for its purpose.

However, there is a significant body of career history that the editorial CV elides or compresses. The archive (`archive/prior_cv_content.json.bak`) contains a full chronological record. This history is currently invisible on the site.

This plan was originally Observation 9 in the content review plan. The editorial improvements to the CV itself are tracked separately in [cv-editorial-improvements.plan.md](cv-editorial-improvements.plan.md).

## Career history from archive

| Period              | Role                                    | Organisation                            |
| ------------------- | --------------------------------------- | --------------------------------------- |
| Jun 2022 – present  | Principal Engineer                      | Oak National Academy                    |
| Jan 2021 – Jun 2022 | Head of DevOps and Quality (Consulting) | Oak National Academy                    |
| Aug 2020 – Dec 2020 | Senior Developer (Consulting)           | Oak National Academy                    |
| Feb 2018 – present  | Managing Director                       | Code Science Limited                    |
| Jan 2018 – Dec 2020 | Founder                                 | Obaith (tech for good / systems change) |
| Feb 2017 – Dec 2017 | Programme QA Consultant                 | Home Office (HMPO)                      |
| Mar 2015 – Dec 2015 | QA Automation Consultant                | British Airways                         |
| Aug 2011 – Jul 2014 | Senior Developer                        | FT Labs (Financial Times)               |
| Apr 2009 – Nov 2010 | Systems Engineer                        | HP Labs (for N-able)                    |
| Sep 2005 – Dec 2010 | PhD Researcher                          | University of Portsmouth                |

Plus education at Portsmouth, Sussex, and Bath — with thesis titles and links.

The original content is at <https://jimcresswell.github.io/cv>.

## Purpose

### 1. Standalone value

A chronological page complements the editorial CV by giving readers who want a career history a place to find one. The editorial CV answers "what is Jim about?"; the timeline answers "what has Jim done, and when?". Different readers want different things — hiring managers scanning for employer names and dates, recruiters checking tenure, peers satisfying curiosity.

The page should **not** be a visual timeline widget (the design brief's "no timelines" constraint refers to decorative UI elements on the main CV). It should be a clean, text-first page in the same editorial aesthetic as the rest of the site — chronological entries with dates, role, organisation, and a brief description. Think of it as a detailed career record, not a graphic.

### 2. LinkedIn preparation

Jim's LinkedIn profile will need updating to align with the narrative voice and positioning of the new CV. The timeline page is a natural staging ground for this: it forces a review of every role and period, produces written descriptions in the right voice, and creates a canonical reference that LinkedIn entries can be derived from. Once the timeline page is right, updating LinkedIn becomes a matter of adapting format rather than generating content from scratch.

## Content approach

The timeline content should be authored fresh, not copied verbatim from the archive. The archive is a source of facts (dates, titles, organisations, thesis links) but its prose is in a different voice — it reads as a traditional CV with bullet points. The timeline page should:

- Use the same narrative voice as the rest of the site (first person where appropriate, editorial, precise).
- Keep descriptions concise — one to three sentences per role, not bullet lists.
- Include links where they add value (FT Labs, Oak, HMPO Passport Service, thesis, Google Scholar).
- Cover the Obaith / systems-change period honestly — this is a distinctive part of the story and connects to the current positioning.
- Include Code Science Limited as the consulting vehicle, but keep it brief — the substance is in the client roles.
- Include education with thesis titles (the theremin thesis is a good conversation piece and already referenced in Grounded Practice).

## Content file

A new `content/timeline.content.json` following the same pattern as the other content files. Rough structure:

```json
{
  "meta": { "name": "Jim Cresswell", "page": "timeline", "locale": "en-GB" },
  "entries": [
    {
      "type": "role",
      "organisation": "Oak National Academy",
      "role": "Principal Engineer",
      "start_year": 2022,
      "end_year": "present",
      "summary": "..."
    },
    {
      "type": "education",
      "institution": "University of Portsmouth",
      "degree": "PhD",
      "field": "Astrophysics & Cosmology",
      "start_year": 2005,
      "end_year": 2010,
      "thesis": { "title": "...", "link": "..." },
      "summary": "..."
    }
  ]
}
```

Entries are ordered reverse-chronologically. The `type` field distinguishes roles from education so the page can render them in a single interleaved timeline (the PhD overlaps with the HP Labs role, for example).

## Page and routing

- Route: `app/cv/timeline/page.tsx`
- Sits under the existing `/cv` layout.
- Server component, same pattern as the main CV page.
- Navigation: linked from the main CV page (and possibly the front page) but clearly secondary — the editorial CV is the primary document.
- Metadata and Open Graph tags following the same pattern as the main CV.
- Add to `sitemap.ts`.

## Relationship to CV editorial observations

- **Observation 3** (single employer in Experience) — the timeline page directly addresses this. Readers who want to see the full employer list will find it there.
- **Observation 4** (no concrete technical skills) — timeline role descriptions can naturally mention technologies without a separate skills section.
- **Observation 7** (tilts underused) — the timeline page does not need tilts; it is factual record, not positioning.

## Open questions

- Should the timeline be linked from the main CV page navigation, or only discoverable via the URL and sitemap? Linking it makes it accessible but risks diluting the editorial CV's focus.
- Should the education entries be interleaved chronologically with roles, or separated into their own section at the bottom? Interleaving is more honest (the PhD and HP Labs overlapped) but may feel unusual.
- Should the Obaith entry be presented as a role or as a distinct "research period"? It was a genuine venture but also overlaps with Code Science and early Oak.
- What do we do with the running for the local elections info? See `archive/prior_cv_content.json.bak`.

## Decision

Accepted in principle. Content authoring is the primary work; the technical implementation is straightforward. Begin with the content file, then build the page.

## Files affected

| File                            | Changes                                                    | Status |
| ------------------------------- | ---------------------------------------------------------- | ------ |
| `content/timeline.content.json` | New content file — career history in narrative voice       | Open   |
| `app/cv/timeline/page.tsx`      | New server component rendering the timeline                | Open   |
| `app/sitemap.ts`                | Add `/cv/timeline` route                                   | Open   |
| E2E tests                       | New journey test for timeline page                         | Open   |
| `content/cv.content.json`       | Possibly add link to timeline from editorial CV navigation | Open   |
