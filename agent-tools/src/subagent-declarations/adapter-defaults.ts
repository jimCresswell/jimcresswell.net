/**
 * The estate's default adapter fields. A ROLE declares only its deviations from these and
 * the renderers fill the rest; a VARIANT renders exactly what it declares. Once the readings
 * of the retired frontmatter sweep (`derive-subagent-declaration.ts`), which minted the
 * declarations from hand-kept adapters; the declarations are the one source now and the
 * defaults are all the renderers need of that module.
 *
 * @packageDocumentation
 */

/** The Claude adapter's default fields. */
export const CLAUDE_DEFAULTS = {
  tools: 'Read, Grep, Glob, Bash',
  disallowedTools: 'Write, Edit',
  permissionMode: 'plan',
} as const;

/** The Codex adapter's default fields. */
export const CODEX_DEFAULTS = { effort: 'high' } as const;
