import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchLearning } from "@/sanity/lib/fetch";
import { courseBySlugQuery, allCourseSlugsQuery } from "@/sanity/lib/queries";
import {
  BookOpen,
  Clock,
  Award,
  Lock,
  CheckCircle,
  ChevronRight,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

type Lesson = {
  _id: string;
  title: string;
  slug: string;
  accessLevel?: string;
  duration?: { value: number; unit: string };
  summary?: string;
  image?: { url: string; alt?: string };
};

type Module = {
  _id: string;
  number: number;
  title: string;
  slug: string;
  description?: unknown[];
  lessons?: Lesson[];
  moduleAssessment?: { _id: string; title: string; passingScore: number };
};

type Course = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  accessLevel: string;
  shortDescription: string;
  description?: unknown[];
  level: string;
  durationMinutes?: number;
  outcomes?: string[];
  heroImage?: { url: string; alt?: string };
  certificate?: { enabled: boolean; priceUsd?: number; certificateTitle?: string };
  completionRules?: {
    minimumAssessmentScore?: number;
    allLessonsRequired?: boolean;
    allRequiredTasksPassed?: boolean;
  };
  modules?: Module[];
  seo?: { title?: string; description?: string; ogImage?: string };
};

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await fetchLearning<{ slug: string }[]>(allCourseSlugsQuery);
  return (slugs ?? []).map(({ slug }) => ({ "course-slug": slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "course-slug": string }>;
}): Promise<Metadata> {
  const { "course-slug": slug } = await params;
  const course = await fetchLearning<Course>(courseBySlugQuery, { slug });
  if (!course) return {};
  return {
    title: course.seo?.title ?? `${course.title} — AI Training | Sparkline Labs`,
    description:
      course.seo?.description ?? course.shortDescription,
    alternates: {
      canonical: `https://www.sparklinelabs.co.zw/ai-training/${slug}`,
    },
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      url: `https://www.sparklinelabs.co.zw/ai-training/${slug}`,
      images: course.seo?.ogImage ? [{ url: course.seo.ogImage }] : [],
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(value?: number, unit?: string) {
  if (!value) return null;
  if (unit === "hours") return `${value}h`;
  if (unit === "seconds") return `${value}s`;
  return `${value} min`;
}

function totalLessons(modules?: Module[]) {
  return (modules ?? []).reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0);
}

const levelLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ "course-slug": string }>;
}) {
  const { "course-slug": slug } = await params;
  const course = await fetchLearning<Course>(courseBySlugQuery, { slug });
  if (!course) notFound();

  const lessonCount = totalLessons(course.modules);
  const isFree = course.accessLevel === "free";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    url: `https://www.sparklinelabs.co.zw/ai-training/${slug}`,
    provider: {
      "@type": "Organization",
      name: "Sparkline Labs",
      url: "https://www.sparklinelabs.co.zw",
    },
    educationalLevel: levelLabel[course.level] ?? "Beginner",
    isAccessibleForFree: isFree,
    courseMode: ["self-paced", "online"],
    inLanguage: "en",
    hasCourseInstance: (course.modules ?? []).flatMap((mod) =>
      (mod.lessons ?? []).map((lesson) => ({
        "@type": "CourseInstance",
        name: lesson.title,
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 border-b border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/ai-training" className="hover:text-foreground transition-colors">
                  AI Training
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="text-foreground">{course.title}</span>
              </nav>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                    isFree
                      ? "bg-accent/15 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isFree ? <BookOpen className="size-3" /> : <Lock className="size-3" />}
                  {isFree ? "Free" : "Paid"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                  <BarChart3 className="size-3" />
                  {levelLabel[course.level] ?? "Beginner"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                  <BookOpen className="size-3" />
                  {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                </span>
                {course.durationMinutes && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                    <Clock className="size-3" />
                    {course.durationMinutes} min
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                {course.shortDescription}
              </p>

              {/* Primary CTA */}
              {course.modules?.[0]?.slug && (
                <Button
                  size="lg"
                  className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90"
                  asChild
                >
                  <Link href={`/ai-training/${slug}/${course.modules[0].slug}`} id="course-start-cta">
                    Start Course
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Hero image or placeholder */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-secondary border border-border">
              {course.heroImage?.url ? (
                <Image
                  src={course.heroImage.url}
                  alt={course.heroImage.alt ?? course.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="size-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── What You'll Learn ─────────────────────────────────────────────── */}
      {course.outcomes && course.outcomes.length > 0 && (
        <section className="py-20 px-6 bg-secondary">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight mb-10">What you will learn</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {course.outcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-base text-muted-foreground leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Course Modules & Lessons ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Course Modules</h2>
          <p className="text-muted-foreground mb-12 text-lg">
            {course.modules?.length ?? 0} module{(course.modules?.length ?? 0) !== 1 ? "s" : ""} ·{" "}
            {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
          </p>

          <div className="space-y-4">
            {(course.modules ?? []).map((mod) => (
              <div
                key={mod._id}
                className="border border-border rounded-2xl overflow-hidden"
              >
                {/* Module header — links to the module/lesson player */}
                <Link
                  href={`/ai-training/${slug}/${mod.slug}`}
                  className="flex items-center justify-between p-6 bg-secondary hover:bg-secondary/80 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center size-10 rounded-full bg-accent/10 text-accent font-semibold text-sm shrink-0">
                      {mod.number}
                    </span>
                    <div>
                      <p className="font-semibold text-lg leading-tight group-hover:text-accent transition-colors">
                        {mod.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mod.lessons?.length ?? 0} lesson{(mod.lessons?.length ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </Link>

                {/* Lesson list preview */}
                {mod.lessons && mod.lessons.length > 0 && (
                  <ul className="divide-y divide-border">
                    {mod.lessons.map((lesson, li) => {
                      const dur = formatDuration(lesson.duration?.value, lesson.duration?.unit);
                      const isLocked = lesson.accessLevel === "paid" && !isFree;
                      return (
                        <li key={lesson._id}>
                          <Link
                            href={isLocked ? "#" : `/ai-training/${slug}/${mod.slug}#${lesson.slug}`}
                            className={`flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors ${
                              isLocked ? "opacity-60 cursor-not-allowed pointer-events-none" : ""
                            }`}
                            tabIndex={isLocked ? -1 : undefined}
                            aria-disabled={isLocked}
                          >
                            <span className="size-7 flex items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground shrink-0">
                              {li + 1}
                            </span>
                            <span className="flex-1 text-sm leading-snug">{lesson.title}</span>
                            <span className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                              {dur && <><Clock className="size-3.5" /> {dur}</>}
                              {isLocked && <Lock className="size-3.5 ml-1" />}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certificate ───────────────────────────────────────────────────── */}
      {course.certificate?.enabled && (
        <section className="py-20 px-6 bg-secondary">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-accent/10 mb-6">
              <Award className="size-8 text-accent" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              {course.certificate.certificateTitle ?? "Certificate of Completion"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Complete all modules and assessments to earn your verifiable certificate.
              {course.certificate.priceUsd && course.certificate.priceUsd > 0
                ? ` Certificate issuance costs $${course.certificate.priceUsd} USD.`
                : " Free to download."}
            </p>
            {course.modules?.[0]?.slug && (
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href={`/ai-training/${slug}/${course.modules[0].slug}`}>
                  <Users className="mr-2 size-5" /> Start learning
                </Link>
              </Button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
