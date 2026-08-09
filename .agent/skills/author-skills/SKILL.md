---
name: author-skills
classification: active
description: Create or update repo-local skills and their thin platform adapters. Use when adding a new skill under `.agent/skills/`, revising an existing skill, registering a skill in `.agent/practice-index.md` and `.agent/directives/AGENT.md`, or deciding whether reusable guidance belongs in a skill rather than a rule, command, directive, sub-agent, or plan.
---

# Author Skills

Create repo-local skills that follow this workspace's
existing pattern: canonical instructions in `.agent/skills/`,
thin platform adapters in `.cursor/skills/` and
`.agents/skills/`, and discoverability through the repo
indexes.

## Goal

Add or revise a skill without introducing a second
convention.

## Design Principles

### Keep context lean

Assume the receiving agent is already capable. Put only the
repo-specific workflow, decisions, and non-obvious guidance
into the skill. Favour crisp examples over long explanation.

### Match freedom to fragility

- Use plain prose when judgement is required and multiple
  approaches can work.
- Use structured steps when order matters.
- Use scripts only when the operation is repetitive or
  fragile enough that freehand execution is wasteful.

### Design for progressive disclosure

Keep `SKILL.md` as the operational core. Split out detail
only when it would otherwise bloat the main skill:

- keep variant-specific detail in `references/`
- keep deterministic helpers in `scripts/`
- keep templates and output artefacts in `assets/`

Avoid deep reference chains. Link reference files directly
from `SKILL.md`.

## First Question

Before writing anything, ask:

- Could this be a smaller change to an existing skill?
- Is the knowledge durable enough for a skill?
- Does this need a skill at all, or would a rule, command,
  directive, sub-agent, or plan be a better fit?

## Choose The Right Artefact

- Use a **skill** for reusable, on-demand guidance or
  workflows that should load only when relevant.
- Use a **rule** for behaviour that must happen
  automatically every session or every change.
- Use a **directive** for permanent repo policy or
  standards.
- Use a **command** for a named workflow with a fixed
  execution path.
- Use a **sub-agent** for specialist review or delegated
  judgement.
- Use a **plan** for ephemeral delivery work, not durable
  capability.

## Workflow

### 1. Define the job with concrete triggers

Capture the prompts and situations that should invoke the
skill. The description in the frontmatter is the trigger, so
make it specific and complete:

- say what the skill does
- say when to use it
- include the file or workflow context if that helps
- prefer real trigger phrases over abstract labels

Put trigger information in the frontmatter description, not
in a "when to use" section buried in the body.

Ground the skill in concrete examples before writing it.
List the requests that should trigger it and the jobs it
must handle repeatedly.

Decide the classification up front:

- `active` for explicitly invoked or situational skills
- `passive` only for skills that should apply every session
  without prompting

### 2. Choose a stable name

Use lowercase letters, digits, and hyphens only.

- prefer short, verb-led names
- keep the folder name identical to the skill name
- avoid vague names like `helper` or `workflow`
- namespace by tool or domain only when it improves
  triggering clarity

### 3. Design the smallest useful skill

Prefer a single `SKILL.md` first.

Add bundled resources only when they remove repeated work:

- `scripts/` for deterministic steps that would otherwise be
  rewritten
- `references/` for detail too bulky for `SKILL.md`
- `assets/` for templates or files used in output

Put reusable resources in the canonical skill folder, not in
one platform adapter. A platform adapter may keep
adapter-local metadata only, such as
`.agents/skills/<name>/agents/openai.yaml`.

Do not add auxiliary docs such as `README.md`,
`CHANGELOG.md`, or setup guides inside the skill folder.

### 4. Create the canonical skill

Canonical skills live at `.agent/skills/<name>/SKILL.md`.

Local frontmatter convention:

```yaml
---
name: your-skill-name
classification: active
description: Explain what the skill does and when to use it.
---
```

Keep the body imperative. Tell another agent what to do, not
what you were thinking when you wrote the skill. Use British
English to match `.agent/directives/AGENT.md`.

Keep the skill under roughly 500 lines. If it is heading
towards that size, split by responsibility rather than
compressing everything into one file.

Use repo-root-relative inline code paths such as
`docs/architecture/...` or `.agent/directives/...` when
referring to files outside the skill folder. This avoids the
depth-counting mistakes that happen with relative markdown
links from `.agent/skills/<name>/SKILL.md`.

Do not introduce `agents/openai.yaml` into `.agent/skills/`
unless the repo adopts that convention explicitly. The
checked-in local pattern is canonical skill plus thin
adapter, not canonical skill plus UI metadata.

If you are creating a standalone Codex skill outside this
repo's canonical `.agent` layer, the system
`skill-creator/scripts/init_skill.py` scaffold may still be
useful. For repo-local `.agent` skills, skip it unless this
repo deliberately adopts the `agents/openai.yaml` convention
it generates.

### 5. Add resources only when they earn their keep

If a section is variant-specific, large, or rarely needed,
move it into a referenced file instead of bloating the main
`SKILL.md`.

Resource roles:

- `scripts/` for deterministic helpers
- `references/` for detail loaded only when needed
- `assets/` for templates or files used in output

Avoid duplicating the same information in both `SKILL.md`
and `references/`.

If you add scripts:

- keep them deterministic
- keep dependencies minimal
- run them after writing them; do not assume they work
- explain from `SKILL.md` when to use them

### 6. Add platform adapters

This repo keeps the source of truth in `.agent/skills/`.
Platform directories should contain thin wrappers, not copied
instructions.

For Cursor, add `.cursor/skills/<name>/SKILL.md` with:

```markdown
---
name: your-skill-name
description: Same trigger text, or a tight summary of it
---

Read and follow @.agent/skills/<name>/SKILL.md
```

For Codex, add `.agents/skills/<name>/SKILL.md` with:

```markdown
---
name: your-skill-name
description: Same trigger text, or a tight summary of it
---

Read and follow `.agent/skills/<name>/SKILL.md`
```

Codex note: the `.agents/skills/` namespace may also contain
instructional wrappers for commands (`jc-*`) and reviewer
roles. Choose names carefully to avoid collisions.

If Codex needs local UI metadata, keep it alongside the thin
wrapper under `.agents/skills/<name>/agents/`. Do not copy
`scripts/`, `references/`, or substantive instructions into
`.agents/skills/` when they belong in the canonical skill.

Only add other platform adapters if that platform already
exists in the repo and needs the skill surfaced there.

### 7. Register the skill

Update the Skills tables in both:

- `.agent/practice-index.md`
- `.agent/directives/AGENT.md`
- `.agent/reference/cross-platform-agent-surface-matrix.md` when the supported
  adapter surfaces change

Keep the listing text short and aligned across both files.
If the skill changes how other tooling works, update the
relevant command, rule, or sub-agent docs in the same pass.

If adding a new platform directory such as `.agents/`,
document it in the repo structure so it is discoverable.

### 8. Validate the integration

Re-read the new skill end to end, then verify the repo
integration:

1. confirm the canonical file exists
2. confirm any adapter file exists
3. confirm the skill appears in `.agent/practice-index.md`
4. confirm the skill appears in `.agent/directives/AGENT.md`
5. confirm any file references you added actually resolve
6. if you changed adapter surfaces, run `pnpm portability:check`

Useful checks:

```bash
SKILL_NAME=your-skill-name
rg -n "$SKILL_NAME|skills/$SKILL_NAME/SKILL.md" \
  .agent/directives/AGENT.md \
  .agent/practice-index.md \
  .cursor/skills \
  .agents/skills
```

```bash
wc -l .agent/directives/AGENT.md .agent/practice-index.md
```

Repo-local note: the generic system `skill-creator`
validator expects only `name` and `description` in
frontmatter. This repo's canonical `.agent` skills also use
`classification`, so validate them against the local pattern
in `.agent/practice-core/practice-bootstrap.md` rather than
assuming the generic validator applies unchanged. In this
environment, the bundled validator also depends on `PyYAML`,
so it may fail before reaching any frontmatter checks.

After changing tracked files, follow
`.agent/skills/quality-gates/SKILL.md` and run the repo's
quality gates.

### 9. Iterate after use

Use the skill on real work. When it struggles, fix the skill,
not just the immediate task outcome.

Typical iteration triggers:

- the trigger text is too vague to invoke reliably
- the skill repeats reference detail that should be split out
- a helper script should exist but does not
- adapters drift away from the canonical skill
- reusable scripts or references are stranded in one
  platform adapter

## Done Criteria

A skill change is complete when:

- the canonical skill is created or updated
- bundled resources exist only if they are justified
- required platform adapters exist and stay thin
- `.agent/practice-index.md` and `.agent/directives/AGENT.md`
  are in sync
- validation was actually run, not assumed
- the napkin records any new durable convention or gotcha

## Common Pitfalls

- Creating a new skill when an existing one only needs a
  sharper description or a new section
- Duplicating canonical instructions into platform adapters
- Using fragile relative markdown links from skill files
- Adding placeholder folders or unused resources
- Letting platform adapters drift from the canonical skill
- Leaving reusable scripts or references inside one platform
  adapter
- Hiding trigger conditions in the body instead of the
  description
- Treating plans as permanent knowledge stores
- Forgetting to update the indexes after creating the skill

## References

- `.agent/practice-core/practice-bootstrap.md`
- `.agent/practice-core/practice.md`
- `.agent/directives/AGENT.md`
- `.agent/directives/principles.md`
- `.agent/skills/quality-gates/SKILL.md`
- `.agent/skills/napkin/SKILL.md`
- `.agent/skills/editorial-voice/SKILL.md`
- `.cursor/skills/quality-gates/SKILL.md`
