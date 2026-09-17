import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
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
 * space or an em space; after a CJK stop; with everything from its first `#`
 * dropped, as Claude Code drops it; outside the working directory; and through
 * a symlink, which the stub, like Sonar, would otherwise report clean. Two
 * spellings of one file forward one path, and a quoted mention is one mention,
 * never also an unquoted one starting with the quote. The
 * patterns are Claude Code's own, run on node, so a non-ASCII name is taken
 * whole and a CJK stop inside a token is part of it. A clean file is scanned
 * once, however often it is mentioned, and the prompt passes silently; a
 * directory, a path naming nothing and an email address whose domain names a
 * file are not handed to Sonar. Without `node` or `realpath` the mentions
 * cannot be found or resolved, so the prompt passes with a warning that they
 * were not scanned; without `jq` a `cwd` holding a JSON escape cannot be
 * decoded, so the prompt is blocked.
 */

/** Whitespace to Claude Code's mention pattern (JavaScript `\s`), but not to POSIX `[:space:]`. */
const NO_BREAK_SPACE = String.fromCodePoint(0xa0);
const EM_SPACE = String.fromCodePoint(0x2003);

/** Flagged without jq as well as with it; a quoted mention holds a JSON escape, which blocks without jq. */
const FLAGGED_MENTIONS = [
  'read @flagged.env',
  'read @flagged.env#L2-3',
  'read @flagged.env#draft',
  '\u898B\u3066\u3002@flagged.env',
  'see @flagged.env, then',
  `read @flagged.env${NO_BREAK_SPACE}now`,
  `see${EM_SPACE}@flagged.env`,
  'read @../outside.env',
  'read @~/flagged.env',
  'read @linked.env',
] as const;

/** The prompt passes silently and Sonar is handed exactly `expected` after the prompt's copy. */
function expectCleanScan(run: HookRun, prompt: string, expected: readonly string[]): void {
  const mentioned = run.scannedPaths?.slice(1) ?? [];
  if (run.status !== 0 || run.stdout.trim() !== '') {
    throw new Error(
      `${JSON.stringify(prompt)} should pass silently, got exit ${String(run.status)}: ${run.stdout}`,
    );
  }
  if (JSON.stringify(mentioned) !== JSON.stringify(expected)) {
    throw new Error(
      `for ${JSON.stringify(prompt)} Sonar was handed ${JSON.stringify(mentioned)}, not exactly ${JSON.stringify(expected)}`,
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
    join(project, 'example.com'),
    join(project, 'caf'),
    join(project, '"dir'),
  ];
  for (const flagged of flaggedFiles) {
    writeFileSync(flagged, 'SECRET\n', 'utf8');
  }
  symlinkSync(join(workDir, 'link-target.env'), join(project, 'linked.env'));
  writeFileSync(join(project, 'clean.txt'), 'nothing to find\n', 'utf8');
  writeFileSync(join(project, 'caf\u00e9.txt'), 'nothing to find\n', 'utf8');
  const withJq = `${toolDirectory(workDir, 'bin', [])}${delimiter}${process.env.PATH ?? ''}`;
  const withoutJq = toolDirectory(workDir, 'bin-without-jq', JQ_LESS_TOOLS);
  const environment = { HOME: profile };

  for (const searchPath of [withJq, withoutJq]) {
    for (const prompt of [...FLAGGED_MENTIONS, `read @${join(workDir, 'outside.env')}`]) {
      const run = runHook(workDir, searchPath, prompt, environment, project);
      expectBlocked(run, prompt, 'Sonar detected secrets');
    }
    const clean =
      'compare @clean.txt with @sub, @absent.txt, @./clean.txt again and jim@example.com';
    const cleanRun = runHook(workDir, searchPath, clean, environment, project);
    expectCleanScan(cleanRun, clean, [realpathSync(join(project, 'clean.txt'))]);
    // A non-ASCII name is taken whole, never cut to `caf`; a CJK stop inside a token is part of it.
    const unicode = 'read @caf\u00e9.txt and @flagged.env\u3002draft';
    const unicodeRun = runHook(workDir, searchPath, unicode, environment, project);
    expectCleanScan(unicodeRun, unicode, [realpathSync(join(project, 'caf\u00e9.txt'))]);
  }

  const withoutRealpath = toolDirectory(
    workDir,
    'bin-without-realpath',
    JQ_LESS_TOOLS.filter((tool) => tool !== 'realpath'),
  );
  const quoted = 'read @"dir with space/flagged.env" now';
  expectBlocked(runHook(workDir, withJq, quoted, environment, project), quoted, 'Sonar detected');
  // A quoted mention is one mention: the quote-prefixed file `"dir` is not read as a second one.
  const quotedClean = 'read @"dir with space/clean.txt" now';
  writeFileSync(join(project, 'dir with space', 'clean.txt'), 'nothing to find\n', 'utf8');
  expectCleanScan(runHook(workDir, withJq, quotedClean, environment, project), quotedClean, [
    realpathSync(join(project, 'dir with space', 'clean.txt')),
  ]);
  const unresolved = 'read @flagged.env';
  const unresolvedRun = runHook(workDir, withoutRealpath, unresolved, environment, project);
  expectWarned(unresolvedRun, unresolved, 'realpath is not on PATH');
  // A realpath that is present but fails on the file: the file is skipped with a warning.
  const failingRealpath = toolDirectory(
    workDir,
    'bin-failing-realpath',
    JQ_LESS_TOOLS.filter((tool) => tool !== 'realpath'),
  );
  writeFileSync(join(failingRealpath, 'realpath'), '#!/bin/sh\nexit 1\n', 'utf8');
  chmodSync(join(failingRealpath, 'realpath'), 0o755);
  const failedRun = runHook(workDir, failingRealpath, unresolved, environment, project);
  expectWarned(failedRun, unresolved, 'realpath could not resolve');
  const withoutNode = toolDirectory(
    workDir,
    'bin-without-node',
    JQ_LESS_TOOLS.filter((tool) => tool !== 'node'),
  );
  const unfound = runHook(workDir, withoutNode, unresolved, environment, project);
  expectWarned(unfound, unresolved, 'node');
  const escapedCwd = join(workDir, 'quo"te');
  const escapedRun = runHook(workDir, withoutJq, unresolved, environment, escapedCwd);
  expectBlocked(escapedRun, unresolved, 'jq');
  process.stdout.write(
    'prompt-secrets-mentions smoke OK: files named by @-mentions scanned with and without jq (relative to the payload cwd, quoted, ranged, hash-suffixed, punctuated, no-break-spaced, em-spaced, after a CJK stop, outside the cwd, absolute, under ~ and through a symlink); a clean file passes and is forwarded once, a non-ASCII name whole, a quoted name alone; a directory, an absent path, an email domain and a token holding a CJK stop are not scanned; no node or realpath warns, a failing realpath warns; an escaped cwd without jq blocks\n',
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
