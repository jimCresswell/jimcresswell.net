import { describe, expect, it } from 'vitest';

import type { SweepFs } from '../rule-declarations/sweep-fs.js';

import { sweepSubagentFrontmatter, type SweepInput } from './sweep-subagent-frontmatter.js';

const REPO = '/repo';

/** The template an adapter points at: itself, or the fan-out parent of a `cricket-` variant. */
function templateOf(name: string): string {
  return name.startsWith('cricket-') ? 'cricket' : name;
}

const CURSOR_CLOSING = [
  'This file is a thin Cursor adapter. The canonical reviewer instructions live in the',
  'template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
];
const CLAUDE_CLOSING = [
  'This file is a thin Claude Code adapter. The canonical reviewer instructions live in the',
  'template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
];
const CODEX_CLOSING = [
  'This file is a thin Codex adapter. The canonical reviewer instructions live in',
  'the template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
];

function cursorAdapter(name: string, description: string, closing = CURSOR_CLOSING): string {
  return [
    '---',
    `name: ${name}`,
    `description: '${description}'`,
    'readonly: true',
    '---',
    '',
    `# ${name === 'alpha' ? 'Alpha' : 'Cricket — High Effort'}`,
    '',
    `Your first action MUST be to read and internalise \`.agent/sub-agents/templates/${templateOf(name)}.md\`.`,
    '',
    ...closing,
    '',
  ].join('\n');
}

function claudeAdapter(name: string, description: string, closing = CLAUDE_CLOSING): string {
  return [
    '---',
    `name: ${name}`,
    `description: '${description}'`,
    'tools: Read, Grep, Glob, Bash',
    'disallowedTools: Write, Edit',
    'permissionMode: plan',
    '---',
    '',
    `# ${name === 'alpha' ? 'Alpha' : 'Cricket — High Effort'}`,
    '',
    `Your first action MUST be to read and internalise \`.agent/sub-agents/templates/${templateOf(name)}.md\`.`,
    '',
    ...closing,
    '',
  ].join('\n');
}

function codexAdapter(name: string, description: string): string {
  return [
    `name = "${name}"`,
    `description = "${description}"`,
    'model_reasoning_effort = "high"',
    '',
    'developer_instructions = """',
    `Read and follow \`.agent/sub-agents/templates/${templateOf(name)}.md\`.`,
    '',
    ...CODEX_CLOSING,
    '"""',
    '',
  ].join('\n');
}

const ALPHA = 'Alpha reviews a.';
const HIGH = 'Fast high-effort check.';

/** A role on three platforms, and a fan-out with one variant on two. */
const agreeingTree = new Map<string, string>([
  [`${REPO}/.agent/sub-agents/templates/alpha.md`, '## Delegation Triggers\n\nAlpha body.\n'],
  [`${REPO}/.agent/sub-agents/templates/cricket.md`, '## Delegation Triggers\n\nCricket body.\n'],
  [`${REPO}/.cursor/agents/alpha.md`, cursorAdapter('alpha', ALPHA)],
  [`${REPO}/.claude/agents/alpha.md`, claudeAdapter('alpha', ALPHA)],
  [`${REPO}/.codex/agents/alpha.toml`, codexAdapter('alpha', ALPHA)],
  [
    `${REPO}/.cursor/agents/cricket-high.md`,
    cursorAdapter('cricket-high', HIGH, ['Cursor prose.']),
  ],
  [
    `${REPO}/.claude/agents/cricket-high.md`,
    claudeAdapter('cricket-high', HIGH, ['Claude prose.']),
  ],
]);

/**
 * An in-memory tree keyed by absolute POSIX path; `other` names the entries that are not
 * regular files, `denied` the regular files whose read fails with EACCES; writes are
 * recorded, never applied.
 */
function fakeFs(
  files: ReadonlyMap<string, string>,
  other: ReadonlySet<string> = new Set(),
  denied: ReadonlySet<string> = new Set(),
): SweepFs & { writes: Map<string, string> } {
  const writes = new Map<string, string>();
  return {
    writes,
    entryKind: async (absolutePath) => {
      if (other.has(absolutePath)) {
        return 'other';
      }
      return files.has(absolutePath) ? 'file' : 'absent';
    },
    readFile: async (absolutePath) => {
      if (denied.has(absolutePath)) {
        throw new Error('EACCES: permission denied');
      }
      const content = files.get(absolutePath);
      if (content === undefined) {
        throw Object.assign(new Error(`ENOENT: ${absolutePath}`), { code: 'ENOENT' });
      }
      return content;
    },
    writeFile: async (absolutePath, text) => {
      writes.set(absolutePath, text);
    },
  };
}

function input(sweepFs: SweepFs, write: boolean, overrides: Partial<SweepInput> = {}): SweepInput {
  return {
    repoRoot: REPO,
    templateNames: ['alpha', 'cricket'],
    adapterNames: {
      cursor: ['alpha', 'cricket-high'],
      claude: ['alpha', 'cricket-high'],
      codex: ['alpha'],
    },
    write,
    sweepFs,
    ...overrides,
  };
}

describe('sweepSubagentFrontmatter', () => {
  it('derives a role and a fan-out and writes each block above the unchanged template text', async () => {
    const fs = fakeFs(agreeingTree);
    const outcome = await sweepSubagentFrontmatter(input(fs, true));
    expect(outcome.refused).toEqual([]);
    expect(outcome.reconciliations).toEqual([]);
    expect(outcome.written).toEqual([
      '.agent/sub-agents/templates/alpha.md',
      '.agent/sub-agents/templates/cricket.md',
    ]);
    expect(fs.writes.get(`${REPO}/.agent/sub-agents/templates/alpha.md`)).toBe(
      '---\ndescription: Alpha reviews a.\n---\n\n## Delegation Triggers\n\nAlpha body.\n',
    );
    expect(fs.writes.get(`${REPO}/.agent/sub-agents/templates/cricket.md`)).toBe(
      [
        '---',
        'variants:',
        '  - name: cricket-high',
        '    platforms:',
        '      - cursor',
        '      - claude',
        '    description: Fast high-effort check.',
        '    title: Cricket — High Effort',
        '    cursor:',
        '      note: Cursor prose.',
        '    claude:',
        '      tools: Read, Grep, Glob, Bash',
        '      disallowedTools: Write, Edit',
        '      permissionMode: plan',
        '      note: Claude prose.',
        '---',
        '',
        '## Delegation Triggers',
        '',
        'Cricket body.',
        '',
      ].join('\n'),
    );
  });

  it('writes nothing on a dry run and still reports the declarations', async () => {
    const fs = fakeFs(agreeingTree);
    const outcome = await sweepSubagentFrontmatter(input(fs, false));
    expect(outcome.written).toEqual([]);
    expect(outcome.declarations.map((declaration) => declaration.name)).toEqual([
      'alpha',
      'cricket',
    ]);
    expect(fs.writes.size).toBe(0);
  });

  it('leaves a template that already carries a block alone and reports it', async () => {
    const tree = new Map(agreeingTree);
    tree.set(
      `${REPO}/.agent/sub-agents/templates/alpha.md`,
      '---\ndescription: a\n---\n\nAlpha.\n',
    );
    const fs = fakeFs(tree);
    const outcome = await sweepSubagentFrontmatter(input(fs, true));
    expect(outcome.alreadyDeclared).toEqual(['alpha']);
    expect(outcome.written).toEqual(['.agent/sub-agents/templates/cricket.md']);
    expect(outcome.declarations.map((declaration) => declaration.name)).toEqual(['cricket']);
  });

  it('lists a disagreeing description as a reconciliation and keeps the Claude one', async () => {
    const tree = new Map(agreeingTree);
    tree.set(`${REPO}/.cursor/agents/alpha.md`, cursorAdapter('alpha', 'Alpha, for Cursor.'));
    const outcome = await sweepSubagentFrontmatter(input(fakeFs(tree), false));
    expect(outcome.reconciliations).toEqual([
      {
        adapter: 'alpha',
        field: 'description',
        kept: ALPHA,
        dropped: [{ platform: 'cursor', value: 'Alpha, for Cursor.' }],
      },
    ]);
  });

  it('refuses the whole sweep, writing nothing, when an adapter belongs to no template', async () => {
    const tree = new Map(agreeingTree);
    tree.set(`${REPO}/.claude/agents/omega.md`, claudeAdapter('omega', 'Omega.'));
    const fs = fakeFs(tree);
    const outcome = await sweepSubagentFrontmatter(
      input(fs, true, {
        adapterNames: {
          cursor: ['alpha', 'cricket-high'],
          claude: ['alpha', 'cricket-high', 'omega'],
          codex: ['alpha'],
        },
      }),
    );
    expect(outcome.refused).toEqual(['omega: an adapter under no template']);
    expect(outcome.written).toEqual([]);
    expect(fs.writes.size).toBe(0);
  });

  it('refuses a template with no adapter, and one with adapters under its own name and under variant names', async () => {
    const withBeta = new Map(agreeingTree);
    withBeta.set(`${REPO}/.agent/sub-agents/templates/beta.md`, '## Delegation Triggers\n');
    const fs = fakeFs(withBeta);
    const orphan = await sweepSubagentFrontmatter(
      input(fs, true, { templateNames: ['alpha', 'cricket', 'beta'] }),
    );
    expect(orphan.refused).toEqual(['beta: no adapter on any platform']);
    expect(fs.writes.size).toBe(0);

    const tree = new Map(agreeingTree);
    tree.set(`${REPO}/.claude/agents/cricket.md`, claudeAdapter('cricket', 'Cricket itself.'));
    const both = await sweepSubagentFrontmatter(
      input(fakeFs(tree), true, {
        adapterNames: {
          cursor: ['alpha', 'cricket-high'],
          claude: ['alpha', 'cricket', 'cricket-high'],
          codex: ['alpha'],
        },
      }),
    );
    expect(both.refused).toEqual(['cricket: adapters under its own name and under variant names']);
  });

  it("checks a declared template's adapter group too: none, both shapes, or a shape off its declared kind refuses", async () => {
    const declaredBeta = new Map(agreeingTree);
    declaredBeta.set(
      `${REPO}/.agent/sub-agents/templates/beta.md`,
      '---\ndescription: b\n---\n\nBeta.\n',
    );
    const none = await sweepSubagentFrontmatter(
      input(fakeFs(declaredBeta), true, { templateNames: ['alpha', 'cricket', 'beta'] }),
    );
    expect(none.refused).toEqual(['beta: no adapter on any platform']);

    const declaredCricket = new Map(agreeingTree);
    declaredCricket.set(
      `${REPO}/.agent/sub-agents/templates/cricket.md`,
      '---\nvariants:\n  - name: cricket-high\n    platforms:\n      - cursor\n      - claude\n    description: h\n---\n\nCricket.\n',
    );
    declaredCricket.set(`${REPO}/.claude/agents/cricket.md`, claudeAdapter('cricket', 'C.'));
    const both = await sweepSubagentFrontmatter(
      input(fakeFs(declaredCricket), true, {
        adapterNames: {
          cursor: ['alpha', 'cricket-high'],
          claude: ['alpha', 'cricket', 'cricket-high'],
          codex: ['alpha'],
        },
      }),
    );
    expect(both.refused).toEqual(['cricket: adapters under its own name and under variant names']);

    const kinds = new Map(agreeingTree);
    kinds.set(
      `${REPO}/.agent/sub-agents/templates/alpha.md`,
      '---\nvariants:\n  - name: alpha-x\n    platforms:\n      - claude\n    description: x\n---\n\nAlpha.\n',
    );
    kinds.set(
      `${REPO}/.agent/sub-agents/templates/cricket.md`,
      '---\ndescription: c\n---\n\nCricket.\n',
    );
    const offKind = await sweepSubagentFrontmatter(input(fakeFs(kinds), true));
    expect(offKind.refused).toEqual([
      'alpha: declared as a fan-out but has an adapter under its own name',
      'cricket: declared as a role but its adapters are under variant names',
    ]);
    expect(offKind.written).toEqual([]);
  });

  it('refuses an adapter whose name field is not its basename, and one whose pointer names another template', async () => {
    const renamed = new Map(agreeingTree);
    renamed.set(
      `${REPO}/.claude/agents/alpha.md`,
      claudeAdapter('alpha', ALPHA).replace('name: alpha', 'name: alfa'),
    );
    const renamedOutcome = await sweepSubagentFrontmatter(input(fakeFs(renamed), true));
    expect(renamedOutcome.refused).toEqual([
      '.claude/agents/alpha.md: name "alfa" is not the basename "alpha"',
    ]);

    const misPointed = new Map(agreeingTree);
    misPointed.set(
      `${REPO}/.claude/agents/alpha.md`,
      claudeAdapter('alpha', ALPHA).replace('templates/alpha.md', 'templates/cricket.md'),
    );
    misPointed.set(
      `${REPO}/.cursor/agents/cricket-high.md`,
      cursorAdapter('cricket-high', HIGH, ['Cursor prose.']).replace(
        'templates/cricket.md',
        'templates/alpha.md',
      ),
    );
    const misPointedOutcome = await sweepSubagentFrontmatter(input(fakeFs(misPointed), true));
    expect(misPointedOutcome.refused).toEqual([
      'alpha: claude adapter points at template "cricket", not "alpha"',
      'cricket-high: cursor adapter points at template "alpha", not "cricket"',
    ]);
    expect(misPointedOutcome.written).toEqual([]);
  });

  it('refuses a missing adapter, a linked one, and an unreadable template, naming each, and writes nothing', async () => {
    const missing = new Map(agreeingTree);
    missing.delete(`${REPO}/.codex/agents/alpha.toml`);
    expect((await sweepSubagentFrontmatter(input(fakeFs(missing), true))).refused).toEqual([
      '.codex/agents/alpha.toml: missing',
    ]);

    const linked = fakeFs(agreeingTree, new Set([`${REPO}/.cursor/agents/alpha.md`]));
    const linkedOutcome = await sweepSubagentFrontmatter(input(linked, true));
    expect(linkedOutcome.refused).toEqual([
      '.cursor/agents/alpha.md: not a regular file (a symlink or special entry); the sweep reads and writes regular files only',
    ]);
    expect(linked.writes.size).toBe(0);

    const denied = fakeFs(
      agreeingTree,
      new Set(),
      new Set([`${REPO}/.agent/sub-agents/templates/alpha.md`]),
    );
    const deniedOutcome = await sweepSubagentFrontmatter(input(denied, true));
    expect(deniedOutcome.refused).toEqual([
      '.agent/sub-agents/templates/alpha.md: unreadable (EACCES: permission denied)',
    ]);
    expect(denied.writes.size).toBe(0);
  });

  it('refuses an adapter the reader cannot parse, naming the path, and writes nothing', async () => {
    const tree = new Map(agreeingTree);
    tree.set(`${REPO}/.claude/agents/alpha.md`, '# Alpha\n\nNo block.\n');
    const fs = fakeFs(tree);
    const outcome = await sweepSubagentFrontmatter(input(fs, true));
    expect(outcome.refused).toEqual(['.claude/agents/alpha.md: no frontmatter block']);
    expect(fs.writes.size).toBe(0);
  });
});
