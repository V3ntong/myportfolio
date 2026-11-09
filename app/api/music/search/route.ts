/**
 * Audio Search API Route
 * GET /api/music/search?q=...&source=all|audius|youtube
 */

import { NextResponse } from "next/server";

const AUDIUS_HOST = "api.audius.io";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const YOUTUBE_QUOTA_DAILY = 80;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ── per‑IP rate limit ──────────────────────────────────────────
type RateLimitEntry = { count: number; resetTime: number };
const rateLimitStore = new Map<string, RateLimitEntry>();

function getIpAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (now - entry.resetTime >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// ── search cache ────────────────────────────────────────────────
type CacheEntry = {
  audius: Array<{
    id: string;
    source: "audius";
    title: string;
    artist: string;
    artworkUrl: string;
    durationSec: number;
    pageUrl: string;
    streamUrl?: string;
    reactive: boolean;
  }>;
  youtube: Array<{
    id: string;
    source: "youtube";
    title: string;
    artist: string;
    artworkUrl: string;
    durationSec: number;
    pageUrl: string;
    videoId: string;
    reactive: boolean;
  }>;
  timestamp: number;
};

const searchCache = new Map<string, CacheEntry>();

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL_MS;
}

// ── query validation ────────────────────────────────────────────
function validateQuery(q: string): { valid: boolean; trimmed: string; error?: string } {
  const trimmed = q.trim();
  if (trimmed.length < 2) return { valid: false, trimmed, error: "Query must be at least 2 characters." };
  if (trimmed.length > 100) return { valid: false, trimmed, error: "Query must be at most 100 characters." };
  return { valid: true, trimmed };
}

// ── Audius search ───────────────────────────────────────────────
interface AudiusTrack {
  id: string;
  title: string;
  user: { username: string };
  artwork_url: string;
  duration: number; // ms
  permalink_url: string;
}

type AudiusResponse =
  | { kind: "ok"; results: Array<{
    id: string;
    source: "audius";
    title: string;
    artist: string;
    artworkUrl: string;
    durationSec: number;
    pageUrl: string;
    streamUrl?: string;
    reactive: boolean;
  }> }
  | { kind: "error"; error: string };

async function searchAudius(query: string): Promise<AudiusResponse> {
  const url = new URL(`/v1/tracks/search`, AUDIUS_HOST);
  url.searchParams.set("q", query);
  url.searchParams.set("app_name", "myportfolio-music");

  const resp = await fetch(url, { headers: { Accept: "application/json" } });
  if (!resp.ok) {
    const txt = await resp.text();
    return { kind: "error", error: `Audius ${resp.status}: ${txt}` };
  }
  const data: any = await resp.json();
  const tracks: AudiusTrack[] = data.collection || data.tracks || [];

  return {
    kind: "ok",
    results: tracks.map((t: AudiusTrack) => ({
      id: `audius:${t.id}`,
      source: "audius",
      title: t.title,
      artist: t.user?.username || "Unknown artist",
      artworkUrl: t.artwork_url || "/images/placeholder.svg",
      durationSec: Math.round(t.duration / 1000),
      pageUrl: t.permalink_url || "#",
      streamUrl: t.permalink_url,
      reactive: true,
    })),
  };
}

// ── YouTube search ──────────────────────────────────────────────
interface YtVideoDetail {
  id: string;
  contentDetails?: { duration: string };
  snippet: {
    channelTitle: string;
    title: string;
    thumbnails: { medium: { url: string } };
  };
}

interface YtSearchItem {
  etag: string;
  kind: string;
  id: { kind: string; videoId: string };
  snippet: {
    channelTitle: string;
    title: string;
    thumbnails: { medium: { url: string } };
  };
}

let youtubeDailyCalls = 0;

function parseDurationISO(dur: string): number {
  const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(S)?)/);
  if (!m) return 0;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const mi = m[2] ? parseInt(m[2], 10) : 0;
  const s = m[3] ? parseInt(m[3], 10) : 0;
  return h * 3600 + mi * 60 + s;
}

type YouTubeResponse =
  | { kind: "ok"; results: Array<{
    id: string;
    source: "youtube";
    title: string;
    artist: string;
    artworkUrl: string;
    durationSec: number;
    pageUrl: string;
    videoId: string;
    reactive: boolean;
  }> }
  | { kind: "quota"; message: string }
  | { kind: "disabled"; message: string }
  | { kind: "error"; message: string };

async function searchYouTube(query: string): Promise<YouTubeResponse> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return { kind: "disabled", message: "YouTube search not configured." };

  youtubeDailyCalls++;
  if (youtubeDailyCalls > YOUTUBE_QUOTA_DAILY) {
    return { kind: "quota", message: "YouTube search limit reached today." };
  }

  // 1. search.list
  const sUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  sUrl.searchParams.set("key", apiKey);
  sUrl.searchParams.set("q", query);
  sUrl.searchParams.set("type", "video");
  sUrl.searchParams.set("videoCategoryId", "10");
  sUrl.searchParams.set("videoEmbeddable", "true");
  sUrl.searchParams.set("maxResults", "8");
  sUrl.searchParams.set("part", "snippet");

  let sResp: YtSearchItem[];
  try {
    const r = await fetch(sUrl, { headers: { Accept: "application/json" } });
    if (r.status === 403) {
      youtubeDailyCalls--; // restore
      return { kind: "quota", message: "YouTube search limit reached today." };
    }
    if (!r.ok) throw new Error(`YouTube search ${r.status}`);
    const d: any = await r.json();
    sResp = d.items || [];
  } catch {
    return { kind: "error", message: "YouTube search failed" };
  }

  if (sResp.length === 0) return { kind: "ok", results: [] };

  // 2. collect videoIds + videos.list for duration
  const videoItems = sResp.filter(
    (i): i is YtSearchItem => i.id.kind === "youtube#video",
  );
  const videoIds = videoItems.map((i) => i.id.videoId);
  if (videoIds.length === 0) return { kind: "ok", results: [] };

  const vUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  vUrl.searchParams.set("key", apiKey);
  vUrl.searchParams.set("id", videoIds.join(","));
  vUrl.searchParams.set("part", "contentDetails,snippet");

  let vResp: { items: YtVideoDetail[] };
  try {
    const r = await fetch(vUrl, { headers: { Accept: "application/json" } });
    if (r.status === 403) {
      youtubeDailyCalls--; // restore
      return { kind: "quota", message: "YouTube search limit reached today." };
    }
    if (!r.ok) throw new Error(`YouTube videos ${r.status}`);
    const d: any = await r.json();
    vResp = { items: (d.items || []) as YtVideoDetail[] };
  } catch {
    return { kind: "error", message: "YouTube videos fetch failed" };
  }

  // build map keyed by videoId
  const detailMap = new Map<string, YtVideoDetail>();
  (vResp.items || []).forEach((it) => detailMap.set(it.id, it));

// 3. map results
  const results: Array<{
    id: string;
    source: "youtube";
    title: string;
    artist: string;
    artworkUrl: string;
    durationSec: number;
    pageUrl: string;
    videoId: string;
    reactive: boolean;
  }> = videoItems.map((item) => {
    const videoId = item.id.videoId;
    const detail: YtVideoDetail | undefined = detailMap.get(videoId);
    const title = item.snippet.title;
    const channel = item.snippet.channelTitle;
    const thumb = item.snippet.thumbnails.medium.url;
    const dur = parseDurationISO(detail?.contentDetails?.duration || "PT0S");

    return {
      id: `youtube:${videoId}`,
      source: "youtube",
      title,
      artist: channel,
      artworkUrl: thumb,
      durationSec: dur,
      pageUrl: `https://www.youtube.com/watch?v=${videoId}`,
      videoId,
      reactive: false,
    };
  });

  return { kind: "ok", results };
}

// ── route handler ───────────────────────────────────────────────
export async function GET(request: Request) {
  const ip = getIpAddress(request);
  const rate = checkRateLimit(ip);
  if (!rate.allowed)
    return NextResponse.json(
      { error: "Rate limit exceeded. Maximum 20 requests per minute." },
      { status: 429 },
    );

  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") || "";
  const source = (searchParams.get("source") || "all") as "all" | "audius" | "youtube";

  const validation = validateQuery(rawQuery);
  if (!validation.valid)
    return NextResponse.json({ error: validation.error }, { status: 400 });
  const query = validation.trimmed;

  // check cache
  const cached = searchCache.get(query);
  if (cached && isCacheValid(cached.timestamp)) {
    return NextResponse.json({ query, source, ...cached } as any);
  }

  // fan out — type the promises explicitly
  const audiusPromise: Promise<AudiusResponse> = searchAudius(query);
  const youtubePromise: Promise<YouTubeResponse> = searchYouTube(query);

  const [aResult, yResult] = await Promise.allSettled([audiusPromise, youtubePromise]);

  // normalise Audius — check fulfilled + ok kind
  let audiusResults: Array<{
    id: string;
    source: "audius";
    title: string;
    artist: string;
    artworkUrl: string;
    durationSec: number;
    pageUrl: string;
    streamUrl?: string;
    reactive: boolean;
  }>;
  if (aResult.status === "fulfilled" && aResult.value.kind === "ok") {
    audiusResults = aResult.value.results;
  } else {
    audiusResults = [];
  }

  // normalise YouTube — check fulfilled + ok kind
  let youtubeResults: Array<{
    id: string;
    source: "youtube";
    title: string;
    artist: string;
    artworkUrl: string;
    durationSec: number;
    pageUrl: string;
    videoId: string;
    reactive: boolean;
  }>;
  if (yResult.status === "fulfilled" && "kind" in yResult.value && yResult.value.kind === "ok") {
    youtubeResults = yResult.value.results as Array<{
      id: string;
      source: "youtube";
      title: string;
      artist: string;
      artworkUrl: string;
      durationSec: number;
      pageUrl: string;
      videoId: string;
      reactive: boolean;
    }>;
  } else {
    youtubeResults = [];
  }

  // combine (max ~10)
  const combined = [
    ...audiusResults,
    ...youtubeResults,
  ]
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, 10);

  // cache
  const cacheEntry: CacheEntry = {
    audius: audiusResults,
    youtube: youtubeResults,
    timestamp: Date.now(),
  };
  searchCache.set(query, cacheEntry);

  // Determine YouTube status message and kind
  let youtubeMessage: string | undefined;
  let youtubeKind: YouTubeResponse["kind"] | undefined;
  if (yResult.status === "rejected") {
    youtubeMessage = "YouTube search failed";
  } else if (yResult.status === "fulfilled") {
    youtubeKind = yResult.value.kind;
    if (youtubeKind === "quota") {
      youtubeMessage = "YouTube search limit reached today.";
    } else if (youtubeKind === "disabled") {
      youtubeMessage = "YouTube search not configured";
    }
  }

  return NextResponse.json({
    query,
    source,
    audius: { kind: "ok", results: audiusResults },
    youtube: {
      kind: youtubeKind,
      results: youtubeResults,
      message: youtubeMessage,
    },
    combined,
  });
}