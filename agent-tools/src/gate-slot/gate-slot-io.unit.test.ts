import { describe, expect, it } from 'vitest';

import { createGateSlotIo, type GateSlotHost } from './gate-slot-io.js';

/**
 * Composing the gate-slot ports. Only a POSIX host can run a gate in its own
 * process group and signal the whole group, so only there may a gate run.
 */

const HOST: Omit<GateSlotHost, 'platform'> = {
  ports: {
    host: '127.0.0.1',
    mutexPort: 41_000,
    slotPorts: [41_001],
    patience: { mutexAttempts: 1, mutexRetryMs: 1, identityTimeoutMs: 1 },
  },
  worktree: '/work/here',
  limit: 2,
  heldMarker: undefined,
  childCommand: 'pnpm',
  childMaxMs: 1000,
  childGraceMs: 100,
};

describe('createGateSlotIo', () => {
  it.each([
    { platform: 'darwin', processGroups: true },
    { platform: 'linux', processGroups: true },
    { platform: 'win32', processGroups: false },
  ] as const)(
    'on $platform, reports process groups as $processGroups',
    ({ platform, processGroups }) => {
      expect(createGateSlotIo({ ...HOST, platform }).processGroups).toBe(processGroups);
    },
  );
});
