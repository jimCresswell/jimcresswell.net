import { chmodSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

import {
  JQ_LESS_TOOLS,
  expectBlocked,
  expectScannedVerbatim,
  expectWarned,
  runHook,
  toolDirectory,
  which,
} from './prompt-secrets-support.js';

/**
 * Smoke for `.claude/hooks/secrets/prompt-secrets.sh`, the `UserPromptSubmit`
 * guard that writes the prompt to a temporary file and asks Sonar to scan it.
 * The files it at-mentions have their own smoke, `prompt-secrets-mentions.smoke.ts`;
 * the stub and the run live in `prompt-secrets-support.ts`.
 *
 * The hook must hand Sonar the prompt verbatim, option-shaped prompts such as `-n`, `-e` and `-E`
 * and prompts ending in line breaks included, and block a prompt the stub flags. The temporary file is a copy of
 * the prompt, so it must be gone when the hook exits, including when its path
 * holds a space; a canary file named by that path's first word must survive.
 * Without `jq` the sed fallback takes a prompt whole only when it holds no JSON
 * escape, so a prompt holding one must be blocked, including when bash's echo
 * would expand escapes (`BASHOPTS=xpg_echo`). When Sonar itself errors, the
 * prompt goes through with a warning shown to the user that it was not scanned.
 */

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
  // The jq runs below must take the jq path, so jq must be installed.
  which('jq');
  const withJq = `${toolDirectory(workDir, 'bin', [])}${delimiter}${process.env.PATH ?? ''}`;
  const withoutJq = toolDirectory(workDir, 'bin-without-jq', JQ_LESS_TOOLS);

  for (const searchPath of [withJq, withoutJq]) {
    const flagged = 'deploy with SECRET token';
    const run = runHook(workDir, searchPath, flagged);
    expectScannedVerbatim(run, flagged);
    expectBlocked(run, flagged, 'Sonar detected secrets');
    for (const prompt of OPTION_SHAPED_PROMPTS) {
      expectScannedVerbatim(runHook(workDir, searchPath, prompt), prompt);
    }
    const unscanned = 'Sonar errors on this SECRET';
    expectWarned(
      runHook(workDir, searchPath, unscanned, { SMOKE_SONAR_EXIT: '2' }),
      unscanned,
      'not scanned',
    );
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
    'prompt-secrets smoke OK: prompts scanned verbatim with and without jq (option-shaped, backslashed and newline-ended included), flagged prompts blocked, a Sonar error passed with a warning, the temporary copy removed from a spaced path with the canary intact, escaped prompts blocked without jq under either echo\n',
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
