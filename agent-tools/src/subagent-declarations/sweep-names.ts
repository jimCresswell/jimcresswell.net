/**
 * The name boundary of the sub-agent sweep. A template is addressed by its basename without
 * `.md` and an adapter by its basename without extension, and every path the sweep builds
 * (`.agent/sub-agents/templates/<name>.md`, `.cursor/agents/<name>.md`,
 * `.claude/agents/<name>.md`, `.codex/agents/<name>.toml`) interpolates that name, so any
 * other shape (a separator anywhere; a dot segment; an empty name; a suffix) would address a
 * file outside those directories or the wrong file inside them. The shape is the adapter-name
 * shape a declaration carries (`ADAPTER_NAME`), checked before any path is built, so a
 * refused name is never read and never written (the #77 round-three finding, 2026-09-14; the
 * rule sweep's `rule-name.ts` is the same boundary for rules). The reason quotes the name so
 * an empty or whitespace name stays visible in a report.
 *
 * @packageDocumentation
 */

import { ADAPTER_SURFACES } from './adapter-surfaces.js';
import { ADAPTER_NAME, type SourcePlatform } from './subagent-declaration.js';

const NOT_A_BASENAME =
  'lowercase letters and digits in single-hyphen groups: one path segment, no dot segment, no suffix';

/** The refusal reason when a name is not a template basename; `undefined` when it may be interpolated. */
export function templateNameRefusal(name: string): string | undefined {
  return ADAPTER_NAME.test(name)
    ? undefined
    : `${JSON.stringify(name)}: not a template basename (${NOT_A_BASENAME})`;
}

/**
 * The refusal reason for every template or adapter name that is not a basename, templates
 * first and then each surface in order; empty when every name may be interpolated into a path.
 */
export function refuseNonBasenames(
  templateNames: readonly string[],
  adapterNames: Readonly<Record<SourcePlatform, readonly string[]>>,
): readonly string[] {
  const templates = templateNames.flatMap((name) => {
    const refusal = templateNameRefusal(name);
    return refusal === undefined ? [] : [refusal];
  });
  const adapters = ADAPTER_SURFACES.flatMap((surface) =>
    adapterNames[surface.platform]
      .filter((name) => !ADAPTER_NAME.test(name))
      .map(
        (name) =>
          `${surface.platform} ${JSON.stringify(name)}: not an adapter basename (${NOT_A_BASENAME})`,
      ),
  );
  return [...templates, ...adapters];
}
