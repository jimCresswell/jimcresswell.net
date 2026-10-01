import { describe, expect, it } from 'vitest';

import type { GitCommandResult } from './git-executor.js';
import type { PushGitReads } from './push-git.js';
import {
  answered,
  COMMIT,
  EXPIRES_AT,
  gitFake,
  gitReads,
  mintAnswering,
  NOW,
  REFUSED_PUSH,
  runPush,
  TOKEN,
} from './test-helpers/push-cli-double.js';

/**
 * What `merge-bot push` checks before each attempt, the first included: that
 * the token's own expiry leaves room to start, and that HEAD still names the
 * commit the push settled. The pre-push hook validates the checkout, never the
 * commit git is handed, so an attempt made after HEAD moved would land a
 * commit the gate did not run on.
 */

/** Another commit's full object name: where HEAD has moved to. */
const MOVED = 'abc1234abc1234abc1234abc1234abc1234abc12';

/** Answers given in order, the last standing for every call after it. */
function inOrder<T>(first: T, ...rest: readonly T[]): () => T {
  const answers = [...rest];
  let current = first;
  let asked = false;
  return () => {
    if (asked) {
      current = answers.shift() ?? current;
    }
    asked = true;
    return current;
  };
}

/** git's reads, with HEAD's answers given in order. */
function readsWithHead(
  first: GitCommandResult,
  ...rest: readonly GitCommandResult[]
): PushGitReads {
  const next = inOrder(first, ...rest);
  return { ...gitReads(), headCommit: () => Promise.resolve(next()) };
}

const AT_COMMIT = answered(`${COMMIT}\n`);
const AT_MOVED = answered(`${MOVED}\n`);

describe('merge-bot push: the token expiry bounds every attempt', () => {
  it('starts no attempt when the token is already inside its margin, naming the expiry', async () => {
    const run = runPush({ overrides: { nowIsoImpl: () => '2026-08-06T09:56:00.000Z' } });

    expect(await run.exit).toBe(1);
    expect(run.calls).toEqual([]);
    expect(run.errText()).toContain(EXPIRES_AT);
    expect(run.errText()).not.toContain(TOKEN);
  });

  it('starts an attempt at the last instant the margin allows', async () => {
    const run = runPush({ overrides: { nowIsoImpl: () => '2026-08-06T09:55:00.000Z' } });

    expect(await run.exit).toBe(0);
  });

  it('stops a retry once the clock has passed the deadline, after the attempt that was refused', async () => {
    const run = runPush({
      git: gitFake(REFUSED_PUSH),
      overrides: { nowIsoImpl: inOrder(NOW, '2026-08-06T09:56:00.000Z') },
    });

    expect(await run.exit).toBe(1);
    expect(run.calls).toHaveLength(1);
    expect(run.errText()).toContain(EXPIRES_AT);
  });

  it('pushes nothing on an expiry it cannot read as a time', async () => {
    const run = runPush({ mint: mintAnswering(TOKEN, 'in an hour') });

    expect(await run.exit).toBe(1);
    expect(run.calls).toEqual([]);
    expect(run.errText()).toContain('in an hour');
  });
});

describe('merge-bot push: every attempt pushes only while HEAD names the settled commit', () => {
  it('starts no attempt when HEAD moved between the settling and the first attempt', async () => {
    const run = runPush({ reads: readsWithHead(AT_COMMIT, AT_MOVED) });

    expect(await run.exit).toBe(1);
    expect(run.calls).toEqual([]);
    expect(run.errText()).toContain(COMMIT);
    expect(run.errText()).toContain(MOVED);
  });

  it('stops a retry when HEAD moved during the wait, after the one attempt that carried the settled commit', async () => {
    const run = runPush({
      git: gitFake(REFUSED_PUSH),
      reads: readsWithHead(AT_COMMIT, AT_COMMIT, AT_MOVED),
    });

    expect(await run.exit).toBe(1);
    expect(run.calls).toHaveLength(1);
    expect(run.errText()).toContain(MOVED);
  });

  it('starts no attempt when HEAD can no longer be read', async () => {
    const unreadable: GitCommandResult = {
      status: 128,
      signal: null,
      stdout: '',
      stderr: 'fatal: bad object HEAD\n',
    };
    const run = runPush({ reads: readsWithHead(AT_COMMIT, unreadable) });

    expect(await run.exit).toBe(1);
    expect(run.calls).toEqual([]);
  });
});
