import { describe, expect, it } from 'vitest';

import { BASH_FLOOR_GUARD } from './repo-check-shellcheck-files.js';
import { runShellcheckTracked, type ShellcheckGateRuntime } from './repo-check-shellcheck.js';
import type { RepoCheckCommandResult } from './repo-check-types.js';

/**
 * The shellcheck gate's composition root, driven through its injected
 * runtime. The installer read, the repo-scoped binary's presence, the version
 * probe, git's tracked files, the file reads, the lint run and the two output
 * streams are simple fakes, so these tests prove the wiring: which shellcheck
 * is probed and run, what reaches the lint, what is written, and the status
 * returned. What a probe, a path or a script maps to is the pure
 * modules' (`repo-check-shellcheck-files.unit.test.ts`,
 * `repo-check-shellcheck-version.unit.test.ts`); the real edges are proved by
 * the gate running (`pnpm lint:shell`).
 */

const GATE_PREFIX = 'repo-check shellcheck-tracked: ';

const INSTALLER = '#!/usr/bin/env bash\nSHELLCHECK_VERSION=0.11.0\n';

const PROBE_0_11_0: RepoCheckCommandResult = {
  status: 0,
  signal: null,
  stdout: 'version: 0.11.0\n',
  stderr: '',
};

/** Tracked files and their text: a hook, a bash script and a sourced library to lint, a node script and a document to leave out. */
const TREE: ReadonlyMap<string, string> = new Map([
  ['.husky/pre-push', '#!/usr/bin/env sh\npnpm check\n'],
  ['README.md', '# Readme\n'],
  ['bin/run', `#!/usr/bin/env bash\n${BASH_FLOOR_GUARD}\n  exit 1\nfi\necho run\n`],
  ['bin/tool', '#!/usr/bin/env node\nconsole.log("tool");\n'],
  ['lib/common.sh', 'greet() { echo hi; }\n'],
]);

const SCRIPTS = ['.husky/pre-push', 'bin/run', 'lib/common.sh'];

/** The argv that lints `SCRIPTS` with the shellcheck on PATH. */
const LINT_SCRIPTS = [
  '-u',
  'SHELLCHECK_OPTS',
  'shellcheck',
  '--norc',
  '--severity=style',
  '--',
  ...SCRIPTS,
];

interface GateFixture {
  readonly installer?: string;
  readonly probe?: RepoCheckCommandResult;
  readonly tree?: ReadonlyMap<string, string>;
  readonly lintStatus?: number;
  readonly repoShellcheck?: boolean;
}

/**
 * A fake runtime over a fixture. `readHead` and `readText` model the file
 * system's documented contract, a file's text by its name, a head holding at
 * most the bytes asked for (the fixtures are ASCII, so a character is a byte,
 * and a head may hold the whole of a short file); every lint run and written
 * line is recorded.
 */
function gateRuntime(fixture: GateFixture = {}) {
  const tree = fixture.tree ?? TREE;
  const probes: string[] = [];
  const lintRuns: (readonly string[])[] = [];
  const lines: string[] = [];
  const failures: string[] = [];
  const runtime: ShellcheckGateRuntime = {
    readInstaller: () => fixture.installer ?? INSTALLER,
    hasRepoShellcheck: () => fixture.repoShellcheck ?? false,
    probeVersion: (command) => {
      probes.push(command);
      return fixture.probe ?? PROBE_0_11_0;
    },
    trackedFiles: () => [...tree.keys()],
    readHead: (file, bytes) => (tree.get(file) ?? '').slice(0, bytes),
    readText: (file) => tree.get(file) ?? '',
    runEnv: (args) => {
      lintRuns.push(args);
      return Promise.resolve(fixture.lintStatus ?? 0);
    },
    writeLine: (line) => lines.push(line),
    writeFailure: (line) => failures.push(line),
  };
  return { runtime, probes, lintRuns, lines, failures };
}

describe('runShellcheckTracked', () => {
  it('lints exactly the shell scripts among the tracked files with the shellcheck on PATH, and passes a clean lint', async () => {
    const { runtime, probes, lintRuns, lines, failures } = gateRuntime();

    await expect(runShellcheckTracked(runtime)).resolves.toBe(0);

    expect(probes).toStrictEqual(['shellcheck']);
    expect(lintRuns).toStrictEqual([LINT_SCRIPTS]);
    expect(lines).toStrictEqual([
      `${GATE_PREFIX}shellcheck 0.11.0 (the shellcheck on PATH) over 3 tracked shell scripts`,
    ]);
    expect(failures).toStrictEqual([]);
  });

  it('probes and runs the repo-scoped shellcheck when the installer has put one in .tools/bin', async () => {
    const { runtime, probes, lintRuns, lines } = gateRuntime({ repoShellcheck: true });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(0);

    expect(probes).toStrictEqual(['.tools/bin/shellcheck']);
    expect(lintRuns).toStrictEqual([
      [
        '-u',
        'SHELLCHECK_OPTS',
        '.tools/bin/shellcheck',
        '--norc',
        '--severity=style',
        '--',
        ...SCRIPTS,
      ],
    ]);
    expect(lines).toStrictEqual([
      `${GATE_PREFIX}shellcheck 0.11.0 (.tools/bin/shellcheck) over 3 tracked shell scripts`,
    ]);
  });

  it('fails an unrecognised shebang, naming the file and its line, and still lints the recognised scripts', async () => {
    const tree = new Map([...TREE, ['bin/quoted', '#!/usr/bin/env -S "bash" -e\necho quoted\n']]);
    const { runtime, lintRuns, failures } = gateRuntime({ tree });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lintRuns).toStrictEqual([LINT_SCRIPTS]);
    expect(failures).toStrictEqual([
      expect.stringMatching(
        /^repo-check shellcheck-tracked: bin\/quoted:1: the shebang `#!\/usr\/bin\/env -S "bash" -e` is not a recognised form;/u,
      ),
    ]);
  });

  it('names the whole of an unrecognised shebang line as long as macOS honours, 512 bytes', async () => {
    // `#!/` (3 bytes), 100 directories of `long/` (500), `bin/bash` (8), then the newline.
    const longShebang = `#!/${'long/'.repeat(100)}bin/bash`;
    const tree = new Map([...TREE, ['bin/long', `${longShebang}\necho long\n`]]);
    const { runtime, failures } = gateRuntime({ tree });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(failures).toStrictEqual([
      expect.stringContaining(`${GATE_PREFIX}bin/long:1: the shebang \`${longShebang}\` is not`),
    ]);
  });

  it('returns the lint status when shellcheck reports a finding', async () => {
    const { runtime } = gateRuntime({ lintStatus: 1 });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);
  });

  it('fails a disable directive in a script whose lint is clean, and still runs the lint', async () => {
    const tree = new Map([
      ...TREE,
      [
        'bin/run',
        `#!/usr/bin/env bash\n# shellcheck disable=SC2086\n${BASH_FLOOR_GUARD}\n  exit 1\nfi\necho $1\n`,
      ],
    ]);
    const { runtime, lintRuns, failures } = gateRuntime({ tree });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lintRuns).toHaveLength(1);
    expect(failures).toStrictEqual([
      expect.stringMatching(/^repo-check shellcheck-tracked: bin\/run:2: /u),
    ]);
  });

  it('fails a bash script that lacks the bash floor guard, and still runs the lint', async () => {
    const tree = new Map([...TREE, ['bin/run', '#!/usr/bin/env bash\necho run\n']]);
    const { runtime, lintRuns, failures } = gateRuntime({ tree });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lintRuns).toHaveLength(1);
    expect(failures).toStrictEqual([
      expect.stringMatching(
        /^repo-check shellcheck-tracked: bin\/run: a bash script's first command /u,
      ),
    ]);
  });

  it('fails without linting when the installer pins no version', async () => {
    const { runtime, lintRuns, failures } = gateRuntime({ installer: '#!/usr/bin/env bash\n' });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lintRuns).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(/^repo-check shellcheck-tracked: .*SHELLCHECK_VERSION/u),
    ]);
  });

  it('fails without linting when the shellcheck it resolved is another version', async () => {
    const probe = { ...PROBE_0_11_0, stdout: 'version: 0.9.0\n' };
    const { runtime, lintRuns, failures } = gateRuntime({ probe });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lintRuns).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(
        /^repo-check shellcheck-tracked: the shellcheck on PATH is shellcheck 0\.9\.0,/u,
      ),
    ]);
  });

  it('fails without linting when git lists no shell scripts', async () => {
    const tree = new Map([['README.md', '# Readme\n']]);
    const { runtime, lintRuns, failures } = gateRuntime({ tree });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lintRuns).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(/^repo-check shellcheck-tracked: .*no tracked shell scripts/u),
    ]);
  });

  it('still names each refused shebang when git lists no shell scripts', async () => {
    const tree = new Map([['bin/legacy', '#!/bin/bash\necho legacy\n']]);
    const { runtime, lintRuns, failures } = gateRuntime({ tree });

    await expect(runShellcheckTracked(runtime)).resolves.toBe(1);

    expect(lintRuns).toStrictEqual([]);
    expect(failures).toStrictEqual([
      expect.stringMatching(
        /^repo-check shellcheck-tracked: bin\/legacy:1: the shebang `#!\/bin\/bash` is not/u,
      ),
      expect.stringMatching(/^repo-check shellcheck-tracked: .*no tracked shell scripts/u),
    ]);
  });
});
