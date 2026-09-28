import { describe, expect, it } from 'vitest';

import {
  answer,
  BRANCH,
  LISTING_QUERY,
  MAIN_SHA,
  mergedEverywhere,
  mergedLocally,
  OTHER,
  runRetire,
  TIP,
} from './test-helpers/retire-cli-double.js';

/**
 * The `merge-bot retire` front door over injected seams: git answers by argv
 * with literal text, GitHub by endpoint. It proves the exit map, the `--json`
 * object, the bindings and refusals that mint nothing, and that a credential
 * in origin's URL reaches neither output stream. The remote delete's
 * outcomes are `retire-execute.integration.test.ts`; the paths that change
 * refs run against real git in the smokes.
 */

const ORIGIN_QUERY = 'config --get-all remote.origin.url';
const LOCAL_CAS = `update-ref --no-deref -d refs/heads/${BRANCH} ${TIP}`;
const TRACKING_CAS = `update-ref --no-deref -d refs/remotes/origin/${BRANCH} ${TIP}`;

describe('merge-bot retire, front door', () => {
  it('prints its usage on --help and exits 0', async () => {
    const run = await runRetire(['--help'], {});

    expect(run.exit).toBe(0);
    expect(run.out).toContain('merge-bot retire --branch');
  });

  it('exits 2 on a usage error', async () => {
    expect((await runRetire(['--json'], {})).exit).toBe(2);
  });

  it("exits 2 on a name git's ref grammar rejects", async () => {
    expect((await runRetire(['--branch', BRANCH], {}, { refFormatLegal: false })).exit).toBe(2);
  });

  it('exits 2, minting nothing, when the bot identity cannot be read', async () => {
    const unreadable = (): string => {
      throw new Error('ENOENT: no merge-bot.json');
    };
    const run = await runRetire(['--branch', BRANCH], mergedEverywhere(), {
      readConfigFileImpl: unreadable,
    });

    expect(run).toMatchObject({ exit: 2, minted: false });
  });

  it.each(['Main', 'HEAD', 'head', 'MASTER'])(
    'refuses the reserved name %s with exit 3, reading nothing and minting nothing',
    async (name) => {
      expect(await runRetire(['--branch', name], {})).toMatchObject({ exit: 3, minted: false });
    },
  );

  it.each(['git@github.com:someone-else/widgets.git', 'git@github.com:acme/widgets-fork.git'])(
    'refuses with exit 3, minting nothing, when origin (%s) is not the bot identity repository',
    async (url) => {
      const answers = { ...mergedEverywhere(), [ORIGIN_QUERY]: answer(0, `${url}\n`) };
      const run = await runRetire(['--branch', BRANCH], answers);

      expect(run).toMatchObject({ exit: 3, minted: false });
      expect(run.err).toContain('acme/widgets');
    },
  );

  it.each([
    'https://x-access-token:s3cret-in-url@github.com/someone-else/widgets.git',
    'https://s3cret-in-url@example.com/acme/widgets.git',
  ])('never echoes a credential carried in origin URL, on either stream: %s', async (url) => {
    const answers = { ...mergedEverywhere(), [ORIGIN_QUERY]: answer(0, `${url}\n`) };
    const run = await runRetire(['--branch', BRANCH], answers);

    expect(run.exit).toBe(3);
    expect(`${run.out}${run.err}`).not.toContain('s3cret-in-url');
  });

  it('fails with exit 1, minting nothing, when origin has more than one URL', async () => {
    const two = 'https://github.com/acme/widgets.git\nhttps://github.com/acme/widgets-mirror.git\n';
    const answers = { ...mergedEverywhere(), [ORIGIN_QUERY]: answer(0, two) };

    expect(await runRetire(['--branch', BRANCH], answers)).toMatchObject({
      exit: 1,
      minted: false,
    });
  });

  it('refuses with exit 3 when a tip is not on the default, naming the tip, minting nothing', async () => {
    const answers = {
      ...mergedEverywhere(),
      [`merge-base --is-ancestor ${TIP} ${MAIN_SHA}`]: answer(1),
    };

    const run = await runRetire(['--branch', BRANCH], answers);

    expect(run).toMatchObject({ exit: 3, minted: false });
    expect(run.err).toContain(TIP);
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

  it("refuses with exit 3 a branch a worktree's bisect state names", async () => {
    const run = await runRetire(['--branch', BRANCH], mergedLocally(), {
      stateFiles: { '/g/c': `${BRANCH}\n` },
    });

    expect(run.exit).toBe(3);
    expect(run.err).toContain('in use in worktree repo');
  });

  it.each([
    `refs/heads/main ${MAIN_SHA} \nrefs/heads/${BRANCH} ${MAIN_SHA} refs/heads/main\n`,
    `refs/heads/main ${MAIN_SHA} \nrefs/remotes/origin/${BRANCH} ${MAIN_SHA} refs/remotes/origin/main\n`,
  ])('refuses with exit 3 a branch whose own ref is symbolic: %s', async (listing) => {
    const answers = {
      ...mergedLocally(),
      [LISTING_QUERY]: answer(0, listing),
      [`merge-base --is-ancestor ${MAIN_SHA} ${MAIN_SHA}`]: answer(0),
    };

    const run = await runRetire(['--branch', BRANCH], answers);

    expect(run.exit).toBe(3);
    expect(run.err).toContain('symbolic');
  });

  it('retires the local names with exit 0 and no mint when the remote has no such branch', async () => {
    const run = await runRetire(['--branch', BRANCH, '--json'], mergedLocally());

    expect(run).toMatchObject({ exit: 0, minted: false });
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

  it.each([
    { cas: LOCAL_CAS, ref: `refs/heads/${BRANCH}`, name: 'local' },
    { cas: TRACKING_CAS, ref: `refs/remotes/origin/${BRANCH}`, name: 'tracking' },
  ])(
    'exits 1 as partial, reporting the $name ref kept at the sha it moved to',
    async ({ cas, ref, name }) => {
      const answers = {
        ...mergedLocally(),
        [cas]: answer(1),
        [`for-each-ref --format=%(refname) %(objectname) %(symref) ${ref}`]: answer(
          0,
          `${ref} ${OTHER} \n`,
        ),
      };
      const run = await runRetire(['--branch', BRANCH, '--json'], answers);

      expect(run.exit).toBe(1);
      expect(JSON.parse(run.out)).toMatchObject({
        kind: 'partial',
        names: { [name]: { state: 'kept', sha: OTHER } },
      });
    },
  );

  it('reports nothing to retire with exit 0 when the branch has no name anywhere', async () => {
    const answers = {
      ...mergedLocally(),
      [LISTING_QUERY]: answer(0, `refs/heads/main ${MAIN_SHA} \n`),
    };

    expect((await runRetire(['--branch', BRANCH], answers)).exit).toBe(0);
  });
});
