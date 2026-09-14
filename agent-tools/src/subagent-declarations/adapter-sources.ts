/**
 * The hand-kept adapters as sources: what each platform's adapter file says about a role,
 * read for the sweep (the transplant instrument that mints declarations) and never by the
 * running estate, which reads only the declarations.
 *
 * Cursor and Claude adapters are Markdown with YAML frontmatter; Codex adapters are TOML
 * with flat `key = "value"` lines and one triple-quoted `developer_instructions` string.
 * Each is read into the same shape: its frontmatter fields as strings, its title, the shape
 * of its pointer paragraph (the sentence that names the template: wrapped or not, and
 * whatever follows the path inside that paragraph, verbatim), and the prose after that
 * paragraph (the "note"), so every byte an adapter body varies by is measured, and a
 * variant's platform-specific paragraph survives into its declaration as written. A field
 * that is not a scalar, or a Codex head line that is not a `key = "value"` field, is a
 * refusal: the readers never drop a value silently (the derivation then refuses any key it
 * does not read, `derive-subagent-declaration.ts`).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { parse as parseYaml } from 'yaml';

import { FRONTMATTER_FENCE_LINE } from '../rule-declarations/frontmatter-lines.js';

import type { SubagentPlatform } from './subagent-declaration.js';

/** The three hand-kept surfaces; Gemini is generated only. */
export type SourcePlatform = Exclude<SubagentPlatform, 'gemini'>;

/** One adapter's fields and body facts. */
export interface AdapterSource {
  readonly fields: ReadonlyMap<string, string>;
  /** The `# ` heading, when the adapter carries one (a Codex adapter carries none). */
  readonly title: string | undefined;
  /** Whether the pointer sentence wraps its path onto a second line. */
  readonly pointerWrapped: boolean;
  /** What follows the path inside the pointer paragraph, verbatim; empty for a plain stop. */
  readonly pointerTail: string;
  /** The prose after the pointer paragraph, trimmed; empty when the adapter carries none. */
  readonly note: string;
}

const POINTER_SENTENCE_START = 'Your first action MUST be to read and internalise';
const CODEX_POINTER_START = 'Read and follow `';

/** A scalar or a list of scalars as one line; anything nested is refused. */
function toLine(value: unknown): string | undefined {
  if (value === null) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.every((member) => typeof member !== 'object' || member === null)
      ? value.map(String).join(', ')
      : undefined;
  }
  return typeof value === 'object' ? undefined : String(value);
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
    const line = toLine(field);
    if (line === undefined) {
      return err(`${relativePath}: field "${String(key)}" is not a scalar`);
    }
    fields.set(String(key), line);
  }
  return ok({ fields, closing });
}

/** The pointer paragraph's tail and the note after it, given the line that carries the path. */
function bodyAfterPath(
  relativePath: string,
  body: readonly string[],
  pathLine: number,
): Result<Pick<AdapterSource, 'pointerTail' | 'note'>, string> {
  const line = body[pathLine] ?? '';
  const closingTick = line.lastIndexOf('`');
  if (closingTick === -1) {
    return err(`${relativePath}: the template pointer names no path`);
  }
  let paragraphEnd = pathLine;
  while ((body[paragraphEnd + 1] ?? '').trim() !== '') {
    paragraphEnd += 1;
  }
  const afterPath = line.slice(closingTick + 1);
  const continuation = body.slice(pathLine + 1, paragraphEnd + 1);
  const pointerTail =
    (afterPath === '.' ? '' : afterPath) +
    (continuation.length === 0 ? '' : `\n${continuation.join('\n')}`);
  return ok({
    pointerTail,
    note: body
      .slice(paragraphEnd + 1)
      .join('\n')
      .trim(),
  });
}

/** Read a Markdown adapter (Cursor or Claude): its fields, title, pointer shape and note. */
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
  const pointerWrapped = !(body[pointerAt] ?? '').includes('`');
  const rest = bodyAfterPath(relativePath, body, pointerWrapped ? pointerAt + 1 : pointerAt);
  if (!rest.ok) {
    return rest;
  }
  const title = body
    .slice(0, pointerAt)
    .find((entry) => entry.startsWith('# '))
    ?.slice(2);
  return ok({ fields: block.value.fields, title, pointerWrapped, ...rest.value });
}

const CODEX_FIELD_LINE = /^([a-z_]+) = "([^"\n]*)"$/u;
const CODEX_INSTRUCTIONS_OPEN = 'developer_instructions = """';

/** The flat `key = "value"` fields above the instructions block; any other line refuses. */
function readCodexFields(relativePath: string, head: string): Result<Map<string, string>, string> {
  const fields = new Map<string, string>();
  for (const line of head.split('\n')) {
    if (line.trim() === '' || line.startsWith('#')) {
      continue;
    }
    const match = CODEX_FIELD_LINE.exec(line);
    if (match === null) {
      return err(`${relativePath}: line "${line}" is not a key = "value" field`);
    }
    fields.set(match[1] ?? '', match[2] ?? '');
  }
  return ok(fields);
}

/** Read a Codex adapter: its flat fields and the pointer shape and note in its instructions. */
export function readCodexAdapter(
  relativePath: string,
  text: string,
): Result<AdapterSource, string> {
  const open = text.indexOf(`${CODEX_INSTRUCTIONS_OPEN}\n`);
  if (open === -1) {
    return err(`${relativePath}: no developer_instructions block`);
  }
  const fields = readCodexFields(relativePath, text.slice(0, open));
  if (!fields.ok) {
    return fields;
  }
  const instructions = /^([\s\S]*?)\n"""/u.exec(
    text.slice(open + CODEX_INSTRUCTIONS_OPEN.length + 1),
  );
  if (instructions === null) {
    return err(`${relativePath}: developer_instructions block never closes`);
  }
  const body = (instructions[1] ?? '').split('\n');
  const pointerAt = body.findIndex((entry) => entry.startsWith(CODEX_POINTER_START));
  if (pointerAt === -1) {
    return err(`${relativePath}: no template pointer line`);
  }
  const rest = bodyAfterPath(relativePath, body, pointerAt);
  return rest.ok
    ? ok({ fields: fields.value, title: undefined, pointerWrapped: false, ...rest.value })
    : rest;
}
