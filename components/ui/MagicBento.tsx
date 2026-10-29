"use client";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "cn";

import { TextAnimation } from "@/components/ui/TextAnimation";

type MagicBentoProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  title?: string;
  titleClassName?: string;
  description?: string;
  index?: number;
  delay?: number;
};

export function MagicBento({
  children,
  className,
  contentClassName,
  title,
  titleClassName,
  description,
  index = 0,
  delay,
}: MagicBentoProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const textDelay = delay ?? 0.2 + index * 0.08;

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const element = ref.current;
    if (!element || event.pointerType !== "mouse") return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    element.style.setProperty("--bento-x", `${x}px`);
    element.style.setProperty("--bento-y", `${y}px`);

    if (reduceMotion) return;

    const rotateX = ((y / rect.height) - 0.5) * -2.5;
    const rotateY = ((x / rect.width) - 0.5) * 2.5;
    element.style.setProperty("--bento-rotate-x", `${rotateX}deg`);
    element.style.setProperty("--bento-rotate-y", `${rotateY}deg`);
  };

  const handlePointerLeave = () => {
    const element = ref.current;
    if (!element) return;

    element.style.setProperty("--bento-rotate-x", "0deg");
    element.style.setProperty("--bento-rotate-y", "0deg");
  };

  return (
    <article
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "group/bento relative flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border bg-background/50 backdrop-blur-[2px] transition-[transform,border-color,box-shadow] duration-200 ease-out hover:border-accent/40 hover:shadow-[0_20px_70px_-30px_var(--accent)]",
        className,
      )}
      style={{
        transform:
          "perspective(900px) rotateX(var(--bento-rotate-x, 0deg)) rotateY(var(--bento-rotate-y, 0deg))",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/bento:opacity-10"
        style={{
          background:
            "radial-gradient(300px circle at var(--bento-x, 50%) var(--bento-y, 50%), var(--accent), transparent 70%)",
        }}
      />
      <div className={cn("relative z-10 flex min-h-0 flex-col", contentClassName)}>
        {title ? (
          <h3
            className={cn(
              "text-xs font-semibold tracking-[0.2em] text-accent uppercase",
              titleClassName,
            )}
          >
            <TextAnimation text={title} display="inline-block" delay={textDelay} />
          </h3>
        ) : null}
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <TextAnimation
              text={description}
              display="inline"
              delay={textDelay + 0.06}
            />
          </p>
        ) : null}
        {children}
      </div>
    </article>
  );
}
