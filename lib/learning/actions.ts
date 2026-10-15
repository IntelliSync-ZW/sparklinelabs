"use server";

import { auth } from "@clerk/nextjs/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { lessonAnswerKeysQuery } from "@/lib/learning-queries/player";
import { gradeCheck, gradeTask, type CheckKey, type TaskKey } from "./grading";
import {
  recordCheckAttempt,
  recordLessonTime,
  recordSectionComplete,
  recordTaskAttempt,
  type SectionCompletionResult,
} from "./progress";
import { PROJECT_KEY, type GradeResult } from "./results";
import type { PortableTextValue } from "@/components/learn/blocks/types";

/**
 * Called by the lesson page when a learner finishes reading a section. The user
 * comes from the session, never from the client, and the server re-validates the
 * lesson, section and lesson order against the CMS.
 */
export async function completeSectionAction(input: {
  lessonId: string;
  sectionKey: string;
}): Promise<SectionCompletionResult | { ok: false; reason: "unauthenticated" }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  if (!input?.lessonId || !input?.sectionKey) return { ok: false, reason: "unknown_section" };
  return recordSectionComplete({ userId, lessonId: input.lessonId, sectionKey: input.sectionKey });
}

/** Active reading time reported by the lesson page (a heartbeat while the lesson is open and in view). */
export async function reportLessonTimeAction(input: { lessonId: string; seconds: number }): Promise<void> {
  const { userId } = await auth();
  if (!userId || !input?.lessonId) return;
  await recordLessonTime({ userId, lessonId: input.lessonId, seconds: Number(input.seconds) });
}

// ── Answer keys ───────────────────────────────────────────────────────────────

type KeyedTask = { required?: boolean; taskId?: string | null; task?: (TaskKey & { modelAnswer?: PortableTextValue | null }) | null };
type KeyedCheck = { required?: boolean; assessmentId?: string | null } & CheckKey;
type AnswerKeys = {
  sections?: { _key: string; practice?: KeyedTask | null; check?: KeyedCheck | null }[] | null;
  project?: KeyedTask | null;
} | null;

// Never cached: answers must match what the author last published.
const loadKeys = (lessonId: string) =>
  sanityFetch<AnswerKeys>({ query: lessonAnswerKeysQuery, params: { lessonId }, revalidate: 0 });

const failure = (reason: Extract<GradeResult, { ok: false }>["reason"], message?: string): GradeResult => ({ ok: false, reason, message });

function failureFrom(reason: string): GradeResult {
  if (reason === "locked") return failure("locked", "Finish the previous lesson first.");
  if (reason === "unavailable") return failure("unavailable", "We couldn't save that just now. Please try again.");
  return failure("unknown");
}

/** Grade a task attempt on the server. `sectionKey` is a section's key, or PROJECT_KEY for the lesson project. */
export async function submitTaskAction(input: {
  lessonId: string;
  sectionKey: string;
  submission: unknown;
}): Promise<GradeResult> {
  const { userId } = await auth();
  if (!userId) return failure("unauthenticated", "Sign in to submit your work.");
  if (!input?.lessonId || !input?.sectionKey) return failure("unknown");

  const keys = await loadKeys(input.lessonId);
  if (!keys) return failure("unknown");
  const slot =
    input.sectionKey === PROJECT_KEY ? keys.project : keys.sections?.find((s) => s._key === input.sectionKey)?.practice;
  const task = slot?.task;
  if (!slot || !task) return failure("unknown");

  const outcome = gradeTask(task, input.submission);
  if (outcome.kind === "invalid") return failure("invalid", outcome.message);

  // Library tasks use their document ID; inline tasks get a stable synthetic one.
  const taskId = slot.taskId ?? `${input.lessonId}:${input.sectionKey}:practice`;
  const saved = await recordTaskAttempt({
    userId,
    lessonId: input.lessonId,
    sectionKey: input.sectionKey,
    taskId,
    points: task.points ?? 10,
    outcome,
  });
  if (!saved.ok) return failureFrom(saved.reason);

  return {
    ok: true,
    passed: outcome.passed,
    score: outcome.score,
    attempt: saved.attempt,
    feedback: outcome.feedback,
    message: outcome.message,
    // The model answer is a reward for passing, not a way to skip the work.
    modelAnswer: outcome.passed ? (task.modelAnswer ?? null) : null,
    sectionCompleted: saved.sectionCompleted,
    completedSectionKeys: saved.completedSectionKeys,
    lessonCompleted: saved.lessonCompleted,
    progressPercent: saved.progressPercent,
  };
}

/** Grade a section's knowledge check on the server. */
export async function submitCheckAction(input: {
  lessonId: string;
  sectionKey: string;
  answers: unknown;
}): Promise<GradeResult> {
  const { userId } = await auth();
  if (!userId) return failure("unauthenticated", "Sign in to submit your answers.");
  if (!input?.lessonId || !input?.sectionKey) return failure("unknown");

  const keys = await loadKeys(input.lessonId);
  const check = keys?.sections?.find((s) => s._key === input.sectionKey)?.check;
  if (!check) return failure("unknown");

  const outcome = gradeCheck(check, input.answers);
  if (outcome.kind === "invalid") return failure("invalid", outcome.message);

  const saved = await recordCheckAttempt({
    userId,
    lessonId: input.lessonId,
    sectionKey: input.sectionKey,
    assessmentId: check.assessmentId ?? `${input.lessonId}:${input.sectionKey}:check`,
    outcome,
  });
  if (!saved.ok) return failureFrom(saved.reason);

  return {
    ok: true,
    passed: outcome.passed,
    score: outcome.score,
    attempt: saved.attempt,
    feedback: outcome.feedback,
    message: outcome.message,
    sectionCompleted: saved.sectionCompleted,
    completedSectionKeys: saved.completedSectionKeys,
    lessonCompleted: saved.lessonCompleted,
    progressPercent: saved.progressPercent,
  };
}
