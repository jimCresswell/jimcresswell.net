import { describe, expect, it } from 'vitest';

import type { RefFormatOracle } from './ref-format.js';
import { parseRetireArgs } from './retire-args.js';

/**
 * The `merge-bot retire` argv contract: one required `--branch`, legal by
 * git's grammar AND inside the command's URL-safe name list, and `--json`.
 * The ref-format oracle is injected, so git's grammar here is a table.
 */

const everyNameLegal: RefFormatOracle = () => true;
const seams = { refFormatOracle: everyNameLegal };

describe('parseRetireArgs', () => {
  it('parses the full flag line', () => {
    expect(parseRetireArgs(['--branch', 'feat/branch-retire', '--json'], seams)).toEqual({
      ok: true,
      value: { branch: 'feat/branch-retire', json: true },
    });
  });

  it('requires --branch: there is no current-branch default for a delete', () => {
    const parsed = parseRetireArgs(['--json'], seams);

    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toContain('--branch');
    }
  });

  it('refuses a git-legal name outside the URL-safe list', () => {
    for (const name of ['issue#12', '%2e%2e/tags/v1']) {
      expect(parseRetireArgs(['--branch', name], seams).ok).toBe(false);
    }
  });

  it("refuses a name git's grammar rejects", () => {
    const nothingLegal: RefFormatOracle = () => false;

    expect(parseRetireArgs(['--branch', 'feat/x'], { refFormatOracle: nothingLegal }).ok).toBe(
      false,
    );
  });

  it('refuses --force by name: a refusal is surfaced, never overridden', () => {
    for (const flag of ['--force', '-f']) {
      const parsed = parseRetireArgs([flag, '--branch', 'feat/x'], seams);
      expect(parsed.ok).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain(flag);
      }
    }
  });

  it('refuses a repeated --branch and an unknown argument', () => {
    expect(parseRetireArgs(['--branch', 'a', '--branch', 'b'], seams).ok).toBe(false);
    expect(parseRetireArgs(['--branch', 'a', '--prune'], seams).ok).toBe(false);
  });

  it('echoes a refused argument without its control characters', () => {
    for (const argv of [
      ['--branch', 'a', '--x\u001b[2J'],
      ['--branch', 'a\u001b[2J'],
      ['--branch', '-\u001b[2J'],
    ]) {
      const parsed = parseRetireArgs(argv, seams);
      expect(parsed.ok ? '' : parsed.error.message).not.toContain('\u001b');
    }
  });
});
