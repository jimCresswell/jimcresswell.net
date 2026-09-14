/**
 * Derive a fan-out's declaration from its variants' adapter sets: each variant in full, in
 * name order. A variant's title is declared where it is not the name in title case (the
 * cricket titles carry their effort label), the Cursor description where it differs from the
 * ruling one, and every field and every note each platform's adapter carries; a title that
 * differs between platforms and a wrapped pointer are reconciled.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import type { AdapterSource } from './adapter-sources.js';
import { block, withProse } from './declaration-fields.js';
import {
  claudeFieldsOf,
  pointerReconciliations,
  present,
  rulingTitle,
  titleReconciliations,
  type AdapterSet,
  type Derived,
  type Reconciliation,
} from './derive-subagent-declaration.js';
import { canonicalAdapterTitle } from './standard-adapter-body.js';
import type {
  ClaudeFields,
  CodexFields,
  CursorFields,
  SubagentVariant,
} from './subagent-declaration.js';

/** Every Claude field a variant's adapter carries, written out in full, with its prose. */
function claudeVariantFields(source: AdapterSource): ClaudeFields {
  const all = claudeFieldsOf(source);
  return withProse(all.tools === undefined ? { tools: 'inherit', ...all } : all, source);
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
  return withProse(fields, source);
}

function cursorVariantFields(source: AdapterSource, description: string): CursorFields {
  const own = source.fields.get('description');
  const fields: CursorFields = own === undefined || own === description ? {} : { description: own };
  return withProse(fields, source);
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

interface DerivedVariant {
  readonly variant: SubagentVariant;
  readonly reconciliations: readonly Reconciliation[];
}

/**
 * The variant's title where it is not the name in title case, and the reconciliation for
 * any platform whose title differs from the ruling one.
 */
function variantTitle(
  variant: string,
  set: AdapterSet,
): { declared: Pick<SubagentVariant, 'title'>; reconciliations: Reconciliation[] } {
  const title = rulingTitle(set);
  if (title === undefined) {
    return { declared: {}, reconciliations: [] };
  }
  return {
    declared: title === canonicalAdapterTitle(variant) ? {} : { title },
    reconciliations: titleReconciliations(variant, set, title),
  };
}

/** Derive one variant of a fan-out from the adapters under the variant's name. */
export function deriveVariant(variant: string, set: AdapterSet): Result<DerivedVariant, string> {
  const platforms = present(set);
  if (platforms.length === 0) {
    return err(`${variant}: no adapter on any platform`);
  }
  const description = set.claude?.fields.get('description') ?? set.codex?.fields.get('description');
  if (description === undefined) {
    return err(`${variant}: neither the Claude nor the Codex adapter carries a description`);
  }
  const title = variantTitle(variant, set);
  return ok({
    variant: {
      name: variant,
      platforms,
      description,
      ...title.declared,
      ...variantBlocks(set, description),
    },
    reconciliations: [...title.reconciliations, ...pointerReconciliations(variant, set)],
  });
}

/** Derive a fan-out's declaration from its variants' adapter sets, in name order. */
export function deriveFanOut(
  name: string,
  variants: ReadonlyMap<string, AdapterSet>,
): Result<Derived, string> {
  const derived: SubagentVariant[] = [];
  const reconciliations: Reconciliation[] = [];
  for (const [variant, set] of [...variants.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const result = deriveVariant(variant, set);
    if (!result.ok) {
      return result;
    }
    derived.push(result.value.variant);
    reconciliations.push(...result.value.reconciliations);
  }
  if (derived.length === 0) {
    return err(`${name}: a fan-out with no variants`);
  }
  return ok({ declaration: { kind: 'fan-out', name, variants: derived }, reconciliations });
}
