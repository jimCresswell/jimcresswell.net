/**
 * The file-system port of the rule-frontmatter sweep, with its `node:fs` default.
 *
 * The port classifies an entry before the sweep reads it: `entryKind` uses `lstat` on the path,
 * so its leaf entry is never followed and a symlinked source is refused rather than read or
 * written through (a link in an ancestor directory is outside this guard).
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises';

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

/** The real file system: `lstat` classifies a linked leaf as itself, never as its target. */
export const defaultSweepFs: SweepFs = {
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
  writeFile: (absolutePath, text) => fs.writeFile(absolutePath, text, 'utf8'),
};
