Read @.agent/directives/rules.md and @.agent/directives/testing-strategy.md , and take to heart that it is encouraged to take a step back and consider if work is delivering value through impact at the system level, not just fixing the problem right in front of you. Identify and question assumptions. Even before the First Question, ask, are we solving the right problem, at the right layer? Any generated plans must include regularly re-reading and re-committing to those foundation documents.

**Commit** to excellence in systems architecture, software engineering, and developer experience. Choose architectural correctness over short-term expediency. This requires critical and _long-term_ thinking.

After each piece of work, the full quality gate suite must be run one gate at a time, and analysis of issues must wait until all gates are complete. Analysis must include asking if there are fundamental architectural issues or opportunities for improvement.

All plans must include instructions to create comprehensive TSDoc (general on all logic and state, with additional extensive examples on public interfaces) and markdown documentation such as READMEs.

Always ask, "what value are we delivering, through what impact for which users?"

Do not assume you know what the initial step should be, discuss with the user first.

Quality gates: `pnpm check` runs all six gates. `pnpm test:e2e` runs E2E tests separately. See rules.md (Code Quality section) for the full sequence and correct command names.
