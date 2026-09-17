import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  BIN,
  COMMIT_SUBJECT,
  INTENT_ID,
  REGISTRY_REL,
  RENAME_DESTINATION,
  RENAME_SOURCE,
  git,
  makeFixture,
  readPrimaryIntent,
  runCommitQueue,
  streams,
} from './commit-queue-worktree-fixture';
/**
 * F-138 regression smoke — the commit-queue two-root split and
 * changed-endpoint identity. Real scratch primary + linked worktree: a
 * rename traverses both changed endpoints, registry state stays at the
 * coordination home, an underivable git root refuses loudly. Each proof runs
 * the built CLI as a child with every stream captured and pinned, so what the
 * command prints is asserted and never reaches the gate log. `test:e2e` gates
 * it.
 */

async function proveRecordStagedUsesWorktreeIndex(): Promise<void> {
  const fixture = await makeFixture();
  try {
    git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);

    const result = runCommitQueue(fixture.linked, ['record-staged', '--intent-id', INTENT_ID]);

    assert.equal(result.status, 0, streams(result));
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, '');

    const intent = await readPrimaryIntent(fixture);
    const expectedStatus = `A\t${RENAME_DESTINATION}\nD\t${RENAME_SOURCE}\n`;
    assert.equal(intent?.staged_name_status, expectedStatus);
    assert.match(intent?.staged_bundle_fingerprint ?? '', /^[0-9a-f]{64}$/);

    // The registry write must land in the coordination home ONLY — the
    // linked worktree never grows its own registry copy.
    assert.equal(existsSync(join(fixture.linked, REGISTRY_REL)), false);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

async function proveVerifyStagedUsesWorktreeIndex(): Promise<void> {
  const fixture = await makeFixture();
  try {
    git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);

    const recorded = runCommitQueue(fixture.linked, ['record-staged', '--intent-id', INTENT_ID]);
    assert.equal(recorded.status, 0, streams(recorded));
    const recordedIntent = await readPrimaryIntent(fixture);

    const verified = runCommitQueue(fixture.linked, [
      'verify-staged',
      '--intent-id',
      INTENT_ID,
      '--commit-subject',
      COMMIT_SUBJECT,
    ]);

    assert.equal(verified.status, 0, streams(verified));
    // Verification reads the same worktree index the record step fingerprinted.
    assert.equal(verified.stdout, `${recordedIntent?.staged_bundle_fingerprint}\n`);
    assert.equal(verified.stderr, '');
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

/**
 * The whole of a commit's stderr when the advisory pass failed: the advisory
 * banner, then the notice that the commit landed at `head` with a non-zero
 * advisory exit recorded. The wording after the dash is free.
 */
function advisoryNoticeOnly(head: string): RegExp {
  return new RegExp(
    String.raw`^\[ADVISORY ONLY — NOT A COMMIT GATE\]\n` +
      String.raw`commit landed at ${head} \(intent ${INTENT_ID}\); ` +
      String.raw`advisory orchestrator exit [1-9]\d* — [^\n]*\n$`,
  );
}

async function proveCommitLandsOnWorktreeBranch(): Promise<void> {
  const fixture = await makeFixture();
  try {
    git(fixture.linked, 'mv', RENAME_SOURCE, RENAME_DESTINATION);
    const primaryHeadBefore = git(fixture.primary, 'rev-parse', 'HEAD').trim();

    const recorded = runCommitQueue(fixture.linked, ['record-staged', '--intent-id', INTENT_ID]);
    assert.equal(recorded.status, 0, streams(recorded));

    const messageFilePath = join(fixture.root, 'commit-message.txt');
    await writeFile(messageFilePath, COMMIT_SUBJECT + '\n');

    const committed = runCommitQueue(fixture.linked, [
      'commit',
      '--intent-id',
      INTENT_ID,
      '--message-file',
      messageFilePath,
    ]);

    assert.equal(committed.status, 0, streams(committed));
    const head = git(fixture.linked, 'rev-parse', 'HEAD').trim();
    // The sha is the command's last stdout line; git's commit summary and the
    // advisory child's own output are replayed above it.
    assert.equal(committed.stdout.trimEnd().split('\n').at(-1), head);
    // The scratch repo has no advisory-orchestrator script, so the advisory
    // pass fails — and MUST NOT gate the commit (PDR-053 / ADR-176 advisory
    // polarity).
    assert.match(committed.stderr, advisoryNoticeOnly(head));
    const committedPaths = git(fixture.linked, 'ls-tree', '-r', '--name-only', 'HEAD').split('\n');
    assert.ok(committedPaths.includes(RENAME_DESTINATION));
    assert.equal(committedPaths.includes(RENAME_SOURCE), false);
    assert.equal(git(fixture.linked, 'status', '--short'), '');

    // The primary checkout's HEAD is untouched — the inner commit landed
    // on the invoking worktree's branch.
    assert.equal(git(fixture.primary, 'rev-parse', 'HEAD').trim(), primaryHeadBefore);

    // The completed intent is removed from the coordination-home registry.
    assert.equal(await readPrimaryIntent(fixture), undefined);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

async function proveMissingGitRootRefusesLoudly(): Promise<void> {
  const fixture = await makeFixture();
  try {
    // The primary's git directory is inside the repository, so the
    // coordination home still resolves through git, but it is not inside a
    // working tree, so no invoking git root is derivable. The built CLI takes
    // no registry-root flag, and from a directory outside every repository the
    // command would refuse earlier, at the coordination home, never reaching
    // the guard this proof exists for.
    const gitDir = join(fixture.primary, '.git');

    const result = runCommitQueue(gitDir, ['record-staged', '--intent-id', INTENT_ID]);

    assert.equal(result.status, 2, streams(result));
    assert.equal(result.stdout, '');
    // The whole of stderr: git's own one-line refusal, then the guard's.
    assert.match(
      result.stderr,
      /^(?:fatal: [^\n]*\n)?Unable to resolve the invoking git worktree root: [^\n]*no fallback to the coordination home[^\n]*\n$/,
    );
    assert.ok(
      result.stderr.includes(`'${gitDir}' is not inside a git working tree`),
      streams(result),
    );

    // No silent fallback: the intent survives untouched — neither
    // fingerprinted against the coordination home's own index nor
    // abandoned by the refused invocation.
    const intent = await readPrimaryIntent(fixture);
    assert.equal(intent?.intent_id, INTENT_ID);
    assert.equal(intent?.phase, 'staging');
    assert.equal(intent?.staged_name_status, undefined);
    assert.equal(intent?.staged_bundle_fingerprint, undefined);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
}

assert.equal(existsSync(BIN), true, `built CLI missing at ${BIN}; build agent-tools first`);
await proveRecordStagedUsesWorktreeIndex();
await proveVerifyStagedUsesWorktreeIndex();
await proveCommitLandsOnWorktreeBranch();
await proveMissingGitRootRefusesLoudly();
process.stdout.write('commit-queue worktree smoke: 4/4 proofs passed\n');
