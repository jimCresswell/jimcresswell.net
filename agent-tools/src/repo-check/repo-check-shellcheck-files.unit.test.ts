import { describe, expect, it } from 'vitest';

import {
  BASH_FLOOR_GUARD,
  bashFloorFailures,
  isShellScript,
  shebangFailures,
  shellcheckArgs,
  silencingDirectiveFailures,
} from './repo-check-shellcheck-files.js';

/**
 * The shellcheck gate's pure mapping: which tracked files are shell scripts,
 * which shebangs fail the gate, which comments would silence shellcheck, and
 * the argv that lints them. Git's universe and the file contents are read at
 * the process edge, which the gate itself proves by running
 * (`pnpm lint:shell`).
 */

const RECOGNISED_FORMS = [
  '`#!/usr/bin/env bash`',
  '`#!/usr/bin/env sh`',
  '`#!/usr/bin/env node`',
  '`#!/usr/bin/env python3`',
].join(', ');

describe('isShellScript', () => {
  it('takes a .sh or .bash file as shell whatever its first line', () => {
    expect(isShellScript('.agent/setup/install-shellcheck.sh', '')).toBe(true);
    expect(isShellScript('scripts/profile.bash', '# sourced, no shebang\n')).toBe(true);
    expect(isShellScript('lib/misnamed.sh', '#!/usr/bin/env node\n')).toBe(true);
  });

  it('takes every file directly in .husky/ as shell, since husky runs each hook with sh', () => {
    expect(isShellScript('.husky/post-merge', 'pnpm install\n')).toBe(true);
    expect(isShellScript('.husky/pre-push', '#!/usr/bin/env sh\n')).toBe(true);
  });

  it('leaves out a file nested below .husky/, which is not a hook', () => {
    expect(isShellScript('.husky/docs/README', 'Hooks\n')).toBe(false);
  });

  it('takes a file as shell when its first line is exactly one of the two shell forms', () => {
    expect(isShellScript('bin/a', '#!/usr/bin/env bash\necho a\n')).toBe(true);
    expect(isShellScript('bin/b', '#!/usr/bin/env sh\necho b\n')).toBe(true);
  });

  it('takes a shell form as shell when a carriage return ends its line', () => {
    expect(isShellScript('bin/crlf', '#!/usr/bin/env bash\r\necho crlf\r\n')).toBe(true);
  });

  it('leaves out a file whose first line is a non-shell form or no recognised form', () => {
    expect(isShellScript('bin/run', '#!/usr/bin/env node\n')).toBe(false);
    expect(isShellScript('bin/check', '#!/usr/bin/env python3\n')).toBe(false);
    expect(isShellScript('bin/legacy', '#!/bin/bash\necho legacy\n')).toBe(false);
    expect(isShellScript('bin/indented', ' #!/usr/bin/env bash\n')).toBe(false);
  });

  it('does not take the files in a directory named like a script as scripts', () => {
    expect(isShellScript('fixtures.sh/README', 'plain text\n')).toBe(false);
  });
});

describe('shebangFailures', () => {
  it.each([
    '#!/usr/bin/env -S "bash" -e',
    "#!/usr/bin/env -S 'bash -e'",
    '#!/usr/bin/env -S bash',
    '#!/bin/sh',
    '#!/bin/bash',
    '#!/usr/bin/env zsh',
    '#!/usr/bin/env -S node --flag',
    '#!/usr/bin/env bash ',
    '#!/usr/bin/env  bash',
  ])('fails the unrecognised shebang %s, naming the file, the line and the forms', (line) => {
    expect(shebangFailures('bin/run', `${line}\necho run\n`)).toStrictEqual([
      `bin/run:1: the shebang \`${line}\` is not a recognised form; use one of ` +
        `${RECOGNISED_FORMS}, or add its form to the gate's SHEBANG_FORMS deliberately`,
    ]);
  });

  it.each([
    '#!/usr/bin/env bash',
    '#!/usr/bin/env sh',
    '#!/usr/bin/env node',
    '#!/usr/bin/env python3',
  ])('passes the recognised form %s, with or without a carriage return ending it', (line) => {
    expect(shebangFailures('bin/run', `${line}\nrun\n`)).toStrictEqual([]);
    expect(shebangFailures('bin/run', `${line}\r\nrun\r\n`)).toStrictEqual([]);
  });

  it('fails an unrecognised shebang on a file whose path makes it shell, naming only the shell forms', () => {
    expect(shebangFailures('lib/legacy.sh', '#!/bin/bash\n')).toStrictEqual([
      'lib/legacy.sh:1: the shebang `#!/bin/bash` is not a recognised shell form, ' +
        'and its path makes the file a shell script; use one of `#!/usr/bin/env bash`, ' +
        "`#!/usr/bin/env sh`, or add its form to the gate's SHEBANG_FORMS deliberately",
    ]);
  });

  it('fails a non-shell form on a file whose path makes it shell, advising a rename, not a new form', () => {
    expect(shebangFailures('lib/misnamed.sh', '#!/usr/bin/env node\n')).toStrictEqual([
      'lib/misnamed.sh:1: the shebang `#!/usr/bin/env node` is not a recognised shell form, ' +
        'and its path makes the file a shell script; use one of `#!/usr/bin/env bash`, ' +
        '`#!/usr/bin/env sh`, or rename a script that is not shell off that path',
    ]);
  });

  it(
    String.raw`writes each carriage return in the quoted line as \r, so a terminal cannot overwrite the file name`,
    () => {
      expect(shebangFailures('bin/mac', '#!/bin/sh\recho mac\r')).toStrictEqual([
        expect.stringContaining('bin/mac:1: the shebang `#!/bin/sh\\recho mac` is not'),
      ]);
    },
  );

  it('passes a file with no shebang, and a file whose path makes it shell with a shell form', () => {
    expect(shebangFailures('lib/common.sh', 'greet() { echo hi; }\n')).toStrictEqual([]);
    expect(shebangFailures('README.md', '# Readme\n')).toStrictEqual([]);
    expect(shebangFailures('.husky/pre-push', '#!/usr/bin/env sh\npnpm check\n')).toStrictEqual([]);
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

describe('bashFloorFailures', () => {
  const guarded = `#!/usr/bin/env bash\n# What the script does.\n\n${BASH_FLOOR_GUARD}\n  exit 1\nfi\necho run\n`;

  it('accepts a bash script whose first command is the floor guard, after comments and blank lines', () => {
    expect(bashFloorFailures('bin/run', guarded)).toStrictEqual([]);
  });

  it('leaves a script that is not bash alone', () => {
    expect(bashFloorFailures('.husky/pre-push', '#!/usr/bin/env sh\npnpm check\n')).toStrictEqual(
      [],
    );
    expect(bashFloorFailures('lib/common.sh', 'greet() { echo hi; }\n')).toStrictEqual([]);
  });

  it('fails a bash script with no guard, a guard after another command, or a lower floor', () => {
    for (const content of [
      '#!/usr/bin/env bash\necho run\n',
      guarded.replace(`${BASH_FLOOR_GUARD}\n`, `set -eu\n${BASH_FLOOR_GUARD}\n`),
      guarded.replace('BASH_VERSINFO[1] < 2', 'BASH_VERSINFO[1] < 1'),
    ]) {
      expect(bashFloorFailures('bin/run', content), content).toStrictEqual([
        expect.stringMatching(
          /^bin\/run: a bash script's first command is the bash floor guard, /u,
        ),
      ]);
    }
  });
});
