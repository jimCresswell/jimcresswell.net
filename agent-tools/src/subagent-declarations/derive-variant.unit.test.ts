import { describe, expect, it } from 'vitest';

import type { AdapterSource } from './adapter-sources.js';
import { deriveFanOut, deriveVariant } from './derive-variant.js';

const DESCRIPTION = 'Fast high-effort check.';
const TITLE = 'Cricket — High Effort';

function source(
  fields: Readonly<Record<string, string>>,
  body: Partial<Omit<AdapterSource, 'fields'>> = {},
): AdapterSource {
  return {
    fields: new Map(Object.entries(fields)),
    title: TITLE,
    template: 'cricket',
    pointerWrapped: false,
    pointerTail: '',
    note: '',
    ...body,
  };
}

function highSet(): Parameters<typeof deriveVariant>[1] {
  return {
    cursor: source(
      { name: 'cricket-high', description: 'Cursor adapter; no effort pin.', readonly: 'true' },
      { note: 'Cursor prose.' },
    ),
    claude: source(
      {
        name: 'cricket-high',
        description: DESCRIPTION,
        tools: 'Read',
        disallowedTools: 'Write, Edit, Bash',
        color: 'green',
        model: 'sonnet',
        effort: 'high',
      },
      { note: 'Claude prose.', pointerTail: ',\nthen execute its procedure exactly.' },
    ),
    codex: source(
      {
        name: 'cricket-high',
        description: DESCRIPTION,
        model: 'gpt-5.6-sol',
        model_reasoning_effort: 'high',
      },
      { title: undefined, note: 'Codex prose.' },
    ),
  };
}

describe('deriveVariant', () => {
  it('declares a variant whole: every field, its title, the Cursor description that differs, every note', () => {
    expect(deriveVariant('cricket-high', highSet())).toStrictEqual({
      ok: true,
      value: {
        variant: {
          name: 'cricket-high',
          platforms: ['cursor', 'claude', 'codex'],
          description: DESCRIPTION,
          title: TITLE,
          cursor: { description: 'Cursor adapter; no effort pin.', note: 'Cursor prose.' },
          claude: {
            tools: 'Read',
            disallowedTools: 'Write, Edit, Bash',
            color: 'green',
            model: 'sonnet',
            effort: 'high',
            pointerTail: ',\nthen execute its procedure exactly.',
            note: 'Claude prose.',
          },
          codex: { model: 'gpt-5.6-sol', effort: 'high', note: 'Codex prose.' },
        },
        reconciliations: [],
      },
    });
  });

  it('writes an absent Claude tools field as inherit, omits a canonical title, and reconciles a title that differs across platforms', () => {
    const set = highSet();
    const derived = deriveVariant('cricket-high', {
      ...set,
      cursor: source(
        { name: 'cricket-high', description: DESCRIPTION },
        { title: 'Cricket High', note: 'Cursor prose.' },
      ),
      claude: source(
        { name: 'cricket-high', description: DESCRIPTION },
        { title: 'Cricket High', note: 'Claude prose.' },
      ),
      codex: undefined,
    });
    expect(derived.ok ? derived.value : derived.error).toStrictEqual({
      variant: {
        name: 'cricket-high',
        platforms: ['cursor', 'claude'],
        description: DESCRIPTION,
        cursor: { note: 'Cursor prose.' },
        claude: { tools: 'inherit', note: 'Claude prose.' },
      },
      reconciliations: [],
    });
    const differing = deriveVariant('cricket-high', {
      ...set,
      cursor: source(
        { name: 'cricket-high', description: DESCRIPTION },
        { title: 'Cricket (High)', note: 'Cursor prose.' },
      ),
    });
    expect(differing.ok ? differing.value.reconciliations : differing.error).toStrictEqual([
      {
        adapter: 'cricket-high',
        field: 'title',
        kept: TITLE,
        dropped: [{ platform: 'cursor', value: 'Cricket (High)' }],
      },
    ]);
  });

  it('refuses a variant with no adapter, and one whose adapters carry no description', () => {
    expect(deriveVariant('cricket-high', {})).toStrictEqual({
      ok: false,
      error: 'cricket-high: no adapter on any platform',
    });
    expect(
      deriveVariant('cricket-high', {
        cursor: source({ name: 'cricket-high', readonly: 'true' }),
      }),
    ).toStrictEqual({
      ok: false,
      error: 'cricket-high: no adapter carries a description',
    });
  });

  it('derives a Cursor-only variant, its description the Cursor one, so the schema and the derivation agree on a Cursor-only platform list', () => {
    const { cursor } = highSet();
    const derived = deriveVariant('cricket-high', { cursor });
    expect(derived.ok ? derived.value.variant : derived.error).toStrictEqual({
      name: 'cricket-high',
      platforms: ['cursor'],
      description: 'Cursor adapter; no effort pin.',
      title: TITLE,
      cursor: { note: 'Cursor prose.' },
    });
  });

  it('refuses a variant name the declaration shape would refuse, before any block is derived', () => {
    expect(deriveVariant('cricket-High', highSet())).toStrictEqual({
      ok: false,
      error: 'cricket-High: not a lowercase hyphenated adapter name',
    });
  });

  it('lists a Codex description that differs from the ruling Claude one as a reconciliation, as a role does; the Cursor one stays a declared field', () => {
    const set = highSet();
    const derived = deriveVariant('cricket-high', {
      ...set,
      codex: source(
        {
          name: 'cricket-high',
          description: 'Codex says otherwise.',
          model_reasoning_effort: 'high',
        },
        { title: undefined, note: 'Codex prose.' },
      ),
    });
    expect(derived.ok ? derived.value.reconciliations : derived.error).toStrictEqual([
      {
        adapter: 'cricket-high',
        field: 'description',
        kept: DESCRIPTION,
        dropped: [{ platform: 'codex', value: 'Codex says otherwise.' }],
      },
    ]);
    expect(derived.ok ? derived.value.variant.cursor : derived.error).toStrictEqual({
      description: 'Cursor adapter; no effort pin.',
      note: 'Cursor prose.',
    });
  });
});

describe('deriveFanOut', () => {
  it('derives the variants in name order, gathering their reconciliations', () => {
    const set = highSet();
    const derived = deriveFanOut(
      'cricket',
      new Map([
        ['cricket-low', set],
        ['cricket-high', set],
      ]),
    );
    expect(derived.ok ? derived.value.declaration.kind : derived.error).toBe('fan-out');
    expect(
      derived.ok && derived.value.declaration.kind === 'fan-out'
        ? derived.value.declaration.variants.map((variant) => variant.name)
        : derived,
    ).toStrictEqual(['cricket-high', 'cricket-low']);
  });

  it('refuses a fan-out with no variants and passes a variant refusal through', () => {
    expect(deriveFanOut('cricket', new Map())).toStrictEqual({
      ok: false,
      error: 'cricket: a fan-out with no variants',
    });
    expect(deriveFanOut('cricket', new Map([['cricket-high', {}]]))).toStrictEqual({
      ok: false,
      error: 'cricket-high: no adapter on any platform',
    });
  });
});
