import { existsSync } from 'node:fs';

import { collectIgnoredPaths, collectTrackedPaths } from '../core/repository-paths.js';
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
  /**
   * Whether the repo-relative path is instance tier by the repository's own
   * declaration: ignored by its rules and not tracked.
   */
  readonly isIgnored: (repoRoot: string, repoRelativePath: string) => boolean;
}

/**
 * The live probes: the disk, and the repository's own tier declaration.
 *
 * A surface is instance tier when the repository's rules ignore it AND git
 * does not track it. The ignore probe alone runs without the index
 * (`--no-index`) and answers "would the rules ignore this path", so a tracked
 * file that matched a pattern and was deleted locally would otherwise read
 * absent-by-design; the tracked-tree check closes that hole structurally
 * rather than by assumption.
 */
export const liveInstanceTierProbes: InstanceTierProbes = {
  exists: existsSync,
  isIgnored: (repoRoot, repoRelativePath) =>
    !collectTrackedPaths(repoRoot).has(repoRelativePath) &&
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
 * The blocking finding for a surface the repository would track and which is
 * nonetheless absent: a real gap, named with its path, never an errno
 * escaping the evaluator. Repair carries provenance because the surface is
 * shared state, not a generated artefact.
 *
 * @param surface - The substrate surface id.
 * @param repoRelativePath - The absent surface's repo-relative path.
 * @returns The finding.
 */
export function missingSurfaceFinding(surface: string, repoRelativePath: string): SubstrateFinding {
  return finding({
    id: 'missing-surface',
    surface,
    severity: 'blocking',
    repair: 'manual-with-provenance',
    message: `Surface ${repoRelativePath} is absent and the repository's rules would track it; restore it from history or the writer that owns it.`,
    evidence: [repoRelativePath],
  });
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
