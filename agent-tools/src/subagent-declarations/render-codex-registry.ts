/**
 * The Codex registry (closure item 6, 2b-ii, slice A2): `.codex/config.toml` is a hand-kept
 * head (the host's own settings: the file opener, the features, the hooks) followed by one
 * `[agents."<name>"]` block per Codex adapter, each carrying the adapter's description and
 * its config file. The head is kept verbatim up to the first block; the blocks are rendered
 * from the declarations, sorted by name, so the registry names exactly the adapters the
 * generator renders (`render-codex-adapter.ts`). The tail admits nothing but blocks: a
 * foreign line there (a section a hand placed after the registry) refuses rather than being
 * dropped, and the cure is to move it above the first block. A description a TOML basic
 * string cannot carry verbatim refuses as the adapter itself does.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';

import { CODEX_REGISTRY_PATH, specsOf } from './adapter-spec.js';
import { carriesTomlLineUnsafe } from './render-codex-adapter.js';
import type { SubagentDeclaration } from './subagent-declaration.js';

const BLOCK_HEADER = /^\[agents\."([^"]+)"\]$/u;
// A block field as TOML writes it, escapes admitted here so the render, not the split, is
// what judges a description the basic string cannot carry verbatim.
const BLOCK_FIELD = /^(?:description|config_file) = "(?:[^"\\]|\\.)*"$/u;

/**
 * Split the registry text into its hand-kept head and check that its tail holds blocks only.
 * The text is LF (the port LF-normalises every read); the head is every line before the
 * first block header, each with its newline, so a registry that starts with a block has an
 * empty head and one with no block is closed by the blank line the blocks follow; either
 * way the rendered registry splits to the same head again, so `--fix` is a fixpoint.
 *
 * @param path - The registry's repo-relative path, for the refusal.
 * @param text - The registry's full LF text.
 * @returns The head, or the refusal naming the first foreign line in the tail.
 */
export function splitCodexRegistry(path: string, text: string): Result<string, string> {
  const lines = text.split('\n');
  const first = lines.findIndex((line) => BLOCK_HEADER.test(line));
  if (first === -1) {
    return ok(closedHead(text));
  }
  const foreign = lines
    .slice(first)
    .find((line) => line !== '' && !BLOCK_HEADER.test(line) && !BLOCK_FIELD.test(line));
  if (foreign !== undefined) {
    return err(
      `${path}: line "${foreign}" sits in the registry tail, which the declarations render whole; move it above the first agents block; refusing to regenerate the sub-agent adapters`,
    );
  }
  return ok(
    lines
      .slice(0, first)
      .map((line) => `${line}\n`)
      .join(''),
  );
}

/** A head with no registry after it, closed by the blank line the first block needs. */
function closedHead(text: string): string {
  if (text === '') {
    return '';
  }
  const terminated = text.endsWith('\n') ? text : `${text}\n`;
  return terminated.endsWith('\n\n') ? terminated : `${terminated}\n`;
}

/**
 * Render the registry: the head verbatim, then one block per Codex adapter in name order.
 * The declarations are the set `renderSubagentAdapters` accepted, so no two specs share a
 * name (it refuses those first); called alone on such a set, two blocks would carry one
 * name.
 *
 * @param head - The hand-kept head as `splitCodexRegistry` returns it.
 * @param declarations - The templates' declarations, in any order.
 * @returns The registry text, or the refusal for a description the TOML form cannot carry.
 */
export function renderCodexRegistry(
  head: string,
  declarations: readonly SubagentDeclaration[],
): Result<string, string> {
  const specs = declarations
    .flatMap(specsOf)
    .filter((spec) => spec.platforms.includes('codex'))
    .sort((left, right) => left.name.localeCompare(right.name));
  const unsafe = specs.find((spec) => carriesTomlLineUnsafe(spec.description));
  if (unsafe !== undefined) {
    return err(
      `${CODEX_REGISTRY_PATH}: the description of ${unsafe.name} carries a character a TOML basic string cannot carry verbatim (a double quote, a backslash or a control character); refusing to render it`,
    );
  }
  const blocks = specs.map(
    (spec) =>
      `[agents."${spec.name}"]\ndescription = "${spec.description}"\nconfig_file = "agents/${spec.name}.toml"\n`,
  );
  return ok(`${head}${blocks.join('\n')}`);
}
