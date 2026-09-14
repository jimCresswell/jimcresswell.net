/**
 * The declaration a sub-agent template carries in its frontmatter.
 *
 * A template under `.agent/sub-agents/templates/` is the canonical role; its adapters on
 * each platform (`.cursor/agents/<name>.md`, `.claude/agents/<name>.md`,
 * `.codex/agents/<name>.toml` with its `.codex/config.toml` registration, and the Gemini
 * row `.gemini/agents/<name>.md`, the Gemini CLI subagents surface, the Director's ruling
 * item 70 of 2026-09-14) are thin pointers back to it that carry the description and each
 * platform's fields. The declaration is the one source for every adapter: the
 * generator (closure item 6, 2b-ii; `render-subagent-adapters.ts`) renders the Cursor,
 * Claude and Codex adapters under `pnpm portability:fix` and `pnpm portability:check`
 * recomputes them, so none is edited by hand (`compute-dont-hope`); the Codex registry and
 * the Gemini row follow in their own slices.
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
type SubagentPlatform = (typeof SUBAGENT_PLATFORMS)[number];

/** The three source surfaces the generator renders and the sweep once read (Gemini is generated only, slice B), and the two Markdown ones. */
export type SourcePlatform = Exclude<SubagentPlatform, 'gemini'>;
export type MarkdownPlatform = Exclude<SourcePlatform, 'codex'>;

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

/** The adapter-name shape a variant declares, shared with the derivation that mints one. */
export const ADAPTER_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

const variantSchema = z
  .object({
    name: line.regex(ADAPTER_NAME, 'a lowercase hyphenated adapter name'),
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

/** The platform blocks a role or a variant may carry, checked against its `platforms`. */
const BLOCKS = ['cursor', 'claude', 'codex', 'gemini'] as const;

/** A block for a platform the declaration does not list, or a platform listed twice. */
function platformIssue(
  declared: readonly SubagentPlatform[] | undefined,
  blocks: Partial<Record<(typeof BLOCKS)[number], unknown>>,
): string | undefined {
  if (declared === undefined) {
    return undefined;
  }
  if (new Set(declared).size !== declared.length) {
    return 'platforms: listed twice';
  }
  const stray = BLOCKS.find((block) => blocks[block] !== undefined && !declared.includes(block));
  return stray === undefined ? undefined : `${stray}: a block for a platform not in platforms`;
}

/** A variant whose name is not `<template>-<suffix>`, or whose blocks are off its platforms. */
function variantIssue(name: string, variant: z.infer<typeof variantSchema>): string | undefined {
  if (!variant.name.startsWith(`${name}-`)) {
    return `variants: "${variant.name}" is not a variant of ${name} (its name does not start with "${name}-")`;
  }
  const issue = platformIssue(variant.platforms, variant);
  return issue === undefined ? undefined : `variants: ${variant.name}: ${issue}`;
}

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
  // The shape is chosen by the presence of `variants` before parsing, so a refusal names
  // the offending key's path instead of the union's pathless "invalid input".
  const isFanOut =
    typeof frontmatter === 'object' && frontmatter !== null && 'variants' in frontmatter;
  const parsed = (isFanOut ? fanOutSchema : roleSchema).safeParse(frontmatter);
  if (!parsed.success) {
    return err(`${name}: ${shapeRefusal(parsed.error)}`);
  }
  const issue = bindingIssue(name, parsed.data);
  if (issue !== undefined) {
    return err(`${name}: ${issue}`);
  }
  if ('variants' in parsed.data) {
    return ok({ kind: 'fan-out', name, variants: parsed.data.variants });
  }
  return ok({ kind: 'role', name, ...parsed.data });
}

/** The schema's first issue with its path, so the offending key is findable. */
function shapeRefusal(error: z.ZodError): string {
  const issue = error.issues[0];
  const where = issue?.path.join('.') ?? '';
  return `${where === '' ? '' : `${where}: `}${issue?.message ?? 'invalid declaration'}`;
}

/** A variant name declared twice, naming the second by its index; a generator keyed by name could carry only one. */
function duplicateVariantIssue(
  variants: readonly z.infer<typeof variantSchema>[],
): string | undefined {
  const seen = new Map<string, number>();
  for (const [index, variant] of variants.entries()) {
    const first = seen.get(variant.name);
    if (first !== undefined) {
      return `variants.${String(index)}.name: "${variant.name}" duplicates variants.${String(first)}`;
    }
    seen.set(variant.name, index);
  }
  return undefined;
}

/** The first binding the parsed shape breaks: a variant off its template or declared twice, a block off its platforms. */
function bindingIssue(
  name: string,
  data: z.infer<typeof fanOutSchema> | z.infer<typeof roleSchema>,
): string | undefined {
  return 'variants' in data
    ? (duplicateVariantIssue(data.variants) ??
        data.variants.map((variant) => variantIssue(name, variant)).find(Boolean))
    : platformIssue(data.platforms, data);
}
