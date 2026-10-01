import { describe, expect, it } from 'vitest';

import type { GitCommandResult, GitExecutor } from './git-executor.js';
import { REFUSAL_TRANSCRIPT_BOUND } from './push-attempts.js';
import { gitFake, REFUSED_PUSH, runPush, tokenStoreFake } from './test-helpers/push-cli-double.js';

/**
 * `merge-bot push`'s bounded retry at the front door: a push GitHub refuses
 * before the pre-push hook runs is tried again on the retry's schedule, and
 * the run ends as an operational failure once the schedule is spent. Which
 * transcript is the refusal is `push-attempts.unit.test.ts`'s; the retry over
 * a run of attempts is `push-attempts.integration.test.ts`'s.
 */

/**
 * The repository's own pre-push gate chain on a green run, 1,852,962 bytes
 * (measured 2026-08-06, `merge-bot-push-output.smoke.ts` holds the
 * measurement), twice over: R1's proof bar for output this command does not
 * control.
 */
const DRIVE_BYTES = 1_852_962 * 2;

describe('merge-bot push retry', () => {
  it('reports a push GitHub refused on every attempt as an operational failure, nothing on stdout, the refusal shown', async () => {
    const run = runPush({ args: ['--json'], git: gitFake(REFUSED_PUSH) });

    expect(await run.exit).toBe(1);
    expect(run.out()).toBe('');
    expect(run.errText()).toContain('denied to jimbot-oakington-iii[bot]');
    expect(run.errText()).toContain('nothing was pushed');
  });

  it('tries again a refusal the executor captured instead of streaming', async () => {
    const gitExecutor: GitExecutor = () => REFUSED_PUSH;
    const run = runPush({ git: { gitExecutor, calls: [] } });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('trying again with the same token');
    expect(run.errText()).toContain('nothing was pushed');
  });

  it('never tries again a refusal whose token directory could not be removed: the warning is not the refusal', async () => {
    const store = tokenStoreFake({
      remove: () => {
        throw new Error('the directory is busy');
      },
    });
    const run = runPush({ git: gitFake(REFUSED_PUSH), store });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('the directory is busy');
    expect(run.errText()).not.toContain('trying again');
  });

  it('streams a failed push that printed twice the measured gate output in full, and never takes it for the refusal (R1)', async () => {
    const loud: GitCommandResult = { ...REFUSED_PUSH, stdout: 'x'.repeat(DRIVE_BYTES) };
    const run = runPush({ git: gitFake(loud) });

    expect(await run.exit).toBe(1);
    expect(run.errText().length).toBeGreaterThan(DRIVE_BYTES);
    expect(run.errText()).not.toContain('trying again');
  });

  it('never tries again a push whose refusal lines follow more output than the refusal check keeps', async () => {
    const padded: GitCommandResult = {
      ...REFUSED_PUSH,
      stdout: '\n'.repeat(REFUSAL_TRANSCRIPT_BOUND + 1),
    };
    const run = runPush({ git: gitFake(padded) });

    expect(await run.exit).toBe(1);
    expect(run.errText()).not.toContain('trying again');
  });
});
