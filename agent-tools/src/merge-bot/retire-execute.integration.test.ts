import { describe, expect, it } from 'vitest';

import {
  BRANCH,
  GRAPHQL_ERROR,
  mergedEverywhere,
  OTHER,
  refRead,
  runRetire,
  TIP,
  TOKEN,
} from './test-helpers/retire-cli-double.js';

/**
 * The remote delete's outcomes through the `merge-bot retire` front door,
 * where one GitHub answer decides them: GitHub answers every GraphQL call
 * the same way for the run. Each case checks the exit, the outcome kind and
 * reason, and that the token reaches neither output stream. The outcomes
 * that need GitHub to change between calls (a delete that takes, one that
 * is accepted and changes nothing, one GitHub refuses with an error, a
 * read-back that fails, a branch re-created after its delete), and every
 * check of where the refs are, run against real git in the smokes.
 */

async function retireRemote(graphql: unknown, json = true): ReturnType<typeof runRetire> {
  const args = json ? ['--branch', BRANCH, '--json'] : ['--branch', BRANCH];
  const run = await runRetire(args, mergedEverywhere(), { graphql });
  expect(`${run.out}${run.err}`).not.toContain(TOKEN);
  return run;
}

describe('merge-bot retire, the remote delete', () => {
  it('refuses with exit 3 when the remote moved after its proof', async () => {
    const run = await retireRemote(refRead(OTHER));

    expect(run.exit).toBe(3);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'refused' });
    expect(run.out).toContain('moved');
  });

  it("refuses with exit 3 when the bot's repository has another default branch", async () => {
    const run = await retireRemote(refRead(TIP, 'trunk'));

    expect(run.exit).toBe(3);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'refused' });
    expect(run.out).toContain('trunk');
  });

  it('fails with exit 1 when the re-read at the mint fails', async () => {
    const run = await retireRemote(GRAPHQL_ERROR);

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'failed' });
  });

  it('fails with exit 1 when GitHub answers the delete with a body it does not recognise and the branch reads back unchanged', async () => {
    const run = await retireRemote(refRead(TIP));

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'failed' });
    expect(run.out).toContain('did not take');
  });

  it('keeps the token off both streams in human output after a mint', async () => {
    const run = await retireRemote(refRead(TIP), false);

    expect(run).toMatchObject({ exit: 1, minted: true, out: '' });
    expect(run.err).toContain('did not take');
  });
});
