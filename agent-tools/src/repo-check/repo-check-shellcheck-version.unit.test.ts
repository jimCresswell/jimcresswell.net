import { describe, expect, it } from 'vitest';

import {
  pinnedShellcheckVersion,
  resolveShellcheck,
  shellcheckVersion,
} from './repo-check-shellcheck-version.js';

/**
 * The shellcheck gate's version verdict: the pin read from the installer's
 * text, and whether the `shellcheck --version` probe shows that version
 * running. The installer file and the probe run are read at the process edge.
 */

const PINNED = '0.11.0';

const ON_PATH = 'the shellcheck on PATH';

describe('resolveShellcheck', () => {
  it('runs the repo-scoped shellcheck when the installer has put one in .tools/bin', () => {
    expect(resolveShellcheck(true)).toStrictEqual({
      command: '.tools/bin/shellcheck',
      source: '.tools/bin/shellcheck',
    });
  });

  it('runs the shellcheck on PATH otherwise', () => {
    expect(resolveShellcheck(false)).toStrictEqual({ command: 'shellcheck', source: ON_PATH });
  });
});

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
    expect(shellcheckVersion(probe, PINNED, ON_PATH)).toStrictEqual({ ok: true, value: '0.11.0' });
  });

  it('fails a probe that ran another version, naming the binary, both versions and the installer', () => {
    const probe = { status: 0, signal: null, stdout: 'version: 0.9.0\n', stderr: '' };
    const result = shellcheckVersion(probe, PINNED, '.tools/bin/shellcheck');
    const failure = result.ok ? '' : result.error;
    expect(failure).toContain('.tools/bin/shellcheck is shellcheck 0.9.0');
    expect(failure).toContain('pins 0.11.0');
    expect(failure).toContain('run .agent/setup/install-shellcheck.sh');
    expect(failure).toContain('installs it into .tools/bin');
  });

  it('fails a probe that could not run, naming the cause and how to install shellcheck', () => {
    const result = shellcheckVersion(
      { status: 1, signal: null, stdout: '', stderr: 'shellcheck: spawn shellcheck ENOENT\n' },
      PINNED,
      ON_PATH,
    );
    const failure = result.ok ? '' : result.error;
    expect(failure).toContain(
      'the shellcheck on PATH could not run (shellcheck: spawn shellcheck ENOENT)',
    );
    expect(failure).toContain('run .agent/setup/install-shellcheck.sh');
    expect(failure).toContain('never skips');
  });

  it('fails a probe that exited non-zero even when it printed a version line', () => {
    const probe = { status: 2, signal: null, stdout: 'version: 0.11.0\n', stderr: '' };
    const result = shellcheckVersion(probe, PINNED, ON_PATH);
    expect(result.ok ? '' : result.error).toContain('could not run (exit 2)');
  });

  it('fails a probe killed by a signal, naming the signal', () => {
    const probe = { status: null, signal: 'SIGKILL' as const, stdout: '', stderr: '' };
    const result = shellcheckVersion(probe, PINNED, ON_PATH);
    expect(result.ok ? '' : result.error).toContain('killed by SIGKILL');
  });

  it('fails a probe that exited 0 without a version line', () => {
    const probe = { status: 0, signal: null, stdout: 'usage: something else\n', stderr: '' };
    const result = shellcheckVersion(probe, PINNED, ON_PATH);
    expect(result.ok ? '' : result.error).toContain('no version line');
  });
});
