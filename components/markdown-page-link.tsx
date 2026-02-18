/**
 * Compact link to the markdown version of the current page, used in the
 * site header alongside the PDF download link.
 *
 * Constructs the `.md` URL from the current pathname:
 * - `/` → `/index.md`
 * - `/cv` → `/cv.md`
 * - `/cv/public_sector` → `/cv/public_sector.md`
 *
 * Hidden in print media via the `print-hidden` class.
 */
export function MarkdownPageLink({ pathname }: { pathname: string }) {
  const mdHref = pathname === "/" ? "/index.md" : `${pathname}.md`;

  return (
    <a
      href={mdHref}
      className="print-hidden underline text-accent hover:opacity-80 transition-opacity min-h-11 flex items-center"
    >
      MD
    </a>
  );
}
