import { err, ok, type Result } from '@engraph/result';

import { DEFAULT_BRANCH_NAMES, type BranchArgSeams } from './branch-arg.js';
import type { GitExecutor } from './git-executor.js';
import { realFetch } from './github-fetch.js';
import { mintForConfig, type MintSeams } from './mint-for-config.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { resolveGitContext } from './push-git.js';
import { RefFormatOracleUnavailableError } from './ref-format.js';
import {
  resolveBotIdentity,
  type BotIdentity,
  type MergeBotResolveInput,
} from './resolve-identity.js';
import { parseRetireArgs, RETIRE_USAGE } from './retire-args.js';
import { decideRetirement } from './retire-decision.js';
import { executePlan } from './retire-execute.js';
import { gitRetirePort, type RetireGitPort } from './retire-git-port.js';
import { githubRepoOf } from './retire-parse.js';
import { exitCodeFor, writeRetireOutcome, type RetireOutcome } from './retire-report.js';

/**
 * The `merge-bot retire` action: parse, bind, read, decide, write, report.
 * The argv contract and the usage text are in `retire-args.ts`; the proof is
 * `retire-decision.ts`; the writes are `retire-execute.ts`; git is reached
 * only through `retire-git-port.ts`.
 *
 * Two bindings come before any read that could lead to a write. The branch is
 * never main, master or HEAD, in any case. And `origin`'s one configured URL
 * must name the repository the bot identity would delete in. git's traffic
 * can still be rewritten (`insteadOf`), so the proofs are bound to that
 * repository again at the mint, by sha: the branch tip and the default
 * branch's name and tip must read there, through GitHub, exactly as proven.
 * When no remote delete is due nothing is minted, and the local names are
 * deleted on the proofs of the repository git's traffic reached.
 */

/** Branch names refused before anything is read, compared case-insensitively: the default names, and HEAD. */
function isReservedBranch(branch: string): boolean {
  const folded = branch.toLowerCase();
  return DEFAULT_BRANCH_NAMES.has(folded) || folded === 'head';
}

/** The action's composition surface; `cli.ts` forwards its own injection seams. */
export interface RetireActionInput {
  readonly identityInput: MergeBotResolveInput;
  /** The invoking repository's root: the cwd every git call runs in. */
  readonly repoRoot: string;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
  readonly fetchImpl?: GithubApiFetch;
  readonly readFileImpl?: (path: string) => Promise<string>;
  readonly nowEpochSeconds?: () => number;
  readonly gitExecutor?: GitExecutor;
  readonly gitPath?: string;
  /** Base environment for git; defaults to `process.env` at the leaf, with prompting turned off. */
  readonly baseEnv?: Readonly<Record<string, string | undefined>>;
  /** git, as the command asks of it; defaults to real git in `repoRoot`. */
  readonly gitPort?: RetireGitPort;
  readonly branchArgSeams?: BranchArgSeams;
}

function mintSeamsFrom(input: RetireActionInput): MintSeams {
  return {
    ...(input.fetchImpl === undefined ? {} : { fetchImpl: input.fetchImpl }),
    ...(input.readFileImpl === undefined ? {} : { readFileImpl: input.readFileImpl }),
    ...(input.nowEpochSeconds === undefined ? {} : { nowEpochSeconds: input.nowEpochSeconds }),
  };
}

/** Mint the `branch-retire` token; an empty token is a failure before any call carries it. */
async function mintToken(
  identity: BotIdentity,
  input: RetireActionInput,
): Promise<Result<string, Error>> {
  const minted = await mintForConfig({ ...identity, scope: 'branch-retire' }, mintSeamsFrom(input));
  if (!minted.ok) {
    return minted;
  }
  return minted.value.token === ''
    ? err(new Error('the minted token is empty'))
    : ok(minted.value.token);
}

/**
 * Refuse unless `origin` has exactly one configured URL and it names the bot
 * identity's repository. Several URLs fail: fetch reads the first, and a
 * single `config --get` the last, so a check of one would not bind the
 * other. The URL itself is never echoed, only the repository parsed from it:
 * an https URL can carry a token.
 */
async function originMismatch(
  port: RetireGitPort,
  identity: BotIdentity,
): Promise<Result<string | undefined, Error>> {
  const urls = await port.originUrls();
  if (!urls.ok) {
    return urls;
  }
  const [url, ...others] = urls.value;
  if (url === undefined) {
    return err(new Error('this checkout has no origin URL configured'));
  }
  if (others.length > 0) {
    return err(
      new Error(`origin has ${urls.value.length} URLs configured; this command binds exactly one`),
    );
  }
  const repo = githubRepoOf(url);
  const wanted = `${identity.owner}/${identity.repoName}`;
  if (repo === undefined) {
    return ok(`origin is not a github.com URL; the bot deletes only in ${wanted}`);
  }
  const named = `${repo.owner}/${repo.repo}`;
  return named.toLowerCase() === wanted.toLowerCase()
    ? ok(undefined)
    : ok(`origin names ${named}, not ${wanted}, the repository the bot would delete in`);
}

/** The injected port, or real git in the invoking repository with prompting turned off. */
function portFrom(input: RetireActionInput): Result<RetireGitPort, Error> {
  if (input.gitPort !== undefined) {
    return ok(input.gitPort);
  }
  const git = resolveGitContext(input);
  if (!git.ok) {
    return git;
  }
  const env = {
    ...(input.baseEnv ?? process.env),
    GIT_TERMINAL_PROMPT: '0',
    GCM_INTERACTIVE: 'never',
  };
  return ok(gitRetirePort({ git: git.value, cwd: input.repoRoot, env }));
}

/** The port bound to the identity's repository, or the outcome that stops before any read. */
async function bindPort(
  branch: string,
  identity: BotIdentity,
  input: RetireActionInput,
): Promise<RetireGitPort | RetireOutcome> {
  const port = portFrom(input);
  if (!port.ok) {
    return { kind: 'failed', branch, reason: port.error.message };
  }
  const mismatch = await originMismatch(port.value, identity);
  if (!mismatch.ok) {
    return { kind: 'failed', branch, reason: mismatch.error.message };
  }
  return mismatch.value === undefined
    ? port.value
    : { kind: 'refused', branch, reason: mismatch.value };
}

/**
 * Nothing to retire: no name exists. Any section the branch still has in
 * the repository's config goes now, whether a failed removal or a hand-run
 * delete left it, so the re-run a failed removal advises finishes it.
 */
async function retireAbsent(branch: string, port: RetireGitPort): Promise<RetireOutcome> {
  const config = await port.removeBranchConfig(branch);
  return config.ok
    ? { kind: 'absent', branch }
    : {
        kind: 'failed',
        branch,
        reason: `no name is left to retire, but branch.${branch}'s config was left: ${config.error.message}`,
      };
}

/** Everything after the argv: bind, read, decide, write. */
async function retire(
  branch: string,
  identity: BotIdentity,
  input: RetireActionInput,
): Promise<RetireOutcome> {
  const port = await bindPort(branch, identity, input);
  if ('kind' in port) {
    return port;
  }
  const readings = await port.readings(branch);
  if (!readings.ok) {
    return { kind: 'failed', branch, reason: readings.error.message };
  }
  const decision = decideRetirement(readings.value);
  if (decision.kind !== 'plan') {
    return decision.kind === 'absent'
      ? retireAbsent(branch, port)
      : { kind: 'refused', branch, reason: decision.reason };
  }
  return executePlan(
    decision.plan,
    { branch, base: readings.value.base },
    {
      git: port,
      mintToken: () => mintToken(identity, input),
      fetchImpl: input.fetchImpl ?? realFetch(),
      repo: identity,
    },
  );
}

export async function runRetireAction(
  rest: readonly string[],
  input: RetireActionInput,
): Promise<number> {
  if (rest[0] === '--help' || rest[0] === '-h') {
    input.stdout.write(RETIRE_USAGE);
    return 0;
  }
  const parsed = parseRetireArgs(rest, input.branchArgSeams);
  if (!parsed.ok) {
    input.stderr.write(`merge-bot retire: ${parsed.error.message}\n`);
    return parsed.error instanceof RefFormatOracleUnavailableError ? 1 : 2;
  }
  const { branch, json } = parsed.value;
  let outcome: RetireOutcome;
  if (isReservedBranch(branch)) {
    outcome = {
      kind: 'refused',
      branch,
      reason: `"${branch}" names a default branch; it is never retired`,
    };
  } else {
    const identity = resolveBotIdentity({}, input.identityInput);
    if (!identity.ok) {
      input.stderr.write(`merge-bot retire: ${identity.error.message}\n`);
      return 2;
    }
    outcome = await retire(branch, identity.value, input);
  }
  writeRetireOutcome(outcome, json, input);
  return exitCodeFor(outcome);
}
