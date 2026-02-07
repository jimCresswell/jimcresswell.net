# Front Page Content

Rework the front page from its current placeholder state into Jim's personal front page with a _slight_ project/professional lean because Jim likes projects and impact.

## Status: Content creation (Step 1 — external)

The editorial direction is agreed. The next step is to create the actual content, which will be done outside this codebase and brought back as a JSON file.

---

## Who Jim is (context for content creation)

Jim Cresswell. Personal site: jimcresswell.net. Based in the UK.

### Professional background

This is less important the passions, interests, motivations, personality. Additional content can be seen at <https://jimcresswell.github.io/cv> and <https://jimcresswell.net/cv>.

- **Academic**: PhD in Astrophysics & Cosmology (University of Portsmouth). MSc Cosmology (Sussex). MPhys Physics (Bath). Published research on cosmological anomalies and large-scale structure. Undergraduate thesis on the design and construction of a Theremin.
- **Career path**: Physics research → HP Labs → British Airways → Financial Times Labs (contributed to the award-winning FT Web App) → HMPO (UK Passport Service) → Oak National Academy (2019–present).
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
- Ran in a local election in Hackney, for councillor for green party, came second to Labour.
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

- CV: https://jimcresswell.net/cv/
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

4. **Navigation links in the hero area**: CV, GitHub, Google Scholar. These are "see my work" links. LinkedIn, email, and other links remain in the footer only.

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

## Output specification

The deliverable is the text content for the front page, in the following structure. This will be placed into `content/frontpage.content.json` in the codebase.

### Required JSON structure

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
    "summary": [
      "First paragraph text here.",
      "Second paragraph text here.",
      "Optional third paragraph."
    ]
  },
  "primary_navigation": [
    { "label": "...", "href": "/cv/" },
    { "label": "...", "href": "https://github.com/jimCresswell" },
    { "label": "...", "href": "https://scholar.google.co.uk/citations?user=7yf2vEEAAAAJ&hl=en" }
  ],
  "interests": [
    {
      "title": "Short title",
      "description": "One or two sentences."
    }
  ],
  "links": {
    "linkedin": "https://www.linkedin.com/in/jimcresswell",
    "github": "https://github.com/jimCresswell",
    "google_scholar": "https://scholar.google.co.uk/citations?user=7yf2vEEAAAAJ&hl=en"
  },
  "machine_readable_ref": {
    "shared_json_ld": {
      "file": "content/jsonld.json"
    }
  }
}
```

### Content to create

1. **`hero.summary`** — 2–3 short paragraphs. Personal, direct, warm. Give a flavour of who Jim is: background, what he's interested in, how he thinks. Not a capability pitch. Not a CV summary. Should name concrete things (domains, interests, projects) rather than staying abstract.

2. **`primary_navigation`** — 3 links: CV, GitHub, Google Scholar. The labels should be clear and natural (e.g. "CV", "GitHub", "Google Scholar" — or something warmer if it fits the tone).

3. **`interests`** — 2–5 items, each with a short `title` and a 1–2 sentence `description`. These are interests, curiosities, and things Jim cares about — not achievements or capability statements. They should cover the breadth of who Jim is: professional interests (AI, the open web, open standards, public data, systems thinking), interests (ecosystems,ecology, food growing, understanding and building systems).

---

## What happens after the content is created and handed back to Cursor.

Once Jim provides the content JSON, the following technical changes are needed in the codebase:

1. **Replace** `content/frontpage.content.json` with the new content.
2. **Update** `app/page.tsx`:
   - Remove tagline rendering (the `<p>` with `text-accent` class).
   - Rename `content.highlights` references to `content.interests`.
   - Update the visually-hidden section heading from "Highlights" to match the new section concept.
   - Adjust navigation rendering for 3 links (inline with separators; external links get `target="_blank" rel="noopener noreferrer"`).
3. **Update** `e2e/journeys/home-to-cv.e2e-ui.test.ts`:
   - Remove tagline assertion.
   - Update `highlights` loop to use `interests` key.
   - Update primary navigation assertion for new label.
4. **Update** `docs/project/user-stories.md`:
   - US-01 may need broadening — the front page now serves a wider purpose than "decide whether to view his CV."
5. **Verify**: `pnpm check` and `pnpm test:e2e` pass. Visual check on dev server.

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
