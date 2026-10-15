import "server-only";

// ---------------------------------------------------------------------------
// Server-side preparation of lesson data before it is passed to client
// components. Sanity returns ordering items and matching pairs in their correct
// order; sending them as-is would reveal the answer, so we shuffle here.
// ---------------------------------------------------------------------------

type MatchKey = { _key: string; key: string };

type Matchable = {
  matchKeys?: MatchKey[] | null;
  matchOptions?: string[] | null;
  orderingItems?: string[] | null;
};

type TaskSlot = { task?: Matchable | null } | null | undefined;
type Check = { questions?: { question?: Matchable | null }[] | null } | null | undefined;

type LessonLike = {
  sections?: { practice?: TaskSlot; check?: Check }[] | null;
  endAssessment?: { items?: { task?: Matchable | null; question?: Matchable | null }[] | null } | null;
};

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Shuffle until the result differs from the original order (a few tries is plenty). */
function shuffleAwayFrom<T>(items: T[], isSolved: (candidate: T[]) => boolean): T[] {
  if (items.length < 2) return items;
  let best = shuffle(items);
  for (let tries = 0; tries < 10 && isSolved(best); tries++) best = shuffle(items);
  return best;
}

/**
 * Shuffle the keys and options columns independently so that as few rows as
 * possible start out aligned, and never all of them.
 */
function shuffleMatching<T extends Matchable>(item: T): T {
  const keys = item.matchKeys ?? [];
  const options = item.matchOptions ?? [];
  if (keys.length < 2 || keys.length !== options.length) return item;

  // Remember which option belongs to each key before shuffling.
  const answerFor = new Map(keys.map((k, i) => [k._key, options[i]]));
  const alignedCount = (ks: MatchKey[], os: string[]) =>
    ks.reduce((n, k, i) => n + (answerFor.get(k._key) === os[i] ? 1 : 0), 0);

  let bestKeys = shuffle(keys);
  let bestOptions = shuffle(options);
  for (let tries = 0; tries < 20 && alignedCount(bestKeys, bestOptions) > 0; tries++) {
    const ks = shuffle(keys);
    const os = shuffle(options);
    if (alignedCount(ks, os) < alignedCount(bestKeys, bestOptions)) {
      bestKeys = ks;
      bestOptions = os;
    }
  }
  return { ...item, matchKeys: bestKeys, matchOptions: bestOptions };
}

function prepareItem<T extends Matchable | null | undefined>(item: T): T {
  if (!item) return item;
  let out: Matchable = item;
  if (out.matchKeys?.length) out = shuffleMatching(out);
  if (out.orderingItems?.length) {
    const original = out.orderingItems;
    out = {
      ...out,
      orderingItems: shuffleAwayFrom(original, (c) => c.every((v, i) => v === original[i])),
    };
  }
  return out as T;
}

function prepareSlot<T extends TaskSlot>(slot: T): T {
  if (!slot?.task) return slot;
  return { ...slot, task: prepareItem(slot.task) } as T;
}

export function prepareLessonForClient<T extends LessonLike>(lesson: T): T {
  return {
    ...lesson,
    endAssessment: lesson.endAssessment
      ? {
          ...lesson.endAssessment,
          items: lesson.endAssessment.items?.map((item) => ({
            ...item,
            task: prepareItem(item.task),
            question: prepareItem(item.question),
          })),
        }
      : lesson.endAssessment,
    sections: lesson.sections?.map((section) => ({
      ...section,
      practice: prepareSlot(section.practice),
      check: section.check
        ? {
            ...section.check,
            questions: section.check.questions?.map((q) => ({ ...q, question: prepareItem(q.question) })),
          }
        : section.check,
    })),
  };
}

// ---------------------------------------------------------------------------
// Matching grading
// ---------------------------------------------------------------------------

/** What the client submits: the final rows as the learner aligned them. */
export type MatchingSubmission = { keyId: string; option: string }[];

export type MatchingResult = {
  correct: number;
  total: number;
  rows: { keyId: string; correct: boolean; expected: string; explanation?: string }[];
};

export function gradeMatching(
  answerKey: { _key: string; option: string; explanation?: string }[],
  submission: MatchingSubmission
): MatchingResult {
  const submitted = new Map(submission.map((row) => [row.keyId, row.option]));
  const norm = (v?: string) => (v ?? "").trim().toLowerCase();
  const rows = answerKey.map((pair) => ({
    keyId: pair._key,
    correct: norm(submitted.get(pair._key)) === norm(pair.option),
    expected: pair.option,
    explanation: pair.explanation,
  }));
  return { correct: rows.filter((r) => r.correct).length, total: rows.length, rows };
}
