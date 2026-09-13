/**
 * Strip inline markdown syntax from text, returning plain text.
 *
 * Removes:
 * - Links: `[text](url)` → `text`
 * - Emphasis: `_text_` → `text`
 *
 * Useful for contexts that need plain text (meta descriptions, accessibility labels, etc.).
 *
 * @example
 * stripInlineMarkdown("Visit [Oak](https://oak.org/) for _great_ resources.")
 * // => "Visit Oak for great resources."
 */
export function stripInlineMarkdown(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/_([^_]+)_/g, "$1");
}
