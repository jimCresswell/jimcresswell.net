---
type: exploration
status: sketch
date: 2026-09-13
ratified_by:
ratified_date:
ratified_where:
fitness_line_target: 220
fitness_line_limit: 300
fitness_line_length: 100
---

# The universal Practice and its language packs

Written on the owner's direction (2026-09-13, midday, verbatim): "We need to separate the
universal parts of the Practice, from those parts that are specific to a given programming
language, in terms of documents, and targetted mechanisms such as rules and skills, and in the
agent tools. This is not urgent, but it is important. The Practice should support at least
Typescript, Python, Rust. For the agent tools specifically, how can we define the full set of
contracts and interactions in a language agnostic way, and still enforce them: JSON schema?
Something else?" Run as metacognition, free play, concept exploration and reason; the plan node
that sequences the answer is
[`practice-language-separation`](../../plans/delivery/practice-language-separation.plan.md)
(born sketch). Companion: the [installable-thing report](practice-as-installable-thing.md), whose
ecosystem frame (install, learn, contribute, update) this record presupposes.

> Born sketch. Every proposal below carries its warrant and its falsifier; nothing here governs
> work until the node is ratified.

## Observations (what is actually there)

- **The doctrine already claims stack-agnosticism, three times.** PDR-035: the Practice
  "memotype" owns the behavioural contract of every agent-work capability; a host owns only its
  "phenotype" (files, tools, hooks, schemas, scripts), and "a capability being implemented in
  TypeScript, Python, Rust, Java, shell … does not transfer conceptual ownership". PDR-008: gate
  names and semantics "travel verbatim" across ecosystems while the commands underneath adapt,
  with a table for TypeScript, Python, Rust and Go. PDR-006: one leading-edge reference repo per
  ecosystem; Python has one, Rust is a named gap.
- **The mechanism does not exist.** Measured today over the live estate: 9 of 17 directives,
  50 of 127 rules, 32 of 122 skill files, 18 of 27 expert templates and 20 of 141 PDRs carry a
  TypeScript or toolchain token (`pnpm`, `vitest`, `zod`, `tsc`, `eslint`, `playwright`,
  `package.json`, …). `principles.md` carries 18 such tokens, `testing-strategy.md` 16. Nine
  rules are language-bound by name (`no-type-shortcuts`, `source-is-typescript-esm-only`,
  `tsdoc-…`, `read-nextjs-docs-…`, `use-result-pattern`, …). Nothing declares which file is
  universal; nothing refuses a language token in a universal file; the adapter generator
  projects every rule to every platform regardless of the host's language.
- **The instruments are one TypeScript implementation with toolchain assumptions inside.**
  `agent-tools` has 12 CLI topics and at least five schema-versioned formats (active claims
  1.4.0, closed claims 1.3.0, comms events 2.0.0, watcher heartbeat 0.2.0, the hook policy) whose
  shapes live only in TypeScript types; the cited-scripts validator resolves `pnpm` against
  `package.json`; the bootstrap hard-codes workspace paths (a finding already sent to the
  lineage).
- **One contract is already language-agnostic, and says how.** `practice-core/schemas/
  inter-practice-wire.schema.json` is JSON Schema 2020-12, Core-carried, with its discipline
  written into the document: the schema is the contract, each estate's strict local schema is
  the enforcement surface, a conformance test binds the two so drift red-gates, and version
  families are additive-optional within a major. That is a precedent, not a proposal.
- **The two estates diverged in the universal layer.** Since the transplant began, this seat
  landed validators, the plan-node estate and the definition by function; the OCE seat landed
  PR machinery, disposition formats and seed fixes. None of it is language-bound. The owner
  called the divergence fascinating; it is also evidence about where churn lives.

## Metacognition (inherited shapes examined)

- "Split the documents into universal and language folders" is a filing answer. The real
  property is dependency direction (universal never depends on a language) and projection (a
  host receives only what fits it). Folders are one realisation; without a declaration and a
  refusal it is the nominal-adoption shape this transplant spent a day curing.
- "JSON Schema" is the fluent yes. Grounded, the contracts are of three kinds and JSON Schema
  fits one: data shapes (state files, frontmatter, policy, profile) it expresses fully;
  interactions (a claim refuses to open into a populated registry while blind to comms; a
  watcher's cursor semantics; identity derived deterministically from a seed) it cannot express
  at all; the command surface (topics, verbs, flags, exit codes, output lines) it expresses only
  as data. So JSON Schema is necessary and not sufficient.
- "Support three languages" hides "port the instruments three times". The instruments are
  processes reached through a CLI and platform hooks; a Python host can run a built binary
  without a Node toolchain. What must be language-aware inside them is small and enumerable:
  the task-runner adapter, the source and test naming conventions, the gate-role to command map.
- Altitude: this is a strategy choice (a fourth `PRACTICE-*` choice) with a delivery first
  slice. The two real forks are the contract's authoring source and how instruments reach a
  non-TypeScript host; the node carries them as gates, not as a thesis.

## Free play (harvest, with discards)

- _These look shaped alike_: the memotype/phenotype boundary of PDR-035 and the Language Server
  Protocol — one protocol, many servers, many clients. Kept: it names the shape of the answer
  (the Practice's contracts are a protocol; conformance is its test suite; the harness is the
  client).
- _This reminded me of_ the gradient's "keep the highest-specificity layer as thin as possible,
  preferably configuration only". Kept: a language pack should be mostly configuration (a
  profile, a vocabulary, a role-to-command map) plus a few directives; a fat pack is a
  falsifier against the universal layer's generality.
- _Juxtaposed_: both estates innovated in the universal layer and would only have _differed_
  in the language layer. Kept as an observation with a falsifier (count divergence surfaces by
  scope after the split): the universal layer may be the high-churn one, so the exchange
  mechanism (contribute and update) pays more than the split does.
- _Same shape_: the transplant antigen scan (lineage names leaking into a host) and a scope
  leak scan (language tokens leaking into universal doctrine). Kept: one instrument, two
  vocabularies.
- _Discarded_: "the three languages are three organisms sharing a genome" (adds nothing;
  discarded once already). _Discarded_: "JSON Schema is the Practice's DNA" (a slogan).

## The problem frame

- **Gap.** The Practice cannot be installed in a non-TypeScript host without a seat
  re-deriving what is universal. **Harm.** That host either internalises rules that are false
  for it (`source-is-typescript-esm-only` in a Rust repo) or trims blindly, which is the
  default this transplant paid for on 2026-09-12. **Mechanism.** Language specifics are woven
  through universal surfaces with no declaration, and the instruments' contracts exist only as
  one implementation's types. **Constraints.** No fork of the lineage (PRACTICE-1); strict
  everywhere; contributions must flow back through the ecosystem; PDR-006 and PDR-008 stand.
  **Success.** A host declares its languages once; universal doctrine carries no language
  token and a validator refuses one; a language pack is thin; the instruments' contracts are
  readable by any language and enforced by a suite any implementation can run; a Python or
  Rust host installs the Practice without a seat trimming.

## Proposals (each with warrant and falsifier)

1. **Scope declaration and the leak validator.** Every `.agent` artefact declares `scope`
   (`universal`, `language:<x>`, `toolchain:<x>`, `framework:<x>`, `host`); a validator refuses
   a universal artefact carrying any token from a language pack's vocabulary; the adapter
   generator projects rules, skills and templates by the host's declared languages. Warrant:
   the measurements above, and today's lesson that a validator beats a sweep. Falsifier: if
   most "universal" files cannot be scrubbed without losing meaning, the universal layer is
   smaller than assumed and the taxonomy needs a runtime-bound tier.
2. **The host profile.** One schema'd document (`.agent/practice-host.json`) declares the
   host's languages, task runner, gate-role to command map (PDR-008's table as data), source
   and test naming conventions and lockfiles; universal doctrine names roles ("the type gate"),
   never commands. Warrant: PDR-008 already tabulates this; the bootstrap's hard-coded paths
   were the defect. Falsifier: a universal document that needs a command it cannot name as a
   role.
3. **Language packs, thin.** `typescript` first, extracted from the live estate (the
   TypeScript practice split back out of `validation-strategy.md` at the seam its own
   frontmatter names; the nine language-bound rules; `tsdoc`, `dependency-currency`, `config`,
   `react-component`; the type and framework experts; the cited-scripts adapter); `python` and
   `rust` authored against PDR-006's reference repos. Warrant: the gradient. Falsifier: a pack
   that needs more doctrine files than configuration.
4. **Contracts as JSON Schema 2020-12, schema-first, Core-carried.** Every schema-versioned
   state format, every frontmatter contract (plan node, skill, pattern, template), the hook
   policy and the host profile get an authored schema; the reference implementation binds by
   generated types and boundary validation; a sync validator refuses drift between a schema and
   its consumers' fixtures. Warrant: the wire schema's own written discipline; native support
   in TypeScript, Python and Rust; the estate's strict-validation-at-boundary rule. Falsifier:
   a constraint the schema cannot express and a fixture cannot pin — then CUE is the
   candidate, evaluated on that constraint, not in the abstract.
5. **A conformance corpus for interactions.** Fixture cases (a setup tree, argv, environment,
   expected exit code, output lines and state-file diffs) run black-box against any
   `agent-tools` binary; the TypeScript implementation adopts the corpus as its smoke suite (the
   node's todo 2 wanted one). Warrant: the pattern of the JSON Schema Test Suite, CommonMark and
   LSP, and the estate's rule that smoke tests prove the shipped artefact. Falsifier: behaviour
   that no observable state diff can pin (watch timing); those cases stay named as
   reference-implementation-only.
6. **Instruments reach a non-TypeScript host as a built binary first.** One reference
   implementation, shipped per platform, with the corpus as its contract; a port only where a
   host must own the instrument, and only after it passes the corpus. Warrant: the gradient
   ("adopt behind a thin conformance check"), PDR-035 (host tooling implements Practice-owned
   capability). Falsifier: a host policy that forbids a foreign binary, or startup cost that
   breaks the harness's hook timeouts.

## What "something else" would be

CUE expresses constraints JSON Schema cannot and exports JSON Schema, at the cost of a toolchain
with no native library in the three languages; TypeSpec emits JSON Schema from a typed DSL;
Protocol Buffers are binary-first and wrong for a markdown-and-JSON substrate. None displaces
JSON Schema for shapes. What JSON Schema lacks is behaviour, and the answer to that is not a
richer schema language but the conformance corpus: a specification written as runnable cases.

## Unresolved evidence

- Whether the lineage has a host profile in embryo beyond `bootstrap.ts`. (The Python
  Practice repository, <https://github.com/EngraphCode/python-starter>, is settled by the owner,
  2026-09-13: a very rough sketch, not a template;
  the Python pack takes the lineage's structure and reads that repository for hints, never
  intent.)
- Whether Claude, Cursor and Codex hook wire shapes are stable enough to schema without
  chasing vendors (the estate already validates one wire contract).
- The divergence-by-scope count that would confirm or refute the free-play observation.

## Status and world return

**Status: provisional.** Counts are measured; the frame is held as a model. The indicators
that reopen this record: the leak validator's first count on the live tree; the size of the
first language pack; the first foreign-implementation run of the corpus.
