import { existsSync } from 'node:fs';

import { collectIgnoredPaths } from '../core/repository-paths.js';
import { finding } from './finding.js';
import { absolutePath } from './live-types.js';
import { type SubstrateFinding } from './types.js';

/**
 * Presence of an instance-tier substrate surface.
 *
 * The collaboration state's instance tier (the claims registries, the comms
 * events, the generated shared-comms-log render) is untracked by design: one
 * checkout's live coordination, preserved on disk and never carried in git
 * (`.agent/state/README.md`). A fresh checkout — a worktree, CI — therefore
 * has none of it, and a gate that read absence as failure would prove the
 * local disk, not the repository. The tier is derived from the repository's
 * own declaration, its ignore rules, never from a hand-kept list: an absent
 * surface that git ignores is absent by design and is reported as
 * informational; an absent surface that git would track is a real gap and
 * falls through to the reader, which fails loudly.
 *
 * The probes are injectable so the evaluators stay testable over a temp tree
 * that is not a git repository.
 *
 * @packageDocumentation
 */

/** Filesystem and ignore-rule probes the presence classifier asks. */
export interface InstanceTierProbes {
  /** Whether the absolute path exists on disk. */
  readonly exists: (path: string) => boolean;
  /** Whether the repository's ignore rules ignore the repo-relative path. */
  readonly isIgnored: (repoRoot: string, repoRelativePath: string) => boolean;
}

/**
 * The live probes: the disk and `git check-ignore` by the repository's rules.
 *
 * The ignore probe runs without the index (`--no-index`), so it answers "would
 * the rules ignore this path", not "is this path untracked". A surface that
 * were tracked, matched an ignore pattern, and had been deleted locally would
 * therefore read absent-by-design. No such surface exists (the three
 * instance-tier surfaces are untracked by declaration, and
 * `git ls-files -i -c --exclude-standard` is empty); the assumption is named
 * here so a future tracked-and-ignored surface reopens it.
 */
export const liveInstanceTierProbes: InstanceTierProbes = {
  exists: existsSync,
  isIgnored: (repoRoot, repoRelativePath) =>
    collectIgnoredPaths(repoRoot, [repoRelativePath]).has(repoRelativePath),
};

/** Where a surface stands on this checkout. */
export type SurfacePresence = 'present' | 'absent-by-design' | 'absent';

/**
 * Classify a surface's presence on this checkout.
 *
 * @param repoRoot - Repository root the surface path is relative to.
 * @param repoRelativePath - The surface's repo-relative POSIX path.
 * @param probes - The disk and ignore-rule probes.
 * @returns `present` when the file exists; `absent-by-design` when it does not
 * and the repository's ignore rules ignore it (instance tier); `absent`
 * otherwise.
 */
export function classifySurfacePresence(
  repoRoot: string,
  repoRelativePath: string,
  probes: InstanceTierProbes,
): SurfacePresence {
  if (probes.exists(absolutePath(repoRoot, repoRelativePath))) {
    return 'present';
  }
  return probes.isIgnored(repoRoot, repoRelativePath) ? 'absent-by-design' : 'absent';
}

/**
 * The informational finding for an instance-tier surface this checkout does
 * not carry. Repair is deterministic: seeding (the registries) or the first
 * write (the render) creates it.
 *
 * @param surface - The substrate surface id.
 * @param repoRelativePath - The absent surface's repo-relative path.
 * @returns The finding.
 */
export function instanceTierAbsentFinding(
  surface: string,
  repoRelativePath: string,
): SubstrateFinding {
  return finding({
    id: 'instance-tier-surface-absent',
    surface,
    severity: 'informational',
    repair: 'deterministic',
    message:
      `Instance-tier surface ${repoRelativePath} is absent on this checkout: untracked by the ` +
      "repository's ignore rules, created by seeding or the first write, validated when present.",
    evidence: [repoRelativePath],
  });
}
