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
  projectPassed: boolean;
};

export const PROJECT_KEY = "__project";
