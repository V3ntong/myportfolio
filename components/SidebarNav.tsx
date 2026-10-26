"use client";

import { useCallback, useEffect, useState } from "react";
import LineSidebar from "@/components/LineSidebar";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;

const LABELS = NAV_ITEMS.map((item) => item.label);

function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  section.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function SidebarNav() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) =>
      document.getElementById(id),
    ).filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = NAV_ITEMS.findIndex(
            ({ id }) => id === entry.target.id,
          );
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleItemClick = useCallback((index: number) => {
    const item = NAV_ITEMS[index];
    if (!item) return;
    scrollToSection(item.id);
    setActive(index);
    setOpen(false);
  }, []);

  return (
    <>
      <div className="fixed top-1/2 left-4 z-20 hidden -translate-y-1/2 xl:block">
        <LineSidebar
          items={LABELS}
          activeIndex={active}
          onItemClick={handleItemClick}
        />
      </div>

      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="fixed top-4 left-4 z-50 inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent xl:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-overlay"
          />
          <div
            id="mobile-navigation"
            className="absolute top-0 left-0 h-full w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-background px-6 pt-20 pb-8 shadow-xl"
          >
            <LineSidebar
              items={LABELS}
              activeIndex={active}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      )}
    </>
  );
}

function MenuIcon() {
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
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
