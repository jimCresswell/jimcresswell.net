# Prompt Estate

Prompt files carry stateful session-entry context for active workstreams.
Ground first via `start-right-quick` or `start-right-thorough`; prompts should
preserve state and next-task truth rather than restate the full grounding
workflow.

## Active prompts

| Workstream               | Status       | Prompt                                                                                                                                                                                   | Notes                                                     |
| ------------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Session continuity       | Active       | [session-continuation.prompt.md](session-continuation.prompt.md)                                                                                                                         | Canonical queue and thread-selection prompt               |
| Personal knowledge graph | In progress  | [personal-knowledge-graph/personal-knowledge-graph-track-b-source-of-truth-design.prompt.md](personal-knowledge-graph/personal-knowledge-graph-track-b-source-of-truth-design.prompt.md) | Track B Phase B2.1 design handoff                         |
| LinkedIn                 | Owner-active | [editorial/linkedin-content-preparation.prompt.md](editorial/linkedin-content-preparation.prompt.md)                                                                                     | Private-plan authority; public routing and safety only    |
| Dev-tooling hygiene      | Ready        | [dev-tooling/dev-tooling-hygiene.prompt.md](dev-tooling/dev-tooling-hygiene.prompt.md)                                                                                                   | Dependency refresh and `dependency-cruiser` gate adoption |

## Retained completed prompts

| Workstream                       | Status    | Prompt                                                                                                                                                                                             | Why retained                                                  |
| -------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Personal knowledge graph Track A | Completed | [archive/personal-knowledge-graph/personal-knowledge-graph-track-a-cv-metadata-proof.prompt.md](archive/personal-knowledge-graph/personal-knowledge-graph-track-a-cv-metadata-proof.prompt.md)     | Completion record for the `/cv` metadata proof slice          |
| Personal knowledge graph Track A | Completed | [archive/personal-knowledge-graph/personal-knowledge-graph-track-a-external-validation.prompt.md](archive/personal-knowledge-graph/personal-knowledge-graph-track-a-external-validation.prompt.md) | Completion record for the external-validator boundary closure |
| Tilt retirement                  | Completed | [archive/cv/tilt-retirement.prompt.md](archive/cv/tilt-retirement.prompt.md)                                                                                                                       | Completion record; ADR-021 owns current route truth           |

## Archive

`archive/` holds completed prompts kept for continuity and completion history.
Treat archived prompts as historical records; active handoff should come from
the prompt listed in the active table above.
