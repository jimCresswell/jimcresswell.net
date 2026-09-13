/**
 * Compact link to the markdown version of the current page, used in the
 * site header alongside the PDF download link.
 *
 * Constructs the `.md` URL for a supported editorial document:
 * - `/` → `/index.md`
 * - `/cv` → `/cv.md`
 *
 * Native subroutes and missing routes do not negotiate Markdown, so the
 * control is omitted for those paths rather than linking to a 404 response.
 *
 * Hidden in print media via the `print-hidden` class.
 */
export function MarkdownPageLink({ pathname }: { pathname: string }) {
  const negotiablePagePath = resolveNegotiablePagePath(pathname);
  if (!negotiablePagePath) {
    return null;
  }

  const mdHref = negotiablePagePath === "/" ? "/index.md" : `${negotiablePagePath}.md`;

  return (
    <a
      href={mdHref}
      className="print-hidden underline text-accent hover:opacity-80 transition-opacity min-h-11 flex items-center"
    >
      MD
    </a>
  );
}
import { resolveNegotiablePagePath } from "@/lib/content-negotiation-path";
