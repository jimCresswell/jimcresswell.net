import { z } from 'zod';

import { writeLine } from '../core/terminal-output.js';

import { defaultRuntime } from './repo-check-runtime.js';
import type { RepoCheckCommandResult, RepoCheckRuntime } from './repo-check-types.js';

/**
 * The pre-commit workspace lint: `turbo run lint` over the workspaces changed
 * since `HEAD` (and their dependents), skipped when that scope holds no task.
 *
 * Why the skip exists: turbo prints the warning "No tasks were executed as part
 * of this run." for every run whose task graph is empty, which is every commit
 * that changes no workspace (a root Markdown change scopes to the root package
 * alone, and the root declares no lint task). turbo 2.10 has no flag that makes
 * an empty scope a silent no-op (`turbo run --help`; the run reference at
 * turborepo.dev documents none), so a green docs-only commit printed a warning
 * every time. Readers learn to skip a warning that is always there; that is
 * the harm.
 *
 * Why turbo decides the skip: the step asks turbo for the task graph it would
 * run, a dry run under the same filter, rather than mapping changed paths to
 * workspaces itself. turbo's change detection (the working tree against
 * `HEAD`, dependents through `...`) is then the only answer, so the skip can
 * never disagree with the run it replaces.
 *
 * Why only the dry run is captured: it runs no task and leaves no process
 * behind, so a pipe on its output is safe. The lint run itself keeps inherited
 * output, because a pipe over a running gate chain is the F-112 failure
 * (`repo-check-runner.ts` and `core/file-backed-child.ts` carry the account).
 *
 * @packageDocumentation
 */

const CHANGED_SINCE_HEAD = '--filter=...[HEAD]';

const DRY_RUN_ARGS: readonly string[] = [
  'exec',
  'turbo',
  'run',
  'lint',
  CHANGED_SINCE_HEAD,
  '--dry-run=json',
];

const LINT_ARGS: readonly string[] = [
  'exec',
  'turbo',
  'run',
  'lint',
  CHANGED_SINCE_HEAD,
  '--output-logs=errors-only',
];

/** The one field of turbo's dry-run JSON the skip decision reads. */
const dryRunPlanSchema = z.object({ tasks: z.array(z.unknown()) });

/**
 * The number of tasks in turbo's dry-run plan.
 *
 * @param dryRunJson - stdout of `turbo run <task> --dry-run=json`.
 * @returns the planned task count; 0 means the run would execute nothing.
 * @throws when the output is not JSON or carries no task list: a changed plan
 *   shape must fail the gate, never read as an empty plan that skips the lint.
 */
export function plannedTaskCount(dryRunJson: string): number {
  let parsed: unknown;
  try {
    parsed = JSON.parse(dryRunJson);
  } catch (cause) {
    throw new Error('the turbo dry run did not print a JSON plan', { cause });
  }
  const plan = dryRunPlanSchema.safeParse(parsed);
  if (!plan.success) {
    throw new Error('the turbo dry run printed a plan with no task list');
  }
  return plan.data.tasks.length;
}

/**
 * Describe a failed dry run: how it ended, then turbo's own message. A signal
 * death is named as such, never folded into an exit code (F-112).
 */
function dryRunFailure(plan: RepoCheckCommandResult): string {
  const ending =
    plan.status === null ? `signal ${plan.signal ?? 'unknown'}` : `exit ${plan.status}`;
  const reason = plan.stderr.trim();
  const detail = reason.length > 0 ? `: ${reason}` : '';
  return `the turbo dry run planning the workspace lint ended with ${ending}${detail}`;
}

/** Where the step's own lines go; tests inject collectors. */
export interface LintChangedTerminal {
  /** A whole line for stdout. */
  readonly line: (message: string) => void;
  /** Captured child stderr, replayed verbatim. */
  readonly errorText: (text: string) => void;
}

const processTerminal: LintChangedTerminal = {
  line: writeLine,
  errorText: (text) => {
    process.stderr.write(text);
  },
};

/**
 * Lint the workspaces changed since `HEAD`, or say that nothing changed.
 *
 * turbo's stderr from the dry run is replayed whether or not the plan is
 * empty, so a warning turbo prints while planning is never swallowed.
 *
 * @returns the lint run's exit code, or 0 when the plan holds no task.
 * @throws when the dry run fails or prints an unreadable plan.
 */
export async function runLintChanged(
  runtime: RepoCheckRuntime = defaultRuntime,
  terminal: LintChangedTerminal = processTerminal,
): Promise<number> {
  const plan = runtime.runCaptured('pnpm', DRY_RUN_ARGS);
  if (plan.status !== 0) {
    throw new Error(dryRunFailure(plan));
  }
  if (plan.stderr.length > 0) {
    terminal.errorText(plan.stderr);
  }
  if (plannedTaskCount(plan.stdout) === 0) {
    terminal.line('repo-check lint-changed: turbo plans no lint task for the changes since HEAD');
    return 0;
  }
  return runtime.runInherited('pnpm', LINT_ARGS);
}
