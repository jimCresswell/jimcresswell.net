import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

import {
  JQ_LESS_TOOLS,
  type HookRun,
  expectBlocked,
  expectWarned,
  runHook,
  toolDirectory,
} from './prompt-secrets-support.js';
import { requireJq } from './secrets-hooks-support.js';

/**
 * Smoke for the at-mention scan of `.claude/hooks/secrets/prompt-secrets.sh`.
 *
 * Claude Code puts the content of a file a prompt at-mentions (`@path`) into the
 * conversation as an attachment, with no tool call, so the `PreToolUse` Read
 * hook never sees it, and the `UserPromptSubmit` payload carries only the
 * prompt's text (Claude Code 2.1.274, observed 2026-09-17). The prompt hook
 * must therefore hand Sonar every regular file a mention can name, resolved as
 * Claude Code resolves it: relative to the payload's `cwd` (not the hook's own
 * working directory), absolute, or under `~`; quoted when it holds a space;
 * with a `#L` line range or trailing punctuation dropped; ended by a no-break
 * space; outside the working directory; and through a symlink, which the stub,
 * like Sonar, would otherwise report clean. A clean file is scanned and the
 * prompt passes silently; a directory and a path naming nothing are not handed
 * to Sonar. Without `realpath` a mentioned file cannot be resolved, so the
 * prompt passes with a warning that it was not scanned; without `jq` a `cwd`
 * holding a JSON escape cannot be decoded, so the prompt is blocked.
 */

/** Whitespace to Claude Code's mention pattern (JavaScript `\s`), but not to grep's `[:space:]`. */
const NO_BREAK_SPACE = String.fromCodePoint(0xa0);

/** Flagged without jq as well as with it; a quoted mention holds a JSON escape, which blocks without jq. */
const FLAGGED_MENTIONS = [
  'read @flagged.env',
  'read @flagged.env#L2-3',
  'see @flagged.env, then',
  `read @flagged.env${NO_BREAK_SPACE}now`,
  'read @../outside.env',
  'read @~/flagged.env',
  'read @linked.env',
] as const;

function expectCleanScan(run: HookRun, prompt: string, expected: string): void {
  const mentioned = new Set(run.scannedPaths?.slice(1));
  if (run.status !== 0 || run.stdout.trim() !== '') {
    throw new Error(
      `${JSON.stringify(prompt)} should pass silently, got exit ${String(run.status)}: ${run.stdout}`,
    );
  }
  if (mentioned.size !== 1 || !mentioned.has(expected)) {
    throw new Error(
      `for ${JSON.stringify(prompt)} Sonar was handed ${JSON.stringify([...mentioned])}, not only ${expected}`,
    );
  }
}

const workDir = mkdtempSync(join(tmpdir(), 'prompt-secrets-mentions-smoke-'));
try {
  requireJq();
  const project = join(workDir, 'project');
  const profile = join(workDir, 'profile');
  mkdirSync(join(project, 'dir with space'), { recursive: true });
  mkdirSync(join(project, 'sub'));
  mkdirSync(profile);
  const flaggedFiles = [
    join(project, 'flagged.env'),
    join(project, 'dir with space', 'flagged.env'),
    join(workDir, 'outside.env'),
    join(workDir, 'link-target.env'),
    join(profile, 'flagged.env'),
  ];
  for (const flagged of flaggedFiles) {
    writeFileSync(flagged, 'SECRET\n', 'utf8');
  }
  symlinkSync(join(workDir, 'link-target.env'), join(project, 'linked.env'));
  writeFileSync(join(project, 'clean.txt'), 'nothing to find\n', 'utf8');
  const withJq = `${toolDirectory(workDir, 'bin', [])}${delimiter}${process.env.PATH ?? ''}`;
  const withoutJq = toolDirectory(workDir, 'bin-without-jq', JQ_LESS_TOOLS);
  const environment = { HOME: profile };

  for (const searchPath of [withJq, withoutJq]) {
    for (const prompt of [...FLAGGED_MENTIONS, `read @${join(workDir, 'outside.env')}`]) {
      const run = runHook(workDir, searchPath, prompt, environment, project);
      expectBlocked(run, prompt, 'Sonar detected secrets');
    }
    const clean = 'compare @clean.txt with @sub, @absent.txt and jim@example.com';
    const cleanRun = runHook(workDir, searchPath, clean, environment, project);
    expectCleanScan(cleanRun, clean, realpathSync(join(project, 'clean.txt')));
  }

  const withoutRealpath = toolDirectory(
    workDir,
    'bin-without-realpath',
    JQ_LESS_TOOLS.filter((tool) => tool !== 'realpath'),
  );
  const quoted = 'read @"dir with space/flagged.env" now';
  expectBlocked(runHook(workDir, withJq, quoted, environment, project), quoted, 'Sonar detected');
  const unresolved = 'read @flagged.env';
  const unresolvedRun = runHook(workDir, withoutRealpath, unresolved, environment, project);
  expectWarned(unresolvedRun, unresolved, 'realpath');
  const escapedCwd = join(workDir, 'quo"te');
  const escapedRun = runHook(workDir, withoutJq, unresolved, environment, escapedCwd);
  expectBlocked(escapedRun, unresolved, 'jq');
  process.stdout.write(
    'prompt-secrets-mentions smoke OK: files named by @-mentions scanned with and without jq (relative to the payload cwd, quoted, ranged, punctuated, no-break-spaced, outside the cwd, absolute, under ~ and through a symlink); a clean file passes, a directory and an absent path are not scanned; no realpath warns; an escaped cwd without jq blocks\n',
  );
} catch (error) {
  // exitCode, so the finally block still removes the work directory.
  process.stderr.write(
    `prompt-secrets-mentions smoke: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
