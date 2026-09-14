/**
 * The hand-kept Codex adapter as a source: TOML with flat `key = "value"` lines above one
 * triple-quoted `developer_instructions` string whose first line is the pointer. Read into
 * the shape every adapter shares (`adapter-sources.ts`, which states the refusals: a head
 * line that is not a field, a key twice, a value of zero length, instructions before the
 * pointer, content after the block).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import { bodyAfterPath, type AdapterSource } from './adapter-sources.js';

const CODEX_POINTER_START = 'Read and follow `';
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
    const [, key = '', value = ''] = match;
    const issue = codexFieldIssue(relativePath, fields, key, value);
    if (issue !== undefined) {
      return err(issue);
    }
    fields.set(key, value);
  }
  return ok(fields);
}

/** The refusal for a key already read or a value of zero length; `undefined` when the field may be kept. */
function codexFieldIssue(
  relativePath: string,
  fields: ReadonlyMap<string, string>,
  key: string,
  value: string,
): string | undefined {
  if (fields.has(key)) {
    return `${relativePath}: key "${key}" appears twice`;
  }
  return value === '' ? `${relativePath}: field "${key}" carries no value` : undefined;
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
  // A Codex adapter carries nothing before its pointer (measured, standard-adapter-body.ts).
  const early = body.value.slice(0, pointerAt).find((entry) => entry.trim() !== '');
  if (early !== undefined) {
    return err(`${relativePath}: instructions before the pointer are not read: "${early}"`);
  }
  const rest = bodyAfterPath(relativePath, body.value, pointerAt);
  return rest.ok
    ? ok({ fields: fields.value, title: undefined, pointerWrapped: false, ...rest.value })
    : rest;
}
