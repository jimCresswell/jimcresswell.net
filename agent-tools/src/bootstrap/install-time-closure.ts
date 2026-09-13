/**
 * Derive the install-time build closure from the workspace manifests.
 *
 * A workspace package belongs to the closure when its `exports` (and `main`
 * and `types`, where declared) resolve only to built output under `dist/`:
 * nothing can import it on a cold checkout until it is built. The closure is
 * ordered by workspace dependencies so each package's own build (whose
 * `tsup.config.ts` may import a sibling) finds what it needs. The package
 * running the bootstrap is excluded — it is built by its own compiler after
 * the closure.
 *
 * The list is computed, never kept (`compute-dont-hope`): a hand-kept closure
 * missed the ESLint plugin every config file imports and a cold CI checkout
 * failed dependency-cruise while warm local builds masked it (PR #53,
 * 2026-09-13); the lineage had met the same class twice before.
 *
 * This module runs BEFORE any workspace package is built, so it imports none
 * of them: the verdict is a local discriminated union rather than
 * `@engraph/result`, and record iteration is a local helper rather than
 * `@engraph/type-helpers`. Pure: manifests in, ordered closure out. The
 * reader that walks the workspace lives in `bootstrap.ts`.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

/** One workspace package: its repo-relative directory and its parsed `package.json`. */
export interface WorkspaceManifestInput {
  readonly dir: string;
  readonly manifest: unknown;
}

/** One closure member in build order, with the artefacts that witness a completed build. */
interface InstallTimeDep {
  readonly dir: string;
  readonly name: string;
  /** Paths under `dist/` that the package's exports resolve to. */
  readonly distArtifacts: readonly string[];
}

/** The derivation's outcome; a local shape because `@engraph/result` is itself in the closure. */
export type InstallTimeClosureVerdict =
  | { readonly ok: true; readonly deps: readonly InstallTimeDep[] }
  | { readonly ok: false; readonly error: string };

/** An `exports` value: a target string, or a nested condition map or array of them. */
type ExportValue = string | readonly ExportValue[] | { readonly [key: string]: ExportValue };

const ExportValueSchema: z.ZodType<ExportValue> = z.lazy(() =>
  z.union([z.string(), z.array(ExportValueSchema), z.record(z.string(), ExportValueSchema)]),
);

/** The `package.json` fields the derivation reads; everything else is ignored. */
const ManifestSchema = z.object({
  name: z.string().min(1),
  main: z.string().optional(),
  types: z.string().optional(),
  exports: ExportValueSchema.optional(),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
  peerDependencies: z.record(z.string(), z.string()).optional(),
});

type Manifest = z.infer<typeof ManifestSchema>;

const DIST_PREFIX = './dist/';

/**
 * Compute the closure.
 *
 * @param inputs - Every workspace package's directory and parsed manifest.
 * @param options - `exclude`: package names built by other means (the
 * bootstrap's own package).
 * @returns The closure in build order, or an error naming an unreadable
 * manifest or a dependency cycle.
 *
 * @example
 * ```ts
 * installTimeClosure(
 *   [{ dir: 'tooling/result', manifest: { name: '@engraph/result', exports: { '.': { import: './dist/index.js' } } } }],
 *   { exclude: ['@engraph/agent-tools'] },
 * );
 * // { ok: true, deps: [{ dir: 'tooling/result', name: '@engraph/result', distArtifacts: ['index.js'] }] }
 * ```
 */
export function installTimeClosure(
  inputs: readonly WorkspaceManifestInput[],
  options: { readonly exclude: readonly string[] },
): InstallTimeClosureVerdict {
  const parsed: { dir: string; manifest: Manifest }[] = [];
  for (const input of inputs) {
    const result = ManifestSchema.safeParse(input.manifest);
    if (!result.success) {
      return {
        ok: false,
        error: `${input.dir}/package.json is not a readable manifest: ${result.error.message}`,
      };
    }
    parsed.push({ dir: input.dir, manifest: result.data });
  }

  const excluded = new Set(options.exclude);
  const members = new Map<string, InstallTimeDep>();
  for (const { dir, manifest } of parsed) {
    if (excluded.has(manifest.name)) {
      continue;
    }
    const artifacts = distArtifacts(manifest);
    if (artifacts !== undefined) {
      members.set(manifest.name, { dir, name: manifest.name, distArtifacts: artifacts });
    }
  }

  const edges = new Map<string, readonly string[]>();
  for (const { manifest } of parsed) {
    if (members.has(manifest.name)) {
      edges.set(
        manifest.name,
        workspaceDependencies(manifest).filter((name) => members.has(name)),
      );
    }
  }
  return topologicalOrder(members, edges);
}

/**
 * The artefacts under `dist/` the manifest's entry points resolve to, or
 * `undefined` when the package is not dist-only (no entry points, or an
 * entry point that resolves to source).
 */
function distArtifacts(manifest: Manifest): readonly string[] | undefined {
  const targets = [
    ...(manifest.exports === undefined ? [] : exportTargets(manifest.exports)),
    ...(manifest.main === undefined ? [] : [manifest.main]),
    ...(manifest.types === undefined ? [] : [manifest.types]),
  ];
  if (targets.length === 0 || targets.some((target) => !target.startsWith(DIST_PREFIX))) {
    return undefined;
  }
  return [...new Set(targets.map((target) => target.slice(DIST_PREFIX.length)))];
}

/** Every target string of an `exports` value, whatever its nesting. */
function exportTargets(value: ExportValue): readonly string[] {
  if (typeof value === 'string') {
    return [value];
  }
  if (isExportArray(value)) {
    return value.flatMap((item) => exportTargets(item));
  }
  return recordEntries(value).flatMap(([, nested]) => exportTargets(nested));
}

function isExportArray(value: ExportValue): value is readonly ExportValue[] {
  return Array.isArray(value);
}

function workspaceDependencies(manifest: Manifest): readonly string[] {
  const declared = [
    ...recordEntries(manifest.dependencies ?? {}),
    ...recordEntries(manifest.devDependencies ?? {}),
    ...recordEntries(manifest.peerDependencies ?? {}),
  ];
  return [
    ...new Set(
      declared.filter(([, range]) => range.startsWith('workspace:')).map(([name]) => name),
    ),
  ];
}

/**
 * Typed own-entry iteration over a zod-validated record. A local copy of the
 * shape `@engraph/type-helpers` exports, because that package is in the
 * closure this module computes and cannot be imported before it is built.
 */
function recordEntries<T>(record: Readonly<Record<string, T>>): readonly (readonly [string, T])[] {
  const entries: (readonly [string, T])[] = [];
  for (const key in record) {
    const value = record[key];
    if (value !== undefined) {
      entries.push([key, value]);
    }
  }
  return entries;
}

/** Kahn's algorithm over the closure; input order breaks ties so the result is stable. */
function topologicalOrder(
  members: ReadonlyMap<string, InstallTimeDep>,
  edges: ReadonlyMap<string, readonly string[]>,
): InstallTimeClosureVerdict {
  const remaining = new Map([...edges].map(([name, deps]) => [name, new Set(deps)]));
  const ordered: InstallTimeDep[] = [];
  while (remaining.size > 0) {
    const ready = [...remaining].filter(([, deps]) => deps.size === 0).map(([name]) => name);
    if (ready.length === 0) {
      const names = [...remaining.keys()].sort((a, b) => a.localeCompare(b)).join(', ');
      return { ok: false, error: `workspace dependency cycle among: ${names}` };
    }
    for (const name of ready) {
      const member = members.get(name);
      if (member !== undefined) {
        ordered.push(member);
      }
      remaining.delete(name);
      for (const deps of remaining.values()) {
        deps.delete(name);
      }
    }
  }
  return { ok: true, deps: ordered };
}
