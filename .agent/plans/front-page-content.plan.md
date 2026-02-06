# Front Page Content

Rework the front page from its current placeholder state into Jim's professional front page — the primary surface for his professional identity, covering work, projects, and positioning broadly, not just the CV.

## Status: Planning

## Prerequisites

Before implementing this plan, read and internalise:

1. [`.agent/directives/AGENT.md`](../directives/AGENT.md) — Project context, rules, commands
2. [`.agent/directives/rules.md`](../directives/rules.md) — Core development principles
3. [`docs/project/user-stories.md`](../../docs/project/user-stories.md) — US-01 defines the front page user story
4. [`docs/project/requirements.md`](../../docs/project/requirements.md) — REQ-01 (accessibility), REQ-06 (content integrity)
5. [Content review plan](content-review.plan.md) — Parent plan with broader content observations (background context only — this plan is self-contained; the other observations are out of scope here)

## Context

### What the front page is

The front page is not a CV landing page. It is Jim's **professional front page** at **jimcresswell.net** — the primary surface for his professional identity as a whole. The CV is one thing it links to, but the page also needs to represent his broader work, projects, current thinking, and positioning. It is the canonical URL he shares on LinkedIn, in emails, and in conversations.

Most visitors will arrive here — from a shared link, a search result, or a profile. It needs to answer three questions quickly:

1. **Who is this?** — Name and professional identity.
2. **Why should I care?** — What makes this person relevant to me, right now.
3. **What should I do next?** — Clear paths forward (not just one).

### What the front page currently does

The current front page (`content/frontpage.content.json`) has:

- **Hero**: Name, tagline, two summary paragraphs.
- **Primary navigation**: One link — "Here is my CV".
- **Highlights**: Two thematic cards ("Exploration → judgement → action", "Public value, open infrastructure").
- **Footer links**: LinkedIn, GitHub, Google Scholar.

It answers question 1 (who) reasonably well. It partially answers question 2 (the summary paragraphs explain what Jim does in abstract terms). It barely answers question 3 (one link, passively labelled, and only to the CV — nothing else).

The current page treats the front page as a thin gateway to the CV. But it should stand on its own as a professional presence, even for visitors who never click through to the CV.

### What the front page should do

The front page should:

- **Establish professional identity quickly** — who Jim is, what he works on, what he cares about.
- **Give a visitor enough signal in 10 seconds** to decide whether to engage further — whether that means reading the CV, following a project link, or reaching out.
- **Offer multiple paths forward** — the CV is one destination, but not the only one. Projects, contact, writing, or external profiles may also be relevant depending on the visitor.
- **Represent the whole person** — not just "I am looking for a job" but a broader positioning that works for peers, collaborators, potential partners, and anyone else who encounters the URL.
- **Not duplicate the CV** — the front page is a summary and invitation, not a repeat of what the CV already says.

## Current content (for reference)

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

## Current layout (for reference)

The page component is `app/page.tsx`. The layout is simple and content-driven:

1. Site header (shared component with nav and theme toggle).
2. Hero section: `<h1>` name, tagline as accent text, summary paragraphs in serif, primary navigation link.
3. Highlights section: visually hidden `<h2>`, then highlight cards (title + description).
4. Site footer (shared component with external links).

All text comes from `content/frontpage.content.json`. Components render content verbatim (REQ-06).

## Problems to solve

### P1: The page is framed as a CV gateway, not a professional presence

The entire structure — one CTA labelled "Here is my CV", no other navigation — positions the front page as an anteroom to the CV. But jimcresswell.net is Jim's professional front page. It should work as a destination in its own right, not just a doorway to one document.

A peer following the link from a conversation, a collaborator checking Jim's current focus, or someone from a conference talk should all find something useful without necessarily clicking through to the CV.

### P2: No signal of intent or current focus

The page does not indicate what Jim is working on now, what he is interested in, or what kind of engagement he is open to. A visitor scanning quickly gets "here is a person who thinks about complex systems" but no signal of direction, currency, or availability.

### P3: Highlights are thematic, not evidential

The two highlights describe how Jim thinks ("Exploration → judgement → action") and what he is interested in ("Public value, open infrastructure"). They do not tell the reader what he has done, what he is working on, or what makes him credible. They are philosophy, not evidence or context.

A visitor scanning in 10 seconds needs at least one concrete anchor — something that says "this person has done real things" or "this is what he is focused on right now."

### P4: Only one path forward

The primary navigation has a single link: "Here is my CV." There is no way to reach out, see projects, or learn more about specific areas of work. The footer has LinkedIn/GitHub/Scholar links, but these are tucked away rather than presented as first-class navigation options.

### P5: The summary could be sharper

The two summary paragraphs are well-written but abstract. Neither mentions a specific domain, employer, or achievement. Compare with the CV positioning, which at least names "physics, software engineering, and digital-first public services." The front page summary is more generic than the CV it leads to.

## Design constraints

- **Content-driven**: All text must come from `content/frontpage.content.json`. No hardcoded text in components.
- **Accessible**: WCAG 2.2 AA. Semantic headings, landmark regions, sufficient contrast.
- **Editorial aesthetic**: No icons, charts, or illustrations. Text-only, typographic.
- **Responsive**: Must work on mobile (320px), tablet, and desktop.
- **E2E tested**: `e2e/journeys/home-to-cv.e2e-ui.test.ts` asserts on hero name, tagline, summary paragraphs, highlight titles, and primary navigation. Changes to content will require updating this test.
- **Shared headline**: The tagline in `frontpage.content.json` must stay consistent with `cv.content.json` `meta.headline`. Currently they are identical strings. If the headline changes (see content-review.plan.md Observation 1), both files must be updated.

## Proposed approach

This is a **content-first** change. Start with the content JSON, then adjust the component if needed, then update the E2E test.

### Step 1: Decide what the front page needs to say (BLOCKING — requires Jim's input)

This is a content and positioning decision, not a technical one. **Do not proceed to Step 2 without Jim's answers to the open questions below.** Present the questions, discuss, and reach decisions before writing any content or code.

Jim to provide direction on:

- What the summary should convey (current focus, professional identity, openness to engagement).
- What the highlights or content sections should contain (evidence, current work, themes, or a mix).
- What paths forward should be offered (CV, contact, projects, external profiles).

The current content is a starting point, not a constraint — it can be restructured or rewritten entirely.

### Step 2: Revise the content JSON

Update `content/frontpage.content.json` based on the decisions in Step 1. This may include:

- Rewriting the summary paragraphs to be more concrete and action-oriented.
- Replacing or expanding the highlights section — it could become "current focus", "recent work", "areas of interest", or something else entirely.
- Expanding `primary_navigation` to offer multiple paths forward (CV, contact, projects, etc.).
- Potentially adding new content sections if the JSON shape needs to grow.

### Step 3: Update the component (if needed)

The current `app/page.tsx` layout may need adjustment if:

- The number or nature of content sections changes.
- New navigation items are added.
- The summary structure changes (e.g. from two paragraphs to one, or to a different format).
- New sections are added (e.g. "current focus", "projects", "get in touch").

If the JSON shape stays the same (array of summary paragraphs, array of highlights, array of navigation items), no component changes are needed — the existing component renders whatever the JSON provides.

### Step 4: Update the E2E test

`e2e/journeys/home-to-cv.e2e-ui.test.ts` asserts on:

- `content.hero.name` as the `<h1>`.
- `content.hero.tagline` as visible text.
- Each `content.hero.summary` paragraph as visible text.
- Each `content.highlights` title as visible text.
- `content.primary_navigation[0].label` as a link that navigates to `/cv`.

If the content changes, the test automatically picks up the new values (it imports the JSON). But if the structure changes (e.g. highlights removed, new sections added, navigation items changed), the test assertions must be updated to match. The user story (US-01) may also need revisiting if the front page scope expands beyond "decide whether to view the CV."

### Step 5: Verify

- `pnpm check` passes.
- `pnpm test:e2e` passes.
- Visual check on the dev server.
- Deploy and verify on production.

## Open questions (for Jim)

1. **Who is the front page for?** It needs to work for multiple audiences — hiring managers, peers, collaborators, people from conferences, anyone who encounters the URL. But is there a primary audience, or should it genuinely serve all of these equally?
2. **What should the front page say about you right now?** Not just role/title, but: what are you working on, what are you interested in, what kind of engagement are you open to? The page should have some sense of currency.
3. **What paths forward should it offer?** The CV is one. What else? Contact, projects, GitHub, writing, specific areas of work? Should external profiles (LinkedIn, Scholar) be promoted from the footer to primary navigation?
4. **Should the highlights section survive in its current form?** It could become "current focus areas", "recent work", "things I care about", or be replaced with something entirely different. What would be most useful to a visitor?
5. **How specific should the summary be?** Should it name Oak, specific technologies, specific domains — or stay at the level of "what kind of problems I work on"?
6. **Is the tagline changing?** If so, the front page and CV headline must be updated together (see content-review.plan.md Observation 1).
7. **Is there content that doesn't exist yet?** E.g. a "current focus" blurb, a projects section, a short "about" paragraph that goes beyond the professional summary. If the front page is the professional presence, it may need content that the CV doesn't have.

## Files affected

| File                                     | Changes                                                       |
| ---------------------------------------- | ------------------------------------------------------------- |
| `content/frontpage.content.json`         | Summary, highlights, navigation — likely significant rewrite  |
| `app/page.tsx`                           | Layout changes if new sections or navigation structure added  |
| `e2e/journeys/home-to-cv.e2e-ui.test.ts` | Update assertions to match new content and structure          |
| `docs/project/user-stories.md`           | US-01 may need updating if front page scope expands beyond CV |
| `content/cv.content.json`                | Only if tagline changes (must stay in sync)                   |
| `content/cv.og.json`                     | Only if tagline changes                                       |
| `content/jsonld.json`                    | Only if tagline changes                                       |
