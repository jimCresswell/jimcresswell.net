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
 * `pnpm install`. It runs the two steps of agent-tools' build script that
 * produce `dist`, `tsc -p tsconfig.build.json` and the executable-bit chmod,
 * invoking `tsc` directly so the build orchestrator (`turbo`) and the package
 * manager stay out of the install lifecycle (enforced by the
 * `validate-lifecycle-scripts` validator). The build script's third step,
 * `pnpm build:workflows`, verifies the corpus-analysis workflow bundles in
 * memory and writes nothing, so the bootstrap does not run it.
 *
 * agent-tools imports workspace packages (`@engraph/result`, `@engraph/safe-path`,
 * `@engraph/type-helpers`), and every workspace's `eslint.config.ts` except
 * the site's, the plugin's own and `@engraph/workspace-config`'s imports
 * `@engraph/eslint-plugin-standards`; all resolve to built `dist` only — there
 * is no source-pointing export condition. Which packages those are is derived
 * from the workspace manifests at run time (`readInstallTimeClosure`). The
 * `tsup.config.ts` files of those packages import
 * `@engraph/workspace-config/tsup`, also dist-resolved, so the config-base
 * package is part of the same install-time closure. On a fresh checkout
 * (Vercel, CI, a new worktree) `postinstall` runs before any orchestrated
 * build, so this bootstrap first builds that closure — each
 * package's own `tsup` for JS, then agent-tools' compiler with
 * `--emitDeclarationOnly` over the package's `tsconfig.build.json` for types —
 * skipping any dep whose built `dist` is already current for its `src` and
 * build config.
 *
 * The compiler is TypeScript 7, a direct dependency of agent-tools under the
 * npm alias `@typescript/native`. The plain `typescript` name stays on the 6.0
 * compatibility package, because TypeScript 7 does not ship the 6.0 compiler
 * API that typescript-eslint and dependency-cruiser import; the decision and
 * its lift condition live in `docs/engineering/build-system.md` §Dependency
 * updates. The bootstrap needs a development install: `tsx`, which runs it, is
 * a root devDependency, and `tsup` and the type packages the builds read are
 * workspace devDependencies, so a production-only install
 * (`pnpm install --prod`) fails at this `postinstall` before the bootstrap
 * starts. In a development install a compiler or `tsup` that cannot be
 * resolved signals a corrupt install and fails loudly rather than silently
 * leaving the fail-open guards without `dist`. Set
 * `PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP=1` to opt out deliberately.
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

/**
 * Resolve a package's bin through its manifest, exiting loudly with context
 * when the package or the bin entry is missing.
 *
 * Resolves `<package>/package.json` rather than the bin file itself because an
 * `exports` map can hide the bin while still exposing the manifest —
 * TypeScript 7 exports neither `bin/tsc` nor `lib/tsc.js`.
 *
 * @param fromDir - Absolute directory of the workspace package resolving the dependency.
 * @param dependencyName - The dependency's name as that workspace declares it.
 * @param binName - The bin entry to resolve (the package's command name).
 * @returns The absolute path to the bin.
 */
function resolveBinOrExit(fromDir: string, dependencyName: string, binName: string): string {
  const fromRelDir = path.relative(repoRoot, fromDir);
  let manifestPath: string;
  try {
    manifestPath = createRequire(path.join(fromDir, 'package.json')).resolve(
      `${dependencyName}/package.json`,
    );
  } catch {
    writeErrorLine(
      `[bootstrap-agent-tools] cannot resolve "${dependencyName}" from ${fromRelDir} — the install looks incomplete.`,
    );
    writeErrorLine(
      '[bootstrap-agent-tools] Re-run `pnpm install`, or set PRACTICE_SKIP_AGENT_TOOLS_BOOTSTRAP=1 to bypass deliberately.',
    );
    process.exit(1);
  }
  const manifest: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const binPath = binPathFromManifest(path.dirname(manifestPath), manifest, binName);
  if (binPath === undefined) {
    writeErrorLine(
      `[bootstrap-agent-tools] the resolved ${dependencyName} manifest for ${fromRelDir} has no usable "${binName}" bin entry.`,
    );
    writeErrorLine(
      `[bootstrap-agent-tools] Check that ${fromRelDir}/package.json maps ${dependencyName} to the package that ships "${binName}" — a major version can rename its bin.`,
    );
    process.exit(1);
  }
  return binPath;
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
  const tsupBin = resolveBinOrExit(depDir, 'tsup', 'tsup');
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

  const tscBin = resolveBinOrExit(agentToolsDir, '@typescript/native', 'tsc');

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
