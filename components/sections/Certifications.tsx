import AnimatedContent from "@/components/ui/AnimatedContent";

export function Certifications() {
  return (
    <section
      id="certifications"
      className="relative flex min-h-screen min-h-dvh scroll-mt-24 items-center px-6 py-24 text-left sm:px-8 lg:px-12 xl:pl-56"
    >
      <div className="mx-auto w-full max-w-7xl">
        <AnimatedContent
          distance={70}
          duration={0.8}
          ease="power3.out"
          threshold={0.15}
          once
          blur={4}
          stagger={0.1}
          className="w-full"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Certifications
          </h2>
          <div className="mt-10 max-w-2xl rounded-2xl border border-dashed border-border p-8">
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
              Placeholder
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Replace this block with your Certifications content.
            </p>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}


