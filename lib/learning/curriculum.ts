// ---------------------------------------------------------------------------
// Course outline helpers (pure - safe to import from server or client code).
// ---------------------------------------------------------------------------

export type CurriculumLesson = {
  _id: string;
  title: string;
  slug: string;
  lessonType?: "reading" | "video" | "practice" | "quiz" | null;
  accessLevel?: string | null;
  duration?: { value?: number; unit?: string } | null;
};

export type CurriculumModule = {
  _id: string;
  number: number;
  title: string;
  slug: string;
  accessLevel?: string | null;
  lessons: CurriculumLesson[];
};

export type FlatLesson = CurriculumLesson & {
  index: number;
  moduleSlug: string;
  moduleTitle: string;
  moduleNumber: number;
};

export type LessonStatus = "completed" | "current" | "available" | "locked";

export function flattenCurriculum(modules: CurriculumModule[] | null | undefined): FlatLesson[] {
  const flat: FlatLesson[] = [];
  for (const mod of modules ?? []) {
    for (const lesson of mod.lessons ?? []) {
      flat.push({
        ...lesson,
        index: flat.length,
        moduleSlug: mod.slug,
        moduleTitle: mod.title,
        moduleNumber: mod.number,
      });
    }
  }
  return flat;
}

export function lessonHref(courseSlug: string, lesson: Pick<FlatLesson, "moduleSlug" | "slug">) {
  return `/ai-training/${courseSlug}/${lesson.moduleSlug}/${lesson.slug}`;
}

/**
 * Lessons unlock strictly in order: lesson N is open only once every earlier
 * lesson is completed (so inserting or reordering lessons later cannot let a
 * learner skip one). Signed-out visitors can open the first lesson only.
 */
export function isLessonUnlocked(flat: FlatLesson[], index: number, completed: ReadonlySet<string>): boolean {
  if (index <= 0) return true;
  return flat.slice(0, index).every((lesson) => completed.has(lesson._id));
}

export function lessonStatus(
  flat: FlatLesson[],
  index: number,
  completed: ReadonlySet<string>,
  currentId?: string
): LessonStatus {
  const lesson = flat[index];
  if (completed.has(lesson._id)) return "completed";
  if (!isLessonUnlocked(flat, index, completed)) return "locked";
  return lesson._id === currentId ? "current" : "available";
}

/** The lesson a learner should open next: the first one not yet completed. */
export function firstIncompleteLesson(flat: FlatLesson[], completed: ReadonlySet<string>): FlatLesson | undefined {
  return flat.find((lesson) => !completed.has(lesson._id)) ?? flat[0];
}

export function formatLessonDuration(duration?: { value?: number; unit?: string } | null): string | null {
  if (!duration?.value) return null;
  if (duration.unit === "hours") return `${duration.value} h`;
  if (duration.unit === "seconds") return `${duration.value} s`;
  return `${duration.value} min`;
}
