import "server-only";
import { randomInt } from "node:crypto";
import { Temporal } from "temporal-polyfill/full";
import { db } from "@/prisma/db";
import { sanityFetch } from "@/sanity/lib/fetch";
import { certificateCourseQuery } from "@/lib/learning-queries/player";
import { flattenCurriculum, type CurriculumModule } from "./curriculum";
import { getCourseProgress } from "./progress";

// ---------------------------------------------------------------------------
// Course certificates. A learner qualifies when the course offers a
// certificate, every lesson is complete, and their certificate score (see
// `computeCourseScore`) meets the course minimum. Payment is not enforced yet:
// certificates are issued straight away and recorded with the course price and
// a PENDING payment status, so payment gating can be added without a migration.
// ---------------------------------------------------------------------------

type CertificateCourse = {
  _id: string;
  title: string;
  slug: string;
  status?: string | null;
  certificate?: { enabled?: boolean | null; priceUsd?: number | null; certificateTitle?: string | null } | null;
  minimumScore?: number | null;
  modules?: CurriculumModule[] | null;
} | null;

export type IssuedCertificate = {
  number: string;
  recipientName: string;
  courseTitle: string;
  completionDate: string;
  issuedAt: string | null;
};

export type CertificateStatus =
  | { state: "not_offered" }
  | { state: "signed_out" }
  | { state: "in_progress"; lessonsDone: number; lessonsTotal: number; score: number | null; minimum: number }
  | { state: "score_too_low"; score: number; minimum: number }
  | { state: "eligible"; score: number | null; minimum: number }
  | { state: "issued"; certificate: IssuedCertificate };

const DEFAULT_MINIMUM = 80;

const loadCourse = (courseId: string) =>
  sanityFetch<CertificateCourse>({ query: certificateCourseQuery, params: { courseId }, revalidate: 60 });

function toIssued(row: {
  certificateNumber: string;
  recipientName: string;
  courseTitle: string;
  completionDate: Temporal.Instant;
  issuedAt: Temporal.Instant | null;
}): IssuedCertificate {
  return {
    number: row.certificateNumber,
    recipientName: row.recipientName,
    courseTitle: row.courseTitle,
    completionDate: row.completionDate.toString(),
    issuedAt: row.issuedAt?.toString() ?? null,
  };
}

/** Where a learner stands on the certificate for one course. */
export async function getCertificateStatus(userId: string | null, courseId: string): Promise<CertificateStatus> {
  const course = await loadCourse(courseId);
  if (!course?.certificate?.enabled) return { state: "not_offered" };
  if (!userId) return { state: "signed_out" };

  const enrollment = await db.orm.public.Enrollment.where({ clerkUserId: userId, sanityCourseId: courseId }).first();
  if (enrollment) {
    const existing = await db.orm.public.Certificate.where({ enrollmentId: enrollment.id }).first();
    if (existing) return { state: "issued", certificate: toIssued(existing) };
  }

  const progress = await getCourseProgress(userId, courseId);
  const flat = flattenCurriculum(course.modules);
  const lessonsDone = flat.filter((l) => progress.completedLessonIds.has(l._id)).length;
  const minimum = course.minimumScore ?? DEFAULT_MINIMUM;
  const score = progress.finalScore;

  if (flat.length === 0 || lessonsDone < flat.length) {
    return { state: "in_progress", lessonsDone, lessonsTotal: flat.length, score, minimum };
  }
  // A course with nothing scored is passed by completing it.
  if (score !== null && score < minimum) return { state: "score_too_low", score, minimum };
  return { state: "eligible", score, minimum };
}

// Unambiguous characters only: no 0/O, 1/I/L, so numbers can be read out and typed back.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function newCertificateNumber() {
  const group = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `SL-${group()}-${group()}-${group()}`;
}

/** Tidy what someone typed into the canonical SL-XXXX-XXXX-XXXX form. */
export function normalizeCertificateNumber(input: string): string | null {
  const compact = input.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^SL/, "");
  if (compact.length !== 12 || [...compact].some((ch) => !ALPHABET.includes(ch))) return null;
  return `SL-${compact.slice(0, 4)}-${compact.slice(4, 8)}-${compact.slice(8, 12)}`;
}

/** Names print on the certificate: letters, spaces and common name punctuation only. */
export function cleanRecipientName(input: string): string | null {
  const name = input.normalize("NFC").replace(/\s+/g, " ").trim();
  if (name.length < 2 || name.length > 80) return null;
  if (!/^[\p{L}\p{M}][\p{L}\p{M}' .,-]*$/u.test(name)) return null;
  return name;
}

export type IssueResult =
  | { ok: true; certificate: IssuedCertificate }
  | { ok: false; reason: "not_eligible" | "invalid_name" | "unavailable"; message: string };

/**
 * Issue the learner's certificate. Re-checks eligibility on the server, and is
 * idempotent: a learner who already has one gets it back unchanged.
 */
export async function issueCertificate(args: { userId: string; courseId: string; recipientName: string }): Promise<IssueResult> {
  const name = cleanRecipientName(args.recipientName);
  if (!name) {
    return { ok: false, reason: "invalid_name", message: "Enter your name as it should appear (2 to 80 letters)." };
  }

  try {
    const status = await getCertificateStatus(args.userId, args.courseId);
    if (status.state === "issued") return { ok: true, certificate: status.certificate };
    if (status.state !== "eligible") {
      return { ok: false, reason: "not_eligible", message: "Finish every lesson with a qualifying score first." };
    }

    const course = await loadCourse(args.courseId);
    const enrollment = await db.orm.public.Enrollment.where({
      clerkUserId: args.userId,
      sanityCourseId: args.courseId,
    }).first();
    if (!course || !enrollment) return { ok: false, reason: "not_eligible", message: "Finish the course first." };

    const now = Temporal.Now.instant();
    // A collision across 31^12 numbers is astronomically unlikely; retry anyway.
    for (let attempt = 0; attempt < 5; attempt++) {
      const number = newCertificateNumber();
      if (await db.orm.public.Certificate.where({ certificateNumber: number }).first()) continue;
      const created = await db.orm.public.Certificate.create({
        enrollmentId: enrollment.id,
        clerkUserId: args.userId,
        certificateNumber: number,
        recipientName: name,
        courseTitle: course.title,
        completionDate: enrollment.completedAt ?? now,
        certificatePrice: Math.round((course.certificate?.priceUsd ?? 0) * 100),
        currency: "USD",
        issuedAt: now,
      });
      return { ok: true, certificate: toIssued(created) };
    }
    return { ok: false, reason: "unavailable", message: "We couldn't issue the certificate just now. Please try again." };
  } catch (error) {
    // Two clicks at once: the unique enrollment constraint keeps one; return it.
    const status = await getCertificateStatus(args.userId, args.courseId).catch(() => null);
    if (status?.state === "issued") return { ok: true, certificate: status.certificate };
    console.warn("issueCertificate failed:", error);
    return { ok: false, reason: "unavailable", message: "We couldn't issue the certificate just now. Please try again." };
  }
}

export type PublicCertificate = IssuedCertificate & { certificateTitle: string; courseSlug: string | null };

/** Look up an issued certificate for the public verification page. */
export async function findCertificate(number: string): Promise<PublicCertificate | null> {
  const normalized = normalizeCertificateNumber(number);
  if (!normalized) return null;
  const row = await db.orm.public.Certificate.where({ certificateNumber: normalized }).first();
  if (!row?.issuedAt) return null;

  const enrollment = await db.orm.public.Enrollment.where({ id: row.enrollmentId }).first();
  const course = enrollment ? await loadCourse(enrollment.sanityCourseId) : null;
  return {
    ...toIssued(row),
    certificateTitle: course?.certificate?.certificateTitle || "Certificate of Completion",
    courseSlug: course?.slug ?? null,
  };
}
