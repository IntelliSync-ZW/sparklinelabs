import "server-only";
import { Temporal } from "temporal-polyfill/full";
import { db } from "@/prisma/db";
import { sanityFetch } from "@/sanity/lib/fetch";
import { courseScoringQuery, lessonProgressContextQuery } from "@/lib/learning-queries/player";
import { flattenCurriculum, isLessonUnlocked, type CurriculumModule } from "./curriculum";
import { END_KEY, isScoredTaskType, type PassedGates, type ProgressUpdate } from "./results";
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
//  - A lesson completes when all sections do AND its end-of-lesson assessment is
//    passed. The assessment opens only once every section is complete.
//  - The certificate score uses the learner's best attempt at every scored item:
//    end-of-lesson assessments, plus section tasks/checks that are required and
//    marked scored (`updateCourseScore`).
// ---------------------------------------------------------------------------

export type CourseProgress = {
  /** Sanity IDs of lessons the learner has completed. */
  completedLessonIds: Set<string>;
  progressPercent: number;
  /** Certificate score (0-100) from scored work so far, or null before anything scored. */
  finalScore: number | null;
  /** True when the database could not be reached - callers should degrade, not crash. */
  offline: boolean;
};

const EMPTY_PROGRESS: CourseProgress = { completedLessonIds: new Set(), progressPercent: 0, finalScore: null, offline: false };

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
      finalScore: enrollment.finalScore ?? null,
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
  const empty = { completedSectionKeys: [], gates: { tasks: [], checks: [], endPassed: false } };
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
    tasks: [...taskKeys],
    checks: [...checkKeys].filter((k) => k !== END_KEY),
    endPassed: checkKeys.has(END_KEY),
  };
}

// ── Context shared by every write ─────────────────────────────────────────────

type LessonContext = {
  sectionKeys: string[];
  sections: { _key: string; needsTask: boolean; needsCheck: boolean }[];
  /** The lesson has an end-of-lesson assessment that must be passed. */
  hasEndAssessment: boolean;
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
    hasEndAssessment?: boolean | null;
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
    hasEndAssessment: Boolean(context.hasEndAssessment),
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
  const endOk = !context.hasEndAssessment || (await passedGates(lessonProgress.id)).endPassed;
  const lessonCompleted = sectionsDone && endOk;

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
 * check are refused here - those complete only by passing them.
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
  /** The section the task belongs to. */
  sectionKey: string;
  taskId: string;
  points: number;
  outcome: Extract<TaskOutcome, { kind: "graded" }>;
}): Promise<AttemptResult> {
  const { userId, lessonId, sectionKey, taskId, points, outcome } = args;
  const context = await loadContext(lessonId);
  if (!context) return { ok: false, reason: "unknown_lesson" };
  if (!context.sectionKeys.includes(sectionKey)) return { ok: false, reason: "unknown_section" };

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

    if (outcome.passed) await completeIfGatesPassed(opened, context, sectionKey);
    const update = await finalize(opened, context, lessonId, sectionKey);
    await updateCourseScore(enrollment.id, context.courseId);
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
  const isEnd = sectionKey === END_KEY;
  if (!isEnd && !context.sectionKeys.includes(sectionKey)) return { ok: false, reason: "unknown_section" };

  try {
    const opened = await openLesson(userId, lessonId, context);
    if (!opened.ok) return opened;
    const { enrollment, lessonProgress } = opened;

    // The end-of-lesson assessment opens only once every section is complete.
    if (isEnd) {
      const rows = await db.orm.public.SectionProgress.where({ lessonProgressId: lessonProgress.id }).all();
      const done = new Set(rows.filter((r) => r.status === "COMPLETED").map((r) => r.sanitySectionKey));
      if (!context.sectionKeys.every((key) => done.has(key))) return { ok: false, reason: "gated" };
    }

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

    if (outcome.passed && !isEnd) await completeIfGatesPassed(opened, context, sectionKey);
    const update = await finalize(opened, context, lessonId, sectionKey);
    await updateCourseScore(enrollment.id, context.courseId);
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

// ── Certificate score ─────────────────────────────────────────────────────────

type ScoringStructure = {
  minimumScore?: number | null;
  lessons?: {
    _id: string;
    sections?: {
      _key: string;
      task?: { points?: number | null; taskType?: string | null } | null;
      check?: { points?: (number | null)[] | null } | null;
    }[] | null;
    end?: { items?: { _key: string; _type: string; points?: number | null; taskType?: string | null }[] | null } | null;
  }[] | null;
} | null;

/**
 * Points earned over points available across every scored item in the course,
 * using the learner's best attempt at each. Items not yet attempted count as 0,
 * so the score only reaches the pass mark through real work. Returns null when
 * the course has nothing scored.
 */
export function computeCourseScore(
  structure: ScoringStructure,
  attempts: {
    lessonIdByProgressId: Map<string, string>;
    tasks: { lessonProgressId: string; sanitySectionKey: string | null; score: number | null }[];
    checks: { lessonProgressId: string; sanitySectionKey: string | null; score: number | null }[];
  }
): number | null {
  // Best percentage per (lesson, section key) for tasks and for checks.
  const best = (rows: typeof attempts.tasks) => {
    const map = new Map<string, number>();
    for (const row of rows) {
      const lessonId = attempts.lessonIdByProgressId.get(row.lessonProgressId);
      if (!lessonId || !row.sanitySectionKey) continue;
      const key = `${lessonId}:${row.sanitySectionKey}`;
      map.set(key, Math.max(map.get(key) ?? 0, row.score ?? 0));
    }
    return map;
  };
  const bestTask = best(attempts.tasks);
  const bestCheck = best(attempts.checks);

  let earned = 0;
  let total = 0;
  const add = (points: number, percent: number) => {
    total += points;
    earned += (points * percent) / 100;
  };

  for (const lesson of structure?.lessons ?? []) {
    for (const section of lesson.sections ?? []) {
      if (section.task && isScoredTaskType(section.task.taskType)) {
        add(section.task.points ?? 10, bestTask.get(`${lesson._id}:${section._key}`) ?? 0);
      }
      if (section.check) {
        const points = (section.check.points ?? []).reduce<number>((sum, p) => sum + (p ?? 1), 0);
        if (points > 0) add(points, bestCheck.get(`${lesson._id}:${section._key}`) ?? 0);
      }
    }
    const endItems = lesson.end?.items ?? [];
    const endPoints = endItems.reduce<number>((sum, item) => {
      if (item._type === "assessmentQuestionRef") return sum + (item.points ?? 1);
      return isScoredTaskType(item.taskType) ? sum + (item.points ?? 10) : sum;
    }, 0);
    if (endPoints > 0) add(endPoints, bestCheck.get(`${lesson._id}:${END_KEY}`) ?? 0);
  }

  return total > 0 ? Math.round((earned / total) * 100) : null;
}

/** Recalculate and store the learner's certificate score after a graded attempt. */
async function updateCourseScore(enrollmentId: string, courseId: string) {
  try {
    const [structure, progressRows, tasks, checks] = await Promise.all([
      sanityFetch<ScoringStructure>({ query: courseScoringQuery, params: { courseId }, revalidate: 60 }),
      db.orm.public.LessonProgress.where({ enrollmentId }).all(),
      db.orm.public.TaskAttempt.where({ enrollmentId }).all(),
      db.orm.public.AssessmentAttempt.where({ enrollmentId }).all(),
    ]);
    const finalScore = computeCourseScore(structure, {
      lessonIdByProgressId: new Map(progressRows.map((p) => [p.id, p.sanityLessonId])),
      tasks,
      checks: checks.map((c) => ({ ...c, lessonProgressId: c.lessonProgressId ?? "" })),
    });
    await db.orm.public.Enrollment.where({ id: enrollmentId }).update({
      finalScore,
      updatedAt: Temporal.Now.instant(),
    });
  } catch (error) {
    // The score is recomputed on the next attempt; don't fail the learner's submission over it.
    console.warn("updateCourseScore failed:", error);
  }
}
