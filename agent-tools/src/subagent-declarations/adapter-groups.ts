/**
 * The adapters of one template, grouped by the name they carry, and the shape a group takes:
 * a ROLE has one adapter set under the template's own name, a FAN-OUT has sets only under
 * `<template>-<suffix>` names. A template with no set, or with both, is a refusal; so is an
 * adapter under no template, and one whose pointer names a template other than the one its
 * name puts it under (a variant's owner is its fan-out parent). A declared template's group
 * is checked the same way and against its declared kind, so a rerun never passes a template
 * whose adapters no longer match what it declares (the #77 round-one findings, 2026-09-14).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import { type AdapterSet, present } from './derive-subagent-declaration.js';
import type { SubagentDeclaration } from './subagent-declaration.js';

/** The template an adapter name belongs to: itself, or the longest `<template>-` prefix. */
function templateOf(adapter: string, templates: ReadonlySet<string>): string | undefined {
  if (templates.has(adapter)) {
    return adapter;
  }
  return [...templates]
    .filter((template) => adapter.startsWith(`${template}-`))
    .sort((a, b) => b.length - a.length)[0];
}

/** The first platform whose adapter points at a template other than the owner, as a refusal. */
function pointerIssue(adapter: string, owner: string, set: AdapterSet): string | undefined {
  const platform = present(set).find((candidate) => set[candidate]?.template !== owner);
  if (platform === undefined) {
    return undefined;
  }
  const named = set[platform]?.template ?? '';
  return `${adapter}: ${platform} adapter points at template "${named}", not "${owner}"`;
}

/** Every adapter set under its template; an orphan or a mis-pointed adapter is a refusal. */
export function groupByTemplate(
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
    const issue = pointerIssue(adapter, owner, set);
    if (issue !== undefined) {
      refused.push(issue);
      continue;
    }
    const group = groups.get(owner) ?? new Map<string, AdapterSet>();
    group.set(adapter, set);
    groups.set(owner, group);
  }
  return refused.length > 0 ? err(refused) : ok(groups);
}

/** A group's shape, with the group itself once it is known to have one. */
export interface GroupShape {
  readonly kind: SubagentDeclaration['kind'];
  readonly group: Map<string, AdapterSet>;
}

/** The shape a template's group takes, or the refusal: no set, or sets under both name forms. */
export function groupShape(
  template: string,
  group: Map<string, AdapterSet> | undefined,
): Result<GroupShape, string> {
  if (group === undefined) {
    return err(`${template}: no adapter on any platform`);
  }
  const own = group.has(template);
  if (own && group.size > 1) {
    return err(`${template}: adapters under its own name and under variant names`);
  }
  return ok({ kind: own ? 'role' : 'fan-out', group });
}

/** Why a declared template's group does not match its declaration; none when it does. */
export function declaredShapeIssue(
  template: string,
  kind: SubagentDeclaration['kind'],
  group: Map<string, AdapterSet> | undefined,
): string | undefined {
  const shape = groupShape(template, group);
  if (!shape.ok) {
    return shape.error;
  }
  if (shape.value.kind === kind) {
    return undefined;
  }
  return kind === 'role'
    ? `${template}: declared as a role but its adapters are under variant names`
    : `${template}: declared as a fan-out but has an adapter under its own name`;
}
