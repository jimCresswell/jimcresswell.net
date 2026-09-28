import assert from 'node:assert/strict';
import { join } from 'node:path';

import {
  bindOrigin,
  commitAndPush,
  git,
  mergedBranch,
  refAt,
  retire,
  withRig,
  type RetireRig,
} from './merge-bot-retire-fixture';
import { fakeGithub, type GithubDoubleOptions } from './merge-bot-retire-github-double';

/**
 * `merge-bot retire` against real git: the tips and remotes it must not
 * retire, so it deletes NOTHING. Each case snapshots every ref of the branch
 * in the bare remote and the work clone, runs the command, and checks the
 * exit code, that every ref is where it was (or, where another writer pushed
 * while the command ran, where that push left it), and that no token was
 * minted where no remote delete was due. The retire paths are
 * `merge-bot-retire.smoke.ts`; the states that refuse (in use, symbolic,
 * case collisions, the default by name) are `merge-bot-retire-in-use.smoke.ts`.
 *
 * Run by the smoke runner against real git, outside the test suite.
 */

const BRANCH = 'feat/keep-me';

function snapshot(rig: RetireRig): readonly (string | undefined)[] {
  return [
    refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
  ];
}

/**
 * Run the command and check the exit code, every ref of the branch where
 * `expected` says (where it was, unless a hook moved it), and the tokens
 * minted: none unless a remote delete was due.
 */
async function expectUntouched(
  rig: RetireRig,
  exit: number,
  moves: { readonly options: GithubDoubleOptions; readonly remote: string } | undefined = undefined,
): Promise<string> {
  const [, local, tracking] = snapshot(rig);
  const expected = moves === undefined ? snapshot(rig) : [moves.remote, local, tracking];
  const github = fakeGithub(rig, moves?.options ?? {});
  const run = await retire(rig, BRANCH, github.fetchImpl);

  assert.equal(run.exit, exit, `expected exit ${exit}: ${run.err}`);
  assert.deepEqual(snapshot(rig), expected, 'a ref of the branch is not where it should be');
  assert.equal(github.mints(), moves === undefined ? 0 : 1, 'a token was minted for a refusal');
  // Under --json the refusal is the outcome object on stdout.
  return `${run.out}${run.err}`;
}

/** A commit on the branch in the seed, made now and pushed only when `push` runs. */
function pendingPush(rig: RetireRig): { readonly sha: string; readonly push: () => void } {
  git(rig, rig.seed, 'switch', '-q', BRANCH);
  git(rig, rig.seed, 'commit', '-q', '--allow-empty', '-m', 'pushed while the command ran');
  const sha = git(rig, rig.seed, 'rev-parse', 'HEAD');
  return { sha, push: () => git(rig, rig.seed, 'push', '-q', 'origin', `${BRANCH}:${BRANCH}`) };
}

/** A merged branch with a local copy and a cached tracking ref in the work clone. */
function mergedAndTracked(rig: RetireRig): string {
  const tip = mergedBranch(rig, BRANCH);
  git(rig, rig.work, 'fetch', '-q', 'origin');
  git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
  return tip;
}

/** Edge 7: the remote is gone, and the cached tracking ref holds a commit made after the merge. */
async function keepsACachedPostMergeCommit(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    commitAndPush(rig, BRANCH, 'after the merge');
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.origin, 'update-ref', '-d', `refs/heads/${BRANCH}`);
    await expectUntouched(rig, 3);
  });
}

/** C-2: the remote was reset to the merged tip; the cache still holds the later commit. */
async function keepsACacheTheRemoteNoLongerHas(): Promise<void> {
  await withRig(async (rig) => {
    const merged = mergedAndTracked(rig);
    commitAndPush(rig, BRANCH, 'after the merge');
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.origin, 'update-ref', `refs/heads/${BRANCH}`, merged);
    await expectUntouched(rig, 3);
  });
}

async function keepsAnUnmergedLocalCommit(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    git(rig, rig.work, 'switch', '-q', BRANCH);
    git(rig, rig.work, 'commit', '-q', '--allow-empty', '-m', 'local only');
    git(rig, rig.work, 'switch', '-q', 'main');
    const err = await expectUntouched(rig, 3);
    assert.match(err, /not an ancestor/u);
  });
}

async function keepsAnUnmergedRemoteCommit(): Promise<void> {
  await withRig(async (rig) => {
    git(rig, rig.seed, 'switch', '-q', '-c', BRANCH, 'main');
    commitAndPush(rig, BRANCH, 'never merged');
    const err = await expectUntouched(rig, 3);
    assert.match(err, /not an ancestor/u);
  });
}

async function keepsARemoteThatMovesAtTheMint(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const next = pendingPush(rig);
    await expectUntouched(rig, 3, { options: { onMint: next.push }, remote: next.sha });
  });
}

/** The push lands after the re-read, as the delete arrives: GitHub's compare-and-swap keeps it. */
async function keepsARemoteThatMovesBeforeTheSwap(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const next = pendingPush(rig);
    const err = await expectUntouched(rig, 3, {
      options: { beforeUpdate: next.push },
      remote: next.sha,
    });
    assert.match(err, new RegExp(`reads at ${next.sha}`, 'u'));
  });
}

async function keepsEverythingWhenTheRemoteCannotBeRead(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    bindOrigin(rig, join(rig.root, 'missing.git'));
    // The URL rewrite is appended; the first matching rule git reads wins, so
    // clear the working one before pointing at the missing repository.
    git(rig, rig.work, 'config', '--unset-all', `url.${rig.origin}.insteadOf`);
    await expectUntouched(rig, 1);
  });
}

await keepsACachedPostMergeCommit();
await keepsACacheTheRemoteNoLongerHas();
await keepsAnUnmergedLocalCommit();
await keepsAnUnmergedRemoteCommit();
await keepsARemoteThatMovesAtTheMint();
await keepsARemoteThatMovesBeforeTheSwap();
await keepsEverythingWhenTheRemoteCannotBeRead();
process.stdout.write('merge-bot retire refusals smoke: OK (seven cases, nothing deleted)\n');
