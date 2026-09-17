import { describe, expect, it } from 'vitest';

import { relativeScriptIssue } from './claude-hook-script-anchoring.js';

const UNANCHORED =
  'runs a program or an interpreter\'s script that is not a quoted project path, and the working directory is not always the project root; name it by a quoted "${CLAUDE_PROJECT_DIR}/path" instead';
const OUTSIDE_GRAMMAR =
  'is outside the checked hook-command grammar (a quoted project path to an .mjs or .sh hook, or node and its script at a quoted project path, optionally after the hook-error wrapper, then plain words); rewrite it in that grammar, or widen the grammar deliberately where a real hook needs more';
const WRAPPER = '"${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh"';

function expectIssue(commands: readonly string[], issue: string | undefined): void {
  for (const command of commands) {
    expect(relativeScriptIssue(command), command).toBe(issue);
  }
}

describe('relativeScriptIssue', () => {
  it('accepts every command .claude/settings.json runs', () => {
    expectIssue(
      [
        '"${CLAUDE_PROJECT_DIR}/.claude/hooks/practice-session-identity.mjs"',
        '"${CLAUDE_PROJECT_DIR}/.claude/hooks/plan-gate-drift-alert.mjs"',
        'node "${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/run-pretooluse-guard.mjs" agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js',
        `${WRAPPER} "\${CLAUDE_PROJECT_DIR}/.claude/hooks/secrets/pretool-secrets.sh"`,
        `${WRAPPER} "\${CLAUDE_PROJECT_DIR}/.claude/hooks/secrets/prompt-secrets.sh"`,
        `${WRAPPER} node "\${CLAUDE_PROJECT_DIR}/agent-tools/src/bin/claude-pre-compact-observe-hook.ts"`,
        'node "${CLAUDE_PROJECT_DIR}/.claude/scripts/statusline-identity.mjs"',
      ],
      undefined,
    );
  });

  it('accepts the two dependences on the working directory the grammar cannot close', () => {
    // "${CLAUDE_PROJECT_DIR:-.}" resolves against the working directory when the variable is unset
    // or empty. The three PreToolUse guard commands use it; removing it is a security-reviewed fix of
    // its own. A hook script also decides what its data words mean: run-pretooluse-guard.mjs
    // resolves its guard path against the project directory.
    expectIssue(
      [
        '"${CLAUDE_PROJECT_DIR:-.}/x.mjs"',
        'node "${CLAUDE_PROJECT_DIR:-.}/x.mjs"',
        'node "${CLAUDE_PROJECT_DIR}/x.mjs" relative/data/arg.js',
        '"${CLAUDE_PROJECT_DIR}/x.sh" ./data.json',
      ],
      undefined,
    );
  });

  it('reports a program or node script that is not a quoted project path, first or after the wrapper', () => {
    expectIssue(
      [
        '.claude/hooks/practice-session-identity.mjs',
        './scripts/x.sh --flag',
        'node hook.mjs',
        'node .claude/hooks/x.mjs',
        'node C:hook.mjs',
        String.raw`node C:\repo\hook.mjs`,
        '/usr/bin/node ./hook.mjs',
        'node "${claude_project_dir}/x.mjs"',
        '"${CLAUDE_PROJECT_DIR_OLD}/hook.mjs"',
        'node "$CLAUDE_PROJECT_DIR/x.mjs"',
        '"~/hook.mjs"',
        'node "~/hook.mjs"',
        `${WRAPPER} ./hook.mjs`,
        `${WRAPPER} node hook.mjs`,
        'node\t"${CLAUDE_PROJECT_DIR}/x.mjs"',
        './a.sh && ./b.sh',
        'node "${CLAUDE_PROJECT_DIR}/$(./x.sh).mjs"',
        '"${CLAUDE_PROJECT_DIR}/`./b.sh`.sh"',
        '"${CLAUDE_PROJECT_DIR:-./hooks}/x.sh"',
        '"${CLAUDE_PROJECT_DIR:-..}/x.sh"',
        '"${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/Log-Hook-Errors.sh" node hook.mjs',
      ],
      UNANCHORED,
    );
  });

  it('reports the forms no known hook uses: other interpreters, assignments, env, other extensions, and other anchors', () => {
    // The closed-shape rule (.agent/rules/closed-shape-design-optionality.md): the grammar admits only
    // what the commands in .claude/settings.json use. Falsifier: a real hook that needs another
    // interpreter, an assignment, env, another extension, or a home, absolute or drive path widens
    // the grammar deliberately.
    expectIssue(['~/hooks/x.mjs', 'C:/repo/x.mjs', '/usr/bin/nohup ./hook.mjs'], UNANCHORED);
    expectIssue(
      [
        String.raw`"C:\repo\x.mjs"`,
        String.raw`"C:\\repo\\x.mjs"`,
        'bash "${CLAUDE_PROJECT_DIR}/x.sh"',
        'python3 "${CLAUDE_PROJECT_DIR}/x.py"',
        'NODE "${CLAUDE_PROJECT_DIR}/x.mjs"',
        'HOOK_MODE=1 "${CLAUDE_PROJECT_DIR}/x.mjs"',
        'HOOK_MODE=1 ./hook.mjs',
        'HOOK_MODE=1 node hook.mjs',
        'HOOK_MODE=1',
        'env',
        'env -u X ./hook.mjs',
        'PATH=/usr/bin node "${CLAUDE_PROJECT_DIR}/x.mjs"',
        'NODE_OPTIONS=--require=./pre.cjs node "${CLAUDE_PROJECT_DIR}/x.mjs"',
        'env "${CLAUDE_PROJECT_DIR}/x.mjs"',
        '"${CLAUDE_PROJECT_DIR}/x.ts"',
        '"${CLAUDE_PROJECT_DIR}/bin/dash" hook.sh',
        '"${CLAUDE_PROJECT_DIR}"',
      ],
      OUTSIDE_GRAMMAR,
    );
  });

  it('reports the wrapper with nothing to run, run by itself or an interpreter, or not a quoted project path', () => {
    expectIssue(
      [
        WRAPPER,
        `${WRAPPER} ${WRAPPER} ./hook.mjs`,
        `bash ${WRAPPER} ./hook.mjs`,
        `sh ${WRAPPER} node hook.mjs`,
        `${WRAPPER} -- "\${CLAUDE_PROJECT_DIR}/x.sh"`,
        `${WRAPPER} HOOK_MODE=1 "\${CLAUDE_PROJECT_DIR}/x.sh"`,
        'log-hook-errors.sh "${CLAUDE_PROJECT_DIR}/x.sh"',
      ],
      OUTSIDE_GRAMMAR,
    );
  });

  it('reports node without its script, an unlisted bare program, and a data word that is not plain', () => {
    expectIssue(
      [
        'node',
        'node --eval 1',
        'node  "${CLAUDE_PROJECT_DIR}/x.mjs"',
        'node\thook.mjs',
        'node\nhook.mjs',
        'jq --version',
        'C:hook.cmd',
        '"c:hook.cmd"',
        '"${CLAUDE_PROJECT_DIR}/a.sh" && ./b.sh',
        '"${CLAUDE_PROJECT_DIR}/a.sh" `./b.sh`',
        '"${CLAUDE_PROJECT_DIR}/a.sh" "${CLAUDE_PROJECT_DIR}/data"',
        '"${CLAUDE_PROJECT_DIR}/x.sh" x;./b.sh',
        '"${CLAUDE_PROJECT_DIR}/x.sh" x|./b.sh',
        '"${CLAUDE_PROJECT_DIR}/x.sh" x&./b.sh',
        '"${CLAUDE_PROJECT_DIR}/x.sh" x$(./b.sh)',
        '-/x.sh',
        '',
      ],
      OUTSIDE_GRAMMAR,
    );
  });

  it('reports shell forms that ran a program from the working directory in bash, or would', () => {
    expectIssue(
      [
        '/usr/bin/timeout 5 ./hook.mjs',
        '/usr/bin/perl hook.pl',
        '/opt/homebrew/bin/python3.12 tools/hook.py',
        'C:/npm/tsx.cmd hook.ts',
        '~/.local/bin/uv run hook.py',
        '/bin/bas? hook.sh',
        "/usr/bin/$'node' hook.mjs",
        '/usr/bin/env{,} ./hook.mjs',
        '/usr/bin/{env,node} hook.mjs',
        '/usr/bin/env${IFS}./hook.mjs',
        '"${CLAUDE_PROJECT_DIR}/a.sh"\n./b.sh',
      ],
      UNANCHORED,
    );
    expectIssue(
      [
        'HOOK=${X// /} ./hook.mjs',
        'HOOK=${X:-a /opt/hooks/x.sh b} ./hook.mjs',
        'HOOK=${X:-a node /opt/x.mjs b} ./hook.mjs',
        'HOOK="${X:-"a /opt/hooks/x.sh b"}" ./hook.mjs',
        String.raw`HOOK=$'\'x'' /opt/hooks/x.sh '\' ./hook.mjs`,
        'HOOK=$[ node /1] ./hook.mjs',
        'PATH=. node "${CLAUDE_PROJECT_DIR}/x.mjs"',
      ],
      OUTSIDE_GRAMMAR,
    );
  });
});
