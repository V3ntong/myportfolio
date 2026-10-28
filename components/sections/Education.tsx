import AnimatedContent from "@/components/ui/AnimatedContent";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education, labels, sections } from "@/src/data/portfolio";

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
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
            id="education-heading"
            eyebrow={sections.education.eyebrow}
            title={sections.education.title}
            description={sections.education.description}
          />

          <div className="mt-10 max-w-4xl rounded-3xl border border-border bg-background/50 p-6 backdrop-blur-[2px] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
                  {labels.degree}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {education.degree}
                </h3>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {education.school}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {education.period}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {education.summary}
                </p>
              </div>

              <div className="border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
                  {labels.relevantCoursework}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {education.coursework.map((course) => (
                    <li key={course}>
                      <Chip>{course}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
