/**
 * The declaration a sub-agent template carries in its frontmatter.
 *
 * A template under `.agent/sub-agents/templates/` is the canonical role; its adapters on
 * each platform (`.cursor/agents/<name>.md`, `.claude/agents/<name>.md`,
 * `.codex/agents/<name>.toml` with its `.codex/config.toml` registration, and the Gemini
 * row `.gemini/agents/<name>.md`) are thin pointers back to it that carry the description
 * and each platform's fields. The declaration is the one source for every adapter: the
 * generator (closure item 6, 2b-ii) derives them, `pnpm portability:fix` writes them and
 * `pnpm portability:check` recomputes them; none is edited by hand (`compute-dont-hope`).
 *
 * Two shapes, never both: a ROLE declares one description and, only where a platform's
 * fields deviate from the estate's defaults, those fields; a FAN-OUT (the cricket templates)
 * declares no description of its own and a list of VARIANTS, each an adapter in its own
 * name with every platform field written out and the platform-specific prose its adapters
 * carry, because the variants differ by design (the owner's dual-scale label per platform
 * and per effort) and are never flattened (Director's ruling, 2026-09-14).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { z } from 'zod';

/** The platforms an adapter can be projected to, in the order the surfaces are listed. */
const SUBAGENT_PLATFORMS = ['cursor', 'claude', 'codex', 'gemini'] as const;

/** A member of {@link SUBAGENT_PLATFORMS}. */
export type SubagentPlatform = (typeof SUBAGENT_PLATFORMS)[number];

const platform = z.enum(SUBAGENT_PLATFORMS);
const line = z
  .string()
  .min(1)
  .refine((value) => !value.includes('\n'), 'one line');

/**
 * Prose an adapter body carries beyond the standard shape, verbatim: what follows the
 * template path inside the pointer paragraph, and the closing paragraphs after it. A role
 * declares them only where they deviate from the platform's standard closing; a variant
 * declares every note it carries.
 */
const prose = {
  pointerTail: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
};

/** Claude Code adapter fields; every one optional, absent means the estate's default. */
const claudeFields = z
  .object({
    /** A comma-joined tool list, or `inherit` for an adapter that carries no tools field. */
    tools: line.optional(),
    disallowedTools: line.optional(),
    permissionMode: line.optional(),
    color: line.optional(),
    model: line.optional(),
    effort: line.optional(),
    ...prose,
  })
  .strict();

/** Codex adapter fields; absent means the estate's default. */
const codexFields = z
  .object({
    model: line.optional(),
    effort: line.optional(),
    ...prose,
  })
  .strict();

/** Cursor adapter fields; a variant may carry its own description. */
const cursorFields = z
  .object({
    description: line.optional(),
    ...prose,
  })
  .strict();

/**
 * Gemini adapter fields: exactly the optional frontmatter fields the Gemini CLI subagents
 * reference names (https://geminicli.com/docs/core/subagents/, read 2026-09-14), each emitted
 * only when declared and never defaulted here (the CLI's own defaults apply: `kind` local,
 * `model` inherit, `temperature` 1, `max_turns` 30, `timeout_mins` 10). `name` and
 * `description` come from the declaration itself; `mcpServers` (inline MCP servers scoped
 * to one agent) is host configuration, not a role's declaration, and is not carried.
 */
const geminiFields = z
  .object({
    kind: z.enum(['local', 'remote']).optional(),
    tools: z.array(line).min(1).optional(),
    model: line.optional(),
    temperature: z.number().min(0).max(2).optional(),
    max_turns: z.number().int().positive().optional(),
    timeout_mins: z.number().int().positive().optional(),
  })
  .strict();

const variantSchema = z
  .object({
    name: line.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, 'a lowercase hyphenated adapter name'),
    platforms: z.array(platform).min(1),
    description: line,
    /** The adapter heading where it is not the name in title case. */
    title: line.optional(),
    cursor: cursorFields.optional(),
    claude: claudeFields.optional(),
    codex: codexFields.optional(),
    gemini: geminiFields.optional(),
  })
  .strict();

const roleSchema = z
  .object({
    description: line,
    platforms: z.array(platform).min(1).optional(),
    cursor: cursorFields.optional(),
    claude: claudeFields.optional(),
    codex: codexFields.optional(),
    gemini: geminiFields.optional(),
  })
  .strict();

const fanOutSchema = z.object({ variants: z.array(variantSchema).min(1) }).strict();

const declarationSchema = z.union([roleSchema, fanOutSchema]);

export type ClaudeFields = z.infer<typeof claudeFields>;
export type CodexFields = z.infer<typeof codexFields>;
export type CursorFields = z.infer<typeof cursorFields>;
type GeminiFields = z.infer<typeof geminiFields>;
export type SubagentVariant = z.infer<typeof variantSchema>;

/** A role: one adapter per platform under the template's own name. */
export interface RoleDeclaration {
  readonly kind: 'role';
  readonly name: string;
  readonly description: string;
  /** The platforms carrying an adapter; every platform when absent. */
  readonly platforms?: readonly SubagentPlatform[];
  readonly cursor?: CursorFields;
  readonly claude?: ClaudeFields;
  readonly codex?: CodexFields;
  readonly gemini?: GeminiFields;
}

/** A fan-out: adapters only under the variants' names, never the template's. */
export interface FanOutDeclaration {
  readonly kind: 'fan-out';
  readonly name: string;
  readonly variants: readonly SubagentVariant[];
}

export type SubagentDeclaration = RoleDeclaration | FanOutDeclaration;

/**
 * Parse a template's frontmatter value into a declaration.
 *
 * @param name - The template's basename without `.md`.
 * @param frontmatter - The parsed YAML value (unknown at the boundary).
 * @returns The declaration, or the schema's first refusal.
 */
export function parseSubagentDeclaration(
  name: string,
  frontmatter: unknown,
): Result<SubagentDeclaration, string> {
  const parsed = declarationSchema.safeParse(frontmatter);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const where = issue?.path.join('.') ?? '';
    return err(
      `${name}: ${where === '' ? '' : `${where}: `}${issue?.message ?? 'invalid declaration'}`,
    );
  }
  if ('variants' in parsed.data) {
    return ok({ kind: 'fan-out', name, variants: parsed.data.variants });
  }
  return ok({ kind: 'role', name, ...parsed.data });
}
