import type { ReactNode } from "react";
import { PageSection } from "@/components/page-section";
import { ArticleEntry } from "@/components/article-entry";
import { Prose } from "@/components/prose";
import { RichText } from "@/components/rich-text";
import { HeadlineToggle } from "@/components/headline-toggle";
import { PDF_FILENAME } from "@/lib/pdf-config";
import { SITE_URL } from "@/lib/site-config";

/** Content shape that CVLayout requires. */
interface CVContentProps {
  meta: {
    name: string;
    headline: string;
    headline_alt?: string;
  };
  links: {
    email: string;
  };
  experience: Array<{
    organisation: string;
    role: string;
    start_year: number;
    end_year: string;
    summary: string[];
  }>;
  prior_roles: Array<{
    title: string;
    description: string[];
  }>;
  capabilities: string[];
  education: Array<{
    degree: string;
    field: string;
    institution: string;
  }>;
}

interface CVLayoutProps {
  /** CV content data — injected for testability and decoupling. */
  content: CVContentProps;
  /** Positioning section content (varies by CV variant). */
  positioning: ReactNode;
}

/**
 * CV page layout composed from section primitives.
 * Renders header, positioning, capabilities, experience, before-oak, and education.
 */
export function CVLayout({ content, positioning }: CVLayoutProps) {
  return (
    <div className="flex flex-col">
      {/* CV Header — unique structure, kept inline */}
      <header className="mb-6">
        <h1 className="text-foreground text-balance mb-1">{content.meta.name}</h1>
        <p className="font-sans text-sm text-foreground/70 mb-9">{content.links.email}</p>
        {content.meta.headline_alt ? (
          <HeadlineToggle primary={content.meta.headline} alt={content.meta.headline_alt} />
        ) : (
          <p className="font-sans text-sm md:text-base uppercase tracking-[0.08em] text-accent">
            {content.meta.headline}
          </p>
        )}
      </header>

      {/* Positioning */}
      <PageSection id="positioning" heading="Positioning" srOnly className="mb-6">
        {positioning}
      </PageSection>

      {/* Capabilities */}
      <PageSection id="capabilities" heading="Capabilities" className="mb-6">
        <ul className="flex flex-col gap-2">
          {content.capabilities.map((capability, index) => (
            <li key={index} className="font-serif text-base leading-prose text-foreground">
              <RichText>{capability}</RichText>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Experience */}
      <PageSection id="experience" heading="Experience" className="mb-6">
        <div className="flex flex-col gap-6">
          {content.experience.map((exp) => (
            <ArticleEntry
              key={`${exp.organisation}-${exp.start_year}`}
              heading={exp.organisation}
              meta={`${exp.role} · ${exp.start_year}–${exp.end_year}`}
            >
              <div className="flex flex-col gap-3">
                {exp.summary.map((paragraph, pIndex) => (
                  <Prose key={pIndex}>{paragraph}</Prose>
                ))}
              </div>
            </ArticleEntry>
          ))}
        </div>
      </PageSection>

      {/* Before Oak */}
      <PageSection id="before-oak" heading="Before Oak" className="mb-6">
        <div className="flex flex-col gap-8">
          {content.prior_roles.map((role) => (
            <ArticleEntry key={role.title} heading={role.title}>
              <div className="flex flex-col gap-3">
                {role.description.map((paragraph, pIndex) => (
                  <Prose key={pIndex}>{paragraph}</Prose>
                ))}
              </div>
            </ArticleEntry>
          ))}
        </div>
      </PageSection>

      {/* Education */}
      <PageSection id="education" heading="Education">
        <ul className="flex flex-col gap-3">
          {content.education.map((edu) => (
            <li
              key={`${edu.degree}-${edu.institution}`}
              className="font-serif text-base text-foreground"
            >
              <span className="font-medium">{edu.degree}</span>, {edu.field}
              <br />
              <span className="text-foreground/70">{edu.institution}</span>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Download (screen) / web reference (print) */}
      <p className="print-hidden mt-10 font-serif text-base text-foreground">
        Download{" "}
        <a
          href="/cv/pdf"
          download={PDF_FILENAME}
          className="underline text-accent hover:opacity-80 transition-opacity"
        >
          this CV as a PDF
        </a>
        .
      </p>
      <p className="hidden print:block mt-10 font-serif text-base text-foreground">
        For the latest version of this CV see {SITE_URL.replace(/^https?:\/\//, "")}/cv.
      </p>
    </div>
  );
}
