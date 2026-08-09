# Editorial Review

Get detailed editorial feedback on content. Delegates to the read-only editor sub-agent — the editor reviews and gives feedback, you apply it.

## Usage

Invoke the command with a short description of what to review:

```text
/jc-editor Review the Oak experience section for voice consistency
/jc-editor Check the front page narrative against recent CV changes
/jc-editor Review this draft positioning for the public-sector tilt
```

## What this does

The `editor` sub-agent:

1. Reads and internalises `.agent/directives/editorial-strategy.md`,
   `.agent/directives/editorial-guidance.md`, the editorial voice skill, and the relevant EDRs.
2. Reads the current content (CV, front page, structured data) described in the prompt.
3. Reviews audience, surface composition, attention, structure, readability, section weight,
   evidence, voice, consistency and platform fit.
4. Returns structured feedback (`must fix` / `should fix` / `consider`) with precise citations.
5. Flags ripple effects to other content so you can update everything that depends on the reviewed text.

The editor is read-only; you are the actor. Apply the feedback in the codebase yourself.

## References

- `.agent/directives/editorial-strategy.md`
- `.agent/directives/editorial-guidance.md`
- `.agent/skills/editorial-voice/SKILL.md`
- `docs/editorial/decision-records/README.md`
- `content/cv.content.json`
- `content/frontpage.content.json`
- `lib/jsonld.ts`
- `.agent/directives/principles.md`
