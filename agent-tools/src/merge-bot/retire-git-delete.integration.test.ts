import { assert, describe, expect, it } from 'vitest';

import type { GitCommandResult, GitExecutor } from './git-executor.js';
import { decideRetirement, type PlannedDelete } from './retire-decision.js';
import { deletePlannedRef, removeBranchConfig } from './retire-git-delete.js';
import type { RetireGit } from './retire-git-read.js';

/**
 * The retire command's local writes: a compare-and-swap delete of a PLANNED
 * ref, classified by the ref it left, and the branch's config section. The
 * executor answers by argv with git's literal exit and text.
 */

const SHA_A = 'a'.repeat(40);
const SHA_B = 'b'.repeat(40);

function answer(status: number, stdout = '', stderr = ''): GitCommandResult {
  return { status, signal: null, stdout, stderr };
}

function gitAnswering(answers: Readonly<Record<string, GitCommandResult>>): RetireGit {
  const exec: GitExecutor = (_file, args) =>
    answers[args.join(' ')] ?? answer(128, '', 'unanswered');
  return { git: { file: 'git', exec }, cwd: '/srv/repo', env: {} };
}

function plannedLocal(): PlannedDelete {
  const decision = decideRetirement({
    branch: 'feat/x',
    base: { name: 'main', sha: SHA_B },
    local: { sha: SHA_A, onBase: true },
    tracking: undefined,
    remote: undefined,
    inUseBy: [],
    caseCollisions: [],
    symbolic: [],
  });
  assert(
    decision.kind === 'plan' && decision.plan.local !== undefined,
    'the fixture plans a local delete',
  );
  return decision.plan.local;
}

describe('deletePlannedRef', () => {
  const cas = `update-ref --no-deref -d refs/heads/feat/x ${SHA_A}`;
  const reread = 'for-each-ref --format=%(refname) %(objectname) %(symref) refs/heads/feat/x';

  it('reads a clean compare-and-swap as deleted', async () => {
    expect(await deletePlannedRef(gitAnswering({ [cas]: answer(0) }), plannedLocal())).toEqual({
      ok: true,
      value: { kind: 'deleted' },
    });
  });

  it('reads a failed compare-and-swap on a ref already gone as absent', async () => {
    const git = gitAnswering({ [cas]: answer(1), [reread]: answer(0, '') });

    expect(await deletePlannedRef(git, plannedLocal())).toEqual({
      ok: true,
      value: { kind: 'absent' },
    });
  });

  it('reads a failed compare-and-swap on a ref that moved as kept at its new sha', async () => {
    const git = gitAnswering({
      [cas]: answer(1),
      [reread]: answer(0, `refs/heads/feat/x ${SHA_B} \n`),
    });

    expect(await deletePlannedRef(git, plannedLocal())).toEqual({
      ok: true,
      value: { kind: 'kept', sha: SHA_B },
    });
  });

  it("reads a failed compare-and-swap that left the ref at its proven sha as unchanged, with git's words", async () => {
    const git = gitAnswering({
      [cas]: answer(1, '', 'fatal: cannot lock ref\n'),
      [reread]: answer(0, `refs/heads/feat/x ${SHA_A} \n`),
    });

    expect(await deletePlannedRef(git, plannedLocal())).toEqual({
      ok: true,
      value: { kind: 'unchanged', detail: 'git exited 1: fatal: cannot lock ref' },
    });
  });

  it('ignores a longer ref the re-read pattern also lists', async () => {
    const git = gitAnswering({
      [cas]: answer(1),
      [reread]: answer(0, `refs/heads/feat/x/y ${SHA_B} \n`),
    });

    expect(await deletePlannedRef(git, plannedLocal())).toEqual({
      ok: true,
      value: { kind: 'absent' },
    });
  });
});

describe('removeBranchConfig', () => {
  const query = String.raw`config --name-only --get-regexp ^branch\.feat/x\.y\.[^.]+$`;

  it('does nothing when the branch has no config', async () => {
    expect((await removeBranchConfig(gitAnswering({ [query]: answer(1) }), 'feat/x.y')).ok).toBe(
      true,
    );
  });

  it('removes the section when it exists, and fails if the removal fails', async () => {
    const present = { [query]: answer(0, 'branch.feat/x.y.remote\n') };
    const removed = { ...present, 'config --remove-section branch.feat/x.y': answer(0) };

    expect((await removeBranchConfig(gitAnswering(removed), 'feat/x.y')).ok).toBe(true);
    expect((await removeBranchConfig(gitAnswering(present), 'feat/x.y')).ok).toBe(false);
  });
});
