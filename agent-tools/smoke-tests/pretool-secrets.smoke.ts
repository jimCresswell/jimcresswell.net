import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

/**
 * Smoke for `.claude/hooks/secrets/pretool-secrets.sh`, the `PreToolUse` guard
 * that asks Sonar to scan a file before Claude Code reads it.
 *
 * A stub `sonar` on PATH reports secrets in every file it is given (exit 51),
 * so the hook must deny each Read of an existing file, whatever characters its
 * path holds, with a response that is valid JSON naming the path; it must stay
 * silent for another tool on the same file and for a path that does not exist.
 * With no `jq` on PATH it must still deny: a plain path through its sed
 * fallback, and a path holding a JSON escape outright.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const HOOK = join(repoRoot, '.claude', 'hooks', 'secrets', 'pretool-secrets.sh');
const TIMEOUT_MS = 10_000;
const SONAR_STUB = '#!/bin/sh\n[ "$1" = analyze ] && [ "$2" = secrets ] && exit 51\nexit 0\n';
const JQ_LESS_TOOLS = ['bash', 'sed', 'head', 'cat'] as const;

const denySchema = z.strictObject({
  hookSpecificOutput: z.strictObject({
    hookEventName: z.literal('PreToolUse'),
    permissionDecision: z.literal('deny'),
    permissionDecisionReason: z.string(),
  }),
});

function fail(message: string): never {
  process.stderr.write(`pretool-secrets smoke: ${message}\n`);
  process.exit(1);
}

function runHook(
  searchPath: string,
  payload: unknown,
): { readonly status: number | null; readonly stdout: string } {
  const result = spawnSync(HOOK, [], {
    env: { ...process.env, PATH: searchPath },
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
function expectDenied(searchPath: string, filePath: string, reasonText: string): void {
  const { status, stdout } = runHook(searchPath, readPayload(filePath));
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

function expectSilent(searchPath: string, label: string, payload: unknown): void {
  const { status, stdout } = runHook(searchPath, payload);
  if (status !== 0 || stdout.trim() !== '') {
    throw new Error(`${label} should pass silently, got exit ${status}: ${stdout}`);
  }
}

/** A directory holding the stub `sonar`, and, when asked, links to the tools the hook needs other than jq. */
function toolDirectory(workDir: string, name: string, withJqLessTools: boolean): string {
  const directory = join(workDir, name);
  mkdirSync(directory);
  writeFileSync(join(directory, 'sonar'), SONAR_STUB, 'utf8');
  chmodSync(join(directory, 'sonar'), 0o755);
  if (withJqLessTools) {
    for (const tool of JQ_LESS_TOOLS) {
      const found = execFileSync('/usr/bin/which', [tool], { encoding: 'utf8' }).trim();
      symlinkSync(found, join(directory, tool));
    }
  }
  return directory;
}

const workDir = mkdtempSync(join(tmpdir(), 'pretool-secrets-smoke-'));
try {
  const withJq = `${toolDirectory(workDir, 'bin', false)}${delimiter}${process.env.PATH ?? ''}`;
  const withoutJq = toolDirectory(workDir, 'bin-without-jq', true);
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
  expectDenied(withoutJq, plainPath, plainPath);
  expectDenied(withoutJq, join(workDir, 'with"quote.env'), 'without jq');
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
process.stdout.write(
  'pretool-secrets smoke OK: Reads denied with valid JSON for plain, spaced, quoted and backslashed paths, and without jq; an Edit and an absent path pass\n',
);
