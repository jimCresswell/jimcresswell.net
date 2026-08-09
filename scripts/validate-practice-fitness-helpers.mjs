import path from "node:path";

export const FITNESS_EXCLUDED_PATH_PREFIXES = [
  ".agent/practice-context/incoming/",
  ".agent/practice-core/incoming/",
  ".agent/private/",
  ".agent/temp/",
];
export const FITNESS_EXCLUDED_PATH_SEGMENTS = ["/archive/"];

function normalizeRelativePath(relPath) {
  return relPath.split(path.sep).join("/");
}

export function shouldInspectFitnessPath(relPath) {
  const normalizedPath = normalizeRelativePath(relPath);

  if (!normalizedPath.endsWith(".md")) {
    return false;
  }

  if (FITNESS_EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))) {
    return false;
  }

  return !FITNESS_EXCLUDED_PATH_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

export function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

export function getFrontmatterNumber(frontmatter, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, "m");
  const match = frontmatter?.match(regex);
  if (!match) {
    return null;
  }

  const num = Number(match[1].trim());
  return Number.isNaN(num) ? null : num;
}

function classifyLines(content) {
  const lines = content.split("\n");
  let inCodeBlock = false;
  let inFrontmatter = false;
  let frontmatterFenceCount = 0;

  return lines.map((text, index) => {
    if (/^---\s*$/.test(text) && frontmatterFenceCount < 2) {
      frontmatterFenceCount += 1;
      inFrontmatter = frontmatterFenceCount === 1;
      if (frontmatterFenceCount === 2) {
        inFrontmatter = false;
      }

      return { text, kind: "frontmatter", lineNumber: index + 1 };
    }

    if (inFrontmatter) {
      return { text, kind: "frontmatter", lineNumber: index + 1 };
    }

    if (/^(`{3,}|~{3,})/.test(text)) {
      inCodeBlock = !inCodeBlock;
      return { text, kind: "code-fence", lineNumber: index + 1 };
    }

    if (inCodeBlock) {
      return { text, kind: "code-block", lineNumber: index + 1 };
    }

    if (/^\|/.test(text.trim())) {
      return { text, kind: "table", lineNumber: index + 1 };
    }

    return { text, kind: "prose", lineNumber: index + 1 };
  });
}

export function evaluateFitnessFile(relPath, content) {
  const frontmatter = extractFrontmatter(content);
  const targetLines = getFrontmatterNumber(frontmatter, "fitness_line_target");
  const limitLines = getFrontmatterNumber(frontmatter, "fitness_line_limit");
  const limitChars = getFrontmatterNumber(frontmatter, "fitness_char_limit");
  const maxProseLineWidth = getFrontmatterNumber(frontmatter, "fitness_line_length");
  const classified = classifyLines(content);
  const contentLines = classified.filter((line) => line.kind !== "frontmatter");
  const totalLines = contentLines.length;
  const totalChars = contentLines.map((line) => line.text).join("\n").length;

  const proseViolations = [];
  let maxProseLen = 0;
  let maxProseLineNum = 0;

  for (const line of classified) {
    if (line.kind !== "prose") {
      continue;
    }

    const lineLength = line.text.length;
    if (lineLength > maxProseLen) {
      maxProseLen = lineLength;
      maxProseLineNum = line.lineNumber;
    }

    if (maxProseLineWidth != null && lineLength > maxProseLineWidth) {
      proseViolations.push(line);
    }
  }

  const warnings = [];
  const violations = [];

  const targetOk = targetLines == null || totalLines <= targetLines;
  const limitOk = limitLines == null || totalLines <= limitLines;

  if (!limitOk) {
    violations.push(`Lines: ${totalLines} exceeds limit ${limitLines}`);
  } else if (!targetOk) {
    warnings.push(`Lines: ${totalLines} exceeds target ${targetLines} (limit ${limitLines})`);
  }

  const charsOk = limitChars == null || totalChars <= limitChars;
  if (!charsOk) {
    violations.push(`Characters: ${totalChars} exceeds limit ${limitChars}`);
  }

  const proseOk = maxProseLineWidth == null || maxProseLen <= maxProseLineWidth;
  if (!proseOk) {
    violations.push(
      `Prose line width: ${proseViolations.length} line(s) exceed ${maxProseLineWidth} chars (longest: ${maxProseLen} at line ${maxProseLineNum})`
    );
  }

  return {
    filename: relPath,
    totalLines,
    totalChars,
    maxProseLen,
    maxProseLineNum,
    proseViolationCount: proseViolations.length,
    proseViolations: proseViolations.slice(0, 5),
    targetLines,
    limitLines,
    limitChars,
    maxProseLineWidth,
    targetOk,
    limitOk,
    charsOk,
    proseOk,
    warnings,
    violations,
  };
}
