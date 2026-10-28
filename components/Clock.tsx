"use client";

import { useEffect, useState } from "react";

import { Counter } from "@/components/ui/Counter";

const USE_24_HOUR = false;
const MANILA_TIME_ZONE = "Asia/Manila";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Tagum+City+Philippines";

function getManilaTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: !USE_24_HOUR,
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0,
  );
  const period =
    parts.find((part) => part.type === "dayPeriod")?.value.toUpperCase() ?? "";

  return { hour, minute, period };
}

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;

    const tick = () => {
      setNow(new Date());
      const delay = 60_000 - (Date.now() % 60_000);
      timer = window.setTimeout(tick, delay + 25);
    };

    tick();
    return () => window.clearTimeout(timer);
  }, []);

  const time = now ? getManilaTime(now) : null;
  const readableTime = time
    ? `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}${
        time.period ? ` ${time.period}` : ""
      }`
    : null;

  return (
    <div className="fixed bottom-5 left-5 z-30 hidden [@media(min-width:640px)_and_(min-height:700px)]:block">
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          readableTime
            ? `${readableTime} in Manila. Open Tagum City, Philippines in Google Maps.`
            : "Current time in Manila. Open Tagum City, Philippines in Google Maps."
        }
        className="group inline-flex flex-col gap-1 rounded-2xl border border-border bg-background/80 px-3 py-2 shadow-sm backdrop-blur transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="flex items-baseline gap-0.5 font-mono text-lg text-accent">
          {time ? (
            <>
              <Counter value={time.hour} />
              <span aria-hidden="true" className="clock-colon">
                :
              </span>
              <Counter value={time.minute} />
              {time.period ? (
                <span className="ml-1 text-[10px] font-semibold tracking-wide text-muted-foreground">
                  {time.period}
                </span>
              ) : null}
            </>
          ) : (
            <span aria-hidden="true">--:--</span>
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wide text-muted-foreground">
          <PinIcon />
          Tagum City, Philippines · Asia/Manila
        </span>
      </a>
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3 shrink-0"
    >
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}
