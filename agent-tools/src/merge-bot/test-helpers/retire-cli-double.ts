import { generateKeyPairSync } from 'node:crypto';

import { ok } from '@engraph/result';

import { runMergeBotCli } from '../cli.js';
import type { GitCommandResult, GitExecutor } from '../git-executor.js';
import type { GithubApiFetch } from '../mint-installation-token.js';

/**
 * The doubles behind the `merge-bot retire` front-door tests. git answers by
 * argv with the literal text it prints, and an argv the table does not hold
 * answers 128 (git's usage failure), never a status that reads as a result.
 * GitHub is a lookup by endpoint, branch-free: the two mint endpoints, and
 * one constant GraphQL answer for the run. The mints are recorded, the one
 * effect read: a credential issued. Paths that need GitHub to change
 * between calls run against real git in the smokes.
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

const UNANSWERED: GitCommandResult = {
  status: 128,
  signal: null,
  stdout: '',
  stderr: 'unanswered',
};

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
    [String.raw`config --local --name-only --get-regexp ^branch\.feat/x\.[^.]+$`]: answer(1),
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

export const GRAPHQL_ERROR: unknown = {
  errors: [{ message: 'Something went wrong while executing your query' }],
};

/** GitHub by endpoint: the installation, the token mint (recorded), and one GraphQL answer. */
function githubAnswering(graphql: unknown): { fetchImpl: GithubApiFetch; mints: string[] } {
  const mints: string[] = [];
  const reply = (status: number, body: unknown): ReturnType<GithubApiFetch> =>
    Promise.resolve({ status, json: () => Promise.resolve(body) });
  const endpoints: Readonly<Record<string, () => ReturnType<GithubApiFetch>>> = {
    installation: () => reply(200, { id: 55 }),
    access_tokens: () => {
      mints.push(TOKEN);
      return reply(201, { token: TOKEN, expires_at: '2026-09-28T15:00:00Z' });
    },
    graphql: () => reply(200, graphql),
  };
  const fetchImpl: GithubApiFetch = (url) => {
    const answerFor = endpoints[url.slice(url.lastIndexOf('/') + 1)];
    return answerFor === undefined
      ? Promise.reject(new Error(`the GitHub double has no endpoint for ${url}`))
      : answerFor();
  };
  return { fetchImpl, mints };
}

export interface RetireRun {
  readonly exit: number;
  readonly out: string;
  readonly err: string;
  readonly minted: boolean;
}

/** What a front-door run may vary besides argv and git's answers. */
export interface RetireRunOptions {
  /** GitHub's one answer to every GraphQL call. */
  readonly graphql?: unknown;
  readonly readConfigFileImpl?: (path: string) => string;
  /** The worktree state files, by path; a path not listed does not exist. */
  readonly stateFiles?: Readonly<Record<string, string>>;
  /** git's ref-format grammar: whether it accepts a branch name. */
  readonly refFormatLegal?: boolean;
}

const IDENTITY_CONFIG = JSON.stringify({
  appSlug: 'jimbot-oakington-iii',
  appId: '4352989',
  repo: 'acme/widgets',
});

/** Run `merge-bot retire` over the doubles. */
export async function runRetire(
  args: readonly string[],
  answers: Readonly<Record<string, GitCommandResult>>,
  options: RetireRunOptions = {},
): Promise<RetireRun> {
  const out: string[] = [];
  const errText: string[] = [];
  const github = githubAnswering(options.graphql ?? {});
  const stateFiles = options.stateFiles ?? {};
  const legal = options.refFormatLegal ?? true;
  const gitExecutor: GitExecutor = (_file, argv) => answers[argv.join(' ')] ?? UNANSWERED;
  const exit = await runMergeBotCli({
    args: ['retire', ...args],
    env: { HOME: '/test-home' },
    stdout: { write: (chunk: string) => out.push(chunk) > 0 },
    stderr: { write: (chunk: string) => errText.push(chunk) > 0 },
    fetchImpl: github.fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    readConfigFileImpl: options.readConfigFileImpl ?? (() => IDENTITY_CONFIG),
    repoRoot: '/srv/repo',
    runGitImpl: () => 'worktree /srv/repo\n',
    nowEpochSeconds: () => 1_800_000_000,
    gitExecutor,
    gitPath: '/usr/bin/git',
    baseEnv: { PATH: '/usr/bin' },
    readOptionalFileImpl: (path) => Promise.resolve(ok(stateFiles[path])),
    branchArgSeams: { refFormatOracle: () => legal },
  });
  return { exit, out: out.join(''), err: errText.join(''), minted: github.mints.length > 0 };
}
