# Editorial Review

Get detailed editorial feedback on content. Delegates to the read-only editor sub-agent — the editor reviews and gives feedback, you apply it.

## Usage

Invoke with a description of what to review:

```text
/jc-editor Review the Oak experience section for voice consistency
/jc-editor Check the front page narrative against recent CV changes
/jc-editor Review this draft positioning for the public-sector tilt
```

## What this does

Delegates to the `editor` sub-agent, which:

1. Reads and internalises the editorial guidance, voice skill, and EDRs
2. Reads the current content (CV, front page, structured data)
3. Reviews the specified content against voice, consistency, and pitfall checks
4. Returns structured feedback (must fix / should fix / consider) with specific quotes and explanations
5. Flags ripple effects to other content

The editor is read-only — it does not write or edit files. You (the calling agent) apply the feedback.

## References

@.agent/directives/editorial-guidance.md
@.cursor/skills/editorial-voice/SKILL.md
@docs/editorial/decision-records/README.md
@content/cv.content.json
@content/frontpage.content.json
@lib/jsonld.ts
