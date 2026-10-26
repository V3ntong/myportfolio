"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useTheme } from "next-themes";

import HalftoneReveal from "@/components/HalftoneReveal";
import SplitText from "@/components/SplitText";
import { cn } from "cn";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
};

export function Home() {
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const isDark = resolvedTheme === "dark";

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative z-10 flex min-h-screen scroll-mt-24 items-center px-6 py-16 text-left sm:px-8 lg:py-10 lg:pl-[calc(var(--sidebar-width)+3rem)] lg:pr-12 xl:pl-[350px]"
    >
      <div className="mx-auto grid w-full max-w-[100rem] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,40.625rem)_minmax(0,1fr)] lg:gap-12">
        <motion.div
          className="relative z-10"
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
        >
          <motion.div variants={item}>
            <SplitText
              id="hero-heading"
              tag="h1"
              text="Melvin Maquilan"
              trigger="load"
              delay={0.15}
              duration={0.9}
              stagger={0.035}
              className="text-5xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-6xl lg:text-7xl lg:whitespace-nowrap"
            />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-10 max-w-[650px] text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {
              "I'm a full-stack developer studying Computer Science. I build web and mobile apps, and lately I've been exploring [AI / cloud / whatever you're into]."
            }
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-[650px] text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {
              "I'm always working on something new. I love turning ideas into real products, one build at a time."
            }
          </motion.p>
        </motion.div>

        <div className="pointer-events-auto absolute right-6 top-6 z-0 w-auto max-w-[42vw] lg:right-12 lg:top-6">
          <div
            role="img"
            aria-label="Portrait of Melvin Maquilan"
            className={cn(
              "relative aspect-[463/395] h-[90vh] w-auto max-w-full transition-opacity duration-500",
              mounted ? "opacity-100" : "opacity-0",
            )}
          >
            {mounted && (
              <HalftoneReveal
                src="/images/owner/me-trimmed.png"
                fit="contain"
                cellSize={5}
                revealRadius={45}
                wander={false}
                clickBurst={false}
                inkColor={isDark ? "#ededed" : "#171717"}
                paperColor={isDark ? "#0a0a0a" : "#fafafa"}
                accentColor={isDark ? "#a855f7" : "#7e22ce"}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
