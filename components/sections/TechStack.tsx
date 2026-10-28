import AnimatedContent from "@/components/ui/AnimatedContent";
import { Chip } from "@/components/ui/Chip";
import { MagicBento } from "@/components/ui/MagicBento";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon } from "@/components/ui/TechIcon";
import { sections, techStack } from "@/src/data/portfolio";

export function TechStack() {
  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="relative flex min-h-dvh scroll-mt-24 flex-col px-6 py-16 text-left sm:px-8 lg:h-dvh lg:scroll-mt-0 lg:py-6 lg:px-12 xl:pl-[calc(var(--sidebar-width)+2rem)]"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        <AnimatedContent
          distance={70}
          duration={0.8}
          ease="power3.out"
          threshold={0.1}
          once
          blur={4}
          stagger={0.08}
          className="flex min-h-0 flex-1 flex-col"
        >
          <SectionHeading
            id="tech-stack-heading"
            eyebrow={sections.techStack.eyebrow}
            title={sections.techStack.title}
            description={sections.techStack.description}
            compact
          />

          <div className="mt-4 grid min-h-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
            {techStack.map((category, index) => (
              <MagicBento
                key={category.name}
                index={index}
                title={category.name}
                className="min-h-[190px] p-4 sm:p-5 lg:min-h-0"
                contentClassName="flex min-h-0 flex-col"
              >
                <ul className="mt-3 flex min-h-0 flex-wrap content-start gap-1.5 overflow-hidden">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Chip className="gap-1.5 px-2.5 py-1 text-[11px] transition-colors hover:border-accent/40 hover:text-foreground">
                        <TechIcon
                          name={item.icon}
                          className="size-3.5 text-accent"
                        />
                        {item.name}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </MagicBento>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
