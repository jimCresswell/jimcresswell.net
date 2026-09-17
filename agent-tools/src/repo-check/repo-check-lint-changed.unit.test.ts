import { describe, expect, it } from 'vitest';

import { plannedTaskCount } from './repo-check-lint-changed.js';

/**
 * The skip decision reads turbo's own dry-run plan: the task graph `turbo run`
 * would execute under the same filter. These tests describe the pure reading of
 * that plan; the process edge is described with a fake runtime in
 * `tests/repo-check-lint-changed.integration.test.ts`.
 */

describe('plannedTaskCount', () => {
  it('reads a plan whose task graph is empty as no task', () => {
    // The shape turbo 2.10 prints for a commit that changes no workspace: the
    // scope may still name the root package, which declares no lint task.
    const plan = JSON.stringify({ packages: ['//'], tasks: [] });

    expect(plannedTaskCount(plan)).toBe(0);
  });

  it('counts every planned task, dependency builds included', () => {
    const plan = JSON.stringify({
      packages: ['@engraph/result'],
      tasks: [{ taskId: '@engraph/result#build' }, { taskId: '@engraph/result#lint' }],
    });

    expect(plannedTaskCount(plan)).toBe(2);
  });

  it('refuses output that is not JSON, naming the dry run', () => {
    expect(() => plannedTaskCount('• turbo 2.10.13')).toThrow(/turbo dry run/u);
  });

  it('refuses a plan that carries no task list rather than reading it as empty', () => {
    // A changed plan shape must fail loudly: reading it as "no task" would
    // silently skip the lint of a commit that changes a workspace.
    expect(() => plannedTaskCount(JSON.stringify({ packages: [] }))).toThrow(/turbo dry run/u);
  });
});
