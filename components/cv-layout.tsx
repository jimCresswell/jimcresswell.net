import type { ReactNode } from "react";
import { cvContent } from "@/lib/cv-content";
import { RichText } from "@/components/rich-text";

interface CVLayoutProps {
  positioning: ReactNode;
}

export function CVLayout({ positioning }: CVLayoutProps) {
  return (
    <div className="flex flex-col">
      {/* CV Header */}
      <header className="mb-6">
        <h1 className="font-sans text-page-title md:text-page-title-md font-medium leading-tight tracking-tight text-foreground text-balance mb-2">
          {cvContent.meta.name}
        </h1>
        <p className="font-sans text-sm text-foreground/70 mb-3 md:mb-4">{cvContent.links.email}</p>
        <p className="font-sans text-sm md:text-base uppercase tracking-[0.08em] text-accent">
          {cvContent.meta.headline}
        </p>
      </header>

      {/* Positioning */}
      <section aria-labelledby="positioning-heading" className="mb-6">
        <h2 id="positioning-heading" className="sr-only">
          Positioning
        </h2>
        {positioning}
      </section>

      {/* Experience */}
      <section aria-labelledby="experience-heading" className="mb-6">
        <h2
          id="experience-heading"
          className="font-sans text-base md:text-lg font-medium text-foreground mb-4"
        >
          Experience
        </h2>
        <div className="flex flex-col gap-6">
          {cvContent.experience.map((exp, index) => (
            <article key={index} className="flex flex-col">
              <h3 className="font-sans text-base font-medium text-foreground mb-1">
                {exp.organisation}
              </h3>
              <p className="font-sans text-sm text-foreground/70 mb-3">
                {exp.role} · {exp.start_year}–{exp.end_year}
              </p>
              <div className="flex flex-col gap-3">
                {exp.summary.map((paragraph, pIndex) => (
                  <p key={pIndex} className="font-serif text-base leading-prose text-foreground">
                    <RichText>{paragraph}</RichText>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Foundations */}
      <section aria-labelledby="foundations-heading" className="mb-6">
        <h2
          id="foundations-heading"
          className="font-sans text-base md:text-lg font-medium text-foreground mb-4"
        >
          Foundations
        </h2>
        <div className="flex flex-col gap-8">
          {cvContent.foundations.map((foundation, index) => (
            <article key={index} className="flex flex-col">
              <h3 className="font-sans text-base font-medium text-foreground mb-4">
                {foundation.title}
              </h3>
              <div className="flex flex-col gap-3">
                {foundation.description.map((paragraph, pIndex) => (
                  <p key={pIndex} className="font-serif text-base leading-prose text-foreground">
                    <RichText>{paragraph}</RichText>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section aria-labelledby="capabilities-heading" className="mb-6">
        <h2
          id="capabilities-heading"
          className="font-sans text-base md:text-lg font-medium text-foreground mb-4"
        >
          Capabilities
        </h2>
        <ul className="flex flex-col gap-2">
          {cvContent.capabilities.map((capability, index) => (
            <li key={index} className="font-serif text-base leading-prose text-foreground">
              {capability}
            </li>
          ))}
        </ul>
      </section>

      {/* Education */}
      <section aria-labelledby="education-heading">
        <h2
          id="education-heading"
          className="font-sans text-base md:text-lg font-medium text-foreground mb-4"
        >
          Education
        </h2>
        <ul className="flex flex-col gap-3">
          {cvContent.education.map((edu, index) => (
            <li key={index} className="font-serif text-base text-foreground">
              <span className="font-medium">{edu.degree}</span>, {edu.field}
              <br />
              <span className="text-foreground/70">{edu.institution}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
