import type { ReactNode } from "react";

/**
 * Parse markdown-style links in text and return React nodes.
 *
 * Syntax: [link text](url)
 *
 * Example: "At [Oak National Academy](https://oak.org/), I lead..."
 */
export function parseMarkdownLinks(text: string): ReactNode {
  // Match markdown links: [text](url)
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    const [fullMatch, linkText, url] = match;
    const matchStart = match.index;

    // Add text before this match
    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    parts.push(
      <a
        key={`link-${keyIndex++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cv-ref-link"
      >
        {linkText}
      </a>
    );

    lastIndex = matchStart + fullMatch.length;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // If no matches were found, return original text
  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
}
