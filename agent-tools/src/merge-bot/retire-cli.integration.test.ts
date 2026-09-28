import { describe, expect, it } from 'vitest';

import {
  answer,
  BRANCH,
  LISTING_QUERY,
  MAIN_SHA,
  mergedEverywhere,
  mergedLocally,
  runRetire,
  TIP,
} from './test-helpers/retire-cli-double.js';

/**
 * The `merge-bot retire` front door over injected seams: git answers by argv
 * with literal text, GitHub by URL. It proves the exit map, the `--json`
 * object, the bindings and refusals that mint nothing, and that neither a
 * credential in origin's URL nor the token reaches either output stream. The
 * remote delete's outcomes are `retire-execute.integration.test.ts`; the
 * paths that change refs run against real git in the smokes.
 */

describe('merge-bot retire, front door', () => {
  it('prints its usage on --help and exits 0', async () => {
    const run = await runRetire(['--help'], {});

    expect(run.exit).toBe(0);
    expect(run.out).toContain('merge-bot retire --branch');
  });

  it('exits 2 on a usage error', async () => {
    expect((await runRetire(['--json'], {})).exit).toBe(2);
  });

  it('exits 2, minting nothing, when the bot identity cannot be read', async () => {
    const unreadable = (): string => {
      throw new Error('ENOENT: no merge-bot.json');
    };
    const run = await runRetire(['--branch', BRANCH], mergedEverywhere(), [{}], unreadable);

    expect(run.exit).toBe(2);
    expect(run.minted).toBe(false);
  });

  it('refuses a default-branch name in any case with exit 3, reading nothing and minting nothing', async () => {
    const run = await runRetire(['--branch', 'Main'], {});

    expect(run.exit).toBe(3);
    expect(run.minted).toBe(false);
  });

  it('refuses with exit 3 when origin is not the bot identity repository, minting nothing', async () => {
    const answers = {
      ...mergedEverywhere(),
      'config --get-all remote.origin.url': answer(0, 'git@github.com:someone-else/widgets.git\n'),
    };
    const run = await runRetire(['--branch', BRANCH], answers);

    expect(run.exit).toBe(3);
    expect(run.err).toContain('acme/widgets');
    expect(run.minted).toBe(false);
  });

  it('never echoes a credential carried in origin URL, on either stream', async () => {
    for (const url of [
      'https://x-access-token:s3cret-in-url@github.com/someone-else/widgets.git',
      'https://s3cret-in-url@example.com/acme/widgets.git',
    ]) {
      const answers = {
        ...mergedEverywhere(),
        'config --get-all remote.origin.url': answer(0, `${url}\n`),
      };
      const run = await runRetire(['--branch', BRANCH], answers);

      expect(run.exit).toBe(3);
      expect(`${run.out}${run.err}`).not.toContain('s3cret-in-url');
    }
  });

  it('fails with exit 1, minting nothing, when origin has more than one URL', async () => {
    const answers = {
      ...mergedEverywhere(),
      'config --get-all remote.origin.url': answer(
        0,
        'https://github.com/acme/widgets.git\nhttps://github.com/acme/widgets-mirror.git\n',
      ),
    };
    const run = await runRetire(['--branch', BRANCH], answers);

    expect(run.exit).toBe(1);
    expect(run.minted).toBe(false);
  });

  it('refuses with exit 3 when a tip is not on the default, naming the tip, minting nothing', async () => {
    const answers = {
      ...mergedEverywhere(),
      [`merge-base --is-ancestor ${TIP} ${MAIN_SHA}`]: answer(1),
    };
    const run = await runRetire(['--branch', BRANCH], answers);

    expect(run.exit).toBe(3);
    expect(run.err).toContain(TIP);
    expect(run.minted).toBe(false);
  });

  it('refuses with exit 3 a branch checked out in a worktree', async () => {
    const answers = {
      ...mergedLocally(),
      'worktree list --porcelain': answer(
        0,
        `worktree /srv/repo-wt\nHEAD ${TIP}\nbranch refs/heads/${BRANCH}\n`,
      ),
    };
    const run = await runRetire(['--branch', BRANCH], answers);

    expect(run.exit).toBe(3);
    expect(run.err).toContain('repo-wt');
  });

  it('refuses with exit 3 a branch whose local ref is symbolic', async () => {
    const answers = {
      ...mergedLocally(),
      [LISTING_QUERY]: answer(
        0,
        `refs/heads/main ${MAIN_SHA} \nrefs/heads/${BRANCH} ${MAIN_SHA} refs/heads/main\n`,
      ),
    };
    const run = await runRetire(['--branch', BRANCH], answers);

    expect(run.exit).toBe(3);
    expect(run.err).toContain('symbolic');
  });

  it('retires the local names with exit 0 and no mint when the remote has no such branch', async () => {
    const run = await runRetire(['--branch', BRANCH, '--json'], mergedLocally());

    expect(run.exit).toBe(0);
    expect(run.minted).toBe(false);
    expect(JSON.parse(run.out)).toEqual({
      kind: 'retired',
      branch: BRANCH,
      base: { name: 'main', sha: MAIN_SHA },
      names: {
        remote: { state: 'absent' },
        tracking: { state: 'deleted', sha: TIP },
        local: { state: 'deleted', sha: TIP },
      },
    });
  });

  it('reports nothing to retire with exit 0 when the branch has no name anywhere', async () => {
    const answers = {
      ...mergedLocally(),
      [LISTING_QUERY]: answer(0, `refs/heads/main ${MAIN_SHA} \n`),
    };

    expect((await runRetire(['--branch', BRANCH], answers)).exit).toBe(0);
  });
});
