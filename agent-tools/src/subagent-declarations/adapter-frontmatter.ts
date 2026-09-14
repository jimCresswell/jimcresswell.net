/**
 * The frontmatter of a hand-kept Markdown adapter (Cursor or Claude), read line by line as
 * the platform reads it (`frontmatter-lines.ts`): a plain scalar is its value verbatim, so a
 * hand-kept description with a `: ` inside a sentence, a valid platform value and an invalid
 * YAML plain scalar, is read rather than refused; a quoted scalar is read as YAML reads that
 * one scalar (`''` for a quote inside `'...'`, backslash escapes inside `"..."`); a folded
 * block is joined as YAML joins it. A list, a key no adapter carries, a field with no value
 * once read (bare or an empty quoted scalar: the strict declaration shape would reject the
 * empty line on the next read) and text that is not one scalar are refusals naming the
 * adapter and the key (the #77 round-one findings, 2026-09-14).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { parse as parseYaml } from 'yaml';

import {
  FRONTMATTER_FENCE_LINE,
  readFrontmatterLines,
} from '../rule-declarations/frontmatter-lines.js';

/** The keys a Cursor or Claude adapter carries; the line reader refuses any other. */
const MARKDOWN_KEYS: ReadonlySet<string> = new Set([
  'name',
  'description',
  'readonly',
  'tools',
  'disallowedTools',
  'permissionMode',
  'color',
  'model',
  'effort',
]);

/** The block's fields as the platform reads them, and the index of its closing fence line. */
export interface AdapterFrontmatter {
  readonly fields: ReadonlyMap<string, string>;
  readonly closing: number;
}

/**
 * Read the frontmatter block at the head of an adapter's lines.
 *
 * @param relativePath - The adapter's repo-relative path, for the refusal.
 * @param lines - The adapter text split on newlines.
 * @returns The fields and the closing fence's index, or the refusal.
 */
export function readAdapterFrontmatter(
  relativePath: string,
  lines: readonly string[],
): Result<AdapterFrontmatter, string> {
  if (lines[0] !== FRONTMATTER_FENCE_LINE) {
    return err(`${relativePath}: no frontmatter block`);
  }
  const closing = lines.indexOf(FRONTMATTER_FENCE_LINE, 1);
  if (closing === -1) {
    return err(`${relativePath}: frontmatter block never closes`);
  }
  const block = readFrontmatterLines(lines.join('\n'), MARKDOWN_KEYS);
  if (!block.ok) {
    return err(`${relativePath}: ${block.error}`);
  }
  const fields = fieldValues(relativePath, block.value ?? new Map<string, string>());
  return fields.ok ? ok({ fields: fields.value, closing }) : fields;
}

/** Each scalar as the platform reads it (the header says how); the first refusal otherwise. */
function fieldValues(
  relativePath: string,
  raw: ReadonlyMap<string, string>,
): Result<ReadonlyMap<string, string>, string> {
  const fields = new Map<string, string>();
  for (const [key, value] of raw) {
    const read = isQuoted(value) ? quotedScalar(value) : value;
    if (read === undefined) {
      return err(`${relativePath}: field "${key}" is not a quoted scalar: ${value}`);
    }
    if (read === '') {
      return err(`${relativePath}: field "${key}" carries no value`);
    }
    fields.set(key, read);
  }
  return ok(fields);
}

function isQuoted(value: string): boolean {
  const first = value.at(0);
  return (first === "'" || first === '"') && value.length >= 2 && value.at(-1) === first;
}

/** The string a YAML quoted scalar denotes; `undefined` when the text is not one scalar. */
function quotedScalar(value: string): string | undefined {
  try {
    const parsed: unknown = parseYaml(value);
    return typeof parsed === 'string' ? parsed : undefined;
  } catch {
    return undefined;
  }
}
