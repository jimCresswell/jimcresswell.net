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

import type { Result } from '@engraph/result';
import { typeSafeEntries, typeSafeKeys } from '@engraph/type-helpers';
import { z } from 'zod';

import { snapshotEnv } from './pre-compact-env-snapshot.ts';
import type { SiblingFile } from './pre-compact-siblings.ts';

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

/** How reading a payload went. `schema-mismatch` means valid JSON whose known fields did not all validate. */
export type PayloadReadStatus = 'ok' | 'empty' | 'unparseable-json' | 'schema-mismatch';

/** How the observation's payload went: read, or `stdin-unreadable` when the hook could not read its stdin at all. */
export type PayloadStatus = PayloadReadStatus | 'stdin-unreadable';

/** Everything the entry point measures, passed in so this module stays pure. */
export interface ObservationInput {
  readonly nowIso: string;
  readonly marker: string;
  /** The text the harness wrote to the hook's stdin, or why it could not be read. */
  readonly stdin: Result<string, string>;
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly cwd: string;
  readonly argv: readonly string[];
  readonly transcriptBytes?: number | undefined;
  readonly projectSiblings?: readonly SiblingFile[] | undefined;
  readonly projectSiblingsTotal?: number | undefined;
}

/** The payload fields of an observation whose stdin was read. */
interface ReadPayloadEvidence {
  readonly payloadStatus: PayloadReadStatus;
  readonly payloadKeys: readonly string[];
  readonly known: KnownFields;
  readonly mismatchedFields: readonly string[];
  readonly rawStdinBytes: number;
  readonly rawStdin: string;
  readonly stdinReadError?: undefined;
}

/** The payload fields of an observation whose stdin could not be read: nothing of it was measured. */
interface UnreadablePayloadEvidence {
  readonly payloadStatus: 'stdin-unreadable';
  readonly payloadKeys: readonly [];
  readonly known: KnownFields;
  readonly mismatchedFields: readonly [];
  readonly rawStdinBytes?: undefined;
  readonly rawStdin?: undefined;
  readonly stdinReadError: string;
}

/** The fields of an observation that are not about its payload. */
interface ObservationContext {
  readonly at: string;
  readonly marker: string;
  readonly event: 'PreCompact';
  readonly cwd: string;
  readonly argv: readonly string[];
  readonly envValues: Readonly<Record<string, string>>;
  readonly envNamesWithheld: readonly string[];
  /** Undefined when not measured: the payload named no transcript, or its size could not be read. */
  readonly transcriptBytes: number | undefined;
  readonly projectSiblings: readonly SiblingFile[];
  /**
   * How many entries sat beside the transcript before `selectSiblings` capped the list.
   * Undefined when not measured: the payload named no transcript, or its directory could not be
   * listed; an empty directory reads 0.
   */
  readonly projectSiblingsTotal: number | undefined;
}

/** One line of the observation log; its payload fields agree with its status by construction. */
export type Observation = ObservationContext & (ReadPayloadEvidence | UnreadablePayloadEvidence);

/** The result of reading a payload: how it went, its top-level keys, and the fields that validated. */
export interface PayloadRead {
  readonly status: PayloadReadStatus;
  readonly keys: readonly string[];
  readonly known: KnownFields;
  /** The known fields present with the wrong type, by name. */
  readonly mismatchedFields: readonly string[];
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
 * Build the observation record.
 *
 * @param input - Everything the entry point measured.
 * @returns One log line's worth of evidence about this compaction.
 */
export function buildObservation(input: ObservationInput): Observation {
  const env = snapshotEnv(input.env);

  return {
    at: input.nowIso,
    marker: input.marker,
    event: 'PreCompact',
    ...payloadEvidence(input.stdin),
    cwd: input.cwd,
    argv: input.argv,
    envValues: env.values,
    envNamesWithheld: env.withheld,
    transcriptBytes: input.transcriptBytes,
    projectSiblings: input.projectSiblings ?? [],
    projectSiblingsTotal: input.projectSiblingsTotal,
  };
}

function payloadEvidence(
  stdin: Result<string, string>,
): ReadPayloadEvidence | UnreadablePayloadEvidence {
  if (!stdin.ok) {
    return {
      payloadStatus: 'stdin-unreadable',
      payloadKeys: [],
      known: {},
      mismatchedFields: [],
      stdinReadError: stdin.error,
    };
  }
  const payload = readPayload(stdin.value);
  return {
    payloadStatus: payload.status,
    payloadKeys: payload.keys,
    known: payload.known,
    mismatchedFields: payload.mismatchedFields,
    rawStdinBytes: Buffer.byteLength(stdin.value, 'utf8'),
    rawStdin: stdin.value,
  };
}
