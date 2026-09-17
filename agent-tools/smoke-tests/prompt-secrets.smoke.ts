import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { requireJq, which } from './secrets-hooks-support.js';

/**
 * Smoke for `.claude/hooks/secrets/prompt-secrets.sh`, the `UserPromptSubmit`
 * guard that writes the prompt to a temporary file and asks Sonar to scan it.
 *
 * A stub `sonar` on PATH records the path and the text it was given and
 * reports secrets (exit 51) when the text holds `SECRET`. The hook must hand
 * Sonar the prompt verbatim, option-shaped prompts such as `-n`, `-e` and `-E`
 * and prompts ending in line breaks included, and block a prompt the stub flags. The temporary file is a copy of
 * the prompt, so it must be gone when the hook exits, including when its path
 * holds a space; a canary file named by that path's first word must survive.
 * Without `jq` the sed fallback takes a prompt whole only when it holds no JSON
 * escape, so a prompt holding one must be blocked, including when bash's echo
 * would expand escapes (`BASHOPTS=xpg_echo`). Every run proves both paths, so
 * jq must be installed (`secrets-hooks-support.ts` carries why).
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const HOOK = join(repoRoot, '.claude', 'hooks', 'secrets', 'prompt-secrets.sh');
const TIMEOUT_MS = 10_000;
const SONAR_STUB = [
  '#!/bin/sh',
  '[ "$1" = analyze ] && [ "$2" = secrets ] || exit 0',
  'printf "%s" "$3" > "$SMOKE_SCANNED_PATH"',
  'cat "$3" > "$SMOKE_SCANNED_TEXT"',
  'case "$(cat "$3")" in *SECRET*) exit 51 ;; esac',
  'exit 0',
  '',
].join('\n');
const JQ_LESS_TOOLS = ['bash', 'sed', 'head', 'cat', 'mktemp', 'rm'] as const;

const blockSchema = z.strictObject({ decision: z.literal('block'), reason: z.string() });

interface HookRun {
  readonly status: number | null;
  readonly stdout: string;
  /** The path the stub was asked to scan, or undefined when Sonar was never called. */
  readonly scannedPath: string | undefined;
  /** The text the stub scanned, or undefined when Sonar was never called. */
  readonly scannedText: string | undefined;
}

function readIfPresent(filePath: string): string | undefined {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : undefined;
}

/** Run the hook on one prompt, then prove the temporary copy Sonar scanned is gone. */
function runHook(
  workDir: string,
  searchPath: string,
  prompt: string,
  environment: NodeJS.ProcessEnv = {},
): HookRun {
  const scannedPathFile = join(workDir, 'scanned-path');
  const scannedTextFile = join(workDir, 'scanned-text');
  rmSync(scannedPathFile, { force: true });
  rmSync(scannedTextFile, { force: true });
  const result = spawnSync(HOOK, [], {
    cwd: workDir,
    env: {
      ...process.env,
      PATH: searchPath,
      SMOKE_SCANNED_PATH: scannedPathFile,
      SMOKE_SCANNED_TEXT: scannedTextFile,
      ...environment,
    },
    input: JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt }),
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
  });
  const scannedPath = readIfPresent(scannedPathFile);
  if (scannedPath !== undefined && existsSync(scannedPath)) {
    throw new Error(
      `the prompt's temporary copy outlived the hook: ${JSON.stringify(scannedPath)}`,
    );
  }
  return {
    status: result.status,
    stdout: result.stdout,
    scannedPath,
    scannedText: readIfPresent(scannedTextFile),
  };
}

function expectScannedVerbatim(run: HookRun, prompt: string): void {
  if (run.scannedText !== prompt) {
    throw new Error(
      `Sonar scanned ${JSON.stringify(run.scannedText)}, not the prompt ${JSON.stringify(prompt)}`,
    );
  }
}

function expectBlocked(run: HookRun, prompt: string, reasonText: string): void {
  const response = blockSchema.safeParse(
    JSON.parse(run.stdout.trim() === '' ? 'null' : run.stdout),
  );
  if (run.status !== 0 || !response.success) {
    throw new Error(
      `the prompt ${JSON.stringify(prompt)} was not blocked with valid JSON (exit ${String(run.status)}): ${run.stdout}`,
    );
  }
  if (!response.data.reason.includes(reasonText)) {
    throw new Error(`the block reason lacks ${JSON.stringify(reasonText)}: ${run.stdout}`);
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
      symlinkSync(which(tool), join(directory, tool));
    }
  }
  return directory;
}

/**
 * A directory holding a `mktemp` that creates the hook's file inside
 * `spacedDir`. GNU `mktemp -t` honours a TMPDIR holding a space; macOS
 * `mktemp -t` prefers the per-user temporary directory over TMPDIR, so the
 * stub hands the hook a spaced path on every platform.
 */
function spacedMktempDirectory(workDir: string, spacedDir: string): string {
  const directory = join(workDir, 'bin-spaced-mktemp');
  mkdirSync(directory);
  const stub = `#!/bin/sh\nexec '${which('mktemp')}' '${spacedDir}/sonarqube-cli-hook.XXXXXX'\n`;
  writeFileSync(join(directory, 'mktemp'), stub, 'utf8');
  chmodSync(join(directory, 'mktemp'), 0o755);
  return directory;
}

const OPTION_SHAPED_PROMPTS = ['-n', '-e', '-E', '-neE'] as const;

const workDir = mkdtempSync(join(tmpdir(), 'prompt-secrets-smoke-'));
try {
  requireJq();
  const withJq = `${toolDirectory(workDir, 'bin', false)}${delimiter}${process.env.PATH ?? ''}`;
  const withoutJq = toolDirectory(workDir, 'bin-without-jq', true);

  for (const searchPath of [withJq, withoutJq]) {
    const flagged = 'deploy with SECRET token';
    const run = runHook(workDir, searchPath, flagged);
    expectScannedVerbatim(run, flagged);
    expectBlocked(run, flagged, 'Sonar detected secrets');
    for (const prompt of OPTION_SHAPED_PROMPTS) {
      expectScannedVerbatim(runHook(workDir, searchPath, prompt), prompt);
    }
  }
  const backslashed = String.raw`keep \c and \n literal`;
  expectScannedVerbatim(runHook(workDir, withJq, backslashed), backslashed);
  const trailingNewlines = 'ends with two line breaks\n\n';
  expectScannedVerbatim(runHook(workDir, withJq, trailingNewlines), trailingNewlines);

  // The copy lives at a path holding a space whose first word names the
  // canary: the trap removes the copy, as one word, and nothing else.
  const canary = join(workDir, 'canary');
  writeFileSync(canary, 'canary\n', 'utf8');
  const spacedDir = join(workDir, 'canary dir');
  mkdirSync(spacedDir);
  const spacedPath = `${spacedMktempDirectory(workDir, spacedDir)}${delimiter}${withJq}`;
  const spacedRun = runHook(workDir, spacedPath, 'spaced SECRET');
  if (spacedRun.scannedPath?.startsWith(`${spacedDir}/`) !== true) {
    throw new Error(
      `the hook did not scan a file in the spaced directory: ${String(spacedRun.scannedPath)}`,
    );
  }
  if (!existsSync(canary)) {
    throw new Error('the exit trap deleted a file named by the first word of a spaced path');
  }

  const escaped = 'say "hi" then SECRET';
  expectBlocked(runHook(workDir, withoutJq, escaped), escaped, 'jq');
  const multiLine = 'line one\nSECRET two';
  const expandingEcho = { BASHOPTS: 'xpg_echo' };
  expectBlocked(runHook(workDir, withoutJq, multiLine, expandingEcho), multiLine, 'jq');
  process.stdout.write(
    'prompt-secrets smoke OK: prompts scanned verbatim with and without jq (option-shaped, backslashed and newline-ended included), flagged prompts blocked, the temporary copy removed from a spaced path with the canary intact, escaped prompts blocked without jq under either echo\n',
  );
} catch (error) {
  // exitCode, so the finally block still removes the work directory.
  process.stderr.write(
    `prompt-secrets smoke: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
