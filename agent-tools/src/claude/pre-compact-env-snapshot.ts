/**
 * Environment snapshot for the Claude Code `PreCompact` observer.
 *
 * @remarks
 * Loaded from TypeScript source by the hook entry
 * (`src/bin/claude-pre-compact-observe-hook.ts`), so a relative import added
 * here must name its `.ts` file.
 *
 * @packageDocumentation
 */

import { typeSafeKeys } from '@engraph/type-helpers';

/**
 * Environment values recorded with their contents.
 *
 * @remarks
 * Identifiers and session-shape flags only — the variables whose VALUE is the
 * finding (`CLAUDE_CODE_CHILD_SESSION` says whether a hook fired inside a
 * subagent; `CLAUDE_CODE_SESSION_ATTENDED` says whether a human was watching).
 * Every other `CLAUDE_*` / `PRACTICE_*` variable is recorded by NAME with its
 * value withheld, which keeps the credential and transport variables the
 * harness exports (`CLAUDE_CODE_MESSAGING_TOKEN`,
 * `CLAUDE_CODE_MESSAGING_SOCKET`, `CLAUDE_CODE_SSE_PORT`) out of the log
 * permanently. An allowlist, never a denylist: a variable the harness adds
 * tomorrow is withheld by default.
 */
const ENV_VALUE_ALLOWLIST: readonly string[] = [
  'CLAUDE_PROJECT_DIR',
  'CLAUDE_CODE_SESSION_ID',
  'CLAUDE_CODE_ENTRYPOINT',
  'CLAUDE_CODE_CHILD_SESSION',
  'CLAUDE_CODE_SESSION_ATTENDED',
  'CLAUDE_EFFORT',
  'CLAUDE_PID',
  'PRACTICE_AGENT_SESSION_ID_CLAUDE',
];

const ENV_NAME_PATTERN = /^(?:CLAUDE|PRACTICE)_/;

/** The hook's environment split into recorded values and withheld names. */
export interface EnvSnapshot {
  readonly values: Readonly<Record<string, string>>;
  readonly withheld: readonly string[];
}

/**
 * Split the hook's environment into recorded values and withheld names.
 *
 * @param env - The process environment as the hook received it.
 * @returns Allowlisted identifiers with their values, and every other
 *   `CLAUDE_*` / `PRACTICE_*` variable by name alone; other namespaces are
 *   ignored entirely.
 */
export function snapshotEnv(env: Readonly<Record<string, string | undefined>>): EnvSnapshot {
  const values: Record<string, string> = {};
  const withheld: string[] = [];

  for (const name of typeSafeKeys(env).sort((left, right) => left.localeCompare(right))) {
    if (!ENV_NAME_PATTERN.test(name)) {
      continue;
    }
    const value = env[name];
    if (value !== undefined && ENV_VALUE_ALLOWLIST.includes(name)) {
      values[name] = value;
      continue;
    }
    withheld.push(name);
  }

  return { values, withheld };
}
