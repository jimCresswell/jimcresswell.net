import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Parse inline markdown (links and emphasis) in text and return React nodes.
 *
 * Supported syntax:
 * - Links: `[link text](url)` — relative URLs use Next.js `<Link>`, external URLs use `<a>`.
 * - Emphasis: `_text_` — rendered as `<em>`.
 *
 * @example
 * parseMarkdownLinks("Visit [Oak](https://oak.org/) for _great_ resources.")
 * // => <>Visit <a href="https://oak.org/" ...>Oak</a> for <em>great</em> resources.</>
 *
 * @example
 * parseMarkdownLinks("My [CV is available here](/cv/).")
 * // => <>My <Link href="/cv/">CV is available here</Link>.</>
 */
export function parseMarkdownLinks(text: string): ReactNode {
  // Match markdown links [text](url) or emphasis _text_
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|_([^_]+)_/g;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;
  let hasMatch = false;

  while ((match = pattern.exec(text)) !== null) {
    hasMatch = true;
    const [fullMatch, linkText, url, emphasisText] = match;
    const matchStart = match.index;

    // Add text before this match
    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    if (linkText && url) {
      // It's a link — use <Link> for relative, <a> for external
      if (url.startsWith("/")) {
        parts.push(
          <Link key={`link-${keyIndex++}`} href={url} className="inline-link">
            {linkText}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={`link-${keyIndex++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            {linkText}
          </a>
        );
      }
    } else if (emphasisText) {
      // It's emphasis
      parts.push(<em key={`em-${keyIndex++}`}>{emphasisText}</em>);
    }

    lastIndex = matchStart + fullMatch.length;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // If no matches were found, return original text as a string (not a React node)
  if (!hasMatch) {
    return text;
  }

  return <>{parts}</>;
}
