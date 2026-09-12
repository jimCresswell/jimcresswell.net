---
fitness_line_target: 90
fitness_line_limit: 120
fitness_char_limit: 7000
fitness_line_length: 100
split_strategy: Split recovery detail from the day-to-day trust-boundary contract
---

# Private editorial workspace

The LinkedIn and professional-identity work uses source material that includes PII, private
biographical evidence and psychologically sensitive analysis. The public repository needs enough
information to route the work safely, but must not expose the material, its history or its access
pattern.

## Boundary

The private working surface is an ignored nested Git repository at
`.agent/reference-local/editorial-private/`. It contains source packs, evidence, drafts,
collaboration records, editorial history and recovery artefacts. Its own README is the local entry
point.

The parent repository deliberately does not use a Git submodule. A submodule would publish the
private repository's remote, selected commit and update cadence through the public tree. The nested
repository must remain ignored and independently access-controlled.

Public Git may contain only:

- general editorial policy, audience strategy and composition standards;
- public-safe routing and status;
- content already public, or content Jim has explicitly authorised for this public repository; and
- technical recovery principles that reveal no private source or repository metadata.

Do not copy private source text, analysis, drafts, collaboration history, repository URLs, commit
identifiers or custody manifests into the parent repository.

## Working contract

Before private editorial work:

1. Confirm the nested repository exists, is clean, has no local-only commit, and its remote is still
   private.
2. Read its README and current handoff before opening source material.
3. Make draft and evidence changes only inside the nested repository.
4. Commit and push meaningful private changes before a risky public operation or session end.
5. Move copy only to the destination Jim has approved; do not use the public parent as a staging
   surface for LinkedIn copy.

Git ignore is not a complete tooling boundary. Formatters, recursive searches, archive commands and
agent utilities may enter ignored directories. Exclude `.agent/reference-local/` explicitly from
whole-repository tooling unless the task is intentionally operating on the private repository.

## Public-history recovery

If private material reaches public history, stop publication work and conserve before removing
anything. The recovery set must cover:

- every local Git ref, the object database, reflogs and index;
- tracked, staged, unstaged, untracked and ignored content;
- all worktrees and any external local sources needed to reconstruct the state;
- pull-request records, synthetic merge refs and checks not present in the local clone; and
- checksums, read-back, bundle verification and a fresh private clone.

Quiesce the affected multi-agent session before the final capture. Build the scrubbed replacement
in an isolated clone against the exact intended parent. Scan the candidate for the disclosed path
and content classes, run the complete gates, and sign the replacement commit.

Move the public ref only with an exact `--force-with-lease` naming the observed old head. Then
verify a fresh public clone, the live pull request, regenerated CI and the absence of sensitive
path families. Record the hosting-provider cache limitation: a history rewrite reduces normal
reachability but is not proof of server-side erasure.

The exact recovery inventory, hashes, historical refs and private repository metadata belong only
in the private custody record.
