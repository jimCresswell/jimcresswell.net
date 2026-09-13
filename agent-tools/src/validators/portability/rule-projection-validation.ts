/**
 * The rule-projection leg of the portability validator: every canonical rule's declaration is
 * read from its frontmatter, the index and the three adapters are rendered from those
 * declarations, and the surfaces are compared byte for byte. `--fix` writes what is missing or
 * drifted and removes what no declaration renders; without it, every difference is an issue
 * naming the cure.
 *
 * A declaration that cannot be read refuses the whole leg: a projection set rendered from a
 * partial declaration set would omit the rule the estate could not vouch for and read as
 * green. The file system is an injected port so the leg is proven over an in-memory tree.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { readRuleDeclaration } from '../../rule-declarations/read-rule-declaration.js';
import {
  renderRuleProjections,
  RULES_INDEX_PATH,
} from '../../rule-declarations/render-rule-projections.js';
import { diffRuleProjections } from '../../rule-declarations/rule-projection-drift.js';
import type { RuleDeclaration } from '../../rule-declarations/rule-declaration.js';

import { listFiles, readOptionalText, readText, removeFile, writeText } from './portability-fs.js';

/** The projection surfaces and the extension each carries. */
const PROJECTION_SURFACES = [
  { dir: '.cursor/rules', extension: '.mdc' },
  { dir: '.claude/rules', extension: '.md' },
  { dir: '.agents/rules', extension: '.md' },
] as const;

const CANONICAL_RULES_DIR = '.agent/rules';
const FIX_HINT = 'run `pnpm portability:fix`';

/** The file-system operations the leg needs, all repo-relative; the real `node:fs` by default. */
export interface RuleProjectionFs {
  listFiles: (relDir: string, extension: string) => Promise<readonly string[]>;
  readText: (relPath: string) => Promise<string>;
  readOptionalText: (relPath: string) => Promise<string | undefined>;
  writeText: (relPath: string, text: string) => Promise<void>;
  removeFile: (relPath: string) => Promise<void>;
}

/** The real port over `<repoRoot>`. */
export function realRuleProjectionFs(repoRoot: string): RuleProjectionFs {
  return {
    listFiles: (relDir, extension) => listFiles(repoRoot, relDir, extension),
    readText: (relPath) => readText(repoRoot, relPath),
    readOptionalText: async (relPath) => {
      const state = await readOptionalText(repoRoot, relPath);
      return state.isPresent && state.value !== null ? state.value : undefined;
    },
    writeText: (relPath, text) => writeText(repoRoot, relPath, text, []),
    removeFile: (relPath) => removeFile(repoRoot, relPath, []),
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
  const canonicalRules = await projectionFs.listFiles(CANONICAL_RULES_DIR, '.md');
  const declarations = await readDeclarations(canonicalRules, projectionFs);
  const canonicalRuleCount = canonicalRules.length;
  if (declarations.issues.length > 0) {
    return { issues: declarations.issues, canonicalRuleCount, written: [], removed: [] };
  }
  const expected = renderRuleProjections(declarations.value);
  const drift = diffRuleProjections(expected, await readSurfaces(projectionFs));
  if (!fixMode) {
    return { issues: driftIssues(drift), canonicalRuleCount, written: [], removed: [] };
  }
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
  return { issues: [], canonicalRuleCount, written, removed };
}

interface ReadDeclarations {
  readonly value: readonly RuleDeclaration[];
  readonly issues: readonly string[];
}

async function readDeclarations(
  canonicalRules: readonly string[],
  projectionFs: RuleProjectionFs,
): Promise<ReadDeclarations> {
  const value: RuleDeclaration[] = [];
  const issues: string[] = [];
  for (const ruleFile of canonicalRules) {
    const name = path.basename(ruleFile, '.md');
    const declaration = readRuleDeclaration(name, await projectionFs.readText(ruleFile));
    if (declaration.ok) {
      value.push(declaration.value);
    } else {
      issues.push(`${declaration.error} (declare it in the rule's frontmatter)`);
    }
  }
  return { value, issues };
}

/** Every file currently on the projection surfaces, plus the index when present. */
async function readSurfaces(projectionFs: RuleProjectionFs): Promise<ReadonlyMap<string, string>> {
  const actual = new Map<string, string>();
  const index = await projectionFs.readOptionalText(RULES_INDEX_PATH);
  if (index !== undefined) {
    actual.set(RULES_INDEX_PATH, index);
  }
  for (const surface of PROJECTION_SURFACES) {
    for (const file of await projectionFs.listFiles(surface.dir, surface.extension)) {
      actual.set(file, await projectionFs.readText(file));
    }
  }
  return actual;
}

function driftIssues(drift: ReturnType<typeof diffRuleProjections>): string[] {
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
