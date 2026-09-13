/**
 * The repository's own answer to "does this path belong here?": the tracked
 * tree as git records it, and the paths git ignores by the repository's own
 * rules.
 *
 * Validators that resolve cited paths must not ask the local disk, because
 * the disk carries instance-tier state (comms events, claims, the private
 * boundary) that a CI checkout never has: a leg green locally and red in CI
 * is the "a green gate proves its own path" failure. The tracked set plus
 * the ignore rules is the same on every checkout, and class membership comes
 * from the repository's own definition (`validation-strategy` §Validation
 * jurisdiction), never from a hand-kept list.
 *
 * @packageDocumentation
 */

import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';

import { resolveTrustedGit } from './trusted-git.js';

const NUL = '\0';

/**
 * Every tracked path plus the directories they imply.
 *
 * Git tracks files rather than directories, but a directory exists on every
 * checkout when at least one tracked entry lives under it.
 *
 * @param repoRoot - Absolute path of the repository root.
 * @returns Repo-relative POSIX paths: each tracked file and each ancestor
 * directory below the root.
 */
export function collectTrackedPaths(repoRoot: string): ReadonlySet<string> {
  const stdout = execFileSync(resolveTrustedGit(), ['ls-files', '-z'], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return withImpliedDirectories(stdout.split(NUL).filter((item) => item.length > 0));
}

/**
 * The paths git ignores among the candidates, by the repository's ignore
 * rules. A directory is reported ignored when a file inside it would be:
 * `comms/*` ignores the directory's contents, and a citation of the
 * directory names exactly that untracked-by-design content.
 *
 * @param repoRoot - Absolute path of the repository root.
 * @param candidates - Repo-relative POSIX paths to test.
 * @returns The subset of `candidates` that git ignores, directly or through
 * the directory probe.
 */
export function collectIgnoredPaths(
  repoRoot: string,
  candidates: readonly string[],
): ReadonlySet<string> {
  if (candidates.length === 0) {
    return new Set();
  }
  const probes = candidates.map((candidate) => `${candidate}/__probe__`);
  const result = spawnSync(resolveTrustedGit(), ['check-ignore', '-z', '--stdin', '--no-index'], {
    cwd: repoRoot,
    encoding: 'utf8',
    input: [...candidates, ...probes].join(NUL) + NUL,
    maxBuffer: 64 * 1024 * 1024,
  });
  // Exit 1 means "none of the paths is ignored"; anything above is a git failure.
  if (result.status !== 0 && result.status !== 1) {
    throw new Error(`git check-ignore failed (exit ${String(result.status)}): ${result.stderr}`);
  }
  const ignored = new Set(result.stdout.split(NUL).filter((item) => item.length > 0));
  return new Set(
    candidates.filter(
      (candidate) => ignored.has(candidate) || ignored.has(`${candidate}/__probe__`),
    ),
  );
}

/**
 * Expand a list of file paths with every ancestor directory below the root.
 *
 * @param files - Repo-relative POSIX file paths.
 * @returns The files plus their implied directories.
 *
 * @example
 * ```ts
 * withImpliedDirectories(['a/b/c.md']); // Set { 'a/b/c.md', 'a/b', 'a' }
 * ```
 */
export function withImpliedDirectories(files: readonly string[]): ReadonlySet<string> {
  const paths = new Set<string>();
  for (const file of files) {
    const repoPath = file.split(path.sep).join('/');
    paths.add(repoPath);
    let parent = path.posix.dirname(repoPath);
    while (parent !== '.') {
      paths.add(parent);
      parent = path.posix.dirname(parent);
    }
  }
  return paths;
}
