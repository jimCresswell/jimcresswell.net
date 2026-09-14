import { describe, expect, it } from 'vitest';

import type { AdapterSource } from './adapter-sources.js';
import { deriveRole } from './derive-role.js';
import { STANDARD_CLOSINGS } from './standard-adapter-body.js';

const DESCRIPTION = 'Alpha reviews a.';

function source(
  fields: Readonly<Record<string, string>>,
  body: Partial<Omit<AdapterSource, 'fields'>> = {},
): AdapterSource {
  return {
    fields: new Map(Object.entries(fields)),
    title: 'Alpha',
    template: 'alpha',
    pointerWrapped: false,
    pointerTail: '',
    note: '',
    ...body,
  };
}

const CLAUDE_STANDARD = {
  name: 'alpha',
  description: DESCRIPTION,
  tools: 'Read, Grep, Glob, Bash',
  disallowedTools: 'Write, Edit',
  permissionMode: 'plan',
};
const CODEX_STANDARD = { name: 'alpha', description: DESCRIPTION, model_reasoning_effort: 'high' };
const CURSOR_STANDARD = { name: 'alpha', description: DESCRIPTION, readonly: 'true' };

function standardSet(): Parameters<typeof deriveRole>[1] {
  return {
    cursor: source(CURSOR_STANDARD, { note: STANDARD_CLOSINGS.cursor }),
    claude: source(CLAUDE_STANDARD, { note: STANDARD_CLOSINGS.claude }),
    codex: source(CODEX_STANDARD, { title: undefined, note: STANDARD_CLOSINGS.codex }),
  };
}

describe('deriveRole', () => {
  it('derives a standard role on three platforms as one description and nothing else', () => {
    expect(deriveRole('alpha', standardSet())).toStrictEqual({
      ok: true,
      value: {
        declaration: { kind: 'role', name: 'alpha', description: DESCRIPTION },
        reconciliations: [],
      },
    });
  });

  it('declares only the deviations: fields off the defaults, an absent tools field as inherit, a closing off the standard', () => {
    const set = standardSet();
    const derived = deriveRole('alpha', {
      ...set,
      claude: source(
        {
          name: 'alpha',
          description: DESCRIPTION,
          disallowedTools: 'Write, Edit, NotebookEdit',
          permissionMode: 'plan',
          color: 'purple',
        },
        { note: 'Review and report only. Do not modify files.' },
      ),
      codex: source(
        { ...CODEX_STANDARD, model: 'gpt-5.6-sol', model_reasoning_effort: 'low' },
        { title: undefined, note: STANDARD_CLOSINGS.codex, pointerTail: ',\nthen stop.' },
      ),
    });
    expect(derived).toStrictEqual({
      ok: true,
      value: {
        declaration: {
          kind: 'role',
          name: 'alpha',
          description: DESCRIPTION,
          claude: {
            tools: 'inherit',
            disallowedTools: 'Write, Edit, NotebookEdit',
            color: 'purple',
            note: 'Review and report only. Do not modify files.',
          },
          codex: { model: 'gpt-5.6-sol', effort: 'low', pointerTail: ',\nthen stop.' },
        },
        reconciliations: [],
      },
    });
  });

  it('names the platforms when fewer than three carry an adapter', () => {
    const { cursor, claude } = standardSet();
    const derived = deriveRole('alpha', { cursor, claude });
    expect(derived.ok ? derived.value.declaration : derived.error).toStrictEqual({
      kind: 'role',
      name: 'alpha',
      description: DESCRIPTION,
      platforms: ['cursor', 'claude'],
    });
  });

  it('keeps the Claude description and lists the others as a reconciliation where they differ', () => {
    const set = standardSet();
    const derived = deriveRole('alpha', {
      ...set,
      cursor: source(
        { ...CURSOR_STANDARD, description: 'Alpha, for Cursor.' },
        { note: STANDARD_CLOSINGS.cursor },
      ),
    });
    expect(derived.ok ? derived.value.reconciliations : derived.error).toStrictEqual([
      {
        adapter: 'alpha',
        field: 'description',
        kept: DESCRIPTION,
        dropped: [{ platform: 'cursor', value: 'Alpha, for Cursor.' }],
      },
    ]);
    expect(
      derived.ok && derived.value.declaration.kind === 'role'
        ? derived.value.declaration.description
        : derived,
    ).toBe(DESCRIPTION);
  });

  it('reconciles, never declares, a title off the canonical one and a wrapped pointer', () => {
    const set = standardSet();
    const derived = deriveRole('alpha', {
      ...set,
      claude: source(CLAUDE_STANDARD, {
        title: 'Alpha Reviewer',
        pointerWrapped: true,
        note: STANDARD_CLOSINGS.claude,
      }),
    });
    expect(derived.ok ? derived.value : derived.error).toStrictEqual({
      declaration: { kind: 'role', name: 'alpha', description: DESCRIPTION },
      reconciliations: [
        {
          adapter: 'alpha',
          field: 'title',
          kept: 'Alpha',
          dropped: [{ platform: 'claude', value: 'Alpha Reviewer' }],
        },
        {
          adapter: 'alpha',
          field: 'pointer',
          kept: 'one line',
          dropped: [{ platform: 'claude', value: 'wrapped over two lines' }],
        },
      ],
    });
  });

  it('refuses an adapter field the declaration does not carry, and an invariant field off its value', () => {
    const set = standardSet();
    expect(
      deriveRole('alpha', {
        ...set,
        claude: source({ ...CLAUDE_STANDARD, maxTurns: '5' }, { note: STANDARD_CLOSINGS.claude }),
      }),
    ).toStrictEqual({
      ok: false,
      error: 'alpha: claude adapter field "maxTurns" is not one the declaration carries',
    });
    expect(
      deriveRole('alpha', {
        ...set,
        codex: source(
          { ...CODEX_STANDARD, sandbox_mode: 'workspace-write', approval_policy: 'never' },
          { title: undefined, note: STANDARD_CLOSINGS.codex },
        ),
      }),
    ).toStrictEqual({
      ok: false,
      error:
        'alpha: codex adapter field "sandbox_mode" is "workspace-write", not the estate\'s "read-only"',
    });
  });

  it('keeps the first carried description when no Claude adapter exists, reconciling the rest', () => {
    const { cursor, codex } = standardSet();
    const agreeing = deriveRole('alpha', { cursor, codex });
    expect(agreeing.ok ? agreeing.value : agreeing.error).toStrictEqual({
      declaration: {
        kind: 'role',
        name: 'alpha',
        description: DESCRIPTION,
        platforms: ['cursor', 'codex'],
      },
      reconciliations: [],
    });
    const differing = deriveRole('alpha', {
      cursor,
      codex: source(
        { ...CODEX_STANDARD, description: 'Alpha, for Codex.' },
        { title: undefined, note: STANDARD_CLOSINGS.codex },
      ),
    });
    expect(differing.ok ? differing.value.reconciliations : differing.error).toStrictEqual([
      {
        adapter: 'alpha',
        field: 'description',
        kept: DESCRIPTION,
        dropped: [{ platform: 'codex', value: 'Alpha, for Codex.' }],
      },
    ]);
  });

  it('refuses a role with no adapter and one whose adapters carry no description', () => {
    expect(deriveRole('alpha', {})).toStrictEqual({
      ok: false,
      error: 'alpha: no adapter on any platform',
    });
    expect(deriveRole('alpha', { claude: source({ name: 'alpha' }) })).toStrictEqual({
      ok: false,
      error: 'alpha: no adapter carries a description',
    });
  });
});
