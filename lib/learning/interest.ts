import "server-only";
import { Temporal } from "temporal-polyfill/full";
import { db } from "@/prisma/db";
import { sanityFetch } from "@/sanity/lib/fetch";

// ---------------------------------------------------------------------------
// "Notify me" for a course that is not live yet. A learner registers interest
// once; the WhatsApp group link comes from the CMS and is only handed out here
// on the server, after validating that it really is a WhatsApp address.
// ---------------------------------------------------------------------------

/** Only WhatsApp over https is ever shown as a join link, whatever the CMS holds. */
export function safeWhatsappUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname;
    const ok = host === "wa.me" || host === "whatsapp.com" || host.endsWith(".whatsapp.com");
    return url.protocol === "https:" && ok ? url.toString() : null;
  } catch {
    return null;
  }
}

type InterestCourse = { _id: string; whatsappGroupUrl?: string | null } | null;

const loadCourse = (courseId: string) =>
  sanityFetch<InterestCourse>({
    query: `*[_type == "course" && _id == $courseId][0]{ _id, whatsappGroupUrl }`,
    params: { courseId },
    revalidate: 60,
  });

export type InterestState = { registered: boolean; whatsappUrl: string | null };

export async function getInterestState(userId: string, courseId: string): Promise<InterestState> {
  try {
    const [row, course] = await Promise.all([
      db.orm.public.CourseInterest.where({ clerkUserId: userId, sanityCourseId: courseId }).first(),
      loadCourse(courseId),
    ]);
    return { registered: Boolean(row), whatsappUrl: row ? safeWhatsappUrl(course?.whatsappGroupUrl) : null };
  } catch (error) {
    console.warn("getInterestState failed:", error);
    return { registered: false, whatsappUrl: null };
  }
}

/** Idempotent: registering twice is the same as once. */
export async function registerInterest(
  userId: string,
  courseId: string,
  email: string | null,
): Promise<{ ok: true; whatsappUrl: string | null } | { ok: false }> {
  try {
    const course = await loadCourse(courseId);
    if (!course) return { ok: false };

    const existing = await db.orm.public.CourseInterest.where({ clerkUserId: userId, sanityCourseId: courseId }).first();
    if (!existing) {
      try {
        await db.orm.public.CourseInterest.create({ clerkUserId: userId, sanityCourseId: courseId, email });
      } catch (error) {
        // A double tap raced us to the unique constraint: that still counts as registered.
        const again = await db.orm.public.CourseInterest.where({ clerkUserId: userId, sanityCourseId: courseId }).first();
        if (!again) throw error;
      }
    }
    return { ok: true, whatsappUrl: safeWhatsappUrl(course.whatsappGroupUrl) };
  } catch (error) {
    console.warn("registerInterest failed:", error);
    return { ok: false };
  }
}

export async function recordWhatsappClick(userId: string, courseId: string): Promise<void> {
  try {
    const row = await db.orm.public.CourseInterest.where({ clerkUserId: userId, sanityCourseId: courseId }).first();
    if (row && !row.whatsappClickedAt) {
      await db.orm.public.CourseInterest.where({ id: row.id }).update({ whatsappClickedAt: Temporal.Now.instant() });
    }
  } catch (error) {
    console.warn("recordWhatsappClick failed:", error);
  }
}
