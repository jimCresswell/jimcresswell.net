# Operator-profile whole-path guard: built, probed, parked

Parked on 2026-09-28. The patch beside this note is a complete, tested implementation of a guard
that does not ship. It is kept as the starting point for the core-primitive option below.

## The gap

The operator-profile reader opens a document with `O_NOFOLLOW`, which refuses a symbolic link at
the document itself only. A directory above it (`repos/`, `machines/`), or the profile root,
swapped for a link between the listing and the read, is followed. Live probes read a file outside
the root this way on macOS and on Linux.

## What was built

[`whole-path-guard.patch`](whole-path-guard.patch) applies to `main` at `67bc75ecb7` (checked
with `git apply --cached --check` against that tree). It changes six files under `agent-tools/`:

- `core/no-follow-read.ts`: an open-flag bit record, `O_NOFOLLOW_ANY` (`0x20000000`, macOS 11
  and later), and two flag compositions, final-component and whole-path.
- The reader takes a required host record:
  - **macOS** opens with `O_NOFOLLOW_ANY`, which refuses a link at any component.
  - **Linux** compares the descriptor's `/proc/self/fd` path, as bytes, with the path it opened.
  - **Every other host** refuses to read a present profile.
- The report resolves the root's parent once and keeps the root's own name, so a root swapped
  for a link is refused at every read, never resolved into.
- Tests, whose fake kernels key on fixed bits. Seven mutants, one per claim, were all killed.

## Probes

| Case | Base reader | Guard, macOS (Darwin 25.6.0) | Guard, Linux (7.0.12-linuxkit) |
| --- | --- | --- | --- |
| a clean path | reads | reads | reads |
| `repos/` swapped for an absolute link | reads the outside file | `ELOOP` | refused (descriptor path differs) |
| `repos/` swapped for a relative link | — | — | refused |
| the root swapped for a link | reads the outside file | `ELOOP` | refused |
| a fifo | — | refused before any read | refused before any read |

Both kernels ran Node 24.21.0. The Linux kernel suffixes an unlinked file's descriptor path with
`(deleted)`, so that path never equals the one opened.

## Why it was parked

A solution-class check rated the guard disproportionate, and the Director re-scoped the change:

- A same-user process gains nothing from a link, because it can write a conforming document
  directly.
- The one realistic source of a link that is not the operator's own is a pull from a compromised
  profile remote. Checking out with `core.symlinks=false` removes that source on every host: the
  runner now passes it on every call, and a smoke check proves a pulled link arrives as a plain
  file. The lineage's runner, which pulls the same shared profile, takes the same flag in its
  twin; until that lands, a lineage session's pull can still write a link there.
- The guard's price was the whole operator-profile surface on native Windows. Node reaches no
  whole-path primitive there.
- The same ancestor-swap boundary is already stated and accepted at the rule-surface, rule-sweep
  and declared-adapter readers, and at the rule-projection writer.

## The option it serves

If the owner or a later lane wants defence in depth, the right layer is one core primitive, such
as an `openRegularFileWithin(base, relative)`. Every no-follow consumer would move onto it,
starting with the rule-projection writer, where a swapped ancestor redirects writes. Rebuilding
it here in one module would add a third divergent shape. The row in the exchange node's review
dispositions (the archived node `practice-two-way-exchange`, §Review dispositions) tracks it.
