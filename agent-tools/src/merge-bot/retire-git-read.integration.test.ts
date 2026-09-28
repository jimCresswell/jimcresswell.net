import { describe, expect, it } from 'vitest';

import type { GitCommandResult, GitExecutor } from './git-executor.js';
import {
  fetchRemoteObjects,
  isOnBase,
  probeRemoteBranch,
  readDefaultBranch,
  readOriginUrl,
  type RetireGit,
} from './retire-git-read.js';

/**
 * The retire command's git reads: git's exit status and text in, a typed
 * reading out. The executor is a table of literal answers keyed by argv, so
 * each test states what git said and checks what the command read from it.
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

describe('probeRemoteBranch', () => {
  const probe = 'ls-remote origin refs/heads/feat/x';

  it('reads the exact ref as present at its sha', async () => {
    const git = gitAnswering({ [probe]: answer(0, `${SHA_A}\trefs/heads/feat/x\n`) });

    expect(await probeRemoteBranch(git, 'feat/x')).toEqual({
      ok: true,
      value: { kind: 'present', sha: SHA_A },
    });
  });

  it('reads an empty answer as absent', async () => {
    expect(await probeRemoteBranch(gitAnswering({ [probe]: answer(0) }), 'feat/x')).toEqual({
      ok: true,
      value: { kind: 'absent' },
    });
  });

  it('reads a failed remote read as a failure, never as absent', async () => {
    const result = await probeRemoteBranch(
      gitAnswering({ [probe]: answer(128, '', 'fatal: unable to access') }),
      'feat/x',
    );

    expect(result.ok).toBe(false);
  });
});

describe('isOnBase', () => {
  const ask = `merge-base --is-ancestor ${SHA_A} ${SHA_B}`;

  it('reads exit 0 as on the base, exit 1 as not, and anything else as a failure', async () => {
    expect(await isOnBase(gitAnswering({ [ask]: answer(0) }), SHA_A, SHA_B)).toEqual({
      ok: true,
      value: true,
    });
    expect(await isOnBase(gitAnswering({ [ask]: answer(1) }), SHA_A, SHA_B)).toEqual({
      ok: true,
      value: false,
    });
    expect((await isOnBase(gitAnswering({ [ask]: answer(128) }), SHA_A, SHA_B)).ok).toBe(false);
  });
});

describe('readDefaultBranch', () => {
  const answers = {
    'ls-remote --symref origin HEAD': answer(0, `ref: refs/heads/main\tHEAD\n${SHA_B}\tHEAD\n`),
    'fetch --quiet --no-write-fetch-head --no-tags --refmap= origin refs/heads/main:refs/remotes/origin/main':
      answer(0),
    'remote set-head origin --auto': answer(0),
    [`cat-file -e ${SHA_B}^{commit}`]: answer(0),
  };

  it('reads the default and its tip once the tracking ref and origin/HEAD are refreshed', async () => {
    expect(await readDefaultBranch(gitAnswering(answers))).toEqual({
      ok: true,
      value: { name: 'main', sha: SHA_B },
    });
  });

  it('fails when origin/HEAD cannot be refreshed', async () => {
    const result = await readDefaultBranch(
      gitAnswering({
        ...answers,
        'remote set-head origin --auto': answer(1, '', 'error: Not a valid ref'),
      }),
    );

    expect(result.ok).toBe(false);
  });
});

describe('fetchRemoteObjects', () => {
  const fetch = 'fetch --quiet --no-write-fetch-head --no-tags --refmap= origin refs/heads/feat/x';

  it('succeeds only when the probed commit is then present', async () => {
    const present = { [fetch]: answer(0), [`cat-file -e ${SHA_A}^{commit}`]: answer(0) };

    expect((await fetchRemoteObjects(gitAnswering(present), 'feat/x', SHA_A)).ok).toBe(true);
    expect(
      (await fetchRemoteObjects(gitAnswering({ [fetch]: answer(0) }), 'feat/x', SHA_A)).ok,
    ).toBe(false);
  });
});

describe('readOriginUrl', () => {
  const query = 'config --get-all remote.origin.url';

  it('reads the raw configured URL, and fails when origin has none', async () => {
    const url = 'git@github.com:acme/widgets.git';
    const configured = gitAnswering({ [query]: answer(0, `${url}\n`) });

    expect(await readOriginUrl(configured)).toEqual({ ok: true, value: url });
    expect((await readOriginUrl(gitAnswering({ [query]: answer(1) }))).ok).toBe(false);
  });

  it('fails when origin has more than one URL: fetch reads the first, a single read the last', async () => {
    const two = 'https://github.com/acme/widgets.git\nhttps://github.com/other/widgets.git\n';

    expect((await readOriginUrl(gitAnswering({ [query]: answer(0, two) }))).ok).toBe(false);
  });
});
