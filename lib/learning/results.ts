// ---------------------------------------------------------------------------
// Types shared by the grading server actions and the lesson UI. No server-only
// imports here, so client components can use them.
// ---------------------------------------------------------------------------

import type { PortableTextValue } from "@/components/learn/blocks/types";

/** What a learner submits for a task. The shape depends on the task type. */
export type TaskSubmission =
  | { type: "classification"; answers: Record<string, string> }
  | { type: "multiple_choice"; choices: string[] }
  | { type: "matching"; rows: { keyId: string; option: string }[] }
  | { type: "ordering"; order: string[] }
  | { type: "source_verification"; verdicts: Record<string, string> }
  | { type: "response"; response: string; rubric: Record<string, boolean> }
  | { type: "checklist"; checked: boolean[] };

export type MatchRows = { keyId: string; option: string }[];

/** Answers to a knowledge check, keyed by the question's `_key`. */
export type CheckAnswers = Record<string, string | string[] | MatchRows>;

/** Answers to an end-of-lesson assessment, keyed by item `_key`: a question answer or a task submission. */
export type EndAnswers = Record<string, CheckAnswers[string] | TaskSubmission>;

/**
 * Task types the server marks against an answer key. Only these can be scored;
 * written, prompt-practice and checklist tasks are self-checked.
 */
export const AUTO_GRADED_TASK_TYPES = ["classification", "multiple_choice", "matching", "ordering", "source_verification"];

export const isScoredTaskType = (taskType?: string | null) => AUTO_GRADED_TASK_TYPES.includes(taskType ?? "");

/** Per-item verdict. `expected` and `explanation` are only sent once the learner has passed. */
export type ItemFeedback = {
  id: string;
  correct: boolean;
  expected?: string;
  explanation?: string;
  /** Matching questions inside a quiz report each row too. */
  rows?: ItemFeedback[];
};

export type ProgressUpdate = {
  sectionCompleted: boolean;
  completedSectionKeys: string[];
  lessonCompleted: boolean;
  progressPercent: number;
};

export type GradeResult =
  | ({
      ok: true;
      passed: boolean;
      /** 0-100 */
      score: number;
      attempt: number;
      feedback: ItemFeedback[];
      message?: string;
      /** Shown after a pass. */
      modelAnswer?: PortableTextValue | null;
    } & ProgressUpdate)
  | {
      ok: false;
      reason: "unauthenticated" | "invalid" | "locked" | "unknown" | "unavailable";
      message?: string;
    };

/** Which gates the learner has already passed, so reloads show them as done. */
export type PassedGates = {
  /** Section keys whose practice task is passed. */
  tasks: string[];
  /** Section keys whose knowledge check is passed. */
  checks: string[];
  /** The end-of-lesson assessment has been passed. */
  endPassed: boolean;
};

/** Stands in for a section key on attempts at the end-of-lesson assessment. */
export const END_KEY = "__lesson_end";

/** The section key of a lesson's optional introduction, which is a field rather than an array item. */
export const INTRO_KEY = "__intro";
