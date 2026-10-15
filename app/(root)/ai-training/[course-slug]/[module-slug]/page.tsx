import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { PortableText } from "@portabletext/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Lock,
  PlayCircle,
  Target,
} from "lucide-react";
import { fetchLearning } from "@/sanity/lib/fetch";
import { moduleOverviewQuery } from "@/lib/learning-queries/player";
import {
  flattenCurriculum,
  formatLessonDuration,
  isLessonUnlocked,
  lessonHref,
  lessonStatus,
  type CurriculumModule,
  type CurriculumLesson,
} from "@/lib/learning/curriculum";
import { getCourseProgress } from "@/lib/learning/progress";
import { LessonHashRedirect } from "@/components/learn/lesson/hash-redirect";

// Shows the signed-in learner's progress, so it renders per request.
export const dynamic = "force-dynamic";

type Params = { "course-slug": string; "module-slug": string };

type ModuleOverview = {
  _id: string;
  number: number;
  title: string;
  slug: string;
  description?: unknown[];
  assessment?: { _id: string; title: string; passingScore?: number } | null;
  lessons: (CurriculumLesson & { summary?: string | null })[];
  course: {
    _id: string;
    title: string;
    slug: string;
    status?: string | null;
    modules: CurriculumModule[];
  };
};

async function loadModule(params: Params) {
  const mod = await fetchLearning<ModuleOverview | null>(moduleOverviewQuery, {
    courseSlug: params["course-slug"],
    moduleSlug: params["module-slug"],
  });
  if (!mod) return null;
  if (process.env.NODE_ENV !== "development" && mod.course.status !== "published") return null;
  return mod;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolved = await params;
  const mod = await loadModule(resolved);
  if (!mod) return {};

  const url = `https://www.sparklinelabs.co.zw/ai-training/${resolved["course-slug"]}/${resolved["module-slug"]}`;
  const description = `Module ${mod.number} of ${mod.course.title}: ${mod.lessons.length} lesson${mod.lessons.length === 1 ? "" : "s"}.`;
  return {
    title: `${mod.title} — ${mod.course.title} | Sparkline Labs`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${mod.title} — ${mod.course.title}`, description, url },
  };
}

const typeIcon = { reading: BookOpen, video: PlayCircle, practice: ClipboardCheck, quiz: Target } as const;

export default async function ModulePage({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  const mod = await loadModule(resolved);
  if (!mod) notFound();

  const { userId } = await auth();
  const courseSlug = mod.course.slug;
  const progress = await getCourseProgress(userId, mod.course._id);
  const completed = progress.completedLessonIds;

  const flat = flattenCurriculum(mod.course.modules);
  const moduleLessons = flat.filter((l) => l.moduleSlug === mod.slug);
  const doneCount = moduleLessons.filter((l) => completed.has(l._id)).length;
  const totalMinutes = mod.lessons.reduce(
    (sum, l) => sum + (l.duration?.value && (!l.duration.unit || l.duration.unit === "minutes") ? l.duration.value : 0),
    0
  );

  // Where the primary button goes: the first lesson here that is open and unfinished.
  const openLesson = (l: (typeof moduleLessons)[number]) =>
    userId ? progress.offline || isLessonUnlocked(flat, l.index, completed) : l.index === 0;
  const target =
    moduleLessons.find((l) => !completed.has(l._id) && openLesson(l)) ?? moduleLessons[0] ?? null;
  const allDone = moduleLessons.length > 0 && doneCount === moduleLessons.length;
  const ctaLabel = allDone ? "Review module" : doneCount > 0 ? "Continue" : "Start module";

  const modules = mod.course.modules;
  const moduleIdx = modules.findIndex((m) => m._id === mod._id);
  const prevModule = moduleIdx > 0 ? modules[moduleIdx - 1] : null;
  const nextModule = moduleIdx >= 0 && moduleIdx < modules.length - 1 ? modules[moduleIdx + 1] : null;

  return (
    <>
      <LessonHashRedirect
        lessons={moduleLessons.map((l) => ({ slug: l.slug, href: lessonHref(courseSlug, l) }))}
      />

      <section className="border-b border-border px-6 pt-28 pb-12 md:pt-36">
        <div className="container mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/ai-training" className="hover:text-foreground transition-colors">AI Training</Link>
            <ChevronRight className="size-3.5" />
            <Link href={`/ai-training/${courseSlug}`} className="hover:text-foreground transition-colors">
              {mod.course.title}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">Module {mod.number}</span>
          </nav>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Module {mod.number}</p>
          <h1 className="mb-6 text-4xl font-semibold tracking-tight text-balance md:text-5xl">{mod.title}</h1>

          {Array.isArray(mod.description) && mod.description.length > 0 && (
            <div className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground [&_p]:mb-4">
              <PortableText value={mod.description as Parameters<typeof PortableText>[0]["value"]} />
            </div>
          )}

          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-4" /> {mod.lessons.length} lesson{mod.lessons.length === 1 ? "" : "s"}
            </span>
            {totalMinutes > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" /> {totalMinutes} min
              </span>
            )}
            {userId && moduleLessons.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> {doneCount} of {moduleLessons.length} complete
              </span>
            )}
          </div>

          {target && (
            <Link
              href={lessonHref(courseSlug, target)}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              {ctaLabel}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Lessons</h2>
          <ol className="space-y-3">
            {moduleLessons.map((lesson, i) => {
              const status = lessonStatus(flat, lesson.index, completed);
              const locked = userId ? !openLesson(lesson) : lesson.index > 0;
              const Icon = typeIcon[lesson.lessonType ?? "reading"] ?? BookOpen;
              const duration = formatLessonDuration(lesson.duration);
              const summary = mod.lessons.find((l) => l._id === lesson._id)?.summary;

              const body = (
                <>
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full border text-sm font-semibold ${
                      status === "completed"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {status === "completed" ? <CheckCircle2 className="size-5" /> : locked ? <Lock className="size-4" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-medium leading-snug">{lesson.title}</span>
                    {summary && <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">{summary}</span>}
                    <span className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 capitalize"><Icon className="size-3.5" />{lesson.lessonType ?? "reading"}</span>
                      {duration && <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{duration}</span>}
                      {locked && <span>{userId ? "Finish the previous lesson to unlock" : "Sign in to unlock"}</span>}
                    </span>
                  </span>
                  {!locked && <ChevronRight className="size-5 shrink-0 text-muted-foreground" />}
                </>
              );
              const base = "flex items-start gap-4 rounded-xl border border-border p-5 transition-colors";

              return (
                <li key={lesson._id}>
                  {locked ? (
                    <div className={`${base} opacity-70`}>{body}</div>
                  ) : (
                    <Link href={lessonHref(courseSlug, lesson)} className={`${base} hover:bg-secondary`}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>

          {mod.assessment && (
            <div className="mt-8 flex items-start gap-4 rounded-xl border border-dashed border-border bg-secondary/40 p-5">
              <Target className="mt-0.5 size-5 shrink-0 text-accent" />
              <div>
                <p className="font-medium">{mod.assessment.title}</p>
                <p className="text-sm text-muted-foreground">
                  Module assessment{mod.assessment.passingScore ? ` · pass mark ${mod.assessment.passingScore}%` : ""}.
                  Unlocks after the lessons above.
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-8">
            {prevModule ? (
              <Link
                href={`/ai-training/${courseSlug}/${prevModule.slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" /> Module {prevModule.number}: {prevModule.title}
              </Link>
            ) : (
              <span />
            )}
            {nextModule && (
              <Link
                href={`/ai-training/${courseSlug}/${nextModule.slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Module {nextModule.number}: {nextModule.title} <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
