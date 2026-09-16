import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

/**
 * Production-shaped smoke for the Claude Code `SessionStart` gate-expiry drift alert.
 *
 * The hook runs the built drift checker and turns its drift report (report on stdout,
 * exit 1) into session context. This smoke reads the hook's command from
 * `.claude/settings.json`, runs it through the shell from the repository root with
 * `CLAUDE_PROJECT_DIR` pointing at a throwaway project whose checker is a stub, and
 * asserts exit 0 and a harness-shaped alert carrying the stub's whole report. One stub
 * writes its report and exits 1 at once; the other exits 1 first and its report
 * reaches stdout only after the stub has been reaped, so a hook that decides on the
 * checker's `exit` instead of the end of its output emits no alert.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const HOOK_NAME = 'plan-gate-drift-alert';
const CHECKER_PATH = join(
  'agent-tools',
  'dist',
  'src',
  'validators',
  'plan-schema',
  'check-plan-gate-drift.js',
);
const HOOK_TIMEOUT_MS = 15_000;
const REPORT =
  'Plan gate-expiry drift: 1 expired owner gate\n' +
  '  plan-a — gate expired 2026-09-01 → extend or resolve it\n';
const ALERT_PREFIX = '[Plan gate-expiry drift alert]\n';

const settingsSchema = z.object({
  hooks: z.object({
    SessionStart: z.array(z.object({ hooks: z.array(z.object({ command: z.string() })) })),
  }),
});

const responseSchema = z.strictObject({
  hookSpecificOutput: z.strictObject({
    hookEventName: z.literal('SessionStart'),
    additionalContext: z.string(),
  }),
});

/** A stub checker that writes the report and exits 1 at once. */
const WRITES_THEN_EXITS = `
process.stdout.write(${JSON.stringify(REPORT)});
process.exitCode = 1;
`;

/**
 * Writes the report once the process named by its argument has been reaped:
 * `process.kill(pid, 0)` succeeds on an exited process its parent has not yet reaped and
 * fails once it has, so the report cannot be written before the hook has reaped the stub.
 * Bounded: it gives up without writing after 2000 polls.
 */
const WRITE_AFTER_REAP = `
const target = Number(process.argv[1]);
const poll = (remaining) => {
  try {
    process.kill(target, 0);
  } catch {
    process.stdout.write(${JSON.stringify(REPORT)});
    return;
  }
  if (remaining > 0) setTimeout(poll, 5, remaining - 1);
};
poll(2000);
`;

/** A stub checker that exits 1 at once, leaving its stdout to a grandchild running WRITE_AFTER_REAP. */
const EXITS_BEFORE_REPORT = `
const { spawn } = require('node:child_process');
spawn(process.execPath, ['-e', ${JSON.stringify(WRITE_AFTER_REAP)}, String(process.pid)], {
  stdio: ['ignore', 'inherit', 'ignore'],
}).unref();
process.exitCode = 1;
`;

const CASES: readonly { readonly label: string; readonly checker: string }[] = [
  { label: 'a checker that writes its report and exits 1 at once', checker: WRITES_THEN_EXITS },
  {
    label: 'a checker whose report reaches stdout after it has exited 1',
    checker: EXITS_BEFORE_REPORT,
  },
];

function fail(message: string): never {
  process.stderr.write(`plan-gate-drift-alert smoke: ${message}\n`);
  process.exit(1);
}

function readHookCommand(): string {
  const settings = settingsSchema.safeParse(
    JSON.parse(readFileSync(join(repoRoot, '.claude', 'settings.json'), 'utf8')),
  );
  const command = settings.success
    ? settings.data.hooks.SessionStart.flatMap((entry) => entry.hooks)
        .map((hook) => hook.command)
        .find((candidate) => candidate.includes(HOOK_NAME))
    : undefined;
  if (command === undefined) {
    fail(`no SessionStart ${HOOK_NAME} hook command found in .claude/settings.json`);
  }
  return command;
}

/**
 * Run the hook command against a throwaway project whose built checker is `checker`.
 * The command runs from this repository's root, so the real hook script runs, while
 * `CLAUDE_PROJECT_DIR` points the hook at the throwaway project's checker.
 */
function runCase(command: string, checker: string): void {
  const projectDir = mkdtempSync(join(tmpdir(), 'plan-gate-drift-alert-smoke-'));
  try {
    const checkerPath = join(projectDir, CHECKER_PATH);
    mkdirSync(dirname(checkerPath), { recursive: true });
    writeFileSync(checkerPath, checker, 'utf8');
    const result = spawnSync('sh', ['-c', command], {
      cwd: repoRoot,
      env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
      encoding: 'utf8',
      timeout: HOOK_TIMEOUT_MS,
    });
    if (result.status !== 0) {
      throw new Error(
        `hook exited ${result.status ?? `on ${result.signal ?? 'an error'}`}\n${result.stderr}`,
      );
    }
    const response = responseSchema.safeParse(JSON.parse(result.stdout));
    if (!response.success) {
      throw new Error(`expected a SessionStart alert, got: ${result.stdout}`);
    }
    const expected = `${ALERT_PREFIX}${REPORT.trim()}`;
    if (response.data.hookSpecificOutput.additionalContext !== expected) {
      throw new Error(
        `expected the alert to carry the whole report, got: ${response.data.hookSpecificOutput.additionalContext}`,
      );
    }
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

const command = readHookCommand();
for (const smokeCase of CASES) {
  try {
    runCase(command, smokeCase.checker);
  } catch (error) {
    fail(`${smokeCase.label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
process.stdout.write(
  `plan-gate-drift-alert smoke OK: settings.json command emitted the whole drift report as a SessionStart alert for ${String(CASES.length)} cases\n`,
);
