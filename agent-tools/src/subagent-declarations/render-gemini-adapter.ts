/**
 * The Gemini CLI adapter of a declaration (closure item 6, 2b-ii, slice B; the owner's
 * ruling of 2026-09-13 and word of 2026-09-14: the Gemini projection is the generator's
 * fourth output, no hand-authored extension). The Gemini CLI reads project sub-agents from
 * `.gemini/agents/<name>.md`: YAML frontmatter with `name` and `description` required and
 * `kind`, `tools` (a list; absent inherits every tool of the parent session), `model`,
 * `temperature`, `max_turns` and `timeout_mins` optional, the body the agent's system
 * prompt (the Gemini CLI subagents reference, read 2026-09-14). The frontmatter carries the
 * declared fields in the reference's order; a role fills the one estate default the CLI's
 * own default would invert, the read-only tool list (every other surface is observe-only by
 * a structural field: Cursor `readonly`, Claude's disallowed tools and plan mode, Codex's
 * sandbox and approval policy), and a variant renders only what it declares; every other
 * absent field is the CLI's default. Each tool name and the model go through the measured
 * scalar rule, so a wildcard such as `*` is written as YAML reads it. The body is the
 * estate's pointer skeleton with the Gemini pre-pointer line and closing
 * (`standard-adapter-body.ts`, measured from nothing since no hand-kept Gemini adapter ever
 * existed).
 *
 * @packageDocumentation
 */

import { pointerLine, type AdapterSpec } from './adapter-spec.js';
import { STANDARD_CLOSINGS, STANDARD_PRE_POINTER } from './standard-adapter-body.js';
import type { GeminiFields } from './subagent-declaration.js';
import { yamlQuoted, yamlScalar } from './yaml-scalar.js';

/**
 * The estate's default for a role's Gemini adapter: the CLI's read-only file-system tools
 * (`list_directory`, `read_file`, `glob`, `grep_search`; the file-system tools reference,
 * read 2026-09-14), since an absent `tools` inherits every tool of the parent session, the
 * writing ones included, which the estate's observe-only invariant forbids.
 */
const GEMINI_DEFAULTS = {
  tools: ['read_file', 'list_directory', 'glob', 'grep_search'],
} as const;

/** The Gemini frontmatter fields in the order the reference lists them. */
const GEMINI_KEY_ORDER = [
  'kind',
  'tools',
  'model',
  'temperature',
  'max_turns',
  'timeout_mins',
] as const;

/** A list as the frontmatter carries it: a block sequence, or the explicit empty list. */
function listLines(key: string, tools: readonly string[]): string[] {
  return tools.length === 0
    ? [`${key}: []`]
    : [`${key}:`, ...tools.map((tool) => `  - ${yamlScalar(tool)}`)];
}

/** One field as its frontmatter lines; `model` through the scalar rule, the rest as the schema admits them. */
function fieldLines(key: (typeof GEMINI_KEY_ORDER)[number], gemini: GeminiFields): string[] {
  const value = gemini[key];
  if (value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return listLines(key, value);
  }
  return [`${key}: ${key === 'model' ? yamlScalar(String(value)) : String(value)}`];
}

/** The fields a spec renders: a role with the read-only default filled, a variant as declared. */
function geminiFieldsOf(spec: AdapterSpec): GeminiFields {
  const declared = spec.gemini ?? {};
  return spec.fillDefaults && declared.tools === undefined
    ? { ...declared, tools: [...GEMINI_DEFAULTS.tools] }
    : declared;
}

/**
 * The Gemini adapter text for a spec.
 *
 * @param spec - The role or variant, with its declared Gemini fields.
 */
export function renderGeminiAdapter(spec: AdapterSpec): string {
  const gemini = geminiFieldsOf(spec);
  const head = [
    '---',
    `name: ${spec.name}`,
    `description: ${yamlQuoted(spec.description)}`,
    ...GEMINI_KEY_ORDER.flatMap((key) => fieldLines(key, gemini)),
    '---',
  ];
  const body = `\n# ${spec.title}\n\n${STANDARD_PRE_POINTER.gemini}\n\n${pointerLine('gemini', spec, undefined)}\n\n${STANDARD_CLOSINGS.gemini}\n`;
  return `${head.join('\n')}\n${body}`;
}
