import { cn } from "cn";

import { TextAnimation } from "@/components/ui/TextAnimation";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  compact = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="text-xs font-medium tracking-[0.28em] text-accent uppercase">
        <TextAnimation text={eyebrow} display="inline-block" delay={0} />
      </p>
      <h2
        id={id}
        className={cn(
          "mt-3 font-bold tracking-tight text-foreground",
          compact
            ? "text-2xl sm:text-3xl lg:text-4xl"
            : "text-3xl sm:text-4xl lg:text-5xl",
        )}
      >
        <TextAnimation text={title} display="inline-block" delay={0.1} />
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 leading-relaxed text-muted-foreground",
            compact ? "text-sm sm:text-base" : "text-base sm:text-lg",
          )}
        >
          <TextAnimation text={description} display="inline" delay={0.25} />
        </p>
      ) : null}
    </div>
  );
}
