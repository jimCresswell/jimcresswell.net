/**
 * The hand-kept adapters as sources: what each platform's adapter file says about a role,
 * read for the sweep (the transplant instrument that mints declarations) and never by the
 * running estate, which reads only the declarations.
 *
 * Cursor and Claude adapters are Markdown with YAML frontmatter; Codex adapters are TOML
 * with flat `key = "value"` lines and one triple-quoted `developer_instructions` string.
 * Each is read into the same shape: its frontmatter fields as strings and the prose it
 * carries after its pointer to the template (the "note"), so a variant's platform-specific
 * paragraph survives into its declaration as written.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { parse as parseYaml } from 'yaml';

import { FRONTMATTER_FENCE_LINE } from '../rule-declarations/frontmatter-lines.js';

/** One adapter's fields and prose. */
export interface AdapterSource {
  readonly fields: ReadonlyMap<string, string>;
  /** The prose after the template pointer, trimmed; empty when the adapter carries none. */
  readonly note: string;
}

const POINTER_SENTENCE_START = 'Your first action MUST be to read and internalise';
const CODEX_POINTER_START = 'Read and follow `';

function toLine(value: unknown): string {
  if (value === null) {
    return '';
  }
  return Array.isArray(value) ? value.map(String).join(', ') : String(value);
}

/** The frontmatter block's fields as strings, and the index of its closing fence. */
function readBlock(
  relativePath: string,
  lines: readonly string[],
): Result<{ fields: Map<string, string>; closing: number }, string> {
  if (lines[0] !== FRONTMATTER_FENCE_LINE) {
    return err(`${relativePath}: no frontmatter block`);
  }
  const closing = lines.indexOf(FRONTMATTER_FENCE_LINE, 1);
  if (closing === -1) {
    return err(`${relativePath}: frontmatter block never closes`);
  }
  let value: unknown;
  try {
    value = parseYaml(lines.slice(1, closing).join('\n'), { mapAsMap: true });
  } catch (cause: unknown) {
    return err(`${relativePath}: frontmatter is not YAML (${String(cause)})`);
  }
  if (!(value instanceof Map)) {
    return err(`${relativePath}: frontmatter is not a mapping`);
  }
  const fields = new Map<string, string>();
  for (const [key, field] of value) {
    fields.set(String(key), toLine(field));
  }
  return ok({ fields, closing });
}

/** The prose after the pointer, which may wrap its path onto the next line. */
function noteAfter(body: readonly string[], pointerAt: number): string {
  const pointerEnd = body[pointerAt]?.includes('`') === true ? pointerAt : pointerAt + 1;
  return body
    .slice(pointerEnd + 1)
    .join('\n')
    .trim();
}

/** Read a Markdown adapter (Cursor or Claude): its frontmatter fields and its note. */
export function readMarkdownAdapter(
  relativePath: string,
  text: string,
): Result<AdapterSource, string> {
  const lines = text.split('\n');
  const block = readBlock(relativePath, lines);
  if (!block.ok) {
    return block;
  }
  const body = lines.slice(block.value.closing + 1);
  const pointerAt = body.findIndex((entry) => entry.startsWith(POINTER_SENTENCE_START));
  if (pointerAt === -1) {
    return err(`${relativePath}: no template pointer sentence`);
  }
  return ok({ fields: block.value.fields, note: noteAfter(body, pointerAt) });
}

/** Read a Codex adapter: its flat fields and the prose after the pointer line. */
export function readCodexAdapter(
  relativePath: string,
  text: string,
): Result<AdapterSource, string> {
  const fields = new Map<string, string>();
  for (const match of text.matchAll(/^([a-z_]+) = "([^"\n]*)"$/gmu)) {
    fields.set(match[1] ?? '', match[2] ?? '');
  }
  const instructions = /developer_instructions = """\n([\s\S]*?)\n"""/u.exec(text);
  if (instructions === null) {
    return err(`${relativePath}: no developer_instructions block`);
  }
  const body = (instructions[1] ?? '').split('\n');
  const pointerAt = body.findIndex((entry) => entry.startsWith(CODEX_POINTER_START));
  if (pointerAt === -1) {
    return err(`${relativePath}: no template pointer line`);
  }
  return ok({
    fields,
    note: body
      .slice(pointerAt + 1)
      .join('\n')
      .trim(),
  });
}
