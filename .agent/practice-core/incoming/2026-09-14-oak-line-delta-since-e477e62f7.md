# From the Oak fork line to jimcresswell.net: what moved between your transfer base and the current head

Delivered 2026-09-14 by Zephyr guards Leeward (281e44), curator on the Oak fork line (EngraphCode/open-curriculum-ecosystem), at the owner's word, for Cauldron herds Lustre (880ff9), who is transplanting the Practice into jimcresswell.net.

## The two heads

You are basing the transplant on the Oak-line commit `e477e62f7e69d055a9d62d47c0ad16a77054438c` (2026-09-12, the merge of the pr-tally lane, PR #138). The current `engraph` head after the 2026-09-12 coordination branch folded (PR #137) carries everything below; the post-fold engraph head is `7658a723a6b652dbb43bbaa931735cda68e9d60d`. Between the two: 58 commits, 137 changed files in the Practice and its tooling, nothing deleted, no directive, hook-policy or vendor-adapter changes.

## What a transplant needs to know, in the order it bites

1. **Practice Core gained a PDR and a schema.** PDR-141 (Accepted, owner-ratified 2026-09-14 with its same-day amendment): the operator profile lives in the operator's home directory at `~/.practice/profile/`, the Practice's first surface outside a repository. It is strictly optional, sits below every tracked surface, and has three document kinds — `index.md` (the operator everywhere), `repos/<scope-key>.md` (one repository line, keyed by the origin remote's owner and name, never a path) and `machines/<machine-key>.md` (one machine, keyed by the short host name). The root may be a private git repository the operator syncs; the Practice reads and validates it and never initialises or pushes it. The Core-carried contract is `practice-core/schemas/operator-profile.schema.json` (family 1.0.0); each host binds its own enforcement validator to it with a conformance smoke and names the check command in its Practice index. Your Practice will consume the profile once it knows about it: the read happens in the shared start-right grounding (§3a), check first, then index, scope file, machine file. The owner's own profile already carries a scope file keyed for the Oak fork line; jimcresswell.net's key, derived from its origin remote, is `jimcresswell--jimcresswell.net`, so its scope file is `repos/jimcresswell--jimcresswell.net.md` when one is written. The owner's own frame for the surface, recorded in PDR-141 §Notes: a simple personal knowledge graph with sovereignty, because he controls the repository the canonical copy lives in.

2. **PDR-026, PDR-027 and PDR-117 were amended** (owner endorsement of surfaced falsifiable structure; designation versus character and fork identity; Director routing, planning, executor binding, review lanes, emeritus seats). The Core changelog carries the entries.

3. **agent-tools gained three module families.** `pr-tally` (harvest, findings, markers, rows, dispositions, settlement, verdict, with recorded PR harvest fixtures), `review-cost` (the review cost gate, survey, budget and pricing, feeding a new `review-cost-ledger.md`), and `validators/operator-profile` (the profile's enforcement schema, key derivation, a credential-shaped-line tripwire, document and layout validation, the CLI behind `pnpm profile:check`, fixtures, unit suite and the contract smoke now in `test:e2e`). Root scripts: `profile:check` added; knip entries and CLI topic registrations updated.

4. **The pre-push hook changed.** It captures the pushed ref lines once, runs the secret scan against them, and runs the review-cost gate: past a declared review budget on a non-converging loop the push is refused. The PR template and `copilot-instructions.md` carry the intake declaration and review contract.

5. **Thirty-one rules and ten skills gained clauses**, none added or removed. Most are owner rulings graduated from a per-user memory buffer on 2026-09-14: card mechanics and design cadence (owner-attention), the warrant ladder and its provenance rung (re-apply-first-question), warranted exemptions as alarm bells (never-disable-checks), the warrant-first fleet review and tier-per-leg economy (fleet-design-review), standard git only (never-use-git-to-remove-work), untracked is not secondary (important-state-not-in-temp-files), a lane closes on its value statement (design-from-impact), the authority test and quote-the-clause verdicts (verify-dont-trust), and one that changes closing behaviour: session-handoff step 11 and the check-singleton rule now take gate evidence from the commit's own hook run and forbid a separate `pnpm check` ("the commit triggers the gates … never, ever" run them separately). Skills touched: pr-lifecycle, proportionality, consolidate-docs, napkin, plan, ticket-management, cut-coordination-branch, wrap, start-right.

6. **Continuity surfaces** moved as continuity surfaces do: repo-continuity, the estate-coordination and continuity-memory thread records, the rulings ledger (no memory-file citations remain), the frictions register, pending-graduations (seven due directive-bound entries for the next dedicated consolidation), three patterns, the shell gotchas, a new Workflow tool operating note under `claude-harness-integrations`, and two new plan nodes (reliable-atoms-workspace-shape, review-round-predicates).

## What this note is not

It is not a pin: it names no line numbers and quotes no file bodies, so it stays true as your transplant proceeds. The commit range on the Oak line is the record; the paired delivery event on your comms stream is this note's time-bound layer.

## The post-fold head

engraph at `7658a723a6b652dbb43bbaa931735cda68e9d60d` (the fold of coordination/2026-09-12-69a537, PR #137, 2026-09-14). Every path this note names exists at that head.
