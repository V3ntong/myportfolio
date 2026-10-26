"use client";

import { useRef, type CSSProperties, type ElementType, type Ref } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText as SplitTextPlugin } from "gsap/SplitText";

import { cn } from "cn";

gsap.registerPlugin(SplitTextPlugin);

export interface SplitTextProps {
  text: string;
  id?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  splitType?: "chars" | "words" | "lines";
  trigger?: "load" | "scroll" | "hover";
  delay?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  mask?: boolean;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  onComplete?: () => void;
}

export function SplitText({
  text,
  id,
  tag = "p",
  className,
  splitType = "chars",
  trigger = "load",
  delay = 0,
  duration = 1.1,
  stagger = 0.045,
  ease = "power3.out",
  from,
  to,
  mask = true,
  threshold = 0.15,
  rootMargin = "0px",
  textAlign,
  onComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const split = SplitTextPlugin.create(element, {
        type: splitType === "lines" ? "words,lines" : "words,chars",
        mask: mask ? (splitType === "lines" ? "lines" : "chars") : undefined,
        aria: "auto",
      });

      const targets =
        splitType === "lines"
          ? split.lines
          : splitType === "words"
            ? split.words
            : split.chars;

      const timeline = gsap
        .timeline({
          paused: true,
          onComplete: () => onComplete?.(),
        })
        .fromTo(
          targets,
          { opacity: 0, yPercent: 110, ...from },
          {
            opacity: 1,
            yPercent: 0,
            duration,
            stagger,
            ease,
            delay,
            ...to,
          },
        );

      let observer: IntersectionObserver | undefined;

      if (reduce) {
        timeline.progress(1);
      } else if (trigger === "load") {
        timeline.play(0);
      } else if (trigger === "scroll") {
        observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            timeline.play(0);
            observer?.disconnect();
          },
          { threshold, rootMargin },
        );
        observer.observe(element);
      }

      const handleEnter = () => {
        if (!reduce) timeline.restart();
      };

      if (trigger === "hover") {
        element.addEventListener("pointerenter", handleEnter);
      }

      return () => {
        element.removeEventListener("pointerenter", handleEnter);
        observer?.disconnect();
        timeline.kill();
        split.revert();
      };
    },
    {
      scope: ref,
      dependencies: [
        text,
        splitType,
        trigger,
        delay,
        duration,
        stagger,
        ease,
        mask,
        threshold,
        rootMargin,
        from,
        to,
      ],
    },
  );

  const Tag = tag as ElementType;

  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      id={id}
      className={cn(className)}
      style={{ textAlign }}
    >
      {text}
    </Tag>
  );
}

export default SplitText;
