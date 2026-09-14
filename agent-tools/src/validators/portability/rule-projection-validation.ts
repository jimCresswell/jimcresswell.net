/**
 * The rule-projection leg of the portability validator: every canonical rule's declaration is
 * read from its frontmatter, the index and the three adapters are rendered from those
 * declarations, and the surfaces are compared byte for byte. `--fix` writes what is missing or
 * drifted and removes what no declaration renders; without it, every difference is an issue
 * naming the cure.
 *
 * The leg refuses, with one issue and no write, whenever it cannot vouch for its input: a
 * declaration that cannot be read (a projection set rendered from a partial declaration set
 * would omit that rule and read as green), a canonical rule, index or projection file that is
 * unreadable (a crash past the leg would leave no refusal on record; an unreadable index read
 * as absent would be written over), a canonical rules directory that is absent, unreadable or
 * empty (acting on "no rules" would delete every projection), a regular file on the canonical
 * surface that is not a rule, and a symlink or special entry on any surface, as the surface,
 * or as one of its ancestors (a write would follow the link out of the projection tree). The
 * three adapter directories and the index are wholly generated outputs, so a regular file on
 * them that no declaration renders, whatever its extension, is stale and `--fix` removes it.
 * The file system is an injected port so the leg is proven over an in-memory tree.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@engraph/result';

import { readRuleDeclaration } from '../../rule-declarations/read-rule-declaration.js';
import {
  renderRuleProjections,
  RULES_INDEX_PATH,
  type RuleProjection,
} from '../../rule-declarations/render-rule-projections.js';
import {
  diffRuleProjections,
  type RuleProjectionDrift,
} from '../../rule-declarations/rule-projection-drift.js';
import type { RuleDeclaration } from '../../rule-declarations/rule-declaration.js';

import type { DirectoryListing, EntryRead } from './directory-listing.js';
import { removeFile, writeText } from './portability-fs.js';
import { listDirectory, readEntry } from './rule-surface-fs.js';

/** The projection surfaces and the extension each carries. */
const PROJECTION_SURFACES = [
  { dir: '.cursor/rules', extension: '.mdc' },
  { dir: '.claude/rules', extension: '.md' },
  { dir: '.agents/rules', extension: '.md' },
] as const;

const CANONICAL_RULES_DIR = '.agent/rules';
const FIX_HINT = 'run `pnpm portability:fix`';
const REFUSING = 'refusing to regenerate the rule projections';

/**
 * The file-system operations the leg needs, all repo-relative; the real `node:fs` by default.
 * Every read is a typed outcome (`directory-listing.ts`), so the leg refuses on what it
 * measures and never catches its way past a failure.
 */
export interface RuleProjectionFs {
  listDirectory: (relDir: string, extension: string) => Promise<DirectoryListing>;
  readEntry: (relPath: string) => Promise<EntryRead>;
  writeText: (relPath: string, text: string) => Promise<void>;
  removeFile: (relPath: string) => Promise<void>;
}

/** The real port over `<repoRoot>`. */
export function realRuleProjectionFs(repoRoot: string): RuleProjectionFs {
  return {
    listDirectory: (relDir, extension) => listDirectory(repoRoot, relDir, extension),
    readEntry: (relPath) => readEntry(repoRoot, relPath),
    writeText: (relPath, text) => writeText(repoRoot, relPath, text, []),
    removeFile: (relPath) => removeFile(repoRoot, relPath),
  };
}

/** What the leg found and, in fix mode, did. */
export interface RuleProjectionValidation {
  readonly issues: readonly string[];
  readonly canonicalRuleCount: number;
  /** Repo-relative paths written in fix mode. */
  readonly written: readonly string[];
  /** Repo-relative stale paths removed in fix mode. */
  readonly removed: readonly string[];
}

/**
 * Validate (and in fix mode regenerate) the rule projections.
 *
 * @param fixMode - Whether to write missing and drifted projections and remove stale ones.
 * @param projectionFs - The file-system port over the repository.
 * @returns The issues found and the paths written or removed.
 */
export async function validateRuleProjections(
  fixMode: boolean,
  projectionFs: RuleProjectionFs,
): Promise<RuleProjectionValidation> {
  const canonical = await readDeclarations(projectionFs);
  const canonicalRuleCount = canonical.canonicalRuleCount;
  if (canonical.issues.length > 0) {
    return { issues: canonical.issues, canonicalRuleCount, written: [], removed: [] };
  }
  const surfaces = await readSurfaces(projectionFs);
  if (!surfaces.ok) {
    return { issues: [surfaces.error], canonicalRuleCount, written: [], removed: [] };
  }
  const expected = renderRuleProjections(canonical.declarations);
  const drift = diffRuleProjections(expected, surfaces.value);
  if (!fixMode) {
    return { issues: driftIssues(drift), canonicalRuleCount, written: [], removed: [] };
  }
  const applied = await applyDrift(expected, drift, projectionFs);
  return { issues: [], canonicalRuleCount, ...applied };
}

async function applyDrift(
  expected: readonly RuleProjection[],
  drift: RuleProjectionDrift,
  projectionFs: RuleProjectionFs,
): Promise<Pick<RuleProjectionValidation, 'written' | 'removed'>> {
  const written: string[] = [];
  const toWrite = new Set([...drift.missing, ...drift.drifted]);
  for (const projection of expected.filter((candidate) => toWrite.has(candidate.path))) {
    await projectionFs.writeText(projection.path, projection.text);
    written.push(projection.path);
  }
  const removed: string[] = [];
  for (const stalePath of drift.stale) {
    await projectionFs.removeFile(stalePath);
    removed.push(stalePath);
  }
  return { written, removed };
}

/**
 * The files a listing yields, or the one issue that refuses the leg. An absent projection
 * surface is empty (a fresh host has none yet) and a stray regular file on it is listed so
 * the drift reads it as stale; the absent canonical directory and a stray on it are refusals.
 */
function filesOf(
  relDir: string,
  listing: DirectoryListing,
  surface: 'projection' | 'canonical',
): Result<readonly string[], string> {
  if (listing.kind === 'files') {
    if (surface === 'projection' || listing.stray.length === 0) {
      return ok([...listing.files, ...listing.stray].sort((a, b) => a.localeCompare(b)));
    }
    const strays = listing.stray.join(', ');
    return err(`${strays}: not a rule; the canonical rules directory admits .md rules only`);
  }
  if (listing.kind === 'absent') {
    return surface === 'projection' ? ok([]) : err(`${relDir}: no such directory; ${REFUSING}`);
  }
  if (listing.kind === 'unreadable') {
    return err(`${relDir}: unreadable (${listing.cause}); ${REFUSING}`);
  }
  return err(`${listing.entry}: not a regular file; the rule surfaces admit regular files only`);
}

/** The text an entry read yields, or the one issue that refuses the leg, naming the path. */
function textOf(relPath: string, read: EntryRead): Result<string, string> {
  if (read.kind === 'text') {
    return ok(read.text);
  }
  if (read.kind === 'absent') {
    return err(`${relPath}: vanished between listing and read; ${REFUSING}`);
  }
  if (read.kind === 'unreadable') {
    return err(`${relPath}: unreadable (${read.cause}); ${REFUSING}`);
  }
  return err(`${relPath}: not a regular file; the rule surfaces admit regular files only`);
}

interface CanonicalRules {
  readonly declarations: readonly RuleDeclaration[];
  readonly issues: readonly string[];
  readonly canonicalRuleCount: number;
}

async function readDeclarations(projectionFs: RuleProjectionFs): Promise<CanonicalRules> {
  const listing = await projectionFs.listDirectory(CANONICAL_RULES_DIR, '.md');
  const files = filesOf(CANONICAL_RULES_DIR, listing, 'canonical');
  if (!files.ok) {
    return { declarations: [], issues: [files.error], canonicalRuleCount: 0 };
  }
  if (files.value.length === 0) {
    const issue = `${CANONICAL_RULES_DIR}: no canonical rules; ${REFUSING} from an empty set`;
    return { declarations: [], issues: [issue], canonicalRuleCount: 0 };
  }
  const declarations: RuleDeclaration[] = [];
  const issues: string[] = [];
  for (const ruleFile of files.value) {
    const text = textOf(ruleFile, await projectionFs.readEntry(ruleFile));
    if (!text.ok) {
      issues.push(text.error);
      continue;
    }
    const declaration = readRuleDeclaration(path.basename(ruleFile, '.md'), text.value);
    if (declaration.ok) {
      declarations.push(declaration.value);
    } else {
      issues.push(`${declaration.error} (declare it in the rule's frontmatter)`);
    }
  }
  return { declarations, issues, canonicalRuleCount: files.value.length };
}

/** Every file currently on the projection surfaces, plus the index when present. */
async function readSurfaces(
  projectionFs: RuleProjectionFs,
): Promise<Result<ReadonlyMap<string, string>, string>> {
  const actual = new Map<string, string>();
  const index = await projectionFs.readEntry(RULES_INDEX_PATH);
  if (index.kind !== 'absent') {
    const text = textOf(RULES_INDEX_PATH, index);
    if (!text.ok) {
      return text;
    }
    actual.set(RULES_INDEX_PATH, text.value);
  }
  for (const surface of PROJECTION_SURFACES) {
    const listing = await projectionFs.listDirectory(surface.dir, surface.extension);
    const files = filesOf(surface.dir, listing, 'projection');
    if (!files.ok) {
      return files;
    }
    for (const file of files.value) {
      const text = textOf(file, await projectionFs.readEntry(file));
      if (!text.ok) {
        return text;
      }
      actual.set(file, text.value);
    }
  }
  return ok(actual);
}

function driftIssues(drift: RuleProjectionDrift): string[] {
  return [
    ...drift.missing.map((file) => `${file}: missing rule projection (${FIX_HINT})`),
    ...drift.drifted.map(
      (file) =>
        `${file}: drifted from the rule's declaration; projections are never hand-edited (${FIX_HINT})`,
    ),
    ...drift.stale.map(
      (file) => `${file}: no canonical rule renders it (${FIX_HINT} to remove it)`,
    ),
  ];
}
