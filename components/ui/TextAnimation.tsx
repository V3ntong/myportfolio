"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

type TextAnimationProps = {
  text: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  mode?: "word" | "char";
  display?: "inline" | "inline-block";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  itemClassName?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function TextAnimation({
  text,
  as: Component = "span",
  mode = "word",
  display = "inline",
  delay = 0,
  duration = 0.55,
  once = true,
  className,
  itemClassName,
}: TextAnimationProps) {
  const reduceMotion = useReducedMotion();
  const units =
    mode === "char" ? text.split("") : text.split(/(\s+)/).filter(Boolean);

  return (
    <Component className={cn(display === "inline" ? "inline" : "inline-block", className)}>
      <motion.span
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: reduceMotion ? 0 : delay,
              staggerChildren: reduceMotion
                ? 0
                : mode === "char"
                  ? 0.018
                  : 0.045,
            },
          },
        }}
        className="inline"
      >
        {units.map((unit, index) => {
          if (/^\s+$/.test(unit)) {
            return <Fragment key={`space-${index}`}>{unit}</Fragment>;
          }

          return (
            <motion.span
              key={`${unit}-${index}`}
              variants={{
                hidden: reduceMotion
                  ? {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }
                  : {
                      opacity: 0,
                      y: display === "inline" ? 0 : "0.35em",
                      filter: "blur(4px)",
                    },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: reduceMotion ? 0 : duration,
                    ease: EASE,
                  },
                },
              }}
              className={cn(
                display === "inline" ? "inline" : "inline-block",
                display === "inline-block" && "pb-[0.16em] -mb-[0.16em]",
                "will-change-transform",
                itemClassName,
              )}
            >
              {unit}
            </motion.span>
          );
        })}
      </motion.span>
    </Component>
  );
}
