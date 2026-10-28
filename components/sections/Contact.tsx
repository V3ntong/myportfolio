import { ContactForm } from "@/components/forms/ContactForm";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialFlipButton } from "@/components/ui/SocialFlipButton";
import { TextAnimation } from "@/components/ui/TextAnimation";
import { contactContent, sections } from "@/src/data/portfolio";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
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
            id="contact-heading"
            eyebrow={sections.contact.eyebrow}
            title={sections.contact.title}
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                <TextAnimation
                  text={contactContent.line}
                  display="inline"
                  delay={0.4}
                />
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                <TextAnimation
                  text={contactContent.description}
                  display="inline"
                  delay={0.5}
                />
              </p>

              <SocialFlipButton className="mt-6" />
            </div>

            <ContactForm />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
