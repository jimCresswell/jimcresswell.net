/**
 * Which transcript entries are the owner speaking, and which are not.
 *
 * @remarks
 * Two entry classes carry the owner's words: a user turn, and a
 * `queue-operation` `enqueue` — the record of a message typed while a turn was
 * running. Counting user turns alone dropped about a quarter of the owner's
 * messages in the measured arc.
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

/** An entry's owner texts, split into what counts and what was removed. */
export interface OwnerTextSplit {
  readonly kept: readonly string[];
  readonly filtered: number;
}

/**
 * Split one entry's candidate texts into owner messages and excluded traffic.
 *
 * @param entry - The transcript entry.
 * @returns The texts that count as the owner speaking, and how many candidates
 *   the exclusion list removed.
 */
export function classifyOwnerTexts(entry: Entry): OwnerTextSplit {
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
