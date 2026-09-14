/**
 * The platform contract the sub-agent leg holds until the reader-retirement pull request:
 * a declaration's platforms must cover what `core/reviewer-adapter-platform-contract.ts`
 * (the health probe's contract, whose exception map the retirement pull request deletes
 * with this module) expects it on. A subset would pass this leg and leave the health probe
 * failing; a declaration naming gemini alone is short of the contract too, refused here
 * before anything renders. A superset (an exception-map variant also declaring a surface the map excludes)
 * renders as declared: the declaration is the surviving source of truth, the extra adapter
 * is loud, and it is the probe's finding, not this leg's. Gemini is not bound here: it is
 * optional, generated only (#81 disposition turn and slice B, 2026-09-14).
 *
 * @packageDocumentation
 */

import { getReviewerAdapterPlatformViolation } from '../../core/reviewer-adapter-platform-contract.js';
import {
  SOURCE_PLATFORMS,
  specsOf,
  type AdapterSpec,
} from '../../subagent-declarations/adapter-spec.js';
import type { SubagentDeclaration } from '../../subagent-declarations/subagent-declaration.js';

/** The contract's spelling of each source platform. */
const CONTRACT_PLATFORM = {
  cursor: 'cursor',
  claude: 'claude-code',
  codex: 'codex',
} as const;

/**
 * The refusal for a declaration whose platforms leave out a source surface the contract
 * expects it on; none when it covers them (a surface beyond the contract is not refused here).
 */
function platformContractIssue(spec: AdapterSpec): string | undefined {
  const missing = SOURCE_PLATFORMS.filter(
    (platform) =>
      getReviewerAdapterPlatformViolation(
        spec.name,
        CONTRACT_PLATFORM[platform],
        spec.platforms.includes(platform),
      )?.kind === 'missing',
  );
  if (missing.length === 0) {
    return undefined;
  }
  return `${spec.name}: platforms leave out ${missing.join(', ')}, which the platform contract expects it on; until the reader-retirement pull request every declaration renders the surfaces the contract names (gemini optional); refusing to render the sub-agent adapters`;
}

/** The first declaration whose platforms fall short of the contract, as the refusal; none when all cover it. */
export function platformContractRefusal(
  declarations: readonly SubagentDeclaration[],
): string | undefined {
  return declarations
    .flatMap(specsOf)
    .map(platformContractIssue)
    .find((issue) => issue !== undefined);
}
