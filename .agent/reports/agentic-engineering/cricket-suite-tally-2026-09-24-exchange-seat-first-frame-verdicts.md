# Cricket suite tally — 2026-09-24, the exchange seat's first suite with frame verdicts (Siren herds Rudder, 158275)

## The suite — dispatched at 14:00Z, the last return before the clock read of 14:07:57Z

Asked by the Director's check-in 5 (the owner's 45-minute cadence). Platform: Claude, the seat
on Opus 5.5. Panel: the full suite, the four registered roles twice, normal then adversarial,
on one frame in which only STANCE differed (proven by a diff of the two rendered frames). No
model override.

This is the first suite run under the owner's word of 2026-09-24, relayed by the Director:
"Crickets judge in the frame provided, we need them to also judge the frame itself". The
templates did not yet carry a frame verdict, so the frame asked for one inline: `FRAME
VERDICT:` SOUND, NARROWED or CONTRADICTED, judged against the verbatim sources quoted in the
objective frame. Those sources were the owner's goal order, the owner's two Cricket words and
the exchange node's §Todos, with the seat's status reading labelled as its own. Figures are
the harness's usage report for each leg; runtime is wall-clock.

## Legs

| Role (dual-scale label) | Model | Effort | Stance | Verdict | Frame verdict | Tokens | Tool uses | Runtime |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cricket-judgement-low (highest power, low effort) | fable | low | normal | ON-TRACK | NARROWED | 26,998 | 3 | 24.6 s |
| cricket-judgement-medium (high power, medium effort) | opus | medium | normal | ON-TRACK | NARROWED | 29,209 | 3 | 34.6 s |
| cricket-judgement-high (mid power, high effort) | sonnet | high | normal | ON-TRACK | NARROWED | 35,692 | 3 | 93.2 s |
| cricket-procedure-xhigh (lowest power, xhigh effort, compiled procedure) | haiku | xhigh | normal | ON-TRACK | SOUND | 24,795 | 3 | 72.8 s |
| cricket-judgement-low (highest power, low effort) | fable | low | adversarial | ON-TRACK | NARROWED | 27,544 | 3 | 30.5 s |
| cricket-judgement-medium (high power, medium effort) | opus | medium | adversarial | ON-TRACK | NARROWED | 29,918 | 3 | 39.5 s |
| cricket-judgement-high (mid power, high effort) | sonnet | high | adversarial | ON-TRACK | NARROWED | 41,903 | 3 | 153.7 s |
| cricket-procedure-xhigh (lowest power, xhigh effort, compiled procedure) | haiku | xhigh | adversarial | ON-TRACK | NARROWED | 35,475 | 3 | 206.7 s |

Total: 251,534 tokens over eight legs. None undelivered.

## What the frame verdicts found

Every judgement leg in both stances returned the same frame finding, independently: the
owner's order names two goals, and the frame carried only the first. Its INTENT and NEXT gave
goal two ("bring our Practice up to speed with their innovations") and the partial inbound
todo no lane and no stated wait. Beside that finding:

- the owner's sub-agent word ("compared between the repos") runs both ways, and the frame read
  it as outbound only (three legs);
- todo 7 (the re-pin) and todo 6 (the close) had no line in NEXT (three legs);
- todo 8's ordering clause was listed as one item among many, not as a named precondition (four
  legs).

The work verdicts, meanwhile, were eight ON-TRACK. This is the pattern the owner's word
targets: an ON-TRACK inside a frame that dropped part of its sources says nothing about the
dropped part.

## Adjudication

- Accepted: goal two gets a named slot in the seat's queue, with the lineage's better
  sub-agent surfaces (zero-tool adapters, stance personas, per-role colours) as its first
  inbound items. The comparison's two directions are routed separately. Todo 7 runs before
  the register closes and todo 6 after delivery, each stated with its condition. Frames carry
  owner rulings with their event ids.
- Accepted in part: four legs read todo 8 as requiring the cure before the outbound note. The
  node's text puts the measure there ("The Core's portability measure (before todo 5's outbound
  note ...)"). That measure was taken the same day. It gives the cure to the authoring estate
  and has the validator "offered in the outbound note". So the ADR-citation file leads the
  first batch, and the cure is not made a hold.
- Recorded, not adopted: the procedure seat's adversarial frame line on the join ceremony's
  timing. The timing is the receiver's own fresh session, which is stated in the frame.

## Behaviour notes

- The compiled-procedure seat's normal leg returned FRAME SOUND with no audit behind it, and
  it missed the dropped goal that all three judgement seats found. Its identity declaration
  named the invoker ("Siren herds Rudder") instead of itself. Its adversarial leg recorded
  `UNGROUNDED: None` on a frame whose status column was self-reported. This is the case for
  a mechanical frame audit in the compiled procedure: a frame ask that gives a small model no
  steps is answered by assertion.
- Asking for the frame verdict inline added little runtime. Each normal leg ran within about
  six seconds of the same role's normal leg in the tally of 2026-09-23 (24.6 against 23.5 s,
  34.6 against 28.5 s, 93.2 against 97.4 s, 72.8 against 69.5 s). That was a different frame,
  so this is an observation, not a measure.
