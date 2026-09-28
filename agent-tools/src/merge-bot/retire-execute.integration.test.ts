import { describe, expect, it } from 'vitest';

import {
  BRANCH,
  DELETE_ACCEPTED,
  GRAPHQL_ERROR,
  mergedEverywhere,
  OTHER,
  refRead,
  runRetire,
  TIP,
  TOKEN,
} from './test-helpers/retire-cli-double.js';

/**
 * The remote delete's outcomes through the `merge-bot retire` front door.
 * GitHub answers each GraphQL call in turn (the re-read at the mint, the
 * delete, the read-back); the outcome is decided by what the read-back
 * shows, never by GitHub's answer to the delete, and no local name is
 * deleted unless the remote reads back absent. Every case also checks the
 * token reaches neither output stream.
 */

async function retireRemote(graphql: readonly unknown[]): ReturnType<typeof runRetire> {
  const run = await runRetire(['--branch', BRANCH, '--json'], mergedEverywhere(), graphql);
  expect(`${run.out}${run.err}`).not.toContain(TOKEN);
  return run;
}

describe('merge-bot retire, the remote delete', () => {
  it('retires every name when the delete is accepted and the ref reads back absent', async () => {
    const run = await retireRemote([refRead(TIP), DELETE_ACCEPTED, refRead(undefined)]);

    expect(run.exit).toBe(0);
    expect(JSON.parse(run.out).names).toEqual({
      remote: { state: 'deleted', sha: TIP },
      tracking: { state: 'deleted', sha: TIP },
      local: { state: 'deleted', sha: TIP },
    });
  });

  it('reports the remote absent, not deleted, when someone else removed it after the mint', async () => {
    const run = await retireRemote([refRead(TIP), GRAPHQL_ERROR, refRead(undefined)]);

    expect(run.exit).toBe(0);
    expect(JSON.parse(run.out).names.remote).toEqual({ state: 'absent' });
  });

  it('fails with exit 1, deleting nothing local, when an accepted delete reads back unchanged', async () => {
    const run = await retireRemote([refRead(TIP), DELETE_ACCEPTED, refRead(TIP)]);

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out).kind).toBe('failed');
  });

  it('fails with exit 1, deleting nothing local, when the read-back cannot be read', async () => {
    const run = await retireRemote([refRead(TIP), DELETE_ACCEPTED, GRAPHQL_ERROR]);

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out).reason).toContain('unknown');
  });

  it('refuses with exit 3 when the remote moved between the mint and the delete', async () => {
    const run = await retireRemote([refRead(TIP), GRAPHQL_ERROR, refRead(OTHER)]);

    expect(run.exit).toBe(3);
    expect(JSON.parse(run.out).reason).toContain('moved');
  });

  it('refuses with exit 3, before any delete, when the remote moved after its proof', async () => {
    const run = await retireRemote([refRead(OTHER), DELETE_ACCEPTED, refRead(undefined)]);

    expect(run.exit).toBe(3);
    expect(JSON.parse(run.out).reason).toContain('moved');
  });

  it("refuses with exit 3, before any delete, when the bot's repository has another default", async () => {
    const run = await retireRemote([refRead(TIP, 'trunk'), DELETE_ACCEPTED, refRead(undefined)]);

    expect(run.exit).toBe(3);
    expect(JSON.parse(run.out).reason).toContain('default');
  });

  it('fails with exit 1, deleting nothing, when the re-read at the mint fails', async () => {
    const run = await retireRemote([GRAPHQL_ERROR, DELETE_ACCEPTED, refRead(undefined)]);

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out).kind).toBe('failed');
  });
});
