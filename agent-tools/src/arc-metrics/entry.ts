/**
 * Transcript entry shape and line parsing for the `arc-metrics` topic.
 *
 * @remarks
 * A vendor transcript carries one JSON object per line, of several kinds, and
 * this module validates only the fields the measures read — a closed schema over
 * an open record, so an unknown entry kind parses to the fields we asked for
 * rather than failing the session. An unparseable line yields `undefined`: a
 * transcript being written has a partial tail line, which is ordinary.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

import { parseJsonLine } from '../core/parse-json-line.js';

const usageSchema = z.object({
  input_tokens: z.number().int().nonnegative().default(0),
  output_tokens: z.number().int().nonnegative().default(0),
  cache_creation_input_tokens: z.number().int().nonnegative().default(0),
  cache_read_input_tokens: z.number().int().nonnegative().default(0),
});

const entrySchema = z.object({
  type: z.string().optional(),
  timestamp: z.string().optional(),
  isCompactSummary: z.boolean().optional(),
  operation: z.string().optional(),
  content: z.unknown().optional(),
  message: z
    .object({
      id: z.string().optional(),
      usage: usageSchema.optional(),
      content: z.unknown().optional(),
    })
    .optional(),
});

/** One transcript entry, narrowed to the fields the measures read. */
export type Entry = z.infer<typeof entrySchema>;

/**
 * Parse one transcript line into an entry.
 *
 * @param line - One line of the transcript.
 * @returns The entry, or `undefined` for a blank, unparseable, or
 *   non-conforming line.
 */
export function parseEntry(line: string): Entry | undefined {
  const trimmed = line.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  const parsed = parseJsonLine(trimmed);
  if (parsed === undefined) {
    return undefined;
  }
  const result = entrySchema.safeParse(parsed);
  return result.success ? result.data : undefined;
}

/**
 * Read an entry's timestamp as epoch milliseconds.
 *
 * @param entry - The entry.
 * @returns Milliseconds, or `null` when absent or unparseable.
 */
export function timestampOf(entry: Entry): number | null {
  if (entry.timestamp === undefined) {
    return null;
  }
  const at = Date.parse(entry.timestamp);
  return Number.isFinite(at) ? at : null;
}
