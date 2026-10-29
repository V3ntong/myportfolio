"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const nextFrame = () =>
  new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    // rAF is paused while the View Transition update callback is pending in
    // Chromium, so race it with a short timer to avoid a deadlock. The queued
    // frame callback still runs before the new snapshot is captured.
    requestAnimationFrame(finish);
    window.setTimeout(finish, 16);
  });

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fallbackTimer = useRef<number | null>(null);
const isToggling = useRef(false);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isDark = mounted && resolvedTheme === "dark";
  const label = !mounted
    ? "Toggle color theme"
    : isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

  useEffect(
    () => () => {
      if (fallbackTimer.current !== null) {
        window.clearTimeout(fallbackTimer.current);
      }
      document.documentElement.classList.remove("theme-transition");
    },
    [],
  );

  const toggleTheme = async () => {
    if (isToggling.current) return;
    isToggling.current = true;
    const nextTheme = isDark ? "light" : "dark";
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const applyTheme = () => {
      flushSync(() => setTheme(nextTheme));
      root.classList.remove("light", "dark");
      root.classList.add(nextTheme);
      root.style.colorScheme = nextTheme;
    };

    // Instant swap for reduced motion or unsupported browsers (no CSS transition).
    if (reduceMotion || typeof document.startViewTransition !== "function") {
      applyTheme();
      isToggling.current = false;
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 40;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-radius", `${radius}px`);

    root.classList.add("theme-vt");
    const endTransition = () => {
      root.classList.remove("theme-vt");
      isToggling.current = false;
    };

    let transition: ViewTransition;
    try {
      transition = document.startViewTransition(async () => {
        applyTheme();
        await nextFrame();
        await nextFrame();
        if (document.fonts) await document.fonts.ready;
      });
    } catch {
      endTransition();
      return;
    }

    void transition.finished.then(endTransition, endTransition);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        void toggleTheme();
      }}
      className="fixed top-4 right-4 z-50 inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className="size-5"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  );
}
