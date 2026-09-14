import { describe, expect, it } from 'vitest';

import { readCodexAdapter, readMarkdownAdapter } from './adapter-sources.js';

/**
 * The hand-kept adapter readers: every field, the title, the template named, the pointer
 * shape and the note are read; a body that deviates from the platform's invariant skeleton
 * (the pre-pointer line, the stop after the path) is refused rather than dropped, so nothing
 * an adapter says is lost at the next render (the #77 round-two findings, 2026-09-14).
 */

const PRE_POINTER = {
  cursor: '**All file paths in this document are relative to the repository root.**',
  claude: 'All file paths are relative to the repository root.',
} as const;
const POINTER =
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.';

/** A Markdown adapter: the frontmatter lines, then the standard body unless another is given. */
function markdown(
  platform: keyof typeof PRE_POINTER,
  frontmatter: readonly string[],
  body: readonly string[] = ['# Alpha', '', PRE_POINTER[platform], '', POINTER, ''],
): string {
  return ['---', ...frontmatter, '---', '', ...body].join('\n');
}

const CLAUDE_ADAPTER = markdown(
  'claude',
  [
    'name: alpha',
    "description: 'Alpha reviews a.'",
    'tools: Read, Grep, Glob, Bash',
    'disallowedTools: Write, Edit',
    'permissionMode: plan',
  ],
  [
    '# Alpha',
    '',
    PRE_POINTER.claude,
    '',
    POINTER,
    '',
    'This file is a thin Claude Code adapter.',
    '',
    'Mode: Observe, analyse and report. Do not modify code.',
    '',
  ],
);

const CODEX_ADAPTER = [
  'name = "alpha"',
  'description = "Alpha reviews a."',
  'model_reasoning_effort = "high"',
  'sandbox_mode = "read-only"',
  '',
  'developer_instructions = """',
  'Read and follow `.agent/sub-agents/templates/alpha.md`.',
  '',
  'This file is a thin Codex adapter.',
  '"""',
  '',
].join('\n');

describe('readMarkdownAdapter', () => {
  it('reads the fields as strings, the title, a one-line pointer with a plain stop, and the note', () => {
    expect(readMarkdownAdapter('claude', '.claude/agents/alpha.md', CLAUDE_ADAPTER)).toStrictEqual({
      ok: true,
      value: {
        fields: new Map([
          ['name', 'alpha'],
          ['description', 'Alpha reviews a.'],
          ['tools', 'Read, Grep, Glob, Bash'],
          ['disallowedTools', 'Write, Edit'],
          ['permissionMode', 'plan'],
        ]),
        title: 'Alpha',
        template: 'alpha',
        pointerWrapped: false,
        pointerTail: '',
        note: 'This file is a thin Claude Code adapter.\n\nMode: Observe, analyse and report. Do not modify code.',
      },
    });
  });

  it('reads a wrapped pointer, and a pointer paragraph that continues past the path as the tail', () => {
    const wrapped = CLAUDE_ADAPTER.replace(
      POINTER,
      'Your first action MUST be to read and internalise\n`.agent/sub-agents/templates/alpha.md`,\nthen execute its procedure exactly.',
    );
    const read = readMarkdownAdapter('claude', '.claude/agents/alpha.md', wrapped);
    expect(read.ok ? read.value.pointerWrapped : read.error).toBe(true);
    expect(read.ok ? read.value.pointerTail : read.error).toBe(
      ',\nthen execute its procedure exactly.',
    );
    expect(read.ok ? read.value.note : read.error).toBe(
      'This file is a thin Claude Code adapter.\n\nMode: Observe, analyse and report. Do not modify code.',
    );
  });

  it('reads the frontmatter line by line as the platform does: a description that is not a YAML plain scalar is its value, and a body with no note is an empty note', () => {
    const read = readMarkdownAdapter(
      'claude',
      '.claude/agents/alpha.md',
      markdown('claude', ['name: alpha', 'description: Reviews a: the b, the c.']),
    );
    expect(read.ok ? read.value.fields.get('description') : read.error).toBe(
      'Reviews a: the b, the c.',
    );
    expect(read.ok ? read.value.note : read.error).toBe('');
  });

  it('reads a quoted scalar as YAML reads it (a doubled quote, a backslash escape, a folded block), and refuses text that is not one scalar', () => {
    const single = readMarkdownAdapter(
      'cursor',
      '.cursor/agents/alpha.md',
      markdown('cursor', ['name: alpha', "description: 'Wilma''s lens.'"]),
    );
    expect(single.ok ? single.value.fields.get('description') : single.error).toBe("Wilma's lens.");
    const double = readMarkdownAdapter(
      'claude',
      '.claude/agents/alpha.md',
      markdown('claude', ['name: alpha', String.raw`description: "Says \"go\"."`]),
    );
    expect(double.ok ? double.value.fields.get('description') : double.error).toBe('Says "go".');
    const folded = readMarkdownAdapter(
      'cursor',
      '.cursor/agents/alpha.md',
      markdown('cursor', [
        'name: alpha',
        'description: >-',
        '  Fast check.',
        '  Returns a verdict.',
      ]),
    );
    expect(folded.ok ? folded.value.fields.get('description') : folded.error).toBe(
      'Fast check. Returns a verdict.',
    );
    expect(
      readMarkdownAdapter(
        'claude',
        '.claude/agents/alpha.md',
        markdown('claude', ['name: alpha', "description: 'a' and 'b'"]),
      ),
    ).toStrictEqual({
      ok: false,
      error: ".claude/agents/alpha.md: field \"description\" is not a quoted scalar: 'a' and 'b'",
    });
  });

  it('refuses a list-valued field, an unknown key and a field with no value, each naming the adapter', () => {
    const path = '.claude/agents/alpha.md';
    expect(
      readMarkdownAdapter(
        'claude',
        path,
        markdown('claude', ['name: alpha', 'tools:', '  - Read']),
      ),
    ).toStrictEqual({ ok: false, error: `${path}: unparseable frontmatter line 4:   - Read` });
    expect(
      readMarkdownAdapter(
        'claude',
        path,
        markdown('claude', ['name: alpha', 'hooks:', '  PreToolUse: x']),
      ),
    ).toStrictEqual({ ok: false, error: `${path}: unknown frontmatter key "hooks"` });
    expect(
      readMarkdownAdapter('claude', path, markdown('claude', ['name: alpha', 'tools:'])),
    ).toStrictEqual({ ok: false, error: `${path}: field "tools" carries no value` });
    // An empty quoted scalar is the same absence in a second shape (the code-expert's probe).
    expect(
      readMarkdownAdapter('claude', path, markdown('claude', ['name: alpha', "description: ''"])),
    ).toStrictEqual({ ok: false, error: `${path}: field "description" carries no value` });
    expect(
      readMarkdownAdapter('claude', path, markdown('claude', ['name: alpha', 'tools: ""'])),
    ).toStrictEqual({ ok: false, error: `${path}: field "tools" carries no value` });
  });

  it('reads only a title above the pointer', () => {
    const late = readMarkdownAdapter(
      'claude',
      '.claude/agents/alpha.md',
      markdown(
        'claude',
        ['name: alpha'],
        [PRE_POINTER.claude, '', POINTER, '', '# Not the title', ''],
      ),
    );
    expect(late.ok ? late.value.title : late.error).toBeUndefined();
  });

  it('refuses a body whose line before the pointer is not the platform skeleton, naming the line, so a changed or added line is never dropped', () => {
    const path = '.claude/agents/alpha.md';
    expect(
      readMarkdownAdapter(
        'claude',
        path,
        markdown(
          'claude',
          ['name: alpha'],
          ['# Alpha', '', 'Paths are relative.', '', POINTER, ''],
        ),
      ),
    ).toStrictEqual({
      ok: false,
      error: `${path}: the line before the pointer is not the platform's ("Paths are relative."); the sweep carries no place for it`,
    });
    expect(
      readMarkdownAdapter(
        'claude',
        path,
        markdown(
          'claude',
          ['name: alpha'],
          ['# Alpha', '', PRE_POINTER.claude, '', 'Read the glossary first.', '', POINTER, ''],
        ),
      ),
    ).toStrictEqual({
      ok: false,
      error: `${path}: the line before the pointer is not the platform's ("Read the glossary first."); the sweep carries no place for it`,
    });
    expect(
      readMarkdownAdapter(
        'claude',
        path,
        markdown('claude', ['name: alpha'], ['# Alpha', '', POINTER, '']),
      ),
    ).toStrictEqual({
      ok: false,
      error: `${path}: the line before the pointer is not the platform's (missing); the sweep carries no place for it`,
    });
    // A preamble above the title is the same class (the code-expert's probe, 2026-09-14).
    expect(
      readMarkdownAdapter(
        'claude',
        path,
        markdown(
          'claude',
          ['name: alpha'],
          [
            'Preamble the sweep never carries.',
            '',
            '# Alpha',
            '',
            PRE_POINTER.claude,
            '',
            POINTER,
            '',
          ],
        ),
      ),
    ).toStrictEqual({
      ok: false,
      error: `${path}: the line before the pointer is not the platform's ("Preamble the sweep never carries."); the sweep carries no place for it`,
    });
    // The Cursor skeleton is the bold form; the Claude form on a Cursor adapter is a deviation.
    expect(
      readMarkdownAdapter(
        'cursor',
        '.cursor/agents/alpha.md',
        markdown('cursor', ['name: alpha'], ['# Alpha', '', PRE_POINTER.claude, '', POINTER, '']),
      ).ok,
    ).toBe(false);
  });

  it('refuses a pointer sentence that ends right after the path: a missing stop is never normalised away', () => {
    const path = '.claude/agents/alpha.md';
    expect(
      readMarkdownAdapter(
        'claude',
        path,
        markdown(
          'claude',
          ['name: alpha'],
          ['# Alpha', '', PRE_POINTER.claude, '', POINTER.slice(0, -1), ''],
        ),
      ),
    ).toStrictEqual({
      ok: false,
      error: `${path}: the pointer sentence ends after its path without a stop`,
    });
  });

  it('refuses an adapter with no block, an unclosed block, no pointer sentence, or a pointer with no path', () => {
    const path = '.claude/agents/alpha.md';
    expect(readMarkdownAdapter('claude', path, '# Alpha\n')).toStrictEqual({
      ok: false,
      error: `${path}: no frontmatter block`,
    });
    expect(readMarkdownAdapter('claude', path, '---\nname: alpha\n')).toStrictEqual({
      ok: false,
      error: `${path}: frontmatter block never closes`,
    });
    expect(
      readMarkdownAdapter('claude', path, markdown('claude', ['name: alpha'], ['# Alpha', ''])),
    ).toStrictEqual({ ok: false, error: `${path}: no template pointer sentence` });
    expect(
      readMarkdownAdapter(
        'claude',
        path,
        markdown(
          'claude',
          ['name: alpha'],
          [
            '# Alpha',
            '',
            PRE_POINTER.claude,
            '',
            'Your first action MUST be to read and internalise the template.',
            '',
          ],
        ),
      ),
    ).toStrictEqual({ ok: false, error: `${path}: the template pointer names no path` });
  });

  it('refuses a pointer whose path is not a template path, and carries the template a valid one names', () => {
    expect(
      readMarkdownAdapter(
        'claude',
        '.claude/agents/alpha.md',
        markdown(
          'claude',
          ['name: alpha'],
          [
            '# Alpha',
            '',
            PRE_POINTER.claude,
            '',
            'Your first action MUST be to read and internalise `docs/alpha.md`.',
            '',
          ],
        ),
      ),
    ).toStrictEqual({
      ok: false,
      error:
        '.claude/agents/alpha.md: the template pointer names "docs/alpha.md", not a template path',
    });
    const variant = readMarkdownAdapter(
      'cursor',
      '.cursor/agents/cricket-high.md',
      markdown(
        'cursor',
        ['name: cricket-high'],
        [
          '# Cricket — High',
          '',
          PRE_POINTER.cursor,
          '',
          'Your first action MUST be to read and internalise `.agent/sub-agents/templates/cricket.md`.',
          '',
        ],
      ),
    );
    expect(variant.ok ? variant.value.template : variant.error).toBe('cricket');
  });
});

describe('readCodexAdapter', () => {
  it('reads the flat fields, no title, and the note after the pointer line', () => {
    expect(readCodexAdapter('.codex/agents/alpha.toml', CODEX_ADAPTER)).toStrictEqual({
      ok: true,
      value: {
        fields: new Map([
          ['name', 'alpha'],
          ['description', 'Alpha reviews a.'],
          ['model_reasoning_effort', 'high'],
          ['sandbox_mode', 'read-only'],
        ]),
        title: undefined,
        template: 'alpha',
        pointerWrapped: false,
        pointerTail: '',
        note: 'This file is a thin Codex adapter.',
      },
    });
  });

  it('refuses content after the instructions block, so no field placed there is dropped', () => {
    expect(
      readCodexAdapter(
        '.codex/agents/alpha.toml',
        `${CODEX_ADAPTER}\n# a comment is fine\nmodel = "gpt-5"\n`,
      ),
    ).toStrictEqual({
      ok: false,
      error:
        '.codex/agents/alpha.toml: content after the developer_instructions block is not read: model = "gpt-5"',
    });
    expect(
      readCodexAdapter('.codex/agents/alpha.toml', `${CODEX_ADAPTER}\n# only a comment\n`).ok,
    ).toBe(true);
  });

  it('refuses a head line that is not a key = "value" field, and a key that appears twice, so no value is dropped', () => {
    expect(
      readCodexAdapter(
        '.codex/agents/alpha.toml',
        'name = "alpha"\nmax_turns = 5\n\ndeveloper_instructions = """\nRead and follow `.agent/sub-agents/templates/alpha.md`.\n"""\n',
      ),
    ).toStrictEqual({
      ok: false,
      error: '.codex/agents/alpha.toml: line "max_turns = 5" is not a key = "value" field',
    });
    expect(
      readCodexAdapter(
        '.codex/agents/alpha.toml',
        CODEX_ADAPTER.replace('sandbox_mode = "read-only"', 'description = "Alpha, again."'),
      ),
    ).toStrictEqual({
      ok: false,
      error: '.codex/agents/alpha.toml: key "description" appears twice',
    });
  });

  it('refuses instruction lines before the pointer, naming the first, so they are never dropped', () => {
    expect(
      readCodexAdapter(
        '.codex/agents/alpha.toml',
        CODEX_ADAPTER.replace('Read and follow', 'Paths are relative.\n\nRead and follow'),
      ),
    ).toStrictEqual({
      ok: false,
      error:
        '.codex/agents/alpha.toml: instructions before the pointer are not read: "Paths are relative."',
    });
  });

  it('refuses an adapter with no instructions block, an unclosed one, or no pointer line', () => {
    expect(readCodexAdapter('.codex/agents/alpha.toml', 'name = "alpha"\n')).toStrictEqual({
      ok: false,
      error: '.codex/agents/alpha.toml: no developer_instructions block',
    });
    expect(
      readCodexAdapter(
        '.codex/agents/alpha.toml',
        'developer_instructions = """\nRead and follow `x`.\n',
      ),
    ).toStrictEqual({
      ok: false,
      error: '.codex/agents/alpha.toml: developer_instructions block never closes',
    });
    expect(
      readCodexAdapter(
        '.codex/agents/alpha.toml',
        'developer_instructions = """\nDo the thing.\n"""\n',
      ),
    ).toStrictEqual({
      ok: false,
      error: '.codex/agents/alpha.toml: no template pointer line',
    });
  });
});
