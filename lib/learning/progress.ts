import "server-only";
import { Temporal } from "temporal-polyfill/full";
import { db } from "@/prisma/db";
import { sanityFetch } from "@/sanity/lib/fetch";
import { lessonProgressContextQuery } from "@/lib/learning-queries/player";
import { flattenCurriculum, isLessonUnlocked, type CurriculumModule } from "./curriculum";
import { PROJECT_KEY, type PassedGates, type ProgressUpdate } from "./results";
import type { CheckOutcome, TaskOutcome } from "./grading";

// ---------------------------------------------------------------------------
// Learner progress (Prisma). Every write sets `updatedAt` explicitly because
// the contract uses `@default(now())` rather than an auto-updating column.
//
// Completion rules:
//  - A section with no *required* task or check completes when the learner reads
//    to its end (`recordSectionComplete`).
//  - A section with a required task and/or check completes only when every
//    required one has been passed (`recordTaskAttempt` / `recordCheckAttempt`).
//  - A lesson completes when all sections do, plus its project if that is required.
// ---------------------------------------------------------------------------

export type CourseProgress = {
  /** Sanity IDs of lessons the learner has completed. */
  completedLessonIds: Set<string>;
  progressPercent: number;
  /** True when the database could not be reached — callers should degrade, not crash. */
  offline: boolean;
};

const EMPTY_PROGRESS: CourseProgress = { completedLessonIds: new Set(), progressPercent: 0, offline: false };

export async function getCourseProgress(userId: string | null, courseId: string): Promise<CourseProgress> {
  if (!userId) return EMPTY_PROGRESS;
  try {
    const enrollment = await db.orm.public.Enrollment.where({
      clerkUserId: userId,
      sanityCourseId: courseId,
    }).first();
    if (!enrollment) return EMPTY_PROGRESS;

    const rows = await db.orm.public.LessonProgress.where({ enrollmentId: enrollment.id }).all();
    return {
      completedLessonIds: new Set(rows.filter((r) => r.status === "COMPLETED").map((r) => r.sanityLessonId)),
      progressPercent: enrollment.progressPercent,
      offline: false,
    };
  } catch (error) {
    console.warn("getCourseProgress failed:", error);
    return { ...EMPTY_PROGRESS, completedLessonIds: new Set(), offline: true };
  }
}

/** Section keys the learner has finished in one lesson, plus which tasks/checks they have passed. */
export async function getLessonState(
  userId: string | null,
  courseId: string,
  lessonId: string
): Promise<{ completedSectionKeys: string[]; gates: PassedGates }> {
  const empty = { completedSectionKeys: [], gates: { tasks: [], checks: [], projectPassed: false } };
  if (!userId) return empty;
  try {
    const enrollment = await db.orm.public.Enrollment.where({
      clerkUserId: userId,
      sanityCourseId: courseId,
    }).first();
    if (!enrollment) return empty;

    const progress = await db.orm.public.LessonProgress.where({
      enrollmentId: enrollment.id,
      sanityLessonId: lessonId,
    }).first();
    if (!progress) return empty;

    const [sections, gates] = await Promise.all([
      db.orm.public.SectionProgress.where({ lessonProgressId: progress.id }).all(),
      passedGates(progress.id),
    ]);
    return {
      completedSectionKeys: sections.filter((s) => s.status === "COMPLETED").map((s) => s.sanitySectionKey),
      gates,
    };
  } catch (error) {
    console.warn("getLessonState failed:", error);
    return empty;
  }
}

async function passedGates(lessonProgressId: string): Promise<PassedGates> {
  const [tasks, checks] = await Promise.all([
    db.orm.public.TaskAttempt.where({ lessonProgressId }).all(),
    db.orm.public.AssessmentAttempt.where({ lessonProgressId }).all(),
  ]);
  const taskKeys = new Set(tasks.filter((t) => t.passed && t.sanitySectionKey).map((t) => t.sanitySectionKey as string));
  const checkKeys = new Set(checks.filter((c) => c.passed && c.sanitySectionKey).map((c) => c.sanitySectionKey as string));
  return {
    tasks: [...taskKeys].filter((k) => k !== PROJECT_KEY),
    checks: [...checkKeys],
    projectPassed: taskKeys.has(PROJECT_KEY),
  };
}

// ── Context shared by every write ─────────────────────────────────────────────

type LessonContext = {
  sectionKeys: string[];
  sections: { _key: string; needsTask: boolean; needsCheck: boolean }[];
  projectRequired: boolean;
  /** A course with a final assessment is not complete when its lessons are. */
  hasFinalAssessment: boolean;
  courseId: string;
  modules: CurriculumModule[];
};

async function loadContext(lessonId: string): Promise<LessonContext | null> {
  // Fresh read: gating rules must match what the author last published.
  const context = await sanityFetch<{
    sectionKeys?: string[] | null;
    sections?: { _key: string; needsTask?: boolean | null; needsCheck?: boolean | null }[] | null;
    projectRequired?: boolean | null;
    hasFinalAssessment?: boolean | null;
    course?: { _id: string; modules?: CurriculumModule[] } | null;
  } | null>({ query: lessonProgressContextQuery, params: { lessonId }, revalidate: 0 });

  if (!context?.course) return null;
  return {
    sectionKeys: context.sectionKeys ?? [],
    sections: (context.sections ?? []).map((s) => ({
      _key: s._key,
      needsTask: Boolean(s.needsTask),
      needsCheck: Boolean(s.needsCheck),
    })),
    projectRequired: Boolean(context.projectRequired),
    hasFinalAssessment: Boolean(context.hasFinalAssessment),
    courseId: context.course._id,
    modules: context.course.modules ?? [],
  };
}

type Failure = { ok: false; reason: "unknown_lesson" | "unknown_section" | "locked" | "gated" | "unavailable" };

/** Find or create the learner's enrollment and lesson progress, refusing locked lessons. */
async function openLesson(userId: string, lessonId: string, context: LessonContext) {
  const flat = flattenCurriculum(context.modules);
  const index = flat.findIndex((l) => l._id === lessonId);

  let enrollment = await db.orm.public.Enrollment.where({
    clerkUserId: userId,
    sanityCourseId: context.courseId,
  }).first();
  if (!enrollment) {
    enrollment = await db.orm.public.Enrollment.create({
      clerkUserId: userId,
      sanityCourseId: context.courseId,
      status: "ACTIVE",
    });
  }

  // Strict ordering: every earlier lesson must be completed.
  if (index > 0) {
    const done = await db.orm.public.LessonProgress.where({ enrollmentId: enrollment.id }).all();
    const completed = new Set(done.filter((r) => r.status === "COMPLETED").map((r) => r.sanityLessonId));
    if (!isLessonUnlocked(flat, index, completed)) return { ok: false as const, reason: "locked" as const };
  }

  let lessonProgress = await db.orm.public.LessonProgress.where({
    enrollmentId: enrollment.id,
    sanityLessonId: lessonId,
  }).first();
  if (!lessonProgress) {
    lessonProgress = await db.orm.public.LessonProgress.create({
      enrollmentId: enrollment.id,
      sanityLessonId: lessonId,
      status: "IN_PROGRESS",
      contentStartedAt: Temporal.Now.instant(),
    });
  }
  return { ok: true as const, enrollment, lessonProgress, flat };
}

type Opened = Extract<Awaited<ReturnType<typeof openLesson>>, { ok: true }>;

async function markSectionDone(lessonProgressId: string, sectionKey: string) {
  const now = Temporal.Now.instant();
  const existing = await db.orm.public.SectionProgress.where({ lessonProgressId, sanitySectionKey: sectionKey }).first();
  if (!existing) {
    await db.orm.public.SectionProgress.create({
      lessonProgressId,
      sanitySectionKey: sectionKey,
      status: "COMPLETED",
      completedAt: now,
    });
  } else if (existing.status !== "COMPLETED") {
    await db.orm.public.SectionProgress.where({ id: existing.id }).update({
      status: "COMPLETED",
      completedAt: now,
      updatedAt: now,
    });
  }
}

/** Recompute lesson and course completion after a section or gate changes. */
async function finalize(opened: Opened, context: LessonContext, lessonId: string, lastSectionKey: string): Promise<ProgressUpdate> {
  const { enrollment, lessonProgress, flat } = opened;
  const now = Temporal.Now.instant();

  const sectionRows = await db.orm.public.SectionProgress.where({ lessonProgressId: lessonProgress.id }).all();
  const completedSectionKeys = sectionRows.filter((s) => s.status === "COMPLETED").map((s) => s.sanitySectionKey);
  const sectionsDone = context.sectionKeys.every((key) => completedSectionKeys.includes(key));
  const projectOk = !context.projectRequired || (await passedGates(lessonProgress.id)).projectPassed;
  const lessonCompleted = sectionsDone && projectOk;

  await db.orm.public.LessonProgress.where({ id: lessonProgress.id }).update(
    lessonCompleted
      ? {
          status: "COMPLETED",
          contentCompletedAt: lessonProgress.contentCompletedAt ?? now,
          completedAt: lessonProgress.completedAt ?? now,
          requiredTasksPassed: true,
          lastSectionKey,
          lastViewedAt: now,
          updatedAt: now,
        }
      : { lastSectionKey, lastViewedAt: now, updatedAt: now }
  );

  // Course percentage = completed lessons / lessons in the course (not just those started).
  const allProgress = await db.orm.public.LessonProgress.where({ enrollmentId: enrollment.id }).all();
  const courseLessonIds = new Set(flat.map((l) => l._id));
  const completedCount = allProgress.filter(
    (p) => p.sanityLessonId !== lessonId && p.status === "COMPLETED" && courseLessonIds.has(p.sanityLessonId)
  ).length + (lessonCompleted ? 1 : 0);
  const progressPercent = flat.length ? Math.min(100, Math.round((completedCount / flat.length) * 100)) : 0;

  // Every lesson done finishes the course, unless a final assessment still stands in the way.
  const courseCompleted = progressPercent === 100 && !context.hasFinalAssessment;
  await db.orm.public.Enrollment.where({ id: enrollment.id }).update({
    progressPercent,
    lastLessonId: lessonId,
    lastAccessedAt: now,
    updatedAt: now,
    ...(courseCompleted && enrollment.status !== "COMPLETED" ? { status: "COMPLETED" as const, completedAt: now } : {}),
  });

  return {
    sectionCompleted: completedSectionKeys.includes(lastSectionKey),
    completedSectionKeys,
    lessonCompleted,
    progressPercent,
  };
}

/** Complete a gated section once everything it requires has been passed. */
async function completeIfGatesPassed(opened: Opened, context: LessonContext, sectionKey: string) {
  const section = context.sections.find((s) => s._key === sectionKey);
  // Sections with nothing required complete by being read, not by an optional task.
  if (!section || (!section.needsTask && !section.needsCheck)) return;
  const gates = await passedGates(opened.lessonProgress.id);
  const taskOk = !section.needsTask || gates.tasks.includes(sectionKey);
  const checkOk = !section.needsCheck || gates.checks.includes(sectionKey);
  if (taskOk && checkOk) await markSectionDone(opened.lessonProgress.id, sectionKey);
}

// ── Public writes ─────────────────────────────────────────────────────────────

export type SectionCompletionResult = ({ ok: true } & ProgressUpdate) | Failure;

/**
 * The learner reached the end of a section. Sections that require a task or
 * check are refused here — those complete only by passing them.
 */
export async function recordSectionComplete(args: {
  userId: string;
  lessonId: string;
  sectionKey: string;
}): Promise<SectionCompletionResult> {
  const { userId, lessonId, sectionKey } = args;
  const context = await loadContext(lessonId);
  if (!context) return { ok: false, reason: "unknown_lesson" };
  const section = context.sections.find((s) => s._key === sectionKey);
  if (!section) return { ok: false, reason: "unknown_section" };

  try {
    const opened = await openLesson(userId, lessonId, context);
    if (!opened.ok) return opened;

    if (section.needsTask || section.needsCheck) {
      await completeIfGatesPassed(opened, context, sectionKey);
      const update = await finalize(opened, context, lessonId, sectionKey);
      return update.sectionCompleted ? { ok: true, ...update } : { ok: false, reason: "gated" };
    }

    await markSectionDone(opened.lessonProgress.id, sectionKey);
    return { ok: true, ...(await finalize(opened, context, lessonId, sectionKey)) };
  } catch (error) {
    console.warn("recordSectionComplete failed:", error);
    return { ok: false, reason: "unavailable" };
  }
}

type AttemptResult = ({ ok: true; attempt: number } & ProgressUpdate) | Failure;

/** Store a graded task attempt and, if it passed, advance the section or lesson. */
export async function recordTaskAttempt(args: {
  userId: string;
  lessonId: string;
  /** A section's `_key`, or PROJECT_KEY for the lesson project. */
  sectionKey: string;
  taskId: string;
  points: number;
  outcome: Extract<TaskOutcome, { kind: "graded" }>;
}): Promise<AttemptResult> {
  const { userId, lessonId, sectionKey, taskId, points, outcome } = args;
  const context = await loadContext(lessonId);
  if (!context) return { ok: false, reason: "unknown_lesson" };
  if (sectionKey !== PROJECT_KEY && !context.sectionKeys.includes(sectionKey)) return { ok: false, reason: "unknown_section" };

  try {
    const opened = await openLesson(userId, lessonId, context);
    if (!opened.ok) return opened;
    const { enrollment, lessonProgress } = opened;

    const previous = await db.orm.public.TaskAttempt.where({ lessonProgressId: lessonProgress.id }).all();
    const attempt = previous.filter((p) => p.sanitySectionKey === sectionKey && p.sanityTaskId === taskId).length + 1;

    await db.orm.public.TaskAttempt.create({
      enrollmentId: enrollment.id,
      lessonProgressId: lessonProgress.id,
      sanityTaskId: taskId,
      sanitySectionKey: sectionKey,
      attemptNumber: attempt,
      status: outcome.passed ? "PASSED" : "FAILED",
      gradedBy: outcome.gradedBy,
      submission: outcome.stored as never,
      rubricScores: (outcome.rubricScores ?? null) as never,
      score: outcome.score,
      maxScore: points,
      passed: outcome.passed,
      completedAt: Temporal.Now.instant(),
    });

    if (outcome.passed && sectionKey !== PROJECT_KEY) await completeIfGatesPassed(opened, context, sectionKey);
    const update = await finalize(opened, context, lessonId, sectionKey);
    return { ok: true, attempt, ...update };
  } catch (error) {
    console.warn("recordTaskAttempt failed:", error);
    return { ok: false, reason: "unavailable" };
  }
}

/** Store a graded knowledge-check attempt and, if it passed, advance the section. */
export async function recordCheckAttempt(args: {
  userId: string;
  lessonId: string;
  sectionKey: string;
  assessmentId: string;
  outcome: Extract<CheckOutcome, { kind: "graded" }>;
}): Promise<AttemptResult> {
  const { userId, lessonId, sectionKey, assessmentId, outcome } = args;
  const context = await loadContext(lessonId);
  if (!context) return { ok: false, reason: "unknown_lesson" };
  if (!context.sectionKeys.includes(sectionKey)) return { ok: false, reason: "unknown_section" };

  try {
    const opened = await openLesson(userId, lessonId, context);
    if (!opened.ok) return opened;
    const { enrollment, lessonProgress } = opened;

    const previous = await db.orm.public.AssessmentAttempt.where({ lessonProgressId: lessonProgress.id }).all();
    const attempt = previous.filter((p) => p.sanitySectionKey === sectionKey && p.sanityAssessmentId === assessmentId).length + 1;

    const created = await db.orm.public.AssessmentAttempt.create({
      enrollmentId: enrollment.id,
      lessonProgressId: lessonProgress.id,
      sanityAssessmentId: assessmentId,
      sanitySectionKey: sectionKey,
      attemptNumber: attempt,
      status: outcome.passed ? "PASSED" : "FAILED",
      score: outcome.score,
      passed: outcome.passed,
      completedAt: Temporal.Now.instant(),
    });

    for (const response of outcome.responses) {
      await db.orm.public.AssessmentResponse.create({
        assessmentAttemptId: created.id,
        sanityQuestionId: response.questionId,
        // Always an object: the JSON column mangles a bare string (e.g. a short answer).
        response: { value: response.response } as never,
        isCorrect: response.isCorrect,
        pointsAwarded: response.pointsAwarded,
      });
    }

    // Keep the lesson's best quiz score for reporting.
    if (outcome.score > (lessonProgress.bestAssessmentScore ?? 0)) {
      await db.orm.public.LessonProgress.where({ id: lessonProgress.id }).update({
        bestAssessmentScore: outcome.score,
        updatedAt: Temporal.Now.instant(),
      });
    }

    if (outcome.passed) await completeIfGatesPassed(opened, context, sectionKey);
    const update = await finalize(opened, context, lessonId, sectionKey);
    return { ok: true, attempt, ...update };
  } catch (error) {
    console.warn("recordCheckAttempt failed:", error);
    return { ok: false, reason: "unavailable" };
  }
}

// ── Time on lesson ────────────────────────────────────────────────────────────

const MAX_SECONDS_PER_REPORT = 60;
/** Reports closer together than this are ignored, so a script can't inflate the total. */
const MIN_SECONDS_BETWEEN_REPORTS = 15;

/**
 * Add active reading time to a lesson, and note it as the learner's latest lesson
 * (used for "Resume"). The browser reports how long the lesson was open and in
 * view; the server bounds what it accepts by the time since the last report.
 */
export async function recordLessonTime(args: {
  userId: string;
  lessonId: string;
  seconds: number;
}): Promise<{ ok: boolean }> {
  const { userId, lessonId } = args;
  if (!Number.isFinite(args.seconds) || args.seconds <= 0) return { ok: false };

  const context = await loadContext(lessonId);
  if (!context) return { ok: false };

  try {
    const opened = await openLesson(userId, lessonId, context);
    if (!opened.ok) return { ok: false };
    const { enrollment, lessonProgress } = opened;

    const now = Temporal.Now.instant();
    let seconds = Math.min(Math.floor(args.seconds), MAX_SECONDS_PER_REPORT);
    if (lessonProgress.lastViewedAt) {
      const sinceLast = Math.floor((now.epochMilliseconds - lessonProgress.lastViewedAt.epochMilliseconds) / 1000);
      if (sinceLast < MIN_SECONDS_BETWEEN_REPORTS) return { ok: false };
      seconds = Math.min(seconds, sinceLast + 5);
    }

    await db.orm.public.LessonProgress.where({ id: lessonProgress.id }).update({
      timeSpentSeconds: lessonProgress.timeSpentSeconds + seconds,
      lastViewedAt: now,
      updatedAt: now,
    });
    await db.orm.public.Enrollment.where({ id: enrollment.id }).update({
      lastLessonId: lessonId,
      lastAccessedAt: now,
      updatedAt: now,
    });
    return { ok: true };
  } catch (error) {
    console.warn("recordLessonTime failed:", error);
    return { ok: false };
  }
}
