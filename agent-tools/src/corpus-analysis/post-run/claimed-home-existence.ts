/**
 * Restored from the lineage at pin `e477e62f7` on 2026-09-14 (practice-completion closure
 * item 4, row 3); the lineage's result and safe-path packages read here as `@engraph/result`
 * and `@engraph/safe-path`.
 */
import { statSync } from 'node:fs';
import { resolve } from 'node:path';

import { assertPathWithinBase, type AssertPathWithinBaseOptions } from '@engraph/safe-path';

import type { CorroborationClaim } from '../real-world-signal.js';

/**
 * Resolve which claimed corroboration homes genuinely exist on disk, anchored at the
 * repo root.
 *
 * @remarks
 * The meta stage claims repo-relative home paths (e.g. `.agent/rules/x.md`). Checking
 * them with a bare `existsSync` resolves against the process working directory — the
 * agent-tools workspace under the documented driver usage — so every real home reads
 * as missing. This helper anchors each claim at the supplied repo root instead, via
 * `assertPathWithinBase` exactly as the driver's checkpoint reads do (tssecurity:S8707
 * lineage): success proves the path both EXISTS (`realpathSync` throws on an absent
 * path) and stays CONTAINED within the repo root, so a claim that is absent or that
 * escapes the root is simply not corroborating — a discrepancy the caller surfaces,
 * never a crash.
 *
 * The returned set carries each claim's ORIGINAL path string, so downstream
 * set-membership against the claims themselves (`corroborateAgainstHomes`) matches.
 * Existence is canonicalisation-level: any on-disk entry (file or directory) counts,
 * matching the `existsSync` behaviour this replaces; claims are pipeline-internal
 * document paths from a committed, zod-validated checkpoint.
 *
 * @param input - The corroboration claims and the repo root to anchor them at.
 * @param options - The safe-path canonicalisation seam; tests inject a pure map.
 * @returns The claimed home paths that exist on disk within the repo root.
 */
export function existingClaimedHomePaths(
  input: {
    readonly claims: readonly CorroborationClaim[];
    readonly repoRoot: string;
  },
  options: ClaimedHomeOptions = {},
): ReadonlySet<string> {
  const existing = new Set<string>();
  for (const claim of input.claims) {
    for (const home of claim.claimedHomePaths) {
      if (claimedHomeExists({ home, repoRoot: input.repoRoot }, options)) {
        existing.add(home);
      }
    }
  }
  return existing;
}

/** The homes a corroboration claim may name: the prompt's two roots, and nothing else. */
const CORROBORATION_ROOTS = ['.agent/memory/active/patterns/', '.agent/rules/'] as const;

/** The existence seams: the safe-path realpath, and a regular-file check (default `statSync`). */
export interface ClaimedHomeOptions extends AssertPathWithinBaseOptions {
  readonly isRegularFile?: (path: string) => boolean;
}

function isRegularFileOnDisk(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function claimedHomeExists(
  input: { readonly home: string; readonly repoRoot: string },
  options: ClaimedHomeOptions,
): boolean {
  // A claim outside the two roots the prompt names (`.git/HEAD`, a directory, an unrelated
  // file) is never corroboration, existing or not, and containment is asserted against the
  // matched root, so a parent segment or a symlink after the prefix cannot leave it either
  // (#86 round two).
  const matchedRoot = CORROBORATION_ROOTS.find((candidate) => input.home.startsWith(candidate));
  if (matchedRoot === undefined) {
    return false;
  }
  const isRegularFile = options.isRegularFile ?? isRegularFileOnDisk;
  try {
    const safePath = assertPathWithinBase(
      resolve(input.repoRoot, input.home),
      resolve(input.repoRoot, matchedRoot),
      options,
    );
    return isRegularFile(safePath);
  } catch {
    // Absent on disk or escaping the repo root — either way the claim is not
    // corroborating; the caller reports it as a missing claim.
    return false;
  }
}
