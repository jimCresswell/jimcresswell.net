import { describe, expect, it } from 'vitest';

import {
  listDirectory,
  readEntry,
  type SurfaceFs,
  type UnfollowedStat,
} from './rule-surface-fs.js';

/**
 * The classify-before-follow order of the surface reads, proven over a tree that says what
 * each absolute path is when its leaf is left unfollowed: a link as the surface, as one of
 * its ancestors, or as the entry read is refused before `readdir` or `readFile` could follow
 * it, and only ENOENT reads as absence.
 */

const ROOT = '/repo';

type Entry = 'dir' | 'file' | 'link';

function stat(entry: Entry): UnfollowedStat {
  return { isFile: () => entry === 'file', isDirectory: () => entry === 'dir' };
}

function enoent(absolutePath: string): Error & { code: string } {
  return Object.assign(new Error(`ENOENT: no such file or directory, '${absolutePath}'`), {
    code: 'ENOENT',
  });
}

/**
 * A tree keyed by absolute path. `followed` records every path `readdir` or `readFile` was
 * asked for, so a cell can assert that a refused surface was never followed.
 */
function tree(
  entries: Readonly<Record<string, Entry>>,
  texts: Readonly<Record<string, string>> = {},
): SurfaceFs & { followed: string[] } {
  const followed: string[] = [];
  const kindOf = (absolutePath: string): Entry | undefined => entries[absolutePath];
  return {
    followed,
    lstat: async (absolutePath) => {
      const entry = kindOf(absolutePath);
      if (entry === undefined) {
        throw enoent(absolutePath);
      }
      return stat(entry);
    },
    readdir: async (absolutePath) => {
      followed.push(absolutePath);
      return Object.keys(entries)
        .filter((candidate) => candidate.startsWith(`${absolutePath}/`))
        .filter((candidate) => !candidate.slice(absolutePath.length + 1).includes('/'))
        .map((candidate) => {
          const entry = kindOf(candidate);
          return { name: candidate.slice(absolutePath.length + 1), isFile: () => entry === 'file' };
        });
    },
    readFile: async (absolutePath) => {
      followed.push(absolutePath);
      const text = texts[absolutePath];
      if (text === undefined) {
        throw enoent(absolutePath);
      }
      return text;
    },
  };
}

const SURFACES: Readonly<Record<string, Entry>> = {
  '/repo/.claude': 'dir',
  '/repo/.claude/rules': 'dir',
  '/repo/.claude/rules/a.md': 'file',
  '/repo/.claude/rules/notes.txt': 'file',
};

describe('listDirectory', () => {
  it('lists a real surface after classifying each ancestor, and reads a missing one as absent', async () => {
    const surfaceFs = tree(SURFACES);
    expect(await listDirectory(ROOT, '.claude/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'files',
      files: ['.claude/rules/a.md'],
      stray: ['.claude/rules/notes.txt'],
    });
    expect(await listDirectory(ROOT, '.cursor/rules', '.mdc', surfaceFs)).toStrictEqual({
      kind: 'absent',
    });
    expect(surfaceFs.followed).toStrictEqual(['/repo/.claude/rules']);
  });

  it('refuses a surface that is itself a link, naming the surface, without listing through it', async () => {
    const surfaceFs = tree({ ...SURFACES, '/repo/.agents': 'dir', '/repo/.agents/rules': 'link' });
    expect(await listDirectory(ROOT, '.agents/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'foreign',
      entry: '.agents/rules',
    });
    expect(surfaceFs.followed).toStrictEqual([]);
  });

  it('refuses a surface whose ancestor is a link, naming the ancestor, without listing through it', async () => {
    const surfaceFs = tree({ ...SURFACES, '/repo/.agents': 'link', '/repo/.agents/rules': 'dir' });
    expect(await listDirectory(ROOT, '.agents/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'foreign',
      entry: '.agents',
    });
    expect(surfaceFs.followed).toStrictEqual([]);
  });

  it('reads any failure other than ENOENT as unreadable with its cause', async () => {
    const surfaceFs: SurfaceFs = {
      ...tree(SURFACES),
      readdir: async () => {
        throw new Error('EACCES: permission denied');
      },
    };
    expect(await listDirectory(ROOT, '.claude/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'unreadable',
      cause: 'EACCES: permission denied',
    });
  });
});

describe('readEntry', () => {
  it('reads a regular file, a missing path as absent, and a link or directory as foreign without following it', async () => {
    const surfaceFs = tree(
      { ...SURFACES, '/repo/RULES_INDEX.md': 'link' },
      { '/repo/.claude/rules/a.md': 'a\r\n' },
    );
    expect(await readEntry(ROOT, '.claude/rules/a.md', surfaceFs)).toStrictEqual({
      kind: 'text',
      text: 'a\n',
    });
    expect(await readEntry(ROOT, 'missing.md', surfaceFs)).toStrictEqual({ kind: 'absent' });
    expect(await readEntry(ROOT, 'RULES_INDEX.md', surfaceFs)).toStrictEqual({ kind: 'foreign' });
    expect(await readEntry(ROOT, '.claude/rules', surfaceFs)).toStrictEqual({ kind: 'foreign' });
    expect(surfaceFs.followed).toStrictEqual(['/repo/.claude/rules/a.md']);
  });

  it('reads a failure of the classification or the read other than ENOENT as unreadable', async () => {
    const surfaceFs: SurfaceFs = {
      ...tree(SURFACES),
      lstat: async () => {
        throw new Error('ELOOP: too many symbolic links encountered');
      },
    };
    expect(await readEntry(ROOT, 'RULES_INDEX.md', surfaceFs)).toStrictEqual({
      kind: 'unreadable',
      cause: 'ELOOP: too many symbolic links encountered',
    });
  });
});
