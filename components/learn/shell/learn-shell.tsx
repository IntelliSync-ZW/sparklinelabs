import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CurriculumSidebar } from "./curriculum-sidebar";
import { MobileCurriculum } from "./mobile-curriculum";
import { LearnUserMenu } from "./user-menu";
import type { CurriculumModule, FlatLesson } from "@/lib/learning/curriculum";

/**
 * Focus-mode frame for lesson pages: no marketing header or footer, just the
 * course title, overall progress, the curriculum and the lesson itself.
 */
export function LearnShell({
  course,
  modules,
  flat,
  completed,
  currentLessonId,
  progressPercent,
  children,
}: {
  course: { title: string; slug: string };
  modules: CurriculumModule[];
  flat: FlatLesson[];
  completed: ReadonlySet<string>;
  currentLessonId: string;
  progressPercent: number;
  children: React.ReactNode;
}) {
  const sidebar = (
    <CurriculumSidebar
      courseSlug={course.slug}
      modules={modules}
      flat={flat}
      completed={completed}
      currentLessonId={currentLessonId}
    />
  );

  return (
    <div className="learn-root min-h-screen bg-background">
      <a
        href="#lesson-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-foreground"
      >
        Skip to lesson
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <Link
            href={`/ai-training/${course.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Course</span>
          </Link>
          <span className="hidden sm:block h-5 w-px bg-border" aria-hidden="true" />
          <p className="min-w-0 flex-1 truncate text-sm font-semibold">{course.title}</p>

          <div className="hidden sm:flex items-center gap-2 shrink-0" title={`${progressPercent}% complete`}>
            <div
              className="h-1.5 w-32 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Course progress"
            >
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="w-9 text-xs tabular-nums text-muted-foreground">{progressPercent}%</span>
          </div>

          <MobileCurriculum title={course.title}>{sidebar}</MobileCurriculum>
          <LearnUserMenu />
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border p-4">
          {sidebar}
        </aside>
        <main id="lesson-main" tabIndex={-1} className="min-w-0 outline-none">{children}</main>
      </div>
    </div>
  );
}
