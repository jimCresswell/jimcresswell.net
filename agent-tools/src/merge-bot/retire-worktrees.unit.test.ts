import { err, ok, type Result } from '@engraph/result';
import { describe, expect, it } from 'vitest';

import type { GitCommandResult, GitExecutor } from './git-executor.js';
import type { RetireGit } from './retire-git-read.js';
import { worktreesUsing } from './retire-worktrees.js';

/**
 * Whether any worktree is using the branch: checked out there, or named by
 * git's rebase or bisect state. git's answers are a table keyed by argv, and
 * the state files a table keyed by path.
 */

const SHA_A = 'a'.repeat(40);
const SHA_B = 'b'.repeat(40);

function answer(status: number, stdout = ''): GitCommandResult {
  return { status, signal: null, stdout, stderr: '' };
}

function gitAnswering(answers: Readonly<Record<string, GitCommandResult>>): RetireGit {
  const exec: GitExecutor = (_file, args) => answers[args.join(' ')] ?? answer(1);
  return { git: { file: 'git', exec }, cwd: '/srv/repo', env: {} };
}

const noFiles = (): Promise<Result<string | undefined, Error>> => Promise.resolve(ok(undefined));

describe('worktreesUsing', () => {
  const porcelain = [
    'worktree /srv/repo',
    `HEAD ${SHA_A}`,
    'branch refs/heads/main',
    '',
    'worktree /srv/repo-wt',
    `HEAD ${SHA_B}`,
    'detached',
    '',
  ].join('\n');
  const stateQuery =
    'rev-parse --path-format=absolute --git-path rebase-merge/head-name --git-path rebase-apply/head-name --git-path BISECT_START --git-path rebase-merge/update-refs';
  const statePaths = (root: string): string =>
    ['rebase-merge/head-name', 'rebase-apply/head-name', 'BISECT_START', 'rebase-merge/update-refs']
      .map((name) => `${root}/${name}`)
      .join('\n');
  const answers = {
    'worktree list --porcelain': answer(0, porcelain),
    [`-C /srv/repo ${stateQuery}`]: answer(0, statePaths('/g/main')),
    [`-C /srv/repo-wt ${stateQuery}`]: answer(0, statePaths('/g/wt')),
  };
  const filesWith =
    (path: string, content: string) =>
    (asked: string): Promise<Result<string | undefined, Error>> =>
      Promise.resolve(ok(asked === path ? content : undefined));

  it('names a worktree that has the branch checked out, by its basename', async () => {
    expect(await worktreesUsing(gitAnswering(answers), 'main', noFiles)).toEqual({
      ok: true,
      value: ['repo'],
    });
  });

  it('names a detached worktree whose bisect started on the branch', async () => {
    const files = filesWith('/g/wt/BISECT_START', 'feat/x\n');

    expect(await worktreesUsing(gitAnswering(answers), 'feat/x', files)).toEqual({
      ok: true,
      value: ['repo-wt'],
    });
  });

  it('names a worktree mid-rebase of the branch, and one whose rebase will update it', async () => {
    const rebasing = filesWith('/g/wt/rebase-merge/head-name', 'refs/heads/feat/x\n');
    const updating = filesWith('/g/wt/rebase-merge/update-refs', `refs/heads/feat/x\n${SHA_A}\n`);

    expect(await worktreesUsing(gitAnswering(answers), 'feat/x', rebasing)).toEqual({
      ok: true,
      value: ['repo-wt'],
    });
    expect(await worktreesUsing(gitAnswering(answers), 'feat/x', updating)).toEqual({
      ok: true,
      value: ['repo-wt'],
    });
  });

  it('names none when no worktree uses the branch', async () => {
    expect(await worktreesUsing(gitAnswering(answers), 'feat/x', noFiles)).toEqual({
      ok: true,
      value: [],
    });
  });

  it('fails, rather than reading "not in use", when a state file exists but cannot be read', async () => {
    const unreadable = (): Promise<Result<string | undefined, Error>> =>
      Promise.resolve(err(new Error('EACCES')));

    expect((await worktreesUsing(gitAnswering(answers), 'feat/x', unreadable)).ok).toBe(false);
  });

  it('fails, rather than reading "not in use", when a listed worktree cannot be asked for its state', async () => {
    const unanswered = { ...answers, [`-C /srv/repo-wt ${stateQuery}`]: answer(128) };

    expect((await worktreesUsing(gitAnswering(unanswered), 'feat/x', noFiles)).ok).toBe(false);
  });

  it('skips the state of a worktree git marks prunable, whose directory is gone', async () => {
    const pruned = `${porcelain}worktree /srv/gone-wt\nHEAD ${SHA_B}\ndetached\nprunable gitdir file points to non-existent location\n`;

    expect(
      await worktreesUsing(
        gitAnswering({ ...answers, 'worktree list --porcelain': answer(0, pruned) }),
        'feat/x',
        noFiles,
      ),
    ).toEqual({ ok: true, value: [] });
  });
});
