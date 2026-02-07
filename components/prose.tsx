import { RichText } from "@/components/rich-text";

interface ProseProps {
  /** Text content (may contain markdown links) */
  children: string;
  className?: string;
}

/**
 * Body text paragraph with standard prose styling and rich text support.
 */
export function Prose({ children, className }: ProseProps) {
  return (
    <p
      className={`font-serif text-base leading-prose text-foreground${className ? ` ${className}` : ""}`}
    >
      <RichText>{children}</RichText>
    </p>
  );
}
