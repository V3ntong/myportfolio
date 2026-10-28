"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "cn";

type AnimatedFooterProps = {
  headingLines?: string[];
  revealed?: boolean;
  className?: string;
};

const LEFT_IMAGE = "/animated-footer/hand-left.jpg";
const RIGHT_IMAGE = "/animated-footer/hand-right.jpg";
const ASCII_CHARS = "@%#*+=-:. ";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${src}`));
    image.src = src;
  });
}

function findScrollParent(element: HTMLElement) {
  let parent = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    if (
      /(auto|scroll)/.test(style.overflowY) &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

function drawHand(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  side: "left" | "right",
  charColor: string,
) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const context = canvas.getContext("2d");
  if (!context) return;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  const sampleWidth = 54;
  const sampleHeight = Math.max(
    18,
    Math.round((image.naturalHeight / image.naturalWidth) * sampleWidth),
  );

  const offscreen = document.createElement("canvas");
  offscreen.width = sampleWidth;
  offscreen.height = sampleHeight;

  const sampleContext = offscreen.getContext("2d", {
    willReadFrequently: true,
  });
  if (!sampleContext) return;

  sampleContext.drawImage(image, 0, 0, sampleWidth, sampleHeight);
  const pixels = sampleContext.getImageData(
    0,
    0,
    sampleWidth,
    sampleHeight,
  ).data;

  const scale = Math.min(width / sampleWidth, height / sampleHeight);
  const drawWidth = sampleWidth * scale;
  const drawHeight = sampleHeight * scale;
  const offsetX = side === "left" ? 0 : width - drawWidth;
  const offsetY = (height - drawHeight) / 2;
  const cellWidth = drawWidth / sampleWidth;
  const cellHeight = drawHeight / sampleHeight;

  context.fillStyle = charColor;
  context.globalAlpha = 0.62;
  context.font = `${Math.max(6, cellWidth * 1.15)}px monospace`;
  context.textBaseline = "top";

  for (let y = 0; y < sampleHeight; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      const index = (y * sampleWidth + x) * 4;
      const alpha = pixels[index + 3] ?? 0;
      if (alpha < 40) continue;

      const red = pixels[index] ?? 0;
      const green = pixels[index + 1] ?? 0;
      const blue = pixels[index + 2] ?? 0;
      const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
      const darkness = 1 - luminance / 255;

      if (darkness < 0.2) continue;

      const character =
        ASCII_CHARS[
          Math.min(
            ASCII_CHARS.length - 1,
            Math.floor(darkness * (ASCII_CHARS.length - 1)),
          )
        ] ?? "";

      context.fillText(
        character,
        offsetX + x * cellWidth,
        offsetY + y * cellHeight,
      );
    }
  }
}

export function AnimatedFooter({
  headingLines = ["Melvin works"],
  revealed,
  className,
}: AnimatedFooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<{
    left?: HTMLImageElement | null;
    right?: HTMLImageElement | null;
  }>({});
  const [inView, setInView] = useState(false);
  const { resolvedTheme } = useTheme();
  const isRevealed = revealed ?? inView;

  useEffect(() => {
    if (revealed !== undefined) return;

    const element = rootRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        root: findScrollParent(element),
        threshold: 0.2,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed]);

  useEffect(() => {
    if (!isRevealed) return;

    const root = rootRef.current;
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    if (!root || !leftCanvas || !rightCanvas) return;

    let cancelled = false;
    let frame = 0;

    const draw = async () => {
      frame = 0;

      const [leftImage, rightImage] = await Promise.all([
        imagesRef.current.left ??
          loadImage(LEFT_IMAGE).catch(() => null),
        imagesRef.current.right ??
          loadImage(RIGHT_IMAGE).catch(() => null),
      ]);

      if (cancelled) return;
      imagesRef.current.left = leftImage;
      imagesRef.current.right = rightImage;

      const charColor =
        resolvedTheme === "light" ? "#a855f7" : "#7e22ce";

      if (leftImage) {
        drawHand(leftCanvas, leftImage, "left", charColor);
      }

      if (rightImage) {
        drawHand(rightCanvas, rightImage, "right", charColor);
      }
    };

    const schedule = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        void draw();
      });
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);
    schedule();

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isRevealed, resolvedTheme]);

  return (
    <footer
      ref={rootRef}
      aria-labelledby="footer-heading"
      className={cn(
        "relative h-full w-full overflow-hidden border-t border-border bg-background",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,transparent_45%,var(--background)_100%)]"
      />

      <canvas
        ref={leftCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-[31%] opacity-80"
      />
      <canvas
        ref={rightCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-[31%] opacity-80"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <h2
          id="footer-heading"
          aria-label={headingLines.join(" ")}
          className="text-center text-[clamp(2.75rem,10vw,8rem)] leading-[0.9] font-bold tracking-tighter"
        >
          {headingLines.map((line, lineIndex) => (
            <span key={`${line}-${lineIndex}`} className="block">
              {line.split("").map((character, characterIndex) => (
                <span
                  key={`${character}-${characterIndex}`}
                  aria-hidden="true"
                  className="inline-block cursor-default text-accent/40 transition-colors duration-200 hover:bg-accent hover:text-background motion-reduce:transition-none"
                >
                  {character === " " ? "\u00A0" : character}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>
    </footer>
  );
}
