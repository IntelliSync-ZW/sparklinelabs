"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileText,
  Lightbulb,
  Lock,
  Award,
  PartyPopper,
  PlayCircle,
  Target,
} from "lucide-react";
import { renderBlocks } from "@/components/learn/blocks/registry";
import { InlineSignIn } from "@/components/ai-training/inline-sign-in";
import { completeSectionAction, reportLessonTimeAction, submitCheckAction, submitTaskAction } from "@/lib/learning/actions";
import { track } from "@/lib/analytics";
import { PROJECT_KEY, type CheckAnswers, type GradeResult, type PassedGates, type TaskSubmission } from "@/lib/learning/results";
import { TaskView } from "@/components/learn/tasks/task-view";
import { KnowledgeCheckView } from "@/components/learn/assessments/knowledge-check";
import { formatLessonDuration } from "@/lib/learning/curriculum";
import type { LessonLink, LessonViewData } from "./types";

const typeMeta = {
  reading: { label: "Reading", Icon: BookOpen },
  video: { label: "Video", Icon: PlayCircle },
  practice: { label: "Practice", Icon: ClipboardCheck },
  quiz: { label: "Quiz", Icon: Target },
} as const;

export function LessonView({
  lesson,
  moduleLabel,
  lessonNumber,
  totalLessons,
  isSignedIn,
  initialCompletedKeys,
  initialGates,
  previous,
  next,
  courseHref,
}: {
  lesson: LessonViewData;
  moduleLabel: string;
  lessonNumber: number;
  totalLessons: number;
  isSignedIn: boolean;
  initialCompletedKeys: string[];
  initialGates: PassedGates;
  previous: LessonLink | null;
  /** The next lesson in the course, or null when this is the last one. */
  next: LessonLink | null;
  courseHref: string;
}) {
  const sections = lesson.sections;
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(() => new Set(initialCompletedKeys));
  // Mirrors `completedKeys` so the scroll observer can check it without re-subscribing.
  const completedRef = useRef<Set<string>>(new Set(initialCompletedKeys));
  const [activeKey, setActiveKey] = useState<string | undefined>(sections[0]?._key);
  const [, startTransition] = useTransition();
  const inFlight = useRef<Set<string>>(new Set());
  const [saveFailed, setSaveFailed] = useState(false);

  const [passedTasks, setPassedTasks] = useState<Set<string>>(() => new Set(initialGates.tasks));
  const [passedChecks, setPassedChecks] = useState<Set<string>>(() => new Set(initialGates.checks));
  const [projectPassed, setProjectPassed] = useState(initialGates.projectPassed);

  // Sections whose required task or check must be passed — reading to the end does not complete them.
  const gatedKeys = useMemo(
    () =>
      new Set(
        sections
          .filter((s) => (s.practice?.required && s.practice.task) || (s.check?.required && (s.check.questions?.length ?? 0) > 0))
          .map((s) => s._key)
      ),
    [sections]
  );
  const projectRequired = Boolean(lesson.project?.required && lesson.project.task);

  const lessonCompleted =
    sections.length > 0 && sections.every((s) => completedKeys.has(s._key)) && (!projectRequired || projectPassed);

  /** Fold the server's view of progress into local state after a graded attempt. */
  const applyGrade = useCallback((result: GradeResult, gate: { kind: "task" | "check"; key: string }) => {
    if (!result.ok) return;
    completedRef.current = new Set(result.completedSectionKeys);
    setCompletedKeys(completedRef.current);
    if (!result.passed) return;
    track(gate.kind === "check" ? "check_passed" : "task_passed", { lesson_id: lesson._id, section: gate.key });
    if (gate.kind === "check") setPassedChecks((p) => new Set(p).add(gate.key));
    else if (gate.key === PROJECT_KEY) setProjectPassed(true);
    else setPassedTasks((p) => new Set(p).add(gate.key));
  }, [lesson._id]);

  const handleTask = useCallback(
    async (sectionKey: string, submission: TaskSubmission) => {
      const result = await submitTaskAction({ lessonId: lesson._id, sectionKey, submission });
      applyGrade(result, { kind: "task", key: sectionKey });
      return result;
    },
    [lesson._id, applyGrade]
  );

  const handleCheck = useCallback(
    async (sectionKey: string, answers: CheckAnswers) => {
      const result = await submitCheckAction({ lessonId: lesson._id, sectionKey, answers });
      applyGrade(result, { kind: "check", key: sectionKey });
      return result;
    },
    [lesson._id, applyGrade]
  );
  const meta = typeMeta[(lesson.lessonType as keyof typeof typeMeta) ?? "reading"] ?? typeMeta.reading;
  const duration = formatLessonDuration(lesson.duration);

  // ── Section completion: reaching the end of a section completes it ──────────
  const completeSection = useCallback(
    (key: string) => {
      if (!isSignedIn || inFlight.current.has(key)) return;
      inFlight.current.add(key);
      startTransition(async () => {
        try {
          const result = await completeSectionAction({ lessonId: lesson._id, sectionKey: key });
          if (result.ok) {
            completedRef.current = new Set(result.completedSectionKeys);
            setCompletedKeys(completedRef.current);
            setSaveFailed(false);
          } else if (result.reason === "unavailable") {
            setSaveFailed(true);
          }
        } catch {
          setSaveFailed(true);
        } finally {
          inFlight.current.delete(key);
        }
      });
    },
    [isSignedIn, lesson._id]
  );

  const endMarkers = useRef<Map<string, HTMLElement>>(new Map());
  const headings = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    if (!isSignedIn) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = (entry.target as HTMLElement).dataset.sectionEnd;
          // Reached, or already scrolled past.
          if (key && !gatedKeys.has(key) && !completedRef.current.has(key) && (entry.isIntersecting || entry.boundingClientRect.top < 0)) {
            completeSection(key);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    endMarkers.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isSignedIn, completeSection, sections, gatedKeys]);

  // ── Lesson complete: refresh the sidebar and progress bar, note it for analytics ──
  const router = useRouter();
  const wasCompleted = useRef(lessonCompleted);
  useEffect(() => {
    if (lessonCompleted && !wasCompleted.current) {
      track("lesson_complete", { lesson_id: lesson._id });
      router.refresh();
    }
    wasCompleted.current = lessonCompleted;
  }, [lessonCompleted, lesson._id, router]);

  // ── Resume: land on the first section not finished yet ─────────────────────
  useEffect(() => {
    if (!isSignedIn || window.location.hash || lessonCompleted) return;
    const done = initialCompletedKeys.length;
    if (done === 0) return;
    const target = sections.find((s) => !initialCompletedKeys.includes(s._key));
    if (target) document.getElementById(target.sectionId ?? target._key)?.scrollIntoView({ block: "start" });
    // Only on arrival — not every time progress changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Active reading time: a heartbeat while the lesson is open, visible and in use ──
  useEffect(() => {
    if (!isSignedIn) return;
    const TICK = 5;
    let active = 0;
    let lastInput = Date.now();
    const noteInput = () => (lastInput = Date.now());
    const flush = () => {
      if (active >= 10) {
        const seconds = active;
        active = 0;
        void reportLessonTimeAction({ lessonId: lesson._id, seconds }).catch(() => {});
      }
    };
    const timer = window.setInterval(() => {
      // Counts only while the tab is showing and the learner has done something in the last minute.
      if (document.visibilityState === "visible" && Date.now() - lastInput < 60_000) active += TICK;
      if (active >= 30) flush();
    }, TICK * 1000);
    const onVisibility = () => document.visibilityState === "hidden" && flush();
    const inputEvents = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    inputEvents.forEach((e) => window.addEventListener(e, noteInput, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      inputEvents.forEach((e) => window.removeEventListener(e, noteInput));
      document.removeEventListener("visibilitychange", onVisibility);
      flush();
    };
  }, [isSignedIn, lesson._id]);

  // ── Keyboard: ← previous lesson, → next lesson (when unlocked) ─────────────
  const canGoNext = Boolean(next) && isSignedIn && lessonCompleted;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const el = event.target as HTMLElement | null;
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(el.tagName))) return;
      if (event.key === "ArrowLeft" && previous) router.push(previous.href);
      if (event.key === "ArrowRight" && canGoNext && next) router.push(next.href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previous, next, canGoNext, router]);

  // ── "On this page" highlight ───────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const key = (visible[0]?.target as HTMLElement | undefined)?.dataset.sectionHeading;
        if (key) setActiveKey(key);
      },
      { rootMargin: "-80px 0px -65% 0px" }
    );
    headings.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Signed-out visitors read the first section; the rest sits behind the sign-in form.
  const visibleSections = isSignedIn ? sections : sections.slice(0, 1);
  const hiddenSections = isSignedIn ? [] : sections.slice(1);
  const completedCount = sections.filter((s) => completedKeys.has(s._key)).length;

  const nextBlockedReason = !isSignedIn
    ? "Sign in to continue"
    : !lessonCompleted
      ? sections.every((s) => completedKeys.has(s._key))
        ? "Complete the lesson project to continue"
        : `Finish this lesson to continue (${completedCount}/${sections.length} sections)`
      : null;

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-10 mx-auto max-w-6xl px-4 sm:px-8">
      <article className="min-w-0 max-w-3xl w-full mx-auto xl:mx-0 py-10 pb-28">
        {/* ── Lesson header ───────────────────────────────────────────────── */}
        <header className="mb-10">
          <p className="text-sm font-medium text-accent mb-3">
            {moduleLabel} · Lesson {lessonNumber} of {totalLessons}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance mb-4">{lesson.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-5 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-muted-foreground">
              <meta.Icon className="size-3.5" /> {meta.label}
            </span>
            {duration && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-muted-foreground">
                <Clock className="size-3.5" /> {duration}
              </span>
            )}
            {sections.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-muted-foreground">
                <FileText className="size-3.5" /> {sections.length} section{sections.length === 1 ? "" : "s"}
              </span>
            )}
          </div>
          {lesson.summary && <p className="text-lg text-muted-foreground leading-relaxed">{lesson.summary}</p>}
        </header>

        {lesson.image?.url && (
          <figure className="mb-10">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
              <Image
                src={lesson.image.url}
                alt={lesson.image.alt ?? lesson.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            {lesson.image.caption && (
              <figcaption className="mt-2 text-sm text-muted-foreground">{lesson.image.caption}</figcaption>
            )}
          </figure>
        )}

        {lesson.videoUrl && (
          <div className="relative mb-10 aspect-video overflow-hidden rounded-xl bg-black">
            <iframe src={lesson.videoUrl} className="absolute inset-0 size-full" allowFullScreen title={lesson.title} />
          </div>
        )}

        {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
          <aside className="mb-12 rounded-xl border border-border bg-secondary/50 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What you will learn
            </p>
            <ul className="space-y-2">
              {lesson.learningOutcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  {outcome}
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* ── Sections on a numbered rail ─────────────────────────────────── */}
        <ol className="relative">
          {visibleSections.map((section, i) => (
            <SectionStep
              key={section._key}
              number={i + 1}
              isLast={i === visibleSections.length - 1 && hiddenSections.length === 0}
              done={completedKeys.has(section._key)}
              title={section.title}
              anchor={section.sectionId ?? section._key}
              minutes={section.estimatedMinutes}
              registerHeading={(el) => el && headings.current.set(section._key, el)}
              registerEnd={(el) => el && endMarkers.current.set(section._key, el)}
              sectionKey={section._key}
              gateHint={gateHint(section, passedTasks.has(section._key), passedChecks.has(section._key))}
            >
              {section.content && section.content.length > 0 && renderBlocks(section.content)}
              {section.practice?.task && (
                <TaskView
                  task={section.practice.task}
                  required={Boolean(section.practice.required)}
                  initiallyPassed={passedTasks.has(section._key)}
                  signedIn={isSignedIn}
                  onSubmit={(submission) => handleTask(section._key, submission)}
                />
              )}
              {section.check && (section.check.questions?.length ?? 0) > 0 && (
                <KnowledgeCheckView
                  check={section.check}
                  required={Boolean(section.check.required)}
                  initiallyPassed={passedChecks.has(section._key)}
                  signedIn={isSignedIn}
                  onSubmit={(answers) => handleCheck(section._key, answers)}
                />
              )}
            </SectionStep>
          ))}

          {/* Signed out: remaining sections stay in the page (for crawlers) behind the form. */}
          {hiddenSections.length > 0 && (
            <li className="relative pl-12 pb-4">
              <div
                aria-hidden="true"
                className="relative max-h-64 overflow-hidden select-none pointer-events-none opacity-30 blur-sm"
              >
                {hiddenSections.map((section, i) => (
                  <div key={section._key} className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight mb-4">{section.title}</h2>
                    {section.content && section.content.length > 0 && renderBlocks(section.content)}
                    <span className="sr-only">{i}</span>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-transparent to-background" />
              <div className="relative -mt-24 flex flex-col items-center text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                  <Lock className="size-6" />
                </div>
                <h2 className="mb-2 text-2xl font-bold tracking-tight">Sign in to keep going</h2>
                <p className="mb-6 max-w-md text-sm text-muted-foreground leading-relaxed">
                  Free account. Save your progress, complete the practice tasks and earn your certificate.
                </p>
                <InlineSignIn />
              </div>
            </li>
          )}
        </ol>

        {/* ── Lesson project ──────────────────────────────────────────────── */}
        {isSignedIn && lesson.project?.task && (
          <section id="project" className="scroll-mt-24">
            <TaskView
              task={lesson.project.task}
              required={projectRequired}
              initiallyPassed={projectPassed}
              signedIn={isSignedIn}
              heading="Lesson project"
              onSubmit={(submission) => handleTask(PROJECT_KEY, submission)}
            />
          </section>
        )}

        {/* ── Wrap-up ─────────────────────────────────────────────────────── */}
        {isSignedIn && lessonCompleted && !next && (
          <div className="mt-12 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-6 text-center">
            <span className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-emerald-500 text-white">
              <Award className="size-7" />
            </span>
            <p className="text-xl font-semibold">You&apos;ve finished the course</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Every lesson is complete. Head back to the course page to see your progress and your certificate.
            </p>
            <Link
              href={courseHref}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Back to the course <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
        {isSignedIn && lessonCompleted && next && (
          <div className="mt-12 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <PartyPopper className="mt-0.5 size-5 shrink-0 text-emerald-500" />
            <div>
              <p className="font-semibold">Lesson complete</p>
              <p className="text-sm text-muted-foreground">Next up: {next.title}</p>
            </div>
          </div>
        )}

        {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
          <section className="mt-12" aria-labelledby="takeaways">
            <h2 id="takeaways" className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight">
              <Lightbulb className="size-5 text-accent" /> Key takeaways
            </h2>
            <ul className="space-y-2.5">
              {lesson.keyTakeaways.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-muted-foreground">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {lesson.resources && lesson.resources.length > 0 && (
          <section className="mt-12" aria-labelledby="resources">
            <h2 id="resources" className="mb-4 text-xl font-semibold tracking-tight">Resources</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {lesson.resources.map((r) => {
                const href = r.fileUrl ?? r.url;
                const body = (
                  <>
                    <FileText className="size-5 shrink-0 text-accent" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{r.title}</span>
                      {r.description && <span className="block text-xs text-muted-foreground line-clamp-2">{r.description}</span>}
                    </span>
                  </>
                );
                return (
                  <li key={r._id}>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-xl border border-border p-4 hover:bg-secondary transition-colors">
                        {body}
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 rounded-xl border border-border p-4">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {lesson.sources && lesson.sources.length > 0 && (
          <section className="mt-12" aria-labelledby="sources">
            <h2 id="sources" className="mb-4 text-xl font-semibold tracking-tight">Sources</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {lesson.sources.map((s) => (
                <li key={s._id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground underline underline-offset-4 hover:text-accent">
                    {s.title} <ExternalLink className="size-3" />
                  </a>
                  {s.publisher && <span> — {s.publisher}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {saveFailed && (
          <p role="status" className="mt-8 text-sm text-amber-600 dark:text-amber-400">
            We couldn&apos;t save your progress just now. Keep reading — we&apos;ll try again as you scroll.
          </p>
        )}
      </article>

      {/* ── On this page ──────────────────────────────────────────────────── */}
      <aside className="hidden xl:block">
        <nav aria-label="On this page" className="sticky top-24 py-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
          <ol className="space-y-1 border-l border-border">
            {sections.map((section) => {
              const done = completedKeys.has(section._key);
              const active = activeKey === section._key;
              return (
                <li key={section._key}>
                  <a
                    href={`#${section.sectionId ?? section._key}`}
                    className={`-ml-px flex items-center gap-2 border-l-2 py-1.5 pl-4 pr-2 text-sm transition-colors ${
                      active ? "border-accent font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    ) : (
                      <span className="size-3.5 shrink-0 rounded-full border border-border" />
                    )}
                    <span className="truncate">{section.title}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      {/* ── Sticky lesson navigation ──────────────────────────────────────── */}
      <div className="xl:col-span-2 sticky bottom-0 -mx-4 sm:-mx-8 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 sm:px-8 py-3 xl:mx-0">
          {previous ? (
            <Link href={previous.href} className="inline-flex min-w-0 items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-4 shrink-0" />
              <span className="truncate hidden sm:inline">{previous.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : (
            <span />
          )}

          <div className="flex min-w-0 items-center gap-3">
            {previous || canGoNext ? (
              <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground" aria-hidden="true">
                <kbd className="rounded border border-border px-1.5 py-0.5 font-sans">←</kbd>
                <kbd className="rounded border border-border px-1.5 py-0.5 font-sans">→</kbd>
              </span>
            ) : null}
            {nextBlockedReason && (
              <span className="hidden md:block truncate text-xs text-muted-foreground">{nextBlockedReason}</span>
            )}
            {next ? (
              nextBlockedReason ? (
                <span
                  aria-disabled="true"
                  className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground"
                >
                  <Lock className="size-4" /> Next lesson
                </span>
              ) : (
                <Link
                  href={next.href}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  Next lesson <ArrowRight className="size-4" />
                </Link>
              )
            ) : lessonCompleted ? (
              <Link
                href={courseHref}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                Back to course <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionStep({
  number,
  isLast,
  done,
  title,
  anchor,
  minutes,
  sectionKey,
  gateHint,
  registerHeading,
  registerEnd,
  children,
}: {
  number: number;
  isLast: boolean;
  done: boolean;
  title: string;
  anchor: string;
  minutes?: number | null;
  sectionKey: string;
  /** Shown while the section still needs a task or check to be passed. */
  gateHint?: string | null;
  registerHeading: (el: HTMLElement | null) => void;
  registerEnd: (el: HTMLElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pl-12 pb-12">
      {/* Rail */}
      {!isLast && <span aria-hidden="true" className="absolute left-[15px] top-9 bottom-0 w-px bg-border" />}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 grid size-8 place-items-center rounded-full border text-sm font-semibold transition-colors ${
          done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-background text-muted-foreground"
        }`}
      >
        {done ? <CheckCircle2 className="size-4" /> : number}
      </span>

      <section id={anchor} className="scroll-mt-24" aria-labelledby={`${anchor}-title`}>
        <div ref={registerHeading} data-section-heading={sectionKey} className="mb-4 flex flex-wrap items-baseline gap-x-3">
          <h2 id={`${anchor}-title`} className="text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          {minutes ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" /> {minutes} min
            </span>
          ) : null}
        </div>
        {children}
        {gateHint && !done && (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4 text-accent" /> {gateHint}
          </p>
        )}
        <div ref={registerEnd} data-section-end={sectionKey} className="h-px" aria-hidden="true" />
      </section>
    </li>
  );
}

/** What a learner still has to pass to finish a gated section. */
function gateHint(section: { practice?: { required?: boolean; task?: unknown } | null; check?: { required?: boolean; questions?: unknown[] | null } | null }, taskPassed: boolean, checkPassed: boolean) {
  const needsTask = Boolean(section.practice?.required && section.practice.task) && !taskPassed;
  const needsCheck = Boolean(section.check?.required && (section.check.questions?.length ?? 0) > 0) && !checkPassed;
  if (needsTask && needsCheck) return "Pass the practice task and the knowledge check to finish this section.";
  if (needsTask) return "Pass the practice task to finish this section.";
  if (needsCheck) return "Pass the knowledge check to finish this section.";
  return null;
}
