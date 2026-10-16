import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FALLBACK_COURSE_DESCRIPTION, FALLBACK_COURSE_TITLE } from "@/lib/learning/fallbacks";
import { CourseInterestPanel } from "./course-interest-panel";
import { BookOpen, CheckCircle, ArrowRight, Clock } from "lucide-react";

export type FreeCourseOverview = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  shortDescription?: string;
  level?: string;
  durationMinutes?: number;
  certificateEnabled?: boolean;
  whatsappGroupUrl?: string;
  modules?: {
    _id: string;
    number: number;
    title: string;
    slug: string;
    description?: string;
    lessonCount: number;
  }[];
};

const levelLabel: Record<string, string> = {
  beginner: "Beginner level",
  intermediate: "Intermediate level",
  advanced: "Advanced level",
};

export function isCoursePublished(course: FreeCourseOverview | null): course is FreeCourseOverview {
  return course?.status === "published";
}

export async function FeaturedCourse({ course }: { course: FreeCourseOverview | null }) {
  const published = isCoursePublished(course);
  const courseId = course?._id;
  // Lessons are only counted once the course is live.
  const lessonCount = !published ? 0 : (course?.modules ?? []).reduce((n, m) => n + m.lessonCount, 0);

  const features = [
    "Free",
    levelLabel[course?.level ?? "beginner"],
    "Self-paced",
    lessonCount > 0 ? `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}` : null,
    "Practical assessments",
    course?.certificateEnabled ? "Certificate of Completion available" : null,
  ].filter(Boolean) as string[];

  return (
    <section className="py-20 md:py-32 px-6" id="free-course">
      <div className="container mx-auto">
        <div className="mb-12">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Featured Course
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            {published ? "The free course to start with." : "The free course is almost ready."}
          </h2>
        </div>

        <div className="bg-secondary border border-border rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              {published ? (
                <div className="inline-flex items-center gap-2 text-sm font-medium text-accent bg-accent/10 rounded-full px-4 py-1.5 mb-6">
                  <BookOpen className="size-4" />
                  Free Course
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-full px-4 py-1.5 mb-6">
                  <Clock className="size-4" />
                  Coming soon
                </div>
              )}
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                {course?.title || FALLBACK_COURSE_TITLE}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {course?.shortDescription || FALLBACK_COURSE_DESCRIPTION}
              </p>

              {published ? (
                <Button
                  size="lg"
                  className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90"
                  asChild
                >
                  <Link href={`/ai-training/${course.slug}`}>
                    Start Free Course
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <div className="space-y-5">
                  <p className="text-base text-muted-foreground">
                    We&apos;re finishing the lessons and practice tasks. It will be free when it launches.
                  </p>
                  {courseId && <CourseInterestPanel courseId={courseId} />}
                </div>
              )}
            </div>

            <div>
              <ul className="space-y-4">
                {features.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className={`size-5 shrink-0 ${published ? "text-accent" : "text-muted-foreground"}`} />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
