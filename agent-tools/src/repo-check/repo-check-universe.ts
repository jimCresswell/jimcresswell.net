import { parseNulSeparatedPaths, parseSymlinkPaths, withoutSymlinks } from './repo-check-files.js';
import type { RepoCheckRuntime } from './repo-check-types.js';

/**
 * The file universes the root gates read, both git's: the staged set for the
 * pre-commit hook and the tracked tree for the root gates. The names never
 * come from a disk walk, so a gate reads the same file list on every checkout
 * and in CI (`repo-check-files.ts` carries the reasoning and the pure mapping
 * this module composes); each gate then reads what it needs of the files git
 * names.
 *
 * @packageDocumentation
 */

/** Ask git for a NUL-separated path list, failing loudly when git does. */
function gitPaths(
  runtime: RepoCheckRuntime,
  args: readonly string[],
  what: string,
): readonly string[] {
  const result = runtime.runCaptured('git', [...args, '-z']);
  if ((result.status ?? 1) !== 0) {
    throw new Error(
      result.stderr.trim() || `git ${args[0] ?? ''} failed while discovering ${what}`,
    );
  }
  return parseNulSeparatedPaths(result.stdout);
}

/**
 * Repo-relative paths of index entries that are symbolic links (mode 120000,
 * e.g. the .claude/skills adapters pointing at .agents/skills external-skill
 * content). They carry no formattable content of their own: the linked target
 * is checked under its real path, and prettier refuses symlink paths outright.
 */
function indexSymlinkPaths(runtime: RepoCheckRuntime): ReadonlySet<string> {
  const result = runtime.runCaptured('git', ['ls-files', '--cached', '-s', '-z']);
  if ((result.status ?? 1) !== 0) {
    throw new Error(result.stderr.trim() || 'git ls-files failed while discovering symlinks');
  }
  return parseSymlinkPaths(result.stdout);
}

/** The files staged for the next commit (added, copied, modified, renamed). */
export function stagedFiles(runtime: RepoCheckRuntime): readonly string[] {
  const names = gitPaths(
    runtime,
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
    'staged files',
  );
  return withoutSymlinks(names, indexSymlinkPaths(runtime));
}

/**
 * Every tracked file: the repository's own answer to "what exists here", the
 * same on every checkout and in CI. A disk walk would instead lint whatever
 * this machine happens to carry (a generated read model, an editor's workspace
 * file) and prove the machine, not the repository.
 *
 * A tracked file deleted from the working tree, or replaced there by a
 * symlink, but not yet staged is still a regular index entry, so `ls-files`
 * names it and the tool would fail on a missing file or refuse the link.
 * Git's own unstaged-diff answer (deleted and type-changed paths) removes
 * those, so the list itself never comes from probing the disk.
 */
export function trackedFiles(runtime: RepoCheckRuntime): readonly string[] {
  const names = gitPaths(runtime, ['ls-files'], 'tracked files');
  const goneFromWorkingTree = new Set(
    gitPaths(
      runtime,
      ['diff', '--name-only', '--diff-filter=DT'],
      'tracked files deleted or retyped in the working tree',
    ),
  );
  return withoutSymlinks(
    names.filter((name) => !goneFromWorkingTree.has(name)),
    indexSymlinkPaths(runtime),
  );
}
