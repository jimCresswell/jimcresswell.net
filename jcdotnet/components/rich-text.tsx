import { parseMarkdownLinks } from "@/lib/parse-markdown-links";

interface RichTextProps {
  /** The text content, may contain markdown-style links [text](url) */
  children: string;
  /** Additional className for the wrapper span (optional) */
  className?: string;
}

/**
 * Renders text with markdown-style links.
 *
 * Usage:
 * <RichText>{paragraph}</RichText>
 *
 * Text with [text](url) markers will have links rendered.
 * Text without markers renders as-is with no wrapper element.
 */
export function RichText({ children, className }: RichTextProps) {
  const content = parseMarkdownLinks(children);

  // If no transformation happened, return plain text
  if (typeof content === "string") {
    return <>{content}</>;
  }

  // If className provided, wrap in span
  if (className) {
    return <span className={className}>{content}</span>;
  }

  return <>{content}</>;
}
