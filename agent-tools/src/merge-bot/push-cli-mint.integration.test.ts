import { generateKeyPairSync } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { runMergeBotCli } from './cli.js';
import type { GitCommandResult, GitExecutor } from './git-executor.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import {
  BASE_ENV,
  GIT_PATH,
  gitFake,
  gitReads,
  REFUSED_PUSH,
  tokenStoreFake,
} from './test-helpers/push-cli-double.js';

/**
 * `merge-bot push` with its production mint. The other push tests inject the
 * mint; here none is injected, so the CLI composes `mintForConfig` over its
 * own mint seams (the endpoints, the key, the clock). What is proven: the
 * scope the push asks GitHub for, that the token GitHub answers is the one
 * git is handed, and that one push mints once however many attempts it takes.
 */

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const MINTED = 'installation-token-from-the-endpoint';

/** A push git accepted, as the file-backed executor answers a call with an output sink. */
const PUSHED: GitCommandResult = { status: 0, signal: null, stdout: '', stderr: '' };

/** The mint endpoints, answering `MINTED`, every token request's body recorded. */
function mintEndpoints(): { fetchImpl: GithubApiFetch; tokenRequests: string[] } {
  const tokenRequests: string[] = [];
  const fetchImpl: GithubApiFetch = (url, init) => {
    if (url.endsWith('/installation')) {
      return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 55 }) });
    }
    tokenRequests.push(String(init?.body ?? ''));
    return Promise.resolve({
      status: 201,
      json: () => Promise.resolve({ token: MINTED, expires_at: '2026-08-06T10:00:00Z' }),
    });
  };
  return { fetchImpl, tokenRequests };
}

const SILENT: Pick<NodeJS.WriteStream, 'write'> = { write: () => true };

/** `merge-bot push` over the mint endpoints and the given git, no mint injected. */
function pushMinting(gitExecutor: GitExecutor): {
  readonly exit: Promise<number>;
  readonly tokenRequests: string[];
  readonly handed: () => readonly string[];
} {
  const { fetchImpl, tokenRequests } = mintEndpoints();
  const { store, writes } = tokenStoreFake();
  const exit = runMergeBotCli({
    args: ['push'],
    env: { HOME: '/test-home' },
    stdout: SILENT,
    stderr: SILENT,
    fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    nowEpochSeconds: () => 1_800_000_000,
    readConfigFileImpl: () =>
      JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'acme/widgets' }),
    repoRoot: '/repo',
    runGitImpl: () => 'worktree /repo\n',
    sleepImpl: () => Promise.resolve(),
    gitExecutor,
    gitPath: GIT_PATH,
    gitReads: gitReads(),
    branchArgSeams: { refFormatOracle: () => true },
    baseEnv: BASE_ENV,
    tokenFiles: store,
  });
  return { exit, tokenRequests, handed: () => writes.map((write) => write.content) };
}

describe('merge-bot push with its production mint', () => {
  it('asks for the pull-request-work scope, since a push can touch .github/workflows, and hands git the token GitHub answers', async () => {
    const run = pushMinting(gitFake().gitExecutor);

    expect(await run.exit).toBe(0);
    expect(run.tokenRequests.map((body): unknown => JSON.parse(body))).toEqual([
      expect.objectContaining({
        permissions: { pull_requests: 'write', contents: 'write', workflows: 'write' },
      }),
    ]);
    expect(run.handed()).toEqual([MINTED]);
  });

  it('mints once for a push GitHub refuses and then accepts, every attempt carrying that token', async () => {
    const answers = [REFUSED_PUSH, PUSHED];
    const gitExecutor: GitExecutor = () => answers.shift() ?? PUSHED;
    const run = pushMinting(gitExecutor);

    expect(await run.exit).toBe(0);
    expect(run.tokenRequests).toHaveLength(1);
    expect(run.handed()).toEqual([MINTED, MINTED]);
  });
});
