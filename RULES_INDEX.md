# Rules Index

Canonical, platform-independent enumeration of the repository rules — the
discoverability surface for agents and humans, and the project-doc resolution
path for platforms (such as Codex) that do not auto-load `.agent/rules/`.

Before substantive work, read and apply every _relevant_ canonical rule below.
Treat them as behavioural modifiers for the session; follow any pointer a rule
makes before acting in the affected area. Regenerate this file whenever
`.agent/rules/` changes — `pnpm portability:check` fails when it is stale.

| Rule | Summary |
| --- | --- |
| `.agent/rules/agent-experience-review-lens.md` | Operationalises [PDR-111](../practice-core/decision-records/PDR-111-agen |
| `.agent/rules/agent-state-observable.md` | Operationalises [PDR-056 (Inter-Agent Collaboration Protocol)](../practi |
| `.agent/rules/agentic-judgment-conserve-by-default.md` | Operationalises [PDR-122 (Agentic Judgment Pipelines)](../practice-core/ |
| `.agent/rules/agents-default-no-gender.md` | Operationalises [PDR-061](../practice-core/decision-records/PDR-061-agen |
| `.agent/rules/apply-architectural-principles.md` | Pointer-only rule: principles.md operationalises the entire ADR corpus c |
| `.agent/rules/capability-landing-decision-procedure.md` | Where does a new capability land? This procedure answers at authoring ti |
| `.agent/rules/capture-practice-tool-feedback.md` | Operationalises [PDR-011](../practice-core/decision-records/PDR-011-cont |
| `.agent/rules/check-singleton-per-window.md` | Only **one** agent runs a whole-repo gate sweep (pnpm check, pnpm test, |
| `.agent/rules/closed-shape-design-optionality.md` | Operationalises [PDR-058 §Surface 2 — Design Optionality](../practice-co |
| `.agent/rules/collaboration-is-value-contingent.md` | Every piece of collaboration functionality — a monitor, a heartbeat, a b |
| `.agent/rules/comms-all-channels-watcher.md` | Communication is the absolute heart of multi-agent work. Before any othe |
| `.agent/rules/confident-seats-proceed-and-report.md` | Owner ruling (2026-07-27, during the review-loop untangling): a Director |
| `.agent/rules/consolidate-at-second-consumer.md` | Operationalises the no-duplication principle in [principles.md](../direc |
| `.agent/rules/continuity-surface-commits-as-orphans.md` | Operationalises [ADR-150 (Continuity Surfaces, Session Handoff, and Surp |
| `.agent/rules/coordination-branch-24h-lifetime.md` | Owner-ruled (2026-07-28, in-chat, verbatim intent): coordination branche |
| `.agent/rules/cross-repo-sessions-run-the-join-ceremony.md` | A session whose worktree repo and coordination home are different repos, |
| `.agent/rules/design-from-impact-not-the-cowpath.md` | Operationalises [principles.md §Decision Lenses](../directives/principle |
| `.agent/rules/design-values-come-from-the-system.md` | Owner-ruled (2026-07-29, in-chat, verbatim): "everywhere we use a value |
| `.agent/rules/design-work-for-small-prs.md` | **TRIGGER — this rule fires at work-SHAPING time**: plan authoring, tick |
| `.agent/rules/directed-routing-requires-absorption-ack.md` | A directed comms event that carries routing or an ask is a bounded chall |
| `.agent/rules/directive-file-context-budget.md` | Operationalises [PDR-052 (Directive-File Context Budget)](../practice-co |
| `.agent/rules/documentation-hygiene.md` | Operationalises [ADR-127 (Documentation as Foundational Infrastructure)] |
| `.agent/rules/dont-break-build-without-fix-plan.md` | Owns the green-gate invariant for the cross-agent context introduced by |
| `.agent/rules/executive-memory-drift-capture.md` | When a session observation surfaces drift, incompleteness, or a learning |
| `.agent/rules/exit-codes-in-band-never-piped.md` | A pipeline's exit status is the LAST stage's, so any command whose exit |
| `.agent/rules/fleet-design-review-before-expensive-fleets.md` | Owner-directed standing practice (2026-08-11): any potentially expensive |
| `.agent/rules/follow-agent-collaboration-practice.md` | Read and follow .agent/directives/agent-collaboration.md. This rule oper |
| `.agent/rules/follow-collaboration-practice.md` | Read and follow .agent/directives/user-collaboration.md. This rule opera |
| `.agent/rules/follow-the-practice.md` | Operationalises [ADR-119 (Agentic Engineering Practice)](../../docs/arch |
| `.agent/rules/handoff-messages-self-contained.md` | Operationalises [ADR-150 (Continuity Surfaces, Session Handoff, and Surp |
| `.agent/rules/hook-policy-substring-discipline.md` | The repo's PreToolUse hook policy is a substring-matcher. It blocks lite |
| `.agent/rules/identify-as-agent-under-shared-credentials.md` | > **Frame inverted 2026-07-23 by owner ruling.** Shared human credential |
| `.agent/rules/important-state-not-in-temp-files.md` | Specialises the no-machine-local-paths principle ([principles.md §Code D |
| `.agent/rules/invoke-accessibility-expert.md` | Invoke accessibility-reviewer when changes alter markup, interaction flo |
| `.agent/rules/invoke-architecture-expert-barney.md` | Invoke architecture-expert-barney when changes touch content/, lib/pkg, |
| `.agent/rules/invoke-architecture-expert-betty.md` | Invoke architecture-expert-betty when changes alter routes, layout compo |
| `.agent/rules/invoke-architecture-expert-fred.md` | Invoke architecture-expert-fred when changes touch builds, caching, PDF |
| `.agent/rules/invoke-architecture-expert-wilma.md` | Invoke architecture-expert-wilma when changes touch .agent/, plans, PDR |
| `.agent/rules/invoke-assumptions-expert.md` | Operationalises [ADR-146 (Assumptions Reviewer — Meta-Level Plan Assessm |
| `.agent/rules/invoke-code-experts.md` | Operationalises [ADR-114 (Layered Sub-agent Prompt Composition)](../../d |
| `.agent/rules/invoke-config-expert.md` | Invoke config-reviewer when changes touch build or runtime config, scrip |
| `.agent/rules/invoke-design-system-expert.md` | Invoke design-system-reviewer when changes touch shared visual language: |
| `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` | Operationalises owner-stated standing doctrine: *"for all significant do |
| `.agent/rules/invoke-docs-adr-expert.md` | Invoke docs-adr-reviewer when changes add or alter ADRs, EDRs, README co |
| `.agent/rules/invoke-editor.md` | Invoke editor when changes alter public-facing copy, CV or front-page co |
| `.agent/rules/invoke-pkg-expert.md` | Invoke pkg-reviewer when changes touch entity models, content/, lib/pkg, |
| `.agent/rules/invoke-react-component-expert.md` | Invoke react-component-reviewer when changes touch app/, components/, ho |
| `.agent/rules/invoke-security-expert.md` | Invoke security-reviewer when changes touch headers, secrets, env loadin |
| `.agent/rules/invoke-subagent-architect.md` | Invoke subagent-architect when the reviewer roster, rules, skills, comma |
| `.agent/rules/invoke-test-expert.md` | Invoke test-reviewer when tests, test helpers, proof layers, harness con |
| `.agent/rules/invoke-type-expert.md` | Invoke type-reviewer when changes alter complex type flow, exported type |
| `.agent/rules/knowledge-preservation-over-fitness-warnings.md` | Never decline to write a napkin entry, distilled graduation, correction |
| `.agent/rules/lint-after-edit.md` | Operationalises [ADR-121 (Quality Gate Surfaces)](../../docs/architectur |
| `.agent/rules/liveness-heartbeat-cron.md` | Liveness is observable, or it is not. Where the [all-channels comms watc |
| `.agent/rules/local-broken-code-never-leaves.md` | Operationalises the **Local broken code never leaves** principle in [.ag |
| `.agent/rules/lockfile-rebuild-survivability.md` | Owner rule, verbatim (2026-07-25): **"all updates and overrides must be |
| `.agent/rules/loop-exit-criteria-required.md` | Every /loop, cron, scheduled wake-up, or other templated repeating invoc |
| `.agent/rules/markdown-code-blocks-must-have-language.md` | Operationalises [ADR-121 (Quality Gate Surfaces)](../../docs/architectur |
| `.agent/rules/monitor-branch-touched-files.md` | **Periodically check how many unique files the current branch has touche |
| `.agent/rules/napkin-always-active.md` | Read .agent/memory/distilled.md and .agent/memory/napkin.md before doing |
| `.agent/rules/never-commit-to-main.md` | Local main receives no commits, ever. main advances only via reviewed pu |
| `.agent/rules/never-disable-checks.md` | Operationalises [principles.md §Code Quality](../directives/principles.m |
| `.agent/rules/never-use-git-to-remove-work.md` | *_TRIGGER — the rule fires on TREE STATE plus COMMAND, never on intent:_ |
| `.agent/rules/new-rule-vs-pdr-clause.md` | When new doctrine substance arrives at write time, route it to the home |
| `.agent/rules/no-conditional-tests.md` | Operationalises [ADR-011 (Use Vitest for Testing)](../../docs/architectu |
| `.agent/rules/no-global-state-in-tests.md` | Tests MUST NOT read or mutate global state. Prohibited in ALL tests (uni |
| `.agent/rules/no-hedging-vocabulary.md` | Operationalises [PDR-044 §Carve-out vocabulary](../practice-core/decisio |
| `.agent/rules/no-moving-targets-in-permanent-docs.md` | Operationalises the **durability axis** of [PDR-105](../practice-core/de |
| `.agent/rules/no-parallel-long-lived-branches.md` | main is the sole integration point and the only place code is real. Bran |
| `.agent/rules/no-skipped-tests.md` | Do not leave it.skip, describe.skip, or any other skipped-test mechanism |
| `.agent/rules/no-speed-pressure.md` | There is no speed pressure in this work. Cycle landings, parallel agents |
| `.agent/rules/no-tombstones-for-removed-ideas.md` | Operationalises [principles.md §Strict and Complete](../directives/princ |
| `.agent/rules/no-type-shortcuts.md` | Do not disable the type system with as (except as const), any, or non-nu |
| `.agent/rules/no-unbounded-host-load.md` | The host machine is a shared substrate: the owner's computer, every live |
| `.agent/rules/no-verify-requires-fresh-authorisation.md` | Operationalises [.agent/directives/principles.md § Code Quality](../dire |
| `.agent/rules/no-warning-toleration.md` | Operationalises [principles.md §Code Quality](../directives/principles.m |
| `.agent/rules/owner-attention-at-action-moments.md` | Operationalises [PDR-056 (Inter-Agent Collaboration Protocol)](../practi |
| `.agent/rules/per-user-memory-is-a-buffer.md` | Operationalises [PDR-124 (Definition-Surface Context Economy) §Decision |
| `.agent/rules/permanent-doc-is-the-consolidation-record.md` | Operationalises PDR-011 (capture → distil → graduate → enforce; the perm |
| `.agent/rules/ping-before-escalate.md` | Before broadcasting a retirement-detection event about another agent, cr |
| `.agent/rules/plan-body-first-principles-check.md` | Before authoring a plan, acceptance criterion, outcome, or status — or a |
| `.agent/rules/pr-comments-resolve-and-recheck.md` | A pull request is not done — not ready to merge, not to be reported as r |
| `.agent/rules/practice-core-portability.md` | Anything under .agent/practice-core/ (the trinity, entry points, CHANGEL |
| `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md` | Composes with [invoke-code-experts.md](invoke-code-experts.md) and the [ |
| `.agent/rules/pre-merge-divergence-analysis.md` | Operationalises [ADR-121 (Quality Gate Surfaces)](../../docs/architectur |
| `.agent/rules/precedence-is-not-approval.md` | That a thing was decided, annotated, graduated, labelled, routed, or don |
| `.agent/rules/present-verdicts-not-menus.md` | Operationalises the standing feedback memories feedback_no_responsibilit |
| `.agent/rules/re-apply-first-question-at-elaboration-boundaries.md` | The first question — *could it be simpler without compromising quality o |
| `.agent/rules/read-agent-md.md` | At session start, read .agent/directives/AGENT.md and .agent/directives/ |
| `.agent/rules/read-before-asking.md` | When a question is **empirical** — its answer is a fact about repo state |
| `.agent/rules/read-diagnostic-artefacts-in-full.md` | Operationalises [PDR-016 (Claim Propagation and Reference Quality)](../p |
| `.agent/rules/read-nextjs-docs-before-coding.md` | Owner-directed (2026-07-02). Training-data knowledge of Next.js is stale |
| `.agent/rules/records-are-technical-not-emotional.md` | Every durable record an agent writes about the owner or a session's even |
| `.agent/rules/register-active-areas-at-session-open.md` | Before any edit in this session, list the areas you intend to touch. For |
| `.agent/rules/register-identity-on-thread-join.md` | Before any edit in this session, list every thread this session will tou |
| `.agent/rules/render-the-reference-before-reproducing.md` | Reproduction work builds against pixels it has seen. Any work whose acce |
| `.agent/rules/replace-dont-bridge.md` | Operationalises [principles.md §Architectural Excellence Over Expediency |
| `.agent/rules/respect-active-agent-claims.md` | Operationalises the area-consultation tripwire from [agent-collaboration |
| `.agent/rules/review-feedback-defaults-to-triage.md` | Review feedback on a PR is information about the artefact, not an obliga |
| `.agent/rules/route-blocks-and-questions-to-director.md` | In a team session, the sitting Director is the single escalation interfa |
| `.agent/rules/rules-have-no-exceptions.md` | Operationalises [principles.md §Strict and Complete](../directives/princ |
| `.agent/rules/scope-from-goal-before-approach.md` | Operationalises [PDR-103](../practice-core/decision-records/PDR-103-scop |
| `.agent/rules/sha-prefix-in-collaboration-content.md` | When writing a git commit SHA into ANY collaboration surface authored du |
| `.agent/rules/ship-independent-coordinate-dependent.md` | Operationalises [PDR-077 (Marshal as Cycle Discipline)](../practice-core |
| `.agent/rules/silence-is-never-liveness.md` | Silence from a watcher, monitor, or background task is never evidence th |
| `.agent/rules/skill-naming-and-description-quality.md` | Every skill carries a semantically useful name and a high-quality descri |
| `.agent/rules/source-is-typescript-esm-only.md` | All source code in this repository MUST be TypeScript unless absolutely |
| `.agent/rules/stage-by-explicit-pathspec.md` | We stage files for commit by naming them explicitly. Wildcard staging (g |
| `.agent/rules/strict-validation-at-boundary.md` | Operationalises [ADR-032 (External Boundary Validation)](../../docs/arch |
| `.agent/rules/subagent-practice-core-protection.md` | **Substantive authority**: [PDR-003 — Sub-Agent Protection of Foundation |
| `.agent/rules/tdd-for-refactoring.md` | Operationalises [ADR-011 (Use Vitest for Testing)](../../docs/architectu |
| `.agent/rules/test-immediate-fails.md` | Any single item below is an **immediate fail** — the test is rejected wi |
| `.agent/rules/third-party-skills-require-security-review.md` | No third-party skill, skill pack, or plugin enters this estate — by vend |
| `.agent/rules/tsdoc-and-documentation-hygiene.md` | Keep exported functions and non-trivial internal logic documented with T |
| `.agent/rules/unattended-seats-never-prompt.md` | Operationalises ADR-210's PDR-044 trip-list contract (the Bash guard's t |
| `.agent/rules/use-agent-comms-log.md` | Before starting work on any non-trivial edit, append a timestamped comms |
| `.agent/rules/use-built-agent-tools-cli.md` | When invoking any agent-tools CLI (agent-identity, collaboration-state, |
| `.agent/rules/use-monitor-for-event-driven-wake.md` | For any long-running command whose output should drive agent wake-ups (c |
| `.agent/rules/use-result-pattern.md` | Use Result<T, E> for error handling. Never throw exceptions. Errors are |
| `.agent/rules/validate-full-target-estate.md` | Operationalises [PDR-020 (Check-Driven Development)](../practice-core/de |
| `.agent/rules/validators-must-recompute-not-just-record.md` | A validator that _stores_ a derived value (content hash, file fingerprin |
| `.agent/rules/verify-data-supports-shape-before-building.md` | Operationalises [ADR-038 (Compilation-Time Revolution)](../../docs/archi |
| `.agent/rules/verify-dont-trust.md` | Operationalises [PDR-011](../practice-core/decision-records/PDR-011-cont |
| `.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md` | When a plan body pins the call shape of an external dependency — an npm |
| `.agent/rules/visual-verdicts-require-rendered-proof.md` | Owner-ruled (2026-08-13, in-chat, verbatim): "verdicts on visual design |
| `.agent/rules/worktree-hygiene.md` | **TRIGGER — the rule fires at CLAIM-OPEN and at the FIRST SOURCE EDIT, n |
| `.agent/rules/worktree-residency.md` | **Owner directive (2026-07-31, verbatim substance):** when an agent is w |
