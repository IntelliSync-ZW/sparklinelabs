"use client";

import { useEffect } from "react";

const COOKIE_PREFIX = "slabs_seen_";
const COOKIE_TTL_DAYS = 7;

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

interface ViewTrackerProps {
  postId: string;
  slug: string;
}

/**
 * Invisible client component that fires a view-count API request once per
 * session per post. Uses a lightweight cookie keyed on the post slug so the
 * same browser cannot count the same article more than once within 7 days.
 */
export function ViewTracker({ postId, slug }: ViewTrackerProps) {
  useEffect(() => {
    if (!postId || !slug) return;

    const cookieName = `${COOKIE_PREFIX}${slug}`;

    // Already seen in this session window — do nothing
    if (getCookie(cookieName)) return;

    // Mark as seen before the request so fast double-renders don't fire twice
    setCookie(cookieName, "1", COOKIE_TTL_DAYS);

    fetch("/api/blog/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    }).catch(() => {
      // Fire-and-forget: never block the user
    });
  }, [postId, slug]);

  // Renders nothing — purely a side-effect component
  return null;
}
