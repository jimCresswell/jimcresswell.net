/**
 * CV Content Types
 *
 * Links use markdown syntax: [link text](url)
 * Example: "At [Oak National Academy](https://oak.org/), I lead..."
 */

/** Experience entry */
export interface Experience {
  organisation: string;
  role: string;
  start_year: number;
  end_year: string | number;
  /** Paragraphs may contain markdown-style links */
  summary: string[];
}

/** Foundation entry */
export interface Foundation {
  title: string;
  /** Paragraphs may contain markdown-style links */
  description: string[];
}

/** Education entry */
export interface Education {
  degree: string;
  field: string;
  institution: string;
}

/** Tilt variant */
export interface Tilt {
  context: string;
  /** May contain markdown-style links */
  positioning: string;
}

/** Tilt metadata */
export interface TiltMeta {
  primary: string;
  order: string[];
  web_routes: string[];
  note?: string;
}

/** Full CV content structure */
export interface CVContent {
  meta: {
    name: string;
    headline: string;
    locale: string;
  };
  positioning: {
    /** Paragraphs may contain markdown-style links */
    paragraphs: string[];
  };
  experience: Experience[];
  foundations: Foundation[];
  capabilities: string[];
  education: Education[];
  links: Record<string, string>;
  tilts: {
    _meta: TiltMeta;
    [key: string]: Tilt | TiltMeta;
  };
}
