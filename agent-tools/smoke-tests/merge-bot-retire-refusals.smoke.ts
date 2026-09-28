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
import { fakeGithub } from './merge-bot-retire-github-double';

/**
 * `merge-bot retire` against real git: the tips and remotes it must not
 * retire, so it deletes NOTHING. Each case snapshots every ref of the branch
 * in the bare remote and the work clone, runs the command, and checks the
 * exit code, that every ref is where it was, and that no token was minted
 * where no remote delete was due. The retire paths are
 * `merge-bot-retire.smoke.ts`; the states that refuse (in use, symbolic,
 * case collisions, the default by name) are `merge-bot-retire-in-use.smoke.ts`.
 *
 * Real IO makes this a smoke; `test:e2e` gates it.
 */

const BRANCH = 'feat/keep-me';

function snapshot(rig: RetireRig): readonly (string | undefined)[] {
  return [
    refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
  ];
}

/** Run the command and check the exit code, and that no ref of the branch moved. */
async function expectUntouched(rig: RetireRig, exit: number, onMint?: () => void): Promise<string> {
  const before = snapshot(rig);
  const github = fakeGithub(rig, onMint === undefined ? {} : { onMint });
  const run = await retire(rig, BRANCH, github.fetchImpl);

  assert.equal(run.exit, exit, `expected exit ${exit}: ${run.err}`);
  if (onMint === undefined) {
    assert.deepEqual(snapshot(rig), before, 'a ref of the branch moved');
    assert.equal(github.mints(), 0, 'a token was minted for a refusal');
  }
  // Under --json the refusal is the outcome object on stdout.
  return `${run.out}${run.err}`;
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
    let moved: string | undefined;
    await expectUntouched(rig, 3, () => {
      moved = commitAndPush(rig, BRANCH, 'pushed while the command ran');
    });
    assert.equal(
      refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
      moved,
      'the new remote tip was lost',
    );
    assert.notEqual(
      refAt(rig, rig.work, `refs/heads/${BRANCH}`),
      undefined,
      'the local branch was deleted',
    );
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
await keepsEverythingWhenTheRemoteCannotBeRead();
process.stdout.write('merge-bot retire refusals smoke: OK (six cases, nothing deleted)\n');
