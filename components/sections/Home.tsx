"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import HalftoneReveal from "@/components/HalftoneReveal";
import AnimatedContent from "@/components/ui/AnimatedContent";
import TechText from "@/components/ui/TechText";
import { cn } from "cn";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Home() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const isDark = resolvedTheme === "dark";
  const accent = isDark ? "#a855f7" : "#7e22ce";

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative z-10 flex min-h-screen min-h-dvh scroll-mt-24 items-center overflow-x-clip px-6 py-24 text-left sm:px-8 lg:py-10 lg:pl-12 lg:pr-[clamp(2rem,6vw,6rem)] xl:pl-[calc(var(--sidebar-width)+2rem)]"
    >
      <div className="mx-auto grid w-full max-w-[100rem] grid-cols-1 items-center gap-10 lg:-translate-y-14 lg:grid-cols-[minmax(0,6fr)_auto_minmax(0,0.5fr)] lg:gap-12 xl:gap-16">
        <AnimatedContent
          trigger="mount"
          distance={60}
          duration={0.8}
          ease="power3.out"
          stagger={0.12}
          className="w-full"
        >
          <h1
            id="hero-heading"
            className="relative -ml-[5%] h-[clamp(5.5rem,10vw,8rem)] w-full max-w-[50rem]"
          >
            <TechText
              text="Melvin Maquilan"
              align="left"
              fontWeight={700}
              fontSize={88}
              color={isDark ? "#ededed" : "#171717"}
              accentColor={accent}
              fontFamily="Arial, Helvetica, sans-serif"
              reveal="letter"
              specks={8}
              sweep={false}
              draggable={false}
              clickKick={false}
            />
          </h1>

          <p className="mt-6 max-w-[650px] text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {
              "I'm a full-stack developer studying Computer Science. I build web and mobile apps, and lately I've been exploring AI and cloud technologies."
            }
          </p>

          <p className="mt-4 max-w-[650px] text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {
              "I'm always working on something new. I love turning ideas into real products, one build at a time."
            }
          </p>
        </AnimatedContent>

        <AnimatedContent
          trigger="mount"
          distance={60}
          duration={0.8}
          ease="power3.out"
          className="w-full lg:w-auto"
        >
          <div
            role="img"
            aria-label="Portrait of Melvin Maquilan"
            className={cn(
              "relative mx-auto aspect-[145/277] h-[clamp(17rem,58vw,26rem)] w-auto max-w-full transition-opacity duration-500 lg:mx-0 lg:translate-y-[50px] lg:h-[clamp(33.5rem,calc(46vh+6vw+7.5rem),49.5rem)]",
              mounted ? "opacity-100" : "opacity-0",
            )}
          >
            {/* The source PNG has a large transparent canvas. This crops to the
                person's alpha bounds so the portrait keeps no empty box, while
                the page-level glyph background still shows around the cutout. */}
            <div className="absolute -left-[119.31%] -top-[42.599%] h-[142.599%] w-[319.31%]">
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
                  accentColor={accent}
                />
              )}
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}


