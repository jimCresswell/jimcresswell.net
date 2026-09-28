import { err, ok, type Result } from '@engraph/result';

import type { RetireReadings, TipState } from './retire-decision.js';
import {
  fetchRemoteObjects,
  isOnBase,
  listBranchRefs,
  probeRemoteBranch,
  readDefaultBranch,
  type RetireGit,
} from './retire-git-read.js';
import { caseCollisionsOf } from './retire-parse.js';
import { worktreesUsing, type ReadOptionalFile } from './retire-worktrees.js';

/**
 * Gather every reading the retire decision needs. The local listing comes
 * first, before anything is fetched: no ref this command may delete is
 * written here, the cached tracking tip is read BEFORE the remote's objects
 * arrive, and they arrive by an objects-only fetch, so the decision proves
 * the tip that was actually cached. Every reading is gathered before the
 * decision runs, so even a refusal that needs no network (a branch in use, a
 * case collision, a symbolic ref) is reached after the remote reads.
 *
 * A failed read is a failure (exit 1), never a refusal: refusals are the
 * decision's, over readings that were all read.
 */
export async function gatherReadings(
  retire: RetireGit,
  branch: string,
  readFile: ReadOptionalFile,
): Promise<Result<RetireReadings, Error>> {
  const listing = await listBranchRefs(retire);
  if (!listing.ok) {
    return listing;
  }
  const inUse = await worktreesUsing(retire, branch, readFile);
  if (!inUse.ok) {
    return inUse;
  }
  const base = await readDefaultBranch(retire);
  if (!base.ok) {
    return base;
  }
  const remoteSha = await readRemoteTip(retire, branch);
  if (!remoteSha.ok) {
    return remoteSha;
  }
  const own = [`refs/heads/${branch}`, `refs/remotes/origin/${branch}`] as const;
  const tips = await provenTips(retire, base.value.sha, {
    local: listing.value.get(own[0])?.sha,
    tracking: listing.value.get(own[1])?.sha,
    remote: remoteSha.value,
  });
  if (!tips.ok) {
    return tips;
  }
  return ok({
    branch,
    base: base.value,
    ...tips.value,
    inUseBy: inUse.value,
    caseCollisions: caseCollisionsOf(listing.value, branch),
    symbolic: own.filter((ref) => listing.value.get(ref)?.symref !== undefined),
  });
}

/** The remote branch's tip with its objects here to test, or undefined when the remote has no such branch. */
async function readRemoteTip(
  retire: RetireGit,
  branch: string,
): Promise<Result<string | undefined, Error>> {
  const probe = await probeRemoteBranch(retire, branch);
  if (!probe.ok) {
    return probe;
  }
  if (probe.value.kind === 'absent') {
    return ok(undefined);
  }
  const fetched = await fetchRemoteObjects(retire, branch, probe.value.sha);
  return fetched.ok ? ok(probe.value.sha) : fetched;
}

type TipShas = Readonly<Record<'local' | 'tracking' | 'remote', string | undefined>>;
type Tips = Readonly<Record<'local' | 'tracking' | 'remote', TipState | undefined>>;

/** Ask git whether each existing tip is an ancestor of the default's tip. */
async function provenTips(
  retire: RetireGit,
  baseSha: string,
  shas: TipShas,
): Promise<Result<Tips, Error>> {
  const tips: Record<'local' | 'tracking' | 'remote', TipState | undefined> = {
    local: undefined,
    tracking: undefined,
    remote: undefined,
  };
  for (const key of ['local', 'tracking', 'remote'] as const) {
    const sha = shas[key];
    if (sha === undefined) {
      continue;
    }
    const onBase = await isOnBase(retire, sha, baseSha);
    if (!onBase.ok) {
      return err(onBase.error);
    }
    tips[key] = { sha, onBase: onBase.value };
  }
  return ok(tips);
}
