import { describe, expect, it } from 'vitest';

import { signalProcessGroup, sweepProcessGroup, type SignalOutcome } from './process-group.js';

/**
 * Signalling a child's process group, and sweeping the group once the child
 * has ended. Only ESRCH proves a group has ended. EPERM answers both for a
 * group whose members have all exited and are not yet reaped (macOS, for
 * about half a millisecond after a group SIGKILL, measured) and for a group
 * holding a live process this user may not signal, so a sweep waits for
 * ESRCH and reports a group that never gives it as not cleared. That the
 * signal reaches every member of the group is proven on real processes by
 * the gate-slot wrapper smoke.
 */

function failingKill(code: string): (pid: number, signal: NodeJS.Signals) => true {
  return () => {
    throw Object.assign(new Error(`kill ${code}`), { code });
  };
}

/** A group whose kernel answers each SIGKILL with the next outcome, repeating the last. */
function scriptedGroup(
  outcomes: readonly SignalOutcome[],
): (signal: NodeJS.Signals) => SignalOutcome {
  let answered = 0;
  return () => {
    answered += 1;
    return outcomes[Math.min(answered, outcomes.length) - 1] ?? 'ended';
  };
}

/** Three SIGKILLs at most; the waits between them are not slept. */
const PATIENCE = { attempts: 3, intervalMs: 10, sleep: async (): Promise<void> => undefined };

describe('signalProcessGroup', () => {
  it.each([
    { name: 'a signalled group', kill: (): true => true, outcome: 'signalled' },
    { name: 'no such group (ESRCH)', kill: failingKill('ESRCH'), outcome: 'ended' },
    {
      name: 'a group it may not signal (EPERM)',
      kill: failingKill('EPERM'),
      outcome: 'not-permitted',
    },
  ])('reports $name as $outcome', ({ kill, outcome }) => {
    expect(signalProcessGroup(4242, 'SIGKILL', kill)).toBe(outcome);
  });

  it('reports any other failure', () => {
    expect(() => signalProcessGroup(4242, 'SIGKILL', failingKill('EINVAL'))).toThrow('kill EINVAL');
  });

  it('reports a launch that never got a pid as having nothing left to signal', () => {
    expect(signalProcessGroup(undefined, 'SIGKILL', failingKill('EINVAL'))).toBe('ended');
  });
});

describe('sweepProcessGroup', () => {
  it.each([
    { name: 'an empty group', outcomes: ['ended'] },
    { name: 'a group of unreaped members', outcomes: ['not-permitted', 'not-permitted', 'ended'] },
    { name: 'a group with a straggler', outcomes: ['signalled', 'not-permitted', 'ended'] },
  ] as const)('reports $name as cleared once the kernel says so', async ({ outcomes }) => {
    await expect(sweepProcessGroup(scriptedGroup(outcomes), PATIENCE)).resolves.toBe('cleared');
  });

  it.each([
    { name: 'a member it may not signal', outcomes: ['not-permitted'] },
    { name: 'a member that will not die', outcomes: ['signalled'] },
    {
      name: 'a member that dies only after the last SIGKILL',
      outcomes: ['signalled', 'signalled', 'signalled', 'ended'],
    },
  ] as const)('reports a group with $name as not cleared', async ({ outcomes }) => {
    await expect(sweepProcessGroup(scriptedGroup(outcomes), PATIENCE)).resolves.toBe('not-cleared');
  });
});
