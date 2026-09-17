import { describe, expect, it } from 'vitest';

import {
  isShellScript,
  shellcheckArgs,
  silencingDirectiveFailures,
} from './repo-check-shellcheck-files.js';

/**
 * The shellcheck gate's pure mapping: which tracked files are shell scripts,
 * which of their comments would silence shellcheck, and the argv that lints
 * them. Git's universe and the file contents are read at the process edge,
 * which the gate itself proves by running (`pnpm lint:shell`).
 */

describe('isShellScript', () => {
  it('takes a .sh or .bash file as shell whatever its first line', () => {
    expect(isShellScript('.agent/setup/install-shellcheck.sh', '')).toBe(true);
    expect(isShellScript('scripts/profile.bash', '# sourced, no shebang\n')).toBe(true);
  });

  it('takes every file directly in .husky/ as shell, since husky runs each hook with sh', () => {
    expect(isShellScript('.husky/post-merge', 'pnpm install\n')).toBe(true);
    expect(isShellScript('.husky/pre-push', '#!/usr/bin/env sh\n')).toBe(true);
  });

  it('leaves out a file nested below .husky/, which is not a hook', () => {
    expect(isShellScript('.husky/docs/README', 'Hooks\n')).toBe(false);
  });

  it('takes an extensionless file as shell when its first line names sh, bash, dash or ksh', () => {
    expect(isShellScript('bin/a', '#!/bin/bash -eu\n')).toBe(true);
    expect(isShellScript('bin/b', '#! /bin/dash\n')).toBe(true);
    expect(isShellScript('bin/c', '#!/usr/bin/env -S ksh -e\n')).toBe(true);
    expect(isShellScript('bin/d', '#!/bin/sh\r\necho windows line ending\r\n')).toBe(true);
  });

  it('leaves out a file whose shebang names another interpreter or a longer name', () => {
    expect(isShellScript('bin/run', '#!/usr/bin/env node\n')).toBe(false);
    expect(isShellScript('bin/check.py', '#!/usr/bin/env python3\n')).toBe(false);
    expect(isShellScript('bin/zrun', '#!/usr/bin/env zsh\n')).toBe(false);
    expect(isShellScript('bin/fun', '#!/bin/bashful\n')).toBe(false);
  });

  it('reads the shebang from the first line alone, so a shell named on the next line does not count', () => {
    expect(isShellScript('bin/split', '#!/usr/bin/env\nbash\n')).toBe(false);
  });

  it('does not take the files in a directory named like a script as scripts', () => {
    expect(isShellScript('fixtures.sh/README', 'plain text\n')).toBe(false);
  });
});

describe('silencingDirectiveFailures', () => {
  it('names each line whose shellcheck directive disables checks, overrides the shell or narrows the analysis', () => {
    const content = [
      '#!/bin/sh',
      '# shellcheck disable=SC2086',
      'echo $1',
      '  #shellcheck source=/dev/null disable=all',
      '. "$1"',
      '# shellcheck shell=bash',
      '[[ -n "$1" ]]',
      '# shellcheck extended-analysis=false',
      'x=$1',
      '',
    ].join('\n');
    const failures = silencingDirectiveFailures('bin/run.sh', content);
    expect(failures).toHaveLength(4);
    expect(failures[0]).toContain('bin/run.sh:2: a shellcheck disable= directive');
    expect(failures[1]).toContain('bin/run.sh:4: a shellcheck disable= directive');
    expect(failures[2]).toContain('bin/run.sh:6: a shellcheck shell= directive');
    expect(failures[2]).toContain('add a shebang naming the shell');
    expect(failures[3]).toContain('bin/run.sh:8: a shellcheck extended-analysis= directive');
  });

  it('passes directives that disable nothing, and comments that are not directives', () => {
    const content = [
      '#!/bin/sh',
      '# shellcheck source=lib.sh',
      '# shellcheck enable=require-variable-braces',
      '# the gate refuses disable= and shell= directives',
      'echo "${1}"',
      '',
    ].join('\n');
    expect(silencingDirectiveFailures('bin/run.sh', content)).toStrictEqual([]);
  });
});

describe('shellcheckArgs', () => {
  it('runs the given shellcheck through env with SHELLCHECK_OPTS removed, no rc file, every severity', () => {
    expect(shellcheckArgs('.tools/bin/shellcheck', ['.husky/pre-push', 'a b.sh'])).toStrictEqual([
      '-u',
      'SHELLCHECK_OPTS',
      '.tools/bin/shellcheck',
      '--norc',
      '--severity=style',
      '--',
      '.husky/pre-push',
      'a b.sh',
    ]);
  });
});
