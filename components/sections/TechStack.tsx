import type { CSSProperties } from "react";
import { cn } from "cn";

import AnimatedContent from "@/components/ui/AnimatedContent";
import { Chip } from "@/components/ui/Chip";
import { MagicBento } from "@/components/ui/MagicBento";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sections, techStack } from "@/src/data/portfolio";

const DARK_INVERT_ICONS = new Set([
  "/icons/flask-light.svg",
  "/icons/github_light.svg",
  "/icons/mysql-icon-light.svg",
]);

const TECH_STACK_STYLE = {
  "--ts-card-pad": "clamp(17.5px, calc(0.85vw + 0.82vh), 29px)",
  "--ts-grid-gap": "clamp(9px, calc(0.45vw + 0.65vh), 17px)",
  "--ts-heading-size": "clamp(13px, calc(0.3vw + 0.95vh), 15.5px)",
  "--ts-heading-gap": "clamp(10px, calc(0.45vw + 0.6vh), 16px)",
  "--ts-list-gap": "clamp(5.5px, calc(0.18vw + 0.42vh), 12px)",
  "--ts-chip-text": "clamp(12.5px, calc(0.35vw + 1.1vh), 16px)",
  "--ts-chip-pad-x": "clamp(10px, calc(0.45vw + 0.75vh), 17px)",
  "--ts-chip-pad-y": "clamp(4px, calc(0.15vw + 0.45vh), 8px)",
  "--ts-chip-gap": "clamp(4px, calc(0.15vw + 0.38vh), 8px)",
  "--ts-icon-size": "clamp(18px, calc(0.55vw + 1.35vh), 24px)",
} as CSSProperties;

export function TechStack() {
  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      style={TECH_STACK_STYLE}
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

          <div className="mt-4 grid auto-rows-min content-start gap-[var(--ts-grid-gap)] sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((category, index) => (
              <MagicBento
                key={category.name}
                index={index}
                title={category.name}
                titleClassName="text-[length:var(--ts-heading-size)]"
                className={cn(
                  "h-full p-[var(--ts-card-pad)]",
                  category.wide && "sm:col-span-2 lg:col-span-2",
                )}
                contentClassName="flex min-h-0 flex-1 flex-col"
              >
                <ul className="mt-[var(--ts-heading-gap)] flex flex-1 flex-wrap content-evenly gap-[var(--ts-list-gap)]">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Chip className="gap-[var(--ts-chip-gap)] px-[var(--ts-chip-pad-x)] py-[var(--ts-chip-pad-y)] text-[length:var(--ts-chip-text)] leading-tight transition-colors hover:border-accent/40 hover:text-foreground">
                        {item.icon ? (
                          <img
                            src={item.icon}
                            alt=""
                            aria-hidden
                            width={24}
                            height={24}
                            className={cn(
                              "h-[var(--ts-icon-size)] w-[var(--ts-icon-size)] shrink-0 object-contain",
                              DARK_INVERT_ICONS.has(item.icon) && "dark:invert",
                            )}
                          />
                        ) : null}
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
