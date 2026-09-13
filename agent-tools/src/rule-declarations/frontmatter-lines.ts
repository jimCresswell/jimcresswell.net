/**
 * Read a hand-kept adapter's frontmatter the way its platform does: line by line.
 *
 * The Cursor triggers and the Claude rule adapters were written by hand, and their
 * descriptions are not always valid YAML plain scalars (a `: ` inside a sentence, which a
 * strict parser refuses and Cursor tolerates). Reading them as YAML would refuse a fifth of
 * the estate; reading them line by line, key by key, keeps exactly the value the platform
 * reads. The reader is deliberately narrow: each caller names the keys it accepts, a key
 * outside that set is refused, a duplicated key is refused, blank lines are skipped as YAML
 * skips them, and the only multi-line shape read is the folded block (`>` / `>-`) a few
 * descriptions use.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

/** The key/value pairs of one frontmatter block, in file order. */
export type FrontmatterLines = ReadonlyMap<string, string>;

/** The line that opens and closes a frontmatter block. */
export const FRONTMATTER_FENCE_LINE = '---';

const KEY_LINE = /^([A-Za-z][A-Za-z0-9_-]*):(?:\s(.*))?$/u;
const FOLDED_BLOCK = /^>-?$/u;
const LITERAL_BLOCK = /^\|-?$/u;
const BLOCK_CONTINUATION = /^ {2}(.*)$/u;

/**
 * Read the frontmatter block at the top of `text`.
 *
 * @param text - The adapter file text.
 * @param allowedKeys - The keys this adapter may carry; any other key is refused.
 * @returns The keys and their scalar values, `undefined` when the text has no block, or the
 * reason the block could not be read.
 */
export function readFrontmatterLines(
  text: string,
  allowedKeys: ReadonlySet<string>,
): Result<FrontmatterLines | undefined, string> {
  const lines = text.split('\n');
  if (lines[0] !== FRONTMATTER_FENCE_LINE) {
    return ok(undefined);
  }
  const closing = lines.indexOf(FRONTMATTER_FENCE_LINE, 1);
  if (closing === -1) {
    return err('frontmatter block never closes');
  }
  return parseBlock(lines.slice(1, closing), allowedKeys);
}

function parseBlock(
  blockLines: readonly string[],
  allowedKeys: ReadonlySet<string>,
): Result<FrontmatterLines, string> {
  const values = new Map<string, string>();
  let index = 0;
  while (index < blockLines.length) {
    const line = blockLines[index] ?? '';
    if (line.trim() === '') {
      index += 1;
      continue;
    }
    const entry = parseKeyLine(line, index, allowedKeys, values);
    if (!entry.ok) {
      return entry;
    }
    const scalar = readScalar(entry.value.rawValue, blockLines, index + 1);
    if (!scalar.ok) {
      return err(`${entry.value.key} ${scalar.error}`);
    }
    values.set(entry.value.key, scalar.value.value);
    index = scalar.value.next;
  }
  return ok(values);
}

interface KeyLine {
  readonly key: string;
  readonly rawValue: string;
}

/** Read `key: value`; `lineIndex` is zero-based inside the block, reported one-based in the file. */
function parseKeyLine(
  line: string,
  lineIndex: number,
  allowedKeys: ReadonlySet<string>,
  seen: ReadonlyMap<string, string>,
): Result<KeyLine, string> {
  const match = KEY_LINE.exec(line);
  if (match === null) {
    return err(`unparseable frontmatter line ${String(lineIndex + 2)}: ${line}`);
  }
  const [, key = '', rawValue = ''] = match;
  if (!allowedKeys.has(key)) {
    return err(`unknown frontmatter key "${key}"`);
  }
  if (seen.has(key)) {
    return err(`frontmatter key "${key}" appears twice`);
  }
  return ok({ key, rawValue });
}

interface Scalar {
  readonly value: string;
  /** The index of the first line after the scalar. */
  readonly next: number;
}

/** Read a plain scalar on the key's line, or a folded block on the lines that follow it. */
function readScalar(
  rawValue: string,
  blockLines: readonly string[],
  next: number,
): Result<Scalar, string> {
  if (LITERAL_BLOCK.test(rawValue)) {
    return err('uses a literal block; only plain and folded (>) scalars are read');
  }
  if (FOLDED_BLOCK.test(rawValue)) {
    return readFoldedBlock(blockLines, next);
  }
  return ok({ value: rawValue.trim(), next });
}

/**
 * Join the indented continuation lines of a folded block with single spaces, as YAML does. A
 * blank line followed by more indented text is a paragraph break, which YAML keeps as a
 * newline; the reader keeps exactly the value the platform reads and has no one-line value to
 * give it, so that shape is refused by name (as the literal block is). Blank lines after the
 * last continuation are not part of the block and are left for the caller to skip.
 */
function readFoldedBlock(blockLines: readonly string[], start: number): Result<Scalar, string> {
  const parts: string[] = [];
  let next = start;
  let index = start;
  let blankSeen = false;
  while (index < blockLines.length) {
    const line = blockLines[index] ?? '';
    if (line.trim() === '') {
      blankSeen = true;
      index += 1;
      continue;
    }
    const continuation = BLOCK_CONTINUATION.exec(line);
    if (continuation === null) {
      break;
    }
    if (blankSeen) {
      return err(
        'has a paragraph break inside a folded block; only a single-paragraph fold is read',
      );
    }
    parts.push((continuation[1] ?? '').trim());
    index += 1;
    next = index;
  }
  return ok({ value: parts.join(' '), next });
}

/**
 * Split a quoted, comma-joined list value (`"a,b"` or `'a,b'`) into its members. A comma
 * inside a brace group (`**\/*.{ts,tsx}`) belongs to the glob, not to the list, so a value
 * whose braces do not balance is refused rather than split on a guess.
 *
 * @param value - The raw scalar after the key.
 * @returns The trimmed, non-empty members in order, or the reason the value cannot be split.
 */
export function splitCommaList(value: string): Result<readonly string[], string> {
  const text = stripMatchingQuotes(value);
  const balance = checkBraceBalance(text);
  if (!balance.ok) {
    return balance;
  }
  const members: string[] = [];
  let current = '';
  let depth = 0;
  for (const character of text) {
    if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      depth -= 1;
    }
    if (character === ',' && depth === 0) {
      members.push(current);
      current = '';
    } else {
      current += character;
    }
  }
  members.push(current);
  return ok(members.map((member) => member.trim()).filter((member) => member.length > 0));
}

/** Refuse a value whose braces do not pair up, naming the value so its source line is findable. */
function checkBraceBalance(text: string): Result<undefined, string> {
  let depth = 0;
  for (const character of text) {
    if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      if (depth === 0) {
        return err(`unbalanced braces in "${text}": a "}" has no "{"`);
      }
      depth -= 1;
    }
  }
  return depth === 0 ? ok(undefined) : err(`unbalanced braces in "${text}": a "{" is never closed`);
}

function stripMatchingQuotes(value: string): string {
  const first = value.at(0);
  const last = value.at(-1);
  if (value.length >= 2 && (first === '"' || first === "'") && last === first) {
    return value.slice(1, -1);
  }
  return value;
}
