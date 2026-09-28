import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  git,
  mergedBranch,
  outcomeOf,
  refAt,
  retire,
  withRig,
  type RetireRig,
} from './merge-bot-retire-fixture';
import { fakeGithub, type GithubDoubleOptions } from './merge-bot-retire-github-double';

/**
 * `merge-bot retire` against real git: failures around the delete. Each case
 * runs a merged branch present on the remote, in the cache and locally, with
 * GitHub or git failing at one step, and checks exit 1 and where every name
 * is afterwards. No local name may go unless the remote reads back absent;
 * a local delete that fails is reported as failed, never as moved.
 *
 * Real IO makes this a smoke; `test:e2e` gates it.
 */

const BRANCH = 'feat/fail-me';

type Where = 'kept' | 'gone';

/** Whether each name (remote, tracking, local) is where its proof left it, or gone. */
function names(rig: RetireRig, tip: string): readonly (Where | string)[] {
  return [
    refAt(rig, rig.origin, `refs/heads/${BRANCH}`),
    refAt(rig, rig.work, `refs/remotes/origin/${BRANCH}`),
    refAt(rig, rig.work, `refs/heads/${BRANCH}`),
  ].map((sha) => {
    if (sha === undefined) {
      return 'gone';
    }
    return sha === tip ? 'kept' : sha;
  });
}

/** Retire the branch under `options`; check exit 1, the outcome kind, and where each name is. */
async function expectFailure(
  options: (rig: RetireRig) => GithubDoubleOptions,
  kind: 'failed' | 'partial',
  expected: readonly Where[],
): Promise<string> {
  return withRig(async (rig) => {
    const tip = mergedBranch(rig, BRANCH);
    git(rig, rig.work, 'fetch', '-q', 'origin');
    git(rig, rig.work, 'branch', '-q', '--track', BRANCH, `origin/${BRANCH}`);
    const run = await retire(rig, BRANCH, fakeGithub(rig, options(rig)).fetchImpl);

    assert.equal(run.exit, 1, `expected a failure: ${run.out}${run.err}`);
    const outcome = outcomeOf(run);
    assert.equal(outcome.kind, kind);
    assert.deepEqual(names(rig, tip), expected, 'a name is not where the failure should leave it');
    return outcome.reason ?? '';
  });
}

// GitHub answers success to the delete and changes nothing: the read-back decides.
await expectFailure(() => ({ updateRefs: 'accepts-without-deleting' }), 'failed', [
  'kept',
  'kept',
  'kept',
]);

// The token cannot be minted: nothing is read or deleted after it.
await expectFailure(() => ({ failMint: true }), 'failed', ['kept', 'kept', 'kept']);

// The re-read at the mint fails: nothing is deleted.
await expectFailure(() => ({ failGraphqlCall: 1 }), 'failed', ['kept', 'kept', 'kept']);

// The remote is deleted but its read-back fails: its state is unknown, so no local name goes.
await expectFailure(() => ({ failGraphqlCall: 3 }), 'failed', ['gone', 'kept', 'kept']);

// The local branch is locked when its delete runs: failed at its proven sha, never "moved".
const locked = await expectFailure(
  (rig) => ({
    onMint: () => writeFileSync(join(rig.work, '.git', 'refs', 'heads', `${BRANCH}.lock`), ''),
  }),
  'partial',
  ['gone', 'gone', 'kept'],
);
assert.match(locked, /was not deleted/u);
assert.doesNotMatch(locked, /moved/u);

// The config is locked when its section is removed: the names go, and the section is reported left.
const configLeft = await expectFailure(
  (rig) => ({ onMint: () => writeFileSync(join(rig.work, '.git', 'config.lock'), '') }),
  'partial',
  ['gone', 'gone', 'gone'],
);
assert.match(configLeft, /config was left/u);

process.stdout.write('merge-bot retire failsafe smoke: OK (six failures, no name lost early)\n');
