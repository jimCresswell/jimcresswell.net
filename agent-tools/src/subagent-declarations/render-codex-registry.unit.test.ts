import { describe, expect, it } from 'vitest';

import { renderCodexRegistry, splitCodexRegistry } from './render-codex-registry.js';
import type { FanOutDeclaration, RoleDeclaration } from './subagent-declaration.js';

/**
 * The Codex registry (closure item 6, 2b-ii, slice A2): `.codex/config.toml` is a hand-kept
 * head (the host's own settings) followed by one `[agents."<name>"]` block per Codex adapter.
 * The head is kept verbatim; the blocks are rendered from the declarations, sorted by name,
 * each carrying the adapter's description and its config file. The registry tail admits
 * nothing but blocks, so a foreign line there refuses rather than being dropped.
 */

const HEAD = ['file_opener = "cursor"', '', '[features]', 'multi_agent = true', '', ''].join('\n');

const REGISTRY = `${HEAD}${[
  '[agents."zeta"]',
  'description = "Zeta."',
  'config_file = "agents/zeta.toml"',
  '',
  '[agents."alpha"]',
  'description = "Old alpha."',
  'config_file = "agents/alpha.toml"',
  '',
].join('\n')}`;

const ALPHA: RoleDeclaration = { kind: 'role', name: 'alpha', description: 'Alpha reviews a.' };
const ZETA: RoleDeclaration = { kind: 'role', name: 'zeta', description: 'Zeta.' };
const CRICKET: FanOutDeclaration = {
  kind: 'fan-out',
  name: 'cricket',
  variants: [
    {
      name: 'cricket-low',
      platforms: ['cursor', 'codex'],
      description: 'Fast low-effort check.',
      codex: { model: 'gpt-x', effort: 'low' },
    },
    {
      name: 'cricket-high',
      platforms: ['cursor', 'claude'],
      description: 'Fast high-effort check.',
    },
  ],
};

const EXPECTED = `${HEAD}${[
  '[agents."alpha"]',
  'description = "Alpha reviews a."',
  'config_file = "agents/alpha.toml"',
  '',
  '[agents."cricket-low"]',
  'description = "Fast low-effort check."',
  'config_file = "agents/cricket-low.toml"',
  '',
  '[agents."zeta"]',
  'description = "Zeta."',
  'config_file = "agents/zeta.toml"',
  '',
].join('\n')}`;

describe('splitCodexRegistry', () => {
  it('keeps the head verbatim up to the first agents block', () => {
    expect(splitCodexRegistry('.codex/config.toml', REGISTRY)).toStrictEqual({
      ok: true,
      value: { head: HEAD },
    });
  });

  it('reads a config with no registry as all head, closed by a blank line for the blocks to follow', () => {
    expect(splitCodexRegistry('.codex/config.toml', 'file_opener = "cursor"\n')).toStrictEqual({
      ok: true,
      value: { head: 'file_opener = "cursor"\n\n' },
    });
    expect(splitCodexRegistry('.codex/config.toml', '')).toStrictEqual({
      ok: true,
      value: { head: '' },
    });
  });

  it('refuses a line in the registry tail that is not an agents block line, naming it', () => {
    const foreign = `${REGISTRY}\n[mcp_servers.docs]\nurl = "x"\n`;
    expect(splitCodexRegistry('.codex/config.toml', foreign)).toStrictEqual({
      ok: false,
      error:
        '.codex/config.toml: line "[mcp_servers.docs]" sits in the registry tail, which the declarations render whole; move it above the first agents block; refusing to regenerate the sub-agent adapters',
    });
  });
});

describe('renderCodexRegistry', () => {
  it('renders one block per Codex adapter, sorted by name, after the head verbatim; a variant with no Codex adapter has no block', () => {
    expect(renderCodexRegistry(HEAD, [ZETA, CRICKET, ALPHA])).toStrictEqual({
      ok: true,
      value: EXPECTED,
    });
  });

  it('refuses a description a TOML basic string cannot carry verbatim, naming the registry', () => {
    expect(renderCodexRegistry(HEAD, [{ ...ALPHA, description: 'Says "hi".' }])).toStrictEqual({
      ok: false,
      error:
        '.codex/config.toml: the description of alpha carries a character a TOML basic string cannot carry verbatim (a double quote, a backslash or a control character); refusing to render it',
    });
  });
});
