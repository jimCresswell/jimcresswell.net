#!/usr/bin/env node
/**
 * Claude Code `PreCompact` observation hook — the entry point.
 *
 * @remarks
 * Its only job is evidence: what the harness puts on stdin at a compaction,
 * and what it does with what the hook writes back. It NEVER blocks — every
 * path, including every error path, ends at exit 0, and the response always
 * carries `continue: true`.
 *
 * Invoked directly from `.claude/settings.json` as a built artefact, with no
 * hand-authored JavaScript shim:
 *
 * ```text
 * node "${CLAUDE_PROJECT_DIR}/agent-tools/dist/src/bin/claude-pre-compact-observe-hook.js"
 * ```
 *
 * Observations append to `.claude/logs/pre-compact-observations.jsonl`, which
 * is machine-local and git-ignored; the raw payload is recorded verbatim, so
 * this file stays out of the tracked tree.
 *
 * @packageDocumentation
 */

import { appendFileSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import {
  buildObservation,
  buildProbeResponse,
  readPayload,
  type SiblingFile,
} from '../claude/pre-compact-observation.ts';

const LOG_RELATIVE_PATH = join('.claude', 'logs', 'pre-compact-observations.jsonl');
const SIBLING_LIMIT = 24;

function readStdin(): string {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function newMarker(nowIso: string): string {
  return `${nowIso.replaceAll(/[:.]/gu, '-')}-${Math.random().toString(36).slice(2, 8)}`;
}

function sizeOf(path: string): number | undefined {
  try {
    return statSync(path).size;
  } catch {
    return undefined;
  }
}

/**
 * List the files sitting beside the session's transcript.
 *
 * @param transcriptPath - The transcript the payload named, if it named one.
 * @returns Name and size of each sibling, capped. This settles by observation
 *   whether the harness keeps per-session state (such as a `.precompact.json`)
 *   next to the transcript — a question the binary's strings could not answer.
 */
function siblingsOf(transcriptPath: string | undefined): readonly SiblingFile[] {
  if (transcriptPath === undefined) {
    return [];
  }
  try {
    const directory = dirname(transcriptPath);
    return readdirSync(directory)
      .slice(0, SIBLING_LIMIT)
      .map((name) => ({ name, bytes: sizeOf(join(directory, name)) ?? -1 }));
  } catch {
    return [];
  }
}

function appendObservation(logPath: string, line: string): void {
  mkdirSync(dirname(logPath), { recursive: true });
  appendFileSync(logPath, line, 'utf8');
}

function run(): void {
  const nowIso = new Date().toISOString();
  const marker = newMarker(nowIso);
  const rawStdin = readStdin();
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const transcriptPath = readPayload(rawStdin).known.transcript_path;

  const observation = buildObservation({
    nowIso,
    marker,
    rawStdin,
    env: process.env,
    cwd: process.cwd(),
    argv: process.argv,
    transcriptBytes: transcriptPath === undefined ? undefined : sizeOf(transcriptPath),
    projectSiblings: siblingsOf(transcriptPath),
  });

  appendObservation(resolve(projectDir, LOG_RELATIVE_PATH), `${JSON.stringify(observation)}\n`);
  process.stdout.write(buildProbeResponse(marker));
}

try {
  run();
} catch {
  // Fail open, always: an observation instrument must never cost a compaction.
  process.stdout.write('{"continue":true}\n');
}

process.exit(0);
