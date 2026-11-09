"use client";

import { useTheme } from "next-themes";

import { GlyphBackground } from "@/components/backgrounds/glyph";

export function PageBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <GlyphBackground
      className="fixed inset-0 z-0"
<<<<<<< HEAD
      glowColor={isDark ? "#0a0a0a" : "#fafafa"}
      shapeColor={isDark ? "#a855f7" : "#7e22ce"}
=======
      glowColor={isDark ? "#f4ede0" : "#14213d"}
      shapeColor="#ff6b5b"
>>>>>>> 69d7b2e (asdasda)
      haze={isDark ? 0.1 : 0.18}
      hoverInk={isDark ? 0.3 : 0.45}
    />
  );
}
