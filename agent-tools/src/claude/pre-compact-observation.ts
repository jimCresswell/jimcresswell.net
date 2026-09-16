/**
 * Pure observation record for the Claude Code `PreCompact` hook.
 *
 * @remarks
 * This module exists to LEARN a shape, not to enforce one. The harness's
 * `PreCompact` contract is documented inconsistently, so the observer is
 * deliberately two-layered:
 *
 * - the fields it USES are validated to an exact schema and never widened
 *   ({@link knownFieldsSchema}), one field at a time, so a field of the wrong
 *   type is reported by name without discarding the fields that validated;
 * - everything else is recorded as opaque evidence (top-level key names, the
 *   raw stdin text), so an unexpected payload is observed rather than
 *   silently admitted as structure.
 *
 * Nothing here performs I/O and nothing here decides anything: this hook never
 * blocks a compaction. The contract it has observed so far is recorded in
 * `.agent/memory/executive/cross-platform-agent-surface-matrix.md` §Hook
 * Support.
 *
 * Loaded from TypeScript source by the hook entry
 * (`src/bin/claude-pre-compact-observe-hook.ts`), so a relative import added
 * here must name its `.ts` file; `pre-compact-observe-hook.smoke.ts` runs the
 * entry the way the harness does and fails if one does not.
 *
 * @packageDocumentation
 */

import { typeSafeEntries, typeSafeKeys } from '@engraph/type-helpers';
import { z } from 'zod';

import { snapshotEnv } from './pre-compact-env-snapshot.ts';

/** The payload fields the observer uses. Every one is optional on purpose: an absent field is itself the finding. */
const knownFieldsSchema = z.object({
  session_id: z.string().optional(),
  transcript_path: z.string().optional(),
  cwd: z.string().optional(),
  hook_event_name: z.string().optional(),
  trigger: z.string().optional(),
  custom_instructions: z.string().nullable().optional(),
});

/** Any JSON object; the known fields are validated separately. */
const payloadObjectSchema = z.record(z.string(), z.unknown());

/** A payload that parsed as a JSON object, before its known fields are validated. */
type PayloadObject = z.infer<typeof payloadObjectSchema>;

/** The validated subset of a `PreCompact` payload. */
export type KnownFields = z.infer<typeof knownFieldsSchema>;

/** How the payload read went. `schema-mismatch` means valid JSON whose known fields did not all validate. */
export type PayloadStatus = 'ok' | 'empty' | 'unparseable-json' | 'schema-mismatch';

/** What kind of directory entry a sibling of the transcript is. */
export type SiblingKind = 'file' | 'directory' | 'other';

/** One entry beside the session's transcript: its name and kind, and its size when it is a file that was measured. */
export interface SiblingFile {
  readonly name: string;
  readonly kind: SiblingKind;
  readonly bytes?: number;
}

/** Everything the entry point measures, passed in so this module stays pure. */
export interface ObservationInput {
  readonly nowIso: string;
  readonly marker: string;
  readonly rawStdin: string;
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly cwd: string;
  readonly argv: readonly string[];
  readonly transcriptBytes?: number | undefined;
  readonly projectSiblings?: readonly SiblingFile[] | undefined;
  readonly projectSiblingsTotal?: number | undefined;
}

/** One line of the observation log. */
export interface Observation {
  readonly at: string;
  readonly marker: string;
  readonly event: 'PreCompact';
  readonly payloadStatus: PayloadStatus;
  readonly payloadKeys: readonly string[];
  readonly known: KnownFields;
  readonly mismatchedFields: readonly string[];
  readonly rawStdinBytes: number;
  readonly rawStdin: string;
  readonly cwd: string;
  readonly argv: readonly string[];
  readonly envValues: Readonly<Record<string, string>>;
  readonly envNamesWithheld: readonly string[];
  readonly transcriptBytes: number | undefined;
  readonly projectSiblings: readonly SiblingFile[];
  /** How many entries sat beside the transcript before {@link selectSiblings} capped the list. */
  readonly projectSiblingsTotal: number | undefined;
}

/** The result of reading a payload: how it went, its top-level keys, and the fields that validated. */
export interface PayloadRead {
  readonly status: PayloadStatus;
  readonly keys: readonly string[];
  readonly known: KnownFields;
  /** The known fields present with the wrong type, by name. */
  readonly mismatchedFields: readonly string[];
}

/** The sibling entries worth measuring, and how many there were before the cap. */
export interface SiblingSelection<T extends { readonly name: string }> {
  readonly entries: readonly T[];
  readonly total: number;
}

/**
 * Read a `PreCompact` payload without widening it.
 *
 * @param rawStdin - The text the harness wrote to the hook's stdin.
 * @returns The fields that validated, the names of those that did not, the raw
 *   top-level key names (evidence, not structure), and how the read went.
 */
export function readPayload(rawStdin: string): PayloadRead {
  const trimmed = rawStdin.trim();
  if (trimmed.length === 0) {
    return { status: 'empty', keys: [], known: {}, mismatchedFields: [] };
  }

  const parsed: unknown = parseJson(trimmed);
  if (parsed === undefined) {
    return { status: 'unparseable-json', keys: [], known: {}, mismatchedFields: [] };
  }

  const payload = payloadObjectSchema.safeParse(parsed);
  if (!payload.success) {
    return { status: 'schema-mismatch', keys: [], known: {}, mismatchedFields: [] };
  }

  const mismatchedFields = mismatchedFieldsOf(payload.data);
  const retained = knownFieldsSchema.safeParse(withoutFields(payload.data, mismatchedFields));
  return {
    status: mismatchedFields.length === 0 ? 'ok' : 'schema-mismatch',
    keys: typeSafeKeys(payload.data),
    known: retained.success ? retained.data : {},
    mismatchedFields,
  };
}

function parseJson(text: string): unknown {
  try {
    const value: unknown = JSON.parse(text);
    return value;
  } catch {
    return undefined;
  }
}

function mismatchedFieldsOf(payload: Readonly<PayloadObject>): readonly string[] {
  const validated = knownFieldsSchema.safeParse(payload);
  if (validated.success) {
    return [];
  }
  const fields = validated.error.issues.flatMap((issue) => {
    const [field] = issue.path;
    return typeof field === 'string' ? [field] : [];
  });
  return [...new Set(fields)].sort((left, right) => left.localeCompare(right));
}

function withoutFields(payload: Readonly<PayloadObject>, fields: readonly string[]): PayloadObject {
  return Object.fromEntries(typeSafeEntries(payload).filter(([key]) => !fields.includes(key)));
}

/**
 * Choose which entries beside the transcript to record.
 *
 * @param entries - Every entry in the transcript's directory, in whatever order
 *   the filesystem returned them.
 * @param limit - The most entries to keep.
 * @returns The entries sorted by name so repeated observations are comparable,
 *   capped at `limit`, and the full count so a capped list never reads as
 *   complete.
 */
export function selectSiblings<T extends { readonly name: string }>(
  entries: readonly T[],
  limit: number,
): SiblingSelection<T> {
  const sorted = [...entries].sort((left, right) => left.name.localeCompare(right.name));
  return { entries: sorted.slice(0, limit), total: entries.length };
}

/**
 * Build the observation record.
 *
 * @param input - Everything the entry point measured.
 * @returns One log line's worth of evidence about this compaction.
 */
export function buildObservation(input: ObservationInput): Observation {
  const payload = readPayload(input.rawStdin);
  const env = snapshotEnv(input.env);

  return {
    at: input.nowIso,
    marker: input.marker,
    event: 'PreCompact',
    payloadStatus: payload.status,
    payloadKeys: payload.keys,
    known: payload.known,
    mismatchedFields: payload.mismatchedFields,
    rawStdinBytes: Buffer.byteLength(input.rawStdin, 'utf8'),
    rawStdin: input.rawStdin,
    cwd: input.cwd,
    argv: input.argv,
    envValues: env.values,
    envNamesWithheld: env.withheld,
    transcriptBytes: input.transcriptBytes,
    projectSiblings: input.projectSiblings ?? [],
    projectSiblingsTotal: input.projectSiblingsTotal,
  };
}
