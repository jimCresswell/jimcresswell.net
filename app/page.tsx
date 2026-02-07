import { Prose } from "@/components/prose";
import content from "@/content/frontpage.content.json";

export default function HomePage() {
  return (
    <section aria-labelledby="hero-heading">
      <h1
        id="hero-heading"
        className="font-sans text-page-title md:text-page-title-md font-medium leading-tight tracking-tight text-foreground text-balance"
      >
        {content.hero.name}
      </h1>
      <div className="mt-6 flex flex-col gap-3.5">
        {content.hero.summary.map((paragraph, index) => (
          <Prose key={index} className="md:text-lg">
            {paragraph}
          </Prose>
        ))}
      </div>
    </section>
  );
}
