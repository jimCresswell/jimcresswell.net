import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import net from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { GATE_SLOT_HELD_ENV, GATE_SLOT_HOST } from '../src/gate-slot/gate-slot-contract';
import { encodeHolderIdentity } from '../src/gate-slot/gate-slot-identity';
import { createPortRegistry } from '../src/gate-slot/gate-slot-ports';

import {
  holdSmokeLock,
  PACKAGE_ROOT,
  SMOKE_MUTEX_PORT,
  SMOKE_SLOT_PORTS,
} from './gate-slot-smoke-support';

/**
 * The gate-slot command line through its entry point, run from source under
 * tsx as the hooks run it, and the port adapter's promise that no probe
 * listener outlives a failed step. The command line touches no slot except to
 * read `status`; each run is its own process group with a harness timeout, so
 * a regression can never hang the gate it runs inside. Each run's environment
 * is built here, and carries no held marker unless a proof sets one, because
 * the smoke itself runs inside a real gate that set one.
 */

const REPO_ROOT = join(PACKAGE_ROOT, '..');
const ENTRY = join(PACKAGE_ROOT, 'src/gate-slot/gate-slot.ts');
const CLI_TIMEOUT_MS = 60_000;

interface CliRun {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

async function runCli(
  args: readonly string[],
  extraEnv: Readonly<Record<string, string>> = {},
): Promise<CliRun> {
  const child = spawn(process.execPath, ['--import', 'tsx', ENTRY, ...args], {
    cwd: PACKAGE_ROOT,
    env: { ...extraEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });
  const leader = child.pid;
  assert.ok(leader !== undefined, 'gate-slot cli smoke: the command did not start');
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8').on('data', (chunk: string) => (stdout += chunk));
  child.stderr.setEncoding('utf8').on('data', (chunk: string) => (stderr += chunk));
  const timer = setTimeout(() => {
    process.kill(-leader, 'SIGKILL');
  }, CLI_TIMEOUT_MS);
  const status = await new Promise<number | null>((resolve) => {
    child.once('close', (code) => {
      resolve(code);
    });
  });
  clearTimeout(timer);
  return { status, stdout, stderr };
}

async function proveNoProbeListenerOutlivesAFailedStep(): Promise<void> {
  const registry = createPortRegistry({
    host: GATE_SLOT_HOST,
    mutexPort: SMOKE_MUTEX_PORT,
    slotPorts: SMOKE_SLOT_PORTS,
    patience: { mutexAttempts: 5, mutexRetryMs: 50, identityTimeoutMs: 200 },
  });
  const identityLine = encodeHolderIdentity({
    worktree: PACKAGE_ROOT,
    pid: process.pid,
    command: 'pnpm check',
    acquired_at: new Date().toISOString(),
  });
  assert.ok(identityLine.ok);
  await assert.rejects(
    registry.transact({
      identityLine: identityLine.value,
      decide: () => {
        throw new Error('a failing step');
      },
    }),
    /a failing step/u,
  );
  for (const port of [SMOKE_MUTEX_PORT, ...SMOKE_SLOT_PORTS]) {
    const probe = net.createServer();
    probe.listen({ host: GATE_SLOT_HOST, port, exclusive: true });
    await new Promise((resolve, reject) => {
      probe.once('listening', resolve);
      probe.once('error', reject);
    });
    await new Promise((resolve) => probe.close(resolve));
  }
}

async function proveTheCommandLineTruthSet(): Promise<void> {
  const help = await runCli(['--help']);
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /Usage:/u);

  const unknown = await runCli(['acquire']);
  assert.notEqual(unknown.status, 0);
  assert.match(unknown.stderr, /Usage:/u);
  assert.doesNotMatch(unknown.stderr, /^\s+at /mu);

  // A harmless payload: were the marker ever ignored, this would still only print a version.
  const nested = await runCli(['run', 'pnpm', '--version'], { [GATE_SLOT_HELD_ENV]: '31918' });
  assert.notEqual(nested.status, 0);
  assert.match(nested.stderr, /31918/u);
  assert.match(nested.stderr, /pnpm --version/u);

  const decoy = await mkdtemp(join(tmpdir(), 'gate-slot-decoy-'));
  try {
    await writeFile(join(decoy, 'pnpm-workspace.yaml'), 'packages: []\n');
    const status = await runCli(['status'], { CLAUDE_PROJECT_DIR: decoy });
    const firstLine = status.stdout.split('\n')[0] ?? '';
    assert.ok(firstLine.endsWith(await realpath(REPO_ROOT)), firstLine);
  } finally {
    await rm(decoy, { recursive: true, force: true });
  }
}

const watchdog = setTimeout(() => {
  process.stderr.write('gate-slot cli smoke: timed out\n');
  process.exit(1);
}, 240_000);
watchdog.unref();

await holdSmokeLock();
await proveNoProbeListenerOutlivesAFailedStep();
await proveTheCommandLineTruthSet();
process.stdout.write('gate-slot cli smoke: 2/2 proofs passed\n');
