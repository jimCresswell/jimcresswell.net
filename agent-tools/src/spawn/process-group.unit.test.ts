import { describe, expect, it } from 'vitest';

import { signalProcessGroup } from './process-group.js';

/**
 * Signalling a child's process group. A group that has ended is not an error:
 * Linux reports it as ESRCH, and macOS as EPERM while the group holds only
 * members that have exited and are not yet reaped. Anything else is.
 */

function failingKill(code: string): (pid: number, signal: NodeJS.Signals) => true {
  return () => {
    throw Object.assign(new Error(`kill ${code}`), { code });
  };
}

describe('signalProcessGroup', () => {
  it.each([
    { name: 'no such group (ESRCH)', code: 'ESRCH' },
    { name: 'a group of unreaped members (EPERM, macOS)', code: 'EPERM' },
  ])('treats $name as a group that has ended', ({ code }) => {
    expect(() => signalProcessGroup(4242, 'SIGKILL', failingKill(code))).not.toThrow();
  });

  it('reports any other failure', () => {
    expect(() => signalProcessGroup(4242, 'SIGKILL', failingKill('EINVAL'))).toThrow('kill EINVAL');
  });

  it('does nothing for a launch that never got a pid', () => {
    expect(() => signalProcessGroup(undefined, 'SIGKILL', failingKill('EINVAL'))).not.toThrow();
  });
});
