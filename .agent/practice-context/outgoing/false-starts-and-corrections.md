# False Starts And Corrections

These are the cheap lessons worth reusing.

## Graph work overstated current truth

We initially let some plans and docs speak as if the website was already a view
onto the graph. It was not. The graph was real for JSON-LD and related outputs,
but visible page composition still lived in page-content JSON.

Correction: current-state docs must describe current implementation truth, while
target-state claims belong in plans, research, or explicitly target-state ADR
wording.

## Deliberate repetition is fine; duplicate ownership is not

Some repetition in the Practice is useful for discoverability. The real problem
was multiple mutable files each trying to own the same live workflow or status.

Correction: keep repetition when it serves orientation or emphasis; remove it
when it creates synchronisation risk.

## Vague transient context is not enough

An undifferentiated `.agent/practice-context/` directory was too underspecified.
It did not clearly separate sender-supplied context from receiver-side working
notes.

Correction: use `outgoing/` for sender context that can build up over time, use
`incoming/` for received material and receiver notes, and clear `incoming/`
after integration.

## AGENTS landing pads drift if they keep durable truth

We let accurate but durable structural truth sit in `AGENTS.md` instead of
making sure the canonical docs owned it. `AGENTS.md` then became vulnerable to
drift and incorrect deletions of anchors.

Correction: if an `AGENTS.md` note is stable enough to matter, move it into the
right canonical doc and leave anchors behind where appropriate. Do not let
landing pads become long-term owners of structural truth.

## Provenance shorthand matching is a trap

It is tempting to compare Practice lineage by whatever shorthand is most
visible. Positional indexes were especially misleading because they implied
identity and rank they did not have. UUIDs fix that part, but they still do
not replace understanding the actual change.

Correction: when integrating incoming Practice Core files, compare the
detailed content plus each entry's `repo`, `date`, and `purpose`. Use UUID
`id` fields for stable entry references, and use array order plus `date` for
chronology. Do not reduce the decision to UUID or legacy-index matching alone.
