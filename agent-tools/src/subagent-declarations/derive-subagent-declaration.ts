/**
 * Derive a template's declaration from its hand-kept adapters (the sweep's pure core).
 *
 * A ROLE has adapters under its own name on one to three platforms: the description is the
 * Claude adapter's (the platform this estate runs on; Director's ruling 2026-09-14), the
 * other platforms' texts listed as reconciliations where they differ; a platform's fields are
 * declared only where they deviate from the estate's defaults, so a standard adapter yields
 * a declaration of one line. A FAN-OUT has no adapter of its own name and adapters under
 * `<template>-<suffix>` names: every variant is declared in full (every platform field, its
 * Cursor description where it differs, the prose each platform's adapter carries), because
 * the variants differ by design and are never flattened.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import type { AdapterSource } from './adapter-sources.js';
import { block, unlessDefault, withNote } from './declaration-fields.js';
import type {
  ClaudeFields,
  CodexFields,
  CursorFields,
  RoleDeclaration,
  SubagentDeclaration,
  SubagentPlatform,
  SubagentVariant,
} from './subagent-declaration.js';

/** The estate's default adapter fields; a declaration carries only deviations from these. */
export const CLAUDE_DEFAULTS = {
  tools: 'Read, Grep, Glob, Bash',
  disallowedTools: 'Write, Edit',
  permissionMode: 'plan',
} as const;
export const CODEX_DEFAULTS = { effort: 'high' } as const;

/** The three hand-kept surfaces; Gemini is generated only. */
export type SourcePlatform = Exclude<SubagentPlatform, 'gemini'>;

/** The adapters found for one adapter name, keyed by platform; absent where none exists. */
export type AdapterSet = Partial<Record<SourcePlatform, AdapterSource>>;

/** A disagreement between sources, resolved by the ruling and listed for the reader. */
export interface Reconciliation {
  readonly adapter: string;
  readonly field: string;
  readonly kept: string;
  readonly dropped: readonly { readonly platform: string; readonly value: string }[];
}

export interface Derived {
  readonly declaration: SubagentDeclaration;
  readonly reconciliations: readonly Reconciliation[];
}

const PLATFORM_ORDER: readonly SourcePlatform[] = ['cursor', 'claude', 'codex'];

const CLAUDE_KEYS = [
  'tools',
  'disallowedTools',
  'permissionMode',
  'color',
  'model',
  'effort',
] as const;

function present(set: AdapterSet): SourcePlatform[] {
  return PLATFORM_ORDER.filter((platform) => set[platform] !== undefined);
}

/** The ruling description (Claude's), with the other platforms' texts as a reconciliation. */
function rulingDescription(
  adapter: string,
  set: AdapterSet,
): Result<{ description: string; reconciliations: Reconciliation[] }, string> {
  const texts = PLATFORM_ORDER.flatMap((platform) => {
    const value = set[platform]?.fields.get('description');
    return value === undefined ? [] : [{ platform, value }];
  });
  const kept = texts.find((entry) => entry.platform === 'claude') ?? texts[0];
  if (kept === undefined) {
    return err(`${adapter}: no adapter carries a description`);
  }
  const dropped = texts.filter((entry) => entry.value !== kept.value);
  return ok({
    description: kept.value,
    reconciliations:
      dropped.length === 0 ? [] : [{ adapter, field: 'description', kept: kept.value, dropped }],
  });
}

/** The Claude fields an adapter carries, every one, in the declaration's key order. */
function claudeFieldsOf(source: AdapterSource): ClaudeFields {
  const fields: ClaudeFields = {};
  for (const key of CLAUDE_KEYS) {
    const value = source.fields.get(key);
    if (value !== undefined) {
      fields[key] = value;
    }
  }
  return fields;
}

/** A role's Claude fields: only the deviations from the defaults. */
function claudeDeviations(source: AdapterSource): ClaudeFields {
  const all = claudeFieldsOf(source);
  const fields: ClaudeFields = {};
  const tools =
    all.tools === undefined ? 'inherit' : unlessDefault(all.tools, CLAUDE_DEFAULTS.tools);
  if (tools !== undefined) {
    fields.tools = tools;
  }
  const disallowed = unlessDefault(all.disallowedTools, CLAUDE_DEFAULTS.disallowedTools);
  if (disallowed !== undefined) {
    fields.disallowedTools = disallowed;
  }
  const mode = unlessDefault(all.permissionMode, CLAUDE_DEFAULTS.permissionMode);
  if (mode !== undefined) {
    fields.permissionMode = mode;
  }
  for (const key of ['color', 'model', 'effort'] as const) {
    const value = all[key];
    if (value !== undefined) {
      fields[key] = value;
    }
  }
  return fields;
}

/** A role's Codex fields: only the deviations from the defaults. */
function codexDeviations(source: AdapterSource): CodexFields {
  const fields: CodexFields = {};
  const model = source.fields.get('model');
  if (model !== undefined) {
    fields.model = model;
  }
  const effort = unlessDefault(source.fields.get('model_reasoning_effort'), CODEX_DEFAULTS.effort);
  if (effort !== undefined) {
    fields.effort = effort;
  }
  return fields;
}

/** Derive a role's declaration from the adapters under its own name. */
export function deriveRole(name: string, set: AdapterSet): Result<Derived, string> {
  const platforms = present(set);
  if (platforms.length === 0) {
    return err(`${name}: no adapter on any platform`);
  }
  const ruling = rulingDescription(name, set);
  if (!ruling.ok) {
    return ruling;
  }
  const claude = block(set.claude === undefined ? undefined : claudeDeviations(set.claude));
  const codex = block(set.codex === undefined ? undefined : codexDeviations(set.codex));
  const declaration: RoleDeclaration = {
    kind: 'role',
    name,
    description: ruling.value.description,
    ...(platforms.length === PLATFORM_ORDER.length ? {} : { platforms }),
    ...(claude === undefined ? {} : { claude }),
    ...(codex === undefined ? {} : { codex }),
  };
  return ok({ declaration, reconciliations: ruling.value.reconciliations });
}

/** Every Claude field a variant's adapter carries, written out in full. */
function claudeVariantFields(source: AdapterSource): ClaudeFields {
  const all = claudeFieldsOf(source);
  return withNote(all.tools === undefined ? { tools: 'inherit', ...all } : all, source.note);
}

function codexVariantFields(source: AdapterSource): CodexFields {
  const fields: CodexFields = {};
  const model = source.fields.get('model');
  if (model !== undefined) {
    fields.model = model;
  }
  const effort = source.fields.get('model_reasoning_effort');
  if (effort !== undefined) {
    fields.effort = effort;
  }
  return withNote(fields, source.note);
}

function cursorVariantFields(source: AdapterSource, description: string): CursorFields {
  const own = source.fields.get('description');
  const fields: CursorFields = own === undefined || own === description ? {} : { description: own };
  return withNote(fields, source.note);
}

/** The per-platform blocks of a variant, each present only where its adapter is. */
function variantBlocks(
  set: AdapterSet,
  description: string,
): Pick<SubagentVariant, 'cursor' | 'claude' | 'codex'> {
  const cursor = block(
    set.cursor === undefined ? undefined : cursorVariantFields(set.cursor, description),
  );
  return {
    ...(cursor === undefined ? {} : { cursor }),
    ...(set.claude === undefined ? {} : { claude: claudeVariantFields(set.claude) }),
    ...(set.codex === undefined ? {} : { codex: codexVariantFields(set.codex) }),
  };
}

/** Derive one variant of a fan-out from the adapters under the variant's name. */
export function deriveVariant(variant: string, set: AdapterSet): Result<SubagentVariant, string> {
  const platforms = present(set);
  if (platforms.length === 0) {
    return err(`${variant}: no adapter on any platform`);
  }
  const description = set.claude?.fields.get('description') ?? set.codex?.fields.get('description');
  if (description === undefined) {
    return err(`${variant}: neither the Claude nor the Codex adapter carries a description`);
  }
  return ok({ name: variant, platforms, description, ...variantBlocks(set, description) });
}

/** Derive a fan-out's declaration from its variants' adapter sets, in name order. */
export function deriveFanOut(
  name: string,
  variants: ReadonlyMap<string, AdapterSet>,
): Result<Derived, string> {
  const derived: SubagentVariant[] = [];
  for (const [variant, set] of [...variants.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const result = deriveVariant(variant, set);
    if (!result.ok) {
      return result;
    }
    derived.push(result.value);
  }
  if (derived.length === 0) {
    return err(`${name}: a fan-out with no variants`);
  }
  return ok({ declaration: { kind: 'fan-out', name, variants: derived }, reconciliations: [] });
}
