/**
 * The sweep: derive every canonical rule's declaration from the hand-kept sources and write
 * it as the rule's frontmatter.
 *
 * Derivation is all-or-nothing: a rule whose sources cannot be read or are missing, or that
 * has no index row, refuses the whole sweep and nothing is written. Writing then proceeds
 * file by file, so a write error part-way leaves some rules written and the rest not; git
 * shows exactly which, and a re-run finishes the rest because a rule that already carries a
 * frontmatter block is left as it is and reported. The same property lets the sweep run again
 * for rules that arrive after the first pass. The file system is an injected port so the
 * sweep is proven over an in-memory tree.
 *
 * This is a transplant instrument as much as a one-off: any host that arrives with a
 * hand-kept rules index and hand-kept triggers runs the same sweep to mint its declarations.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@engraph/result';

import { isEnoent } from '../core/authored-surfaces.js';

import { FRONTMATTER_FENCE_LINE } from './frontmatter-lines.js';
import { parseClaudeRuleAdapterPaths } from './parse-claude-rule-adapter.js';
import { parseCursorTrigger } from './parse-cursor-trigger.js';
import { parseRulesIndex, type RulesIndexRow } from './parse-rules-index.js';
import { readRuleDeclaration } from './read-rule-declaration.js';
import { reconcileRuleDeclaration, type Reconciliation } from './reconcile-rule-declaration.js';
import { prependRuleFrontmatter, renderRuleFrontmatter } from './render-rule-frontmatter.js';
import type { RuleDeclaration } from './rule-declaration.js';

/** The file-system operations the sweep needs; the real `node:fs` by default. */
export interface SweepFs {
  readFile: (absolutePath: string) => Promise<string>;
  writeFile: (absolutePath: string, text: string) => Promise<void>;
}

/** What to sweep. */
export interface SweepInput {
  /** Absolute path of the repository root. */
  readonly repoRoot: string;
  /** Rule basenames without `.md`, normally every tracked file under `.agent/rules/`. */
  readonly ruleNames: readonly string[];
  /** Write the blocks; `false` is a dry run that only reports. */
  readonly write: boolean;
}

/** What the sweep found and did. */
export interface SweepOutcome {
  readonly declarations: readonly RuleDeclaration[];
  readonly reconciliations: readonly Reconciliation[];
  /** Repo-relative rule files written, in order; empty on a dry run or a refusal. */
  readonly written: readonly string[];
  /** Repo-relative rule files left alone because they already carry a block. */
  readonly alreadyDeclared: readonly string[];
  /** Reasons the sweep refused; non-empty means nothing was written. */
  readonly refused: readonly string[];
}

const RULES_INDEX = 'RULES_INDEX.md';
const FRONTMATTER_OPENING = `${FRONTMATTER_FENCE_LINE}\n`;

const defaultSweepFs: SweepFs = {
  readFile: (absolutePath) => fs.readFile(absolutePath, 'utf8'),
  writeFile: (absolutePath, text) => fs.writeFile(absolutePath, text, 'utf8'),
};

/**
 * Run the sweep.
 *
 * @param input - The repository root, the rules to sweep, and whether to write.
 * @param sweepFs - File-system port; defaults to `node:fs/promises`.
 * @returns The declarations, the reconciliations, what was written, and any refusals.
 */
export async function sweepRuleFrontmatter(
  input: SweepInput,
  sweepFs: SweepFs = defaultSweepFs,
): Promise<SweepOutcome> {
  const indexText = await readSource(input.repoRoot, RULES_INDEX, sweepFs);
  const index = indexText.ok ? parseRulesIndex(indexText.value) : indexText;
  if (!index.ok) {
    return {
      declarations: [],
      reconciliations: [],
      written: [],
      alreadyDeclared: [],
      refused: [index.error],
    };
  }
  const derived = await deriveAll(input, index.value, sweepFs);
  if (derived.refused.length > 0 || !input.write) {
    return { ...derived, written: [] };
  }
  const written: string[] = [];
  for (const file of derived.files) {
    await sweepFs.writeFile(path.join(input.repoRoot, file.relativePath), file.text);
    written.push(file.relativePath);
  }
  return { ...derived, written };
}

interface SweptFile {
  readonly relativePath: string;
  readonly text: string;
}

interface Derived {
  readonly declarations: readonly RuleDeclaration[];
  readonly reconciliations: readonly Reconciliation[];
  readonly alreadyDeclared: readonly string[];
  readonly refused: readonly string[];
  readonly files: readonly SweptFile[];
}

async function deriveAll(
  input: SweepInput,
  index: ReadonlyMap<string, RulesIndexRow>,
  sweepFs: SweepFs,
): Promise<Derived> {
  const declarations: RuleDeclaration[] = [];
  const reconciliations: Reconciliation[] = [];
  const alreadyDeclared: string[] = [];
  const refused: string[] = [];
  const files: SweptFile[] = [];
  for (const name of input.ruleNames) {
    const step = await sweepOne(input.repoRoot, name, index, sweepFs);
    if (step.kind === 'already-declared') {
      alreadyDeclared.push(step.rulePath);
    } else if (step.kind === 'refused') {
      refused.push(step.reason);
    } else {
      declarations.push(step.rule.declaration);
      reconciliations.push(...step.rule.reconciliations);
      files.push(step.rule.file);
    }
  }
  return { declarations, reconciliations, alreadyDeclared, refused, files };
}

type SweepStep =
  | { readonly kind: 'already-declared'; readonly rulePath: string }
  | { readonly kind: 'refused'; readonly reason: string }
  | { readonly kind: 'derived'; readonly rule: DerivedRule };

/**
 * Read one rule and classify it: already declared, refused, or derived. A leading frontmatter
 * block counts as a declaration only when it reads as one; any other block is refused, never
 * skipped, so a host whose rules carry unrelated frontmatter cannot pass as already swept.
 */
async function sweepOne(
  repoRoot: string,
  name: string,
  index: ReadonlyMap<string, RulesIndexRow>,
  sweepFs: SweepFs,
): Promise<SweepStep> {
  const rulePath = `.agent/rules/${name}.md`;
  const ruleText = await readSource(repoRoot, rulePath, sweepFs);
  if (!ruleText.ok) {
    return { kind: 'refused', reason: ruleText.error };
  }
  if (ruleText.value.startsWith(FRONTMATTER_OPENING)) {
    const existing = readRuleDeclaration(name, ruleText.value);
    return existing.ok
      ? { kind: 'already-declared', rulePath }
      : { kind: 'refused', reason: `${existing.error} (a block that is not a declaration)` };
  }
  const row = index.get(name);
  if (row === undefined) {
    return { kind: 'refused', reason: `${rulePath}: no row in ${RULES_INDEX}` };
  }
  const one = await deriveOne(repoRoot, name, row, ruleText.value, sweepFs);
  return one.ok ? { kind: 'derived', rule: one.value } : { kind: 'refused', reason: one.error };
}

interface DerivedRule {
  readonly declaration: RuleDeclaration;
  readonly reconciliations: readonly Reconciliation[];
  readonly file: SweptFile;
}

async function deriveOne(
  repoRoot: string,
  name: string,
  row: RulesIndexRow,
  ruleText: string,
  sweepFs: SweepFs,
): Promise<Result<DerivedRule, string>> {
  const triggerPath = `.cursor/rules/${name}.mdc`;
  const triggerText = await readSource(repoRoot, triggerPath, sweepFs);
  if (!triggerText.ok) {
    return triggerText;
  }
  const cursor = parseCursorTrigger(triggerText.value);
  if (!cursor.ok) {
    return err(`${triggerPath}: ${cursor.error}`);
  }
  const adapterPath = `.claude/rules/${name}.md`;
  const adapterText = await readSource(repoRoot, adapterPath, sweepFs);
  if (!adapterText.ok) {
    return adapterText;
  }
  const claude = parseClaudeRuleAdapterPaths(adapterText.value);
  if (!claude.ok) {
    return err(`${adapterPath}: ${claude.error}`);
  }
  const reconciled = reconcileRuleDeclaration({
    name,
    index: row,
    cursor: cursor.value,
    claudePaths: claude.value,
  });
  const rulePath = `.agent/rules/${name}.md`;
  const swept = prependRuleFrontmatter(ruleText, renderRuleFrontmatter(reconciled.declaration));
  if (!swept.ok) {
    return err(`${rulePath}: ${swept.error}`);
  }
  return ok({ ...reconciled, file: { relativePath: rulePath, text: swept.value } });
}

/**
 * Read a source file; a missing file is a refusal naming the path, and any other read failure
 * is a refusal naming the path and the cause, never a crash past the all-or-nothing contract.
 */
async function readSource(
  repoRoot: string,
  relativePath: string,
  sweepFs: SweepFs,
): Promise<Result<string, string>> {
  try {
    return ok(await sweepFs.readFile(path.join(repoRoot, relativePath)));
  } catch (error: unknown) {
    if (isEnoent(error)) {
      return err(`${relativePath}: missing`);
    }
    const cause = error instanceof Error ? error.message : String(error);
    return err(`${relativePath}: unreadable (${cause})`);
  }
}
