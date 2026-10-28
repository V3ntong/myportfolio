"use client";

import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

type CounterProps = {
  value: number | string;
  minDigits?: number;
  direction?: "up" | "down";
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  textColor?: string;
  className?: string;
};

const ROLL_EASE = [0.22, 1, 0.36, 1] as const;

export function Counter({
  value,
  minDigits = 2,
  direction = "up",
  fontSize = "1em",
  fontWeight = 600,
  textColor = "inherit",
  className,
}: CounterProps) {
  const reduceMotion = useReducedMotion();
  const digits = String(value).padStart(minDigits, "0").split("");
  const enterFrom = direction === "up" ? "100%" : "-100%";
  const exitTo = direction === "up" ? "-100%" : "100%";

  return (
    <span
      className={cn("inline-flex tabular-nums", className)}
      style={{ fontSize, fontWeight, color: textColor, lineHeight: 1 }}
    >
      {digits.map((digit, index) => (
        <span
          key={index}
          className="relative inline-block overflow-hidden"
          style={{ width: "0.62em", height: "1em" }}
        >
          {reduceMotion ? (
            <span className="absolute inset-0 flex items-center justify-center">
              {digit}
            </span>
          ) : (
            <AnimatePresence initial={false}>
              <motion.span
                key={`${index}-${digit}`}
                initial={{ y: enterFrom, opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: exitTo, opacity: 0 }}
                transition={{ duration: 0.35, ease: ROLL_EASE }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          )}
        </span>
      ))}
    </span>
  );
}
