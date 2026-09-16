/**
 * Pure observation record for the Claude Code `PreCompact` hook.
 *
 * @remarks
 * This module exists to LEARN a shape, not to enforce one. The harness's
 * `PreCompact` contract is documented inconsistently — one documentation page
 * returned three incompatible answers about this event on 2026-09-16 — so the
 * observer is deliberately two-layered:
 *
 * - the fields it USES are validated to an exact schema and never widened
 *   ({@link knownFieldsSchema});
 * - everything else is recorded as opaque evidence (top-level key names, the
 *   raw stdin text), so an unexpected payload is observed rather than
 *   silently admitted as structure.
 *
 * Nothing here performs I/O and nothing here decides anything: this hook never
 * blocks a compaction. The response builder emits the same marker on two
 * different response surfaces so a later transcript read can say WHICH surface
 * the harness actually delivers.
 *
 * @packageDocumentation
 */

import { typeSafeKeys } from '@engraph/type-helpers';
import { z } from 'zod';

/**
 * Environment values recorded with their contents.
 *
 * @remarks
 * Identifiers and session-shape flags only — the variables whose VALUE is the
 * finding (`CLAUDE_CODE_CHILD_SESSION` says whether a hook fired inside a
 * subagent; `CLAUDE_CODE_SESSION_ATTENDED` says whether a human was watching).
 * Every other `CLAUDE_*` / `PRACTICE_*` variable is recorded by NAME with its
 * value withheld, which keeps the credential and transport variables the
 * harness exports (`CLAUDE_CODE_MESSAGING_TOKEN`,
 * `CLAUDE_CODE_MESSAGING_SOCKET`, `CLAUDE_CODE_SSE_PORT`) out of the log
 * permanently. An allowlist, never a denylist: a variable the harness adds
 * tomorrow is withheld by default.
 */
const ENV_VALUE_ALLOWLIST: readonly string[] = [
  'CLAUDE_PROJECT_DIR',
  'CLAUDE_CODE_SESSION_ID',
  'CLAUDE_CODE_ENTRYPOINT',
  'CLAUDE_CODE_CHILD_SESSION',
  'CLAUDE_CODE_SESSION_ATTENDED',
  'CLAUDE_EFFORT',
  'CLAUDE_PID',
  'PRACTICE_AGENT_SESSION_ID_CLAUDE',
];

const ENV_NAME_PATTERN = /^(?:CLAUDE|PRACTICE)_/;

/** The payload fields the observer uses. Every one is optional on purpose: an absent field is itself the finding. */
const knownFieldsSchema = z.object({
  session_id: z.string().optional(),
  transcript_path: z.string().optional(),
  cwd: z.string().optional(),
  hook_event_name: z.string().optional(),
  trigger: z.string().optional(),
  custom_instructions: z.string().optional(),
});

/** The validated subset of a `PreCompact` payload. */
export type KnownFields = z.infer<typeof knownFieldsSchema>;

/** How the payload read went. `schema-mismatch` means valid JSON whose known fields did not validate. */
export type PayloadStatus = 'ok' | 'empty' | 'unparseable-json' | 'schema-mismatch';

/** One file sitting beside the session's transcript, recorded by name and size only. */
export interface SiblingFile {
  readonly name: string;
  readonly bytes: number;
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
}

/** One line of the observation log. */
export interface Observation {
  readonly at: string;
  readonly marker: string;
  readonly event: 'PreCompact';
  readonly payloadStatus: PayloadStatus;
  readonly payloadKeys: readonly string[];
  readonly known: KnownFields;
  readonly rawStdinBytes: number;
  readonly rawStdin: string;
  readonly cwd: string;
  readonly argv: readonly string[];
  readonly envValues: Readonly<Record<string, string>>;
  readonly envNamesWithheld: readonly string[];
  readonly transcriptBytes: number | undefined;
  readonly projectSiblings: readonly SiblingFile[];
}

interface PayloadRead {
  readonly status: PayloadStatus;
  readonly keys: readonly string[];
  readonly known: KnownFields;
}

/**
 * Read a `PreCompact` payload without widening it.
 *
 * @param rawStdin - The exact bytes the harness wrote to the hook's stdin.
 * @returns The validated known fields, the raw top-level key names (evidence,
 *   not structure), and how the read went.
 */
export function readPayload(rawStdin: string): PayloadRead {
  const trimmed = rawStdin.trim();
  if (trimmed.length === 0) {
    return { status: 'empty', keys: [], known: {} };
  }

  const parsed: unknown = parseJson(trimmed);
  if (parsed === undefined) {
    return { status: 'unparseable-json', keys: [], known: {} };
  }

  const keys: readonly string[] =
    typeof parsed === 'object' && parsed !== null ? typeSafeKeys(parsed) : [];
  const validated = knownFieldsSchema.safeParse(parsed);
  if (!validated.success) {
    return { status: 'schema-mismatch', keys, known: {} };
  }

  return { status: 'ok', keys, known: validated.data };
}

function parseJson(text: string): unknown {
  try {
    const value: unknown = JSON.parse(text);
    return value;
  } catch {
    return undefined;
  }
}

interface EnvSnapshot {
  readonly values: Readonly<Record<string, string>>;
  readonly withheld: readonly string[];
}

/**
 * Split the hook's environment into recorded values and withheld names.
 *
 * @param env - The process environment as the hook received it.
 * @returns Allowlisted identifiers with their values, and every other matching
 *   variable by name alone.
 */
export function snapshotEnv(env: Readonly<Record<string, string | undefined>>): EnvSnapshot {
  const values: Record<string, string> = {};
  const withheld: string[] = [];

  for (const name of typeSafeKeys(env).sort((left, right) => left.localeCompare(right))) {
    if (!ENV_NAME_PATTERN.test(name)) {
      continue;
    }
    const value = env[name];
    if (value !== undefined && ENV_VALUE_ALLOWLIST.includes(name)) {
      values[name] = value;
      continue;
    }
    withheld.push(name);
  }

  return { values, withheld };
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
    rawStdinBytes: Buffer.byteLength(input.rawStdin, 'utf8'),
    rawStdin: input.rawStdin,
    cwd: input.cwd,
    argv: input.argv,
    envValues: env.values,
    envNamesWithheld: env.withheld,
    transcriptBytes: input.transcriptBytes,
    projectSiblings: input.projectSiblings ?? [],
  };
}

/**
 * Build the hook's stdout response.
 *
 * @param marker - The per-invocation marker to plant.
 * @returns A JSON line carrying the marker on BOTH response surfaces, so a
 *   later transcript read says which one the harness delivers. `continue` is
 *   true: this hook never blocks a compaction.
 */
export function buildProbeResponse(marker: string): string {
  const text = `[pre-compact-observe] ${marker}`;
  return `${JSON.stringify({
    continue: true,
    systemMessage: text,
    hookSpecificOutput: {
      hookEventName: 'PreCompact',
      additionalContext: text,
    },
  })}\n`;
}
