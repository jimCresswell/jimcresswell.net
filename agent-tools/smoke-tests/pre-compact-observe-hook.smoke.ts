import {
  chmodSync,
  closeSync,
  fstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { z } from 'zod';

import type { PayloadStatus } from '../src/claude/pre-compact-observation.ts';
import {
  type HookStdin,
  readHookCommand as readRegisteredHookCommand,
  repoRoot,
  runHookCommand,
} from './claude-hook-command-fixture';

/**
 * Production-shaped smoke for the Claude Code `PreCompact` observer.
 *
 * The harness runs this hook as `node <source>.ts`, straight from TypeScript
 * source with no loader, and nothing else in the gates does: Vitest and tsx
 * both map a `.js` specifier onto its `.ts` file, so a relative import that
 * plain Node cannot resolve passes every other check and fails only at a real
 * compaction. This smoke reads the exact command from `.claude/settings.json`,
 * runs it through the shell, and asserts what the harness enforces — exit 0 and
 * a response carrying only top-level fields with `continue: true` — plus one
 * observation per run, readable by its owner only, whose marker matches the
 * response's.
 */

const HOOK_NAME = 'claude-pre-compact-observe-hook';
const HOOK_TIMEOUT_MS = 10_000;
const RESPONSE_PREFIX = '[pre-compact-observe] ';
const OWNER_ONLY = 0o600;
const WORLD_READABLE = 0o644;

/** Strict: any extra key — `hookSpecificOutput` above all — fails harness validation. */
const responseSchema = z.strictObject({
  continue: z.literal(true),
  systemMessage: z.string().startsWith(RESPONSE_PREFIX),
});

const observationSchema = z.object({ marker: z.string(), payloadStatus: z.string() });

/** What the hook's stdin is: text the harness wrote, or a directory, whose read fails. */
type SmokeStdin =
  | { readonly kind: 'text'; readonly text: (transcriptPath: string) => string }
  | { readonly kind: 'directory' };

interface SmokeCase {
  readonly label: string;
  readonly stdin: SmokeStdin;
  /** `world-readable`: an empty log left mode 644, as versions before the owner-only rule wrote it. */
  readonly logBefore: 'absent' | 'world-readable';
  readonly expectedStatus: PayloadStatus;
}

const CASES: readonly SmokeCase[] = [
  {
    label: 'the payload a bare /compact sends',
    stdin: {
      kind: 'text',
      text: (transcriptPath) =>
        JSON.stringify({
          session_id: 'smoke',
          transcript_path: transcriptPath,
          cwd: repoRoot,
          hook_event_name: 'PreCompact',
          trigger: 'manual',
          custom_instructions: null,
        }),
    },
    logBefore: 'world-readable',
    expectedStatus: 'ok',
  },
  {
    label: 'unparseable stdin',
    stdin: { kind: 'text', text: () => 'not json' },
    logBefore: 'absent',
    expectedStatus: 'unparseable-json',
  },
  {
    label: 'a stdin that cannot be read',
    stdin: { kind: 'directory' },
    logBefore: 'absent',
    expectedStatus: 'stdin-unreadable',
  },
];

function fail(message: string): never {
  process.stderr.write(`pre-compact-observe smoke: ${message}\n`);
  process.exit(1);
}

function readHookCommand(): string {
  const command = readRegisteredHookCommand('PreCompact', HOOK_NAME);
  if (command === undefined) {
    fail(`no PreCompact ${HOOK_NAME} hook command found in .claude/settings.json`);
  }
  return command;
}

function singleLine(text: string, what: string): string {
  const lines = text.split('\n').filter(Boolean);
  if (lines.length !== 1 || lines[0] === undefined) {
    throw new Error(`expected exactly one ${what} line, got ${lines.length}:\n${text}`);
  }
  return lines[0];
}

function observationLogPath(projectDir: string): string {
  return join(projectDir, '.claude', 'logs', 'pre-compact-observations.jsonl');
}

function prepareLog(logBefore: SmokeCase['logBefore'], projectDir: string): void {
  if (logBefore === 'absent') {
    return;
  }
  const logPath = observationLogPath(projectDir);
  mkdirSync(dirname(logPath), { recursive: true });
  writeFileSync(logPath, '', 'utf8');
  chmodSync(logPath, WORLD_READABLE);
}

/** Read the log through one descriptor, so the mode checked is the mode of the file read. */
function readOwnerOnlyLog(logPath: string): string {
  const descriptor = openSync(logPath, 'r');
  try {
    const logMode = fstatSync(descriptor).mode & 0o777;
    if (logMode !== OWNER_ONLY) {
      throw new Error(`expected the observation log to be mode 600, got ${logMode.toString(8)}`);
    }
    return readFileSync(descriptor, 'utf8');
  } finally {
    closeSync(descriptor);
  }
}

function checkRun(stdout: string, projectDir: string, expectedStatus: PayloadStatus): void {
  const response = responseSchema.safeParse(JSON.parse(singleLine(stdout, 'response')));
  if (!response.success) {
    throw new Error(`response fails the harness shape: ${stdout}`);
  }
  const observation = observationSchema.parse(
    JSON.parse(singleLine(readOwnerOnlyLog(observationLogPath(projectDir)), 'observation')),
  );
  if (observation.payloadStatus !== expectedStatus) {
    throw new Error(`expected payloadStatus ${expectedStatus}, got ${observation.payloadStatus}`);
  }
  if (`${RESPONSE_PREFIX}${observation.marker}` !== response.data.systemMessage) {
    throw new Error(`the response and the observation carry different markers: ${stdout}`);
  }
}

/** The hook's stdin, and how to release it. */
interface OpenedStdin {
  readonly options: HookStdin;
  readonly close: () => void;
}

function openStdin(stdin: SmokeStdin, projectDir: string, transcriptPath: string): OpenedStdin {
  if (stdin.kind === 'text') {
    return { options: { input: stdin.text(transcriptPath) }, close: () => undefined };
  }
  const descriptor = openSync(projectDir, 'r');
  return { options: { stdio: [descriptor, 'pipe', 'pipe'] }, close: () => closeSync(descriptor) };
}

/**
 * Run the hook command for one case against a throwaway project directory, through the
 * shared hook-command fixture: the real wrapper and source run from this repository,
 * while every log is written under the throwaway directory and not into the tree.
 */
function runCase(command: string, smokeCase: SmokeCase): void {
  const projectDir = mkdtempSync(join(tmpdir(), 'pre-compact-observe-smoke-'));
  try {
    const transcriptPath = join(projectDir, 'session.jsonl');
    writeFileSync(transcriptPath, '{}\n', 'utf8');
    prepareLog(smokeCase.logBefore, projectDir);
    const stdin = openStdin(smokeCase.stdin, projectDir, transcriptPath);
    let stdout: string;
    try {
      stdout = runHookCommand(command, {
        projectDir,
        stdin: stdin.options,
        timeoutMs: HOOK_TIMEOUT_MS,
      });
    } finally {
      stdin.close();
    }
    checkRun(stdout, projectDir, smokeCase.expectedStatus);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

const command = readHookCommand();
for (const smokeCase of CASES) {
  try {
    runCase(command, smokeCase);
  } catch (error) {
    fail(`${smokeCase.label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
process.stdout.write(
  `pre-compact-observe smoke OK: settings.json command ran from source for ${CASES.length} cases, exit 0, harness-shaped response, matching observation\n`,
);
