"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import GradualBlur from "@/components/ui/GradualBlur";

gsap.registerPlugin(ScrollTrigger);

const DIRECTION_THRESHOLD = 4;

export function ScrollBlur() {
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    let shown = false;

    const setShown = (next: boolean) => {
      if (next === shown) return;
      shown = next;
      setVisible(next);
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY;

      if (y <= 0) {
        lastY = 0;
        setShown(false);
        return;
      }

      const delta = y - lastY;
      if (Math.abs(delta) < DIRECTION_THRESHOLD) return;
      lastY = y;
      setShown(delta > 0);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 300);
    const onLoad = () => refresh();

    window.addEventListener("load", onLoad);
    void document.fonts?.ready.then(refresh);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (reduceMotion) return null;

  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="7rem"
      strength={2.5}
      layers={8}
      curve="bezier"
      exponential
      autoHide
      zIndex={30}
      className="scroll-blur"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    />
  );
}
