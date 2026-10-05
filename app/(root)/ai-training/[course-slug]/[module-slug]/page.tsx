import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchLearning } from "@/sanity/lib/fetch";
import { moduleWithLessonsBySlugQuery } from "@/sanity/lib/queries";
import { ModuleLessonPlayer } from "@/components/ai-training/module-lesson-player";

// ─── Types (minimal — full type lives in the client component) ────────────────

type ModuleSlim = {
  _id: string;
  title: string;
  slug: string;
  number: number;
  course?: {
    title?: string;
    slug?: string;
  };
};

// ─── Static Params ────────────────────────────────────────────────────────────

// Opt in to dynamic rendering so slugs don't have to be pre-enumerated.
// For ISR, swap to generateStaticParams once data is stable.
export const dynamic = "force-dynamic";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "course-slug": string; "module-slug": string }>;
}): Promise<Metadata> {
  const { "course-slug": courseSlug, "module-slug": moduleSlug } = await params;
  const mod = await fetchLearning<ModuleSlim>(moduleWithLessonsBySlugQuery, {
    courseSlug,
    moduleSlug,
  });

  if (!mod) return {};

  const courseTitle = mod.course?.title ?? "AI Training";
  const courseSlugVal = mod.course?.slug ?? courseSlug;

  return {
    title: `${mod.title} — ${courseTitle} | Sparkline Labs`,
    description: `Study module ${mod.number} of ${courseTitle}. All lessons in one place.`,
    alternates: {
      canonical: `https://www.sparklinelabs.co.zw/ai-training/${courseSlugVal}/${moduleSlug}`,
    },
    openGraph: {
      title: `${mod.title} — ${courseTitle}`,
      description: `Module ${mod.number} of ${courseTitle}.`,
      url: `https://www.sparklinelabs.co.zw/ai-training/${courseSlugVal}/${moduleSlug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ModulePage({
  params,
}: {
  params: Promise<{ "course-slug": string; "module-slug": string }>;
}) {
  const { "course-slug": courseSlug, "module-slug": moduleSlug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = await fetchLearning<any>(moduleWithLessonsBySlugQuery, {
    courseSlug,
    moduleSlug,
  });

  if (!mod) notFound();

  return (
    <ModuleLessonPlayer module={mod} courseSlug={courseSlug} />
  );
}
