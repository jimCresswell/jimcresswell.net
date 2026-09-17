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

  it('reports a signal-killed dry run by its signal, never as a plan', async () => {
    const harness = lintChangedHarness({ plan: { status: null, signal: 'SIGKILL' } });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(/SIGKILL/u);
    expect(harness.inheritedCalls).toStrictEqual([]);
  });
});
