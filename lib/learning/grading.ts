import "server-only";
import { gradeMatching } from "./prepare";
import { isScoredTaskType, type CheckAnswers, type ItemFeedback, type MatchRows, type TaskSubmission } from "./results";

// ---------------------------------------------------------------------------
// Server-side grading against answer keys loaded from the CMS. Nothing here
// runs in the browser. On a miss we say which items were wrong but hold back the
// right answers and explanations until the learner passes, so the answer key
// can't be read off by retrying.
// ---------------------------------------------------------------------------

const DEFAULT_PASSING_SCORE = 80;
const MAX_RESPONSE_CHARS = 20_000;

const norm = (value?: string | null) => (value ?? "").trim().toLowerCase();
const percent = (earned: number, total: number) => (total > 0 ? Math.round((earned / total) * 100) : 0);

// ── Task answer keys (shape of `lessonAnswerKeysQuery`) ──────────────────────

export type TaskKey = {
  taskType?: string | null;
  points?: number | null;
  passingScore?: number | null;
  classificationRows?: { _key: string; correctAnswer?: string; explanation?: string }[] | null;
  choices?: { _key: string; isCorrect?: boolean; explanation?: string }[] | null;
  orderingItems?: string[] | null;
  matchPairs?: { _key: string; option: string; explanation?: string }[] | null;
  claims?: { _key: string; verdict?: string; explanation?: string; sourceUrl?: string }[] | null;
  rubric?: { _key: string; criterion?: string }[] | null;
  checklistItems?: string[] | null;
  wordRange?: { min?: number | null; max?: number | null } | null;
};

export type TaskOutcome =
  | {
      kind: "graded";
      score: number;
      passed: boolean;
      feedback: ItemFeedback[];
      message?: string;
      /** Self-graded work records which rubric criteria the learner ticked. */
      rubricScores?: Record<string, boolean>;
      /** What gets stored with the attempt. */
      stored: unknown;
      gradedBy: "AUTO" | "SELF";
    }
  | { kind: "invalid"; message: string };

const invalid = (message: string): TaskOutcome => ({ kind: "invalid", message });

function autoOutcome(
  key: TaskKey,
  score: number,
  feedback: ItemFeedback[],
  stored: unknown,
  revealOnPass: (passed: boolean) => ItemFeedback[]
): TaskOutcome {
  const passed = score >= (key.passingScore ?? DEFAULT_PASSING_SCORE);
  return {
    kind: "graded",
    score,
    passed,
    feedback: passed ? revealOnPass(true) : feedback,
    message: passed ? undefined : "Not quite. The rows marked wrong need another look.",
    stored,
    gradedBy: "AUTO",
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function gradeTask(key: TaskKey, submission: unknown): TaskOutcome {
  if (!isRecord(submission) || typeof submission.type !== "string") return invalid("Missing answer.");
  const sub = submission as TaskSubmission;

  // The submission must match the task, so a quiz-shaped answer can't be sent to a classification task.
  const expectedType = key.taskType === "written" || key.taskType === "prompt_practice" ? "response" : key.taskType;
  if (sub.type !== expectedType) return invalid("That answer doesn't match this task.");

  switch (sub.type) {
    case "classification": {
      const rows = key.classificationRows ?? [];
      if (!isRecord(sub.answers)) return invalid("Answer every row first.");
      const bare = rows.map((r) => ({ id: r._key, correct: norm(sub.answers[r._key]) === norm(r.correctAnswer) }));
      if (rows.some((r) => !sub.answers[r._key])) return invalid("Answer every row first.");
      const score = percent(bare.filter((r) => r.correct).length, rows.length);
      return autoOutcome(
        key,
        score,
        bare,
        { answers: sub.answers },
        () => rows.map((r, i) => ({ ...bare[i], expected: r.correctAnswer, explanation: r.explanation }))
      );
    }

    case "multiple_choice": {
      const choices = key.choices ?? [];
      const picked = Array.isArray(sub.choices) ? sub.choices.filter((c) => typeof c === "string") : [];
      if (picked.length === 0) return invalid("Pick an answer first.");
      const correctKeys = choices.filter((c) => c.isCorrect).map((c) => c._key);
      const allRight = correctKeys.length === picked.length && correctKeys.every((k) => picked.includes(k));
      // Explanations for the options the learner chose are safe to show; the right answer is not.
      const pickedFeedback = (reveal: boolean): ItemFeedback[] =>
        choices
          .filter((c) => reveal || picked.includes(c._key))
          .map((c) => ({
            id: c._key,
            correct: Boolean(c.isCorrect) === picked.includes(c._key),
            explanation: c.explanation,
            ...(reveal ? { expected: c.isCorrect ? "Correct answer" : undefined } : {}),
          }));
      return autoOutcome(key, allRight ? 100 : 0, pickedFeedback(false), { choices: picked }, () => pickedFeedback(true));
    }

    case "matching": {
      const pairs = key.matchPairs ?? [];
      if (!Array.isArray(sub.rows) || sub.rows.length !== pairs.length) return invalid("Align every row first.");
      const result = gradeMatching(pairs, sub.rows);
      const bare = result.rows.map((r) => ({ id: r.keyId, correct: r.correct }));
      return autoOutcome(key, percent(result.correct, result.total), bare, { rows: sub.rows }, () =>
        result.rows.map((r) => ({ id: r.keyId, correct: r.correct, expected: r.expected, explanation: r.explanation }))
      );
    }

    case "ordering": {
      const items = key.orderingItems ?? [];
      if (!Array.isArray(sub.order) || sub.order.length !== items.length) return invalid("Put every item in order first.");
      const bare = items.map((item, i) => ({ id: String(i), correct: norm(sub.order[i]) === norm(item) }));
      return autoOutcome(
        key,
        percent(bare.filter((r) => r.correct).length, items.length),
        bare,
        { order: sub.order },
        () => bare.map((r, i) => ({ ...r, expected: items[i] }))
      );
    }

    case "source_verification": {
      const claims = key.claims ?? [];
      if (!isRecord(sub.verdicts) || claims.some((c) => !sub.verdicts[c._key])) return invalid("Give a verdict for every claim.");
      const bare = claims.map((c) => ({ id: c._key, correct: sub.verdicts[c._key] === c.verdict }));
      return autoOutcome(
        key,
        percent(bare.filter((r) => r.correct).length, claims.length),
        bare,
        { verdicts: sub.verdicts },
        () =>
          claims.map((c, i) => ({
            ...bare[i],
            expected: c.verdict,
            explanation: [c.explanation, c.sourceUrl].filter(Boolean).join("\n") || undefined,
          }))
      );
    }

    // ── Self-graded: the learner works, then checks their work against the rubric ──
    case "response": {
      const response = typeof sub.response === "string" ? sub.response.trim() : "";
      if (!response) return invalid("Write your response first.");
      if (response.length > MAX_RESPONSE_CHARS) return invalid("That response is too long.");

      const words = response.split(/\s+/).filter(Boolean).length;
      const { min, max } = key.wordRange ?? {};
      if (min && words < min) return invalid(`Aim for at least ${min} words (you have ${words}).`);
      if (max && words > max) return invalid(`Keep it to ${max} words or fewer (you have ${words}).`);

      const rubric = key.rubric ?? [];
      const ticked: Record<string, boolean> = {};
      for (const item of rubric) ticked[item._key] = Boolean(isRecord(sub.rubric) && sub.rubric[item._key]);
      if (rubric.some((item) => !ticked[item._key])) return invalid("Check your work against every criterion before submitting.");

      return {
        kind: "graded",
        score: 100,
        passed: true,
        feedback: [],
        rubricScores: ticked,
        stored: { response },
        gradedBy: "SELF",
      };
    }

    case "checklist": {
      const items = key.checklistItems ?? [];
      const checked = Array.isArray(sub.checked) ? sub.checked : [];
      if (items.length === 0 || items.some((_, i) => checked[i] !== true)) return invalid("Tick every item once you've done it.");
      return { kind: "graded", score: 100, passed: true, feedback: [], stored: { checked }, gradedBy: "SELF" };
    }

    default:
      return invalid("Unsupported task type.");
  }
}

// ── Knowledge checks ─────────────────────────────────────────────────────────

export type QuestionKey = {
  _key: string;
  points?: number | null;
  question?: {
    _id: string;
    questionType?: string | null;
    options?: { id?: string; isCorrect?: boolean; explanation?: string }[] | null;
    matchPairs?: { _key: string; option: string; explanation?: string }[] | null;
    correctAnswer?: string | null;
    explanation?: unknown;
  } | null;
};

export type CheckKey = { passingScore?: number | null; questions?: QuestionKey[] | null };

export type CheckOutcome =
  | {
      kind: "graded";
      score: number;
      passed: boolean;
      feedback: ItemFeedback[];
      responses: { questionId: string; response: unknown; isCorrect: boolean; pointsAwarded: number }[];
      message?: string;
    }
  | { kind: "invalid"; message: string };

export function gradeQuestion(q: QuestionKey, answer: unknown): { fraction: number; rows?: ItemFeedback[]; expected?: string; explanation?: string } {
  const question = q.question;
  if (!question) return { fraction: 0 };
  const options = question.options ?? [];

  switch (question.questionType) {
    case "single_choice":
    case "true_false": {
      if (options.length > 0) {
        const chosen = options.find((o) => o.id === answer);
        return {
          fraction: chosen?.isCorrect ? 1 : 0,
          explanation: chosen?.explanation,
          expected: options.find((o) => o.isCorrect)?.id,
        };
      }
      return { fraction: norm(String(answer ?? "")) === norm(question.correctAnswer) ? 1 : 0, expected: question.correctAnswer ?? undefined };
    }
    case "multiple_choice": {
      const picked = Array.isArray(answer) ? (answer as string[]) : [];
      const right = options.filter((o) => o.isCorrect).map((o) => o.id);
      const exact = right.length === picked.length && right.every((id) => picked.includes(id as string));
      return { fraction: exact ? 1 : 0, expected: right.join(", ") };
    }
    case "short_answer": {
      const accepted = (question.correctAnswer ?? "").split("|").map(norm).filter(Boolean);
      return { fraction: accepted.includes(norm(String(answer ?? ""))) ? 1 : 0, expected: question.correctAnswer ?? undefined };
    }
    case "matching": {
      const pairs = question.matchPairs ?? [];
      const rows = Array.isArray(answer) ? (answer as MatchRows) : [];
      if (rows.length !== pairs.length) return { fraction: 0 };
      const result = gradeMatching(pairs, rows);
      return {
        fraction: result.total ? result.correct / result.total : 0,
        rows: result.rows.map((r) => ({ id: r.keyId, correct: r.correct, expected: r.expected, explanation: r.explanation })),
      };
    }
    default:
      return { fraction: 0 };
  }
}

function isAnswered(answer: unknown): boolean {
  if (typeof answer === "string") return answer.trim().length > 0;
  return Array.isArray(answer) && answer.length > 0;
}

export function gradeCheck(key: CheckKey, answers: unknown): CheckOutcome {
  const questions = key.questions ?? [];
  if (questions.length === 0) return { kind: "invalid", message: "This check has no questions." };
  if (!isRecord(answers)) return { kind: "invalid", message: "Answer every question first." };
  const given = answers as CheckAnswers;
  if (questions.some((q) => !isAnswered(given[q._key]))) return { kind: "invalid", message: "Answer every question first." };

  let earned = 0;
  let total = 0;
  const detail = questions.map((q) => {
    const points = q.points ?? 1;
    const graded = gradeQuestion(q, given[q._key]);
    const pointsAwarded = Math.round(points * graded.fraction);
    earned += pointsAwarded;
    total += points;
    return { q, points, pointsAwarded, graded };
  });

  const score = percent(earned, total);
  const passed = score >= (key.passingScore ?? DEFAULT_PASSING_SCORE);

  const feedback: ItemFeedback[] = detail.map(({ q, graded }) => ({
    id: q._key,
    correct: graded.fraction === 1,
    // Right answers and explanations only after a pass.
    ...(passed ? { expected: graded.expected } : {}),
    ...(passed || graded.fraction < 1 ? { explanation: graded.explanation } : {}),
    rows: graded.rows?.map((r) => (passed ? r : { id: r.id, correct: r.correct })),
  }));

  return {
    kind: "graded",
    score,
    passed,
    feedback,
    message: passed ? undefined : "Not quite. Review the questions marked wrong and try again.",
    responses: detail.map(({ q, pointsAwarded, graded }) => ({
      questionId: q.question?._id ?? q._key,
      response: given[q._key],
      isCorrect: graded.fraction === 1,
      pointsAwarded,
    })),
  };
}

// ── End-of-lesson assessment ─────────────────────────────────────────────────

export type EndItemKey = {
  _key: string;
  _type: string;
  points?: number | null;
  question?: QuestionKey["question"];
  taskId?: string | null;
  task?: TaskKey | null;
};

export type EndKey = { passingScore?: number | null; items?: EndItemKey[] | null };

/**
 * Grade a whole end-of-lesson assessment in one go. Questions and server-marked
 * tasks earn points; self-checked tasks must be completed but earn none. The
 * score is points earned over points available, and answers are revealed only
 * once the assessment as a whole is passed.
 */
export function gradeEndAssessment(key: EndKey, answers: unknown): CheckOutcome {
  const items = key.items ?? [];
  if (items.length === 0) return { kind: "invalid", message: "This assessment has no questions or tasks." };
  if (!isRecord(answers)) return { kind: "invalid", message: "Answer every item first." };

  let earned = 0;
  let total = 0;
  const graded: { item: EndItemKey; fraction: number; counted: boolean; fb: ItemFeedback; response: unknown; stored: unknown }[] = [];

  for (const [index, item] of items.entries()) {
    const answer = answers[item._key];

    if (item._type === "assessmentQuestionRef") {
      if (!isAnswered(answer)) return { kind: "invalid", message: `Answer question ${index + 1} first.` };
      const result = gradeQuestion({ _key: item._key, points: item.points, question: item.question }, answer);
      const points = item.points ?? 1;
      earned += points * result.fraction;
      total += points;
      graded.push({
        item,
        fraction: result.fraction,
        counted: true,
        response: answer,
        stored: answer,
        fb: { id: item._key, correct: result.fraction === 1, expected: result.expected, explanation: result.explanation, rows: result.rows },
      });
      continue;
    }

    // A task item.
    if (!item.task) return { kind: "invalid", message: `Item ${index + 1} is missing its task.` };
    const outcome = gradeTask(item.task, answer);
    if (outcome.kind === "invalid") return { kind: "invalid", message: `Item ${index + 1}: ${outcome.message}` };
    const counted = isScoredTaskType(item.task.taskType);
    const fraction = outcome.score / 100;
    if (counted) {
      const points = item.points ?? 10;
      earned += points * fraction;
      total += points;
    }
    graded.push({
      item,
      fraction,
      counted,
      response: answer,
      stored: outcome.stored,
      fb: { id: item._key, correct: counted ? fraction === 1 : true, rows: outcome.feedback },
    });
  }

  // Only self-checked tasks: completing them is the pass.
  const score = total > 0 ? Math.round((earned / total) * 100) : 100;
  const passed = score >= (key.passingScore ?? DEFAULT_PASSING_SCORE);

  // On a miss, keep only right/wrong marks: no expected answers or explanations
  // (a task can reveal its own answers when it passes on its own; not here).
  const strip = (fb: ItemFeedback): ItemFeedback => ({ id: fb.id, correct: fb.correct, rows: fb.rows?.map(strip) });

  return {
    kind: "graded",
    score,
    passed,
    feedback: graded.map((g) => (passed ? g.fb : strip(g.fb))),
    message: passed ? undefined : "Not quite. Review the items marked wrong and try again.",
    responses: graded.map((g) => ({
      questionId:
        g.item._type === "assessmentQuestionRef"
          ? (g.item.question?._id ?? g.item._key)
          : (g.item.taskId ?? `task:${g.item._key}`),
      response: g.stored,
      isCorrect: g.counted ? g.fraction === 1 : true,
      pointsAwarded: g.counted ? Math.round((g.item.points ?? (g.item._type === "assessmentQuestionRef" ? 1 : 10)) * g.fraction) : 0,
    })),
  };
}
