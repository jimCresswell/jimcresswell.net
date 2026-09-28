import { describe, expect, it } from 'vitest';

import {
  caseCollisionsOf,
  githubRepoOf,
  isRetirableBranchName,
  parseExactRemoteRef,
  parseRefListing,
  parseSymrefHead,
  parseWorktrees,
} from './retire-parse.js';

/**
 * The `merge-bot retire` parsers: git's and a remote URL's text in, typed
 * readings out. Pure; every input here is the literal text git prints.
 */

const SHA_A = 'a'.repeat(40);
const SHA_B = 'b'.repeat(40);

describe('parseSymrefHead', () => {
  it('reads the default branch name and its tip from one remote reading', () => {
    const parsed = parseSymrefHead(`ref: refs/heads/main\tHEAD\n${SHA_A}\tHEAD\n`);

    expect(parsed).toEqual({ ok: true, value: { name: 'main', sha: SHA_A } });
  });

  it('refuses a reading with no symref line', () => {
    expect(parseSymrefHead(`${SHA_A}\tHEAD\n`).ok).toBe(false);
  });

  it('refuses a server-supplied name that would read as a flag in a later argv', () => {
    expect(parseSymrefHead(`ref: refs/heads/-x\tHEAD\n${SHA_A}\tHEAD\n`).ok).toBe(false);
  });

  it('names a refused server-supplied name without its control characters', () => {
    const parsed = parseSymrefHead(`ref: refs/heads/a\u001b[31m\tHEAD\n${SHA_A}\tHEAD\n`);

    expect(parsed.ok).toBe(false);
    expect(parsed.ok ? '' : parsed.error.message).not.toContain('\u001b');
  });
});

describe('parseExactRemoteRef', () => {
  it('takes the line whose refname equals the branch, and ignores suffix matches', () => {
    // git ls-remote matches any ref ENDING in the pattern after a slash, so a
    // ref named a/refs/heads/zeta answers a probe for refs/heads/zeta.
    const stdout = `${SHA_B}\trefs/heads/a/refs/heads/zeta\n${SHA_A}\trefs/heads/zeta\n`;

    expect(parseExactRemoteRef(stdout, 'zeta')).toEqual({ kind: 'present', sha: SHA_A });
  });

  it('reads a probe that matched only a suffix as absent', () => {
    expect(parseExactRemoteRef(`${SHA_B}\trefs/heads/a/refs/heads/zeta\n`, 'zeta')).toEqual({
      kind: 'absent',
    });
  });

  it('reads empty output as absent', () => {
    expect(parseExactRemoteRef('', 'zeta')).toEqual({ kind: 'absent' });
  });
});

describe('parseRefListing', () => {
  it('maps every full refname to its object name, with no symref on a plain ref', () => {
    const listing = parseRefListing(
      `refs/heads/main ${SHA_A} \nrefs/remotes/origin/main ${SHA_B} \n`,
    );

    expect(listing.get('refs/heads/main')).toEqual({ sha: SHA_A, symref: undefined });
    expect(listing.get('refs/remotes/origin/main')).toEqual({ sha: SHA_B, symref: undefined });
    expect(listing.size).toBe(2);
  });

  it('reads the ref a symbolic ref points at', () => {
    const listing = parseRefListing(`refs/heads/alias ${SHA_A} refs/heads/main\n`);

    expect(listing.get('refs/heads/alias')).toEqual({ sha: SHA_A, symref: 'refs/heads/main' });
  });

  it('keeps names exact, so a case-folded spelling never resolves another ref', () => {
    const listing = parseRefListing(`refs/heads/main ${SHA_A} \n`);

    expect(listing.get('refs/heads/Main')).toBeUndefined();
  });
});

describe('caseCollisionsOf', () => {
  it('names every other local or tracking ref equal to the branch when case is ignored', () => {
    const listing = parseRefListing(
      [
        `refs/heads/feat/x ${SHA_A} `,
        `refs/heads/Feat/X ${SHA_B} `,
        `refs/remotes/origin/FEAT/x ${SHA_B} `,
        `refs/heads/feat/xy ${SHA_B} `,
      ].join('\n'),
    );

    expect(caseCollisionsOf(listing, 'feat/x')).toEqual([
      'refs/heads/Feat/X',
      'refs/remotes/origin/FEAT/x',
    ]);
  });

  it('finds none when only the exact names exist', () => {
    const listing = parseRefListing(
      `refs/heads/feat/x ${SHA_A} \nrefs/remotes/origin/feat/x ${SHA_B} \n`,
    );

    expect(caseCollisionsOf(listing, 'feat/x')).toEqual([]);
  });
});

describe('parseWorktrees', () => {
  it('reads each worktree path with its branch, a detached one with none, and which are prunable', () => {
    const porcelain = [
      'worktree /repo',
      `HEAD ${SHA_A}`,
      'branch refs/heads/main',
      '',
      'worktree /repo-wt',
      `HEAD ${SHA_B}`,
      'detached',
      '',
      'worktree /gone-wt',
      `HEAD ${SHA_B}`,
      'branch refs/heads/feat/x',
      'prunable gitdir file points to non-existent location',
      '',
    ].join('\n');

    expect(parseWorktrees(porcelain)).toEqual([
      { path: '/repo', branch: 'refs/heads/main', prunable: false },
      { path: '/repo-wt', branch: undefined, prunable: false },
      { path: '/gone-wt', branch: 'refs/heads/feat/x', prunable: true },
    ]);
  });
});

describe('githubRepoOf', () => {
  it('reads the owner and repository from every GitHub URL form git accepts', () => {
    for (const url of [
      'https://github.com/acme/widgets.git',
      'https://github.com/acme/widgets',
      'git@github.com:acme/widgets.git',
      'ssh://git@github.com/acme/widgets.git',
      'https://x-access-token:s3cret@github.com/acme/widgets.git',
      'https://s3cret@github.com/acme/widgets',
    ]) {
      expect(githubRepoOf(url)).toEqual({ owner: 'acme', repo: 'widgets' });
    }
  });

  it('reads nothing from a URL that is not GitHub', () => {
    expect(githubRepoOf('https://example.com/acme/widgets.git')).toBeUndefined();
    expect(githubRepoOf('/srv/git/widgets.git')).toBeUndefined();
  });
});

describe('isRetirableBranchName', () => {
  it('admits the names this estate cuts', () => {
    for (const name of ['feat/branch-retire', 'coordination/2026-09-28-87689e', 'docs/a_b.c']) {
      expect(isRetirableBranchName(name)).toBe(true);
    }
  });

  it('refuses characters a URL or a ref path would read as something else', () => {
    for (const name of ['issue#12', '%2e%2e/tags/v1', 'a b', 'naïve', '']) {
      expect(isRetirableBranchName(name)).toBe(false);
    }
  });
});
