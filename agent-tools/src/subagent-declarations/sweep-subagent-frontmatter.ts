/**
 * The sweep: derive every template's declaration from its hand-kept adapters and write it
 * as the template's frontmatter.
 *
 * All-or-nothing derivation: an adapter that is not a regular file or cannot be read, a
 * template whose head cannot be read, an adapter whose `name` field is not its basename, an
 * adapter name under no template or whose pointer names another template, a template with
 * no adapter on any platform or with adapters under both its own and variant names, refuses
 * the whole sweep and nothing is written. Writing then proceeds template by template through
 * the atomic writer; a template that already carries a block is left as it is and reported,
 * once its adapter group is checked against the shape it declares (`adapter-groups.ts`). The
 * file system is an injected port (`sweep-fs.ts`, shared with the rules sweep), so the sweep
 * is proven over an in-memory tree.
 *
 * Adapter discovery is the caller's (the tracked-file listing): every adapter basename on
 * the three surfaces is either a template's own name (a role) or `<template>-<suffix>` for
 * the longest such template (a variant of that fan-out); a name matching neither refuses.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@engraph/result';

import { defaultSweepFs, readSource, type SweepFs } from '../rule-declarations/sweep-fs.js';

import { declaredShapeIssue, groupByTemplate, groupShape } from './adapter-groups.js';
import {
  readCodexAdapter,
  readMarkdownAdapter,
  type AdapterSource,
  type SourcePlatform,
} from './adapter-sources.js';
import { deriveRole } from './derive-role.js';
import type { AdapterSet, Derived, Reconciliation } from './derive-subagent-declaration.js';
import { deriveFanOut } from './derive-variant.js';
import { readSubagentDeclaration } from './read-subagent-declaration.js';
import {
  prependSubagentFrontmatter,
  renderSubagentFrontmatter,
} from './render-subagent-frontmatter.js';
import type { SubagentDeclaration } from './subagent-declaration.js';

export const TEMPLATES_DIR = '.agent/sub-agents/templates';

/** One hand-kept platform surface: where its adapters live and how each is read. */
export interface AdapterSurface {
  readonly platform: SourcePlatform;
  readonly dir: string;
  readonly extension: string;
  readonly read: (relativePath: string, text: string) => Result<AdapterSource, string>;
}

/** Where each hand-kept platform keeps its adapters and how each is read. */
export const ADAPTER_SURFACES: readonly AdapterSurface[] = [
  { platform: 'cursor', dir: '.cursor/agents', extension: '.md', read: readMarkdownAdapter },
  { platform: 'claude', dir: '.claude/agents', extension: '.md', read: readMarkdownAdapter },
  { platform: 'codex', dir: '.codex/agents', extension: '.toml', read: readCodexAdapter },
];

export interface SweepInput {
  readonly repoRoot: string;
  /** Template basenames without `.md`, from the tracked-file listing. */
  readonly templateNames: readonly string[];
  /** Adapter basenames without extension per platform, from the tracked-file listing. */
  readonly adapterNames: Readonly<Record<SourcePlatform, readonly string[]>>;
  readonly write: boolean;
  readonly sweepFs?: SweepFs;
}

export interface SweepOutcome {
  readonly refused: readonly string[];
  readonly declarations: readonly SubagentDeclaration[];
  readonly reconciliations: readonly Reconciliation[];
  readonly alreadyDeclared: readonly string[];
  readonly written: readonly string[];
}

function refusal(refused: readonly string[], alreadyDeclared: readonly string[]): SweepOutcome {
  return { refused, declarations: [], reconciliations: [], alreadyDeclared, written: [] };
}

interface Heads {
  /** Undeclared templates and their text. */
  readonly undeclared: Map<string, string>;
  /** Declared templates and the kind each declares, in template order. */
  readonly declared: Map<string, SubagentDeclaration['kind']>;
  readonly refused: string[];
}

async function readHeads(input: SweepInput, sweepFs: SweepFs): Promise<Heads> {
  const heads: Heads = { undeclared: new Map(), declared: new Map(), refused: [] };
  for (const name of input.templateNames) {
    const text = await readSource(input.repoRoot, `${TEMPLATES_DIR}/${name}.md`, sweepFs);
    const head = text.ok ? readSubagentDeclaration(name, text.value) : text;
    if (!head.ok) {
      heads.refused.push(head.error);
    } else if (head.value.kind === 'declared') {
      heads.declared.set(name, head.value.declaration.kind);
    } else if (text.ok) {
      heads.undeclared.set(name, text.value);
    }
  }
  return heads;
}

/** The refusal for an adapter whose `name` field is not the basename it is filed under. */
function nameIssue(relativePath: string, name: string, source: AdapterSource): string | undefined {
  const declared = source.fields.get('name');
  if (declared === name) {
    return undefined;
  }
  return declared === undefined
    ? `${relativePath}: no name field`
    : `${relativePath}: name "${declared}" is not the basename "${name}"`;
}

async function readAdapterSets(
  input: SweepInput,
  sweepFs: SweepFs,
): Promise<Result<Map<string, AdapterSet>, string[]>> {
  const sets = new Map<string, AdapterSet>();
  const refused: string[] = [];
  for (const surface of ADAPTER_SURFACES) {
    for (const name of input.adapterNames[surface.platform]) {
      const relativePath = `${surface.dir}/${name}${surface.extension}`;
      const text = await readSource(input.repoRoot, relativePath, sweepFs);
      const source = text.ok ? surface.read(relativePath, text.value) : text;
      if (!source.ok) {
        refused.push(source.error);
        continue;
      }
      const issue = nameIssue(relativePath, name, source.value);
      if (issue !== undefined) {
        refused.push(issue);
        continue;
      }
      sets.set(name, { ...(sets.get(name) ?? {}), [surface.platform]: source.value });
    }
  }
  return refused.length > 0 ? err(refused) : ok(sets);
}

function deriveTemplate(
  template: string,
  group: Map<string, AdapterSet> | undefined,
): Result<Derived, string> {
  const shape = groupShape(template, group);
  if (!shape.ok) {
    return shape;
  }
  const own = shape.value.group.get(template);
  return own === undefined ? deriveFanOut(template, shape.value.group) : deriveRole(template, own);
}

/**
 * Derive the undeclared templates; adapters are grouped under every template, and a declared
 * template's group is checked against the kind it declares before it is left alone.
 */
function deriveAll(
  templates: readonly string[],
  heads: Heads,
  sets: ReadonlyMap<string, AdapterSet>,
): Result<Map<string, Derived>, string[]> {
  const grouped = groupByTemplate(new Set(templates), sets);
  if (!grouped.ok) {
    return grouped;
  }
  const derived = new Map<string, Derived>();
  const refused: string[] = [];
  for (const template of templates) {
    const kind = heads.declared.get(template);
    if (kind !== undefined) {
      const issue = declaredShapeIssue(template, kind, grouped.value.get(template));
      if (issue !== undefined) {
        refused.push(issue);
      }
      continue;
    }
    if (!heads.undeclared.has(template)) {
      continue;
    }
    const result = deriveTemplate(template, grouped.value.get(template));
    if (result.ok) {
      derived.set(template, result.value);
    } else {
      refused.push(result.error);
    }
  }
  return refused.length > 0 ? err(refused) : ok(derived);
}

async function writeAll(
  input: SweepInput,
  sweepFs: SweepFs,
  heads: ReadonlyMap<string, string>,
  derived: ReadonlyMap<string, Derived>,
): Promise<Result<string[], string>> {
  const written: string[] = [];
  for (const [name, { declaration }] of derived) {
    const prepended = prependSubagentFrontmatter(
      heads.get(name) ?? '',
      renderSubagentFrontmatter(declaration),
    );
    if (!prepended.ok) {
      return err(`${name}: ${prepended.error}`);
    }
    if (input.write) {
      const relativePath = `${TEMPLATES_DIR}/${name}.md`;
      await sweepFs.writeFile(path.join(input.repoRoot, relativePath), prepended.value);
      written.push(relativePath);
    }
  }
  return ok(written);
}

/** Run the sweep; nothing is written unless every derivation succeeded and `write` is set. */
export async function sweepSubagentFrontmatter(input: SweepInput): Promise<SweepOutcome> {
  const sweepFs = input.sweepFs ?? defaultSweepFs;
  const heads = await readHeads(input, sweepFs);
  const alreadyDeclared = [...heads.declared.keys()];
  const sets = await readAdapterSets(input, sweepFs);
  const refused = [...heads.refused, ...(sets.ok ? [] : sets.error)];
  if (refused.length > 0 || !sets.ok) {
    return refusal(refused, alreadyDeclared);
  }
  const derived = deriveAll(input.templateNames, heads, sets.value);
  if (!derived.ok) {
    return refusal(derived.error, alreadyDeclared);
  }
  const written = await writeAll(input, sweepFs, heads.undeclared, derived.value);
  if (!written.ok) {
    return refusal([written.error], alreadyDeclared);
  }
  const outcomes = [...derived.value.values()];
  return {
    refused: [],
    declarations: outcomes.map((entry) => entry.declaration),
    reconciliations: outcomes.flatMap((entry) => entry.reconciliations),
    alreadyDeclared,
    written: written.value,
  };
}
