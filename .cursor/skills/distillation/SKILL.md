---
name: distillation
description: >-
  Extract high-signal patterns from the napkin into a curated
  distilled.md rulebook. Triggered when the napkin exceeds
  ~1,200 lines. Handles archival, deduplication, and rotation.
version: 1.0.0
date: 2026-02-16
---

# Distillation

Extract actionable rules, patterns, and troubleshooting from
the session napkin into a compact, curated reference. This
skill complements the [napkin skill](../napkin/SKILL.md).

**Trigger**: When `.agent/memory/napkin.md` exceeds ~500
lines, or when the user requests distillation.

## File Layout

```text
.agent/memory/
  distilled.md                    # Curated rulebook (read every session)
  napkin.md                       # Current session log
  archive/
    napkin-YYYY-MM-DD.md          # Archived napkins (historical reference)
```

## Distillation Protocol

### 1. Extract

Read every "Patterns to Remember", "Mistakes Made", "Key
Insight", and "Lessons" section from the outgoing napkin.
Collect all entries that would change behaviour if read next
session.

Check the following files for recently added memories that should be moved into distilled.md:

<!-- All relative to the repo root -->

- @AGENTS.md
- @CLAUDE.md
- @.agent/directives/AGENT.md

### 2. Merge

Compare extracted entries against existing `distilled.md`.
For each entry:

- **New insight**: Add it to the appropriate section.
- **Duplicate of existing rule**: Skip it — the rule is
  already captured.
- **Refinement of existing rule**: Update the existing entry
  with the sharper formulation.
- **Contradiction**: Investigate. The more recent finding
  usually wins, but verify before overwriting.

### 3. Prune

The distilled file should not exceed about 200 lines. When it does, move insights into permanent documentation, see [consolidate-docs.md](../../commands/consolidate-docs.md).

Remove from `distilled.md` anything that is now captured in
permanent repo documentation:

- Rules codified in `.agent/directives/rules.md`
- Patterns documented in ADRs or EDRs
- Editorial principles in `.agent/directives/editorial-guidance.md`
- Architecture documented in `docs/architecture/`

The distilled file should contain only what is NOT already
in permanent documentation.

### 4. Archive

Move the outgoing napkin to the archive:

```bash
cp .agent/memory/napkin.md \
   .agent/memory/archive/napkin-YYYY-MM-DD.md
```

Use the current date for the filename.

### 5. Start Fresh

Create a new `.agent/memory/napkin.md` with a session heading
documenting the distillation itself.

## distilled.md Structure

Target: under 200 lines of high-signal content. Every entry
earns its place by being actionable.

```markdown
# Distilled Learnings

## User Preferences

## Content and Editorial

## Quality Gates

## Testing

## Documentation

## Troubleshooting
```

Adapt sections to the repo's domain. Add or remove sections
as the project evolves. The structure should make it easy to
find what you need quickly.

## Quality Criteria

A good `distilled.md` entry is:

- **Specific**: "ES client v9 uses `document` not `body`"
  not "ES API changed"
- **Actionable**: tells you what to DO, not just what
  happened
- **Non-obvious**: captures something you would not know
  from reading the code
- **Terse**: one to two lines maximum per entry

A good `distilled.md` overall is:

- Under 200 lines
- Zero redundancy with permanent documentation
- Readable in under 2 minutes
- Updated after every distillation, not between them

## When NOT to Distil

- Do not distil mid-session — the napkin is a working
  document during active work
- Do not distil if the napkin is under 600 lines — there
  is not enough content to justify the overhead
- Do not distil "What Was Done" sections — those are
  session history, not learnings
