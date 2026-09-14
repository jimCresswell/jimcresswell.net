/**
 * Portability-validator consumer of the shared skills-tree topology walker
 * (`skills-adapter-generate/skill-tree-walk.ts` — the canonical owner of
 * the three-tier shape, consolidated at its second consumer, 2026-08-10).
 * This consumer collects existing canonical paths for
 * frontmatter/classification validation; dead-end directories are the
 * adapter checker's loud-skip territory, not this validator's.
 */

import { err, ok, type Result } from '@engraph/result';

import { walkSkillTree } from '../../skills-adapter-generate/skill-tree-walk.js';

export interface SkillsWalkFs {
  listSubdirs(relPath: string): Promise<readonly string[]>;
  exists(relPath: string): Promise<boolean>;
}

export interface CanonicalSkillWalk {
  /** Repo-relative canonical paths for frontmatter validation. */
  readonly canonicalPaths: string[];
}

/**
 * Collect every canonical `SKILL-CANONICAL.md` at the three ratified tiers,
 * so frontmatter validation sees the same corpus the adapter generator
 * serves. A probe that fails for any reason other than absence (`exists`
 * throws past ENOENT) is the one refusal, naming the cause, never a throw
 * past the validator (the #74 round-two finding, 2026-09-14).
 */
export async function collectCanonicalSkillPaths(
  fs: SkillsWalkFs,
): Promise<Result<CanonicalSkillWalk, string>> {
  const walk: CanonicalSkillWalk = { canonicalPaths: [] };
  try {
    await walkSkillTree(
      {
        listChildDirectories: (relativeDir) =>
          fs.listSubdirs(relativeDir === '' ? '.agent/skills' : `.agent/skills/${relativeDir}`),
        hasCanonical: (relativeDir) => fs.exists(`.agent/skills/${relativeDir}/SKILL-CANONICAL.md`),
      },
      {
        onCanonical(relativeDir) {
          walk.canonicalPaths.push(`.agent/skills/${relativeDir}/SKILL-CANONICAL.md`);
        },
      },
    );
  } catch (error: unknown) {
    const cause = error instanceof Error ? error.message : String(error);
    return err(`.agent/skills: the canonical walk failed (${cause}); skill validation skipped`);
  }
  return ok(walk);
}
