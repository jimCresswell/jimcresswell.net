import { describe, expect, it } from 'vitest';

import { removeProjection, writeProjection } from './rule-projection-fs.js';
import {
  listDirectory,
  readEntry,
  type SurfaceFs,
  type UnfollowedStat,
} from './rule-surface-fs.js';

/**
 * The classify-before-act order of the surface port, proven over a tree that says what each
 * absolute path is when its leaf is left unfollowed: a link as the surface, as one of its
 * ancestors, or as the entry is refused before `readdir`, the no-follow read, the write or
 * the removal could act on it; a link swapped in between the classification and the open
 * is refused by the open itself; and only ENOENT reads as absence.
 */

const ROOT = '/repo';

type Entry = 'dir' | 'file' | 'link';

function stat(entry: Entry): UnfollowedStat {
  return { isFile: () => entry === 'file', isDirectory: () => entry === 'dir' };
}

function coded(message: string, code: string): Error {
  return Object.assign(new Error(message), { code });
}

/**
 * A tree keyed by absolute path. `acted` records every path `readdir`, `readUnfollowed`,
 * `mkdir`, `writeAtomically` or `remove` was asked for, so a cell can assert that a refused
 * entry was never followed or touched. The no-follow read models the real open: a link
 * fails with ELOOP, a directory with ENOTREGULAR, a file yields its text.
 */
function tree(
  entries: Readonly<Record<string, Entry>>,
  texts: Readonly<Record<string, string>> = {},
): SurfaceFs & { acted: string[] } {
  const acted: string[] = [];
  const kindOf = (absolutePath: string): Entry | undefined => entries[absolutePath];
  return {
    acted,
    lstat: async (absolutePath) => {
      const entry = kindOf(absolutePath);
      if (entry === undefined) {
        throw coded(`ENOENT: no such file or directory, '${absolutePath}'`, 'ENOENT');
      }
      return stat(entry);
    },
    readdir: async (absolutePath) => {
      acted.push(`readdir ${absolutePath}`);
      return Object.keys(entries)
        .filter((candidate) => candidate.startsWith(`${absolutePath}/`))
        .filter((candidate) => !candidate.slice(absolutePath.length + 1).includes('/'))
        .map((candidate) => {
          const entry = kindOf(candidate);
          return { name: candidate.slice(absolutePath.length + 1), isFile: () => entry === 'file' };
        });
    },
    readUnfollowed: async (absolutePath) => {
      acted.push(`read ${absolutePath}`);
      const entry = kindOf(absolutePath);
      if (entry === 'link') {
        throw coded(`ELOOP: too many symbolic links encountered, open '${absolutePath}'`, 'ELOOP');
      }
      if (entry === 'dir') {
        throw coded(`${absolutePath}: not a regular file`, 'ENOTREGULAR');
      }
      const text = texts[absolutePath];
      if (text === undefined) {
        throw coded(`ENOENT: no such file or directory, open '${absolutePath}'`, 'ENOENT');
      }
      return text;
    },
    mkdir: async (absolutePath) => {
      acted.push(`mkdir ${absolutePath}`);
    },
    writeAtomically: async (absolutePath, text) => {
      acted.push(`write ${absolutePath} ${text}`);
    },
    remove: async (absolutePath) => {
      acted.push(`remove ${absolutePath}`);
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
    expect(surfaceFs.acted).toStrictEqual(['readdir /repo/.claude/rules']);
  });

  it('refuses a surface that is itself a link, naming the surface, without listing through it', async () => {
    const surfaceFs = tree({ ...SURFACES, '/repo/.agents': 'dir', '/repo/.agents/rules': 'link' });
    expect(await listDirectory(ROOT, '.agents/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'foreign',
      entry: '.agents/rules',
    });
    expect(surfaceFs.acted).toStrictEqual([]);
  });

  it('refuses a surface whose ancestor is a link, naming the ancestor, without listing through it', async () => {
    const surfaceFs = tree({ ...SURFACES, '/repo/.agents': 'link', '/repo/.agents/rules': 'dir' });
    expect(await listDirectory(ROOT, '.agents/rules', '.md', surfaceFs)).toStrictEqual({
      kind: 'foreign',
      entry: '.agents',
    });
    expect(surfaceFs.acted).toStrictEqual([]);
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
  it('reads a regular file, a missing path as absent, and a link or directory as foreign without opening it', async () => {
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
    expect(surfaceFs.acted).toStrictEqual(['read /repo/.claude/rules/a.md']);
  });

  it('reads a link swapped in after the classification as foreign: the no-follow open refuses it', async () => {
    const swapped: SurfaceFs = {
      ...tree(SURFACES),
      readUnfollowed: async (absolutePath) => {
        throw coded(`ELOOP: too many symbolic links encountered, open '${absolutePath}'`, 'ELOOP');
      },
    };
    expect(await readEntry(ROOT, '.claude/rules/a.md', swapped)).toStrictEqual({
      kind: 'foreign',
    });
    const replaced: SurfaceFs = {
      ...tree(SURFACES),
      readUnfollowed: async (absolutePath) => {
        throw coded(`${absolutePath}: not a regular file`, 'ENOTREGULAR');
      },
    };
    expect(await readEntry(ROOT, '.claude/rules/a.md', replaced)).toStrictEqual({
      kind: 'foreign',
    });
  });

  it('reads a failure of the classification or the read other than ENOENT as unreadable', async () => {
    const surfaceFs: SurfaceFs = {
      ...tree(SURFACES),
      lstat: async () => {
        throw new Error('EACCES: permission denied');
      },
    };
    expect(await readEntry(ROOT, 'RULES_INDEX.md', surfaceFs)).toStrictEqual({
      kind: 'unreadable',
      cause: 'EACCES: permission denied',
    });
  });
});

describe('writeProjection', () => {
  it('writes atomically when every ancestor is a real directory and the leaf is absent or a regular file', async () => {
    const surfaceFs = tree(SURFACES);
    expect(await writeProjection(ROOT, '.claude/rules/a.md', 'new\n', surfaceFs)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(await writeProjection(ROOT, '.claude/rules/b.md', 'b\n', surfaceFs)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(surfaceFs.acted).toStrictEqual([
      'write /repo/.claude/rules/a.md new\n',
      'write /repo/.claude/rules/b.md b\n',
    ]);
  });

  it('creates an absent surface directory and writes into it', async () => {
    const surfaceFs = tree(SURFACES);
    expect(await writeProjection(ROOT, '.cursor/rules/a.mdc', 'a\n', surfaceFs)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(surfaceFs.acted).toStrictEqual([
      'mkdir /repo/.cursor/rules',
      'write /repo/.cursor/rules/a.mdc a\n',
    ]);
  });

  it('refuses, touching nothing, when an ancestor is a link or the leaf is not a regular file at the moment of the write', async () => {
    const linkedAncestor = tree({
      ...SURFACES,
      '/repo/.agents': 'link',
      '/repo/.agents/rules': 'dir',
    });
    expect(await writeProjection(ROOT, '.agents/rules/a.md', 'a\n', linkedAncestor)).toStrictEqual({
      ok: false,
      error: '.agents: not a directory at the moment of the write; refusing the projection write',
    });
    expect(linkedAncestor.acted).toStrictEqual([]);

    const linkedLeaf = tree({ ...SURFACES, '/repo/RULES_INDEX.md': 'link' });
    expect(await writeProjection(ROOT, 'RULES_INDEX.md', 'index\n', linkedLeaf)).toStrictEqual({
      ok: false,
      error:
        'RULES_INDEX.md: not a regular file at the moment of the write; refusing the projection write',
    });
    expect(linkedLeaf.acted).toStrictEqual([]);
  });
});

describe('removeProjection', () => {
  it('unlinks a regular-file leaf under real directories, and refuses a link or an absent leaf', async () => {
    const surfaceFs = tree({ ...SURFACES, '/repo/.claude/rules/gone.md': 'link' });
    expect(await removeProjection(ROOT, '.claude/rules/notes.txt', surfaceFs)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(await removeProjection(ROOT, '.claude/rules/gone.md', surfaceFs)).toStrictEqual({
      ok: false,
      error:
        '.claude/rules/gone.md: not a regular file at the moment of the removal; refusing to remove it',
    });
    expect(await removeProjection(ROOT, '.claude/rules/vanished.md', surfaceFs)).toStrictEqual({
      ok: false,
      error:
        '.claude/rules/vanished.md: not a regular file at the moment of the removal; refusing to remove it',
    });
    expect(surfaceFs.acted).toStrictEqual(['remove /repo/.claude/rules/notes.txt']);
  });

  it('refuses when the surface directory is a link or has vanished, never creating it', async () => {
    const linked = tree({ ...SURFACES, '/repo/.agents': 'dir', '/repo/.agents/rules': 'link' });
    expect(await removeProjection(ROOT, '.agents/rules/a.md', linked)).toStrictEqual({
      ok: false,
      error:
        '.agents/rules: not a directory at the moment of the write; refusing the projection write',
    });
    const vanished = tree(SURFACES);
    expect(await removeProjection(ROOT, '.cursor/rules/a.mdc', vanished)).toStrictEqual({
      ok: false,
      error: '.cursor/rules: vanished; refusing the projection write',
    });
    expect(vanished.acted).toStrictEqual([]);
  });
});
