/**
 * The hand-kept adapters as sources: what each platform's adapter file says about a role,
 * read for the sweep (the transplant instrument that mints declarations) and never by the
 * running estate, which reads only the declarations.
 *
 * Cursor and Claude adapters are Markdown with YAML frontmatter, read line by line as the
 * platform reads it (`adapter-frontmatter.ts`); Codex adapters are TOML with flat
 * `key = "value"` lines and one triple-quoted `developer_instructions` string. Each is read
 * into the same shape: its frontmatter fields as strings, its title, the template its pointer
 * names, the shape of its pointer paragraph (the sentence that names the template: wrapped
 * or not, and whatever follows the path inside that paragraph, verbatim), and the prose
 * after that paragraph (the "note"), so every byte an adapter body varies by is measured,
 * and a variant's platform-specific paragraph survives into its declaration as written. A
 * field that is a list, carries no value or is a key no adapter carries, a pointer that
 * names anything but a template path, a Codex head line that is not a `key = "value"` field,
 * or Codex content after the instructions block, is a refusal: the readers never drop a
 * value silently (the derivation then refuses any key it does not read,
 * `derive-subagent-declaration.ts`).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import { readAdapterFrontmatter } from './adapter-frontmatter.js';
import type { SubagentPlatform } from './subagent-declaration.js';

/** The three hand-kept surfaces; Gemini is generated only. */
export type SourcePlatform = Exclude<SubagentPlatform, 'gemini'>;

/** One adapter's fields and body facts. */
export interface AdapterSource {
  readonly fields: ReadonlyMap<string, string>;
  /** The `# ` heading, when the adapter carries one (a Codex adapter carries none). */
  readonly title: string | undefined;
  /** The template basename the pointer names (a variant names its fan-out parent). */
  readonly template: string;
  /** Whether the pointer sentence wraps its path onto a second line. */
  readonly pointerWrapped: boolean;
  /** What follows the path inside the pointer paragraph, verbatim; empty for a plain stop. */
  readonly pointerTail: string;
  /** The prose after the pointer paragraph, trimmed; empty when the adapter carries none. */
  readonly note: string;
}

const POINTER_SENTENCE_START = 'Your first action MUST be to read and internalise';
const CODEX_POINTER_START = 'Read and follow `';

const TEMPLATE_PATH = /^\.agent\/sub-agents\/templates\/([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/u;

/** The template the backticked path on a pointer line names, and where the path closes. */
function namedTemplate(
  relativePath: string,
  line: string,
): Result<{ template: string; closingTick: number }, string> {
  const closingTick = line.lastIndexOf('`');
  const openingTick = closingTick <= 0 ? -1 : line.lastIndexOf('`', closingTick - 1);
  if (openingTick === -1) {
    return err(`${relativePath}: the template pointer names no path`);
  }
  const named = line.slice(openingTick + 1, closingTick);
  const template = TEMPLATE_PATH.exec(named)?.[1];
  return template === undefined
    ? err(`${relativePath}: the template pointer names "${named}", not a template path`)
    : ok({ template, closingTick });
}

/** The template named, the pointer paragraph's tail and the note after it, given the line that carries the path. */
function bodyAfterPath(
  relativePath: string,
  body: readonly string[],
  pathLine: number,
): Result<Pick<AdapterSource, 'template' | 'pointerTail' | 'note'>, string> {
  const line = body[pathLine] ?? '';
  const named = namedTemplate(relativePath, line);
  if (!named.ok) {
    return named;
  }
  let paragraphEnd = pathLine;
  while ((body[paragraphEnd + 1] ?? '').trim() !== '') {
    paragraphEnd += 1;
  }
  const afterPath = line.slice(named.value.closingTick + 1);
  const continuation = body.slice(pathLine + 1, paragraphEnd + 1);
  const pointerTail =
    (afterPath === '.' ? '' : afterPath) +
    (continuation.length === 0 ? '' : `\n${continuation.join('\n')}`);
  return ok({
    template: named.value.template,
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
  const block = readAdapterFrontmatter(relativePath, lines);
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
const CODEX_INSTRUCTIONS_BLOCK = /^([\s\S]*?)\n"""([\s\S]*)$/u;

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

/** The instructions block's lines; a block that never closes, or text after it that is neither blank nor a comment, refuses. */
function codexInstructions(relativePath: string, rest: string): Result<string[], string> {
  const match = CODEX_INSTRUCTIONS_BLOCK.exec(rest);
  if (match === null) {
    return err(`${relativePath}: developer_instructions block never closes`);
  }
  const [, body = '', suffix = ''] = match;
  const stray = suffix.split('\n').find((line) => line.trim() !== '' && !line.startsWith('#'));
  return stray === undefined
    ? ok(body.split('\n'))
    : err(`${relativePath}: content after the developer_instructions block is not read: ${stray}`);
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
  const body = codexInstructions(
    relativePath,
    text.slice(open + CODEX_INSTRUCTIONS_OPEN.length + 1),
  );
  if (!body.ok) {
    return body;
  }
  const pointerAt = body.value.findIndex((entry) => entry.startsWith(CODEX_POINTER_START));
  if (pointerAt === -1) {
    return err(`${relativePath}: no template pointer line`);
  }
  const rest = bodyAfterPath(relativePath, body.value, pointerAt);
  return rest.ok
    ? ok({ fields: fields.value, title: undefined, pointerWrapped: false, ...rest.value })
    : rest;
}
