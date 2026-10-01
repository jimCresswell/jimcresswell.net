import { generateKeyPairSync } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { runMergeBotCli } from './cli.js';
import type { GitCommandResult, GitExecutor } from './git-executor.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import {
  BASE_ENV,
  GIT_PATH,
  EXPIRES_AT,
  gitFake,
  gitReads,
  NOW,
  REFUSED_PUSH,
  tokenStoreFake,
} from './test-helpers/push-cli-double.js';
import { TOKEN_SCOPES } from './token-scopes.js';

/**
 * `merge-bot push` with its production mint. The other push tests inject the
 * mint; here none is injected, so the CLI composes `mintForConfig` over its
 * own mint seams (the endpoints, the key, the clock). What is proven: the
 * scope the push asks GitHub for, that the token GitHub answers is the one
 * git is handed, and that every attempt of one push carries that same token.
 */

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

/** The token the endpoint answers the first request for one with. */
const FIRST_TOKEN = 'installation-token-1';

/** A push git accepted, as the file-backed executor answers a call with an output sink. */
const PUSHED: GitCommandResult = { status: 0, signal: null, stdout: '', stderr: '' };

/**
 * The mint endpoints. Each request for a token is answered with a token of
 * its own, numbered from one, so a second mint would show in what git is
 * handed; every request's body is recorded.
 */
function mintEndpoints(): { fetchImpl: GithubApiFetch; tokenRequests: string[] } {
  const tokenRequests: string[] = [];
  const fetchImpl: GithubApiFetch = (url, init) => {
    if (url.endsWith('/installation')) {
      return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 55 }) });
    }
    tokenRequests.push(String(init?.body ?? ''));
    const token = `installation-token-${String(tokenRequests.length)}`;
    return Promise.resolve({
      status: 201,
      json: () => Promise.resolve({ token, expires_at: EXPIRES_AT }),
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
    nowIsoImpl: () => NOW,
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
    // The scope is the push's choice; what the scope permits is the scope
    // table's (`token-scopes.ts`), compared here and never restated.
    expect(run.tokenRequests.map((body): unknown => JSON.parse(body))).toEqual([
      expect.objectContaining({ permissions: TOKEN_SCOPES['pull-request-work'] }),
    ]);
    expect(run.handed()).toEqual([FIRST_TOKEN]);
  });

  it('hands git the same token on every attempt of a push GitHub refuses and then accepts', async () => {
    const answers = [REFUSED_PUSH, PUSHED];
    const gitExecutor: GitExecutor = () => answers.shift() ?? PUSHED;
    const run = pushMinting(gitExecutor);

    expect(await run.exit).toBe(0);
    expect(run.handed()).toEqual([FIRST_TOKEN, FIRST_TOKEN]);
  });
});
