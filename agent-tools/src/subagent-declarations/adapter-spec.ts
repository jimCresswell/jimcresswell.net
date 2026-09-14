/**
 * What one adapter renders from, and where it goes: the four generated surfaces (Cursor,
 * Claude, Codex and Gemini, every one rendered from the declarations), the spec a role
 * or a variant reduces to (a role with its defaults to fill, a variant exactly as declared),
 * and the pointer sentence every adapter carries. The leaf the Markdown renderer
 * (`render-subagent-adapters.ts`), the Codex renderer (`render-codex-adapter.ts`), the
 * Gemini renderer (`render-gemini-adapter.ts`) and the registry renderer
 * (`render-codex-registry.ts`) read.
 *
 * @packageDocumentation
 */

import { canonicalAdapterTitle } from './standard-adapter-body.js';
import type { SubagentPlatform } from './declaration-scalars.js';
import type {
  ClaudeFields,
  CodexFields,
  CursorFields,
  GeminiFields,
  SubagentDeclaration,
  SubagentVariant,
} from './subagent-declaration.js';

/** Where the canonical templates live, repo-relative; every pointer sentence names a file here. */
export const TEMPLATES_DIR = '.agent/sub-agents/templates';

/** The Codex registry: the host's config, whose `[agents."<name>"]` tail the generator renders. */
export const CODEX_REGISTRY_PATH = '.codex/config.toml';

/** One adapter surface: where a platform keeps its adapters and the extension its files carry. */
export interface SubagentSurface {
  readonly platform: SubagentPlatform;
  readonly dir: string;
  readonly extension: string;
}

/** The four generated surfaces, in the order the adapters are rendered. */
export const SUBAGENT_SURFACES: readonly SubagentSurface[] = [
  { platform: 'cursor', dir: '.cursor/agents', extension: '.md' },
  { platform: 'claude', dir: '.claude/agents', extension: '.md' },
  { platform: 'codex', dir: '.codex/agents', extension: '.toml' },
  { platform: 'gemini', dir: '.gemini/agents', extension: '.md' },
];

const EVERY_PLATFORM: readonly SubagentPlatform[] = SUBAGENT_SURFACES.map(
  (surface) => surface.platform,
);

/** What one adapter renders from: a role with its defaults filled, or a variant as declared. */
export interface AdapterSpec {
  readonly name: string;
  readonly template: string;
  readonly title: string;
  readonly description: string;
  /** Every platform the declaration names; absent on a role means every surface. */
  readonly platforms: readonly SubagentPlatform[];
  readonly cursor: CursorFields | undefined;
  readonly claude: ClaudeFields | undefined;
  readonly codex: CodexFields | undefined;
  readonly gemini: GeminiFields | undefined;
  /** A role fills the estate's defaults; a variant renders only what it declares. */
  readonly fillDefaults: boolean;
}

function platformsOf(
  declared: readonly SubagentPlatform[] | undefined,
): readonly SubagentPlatform[] {
  return declared ?? EVERY_PLATFORM;
}

function variantSpec(template: string, variant: SubagentVariant): AdapterSpec {
  return {
    name: variant.name,
    template,
    title: variant.title ?? canonicalAdapterTitle(variant.name),
    description: variant.description,
    platforms: platformsOf(variant.platforms),
    cursor: variant.cursor,
    claude: variant.claude,
    codex: variant.codex,
    gemini: variant.gemini,
    fillDefaults: false,
  };
}

export function specsOf(declaration: SubagentDeclaration): readonly AdapterSpec[] {
  if (declaration.kind === 'fan-out') {
    return declaration.variants.map((variant) => variantSpec(declaration.name, variant));
  }
  return [
    {
      name: declaration.name,
      template: declaration.name,
      title: canonicalAdapterTitle(declaration.name),
      description: declaration.description,
      platforms: platformsOf(declaration.platforms),
      cursor: declaration.cursor,
      claude: declaration.claude,
      codex: declaration.codex,
      gemini: declaration.gemini,
      fillDefaults: true,
    },
  ];
}

/** The pointer sentence with its declared tail, or the plain stop. */
export function pointerLine(
  platform: SubagentPlatform,
  spec: AdapterSpec,
  tail: string | undefined,
): string {
  const templatePath = `\`${TEMPLATES_DIR}/${spec.template}.md\`${tail ?? '.'}`;
  return platform === 'codex'
    ? `Read and follow ${templatePath}`
    : `Your first action MUST be to read and internalise ${templatePath}`;
}
