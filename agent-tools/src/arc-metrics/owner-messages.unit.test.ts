import { describe, expect, it } from 'vitest';

import { parseEntry, type Entry } from './entry.js';
import { createOwnerMessageCounter, type OwnerMessageTally } from './owner-messages.js';

function entryOf(record: Record<string, unknown>): Entry {
  const entry = parseEntry(JSON.stringify(record));
  if (entry === undefined) {
    throw new Error('fixture did not parse');
  }
  return entry;
}

function turn(at: string, text: string): Entry {
  return entryOf({ type: 'user', timestamp: at, message: { content: text } });
}

function queue(at: string, operation: string, content?: string): Entry {
  return entryOf({ type: 'queue-operation', timestamp: at, operation, content });
}

function tallyOf(...entries: readonly Entry[]): OwnerMessageTally {
  const counter = createOwnerMessageCounter();
  for (const entry of entries) {
    counter.absorb(entry);
  }
  return counter.tally();
}

describe('createOwnerMessageCounter', () => {
  it('counts two identical short messages sent in the same minute as two', () => {
    const tally = tallyOf(turn('2026-09-16T10:00:05Z', 'go'), turn('2026-09-16T10:00:40Z', 'go'));

    expect(tally.messages).toBe(2);
  });

  it('counts a queued message once when it is delivered as its own turn minutes later', () => {
    const tally = tallyOf(
      queue('2026-09-16T10:05:50Z', 'enqueue', 'go'),
      queue('2026-09-16T10:07:30Z', 'dequeue'),
      turn('2026-09-16T10:07:30Z', 'go'),
    );

    expect(tally).toStrictEqual({ messages: 1, midTurn: 1, filtered: 0 });
  });

  it('counts a message typed again after its queued copy was absorbed mid-turn', () => {
    const tally = tallyOf(
      queue('2026-09-16T10:00:05Z', 'enqueue', 'go'),
      queue('2026-09-16T10:00:06Z', 'remove', 'go'),
      turn('2026-09-16T10:00:40Z', 'go'),
    );

    expect(tally.messages).toBe(2);
  });
});
