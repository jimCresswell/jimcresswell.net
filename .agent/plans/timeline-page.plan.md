# LinkedIn Career Narrative

Prepare a chronological career narrative in Jim's editorial voice, for use as the canonical reference when updating LinkedIn and answering "what has Jim done, and when?"

## Status: Planning

## How to use this plan

This is a collaborative editorial session. The career history below is factual; the narrative voice and framing decisions require Jim's input. The workflow is:

1. Read `.agent/directives/AGENT.md` and `.agent/directives/rules.md` to understand project conventions and voice.
2. Read `archive/prior_cv_content.json.bak` for the full career history and prior editorial framing.
3. Read `content/cv.content.json` to understand the current editorial positioning — LinkedIn entries should be consistent with this voice, not contradict it.
4. Read `.agent/temp/linkedin.pdf` for the current LinkedIn profile content (gitignored — may not be present in all environments).
5. Browse `.agent/temp/old-cv-website/` for Jim's previous CV website (gitignored — may not be present in all environments). This contains the full prior presentation including role descriptions and education details.
6. Walk through the open questions with Jim, presenting options and getting decisions. **Do not propose final wording without Jim's input — present options and iterate.**
7. Draft role descriptions in a shared document or directly in this plan.
8. Once finalised, Jim updates LinkedIn manually. No code changes are needed.

## Context

The editorial CV at `/cv` is a thematic, narrative document — it deliberately groups experience by arc rather than chronology, with only Oak National Academy as a standalone entry. This is an intentional positioning choice and works well for its purpose.

However, there is a significant body of career history that the editorial CV elides or compresses. The archive (`archive/prior_cv_content.json.bak`) contains a full chronological record. LinkedIn is the natural home for this chronological view — it is where recruiters and hiring managers look for career history, dates, and employer names.

This plan was originally scoped as a `/cv/timeline` page on the site. That was reconsidered: building a chronological page would duplicate what LinkedIn does well, create ongoing maintenance burden, and dilute the editorial CV's deliberate thematic structure. The valuable work in this plan — career history, narrative voice guidance, open questions — serves better as a preparation document for LinkedIn than as a shipped page.

The editorial improvements to the CV itself are tracked separately in [cv-editorial-improvements.plan.md](cv-editorial-improvements.plan.md).

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

### Career context not in the archive

Jim's career includes several short contracts not captured in the archive: a six-week academic consultancy in the Middle East, a month-long consultancy at a startup called We Predict, and a few months at a startup called Medicspot. These may or may not be worth including on LinkedIn — they add breadth (startup, international) but risk cluttering a profile that benefits from clarity.

The original CV website is at <https://jimcresswell.github.io/cv> and a full local copy is in `.agent/temp/old-cv-website/` (gitignored). The current LinkedIn profile is exported as `.agent/temp/linkedin.pdf` (gitignored).

## Content approach

The LinkedIn descriptions should be authored fresh, not copied verbatim from the archive. The archive is a source of facts (dates, titles, organisations, thesis links) but its prose is in a different voice — it reads as a traditional CV with bullet points. LinkedIn entries should:

- Use the same narrative voice as the rest of Jim's professional presence (first person where appropriate, editorial, precise).
- Keep descriptions concise — one to three sentences per role, not bullet lists.
- Include links where they add value (FT Labs, Oak, HMPO Passport Service, thesis, Google Scholar).
- Cover the Obaith / systems-change period honestly — this is a distinctive part of the story and connects to the current positioning.
- Include Code Science Limited as the consulting vehicle, but keep it brief — the substance is in the client roles.
- Include education with thesis titles (the theremin thesis is a good conversation piece and already referenced in Grounded Practice on the CV).

## Open questions

- Should the Obaith entry be presented as a role or as a distinct "research period"? It was a genuine venture but also overlaps with Code Science and early Oak.
- How should the three Oak roles (Senior Developer → Head of DevOps → Principal Engineer) be presented? As one entry with progression, or three separate entries? LinkedIn supports both patterns.
- Should the short contracts (Middle East, We Predict, Medicspot) appear on LinkedIn? They add breadth but the profile may be stronger without them.
- What do we do with the running for local elections info? See `archive/prior_cv_content.json.bak`.
- Should the LinkedIn headline and summary align with the editorial CV's headline, or be adapted for LinkedIn's different audience and search behaviour?

## Relationship to CV editorial observations

- **Observation 3** (single employer in Experience) — LinkedIn directly addresses this concern. Readers who want employer names and dates will find them there, freeing the editorial CV to stay thematic.
- **Observation 4** (no concrete technical skills) — LinkedIn role descriptions can naturally mention technologies.
- **Observation 7** (tilts underused) — LinkedIn does not need tilts; it is factual record, not positioning.

## Decision

Accepted as a LinkedIn preparation document. No code changes — this plan produces LinkedIn content, not site features. The editorial CV at `/cv` remains the sole career page on the site.
