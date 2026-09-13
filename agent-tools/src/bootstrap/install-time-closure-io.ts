/**
 * Read the workspace for the install-time closure: the `packages` patterns
 * `pnpm-workspace.yaml` declares, each workspace directory's manifest, and
 * the name of the package running the bootstrap.
 *
 * Runs before any workspace package is built, so it uses `node:fs`, `yaml`
 * (an external dependency) and nothing from the workspace. The pure
 * derivation is `install-time-closure.ts`.
 *
 * @packageDocumentation
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { parse as parseYaml } from 'yaml';

import { type WorkspaceManifestInput } from './install-time-closure.js';

/** The `packages` patterns `pnpm-workspace.yaml` declares; empty when the field is absent. */
export function workspacePatterns(repoRoot: string): readonly string[] {
  const manifest: unknown = parseYaml(
    readFileSync(path.join(repoRoot, 'pnpm-workspace.yaml'), 'utf8'),
  );
  if (typeof manifest !== 'object' || manifest === null || !('packages' in manifest)) {
    return [];
  }
  const packages: unknown = manifest.packages;
  return Array.isArray(packages)
    ? packages.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

/** Every workspace directory with a manifest, paired with the parsed manifest. */
export function workspaceManifestInputs(
  repoRoot: string,
  patterns: readonly string[],
): readonly WorkspaceManifestInput[] {
  const inputs: WorkspaceManifestInput[] = [];
  for (const dir of patterns.flatMap((pattern) => expandWorkspacePattern(repoRoot, pattern))) {
    const manifestPath = path.join(repoRoot, dir, 'package.json');
    if (existsSync(manifestPath)) {
      const manifest: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'));
      inputs.push({ dir, manifest });
    }
  }
  return inputs;
}

/** The `name` of the manifest at `packageDir`, or the empty string when it declares none. */
export function packageName(packageDir: string): string {
  const manifest: unknown = JSON.parse(readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  return typeof manifest === 'object' &&
    manifest !== null &&
    'name' in manifest &&
    typeof manifest.name === 'string'
    ? manifest.name
    : '';
}

/** Expand one `pnpm-workspace.yaml` pattern: a plain directory, or `<dir>/*` for its immediate children. */
function expandWorkspacePattern(repoRoot: string, pattern: string): readonly string[] {
  if (!pattern.endsWith('/*')) {
    return [pattern];
  }
  const parent = pattern.slice(0, -2);
  const parentAbsolute = path.join(repoRoot, parent);
  if (!existsSync(parentAbsolute)) {
    return [];
  }
  return readdirSync(parentAbsolute, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${parent}/${entry.name}`);
}
