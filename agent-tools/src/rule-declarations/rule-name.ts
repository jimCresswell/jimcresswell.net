/**
 * The rule-name boundary of the sweep. A rule is addressed by its basename without `.md`,
 * and every path the sweep builds (`.agent/rules/<name>.md`, `.cursor/rules/<name>.mdc`,
 * `.claude/rules/<name>.md`) interpolates that name, so any other shape (a separator anywhere,
 * leading or not; a dot segment; an empty name; a `.md` suffix) would address a file outside
 * the rules directories or the wrong file inside them. The check runs before any path is
 * built, so a refused name is never read and never written; the reason quotes the name so an
 * empty or whitespace name stays visible in a report.
 *
 * @packageDocumentation
 */

const NOT_A_RULE_BASENAME =
  'not a rule basename (one path segment: no separator, no dot segment, no .md suffix)';

function isRuleBasename(name: string): boolean {
  return (
    name.length > 0 &&
    name !== '.' &&
    name !== '..' &&
    !name.includes('/') &&
    !name.includes('\\') &&
    !name.endsWith('.md')
  );
}

/**
 * The refusal reason for every name that is not a rule basename, in input order; empty when
 * every name may be interpolated into a rule path.
 */
export function refuseNonBasenames(ruleNames: readonly string[]): readonly string[] {
  return ruleNames
    .filter((name) => !isRuleBasename(name))
    .map((name) => `${JSON.stringify(name)}: ${NOT_A_RULE_BASENAME}`);
}
