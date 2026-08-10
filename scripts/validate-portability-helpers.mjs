import { parse } from "smol-toml";

/**
 * Reports whether a parsed TOML value is a table rather than a scalar value.
 *
 * @param {unknown} value - A value returned by the TOML parser.
 * @returns {boolean} Whether the value is a TOML table.
 */
function isTomlTable(value) {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Reports whether a parsed TOML value contains a table at any array depth.
 *
 * @param {unknown} value - A value returned by the TOML parser.
 * @returns {boolean} Whether the value contains a TOML table.
 */
function containsTomlTable(value) {
  return isTomlTable(value) || (Array.isArray(value) && value.some(containsTomlTable));
}

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
 * Parses the Codex configuration file and returns a map of reviewer names to config paths.
 * Non-table values under `agents` are not reviewer registrations and are omitted.
 *
 * @param {string} content - The text of `.codex/config.toml`.
 * @param {(issue: string) => void} [onIssue] - Reports invalid registry structure.
 * @returns {Map<string,string>} The mapping from agent name to `config_file` string.
 */
export function parseCodexRegistrations(content, onIssue = () => {}) {
  const registrations = new Map();
  let parsed;

  try {
    parsed = parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message.split("\n")[0] : String(error);
    onIssue(`invalid TOML: ${message}`);
    return registrations;
  }

  const agents = parsed.agents;
  if (agents == null) {
    return registrations;
  }
  if (typeof agents !== "object" || Array.isArray(agents)) {
    onIssue("agents must be a TOML table");
    return registrations;
  }

  for (const [agentName, registration] of Object.entries(agents)) {
    if (!isTomlTable(registration)) {
      continue;
    }

    if (Object.values(registration).some(containsTomlTable)) {
      onIssue(`unsupported nested Codex agent registration ${JSON.stringify(agentName)}`);
    }

    const configFile = registration.config_file;
    registrations.set(agentName, typeof configFile === "string" ? configFile : "");
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
