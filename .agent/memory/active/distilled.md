---
fitness_line_target: 200
fitness_line_limit: 260
fitness_char_limit: 12000
fitness_line_length: 100
---

# Distilled Learnings

Quick-reference entries that are NOT in permanent docs. Read before every session. See
`docs/architecture/README.md` for full architecture coverage.

---

## Workspace Quick Reference

- Contact email: <contact@jimcresswell.net>; pronouns: he/him; honorific prefix: Dr (all in
  `content/entities.json` Person entity)

## Troubleshooting

- `StrReplace` fails on markdown files: Unicode quotes block matching, so read
  the exact text first
- Prettier reformats code fences: language tag `text` gets applied to bare
  fences
- Playwright import fails on JSON-backed app modules: keep route-emission
  proof in Playwright, but move app-module contract proof to Vitest or import
  raw JSON directly
- GitHub's Copilot pull-request reviewer login is
  `copilot-pull-request-reviewer[bot]`; omitting `[bot]` returns 422.
- SSH-signed commits can appear as `No signature` in local `git log` when
  `gpg.ssh.allowedSignersFile` is absent. Verify the commit through GitHub or
  configure allowed signers before classifying it as unsigned.

## Playwright runs against a production build

`pnpm test:e2e` now uses `pnpm build && pnpm start` as its web server.
Production removes the dev-only Turbopack `Runtime ChunkLoadError` overlay and
the Next.js dev-tools issue badge that previously caused intermittent E2E
failures and forced narrow per-route stabilising helpers. PDF generation is
part of the build, so PDF tests run alongside everything else (no separate
`with-build` project). When in doubt, prefer producing more proof at the
production layer over working around dev-server transients in test code.

## Harness activation order (2026-09-12 transplant)

The PreToolUse guard fails closed and reloads the moment `.claude/settings.json`
changes. Land `.agent/hooks/policy.json` first, make sure `agent-tools/dist`
is built (the `postinstall` bootstrap does it), and only then wire `hooks` in
settings. Done in the other order, every Bash, Edit and Write call is refused
until the policy file exists. Source: napkin 2026-09-12; routing: pending
graduation 1.

## Staging a large set without the wildcard guard

`git add -u -- . ':!path'` trips the wildcard-staging guard and a refused
command aborts the rest of its `&&` chain silently. Stage with
`git diff --name-only | xargs git add --`, write commit-message files in their
own command, and run `pnpm agent-tools:check-commit-message -F <file>` before
`git commit -F`. Source: napkin 2026-09-12; routing: pending graduation 2.

## A record number surviving a transplant proves nothing (2026-09-12)

ADR-011 here and ADR-011 in the lineage are different records. When a
citation crosses a lineage boundary, check the title at the target before
keeping the number; a number match with a subject mismatch is the worst
case, because it reads as intact. Source: napkin 2026-09-12 (re-evaluate
slice 1); routing: pending graduation 5.

## Read the validator before repeating a claimed violation (2026-09-12)

An explorer reported six Core-to-docs portability violations; the
reference-direction validator had reported zero all along, and the claim
reached a peer estate before it was checked. Every validator the estate
owns is the first read for a claim in its domain; a claim that contradicts
a green validator is wrong until the validator is shown to be. Source:
napkin 2026-09-12; routing: pending graduation 5.

## Check the mechanism existed at time T before asking why it failed at T (2026-09-12)

A diagnosis blamed a hook timeout for a session-start write that never
happened; the hook had been installed five hours after session start and
runs in 0.11 s. One `git log --diff-filter=A` on the hook file answers the
question before any config changes. Transplants breed this trap: surfaces
arrive mid-session, so "it did not fire at session start" usually means "it
did not exist at session start". Source: napkin 2026-09-12 (Session 5);
routing: pending graduation 5 (assertions exercised, not trusted).

## After a transplant, converge conventions on the lineage's practice; never alias both (2026-09-12)

The transplant kept the host's gate names beside the lineage's (`check:ci`
and `check:fix` next to `fix` and `format-check:root`) and every transplanted
skill cited the lineage's. The owner ruled for the lineage's names as
practised; the rename touched two `package.json` files, the hooks, CI and
about fifty citing files. Read the convention from the lineage's live
`package.json` at the pin, not from its doctrine (the lineage's own PDR-008
no longer matched its scripts), converge on it before the first skill is
copied, and surface the choice; aliasing both defers the ruling and doubles
the citations. Source: napkin 2026-09-12 (Session 5); routing: the
efficiency-guidance report and the transplant runbook step 5.

## Completeness is judged by function and exercised claims, never by a green gate (2026-09-13)

A transplant can pass every gate and still claim forty surfaces it lacks:
green means the checks that exist pass, not that the estate is whole. Define
the Practice by what it must do (nine functions), then exercise the estate's
own claims — every backticked path and cited script in live doctrine must
resolve — before any survey of the source. The owner's sentence: "looking at
your surveys of the Practice in OCE cannot tell you if something was missed
from those surveys." Source: napkin 2026-09-13 (Wrap 5); routing: the
definition report and the `practice-completion` node (a cited-paths validator).

## A ruling to trim is scoped to the default it was made under (2026-09-13)

"Keep only what the host runs" and "bring the entire Practice, adapt" produce
different verdicts on the same surface. Record every drop with the default in
force, so a later direction reopens exactly the drops made under the old one
and no other. Source: napkin 2026-09-13; routing: the plan of record's rounds
and the node's preamble.

## A green, clean pull request is merged, by merge commit, without asking (2026-09-13)

The owner, asked which merge method and who merges: "Why is this a question? Yes merge,
always merge" and "if it is green and clean, it gets merged, you are inventing optionality
and it is wasting my time and yours." A card is for a decision only the owner can make; the
merge of a green, clean PR is not one. Source: napkin 2026-09-13 (round 11); routing:
pr-lifecycle §Phase 7 already says it.

## A check that reads the local disk proves the local disk (2026-09-13)

Twice in one afternoon a leg was green here and red in CI: the cited-paths validator found
instance-tier state and a private boundary on this disk; dependency-cruise found a built
output a warm checkout carried. Neither exists on a fresh checkout. A check resolves against
what the repository declares — the tracked tree, the ignore rules, the manifests — never
against what happens to be on the machine; and a closure is derived from the manifests, never
listed. Source: napkin 2026-09-13 (PR #53 triage); routing: `compute-dont-hope`,
`core/repository-paths`, `install-time-closure`.

## Perl in-place replacements interpolate template literals (2026-09-13)

`perl -pi -e 's/…/…${name}…/'` treats `${name}` in the replacement as a Perl variable and
writes nothing; two TypeScript template literals were silently emptied and caught by reading
the diff. Escape as `\$\{name\}`, or edit source files with the native per-file tool. Source:
napkin 2026-09-13; routing: this list.

## Ratified text is the owner's; the lenses resolve only what it leaves open (2026-09-13)

A Director verdict removed instruments a ratified todo said to restore, and accepted "not
brought" for registers the todo said to create or declare. The owner: "I expressly said to keep
the merge bot tools, this makes me concerned for what other instructions are being overturned."
Both reversed. The Decision Lenses answer questions the ratified text leaves open (a method, a
sequencing, a form the doctrine forbids); they never answer against the text. A case for changing
ratified text is a card to the owner, after the item lands, never a PR. Source: napkin
2026-09-13 (Session 8); routing: `director-handoff.md` §Standing owner rulings, PDR-117 candidate.
