/**
 * Extracts the frontmatter section from a Markdown document.
 *
 * @param {string} content - The full Markdown content.
 * @returns {string|null} The YAML frontmatter without the surround `---` lines.
 */
export function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

/**
 * Reads a specific key from YAML frontmatter.
 *
 * @param {string|null} frontmatter - The frontmatter text returned by {@link extractFrontmatter}.
 * @param {string} key - The key whose value should be returned.
 * @returns {string} The trimmed value or an empty string when missing.
 */
export function getFrontmatterValue(frontmatter, key) {
  if (frontmatter == null) {
    return "";
  }

  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escapedKey}:\s*(.+)$`, "m");
  const match = frontmatter.match(regex);
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

/**
 * Parses the Codex configuration file and returns a map of agent names to config paths.
 *
 * @param {string} content - The text of `.codex/config.toml`.
 * @returns {Map<string,string>} The mapping from agent name to `config_file` string.
 */
export function parseCodexRegistrations(content) {
  const registrations = new Map();
  let currentAgent = null;

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    const quotedMatch = line.match(/^\[agents\.\"([^\"]+)\"\]$/);
    const bareMatch = line.match(/^\[agents\.([^\]]+)\]$/);

    if (quotedMatch || bareMatch) {
      currentAgent = quotedMatch?.[1] ?? bareMatch?.[1] ?? null;
      if (currentAgent != null) {
        registrations.set(currentAgent, "");
      }
      continue;
    }

    if (currentAgent == null) {
      continue;
    }

    const configMatch = line.match(/^config_file\s*=\s*"([^\"]+)"$/);
    if (configMatch) {
      registrations.set(currentAgent, configMatch[1]);
      currentAgent = null;
    }
  }

  return registrations;
}

/**
 * Builds a simple summary line for console output.
 *
 * @param {string} label - The label to describe the count.
 * @param {number} count - The numeric value to display.
 * @returns {string}
 */
export function summaryLine(label, count) {
  return `${label}: ${count}`;
}
