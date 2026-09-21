/**
 * Operator profile — resolving the sync target: the runner for a root that is
 * a repository with a remote, a message for the first-class states with
 * nothing to sync, or the refusal. The root is probed WITHOUT following
 * links before any git runner exists, so `profile:sync pull --root <link>`
 * never runs git in the link's target.
 */

import { err, ok, type Result } from '@engraph/result';

import { isGitRepository, presence, type PresenceProbe } from './operator-profile-fs.js';
import { createGitRunner, type GitRunner, remoteNames } from './operator-profile-git.js';

/** What syncTarget asks of the filesystem; the real probes are the defaults, tests inject fakes. */
export interface SyncTargetProbes {
  readonly presence: PresenceProbe;
  readonly isGitRepository: (root: string) => Promise<Result<boolean, string>>;
  readonly createRunner: (root: string) => Result<GitRunner, string>;
}

const REAL_SYNC_TARGET_PROBES: SyncTargetProbes = {
  presence: (target) => presence(target),
  isGitRepository,
  createRunner: createGitRunner,
};

/** The root as a directory or absent; a symlink, a file or an unreadable path is a refusal. */
async function rootPresence(
  root: string,
  probe: PresenceProbe,
): Promise<Result<'directory' | 'absent', string>> {
  const there = await probe(root);
  if (!there.ok) {
    return err(`${there.error} — an unreadable profile root is a failure, never absence`);
  }
  switch (there.value) {
    case 'symlink':
      return err(`${root} is a symlink — the profile root is never followed`);
    case 'not-a-directory':
      return err(`${root} exists but is not a directory`);
    default:
      return ok(there.value);
  }
}

/** The runner for a present repository, `'none'` for an absent root or a plain directory. */
async function repositoryRunner(
  root: string,
  presenceValue: 'directory' | 'absent',
  probes: SyncTargetProbes,
): Promise<Result<GitRunner | 'none', string>> {
  const repository = presenceValue === 'absent' ? ok(false) : await probes.isGitRepository(root);
  if (!repository.ok) {
    return err(`profile at ${root}: ${repository.error}`);
  }
  if (!repository.value) {
    return ok('none');
  }
  const runner = probes.createRunner(root);
  return runner.ok ? runner : err(`profile at ${root}: ${runner.error}`);
}

/**
 * The runner for a root that is a repository with a remote; a message for the
 * two first-class states with nothing to sync; an error when git cannot read
 * the repository (never mistaken for "no remote"). The root is probed WITHOUT
 * following links before any git runner exists: a symlinked root is refused
 * by name, so `profile:sync pull --root <link>` never runs git in the link's
 * target.
 *
 * @param root - the profile root
 * @param probes - the filesystem and runner (the real ones by default)
 * @returns the runner, an information line, or the refusal
 */
export async function syncTarget(
  root: string,
  probes: SyncTargetProbes = REAL_SYNC_TARGET_PROBES,
): Promise<Result<GitRunner | string, string>> {
  const there = await rootPresence(root, probes.presence);
  if (!there.ok) {
    return there;
  }
  const runner = await repositoryRunner(root, there.value, probes);
  if (!runner.ok) {
    return runner;
  }
  if (runner.value === 'none') {
    return ok(`profile at ${root} is absent or not a git repository — nothing to sync`);
  }
  const run = runner.value;
  const remotes = remoteNames(run);
  if (!remotes.ok) {
    return err(`profile at ${root}: ${remotes.error}`);
  }
  if (remotes.value.length === 0) {
    return ok(`profile at ${root} has no remote — nothing to sync`);
  }
  return ok(run);
}
