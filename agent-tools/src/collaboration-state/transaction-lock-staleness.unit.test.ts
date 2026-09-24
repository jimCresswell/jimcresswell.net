import { describe, expect, it } from 'vitest';

import { isStaleLock } from './transaction-lock-staleness.js';

/**
 * When a waiter may reclaim a transaction lock. The lock's age is its owner's
 * `created_at`; when the owner file is missing or unreadable (a holder that
 * died between making the directory and writing the file), it is the
 * directory's own modification time, so such a lock is still reclaimed.
 */

const NOW = Date.parse('2026-09-24T08:00:00.000Z');
const STALE_MS = 30_000;
const OLD = '2026-09-24T07:59:00.000Z';
const FRESH = '2026-09-24T07:59:50.000Z';

describe('isStaleLock', () => {
  it.each([
    {
      name: 'an owner older than the stale age, in a fresh directory',
      owner: OLD,
      directory: Date.parse(FRESH),
      stale: true,
    },
    {
      name: 'an owner within the stale age, in an old directory',
      owner: FRESH,
      directory: Date.parse(OLD),
      stale: false,
    },
    {
      name: 'an owner exactly the stale age old, in an old directory',
      owner: '2026-09-24T07:59:30.000Z',
      directory: Date.parse(OLD),
      stale: false,
    },
    {
      name: 'no owner and an old directory',
      owner: undefined,
      directory: Date.parse(OLD),
      stale: true,
    },
    {
      name: 'no owner and a fresh directory',
      owner: undefined,
      directory: Date.parse(FRESH),
      stale: false,
    },
    {
      name: 'an unreadable owner time and an old directory',
      owner: 'soon',
      directory: Date.parse(OLD),
      stale: true,
    },
  ])('reads $name as stale: $stale', ({ owner, directory, stale }) => {
    expect(
      isStaleLock({
        ownerCreatedAt: owner,
        directoryModifiedMs: directory,
        nowMs: NOW,
        staleMs: STALE_MS,
      }),
    ).toBe(stale);
  });
});
