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

/** Every line of a hook or a workflow, read as command text. */
export function linesOfCommandFile(content: string): readonly CommandLine[] {
  return content.split('\n').map((text, index) => ({ line: index + 1, text }));
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
