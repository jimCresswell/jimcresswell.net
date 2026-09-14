import { describe, expect, it } from 'vitest';

import { parseSubagentDeclaration } from './subagent-declaration.js';

describe('parseSubagentDeclaration', () => {
  it('reads a role of one description as a role with no platform blocks', () => {
    expect(parseSubagentDeclaration('alpha', { description: 'Alpha reviews a.' })).toStrictEqual({
      ok: true,
      value: { kind: 'role', name: 'alpha', description: 'Alpha reviews a.' },
    });
  });

  it('reads a role with platform deviations and a Gemini block of only declared fields', () => {
    const value = {
      description: 'Alpha reviews a.',
      platforms: ['cursor', 'claude'],
      claude: { tools: 'inherit', color: 'purple', note: 'Review only.' },
      codex: { effort: 'low', pointerTail: ',\nthen stop.' },
      gemini: { kind: 'local', tools: ['read_file'], temperature: 0.2, max_turns: 5 },
    };
    expect(parseSubagentDeclaration('alpha', value)).toStrictEqual({
      ok: true,
      value: { kind: 'role', name: 'alpha', ...value },
    });
  });

  it('reads a list of variants as a fan-out, each variant whole', () => {
    const variant = {
      name: 'cricket-high',
      platforms: ['cursor', 'claude'],
      description: 'High.',
      title: 'Cricket — High',
      cursor: { description: 'Cursor high.', note: 'Cursor prose.' },
      claude: { tools: 'Read', model: 'sonnet', effort: 'high', note: 'Claude prose.' },
    };
    expect(parseSubagentDeclaration('cricket', { variants: [variant] })).toStrictEqual({
      ok: true,
      value: { kind: 'fan-out', name: 'cricket', variants: [variant] },
    });
  });

  it('refuses a key outside the shape, naming the template and the path', () => {
    const result = parseSubagentDeclaration('alpha', {
      description: 'Alpha.',
      claude: { colour: 'purple' },
    });
    expect(result.ok ? '' : result.error.startsWith('alpha: ')).toBe(true);
  });

  it('refuses a block that is neither a role nor a fan-out, and one that is both', () => {
    expect(parseSubagentDeclaration('alpha', {}).ok).toBe(false);
    expect(parseSubagentDeclaration('alpha', { description: 'Alpha.', variants: [] }).ok).toBe(
      false,
    );
  });

  it('refuses a multi-line description, a Gemini temperature out of range and a bad variant name', () => {
    expect(parseSubagentDeclaration('alpha', { description: 'one\ntwo' }).ok).toBe(false);
    expect(
      parseSubagentDeclaration('alpha', { description: 'Alpha.', gemini: { temperature: 3 } }).ok,
    ).toBe(false);
    expect(
      parseSubagentDeclaration('cricket', {
        variants: [{ name: 'Cricket High', platforms: ['claude'], description: 'High.' }],
      }).ok,
    ).toBe(false);
  });
});
