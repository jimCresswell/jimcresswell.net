/**
 * The sub-agent adapter generator (closure item 6, 2b-ii): every template's declaration
 * renders its Cursor, Claude and Codex adapters, byte for byte, in the estate's one adapter
 * shape (`standard-adapter-body.ts`): the frontmatter or the TOML head, the title, the
 * platform's pre-pointer line, the pointer sentence, and the closing prose. A ROLE renders
 * from the defaults it does not deviate from (`derive-subagent-declaration.ts`); a VARIANT
 * renders exactly what it declares, no default filled. The adapters are outputs: the
 * portability validator compares the surfaces with what this renders and `--fix` writes it
 * (`validators/portability/subagent-projection-validation.ts`), so nothing on them is
 * hand-kept.
 *
 * Serialisation is one form per platform, measured on the estate's 86 adapters on
 * 2026-09-14: a Markdown description is a quoted YAML scalar on one line in the quote style
 * the estate's formatter keeps (`yamlQuoted` states it; four hand-kept Cursor files carried
 * a folded form and three the other quote style, and normalise on the first regeneration);
 * every other Claude field value is plain where YAML reads it plain and quoted by the same
 * rule otherwise (`yamlScalar`); the Claude field order is the one that reproduces
 * every file, `tools`, `disallowedTools`, `color`, `permissionMode`, `model`, `effort`; the
 * Codex form and what it refuses are `render-codex-adapter.ts`.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { stringify } from 'yaml';

import {
  pointerLine,
  specsOf,
  SUBAGENT_SURFACES,
  type AdapterSpec,
  type SubagentSurface,
} from './adapter-spec.js';
import { CLAUDE_DEFAULTS } from './derive-subagent-declaration.js';
import { renderCodexAdapter } from './render-codex-adapter.js';
import { STANDARD_CLOSINGS, STANDARD_PRE_POINTER } from './standard-adapter-body.js';
import type { MarkdownPlatform, SubagentDeclaration } from './subagent-declaration.js';

/** One rendered adapter: its repo-relative path and its full text. */
export interface SubagentProjection {
  readonly path: string;
  readonly text: string;
}

/** The Claude frontmatter fields in the order the estate's adapters carry them (measured). */
const CLAUDE_KEY_ORDER = [
  'tools',
  'disallowedTools',
  'color',
  'permissionMode',
  'model',
  'effort',
] as const;

// A backslash literal without an escaped string, which the lint forbids.
const BACKSLASH = String.fromCodePoint(92);

/**
 * A YAML quoted scalar in the style the estate's formatter keeps (prettier, single quotes
 * preferred; measured on `.claude/agents`, 2026-09-14): a text holding a double quote is
 * single-quoted with each apostrophe doubled; else a text holding an apostrophe is
 * double-quoted, the one escape that form then needs being the doubled backslash; else
 * single-quoted.
 */
function yamlQuoted(text: string): string {
  if (!text.includes('"') && text.includes("'")) {
    return `"${text.replaceAll(BACKSLASH, BACKSLASH + BACKSLASH)}"`;
  }
  return `'${text.replaceAll("'", "''")}'`;
}

function markdownBody(
  platform: MarkdownPlatform,
  spec: AdapterSpec,
  prose: { readonly pointerTail?: string; readonly note?: string } | undefined,
): string {
  const closing = prose?.note ?? STANDARD_CLOSINGS[platform];
  return `\n# ${spec.title}\n\n${STANDARD_PRE_POINTER[platform]}\n\n${pointerLine(platform, spec, prose?.pointerTail)}\n\n${closing}\n`;
}

function renderCursor(spec: AdapterSpec): string {
  const description = spec.cursor?.description ?? spec.description;
  const head = `---\nname: ${spec.name}\ndescription: ${yamlQuoted(description)}\nreadonly: true\n---\n`;
  return `${head}${markdownBody('cursor', spec, spec.cursor)}`;
}

/** The Claude fields as lines: a role's defaults filled, inherited tools written as no line. */
function claudeFieldLines(spec: AdapterSpec): string[] {
  const declared = spec.claude ?? {};
  const values: Partial<Record<(typeof CLAUDE_KEY_ORDER)[number], string>> = spec.fillDefaults
    ? {
        ...declared,
        tools: declared.tools ?? CLAUDE_DEFAULTS.tools,
        disallowedTools: declared.disallowedTools ?? CLAUDE_DEFAULTS.disallowedTools,
        permissionMode: declared.permissionMode ?? CLAUDE_DEFAULTS.permissionMode,
      }
    : declared;
  return CLAUDE_KEY_ORDER.flatMap((key) => {
    const value = values[key];
    return value === undefined || (key === 'tools' && value === 'inherit')
      ? []
      : [`${key}: ${yamlScalar(value)}`];
  });
}

/**
 * A field value as the adapter carries it: plain where the yaml library would emit the bare
 * text as that string (its plain-scalar judgement, at no line width so length never folds
 * a value; the estate's live values all read plain), else quoted by the measured rule, so
 * a value carrying a comment marker, a mapping separator, a leading indicator or a YAML
 * keyword is never written as text the platform would read otherwise (#81 round two).
 */
function yamlScalar(value: string): string {
  return stringify(value, { lineWidth: 0 }) === `${value}\n` ? value : yamlQuoted(value);
}

function renderClaude(spec: AdapterSpec): string {
  const lines = [
    '---',
    `name: ${spec.name}`,
    `description: ${yamlQuoted(spec.description)}`,
    ...claudeFieldLines(spec),
    '---',
  ];
  return `${lines.join('\n')}\n${markdownBody('claude', spec, spec.claude)}`;
}

function renderOn(surface: SubagentSurface, spec: AdapterSpec): Result<SubagentProjection, string> {
  const { platform } = surface;
  const path = `${surface.dir}/${spec.name}${surface.extension}`;
  const tail = pointerTailIssue(path, spec[platform]);
  if (tail !== undefined) {
    return err(tail);
  }
  if (platform === 'codex') {
    const text = renderCodexAdapter(path, spec);
    return text.ok ? ok({ path, text: text.value }) : text;
  }
  return ok({ path, text: platform === 'cursor' ? renderCursor(spec) : renderClaude(spec) });
}

/**
 * The refusal for a pointer tail the reader could not read back: its path delimiter is the
 * backtick, and the transitional reader (`adapter-sources.ts`, which retires with the sweep)
 * takes the last pair on the pointer line for the path.
 */
function pointerTailIssue(
  path: string,
  prose: { readonly pointerTail?: string } | undefined,
): string | undefined {
  return prose?.pointerTail?.includes('`') === true
    ? `${path}: the pointer tail carries a backtick, which the reader takes for the path's delimiter; refusing to render it`
    : undefined;
}

/** The first adapter name two specs share, in name order; `--fix` would write its path twice. */
function duplicateName(specs: readonly AdapterSpec[]): string | undefined {
  const seen = new Set<string>();
  const names = specs.map((spec) => spec.name).sort((left, right) => left.localeCompare(right));
  for (const name of names) {
    if (seen.has(name)) {
      return name;
    }
    seen.add(name);
  }
  return undefined;
}

/**
 * Render every adapter the declarations project onto the three source surfaces: templates
 * in name order, a fan-out's variants in their declared order, then surface order.
 *
 * @param declarations - The templates' declarations, in any order.
 * @returns The adapters, or the first refusal (a name two declarations render, a pointer
 * tail with a backtick, or a value the Codex form cannot carry).
 */
export function renderSubagentAdapters(
  declarations: readonly SubagentDeclaration[],
): Result<readonly SubagentProjection[], string> {
  const specs = [...declarations]
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap(specsOf);
  const duplicate = duplicateName(specs);
  if (duplicate !== undefined) {
    return err(
      `${duplicate}: rendered by more than one declaration (a role and a fan-out variant, or two fan-outs); refusing to render the sub-agent adapters`,
    );
  }
  const projections: SubagentProjection[] = [];
  for (const spec of specs) {
    for (const surface of SUBAGENT_SURFACES.filter((entry) =>
      spec.platforms.includes(entry.platform),
    )) {
      const rendered = renderOn(surface, spec);
      if (!rendered.ok) {
        return rendered;
      }
      projections.push(rendered.value);
    }
  }
  return ok(projections);
}
