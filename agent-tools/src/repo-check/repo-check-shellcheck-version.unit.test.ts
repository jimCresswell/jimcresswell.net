import { describe, expect, it } from 'vitest';

import { pinnedShellcheckVersion, shellcheckVersion } from './repo-check-shellcheck-version.js';

/**
 * The shellcheck gate's version verdict: the pin read from the installer's
 * text, and whether the `shellcheck --version` probe shows that version
 * running. The installer file and the probe run are read at the process edge.
 */

const PINNED = '0.11.0';

describe('pinnedShellcheckVersion', () => {
  it('reads the version the installer pins', () => {
    const installer = '#!/usr/bin/env bash\nset -eu\n\nSHELLCHECK_VERSION=0.11.0\nSHA=abc\n';
    expect(pinnedShellcheckVersion(installer)).toStrictEqual({ ok: true, value: '0.11.0' });
  });

  it('fails an installer text that pins no version', () => {
    const result = pinnedShellcheckVersion('#!/usr/bin/env bash\n# SHELLCHECK_VERSION=0.1\n');
    expect(result.ok ? '' : result.error).toContain('SHELLCHECK_VERSION');
  });
});

describe('shellcheckVersion', () => {
  it('passes a probe that ran the pinned version', () => {
    const probe = {
      status: 0,
      signal: null,
      stdout: 'ShellCheck - shell script analysis tool\nversion: 0.11.0\nlicense: GPLv3\n',
      stderr: '',
    };
    expect(shellcheckVersion(probe, PINNED)).toStrictEqual({ ok: true, value: '0.11.0' });
  });

  it('fails a probe that ran another version, naming both and the pin', () => {
    const probe = { status: 0, signal: null, stdout: 'version: 0.9.0\n', stderr: '' };
    const result = shellcheckVersion(probe, PINNED);
    const failure = result.ok ? '' : result.error;
    expect(failure).toContain('shellcheck 0.9.0');
    expect(failure).toContain('pins 0.11.0');
    expect(failure).toContain('.agent/setup/install-shellcheck.sh <bin-dir>');
  });

  it('fails a probe that could not run, naming the cause and how to install shellcheck', () => {
    const result = shellcheckVersion(
      { status: 1, signal: null, stdout: '', stderr: 'shellcheck: spawn shellcheck ENOENT\n' },
      PINNED,
    );
    const failure = result.ok ? '' : result.error;
    expect(failure).toContain('spawn shellcheck ENOENT');
    expect(failure).toContain('.agent/setup/install-shellcheck.sh <bin-dir>');
    expect(failure).toContain('never skips');
  });

  it('fails a probe that exited non-zero even when it printed a version line', () => {
    const probe = { status: 2, signal: null, stdout: 'version: 0.11.0\n', stderr: '' };
    const result = shellcheckVersion(probe, PINNED);
    expect(result.ok ? '' : result.error).toContain('shellcheck could not run (exit 2)');
  });

  it('fails a probe killed by a signal, naming the signal', () => {
    const probe = { status: null, signal: 'SIGKILL' as const, stdout: '', stderr: '' };
    const result = shellcheckVersion(probe, PINNED);
    expect(result.ok ? '' : result.error).toContain('killed by SIGKILL');
  });

  it('fails a probe that exited 0 without a version line', () => {
    const probe = { status: 0, signal: null, stdout: 'usage: something else\n', stderr: '' };
    const result = shellcheckVersion(probe, PINNED);
    expect(result.ok ? '' : result.error).toContain('no version line');
  });
});
