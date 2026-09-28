import { err, ok, type Result } from '@engraph/result';

import { classifyCasOutcome, type CasOutcome, type PlannedDelete } from './retire-decision.js';
import { gitFailure, runGit, type RetireGit } from './retire-git-read.js';
import { gitWords, parseRefListing, REF_LISTING_FORMAT } from './retire-parse.js';
import { describeGitChildEnd } from './push-git.js';

/**
 * The retire command's local writes. Each delete is a compare-and-swap
 * (`update-ref --no-deref -d <ref> <expected>`) of a ref the decision
 * planned, so a ref that moved after its proof is kept, never deleted, and a
 * symbolic ref is never followed to the ref it points at: `--no-deref`
 * deletes the symbolic ref itself, even one that appears between the listing
 * and the delete (the decision refuses symbolic refs it lists). git exits 1 when the ref is already gone,
 * when it has moved and when it cannot be locked, so a failed delete is
 * classified by re-reading the exact ref, never by git's text.
 */

/** Delete one planned ref by compare-and-swap, and report what it left. */
export async function deletePlannedRef(
  retire: RetireGit,
  target: PlannedDelete,
): Promise<Result<CasOutcome, Error>> {
  const deleted = await runGit(retire, [
    'update-ref',
    '--no-deref',
    '-d',
    target.ref,
    target.expectedSha,
  ]);
  const detail = `git ${describeGitChildEnd(deleted)}: ${gitWords(deleted.stderr)}`;
  if (deleted.status === 0) {
    return ok(classifyCasOutcome(target, { exitedClean: true, rereadSha: undefined, detail }));
  }
  const reread = await runGit(retire, ['for-each-ref', REF_LISTING_FORMAT, target.ref]);
  if (reread.status !== 0) {
    return err(gitFailure(`re-reading ${target.ref} after its delete failed`, reread));
  }
  const rereadSha = parseRefListing(reread.stdout).get(target.ref)?.sha;
  return ok(classifyCasOutcome(target, { exitedClean: false, rereadSha, detail }));
}

/**
 * The config-key pattern for exactly this branch's section: its dots are
 * escaped (the only regex character a retirable name holds), and the key's
 * last part holds none, so retiring `a` never matches `branch.a.b.remote`
 * (the section of a branch named `a.b`).
 */
function sectionPattern(branch: string): string {
  return String.raw`^branch\.${branch.replaceAll('.', String.raw`\.`)}\.[^.]+$`;
}

/**
 * Remove `branch.<name>` from the repository config while no local branch
 * has the name, as `git branch -d` removes it with the branch.
 * `update-ref -d` leaves it, and a later branch of the same name would
 * silently inherit the old upstream. The local branch is read again just before the removal,
 * by its exact name, so a branch made since the proof keeps its section: the
 * window is git's own. No section is not a failure. Only the repository's
 * own file is read (`--local`), the one `--remove-section` writes: a section
 * in a global or included file is not the repository's.
 */
export async function removeBranchConfig(
  retire: RetireGit,
  branch: string,
): Promise<Result<undefined, Error>> {
  const local = `refs/heads/${branch}`;
  const reread = await runGit(retire, ['for-each-ref', REF_LISTING_FORMAT, local]);
  if (reread.status !== 0) {
    return err(gitFailure(`re-reading ${local} before its config removal`, reread));
  }
  if (parseRefListing(reread.stdout).has(local)) {
    return ok(undefined);
  }
  const listed = await runGit(retire, [
    'config',
    '--local',
    '--name-only',
    '--get-regexp',
    sectionPattern(branch),
  ]);
  if (listed.status === 1) {
    return ok(undefined);
  }
  if (listed.status !== 0) {
    return err(gitFailure(`reading branch.${branch}'s config`, listed));
  }
  const removed = await runGit(retire, ['config', '--remove-section', `branch.${branch}`]);
  return removed.status === 0
    ? ok(undefined)
    : err(gitFailure(`removing branch.${branch}'s config`, removed));
}
