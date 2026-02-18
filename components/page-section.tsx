import type { ReactNode } from "react";

interface PageSectionProps {
  /** Section identifier — creates aria-labelledby="{id}-heading" */
  id: string;
  /** Visible heading text */
  heading: string;
  /** When true, heading is screen-reader-only */
  srOnly?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Semantic section with an accessible heading.
 * Renders a `<section>` with `aria-labelledby` linked to an `<h2>`.
 */
export function PageSection({
  id,
  heading,
  srOnly = false,
  children,
  className,
}: PageSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className={className}>
      <h2 id={headingId} className={srOnly ? "sr-only" : "text-foreground mb-4"}>
        {heading}
      </h2>
      {children}
    </section>
  );
}
