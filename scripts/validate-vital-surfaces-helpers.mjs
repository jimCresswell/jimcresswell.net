/**
 * Parses all Markdown tables from the provided content.
 *
 * @param {string} content - Full Markdown text.
 * @returns {Array<{ headers: string[], rows: string[][] }>}
 */
function parseMarkdownTables(content) {
  const lines = content.split("\n");
  const tables = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim().startsWith("|")) {
      index += 1;
      continue;
    }

    const headerLine = line;
    const dividerLine = lines[index + 1] ?? "";

    if (!dividerLine.includes("---")) {
      index += 1;
      continue;
    }

    const headers = headerLine
      .split("|")
      .slice(1, -1)
      .map((segment) => segment.trim());

    const rows = [];
    index += 2;

    while (index < lines.length && lines[index].trim().startsWith("|")) {
      const rowValues = lines[index]
        .split("|")
        .slice(1, -1)
        .map((segment) => segment.trim());
      rows.push(rowValues);
      index += 1;
    }

    tables.push({ headers, rows });
  }

  return tables;
}

function normalizeSegment(segment) {
  return segment.replace(/`/g, "").trim();
}

function isSkippableSegment(segment) {
  const lower = segment.toLowerCase();
  return lower.includes("unsupported") || lower.includes("entry-point");
}

function shrinkWildcardPath(segment) {
  let normalized = segment.replace(/\\/g, "/").trim();
  const wildcardIndex = normalized.indexOf("*");

  if (wildcardIndex >= 0) {
    normalized = normalized.slice(0, wildcardIndex);
    if (normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    const lastSlash = normalized.lastIndexOf("/");
    if (lastSlash >= 0) {
      normalized = normalized.slice(0, lastSlash);
    }
  }

  if (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

function looksLikePath(segment) {
  return segment.includes("/") || /\.(md|mdc|json|toml|ya?ml)$/i.test(segment);
}

/**
 * Extracts canonical paths from a Markdown table cell.
 *
 * @param {string} cellValue - The raw table cell text.
 * @returns {string[]} Normalized relative paths mentioned in the cell.
 */
export function extractPathsFromCell(cellValue) {
  if (!cellValue) {
    return [];
  }

  const pieces = cellValue.split("→").map(normalizeSegment);
  const paths = [];

  for (const piece of pieces) {
    if (!piece || isSkippableSegment(piece)) {
      continue;
    }

    const normalized = shrinkWildcardPath(piece);
    if (!normalized || !looksLikePath(normalized)) {
      continue;
    }

    paths.push(normalized);
  }

  return Array.from(new Set(paths));
}

/**
 * Collects every relative path mentioned in the matrix tables.
 *
 * @param {string} content - The matrix Markdown text.
 * @returns {Array<{ path: string, context: string }>}
 */
export function collectMatrixPaths(content) {
  const tables = parseMarkdownTables(content);
  const seen = new Set();
  const results = [];

  for (const table of tables) {
    for (const row of table.rows) {
      for (let columnIndex = 1; columnIndex < row.length; columnIndex += 1) {
        const cellValue = row[columnIndex];
        const extracted = extractPathsFromCell(cellValue);

        for (const relPath of extracted) {
          if (seen.has(relPath)) {
            continue;
          }

          seen.add(relPath);
          const header = table.headers[columnIndex] ?? "column";
          const surface = row[0] ?? "surface";
          const context = `${surface} (${header})`.trim();
          results.push({ path: relPath, context });
        }
      }
    }
  }

  return results;
}
