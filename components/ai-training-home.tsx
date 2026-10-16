import Link from "next/link";
import { ArrowRight, Award, BookOpen, Clock, ListChecks } from "lucide-react";
import { fetchLearning } from "@/sanity/lib/fetch";
import { freeCourseOverviewQuery } from "@/sanity/lib/queries";
import { isCoursePublished, type FreeCourseOverview } from "@/components/ai-training/featured-course";

/**
 * Homepage teaser for the free AI course. Reads the course from the CMS so the
 * lesson count, launch state and certificate always match the course itself.
 */
export async function AiTrainingHome() {
  const course = await fetchLearning<FreeCourseOverview | null>(freeCourseOverviewQuery).catch(() => null);
  const published = isCoursePublished(course);
  const modules = course?.modules ?? [];
  const lessons = !published ? 0 : modules.reduce((n, m) => n + m.lessonCount, 0);

  const facts = [
    {
      Icon: BookOpen,
      label: published ? "Free course" : "Free course, coming soon",
      detail: course?.title || "Sparkline AI Foundations",
    },
    {
      Icon: Clock,
      label: "Self-paced",
      detail:
        lessons > 0
          ? `${lessons} lesson${lessons === 1 ? "" : "s"} in ${modules.length} module${modules.length === 1 ? "" : "s"}`
          : "Learn at your own pace",
    },
    { Icon: ListChecks, label: "Practical assessments", detail: "Each lesson ends with one you must pass" },
    ...(course?.certificateEnabled
      ? [{ Icon: Award, label: "Certificate", detail: "Verifiable by its number" }]
      : []),
  ];

  return (
    <section className="py-20 md:py-32 px-6 bg-secondary" aria-labelledby="home-ai-training">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">AI Training</p>
            <h2
              id="home-ai-training"
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-balance"
            >
              Free AI training for Zimbabwe.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Learn to use ChatGPT and Gemini for research, writing and everyday work, and to check what they tell you
              before you rely on it. Free, self-paced, and built around how people actually work in Zimbabwe.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {published ? (
                <Link
                  href={`/ai-training/${course.slug}`}
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Start the free course
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <Link
                  href="/ai-training#free-course"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  <Clock className="size-4" /> Get notified at launch
                </Link>
              )}
              <Link
                href="/ai-training"
                className="inline-flex items-center gap-2 text-base font-medium text-accent hover:underline"
              >
                Explore AI Training
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {facts.map(({ Icon, label, detail }) => (
                <div key={label} className="p-5 border border-border rounded-xl bg-background">
                  <Icon className="size-5 text-accent mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">{label}</p>
                  <p className="text-base font-medium leading-snug">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Same footprint as the section, shown while the course loads. */
export function AiTrainingHomeSkeleton() {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary" aria-hidden="true">
      <div className="container mx-auto grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-7 space-y-6">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-14 w-4/5 rounded bg-muted" />
          <div className="h-20 w-full rounded bg-muted" />
        </div>
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </section>
  );
}
