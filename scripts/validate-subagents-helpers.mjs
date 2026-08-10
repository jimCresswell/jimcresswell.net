/**
 * Builds the set of wrapper descriptions that every sub-agent template should have.
 *
 * @param {string} templateName - The canonical template file name without extension.
 * @returns {Array<{ relPath: string, pointer: string, frontmatterName: string, label: string }>}
 */
export function buildSubagentWrapperDescriptors(templateName) {
  const canonicalPath = `.agent/sub-agents/templates/${templateName}.md`;

  return [
    {
      relPath: `.cursor/agents/${templateName}.md`,
      pointer: `@${canonicalPath}`,
      frontmatterName: templateName,
      label: `Cursor reviewer wrapper ${templateName}`,
    },
    {
      relPath: `.claude/agents/${templateName}.md`,
      pointer: `@${canonicalPath}`,
      frontmatterName: templateName,
      label: `Claude reviewer wrapper ${templateName}`,
    },
    {
      relPath: `.github/agents/${templateName}.agent.md`,
      pointer: `@${canonicalPath}`,
      frontmatterName: templateName,
      label: `GitHub reviewer wrapper ${templateName}`,
    },
  ];
}

/**
 * Finds sub-agent names that have no matching canonical template.
 *
 * @param {Set<string>} canonicalNames - Canonical reviewer names.
 * @param {Iterable<string>} candidateNames - Adapter or registration names to compare.
 * @returns {string[]} Unexpected names in stable lexical order.
 */
export function findUnexpectedSubagentNames(canonicalNames, candidateNames) {
  return [...candidateNames].filter((name) => !canonicalNames.has(name)).sort();
}
