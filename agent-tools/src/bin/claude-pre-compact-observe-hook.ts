#!/usr/bin/env node
/**
 * Claude Code `PreCompact` observation hook — the entry point.
 *
 * @remarks
 * Its only job is evidence: what the harness puts on stdin at a compaction,
 * and what it does with what the hook writes back. It never blocks a
 * compaction: once its modules have loaded, every path answers
 * `continue: true` and exits 0. A failure to record the observation is
 * reported in the response's `systemMessage`; a stdin that cannot be read is
 * recorded in the observation with its reason; a measurement that cannot be
 * taken (the transcript's size, the entries beside it) is recorded as absent.
 *
 * Invoked from `.claude/settings.json` straight from TypeScript source under
 * Node 24's type stripping, with no hand-authored JavaScript shim, through the
 * repository's `log-hook-errors.sh` wrapper:
 *
 * ```text
 * "${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh" node "${CLAUDE_PROJECT_DIR}/agent-tools/src/bin/claude-pre-compact-observe-hook.ts"
 * ```
 *
 * The source runs unbuilt, but the observation modules import
 * `@engraph/type-helpers`, which exports only its built `dist`; the root
 * `postinstall` builds that closure on every install unless
 * `PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP=1`. In a tree without it the imports
 * fail before any code here runs and Node exits 1 — a non-blocking error to
 * the harness, which blocks a compaction only on exit 2 — and the wrapper
 * records the stderr in `.claude/logs/hook-errors.log`. Answering that case
 * from inside the hook would need a dynamic import, which the estate bans
 * (`@engraph/no-dynamic-import`).
 *
 * Observations append to `.claude/logs/pre-compact-observations.jsonl`, which
 * is machine-local, git-ignored and readable by its owner only: the raw payload
 * is recorded verbatim, and it can carry what the harness keeps owner-only (the
 * text typed after `/compact`, session identifiers).
 *
 * @packageDocumentation
 */

import { randomUUID } from 'node:crypto';
import {
  appendFileSync,
  closeSync,
  type Dirent,
  fchmodSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import type { Result } from '@engraph/result';

import { buildObservation, readPayload } from '../claude/pre-compact-observation.ts';
import { buildFailOpenResponse, buildProbeResponse } from '../claude/pre-compact-response.ts';
import {
  selectSiblings,
  type SiblingFile,
  type SiblingKind,
} from '../claude/pre-compact-siblings.ts';

const LOG_RELATIVE_PATH = join('.claude', 'logs', 'pre-compact-observations.jsonl');
const SIBLING_LIMIT = 24;
const OWNER_ONLY = 0o600;

/** The entries beside the transcript that were described, and how many there were in all. */
interface SiblingMeasurement {
  readonly files: readonly SiblingFile[];
  readonly total: number | undefined;
}

function readStdin(): Result<string, string> {
  try {
    return { ok: true, value: readFileSync(0, 'utf8') };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function requireProjectDir(): string {
  const projectDir = process.env.CLAUDE_PROJECT_DIR;
  if (projectDir === undefined || projectDir.length === 0) {
    throw new Error('CLAUDE_PROJECT_DIR is not set');
  }
  return projectDir;
}

function newMarker(nowIso: string): string {
  return `${nowIso.replaceAll(/[:.]/gu, '-')}-${randomUUID().slice(0, 8)}`;
}

function sizeOf(path: string): number | undefined {
  try {
    return statSync(path).size;
  } catch {
    return undefined;
  }
}

function kindOf(entry: Dirent): SiblingKind {
  if (entry.isFile()) {
    return 'file';
  }
  return entry.isDirectory() ? 'directory' : 'other';
}

function describeSibling(directory: string, entry: Dirent): SiblingFile {
  const kind = kindOf(entry);
  const bytes = kind === 'file' ? sizeOf(join(directory, entry.name)) : undefined;
  return bytes === undefined ? { name: entry.name, kind } : { name: entry.name, kind, bytes };
}

/**
 * Describe the entries sitting beside the session's transcript.
 *
 * @param transcriptPath - The transcript the payload named, if it named one.
 * @returns Name, kind and (for files) size of each selected entry, and the full
 *   count. This settles by observation whether the harness keeps per-session
 *   state (such as a `.precompact.json`) next to the transcript.
 */
function measureSiblings(transcriptPath: string | undefined): SiblingMeasurement {
  if (transcriptPath === undefined) {
    return { files: [], total: undefined };
  }
  try {
    const directory = dirname(transcriptPath);
    const selection = selectSiblings(
      readdirSync(directory, { withFileTypes: true }),
      SIBLING_LIMIT,
    );
    return {
      files: selection.entries.map((entry) => describeSibling(directory, entry)),
      total: selection.total,
    };
  } catch {
    return { files: [], total: undefined };
  }
}

/** Append one line, first making the log owner-only, so a log created before that rule is tightened too. */
function appendObservation(logPath: string, line: string): void {
  mkdirSync(dirname(logPath), { recursive: true });
  const descriptor = openSync(logPath, 'a', OWNER_ONLY);
  try {
    fchmodSync(descriptor, OWNER_ONLY);
    appendFileSync(descriptor, line, 'utf8');
  } finally {
    closeSync(descriptor);
  }
}

function run(): void {
  const projectDir = requireProjectDir();
  const nowIso = new Date().toISOString();
  const marker = newMarker(nowIso);
  const stdin = readStdin();
  const transcriptPath = stdin.ok ? readPayload(stdin.value).known.transcript_path : undefined;
  const siblings = measureSiblings(transcriptPath);

  const record = buildObservation({
    nowIso,
    marker,
    stdin,
    env: process.env,
    cwd: process.cwd(),
    argv: process.argv,
    transcriptBytes: transcriptPath === undefined ? undefined : sizeOf(transcriptPath),
    projectSiblings: siblings.files,
    projectSiblingsTotal: siblings.total,
  });

  appendObservation(resolve(projectDir, LOG_RELATIVE_PATH), `${JSON.stringify(record)}\n`);
  process.stdout.write(buildProbeResponse(marker));
}

try {
  run();
} catch (error) {
  // Fail open, always — and say why: for an evidence instrument the failure is itself evidence.
  process.stdout.write(
    buildFailOpenResponse(error instanceof Error ? error.message : String(error)),
  );
}
