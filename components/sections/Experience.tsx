import AnimatedContent from "@/components/ui/AnimatedContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience, sections } from "@/src/data/portfolio";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative flex min-h-screen min-h-dvh scroll-mt-24 items-center px-6 py-24 text-left sm:px-8 lg:px-12 xl:pl-[calc(var(--sidebar-width)+2rem)]"
    >
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedContent
          distance={70}
          duration={0.8}
          ease="power3.out"
          threshold={0.1}
          once
          blur={4}
          stagger={0.12}
          className="w-full"
        >
          <SectionHeading
            id="experience-heading"
            eyebrow={sections.experience.eyebrow}
            title={sections.experience.title}
            description={sections.experience.description}
          />

          <ol className="relative mt-10 max-w-4xl space-y-6">
            <span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[7px] w-px bg-border"
            />

            {experience.map((entry) => (
              <li key={entry.id} className="relative pl-8 sm:pl-10">
                <span
                  aria-hidden="true"
                  className="absolute top-6 left-0 size-3.5 rounded-full border-2 border-accent bg-background"
                />
                <div className="rounded-2xl border border-border bg-background/50 p-6 backdrop-blur-[2px]">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {entry.role}
                    </h3>
                    <p className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground">
                      {entry.period}
                    </p>
                  </div>
                  <p className="mt-1 text-sm font-medium text-accent">
                    {entry.organization}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {entry.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-px w-3 shrink-0 bg-accent/70"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </AnimatedContent>
      </div>
    </section>
  );
}
