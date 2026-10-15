"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Old links pointed at `/module#lesson-slug` when every lesson lived on one page.
 * Send those visitors to the lesson's own page.
 */
export function LessonHashRedirect({ lessons }: { lessons: { slug: string; href: string }[] }) {
  const router = useRouter();

  useEffect(() => {
    const slug = window.location.hash.replace(/^#/, "");
    const match = slug ? lessons.find((l) => l.slug === slug) : undefined;
    if (match) router.replace(match.href);
  }, [lessons, router]);

  return null;
}
