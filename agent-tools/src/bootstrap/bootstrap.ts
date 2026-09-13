import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeLine, writeErrorLine } from '../core/terminal-output.js';

import { productionWorkspaceDepFsIo } from './bootstrap-helpers-io.js';
import { installTimeClosure } from './install-time-closure.js';
import {
  packageName,
  workspaceManifestInputs,
  workspacePatterns,
} from './install-time-closure-io.js';
import {
  binPathFromManifest,
  interpretSpawnOutcome,
  interpretTscOutcome,
  workspaceDepDistIsStale,
} from './bootstrap-helpers.js';

/**
 * Install-time bootstrap, run by the root `postinstall` via `tsx`.
 *
 * Builds `@engraph/agent-tools` `dist` so the repo's PreToolUse guards
 * (`.claude/settings.json`) and agent CLIs are available immediately after
 * `pnpm install`. It reproduces agent-tools' own build script
 * (`tsc -p tsconfig.build.json` + the executable-bit chmod) by invoking `tsc`
 * directly, so the build orchestrator (`turbo`) and the package manager stay
 * out of the install lifecycle — enforced by the `validate-lifecycle-scripts`
 * validator.
 *
 * agent-tools imports workspace packages (`@engraph/result`, `@engraph/safe-path`,
 * `@engraph/type-helpers`), and every workspace's `eslint.config.ts` imports
 * `@engraph/eslint-plugin-standards`; all resolve to built `dist` only — there
 * is no source-pointing export condition. Which packages those are is derived
 * from the workspace manifests at run time (`readInstallTimeClosure`). Their `tsup.config.ts` files in turn import
 * `@engraph/workspace-config/tsup`, also dist-resolved, so the config-base
 * package is part of the same install-time closure. On a fresh checkout
 * (Vercel, CI, a new worktree) `postinstall` runs before any orchestrated
 * build, so this bootstrap first builds that closure with each package's own
 * toolchain (`tsup` for JS, `tsc --emitDeclarationOnly` for types), skipping
 * any dep whose built `dist` is already current for its `src`.
 *
 * `typescript` is a direct dependency of agent-tools, so it is present in dev
 * and `--prod` installs alike; a missing compiler therefore signals a corrupt
 * install and fails loudly rather than silently leaving the fail-open guards
 * without `dist`. Set `PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP=1` to opt out deliberately.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);
const agentToolsDir = path.join(repoRoot, 'agent-tools');

/** One install-time build target: its directory and the dist artifacts witnessing a completed build. */
interface WorkspaceDep {
  /** Repo-relative directory of the workspace package. */
  readonly dir: string;
  /** Witness artifact names under `dist/` — one bundler output, one declaration output. */
  readonly distArtifacts: readonly string[];
}

/**
 * The workspace packages built before agent-tools, derived from the workspace
 * manifests: every package whose exports resolve only to built `dist`, in
 * workspace-dependency order (`install-time-closure.ts`). Computed, never
 * kept: a hand-kept list here missed the ESLint plugin every config file
 * imports, and a cold CI checkout failed while warm local builds masked it
 * (PR #53, 2026-09-13; the lineage met the same class in two earlier pull
 * requests). The package running this bootstrap is excluded — its own tsc
 * build follows the closure.
 */
function readInstallTimeClosure(): readonly WorkspaceDep[] {
  const inputs = workspaceManifestInputs(repoRoot, workspacePatterns(repoRoot));
  const closure = installTimeClosure(inputs, { exclude: [packageName(agentToolsDir)] });
  if (!closure.ok) {
    writeErrorLine(
      `[bootstrap-agent-tools] cannot derive the install-time closure: ${closure.error}`,
    );
    process.exit(1);
  }
  return closure.deps.map((dep) => ({ dir: dep.dir, distArtifacts: dep.distArtifacts }));
}

/** Set the executable bit on every compiled CLI entry, mirroring the build script. */
function markExecutableArtifacts(): void {
  const binDir = path.join(agentToolsDir, 'dist', 'src', 'bin');
  if (existsSync(binDir)) {
    for (const entry of readdirSync(binDir)) {
      if (entry.endsWith('.js')) {
        chmodSync(path.join(binDir, entry), 0o755);
      }
    }
  }
  const statuslinePath = path.join(
    agentToolsDir,
    'dist',
    'src',
    'claude',
    'statusline-identity.js',
  );
  if (existsSync(statuslinePath)) {
    chmodSync(statuslinePath, 0o755);
  }
}

/** Run one build step under the current node binary, exiting loudly on failure. */
function runStep(label: string, binPath: string, args: readonly string[], cwd: string): void {
  const result = spawnSync(process.execPath, [binPath, ...args], { cwd, stdio: 'inherit' });
  const verdict = interpretSpawnOutcome(label, {
    error: result.error,
    signal: result.signal,
    status: result.status,
  });
  if (verdict.failed) {
    const reason = verdict.reason ?? `${label} failed`;
    writeErrorLine(`[bootstrap-agent-tools] ${reason}`);
    process.exit(verdict.exitCode);
  }
}

/**
 * Build one workspace dep with its own toolchain (tsup JS + tsc declarations),
 * unless its built `dist` is already current for the present `src`.
 *
 * Rebuilds on staleness, not mere absence: a warm checkout that pulls new leaf
 * source over an old `dist` must rebuild, or agent-tools' own `tsc` fails
 * against the stale `.d.ts` and bricks the fail-open guards (MCP-472). See
 * {@link workspaceDepDistIsStale}.
 */
function buildWorkspaceDep(dep: WorkspaceDep, tscBin: string): void {
  const depRelDir = dep.dir;
  const depDir = path.join(repoRoot, depRelDir);
  const depName = path.basename(depRelDir);
  if (!workspaceDepDistIsStale(depDir, dep.distArtifacts, productionWorkspaceDepFsIo)) {
    return;
  }
  const depRequire = createRequire(path.join(depDir, 'package.json'));
  let tsupManifestPath: string;
  try {
    tsupManifestPath = depRequire.resolve('tsup/package.json');
  } catch {
    writeErrorLine(
      `[bootstrap-agent-tools] cannot resolve "tsup" from ${depRelDir} — the install looks incomplete.`,
    );
    process.exit(1);
  }
  const tsupManifest: unknown = JSON.parse(readFileSync(tsupManifestPath, 'utf8'));
  const tsupBin = binPathFromManifest(path.dirname(tsupManifestPath), tsupManifest, 'tsup');
  if (tsupBin === undefined) {
    writeErrorLine(
      `[bootstrap-agent-tools] the resolved tsup manifest for ${depRelDir} has no usable bin entry.`,
    );
    process.exit(1);
  }
  runStep(`tsup (${depName})`, tsupBin, [], depDir);
  runStep(
    `tsc declarations (${depName})`,
    tscBin,
    ['--emitDeclarationOnly', '--project', path.join(depDir, 'tsconfig.build.json')],
    depDir,
  );
  writeLine(`[bootstrap-agent-tools] built ${depRelDir}/dist`);
}

function main(): void {
  if (process.env.PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP === '1') {
    writeLine('[bootstrap-agent-tools] skipped (PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP=1)');
    return;
  }

  let tscBin: string;
  try {
    tscBin = createRequire(path.join(agentToolsDir, 'package.json')).resolve('typescript/bin/tsc');
  } catch {
    writeErrorLine(
      '[bootstrap-agent-tools] cannot resolve "typescript" from agent-tools — the install looks incomplete.',
    );
    writeErrorLine(
      '[bootstrap-agent-tools] Re-run `pnpm install`, or set PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP=1 to bypass deliberately.',
    );
    process.exit(1);
  }

  for (const dep of readInstallTimeClosure()) {
    buildWorkspaceDep(dep, tscBin);
  }

  const result = spawnSync(
    process.execPath,
    [tscBin, '-p', path.join(agentToolsDir, 'tsconfig.build.json')],
    { cwd: agentToolsDir, stdio: 'inherit' },
  );
  const verdict = interpretTscOutcome({
    error: result.error,
    signal: result.signal,
    status: result.status,
  });
  if (verdict.failed) {
    writeErrorLine(`[bootstrap-agent-tools] ${verdict.reason ?? 'tsc build failed'}`);
    process.exit(verdict.exitCode);
  }

  markExecutableArtifacts();
  writeLine('[bootstrap-agent-tools] built agent-tools/dist');
}

main();
