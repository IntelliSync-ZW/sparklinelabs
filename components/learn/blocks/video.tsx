"use client";

import { useState } from "react";
import { ExternalLink, PlayCircle } from "lucide-react";
import { Prose } from "./prose";
import type { PortableTextValue } from "./types";

type Chapter = { _key?: string; time?: string; label?: string };
type VideoValue = { title?: string; url?: string; chapters?: Chapter[]; transcript?: PortableTextValue };

/** "mm:ss" or "h:mm:ss" → seconds. */
function toSeconds(time?: string) {
  if (!time) return 0;
  return time.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

/** Turn a YouTube, Vimeo or Loom link into an embeddable URL starting at `start` seconds. */
function embedUrl(url: string, start: number): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be" || host.endsWith("youtube.com")) {
      const id =
        host === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v") ?? u.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      return `https://www.youtube-nocookie.com/embed/${id}?rel=0${start ? `&start=${start}&autoplay=1` : ""}`;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}${start ? `#t=${start}s` : ""}` : null;
    }
    if (host.endsWith("loom.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.loom.com/embed/${id}${start ? `?t=${start}` : ""}` : null;
    }
  } catch {
    // Not a valid URL — fall through to the plain link.
  }
  return null;
}

export function VideoBlock({ value }: { value: VideoValue }) {
  const [start, setStart] = useState(0);
  if (!value.url) return null;
  const src = embedUrl(value.url, start);
  const chapters = (value.chapters ?? []).filter((c) => c.time && c.label);

  return (
    <section className="my-10 overflow-hidden rounded-2xl border border-border bg-card">
      {src ? (
        <div className="relative aspect-video bg-black">
          <iframe
            key={start}
            src={src}
            title={value.title || "Lesson video"}
            className="absolute inset-0 size-full"
            allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <a href={value.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-secondary px-5 py-6 hover:bg-secondary/70">
          <PlayCircle className="size-8 text-accent" />
          <span className="font-medium">Watch: {value.title || value.url}</span>
          <ExternalLink className="ml-auto size-4 text-muted-foreground" />
        </a>
      )}

      {(value.title || chapters.length > 0) && (
        <div className="px-5 py-4">
          {value.title && <p className="font-semibold text-foreground">{value.title}</p>}
          {chapters.length > 0 && src && (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Chapters">
              {chapters.map((chapter, i) => {
                const seconds = toSeconds(chapter.time);
                return (
                  <li key={chapter._key ?? i}>
                    <button
                      type="button"
                      onClick={() => setStart(seconds)}
                      aria-pressed={start === seconds}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                        start === seconds ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="font-mono text-xs text-accent">{chapter.time}</span> {chapter.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {value.transcript && (
        <details className="border-t border-border">
          <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
            Read the transcript
          </summary>
          <div className="px-5 pb-5">
            <Prose value={value.transcript} />
          </div>
        </details>
      )}
    </section>
  );
}
