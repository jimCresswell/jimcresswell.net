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

  it('joins a list-valued field with commas, and reads a body with no note as an empty note', () => {
    const listed = [
      '---',
      'name: alpha',
      'tools:',
      '  - Read',
      '  - Grep',
      '---',
      '',
      'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.',
      '',
    ].join('\n');
    const read = readMarkdownAdapter('.claude/agents/alpha.md', listed);
    expect(read.ok ? read.value.fields.get('tools') : read.error).toBe('Read, Grep');
    expect(read.ok ? read.value.note : read.error).toBe('');
  });

  it('refuses a field that is not a scalar, and reads only a title above the pointer', () => {
    expect(
      readMarkdownAdapter(
        '.claude/agents/alpha.md',
        '---\nname: alpha\nhooks:\n  PreToolUse: x\n---\n\nYour first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.\n',
      ),
    ).toStrictEqual({ ok: false, error: '.claude/agents/alpha.md: field "hooks" is not a scalar' });
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
        pointerWrapped: false,
        pointerTail: '',
        note: 'This file is a thin Codex adapter.',
      },
    });
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
