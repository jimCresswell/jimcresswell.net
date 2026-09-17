import { execFileSync, spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

/**
 * Support for the smokes of `.claude/hooks/secrets/prompt-secrets.sh`:
 * `prompt-secrets.smoke.ts` for the prompt itself and
 * `prompt-secrets-mentions.smoke.ts` for the files it at-mentions. It holds a
 * stub `sonar`, a directory of the tools a run may use, one hook run, and the
 * outcomes a run is held to.
 *
 * The stub records every path it is asked to scan and the text of the first,
 * which the hook makes its copy of the prompt. With `SMOKE_SONAR_EXIT` set it
 * exits with that status before scanning, standing in for a Sonar that errors;
 * otherwise it reports secrets (exit 51) when a path it is given holds
 * `SECRET`. Like the Sonar CLI (1.7.0, observed 2026-09-17), it reports a
 * symlink clean without reading the link's target.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const HOOK = join(
  resolve(smokeDir, '..', '..'),
  '.claude',
  'hooks',
  'secrets',
  'prompt-secrets.sh',
);
const TIMEOUT_MS = 10_000;
const SONAR_STUB = [
  '#!/bin/sh',
  '[ "$1" = analyze ] && [ "$2" = secrets ] || exit 0',
  'shift 2',
  'printf "%s" "$1" > "$SMOKE_SCANNED_PATH"',
  'cat "$1" > "$SMOKE_SCANNED_TEXT"',
  String.raw`printf "%s\n" "$@" > "$SMOKE_SCANNED_PATHS"`,
  '[ -z "$SMOKE_SONAR_EXIT" ] || exit "$SMOKE_SONAR_EXIT"',
  'for f in "$@"; do',
  '  [ -L "$f" ] && continue',
  '  case "$(cat "$f")" in *SECRET*) exit 51 ;; esac',
  'done',
  'exit 0',
  '',
].join('\n');

/** The tools the hook and the stub use other than jq, linked into a jq-less directory. */
export const JQ_LESS_TOOLS = ['bash', 'sed', 'head', 'cat', 'mktemp', 'rm', 'grep', 'realpath'];

const blockSchema = z.strictObject({ decision: z.literal('block'), reason: z.string() });
const warningSchema = z.strictObject({ systemMessage: z.string() });

/** What one hook run did. */
export interface HookRun {
  readonly status: number | null;
  readonly stdout: string;
  /** The first path the stub was asked to scan, or undefined when Sonar was never called. */
  readonly scannedPath: string | undefined;
  /** The text of that first path, or undefined when Sonar was never called. */
  readonly scannedText: string | undefined;
  /** Every path the stub was asked to scan, in order, or undefined when Sonar was never called. */
  readonly scannedPaths: readonly string[] | undefined;
}

function readIfPresent(filePath: string): string | undefined {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : undefined;
}

/**
 * The absolute path of a tool on PATH.
 *
 * @param tool - The command name.
 * @returns Its path, as `/usr/bin/which` prints it.
 * @throws When the tool is not on PATH.
 */
export function which(tool: string): string {
  try {
    return execFileSync('/usr/bin/which', [tool], { encoding: 'utf8' }).trim();
  } catch (error) {
    throw new Error(`${tool} is not on PATH, and the smoke needs it`, { cause: error });
  }
}

/**
 * Run the hook on one prompt, then prove the temporary copy Sonar scanned is gone.
 *
 * @param workDir - The hook process's working directory, where the stub's records are kept.
 * @param searchPath - The PATH the hook runs with.
 * @param prompt - The prompt the payload carries.
 * @param environment - Variables added to the hook's environment.
 * @param cwd - The session working directory the payload names; `workDir` when absent.
 * @returns What the run did.
 * @throws When the prompt's temporary copy outlived the hook.
 */
export function runHook(
  workDir: string,
  searchPath: string,
  prompt: string,
  environment: NodeJS.ProcessEnv = {},
  cwd: string = workDir,
): HookRun {
  const records = { path: 'scanned-path', text: 'scanned-text', paths: 'scanned-paths' };
  for (const name of [records.path, records.text, records.paths]) {
    rmSync(join(workDir, name), { force: true });
  }
  const result = spawnSync(HOOK, [], {
    cwd: workDir,
    env: {
      ...process.env,
      PATH: searchPath,
      SMOKE_SCANNED_PATH: join(workDir, records.path),
      SMOKE_SCANNED_TEXT: join(workDir, records.text),
      SMOKE_SCANNED_PATHS: join(workDir, records.paths),
      ...environment,
    },
    input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', cwd, prompt }),
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
  });
  const scannedPath = readIfPresent(join(workDir, records.path));
  if (scannedPath !== undefined && existsSync(scannedPath)) {
    throw new Error(
      `the prompt's temporary copy outlived the hook: ${JSON.stringify(scannedPath)}`,
    );
  }
  return {
    status: result.status,
    stdout: result.stdout,
    scannedPath,
    scannedText: readIfPresent(join(workDir, records.text)),
    scannedPaths: readIfPresent(join(workDir, records.paths))?.split('\n').slice(0, -1),
  };
}

/**
 * Expect Sonar to have scanned the prompt byte for byte.
 *
 * @param run - The hook run.
 * @param prompt - The prompt the payload carried.
 * @throws When the text scanned is not the prompt.
 */
export function expectScannedVerbatim(run: HookRun, prompt: string): void {
  if (run.scannedText !== prompt) {
    throw new Error(
      `Sonar scanned ${JSON.stringify(run.scannedText)}, not the prompt ${JSON.stringify(prompt)}`,
    );
  }
}

function parsedStdout(run: HookRun): unknown {
  return JSON.parse(run.stdout.trim() === '' ? 'null' : run.stdout);
}

/**
 * Expect the prompt to be blocked with valid JSON whose reason holds `reasonText`.
 *
 * @param run - The hook run.
 * @param prompt - The prompt the payload carried, for the failure message.
 * @param reasonText - Text the block reason must hold.
 * @throws When the run did not block so.
 */
export function expectBlocked(run: HookRun, prompt: string, reasonText: string): void {
  const response = blockSchema.safeParse(parsedStdout(run));
  if (run.status !== 0 || !response.success) {
    throw new Error(
      `the prompt ${JSON.stringify(prompt)} was not blocked with valid JSON (exit ${String(run.status)}): ${run.stdout}`,
    );
  }
  if (!response.data.reason.includes(reasonText)) {
    throw new Error(`the block reason lacks ${JSON.stringify(reasonText)}: ${run.stdout}`);
  }
}

/**
 * Expect the prompt to go through with a warning, shown to the user, that holds `warningText`.
 *
 * @param run - The hook run.
 * @param prompt - The prompt the payload carried, for the failure message.
 * @param warningText - Text the warning must hold.
 * @throws When the run did not warn so, or blocked.
 */
export function expectWarned(run: HookRun, prompt: string, warningText: string): void {
  const response = warningSchema.safeParse(parsedStdout(run));
  if (run.status !== 0 || !response.success) {
    throw new Error(
      `the prompt ${JSON.stringify(prompt)} did not pass with a warning (exit ${String(run.status)}): ${run.stdout}`,
    );
  }
  if (!response.data.systemMessage.includes(warningText)) {
    throw new Error(`the warning lacks ${JSON.stringify(warningText)}: ${run.stdout}`);
  }
}

/**
 * A directory holding the stub `sonar` and links to `tools`.
 *
 * @param workDir - Where the directory is made.
 * @param name - The directory's name.
 * @param tools - The tools on PATH to link into it.
 * @returns The directory's path.
 */
export function toolDirectory(workDir: string, name: string, tools: readonly string[]): string {
  const directory = join(workDir, name);
  mkdirSync(directory);
  writeFileSync(join(directory, 'sonar'), SONAR_STUB, 'utf8');
  chmodSync(join(directory, 'sonar'), 0o755);
  for (const tool of tools) {
    symlinkSync(which(tool), join(directory, tool));
  }
  return directory;
}
