"use client";

import { useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaDiscord,
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { cn } from "cn";

import { socialLinks, type SocialLink, type SocialLinkId } from "@/src/data/portfolio";

const ICONS: Record<SocialLinkId, IconType> = {
  github: FaGithub,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  email: FaEnvelope,
  discord: FaDiscord,
};

type SocialFlipButtonProps = {
  items?: SocialLink[];
  className?: string;
  frontClassName?: string;
  backClassName?: string;
};

export function SocialFlipButton({
  items = socialLinks,
  className,
  frontClassName,
  backClassName,
}: SocialFlipButtonProps) {
  const [flipped, setFlipped] = useState<SocialLinkId | null>(null);
  const pointerType = useRef<string | null>(null);

  return (
    <ul className={cn("flex flex-wrap gap-1.5 sm:gap-2", className)}>
      {items.map((link) => {
        const Icon = ICONS[link.id];
        const external = link.href.startsWith("http");
        const placeholder =
          link.href.includes("[REPLACE]") ||
          link.id === "email" ||
          link.id === "github" ||
          link.id === "linkedin";

        return (
          <li key={link.id}>
            <a
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={`${link.label}${placeholder ? " (placeholder link)" : ""}`}
              onPointerDown={(event) => {
                pointerType.current = event.pointerType;
              }}
              onClick={(event) => {
                if (event.detail === 0 || pointerType.current === "mouse") {
                  return;
                }

                if (flipped !== link.id) {
                  event.preventDefault();
                  setFlipped(link.id);
                } else {
                  setFlipped(null);
                }
              }}
              className="group relative block size-9 [perspective:800px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-10"
            >
              <span
                className="relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]"
                style={
                  flipped === link.id
                    ? { transform: "rotateY(180deg)" }
                    : undefined
                }
              >
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center rounded-xl border text-sm font-semibold shadow-sm [backface-visibility:hidden]",
                    frontClassName ??
                      "border-border bg-background/70 text-foreground",
                  )}
                >
                  {link.letter}
                </span>
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center rounded-xl border [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    backClassName ??
                      "border-accent bg-accent text-white shadow-[0_10px_30px_-14px_var(--accent)]",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-[10px] font-medium whitespace-nowrap text-background opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {link.label}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
