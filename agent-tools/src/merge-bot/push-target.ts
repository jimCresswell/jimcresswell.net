import { DEFAULT_BRANCH_NAMES } from './branch-arg.js';

/**
 * The typed refusals, by target branch name — whether the name came from git or from --branch.
 *
 * @param branch - The branch `merge-bot push` would push to.
 * @returns Why the push is refused, or undefined when the target is a branch it may push.
 */
export function refuseTargetBranch(branch: string): string | undefined {
  if (branch === 'HEAD') {
    return 'HEAD is detached — there is no branch to push; check a branch out, or name the target with --branch';
  }
  if (DEFAULT_BRANCH_NAMES.has(branch)) {
    return `"${branch}" is a default branch — changes reach it through a pull request, never a direct push`;
  }
  return undefined;
}
