# Napkin

## Session: 2026-02-18 — EDRs, Editor Sub-Agent, Documentation Architecture

### What Was Done

- Created Editorial Decision Records (EDRs) as the editorial counterpart to ADRs. Five EDRs capture key decisions from the experience editorial session: Oak data description, show don't justify, ecosystem removal, enabling vision, and Oak P3 rewrite rationale.
- Trimmed identity.md to genuinely sensitive material — factual Oak context moved to EDRs.
- Created read-only editor sub-agent and /jc-editor command. First invocation found seven new items (15–21) added to experience editorial plan.
- Created quality-gates skill with full six-gate sequence and restart discipline.
- Updated AGENT.md with Editorial Tools section, project structure, and essential links.
- Updated knowledge graph plan: Oak entity has institutional description and reference links; services modelled as schema:WebAPI distinct from software; sameAs convention for organisations.
- Updated jc-gates command to match current reality (Playwright set up, knip/gitleaks in sequence).
- Added napkin, distillation, deslop skills and consolidate-docs command. Reset memory files for this project.

### Patterns to Remember

- EDRs preserve editorial decisions permanently; plans are ephemeral. Content that functions as documentation must be moved to permanent locations.
- The editor sub-agent is read-only — it provides structured feedback (must fix / should fix / consider), the calling agent applies it.
- "Live national public service" for general audience; "operationally independent arms-length body of DfE" for knowledge graph entity description.
- Oak Curriculum API is a schema:WebAPI offered by the organisation; SDK/MCP is schema:SoftwareSourceCode that Jim created — distinct entities with different relationships.
