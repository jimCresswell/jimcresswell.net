import type { ReactNode } from "react";
import { PageSection } from "@/components/page-section";
import { ArticleEntry } from "@/components/article-entry";
import { Prose } from "@/components/prose";

/** Content shape that CVLayout requires. */
interface CVContentProps {
  meta: {
    name: string;
    headline: string;
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
  foundations: Array<{
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
 * Renders header, positioning, experience, foundations, capabilities, and education.
 */
export function CVLayout({ content, positioning }: CVLayoutProps) {
  return (
    <div className="flex flex-col">
      {/* CV Header — unique structure, kept inline */}
      <header className="mb-6">
        <h1 className="font-sans text-page-title md:text-page-title-md font-medium leading-tight tracking-tight text-foreground text-balance mb-2">
          {content.meta.name}
        </h1>
        <p className="font-sans text-sm text-foreground/70 mb-3 md:mb-4">{content.links.email}</p>
        <p className="font-sans text-sm md:text-base uppercase tracking-[0.08em] text-accent">
          {content.meta.headline}
        </p>
      </header>

      {/* Positioning */}
      <PageSection id="positioning" heading="Positioning" srOnly className="mb-6">
        {positioning}
      </PageSection>

      {/* Experience */}
      <PageSection id="experience" heading="Experience" className="mb-6">
        <div className="flex flex-col gap-6">
          {content.experience.map((exp, index) => (
            <ArticleEntry
              key={index}
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

      {/* Foundations */}
      <PageSection id="foundations" heading="Foundations" className="mb-6">
        <div className="flex flex-col gap-8">
          {content.foundations.map((foundation, index) => (
            <ArticleEntry key={index} heading={foundation.title}>
              <div className="flex flex-col gap-3">
                {foundation.description.map((paragraph, pIndex) => (
                  <Prose key={pIndex}>{paragraph}</Prose>
                ))}
              </div>
            </ArticleEntry>
          ))}
        </div>
      </PageSection>

      {/* Capabilities */}
      <PageSection id="capabilities" heading="Capabilities" className="mb-6">
        <ul className="flex flex-col gap-2">
          {content.capabilities.map((capability, index) => (
            <li key={index} className="font-serif text-base leading-prose text-foreground">
              {capability}
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Education */}
      <PageSection id="education" heading="Education">
        <ul className="flex flex-col gap-3">
          {content.education.map((edu, index) => (
            <li key={index} className="font-serif text-base text-foreground">
              <span className="font-medium">{edu.degree}</span>, {edu.field}
              <br />
              <span className="text-foreground/70">{edu.institution}</span>
            </li>
          ))}
        </ul>
      </PageSection>
    </div>
  );
}
