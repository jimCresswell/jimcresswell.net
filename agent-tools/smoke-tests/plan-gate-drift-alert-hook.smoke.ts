import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { z } from 'zod';

import {
  readHookCommand as readRegisteredHookCommand,
  runHookCommand,
} from './claude-hook-command-fixture';

/**
 * Production-shaped smoke for the Claude Code `SessionStart` gate-expiry drift alert.
 *
 * The hook runs the built drift checker and turns its drift report (report on stdout,
 * exit 1) into session context. This smoke reads the hook's command from
 * `.claude/settings.json`, runs it through the shared hook-command fixture (the shell,
 * from the repository root, with `CLAUDE_PROJECT_DIR` pointing at a throwaway project
 * whose checker is a stub), and asserts exit 0 and the right answer for each checker outcome. On drift the answer is a
 * harness-shaped alert carrying the stub's whole report: one stub writes its report and
 * exits 1 at once; another exits 1 first and its report reaches stdout only after the
 * stub has been reaped, so a hook that decides on the checker's `exit` instead of the
 * end of its output emits no alert. Without drift the answer is `{}`: a stub that prints
 * the real checker's no-drift line and exits 0, and one that exits 1 with nothing on
 * stdout, so neither the exit code nor non-empty output alone raises an alert.
 */

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

const NO_DRIFT_LINE =
  'check-plan-gate-drift: no expired owner gates on live plans (as of 2026-09-16; 8 plan file(s) checked).\n';
const PARSE_FAILURE_LINE = 'check-plan-gate-drift: 1 plan file(s) could not be parsed.\n';

/** A stub checker that finds no drift: the real checker's no-drift line on stdout, exit 0. */
const REPORTS_NO_DRIFT = `
process.stdout.write(${JSON.stringify(NO_DRIFT_LINE)});
process.exitCode = 0;
`;

/** A stub checker that fails with nothing on stdout: a parse failure reported on stderr, exit 1. */
const FAILS_WITHOUT_REPORT = `
process.stderr.write(${JSON.stringify(PARSE_FAILURE_LINE)});
process.exitCode = 1;
`;

interface SmokeCase {
  readonly label: string;
  readonly checker: string;
  /** Whether the hook must emit the drift alert; otherwise it must emit `{}`. */
  readonly alerts: boolean;
}

const CASES: readonly SmokeCase[] = [
  {
    label: 'a checker that writes its report and exits 1 at once',
    checker: WRITES_THEN_EXITS,
    alerts: true,
  },
  {
    label: 'a checker whose report reaches stdout after it has exited 1',
    checker: EXITS_BEFORE_REPORT,
    alerts: true,
  },
  {
    label: 'a checker that prints its no-drift line and exits 0',
    checker: REPORTS_NO_DRIFT,
    alerts: false,
  },
  {
    label: 'a checker that exits 1 with nothing on stdout',
    checker: FAILS_WITHOUT_REPORT,
    alerts: false,
  },
];

const emptyResponseSchema = z.strictObject({});

function fail(message: string): never {
  process.stderr.write(`plan-gate-drift-alert smoke: ${message}\n`);
  process.exit(1);
}

function readHookCommand(): string {
  const command = readRegisteredHookCommand('SessionStart', HOOK_NAME);
  if (command === undefined) {
    fail(`no SessionStart ${HOOK_NAME} hook command found in .claude/settings.json`);
  }
  return command;
}

/**
 * Run the hook command against a throwaway project whose built checker is the case's
 * stub: the real hook script runs from this repository, and `CLAUDE_PROJECT_DIR` points
 * it at the throwaway project's checker.
 */
function runCase(command: string, smokeCase: SmokeCase): void {
  const projectDir = mkdtempSync(join(tmpdir(), 'plan-gate-drift-alert-smoke-'));
  try {
    const checkerPath = join(projectDir, CHECKER_PATH);
    mkdirSync(dirname(checkerPath), { recursive: true });
    writeFileSync(checkerPath, smokeCase.checker, 'utf8');
    checkResponse(
      runHookCommand(command, { projectDir, timeoutMs: HOOK_TIMEOUT_MS }),
      smokeCase.alerts,
    );
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

/** The hook's stdout must be the whole-report alert when `alerts`, and `{}` otherwise. */
function checkResponse(stdout: string, alerts: boolean): void {
  const parsed: unknown = JSON.parse(stdout);
  if (!alerts) {
    if (!emptyResponseSchema.safeParse(parsed).success) {
      throw new Error(`expected {}, got: ${stdout}`);
    }
    return;
  }
  const response = responseSchema.safeParse(parsed);
  if (!response.success) {
    throw new Error(`expected a SessionStart alert, got: ${stdout}`);
  }
  const expected = `${ALERT_PREFIX}${REPORT.trim()}`;
  if (response.data.hookSpecificOutput.additionalContext !== expected) {
    throw new Error(
      `expected the alert to carry the whole report, got: ${response.data.hookSpecificOutput.additionalContext}`,
    );
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
  `plan-gate-drift-alert smoke OK: settings.json command answered ${String(CASES.length)} checker outcomes: the whole drift report as an alert on drift, {} otherwise\n`,
);
