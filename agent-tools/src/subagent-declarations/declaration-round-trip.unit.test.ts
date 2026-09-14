import { describe, expect, it } from 'vitest';

import { readBackIssue } from './declaration-round-trip.js';
import type { FanOutDeclaration, SubagentDeclaration } from './subagent-declaration.js';

/**
 * The derived declaration is parsed through the strict schema before anything is written,
 * so the sweep never writes a block its own reader refuses (the #77 round-three findings,
 * 2026-09-14): whatever a reader lets through, the render is read back first.
 */

const ROLE: SubagentDeclaration = {
  kind: 'role',
  name: 'alpha',
  description: 'Alpha reviews a.',
  claude: { tools: 'inherit' },
};

const FAN_OUT: FanOutDeclaration = {
  kind: 'fan-out',
  name: 'cricket',
  variants: [
    {
      name: 'cricket-high',
      platforms: ['cursor', 'claude'],
      description: 'Fast high-effort check.',
      title: 'Cricket — High Effort',
    },
  ],
};

describe('readBackIssue', () => {
  it('finds no issue with a role or a fan-out whose render reads back', () => {
    expect(readBackIssue('alpha', ROLE)).toBeUndefined();
    expect(readBackIssue('cricket', FAN_OUT)).toBeUndefined();
  });

  it('names the field when the render cannot be read back: a newline in a line field, an empty title, an empty value', () => {
    expect(readBackIssue('alpha', { ...ROLE, description: 'Alpha reviews a.\nTwice.' })).toBe(
      'alpha: the derived declaration does not read back (description: one line)',
    );
    expect(
      readBackIssue('cricket', {
        ...FAN_OUT,
        variants: [{ name: 'cricket-high', platforms: ['cursor'], description: 'x', title: '' }],
      }),
    ).toMatch(/^cricket: the derived declaration does not read back \(variants\.0\.title: /u);
    expect(readBackIssue('alpha', { ...ROLE, codex: { effort: '' } })).toMatch(
      /^alpha: the derived declaration does not read back \(codex\.effort: /u,
    );
  });
});
