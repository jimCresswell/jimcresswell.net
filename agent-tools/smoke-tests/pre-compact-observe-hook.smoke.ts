import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

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
 * observation per run whose marker matches the response's.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const PROJECT_DIR_PLACEHOLDER = /\$\{CLAUDE_PROJECT_DIR\}/gu;
const HOOK_TIMEOUT_MS = 10_000;
const RESPONSE_PREFIX = '[pre-compact-observe] ';

const settingsSchema = z.object({
  hooks: z.object({
    PreCompact: z.array(z.object({ hooks: z.array(z.object({ command: z.string() })) })),
  }),
});

/** Strict: any extra key — `hookSpecificOutput` above all — fails harness validation. */
const responseSchema = z.strictObject({
  continue: z.literal(true),
  systemMessage: z.string().startsWith(RESPONSE_PREFIX),
});

const observationSchema = z.object({ marker: z.string(), payloadStatus: z.string() });

interface SmokeCase {
  readonly label: string;
  readonly stdin: (transcriptPath: string) => string;
  readonly expectedStatus: string;
}

const CASES: readonly SmokeCase[] = [
  {
    label: 'the payload a bare /compact sends',
    stdin: (transcriptPath) =>
      JSON.stringify({
        session_id: 'smoke',
        transcript_path: transcriptPath,
        cwd: repoRoot,
        hook_event_name: 'PreCompact',
        trigger: 'manual',
        custom_instructions: null,
      }),
    expectedStatus: 'ok',
  },
  {
    label: 'unparseable stdin',
    stdin: () => 'not json',
    expectedStatus: 'unparseable-json',
  },
];

function fail(message: string): never {
  process.stderr.write(`pre-compact-observe smoke: ${message}\n`);
  process.exit(1);
}

function readHookCommand(): string {
  const settings = settingsSchema.safeParse(
    JSON.parse(readFileSync(join(repoRoot, '.claude', 'settings.json'), 'utf8')),
  );
  const command = settings.success
    ? settings.data.hooks.PreCompact[0]?.hooks[0]?.command
    : undefined;
  if (command === undefined) {
    fail('no PreCompact hook command found in .claude/settings.json');
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

function checkRun(stdout: string, projectDir: string, expectedStatus: string): void {
  const response = responseSchema.safeParse(JSON.parse(singleLine(stdout, 'response')));
  if (!response.success) {
    throw new Error(`response fails the harness shape: ${stdout}`);
  }
  const logPath = join(projectDir, '.claude', 'logs', 'pre-compact-observations.jsonl');
  const observation = observationSchema.parse(
    JSON.parse(singleLine(readFileSync(logPath, 'utf8'), 'observation')),
  );
  if (observation.payloadStatus !== expectedStatus) {
    throw new Error(`expected payloadStatus ${expectedStatus}, got ${observation.payloadStatus}`);
  }
  if (`${RESPONSE_PREFIX}${observation.marker}` !== response.data.systemMessage) {
    throw new Error(`the response and the observation carry different markers: ${stdout}`);
  }
}

/**
 * Run the hook command for one case against a throwaway project directory.
 *
 * The command's `${CLAUDE_PROJECT_DIR}` is resolved to this repository so the
 * real wrapper and source run, while the environment variable points at the
 * throwaway directory so every log is written there and not into the tree.
 */
function runCase(command: string, smokeCase: SmokeCase): void {
  const projectDir = mkdtempSync(join(tmpdir(), 'pre-compact-observe-smoke-'));
  try {
    const transcriptPath = join(projectDir, 'session.jsonl');
    writeFileSync(transcriptPath, '{}\n', 'utf8');
    const result = spawnSync(
      'sh',
      ['-c', command.replaceAll(PROJECT_DIR_PLACEHOLDER, () => repoRoot)],
      {
        cwd: repoRoot,
        env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
        input: smokeCase.stdin(transcriptPath),
        encoding: 'utf8',
        timeout: HOOK_TIMEOUT_MS,
      },
    );
    if (result.status !== 0) {
      throw new Error(
        `hook exited ${result.status ?? `on ${result.signal ?? 'an error'}`}\n${result.stderr}`,
      );
    }
    checkRun(result.stdout, projectDir, smokeCase.expectedStatus);
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
