/**
 * Portability-validator consumer of the shared skills-tree topology walker
 * (`skills-adapter-generate/skill-tree-walk.ts` — the canonical owner of
 * the three-tier shape, consolidated at its second consumer, 2026-08-10).
 * This consumer collects existing canonical paths for
 * frontmatter/classification validation; dead-end directories are the
 * adapter checker's loud-skip territory, not this validator's.
 */

import { err, ok, type Result } from '@engraph/result';

import { toLfText } from '../../core/lf-text.js';
import type { FsRead } from '../../skills-adapter-generate/carriage-fs.js';
import { walkSkillTree } from '../../skills-adapter-generate/skill-tree-walk.js';

/**
 * The file-system seam the walk reads through, repo-relative. Every read is typed: a
 * listing that fails for any reason, absence included, is a failure (an unlisted tier is
 * never an empty one; an absent skills root is never "no skills"), and the canonical read is
 * the fd-anchored no-follow read, `undefined` when nothing regular of ours stands at the
 * name (a link, a directory, nothing), a failure for anything else (the #74 round-four
 * findings, 2026-09-14).
 */
export interface SkillsWalkFs {
  listSubdirs(relPath: string): Promise<FsRead<readonly string[]>>;
  readRegularFileTextNoFollow(relPath: string): Promise<FsRead<string | undefined>>;
}

/** One canonical skill file: its repo-relative path and the LF text the walk read. */
export interface CanonicalSkill {
  readonly path: string;
  readonly text: string;
}

export interface CanonicalSkillWalk {
  /** The canonicals in walk order, each with the text read at the probe, so the frontmatter
   * check re-opens nothing. */
  readonly canonicals: readonly CanonicalSkill[];
}

/** A typed read failure carried across the walker, which has no outcome channel of its own. */
class WalkFailure extends Error {}

function valueOf<T>(read: FsRead<T>): T {
  if (read.kind === 'failure') {
    throw new WalkFailure(read.message);
  }
  return read.value;
}

/**
 * Collect every canonical `SKILL-CANONICAL.md` at the three ratified tiers, so frontmatter
 * validation sees the same corpus the adapter generator serves. Any read failure (a listing,
 * a canonical open) is the one refusal, naming the cause, never a throw past the validator
 * (the #74 round-two finding, 2026-09-14). The text is kept at the probe: the walker calls
 * the probe and the handler for one directory back to back, and the probe is the read.
 */
export async function collectCanonicalSkillPaths(
  fs: SkillsWalkFs,
): Promise<Result<CanonicalSkillWalk, string>> {
  const canonicals: CanonicalSkill[] = [];
  try {
    await walkSkillTree(
      {
        listChildDirectories: async (relativeDir) =>
          valueOf(
            await fs.listSubdirs(
              relativeDir === '' ? '.agent/skills' : `.agent/skills/${relativeDir}`,
            ),
          ),
        hasCanonical: async (relativeDir) => {
          const canonicalPath = `.agent/skills/${relativeDir}/SKILL-CANONICAL.md`;
          const text = valueOf(await fs.readRegularFileTextNoFollow(canonicalPath));
          if (text === undefined) {
            return false;
          }
          canonicals.push({ path: canonicalPath, text: toLfText(text) });
          return true;
        },
      },
      { onCanonical: () => undefined },
    );
  } catch (error: unknown) {
    const cause = error instanceof Error ? error.message : String(error);
    return err(`.agent/skills: the canonical walk failed (${cause}); skill validation skipped`);
  }
  return ok({ canonicals });
}
