import { notFound } from "next/navigation";

/**
 * Unconditionally triggers a 404 response.
 *
 * This route is only reached via redirect from the `/cv/pdf` route handler
 * when no generated PDF is available. The branded 404 content is rendered
 * by the sibling `not-found.tsx` file.
 */
export default function PdfUnavailablePage(): never {
  notFound();
}
