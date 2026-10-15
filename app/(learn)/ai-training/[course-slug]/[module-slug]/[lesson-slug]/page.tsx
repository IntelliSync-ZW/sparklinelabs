import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { fetchLearning } from "@/sanity/lib/fetch";
import { lessonPageQuery } from "@/lib/learning-queries/player";
import {
  firstIncompleteLesson,
  flattenCurriculum,
  isLessonUnlocked,
  lessonHref,
  type CurriculumModule,
} from "@/lib/learning/curriculum";
import { getCourseProgress, getLessonState } from "@/lib/learning/progress";
import { prepareLessonForClient } from "@/lib/learning/prepare";
import { LearnShell } from "@/components/learn/shell/learn-shell";
import { LessonView } from "@/components/learn/lesson/lesson-view";
import { LockedLesson } from "@/components/learn/lesson/locked-lesson";
import type {
  LessonLink,
  LessonViewData,
} from "@/components/learn/lesson/types";

// Depends on the signed-in learner (progress and unlocking), so it cannot be statically cached.
export const dynamic = "force-dynamic";

type Params = {
  "course-slug": string;
  "module-slug": string;
  "lesson-slug": string;
};

type LessonPageData = LessonViewData & {
  slug: string;
  status?: string | null;
  module: { _id: string; number: number; title: string; slug: string };
  course: {
    _id: string;
    title: string;
    slug: string;
    status?: string | null;
    modules: CurriculumModule[];
  };
  seo?: { title?: string; description?: string } | null;
};

async function loadLesson(params: Params) {
  const lesson = await fetchLearning<LessonPageData | null>(lessonPageQuery, {
    courseSlug: params["course-slug"],
    moduleSlug: params["module-slug"],
    lessonSlug: params["lesson-slug"],
  });
  if (!lesson) return null;

  // Drafts are only viewable while developing.
  const isDev = process.env.NODE_ENV === "development";
  if (
    !isDev &&
    (lesson.status !== "published" || lesson.course.status !== "published")
  )
    return null;
  return lesson;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = await params;
  const lesson = await loadLesson(resolved);
  if (!lesson) return {};

  const url = `https://www.sparklinelabs.co.zw/ai-training/${resolved["course-slug"]}/${resolved["module-slug"]}/${resolved["lesson-slug"]}`;
  const description =
    lesson.seo?.description ??
    lesson.summary ??
    `${lesson.title}, part of ${lesson.course.title}`;
  return {
    title: lesson.seo?.title ?? `${lesson.title} | ${lesson.course.title}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${lesson.title} | ${lesson.course.title}`,
      description,
      url,
    },
  };
}

/** schema.org duration, e.g. PT15M. */
function isoDuration(duration?: { value?: number; unit?: string } | null) {
  if (!duration?.value) return undefined;
  if (duration.unit === "hours") return `PT${duration.value}H`;
  if (duration.unit === "seconds") return `PT${duration.value}S`;
  return `PT${duration.value}M`;
}

const resourceTypes: Record<string, string> = {
  reading: "Reading",
  video: "Video",
  practice: "Exercise",
  quiz: "Quiz",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolved = await params;
  const lesson = await loadLesson(resolved);
  if (!lesson) notFound();

  const { userId } = await auth();
  const courseSlug = lesson.course.slug;
  const modules = lesson.course.modules;
  const flat = flattenCurriculum(modules);
  const index = flat.findIndex((l) => l._id === lesson._id);

  const progress = await getCourseProgress(userId, lesson.course._id);
  const completed = progress.completedLessonIds;

  // Strict ordering: lesson N opens only after lesson N-1 is complete. If the
  // database is unreachable we cannot verify, so we let signed-in learners read.
  // A lesson missing from the outline (an unpublished draft in dev) is never locked.
  const unlocked =
    index === -1 ||
    (userId
      ? progress.offline || isLessonUnlocked(flat, index, completed)
      : index === 0);

  const resumeLesson = firstIncompleteLesson(flat, completed);
  const resume: LessonLink | null = resumeLesson
    ? { href: lessonHref(courseSlug, resumeLesson), title: resumeLesson.title }
    : null;

  const lessonUrl = `https://www.sparklinelabs.co.zw/ai-training/${courseSlug}/${resolved["module-slug"]}/${lesson.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.summary ?? undefined,
    url: lessonUrl,
    inLanguage: "en",
    isAccessibleForFree: true,
    learningResourceType:
      resourceTypes[lesson.lessonType ?? "reading"] ?? "Reading",
    timeRequired: isoDuration(lesson.duration),
    position: index >= 0 ? index + 1 : undefined,
    teaches: lesson.learningOutcomes?.length
      ? lesson.learningOutcomes
      : undefined,
    isPartOf: {
      "@type": "Course",
      name: lesson.course.title,
      url: `https://www.sparklinelabs.co.zw/ai-training/${courseSlug}`,
      provider: {
        "@type": "Organization",
        name: "Sparkline Labs",
        url: "https://www.sparklinelabs.co.zw",
      },
    },
  };

  const shell = (children: React.ReactNode) => (
    <>
      {/* `<` is escaped so lesson text can never close the script tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LearnShell
        course={{ title: lesson.course.title, slug: courseSlug }}
        modules={modules}
        flat={flat}
        completed={completed}
        currentLessonId={lesson._id}
        progressPercent={progress.progressPercent}
      >
        {children}
      </LearnShell>
    </>
  );

  if (!unlocked) {
    return shell(
      <LockedLesson
        title={lesson.title}
        summary={lesson.summary}
        outcomes={lesson.learningOutcomes}
        signedIn={Boolean(userId)}
        resume={resume}
      />,
    );
  }

  const state = await getLessonState(userId, lesson.course._id, lesson._id);

  // Shuffle ordering and matching items on the server so the answer isn't in the page data.
  const prepared = prepareLessonForClient(lesson);

  const prevLesson = index > 0 ? flat[index - 1] : null;
  const nextLesson =
    index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;

  // Pass only what the page renders. Task and quiz data here has no answers in it.
  const view: LessonViewData = {
    _id: lesson._id,
    title: lesson.title,
    summary: lesson.summary,
    lessonType: lesson.lessonType,
    duration: lesson.duration,
    learningOutcomes: lesson.learningOutcomes,
    keyTakeaways: lesson.keyTakeaways,
    videoUrl: lesson.videoUrl,
    image: lesson.image,
    resources: lesson.resources,
    sources: lesson.sources,
    endAssessment: prepared.endAssessment,
    sections: (prepared.sections ?? []).map((s) => ({
      _key: s._key,
      title: s.title,
      sectionId: s.sectionId,
      estimatedMinutes: s.estimatedMinutes,
      content: s.content,
      practice: s.practice,
      check: s.check,
    })),
  };

  return shell(
    <LessonView
      lesson={view}
      moduleLabel={`Module ${lesson.module.number}: ${lesson.module.title}`}
      lessonNumber={index >= 0 ? index + 1 : 1}
      totalLessons={flat.length || 1}
      isSignedIn={Boolean(userId)}
      initialCompletedKeys={state.completedSectionKeys}
      initialGates={state.gates}
      previous={
        prevLesson
          ? {
              href: lessonHref(courseSlug, prevLesson),
              title: prevLesson.title,
            }
          : null
      }
      next={
        nextLesson
          ? {
              href: lessonHref(courseSlug, nextLesson),
              title: nextLesson.title,
            }
          : null
      }
      courseHref={`/ai-training/${courseSlug}`}
    />,
  );
}
