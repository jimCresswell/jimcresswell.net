/**
 * Render the projections of rule declarations: the rules index and the three per-rule
 * adapters. Each projection is a pure function of the declarations, so `portability:fix`
 * writes what `portability:check` recomputes and neither is ever edited by hand
 * (`compute-dont-hope`).
 *
 * The shapes follow each platform's documented contract (read 2026-09-13):
 *
 * - Cursor (`.cursor/rules/<rule>.mdc`): `description`, then `globs` as one comma-joined
 *   string when the rule has any, then an explicit `alwaysApply`; a core rule is always
 *   applied, a situational rule is auto-attached by its globs or agent-requested by its
 *   description.
 * - Claude Code (`.claude/rules/<rule>.md`): a rule with globs is path-scoped by a `paths`
 *   LIST and imports the canonical rule with `@`; every other rule is a plain pointer, loaded
 *   at launch like the project's own instructions.
 * - `.agents/rules/<rule>.md`: a plain pointer for every rule.
 * - `RULES_INDEX.md`: the discoverability index for platforms that load nothing else, one
 *   compact row per rule in name order, the trigger token in a code span so a glob inside it
 *   never reads as markdown emphasis.
 *
 * @packageDocumentation
 */

import { stringify } from 'yaml';

import { FRONTMATTER_FENCE_LINE } from './frontmatter-lines.js';
import type { RuleDeclaration } from './rule-declaration.js';

/** One generated file: its repo-relative path and full text. */
export interface RuleProjection {
  readonly path: string;
  readonly text: string;
}

/** The index file's first line; the rest of its prose is fixed below. */
export const RULES_INDEX_HEADING = '# Rules Index';

/** Repo-relative path of the rules index. */
export const RULES_INDEX_PATH = 'RULES_INDEX.md';

const RULES_INDEX_PROSE = [
  'Canonical, platform-independent enumeration of the repository rules — the',
  'discoverability surface for agents and humans, and the project-doc resolution',
  'path for platforms (such as Codex) that do not auto-load `.agent/rules/`.',
  '',
  'Before substantive work, read and apply every _relevant_ canonical rule below.',
  'Treat them as behavioural modifiers for the session; follow any pointer a rule',
  'makes before acting in the affected area. Each rule is classified `core` (always loaded, em-dash trigger) or',
  '`situational` (loaded on the named trigger; `surface:*` triggers are file-surface',
  "matches the Cursor adapter realises as `globs`). This file is generated from the rules'",
  'frontmatter by `pnpm portability:fix` and recomputed by `pnpm portability:check`; never',
  'edit it by hand.',
  '',
  '| Rule | Classification | Trigger / Loading Signal |',
  '| ---- | -------------- | ------------------------ |',
];

const NO_TRIGGER = '—';
const FENCE = `${FRONTMATTER_FENCE_LINE}\n`;

function pointer(declaration: RuleDeclaration): string {
  return `Read and follow \`.agent/rules/${declaration.name}.md\`.\n`;
}

/** The Cursor trigger's fields, in the order they are written. */
interface CursorTriggerFields {
  readonly description: string;
  readonly globs?: string;
  readonly alwaysApply: boolean;
}

function frontmatter(fields: CursorTriggerFields): string {
  return `${FENCE}${stringify(fields, { lineWidth: 0, singleQuote: true })}${FENCE}`;
}

/**
 * Render the Cursor trigger for a declaration.
 *
 * @param declaration - The rule declaration.
 * @returns The `.mdc` file text.
 */
export function renderCursorTrigger(declaration: RuleDeclaration): string {
  const fields =
    declaration.classification === 'core'
      ? { description: declaration.description, alwaysApply: true }
      : declaration.globs.length > 0
        ? {
            description: declaration.description,
            globs: declaration.globs.join(','),
            alwaysApply: false,
          }
        : { description: declaration.description, alwaysApply: false };
  return `${frontmatter(fields)}\n${pointer(declaration)}`;
}

/**
 * Render the Claude Code rule adapter for a declaration.
 *
 * @param declaration - The rule declaration.
 * @returns The adapter file text: a `paths`-scoped import for a rule with globs, otherwise a
 * plain pointer.
 */
export function renderClaudeRuleAdapter(declaration: RuleDeclaration): string {
  if (declaration.classification === 'core' || declaration.globs.length === 0) {
    return pointer(declaration);
  }
  const block = `${FENCE}${stringify({ paths: [...declaration.globs] }, { lineWidth: 0 })}${FENCE}`;
  return `${block}\nRead and follow @.agent/rules/${declaration.name}.md\n`;
}

/**
 * Render the `.agents/` rule adapter for a declaration: always a plain pointer.
 *
 * @param declaration - The rule declaration.
 * @returns The adapter file text.
 */
export function renderAgentsRuleAdapter(declaration: RuleDeclaration): string {
  return pointer(declaration);
}

/**
 * Render the rules index for a set of declarations.
 *
 * @param declarations - The declarations, in any order; rows are rendered in name order.
 * @returns The full `RULES_INDEX.md` text.
 */
export function renderRulesIndex(declarations: readonly RuleDeclaration[]): string {
  const rows = [...declarations]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map(
      (declaration) =>
        `| \`.agent/rules/${declaration.name}.md\` | ${declaration.classification} | ${
          declaration.classification === 'core' ? NO_TRIGGER : `\`${declaration.trigger}\``
        } |`,
    );
  return `${[RULES_INDEX_HEADING, '', ...RULES_INDEX_PROSE, ...rows].join('\n')}\n`;
}

/**
 * Render every projection of a set of declarations, path-keyed: the index first, then each
 * rule's Cursor trigger, Claude adapter and `.agents` adapter.
 *
 * @param declarations - The declarations.
 * @returns The projections in a stable order.
 */
export function renderRuleProjections(
  declarations: readonly RuleDeclaration[],
): readonly RuleProjection[] {
  const perRule = declarations.flatMap((declaration) => [
    { path: `.cursor/rules/${declaration.name}.mdc`, text: renderCursorTrigger(declaration) },
    { path: `.claude/rules/${declaration.name}.md`, text: renderClaudeRuleAdapter(declaration) },
    { path: `.agents/rules/${declaration.name}.md`, text: renderAgentsRuleAdapter(declaration) },
  ]);
  return [{ path: RULES_INDEX_PATH, text: renderRulesIndex(declarations) }, ...perRule];
}
