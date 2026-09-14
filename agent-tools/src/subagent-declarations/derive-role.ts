/**
 * Derive a role's declaration from the adapters under its own name: the ruling description,
 * and per platform only what deviates from the standard adapter body, the one
 * `standard-adapter-body.ts` states: fields off the estate's defaults, a pointer tail, a
 * closing that is not the platform's standard one. A role title off the canonical one and a
 * wrapped pointer are reconciled, never declared (`derive-subagent-declaration.ts` says why).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import type { AdapterSource } from './adapter-sources.js';
import { block, unlessDefault, withProse } from './declaration-fields.js';
import {
  CLAUDE_DEFAULTS,
  claudeFieldsOf,
  CODEX_DEFAULTS,
  PLATFORM_ORDER,
  pointerReconciliations,
  present,
  rulingDescription,
  titleReconciliations,
  type AdapterSet,
  type Derived,
} from './derive-subagent-declaration.js';
import { canonicalAdapterTitle, STANDARD_CLOSINGS } from './standard-adapter-body.js';
import type {
  ClaudeFields,
  CodexFields,
  CursorFields,
  RoleDeclaration,
} from './subagent-declaration.js';

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
  return withProse(fields, source, STANDARD_CLOSINGS.claude);
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
  return withProse(fields, source, STANDARD_CLOSINGS.codex);
}

/** A role's Cursor fields: only the prose that deviates from the standard closing. */
function cursorDeviations(source: AdapterSource): CursorFields {
  return withProse({}, source, STANDARD_CLOSINGS.cursor);
}

/** The per-platform blocks of a role, each present only where its adapter deviates. */
function roleBlocks(set: AdapterSet): Pick<RoleDeclaration, 'cursor' | 'claude' | 'codex'> {
  const cursor = block(set.cursor === undefined ? undefined : cursorDeviations(set.cursor));
  const claude = block(set.claude === undefined ? undefined : claudeDeviations(set.claude));
  const codex = block(set.codex === undefined ? undefined : codexDeviations(set.codex));
  return {
    ...(cursor === undefined ? {} : { cursor }),
    ...(claude === undefined ? {} : { claude }),
    ...(codex === undefined ? {} : { codex }),
  };
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
  const declaration: RoleDeclaration = {
    kind: 'role',
    name,
    description: ruling.value.description,
    ...(platforms.length === PLATFORM_ORDER.length ? {} : { platforms }),
    ...roleBlocks(set),
  };
  return ok({
    declaration,
    reconciliations: [
      ...ruling.value.reconciliations,
      ...titleReconciliations(name, set, canonicalAdapterTitle(name)),
      ...pointerReconciliations(name, set),
    ],
  });
}
