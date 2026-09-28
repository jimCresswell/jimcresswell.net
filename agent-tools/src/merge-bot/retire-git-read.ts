import { err, ok, type Result } from '@engraph/result';

import type { GitCommandResult } from './git-executor.js';
import { describeGitChildEnd, type GitContext } from './push-git.js';
import {
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
  return new Error(`${question}: git ${describeGitChildEnd(result)}: ${result.stderr.trim()}`);
}

/**
 * The RAW configured URL of `origin`, which must be exactly one. Not
 * `git remote get-url`, which applies `insteadOf` rewriting: the check binds
 * the configured name, and the mint-time read binds the proofs to that
 * repository by sha. Several URLs are refused: fetch reads the first, and a
 * single `config --get` the last, so a check of one would not bind the other.
 */
export async function readOriginUrl(retire: RetireGit): Promise<Result<string, Error>> {
  const result = await runGit(retire, ['config', '--get-all', 'remote.origin.url']);
  const urls = result.stdout.split('\n').filter((line) => line.trim() !== '');
  const [url] = urls;
  if (result.status !== 0 || url === undefined) {
    return err(new Error('this checkout has no origin URL configured'));
  }
  if (urls.length > 1) {
    return err(
      new Error(`origin has ${urls.length} URLs configured; this command binds exactly one`),
    );
  }
  return ok(url.trim());
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

/** The remote branch, read by its exact name; a failed read is a failure, never "absent". */
export async function probeRemoteBranch(
  retire: RetireGit,
  branch: string,
): Promise<Result<RemoteRefReading, Error>> {
  const result = await runGit(retire, ['ls-remote', 'origin', `refs/heads/${branch}`], true);
  if (result.status !== 0) {
    return err(gitFailure(`reading the remote branch ${branch}`, result));
  }
  return ok(parseExactRemoteRef(result.stdout, branch));
}

/**
 * The remote branch's objects, with NO ref written (`--refmap=` and no
 * destination), then proof that the probed commit is here to test.
 */
export async function fetchRemoteObjects(
  retire: RetireGit,
  branch: string,
  sha: string,
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
  if (fetched.status !== 0) {
    return err(gitFailure(`fetching the remote branch ${branch}'s objects`, fetched));
  }
  const present = await runGit(retire, ['cat-file', '-e', `${sha}^{commit}`]);
  return present.status === 0
    ? ok(undefined)
    : err(gitFailure(`reading the remote tip ${sha}`, present));
}

/** Every local and `origin` tracking ref, by exact full name, with the target of any symbolic one. */
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
