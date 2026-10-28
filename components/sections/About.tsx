import AnimatedContent from "@/components/ui/AnimatedContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutContent, labels, sections } from "@/src/data/portfolio";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex min-h-screen min-h-dvh scroll-mt-24 items-center px-6 py-24 text-left sm:px-8 lg:px-12 xl:pl-[calc(var(--sidebar-width)+2rem)]"
    >
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedContent
          distance={70}
          duration={0.8}
          ease="power3.out"
          threshold={0.15}
          once
          blur={4}
          stagger={0.12}
          className="w-full"
        >
          <SectionHeading
            id="about-heading"
            eyebrow={sections.about.eyebrow}
            title={sections.about.title}
            description={sections.about.description}
          />

          <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-3xl border border-border bg-background/50 p-6 backdrop-blur-[2px] sm:p-8">
              <div className="space-y-5">
                {aboutContent.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-muted-foreground sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-sm font-semibold tracking-wide text-foreground">
                  {aboutContent.lookingForTitle}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {aboutContent.lookingFor.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background/50 p-6 backdrop-blur-[2px] sm:p-8">
              <h3 className="text-sm font-semibold tracking-wide text-foreground">
                {labels.quickFacts}
              </h3>
              <dl className="mt-5 space-y-5">
                {aboutContent.quickFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
