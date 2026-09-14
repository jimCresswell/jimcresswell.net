import { describe, expect, it } from 'vitest';

import { renderSubagentAdapters } from './render-subagent-adapters.js';
import type { FanOutDeclaration, RoleDeclaration } from './subagent-declaration.js';

/**
 * The adapter generator (closure item 6, 2b-ii, slice A1): every declaration renders its
 * Cursor, Claude and Codex adapters byte for byte in the estate's one shape
 * (`standard-adapter-body.ts`), a role from the defaults it does not deviate from, a variant
 * exactly as declared. The shapes here are synthetic; the estate's own files are the live
 * proof (75 of 86 unchanged, the eleven normalised ones on record).
 */

const ALPHA: RoleDeclaration = {
  kind: 'role',
  name: 'alpha',
  description: "Alpha reviews a: it's thorough.",
};

const CURSOR_ALPHA = [
  '---',
  'name: alpha',
  'description: "Alpha reviews a: it\'s thorough."',
  'readonly: true',
  '---',
  '',
  '# Alpha',
  '',
  '**All file paths in this document are relative to the repository root.**',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/alpha.md`.',
  '',
  'This file is a thin Cursor adapter. The canonical reviewer instructions live in the',
  'template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
  '',
].join('\n');

const CLAUDE_ALPHA = [
  '---',
  'name: alpha',
  'description: "Alpha reviews a: it\'s thorough."',
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
  'This file is a thin Claude Code adapter. The canonical reviewer instructions live in the',
  'template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
  '',
].join('\n');

const CODEX_ALPHA = [
  'name = "alpha"',
  'description = "Alpha reviews a: it\'s thorough."',
  'model_reasoning_effort = "high"',
  'sandbox_mode = "read-only"',
  'approval_policy = "never"',
  '',
  'developer_instructions = """',
  'Read and follow `.agent/sub-agents/templates/alpha.md`.',
  '',
  'This file is a thin Codex adapter. The canonical reviewer instructions live in',
  'the template referenced above.',
  '',
  'Mode: Observe, analyse and report. Do not modify code.',
  '"""',
  '',
].join('\n');

/** A role deviating on two of its three platforms. */
const PROSE: RoleDeclaration = {
  kind: 'role',
  name: 'prose',
  description: 'Prose craft.',
  claude: {
    tools: 'inherit',
    disallowedTools: 'Write, Edit, NotebookEdit',
    color: 'purple',
    note: 'Review and report only. Do not modify files. The calling agent executes any\nrewrite you recommend.',
  },
  codex: {
    model: 'gpt-x',
    effort: 'low',
    pointerTail: ' Then stop.',
    note: 'Codex prose note.',
  },
};

const CLAUDE_PROSE = [
  '---',
  'name: prose',
  "description: 'Prose craft.'",
  'disallowedTools: Write, Edit, NotebookEdit',
  'color: purple',
  'permissionMode: plan',
  '---',
  '',
  '# Prose',
  '',
  'All file paths are relative to the repository root.',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/prose.md`.',
  '',
  'Review and report only. Do not modify files. The calling agent executes any',
  'rewrite you recommend.',
  '',
].join('\n');

const CODEX_PROSE = [
  'name = "prose"',
  'description = "Prose craft."',
  'model = "gpt-x"',
  'model_reasoning_effort = "low"',
  'sandbox_mode = "read-only"',
  'approval_policy = "never"',
  '',
  'developer_instructions = """',
  'Read and follow `.agent/sub-agents/templates/prose.md` Then stop.',
  '',
  'Codex prose note.',
  '"""',
  '',
].join('\n');

const CRICKET: FanOutDeclaration = {
  kind: 'fan-out',
  name: 'cricket',
  variants: [
    {
      name: 'cricket-high',
      platforms: ['cursor', 'claude'],
      description: 'Fast high-effort check.',
      title: 'Cricket — High Effort',
      cursor: {
        description: 'Cursor adapter for the high-effort role.',
        note: 'That template is the canonical role definition.\nNever explore the repository.',
      },
      claude: {
        tools: 'Read',
        disallowedTools: 'Write, Edit, Bash, Grep, Glob',
        color: 'green',
        model: 'sonnet',
        effort: 'high',
        note: 'Judge and report from the supplied context.',
      },
    },
  ],
};

const CURSOR_CRICKET_HIGH = [
  '---',
  'name: cricket-high',
  "description: 'Cursor adapter for the high-effort role.'",
  'readonly: true',
  '---',
  '',
  '# Cricket — High Effort',
  '',
  '**All file paths in this document are relative to the repository root.**',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/cricket.md`.',
  '',
  'That template is the canonical role definition.',
  'Never explore the repository.',
  '',
].join('\n');

const CLAUDE_CRICKET_HIGH = [
  '---',
  'name: cricket-high',
  "description: 'Fast high-effort check.'",
  'tools: Read',
  'disallowedTools: Write, Edit, Bash, Grep, Glob',
  'color: green',
  'model: sonnet',
  'effort: high',
  '---',
  '',
  '# Cricket — High Effort',
  '',
  'All file paths are relative to the repository root.',
  '',
  'Your first action MUST be to read and internalise `.agent/sub-agents/templates/cricket.md`.',
  '',
  'Judge and report from the supplied context.',
  '',
].join('\n');

function textsOf(declarations: readonly (RoleDeclaration | FanOutDeclaration)[]) {
  const rendered = renderSubagentAdapters(declarations);
  expect(rendered.ok).toBe(true);
  return new Map(rendered.ok ? rendered.value.map((entry) => [entry.path, entry.text]) : []);
}

describe('renderSubagentAdapters', () => {
  it('renders a standard role on the three surfaces from the defaults, an apostrophe putting the description in double quotes as the formatter keeps it', () => {
    const texts = textsOf([ALPHA]);
    expect([...texts.keys()]).toStrictEqual([
      '.cursor/agents/alpha.md',
      '.claude/agents/alpha.md',
      '.codex/agents/alpha.toml',
    ]);
    expect(texts.get('.cursor/agents/alpha.md')).toBe(CURSOR_ALPHA);
    expect(texts.get('.claude/agents/alpha.md')).toBe(CLAUDE_ALPHA);
    expect(texts.get('.codex/agents/alpha.toml')).toBe(CODEX_ALPHA);
  });

  it('renders a role with its deviations: inherited tools omitted, a colour before the permission mode, a Codex model, a pointer tail and a note in place of the closing', () => {
    const texts = textsOf([PROSE]);
    expect([...texts.keys()]).toStrictEqual([
      '.cursor/agents/prose.md',
      '.claude/agents/prose.md',
      '.codex/agents/prose.toml',
    ]);
    expect(texts.get('.claude/agents/prose.md')).toBe(CLAUDE_PROSE);
    expect(texts.get('.codex/agents/prose.toml')).toBe(CODEX_PROSE);
  });

  it('renders a fan-out as its variants, each exactly as declared: its own title, description per platform, fields in the measured order, no defaults filled', () => {
    const texts = textsOf([CRICKET]);
    expect([...texts.keys()]).toStrictEqual([
      '.cursor/agents/cricket-high.md',
      '.claude/agents/cricket-high.md',
    ]);
    expect(texts.get('.cursor/agents/cricket-high.md')).toBe(CURSOR_CRICKET_HIGH);
    expect(texts.get('.claude/agents/cricket-high.md')).toBe(CLAUDE_CRICKET_HIGH);
  });

  it('quotes a description as the formatter keeps it: single quotes with the apostrophe doubled when a double quote is present, else double quotes for an apostrophe, else single', () => {
    const line = (description: string): string | undefined =>
      textsOf([{ ...ALPHA, platforms: ['cursor'], description }])
        .get('.cursor/agents/alpha.md')
        ?.split('\n')[2];
    expect(line('Plain.')).toBe("description: 'Plain.'");
    expect(line('Says "hi".')).toBe(`description: 'Says "hi".'`);
    expect(line(`It's`)).toBe(`description: "It's"`);
    expect(line(`It's "so".`)).toBe(`description: 'It''s "so".'`);
    expect(line(`It's 'so' "x".`)).toBe(`description: 'It''s ''so'' "x".'`);
    expect(line(String.raw`C:\it's`)).toBe(String.raw`description: "C:\\it's"`);
  });

  it('a variant inheriting tools carries no tools line', () => {
    const inheriting: FanOutDeclaration = {
      ...CRICKET,
      variants: [{ ...CRICKET.variants[0], claude: { tools: 'inherit', color: 'green' } }],
    };
    expect(textsOf([inheriting]).get('.claude/agents/cricket-high.md')).toContain(
      "description: 'Fast high-effort check.'\ncolor: green\n---",
    );
  });

  it("refuses a pointer tail carrying a backtick, which the reader takes for the path's delimiter, before any projection returns", () => {
    const ticked: RoleDeclaration = { ...ALPHA, claude: { pointerTail: ' see `x`.' } };
    expect(renderSubagentAdapters([ticked])).toStrictEqual({
      ok: false,
      error:
        ".claude/agents/alpha.md: the pointer tail carries a backtick, which the reader takes for the path's delimiter; refusing to render it",
    });
  });

  it('refuses a Codex instructions block a TOML multi-line basic string cannot carry verbatim: a triple quote or a backslash in the note', () => {
    const tripled: RoleDeclaration = { ...ALPHA, codex: { note: 'Ends with """ here.' } };
    expect(renderSubagentAdapters([tripled])).toStrictEqual({
      ok: false,
      error:
        '.codex/agents/alpha.toml: the instructions prose carries a backslash, a triple quote or a control character the TOML block cannot carry verbatim; refusing to render it',
    });
    const slashed: RoleDeclaration = { ...ALPHA, codex: { pointerTail: String.raw` \ then.` } };
    expect(renderSubagentAdapters([slashed]).ok).toBe(false);
  });

  it('serialises every Claude field value as a YAML scalar: plain where YAML reads it plain, else quoted by the measured rule (a comment marker, a mapping separator, a leading indicator)', () => {
    const fields = (claude: RoleDeclaration['claude']): string | undefined =>
      textsOf([{ ...ALPHA, platforms: ['claude'], claude }])
        .get('.claude/agents/alpha.md')
        ?.split('\n---\n')[0];
    expect(fields({ tools: 'foo # bar', color: 'a: b', model: '- x', effort: 'high' })).toBe(
      [
        '---',
        'name: alpha',
        'description: "Alpha reviews a: it\'s thorough."',
        "tools: 'foo # bar'",
        'disallowedTools: Write, Edit',
        "color: 'a: b'",
        'permissionMode: plan',
        "model: '- x'",
        'effort: high',
      ].join('\n'),
    );
  });

  it('refuses a name two declarations render (a role and a fan-out variant), so --fix never writes one path twice', () => {
    const clash: RoleDeclaration = { ...ALPHA, name: 'cricket-high' };
    expect(renderSubagentAdapters([CRICKET, clash])).toStrictEqual({
      ok: false,
      error:
        'cricket-high: rendered by more than one declaration (a role and a fan-out variant, or two fan-outs); refusing to render the sub-agent adapters',
    });
  });

  it('renders declarations in name order whatever order they arrive in', () => {
    const texts = textsOf([PROSE, ALPHA]);
    expect([...texts.keys()][0]).toBe('.cursor/agents/alpha.md');
  });

  it('refuses a Codex description a TOML basic string cannot carry verbatim, naming the adapter, and renders nothing', () => {
    const quoted: RoleDeclaration = { ...ALPHA, description: 'Alpha says "hi".' };
    expect(renderSubagentAdapters([quoted])).toStrictEqual({
      ok: false,
      error:
        '.codex/agents/alpha.toml: the description carries a character a TOML basic string cannot carry verbatim (a double quote, a backslash or a control character); refusing to render it',
    });
    const escaped: RoleDeclaration = { ...ALPHA, description: String.raw`Alpha \ slash.` };
    expect(renderSubagentAdapters([escaped]).ok).toBe(false);
  });
});
