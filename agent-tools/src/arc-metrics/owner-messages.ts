/**
 * Which transcript entries are the owner speaking, and which are not.
 *
 * @remarks
 * Two entry classes carry the owner's words: a user turn, and a
 * `queue-operation` `enqueue` — the record of a message typed while a turn was
 * running. Counting user turns alone dropped about a quarter of the owner's
 * messages in the measured arc. A queued message that waits for the turn to
 * end is recorded in both classes, and only that pair is counted once (see
 * {@link createOwnerMessageCounter}).
 *
 * Everything else that arrives user-shaped is harness or peer traffic: relays
 * from another session (in both spellings the harness uses), usage-limit
 * continues, compaction summaries, task and tool wrappers, slash-command
 * envelopes, shell echoes from `!` commands, skill re-invocation notices and
 * interrupt markers. Those are excluded — and COUNTED as excluded, so a caller
 * can tell "the owner said nothing" from "the filter removed everything". A
 * predicate over a filtered set that reports only its survivors lets an empty
 * set read as a satisfied predicate, which is the generator behind two
 * merge-gate defects this estate met on 2026-09-16.
 *
 * @packageDocumentation
 */

import type { Entry } from './entry.js';

const NOT_OWNER_PREFIXES = [
  'Another Claude session sent',
  '<cross-session',
  '[Cross-session',
  'Your claude.ai usage limit',
  'This session is being continued',
  '<system-reminder',
  '<local-command',
  '<task-notification',
  '<command-name',
  '<command-message',
  '<bash-input',
  '<bash-stdout',
  '(Re-invocation of',
  '[Request interrupted',
  '[SYSTEM',
  'Caveat:',
  'Base directory for this skill',
] as const;

/** One transcript's owner-message counts. */
export interface OwnerMessageTally {
  readonly messages: number;
  readonly midTurn: number;
  /** User-shaped entries excluded as harness or peer traffic, never silently. */
  readonly filtered: number;
}

/** Counts one transcript's owner messages, entry by entry in transcript order. */
export interface OwnerMessageCounter {
  readonly absorb: (entry: Entry) => void;
  readonly tally: () => OwnerMessageTally;
}

/**
 * Create a counter for one transcript's owner messages.
 *
 * @remarks
 * A message typed while a turn runs is recorded at its `enqueue`; if it waits
 * for the turn to end, it is recorded again as the user turn it is delivered
 * as. The transcript links the two by their text alone, so a turn whose text
 * matches a still-queued message is that message's delivery and is not counted
 * again. A message leaves the queue by that delivery or by a `remove` carrying
 * its text (absorbed into the running turn), after which the same words are a
 * new message. Nothing else is deduplicated: two identical messages are two.
 *
 * @returns A counter to feed entries to, and to read the tally from.
 */
export function createOwnerMessageCounter(): OwnerMessageCounter {
  const queued = new Map<string, number>();
  const tally = { messages: 0, midTurn: 0, filtered: 0 };
  return {
    absorb: (entry) => {
      const removed = removedText(entry);
      if (removed !== undefined) {
        takeQueued(queued, removed);
        return;
      }
      const split = classifyOwnerTexts(entry);
      tally.filtered += split.filtered;
      for (const text of split.kept) {
        if (entry.type === 'queue-operation') {
          tally.messages += 1;
          tally.midTurn += 1;
          queued.set(text, (queued.get(text) ?? 0) + 1);
        } else if (!takeQueued(queued, text)) {
          tally.messages += 1;
        }
      }
    },
    tally: () => ({ ...tally }),
  };
}

function removedText(entry: Entry): string | undefined {
  if (entry.type !== 'queue-operation' || entry.operation !== 'remove') {
    return undefined;
  }
  return typeof entry.content === 'string' ? entry.content.trim() : undefined;
}

function takeQueued(queued: Map<string, number>, text: string): boolean {
  const waiting = queued.get(text) ?? 0;
  if (waiting === 0) {
    return false;
  }
  if (waiting === 1) {
    queued.delete(text);
  } else {
    queued.set(text, waiting - 1);
  }
  return true;
}

interface OwnerTextSplit {
  readonly kept: readonly string[];
  readonly filtered: number;
}

function classifyOwnerTexts(entry: Entry): OwnerTextSplit {
  const kept: string[] = [];
  let filtered = 0;
  for (const text of candidateTexts(entry)) {
    if (NOT_OWNER_PREFIXES.some((prefix) => text.startsWith(prefix))) {
      filtered += 1;
    } else {
      kept.push(text);
    }
  }
  return { kept, filtered };
}

function candidateTexts(entry: Entry): readonly string[] {
  if (entry.type === 'queue-operation') {
    return entry.operation === 'enqueue' && typeof entry.content === 'string'
      ? nonEmpty(entry.content)
      : [];
  }
  if (entry.type !== 'user' || entry.message === undefined) {
    return [];
  }
  const content = entry.message.content;
  if (typeof content === 'string') {
    return nonEmpty(content);
  }
  if (!Array.isArray(content)) {
    return [];
  }
  return content.flatMap((block) => {
    const text = textOfBlock(block);
    return text === undefined ? [] : nonEmpty(text);
  });
}

function textOfBlock(block: unknown): string | undefined {
  if (typeof block !== 'object' || block === null) {
    return undefined;
  }
  if (!('type' in block) || block.type !== 'text') {
    return undefined;
  }
  return 'text' in block && typeof block.text === 'string' ? block.text : undefined;
}

function nonEmpty(raw: string): readonly string[] {
  const text = raw.trim();
  return text.length === 0 ? [] : [text];
}
