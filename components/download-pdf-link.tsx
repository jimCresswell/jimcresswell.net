import { PDF_FILENAME } from "@/lib/pdf-config";

/**
 * Compact link to download the pre-generated CV PDF, used in the site header.
 *
 * Points to `/cv/pdf` which serves the PDF binary. The `download` attribute
 * forces a file download (user stays on the current page) rather than
 * navigating to display the PDF inline.
 *
 * Hidden in print media via the `print-hidden` class.
 */
export function DownloadPdfLink() {
  return (
    <a
      href="/cv/pdf"
      download={PDF_FILENAME}
      className="print-hidden underline text-accent hover:opacity-80 transition-opacity min-h-11 flex items-center"
    >
      PDF
    </a>
  );
}
