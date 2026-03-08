import { getExpectedSectionIdsForRouteKey } from "../lib/page-document-contract";

export interface ComparisonNote {
  code: string;
  description: string;
}

interface DocumentHtmlNormalisationRule {
  note: ComparisonNote;
  apply: (contents: string) => string;
}

const DOCUMENT_HTML_NORMALISATION_RULES: readonly DocumentHtmlNormalisationRule[] = [
  {
    note: {
      code: "document-next-assets",
      description:
        "Removed Next.js and Vercel runtime asset tags from document.html before comparison.",
    },
    apply: (contents) => contents.replaceAll(NEXT_ASSET_TAG_PATTERN, ""),
  },
  {
    note: {
      code: "document-next-flight",
      description:
        "Removed inline Next.js flight/runtime payload scripts from document.html before comparison.",
    },
    apply: (contents) => contents.replaceAll(NEXT_FLIGHT_SCRIPT_PATTERN, ""),
  },
  {
    note: {
      code: "document-route-announcer",
      description:
        "Removed the ephemeral Next.js route announcer node from document.html before comparison.",
    },
    apply: (contents) => contents.replaceAll(ROUTE_ANNOUNCER_PATTERN, ""),
  },
];

const ROOT_FONT_CLASS_NORMALISATION_NOTE: ComparisonNote = {
  code: "document-root-font-class",
  description:
    "Normalised hashed next/font class tokens on the root html element before comparison.",
};

const EXPECTED_SECTION_ID_NORMALISATION_NOTE: ComparisonNote = {
  code: "expected-section-id",
  description:
    "Removed target-only CV section id additions backed by the page document contract before comparison.",
};

const NEXT_ASSET_TAG_PATTERN =
  /<(?:link\b[^>]*href="\/_next\/static\/[^"]*"[^>]*|script\b[^>]*src="\/(?:_next\/static|_vercel\/insights)\/[^"]*"[^>]*><\/script)>/g;
const NEXT_FLIGHT_SCRIPT_PATTERN = /<script>[\s\S]*?__next_f[\s\S]*?<\/script>/g;
const ROUTE_ANNOUNCER_PATTERN = /<next-route-announcer\b[^>]*><\/next-route-announcer>/g;
const ROOT_HTML_CLASS_PATTERN = /<html([^>]*) class="([^"]*)"([^>]*)>/;
const FONT_MODULE_CLASS_PATTERN = /^[a-z]+_[a-f0-9]+-module__[A-Za-z0-9_]+__variable$/;

/**
 * Normalise a captured text artefact before comparison.
 *
 * Only `document.html` receives targeted build-noise normalisation; other text
 * artefacts remain strict.
 *
 * @param options Comparison input.
 */
export function normaliseTextArtifactForComparison(options: {
  artifactPath: string;
  contents: string;
}): {
  contents: string;
  notes: ComparisonNote[];
} {
  if (options.artifactPath !== "document.html") {
    return {
      contents: options.contents,
      notes: [],
    };
  }

  const normalisedContents = normaliseDocumentHtml(options.contents);
  if (normalisedContents.contents === options.contents) {
    return {
      contents: options.contents,
      notes: [],
    };
  }

  return {
    contents: normalisedContents.contents,
    notes: normalisedContents.notes,
  };
}

/**
 * Auto-accept expected target-only section id additions backed by the page
 * document contract.
 *
 * This is deliberately one-way. Adding an expected section id can be accepted
 * as a non-visual structural improvement; removing one or introducing an
 * unexpected id must still surface for review.
 *
 * @param options Pairwise HTML comparison input.
 */
export function normaliseExpectedSectionIdAdditionsForComparison(options: {
  routeKey: string;
  artifactPath: string;
  baselineContents: string;
  targetContents: string;
}): {
  targetContents: string;
  notes: ComparisonNote[];
} {
  if (!options.artifactPath.endsWith(".html")) {
    return {
      targetContents: options.targetContents,
      notes: [],
    };
  }

  let nextTargetContents = options.targetContents;

  for (const sectionId of getExpectedSectionIdsForRouteKey(options.routeKey)) {
    nextTargetContents = removeExpectedSectionId(nextTargetContents, sectionId);
  }

  if (
    nextTargetContents === options.targetContents ||
    nextTargetContents !== options.baselineContents
  ) {
    return {
      targetContents: options.targetContents,
      notes: [],
    };
  }

  return {
    targetContents: nextTargetContents,
    notes: [EXPECTED_SECTION_ID_NORMALISATION_NOTE],
  };
}

function normaliseDocumentHtml(contents: string): {
  contents: string;
  notes: ComparisonNote[];
} {
  const notes: ComparisonNote[] = [];
  let normalisedContents = contents;

  for (const rule of DOCUMENT_HTML_NORMALISATION_RULES) {
    const nextContents = rule.apply(normalisedContents);
    if (nextContents !== normalisedContents) {
      notes.push(rule.note);
      normalisedContents = nextContents;
    }
  }

  const rootClassNormalisedContents = replaceRootHtmlClasses(normalisedContents);
  if (rootClassNormalisedContents !== normalisedContents) {
    notes.push(ROOT_FONT_CLASS_NORMALISATION_NOTE);
    normalisedContents = rootClassNormalisedContents;
  }

  return {
    contents: normalisedContents,
    notes,
  };
}

function replaceRootHtmlClasses(contents: string): string {
  return contents.replace(
    ROOT_HTML_CLASS_PATTERN,
    (_match, beforeClass, classValue, afterClass) => {
      const normalisedClassValue = classValue
        .split(/\s+/)
        .filter(Boolean)
        .map((token: string) =>
          FONT_MODULE_CLASS_PATTERN.test(token) ? "font-module-variable" : token
        )
        .join(" ");

      return `<html${beforeClass} class="${normalisedClassValue}"${afterClass}>`;
    }
  );
}

function removeExpectedSectionId(contents: string, sectionId: string): string {
  const escapedSectionId = escapeRegExp(sectionId);
  const sectionPattern = new RegExp(
    `<section(?=[^>]*\\saria-labelledby="${escapedSectionId}-heading")([^>]*)\\sid="${escapedSectionId}"([^>]*)>`,
    "g"
  );

  return contents.replace(sectionPattern, "<section$1$2>");
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
