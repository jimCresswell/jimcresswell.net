/**
 * Pure aggregation of one session transcript into the arc's cost measures.
 *
 * @remarks
 * The measures exist because an arc's cost was reconstructed by hand at the
 * transplant retrospective (2026-09-15) and three counting errors were made on
 * the way; each is closed here by a rule applied once:
 *
 * - **Model calls and tokens are counted per API message id.** One response is
 *   recorded across several entries repeating the same `usage` block, so
 *   summing entries over-counts (three to four times over in the measured arc).
 * - **Owner messages come from two entry classes**, and the excluded ones are
 *   counted rather than dropped (see `owner-messages.ts`).
 * - **Active time is a proxy, and says so.** It sums the gaps between
 *   consecutive events closer together than the threshold: it cannot see
 *   thinking before a burst's first event, and it counts a long tool call as
 *   active. The threshold travels with the report.
 *
 * @packageDocumentation
 */

import { parseEntry, timestampOf, type Entry } from './entry.js';
import { classifyOwnerTexts } from './owner-messages.js';

/** One session's measures. */
export interface SessionMetrics {
  readonly sessionId: string;
  readonly firstAt: string;
  readonly lastAt: string;
  readonly wallSeconds: number;
  readonly activeSeconds: number;
  readonly apiCalls: number;
  readonly toolCalls: number;
  readonly outputTokens: number;
  readonly cacheReadTokens: number;
  readonly medianContextTokens: number;
  readonly compactions: number;
  readonly limitStalls: number;
  readonly ownerMessages: number;
  readonly ownerMessagesMidTurn: number;
  /** User-shaped entries excluded as harness or peer traffic, never silently. */
  readonly ownerMessagesFiltered: number;
}

/** Inputs for {@link aggregateSession}. */
export interface AggregateSessionInput {
  readonly sessionId: string;
  readonly lines: AsyncIterable<string>;
  readonly gapSeconds: number;
}

interface Accumulator {
  first: number | null;
  last: number | null;
  active: number;
  previous: number | null;
  readonly callIds: Set<string>;
  output: number;
  cacheRead: number;
  readonly contexts: number[];
  tools: number;
  compactions: number;
  limits: number;
  readonly ownerKeys: Set<string>;
  midTurn: number;
  filtered: number;
}

/**
 * Aggregate one transcript's lines into its measures.
 *
 * @param input - The session id, its lines, and the active-time gap threshold.
 * @returns The session's measures; an empty transcript yields zeroed measures
 *   with empty timestamps rather than an error.
 */
export async function aggregateSession(input: AggregateSessionInput): Promise<SessionMetrics> {
  const acc = emptyAccumulator();
  for await (const line of input.lines) {
    const entry = parseEntry(line);
    if (entry !== undefined) {
      absorb(acc, entry, input.gapSeconds);
    }
  }
  return report(input.sessionId, acc);
}

function absorb(acc: Accumulator, entry: Entry, gapSeconds: number): void {
  const at = timestampOf(entry);
  if (at !== null && (entry.type === 'user' || entry.type === 'assistant')) {
    trackTime(acc, at, gapSeconds);
  }
  absorbMarkers(acc, entry);
  if (entry.type === 'assistant') {
    absorbAssistant(acc, entry);
  }
  absorbOwnerMessage(acc, entry, at);
}

function absorbMarkers(acc: Accumulator, entry: Entry): void {
  if (entry.isCompactSummary === true) {
    acc.compactions += 1;
  }
  if (entry.type === 'system' && /usage limit reached/i.test(JSON.stringify(entry.content ?? ''))) {
    acc.limits += 1;
  }
}

function trackTime(acc: Accumulator, at: number, gapSeconds: number): void {
  acc.first = acc.first === null ? at : Math.min(acc.first, at);
  acc.last = acc.last === null ? at : Math.max(acc.last, at);
  if (acc.previous !== null) {
    const gap = (at - acc.previous) / 1000;
    if (gap > 0 && gap <= gapSeconds) {
      acc.active += gap;
    }
  }
  acc.previous = at;
}

function absorbAssistant(acc: Accumulator, entry: Entry): void {
  const message = entry.message;
  if (message === undefined) {
    return;
  }
  acc.tools += countToolUses(message.content);
  const { id, usage } = message;
  if (id === undefined || usage === undefined || acc.callIds.has(id)) {
    return;
  }
  acc.callIds.add(id);
  acc.output += usage.output_tokens;
  acc.cacheRead += usage.cache_read_input_tokens;
  acc.contexts.push(
    usage.input_tokens + usage.cache_creation_input_tokens + usage.cache_read_input_tokens,
  );
}

function countToolUses(content: unknown): number {
  return Array.isArray(content) ? content.filter(isToolUse).length : 0;
}

function isToolUse(block: unknown): boolean {
  return (
    typeof block === 'object' && block !== null && 'type' in block && block.type === 'tool_use'
  );
}

function absorbOwnerMessage(acc: Accumulator, entry: Entry, at: number | null): void {
  const { kept, filtered } = classifyOwnerTexts(entry);
  acc.filtered += filtered;
  const minute = at === null ? '' : new Date(at).toISOString().slice(0, 16);
  for (const text of kept) {
    const key = `${minute}|${text.slice(0, 60)}`;
    if (acc.ownerKeys.has(key)) {
      continue;
    }
    acc.ownerKeys.add(key);
    if (entry.type === 'queue-operation') {
      acc.midTurn += 1;
    }
  }
}

function emptyAccumulator(): Accumulator {
  return {
    first: null,
    last: null,
    active: 0,
    previous: null,
    callIds: new Set<string>(),
    output: 0,
    cacheRead: 0,
    contexts: [],
    tools: 0,
    compactions: 0,
    limits: 0,
    ownerKeys: new Set<string>(),
    midTurn: 0,
    filtered: 0,
  };
}

function report(sessionId: string, acc: Accumulator): SessionMetrics {
  const span =
    acc.first === null || acc.last === null ? 0 : Math.round((acc.last - acc.first) / 1000);
  return {
    sessionId,
    firstAt: acc.first === null ? '' : new Date(acc.first).toISOString(),
    lastAt: acc.last === null ? '' : new Date(acc.last).toISOString(),
    wallSeconds: span,
    activeSeconds: Math.round(acc.active),
    apiCalls: acc.callIds.size,
    toolCalls: acc.tools,
    outputTokens: acc.output,
    cacheReadTokens: acc.cacheRead,
    medianContextTokens: median(acc.contexts),
    compactions: acc.compactions,
    limitStalls: acc.limits,
    ownerMessages: acc.ownerKeys.size,
    ownerMessagesMidTurn: acc.midTurn,
    ownerMessagesFiltered: acc.filtered,
  };
}

function median(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle] ?? 0;
  }
  return Math.round(((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2);
}
