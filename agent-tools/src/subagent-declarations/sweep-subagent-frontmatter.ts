/**
 * The sweep: derive every template's declaration from its hand-kept adapters and write it
 * as the template's frontmatter.
 *
 * All-or-nothing derivation: an adapter that is not a regular file or cannot be read, a
 * template whose head cannot be read, an adapter name under no template, a role with no
 * adapter on any platform, refuses the whole sweep and nothing is written. Writing then
 * proceeds template by template through the atomic writer; a template that already carries
 * a block is left as it is and reported. The file system is an injected port (`sweep-fs.ts`,
 * shared with the rules sweep), so the sweep is proven over an in-memory tree.
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

import { readCodexAdapter, readMarkdownAdapter, type AdapterSource } from './adapter-sources.js';
import {
  deriveFanOut,
  deriveRole,
  type AdapterSet,
  type Derived,
  type Reconciliation,
  type SourcePlatform,
} from './derive-subagent-declaration.js';
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

function refusal(refused: readonly string[]): SweepOutcome {
  return { refused, declarations: [], reconciliations: [], alreadyDeclared: [], written: [] };
}

/** The template an adapter name belongs to: itself, or the longest `<template>-` prefix. */
function templateOf(adapter: string, templates: ReadonlySet<string>): string | undefined {
  if (templates.has(adapter)) {
    return adapter;
  }
  return [...templates]
    .filter((template) => adapter.startsWith(`${template}-`))
    .sort((a, b) => b.length - a.length)[0];
}

interface Heads {
  /** Undeclared templates and their text. */
  readonly undeclared: Map<string, string>;
  readonly alreadyDeclared: string[];
  readonly refused: string[];
}

async function readHeads(input: SweepInput, sweepFs: SweepFs): Promise<Heads> {
  const heads: Heads = { undeclared: new Map(), alreadyDeclared: [], refused: [] };
  for (const name of input.templateNames) {
    const text = await readSource(input.repoRoot, `${TEMPLATES_DIR}/${name}.md`, sweepFs);
    const head = text.ok ? readSubagentDeclaration(name, text.value) : text;
    if (!head.ok) {
      heads.refused.push(head.error);
    } else if (head.value.kind === 'declared') {
      heads.alreadyDeclared.push(name);
    } else if (text.ok) {
      heads.undeclared.set(name, text.value);
    }
  }
  return heads;
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
      sets.set(name, { ...(sets.get(name) ?? {}), [surface.platform]: source.value });
    }
  }
  return refused.length > 0 ? err(refused) : ok(sets);
}

/** Group every adapter set under its template; an orphan adapter is a refusal. */
function groupByTemplate(
  templates: ReadonlySet<string>,
  sets: ReadonlyMap<string, AdapterSet>,
): Result<Map<string, Map<string, AdapterSet>>, string[]> {
  const groups = new Map<string, Map<string, AdapterSet>>();
  const refused: string[] = [];
  for (const [adapter, set] of sets) {
    const owner = templateOf(adapter, templates);
    if (owner === undefined) {
      refused.push(`${adapter}: an adapter under no template`);
      continue;
    }
    const group = groups.get(owner) ?? new Map<string, AdapterSet>();
    group.set(adapter, set);
    groups.set(owner, group);
  }
  return refused.length > 0 ? err(refused) : ok(groups);
}

function deriveTemplate(
  template: string,
  group: Map<string, AdapterSet> | undefined,
): Result<Derived, string> {
  if (group === undefined) {
    return err(`${template}: no adapter on any platform`);
  }
  const own = group.get(template);
  if (own === undefined) {
    return deriveFanOut(template, group);
  }
  return group.size === 1
    ? deriveRole(template, own)
    : err(`${template}: adapters under its own name and under variant names`);
}

function deriveAll(
  templates: readonly string[],
  sets: ReadonlyMap<string, AdapterSet>,
): Result<Map<string, Derived>, string[]> {
  const grouped = groupByTemplate(new Set(templates), sets);
  if (!grouped.ok) {
    return grouped;
  }
  const derived = new Map<string, Derived>();
  const refused: string[] = [];
  for (const template of templates) {
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
  const sets = await readAdapterSets(input, sweepFs);
  const refused = [...heads.refused, ...(sets.ok ? [] : sets.error)];
  if (refused.length > 0 || !sets.ok) {
    return refusal(refused);
  }
  const derived = deriveAll([...heads.undeclared.keys()], sets.value);
  if (!derived.ok) {
    return refusal(derived.error);
  }
  const written = await writeAll(input, sweepFs, heads.undeclared, derived.value);
  if (!written.ok) {
    return refusal([written.error]);
  }
  const outcomes = [...derived.value.values()];
  return {
    refused: [],
    declarations: outcomes.map((entry) => entry.declaration),
    reconciliations: outcomes.flatMap((entry) => entry.reconciliations),
    alreadyDeclared: heads.alreadyDeclared,
    written: written.value,
  };
}
