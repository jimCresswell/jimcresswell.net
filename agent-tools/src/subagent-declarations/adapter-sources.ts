/**
 * The hand-kept adapters as sources: what each platform's adapter file says about a role,
 * read for the sweep (the transplant instrument that mints declarations) and never by the
 * running estate, which reads only the declarations.
 *
 * Cursor and Claude adapters are Markdown with YAML frontmatter, read line by line as the
 * platform reads it (`adapter-frontmatter.ts`); Codex adapters are TOML, read by
 * `codex-adapter.ts` through the same pointer and note reader. Each is read into the same
 * shape: its frontmatter fields as strings, its title, the template its pointer
 * names, the shape of its pointer paragraph (the sentence that names the template: wrapped
 * or not, and whatever follows the path inside that paragraph, verbatim), and the prose
 * after that paragraph (the "note"), so every byte an adapter body varies by is measured,
 * and a variant's platform-specific paragraph survives into its declaration as written. A
 * field that is a list, carries no value (on either platform) or is a key no adapter
 * carries, a heading with no title, a pointer that names anything but a template path, a
 * Codex head line that is not a `key = "value"` field, or Codex content after the
 * instructions block, is a refusal: the readers never drop a value silently (the derivation
 * then refuses any key it does not read, `derive-subagent-declaration.ts`), and nothing an
 * adapter says reaches a declaration the strict schema would refuse on the next read
 * (`declaration-round-trip.ts` reads every derived declaration back besides).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import { readAdapterFrontmatter } from './adapter-frontmatter.js';
import { STANDARD_PRE_POINTER } from './standard-adapter-body.js';
import type { MarkdownPlatform } from './subagent-declaration.js';

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

/** The index of the last non-blank line of the paragraph that starts at `from`. */
function paragraphEndFrom(body: readonly string[], from: number): number {
  let end = from;
  while ((body[end + 1] ?? '').trim() !== '') {
    end += 1;
  }
  return end;
}

/** The template named, the pointer paragraph's tail and the note after it, given the line that carries the path. */
export function bodyAfterPath(
  relativePath: string,
  body: readonly string[],
  pathLine: number,
): Result<Pick<AdapterSource, 'template' | 'pointerTail' | 'note'>, string> {
  const line = body[pathLine] ?? '';
  const named = namedTemplate(relativePath, line);
  if (!named.ok) {
    return named;
  }
  const paragraphEnd = paragraphEndFrom(body, pathLine);
  const afterPath = line.slice(named.value.closingTick + 1);
  const continuation = body.slice(pathLine + 1, paragraphEnd + 1);
  if (afterPath === '' && continuation.length === 0) {
    return err(`${relativePath}: the pointer sentence ends after its path without a stop`);
  }
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

/**
 * The whole head before the pointer, read in order: an optional title first, then exactly
 * the platform's skeleton line and nothing else, above or below. Anything else is a refusal
 * naming the first deviating line, because the sweep carries no place for it and the
 * generator would drop it (a preamble above the title was the code-expert's probe).
 */
function prePointerRefusal(
  platform: MarkdownPlatform,
  relativePath: string,
  head: readonly string[],
): string | undefined {
  const lines = head.filter((entry) => entry.trim() !== '');
  const rest = lines[0]?.startsWith('# ') === true ? lines.slice(1) : lines;
  const expected = STANDARD_PRE_POINTER[platform];
  if (rest.length === 1 && rest[0] === expected) {
    return undefined;
  }
  const deviating = rest.find((entry) => entry !== expected);
  const what = deviating === undefined ? 'missing' : `"${deviating}"`;
  return `${relativePath}: the line before the pointer is not the platform's (${what}); the sweep carries no place for it`;
}

/** Read a Markdown adapter (Cursor or Claude): its fields, title, pointer shape and note. */
export function readMarkdownAdapter(
  platform: MarkdownPlatform,
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
  const head = body.slice(0, pointerAt);
  const skeleton = prePointerRefusal(platform, relativePath, head);
  if (skeleton !== undefined) {
    return err(skeleton);
  }
  const title = headingTitle(relativePath, head);
  return title.ok
    ? ok({ fields: block.value.fields, title: title.value, pointerWrapped, ...rest.value })
    : title;
}

/** The `# ` heading's title when the head carries one; a heading with no title refuses. */
function headingTitle(
  relativePath: string,
  head: readonly string[],
): Result<string | undefined, string> {
  const title = head.find((entry) => entry.startsWith('# '))?.slice(2);
  return title !== undefined && title.trim() === ''
    ? err(`${relativePath}: the heading carries no title`)
    : ok(title);
}
