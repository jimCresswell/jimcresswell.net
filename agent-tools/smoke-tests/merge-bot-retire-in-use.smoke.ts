import assert from 'node:assert/strict';
import { join } from 'node:path';

import {
  git,
  mergedBranch,
  refAt,
  retire,
  withRig,
  type RetireRig,
} from './merge-bot-retire-fixture';
import { fakeGithub } from './merge-bot-retire-github-double';

/**
 * `merge-bot retire` against real git: the states that refuse whatever the
 * tips are (a branch in use in a worktree, a symbolic ref, a case collision,
 * the default branch named directly), so it deletes NOTHING. Each case
 * checks exit 3, the refs it names unchanged in the bare remote and the work
 * clone, and no token minted. The tip refusals are
 * `merge-bot-retire-refusals.smoke.ts`.
 *
 * Real IO makes this a smoke; `test:e2e` gates it.
 */

const BRANCH = 'feat/keep-me';

/** Where each named ref is, in the bare remote and the work clone. */
function snapshot(rig: RetireRig, refs: readonly string[]): readonly (string | undefined)[] {
  return refs.flatMap((ref) => [refAt(rig, rig.origin, ref), refAt(rig, rig.work, ref)]);
}

/** Retire `branch`, and check exit 3, `refs` unchanged, no token minted, and the reason. */
async function expectRefused(
  rig: RetireRig,
  branch: string,
  refs: readonly string[],
  reason: RegExp,
): Promise<void> {
  const before = snapshot(rig, refs);
  const github = fakeGithub(rig);
  const run = await retire(rig, branch, github.fetchImpl);

  assert.equal(run.exit, 3, `expected a refusal: ${run.out}${run.err}`);
  assert.deepEqual(snapshot(rig, refs), before, 'a ref moved');
  assert.equal(github.mints(), 0, 'a token was minted for a refusal');
  // Under --json the refusal is the outcome object on stdout.
  assert.match(run.out, reason);
}

const OWN_REFS = [`refs/heads/${BRANCH}`, `refs/remotes/origin/${BRANCH}`];

/** A merged branch with a local copy and a cached tracking ref in the work clone. */
function mergedAndTracked(rig: RetireRig): void {
  mergedBranch(rig, BRANCH);
  git(rig, rig.work, 'fetch', '-q', 'origin');
  git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
}

async function refusesABranchCheckedOutInAWorktree(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    git(rig, rig.work, 'worktree', 'add', '-q', join(rig.root, 'lane'), BRANCH);
    await expectRefused(rig, BRANCH, OWN_REFS, /lane/u);
  });
}

/** A bisect started on the branch detaches HEAD; git's own state still names the branch. */
async function refusesABranchUnderBisect(): Promise<void> {
  await withRig(async (rig) => {
    mergedAndTracked(rig);
    const lane = join(rig.root, 'bisecting');
    git(rig, rig.work, 'worktree', 'add', '-q', lane, BRANCH);
    git(rig, lane, 'commit', '-q', '--allow-empty', '-m', 'second');
    git(rig, lane, 'commit', '-q', '--allow-empty', '-m', 'third');
    git(rig, lane, 'bisect', 'start', 'HEAD', 'HEAD~2');
    await expectRefused(rig, BRANCH, OWN_REFS, /bisecting/u);
  });
}

/**
 * A tracking ref whose name equals the branch's when case is ignored. The
 * fetch writes only the local branch (`--refmap=`): on a case-insensitive
 * filesystem a lowercase tracking directory would absorb the collision's
 * path, and git would list one ref where two names were written.
 */
async function refusesACaseCollision(): Promise<void> {
  await withRig(async (rig) => {
    mergedBranch(rig, BRANCH);
    git(
      rig,
      rig.work,
      'fetch',
      '-q',
      '--refmap=',
      'origin',
      `refs/heads/${BRANCH}:refs/heads/${BRANCH}`,
    );
    const main = git(rig, rig.work, 'rev-parse', 'refs/heads/main');
    git(rig, rig.work, 'update-ref', 'refs/remotes/origin/Feat/Keep-Me', main);
    await expectRefused(
      rig,
      BRANCH,
      [...OWN_REFS, 'refs/remotes/origin/Feat/Keep-Me'],
      /case is ignored/u,
    );
  });
}

/** A local branch that is a symbolic ref to main: a delete through it would delete main. */
async function refusesASymbolicRefToTheDefault(): Promise<void> {
  await withRig(async (rig) => {
    git(rig, rig.work, 'symbolic-ref', 'refs/heads/alias', 'refs/heads/main');
    await expectRefused(rig, 'alias', ['refs/heads/main'], /symbolic/u);
    assert.equal(git(rig, rig.work, 'symbolic-ref', 'refs/heads/alias'), 'refs/heads/main');
  });
}

/** The remote's default branch, named directly, when it is not main. */
async function refusesTheDefaultByName(): Promise<void> {
  await withRig(async (rig) => {
    git(rig, rig.seed, 'branch', 'engraph', 'main');
    git(rig, rig.seed, 'push', '-q', 'origin', 'engraph:engraph');
    git(rig, rig.origin, 'symbolic-ref', 'HEAD', 'refs/heads/engraph');
    await expectRefused(rig, 'engraph', ['refs/heads/engraph'], /default branch/u);
  });
}

await refusesABranchCheckedOutInAWorktree();
await refusesABranchUnderBisect();
await refusesACaseCollision();
await refusesASymbolicRefToTheDefault();
await refusesTheDefaultByName();
process.stdout.write('merge-bot retire in-use smoke: OK (five refusing states, nothing deleted)\n');
