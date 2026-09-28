import { basename } from 'node:path';

import { err, ok, type Result } from '@engraph/result';

import { gitFailure, runGit, type RetireGit } from './retire-git-read.js';
import { parseWorktrees, type WorktreeEntry } from './retire-parse.js';

/**
 * Whether any worktree is using a branch `merge-bot retire` was asked to
 * delete. `update-ref -d` deletes a branch that is checked out, or that a
 * rebase or bisect in some worktree still names, where `git branch -d` would
 * refuse; so the command reads git's own state for every worktree and refuses
 * these itself.
 */

const WORKTREE_STATE_PATHS = [
  'rebase-merge/head-name',
  'rebase-apply/head-name',
  'BISECT_START',
  'rebase-merge/update-refs',
] as const;

/**
 * Reads a file's text: undefined when it does not exist, a failure when it
 * exists and cannot be read. An unreadable state file is never read as "not
 * in use": that would let a delete through on a question left unanswered.
 */
export type ReadOptionalFile = (path: string) => Promise<Result<string | undefined, Error>>;

/**
 * The worktrees (by basename) using `branch`: checked out there, or named by
 * git's own rebase or bisect state in that worktree's private git directory.
 * `update-ref -d` deletes a branch in any of these states, where
 * `git branch -d` would refuse, so the command refuses them itself.
 */
export async function worktreesUsing(
  retire: RetireGit,
  branch: string,
  readFile: ReadOptionalFile,
): Promise<Result<readonly string[], Error>> {
  const listed = await runGit(retire, ['worktree', 'list', '--porcelain']);
  if (listed.status !== 0) {
    return err(gitFailure('listing the worktrees', listed));
  }
  const using: string[] = [];
  for (const entry of parseWorktrees(listed.stdout)) {
    const inState =
      entry.branch === `refs/heads/${branch}`
        ? ok(true)
        : await stateOfListedWorktree(retire, entry, branch, readFile);
    if (!inState.ok) {
      return inState;
    }
    if (inState.value) {
      using.push(basename(entry.path));
    }
  }
  return ok(using);
}

/**
 * Whether a listed worktree's rebase or bisect state names the branch. Only
 * a worktree git marks prunable is skipped: its directory is gone, and its
 * branch line was already checked. Any other worktree that cannot be asked
 * (moved, unmounted, locked on removable media) keeps its state in the
 * common git directory until it is pruned, so the question is unanswered,
 * and an unanswered question is a failure, never "not in use".
 */
async function stateOfListedWorktree(
  retire: RetireGit,
  entry: WorktreeEntry,
  branch: string,
  readFile: ReadOptionalFile,
): Promise<Result<boolean, Error>> {
  if (entry.prunable) {
    return ok(false);
  }
  const paths = await runGit(retire, [
    '-C',
    entry.path,
    'rev-parse',
    '--path-format=absolute',
    ...WORKTREE_STATE_PATHS.flatMap((name) => ['--git-path', name]),
  ]);
  if (paths.status !== 0) {
    return err(
      gitFailure(`reading the rebase and bisect state of worktree ${basename(entry.path)}`, paths),
    );
  }
  const names = new Set([branch, `refs/heads/${branch}`]);
  for (const path of paths.stdout.split('\n').filter((line) => line !== '')) {
    const content = await readFile(path);
    if (!content.ok) {
      return content;
    }
    if (content.value?.split('\n').some((line) => names.has(line.trim())) === true) {
      return ok(true);
    }
  }
  return ok(false);
}
