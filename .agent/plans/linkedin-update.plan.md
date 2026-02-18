# LinkedIn Profile Update

Update Jim's LinkedIn profile to be consistent with the editorial CV, using the career history archive as the canonical factual source and the CV's editorial voice as the stylistic reference.

## Status: Planning

## How to use this plan

This is a collaborative editorial session. Present options to Jim and iterate. No code changes — Jim applies the final content to LinkedIn manually.

---

## Automation ruled out

Three automation approaches were investigated and ruled out:

1. **LinkedIn Profile Edit API** — The [Profile Edit API](https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/profile-edit-api) supports PATCH operations on all profile sections (positions, educations, summary, headline, skills, publications). However, it requires the `w_compliance` permission, which is [closed to new developers](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access) ("private permission — access is granted to select developers"). The only self-serve write permission is `w_member_social` (posting to the feed), which does not cover profile editing.

2. **Browser automation** — LinkedIn actively detects and blocks automated browser access (bot fingerprinting, CAPTCHAs, session rate-limiting). Accounts that trip detection can be restricted or banned. Their Terms of Service explicitly prohibit automated access. Not worth the risk on a real profile.

3. **Open self-serve APIs** — The open permissions (`profile`, `email`, `w_member_social`) only support reading basic profile info (name, headline, photo) and posting to the feed. No profile editing capability.

The updates will be applied manually by Jim using copy-paste-ready content prepared in this plan.

---

## Phase 1: Read source material

**Goal:** Understand the full career history, the editorial voice, and the current LinkedIn profile before drafting anything.

**Steps:**

1. Read `.agent/directives/AGENT.md` and `.agent/directives/rules.md` for project conventions and voice.
2. Read `.agent/directives/editorial-guidance.md` for Jim's editorial identity — tone, framing rules, "physics as silent ballast" strategy.
3. Read `content/cv.content.json` for the current editorial positioning. LinkedIn entries must be consistent with this voice.
4. Read `archive/prior_cv_content.json.bak` for the full chronological career history and prior editorial framing.
5. Read `.agent/temp/linkedin.pdf` for the current LinkedIn profile content (gitignored — may not be present in all environments).
6. Browse `.agent/temp/old-cv-website/` for Jim's previous CV website (gitignored — may not be present in all environments).

**Acceptance criteria:**

- All six sources have been read.
- A brief summary of the key differences between the editorial CV positioning and the current LinkedIn profile is prepared for discussion with Jim.

---

### Phase 2: Resolve open questions with Jim

**Goal:** Get Jim's decisions on structural and editorial questions before drafting any content. Present options — do not propose final wording without Jim's input.

**Questions to resolve:**

1. **Headline and summary:** Should the LinkedIn headline and About section align closely with the editorial CV's positioning paragraphs, or be adapted for LinkedIn's different audience and search behaviour? LinkedIn headlines are keyword-searched by recruiters. The editorial CV deliberately avoids buzzwords. These goals may conflict.

2. **Oak National Academy roles:** The archive shows three roles (Senior Developer, Head of DevOps and Quality, Principal Engineer). Should these appear as:
   - One entry with progression narrative (common LinkedIn pattern for internal promotions)?
   - Three separate entries (more explicit for recruiters scanning for specific titles)?
   - Two entries (consulting period collapsed, permanent role separate)?

3. **Obaith:** Should this appear as a distinct role, a research period, or be folded into the Code Science consulting narrative? It was a genuine venture but overlaps with Code Science and early Oak.

4. **Short contracts:** The career history includes a six-week academic consultancy (Middle East), a month at We Predict, and a few months at Medicspot. Include on LinkedIn? They add breadth (startup, international) but may clutter a profile that benefits from clarity.

5. **Local elections:** The archive references standing for local elections. Include on LinkedIn (e.g. Volunteering section)?

6. **Description length:** LinkedIn role descriptions — one to three sentences (editorial, concise) or fuller paragraph-with-bullets (recruiter-friendly, keyword-rich)? The editorial voice favours the former but LinkedIn SEO favours the latter.

7. **Skills section:** Should specific technologies be listed as LinkedIn Skills? The editorial CV deliberately omits technical skill lists (see editorial-guidance.md). LinkedIn has a different purpose.

**Acceptance criteria:**

- Jim has made a decision on each of the seven questions.
- Decisions are recorded in this plan or in a working document.

---

### Phase 3: Draft headline and About section

**Goal:** Write the LinkedIn headline and About section in Jim's editorial voice, incorporating the decisions from Phase A2.

**Steps:**

1. Draft 2-3 headline options. Each should be under 220 characters. Consider the tension between editorial voice (precise, no buzzwords) and LinkedIn search discoverability.
2. Draft 2 options for the About section. Use the editorial CV's positioning paragraphs as a starting point but adapt for LinkedIn's audience and format. The About section supports up to ~2,600 characters.
3. Present to Jim and iterate until finalised.

**Acceptance criteria:**

- One headline and one About section are finalised and approved by Jim.
- They are consistent with the editorial voice in `editorial-guidance.md`.
- No contradiction with the editorial CV's positioning.

---

### Phase 4: Draft role descriptions

**Goal:** Write LinkedIn descriptions for each career entry, using the archive as the factual source and the editorial voice as the guide.

**Career entries to draft (from archive):**

| Period              | Role                                    | Organisation              |
| ------------------- | --------------------------------------- | ------------------------- |
| Jun 2022 - present  | Principal Engineer                      | Oak National Academy      |
| Jan 2021 - Jun 2022 | Head of DevOps and Quality (Consulting) | Oak National Academy      |
| Aug 2020 - Dec 2020 | Senior Developer (Consulting)           | Oak National Academy      |
| Feb 2018 - present  | Managing Director                       | Code Science Limited      |
| Jan 2018 - Dec 2020 | Founder                                 | Obaith                    |
| Feb 2017 - Dec 2017 | Programme QA Consultant                 | Home Office (HMPO)        |
| Mar 2015 - Dec 2015 | QA Automation Consultant                | British Airways           |
| Aug 2011 - Jul 2014 | Senior Developer                        | FT Labs (Financial Times) |
| Apr 2009 - Nov 2010 | Systems Engineer                        | HP Labs (for N-able)      |

Plus education entries at Portsmouth, Sussex, and Bath (with thesis titles and links where available).

**Steps:**

1. For each role, draft a 1-3 sentence description. Use the archive for facts. Use the editorial CV and editorial-guidance.md for voice. Include links where they add value (FT Labs, Oak, HMPO Passport, thesis, Google Scholar).
2. If Phase A2 decided on consolidated Oak entries, draft accordingly.
3. If Phase A2 decided to include short contracts, draft those too.
4. Draft education entries with thesis titles.
5. Present all drafts to Jim as a batch and iterate.

**Acceptance criteria:**

- Every career entry has a finalised description approved by Jim.
- Education entries are complete with thesis titles.
- Voice is consistent with the editorial CV.
- Links are included where agreed.

---

### Phase 5: Prepare final LinkedIn update document

**Goal:** Produce a single document that Jim can use to update LinkedIn, with all content in copy-paste-ready form.

**Steps:**

1. Compile all finalised content into a single markdown document in `.agent/temp/linkedin-update-content.md` (gitignored).
2. Organise by LinkedIn section: Headline, About, Experience (each role), Education, Skills (if agreed in Phase A2).
3. Include any links as full URLs (LinkedIn supports hyperlinks in descriptions).
4. Mark the plan as complete.

**Acceptance criteria:**

- Document exists at `.agent/temp/linkedin-update-content.md`.
- Every section is copy-paste ready.
- Jim can update LinkedIn in a single session using this document.

---

## Relationship to other plans

- [cv-editorial-improvements.plan.md](cv-editorial-improvements.plan.md) — The editorial CV positioning paragraphs are the voice reference for LinkedIn content. LinkedIn entries must not contradict them.
- [meta-seo-content-audit.plan.md](complete/meta-seo-content-audit.plan.md) — Complete. The CV's `meta.summary`, `KNOWS_ABOUT`, `OCCUPATION`, and capabilities have been editorially updated since this plan was written. Phase 1 should read the current `cv.content.json` and `lib/jsonld.ts` to pick up these changes.
- [personal-knowledge-graph.plan.md](personal-knowledge-graph.plan.md) — The PKG plan will create a full entity model including all role history with dates. If the PKG plan runs first, the LinkedIn plan can source role data from the entity model rather than the archive. Either ordering works.

## Decision

Accepted as a LinkedIn preparation and API investigation plan. Track A produces LinkedIn content via collaborative editorial session. Track B investigates and possibly builds tooling. The editorial CV at `/cv` remains unchanged.
