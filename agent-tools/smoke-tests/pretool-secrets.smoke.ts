import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { requireJq, which } from './secrets-hooks-support.js';

/**
 * Smoke for `.claude/hooks/secrets/pretool-secrets.sh`, the `PreToolUse` guard
 * that asks Sonar to scan a file before Claude Code reads it.
 *
 * A stub `sonar` on PATH reports secrets in every file it is given (exit 51),
 * so the hook must deny each Read of an existing file, whatever characters its
 * path holds, with a response that is valid JSON naming the path; it must stay
 * silent for another tool on the same file and for a path that does not exist.
 * With no `jq` on PATH it must still deny: a plain path through its sed
 * fallback, and a path holding a JSON escape outright, including when bash's
 * echo would expand escapes (`BASHOPTS=xpg_echo`). Every run proves both paths,
 * so jq must be installed (`secrets-hooks-support.ts` carries why). When Sonar
 * errors (the stub exits with `SMOKE_SONAR_EXIT`), or no `sonar` is on PATH, a
 * Read goes through with a warning shown to the user that the file was not
 * scanned; with no `sonar`, another tool still passes silently.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const HOOK = join(repoRoot, '.claude', 'hooks', 'secrets', 'pretool-secrets.sh');
const TIMEOUT_MS = 10_000;
const SONAR_STUB = [
  '#!/bin/sh',
  '[ -z "$SMOKE_SONAR_EXIT" ] || exit "$SMOKE_SONAR_EXIT"',
  '[ "$1" = analyze ] && [ "$2" = secrets ] && exit 51',
  'exit 0',
  '',
].join('\n');
const JQ_LESS_TOOLS = ['bash', 'sed', 'head', 'cat'] as const;

const warningSchema = z.strictObject({ systemMessage: z.string() });
const denySchema = z.strictObject({
  hookSpecificOutput: z.strictObject({
    hookEventName: z.literal('PreToolUse'),
    permissionDecision: z.literal('deny'),
    permissionDecisionReason: z.string(),
  }),
});

function runHook(
  searchPath: string,
  payload: unknown,
  environment: NodeJS.ProcessEnv = {},
): { readonly status: number | null; readonly stdout: string } {
  const result = spawnSync(HOOK, [], {
    env: { ...process.env, PATH: searchPath, ...environment },
    input: JSON.stringify(payload),
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
  });
  return { status: result.status, stdout: result.stdout };
}

function readPayload(filePath: string, toolName = 'Read'): unknown {
  return { tool_name: toolName, tool_input: { file_path: filePath } };
}

/** Expect a deny whose reason holds `reasonText`; returns nothing, throws on anything else. */
function expectDenied(
  searchPath: string,
  filePath: string,
  reasonText: string,
  environment: NodeJS.ProcessEnv = {},
): void {
  const { status, stdout } = runHook(searchPath, readPayload(filePath), environment);
  const response = denySchema.safeParse(JSON.parse(stdout.trim() === '' ? 'null' : stdout));
  if (status !== 0 || !response.success) {
    throw new Error(
      `a Read of ${JSON.stringify(filePath)} was not denied with valid JSON (exit ${status}): ${stdout}`,
    );
  }
  if (!response.data.hookSpecificOutput.permissionDecisionReason.includes(reasonText)) {
    throw new Error(`the deny reason lacks ${JSON.stringify(reasonText)}: ${stdout}`);
  }
}

/** Expect the Read to go through with a warning holding `warningText`; throws on anything else. */
function expectWarned(
  searchPath: string,
  filePath: string,
  warningText: string,
  environment: NodeJS.ProcessEnv = {},
): void {
  const { status, stdout } = runHook(searchPath, readPayload(filePath), environment);
  const response = warningSchema.safeParse(JSON.parse(stdout.trim() === '' ? 'null' : stdout));
  if (status !== 0 || !response.success) {
    throw new Error(
      `a Read of ${JSON.stringify(filePath)} did not pass with a warning (exit ${status}): ${stdout}`,
    );
  }
  if (!response.data.systemMessage.includes(warningText)) {
    throw new Error(`the warning lacks ${JSON.stringify(warningText)}: ${stdout}`);
  }
}

function expectSilent(searchPath: string, label: string, payload: unknown): void {
  const { status, stdout } = runHook(searchPath, payload);
  if (status !== 0 || stdout.trim() !== '') {
    throw new Error(`${label} should pass silently, got exit ${status}: ${stdout}`);
  }
}

/** A directory holding links to `tools` and, unless told otherwise, the stub `sonar`. */
function toolDirectory(
  workDir: string,
  name: string,
  tools: readonly string[],
  withSonar = true,
): string {
  const directory = join(workDir, name);
  mkdirSync(directory);
  if (withSonar) {
    writeFileSync(join(directory, 'sonar'), SONAR_STUB, 'utf8');
    chmodSync(join(directory, 'sonar'), 0o755);
  }
  for (const tool of tools) {
    symlinkSync(which(tool), join(directory, tool));
  }
  return directory;
}

const workDir = mkdtempSync(join(tmpdir(), 'pretool-secrets-smoke-'));
try {
  requireJq();
  const withJq = `${toolDirectory(workDir, 'bin', [])}${delimiter}${process.env.PATH ?? ''}`;
  const withoutJq = toolDirectory(workDir, 'bin-without-jq', JQ_LESS_TOOLS);
  const withoutSonar = toolDirectory(workDir, 'bin-without-sonar', [...JQ_LESS_TOOLS, 'jq'], false);
  const files = [
    'plain.env',
    'with space.env',
    'with"quote.env',
    String.raw`with\backslash.env`,
    'ends-with-newline\n',
  ];
  for (const fileName of files) {
    const filePath = join(workDir, fileName);
    writeFileSync(filePath, 'token\n', 'utf8');
    expectDenied(withJq, filePath, filePath);
  }
  const plainPath = join(workDir, 'plain.env');
  expectSilent(withJq, 'an Edit of a file the scanner flags', readPayload(plainPath, 'Edit'));
  expectSilent(
    withJq,
    'a Read of a path that does not exist',
    readPayload(join(workDir, 'absent.env')),
  );
  expectWarned(withJq, plainPath, 'Sonar exited with status 2', { SMOKE_SONAR_EXIT: '2' });
  expectWarned(withoutSonar, plainPath, 'sonar is not on PATH');
  expectSilent(withoutSonar, 'an Edit with no scanner installed', readPayload(plainPath, 'Edit'));
  expectDenied(withoutJq, plainPath, plainPath);
  expectDenied(withoutJq, join(workDir, 'with"quote.env'), 'without jq');
  expectDenied(withoutJq, join(workDir, 'ends-with-newline\n'), 'without jq', {
    BASHOPTS: 'xpg_echo',
  });
  process.stdout.write(
    'pretool-secrets smoke OK: Reads denied with valid JSON for plain, spaced, quoted and backslashed paths, and without jq under either echo; an Edit and an absent path pass; a Sonar error and a missing Sonar warn on a Read, and an Edit with no Sonar passes silently\n',
  );
} catch (error) {
  // exitCode, so the finally block still removes the work directory.
  process.stderr.write(
    `pretool-secrets smoke: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
