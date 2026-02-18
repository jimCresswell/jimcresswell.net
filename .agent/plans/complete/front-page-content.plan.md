# Front Page Content

Rework the front page from its current placeholder state into Jim's personal front page with a _slight_ project/professional lean because Jim likes projects and impact.

## Status: Complete

Content authored, implemented, tested, and deployed. All quality gates pass (57 unit/integration tests, 31 E2E tests including WCAG 2.2 AA accessibility). Committed as `d3166a9`.

---

## Who Jim is (context for content creation)

Jim Cresswell. Personal site: jimcresswell.net. Based in the UK.

### Professional background

This is less important the passions, interests, motivations, personality. Additional content can be seen at <https://jimcresswell.github.io/cv> and <https://www.jimcresswell.net/cv>.

- **Academic**: PhD in Astrophysics & Cosmology (University of Portsmouth). MSc Cosmology (Sussex). MPhys Physics (Bath). Published research on cosmological anomalies and large-scale structure. Undergraduate thesis on the design and construction of a Theremin.
- **Career path**: Physics research → HP Labs → British Airways → Financial Times Labs (contributed to the award-winning FT Web App) → HMPO (UK Passport Service) → Oak National Academy (2020–present).
- **Current role**: At Oak National Academy, leads on complex, high-impact problems in a live national education public service. Recent focus: treating Oak's openly licensed curriculum data as public digital infrastructure, exposed through SDKs and AI-first machine-accessible interfaces (MCP), so trusted public data can reach people where they already are.
- **Technical**: Hands-on with modern PaaS/serverless web stacks (not Docker/containers — more Vercel, serverless, cloud-native). Data-fluent, though not a practising data scientist. Built this site (Next.js 16, React 19, TypeScript, Tailwind CSS 4, deployed on Vercel).
- **Positioning (from CV)**: "I work on high-impact, long-term problems in early or unstructured contexts where neither the problem nor the path forward is yet clear. I lead exploratory work with a clear purpose: to surface the underlying structure of complex systems so meaningful decisions can be made."
- **CV capabilities**: Zero-to-one leadership; designing conditions for responsible AI use; judgement on irreversible/high-cost trade-offs; enabling ecosystems rather than centralising solutions.

### Passions

- The joy and bounty of growing food. Keeps an allotment. Breeds runner beans and sunflowers, selecting for resilience and genetic diversity.
- Interested in ecology-informed food growing and how perennial systems shift resilience and yield stability.
- Previously volunteered as a market gardener with Growing Communities (organic local-food initiative).
- Previously researched and developed Reforest Now, a pitch about applying small changes to systemic tipping points for climate, ecology, and social inequality. Did not develop it further, but still likes the idea.
- Similar, but for Obaith. He has vision and passion, but he hasn't found the right project to bring to life yet.
- Ran for a council seat in Hackney.
- Interested in systems understanding more broadly. He trained as a physicist for ten years, and has a PhD in cosmology, a lot of that was about defining problems by generalising understanding from specifics to underlying foundational systems, it's not just technique, it's a love of comprehension.

### Old landing page (prior to this site)

The previous front page at <https://jimcresswell.github.io/> read:

> My name is Jim Cresswell. I am an entrepreneur trying to apply small changes to potential systemic tipping points in order to bring about big differences in climate breakdown, ecological collapse and social inequality. My current project is Reforest Now.
>
> I have a background in technology, science and product creation and delivery. Here is my CV and here I am on Twitter, LinkedIn and GitHub.
>
> Here are my published papers from my previous life as a cosmologist.

Note the tone: personal, direct, broad interests, not a CV pitch. The new front page should recover some of that directness and breadth and fun (screenshot the page at different widths, it has comedy css)

### Links

- CV: https://www.jimcresswell.net/cv/
- GitHub: https://github.com/jimCresswell
- Google Scholar: https://scholar.google.co.uk/citations?user=7yf2vEEAAAAJ&hl=en
- LinkedIn: https://www.linkedin.com/in/jimcresswell
- Spherical Horse in a Vacuum (personal/fun): https://www.sphericalhorseinavacuum.com/

---

## What the front page is

The front page is not a CV landing page. It is Jim's **personal front page** at **jimcresswell.net** — the primary surface for his personal impact identity as a whole. The CV is one thing it links to, but the page also needs to represent his broader work, projects, interests, passions, and positioning. It is the canonical URL he shares on LinkedIn, in emails, and in conversations.

Most visitors will arrive here — from a shared link, a search result, or a profile. It needs to answer three questions quickly:

1. **Who is this?** — Name and personal impact identity.
2. **Why should I care?** — What makes this person relevant to me, right now.
3. **What should I do next?** — Clear paths forward (not just the CV for professional information, but science, coding, fun projects, growing food, ecology thinking, running in a local election, etc.).

### What the front page should do

- **Establish personal impact identity quickly** — who Jim is, what he works on, what he cares about.
- **Give a visitor enough signal in 10 seconds** to decide whether to engage further — whether that means reading the CV, following a project link, or reaching out.
- **Offer multiple paths forward** — the CV is one destination, but not the only one.
- **Represent the whole person** — not just "I am looking for a job" but a broader presence that works for peers, collaborators, potential partners, and anyone else who encounters the URL.
- **Not duplicate the CV** — the front page is a summary and invitation, not a repeat of what the CV already says.

### What the front page is NOT

- It is not a CV summary or a lighter version of the CV.
- It is not a capability pitch or a list of achievements.
- It is not evidence-based — unlike the CV, it does not need to prove anything. It communicates interests, passions, and flavour.
- It is not just for hiring managers — it serves anyone who encounters the URL.

---

## Decisions made

These decisions are agreed and should not be revisited.

1. **No tagline on the front page.** The tagline ("Exploratory AI Application leader...") belongs with the CV only. The front page hero is: name, then summary text. The CV tagline is unchanged.

2. **The front page is personal.** It gives visitors a flavour of who Jim is and what he cares about, can communicate interests and passions without evidence, and has an impact and interest lean because that is who he is.

3. **Content sections are interests and curiosities**, not job responsibilities or capability statements. Themes Jim is thinking about right now, framed personally and directly.

4. **Inline links in the narrative**: CV, GitHub, Google Scholar, Oak, and the research archive are linked naturally within the prose. No separate navigation section — the text is the navigation. The footer provides LinkedIn, GitHub, Google Scholar, and Shiv as secondary links.

5. **Tone**: Personal, direct, warm. Not a pitch. Not corporate. Think of the old landing page tone — "I am a person who cares about these things" — but updated and richer.

---

## Problems with the current content

### P1: Framed as a CV gateway, not a personal presence

One CTA ("Here is my CV"), no other navigation. The page is an anteroom to the CV rather than a destination.

### P2: No signal of current focus or interests

No indication of what Jim is working on, interested in, or thinking about. A visitor gets "complex systems thinker" but no colour, no direction, no currency.

### P3: Content sections are abstract philosophy

The two highlights ("Exploration → judgement → action", "Public value, open infrastructure") are how Jim thinks, not what he cares about or works on. They are philosophy, not personality.

### P4: Only one path forward

Single link to the CV. No way to see code, research, projects, or anything else.

### P5: Summary is more abstract than the CV

The front page summary doesn't name a single domain, employer, or concrete interest. The CV it leads to is actually more specific.

---

## Design constraints

These constrain how the content will be used on the site. The content creator should be aware of them.

- **Text-only, typographic aesthetic**: No icons, charts, or illustrations. The content must work as pure text.
- **Short and scannable**: A visitor should get the core message in 10 seconds.
- **British English**: British spelling, grammar, and conventions throughout.
- **First person**: Written in Jim's voice.
- **No duplication with CV**: The front page stands alone. It should not repeat or summarise the CV positioning text.

---

## What was delivered

The content is a continuous 8-paragraph personal narrative authored by Jim (`landing-content-draft.md`), placed into `content/frontpage.content.json`. The narrative weaves inline markdown links to key destinations — Scholar, GitHub, the research archive, Oak, and `/cv/` — so no separate navigation section is needed.

### Final JSON structure

```json
{
  "meta": {
    "site_section": "home",
    "page": "front_page",
    "title": "Jim Cresswell",
    "locale": "en-GB"
  },
  "hero": {
    "name": "Jim Cresswell",
    "summary": ["paragraph 1", "...", "paragraph 8"]
  },
  "links": { "linkedin": "...", "github": "...", "google_scholar": "..." },
  "machine_readable_ref": { "shared_json_ld": { "file": "content/jsonld.json" } }
}
```

Key differences from the original specification:

- **`primary_navigation` removed** — inline links in the prose replace the separate nav section. The footer provides secondary links.
- **`interests` removed** — the narrative covers interests fluidly rather than as discrete cards.
- **`hero.summary` is 8 paragraphs**, not 2–3. The content is a personal essay, not a summary.
- **Inline markdown** — text contains `[link text](url)` and `_emphasis_` syntax, rendered by the `parseMarkdownLinks` parser which uses `<Link>` for relative URLs and `<a target="_blank">` for external ones.

---

## Implementation completed

All technical changes have been made and verified:

1. **`content/frontpage.content.json`** — replaced with the narrative content and inline links.
2. **`app/page.tsx`** — simplified to ~20 lines using the `Prose` component. Tagline, highlights, and nav section all removed.
3. **`lib/parse-markdown-links.tsx`** — extended to handle relative links (`<Link>`) and `_emphasis_` (`<em>`). CSS class renamed `cv-ref-link` → `inline-link`.
4. **`lib/strip-inline-markdown.ts`** — new utility to strip markdown for plain-text contexts (meta description in `app/layout.tsx`).
5. **`e2e/journeys/home-to-cv.e2e-ui.test.ts`** — rewritten: verifies narrative content and the inline CV link journey.
6. **`docs/project/user-stories.md`** — US-01 broadened from "decide whether to view his CV" to "decide whether to engage further."
7. **`components/site-footer.tsx`** — copyright text opacity fixed (`opacity-60` → `opacity-65`) to meet WCAG 2.2 AA contrast requirements.
8. **All quality gates pass**: format, lint, type-check, 57 unit/integration tests, 31 E2E tests (including accessibility).

---

## Reference

### Current content (being replaced)

```json
{
  "hero": {
    "name": "Jim Cresswell",
    "tagline": "Exploratory AI Application leader · Zero‑to‑One Systems · Digital‑First Public Services",
    "summary": [
      "I lead exploratory work in early, unstructured problem spaces where the path forward is not yet clear, and critical judgement matters.",
      "My focus is on identifying leverage in large‑scale systems and shaping conditions for meaningful, positive change — often by enabling others through open data and AI‑enabled ecosystems."
    ]
  },
  "primary_navigation": [{ "label": "Here is my CV", "href": "/cv/" }],
  "highlights": [
    {
      "title": "Exploration → judgement → action",
      "description": "Exploration and discovery feed critical analysis, enabling clear judgement and, when appropriate, decisive application."
    },
    {
      "title": "Public value, open infrastructure",
      "description": "I'm interested in making high-quality public resources discoverable and usable where people already are, including through modern AI interfaces."
    }
  ]
}
```

### Old landing page (jimcresswell.github.io)

> My name is Jim Cresswell. I am an entrepreneur trying to apply small changes to potential systemic tipping points in order to bring about big differences in climate breakdown, ecological collapse and social inequality. My current project is Reforest Now.
>
> I have a background in technology, science and product creation and delivery. Here is my CV and here I am on Twitter, LinkedIn and GitHub.
>
> Here are my published papers from my previous life as a cosmologist.
