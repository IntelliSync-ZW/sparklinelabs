import Link from "next/link";
import { BookOpen, CheckCircle2, Circle, ClipboardCheck, Lock, PlayCircle, Target } from "lucide-react";
import {
  formatLessonDuration,
  lessonHref,
  lessonStatus,
  type CurriculumModule,
  type FlatLesson,
  type LessonStatus,
} from "@/lib/learning/curriculum";

const typeIcon = {
  reading: BookOpen,
  video: PlayCircle,
  practice: ClipboardCheck,
  quiz: Target,
} as const;

function StatusMark({ status }: { status: LessonStatus }) {
  if (status === "completed") return <CheckCircle2 className="size-4 text-emerald-500 shrink-0" aria-label="Completed" />;
  if (status === "locked") return <Lock className="size-4 text-muted-foreground/60 shrink-0" aria-label="Locked" />;
  if (status === "current") {
    return (
      <span className="grid size-4 place-items-center shrink-0" aria-label="Current lesson">
        <span className="size-2.5 rounded-full bg-accent ring-4 ring-accent/20" />
      </span>
    );
  }
  return <Circle className="size-4 text-muted-foreground/60 shrink-0" aria-label="Not started" />;
}

/**
 * Course outline. Modules are collapsible (native <details>, no client JS) and
 * the module containing the current lesson starts open.
 */
export function CurriculumSidebar({
  courseSlug,
  modules,
  flat,
  completed,
  currentLessonId,
}: {
  courseSlug: string;
  modules: CurriculumModule[];
  flat: FlatLesson[];
  completed: ReadonlySet<string>;
  currentLessonId?: string;
}) {
  const indexById = new Map(flat.map((l) => [l._id, l.index]));

  return (
    <nav aria-label="Course curriculum" className="space-y-2">
      {modules.map((mod) => {
        const lessons = mod.lessons ?? [];
        const doneCount = lessons.filter((l) => completed.has(l._id)).length;
        const containsCurrent = lessons.some((l) => l._id === currentLessonId);

        return (
          <details key={mod._id} open={containsCurrent || modules.length === 1} className="group rounded-xl border border-border bg-card/40">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {mod.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-snug">{mod.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {doneCount}/{lessons.length} lessons
                </span>
              </span>
            </summary>

            <ol className="border-t border-border py-1">
              {lessons.map((lesson) => {
                const index = indexById.get(lesson._id) ?? 0;
                const status = lessonStatus(flat, index, completed, currentLessonId);
                const locked = status === "locked";
                const Icon = typeIcon[lesson.lessonType ?? "reading"] ?? BookOpen;
                const duration = formatLessonDuration(lesson.duration);

                const row = (
                  <>
                    <StatusMark status={status} />
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm leading-snug ${status === "current" ? "font-semibold" : ""}`}>
                        {lesson.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className="size-3" />
                        {duration ?? lesson.lessonType ?? "reading"}
                      </span>
                    </span>
                  </>
                );
                const base = "flex items-start gap-3 px-4 py-2.5 transition-colors";

                return (
                  <li key={lesson._id}>
                    {locked ? (
                      <div className={`${base} opacity-60 cursor-not-allowed`} title="Complete the previous lesson to unlock">
                        {row}
                      </div>
                    ) : (
                      <Link
                        href={lessonHref(courseSlug, flat[index])}
                        aria-current={status === "current" ? "page" : undefined}
                        className={`${base} hover:bg-secondary ${status === "current" ? "bg-secondary" : ""}`}
                      >
                        {row}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </details>
        );
      })}
    </nav>
  );
}
