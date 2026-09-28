import { err, ok, type Result } from '@engraph/result';

import type { GitCommandResult } from './git-executor.js';
import { describeGitChildEnd, type GitContext } from './push-git.js';
import {
  gitWords,
  parseExactRemoteRef,
  parseRefListing,
  parseSymrefHead,
  REF_LISTING_FORMAT,
  type DefaultBranchReading,
  type ListedRef,
  type RemoteRefReading,
} from './retire-parse.js';

/**
 * The git reads behind `merge-bot retire`. None of them writes a ref this
 * command may delete: a remote branch's objects arrive by an objects-only
 * fetch (`--refmap=` with no destination), so a cached tracking tip is still
 * the one that was read when the decision proves it. Two refs are written
 * here, both of the DEFAULT branch: its tracking ref, by a non-forced fetch
 * that can only fast-forward, and `origin/HEAD`, by `set-head --auto`, which
 * needs that tracking ref to exist. No fetch follows tags (`--no-tags`).
 *
 * Every read runs under the operator's own `origin` credential: these are
 * reads, not writes, so the bot-identity rule does not apply. Prompting is
 * off (the caller's environment carries `GIT_TERMINAL_PROMPT=0` and
 * `GCM_INTERACTIVE=never`), so an unattended seat fails rather than asks.
 * Output volume is git's answer to a named query, which this command bounds,
 * so the capturing arm is sound.
 */

/** The git binary, its cwd, and the child environment for every retire read and write. */
export interface RetireGit {
  readonly git: GitContext;
  readonly cwd: string;
  readonly env: Readonly<Record<string, string | undefined>>;
}

/** Network reads get a bound, so an unattended seat can never hang on one. */
const NETWORK_TIMEOUT_MS = 120_000;

/** Run one git command in the retire context. */
export async function runGit(
  retire: RetireGit,
  args: readonly string[],
  network = false,
): Promise<GitCommandResult> {
  return retire.git.exec(retire.git.file, args, {
    cwd: retire.cwd,
    env: retire.env,
    ...(network ? { timeoutMs: NETWORK_TIMEOUT_MS } : {}),
  });
}

/** A failed git call as an Error that names the question and git's own words. */
export function gitFailure(question: string, result: GitCommandResult): Error {
  return new Error(`${question}: git ${describeGitChildEnd(result)}: ${gitWords(result.stderr)}`);
}

/**
 * The RAW configured URLs of `origin`, every one, in config order. Not
 * `git remote get-url`, which applies `insteadOf` rewriting: the front door
 * binds the configured name, and the mint-time read binds the proofs to that
 * repository by sha. Any non-zero exit (the key unset, or a config git
 * cannot read) reads as no URL, and the front door then fails the run.
 */
export async function readOriginUrls(retire: RetireGit): Promise<Result<readonly string[], Error>> {
  const result = await runGit(retire, ['config', '--get-all', 'remote.origin.url']);
  if (result.status !== 0) {
    return ok([]);
  }
  return ok(
    result.stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== ''),
  );
}

/**
 * The remote's default branch and its tip, from ONE remote reading, with the
 * tip's objects fetched and `origin/HEAD` refreshed. The refresh reads the
 * remote HEAD first and fetches that branch before `set-head --auto`, which
 * fails in a clone whose tracking refs predate a default change.
 */
export async function readDefaultBranch(
  retire: RetireGit,
): Promise<Result<DefaultBranchReading, Error>> {
  const symref = await runGit(retire, ['ls-remote', '--symref', 'origin', 'HEAD'], true);
  if (symref.status !== 0) {
    return err(gitFailure("reading the remote's HEAD", symref));
  }
  const reading = parseSymrefHead(symref.stdout);
  if (!reading.ok) {
    return reading;
  }
  const { name, sha } = reading.value;
  const steps: readonly (readonly [string, readonly string[], boolean])[] = [
    [
      `fetching ${name}`,
      [
        'fetch',
        '--quiet',
        '--no-write-fetch-head',
        '--no-tags',
        '--refmap=',
        'origin',
        `refs/heads/${name}:refs/remotes/origin/${name}`,
      ],
      true,
    ],
    ['refreshing origin/HEAD', ['remote', 'set-head', 'origin', '--auto'], true],
    [`reading ${name}'s tip`, ['cat-file', '-e', `${sha}^{commit}`], false],
  ];
  for (const [question, args, network] of steps) {
    const result = await runGit(retire, args, network);
    if (result.status !== 0) {
      return err(gitFailure(question, result));
    }
  }
  return reading;
}

/** A remote-branch probe as run, as a reading: a failed read is a failure, never "absent". */
export function probeReading(
  result: GitCommandResult,
  branch: string,
): Result<RemoteRefReading, Error> {
  return result.status === 0
    ? ok(parseExactRemoteRef(result.stdout, branch))
    : err(gitFailure(`reading the remote branch ${branch}`, result));
}

/** The remote branch, read by its exact name. */
export async function probeRemoteBranch(
  retire: RetireGit,
  branch: string,
): Promise<Result<RemoteRefReading, Error>> {
  const result = await runGit(retire, ['ls-remote', 'origin', `refs/heads/${branch}`], true);
  return probeReading(result, branch);
}

/**
 * The remote branch's objects, with NO ref written (`--refmap=` and no
 * destination). The probed commit's ancestry read follows, and a commit the
 * fetch did not bring fails that read (git exits 128), so the run fails
 * before any write without a presence check of its own.
 */
export async function fetchRemoteObjects(
  retire: RetireGit,
  branch: string,
): Promise<Result<undefined, Error>> {
  const fetched = await runGit(
    retire,
    [
      'fetch',
      '--quiet',
      '--no-write-fetch-head',
      '--no-tags',
      '--refmap=',
      'origin',
      `refs/heads/${branch}`,
    ],
    true,
  );
  return fetched.status === 0
    ? ok(undefined)
    : err(gitFailure(`fetching the remote branch ${branch}'s objects`, fetched));
}

/**
 * Which of `refs` are symbolic refs, read raw: `symbolic-ref --quiet` exits
 * 0 for one (live, dangling or chained), 1 for a plain or a missing ref, and
 * anything else is a failure. The listing cannot answer this (see
 * `parseRefListing`). The decision refuses a symbolic ref of the branch's
 * own: `git worktree list` names the branch an alias resolves to, so the
 * in-use check cannot see a worktree on the alias, and a symbolic ref whose
 * target is deleted first reads back as absent. On a case-insensitive
 * filesystem a name that folds onto a symbolic ref reads symbolic too, which
 * over-reports into a refusal.
 */
export async function readSymbolicRefs(
  retire: RetireGit,
  refs: readonly string[],
): Promise<Result<readonly string[], Error>> {
  const symbolic: string[] = [];
  for (const ref of refs) {
    const answer = symbolicReading(await runGit(retire, ['symbolic-ref', '--quiet', ref]), ref);
    if (!answer.ok) {
      return answer;
    }
    if (answer.value) {
      symbolic.push(ref);
    }
  }
  return ok(symbolic);
}

/** A raw `symbolic-ref --quiet` read of `ref` as an answer: exit 0 is symbolic, 1 is not, and anything else is a failure. */
export function symbolicReading(result: GitCommandResult, ref: string): Result<boolean, Error> {
  return result.status === 0 || result.status === 1
    ? ok(result.status === 0)
    : err(gitFailure(`asking whether ${ref} is a symbolic ref`, result));
}

/**
 * A raw `show-ref --exists` read of `ref` as an answer. It reads the ref
 * without resolving it, so exit 0 is a ref of that name, plain, packed or
 * symbolic (its target gone or not); 2 is none; and anything else, a
 * corrupt loose ref included, is a failure.
 */
export function existsReading(result: GitCommandResult, ref: string): Result<boolean, Error> {
  return result.status === 0 || result.status === 2
    ? ok(result.status === 0)
    : err(gitFailure(`asking whether ${ref} exists`, result));
}

/** Every local and `origin` tracking ref, by exact full name. */
export async function listBranchRefs(
  retire: RetireGit,
): Promise<Result<ReadonlyMap<string, ListedRef>, Error>> {
  const result = await runGit(retire, [
    'for-each-ref',
    REF_LISTING_FORMAT,
    'refs/heads/',
    'refs/remotes/origin/',
  ]);
  return result.status === 0
    ? ok(parseRefListing(result.stdout))
    : err(gitFailure('listing the branch refs', result));
}

/** Whether `sha` is an ancestor of `baseSha`: git's 0 and 1 are the answers; anything else is a failure. */
export async function isOnBase(
  retire: RetireGit,
  sha: string,
  baseSha: string,
): Promise<Result<boolean, Error>> {
  const result = await runGit(retire, ['merge-base', '--is-ancestor', sha, baseSha]);
  if (result.status === 0 || result.status === 1) {
    return ok(result.status === 0);
  }
  return err(gitFailure(`asking whether ${sha} is on ${baseSha}`, result));
}
