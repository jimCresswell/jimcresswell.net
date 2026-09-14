/**
 * The shared core of deriving a template's declaration from its hand-kept adapters: the
 * estate's defaults, the adapter set a template's name gathers, the reconciliation record,
 * and the readings every derivation makes (the ruling description, the Claude fields, the
 * body facts that are reconciled to the standard shape rather than declared).
 *
 * A ROLE (`derive-role.ts`) has adapters under its own name on one to three platforms: the
 * description is the Claude adapter's (the platform this estate runs on; Director's ruling
 * 2026-09-14), the other platforms' texts listed as reconciliations where they differ; a
 * platform's fields and prose are declared only where they deviate from the standard
 * adapter body, so a standard adapter yields a declaration of one line. A FAN-OUT
 * (`derive-variant.ts`) has no adapter of its own name and adapters under
 * `<template>-<suffix>` names: every variant is declared in full (every platform field, its
 * title, its Cursor description where it differs, the prose each platform's adapter
 * carries), because the variants differ by design and are never flattened.
 *
 * Two body facts are never declared, only reconciled: a role title that is not the name in
 * title case, and a pointer sentence wrapped over two lines. Both are formatting the
 * generator normalises; the report names each so the change is read before it lands.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import type { AdapterSource, SourcePlatform } from './adapter-sources.js';
import type { ClaudeFields, SubagentDeclaration } from './subagent-declaration.js';

/** The estate's default adapter fields; a declaration carries only deviations from these. */
export const CLAUDE_DEFAULTS = {
  tools: 'Read, Grep, Glob, Bash',
  disallowedTools: 'Write, Edit',
  permissionMode: 'plan',
} as const;
export const CODEX_DEFAULTS = { effort: 'high' } as const;

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

export const PLATFORM_ORDER: readonly SourcePlatform[] = ['cursor', 'claude', 'codex'];

const CLAUDE_KEYS = [
  'tools',
  'disallowedTools',
  'permissionMode',
  'color',
  'model',
  'effort',
] as const;

/** The platforms an adapter set carries, in surface order. */
export function present(set: AdapterSet): SourcePlatform[] {
  return PLATFORM_ORDER.filter((platform) => set[platform] !== undefined);
}

/** The value each present platform's adapter carries for one reading, in surface order. */
function readings(
  set: AdapterSet,
  read: (source: AdapterSource) => string | undefined,
): { platform: SourcePlatform; value: string }[] {
  return PLATFORM_ORDER.flatMap((platform) => {
    const source = set[platform];
    const value = source === undefined ? undefined : read(source);
    return value === undefined ? [] : [{ platform, value }];
  });
}

/** The ruling description (Claude's), with the other platforms' texts as a reconciliation. */
export function rulingDescription(
  adapter: string,
  set: AdapterSet,
): Result<{ description: string; reconciliations: Reconciliation[] }, string> {
  const texts = readings(set, (source) => source.fields.get('description'));
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

/** The ruling title (Claude's, else the first carried), or nothing when no adapter has one. */
export function rulingTitle(set: AdapterSet): string | undefined {
  const titles = readings(set, (source) => source.title);
  return (titles.find((entry) => entry.platform === 'claude') ?? titles[0])?.value;
}

/** The Claude fields an adapter carries, every one, in the declaration's key order. */
export function claudeFieldsOf(source: AdapterSource): ClaudeFields {
  const fields: ClaudeFields = {};
  for (const key of CLAUDE_KEYS) {
    const value = source.fields.get(key);
    if (value !== undefined) {
      fields[key] = value;
    }
  }
  return fields;
}

/** Every adapter whose title is not the one kept, as one reconciliation; none when all agree. */
export function titleReconciliations(
  adapter: string,
  set: AdapterSet,
  kept: string,
): Reconciliation[] {
  const dropped = readings(set, (source) => source.title).filter((entry) => entry.value !== kept);
  return dropped.length === 0 ? [] : [{ adapter, field: 'title', kept, dropped }];
}

/** Every adapter whose pointer wraps over two lines, as one reconciliation; none when none does. */
export function pointerReconciliations(adapter: string, set: AdapterSet): Reconciliation[] {
  const dropped = readings(set, (source) =>
    source.pointerWrapped ? 'wrapped over two lines' : undefined,
  );
  return dropped.length === 0 ? [] : [{ adapter, field: 'pointer', kept: 'one line', dropped }];
}
