import AnimatedContent from "@/components/ui/AnimatedContent";
import { Chip } from "@/components/ui/Chip";
import { MagicBento } from "@/components/ui/MagicBento";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextAnimation } from "@/components/ui/TextAnimation";
import { labels, projects, sections } from "@/src/data/portfolio";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
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
            id="projects-heading"
            eyebrow={sections.projects.eyebrow}
            title={sections.projects.title}
            description={sections.projects.description}
            compact
          />

          <div className="mt-5 grid min-h-0 flex-1 gap-3 sm:grid-cols-2 sm:grid-rows-2 lg:gap-4">
            {projects.map((project, index) => {
              const textDelay = 0.2 + index * 0.08;

              return (
                <MagicBento
                  key={project.id}
                  index={index}
                  className="h-[360px] sm:h-[380px] lg:h-auto"
                  contentClassName="flex min-h-0 flex-1 flex-col"
                >
                  <div
                    role="img"
                    aria-label={project.imageAlt}
                    className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden border-b border-border bg-foreground/[0.02]"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-50"
                      style={{
                        backgroundImage:
                          "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    <div className="relative flex flex-col items-center gap-1.5 px-4 text-center">
                      <span className="rounded-full border border-border bg-background/80 px-2.5 py-0.5 text-[9px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                        {labels.screenshot}
                      </span>
                      <span className="line-clamp-1 text-xs font-semibold text-foreground">
                        {project.title}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 p-3.5 sm:p-4">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
                      <TextAnimation
                        text={project.title}
                        display="inline-block"
                        delay={textDelay}
                      />
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                      <TextAnimation
                        text={project.description}
                        display="inline"
                        delay={textDelay + 0.06}
                      />
                    </p>

                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <li key={tech}>
                          <Chip className="px-2 py-0.5 text-[10px] bg-foreground/[0.03]">
                            {tech}
                          </Chip>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-2 line-clamp-1 text-[10px] text-muted-foreground">
                      <TextAnimation
                        text={`${labels.role}: ${project.role}`}
                        display="inline"
                        delay={textDelay + 0.12}
                      />
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[10px] font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <GitHubIcon />
                        {labels.github}
                      </a>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[10px] font-semibold text-background transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <LiveIcon />
                        {labels.liveDemo}
                      </a>
                    </div>
                  </div>
                </MagicBento>
              );
            })}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9 19v-2.2c-2.4.5-3.2-1-3.2-1-.4-1-1-1.3-1-1.3-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.2.7-1.5-2-.2-4-1-4-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.2 0 0 .7-.2 2.3.9a7.8 7.8 0 0 1 4 0c1.6-1.1 2.3-.9 2.3-.9.5 1.1.2 2 .1 2.2.6.6.9 1.4.9 2.3 0 3.2-2 4-4 4.2.4.4.7 1 .7 2v3" />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
    >
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </svg>
  );
}
