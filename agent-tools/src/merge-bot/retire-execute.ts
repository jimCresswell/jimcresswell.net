import type { Result } from '@engraph/result';

import type { GithubApiFetch } from './mint-installation-token.js';
import {
  baseMismatch,
  classifyRemoteReadback,
  classifyRemoteReread,
  type CasOutcome,
  type PlannedDelete,
  type RemoteDeleteOutcome,
  type RetirePlan,
} from './retire-decision.js';
import { deletePlannedRef, removeBranchConfig } from './retire-git-delete.js';
import type { RetireGit } from './retire-git-read.js';
import { readRemoteRefByApi, requestRefDelete, type IdentityRepo } from './retire-github-api.js';
import type { DefaultBranchReading } from './retire-parse.js';
import type { NameReport, NameReports, RetireOutcome } from './retire-report.js';

/**
 * The retire command's writes, fail-secure: the remote first, and the local
 * names only once the remote reads back absent, so a failure part-way leaves
 * a state a re-run finishes.
 *
 * Every remote read here goes through GitHub, in the bot identity's own
 * repository, the one the delete lands in: the re-read at the mint (the
 * branch tip, and the default branch's name and tip, against the proofs)
 * and the read-back after the delete. The outcome is the read-back, never
 * GitHub's answer to the delete: a stale `beforeOid` answers a generic
 * error, and a 5xx can follow a delete that happened.
 */

/** What the writes need beyond the plan. */
export interface ExecuteSeams {
  readonly retire: RetireGit;
  /** Mints the `branch-retire` token; called only when a remote delete is planned. */
  readonly mintToken: () => Promise<Result<string, Error>>;
  readonly fetchImpl: GithubApiFetch;
  readonly repo: IdentityRepo;
}

interface Context {
  readonly branch: string;
  readonly base: DefaultBranchReading;
}

const ABSENT: NameReport = { state: 'absent' };

type RemoteStep =
  | { readonly kind: 'done'; readonly report: NameReport }
  | { readonly kind: 'stop'; readonly outcome: RetireOutcome };

/** The remote re-read under the bot's token, ready for its delete. */
type Reread =
  { readonly kind: 'ready'; readonly token: string; readonly repositoryId: string } | RemoteStep;

function stopWith(context: Context, kind: 'failed' | 'refused', reason: string): RemoteStep {
  return { kind: 'stop', outcome: { kind, branch: context.branch, reason } };
}

/**
 * Mint the token and re-read the remote through the identity's repository.
 * A default branch other than the proven one refuses, as does a branch that
 * moved; a branch already gone is done.
 */
async function mintAndReread(
  target: PlannedDelete,
  context: Context,
  seams: ExecuteSeams,
): Promise<Reread> {
  const token = await seams.mintToken();
  if (!token.ok) {
    const reason = `minting the branch-retire token: ${token.error.message}; nothing was deleted`;
    return stopWith(context, 'failed', reason);
  }
  const state = await readRemoteRefByApi(seams.fetchImpl, token.value, seams.repo, context.branch);
  if (!state.ok) {
    return stopWith(context, 'failed', `${state.error.message}; nothing was deleted`);
  }
  const mismatch = baseMismatch(context.base, state.value.defaultBranch);
  if (mismatch !== undefined) {
    return stopWith(context, 'refused', `${mismatch}; nothing was deleted`);
  }
  const reread = classifyRemoteReread(target, state.value.ref);
  if (reread === 'moved') {
    const reason = `the remote branch moved after its proof (it was at ${target.expectedSha}); nothing was deleted`;
    return stopWith(context, 'refused', reason);
  }
  return reread === 'absent'
    ? { kind: 'done', report: ABSENT }
    : { kind: 'ready', token: token.value, repositoryId: state.value.repositoryId };
}

/** Delete the remote branch by compare-and-swap, if planned, and read it back through GitHub. */
async function retireRemote(
  target: PlannedDelete | undefined,
  context: Context,
  seams: ExecuteSeams,
): Promise<RemoteStep> {
  if (target === undefined) {
    return { kind: 'done', report: ABSENT };
  }
  const ready = await mintAndReread(target, context, seams);
  if (ready.kind !== 'ready') {
    return ready;
  }
  const requested = await requestRefDelete(
    seams.fetchImpl,
    ready.token,
    ready.repositoryId,
    target,
  );
  const readback = await readRemoteRefByApi(
    seams.fetchImpl,
    ready.token,
    seams.repo,
    context.branch,
  );
  const detail = requested.ok ? '' : ` (${requested.error.message})`;
  if (!readback.ok) {
    const reason = `the remote branch's state is unknown after the delete request${detail}: ${readback.error.message}; nothing local was deleted; re-run to finish`;
    return stopWith(context, 'failed', reason);
  }
  return remoteStepFor(
    classifyRemoteReadback(target, requested.ok, readback.value.ref),
    target,
    context,
    detail,
  );
}

/** The remote delete's read-back as the executor's next step. */
function remoteStepFor(
  outcome: RemoteDeleteOutcome,
  target: PlannedDelete,
  context: Context,
  detail: string,
): RemoteStep {
  if (outcome === 'deleted') {
    return { kind: 'done', report: { state: 'deleted', sha: target.expectedSha } };
  }
  if (outcome === 'absent') {
    return { kind: 'done', report: ABSENT };
  }
  return outcome === 'unchanged'
    ? stopWith(
        context,
        'failed',
        `the remote delete did not take${detail}; nothing local was deleted`,
      )
    : stopWith(
        context,
        'refused',
        `the remote branch moved after its proof (it was at ${target.expectedSha})${detail}; nothing was deleted`,
      );
}

interface LocalStep {
  readonly report: NameReport;
  readonly problem: string | undefined;
}

/** Delete one planned local ref by compare-and-swap, and report what it left. */
async function retireLocal(
  target: PlannedDelete | undefined,
  seams: ExecuteSeams,
  label: string,
): Promise<LocalStep> {
  if (target === undefined) {
    return { report: ABSENT, problem: undefined };
  }
  const deleted = await deletePlannedRef(seams.retire, target);
  if (!deleted.ok) {
    return { report: { state: 'unknown' }, problem: `${label}: ${deleted.error.message}` };
  }
  return localStepFor(deleted.value, target, label);
}

/** A local compare-and-swap's outcome as its report, and the problem it raises, if any. */
function localStepFor(outcome: CasOutcome, target: PlannedDelete, label: string): LocalStep {
  if (outcome.kind === 'deleted') {
    return { report: { state: 'deleted', sha: target.expectedSha }, problem: undefined };
  }
  if (outcome.kind === 'absent') {
    return { report: ABSENT, problem: undefined };
  }
  return outcome.kind === 'kept'
    ? {
        report: { state: 'kept', sha: outcome.sha },
        problem: `${label} moved to ${outcome.sha} after its proof and was kept`,
      }
    : { report: { state: 'failed' }, problem: `${label} was not deleted: ${outcome.detail}` };
}

/** Carry out a plan. */
export async function executePlan(
  plan: RetirePlan,
  context: Context,
  seams: ExecuteSeams,
): Promise<RetireOutcome> {
  const remote = await retireRemote(plan.remote, context, seams);
  if (remote.kind === 'stop') {
    return remote.outcome;
  }
  const tracking = await retireLocal(plan.tracking, seams, 'the tracking ref');
  const local = await retireLocal(plan.local, seams, 'the local branch');
  const problems = [tracking.problem, local.problem];
  if (local.report.state === 'deleted') {
    const config = await removeBranchConfig(seams.retire, context.branch);
    problems.push(
      config.ok ? undefined : `branch.${context.branch}'s config was left: ${config.error.message}`,
    );
  }
  const names: NameReports = {
    remote: remote.report,
    tracking: tracking.report,
    local: local.report,
  };
  const reasons = problems.filter((problem) => problem !== undefined);
  return reasons.length === 0
    ? { kind: 'retired', branch: context.branch, base: context.base, names }
    : {
        kind: 'partial',
        branch: context.branch,
        base: context.base,
        names,
        reason: reasons.join('; '),
      };
}
