import { typeSafeEntries } from '@engraph/type-helpers';

import { isJsonObject } from '../../core/json.js';

import { citationsInCommandText } from './extract-script-citations.js';
import {
  resolveCitation,
  type MissingScriptFinding,
  type WorkspaceScripts,
} from './validate-cited-scripts-helpers.js';

/**
 * The commands a gate actually runs, read for filtered pnpm calls:
 * package.json scripts, the git hooks and the CI workflow steps. pnpm exits 0
 * without running anything when a `--filter` matches no workspace project
 * (the pinned pnpm 12 honours `--fail-if-no-match` only as a command-line
 * flag, never as workspace config), so a renamed or mistyped package would
 * turn every call that names it into a silent pass. Every filtered call on
 * these surfaces must therefore name a real workspace and a script it
 * defines. Unfiltered calls are left alone: their scope depends on the
 * directory they run in, and pnpm exits 1 for a missing script without a
 * filter, at the root or in a workspace (probed on pnpm 12.4.2, 2026-09-25),
 * so they cannot pass silently.
 *
 * @packageDocumentation
 */

/** One line of command text and where it sits in its file. */
export interface CommandLine {
  /** 1-based line number in the file. */
  readonly line: number;
  readonly text: string;
}

/** A file whose lines are commands a gate runs. */
export interface CommandSurface {
  /** Repo-relative path. */
  readonly path: string;
  readonly lines: readonly CommandLine[];
}

/** A YAML key whose value is a folded block scalar (`run: >`, `>-` or `>+`). */
const FOLDED_BLOCK_KEY = /:\s*>[-+]?\s*$/;

/**
 * Every command of a hook or a workflow, one per entry, numbered by the line
 * it starts on. A shell continuation (a line ending in `\`) and a folded
 * YAML value are joined into the one command they spell, so a filter and its
 * script split across lines are read together.
 */
export function linesOfCommandFile(content: string): readonly CommandLine[] {
  const lines = content.split('\n');
  const commands: CommandLine[] = [];
  let index = 0;
  while (index < lines.length) {
    const text = lines[index] ?? '';
    if (FOLDED_BLOCK_KEY.test(text)) {
      commands.push({ line: index + 1, text });
      const folded = foldedBlock(lines, index);
      if (folded.command !== undefined) {
        commands.push(folded.command);
      }
      index = folded.end + 1;
      continue;
    }
    const start = index;
    let joined = text;
    while (joined.trimEnd().endsWith('\\') && index + 1 < lines.length) {
      index += 1;
      joined = `${joined.trimEnd().slice(0, -1).trimEnd()} ${(lines[index] ?? '').trimStart()}`;
    }
    commands.push({ line: start + 1, text: joined });
    index += 1;
  }
  return commands;
}

/**
 * The one command a folded block after `keyIndex` spells, numbered by its
 * first line, and the index of the block's last line.
 */
function foldedBlock(
  lines: readonly string[],
  keyIndex: number,
): { readonly command: CommandLine | undefined; readonly end: number } {
  const end = foldedBlockEnd(lines, keyIndex);
  const body = lines.slice(keyIndex + 1, end + 1);
  const offset = body.findIndex((text) => text.trim().length > 0);
  const parts = body.map((text) => text.trim()).filter((text) => text.length > 0);
  const command =
    offset === -1 ? undefined : { line: keyIndex + offset + 2, text: parts.join(' ') };
  return { command, end };
}

/** The index of a folded block's last line: the last before a line indented no deeper than its key. */
function foldedBlockEnd(lines: readonly string[], keyIndex: number): number {
  const keyIndent = indentOf(lines[keyIndex] ?? '');
  let end = keyIndex;
  for (let index = keyIndex + 1; index < lines.length; index += 1) {
    const text = lines[index] ?? '';
    if (text.trim().length > 0 && indentOf(text) <= keyIndent) {
      break;
    }
    end = index;
  }
  return end;
}

function indentOf(text: string): number {
  return text.length - text.trimStart().length;
}

/** Each script's command in a package.json text, numbered by the line that declares it. */
export function scriptLinesOfManifest(manifestText: string): readonly CommandLine[] {
  const parsed: unknown = JSON.parse(manifestText);
  const scripts = isJsonObject(parsed) ? parsed.scripts : undefined;
  if (!isJsonObject(scripts)) {
    return [];
  }
  const fileLines = manifestText.split('\n');
  const scriptsAt = fileLines.findIndex((text) => text.includes('"scripts":'));
  const commands: CommandLine[] = [];
  for (const [name, command] of typeSafeEntries(scripts)) {
    if (typeof command === 'string') {
      const key = `${JSON.stringify(name)}:`;
      const at = fileLines.findIndex((text, index) => index > scriptsAt && text.includes(key));
      commands.push({ line: at + 1, text: command });
    }
  }
  return commands;
}

/** Filtered pnpm calls on the surfaces that name no workspace, or no script it defines. */
export function findMissingFilteredCommands(
  surfaces: readonly CommandSurface[],
  scripts: WorkspaceScripts,
): readonly MissingScriptFinding[] {
  return surfaces.flatMap((surface) =>
    surface.lines.flatMap(({ line, text }) =>
      citationsInCommandText(text, line)
        .filter((citation) => citation.workspaceFilter !== undefined)
        .map((citation) => resolveCitation(surface.path, citation, scripts))
        .filter((finding) => finding !== undefined),
    ),
  );
}
