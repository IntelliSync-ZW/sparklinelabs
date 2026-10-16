import Link from "next/link";
import { Award, BarChart3, BookOpen, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { CourseInterestPanel } from "./course-interest-panel";
import { FALLBACK_COURSE_DESCRIPTION, FALLBACK_COURSE_OUTCOMES, FALLBACK_COURSE_TITLE } from "@/lib/learning/fallbacks";

export type ComingSoonCourse = {
  _id: string;
  title?: string | null;
  shortDescription?: string | null;
  level?: string | null;
  durationMinutes?: number | null;
  outcomes?: string[] | null;
  accessLevel?: string | null;
  certificate?: { enabled?: boolean | null } | null;
};

const levelLabel: Record<string, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

/**
 * What /ai-training/<course> shows until the course is published: the course
 * itself and the "notify me" sign-up. Modules and lessons are never listed.
 */
export function CourseComingSoon({ course }: { course: ComingSoonCourse }) {
  const title = course.title?.trim() || FALLBACK_COURSE_TITLE;
  const description = course.shortDescription?.trim() || FALLBACK_COURSE_DESCRIPTION;
  const outcomes = course.outcomes?.filter(Boolean).length ? course.outcomes.filter(Boolean) : FALLBACK_COURSE_OUTCOMES;
  const isPaid = course.accessLevel === "paid";

  return (
    <>
      <section className="py-20 md:py-32 px-6 border-b border-border">
        <div className="container mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/ai-training" className="hover:text-foreground transition-colors">
              AI Training
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">{title}</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-background border border-border text-muted-foreground">
              <Clock className="size-3" /> Coming soon
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-accent/15 text-accent">
              <BookOpen className="size-3" /> {isPaid ? "Paid" : "Free"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground">
              <BarChart3 className="size-3" /> {levelLabel[course.level ?? ""] ?? "Beginner"}
            </span>
            {course.durationMinutes ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                <Clock className="size-3" /> {course.durationMinutes} min
              </span>
            ) : null}
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-balance">{title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-10">{description}</p>

          <div className="rounded-2xl border border-border bg-secondary p-6 md:p-8">
            <p className="mb-5 text-base text-muted-foreground">
              We&apos;re finishing the lessons and practice tasks. Register your interest and we&apos;ll tell you the day it opens.
            </p>
            <CourseInterestPanel courseId={course._id} />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">What you&apos;ll learn</h2>
          <ul className="space-y-3">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg text-muted-foreground">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>

          {course.certificate?.enabled && (
            <p className="mt-10 flex items-start gap-3 rounded-xl border border-border p-5 text-muted-foreground">
              <Award className="mt-0.5 size-5 shrink-0 text-accent" />
              <span>
                Finish the course and you can claim a verifiable <strong className="text-foreground">Certificate of Completion</strong>.
                It is a record of your learning, not an accreditation.
              </span>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
