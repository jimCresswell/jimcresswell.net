import { describe, expect, it } from 'vitest';

import { readCodexAdapter, readMarkdownAdapter } from './adapter-sources.js';

const CLAUDE_ADAPTER = [
  '---',
  'name: alpha',
  "description: 'Alpha reviews a.'",
  'tools: Read, Grep, Glob, Bash',
  'disallowedTools: Write, Edit',
  'permissionMode: plan',
  '---',
  '',
  '# Alpha',
  '',
  'All file paths are relative to the repository root.',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.',
  '',
  'This file is a thin Claude Code adapter.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
  '',
].join('\n');

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
    expect(readMarkdownAdapter('.claude/agents/alpha.md', CLAUDE_ADAPTER)).toStrictEqual({
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
      'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.',
      'Your first action MUST be to read and internalise\n`.agent/sub-agents/templates/alpha.md`,\nthen execute its procedure exactly.',
    );
    const read = readMarkdownAdapter('.claude/agents/alpha.md', wrapped);
    expect(read.ok ? read.value.pointerWrapped : read.error).toBe(true);
    expect(read.ok ? read.value.pointerTail : read.error).toBe(
      ',\nthen execute its procedure exactly.',
    );
    expect(read.ok ? read.value.note : read.error).toBe(
      'This file is a thin Claude Code adapter.\n\nMode: Observe, analyse and report. Do not modify code.',
    );
  });

  it('reads the frontmatter line by line as the platform does: a description that is not a YAML plain scalar is its value, and a body with no note is an empty note', () => {
    const platformValue = [
      '---',
      'name: alpha',
      'description: Reviews a: the b, the c.',
      '---',
      '',
      'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.',
      '',
    ].join('\n');
    const read = readMarkdownAdapter('.claude/agents/alpha.md', platformValue);
    expect(read.ok ? read.value.fields.get('description') : read.error).toBe(
      'Reviews a: the b, the c.',
    );
    expect(read.ok ? read.value.note : read.error).toBe('');
  });

  it('reads a quoted scalar as YAML reads it (a doubled quote, a backslash escape, a folded block), and refuses text that is not one scalar', () => {
    const pointer =
      '\n\nYour first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.\n';
    const single = readMarkdownAdapter(
      '.cursor/agents/alpha.md',
      `---\nname: alpha\ndescription: 'Wilma''s lens.'\n---${pointer}`,
    );
    expect(single.ok ? single.value.fields.get('description') : single.error).toBe("Wilma's lens.");
    const double = readMarkdownAdapter(
      '.claude/agents/alpha.md',
      `---\nname: alpha\ndescription: "Says \\"go\\"."\n---${pointer}`,
    );
    expect(double.ok ? double.value.fields.get('description') : double.error).toBe('Says "go".');
    const folded = readMarkdownAdapter(
      '.cursor/agents/alpha.md',
      `---\nname: alpha\ndescription: >-\n  Fast check.\n  Returns a verdict.\n---${pointer}`,
    );
    expect(folded.ok ? folded.value.fields.get('description') : folded.error).toBe(
      'Fast check. Returns a verdict.',
    );
    expect(
      readMarkdownAdapter(
        '.claude/agents/alpha.md',
        `---\nname: alpha\ndescription: 'a' and 'b'\n---${pointer}`,
      ),
    ).toStrictEqual({
      ok: false,
      error: ".claude/agents/alpha.md: field \"description\" is not a quoted scalar: 'a' and 'b'",
    });
  });

  it('refuses a list-valued field, an unknown key and a field with no value, each naming the adapter', () => {
    const pointer =
      '\n\nYour first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.\n';
    expect(
      readMarkdownAdapter(
        '.claude/agents/alpha.md',
        `---\nname: alpha\ntools:\n  - Read\n  - Grep\n---${pointer}`,
      ),
    ).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: unparseable frontmatter line 4:   - Read',
    });
    expect(
      readMarkdownAdapter(
        '.claude/agents/alpha.md',
        `---\nname: alpha\nhooks:\n  PreToolUse: x\n---${pointer}`,
      ),
    ).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: unknown frontmatter key "hooks"',
    });
    expect(
      readMarkdownAdapter('.claude/agents/alpha.md', `---\nname: alpha\ntools:\n---${pointer}`),
    ).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: field "tools" carries no value',
    });
    // An empty quoted scalar is the same absence in a second shape (the code-expert's probe).
    expect(
      readMarkdownAdapter(
        '.claude/agents/alpha.md',
        `---\nname: alpha\ndescription: ''\n---${pointer}`,
      ),
    ).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: field "description" carries no value',
    });
    expect(
      readMarkdownAdapter('.claude/agents/alpha.md', `---\nname: alpha\ntools: ""\n---${pointer}`),
    ).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: field "tools" carries no value',
    });
  });

  it('reads only a title above the pointer', () => {
    const late = readMarkdownAdapter(
      '.claude/agents/alpha.md',
      '---\nname: alpha\n---\n\nYour first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.\n\n# Not the title\n',
    );
    expect(late.ok ? late.value.title : late.error).toBeUndefined();
  });

  it('refuses an adapter with no block, an unclosed block, no pointer sentence, or a pointer with no path', () => {
    expect(readMarkdownAdapter('.claude/agents/alpha.md', '# Alpha\n')).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: no frontmatter block',
    });
    expect(readMarkdownAdapter('.claude/agents/alpha.md', '---\nname: alpha\n')).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: frontmatter block never closes',
    });
    expect(
      readMarkdownAdapter('.claude/agents/alpha.md', '---\nname: alpha\n---\n\n# Alpha\n'),
    ).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: no template pointer sentence',
    });
    expect(
      readMarkdownAdapter(
        '.claude/agents/alpha.md',
        '---\nname: alpha\n---\n\nYour first action MUST be to read and internalise the template.\n',
      ),
    ).toStrictEqual({
      ok: false,
      error: '.claude/agents/alpha.md: the template pointer names no path',
    });
  });

  it('refuses a pointer whose path is not a template path, and carries the template a valid one names', () => {
    expect(
      readMarkdownAdapter(
        '.claude/agents/alpha.md',
        '---\nname: alpha\n---\n\nYour first action MUST be to read and internalise `docs/alpha.md`.\n',
      ),
    ).toStrictEqual({
      ok: false,
      error:
        '.claude/agents/alpha.md: the template pointer names "docs/alpha.md", not a template path',
    });
    const variant = readMarkdownAdapter(
      '.cursor/agents/cricket-high.md',
      '---\nname: cricket-high\n---\n\nYour first action MUST be to read and internalise `.agent/sub-agents/templates/cricket.md`.\n',
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

  it('refuses a head line that is not a key = "value" field, so no value is dropped', () => {
    expect(
      readCodexAdapter(
        '.codex/agents/alpha.toml',
        'name = "alpha"\nmax_turns = 5\n\ndeveloper_instructions = """\nRead and follow `.agent/sub-agents/templates/alpha.md`.\n"""\n',
      ),
    ).toStrictEqual({
      ok: false,
      error: '.codex/agents/alpha.toml: line "max_turns = 5" is not a key = "value" field',
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
