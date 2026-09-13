import type { ReactNode } from "react";

interface ArticleEntryProps {
  /** Entry heading (organisation name, foundation title, etc.) */
  heading: string;
  /** Metadata line (e.g. "Engineering Lead · 2019–present") */
  meta?: string;
  children: ReactNode;
}

/**
 * An article entry with heading, optional metadata, and body content.
 * Used for CV experience entries, foundation entries, and timeline items.
 */
export function ArticleEntry({ heading, meta, children }: ArticleEntryProps) {
  return (
    <article className="flex flex-col">
      <h3 className={`text-foreground ${meta ? "mb-1" : "mb-4"}`}>{heading}</h3>
      {meta && <p className="font-sans text-sm text-foreground/70 mb-3">{meta}</p>}
      {children}
    </article>
  );
}
