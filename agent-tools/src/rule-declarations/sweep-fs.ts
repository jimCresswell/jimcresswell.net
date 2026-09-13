/**
 * The file-system port of the rule-frontmatter sweep, with its `node:fs` default.
 *
 * The port classifies an entry before the sweep reads it: `entryKind` uses `lstat` on the path,
 * so its leaf entry is never followed and a symlinked source is refused rather than read or
 * written through (a link in an ancestor directory is outside this guard). Writes go through
 * the estate's atomic text writer (temp file, sync, rename), so a failed write never leaves a
 * half-written rule behind; `realSweepFs` takes the writer as a parameter so that property is
 * proven over an injected file system rather than asserted by name.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises';

import { writeTextAtomically } from '../collaboration-state/atomic-file.js';
import { isEnoent } from '../core/authored-surfaces.js';

/** The file-system operations the sweep needs; the real `node:fs` by default. */
export interface SweepFs {
  /**
   * What stands at a path, its leaf entry unfollowed: a regular file, nothing, or
   * anything else (a link, a directory, a special file).
   */
  entryKind: (absolutePath: string) => Promise<'file' | 'absent' | 'other'>;
  readFile: (absolutePath: string) => Promise<string>;
  writeFile: (absolutePath: string, text: string) => Promise<void>;
}

/**
 * The real file system: `lstat` classifies a linked leaf as itself, never as its target, and
 * every write goes through `writeFile`, the estate's atomic writer unless a caller injects one.
 */
export function realSweepFs(writeFile: SweepFs['writeFile'] = writeTextAtomically): SweepFs {
  return {
    entryKind: async (absolutePath) => {
      try {
        return (await fs.lstat(absolutePath)).isFile() ? 'file' : 'other';
      } catch (error: unknown) {
        if (isEnoent(error)) {
          return 'absent';
        }
        throw error;
      }
    },
    readFile: (absolutePath) => fs.readFile(absolutePath, 'utf8'),
    writeFile,
  };
}

/** The port the sweep uses when none is injected. */
export const defaultSweepFs: SweepFs = realSweepFs();
