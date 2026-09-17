import { describe, expect, it } from 'vitest';

import { runLintChanged } from '../src/repo-check/repo-check-lint-changed';
import type { RepoCheckCommandResult, RepoCheckRuntime } from '../src/repo-check/repo-check';

interface CommandCall {
  readonly command: string;
  readonly args: readonly string[];
}

const DRY_RUN_ARGS = ['exec', 'turbo', 'run', 'lint', '--filter=...[HEAD]', '--dry-run=json'];
const LINT_ARGS = [
  'exec',
  'turbo',
  'run',
  'lint',
  '--filter=...[HEAD]',
  '--output-logs=errors-only',
];
const DEPRECATION_WARNING =
  ' WARNING  TURBO_REMOTE_CACHE_READ_ONLY is deprecated and will be removed in a future major version. Use TURBO_CACHE=remote:r';

/**
 * A fake runtime that answers the one captured call the step issues (turbo's
 * dry run) with a literal result, and records every call. The terminal
 * collector keeps the step's own lines out of the test runner's output and
 * makes them assertable.
 */
function lintChangedHarness(input: {
  readonly plan: Partial<RepoCheckCommandResult>;
  readonly lintExitCode?: number;
}) {
  const capturedCalls: CommandCall[] = [];
  const inheritedCalls: CommandCall[] = [];
  const lines: string[] = [];
  const errorText: string[] = [];
  const runtime: RepoCheckRuntime = {
    runCaptured(command, args) {
      capturedCalls.push({ command, args });
      return { status: 0, signal: null, stdout: '', stderr: '', ...input.plan };
    },
    runInherited(command, args) {
      inheritedCalls.push({ command, args });
      return Promise.resolve(input.lintExitCode ?? 0);
    },
  };
  const terminal = {
    line: (message: string) => {
      lines.push(message);
    },
    errorText: (text: string) => {
      errorText.push(text);
    },
  };
  return { capturedCalls, inheritedCalls, lines, errorText, runtime, terminal };
}

describe('repo-check lint-changed', () => {
  it('skips the lint run, and says so, when turbo plans no task for the changed scope', async () => {
    const harness = lintChangedHarness({
      plan: {
        stdout: JSON.stringify({ packages: ['//'], tasks: [] }),
        stderr: '• turbo 2.10.13\n',
      },
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).resolves.toBe(0);

    expect(harness.capturedCalls).toStrictEqual([{ command: 'pnpm', args: DRY_RUN_ARGS }]);
    expect(harness.inheritedCalls).toStrictEqual([]);
    expect(harness.lines).toStrictEqual([
      'repo-check lint-changed: turbo plans no lint task for the changes since HEAD',
    ]);
    // turbo's own stderr from the plan is replayed, never swallowed.
    expect(harness.errorText).toStrictEqual(['• turbo 2.10.13\n']);
  });

  it('runs turbo lint over the changed scope when the plan holds tasks', async () => {
    const harness = lintChangedHarness({
      plan: { stdout: JSON.stringify({ tasks: [{ taskId: '@engraph/result#lint' }] }) },
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).resolves.toBe(0);

    expect(harness.inheritedCalls).toStrictEqual([{ command: 'pnpm', args: LINT_ARGS }]);
    expect(harness.lines).toStrictEqual([]);
  });

  it("propagates the lint run's failure", async () => {
    const harness = lintChangedHarness({
      plan: { stdout: JSON.stringify({ tasks: [{ taskId: '@engraph/result#lint' }] }) },
      lintExitCode: 1,
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).resolves.toBe(1);
  });

  it("fails loudly with turbo's own message when the dry run fails", async () => {
    const harness = lintChangedHarness({
      plan: { status: 1, stderr: '  x Could not resolve workspaces.\n' },
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(
      'x Could not resolve workspaces.',
    );
    expect(harness.inheritedCalls).toStrictEqual([]);
  });

  it('fails, naming the warning, when a successful dry run with an empty plan writes one to stderr', async () => {
    // turbo 2.10.13's stderr, verbatim, when TURBO_REMOTE_CACHE_READ_ONLY is
    // set: it exits 0 and prints the warning twice. A green gate prints no
    // warning. The stderr is still replayed first, so nothing turbo said (a
    // one-time telemetry notice included) is lost from a failing run.
    const stderr = `${DEPRECATION_WARNING}\n• turbo 2.10.13\n${DEPRECATION_WARNING}\n`;
    const harness = lintChangedHarness({
      plan: { stdout: JSON.stringify({ packages: ['//'], tasks: [] }), stderr },
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(
      'WARNING  TURBO_REMOTE_CACHE_READ_ONLY is deprecated',
    );
    expect(harness.lines).toStrictEqual([]);
    expect(harness.errorText).toStrictEqual([stderr]);
  });

  it('fails before the lint run when the dry run of a planned run writes a warning', async () => {
    const harness = lintChangedHarness({
      plan: {
        stdout: JSON.stringify({ tasks: [{ taskId: '@engraph/result#lint' }] }),
        stderr: `${DEPRECATION_WARNING}\n`,
      },
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(/WARNING/u);
    expect(harness.inheritedCalls).toStrictEqual([]);
  });

  it('names the warning, not the plan, when the dry run also prints no readable plan', async () => {
    const harness = lintChangedHarness({
      plan: { stdout: '', stderr: `${DEPRECATION_WARNING}\n` },
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(/WARNING/u);
  });

  it('reports a signal-killed dry run by its signal, never as a plan', async () => {
    const harness = lintChangedHarness({ plan: { status: null, signal: 'SIGKILL' } });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(/SIGKILL/u);
    expect(harness.inheritedCalls).toStrictEqual([]);
  });
});
