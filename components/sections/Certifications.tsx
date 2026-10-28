import AnimatedContent from "@/components/ui/AnimatedContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications, labels, sections } from "@/src/data/portfolio";

export function Certifications() {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
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
          stagger={0.1}
          className="w-full"
        >
          <SectionHeading
            id="certifications-heading"
            eyebrow={sections.certifications.eyebrow}
            title={sections.certifications.title}
            description={sections.certifications.description}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((certification) => (
              <article
                key={certification.id}
                className="flex h-full flex-col rounded-3xl border border-border bg-background/50 p-6 backdrop-blur-[2px] transition-colors duration-300 hover:border-accent/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent"
                  >
                    <AwardIcon />
                  </span>
                  {certification.inProgress ? (
                    <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-accent uppercase">
                      {labels.inProgress}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                  {certification.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {certification.issuer}
                </p>
                <p className="mt-3 text-xs font-medium tracking-wide text-muted-foreground">
                  {certification.date}
                </p>

                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {labels.viewCredential}
                  <ExternalIcon />
                </a>
              </article>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

function AwardIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <circle cx="12" cy="9" r="5" />
      <path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
    >
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </svg>
  );
}
