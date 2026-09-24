import { describe, expect, it } from 'vitest';

import {
  signalProcess,
  signalProcessGroup,
  sweepProcessGroup,
  type SignalOutcome,
} from './process-group.js';

/**
 * Signalling a child or its process group, and sweeping the group once the
 * child has ended. Only ESRCH proves a target has ended. EPERM answers both
 * for a group whose members have all exited and are not yet reaped (macOS,
 * for about half a millisecond after a group SIGKILL, measured) and for a
 * group holding a live process this user may not signal, so a sweep waits
 * for ESRCH and reports a group that never gives it as not cleared.
 */

function failingKill(code: string): (pid: number, signal: NodeJS.Signals) => true {
  return () => {
    throw Object.assign(new Error(`kill ${code}`), { code });
  };
}

/** A group that answers each SIGKILL with the next outcome, repeating the last. */
function scriptedGroup(outcomes: readonly SignalOutcome[]): {
  readonly signal: (signal: NodeJS.Signals) => SignalOutcome;
  readonly sent: NodeJS.Signals[];
} {
  const sent: NodeJS.Signals[] = [];
  return {
    sent,
    signal: (signal) => {
      sent.push(signal);
      return outcomes[Math.min(sent.length, outcomes.length) - 1] ?? 'ended';
    },
  };
}

/** A sweep's patience whose sleeps are recorded, not slept. */
function recordedPatience(): {
  readonly patience: Parameters<typeof sweepProcessGroup>[1];
  readonly slept: number[];
} {
  const slept: number[] = [];
  return {
    slept,
    patience: {
      attempts: 4,
      intervalMs: 10,
      sleep: async (milliseconds) => {
        slept.push(milliseconds);
      },
    },
  };
}

describe('signalProcessGroup and signalProcess', () => {
  it.each([
    { name: 'a signalled target', kill: (): true => true, outcome: 'signalled' },
    { name: 'no such target (ESRCH)', kill: failingKill('ESRCH'), outcome: 'ended' },
    {
      name: 'a target it may not signal (EPERM)',
      kill: failingKill('EPERM'),
      outcome: 'not-permitted',
    },
  ])('report $name as $outcome', ({ kill, outcome }) => {
    expect(signalProcessGroup(4242, 'SIGKILL', kill)).toBe(outcome);
    expect(signalProcess(4242, 'SIGKILL', kill)).toBe(outcome);
  });

  it('signal the group through its negated leader, and a process through its own pid', () => {
    const targets: number[] = [];
    const kill = (pid: number): true => {
      targets.push(pid);
      return true;
    };

    signalProcessGroup(4242, 'SIGTERM', kill);
    signalProcess(4242, 'SIGTERM', kill);

    expect(targets).toStrictEqual([-4242, 4242]);
  });

  it('report any other failure', () => {
    expect(() => signalProcessGroup(4242, 'SIGKILL', failingKill('EINVAL'))).toThrow('kill EINVAL');
    expect(() => signalProcess(4242, 'SIGKILL', failingKill('EINVAL'))).toThrow('kill EINVAL');
  });

  it('report a launch that never got a pid as having nothing left to signal', () => {
    expect(signalProcessGroup(undefined, 'SIGKILL', failingKill('EINVAL'))).toBe('ended');
    expect(signalProcess(undefined, 'SIGKILL', failingKill('EINVAL'))).toBe('ended');
  });
});

describe('sweepProcessGroup', () => {
  it.each([
    { name: 'an empty group', outcomes: ['ended'] },
    { name: 'a group of unreaped members', outcomes: ['not-permitted', 'not-permitted', 'ended'] },
    { name: 'a group with a straggler', outcomes: ['signalled', 'not-permitted', 'ended'] },
  ] as const)('reports $name as cleared once the kernel says so', async ({ outcomes }) => {
    const group = scriptedGroup(outcomes);
    const { patience, slept } = recordedPatience();

    await expect(sweepProcessGroup(group.signal, patience)).resolves.toBe('cleared');
    expect(group.sent).toStrictEqual(outcomes.map(() => 'SIGKILL'));
    expect(slept).toStrictEqual(outcomes.slice(1).map(() => patience.intervalMs));
  });

  it.each([
    { name: 'a member it may not signal', outcomes: ['not-permitted'] },
    { name: 'a member that will not die', outcomes: ['signalled'] },
  ] as const)('reports a group with $name as not cleared', async ({ outcomes }) => {
    const group = scriptedGroup(outcomes);
    const { patience, slept } = recordedPatience();

    await expect(sweepProcessGroup(group.signal, patience)).resolves.toBe('not-cleared');
    expect(group.sent).toHaveLength(patience.attempts);
    expect(slept).toHaveLength(patience.attempts - 1);
  });
});
