"use client";

import { useTheme } from "next-themes";

import { GlyphBackground } from "@/components/backgrounds/glyph";

export function PageBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <GlyphBackground
      className="fixed inset-0 z-0"
      glowColor={isDark ? "#f4ede0" : "#14213d"}
      shapeColor="#ff6b5b"
      haze={isDark ? 0.1 : 0.18}
      hoverInk={isDark ? 0.3 : 0.45}
    />
  );
}
