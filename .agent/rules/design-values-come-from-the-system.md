# Design Values Come From the System

Owner-ruled (2026-07-29, in-chat, verbatim): "everywhere we use a value it
should come from the design system, no hardcoded values." The scope reading
was owner-ratified the same hour ("I agree"): the rule binds CONSUMER
surfaces; kit-internal literals ARE the definitions and are exempt;
infrastructure values (ports, timeouts, URLs) are not design values.

Provenance: this rule operationalises that owner ruling directly (recorded
as ruling 20 in the Director sitting block of 2026-07-29, upstream lineage), routed
through [`new-rule-vs-pdr-clause`](new-rule-vs-pdr-clause.md) at minting —
a standing behavioural rule, not a PDR clause, because it binds every
authoring/review act on consumer surfaces rather than a governance
decision. It applies the site's token doctrine — the `:root` values and `@theme` role
mapping in `jcdotnet/app/globals.css` — to the point of use.

## Trigger

Authoring or reviewing code on a consumer surface that expresses a design
value — colour, spacing, typography, radius, elevation, motion, breakpoint —
in any served page or component. This rule fires at the moment the
value is written, and again at review.

## Action

1. **Resolve every design value through the design system** — a token, role
   class, or CSS custom property from the site's design system (the
   `@theme` role mapping in `jcdotnet/app/globals.css` and the Tailwind
   utilities it defines). Never a raw hex, px-literal scale value, ad-hoc
   font stack, or copied magic number.
2. **Kit-internal literals are the definitions themselves** — values inside
   the design-system package's own sheets and token sources are where
   literals live by design. This rule does not reach into the kit.
3. **A retained consumer literal is an owner decision, recorded** — the
   default disposition for an existing literal is replace-with-role; keeping
   one requires the owner's named word and a recorded disposition (the
   fidelity-register pattern).
4. **Reviews test this as an axis**: a consumer-surface diff introducing a
   design literal is a finding regardless of how faithful the literal is —
   fidelity belongs in the token, not at the call site.

## Why This Rule Exists (Worked Instance)

The hub demo predated the design system and accumulated 27 raw hex values
across its app and component sources (audited first-hand 2026-07-29; the
true-up ticket carries the disposition work with replace-with-role as the
owner-ruled default); each now needs an individual disposition — the exact
drift this rule prevents at authoring time. The same day, the showcase
absorb landed with a zero-hardcoded-values invariant and an enforcement
instrument in its programme ticket's next-slice DoD, demonstrating the
compliant shape.

## Related Surfaces

- `jcdotnet/app/globals.css` — the token definitions (`:root` values and the
  `@theme` role mapping) every consumer surface resolves through.
- [`invoke-design-system-expert`](invoke-design-system-expert.md) — the
  reviewer dispatch that carries this axis.
- [`no-moving-targets-in-permanent-docs`](no-moving-targets-in-permanent-docs.md)
  — the same single-source-of-truth principle applied to prose.

## Enforcement

Behavioural at authoring and review now; mechanical enforcement arrives with
the showcase programme's zero-hardcoded-values instrument and extends
per-surface as consumers converge. A rule-wide lint is deliberate follow-on
work, not part of this rule's landing.
