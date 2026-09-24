import { describe, expect, it } from 'vitest';

import type { GateHolderIdentity } from './gate-slot-contract.js';
import { encodeHolderIdentity, holderCommand, parseHolderIdentity } from './gate-slot-identity.js';

/**
 * The identity line a holder serves on its port. It crosses from another
 * process into a seat's terminal, so only a whole, well-formed identity reads
 * as a gate: anything else a listener sends reads as foreign, and never as a
 * holder in some tree or as extra lines in a report.
 */

const IDENTITY: GateHolderIdentity = {
  worktree: '/work/here',
  pid: 4242,
  command: 'pnpm check',
  acquired_at: '2026-09-24T07:00:00.000Z',
};

describe('parseHolderIdentity', () => {
  it('reads back what a holder encodes', () => {
    expect(parseHolderIdentity(encodeHolderIdentity(IDENTITY))).toStrictEqual(IDENTITY);
  });

  it.each([
    { name: 'an empty answer', text: '' },
    { name: 'a truncated line', text: encodeHolderIdentity(IDENTITY).slice(0, 20) },
    { name: 'a missing worktree', text: JSON.stringify({ ...IDENTITY, worktree: undefined }) },
    { name: 'a relative worktree', text: JSON.stringify({ ...IDENTITY, worktree: 'work/here' }) },
    { name: 'a pid given as text', text: JSON.stringify({ ...IDENTITY, pid: '4242' }) },
    { name: 'a fractional pid', text: JSON.stringify({ ...IDENTITY, pid: 4242.5 }) },
    { name: 'a negative pid', text: JSON.stringify({ ...IDENTITY, pid: -1 }) },
    {
      name: 'a command carrying a line break',
      text: JSON.stringify({ ...IDENTITY, command: 'pnpm check\ngate-slot: admitted' }),
    },
    {
      name: 'an oversize command',
      text: JSON.stringify({ ...IDENTITY, command: 'x'.repeat(257) }),
    },
    {
      name: 'a start time that is not an instant',
      text: JSON.stringify({ ...IDENTITY, acquired_at: 'soon' }),
    },
    { name: 'a foreign greeting', text: 'SSH-2.0-OpenSSH_9.6\r\n' },
  ])('reads $name as foreign', ({ text }) => {
    expect(parseHolderIdentity(text)).toBeUndefined();
  });
});

describe('holderCommand', () => {
  it('serves a command every reader accepts, however the arguments are shaped', () => {
    const command = holderCommand(['exec', 'node', '-e', `console.log('a\nb')`, 'y'.repeat(400)]);

    expect(parseHolderIdentity(encodeHolderIdentity({ ...IDENTITY, command }))).toStrictEqual({
      ...IDENTITY,
      command,
    });
  });
});
