import { generateKeyPairSync } from 'node:crypto';

import { ok } from '@engraph/result';

import { runMergeBotCli } from '../cli.js';
import type { GitCommandResult, GitExecutor } from '../git-executor.js';
import type { GithubApiFetch } from '../mint-installation-token.js';

/**
 * The doubles behind the `merge-bot retire` front-door tests: git answers by
 * argv with the literal text it prints, and GitHub answers the two mint
 * calls, then each GraphQL call in turn from a list of literal bodies.
 */

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

export const TOKEN = 'sekrit-retire-token';
export const BRANCH = 'feat/x';
export const MAIN_SHA = '1'.repeat(40);
export const TIP = 'a'.repeat(40);
export const OTHER = 'c'.repeat(40);

const STATE_QUERY =
  'rev-parse --path-format=absolute --git-path rebase-merge/head-name --git-path rebase-apply/head-name --git-path BISECT_START --git-path rebase-merge/update-refs';

export const LISTING_QUERY =
  'for-each-ref --format=%(refname) %(objectname) %(symref) refs/heads/ refs/remotes/origin/';

export function answer(status: number, stdout = ''): GitCommandResult {
  return { status, signal: null, stdout, stderr: '' };
}

/** Every git answer for a branch merged into main, present locally and cached, absent on the remote. */
export function mergedLocally(): Record<string, GitCommandResult> {
  return {
    'config --get-all remote.origin.url': answer(0, 'https://github.com/acme/widgets.git\n'),
    [LISTING_QUERY]: answer(
      0,
      `refs/heads/main ${MAIN_SHA} \nrefs/heads/${BRANCH} ${TIP} \nrefs/remotes/origin/${BRANCH} ${TIP} \n`,
    ),
    'worktree list --porcelain': answer(
      0,
      `worktree /srv/repo\nHEAD ${MAIN_SHA}\nbranch refs/heads/main\n`,
    ),
    [`-C /srv/repo ${STATE_QUERY}`]: answer(0, '/g/a\n/g/b\n/g/c\n/g/d\n'),
    'ls-remote --symref origin HEAD': answer(0, `ref: refs/heads/main\tHEAD\n${MAIN_SHA}\tHEAD\n`),
    'fetch --quiet --no-write-fetch-head --no-tags --refmap= origin refs/heads/main:refs/remotes/origin/main':
      answer(0),
    'remote set-head origin --auto': answer(0),
    [`cat-file -e ${MAIN_SHA}^{commit}`]: answer(0),
    [`ls-remote origin refs/heads/${BRANCH}`]: answer(0, ''),
    [`merge-base --is-ancestor ${TIP} ${MAIN_SHA}`]: answer(0),
    [`update-ref --no-deref -d refs/remotes/origin/${BRANCH} ${TIP}`]: answer(0),
    [`update-ref --no-deref -d refs/heads/${BRANCH} ${TIP}`]: answer(0),
    [String.raw`config --name-only --get-regexp ^branch\.feat/x\.[^.]+$`]: answer(1),
  };
}

/** The same branch also present, and merged, on the remote. */
export function mergedEverywhere(): Record<string, GitCommandResult> {
  return {
    ...mergedLocally(),
    [`ls-remote origin refs/heads/${BRANCH}`]: answer(0, `${TIP}\trefs/heads/${BRANCH}\n`),
    [`fetch --quiet --no-write-fetch-head --no-tags --refmap= origin refs/heads/${BRANCH}`]:
      answer(0),
    [`cat-file -e ${TIP}^{commit}`]: answer(0),
  };
}

/** GitHub's answer to the remote-ref read: main at MAIN_SHA as the default, and the branch at `sha`. */
export function refRead(sha: string | undefined, defaultName = 'main'): unknown {
  return {
    data: {
      repository: {
        id: 'R_1',
        defaultBranchRef: { name: defaultName, target: { oid: MAIN_SHA } },
        ref: sha === undefined ? null : { target: { oid: sha } },
      },
    },
  };
}

export const DELETE_ACCEPTED: unknown = { data: { updateRefs: { clientMutationId: null } } };
export const GRAPHQL_ERROR: unknown = {
  errors: [{ message: 'Something went wrong while executing your query' }],
};

/** GitHub: the two mint endpoints, then each GraphQL call answered in turn (the last answer repeats). */
function githubAnswering(graphql: readonly unknown[]): {
  fetchImpl: GithubApiFetch;
  minted: () => boolean;
} {
  let mints = 0;
  let calls = 0;
  const fetchImpl: GithubApiFetch = (url) => {
    if (url.endsWith('/installation')) {
      return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 55 }) });
    }
    if (url.endsWith('/graphql')) {
      const body = graphql[Math.min(calls, graphql.length - 1)];
      calls += 1;
      return Promise.resolve({ status: 200, json: () => Promise.resolve(body) });
    }
    mints += 1;
    return Promise.resolve({
      status: 201,
      json: () => Promise.resolve({ token: TOKEN, expires_at: '2026-09-28T15:00:00Z' }),
    });
  };
  return { fetchImpl, minted: () => mints > 0 };
}

export interface RetireRun {
  readonly exit: number;
  readonly out: string;
  readonly err: string;
  readonly minted: boolean;
}

/** Run `merge-bot retire` over the doubles; `graphql` answers GitHub's GraphQL calls in turn. */
export async function runRetire(
  args: readonly string[],
  answers: Readonly<Record<string, GitCommandResult>>,
  graphql: readonly unknown[] = [{}],
  readConfigFileImpl: (path: string) => string = () =>
    JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'acme/widgets' }),
): Promise<RetireRun> {
  const out: string[] = [];
  const errText: string[] = [];
  const github = githubAnswering(graphql);
  const gitExecutor: GitExecutor = (_file, argv) => answers[argv.join(' ')] ?? answer(1);
  const exit = await runMergeBotCli({
    args: ['retire', ...args],
    env: { HOME: '/test-home' },
    stdout: { write: (chunk: string) => out.push(chunk) > 0 },
    stderr: { write: (chunk: string) => errText.push(chunk) > 0 },
    fetchImpl: github.fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    readConfigFileImpl,
    repoRoot: '/srv/repo',
    runGitImpl: () => 'worktree /srv/repo\n',
    nowEpochSeconds: () => 1_800_000_000,
    gitExecutor,
    gitPath: '/usr/bin/git',
    baseEnv: { PATH: '/usr/bin' },
    readOptionalFileImpl: () => Promise.resolve(ok(undefined)),
    branchArgSeams: { refFormatOracle: () => true },
  });
  return { exit, out: out.join(''), err: errText.join(''), minted: github.minted() };
}
